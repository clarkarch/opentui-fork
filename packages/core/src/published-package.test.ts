import { describe, expect, test } from "bun:test"
import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { PUBLISHED_CORE_NAME, publishedPlatformPackageName } from "./published-package.js"
import { getNativeAssetDescriptor } from "./node-asset-target.js"

const srcDir = dirname(fileURLToPath(import.meta.url))

// Every target the fork ships a native library for. The list mirrors
// scripts/variants.ts, which is what the build enumerates.
const PLATFORM_TARGETS = [
  "darwin-x64",
  "darwin-arm64",
  "linux-x64",
  "linux-arm64",
  "linux-x64-musl",
  "linux-arm64-musl",
  "win32-x64",
  "win32-arm64",
] as const

describe("published package names", () => {
  test("the bun loader imports every platform package with a literal specifier", () => {
    const source = readFileSync(join(srcDir, "platform/runtime-assets.bun.ts"), "utf8")
    const specifiers = [...source.matchAll(/import\("([^"]+)"/g)].map((match) => match[1]!)
    const platformSpecifiers = specifiers.filter((specifier) => specifier.startsWith(`${PUBLISHED_CORE_NAME}-`))

    // A computed specifier would be invisible to `bun build --compile`, which
    // has to see the file import inside the platform package to embed the
    // native library. One literal per target, no duplicates, no leftovers.
    expect(platformSpecifiers).toHaveLength(PLATFORM_TARGETS.length)
    expect(new Set(platformSpecifiers)).toEqual(new Set(PLATFORM_TARGETS.map(publishedPlatformPackageName)))
  })

  test("the manifest lists the same platform packages as optional dependencies", () => {
    const manifest = JSON.parse(readFileSync(join(srcDir, "..", "package.json"), "utf8")) as {
      optionalDependencies?: Record<string, string>
    }
    expect(Object.keys(manifest.optionalDependencies ?? {}).sort()).toEqual(
      PLATFORM_TARGETS.map(publishedPlatformPackageName).sort(),
    )
  })

  test("the manifest pins the platform packages to the core version", () => {
    const manifest = JSON.parse(readFileSync(join(srcDir, "..", "package.json"), "utf8")) as {
      version: string
      optionalDependencies?: Record<string, string>
    }
    for (const version of Object.values(manifest.optionalDependencies ?? {})) {
      expect(version).toBe(manifest.version)
    }
  })

  test("the node loader resolves the platform package through the descriptor", () => {
    const descriptor = getNativeAssetDescriptor({ platform: "linux", arch: "x64" })
    expect(descriptor.packageName).toBe(publishedPlatformPackageName("linux-x64"))
    expect(descriptor.key).toBe(`${publishedPlatformPackageName("linux-x64")}/libopentui.so`)
  })

  test("no source file is left pointing at the upstream platform packages", () => {
    // The loader, the benchmarks and the build scripts all have to name the
    // fork's platform packages. A leftover `@opentui/core-*` would make the
    // bundler load the UNPATCHED upstream library instead of the fork's.
    const files = [
      join(srcDir, "platform", "runtime-assets.bun.ts"),
      join(srcDir, "platform", "runtime-assets.node.ts"),
      join(srcDir, "node-asset-target.ts"),
      join(srcDir, "benchmark", "ffi-fast-path-benchmark.ts"),
      join(srcDir, "benchmark", "ffi-fast-path-paired-benchmark.ts"),
      join(srcDir, "benchmark", "ffi-fast-path-stress.ts"),
      join(srcDir, "benchmark", "render-runtime-benchmark.ts"),
      join(srcDir, "..", "scripts", "build.ts"),
      join(srcDir, "..", "scripts", "native-package.ts"),
      join(srcDir, "..", "..", "..", "scripts", "publish-fork.ts"),
    ]
    for (const file of files) {
      const source = readFileSync(file, "utf8")
      expect(source).not.toContain("@opentui/core-")
    }
  })
})
