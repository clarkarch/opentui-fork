/*
 * Exposes runtime-only modules (for example `@opentui/core`, `@opentui/solid`,
 * `solid-js`) to externally loaded plugins by rewriting matching imports to
 * virtual `opentui:runtime-module:*` ids.
 *
 * Why this is exact-path + prescan instead of one broad `onLoad`:
 * - Bun can break CJS/UMD interop if a file is routed through plugin `onLoad`
 *   (real repro: `jsonc-parser` resolving to `lib/umd/main.js`;
 *   https://github.com/oven-sh/bun/issues/19279,
 *   https://github.com/oven-sh/bun/issues/21369), so arbitrary `node_modules`
 *   JS cannot be blanket-rewritten.
 * - runtime `onResolve` is sync-only, so package/type/source discovery here is
 *   synchronous and cached.
 * - a matched `onLoad` cannot safely fall through, so loaders must be narrow.
 * - Bun may canonicalize paths before `onLoad`, so loaders are registered for
 *   both the resolved path spelling and its realpath, then canonical-checked.
 * - Bun may load package imports without firing `onResolve`. Prescan installed ESM
 *   and linked ESM dependencies of local sources for files that need an exact loader.
 *
 * Behavior:
 * - non-`node_modules` source files get a dedicated rewrite loader immediately.
 * - `node_modules` files are rewritten only if they are ESM (`.mjs`, `.mts`,
 *   `.ts`, `.tsx`, `.jsx`, or `.js` under `package.json#type="module"`) and
 *   directly or transitively need runtime-module rewriting; unrelated CJS stays
 *   untouched.
 * - optional bare-specifier rewriting is preserved for sibling files in
 *   packages already marked for runtime rewriting.
 * - bare specifiers matched by `preserve` are never rewritten, so host
 *   `build.module` registrations resolve them directly.
 * - prescanning does not follow runtime-module or preserved specifiers into
 *   their on-disk copies, because those copies are never loaded.
 *
 * Notes:
 * - import scanning is regex-based, not a full parser. A match that starts
 *   immediately inside quotes is left unchanged so string literals such as
 *   `'from "@opentui/core"'` are not rewritten.
 * - CJS helper libraries that themselves import runtime modules are still not
 *   supported.
 * - `package.json#type` caching is per plugin setup, not module-global, so a
 *   later plugin instance in the same process can observe filesystem changes.
 */
