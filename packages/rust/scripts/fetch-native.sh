#!/bin/sh
# Downloads the native artifacts for one platform from the fork's release.
#
# Usage: sh packages/rust/scripts/fetch-native.sh <target> [directory]
#
#   <target>     the artifact directory name: x86_64-linux, aarch64-linux,
#                x86_64-linux-musl, aarch64-linux-musl, x86_64-macos,
#                aarch64-macos, x86_64-windows, aarch64-windows
#   <directory>  where to put them (default: a fresh directory under the
#                system temporary directory)
#
# The release assets are named `native-<target>-<file>`; the crates' build
# script wants the plain file names in ONE directory, which is what this
# writes. It prints that directory, so a shell can use it directly:
#
#   export OPENTUI_LIB_DIR=$(sh packages/rust/scripts/fetch-native.sh x86_64-macos)
#   cargo build
#
# The repository itself carries the Linux artifacts, so a Linux consumer needs
# nothing here: the crates find them in the git dependency's clone. This is
# for the other platforms.
set -eu

usage() {
    echo "usage: sh $(basename "$0") <target> [directory]" >&2
    echo "targets: x86_64-linux aarch64-linux x86_64-linux-musl aarch64-linux-musl" >&2
    echo "         x86_64-macos aarch64-macos x86_64-windows aarch64-windows" >&2
    exit 2
}

[ $# -ge 1 ] && [ $# -le 2 ] || usage

target=$1
dir=${2:-}

case "$target" in
    x86_64-linux | aarch64-linux | x86_64-linux-musl | aarch64-linux-musl | \
        x86_64-macos | aarch64-macos | x86_64-windows | aarch64-windows) ;;
    *) usage ;;
esac

REPO=clarkarch/opentui-fork
RELEASE=native-latest

command -v gh >/dev/null 2>&1 || {
    echo "error: gh (the GitHub CLI) is required to download the release" >&2
    exit 1
}

if [ -z "$dir" ]; then
    dir=$(mktemp -d)
else
    mkdir -p "$dir"
fi
dir=$(CDPATH='' cd -- "$dir" && pwd)

# The manifest names every asset of a target, so the download is exact.
assets=$(gh release download "$RELEASE" --repo "$REPO" \
    --pattern "native-${target}-*" --dir "$dir" 2>&1) || {
    echo "error: could not download the $target assets from $RELEASE:" >&2
    echo "$assets" >&2
    exit 1
}

# The assets carry the target in their name; the directory holds the plain
# names, because that is what the crates' build script looks for.
for file in "$dir"/native-${target}-*; do
    [ -f "$file" ] || continue
    name=$(basename "$file")
    name=${name#native-${target}-}
    mv "$file" "$dir/$name"
done

if [ ! -f "$dir/opentui.h" ]; then
    echo "error: the release has no header for $target; the crates cannot link without it" >&2
    exit 1
fi

echo "$dir"
