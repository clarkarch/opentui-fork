# Prebuilt artifacts (tfm fork)

This branch carries two build outputs so consumers that do not run a native
toolchain can use the fork as-is:

- `packages/core/dist/` — the built `@opentui/core` package (`bun run build:lib` in
  `packages/core`; the workspace-wide `bun run build` also works, but it re-bundles core
  once per sibling package — six redundant passes).
- `packages/native/lib/{x86_64-linux,aarch64-linux}/libopentui.so` — the patched native
  library (`zig build -Doptimize=ReleaseFast`, zig 0.16.0).

They are the build outputs this branch carries. Downstream projects do NOT
point at them: they install the published npm packages (see below), whose
platform packages carry the stripped library for every target. **Rebuild and
commit both after any change under `packages/core/src` or `packages/native/src`:**

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
arches; `dist/` is architecture-independent JS). Add the \*-musl triples if a
musl host ever needs one.

## Released artifacts (all targets)

The committed Linux binaries only cover Linux hosts. The `native-artifacts`
workflow builds **every** supported target and publishes it as the GitHub
release `native-latest`, together with `native-artifacts.json`:

```json
{
  "generatedAt": "...",
  "artifacts": {
    "x86_64-linux": {
      "file": "libopentui.so",
      "asset": "native-x86_64-linux-libopentui.so",
      "sha256": "...",
      "bytes": 5451896
    }
  }
}
```

Consumers fetch the asset for their host from that manifest. The asset names
follow `native-<target>-<file>`, where `<target>` is the directory name under
`packages/native/lib` and `<file>` is `libopentui.so`, `libopentui.dylib` or
`opentui.dll`.

The release copies are stripped; the committed Linux copies keep their debug
symbols. Build them locally with:

```sh
cd packages/native
zig build -Doptimize=ReleaseFast -Dlibrary-target=x86_64-windows-gnu  # cross from Linux
```

macOS targets need a macOS build host — Zig cannot link Darwin without the
macOS SDK.

## Published packages (npm)

The fork is also published to npm, under its own scope:

| package | contents |
| --- | --- |
| `@clarkarch/opentui-fork` | the JS/TS core (this is `packages/core/dist`) |
| `@clarkarch/opentui-fork-<platform>-<arch>[-<abi>]` | one native library per target |

The per-platform packages are `optionalDependencies` of the core, so an
install pulls only the library for the host. Their `index.bun.js` imports the
library with `{ type: "file" }`, which is what lets `bun build --compile` embed
it in a binary.

The **published** names differ from the in-repo package name (`@opentui/core`),
on purpose: the monorepo's internal imports and the upstream rebase stay
untouched, while the artifacts on npm carry the fork's name. The loader imports
the platform packages with LITERAL specifiers, so the names in
`packages/core/src/published-package.ts`, in `runtime-assets.bun.ts` and in the
build script have to agree — `packages/core/src/published-package.test.ts`
fails when they drift.

The published output must also be **self-contained**: a consumer that installs
the package under its own name (`@clarkarch/opentui-fork`) has no
`@opentui/core` to resolve, so the build rewrites the package's self-imports
to relative paths. The rewrite is AST-based, so generated code in a template
literal (the asset updater writes the consumer's parser file with one) is left
alone, and the build fails if a self-import survives. `bun run test:dist`
asserts both.

Versions are `0.8.0-fork.N`: the upstream version the fork is based on, plus
the fork's own release counter. They are prereleases of the upstream version,
so a consumer has to ask for them explicitly (`^0.8.0-fork.1`), which is what
`package.json` pins.

To publish:

1. Bump the version in `packages/core/package.json` and the `optionalDependencies`
   pins to match.
2. Rebuild and commit the prebuilt `dist/` (the recipe above).
3. Push, then run the `publish-npm` workflow. It builds the native library for
   every target, downloads them, and publishes the platform packages first and
   the core second, so an install never sees the core without its library.

The publish step skips a version npm already has: npm cannot republish a
version, and the native libraries are rebuilt on every run, so a rerun always
sees different bytes for a published version. Skipping is what makes a
PARTIAL release resumable — the packages that landed stay, the rest are
published. The libraries are stripped with `llvm-strip`, which understands
every target architecture; the host's `strip` only understands the host's, so
the aarch64 libraries used to ship with all their symbols (29 MB instead of
5 MB).

The workflow authenticates with npm's **trusted publishing** (OIDC): the
packages need a trusted publisher configured on npmjs.com (the repository and
this workflow), and the workflow asks for `id-token: write`. The `NPM_TOKEN`
repository secret is the fallback — when it is set, it is used instead, so the
workflow still works before the trusted publisher is configured.

A local dry run stages the packages without publishing:

```sh
bun scripts/publish-fork.ts --native-dir packages/native/lib --dry-run
```

