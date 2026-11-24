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
# Every asset is fetched by its exact name and checked against the checksum
# the release reports. A pattern would not do: `native-x86_64-linux-*` also
# matches the musl assets, and a consumer would get the wrong library.
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
    x86_64-linux | aarch64-linux | x86_64-linux-musl | aarch64-linux-musl) shared=libopentui.so ;;
    x86_64-macos | aarch64-macos) shared=libopentui.dylib ;;
    x86_64-windows | aarch64-windows) shared=opentui.dll ;;
    *) usage ;;
esac

# The files the crates' build script asks for on this platform: the header,
# the library, and the static archive. Windows links its DLL through the
# import library instead of an archive.
case "$target" in
    *-windows) files="opentui.h $shared opentui.lib" ;;
    *) files="opentui.h $shared libopentui.a" ;;
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

# The release's assets with their checksums, one per line: name, checksum.
assets=$(gh release view "$RELEASE" --repo "$REPO" --json assets \
    --jq '.assets[] | [.name, .digest] | @tsv')

for file in $files; do
    asset="native-${target}-${file}"
    checksum=$(printf '%s\n' "$assets" | awk -v name="$asset" '$1 == name { print $2; exit }')
    if [ -z "$checksum" ]; then
        echo "error: the release has no $asset" >&2
        exit 1
    fi

    gh release download "$RELEASE" --repo "$REPO" --pattern "$asset" --dir "$dir" >/dev/null

    if [ -n "$checksum" ]; then
        case "$checksum" in
            sha256:*) expected=${checksum#sha256:} ;;
            *) expected=$checksum ;;
        esac
        if command -v sha256sum >/dev/null 2>&1; then
            actual=$(sha256sum "$dir/$asset" | cut -d' ' -f1)
        else
            actual=$(shasum -a 256 "$dir/$asset" | cut -d' ' -f1)
        fi
        if [ "$actual" != "$expected" ]; then
            echo "error: $asset does not match the checksum the release reports" >&2
            exit 1
        fi
    fi

    # The assets carry the target in their name; the directory holds the plain
    # names, because that is what the crates' build script looks for.
    mv "$dir/$asset" "$dir/$file"
done

if [ ! -f "$dir/opentui.h" ]; then
    echo "error: the release has no header for $target; the crates cannot link without it" >&2
    exit 1
fi

echo "$dir"
