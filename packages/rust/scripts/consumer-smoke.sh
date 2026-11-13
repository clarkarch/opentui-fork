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

cat > "$work/Cargo.toml" <<EOF
[package]
name = "opentui-consumer-smoke"
version = "0.0.0"
edition = "2021"
publish = false

[dependencies]
opentui = { git = "file://$repo" }
EOF

mkdir -p "$work/src"
cat > "$work/src/main.rs" <<'EOF'
fn main() {
    // The dependency has to build and link; the API call only proves the
    // crate's public surface is reachable.
    let _ = opentui::style::Color::TRANSPARENT;
}
EOF

printf '%s\n' "consumer: building against $repo ($platform)"
cd "$work"
cargo build --quiet
printf '%s\n' 'PASS: a project that depends on this repository builds'
