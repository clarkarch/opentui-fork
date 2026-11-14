import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { PUBLISHED_BUGS, PUBLISHED_HOMEPAGE, PUBLISHED_REPOSITORY } from "../src/published-package"
import { fnv1a64 } from "./native-abi-rust"
import { zigOutputName, type Variant } from "./variants"

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

export type NativeTarget = Variant

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

/** Rewrites relative README links to point into the fork's published repository. */
export function replaceLinks(text: string): string {
  return text.replace(
    /(\[.*?\]\()(\.\/.*?\))/g,
    (_, p1: string, p2: string) => `${p1}${PUBLISHED_HOMEPAGE}/blob/HEAD/${p2.replace("./", "")}`,
  )
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

export interface StagedNativePackage {
  readonly headerHash: string
}

export function nativePackageManifest(options: {
  readonly target: NativeTarget
  readonly packageName: string
  readonly metadata: NativePackageMetadata
  readonly publishedCoreName: string
}): Record<string, unknown> {
  const { target, packageName, metadata, publishedCoreName } = options
  const targetLabel = `${target.platform}-${target.arch}${target.abi ? `-${target.abi}` : ""}`
  return {
    name: packageName,
    version: metadata.version,
    description: `Prebuilt ${targetLabel} binaries for ${publishedCoreName}`,
    type: "module",
    main: "index.js",
    module: "index.js",
    types: "index.d.ts",
    license: metadata.license ? `${metadata.license} AND LGPL-2.1-or-later` : "LGPL-2.1-or-later",
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
  }
}

/**
 * Writes one native package into `destination`.
 *
 * `libraryPath` is the compiled library; it is copied next to the entry points
 * so the relative `./<library>` specifier in them resolves. `headerPath` points
 * at the header emitted with that library and is checked against the canonical
 * native header before it is shipped. When it is omitted, a header beside the
 * library is used if present; otherwise the canonical header is staged.
 */
export function stageNativePackage(options: {
  readonly destination: string
  readonly target: NativeTarget
  readonly libraryPath: string
  readonly packageName: string
  readonly metadata: NativePackageMetadata
  readonly licenses: LicenseSources
  readonly publishedCoreName: string
  readonly headerPath?: string
  readonly windowsImportLibraryPath?: string
}): StagedNativePackage {
  const { destination, target, libraryPath, packageName, metadata, licenses } = options
  const libraryFileName = nativeLibraryFileName(target.platform)

  const canonicalHeaderPath = join(licenses.nativeRoot, "include", "opentui.h")
  const canonicalHeader = readFileSync(canonicalHeaderPath)
  const siblingHeaderPath = join(dirname(libraryPath), "opentui.h")
  const headerPath = options.headerPath ?? (existsSync(siblingHeaderPath) ? siblingHeaderPath : canonicalHeaderPath)
  const header = readFileSync(headerPath)
  const headerHash = fnv1a64(header)
  const canonicalHeaderHash = fnv1a64(canonicalHeader)
  if (headerHash !== canonicalHeaderHash) {
    throw new Error(
      `${headerPath} (${headerHash}) is not ${canonicalHeaderPath} (${canonicalHeaderHash}); rebuild native`,
    )
  }

  rmSync(destination, { recursive: true, force: true })
  mkdirSync(destination, { recursive: true })
  copyFileSync(libraryPath, join(destination, libraryFileName))
  writeFileSync(join(destination, "opentui.h"), header)

  if (target.platform === "win32") {
    const importLibraryPath = options.windowsImportLibraryPath ?? join(dirname(libraryPath), "opentui.lib")
    if (options.windowsImportLibraryPath !== undefined || existsSync(importLibraryPath)) {
      copyFileSync(importLibraryPath, join(destination, "opentui.lib"))
    }
  }

  writeFileSync(
    join(destination, "index.js"),
    `import { fileURLToPath } from "node:url"\n\nexport default fileURLToPath(new URL("./${libraryFileName}", import.meta.url))\n`,
  )
  writeFileSync(
    join(destination, "index.bun.js"),
    `const module = await import("./${libraryFileName}", { with: { type: "file" } })\n\nexport default module.default\n`,
  )
  writeFileSync(join(destination, "index.d.ts"), "declare const path: string\nexport default path\n")

  const targetLabel = `${target.platform}-${target.arch}${target.abi ? `-${target.abi}` : ""}`

  // Deliberately omit a libc field. npm and Bun skip packages whose libc does
  // not match the host, which would leave the musl import unresolved in a
  // glibc build and break `bun build --compile`.
  writeFileSync(
    join(destination, "package.json"),
    JSON.stringify(
      nativePackageManifest({
        target,
        packageName,
        metadata,
        publishedCoreName: options.publishedCoreName,
      }),
      null,
      2,
    ),
  )

  writeFileSync(
    join(destination, "README.md"),
    replaceLinks(
      `## ${packageName}\n\n> Prebuilt ${targetLabel} binaries for \`${options.publishedCoreName}\`.\n\n` +
        `\`opentui.h\` beside \`${libraryFileName}\` is the C ABI header that this library was built from ` +
        `(FNV-1a 64 \`${headerHash}\`). A C host compiles against it and links the library in this directory` +
        `${target.platform === "win32" ? " through `opentui.lib`" : ""}. For the Rust crates in packages/rust, set ` +
        `\`OPENTUI_LIB_DIR\` to this directory${target.platform === "win32" ? "" : " and turn off their default `static` feature (`default-features = false`), since this package has no static library"}; their build fails when the header differs from the one their bindings were generated from. ` +
        `See [C](https://opentui.com/docs/native/c).`,
    ),
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
    [join(licenses.nativeRoot, "src", "vendor", "ffmpeg", "COPYING.LGPLv2.1"), "LICENSE-FFMPEG"],
    [join(licenses.nativeRoot, "src", "vendor", "ffmpeg", "README.md"), "FFMPEG-SOURCE.md"],
    [join(licenses.nativeRoot, "src", "vendor", "ffmpeg", "LICENSE-ZLIB"), "LICENSE-ZLIB"],
  ] as const) {
    if (!existsSync(source)) throw new Error(`Required native license file is missing: ${source}`)
    copyFileSync(source, join(destination, destinationName))
  }

  return { headerHash }
}
