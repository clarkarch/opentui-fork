//! A dependency-free stand-in for Ghostty's `pkg/wuffs` package.
//!
//! Ghostty's VT build requires a `wuffs` module whenever the Kitty graphics
//! protocol is enabled: it converts the pixel formats a client may transmit
//! and inflates zlib-compressed image data. Ghostty's own package is a thin
//! Zig binding over the Wuffs C library, which it translates at build time.
//!
//! The fork's embedded terminal renders Kitty images (the VT keeps the image
//! and placement storage), so the protocol must stay enabled in the VT build
//! -- but translating and vendoring the Wuffs C amalgamation for two small
//! pixel-format conversions and one inflate is a lot of build machinery to
//! carry. This package provides the same API in pure Zig:
//!
//!   * `swizzle` converts and blends pixel formats.
//!   * `zlib` inflates a zlib stream with the standard library's decompressor.
//!   * `png` is a stub: the VT decodes PNG through the `sys.decode_png` hook,
//!     which the host installs (Ghostty's own default decoder is only
//!     available in the standalone application build, not in the library).

pub const png = @import("png.zig");
pub const swizzle = @import("swizzle.zig");
pub const zlib = @import("zlib.zig");
pub const Error = @import("error.zig").Error;

/// The maximum image size, based on the 4G limit of Ghostty's
/// `image-storage-limit` config.
pub const maximum_image_size = 4 * 1024 * 1024 * 1024;

pub const ImageData = struct {
    width: u32,
    height: u32,
    data: []u8,
};
