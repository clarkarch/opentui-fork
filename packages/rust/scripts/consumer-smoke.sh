#!/bin/sh
# Builds a throwaway project that depends on this repository the way a
# downstream project does, so a broken consumption path fails here instead of
# in someone else's build.
#
# Usage: sh packages/rust/scripts/consumer-smoke.sh [repo-path]
#
# The repository path defaults to the checkout this script lives in. The
# dependency is a git dependency on it, so Cargo clones the repository and
# builds the crates from the clone, not from the working tree.
#
# The native library comes from where the crates' build script looks for it:
# OPENTUI_LIB_DIR when it is set, otherwise the repository's committed
# artifacts under packages/native/lib/<platform>. A commit that carries no
# artifacts therefore fails here, which is the point.
#
# Both linkages are built: one with the crate's default features (the static
# archive) and one with the defaults off (the shared library). A consumer on a
# platform without the archive needs the second one to work, so both have to
# build. The two builds share one project and one target directory, so the
# second one only rebuilds the crates whose features changed.
#
# "It built" does not say which library it linked, so the binary says: on
# Linux the dynamic section is read, and the program is run, which proves the
# library loads and that its ABI version matches the bindings.

set -eu

here=$(CDPATH='' cd -- "$(dirname -- "$0")" && pwd)
repo=${1:-$(CDPATH='' cd -- "$here/../../.." && pwd)}
repo=$(CDPATH='' cd -- "$repo" && pwd)

case $(uname -s)/$(uname -m) in
    Linux/x86_64) platform=x86_64-linux ;;
    Linux/aarch64) platform=aarch64-linux ;;
    Darwin/arm64) platform=aarch64-macos ;;
    Darwin/x86_64) platform=x86_64-macos ;;
    *) printf '%s\n' 'SKIP: the consumer smoke test supports Linux and macOS only.' >&2; exit 77 ;;
esac

work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT

project="$work/consumer"
mkdir -p "$project/src"
# The same toolchain the crates are tested with, so a consumer does not build
# them with whatever the machine's default happens to be.
[ -f "$repo/packages/rust/rust-toolchain.toml" ] &&
    cp "$repo/packages/rust/rust-toolchain.toml" "$project/rust-toolchain.toml"
cat > "$project/src/main.rs" <<'EOF'
fn main() {
    // The dependency has to build and link; the API call only proves the
    // crate's public surface is reachable.
    let _ = opentui::style::Color::TRANSPARENT;
    // Create a native context, so the link pulls the library in: a consumer
    // that never calls into it would build against any archive, and the
    // context checks the ABI version against the bindings.
    let context = opentui::native::Context::new(opentui::native::ContextOptions::default());
    assert!(context.is_ok(), "the native context could not be created");
}
EOF

libdir=${OPENTUI_LIB_DIR:-$repo/packages/native/lib/$platform}
case $(uname -s) in
    Linux) LD_LIBRARY_PATH="$libdir${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}" ;;
    Darwin) DYLD_LIBRARY_PATH="$libdir${DYLD_LIBRARY_PATH:+:$DYLD_LIBRARY_PATH}" ;;
esac
export LD_LIBRARY_PATH DYLD_LIBRARY_PATH

# build <linkage> <dependency features>
build() {
    linkage=$1
    features=$2

    cat > "$project/Cargo.toml" <<EOF
[package]
name = "opentui-consumer-smoke"
version = "0.0.0"
edition = "2021"
publish = false

[dependencies]
opentui = { git = "file://$repo"$features }
EOF

    printf '%s\n' "consumer: building the $linkage linkage against $repo ($platform)"
    (cd "$project" && cargo build --quiet)

    binary="$project/target/debug/opentui-consumer-smoke"
    if [ "$platform" = x86_64-linux ]; then
        dynamic=$(readelf -d "$binary" 2>/dev/null || true)
        case $dynamic in
            *libopentui.so*) linked=shared ;;
            *) linked=static ;;
        esac
        [ "$linked" = "$linkage" ] || {
            printf 'FAIL: the %s build linked %s\n' "$linkage" "$linked" >&2
            exit 1
        }
    fi

    # Run it: the shared library has to load, and the context has to accept
    # the ABI version the bindings were generated from. A stale library
    # fails here, which is the whole point of carrying the artifacts.
    "$binary" || {
        printf 'FAIL: the %s build does not run against %s\n' "$linkage" "$libdir" >&2
        exit 1
    }
}

# The static archive is the crate's default; turning the defaults off leaves
# the shared library as the only one to link.
build shared ', default-features = false'
build static ''

printf '%s\n' 'PASS: a project that depends on this repository builds'
