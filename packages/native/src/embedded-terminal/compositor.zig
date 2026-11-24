const std = @import("std");
const ansi = @import("../ansi.zig");
const buffer = @import("../buffer.zig");
const ghostty = @import("ghostty.zig");
const gp = @import("../grapheme.zig");

pub const Error = std.mem.Allocator.Error || buffer.BufferError || error{
    InvalidUnicode,
    InvalidOptions,
    TextLimit,
    UnsupportedResource,
    TrackerLimit,
};

/// The kitty graphics unicode placeholder: a private use codepoint that
/// anchors an image to a cell.
const kitty_placeholder: u21 = 0x10EEEE;

/// True when the target already holds an image reservation at this cell.
///
/// An image is drawn OVER its cells, so a text pass must leave them alone: the
/// row is repainted for reasons that have nothing to do with the picture (a
/// selection tint, a background flip), and overwriting a reserved cell drops
/// the placement — the pane then loses the image until the picture itself
/// changes. Only deleting the image releases the cells.
inline fn imageReserved(target: *const buffer.OptimizedBuffer, x: i64, y: i64, width: u32) bool {
    if (y < 0 or y >= target.getHeight()) return false;
    var offset: u32 = 0;
    while (offset < width) : (offset += 1) {
        const column = x + @as(i64, offset);
        if (column < 0 or column >= target.getWidth()) continue;
        const cell = target.get(@intCast(column), @intCast(y)) orelse continue;
        if (gp.isImageChar(cell.char)) return true;
    }
    return false;
}

pub fn compose(
    allocator: std.mem.Allocator,
    state: *ghostty.RenderState,
    target: *buffer.OptimizedBuffer,
    origin_x: i32,
    origin_y: i32,
    transparent_background: bool,
    comptime checked: bool,
) Error!void {
    errdefer state.dirty = .full;
    const dirty = state.dirty;
    if (dirty == .false) return;

    const default_bg = if (transparent_background)
        ansi.defaultColor(state.colors.background.r, state.colors.background.g, state.colors.background.b, 255)
    else
        color(state.colors.background);

    const rows = state.row_data.slice();
    const row_dirty = rows.items(.dirty);
    const row_cells = rows.items(.cells);
    const row_selection = rows.items(.selection);
    for (0..state.rows) |y| {
        if (dirty == .partial and !row_dirty[y]) continue;

        const dest_y = @as(i64, origin_y) + @as(i64, @intCast(y));
        if (dest_y >= 0 and dest_y < target.getHeight()) {
            try clearRow(target, origin_x, @intCast(dest_y), state.cols, state.colors.foreground, default_bg, checked);
            try composeRow(
                allocator,
                row_cells[y].slice(),
                row_selection[y],
                target,
                origin_x,
                @intCast(dest_y),
                &state.colors,
                default_bg,
                checked,
            );
        }

        row_dirty[y] = false;
    }

    state.dirty = .false;
}

fn clearRow(target: *buffer.OptimizedBuffer, origin_x: i32, y: u32, cols: u16, foreground: anytype, background: anytype, comptime checked: bool) Error!void {
    const fg = color(foreground);
    const bg = color(background);
    const start = @max(0, @as(i64, origin_x));
    const end = @min(target.getWidth(), @as(i64, origin_x) + cols);
    if (start >= end) return;
    var x: u32 = @intCast(start);
    while (x < end) : (x += 1) {
        // Image cells keep their picture: clearRow runs for any dirty row,
        // including one whose image did not change.
        if (imageReserved(target, @intCast(x), y, 1)) continue;
        if (checked) {
            try target.drawGraphemeChecked(" ", 1, x, y, fg, bg, 0);
        } else target.set(x, y, .{
            .char = buffer.DEFAULT_SPACE_CHAR,
            .fg = fg,
            .bg = bg,
            .attributes = 0,
        });
    }
}

