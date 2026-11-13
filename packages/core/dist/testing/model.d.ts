export declare function rng(seed: number): () => number;
export declare class Failure extends Error {
    readonly property: string;
    constructor(property: string, message: string);
}
export declare const SKIP: Set<string>;
export declare function fail(property: string, message: string): void;
/** The seeds to run: MODEL_SEED alone, else 1..MODEL_SEEDS, else 1..count. */
export declare function seeds(count: number): number[];
export declare function removeChunks<C>(commands: C[], same: (candidate: C[]) => Promise<boolean>): Promise<C[]>;
/**
 * Runs `run` on each seed's commands; on a failure, shrinks the commands to the shortest list that fails the same
 * property and throws with that trace.
 */
export declare function check<C>(count: number, generate: (seed: number) => C[], run: (commands: C[]) => Promise<void>): Promise<void>;