import { existsSync, readFileSync, realpathSync } from "node:fs";
import { basename, dirname, isAbsolute, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as coreRuntime from "./index.bun.js";
import { PUBLISHED_CORE_NAME } from "./published-package";
const CORE_RUNTIME_SPECIFIER = "@opentui/core";
const CORE_TESTING_RUNTIME_SPECIFIER = "@opentui/core/testing";
const PUBLISHED_TESTING_RUNTIME_SPECIFIER = `${PUBLISHED_CORE_NAME}/testing`;
const RUNTIME_MODULE_PREFIX = "opentui:runtime-module:";
const MAX_RUNTIME_RESOLVE_PARENTS = 64;
const DEFAULT_RUNTIME_PLUGIN_REWRITE_OPTIONS = {
    nodeModulesRuntimeSpecifiers: true,
    nodeModulesBareSpecifiers: false,
};
const DEFAULT_CORE_RUNTIME_MODULE_SPECIFIERS = [
    CORE_RUNTIME_SPECIFIER,
    CORE_TESTING_RUNTIME_SPECIFIER,
    PUBLISHED_CORE_NAME,
    PUBLISHED_TESTING_RUNTIME_SPECIFIER,
];
const DEFAULT_CORE_RUNTIME_MODULE_SPECIFIER_SET = new Set(DEFAULT_CORE_RUNTIME_MODULE_SPECIFIERS);
export const isCoreRuntimeModuleSpecifier = (specifier) => {
    return DEFAULT_CORE_RUNTIME_MODULE_SPECIFIER_SET.has(specifier);
};
const loadCoreTestingRuntimeModule = async () => {
    return (await import("./testing.bun.js"));
};
const escapeRegExp = (value) => {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};
const exactSpecifierFilter = (specifier) => {
    return new RegExp(`^${escapeRegExp(specifier)}$`);
};
const exactPathFilter = (paths) => {
    const candidates = [...new Set(paths.map(sourcePath))];
    return new RegExp(`^(?:${candidates.map(escapeRegExp).join("|")})(?:[?#].*)?$`);
};
export const runtimeModuleIdForSpecifier = (specifier) => {
    return `${RUNTIME_MODULE_PREFIX}${encodeURIComponent(specifier)}`;
};
const sourcePath = (path) => {
    const searchIndex = path.indexOf("?");
    const hashIndex = path.indexOf("#");
    const end = [searchIndex, hashIndex].filter((index) => index >= 0).sort((a, b) => a - b)[0];
    return end === undefined ? path : path.slice(0, end);
};
const normalizedSourcePathByPath = new Map();
const normalizeSourcePath = (path) => {
    const cleanPath = sourcePath(path);
    const cachedPath = normalizedSourcePathByPath.get(cleanPath);
    if (cachedPath !== undefined) {
        return cachedPath;
    }
    let normalizedPath = cleanPath;
    try {
        normalizedPath = realpathSync(cleanPath);
    }
    catch {
        normalizedPath = cleanPath;
    }
    normalizedSourcePathByPath.set(cleanPath, normalizedPath);
    return normalizedPath;
};
const isNodeModulesPath = (path) => {
    return /(?:^|[/\\])node_modules(?:[/\\])/.test(path);
};
const packageTypeForPath = (path, packageTypeByPackageJsonPath) => {
    let currentDir = dirname(path);
    while (true) {
        const packageJsonPath = join(currentDir, "package.json");
        if (existsSync(packageJsonPath)) {
            const cachedPackageType = packageTypeByPackageJsonPath.get(packageJsonPath);
            if (cachedPackageType) {
                return cachedPackageType;
            }
            let packageType = "commonjs";
            try {
                const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
                if (packageJson.type === "module") {
                    packageType = "module";
                }
            }
            catch {
                packageType = "commonjs";
            }
            packageTypeByPackageJsonPath.set(packageJsonPath, packageType);
            return packageType;
        }
        const parentDir = dirname(currentDir);
        if (parentDir === currentDir) {
            return "commonjs";
        }
        currentDir = parentDir;
    }
};
const isEsmPath = (path, packageTypeByPackageJsonPath) => {
    const normalizedPath = normalizeSourcePath(path);
    if (normalizedPath.endsWith(".mjs") ||
        normalizedPath.endsWith(".mts") ||
        normalizedPath.endsWith(".ts") ||
        normalizedPath.endsWith(".tsx") ||
        normalizedPath.endsWith(".jsx")) {
        return true;
    }
    if (normalizedPath.endsWith(".cjs") || normalizedPath.endsWith(".cts") || !normalizedPath.endsWith(".js")) {
        return false;
    }
    return packageTypeForPath(normalizedPath, packageTypeByPackageJsonPath) === "module";
};
const nodeModulesPackageRootForPath = (path) => {
    let currentDir = dirname(path);
    while (true) {
        const parentDir = dirname(currentDir);
        if (parentDir === currentDir) {
            return null;
        }
        if (basename(parentDir) === "node_modules") {
            return currentDir;
        }
        if (basename(dirname(parentDir)) === "node_modules" && basename(parentDir).startsWith("@")) {
            return currentDir;
        }
        currentDir = parentDir;
    }
};
const resolveRuntimePluginRewriteOptions = (options) => {
    return {
        nodeModulesRuntimeSpecifiers: options?.nodeModulesRuntimeSpecifiers ?? DEFAULT_RUNTIME_PLUGIN_REWRITE_OPTIONS.nodeModulesRuntimeSpecifiers,
        nodeModulesBareSpecifiers: options?.nodeModulesBareSpecifiers ?? DEFAULT_RUNTIME_PLUGIN_REWRITE_OPTIONS.nodeModulesBareSpecifiers,
    };
};
const runtimeLoaderForPath = (path) => {
    const cleanPath = sourcePath(path);
    if (cleanPath.endsWith(".tsx")) {
        return "tsx";
    }
    if (cleanPath.endsWith(".jsx")) {
        return "jsx";
    }
    if (cleanPath.endsWith(".ts") || cleanPath.endsWith(".mts") || cleanPath.endsWith(".cts")) {
        return "ts";
    }
    if (cleanPath.endsWith(".js") || cleanPath.endsWith(".mjs") || cleanPath.endsWith(".cjs")) {
        return "js";
    }
    return null;
};
const resolveImportSpecifierPatterns = [
    /(from\s+["'])([^"']+)(["'])/g,
    /(import\s+["'])([^"']+)(["'])/g,
    /(import\s*\(\s*["'])([^"']+)(["']\s*\))/g,
    /(require\s*\(\s*["'])([^"']+)(["']\s*\))/g,
];
const isImportLikeMatchInsideQuotes = (code, offset) => {
    const previous = code[offset - 1];
    return previous === '"' || previous === "'" || previous === "`";
};
const isBareSpecifier = (specifier) => {
    if (specifier.startsWith(".") || specifier.startsWith("/") || specifier.startsWith("\\")) {
        return false;
    }
    if (specifier.startsWith("node:") ||
        specifier.startsWith("bun:") ||
        specifier.startsWith("http:") ||
        specifier.startsWith("https:") ||
        specifier.startsWith("file:") ||
        specifier.startsWith("data:")) {
        return false;
    }
    if (specifier.startsWith(RUNTIME_MODULE_PREFIX)) {
        return false;
    }
    return true;
};
const registerResolveParent = (resolveParentsByRecency, resolveParent) => {
    const existingIndex = resolveParentsByRecency.indexOf(resolveParent);
    if (existingIndex >= 0) {
        resolveParentsByRecency.splice(existingIndex, 1);
    }
    resolveParentsByRecency.push(resolveParent);
    if (resolveParentsByRecency.length > MAX_RUNTIME_RESOLVE_PARENTS) {
        resolveParentsByRecency.shift();
    }
};
const rewriteImportSpecifiers = (code, resolveReplacement) => {
    let transformedCode = code;
    for (const pattern of resolveImportSpecifierPatterns) {
        transformedCode = transformedCode.replace(pattern, (fullMatch, prefix, specifier, suffix, offset) => {
            if (isImportLikeMatchInsideQuotes(transformedCode, offset)) {
                return fullMatch;
            }
            const replacement = resolveReplacement(specifier);
            if (!replacement || replacement === specifier) {
                return fullMatch;
            }
            return `${prefix}${replacement}${suffix}`;
        });
    }
    return transformedCode;
};
const collectImportSpecifiers = (code) => {
    const specifiers = new Set();
    for (const pattern of resolveImportSpecifierPatterns) {
        code.replace(pattern, (_fullMatch, _prefix, specifier, _suffix, offset) => {
            if (!isImportLikeMatchInsideQuotes(code, offset)) {
                specifiers.add(specifier);
            }
            return _fullMatch;
        });
    }
    return [...specifiers];
};
const resolveFromParent = (specifier, parent) => {
    try {
        const resolvedSpecifier = import.meta.resolve(specifier, parent);
        if (resolvedSpecifier === specifier ||
            resolvedSpecifier.startsWith("node:") ||
            resolvedSpecifier.startsWith("bun:")) {
            return null;
        }
        return resolvedSpecifier;
    }
    catch {
        return null;
    }
};
const resolveSourcePathFromSpecifier = (specifier, importer) => {
    if (specifier.startsWith("node:") ||
        specifier.startsWith("bun:") ||
        specifier.startsWith("http:") ||
        specifier.startsWith("https:") ||
        specifier.startsWith("data:") ||
        specifier.startsWith(RUNTIME_MODULE_PREFIX)) {
        return null;
    }
    if (specifier.startsWith("file:")) {
        return sourcePath(fileURLToPath(specifier));
    }
    if (isAbsolute(specifier)) {
        return sourcePath(specifier);
    }
    const resolvedSpecifier = resolveFromParent(specifier, importer);
    if (!resolvedSpecifier) {
        return null;
    }
    if (resolvedSpecifier.startsWith("file:")) {
        return sourcePath(fileURLToPath(resolvedSpecifier));
    }
    if (isAbsolute(resolvedSpecifier)) {
        return sourcePath(resolvedSpecifier);
    }
    return null;
};
const createPreservePredicate = (preserve) => {
    if (typeof preserve === "function") {
        return (specifier) => isBareSpecifier(specifier) && preserve(specifier);
    }
    const specifiers = new Set(preserve);
    return (specifier) => isBareSpecifier(specifier) && specifiers.has(specifier);
};
const rewriteImportsFromResolveParents = (code, resolveParentsByRecency, isPreservedSpecifier) => {
    if (resolveParentsByRecency.length === 0) {
        return code;
    }
    const resolveFromParents = (specifier) => {
        if (!isBareSpecifier(specifier) || isPreservedSpecifier(specifier)) {
            return null;
        }
        for (let index = resolveParentsByRecency.length - 1; index >= 0; index -= 1) {
            const resolveParent = resolveParentsByRecency[index];
            const resolvedSpecifier = resolveFromParent(specifier, resolveParent);
            if (resolvedSpecifier) {
                return resolvedSpecifier;
            }
        }
        return null;
    };
    return rewriteImportSpecifiers(code, resolveFromParents);
};
const rewriteRuntimeSpecifiers = (code, runtimeModuleIdsBySpecifier) => {
    return rewriteImportSpecifiers(code, (specifier) => {
        const runtimeModuleId = runtimeModuleIdsBySpecifier.get(specifier);
        return runtimeModuleId ?? null;
    });
};
export function createRuntimePlugin(input = {}) {
    const runtimeModules = new Map();
    const coreRuntimeExports = (input.core ?? coreRuntime);
    runtimeModules.set(CORE_RUNTIME_SPECIFIER, coreRuntimeExports);
    runtimeModules.set(CORE_TESTING_RUNTIME_SPECIFIER, loadCoreTestingRuntimeModule);
    // The published package is named `@clarkarch/opentui-fork`, so a plugin that
    // imports it by that name must reach the HOST's core instance too — not a
    // second copy of it.
    runtimeModules.set(PUBLISHED_CORE_NAME, coreRuntimeExports);
    runtimeModules.set(PUBLISHED_TESTING_RUNTIME_SPECIFIER, loadCoreTestingRuntimeModule);
    const rewriteOptions = resolveRuntimePluginRewriteOptions(input.rewrite);
    for (const [specifier, moduleEntry] of Object.entries(input.additional ?? {})) {
        runtimeModules.set(specifier, moduleEntry);
    }
    const isPreservedSpecifier = createPreservePredicate(input.preserve);
    return {
        name: "bun-plugin-opentui-runtime-modules",
        setup: (build) => {
            const runtimeModuleIdsBySpecifier = new Map();
            const resolveParentsByRecency = [];
            const installedRewriteLoaders = new Set();
            const nodeModulesBareRewritePackageRoots = new Set();
            const packageTypeByPackageJsonPath = new Map();
            const sourceAnalysisByPath = new Map();
            const scannedNodeModulesPaths = new Set();
            const installRewriteLoader = (path) => {
                const resolvedTargetPath = sourcePath(path);
                const canonicalTargetPath = normalizeSourcePath(resolvedTargetPath);
                if (installedRewriteLoaders.has(canonicalTargetPath)) {
                    return;
                }
                installedRewriteLoaders.add(canonicalTargetPath);
                // Register both the resolved path spelling and its canonical realpath so Bun
                // can reach the loader even if it reports the same file through a different alias.
                build.onLoad({ filter: exactPathFilter([resolvedTargetPath, canonicalTargetPath]) }, async (args) => {
                    const loadedPath = normalizeSourcePath(args.path);
                    if (loadedPath !== canonicalTargetPath) {
                        return undefined;
                    }
                    const nodeModulesPath = isNodeModulesPath(loadedPath);
                    const shouldRewriteRuntimeSpecifiers = !nodeModulesPath || rewriteOptions.nodeModulesRuntimeSpecifiers;
                    const shouldRewriteBareSpecifiers = !nodeModulesPath || rewriteOptions.nodeModulesBareSpecifiers;
                    const loader = runtimeLoaderForPath(args.path);
                    if (!loader) {
                        throw new Error(`Unable to determine runtime loader for path: ${args.path}`);
                    }
                    const contents = await Bun.file(loadedPath).text();
                    const runtimeRewrittenContents = shouldRewriteRuntimeSpecifiers
                        ? rewriteRuntimeSpecifiers(contents, runtimeModuleIdsBySpecifier)
                        : contents;
                    if (runtimeRewrittenContents !== contents && shouldRewriteBareSpecifiers) {
                        registerResolveParent(resolveParentsByRecency, loadedPath);
                    }
                    const transformedContents = shouldRewriteBareSpecifiers
                        ? rewriteImportsFromResolveParents(runtimeRewrittenContents, resolveParentsByRecency, isPreservedSpecifier)
                        : runtimeRewrittenContents;
                    return {
                        contents: transformedContents,
                        loader,
                    };
                });
            };
            const analyzeSourcePath = (path) => {
                const normalizedPath = normalizeSourcePath(path);
                const cache = isNodeModulesPath(normalizedPath) ? sourceAnalysisByPath : undefined;
                const cachedAnalysis = cache?.get(normalizedPath);
                if (cachedAnalysis) {
                    return cachedAnalysis;
                }
                let contents;
                try {
                    contents = readFileSync(normalizedPath, "utf8");
                }
                catch (error) {
                    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
                        const analysis = { importSpecifiers: [], needsRuntimeSpecifierRewrite: false };
                        cache?.set(normalizedPath, analysis);
                        return analysis;
                    }
                    throw error;
                }
                const importSpecifiers = collectImportSpecifiers(contents);
                const analysis = {
                    importSpecifiers,
                    needsRuntimeSpecifierRewrite: importSpecifiers.some((specifier) => runtimeModuleIdsBySpecifier.has(specifier)),
                };
                cache?.set(normalizedPath, analysis);
                return analysis;
            };
            const scanPackageImports = (path, visited = new Set()) => {
                const normalizedPath = normalizeSourcePath(path);
                const installed = isNodeModulesPath(normalizedPath);
                const seen = installed ? scannedNodeModulesPaths : visited;
                if (seen.has(normalizedPath))
                    return;
                seen.add(normalizedPath);
                const analysis = analyzeSourcePath(normalizedPath);
                if (analysis.needsRuntimeSpecifierRewrite)
                    installRewriteLoader(path);
                for (const specifier of analysis.importSpecifiers) {
                    if (runtimeModuleIdsBySpecifier.has(specifier) || isPreservedSpecifier(specifier))
                        continue;
                    // Bun resolves relative imports in local sources through onResolve, but can skip bare imports.
                    if (!installed && !isBareSpecifier(specifier))
                        continue;
                    const resolvedPath = resolveSourcePathFromSpecifier(specifier, normalizedPath);
                    // A local parent's new bare edge is only for linked packages, not arbitrary installed dependencies.
                    if (!resolvedPath || (!installed && isNodeModulesPath(normalizeSourcePath(resolvedPath))))
                        continue;
                    if (isEsmPath(resolvedPath, packageTypeByPackageJsonPath))
                        scanPackageImports(resolvedPath, visited);
                }
            };
            for (const [specifier, moduleEntry] of runtimeModules) {
                const moduleId = runtimeModuleIdForSpecifier(specifier);
                runtimeModuleIdsBySpecifier.set(specifier, moduleId);
                build.module(moduleId, async () => ({
                    exports: typeof moduleEntry === "function" ? await moduleEntry() : moduleEntry,
                    loader: "object",
                }));
                build.onResolve({ filter: exactSpecifierFilter(specifier) }, () => ({ path: moduleId }));
            }
            build.onResolve({ filter: /.*/ }, (args) => {
                if (runtimeModuleIdsBySpecifier.has(args.path) || args.path.startsWith(RUNTIME_MODULE_PREFIX)) {
                    return undefined;
                }
                const path = resolveSourcePathFromSpecifier(args.path, args.importer);
                if (!path || !runtimeLoaderForPath(path)) {
                    return undefined;
                }
                const nodeModulesPath = isNodeModulesPath(path);
                if (!nodeModulesPath) {
                    installRewriteLoader(path);
                    scanPackageImports(path);
                    return undefined;
                }
                if (!rewriteOptions.nodeModulesRuntimeSpecifiers && !rewriteOptions.nodeModulesBareSpecifiers) {
                    return undefined;
                }
                if (isEsmPath(path, packageTypeByPackageJsonPath))
                    scanPackageImports(path);
                const packageRoot = nodeModulesPackageRootForPath(path);
                if (rewriteOptions.nodeModulesBareSpecifiers &&
                    packageRoot &&
                    nodeModulesBareRewritePackageRoots.has(packageRoot)) {
                    installRewriteLoader(path);
                    return undefined;
                }
                if (!rewriteOptions.nodeModulesRuntimeSpecifiers || !analyzeSourcePath(path).needsRuntimeSpecifierRewrite) {
                    return undefined;
                }
                if (rewriteOptions.nodeModulesBareSpecifiers && packageRoot) {
                    nodeModulesBareRewritePackageRoots.add(packageRoot);
                }
                installRewriteLoader(path);
                return undefined;
            });
        },
    };
}
//# sourceMappingURL=runtime-plugin.js.map