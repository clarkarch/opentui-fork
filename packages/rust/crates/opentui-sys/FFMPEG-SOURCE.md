# Native video

The fork's native library has **no video decoder**. `VideoView` exists, but every
open fails as unavailable.

Upstream links a decode-only LGPL FFmpeg into the native library for its video
renderable. The fork's consumers do not use it, and the decoder costs ~3 MB per
published library plus minutes of build time per target, so the native build
runs without an FFmpeg prefix: the video shim compiles in its "unavailable"
mode.

`packages/native/scripts/build-ffmpeg.ts` is upstream's script and is not part
of the fork's build. Nothing calls it. The vendored FFmpeg sources under
`packages/native/src/vendor/ffmpeg/` are kept for reference only.

To build a library that DOES decode video, build the upstream prefix yourself
and point the native build at it:

```sh
cd packages/native
bun scripts/build-ffmpeg.ts --target=x86_64-linux-gnu
zig build -Doptimize=ReleaseFast
```

That is not what the fork ships, and it is not what CI builds. Keep it that way
until a consumer needs real video.
