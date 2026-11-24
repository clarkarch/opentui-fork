import { createHash } from "node:crypto"
import { readdirSync, readFileSync, statSync } from "node:fs"
import { basename, join } from "node:path"

/**
 * Builds the native artifact manifest consumed by downstream projects
 * (tedit's scripts/setup.ts downloads the asset named here).
 *
 * Usage: bun scripts/build-native-manifest.ts <release-dir>
 *
 * The release directory holds flattened assets named
 * `native-<target>-<file>`, e.g. `native-x86_64-linux-libopentui.so`.
 *
 * The shared library is the entry's `file`/`asset`/`sha256`/`bytes`, the shape
 * existing consumers read. The static archive and the header ride along in
 * `files`, because a Rust consumer needs all three: the archive (or the shared
 * library) to link, and the header, which the crates check against the
 * bindings they were generated from.
 */

const releaseDir = process.argv[2] ?? "release"
const LIB_NAMES = ["libopentui.so", "opentui.dll", "libopentui.dylib"]
const EXTRA_NAMES = ["libopentui.a", "opentui.h", "opentui.lib"]

interface ArtifactEntry {
  file: string
  asset: string
  sha256: string
  bytes: number
  /** Every other file of this target, keyed by its name in the artifact directory. */
  files?: Record<string, Omit<ArtifactEntry, "files">>
}

const artifacts: Record<string, ArtifactEntry> = {}

for (const asset of readdirSync(releaseDir)) {
  const file = LIB_NAMES.find((name) => asset.endsWith(`-${name}`))
  if (!file) continue

  const target = basename(asset, `-${file}`)
  if (!target.startsWith("native-")) continue

  const path = join(releaseDir, asset)
  const bytes = readFileSync(path)

  artifacts[target.slice("native-".length)] = {
    file,
    asset,
    sha256: createHash("sha256").update(bytes).digest("hex"),
    bytes: statSync(path).size,
  }
}

if (Object.keys(artifacts).length === 0) {
  console.error(`no native artifacts found in ${releaseDir}`)
  process.exit(1)
}

// The other files of each target: the static archive and the header.
for (const asset of readdirSync(releaseDir)) {
  const extra = EXTRA_NAMES.find((name) => asset.endsWith(`-${name}`))
  if (!extra) continue

  const target = basename(asset, `-${extra}`)
  if (!target.startsWith("native-")) continue

  const key = target.slice("native-".length)
  const entry = artifacts[key]
  if (!entry) continue

  const path = join(releaseDir, asset)
  const bytes = readFileSync(path)
  entry.files ??= {}
  entry.files[extra] = {
    file: extra,
    asset,
    sha256: createHash("sha256").update(bytes).digest("hex"),
    bytes: statSync(path).size,
  }
}

const manifest = {
  generatedAt: new Date().toISOString(),
  artifacts,
}

await Bun.write(join(releaseDir, "native-artifacts.json"), `${JSON.stringify(manifest, null, 2)}\n`)
console.log(`wrote native-artifacts.json for ${Object.keys(artifacts).length} targets`)
