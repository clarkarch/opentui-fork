import type { NativeContextHandle, NativeMarkdownBlock, NativeMarkdownLeaf, NativeMarkdownOptions, RenderLib, SceneNodeHandle } from "../zig.js";
/** What a call changed: blocks at `removedFrom` and after are gone, then `changed` blocks were added or updated. */
export interface MarkdownChanges {
    removedFrom: number | undefined;
    changed: NativeMarkdownBlock[];
}
/**
 * A native Markdown document and what the host knows of it. The engine owns the source and the blocks; `content` is
 * the source as of the last accepted call (kept for the `startsWith` test before an append), and `blocks` is filled
 * only from the engine's change reports, so after every call both equal the engine's.
 */
export declare class MarkdownDocument {
    private readonly lib;
    private readonly context;
    readonly blocks: NativeMarkdownBlock[];
    private readonly encoder;
    private readonly doc;
    private _content;
    private _committed;
    private _finished;
    constructor(lib: RenderLib, context: NativeContextHandle, options: NativeMarkdownOptions);
    get content(): string;
    /** Top-level blocks that are final, a prefix; it never decreases while content only grows. */
    get committed(): number;
    get finished(): boolean;
    /** Shows `content`: an append when it extends the open document, else a fresh parse; finished unless `streaming`. */
    write(content: string, streaming: boolean): MarkdownChanges;
    setOptions(options: NativeMarkdownOptions): MarkdownChanges;
    readLeaf(index: number): NativeMarkdownLeaf;
    readSource(index: number): string;
    /** The engine's own copy of the source, or its bytes `start` to `end`. */
    source(start?: number, end?: number): string;
    bind(index: number, node: SceneNodeHandle): void;
    destroy(): void;
    private finish;
    private apply;
}
