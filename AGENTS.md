# OpenTUI Agent Guide

## Engineering

- Reuse existing seams; do not duplicate policy, ownership, or state across TypeScript, Zig, and framework layers.
- For bug fixes, first add a focused regression test of observable behavior or invariants. If automation is impossible,
  record the evidence and remaining manual verification; do not substitute contract sketches or guesses.
- Make native ownership explicit; clean up handles, callbacks, buffers, and listeners on every exit path. Bound
  input-driven work and test lifecycle failures.
- Do not interchange byte lengths, code points, graphemes, and terminal display-cell widths.
- `oxfmt` is the formatting source of truth (`semi: false`, `printWidth: 120`); avoid unrelated formatting churn.
- In delegated tasks, name the local rendering behavior, owned files, and required checks. Describe ordinary
  renderer work as correctness and compatibility testing; reserve security terminology for actual security work.
  Use concrete scopes such as frame parity, callback ordering, resource cleanup, or loopback SSH output tests.
  Request an independent correctness review and a separate reproduction check of actionable findings.

## Tooling And Runtimes

- Use Bun for dependency management and development commands: `bun install`, `bun run <script>`, `bun test`, and `bun <file>`.
- Run package scripts from the package directory unless the script is defined at the repository root.
- Shared runtime code must preserve the supported Bun and Node paths. Keep runtime-specific behavior behind existing
  platform/runtime/build seams; do not introduce Bun-only APIs into shared modules. Node checks use the minimum
  version enforced by `scripts/node26.mjs`.

## Verification

- Run the narrowest relevant test first, then the affected package suite.
- Ordinary TypeScript source changes do not require the root build. Use the affected package's `test`, `typecheck`,
  `build`, or validation scripts as applicable.
- Run `bun run build` from the repository root after native or cross-package build/output changes, or when tests report
  a missing/stale native artifact. It does not build web or examples; use their package scripts.
- For native changes, run `bun run test:native` from `packages/core`. Filter with `bun run test:native -Dtest-filter="test name"` while iterating.
- For runtime, FFI, build, or export changes, run the relevant Node and packed-distribution scripts from that package
  (such as `test:js:node` or `test:dist`) when present.
- Use root `bun run fmt:check` and `bun run lint` for final static checks when relevant.

Prefer tests and `TestRenderer` for automated debugging. For interactive behavior, load the `terminal-control` skill and
use its terminal tool to run, drive, and inspect the app; repository examples bind backtick to
`renderer.console.toggle()` for captured `console.log` output. Ask for a user-run reproduction only when the required
terminal or platform is unavailable locally.

## Rust (`packages/rust`)

- The Rust crates are a Cargo workspace in `packages/rust`, not a Bun package. Run `cargo` with
  `--manifest-path packages/rust/Cargo.toml` or from that directory.
- `crates/opentui-sys/src/generated.rs` is generated: `bun run generate:abi` in `packages/core` writes it and `check:abi`
  checks it. Do not edit it.
- The crates link `packages/native/lib/<target>`, so build native first. `OPENTUI_LIB_DIR` overrides the path.
- Run the narrowest test first (`cargo test -p opentui --test <file>`; `tests/lifecycle.rs` also needs the examples
  built), then `sh packages/rust/test.sh shared`, and `static` on Linux and macOS when linking changes. `rustfmt.toml`
  is the Rust formatting source of truth.
- A change to `opentui.h` also runs `sh packages/rust/test.sh shared` and fixes the crates in the same pull request.
- The crates carry `@opentui/core`'s version; `prepare-release` sets it.

## Fork publishing (the `tfm` branch)

This branch is a fork that carries patches upstream does not have. It is published to npm under its own scope,
`@clarkarch/opentui-fork`, plus one package per native target (`@clarkarch/opentui-fork-<platform>-<arch>[-<abi>]`).

- The in-repo package name stays `@opentui/core`. The monorepo's internal imports and the upstream rebase depend on it;
  only the PUBLISHED artifacts carry the fork's name. `packages/core/src/published-package.ts` is the single source for it.
- The loader imports the platform packages with LITERAL specifiers, because `bun build --compile` has to see the
  `import("./libopentui.so", { type: "file" })` inside them to embed the library in a binary. A computed specifier is
  invisible to the bundler and the compiled binary silently loses its library. Keep the literals literal.
- Those literals, the manifest's `optionalDependencies` and the build script's package names have to agree.
  `packages/core/src/published-package.test.ts` fails when they drift; run it after touching any of them.
- A leftover `@opentui/core-<target>` reference loads the UNPATCHED upstream library next to the patched JS. That is an
  ABI mismatch, not a fallback — the same guard fails on it.
- The version is `<upstream version>-fork.N` (upstream version + release counter). It is a prerelease of the upstream
  version, so consumers have to ask for it explicitly. Bump it in `packages/core/package.json` AND in the
  `optionalDependencies` pins together — the pins are exact versions.
- Publish with `bun scripts/publish-fork.ts --native-dir <dir>`: the platform packages first, then the core, so an
  install never sees the core without its library. The `publish-npm` workflow does this from CI.
- The fork ships NO native video. Upstream links a decode-only LGPL FFmpeg into the native library
  for `VideoRenderable`; the fork's consumers do not use it, and the decoder costs ~3 MB per published library plus
  minutes of build time per target. So the native build runs without an FFmpeg prefix: `packages/native`'s
  `prepare:zig` prepares the vendored sources only, the build compiles the video shim in its "unavailable" mode, and
  `VideoRenderable` exists but every open fails as unavailable. Keep it that way until a consumer needs real video.
