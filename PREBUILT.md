# Prebuilt artifacts (tfm fork)

This branch carries two build outputs so consumers that do not run a native
toolchain can use the fork as-is:

- `packages/core/dist/` — the built `@opentui/core` package (`bun run build:lib` in
  `packages/core`; the workspace-wide `bun run build` also works, but it re-bundles core
  once per sibling package — six redundant passes).
- `packages/native/lib/{x86_64-linux,aarch64-linux}/libopentui.so` — the patched native
  library (`zig build -Doptimize=ReleaseFast`, zig 0.16.0).

They are the files downstream projects (tfm's `file:../opentui-fork/packages/core/dist`
dependency plus its `scripts/sync-opentui-lib.sh`) load. **Rebuild and commit both
after any change under `packages/core/src` or `packages/native/src`:**

```sh
cd packages/native
zig build -Doptimize=ReleaseFast                                          # host target
zig build -Doptimize=ReleaseFast -Dlibrary-target=aarch64-linux-gnu.2.17  # cross, no SDK needed
cd ../core && bun run build:lib
# `dist` and `lib` are gitignored, so a plain `git add` skips the artifacts — hence -f.
# Name the two .so files individually: `git add -f packages/native/lib` would also
# commit the ignored libopentui.a (~43 MB) and opentui.h.
git add -f packages/core/dist \
  packages/native/lib/x86_64-linux/libopentui.so \
  packages/native/lib/aarch64-linux/libopentui.so
git commit -m "build: refresh prebuilt dist and libopentui"
```

Committed targets: `x86_64-linux` + `aarch64-linux` (the two Linux release
arches; `dist/` is architecture-independent JS). Add the *-musl triples if a
musl host ever needs one.
