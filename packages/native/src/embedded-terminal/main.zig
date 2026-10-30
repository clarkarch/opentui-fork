const std = @import("std");
const buffer = @import("../buffer.zig");
const compositor = @import("compositor.zig");
const graphics = @import("graphics.zig");
const ghostty = @import("ghostty.zig");
const log = @import("../logger.zig");
const kitty_delete = @import("kitty_delete.zig");

pub const Error = error{
    InvalidValue,
    ProcessingFailed,
    ResponseOverflow,
} || compositor.Error;

/// Cell pixel geometry of the host terminal.
pub const CellSize = graphics.CellSize;

pub const Cursor = struct {
    x: u16 = 0,
    y: u16 = 0,
    has_value: bool = false,
    visible: bool = false,
    blinking: bool = false,
    wide_tail: bool = false,
    style: u8 = 1,
    color: ?struct { r: u8, g: u8, b: u8 } = null,
};

pub const Options = struct {
    cols: u16,
    rows: u16,
    max_scrollback: usize = 10_000,
    logger: ?*const log.Logger = null,
    /// Cell pixel geometry of the host terminal. Kitty placements are sized in
    /// pixels, so the VT needs it to convert them into cells.
    cell_size: graphics.CellSize = .{},
};

pub const response_limit = 1024 * 1024;

const StreamHandler = struct {
    base: ghostty.TerminalStream.Handler,

    pub fn vt(self: *StreamHandler, comptime action: ghostty.StreamAction.Tag, value: ghostty.StreamAction.Value(action)) void {
        // The embedding controller owns the viewport; DECCOLM must not resize it.
        if (action == .set_mode or action == .reset_mode or action == .restore_mode) {
            if (value.mode == .@"132_column") return;
        }
        // Ghostty answers and stores Kitty drag and drop commands without a drop effect; OpenTUI has none.
        if (action == .kitty_dnd) return;
        self.base.vt(action, value);
    }

    pub fn deinit(self: *StreamHandler) void {
        self.base.deinit();
    }
};

