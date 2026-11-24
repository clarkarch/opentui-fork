//! zlib stream decompression for the Kitty graphics protocol.
//!
//! A client may transmit image data compressed with zlib (the `f=100`
//! transmission format). Ghostty's own `pkg/wuffs` inflates it with the
//! Wuffs C library; the standard library's decompressor does the same job
//! without the C dependency.

const std = @import("std");
const Allocator = std.mem.Allocator;
const Error = @import("error.zig").Error;

/// Decode a complete RFC 1950 zlib stream. `size_hint` is the expected
/// output size when known; the output may grow up to `limit` bytes.
pub fn decode(
    alloc: Allocator,
    data: []const u8,
    limit: usize,
    size_hint: ?usize,
) Error![]u8 {
    _ = size_hint;
    if (limit == 0) return error.Overflow;

    var input: std.Io.Reader = .fixed(data);
    // An empty window buffer selects the direct reader path, which needs a
    // contiguous input -- `Reader.fixed` gives exactly that.
    var decompress: std.compress.flate.Decompress = .init(&input, .zlib, &.{});
    return decompress.reader.allocRemaining(alloc, .limited(limit)) catch |err| switch (err) {
        error.OutOfMemory => error.OutOfMemory,
        error.StreamTooLong => error.Overflow,
        else => error.WuffsError,
    };
}

test "decode inflates a zlib stream" {
    // "hello" compressed with zlib (RFC 1950).
    const compressed = [_]u8{ 0x78, 0x9c, 0xcb, 0x48, 0xcd, 0xc9, 0xc9, 0x07, 0x00, 0x06, 0x2c, 0x02, 0x15 };
    const out = try decode(std.testing.allocator, &compressed, 1024, 5);
    defer std.testing.allocator.free(out);

    try std.testing.expectEqualStrings("hello", out);
}

test "decode rejects a stream past the limit" {
    const compressed = [_]u8{ 0x78, 0x9c, 0xcb, 0x48, 0xcd, 0xc9, 0xc9, 0x07, 0x00, 0x06, 0x2c, 0x02, 0x15 };
    try std.testing.expectError(error.Overflow, decode(std.testing.allocator, &compressed, 2, 5));
}

test "decode rejects garbage" {
    try std.testing.expectError(error.WuffsError, decode(std.testing.allocator, &.{ 1, 2, 3, 4 }, 1024, null));
}
