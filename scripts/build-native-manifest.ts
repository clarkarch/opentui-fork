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
 */

const releaseDir = process.argv[2] ?? "release"
const LIB_NAMES = ["libopentui.so", "opentui.dll", "libopentui.dylib"]

interface ArtifactEntry {
  file: string
  asset: string
  sha256: string
  bytes: number
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

const manifest = {
  generatedAt: new Date().toISOString(),
  artifacts,
}

await Bun.write(join(releaseDir, "native-artifacts.json"), `${JSON.stringify(manifest, null, 2)}\n`)
console.log(`wrote native-artifacts.json for ${Object.keys(artifacts).length} targets`)
