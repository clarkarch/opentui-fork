//! Kitty graphics bridging for the embedded terminal.
//!
//! The VT (ghostty lib-vt) parses the kitty graphics protocol and stores the
//! transmitted images and their placements in `Screen.kitty_images`, but the
//! cell compositor never looked at them, so a program running inside the
//! embedded terminal could never show a picture. This module turns those
//! stored placements into OpenTUI image placements on the pane buffer.
//!
//! Two things are needed for that:
//!
//! 1. A PNG decoder. libghostty-vt is built as the `lib` artifact, which
//!    leaves `sys.decode_png` unset, so PNG transmissions were rejected before
//!    they were ever stored. OpenTUI already links a wuffs PNG decoder for its
//!    own image pipeline, so the VT is pointed at that decoder instead.
//! 2. Cell pixel geometry. Kitty placements are sized in pixels and the VT
//!    converts them to cells with the terminal's pixel size, which the embedder
//!    has to supply because the pane is only a window into the host terminal.

const std = @import("std");
const buffer = @import("../buffer.zig");
const native_image = @import("../image.zig");
const ghostty = @import("ghostty.zig");
const log = @import("../logger.zig");

/// Cell pixel geometry. Used to convert kitty pixel sizes into grid cells and
/// to tell the host terminal how many pixels a placement covers.
pub const CellSize = struct {
    width: u32 = 8,
    height: u32 = 16,

    /// The nominal cell size for a host that does not report its pixel size.
    ///
    /// A zero size is never usable: the VT divides the pixel size by the cell
    /// size to measure a placement, and a zero divisor would make the
    /// measurement meaningless.
    pub fn sanitize(self: CellSize) CellSize {
        return .{
            .width = if (self.width == 0) 8 else self.width,
            .height = if (self.height == 0) 16 else self.height,
        };
    }
};

const png_status_ok = 0;
/// Kitty's own limit for a single image payload.
const max_png_bytes = 400 * 1024 * 1024;

extern fn ot_image_png_probe(data: [*]const u8, data_len: u32, width: *u32, height: *u32) c_int;
extern fn ot_image_png_decode(
    data: [*]const u8,
    data_len: u32,
    output: [*]u8,
    output_len: u64,
    expected_width: u32,
    expected_height: u32,
) c_int;

/// Decode PNG data into straight RGBA pixels for the VT's kitty storage.
fn decodePngForVt(allocator: std.mem.Allocator, data: []const u8) ghostty.sys.DecodeError!ghostty.sys.Image {
    if (data.len == 0 or data.len > std.math.maxInt(u32)) return error.InvalidData;
    var width: u32 = 0;
    var height: u32 = 0;
    if (ot_image_png_probe(data.ptr, @intCast(data.len), &width, &height) != png_status_ok) return error.InvalidData;
    if (width == 0 or height == 0) return error.InvalidData;
    const pixel_count = std.math.mul(u64, width, height) catch return error.InvalidData;
    const byte_count = std.math.mul(u64, pixel_count, 4) catch return error.InvalidData;
    if (byte_count == 0 or byte_count > max_png_bytes) return error.InvalidData;
    const pixels = try allocator.alloc(u8, @intCast(byte_count));
    errdefer allocator.free(pixels);
    if (ot_image_png_decode(data.ptr, @intCast(data.len), pixels.ptr, byte_count, width, height) != png_status_ok) {
        return error.InvalidData;
    }
    return .{ .width = width, .height = height, .data = pixels };
}

var png_decoder_installed = false;

/// Installs OpenTUI's PNG decoder into the VT.
///
/// Idempotent: the VT module is process global, so the decoder is installed
/// once no matter how many embedded terminals exist.
pub fn installPngDecoder() void {
    if (png_decoder_installed) return;
    png_decoder_installed = true;
    ghostty.sys.decode_png = &decodePngForVt;
}

/// A decoded kitty image, ready to be placed into a buffer.
const Decoded = struct {
    /// The VT's content generation for the source image. A new generation
    /// means new pixels.
    generation: u64,
    /// Stable identity for the decoded image. The renderer compares it across
    /// frames to decide whether an image has to be transmitted again, so it
    /// must stay the same while the pixels stay the same.
    handle: u32,
    image: *native_image.Image,
    width: u32,
    height: u32,
};

