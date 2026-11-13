# Prebuilt artifacts (tfm fork)

This branch carries two build outputs so consumers that do not run a native
toolchain can use the fork as-is:

- `packages/core/dist/` — the built `@opentui/core` package (`bun run build:lib` in
  `packages/core`; the workspace-wide `bun run build` also works, but it re-bundles core
  once per sibling package — six redundant passes).
- `packages/native/lib/{x86_64-linux,aarch64-linux}/` — the patched native
  library, the static archive, and the header (`zig build -Doptimize=ReleaseFast`, zig
  0.17.1). The Rust crates need all three: the archive (or the shared library) to link,
  and the header, which they check against the bindings they were generated from.

**CI builds these. Nothing is built by hand.** After a change under
`packages/core/src` or `packages/native/src`:

1. Push the change. The `native-artifacts` workflow builds every target and
   publishes the stripped libraries, the static archives, and the headers as
   the GitHub release `native-latest`; the `publish-npm` workflow publishes the
   npm packages.
2. Copy that output into the tree and commit it:

   ```sh
   sh scripts/refresh-prebuilt.sh
   git add -f packages/core/dist packages/native/lib
   git commit -m "build: refresh the prebuilt artifacts"
   ```

   The script downloads the release assets for the two committed Linux targets
   and the published npm package's `dist/`, and it refuses to finish when the
   header does not hash to what the Rust bindings were generated from — that
   mismatch breaks every Rust consumer, so it is an error, not a warning.

   The manual equivalent, if the script cannot run:

   ```sh
   for target in x86_64-linux aarch64-linux; do
     mkdir -p "packages/native/lib/$target"
     # One file at a time, by its exact name: a pattern would fetch the musl
     # assets too, and they would land in the same directory.
     for file in libopentui.so libopentui.a opentui.h; do
       gh release download native-latest --repo clarkarch/opentui-fork \
         --pattern "native-${target}-${file}" --dir /tmp/native-$target
       cp "/tmp/native-$target/native-${target}-${file}" "packages/native/lib/$target/"
     done
   done
   npm pack @clarkarch/opentui-fork@0.8.4-fork.3 --pack-destination /tmp
   tar -xzf /tmp/clarkarch-opentui-fork-0.8.4-fork.3.tgz -C /tmp
   rm -rf packages/core/dist && mkdir -p packages/core/dist
   cp -R /tmp/package/. packages/core/dist/
   # `dist` and `lib` are gitignored, so a plain `git add` skips the artifacts — hence -f.
   git add -f packages/core/dist packages/native/lib
   git commit -m "build: refresh the prebuilt artifacts"
   ```

The committed copies are the CI's **stripped** output: 5.9 MB for the shared
library, 8.5 MB for the static archive, 209 KB for the header. Unstripped, the
same files are 33 MB and 51 MB, and the repository carries every version it ever
committed, so stripping keeps the history small.

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
      "bytes": 5988800,
      "files": {
        "libopentui.a": {
          "file": "libopentui.a",
          "asset": "native-x86_64-linux-libopentui.a",
          "sha256": "...",
          "bytes": 8508396
        },
        "opentui.h": {
          "file": "opentui.h",
          "asset": "native-x86_64-linux-opentui.h",
          "sha256": "...",
          "bytes": 212518
        }
      }
    }
  }
}
```

Consumers fetch the asset for their host from that manifest. The asset names
follow `native-<target>-<file>`, where `<target>` is the directory name under
`packages/native/lib` and `<file>` is `libopentui.so`, `libopentui.dylib` or
`opentui.dll`. The `file`/`asset`/`sha256`/`bytes` of the entry's top level are
the shared library, the shape existing consumers read; the `files` map holds
the static archive and the header beside it.

Fetch every asset **by its exact name**. A pattern does not do: the pattern
`native-x86_64-linux-*` also matches the musl assets, so a consumer on glibc
would end up with the musl library. `packages/rust/scripts/fetch-native.sh` does
it right, and checks every file against the checksum the release reports:

```sh
export OPENTUI_LIB_DIR=$(sh packages/rust/scripts/fetch-native.sh x86_64-macos)
```

The release copies are stripped. They are the ones the committed artifacts are
copied from, so a Rust consumer that depends on this repository links the same
library a release download gives.

Each target publishes its static archive (`native-<target>-libopentui.a`, the
platforms that have one) and its header (`native-<target>-opentui.h`) beside
the library. The Rust crates need the header: they check it against the
bindings they were generated from, so a consumer needs it beside the library
it links.

The native library is built in CI only. To build one locally for a target the
workflow does not cover:

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

Versions are `0.8.4-fork.N`: the upstream version the fork is based on, plus
the fork's own release counter. They are prereleases of the upstream version,
so a consumer has to ask for them explicitly (`^0.8.4-fork.1`), which is what
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

