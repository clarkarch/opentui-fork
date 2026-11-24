import { describe, expect, test } from "bun:test"
import { collectModuleSpecifiers, distFlavorFor, rewritePublishedSelfImports } from "./published-self-imports"

describe("the published package's self-imports", () => {
  test("the bun entry point imports the core by a relative path", () => {
    const source = `import * as coreRuntime from "@opentui/core";\n`
    expect(rewritePublishedSelfImports(source, "runtime-plugin.js")).toBe(
      `import * as coreRuntime from "./index.bun.js";\n`,
    )
  })

  test("the node entry point imports the node runtime, not the bun one", () => {
    const source = `import * as coreRuntime from "@opentui/core";\n`
    expect(rewritePublishedSelfImports(source, "index.node.js")).toBe(
      `import * as coreRuntime from "./index.node.js";\n`,
    )
  })

  test("the testing entry point follows the flavor", () => {
    const source = `return (await import("@opentui/core/testing"));\n`
    expect(rewritePublishedSelfImports(source, "runtime-plugin.js")).toBe(
      `return (await import("./testing.bun.js"));\n`,
    )
    expect(rewritePublishedSelfImports(source, "testing.js")).toBe(`return (await import("./testing.js"));\n`)
  })

  test("a file import with import attributes is rewritten", () => {
    // The published package loads its parser worker exactly this way: the
    // specifier is followed by the attributes, not by the closing parenthesis.
    const source = `await import("@opentui/core/parser.worker", { with: { type: "file" } })\n`
    expect(rewritePublishedSelfImports(source, "chunk-bun-abc123.js")).toBe(
      `await import("./parser.worker.js", { with: { type: "file" } })\n`,
    )
  })

  test("a file below the dist root gets a relative path that climbs back out", () => {
    const source = `import * as coreRuntime from "@opentui/core";\n`
    expect(rewritePublishedSelfImports(source, "lib/tree-sitter/update-assets.js")).toBe(
      `import * as coreRuntime from "../../index.bun.js";\n`,
    )
  })

  test("generated code inside a template literal is left alone", () => {
    // The asset updater writes generated TypeScript into a template literal.
    // Rewriting the specifier inside that TEXT would corrupt the generated
    // file — and the generated file lands in the CONSUMER's project, where the
    // package may be installed under either name.
    const source = [
      "const parserImports = `",
      `import { resolveBundledFilePath } from "@opentui/core"`,
      `import type { FiletypeParserOptions } from "@opentui/core"`,
      "`",
      "",
    ].join("\n")
    expect(rewritePublishedSelfImports(source, "lib/tree-sitter/update-assets.js")).toBe(source)
  })

  test("a string that only looks like an import is left alone", () => {
    // The runtime plugin's own doc comment mentions the specifier inside a
    // quoted string. Rewriting it would change the prose, not the code.
    const source = ` *   \`'from "@opentui/core"'\` are not rewritten.\n`
    expect(rewritePublishedSelfImports(source, "runtime-plugin.js")).toBe(source)
  })

  test("the symbol registry keys are left alone", () => {
    const source = `var BrandedVNode = Symbol.for("@opentui/core/VNode");\n`
    expect(rewritePublishedSelfImports(source, "chunk-bun-abc123.js")).toBe(source)
  })

  test("the asset keys are left alone", () => {
    const source = `var CORE_ASSET_PREFIX = "@opentui/core/";\n`
    expect(rewritePublishedSelfImports(source, "chunk-bun-abc123.js")).toBe(source)
  })

  test("a foreign specifier is left alone", () => {
    const source = `import { diff } from "diff";\n`
    expect(rewritePublishedSelfImports(source, "index.bun.js")).toBe(source)
  })

  test("an export from the package is rewritten too", () => {
    const source = `export { Box } from "@opentui/core";\n`
    expect(rewritePublishedSelfImports(source, "index.bun.js")).toBe(`export { Box } from "./index.bun.js";\n`)
  })

  test("the collector finds the real module specifiers only", () => {
    const source = [
      `import * as coreRuntime from "@opentui/core";`,
      `export { diff } from "diff";`,
      `const asset = await import("@opentui/core/parser.worker", { with: { type: "file" } });`,
      `const prose = 'from "@opentui/core"';`,
      `const generated = \`import { x } from "@opentui/core"\`;`,
      "",
    ].join("\n")
    expect(collectModuleSpecifiers(source).map(({ specifier }) => specifier)).toEqual([
      "@opentui/core",
      "diff",
      "@opentui/core/parser.worker",
    ])
  })

  test("the flavor of a dist file follows its name", () => {
    expect(distFlavorFor("index.bun.js")).toBe("bun")
    expect(distFlavorFor("index.node.js")).toBe("node")
    expect(distFlavorFor("chunk-bun-abc.js")).toBe("bun")
    expect(distFlavorFor("chunk-node-abc.js")).toBe("node")
    expect(distFlavorFor("testing.bun.js")).toBe("bun")
    expect(distFlavorFor("testing.js")).toBe("node")
    expect(distFlavorFor("yoga.js")).toBe("node")
    expect(distFlavorFor("node-assets.js")).toBe("node")
    // The Bun-only entry points carry no flavor suffix.
    expect(distFlavorFor("runtime-plugin.js")).toBe("bun")
    expect(distFlavorFor("runtime-plugin-support.js")).toBe("bun")
  })
})
