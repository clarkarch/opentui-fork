//! The error set Ghostty's Kitty graphics code expects from the `wuffs`
//! module. Ghostty's own `pkg/wuffs` exposes the same set, so the call
//! sites in `src/terminal/kitty/` compile unchanged.

const std = @import("std");

pub const Error = std.mem.Allocator.Error || error{ WuffsError, Overflow };
