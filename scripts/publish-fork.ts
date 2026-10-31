#!/usr/bin/env bun

/**
 * Publishes the fork to npm: the native platform packages first, then the core
 * package that depends on them. An install then never sees the core without
 * its native library.
 *
 * Usage:
 *   bun scripts/publish-fork.ts --native-dir <dir> [--dry-run] [--skip-build] [--tag <tag>]
 *
 * <dir> holds the compiled libraries, one subdirectory per zig target
 * directory, laid out like packages/native/lib:
 *
 *   <dir>/x86_64-linux/libopentui.so
 *   <dir>/aarch64-linux/libopentui.so
 *   <dir>/x86_64-macos/libopentui.dylib
 *   <dir>/x86_64-windows/opentui.dll
 *
 * The CI workflow builds those libraries per target and downloads them here.
 * A local run can point --native-dir at packages/native/lib for the targets
 * that were built on this machine.
 *
 * Authentication: npm's own credentials — an .npmrc with a token, or
 * NPM_TOKEN/NODE_AUTH_TOKEN in the environment (the token needs publish rights
 * on the @clarkarch scope), or npm's trusted publishing: with the workflow's
 * OIDC token, the npm CLI exchanges it for a short-lived publish token.
 */
import { spawnSync } from "node:child_process"
import { existsSync, readFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import process from "node:process"
import { fileURLToPath } from "node:url"
import { PUBLISHED_CORE_NAME } from "../packages/core/src/published-package"
import {
  nativeLibraryFileName,
  nativePackageName,
  stageNativePackage,
} from "../packages/core/scripts/native-package"
import { variants, zigOutputName } from "../packages/core/scripts/variants"
import { publishPackage, publishedState, readPackageJson, waitUntilServed } from "./npm-publish"

interface CoreManifest {
  readonly name: string
  readonly version: string
  readonly license?: string
  readonly author?: string
  readonly keywords?: string[]
}

function readCoreManifest(): CoreManifest {
  return JSON.parse(readFileSync(join(coreRoot, "package.json"), "utf8")) as CoreManifest
}

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const coreRoot = join(repoRoot, "packages", "core")

interface Options {
  nativeDir: string
  dryRun: boolean
  skipBuild: boolean
  tag: string
}

function parseOptions(argv: readonly string[]): Options {
  let nativeDir = ""
  let dryRun = false
  let skipBuild = false
  let tag = process.env.NPM_DIST_TAG ?? "latest"

  for (let index = 0; index < argv.length; index++) {
    const argument = argv[index]
    if (argument === "--native-dir") {
      nativeDir = argv[++index] ?? ""
    } else if (argument === "--dry-run") {
      dryRun = true
    } else if (argument === "--skip-build") {
      skipBuild = true
    } else if (argument === "--tag") {
      tag = argv[++index] ?? tag
    } else {
      throw new Error(`Unknown argument: ${argument}`)
    }
  }

  if (nativeDir === "")
    throw new Error("Usage: publish-fork.ts --native-dir <dir> [--dry-run] [--skip-build] [--tag <tag>]")
  return { nativeDir: resolve(nativeDir), dryRun, skipBuild, tag }
}

function buildLibrary(): void {
  console.log("Building the core package (bun run build:lib)...")
  const result = spawnSync("bun", ["run", "build:lib"], { cwd: coreRoot, stdio: "inherit" })
  if (result.status !== 0) throw new Error("The core build failed")
}

/**
 * Stages every native package from the downloaded libraries.
 *
 * The libraries come from the CI matrix, one artifact per target, so a target
 * that was not built is a hard error: publishing the core without one of its
 * optional dependencies would leave an install that cannot load a library.
 */
function stageNativePackages(options: Options): string[] {
  const metadata = readCoreManifest()
  const staged: string[] = []

  for (const target of variants) {
    const packageName = nativePackageName(target, PUBLISHED_CORE_NAME)
    const destination = join(coreRoot, "node_modules", packageName)
    const libraryPath = join(options.nativeDir, zigOutputName(target), nativeLibraryFileName(target.platform))

    if (!existsSync(libraryPath)) {
      throw new Error(`Missing native library for ${packageName}: ${libraryPath}`)
    }

    stageNativePackage({
      destination,
      target,
      libraryPath,
      packageName,
      metadata: {
        version: metadata.version,
        license: metadata.license,
        author: metadata.author,
        keywords: metadata.keywords,
      },
      licenses: {
        licensePath: join(repoRoot, "LICENSE"),
        ghosttyLicensePath: join(coreRoot, "THIRD_PARTY_LICENSES", "GHOSTTY"),
        nativeRoot: join(repoRoot, "packages", "native"),
      },
      publishedCoreName: PUBLISHED_CORE_NAME,
    })
    staged.push(destination)
    console.log(`Staged ${packageName}@${metadata.version}`)
  }

  return staged
}

/**
 * Whether the run has any way to authenticate with npm.
 *
 * A token (in the environment or in ~/.npmrc) is one way. npm's TRUSTED
 * PUBLISHING is the other: the runner exposes the OIDC endpoint through these
 * variables when the workflow asks for `id-token: write`, and the npm CLI
 * exchanges it for a short-lived publish token.
 */
function hasNpmCredentials(): boolean {
  if (process.env.NPM_TOKEN || process.env.NODE_AUTH_TOKEN) {
    return true
  }
  if (existsSync(join(process.env.HOME ?? "", ".npmrc"))) {
    return true
  }
  return Boolean(process.env.ACTIONS_ID_TOKEN_REQUEST_URL && process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN)
}

async function main(): Promise<void> {
  const options = parseOptions(process.argv.slice(2))

  if (!options.skipBuild) buildLibrary()

  const distDir = join(coreRoot, "dist")
  const distManifest = readPackageJson(distDir)
  if (distManifest.name !== PUBLISHED_CORE_NAME) {
    throw new Error(`The built package is named ${distManifest.name}, expected ${PUBLISHED_CORE_NAME}`)
  }

  const nativeDirs = stageNativePackages(options)
  const directories = [...nativeDirs, distDir]

  console.log("\nPackages to publish:")
  for (const directory of directories) {
    const manifest = readPackageJson(directory)
    console.log(`  ${manifest.name}@${manifest.version}`)
  }

  if (options.dryRun) {
    console.log("\nDry run: nothing was published.")
    return
  }

  // What is still missing from npm. A version that is already there with
  // identical contents is skipped, and a rerun of a finished release needs no
  // credentials at all.
  const pending: string[] = []
  for (const directory of directories) {
    const manifest = readPackageJson(directory)
    const state = await publishedState(directory)
    if (state === "different") {
      throw new Error(`${manifest.name}@${manifest.version} is already on npm with different contents`)
    }
    if (state === "missing") {
      pending.push(directory)
    }
  }

  if (pending.length === 0) {
    console.log("\nEvery package is already on npm with identical contents; nothing to publish.")
    return
  }

  if (!hasNpmCredentials()) {
    throw new Error(
      "No npm credentials found: set NPM_TOKEN, add an .npmrc with a publish token, or run with an OIDC token (id-token: write)",
    )
  }

  for (const directory of pending) await publishPackage(directory, options.tag)
  await waitUntilServed(directories)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
