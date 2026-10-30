//! Pixel format conversions for the Kitty graphics protocol.
//!
//! The formats match Wuffs' semantics, because Ghostty's Kitty graphics code
//! was written against them:
//!
//!   * `Y` (grayscale) has no alpha channel, so it converts to opaque RGBA.
//!   * `YA` (grayscale + alpha) converts to straight (non-premultiplied) RGBA:
//!     the gray level is the color, the alpha stays as it is.
//!   * `RGB` and `BGR` convert to opaque RGBA.
//!   * `BGRA` is already premultiplied RGBA in a different channel order, so
//!     the bytes are copied as they are.
//!
//! The blend composites in 16-bit integer space, like Wuffs does.

const std = @import("std");
const Allocator = std.mem.Allocator;
const assert = std.debug.assert;
const Error = @import("error.zig").Error;

/// Grayscale (one byte per pixel) to straight RGBA. The gray level is
/// opaque, so the alpha is 255.
pub fn gToRgba(alloc: Allocator, src: []const u8) Error![]u8 {
    const dst = try alloc.alloc(u8, src.len * 4);
    errdefer alloc.free(dst);
    for (src, 0..) |y, i| {
        dst[i * 4 + 0] = y;
        dst[i * 4 + 1] = y;
        dst[i * 4 + 2] = y;
        dst[i * 4 + 3] = 255;
    }
    return dst;
}

/// Grayscale with alpha (two bytes per pixel) to straight RGBA.
pub fn gaToRgba(alloc: Allocator, src: []const u8) Error![]u8 {
    if (src.len % 2 != 0) return error.WuffsError;
    const dst = try alloc.alloc(u8, src.len * 2);
    errdefer alloc.free(dst);
    var i: usize = 0;
    while (i < src.len) : (i += 2) {
        dst[i + 0] = src[i];
        dst[i + 1] = src[i];
        dst[i + 2] = src[i];
        dst[i + 3] = src[i + 1];
    }
    return dst;
}

/// RGB (three bytes per pixel) to straight RGBA.
pub fn rgbToRgba(alloc: Allocator, src: []const u8) Error![]u8 {
    if (src.len % 3 != 0) return error.WuffsError;
    const dst = try alloc.alloc(u8, src.len / 3 * 4);
    errdefer alloc.free(dst);
    var i: usize = 0;
    var o: usize = 0;
    while (i < src.len) : (i += 3) {
        dst[o + 0] = src[i];
        dst[o + 1] = src[i + 1];
        dst[o + 2] = src[i + 2];
        dst[o + 3] = 255;
        o += 4;
    }
    return dst;
}

/// BGR (three bytes per pixel) to straight RGBA.
pub fn bgrToRgba(alloc: Allocator, src: []const u8) Error![]u8 {
    if (src.len % 3 != 0) return error.WuffsError;
    const dst = try alloc.alloc(u8, src.len / 3 * 4);
    errdefer alloc.free(dst);
    var i: usize = 0;
    var o: usize = 0;
    while (i < src.len) : (i += 3) {
        dst[o + 0] = src[i + 2];
        dst[o + 1] = src[i + 1];
        dst[o + 2] = src[i];
        dst[o + 3] = 255;
        o += 4;
    }
    return dst;
}

/// Premultiplied BGRA to premultiplied RGBA: the bytes are copied as they
/// are, only the red and blue channels swap.
pub fn bgraToRgba(alloc: Allocator, src: []const u8) Error![]u8 {
    if (src.len % 4 != 0) return error.WuffsError;
    const dst = try alloc.alloc(u8, src.len);
    errdefer alloc.free(dst);
    var i: usize = 0;
    while (i < src.len) : (i += 4) {
        dst[i + 0] = src[i + 2];
        dst[i + 1] = src[i + 1];
        dst[i + 2] = src[i];
        dst[i + 3] = src[i + 3];
    }
    return dst;
}

/// Composite `src` over `dst` in place. Both are straight
/// (non-premultiplied) alpha RGBA of the same length. A transparent
/// destination pixel takes the source pixel exactly; everything else is
/// composited in 16-bit integer space.
pub fn rgbaSrcOver(dst: []u8, src: []const u8) void {
    assert(dst.len == src.len);
    assert(dst.len % 4 == 0);

    var i: usize = 0;
    while (i < dst.len) : (i += 4) {
        const sa: u32 = src[i + 3];
        const da: u32 = dst[i + 3];
        if (sa == 0) continue;
        if (sa == 255) {
            dst[i + 0] = src[i + 0];
            dst[i + 1] = src[i + 1];
            dst[i + 2] = src[i + 2];
            dst[i + 3] = 255;
            continue;
        }
        const inv: u32 = 255 - sa;
        const out_a: u32 = sa + da * inv / 255;
        if (out_a == 0) {
            dst[i + 0] = 0;
            dst[i + 1] = 0;
            dst[i + 2] = 0;
            dst[i + 3] = 0;
            continue;
        }
        var c: usize = 0;
        while (c < 3) : (c += 1) {
            const sc: u32 = src[i + c];
            const dc: u32 = dst[i + c];
            // Premultiplied contributions, then un-premultiply by the
            // resulting alpha.
            const pm: u32 = sc * sa + dc * da * inv / 255;
            dst[i + c] = @intCast((pm + out_a / 2) / out_a);
        }
        dst[i + 3] = @intCast(out_a);
    }
}

test "gToRgba" {
    const rgba = try gToRgba(std.testing.allocator, &.{ 7, 200 });
    defer std.testing.allocator.free(rgba);

    try std.testing.expectEqualSlices(u8, &.{
        7, 7, 7, 255,
        200, 200, 200, 255,
    }, rgba);
}

test "gaToRgba" {
    const rgba = try gaToRgba(std.testing.allocator, &.{ 7, 100, 8, 200 });
    defer std.testing.allocator.free(rgba);

    try std.testing.expectEqualSlices(u8, &.{
        7, 7, 7, 100,
        8, 8, 8, 200,
    }, rgba);
}

test "rgbToRgba" {
    const rgba = try rgbToRgba(std.testing.allocator, &.{ 1, 2, 3, 4, 5, 6 });
    defer std.testing.allocator.free(rgba);

    try std.testing.expectEqualSlices(u8, &.{
        1, 2, 3, 255,
        4, 5, 6, 255,
    }, rgba);
}

test "rgbaSrcOver" {
    // 50% white over opaque black, opaque over anything, transparent
    // source over anything, and anything over a transparent
    // destination (exact source passthrough).
    var dst = [_]u8{
        0,  0,  0,  255,
        10, 20, 30, 40,
        10, 20, 30, 40,
        0,  0,  0,  0,
    };
    rgbaSrcOver(&dst, &.{
        255, 255, 255, 128,
        100, 110, 120, 255,
        100, 110, 120, 0,
        200, 100, 50,  128,
    });
    try std.testing.expectEqualSlices(u8, &.{
        128, 128, 128, 255,
        100, 110, 120, 255,
        10,  20,  30,  40,
        200, 100, 50,  128,
    }, &dst);
}
