import { expect, test } from "bun:test"
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { pathToFileURL } from "node:url"

import { resolveCorePackageName, updateAssets } from "./update.js"

test("the generated file imports the package the consumer installed", async () => {
  const root = mkdtempSync(join(import.meta.dirname, ".update-test-"))
  const configPath = join(root, "parsers.json")
  const outputPath = join(root, "parsers.ts")
  const wasmPath = join(root, "parser.wasm")

  try {
    // The consumer installed the fork under its published name.
    writeFileSync(
      join(root, "package.json"),
      JSON.stringify({ name: "consumer", dependencies: { "@clarkarch/opentui-fork": "0.8.0-fork.3" } }),
    )
    writeFileSync(
      configPath,
      JSON.stringify({
        parsers: [
          {
            filetype: "custom",
            wasm: wasmPath,
            queries: { highlights: ["./highlights.scm"] },
          },
        ],
      }),
    )
    writeFileSync(wasmPath, "custom wasm")
    writeFileSync(join(root, "highlights.scm"), "(identifier) @variable")

    await updateAssets({ configPath, assetsDir: join(root, "assets"), outputPath })
    const generated = readFileSync(outputPath, "utf8")

    expect(generated).toContain('from "@clarkarch/opentui-fork"')
    expect(generated).not.toContain('from "@opentui/core"')
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test("the package name follows the nearest package.json", async () => {
  const root = mkdtempSync(join(import.meta.dirname, ".update-test-"))

  try {
    writeFileSync(
      join(root, "package.json"),
      JSON.stringify({
        name: "consumer",
        dependencies: { "@opentui/core": "npm:@clarkarch/opentui-fork@0.8.0-fork.3" },
      }),
    )

    expect(await resolveCorePackageName(join(root, "src", "parsers.ts"))).toBe("@opentui/core")
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test("custom parser generation loads its assets without overwriting an undeclared sibling output", async () => {
  const root = mkdtempSync(join(import.meta.dirname, ".update-test-"))
  const configPath = join(root, "parsers.json")
  const outputPath = join(root, "parsers.ts")
  const siblingPath = join(root, "default-parser-assets.bun.ts")
  const siblingContents = "export const applicationOwned = true\n"
  const wasmPath = join(root, "parser.wasm")

  try {
    writeFileSync(
      configPath,
      JSON.stringify({
        parsers: [
          {
            filetype: "custom",
            wasm: wasmPath,
            queries: { highlights: ["./highlights.scm"] },
          },
        ],
      }),
    )
    writeFileSync(wasmPath, "custom wasm")
    writeFileSync(join(root, "highlights.scm"), "(identifier) @variable")
    writeFileSync(siblingPath, siblingContents)

    await updateAssets({ configPath, assetsDir: join(root, "assets"), outputPath })
    const { getParsers } = await import(pathToFileURL(outputPath).href)
    const parsers = await getParsers()

    expect(readFileSync(siblingPath, "utf8")).toBe(siblingContents)
    expect(parsers).toHaveLength(1)
    expect(existsSync(parsers[0].wasm)).toBe(true)
    expect(existsSync(parsers[0].queries.highlights[0])).toBe(true)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})