- The native packages carry the vendored licenses (Ghostty, wuffs, stb, libwebp, lcms2). The list lives in
  `packages/core/scripts/native-package.ts`; the build and the publish path stage through it, so a new vendored
  dependency has to be added there — a published package missing a license is a legal problem, not a style one.
- The published package must be SELF-CONTAINED: a consumer that installs it under its own name has no `@opentui/core`
  to resolve, so the build rewrites the package's self-imports to relative paths (`scripts/published-self-imports.ts`,
  AST-based so generated code in a template literal survives). The build FAILS if a self-import survives, and
  `bun run test:dist` asserts it. A new relative import in a transpiled entry point also needs its target emitted into
  the dist — the runtime plugin is transpiled, not bundled, so `./published-package.js` has to exist as a file.
- The runtime plugin registers the published name (`@clarkarch/opentui-fork` and `/testing`) next to `@opentui/core`,
  so a plugin that imports the fork by either name reaches the HOST's core instance instead of loading a second copy.
- Upstream's curated `ghostty-zig-0.17.patch` was written for a build that DISABLES the Kitty graphics protocol
  (`-Dvt-features=-kitty-graphics,-glyph-protocol`). Zig analyzes function bodies lazily, so that build never analyzed
  the kitty-graphics code path and its Zig 0.17 breakages survived the patch — the fork ENABLES the protocol, so it hit
  them. The fork therefore carries its OWN patch layer, applied AFTER upstream's:
  `packages/native/src/vendor/zig-deps/ghostty-kitty-graphics-zig-0.17.patch`. The concrete breakage was Zig 0.17 giving
  `std.ArrayList` a `pointer_stability` field, which breaks the struct literals that adopt an owned slice; the curated
  patch fixed two of the three in `graphics_image.zig` and missed one. Only API migrations are taken from Ghostty's own
  0.17 tree — its unrelated feature changes stay out.
- A vendored patch written for a FEATURE-DISABLED build only covers the code that build actually analyzed. When the fork
  turns a protocol ON that upstream turns OFF, the newly-live code needs its own audit against the upstream Zig version,
  not just the vendored patch.
- The fork carries an **aspect-preserving placement** patch (`OT_IMAGE_DRAW_PRESERVE_ASPECT`): the Kitty and Sixel
  writers used to resize a placement's source to the placement's pixel box, and a cell grid makes a mismatched box the
  common case (the fitted cell size is rounded). A "fit" placement is now letterboxed inside its box instead — the art
  keeps its shape and the box gets transparent margins. The point is not only geometry: the old resize was a RESAMPLE,
  so a small raster was both warped and softened by the area filter. Letterboxing keeps a source that already fits the
  box at its native size (no resample at all), so it stays crisp. `fill` (stretch) and `cover` (crop) are unchanged, and
  a zeroed options record still stretches.
  - Two limits of the letterbox, learned from tfm: the margins are TRANSPARENT and Sixel DROPS alpha < 128 pixels
    (index 255), so a padded source becomes a HOLE in the payload — a caller that wants a filled box should render the
    source at the box's aspect itself (tfm renders its icon rasters into the EXACT placement box for this reason). And
    the flag is inert for a Kitty placement the writer does not resize: a small placement is transmitted as-is and the
    TERMINAL scales it into the cell rect, so only the caller's own pixels can make that 1:1.

## Portable FFI

- Portable symbol signatures must stay within the `node:ffi`/`bun:ffi` intersection. Use explicit widths such as
  `u32`/`u64`, not backend-only ABI names such as `usize`, `napi_env`, or `napi_value`; represent `i64`/`u64` as `bigint`,
  native booleans as `0`/`1`, and shared pointers as `number | bigint`.
- Default to `buffer` for transient, non-null `TypedArray` parameters and pass the view directly. Do not call `ptr()`.
- For a raw `ArrayBuffer`, create one `Uint8Array` view over it, keep that view, and declare `buffer`. A `buffer` call
  costs less than a `ptr` call. `buffer` rejects an argument that is not a view with a `TypeError`. `ptr` sends a bad
  argument to native code as an address.
- Use `ptr` only when a parameter can be null, accepts a numeric native address, or is a callback. Pass transient owner
  objects directly to `ptr` parameters. Do not pre-resolve them.
- Bun 1.3 does not accept `DataView` directly for `buffer` or `ptr` parameters. Pass an equivalent typed array such as
  `new Uint8Array(view.buffer, view.byteOffset, view.byteLength)`.
- On Bun 1.4+, use `buffer` when you pass a `DataView` directly to FFI.
- Use `ptr(view)` only when native code stores the address beyond the call. Before resolving it, access `view.buffer` to
  move any inline typed-array storage into a stable `ArrayBuffer`, then keep the view alive for the complete native
  lifetime. The order is required: `const owner = view.buffer; const address = ptr(view)`. Calling `ptr(view)` first and
  accessing `view.buffer` later can move the storage and invalidate `address`.
- Model C-string inputs as pointer parameters and pass owned, NUL-terminated byte buffers directly; string returns are
  not portable. Create callbacks through the loaded library/platform facade, not `new JSCallback(...)`, and assume only
  same-thread callbacks.
