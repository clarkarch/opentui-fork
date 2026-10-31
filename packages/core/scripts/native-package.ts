import { copyFileSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { PUBLISHED_BUGS, PUBLISHED_HOMEPAGE, PUBLISHED_REPOSITORY } from "../src/published-package"

/**
 * Staging of the per-platform native packages.
 *
 * A native package is a tiny npm package that holds ONE file — the compiled
 * library — plus the entry points that resolve it. The Bun entry point imports
 * the library with `{ type: "file" }`, which is what lets `bun build --compile`
 * see the file and embed it in a binary. The Node entry point returns its path.
 *
 * The build script (a local `zig build`) and the publish script (libraries
 * built by CI and downloaded as artifacts) both stage through here, so the
 * package shape and the license set cannot drift apart.
 */

export interface NativeTarget {
  readonly platform: string
  readonly arch: string
  readonly abi?: string
}

export interface NativePackageMetadata {
  readonly version: string
  readonly license?: string
  readonly author?: string
  readonly keywords?: string[]
}

/** The library file name per platform — the same names the zig build emits. */
export function nativeLibraryFileName(platform: string): string {
  if (platform === "darwin") return "libopentui.dylib"
  if (platform === "win32") return "opentui.dll"
  return "libopentui.so"
}

/** The directory name under packages/native/lib that holds the library. */
export function zigTargetDirectory(target: NativeTarget): string {
  const platformMap: Record<string, string> = { darwin: "macos", win32: "windows", linux: "linux" }
  const archMap: Record<string, string> = { x64: "x86_64", arm64: "aarch64" }
  const base = `${archMap[target.arch] ?? target.arch}-${platformMap[target.platform] ?? target.platform}`
  return target.abi ? `${base}-${target.abi}` : base
}

/** The npm package name that carries the library for one target. */
export function nativePackageName(target: NativeTarget, publishedCoreName: string): string {
  return `${publishedCoreName}-${target.platform}-${target.arch}${target.abi ? `-${target.abi}` : ""}`
}

export interface LicenseSources {
  readonly licensePath: string
  readonly ghosttyLicensePath: string
  readonly nativeRoot: string
}

/**
 * Writes one native package into `destination`.
 *
 * `libraryPath` is the compiled library; it is copied next to the entry points
 * so the relative `./<library>` specifier in them resolves.
 */
export function stageNativePackage(options: {
  readonly destination: string
  readonly target: NativeTarget
  readonly libraryPath: string
  readonly packageName: string
  readonly metadata: NativePackageMetadata
  readonly licenses: LicenseSources
  readonly publishedCoreName: string
}): void {
  const { destination, target, libraryPath, packageName, metadata, licenses } = options
  const libraryFileName = nativeLibraryFileName(target.platform)

  rmSync(destination, { recursive: true, force: true })
  mkdirSync(destination, { recursive: true })
  copyFileSync(libraryPath, join(destination, libraryFileName))

  writeFileSync(
    join(destination, "index.js"),
    `import { fileURLToPath } from "node:url"\n\nexport default fileURLToPath(new URL("./${libraryFileName}", import.meta.url))\n`,
  )
  writeFileSync(
    join(destination, "index.bun.js"),
    `const module = await import("./${libraryFileName}", { with: { type: "file" } })\n\nexport default module.default\n`,
  )
  writeFileSync(join(destination, "index.d.ts"), "declare const path: string\nexport default path\n")

  writeFileSync(
    join(destination, "package.json"),
    JSON.stringify(
      {
        name: packageName,
        version: metadata.version,
        description: `Prebuilt ${target.platform}-${target.arch}${target.abi ? `-${target.abi}` : ""} binaries for ${options.publishedCoreName}`,
        type: "module",
        main: "index.js",
        module: "index.js",
        types: "index.d.ts",
        license: metadata.license,
        author: metadata.author,
        homepage: PUBLISHED_HOMEPAGE,
        repository: PUBLISHED_REPOSITORY,
        bugs: PUBLISHED_BUGS,
        keywords: [...(metadata.keywords ?? []), "prebuild", "prebuilt"],
        exports: {
          ".": {
            bun: "./index.bun.js",
            import: "./index.js",
            types: "./index.d.ts",
          },
        },
        os: [target.platform],
        cpu: [target.arch],
        ...(target.abi ? { libc: [target.abi] } : {}),
      },
      null,
      2,
    ),
  )

  writeFileSync(
    join(destination, "README.md"),
    `## ${packageName}\n\n> Prebuilt ${target.platform}-${target.arch}${target.abi ? `-${target.abi}` : ""} binaries for \`${options.publishedCoreName}\`.\n`,
  )

  if (existsSync(licenses.licensePath)) copyFileSync(licenses.licensePath, join(destination, "LICENSE"))
  for (const [source, destinationName] of [
    [licenses.ghosttyLicensePath, "LICENSE-GHOSTTY"],
    [join(licenses.nativeRoot, "src", "vendor", "wuffs", "LICENSE"), "LICENSE-WUFFS"],
    [join(licenses.nativeRoot, "src", "vendor", "stb", "LICENSE"), "LICENSE-STB"],
    [join(licenses.nativeRoot, "src", "vendor", "libwebp", "COPYING"), "LICENSE-LIBWEBP"],
    [join(licenses.nativeRoot, "src", "vendor", "libwebp", "PATENTS"), "PATENTS-LIBWEBP"],
    [join(licenses.nativeRoot, "src", "vendor", "libwebp", "AUTHORS"), "AUTHORS-LIBWEBP"],
    [join(licenses.nativeRoot, "src", "vendor", "lcms2", "LICENSE"), "LICENSE-LCMS2"],
  ] as const) {
    if (!existsSync(source)) throw new Error(`Required native license file is missing: ${source}`)
    copyFileSync(source, join(destination, destinationName))
  }
}