pub const EmbeddedTerminal = struct {
    allocator: std.mem.Allocator,
    logger: ?*const log.Logger,
    terminal: ghostty.Terminal,
    stream: ghostty.Stream(StreamHandler),
    render_state: ghostty.RenderState = .empty,
    cols: u16,
    rows: u16,
    responses: std.ArrayListUnmanaged(u8) = .empty,
    response_error: ?Error = null,
    mouse_last_cell: ?ghostty.Coordinate = null,
    force_redraw: bool = true,
    transparent_background: bool = false,
    /// Cell pixel geometry of the host terminal.
    cell_size: graphics.CellSize = .{},
    /// Decoded kitty images, keyed by the VT image id.
    images: graphics.ImageCache = undefined,
    /// How many image placements the pane buffer currently holds.
    images_placed: u32 = 0,
    /// Rows a virtual (unicode-placeholder) placement was drawn into last
    /// compose. Those images are anchored to cells, so a text repaint can move
    /// or clear them without touching the image storage at all.
    virtual_rows: graphics.VirtualRows = .{},
    delete_scan: kitty_delete.Scanner = .{},
    virtual_cleared: bool = false,

    pub fn init(io: std.Io, allocator: std.mem.Allocator, options: Options) Error!*EmbeddedTerminal {
        if (options.cols == 0 or options.rows == 0) return error.InvalidValue;

        // Kitty PNG transmissions are rejected outright without a decoder, so
        // the VT gets OpenTUI's before the first image can arrive.
        graphics.installPngDecoder();

        const self = try allocator.create(EmbeddedTerminal);
        errdefer allocator.destroy(self);

        self.* = .{
            .allocator = allocator,
            .logger = options.logger,
            .terminal = try .init(io, allocator, .{
                .cols = options.cols,
                .rows = options.rows,
                .max_scrollback_bytes = options.max_scrollback,
                // Ghostty answers OSC 10/11 and renders one-sided changes only when both defaults are set.
                .colors = .{
                    .background = .init(ghostty.RenderState.empty.colors.background),
                    .foreground = .init(ghostty.RenderState.empty.colors.foreground),
                    .cursor = .unset,
                    .palette = .default,
                },
            }),
            .stream = undefined,
            .cols = options.cols,
            .rows = options.rows,
            .cell_size = options.cell_size.sanitize(),
            .images = .{ .allocator = allocator },
        };
        errdefer self.terminal.deinit(allocator);
        errdefer self.images.deinit();

        var handler = self.terminal.vtHandler();
        handler.effects.write_pty = &writePty;
        handler.effects.device_attributes = &deviceAttributes;
        // XTWINOPS size queries (CSI 14/16/18 t). A program inside the pane
        // answers its pixel-size query from this, and a terminal that stays
        // silent leaves every image-capable client on fallback cell metrics
        // (tfm's icon drain skips rasterizing at all without a resolution).
        handler.effects.size = &sizeReport;
        self.stream = .init(.{ .allocator = allocator, .handler = .{ .base = handler } });
        self.applyCellSize();
        return self;
    }

    pub fn deinit(self: *EmbeddedTerminal) void {
        const allocator = self.allocator;
        self.stream.deinit();
        self.render_state.deinit(allocator);
        self.terminal.deinit(allocator);
        self.responses.deinit(allocator);
        self.images.deinit();
        allocator.destroy(self);
    }

    /// Sets the host terminal's cell pixel geometry.
    ///
    /// The VT converts kitty pixel sizes into cells with it, so it has to be
    /// set before any placement is measured. A zero size would divide by zero.
    pub fn setCellSize(self: *EmbeddedTerminal, width: u32, height: u32) void {
        const requested: graphics.CellSize = .{
            .width = if (width == 0) self.cell_size.width else width,
            .height = if (height == 0) self.cell_size.height else height,
        };
        const next = requested.sanitize();
        if (next.width == self.cell_size.width and next.height == self.cell_size.height) return;
        self.cell_size = next;
        self.applyCellSize();
    }

    fn applyCellSize(self: *EmbeddedTerminal) void {
        self.terminal.width_px = std.math.mul(u32, self.cols, self.cell_size.width) catch std.math.maxInt(u32);
        self.terminal.height_px = std.math.mul(u32, self.rows, self.cell_size.height) catch std.math.maxInt(u32);
    }

    pub fn write(self: *EmbeddedTerminal, bytes: []const u8) Error!void {
        if (self.delete_scan.feed(bytes)) self.virtual_cleared = true;
        self.stream.handler.base.semantic_failure = false;
        self.stream.nextSlice(bytes);
        if (self.stream.handler.base.semantic_failure) {
            if (self.logger) |logger| logger.logMessage(.err, "Embedded terminal could not process input", .{});
            return error.ProcessingFailed;
        }
    }

    pub fn resize(self: *EmbeddedTerminal, cols: u16, rows: u16) Error!void {
        if (cols == 0 or rows == 0) return error.InvalidValue;
        self.stream.handler.base.resize(.{
            .cols = cols,
            .rows = rows,
            .cell_size_px = .{ .width = self.cell_size.width, .height = self.cell_size.height },
        }) catch |err| switch (err) {
            error.InvalidValue => return error.InvalidValue,
            error.OutOfMemory => return error.OutOfMemory,
        };
        self.cols = cols;
        self.rows = rows;
        self.mouse_last_cell = null;
        self.applyCellSize();
    }

    pub fn scroll(self: *EmbeddedTerminal, delta: i32) void {
        self.terminal.scrollViewport(.{ .delta = delta });
    }

    pub fn setSelection(self: *EmbeddedTerminal, start: ghostty.Coordinate, end: ghostty.Coordinate) Error!void {
        const screen = self.terminal.screens.active;
        const start_pin = screen.pages.pin(.{ .viewport = start }) orelse return error.InvalidValue;
        const end_pin = screen.pages.pin(.{ .viewport = end }) orelse return error.InvalidValue;
        try screen.select(ghostty.Selection.init(start_pin, end_pin, false));
    }

    pub fn clearSelection(self: *EmbeddedTerminal) void {
        self.terminal.screens.active.clearSelection();
    }

    pub fn selectedText(self: *EmbeddedTerminal) Error![:0]const u8 {
        const screen = self.terminal.screens.active;
        const selection = screen.selection orelse return try self.allocator.dupeSentinel(u8, "", 0);
        return try screen.selectionString(self.allocator, .{ .sel = selection });
    }

    pub fn freeSelectedText(self: *EmbeddedTerminal, text: [:0]const u8) void {
        self.allocator.free(text);
    }

    pub fn invalidate(self: *EmbeddedTerminal) void {
        self.force_redraw = true;
    }

    pub fn setTransparentBackground(self: *EmbeddedTerminal, transparent: bool) void {
        self.transparent_background = transparent;
        self.force_redraw = true;
    }

    pub fn compose(self: *EmbeddedTerminal, target: *buffer.OptimizedBuffer, x: i32, y: i32) Error!void {
        try self.composeInternal(target, x, y, false, std.math.maxInt(u32));
    }

    /// Draw into retained draft storage, using the caller's cell budget for both viewports.
    /// Dimension rejection preserves the target; later errors can leave partial rows.
    /// Clear or discard failed drafts. Every error forces a full redraw on the next compose.
    /// Invalidate explicitly when changing targets/origins or clearing a successful draft.
    pub fn composeChecked(self: *EmbeddedTerminal, target: *buffer.OptimizedBuffer, x: i32, y: i32, cells_max: u32) Error!void {
        try self.composeInternal(target, x, y, true, cells_max);
    }

    fn composeInternal(self: *EmbeddedTerminal, target: *buffer.OptimizedBuffer, x: i32, y: i32, comptime checked: bool, cells_max: u32) Error!void {
        errdefer self.force_redraw = true;
        if (checked) {
            try target.checkImageResources();
            const pages = &self.terminal.screens.active.pages;
            const source_cells = @as(u32, pages.cols) * pages.rows;
            const target_cells = std.math.mul(u32, target.width, target.height) catch return error.InvalidDimensions;
            if (source_cells == 0 or source_cells > cells_max or
                target.width == 0 or target.height == 0 or target_cells > cells_max or
                target.width > std.math.maxInt(i32) or target.height > std.math.maxInt(i32))
            {
                return error.InvalidDimensions;
            }
        }
        const fg, const bg = .{ self.render_state.colors.foreground, self.render_state.colors.background };
        self.render_state.update(self.allocator, &self.terminal) catch |err| {
            self.render_state.deinit(self.allocator);
            self.render_state = .empty;
            return err;
        };
        // Ghostty does not dirty rows when OSC 10/11/110/111 or reverse video change the default colors.
        const colors = &self.render_state.colors;
        if (self.force_redraw or !std.meta.eql(fg, colors.foreground) or !std.meta.eql(bg, colors.background)) self.render_state.dirty = .full;

        // Kitty images: the VT stores them, the pane has to draw them. The
        // placements move whenever the VT scrolls or resizes, so they are
        // redrawn whenever the VT reports a change. The pane buffer can also
        // lose them (a resize clears it), which the placement count catches.
        const storage = &self.terminal.screens.active.kitty_images;
        const lost = target.image_placements.items.len < self.images_placed;
        // A delete-everything (which libghostty applies to pinned placements
        // only) drops the virtual ones as far as the client is concerned.
        if (storage.dirty) self.virtual_cleared = false;
        const cleared_virtuals = self.virtual_cleared and !self.virtual_rows.isEmpty();
        // Virtual placements live in cells, not in image storage: a program
        // repaints its preview area with plain text to clear one, which dirties
        // rows and leaves `storage.dirty` false. Without this the pane keeps
        // showing the cleared picture until some later image mutates the
        // storage (which is why it "only goes away when the next image shows").
        var placeholder_touched = false;
        if (!storage.dirty and !lost) {
            const rows = self.render_state.row_data.slice();
            const row_dirty = rows.items(.dirty);
            const row_raw = rows.items(.raw);
            for (0..row_dirty.len) |dirty_y| {
                if (!row_dirty[dirty_y]) continue;
                if (self.virtual_rows.covers(@intCast(dirty_y)) or row_raw[dirty_y].kitty_virtual_placeholder) {
                    placeholder_touched = true;
                    break;
                }
            }
        }
        const replot = storage.dirty or lost or placeholder_touched or cleared_virtuals;
        if (replot) {
            // The previous placements reserved the cells they covered, so the
            // text underneath them is gone. Release those cells first (the
            // reservation characters survive clearImages, and the next text
            // pass skips cells that look like reservations) and then redraw
            // the text before the images are drawn again.
            target.releaseImageCells();
            target.clearImages();
            self.images_placed = 0;
            self.render_state.dirty = .full;
        }

        try compositor.compose(self.allocator, &self.render_state, target, x, y, self.transparent_background, checked);

        if (replot) {
            try graphics.composeImages(
                &self.images,
                &self.terminal,
                target,
                x,
                y,
                self.cell_size,
                self.allocator,
                &self.virtual_rows,
                self.virtual_cleared,
            );
            storage.dirty = false;
            self.images_placed = @intCast(target.image_placements.items.len);
        }
        self.force_redraw = false;
    }

    pub fn cursor(self: *EmbeddedTerminal) Cursor {
        const state = self.render_state.cursor;
        const viewport = state.viewport orelse return .{ .visible = state.visible };
        const cursor_color = self.render_state.colors.cursor orelse self.render_state.colors.foreground;
        return .{
            .x = viewport.x,
            .y = viewport.y,
            .has_value = true,
            .visible = state.visible,
            .blinking = state.blinking,
            .wide_tail = viewport.wide_tail,
            .style = switch (state.visual_style) {
                .bar => 0,
                .block => 1,
                .underline => 2,
                .block_hollow => 3,
            },
            .color = .{ .r = cursor_color.r, .g = cursor_color.g, .b = cursor_color.b },
        };
    }

    pub fn encodeKey(self: *EmbeddedTerminal, key: ghostty.Key) Error![]u8 {
        var output: std.Io.Writer.Allocating = .init(self.allocator);
        errdefer output.deinit();
        var options: ghostty.KeyEncodeOptions = .fromTerminal(&self.terminal);
        // The host terminal has already applied its Option setting, so an Alt bit here means Alt.
        options.macos_option_as_alt = .true;
        ghostty.encodeKey(&output.writer, key.event(), options) catch return error.OutOfMemory;
        return output.toOwnedSlice();
    }

    pub fn encodeMouse(self: *EmbeddedTerminal, mouse: ghostty.Mouse) Error![]u8 {
        if (!std.math.isFinite(mouse.x) or !std.math.isFinite(mouse.y)) return error.InvalidOptions;
        const MouseSize = @FieldType(ghostty.MouseEncodeOptions, "size");
        const size: MouseSize = .{
            .screen = .{ .width = self.cols, .height = self.rows },
            .cell = .{ .width = 1, .height = 1 },
            .padding = .{},
        };
        var options = ghostty.MouseEncodeOptions.fromTerminal(&self.terminal, size);
        // OpenTUI receives terminal-cell coordinates, not physical pixels.
        if (options.format == .sgr_pixels) return self.allocator.alloc(u8, 0);
        options.any_button_pressed = mouse.any_button_pressed;
        options.last_cell = &self.mouse_last_cell;

        var event = mouse.event();
        // Keep an outside sentinel for reporting policy, but bound Ghostty's pre-clamp u16 conversion.
        event.pos.x = std.math.clamp(event.pos.x, -1, @as(f32, @floatFromInt(self.cols)) + 0.5);
        event.pos.y = std.math.clamp(event.pos.y, -1, @as(f32, @floatFromInt(self.rows)) + 0.5);
        if (options.format == .utf8) {
            const column: u32 = @intFromFloat(std.math.clamp(event.pos.x, 0, @as(f32, @floatFromInt(self.cols - 1))));
            const row: u32 = @intFromFloat(std.math.clamp(event.pos.y, 0, @as(f32, @floatFromInt(self.rows - 1))));
            // The UTF-8 encoder assumes scalar coordinates and adds the row offset in u16.
            for ([_]u32{ column + 33, row + 33 }) |codepoint| {
                if (codepoint >= 0xd800 and codepoint <= 0xdfff) return error.InvalidOptions;
            }
            if (row > std.math.maxInt(u16) - 33) return error.InvalidOptions;
        }
        var output: std.Io.Writer.Allocating = .init(self.allocator);
        errdefer output.deinit();
        ghostty.encodeMouse(&output.writer, event, options) catch return error.OutOfMemory;
        return output.toOwnedSlice();
    }

    pub fn encodePaste(self: *EmbeddedTerminal, input: []const u8) Error![]u8 {
        const copy = try self.allocator.dupe(u8, input);
        defer self.allocator.free(copy);
        const parts = ghostty.encodePaste(copy, .fromTerminal(&self.terminal));

        var output: std.Io.Writer.Allocating = .init(self.allocator);
        errdefer output.deinit();
        for (parts) |part| output.writer.writeAll(part) catch return error.OutOfMemory;
        return output.toOwnedSlice();
    }

    pub fn encodeFocus(self: *EmbeddedTerminal, focused: bool) Error![]u8 {
        if (!self.terminal.modes.get(.focus_event)) return self.allocator.alloc(u8, 0);

        var output: std.Io.Writer.Allocating = .init(self.allocator);
        errdefer output.deinit();
        ghostty.encodeFocus(&output.writer, if (focused) .gained else .lost) catch return error.OutOfMemory;
        return output.toOwnedSlice();
    }

    pub fn freeEncoded(self: *EmbeddedTerminal, bytes: []u8) void {
        self.allocator.free(bytes);
    }

    pub fn drainResponses(self: *EmbeddedTerminal, output: []u8) Error!usize {
        if (self.response_error) |err| {
            self.response_error = null;
            return err;
        }
        const count = @min(output.len, self.responses.items.len);
        @memcpy(output[0..count], self.responses.items[0..count]);
        std.mem.copyForwards(u8, self.responses.items[0 .. self.responses.items.len - count], self.responses.items[count..]);
        self.responses.items.len -= count;
        return count;
    }

    fn writePty(handler: *ghostty.TerminalStream.Handler, data: []const u8) void {
        const self: *EmbeddedTerminal = @fieldParentPtr("terminal", handler.terminal);
        if (self.response_error != null) return;
        if (data.len > response_limit - @min(self.responses.items.len, response_limit)) {
            self.response_error = error.ResponseOverflow;
            return;
        }
        self.responses.appendSlice(self.allocator, data) catch {
            self.response_error = error.OutOfMemory;
        };
    }

    fn deviceAttributes(_: *ghostty.TerminalStream.Handler) ghostty.DeviceAttributes {
        return .{};
    }

    /// Reports the pane's geometry for XTWINOPS size queries, in the same
    /// units the host terminal reports its own (cells + cell pixel size).
    fn sizeReport(handler: *ghostty.TerminalStream.Handler) ?ghostty.size_report.Size {
        const self: *EmbeddedTerminal = @fieldParentPtr("terminal", handler.terminal);
        return .{
            .rows = self.rows,
            .columns = self.cols,
            .cell_width = self.cell_size.width,
            .cell_height = self.cell_size.height,
        };
    }
};
