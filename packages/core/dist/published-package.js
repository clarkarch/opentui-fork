/**
 * The names the fork publishes under on npm.
 *
 * The in-repo package stays `@opentui/core` so the monorepo's internal imports
 * (react, solid, the examples) and the upstream rebase keep working untouched.
 * The PUBLISHED artifacts carry the fork's own name instead: the core package
 * and the per-platform native packages that hold `libopentui.so`.
 *
 * The native package names are not free-form: `runtime-assets.bun.ts` imports
 * them with literal specifiers so `bun build --compile` can see the file
 * import inside them and embed the library in the binary. A computed
 * specifier would be invisible to the bundler, so the literals and this
 * constant have to agree — `published-package.test.ts` pins that.
 */
export const PUBLISHED_CORE_NAME = "@clarkarch/opentui-fork";
/** Where the published packages live — the fork, not the upstream repository. */
export const PUBLISHED_REPOSITORY = {
    type: "git",
    url: "https://github.com/clarkarch/opentui-fork",
    directory: "packages/core",
};
export const PUBLISHED_HOMEPAGE = "https://github.com/clarkarch/opentui-fork";
export const PUBLISHED_BUGS = "https://github.com/clarkarch/opentui-fork/issues";
/** The npm package that carries the native library for one target. */
export function publishedPlatformPackageName(target) {
    return `${PUBLISHED_CORE_NAME}-${target}`;
}
//# sourceMappingURL=published-package.js.map