fn composeRow(
    allocator: std.mem.Allocator,
    cells: anytype,
    selection: ?[2]u16,
    target: *buffer.OptimizedBuffer,
    origin_x: i32,
    dest_y: u32,
    colors: *const ghostty.RenderState.Colors,
    default_bg: buffer.RGBA,
    comptime checked: bool,
) Error!void {
    const raw_items = cells.items(.raw);
    const graphemes = cells.items(.grapheme);
    const styles = cells.items(.style);
    const text_end = if (selection != null) end: {
        var x = raw_items.len;
        while (x > 0) {
            x -= 1;
            const raw = raw_items[x];
            if (raw.wide == .spacer_tail or raw.wide == .spacer_head) continue;
            // Keep explicit spaces and gaps within text, but not unused row tails.
            if (raw.codepoint() != 0) break :end x + raw.gridWidth();
        }
        break :end 0;
    } else 0;

    cell_loop: for (raw_items, 0..) |raw, x| {
        const dest_x = @as(i64, origin_x) + @as(i64, @intCast(x));
        if (dest_x < 0 or dest_x >= target.getWidth()) continue;
        if (raw.wide == .spacer_tail or raw.wide == .spacer_head) continue;
        // An image reservation owns these cells (see imageReserved): a text
        // repaint under a picture must not take the picture away.
        if (imageReserved(target, dest_x, dest_y, raw.gridWidth())) continue :cell_loop;

        const grapheme: []const u21 = if (raw.hasGrapheme()) graphemes[x] else &.{};
        const style = if (raw.hasStyling()) styles[x] else @TypeOf(styles[x]){};
        var fg = color(style.fg(.{ .default = colors.foreground, .palette = &colors.palette }));
        var bg = if (style.bg(&raw, &colors.palette)) |explicit| color(explicit) else default_bg;
        if (style.flags.inverse) std.mem.swap(@TypeOf(fg), &fg, &bg);
        if (selection) |range| {
            if (x < text_end and x + raw.gridWidth() > range[0] and x <= range[1]) std.mem.swap(@TypeOf(fg), &fg, &bg);
        }

        // The kitty unicode placeholder anchors an image to a cell. It is a
        // private use codepoint that must never be painted: the image is
        // drawn over the cell instead.
        if (raw.codepoint() == kitty_placeholder) {
            target.set(@intCast(dest_x), @intCast(dest_y), .{
                .char = buffer.DEFAULT_SPACE_CHAR,
                .fg = fg,
                .bg = bg,
                .attributes = attributes(style),
            });
            continue :cell_loop;
        }

        var stack: [128]u8 = undefined;
        var writer: std.Io.Writer = .fixed(&stack);
        encodeCodepoint(&writer, raw.codepoint()) catch {
            try drawAllocated(allocator, target, raw, grapheme, @intCast(dest_x), dest_y, fg, bg, style, checked);
            continue :cell_loop;
        };
        for (grapheme) |codepoint| encodeCodepoint(&writer, codepoint) catch {
            try drawAllocated(allocator, target, raw, grapheme, @intCast(dest_x), dest_y, fg, bg, style, checked);
            continue :cell_loop;
        };

        try draw(target, writer.buffered(), raw.gridWidth(), @intCast(dest_x), dest_y, fg, bg, style, checked);
    }
}

fn drawAllocated(
    allocator: std.mem.Allocator,
    target: *buffer.OptimizedBuffer,
    raw: anytype,
    grapheme: []const u21,
    x: u32,
    y: u32,
    foreground: anytype,
    background: anytype,
    style: anytype,
    comptime checked: bool,
) Error!void {
    var output: std.Io.Writer.Allocating = .init(allocator);
    defer output.deinit();
    encodeCodepoint(&output.writer, raw.codepoint()) catch return error.OutOfMemory;
    for (grapheme) |codepoint| encodeCodepoint(&output.writer, codepoint) catch return error.OutOfMemory;
    try draw(target, output.written(), raw.gridWidth(), x, y, foreground, background, style, checked);
}

fn encodeCodepoint(writer: *std.Io.Writer, codepoint: u21) std.Io.Writer.Error!void {
    if (codepoint == 0) return;
    var bytes: [4]u8 = undefined;
    const len = std.unicode.utf8Encode(codepoint, &bytes) catch return;
    try writer.writeAll(bytes[0..len]);
}

fn draw(target: *buffer.OptimizedBuffer, text: []const u8, cell_width: u8, x: u32, y: u32, foreground: anytype, background: anytype, style: anytype, comptime checked: bool) Error!void {
    const cell_attributes = attributes(style);
    if (checked) {
        const blank = text.len == 0 or style.flags.invisible;
        try target.drawGraphemeChecked(if (blank) " " else text, if (blank) 1 else cell_width, x, y, color(foreground), color(background), cell_attributes);
        return;
    }
    if (text.len == 0 or style.flags.invisible) {
        target.set(x, y, .{
            .char = buffer.DEFAULT_SPACE_CHAR,
            .fg = color(foreground),
            .bg = color(background),
            .attributes = cell_attributes,
        });
        return;
    }
    try target.drawGrapheme(text, cell_width, x, y, color(foreground), color(background), cell_attributes);
}

fn color(value: anytype) buffer.RGBA {
    if (@TypeOf(value) == buffer.RGBA) return value;
    return ansi.rgbColor(value.r, value.g, value.b, 255);
}

fn attributes(style: anytype) u32 {
    var value: u32 = 0;
    if (style.flags.bold) value |= ansi.TextAttributes.BOLD;
    if (style.flags.faint) value |= ansi.TextAttributes.DIM;
    if (style.flags.italic) value |= ansi.TextAttributes.ITALIC;
    if (style.flags.underline != .none) value |= ansi.TextAttributes.UNDERLINE;
    if (style.flags.blink) value |= ansi.TextAttributes.BLINK;
    if (style.flags.invisible) value |= ansi.TextAttributes.HIDDEN;
    if (style.flags.strikethrough) value |= ansi.TextAttributes.STRIKETHROUGH;
    return value;
}
