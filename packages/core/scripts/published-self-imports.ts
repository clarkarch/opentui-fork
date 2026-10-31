/**
 * The published package's self-imports.
 *
 * The fork's SOURCE keeps the upstream package name (`@opentui/core`) so the
 * monorepo, the examples and the upstream rebase stay untouched. The PUBLISHED
 * package is named `@clarkarch/opentui-fork` instead, so a specifier that
 * names `@opentui/core` points at a package the consumer may not have
 * installed at all — the published output would fail with "Cannot find
 * module '@opentui/core'".
 *
 * The published output therefore points at ITSELF with a relative path, which
 * resolves under any install name: the published name, an npm alias
 * (`"@opentui/core": "npm:@clarkarch/opentui-fork@…"`) or a plain directory.
 */
import ts from "typescript"

/** Which runtime a dist file belongs to. */
export type DistFlavor = "bun" | "node"

/**
 * The dist files that are built for Node without a flavor suffix. Every other
 * plain-named file in the dist root is a Bun-only entry point.
 */
const NODE_ONLY_DIST_FILES = new Set(["testing.js", "yoga.js", "node-assets.js"])

/**
 * The dist file that carries the runtime for a flavor.
 *
 * The Bun and Node builds are separate bundles, so a self-import has to name
 * the one that matches the file it lives in — otherwise the Bun entry point
 * would pull in the Node bundle (or the other way around).
 */
export const distFlavorFor = (fileName: string): DistFlavor => {
  const baseName = fileName.split("/").pop() ?? fileName

  if (baseName.endsWith(".bun.js")) return "bun"
  if (baseName.endsWith(".node.js")) return "node"
  if (baseName.startsWith("chunk-bun-")) return "bun"
  if (baseName.startsWith("chunk-node-")) return "node"
  return NODE_ONLY_DIST_FILES.has(baseName) ? "node" : "bun"
}

/**
 * The self-imports of the published package, per flavor, relative to the dist
 * root.
 */
const SELF_IMPORT_TARGETS: Record<DistFlavor, Record<string, string>> = {
  bun: {
    "@opentui/core": "index.bun.js",
    "@opentui/core/testing": "testing.bun.js",
    "@opentui/core/parser.worker": "parser.worker.js",
  },
  node: {
    "@opentui/core": "index.node.js",
    "@opentui/core/testing": "testing.js",
    "@opentui/core/parser.worker": "parser.worker.js",
  },
}

/** A module specifier and the range of its text inside the source. */
export interface ModuleSpecifier {
  readonly specifier: string
  readonly start: number
  readonly end: number
}

/**
 * Collects the module specifiers of a JavaScript source.
 *
 * The source is PARSED, not scanned: a string that merely looks like an
 * import — the asset updater writes generated TypeScript into a template
 * literal, and the runtime plugin's doc comment mentions a specifier — is
 * data, not a module specifier, and must survive untouched.
 */
export const collectModuleSpecifiers = (source: string): ModuleSpecifier[] => {
  const sourceFile = ts.createSourceFile("module.js", source, ts.ScriptTarget.ESNext, true, ts.ScriptKind.JS)
  const specifiers: ModuleSpecifier[] = []

  const record = (literal: ts.StringLiteral): void => {
    // The range covers the literal's TEXT: the quotes stay untouched.
    specifiers.push({
      specifier: literal.text,
      start: literal.getStart(sourceFile) + 1,
      end: literal.getEnd() - 1,
    })
  }

  const visit = (node: ts.Node): void => {
    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier) {
      if (ts.isStringLiteral(node.moduleSpecifier)) {
        record(node.moduleSpecifier)
      }
    } else if (
      ts.isImportEqualsDeclaration(node) &&
      ts.isExternalModuleReference(node.moduleReference) &&
      ts.isStringLiteral(node.moduleReference.expression)
    ) {
      record(node.moduleReference.expression)
    } else if (
      ts.isCallExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword &&
      node.arguments.length > 0 &&
      ts.isStringLiteral(node.arguments[0])
    ) {
      record(node.arguments[0])
    }

    ts.forEachChild(node, visit)
  }

  visit(sourceFile)

  return specifiers
}

/**
 * The relative path from a file inside the dist to a file in the dist root.
 */
const relativeToDistRoot = (filePath: string, target: string): string => {
  const segments = filePath.split("/").slice(0, -1)
  return segments.length === 0 ? `./${target}` : `${"../".repeat(segments.length)}${target}`
}

/**
 * Rewrites the published package's self-imports to relative paths.
 *
 * `filePath` is the file's path relative to the dist root (for example
 * `runtime-plugin.js` or `lib/tree-sitter/update-assets.js`).
 */
export const rewritePublishedSelfImports = (source: string, filePath: string): string => {
  const targets = SELF_IMPORT_TARGETS[distFlavorFor(filePath)]

  const edits = collectModuleSpecifiers(source)
    .filter(({ specifier }) => targets[specifier] !== undefined)
    .map(({ specifier, start, end }) => ({
      start,
      end,
      text: relativeToDistRoot(filePath, targets[specifier]!),
    }))

  if (edits.length === 0) {
    return source
  }

  // Back to front, so the offsets of the earlier edits stay valid.
  let rewritten = source
  for (const edit of edits.sort((left, right) => right.start - left.start)) {
    rewritten = rewritten.slice(0, edit.start) + edit.text + rewritten.slice(edit.end)
  }

  return rewritten
}