/// Decoded kitty images, keyed by the VT image id.
pub const ImageCache = struct {
    allocator: std.mem.Allocator,
    entries: std.AutoHashMapUnmanaged(u32, Decoded) = .empty,
    next_handle: u32 = 1,

    pub fn deinit(self: *ImageCache) void {
        var it = self.entries.valueIterator();
        while (it.next()) |entry| entry.image.deinit();
        self.entries.deinit(self.allocator);
    }

    /// Returns the decoded image for a VT image, decoding it on demand.
    ///
    /// Returns null when the image has no usable pixels yet (still loading) or
    /// when it cannot be represented. Only an allocation failure is fatal.
    fn resolve(self: *ImageCache, id: u32, source: ghostty.kitty.graphics.Image, owner_context_id: u64) !?Decoded {
        if (self.entries.get(id)) |existing| {
            if (existing.generation == source.generation and existing.image.owner_context_id == owner_context_id) {
                return existing;
            }
            existing.image.deinit();
            _ = self.entries.remove(id);
        }

        const bytes = source.data.bytes() orelse return null;
        if (bytes.len == 0) return null;
        const width = source.width;
        const height = source.height;
        if (width == 0 or height == 0) return null;

        var scratch: ?[]u8 = null;
        defer if (scratch) |owned| self.allocator.free(owned);
        const rgba: []const u8 = switch (source.format) {
            .rgba => bytes,
            .rgb => blk: {
                const expanded = self.expandRgb(bytes, width, height) catch |err| switch (err) {
                    error.OutOfMemory => return error.OutOfMemory,
                    error.InvalidData => return null,
                };
                scratch = expanded;
                break :blk expanded;
            },
            else => return null,
        };

        const stride = std.math.mul(u32, width, 4) catch return null;
        const image = native_image.createFromPixels(self.allocator, rgba, width, height, .{ .stride = stride }) catch |err| switch (err) {
            error.OutOfMemory => return error.OutOfMemory,
            else => return null,
        };
        errdefer image.deinit();
        // The image belongs to the context that owns the pane buffer, so the
        // buffer's resource check accepts it.
        image.owner_context_id = owner_context_id;

        const handle = self.next_handle;
        self.next_handle +%= 1;
        if (self.next_handle == 0) self.next_handle = 1;

        const decoded: Decoded = .{
            .generation = source.generation,
            .handle = handle,
            .image = image,
            .width = width,
            .height = height,
        };
        try self.entries.put(self.allocator, id, decoded);
        return decoded;
    }

    /// Expands 24 bit RGB pixels into straight RGBA.
    fn expandRgb(self: *ImageCache, bytes: []const u8, width: u32, height: u32) ![]u8 {
        const count = std.math.mul(u32, width, height) catch return error.InvalidData;
        const needed = std.math.mul(u32, count, 4) catch return error.InvalidData;
        if (bytes.len < needed / 4 * 3) return error.InvalidData;
        const out = try self.allocator.alloc(u8, needed);
        errdefer self.allocator.free(out);
        var i: u32 = 0;
        while (i < count) : (i += 1) {
            const src = i * 3;
            const dst = i * 4;
            out[dst] = bytes[src];
            out[dst + 1] = bytes[src + 1];
            out[dst + 2] = bytes[src + 2];
            out[dst + 3] = 255;
        }
        return out;
    }

    /// Drops cached images the VT no longer knows about.
    fn prune(self: *ImageCache, terminal: *ghostty.Terminal) void {
        const storage = &terminal.screens.active.kitty_images;
        var it = self.entries.iterator();
        while (it.next()) |entry| {
            const source = storage.imageById(entry.key_ptr.*) orelse {
                entry.value_ptr.image.deinit();
                _ = self.entries.remove(entry.key_ptr.*);
                continue;
            };
            // The VT replaced the pixels without bumping the id: the
            // generation is what tracks the content.
            if (source.generation != entry.value_ptr.generation) {
                entry.value_ptr.image.deinit();
                _ = self.entries.remove(entry.key_ptr.*);
            }
        }
    }
};

/// One placement, flattened for a deterministic draw order.
const Ordered = struct {
    z: i32,
    image_id: u32,
    placement_id: u32,
    placement: ghostty.kitty.graphics.ImageStorage.Placement,
    /// Set for a relative placement whose parent chain roots at a pinned
    /// placement: the root's viewport position plus the chain's cell offsets.
    /// Null for an absolute placement.
    relative: ?RelativeOrigin = null,
};

/// The resolved origin of a relative placement: where its parent chain
/// roots, and how far the placement sits from that root in cells.
const RelativeOrigin = struct {
    x: i64,
    y: i64,
    horizontal_offset: i32,
    vertical_offset: i32,
};

