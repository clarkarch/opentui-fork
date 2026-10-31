#!/usr/bin/env bun
export interface UpdateOptions {
    /** Path to parsers-config.json */
    configPath: string;
    /** Directory where .wasm and .scm files will be downloaded */
    assetsDir: string;
    /** Path where the generated TypeScript file will be written */
    outputPath: string;
}
/**
 * The package name the generated file has to import.
 *
 * The generated file lands in the CONSUMER's project, and the consumer may
 * have installed the core under either name: as `@opentui/core` (an npm alias
 * for the fork, or upstream's own package) or under the fork's published name
 * `@clarkarch/opentui-fork`. The nearest package.json above the output says
 * which one it is.
 */
export declare function resolveCorePackageName(outputPath: string): Promise<string>;
declare function main(options?: Partial<UpdateOptions>): Promise<void>;
export declare function runUpdateAssetsCli(): Promise<void>;
export { main as updateAssets };
