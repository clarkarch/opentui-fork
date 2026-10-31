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
  zigTargetDirectory,
} from "../packages/core/scripts/native-package"
import { variants } from "../packages/core/scripts/variants"
import { publishPackage, publishedState, readPackageJson, waitUntilServed, type PublishedState } from "./npm-publish"

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
    const libraryPath = join(options.nativeDir, zigTargetDirectory(target), nativeLibraryFileName(target.platform))

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
 * A staged package and what npm already has for it.
 */
export interface PublishCandidate {
  /** The package id, e.g. `@clarkarch/opentui-fork-linux-x64@0.8.0-fork.3`. */
  readonly id: string
  /** The staged directory that holds the package. */
  readonly directory: string
  /** What npm already has for this version. */
  readonly state: PublishedState
}

/**
 * The packages that still have to be published.
 *
 * A version that is already on npm cannot be published again — npm refuses
 * it — and the native libraries are REBUILT on every run, so a rerun of a
 * published version always differs byte-wise. Failing on that difference would
 * make a rerun impossible, and a rerun is exactly what a PARTIAL release
 * needs: the packages that landed stay, the rest get published.
 *
 * So an already-published version is skipped, and the difference is reported
 * rather than swallowed: the way to publish new contents is a new version.
 */
export function planPublish(candidates: readonly PublishCandidate[]): {
  readonly publish: readonly string[]
  readonly skipped: readonly PublishCandidate[]
} {
  const publish: string[] = []
  const skipped: PublishCandidate[] = []
  for (const candidate of candidates) {
    if (candidate.state === "missing") {
      publish.push(candidate.directory)
      continue
    }
    skipped.push(candidate)
  }
  return { publish, skipped }
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

  // What is still missing from npm. A version that is already there cannot be
  // published again (npm refuses it), and the native libraries are rebuilt on
  // every run, so a rerun always sees different bytes for an already
  // published version. Skipping those is what makes a partial release
  // resumable.
  const candidates: PublishCandidate[] = []
  for (const directory of directories) {
    const manifest = readPackageJson(directory)
    candidates.push({
      id: `${manifest.name}@${manifest.version}`,
      directory,
      state: await publishedState(directory),
    })
  }

  const plan = planPublish(candidates)
  for (const candidate of plan.skipped) {
    console.log(
      `${candidate.id} is already on npm (${candidate.state} contents); skipping` +
        (candidate.state === "different"
          ? " — npm cannot republish a version, so bump the version to publish new contents"
          : ""),
    )
  }

  if (plan.publish.length === 0) {
    console.log("\nEvery package is already on npm; nothing to publish.")
    return
  }

  if (!hasNpmCredentials()) {
    throw new Error(
      "No npm credentials found: set NPM_TOKEN, add an .npmrc with a publish token, or run with an OIDC token (id-token: write)",
    )
  }

  for (const directory of plan.publish) await publishPackage(directory, options.tag)
  await waitUntilServed(plan.publish)
}

// The guard keeps the module importable: a test imports the planning helpers
// without publishing anything.
const entry = process.argv[1]
if (entry && resolve(entry) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
  })
}
