<p align="center">
  <a href="https://opentui.com">
    <img alt="OpenTUI logo" src="https://opentui.com/opentui-logo-auto.svg" width="270" />
  </a>
</p>

<div align="center">
    <a href="https://www.npmjs.com/package/@opentui/core"><img alt="npm version" src="https://img.shields.io/npm/v/@opentui/core?style=flat-square" /></a>
    <a href="https://github.com/anomalyco/opentui/actions/workflows/build-core.yml"><img alt="Core build status" src="https://img.shields.io/github/actions/workflow/status/anomalyco/opentui/build-core.yml?style=flat-square&branch=main" /></a>
</div>

OpenTUI is a library to build terminal user interfaces.

- It is written in Zig.
- You write TypeScript directly or through React and Solid.
- You arrange boxes and text with flexbox.
- You add selects, inputs, and scroll boxes with keyboard and mouse controls.
- You can play sounds, show images, play videos, and render 3D graphics.

OpenCode uses OpenTUI in production for millions of users.

[Website](https://opentui.com) | [Documentation](https://opentui.com/docs) | [Packages](https://opentui.com/packages)

## This fork

This is a fork of `anomalyco/opentui` on the `tfm` branch, carrying patches
that upstream does not have yet — a per-image placement opacity, a translucent
fill that dims the images it covers instead of deleting them, and an embedded
terminal that renders kitty graphics (including the unicode-placeholder
style). The patches live in the Zig native layer, so they need the matching
TypeScript bindings; `bun run build:lib` refuses to build when the generated
ABI is stale.

The fork is published to npm as `@clarkarch/opentui-fork`. Use it like the
upstream core, without changing a single import:

```jsonc
"dependencies": {
  "@opentui/core": "npm:@clarkarch/opentui-fork@0.8.4-fork.3"
}
```

Or install it under its own name, when the import name does not have to stay
`@opentui/core`:

```jsonc
"dependencies": {
  "@clarkarch/opentui-fork": "0.8.4-fork.3"
}
```

The published package is self-contained: it never imports itself by the
upstream name, so both spellings work.

The versions are `0.8.4-fork.N` — the upstream version the fork tracks, plus
the fork's release counter. They are prereleases, so ask for them explicitly
(`^0.8.4-fork.3`); a plain `^0.8.4` does not match them.

For Rust, depend on this repository. The fork's default branch is the branch
with the patches, so no branch, tag, or revision is needed, and the crate
names stay upstream's:

```toml
[dependencies]
opentui = { git = "https://github.com/clarkarch/opentui-fork", features = ["tokio", "tree-sitter"] }
```

`cargo update` moves it; `Cargo.lock` pins the commit. The native library
travels with the repository, so a build needs no native toolchain. See
[packages/rust/README.md](packages/rust/README.md).

See [PREBUILT.md](PREBUILT.md) for what the branch carries and how to publish
it.

## Packages

- [`@opentui/core`](packages/core) - Native terminal UI library with TypeScript bindings.
- [`@opentui/react`](packages/react) - React renderer for building terminal user interfaces with OpenTUI Core.
- [`@opentui/solid`](packages/solid) - Solid renderer for building terminal user interfaces with OpenTUI Core.
- [`@opentui/keymap`](packages/keymap) - Key binding and command routing library for terminal and browser applications.
- [`@opentui/qrcode`](packages/qrcode) - QR code encoder and renderable with React and Solid surfaces.
- [`@opentui/three`](packages/three) - Three.js WebGPU renderer for OpenTUI.
- [`@opentui/ssh`](packages/ssh) - SSH server integration for OpenTUI applications.

**Private packages**

- [`@opentui/native`](packages/native) - Private workspace with the Zig implementation, native tests, and benchmarks.
- [`@opentui/examples`](packages/examples) - Private workspace with example applications and a standalone examples executable.
- [`@opentui/web`](packages/web) - Private workspace with the documentation website and the AI agent skill.
- [`packages/rust`](packages/rust) - Unpublished Rust bindings for the native C ABI and a framework built on them.

## AI agent skill

Install the OpenTUI documentation as a skill for your AI coding assistant with [`npx skills`](https://skills.sh):

```bash
npx skills add https://opentui.com --skill opentui
```

Add `-g` to install the skill globally. The skill matches the latest release, and `npx skills update` moves it to each
new release. Install from `https://opentui.com/docs/next` to follow the main branch. A skill installed with
`npx skills add anomalyco/opentui` follows the main branch; run the command above to switch it to releases.

## Development

Development requires Bun 1.4.1 or later and Zig 0.17.1.

See [AGENTS.md](AGENTS.md) for engineering, tooling, and verification conventions.

```bash
bun install
```

Run package scripts from their package directory. Run `bun run build` from the repository root after you change
native code or cross-package build outputs. Ordinary TypeScript changes do not require a root build.

Run repository tests and static checks from the repository root:

```bash
bun run test
bun run fmt:check
bun run lint
```

To link the source packages into a Bun-managed project, install that project's dependencies, then run
`./scripts/link-opentui-dev.sh /path/to/project` from the repository root. Add `--react` or `--solid` when needed.

## Contributing

OpenTUI is open for contributions.

## License

OpenTUI is licensed under the [MIT License](LICENSE).
