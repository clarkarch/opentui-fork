import { existsSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { resolveBundledDefaultParserAsset } from "../lib/tree-sitter/default-parser-assets.bun.js"
import { getCurrentNodeAssetTarget, getNativeAssetDescriptor } from "../node-asset-target.js"
import { resolveAssetPath, resolveAssetRootPath } from "./assets.js"
import { resolveBundledFilePath } from "./runtime.js"

interface NativePackageModule {
  readonly default: string
}

const CORE_ASSET_PREFIX = "@opentui/core/"
const PARSER_WORKER_ASSET_KEY = `${CORE_ASSET_PREFIX}parser.worker.js`
const TREE_SITTER_WASM_ASSET_KEY = "web-tree-sitter/tree-sitter.wasm"

// tfm fork: consume this repository's own zig build output (packages/native/lib)
// before the published platform packages. A source checkout — a path or git
// dependency — then runs the patched libopentui without publishing a platform
// package; an installed package without the directory falls through unchanged.
const REBUILT_LIB_OUTPUT_NAMES: Record<string, string> = {
  "darwin-x64": "x86_64-macos",
  "darwin-arm64": "aarch64-macos",
  "linux-x64": "x86_64-linux",
  "linux-arm64": "aarch64-linux",
  "linux-x64-musl": "x86_64-linux-musl",
  "linux-arm64-musl": "aarch64-linux-musl",
  "win32-x64": "x86_64-windows",
  "win32-arm64": "aarch64-windows",
}

// The probe resolves relative to the module that runs it, and that module sits
// at a different depth in the source tree (src/platform) than in the built
// package (dist). Both spellings of the same packages/native/lib directory are
// tried so a checkout of the built package finds the rebuilt library too.
const REBUILT_LIB_ROOTS = ["../../../native/lib", "../../native/lib"] as const

function rebuiltNativeLibraryPath(fileName: string): string | null {
  const target = getCurrentNodeAssetTarget()
  const libcSuffix = target.platform === "linux" && target.libc === "musl" ? "-musl" : ""
  const outputName = REBUILT_LIB_OUTPUT_NAMES[`${target.platform}-${target.arch}${libcSuffix}`]
  if (outputName === undefined) return null
  const moduleDir = dirname(fileURLToPath(import.meta.url))
  for (const root of REBUILT_LIB_ROOTS) {
    const candidate = resolve(moduleDir, root, outputName, fileName)
    if (existsSync(candidate)) return candidate
  }
  return null
}

const bundledTreeSitterWorkerPath = await resolveBundledFilePath(
  PARSER_WORKER_ASSET_KEY,
  () => import("@opentui/core/parser.worker" as string, { with: { type: "file" } }),
  new URL("../lib/tree-sitter/parser.worker.js", import.meta.url),
  import.meta.url,
  { useAssetRoot: false },
)

export function resolveDefaultParserAsset(relativePath: string, fallbackPath: URL): Promise<string> {
  return resolveBundledDefaultParserAsset(relativePath, fallbackPath)
}

export function resolveDefaultTreeSitterWorkerPath(_fallbackPath: URL): string {
  return resolveAssetPath(PARSER_WORKER_ASSET_KEY, bundledTreeSitterWorkerPath)
}

export function resolveTreeSitterWasm(): Promise<string> {
  return resolveBundledFilePath(
    TREE_SITTER_WASM_ASSET_KEY,
    () => import("web-tree-sitter/tree-sitter.wasm" as string, { with: { type: "wasm" } }),
    () => import.meta.resolve(TREE_SITTER_WASM_ASSET_KEY),
    import.meta.url,
  )
}

// The platform packages below are imported with LITERAL specifiers on purpose:
// `bun build --compile` has to see the `import("./libopentui.so", { type: "file" })`
// inside them to embed the native library in the binary. A computed specifier
// would be invisible to the bundler and the compiled binary would lose its
// library. The names therefore have to match `published-package.ts` — the
// `published-package.test.ts` guard fails when they drift.
export async function resolveNativeLibraryPath(): Promise<string> {
  const asset = getNativeAssetDescriptor(getCurrentNodeAssetTarget())
  const configuredPath = resolveAssetRootPath(asset.key)
  if (configuredPath !== undefined) {
    return configuredPath
  }

  const rebuiltPath = rebuiltNativeLibraryPath(asset.fileName)
  if (rebuiltPath !== null) {
    return rebuiltPath
  }

  if (process.platform === "darwin") {
    if (process.arch === "x64") {
      return ((await import("@clarkarch/opentui-fork-darwin-x64" as string)) as NativePackageModule).default
    }
    if (process.arch === "arm64") {
      return ((await import("@clarkarch/opentui-fork-darwin-arm64" as string)) as NativePackageModule).default
    }
  }

  if (process.platform === "linux") {
    if (process.arch === "x64") {
      if (process.env.OPENTUI_LIBC === "musl") {
        return ((await import("@clarkarch/opentui-fork-linux-x64-musl" as string)) as NativePackageModule).default
      }
      return ((await import("@clarkarch/opentui-fork-linux-x64" as string)) as NativePackageModule).default
    }

    if (process.arch === "arm64") {
      if (process.env.OPENTUI_LIBC === "musl") {
        return ((await import("@clarkarch/opentui-fork-linux-arm64-musl" as string)) as NativePackageModule).default
      }
      return ((await import("@clarkarch/opentui-fork-linux-arm64" as string)) as NativePackageModule).default
    }
  }

  if (process.platform === "win32") {
    if (process.arch === "x64") {
      return ((await import("@clarkarch/opentui-fork-win32-x64" as string)) as NativePackageModule).default
    }
    if (process.arch === "arm64") {
      return ((await import("@clarkarch/opentui-fork-win32-arm64" as string)) as NativePackageModule).default
    }
  }

  throw new Error(`OpenTUI is not supported on the current platform: ${asset.packageName}`)
}
