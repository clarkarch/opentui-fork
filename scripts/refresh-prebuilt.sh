#!/bin/sh
# Refreshes the committed prebuilt artifacts from what CI published.
#
# Usage: sh scripts/refresh-prebuilt.sh
#
# The fork carries two build outputs: the core package's dist/ and the native
# library for the two committed Linux targets. CI builds both — the release
# `native-latest` carries the native artifacts, npm carries the core package —
# and this script copies them into the tree, so nothing is built by hand.
#
# It refuses to write a header the Rust bindings were not generated from: the
# crates check that hash when they link, and a mismatch breaks every consumer.
set -eu

ROOT=$(CDPATH='' cd -- "$(dirname -- "$0")/.." && pwd)
cd "$ROOT"

REPO=clarkarch/opentui-fork
RELEASE=native-latest
TARGETS="x86_64-linux aarch64-linux"

for tool in gh npm bun; do
    command -v "$tool" >/dev/null 2>&1 || {
        echo "error: required tool not found: $tool" >&2
        exit 1
    }
done

version=$(bun -e 'console.log((await Bun.file("packages/core/package.json").json()).version)')
echo "Refreshing the prebuilt artifacts for $version"

work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT

# The native artifacts: the library, the static archive, and the header.
#
# Each file is downloaded by its exact name. A glob ("native-x86_64-linux-*")
# also matches the musl assets, which are a different platform.
for target in $TARGETS; do
    echo "native: $target"
    mkdir -p "$work/$target"
    for file in libopentui.so libopentui.a opentui.h; do
        gh release download "$RELEASE" --repo "$REPO" \
            --pattern "native-${target}-${file}" --dir "$work/$target"
    done
done

# The header and the bindings must agree: the crates compare this hash when
# they link, and a mismatch is a broken consumer, not a warning. The check
# runs before anything is copied, so a mismatch leaves the tree untouched.
bun -e '
const header = await Bun.file(process.argv[1]).bytes()
const generated = await Bun.file("packages/rust/crates/opentui-sys/src/generated.rs").text()
let hash = 0xcbf2_9ce4_8422_2325n
for (const byte of header) hash = BigInt.asUintN(64, (hash ^ BigInt(byte)) * 0x0100_0000_01b3n)
const expected = generated.match(/pub const OPENTUI_HEADER_FNV1A64: u64 = 0x([0-9a-f]+);/)?.[1]
if (!expected) throw new Error("the generated bindings carry no header hash")
const actual = hash.toString(16).padStart(16, "0")
if (actual !== expected) {
  throw new Error(`the header hashes to ${actual}, the bindings expect ${expected}`)
}
console.log(`header: ${actual} matches the bindings`)
' "$work/x86_64-linux/native-x86_64-linux-opentui.h"

for target in $TARGETS; do
    dir="packages/native/lib/$target"
    mkdir -p "$dir"
    for file in libopentui.so libopentui.a opentui.h; do
        cp "$work/$target/native-${target}-${file}" "$dir/$file"
    done
done

# The core package: its published tarball carries the built dist, at the
# package root.
echo "core: @clarkarch/opentui-fork@$version"
npm pack "@clarkarch/opentui-fork@$version" --pack-destination "$work" >/dev/null
tarball=$(ls "$work"/*.tgz)
mkdir -p "$work/package"
tar -xzf "$tarball" -C "$work/package"
rm -rf packages/core/dist
mkdir -p packages/core/dist
cp -R "$work/package/package/." packages/core/dist/

echo
echo "Refreshed:"
ls -l packages/native/lib/x86_64-linux packages/native/lib/aarch64-linux
echo
echo "Commit with:"
echo "  git add -f packages/core/dist packages/native/lib"
echo "  git commit -m 'build: refresh the prebuilt artifacts'"
