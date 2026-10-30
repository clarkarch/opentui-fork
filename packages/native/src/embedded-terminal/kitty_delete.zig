//! Scans the VT's input for kitty graphics delete commands.
//!
//! libghostty's delete-all skips *virtual* placements (the unicode placeholder
//! protocol), so a client that clears a placeholder image with `a=d,d=A` — yazi
//! does exactly that — leaves the picture on screen. The client is right and the
//! VT is wrong, but the VT is vendored, so the pane compensates: a delete that
//! covers every placement invalidates the virtual ones until the next
//! transmission.

const std = @import("std");

/// The parameter section of a kitty APC is short; anything longer is not a
/// delete we care about.
const params_max = 128;

pub const Scanner = struct {
    params: [params_max]u8 = undefined,
    len: usize = 0,
    overflow: bool = false,
    in_apc: bool = false,
    /// An ESC ended the previous write; the next byte may be the APC opener.
    pending_esc: bool = false,
    /// Set by the APC that contains it, cleared by `take`.
    all: bool = false,

    /// Feeds VT input. Returns true when a delete-everything was seen.
    pub fn feed(self: *Scanner, bytes: []const u8) bool {
        var i: usize = 0;
        while (i < bytes.len) : (i += 1) {
            const b = bytes[i];
            if (!self.in_apc) {
                // `ESC _` (APC) is only a kitty escape when it starts a command.
                // The pair can straddle two writes, so an ESC is remembered.
                if (self.pending_esc) {
                    self.pending_esc = false;
                    if (b == '_') {
                        self.in_apc = true;
                        self.len = 0;
                        self.overflow = false;
                        continue;
                    }
                }
                if (b == 0x1b) self.pending_esc = true;
                continue;
            }
            if (b == 0x1b) {
                // ST (ESC \) ends the command.
                self.in_apc = false;
                continue;
            }
            if (b == ';' or b == 0x07) {
                // Parameters end; the payload follows (we only read params).
                continue;
            }
            if (self.len < params_max) {
                self.params[self.len] = b;
                self.len += 1;
            } else self.overflow = true;
        }
        if (!self.in_apc and !self.overflow and self.len > 0) {
            const p = self.params[0..self.len];
            if (contains(p, "a=d") and (contains(p, "d=A") or contains(p, "d=a"))) {
                self.all = true;
                self.len = 0;
                return true;
            }
            self.len = 0;
        }
        return false;
    }
};

fn contains(haystack: []const u8, needle: []const u8) bool {
    return std.mem.indexOf(u8, haystack, needle) != null;
}

test "scanner spots a delete-all and ignores other commands" {
    var s = Scanner{};
    try std.testing.expect(!s.feed("\x1b_Ga=t,f=100,i=7;AAAA\x1b\\"));
    try std.testing.expect(!s.feed("\x1b_Ga=d,d=i,i=7\x1b\\"));
    try std.testing.expect(s.feed("\x1b_Gq=2,a=d,d=A\x1b\\"));
    try std.testing.expect(s.feed("\x1b_Ga=d,d=a\x1b\\"));
}

test "scanner survives a command split across writes" {
    var s = Scanner{};
    try std.testing.expect(!s.feed("\x1b_Gq=2,a=d,"));
    try std.testing.expect(s.feed("d=A\x1b\\"));
}
