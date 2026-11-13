import { TreeSitterClient } from "../../lib/tree-sitter/client.js";
import type { SimpleHighlight } from "../../lib/tree-sitter/types.js";
export type Filetype = "hide" | "plain" | undefined;
export declare function grammar(content: string, filetype: string): SimpleHighlight[];
export declare function rendered(content: string, filetype: Filetype, conceal: boolean): string[];
export interface Pending {
    id: number;
    content: string;
    filetype: string;
    tag: unknown;
    resolve: (r: {
        highlights?: SimpleHighlight[];
        error?: string;
    }) => void;
    reject: (e: Error) => void;
}
export declare class ModelClient extends TreeSitterClient {
    pending: Pending[];
    calls: number;
    tag: (content: string) => unknown;
    constructor();
    highlightOnce(content: string, filetype: string): Promise<{
        highlights?: SimpleHighlight[];
        error?: string;
    }>;
    answered: (tag: unknown) => void;
    reply(index: number): void;
    fail(index: number, answer: boolean): void;
}
export declare function rng(seed: number): () => number;
export declare const pieces: string[];
export declare function text(r: () => number, max: number): string;
export declare class Failure extends Error {
    readonly property: string;
    constructor(property: string, message: string);
}
export declare const SKIP: Set<string>;
export declare function fail(property: string, message: string): void;
export declare const tick: () => Promise<void>;
export declare function removeChunks<C>(commands: C[], same: (candidate: C[]) => Promise<boolean>): Promise<C[]>;
