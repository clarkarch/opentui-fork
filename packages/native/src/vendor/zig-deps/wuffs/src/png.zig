//! PNG decoding stub.
//!
//! The VT never decodes PNG through this module: it calls the `sys.decode_png`
//! hook, which the host installs (`terminal/sys.zig` only defaults to the
//! Wuffs decoder in the standalone application build, not in the library
//! build OpenTUI links). Ghostty's own `pkg/wuffs` keeps a PNG decoder here
//! for that application build; the fork's VT does not need one.

const std = @import("std");
const Allocator = std.mem.Allocator;
const Error = @import("error.zig").Error;
const ImageData = @import("main.zig").ImageData;

pub fn decode(alloc: Allocator, data: []const u8) Error!ImageData {
    _ = alloc;
    _ = data;
    return error.WuffsError;
}