/// A relative placement whose parent chain roots at a virtual (placeholder)
/// placement. Its origin is only known once the placeholder cells are found,
/// so the virtual pass draws it.
const PendingRelative = struct {
    image_id: u32,
    placement: ghostty.kitty.graphics.ImageStorage.Placement,
    root_key: ghostty.kitty.graphics.ImageStorage.PlacementKey,
    horizontal_offset: i32,
    vertical_offset: i32,
};

fn orderLessThan(_: void, lhs: Ordered, rhs: Ordered) bool {
    if (lhs.z != rhs.z) return lhs.z < rhs.z;
    if (lhs.image_id != rhs.image_id) return lhs.image_id < rhs.image_id;
    return lhs.placement_id < rhs.placement_id;
}

/// The rows a *virtual* (unicode-placeholder) placement was drawn into.
///
/// A virtual placement is anchored to cells rather than to a screen position, so
/// a program moves or clears it by writing text. That dirties rows without
/// touching the image storage, and the caller needs to know which rows to watch
/// or it keeps showing the picture after the program cleared it.
pub const VirtualRows = struct {
    lo: u32 = std.math.maxInt(u32),
    hi: u32 = 0,

    pub fn isEmpty(self: VirtualRows) bool {
        return self.lo > self.hi;
    }

    pub fn covers(self: VirtualRows, y: u32) bool {
        return !self.isEmpty() and y >= self.lo and y <= self.hi;
    }

    fn add(self: *VirtualRows, y: u32, height: u32) void {
        if (height == 0) return;
        self.lo = @min(self.lo, y);
        self.hi = @max(self.hi, y + height - 1);
    }
};

/// Draws the VT's kitty image placements into the pane buffer.
///
/// The placements are drawn in a stable order (z, image id, placement id) so
/// the buffer's placement ids stay stable across frames: the renderer matches
/// them against the previous frame to avoid retransmitting unchanged images.
pub fn composeImages(
    cache: *ImageCache,
    terminal: *ghostty.Terminal,
    target: *buffer.OptimizedBuffer,
    origin_x: i32,
    origin_y: i32,
    cell: CellSize,
    allocator: std.mem.Allocator,
    virtual_rows: *VirtualRows,
    skip_virtual: bool,
) !void {
    const storage = &terminal.screens.active.kitty_images;
    cache.prune(terminal);

    var ordered: std.ArrayListUnmanaged(Ordered) = .empty;
    defer ordered.deinit(allocator);

    // Relative placements whose parent chain roots at a placeholder cell:
    // their origin is only known after the placeholder scan, so the virtual
    // pass draws them.
    var pending_relative: std.ArrayListUnmanaged(PendingRelative) = .empty;
    defer pending_relative.deinit(allocator);

    var it = storage.placements.iterator();
    while (it.next()) |kv| {
        // Virtual placements are the unicode placeholder protocol: the image
        // is anchored to a cell's codepoint, not to a screen position. They
        // are drawn by the virtual pass, not here.
        //
        // Relative placements (kitty's P=/Q= parent protocol) have no screen
        // position of their own: they follow their parent.
        var relative: ?RelativeOrigin = null;
        switch (kv.value_ptr.location) {
            .pin => {},
            .virtual => continue,
            .relative => |rel| {
                const chain = storage.resolveChain(rel) orelse continue;
                switch (chain.root.location) {
                    .pin => |root_pin| {
                        const root = terminal.screens.active.pages.pointFromPin(.viewport, root_pin.*) orelse continue;
                        relative = .{
                            .x = root.viewport.x,
                            .y = root.viewport.y,
                            .horizontal_offset = chain.horizontal_offset,
                            .vertical_offset = chain.vertical_offset,
                        };
                    },
                    .virtual => {
                        try pending_relative.append(allocator, .{
                            .image_id = kv.key_ptr.image_id,
                            .placement = kv.value_ptr.*,
                            .root_key = chain.root_key,
                            .horizontal_offset = chain.horizontal_offset,
                            .vertical_offset = chain.vertical_offset,
                        });
                        continue;
                    },
                    // A chain root is never relative.
                    .relative => unreachable,
                }
            },
        }
        try ordered.append(allocator, .{
            .z = kv.value_ptr.z,
            .image_id = kv.key_ptr.image_id,
            .placement_id = kv.key_ptr.placement_id.id,
            .placement = kv.value_ptr.*,
            .relative = relative,
        });
    }
    std.mem.sortUnstable(Ordered, ordered.items, {}, orderLessThan);

    for (ordered.items) |entry| {
        const source = storage.imageById(entry.image_id) orelse continue;
        if (source.data.isPending()) continue;
        const decoded = (try cache.resolve(entry.image_id, source, target.owner_context_id)) orelse continue;

        var x: i64 = 0;
        var y: i64 = 0;
        var width: u32 = 0;
        var height: u32 = 0;
        if (entry.relative) |rel| {
            // A relative placement is sized by its own grid size and sits at
            // the root's origin plus the chain's cell offsets.
            const grid = entry.placement.gridSize(source, terminal);
            if (grid.cols == 0 or grid.rows == 0) continue;
            width = grid.cols;
            height = grid.rows;
            x = @as(i64, rel.x) + rel.horizontal_offset;
            y = @as(i64, rel.y) + rel.vertical_offset;
            if (y >= terminal.rows or y + @as(i64, height) - 1 < 0) continue;
            if (x >= terminal.cols or x + @as(i64, width) - 1 < 0) continue;
        } else {
            const rect = entry.placement.rect(source, terminal) orelse continue;
            const top_left = terminal.screens.active.pages.pointFromPin(.viewport, rect.top_left) orelse continue;
            const bottom_right = terminal.screens.active.pages.pointFromPin(.viewport, rect.bottom_right) orelse continue;

            x = top_left.viewport.x;
            y = top_left.viewport.y;
            if (bottom_right.viewport.x < x or bottom_right.viewport.y < y) continue;
            width = @intCast(bottom_right.viewport.x - x + 1);
            height = @intCast(bottom_right.viewport.y - y + 1);
        }
        if (width == 0 or height == 0) continue;

        const source_x = @min(source.width, entry.placement.source_x);
        const source_y = @min(source.height, entry.placement.source_y);
        const source_width = if (entry.placement.source_width > 0)
            @min(source.width - source_x, entry.placement.source_width)
        else
            source.width;
        const source_height = if (entry.placement.source_height > 0)
            @min(source.height - source_y, entry.placement.source_height)
        else
            source.height;
        if (source_width == 0 or source_height == 0) continue;

        try drawPlacement(
            target,
            origin_x,
            origin_y,
            cell,
            decoded,
            x,
            y,
            width,
            height,
            source_x,
            source_y,
            source_width,
            source_height,
        );
    }

    if (skip_virtual) {
        // Nothing was drawn, so nothing is left to watch: keep the pane from
        // replotting on every later text change.
        virtual_rows.* = .{};
        return;
    }
    try composeVirtualPlacements(
        cache,
        terminal,
        target,
        origin_x,
        origin_y,
        cell,
        virtual_rows,
        pending_relative.items,
    );
}

/// Draws one placement into the pane buffer.
///
/// A placement that cannot be drawn is skipped: one broken image must not
/// take the whole pane down.
fn drawPlacement(
    target: *buffer.OptimizedBuffer,
    origin_x: i32,
    origin_y: i32,
    cell: CellSize,
    decoded: Decoded,
    x: i64,
    y: i64,
    width: u32,
    height: u32,
    source_x: u32,
    source_y: u32,
    source_width: u32,
    source_height: u32,
) !void {
    if (width == 0 or height == 0) return;
    const pixel_width = std.math.mul(u32, width, cell.width) catch 0;
    const pixel_height = std.math.mul(u32, height, cell.height) catch 0;

    _ = target.drawImage(
        decoded.image,
        decoded.handle,
        origin_x + @as(i32, @intCast(x)),
        origin_y + @as(i32, @intCast(y)),
        width,
        height,
        pixel_width,
        pixel_height,
        source_x,
        source_y,
        source_width,
        source_height,
        .auto,
    ) catch |err| switch (err) {
        error.OutOfMemory => return error.OutOfMemory,
        else => return,
    };
}

/// Draws the placements that use the kitty unicode placeholder protocol.
///
/// The image is anchored to a placeholder character in a cell instead of a
/// screen position, so the cells themselves carry the placement and it scrolls
/// with the text. A pane that only understands positioned placements shows
/// those cells as blank placeholders.
///
/// A relative placement rooted at a placeholder cell is drawn here too: its
/// origin is the placeholder's cell plus the chain's offsets, and that is
/// only known once the placeholders are found.
fn composeVirtualPlacements(
    cache: *ImageCache,
    terminal: *ghostty.Terminal,
    target: *buffer.OptimizedBuffer,
    origin_x: i32,
    origin_y: i32,
    cell: CellSize,
    virtual_rows: *VirtualRows,
    pending_relative: []const PendingRelative,
) !void {
    const storage = &terminal.screens.active.kitty_images;
    const pages = &terminal.screens.active.pages;
    const top = pages.getTopLeft(.viewport);
    const bottom = pages.getBottomRight(.viewport) orelse return;

    // The origin of every placeholder placement, in viewport coordinates:
    // the minimum cell of its placeholder run. Kitty positions a relative
    // placement rooted at a placeholder there.
    var virtual_origins: std.AutoHashMapUnmanaged(
        ghostty.kitty.graphics.ImageStorage.PlacementKey,
        struct { x: u32, y: u32 },
    ) = .empty;
    defer virtual_origins.deinit(cache.allocator);

    var it = ghostty.kitty.graphics.unicode.placementIterator(top, bottom);
    while (it.next()) |placement| {
        const source = storage.imageById(placement.image_id) orelse continue;
        if (source.data.isPending()) continue;
        const decoded = (try cache.resolve(placement.image_id, source, target.owner_context_id)) orelse continue;

        const render = placement.renderPlacement(storage, &source, cell.width, cell.height) catch continue;
        const viewport = pages.pointFromPin(.viewport, render.top_left) orelse continue;
        const x = viewport.viewport.x;
        const y = viewport.viewport.y;
        const width = placement.width;
        const height = placement.height;
        if (width == 0 or height == 0) continue;

        const source_x = render.source_x;
        const source_y = render.source_y;
        const source_width = @max(1, render.source_width);
        const source_height = @max(1, render.source_height);
        if (source_x >= source.width or source_y >= source.height) continue;
        if (source_width > source.width - source_x or source_height > source.height - source_y) continue;

        try drawPlacement(
            target,
            origin_x,
            origin_y,
            cell,
            decoded,
            x,
            y,
            width,
            height,
            source_x,
            source_y,
            source_width,
            source_height,
        );
        virtual_rows.add(y, height);

        // Track the placeholder's origin for the relative placements rooted
        // at it.
        if (pending_relative.len == 0) continue;
        track: {
            const placeholder = storage.placeholderTarget(placement.image_id, placement.placement_id) orelse break :track;
            const origin = pages.pointFromPin(.viewport, placement.pin) orelse break :track;
            const gop = virtual_origins.getOrPut(cache.allocator, placeholder.key) catch break :track;
            if (!gop.found_existing) {
                gop.value_ptr.* = .{ .x = origin.viewport.x, .y = origin.viewport.y };
            } else {
                gop.value_ptr.x = @min(gop.value_ptr.x, origin.viewport.x);
                gop.value_ptr.y = @min(gop.value_ptr.y, origin.viewport.y);
            }
        }
    }

    // Position the relative placements rooted at placeholder cells now that
    // the cells are known. A root with no placeholder on screen leaves its
    // relative placements undrawn, matching kitty.
    for (pending_relative) |pr| {
        const origin = virtual_origins.get(pr.root_key) orelse continue;
        const source = storage.imageById(pr.image_id) orelse continue;
        if (source.data.isPending()) continue;
        const decoded = (try cache.resolve(pr.image_id, source, target.owner_context_id)) orelse continue;

        const grid = pr.placement.gridSize(source, terminal);
        if (grid.cols == 0 or grid.rows == 0) continue;
        const x: i64 = @as(i64, origin.x) + pr.horizontal_offset;
        const y: i64 = @as(i64, origin.y) + pr.vertical_offset;
        if (y >= terminal.rows or y + @as(i64, grid.rows) - 1 < 0) continue;
        if (x >= terminal.cols or x + @as(i64, grid.cols) - 1 < 0) continue;

        const source_x = @min(source.width, pr.placement.source_x);
        const source_y = @min(source.height, pr.placement.source_y);
        const source_width = if (pr.placement.source_width > 0)
            @min(source.width - source_x, pr.placement.source_width)
        else
            source.width;
        const source_height = if (pr.placement.source_height > 0)
            @min(source.height - source_y, pr.placement.source_height)
        else
            source.height;
        if (source_width == 0 or source_height == 0) continue;

        try drawPlacement(
            target,
            origin_x,
            origin_y,
            cell,
            decoded,
            x,
            y,
            grid.cols,
            grid.rows,
            source_x,
            source_y,
            source_width,
            source_height,
        );
    }
}
