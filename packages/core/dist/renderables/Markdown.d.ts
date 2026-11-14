import { Renderable, type RenderableOptions, type NativeRenderableIntegration } from "../Renderable.js";
import { type RenderContext } from "../types.js";
import { SyntaxStyle } from "../syntax-style.js";
import type { BorderStyle } from "../lib/border.js";
import { RGBA, type ColorInput } from "../lib/RGBA.js";
import { type TextTableColumnFitter, type TextTableColumnWidthMode } from "./TextTable.js";
import { type TreeSitterClient } from "../lib/tree-sitter/index.js";
export type MarkdownTableStyle = "grid" | "columns";
export interface MarkdownTableOptions {
    /**
     * Visual style preset for markdown tables.
     * - "grid": boxed table with visible borders (the default).
     * - "columns": borderless columns optimized for separated block output.
     */
    style?: MarkdownTableStyle;
    /**
     * Strategy for sizing table columns.
     * - "content": columns fit to intrinsic content width.
     * - "full": columns expand to fill available width.
     */
    widthMode?: TextTableColumnWidthMode;
    /**
     * Column fitting method when shrinking constrained tables.
     */
    columnFitter?: TextTableColumnFitter;
    /**
     * Wrapping strategy for table cell content.
     */
    wrapMode?: "none" | "char" | "word";
    /**
     * Padding applied on all sides of each table cell.
     */
    cellPadding?: number;
    /**
     * Horizontal padding applied on the left and right of each table cell.
     */
    cellPaddingX?: number;
    /**
     * Vertical padding applied above and below each table cell.
     */
    cellPaddingY?: number;
    /**
     * Enables/disables table border rendering.
     */
    borders?: boolean;
    /**
     * Overrides outer border visibility. Defaults to `borders`.
     */
    outerBorder?: boolean;
    /**
     * Border style for markdown tables.
     */
    borderStyle?: BorderStyle;
    /**
     * Border color for markdown tables. Defaults to conceal style color.
     */
    borderColor?: ColorInput;
    /**
     * Enables/disables selection support on markdown tables.
     */
    selectable?: boolean;
}
export interface MarkdownOptions extends RenderableOptions<MarkdownRenderable> {
    content?: string;
    syntaxStyle: SyntaxStyle;
    fg?: ColorInput;
    bg?: ColorInput;
    /** Controls concealment for markdown syntax markers in markdown text blocks. */
    conceal?: boolean;
    /** Controls concealment inside fenced code blocks rendered by CodeRenderable. */
    concealCode?: boolean;
    /** Highlights fenced code blocks. Paragraphs, headings and tables never reach it. */
    treeSitterClient?: TreeSitterClient;
    /**
     * Whether more content is still to come. While streaming, the last line shows as far as it is decided: a line
     * that may still become a table row, a fence's end or a heading's underline waits for its end, and an emphasis
     * or code span that has not closed yet draws as if it had. Set it to false once the content is complete; the
     * document then shows as it would from one `content` without streaming.
     */
    streaming?: boolean;
    /**
     * Options for internally rendered markdown tables.
     */
    tableOptions?: MarkdownTableOptions;
    /**
     * Custom block renderer, called for each top-level block and each code block at any depth when it is built or
     * changes. Return a Renderable to show instead, or undefined/null for the default rendering, which
     * `context.defaultRender()` also returns.
     */
    renderBlock?: (block: MarkdownBlock, context: RenderNodeContext) => Renderable | undefined | null;
    /**
     * Rewrites the display text of every paragraph, heading and table cell, in lists and quotes too, before it is
     * shown: to show IDs as titled links, for example. Code blocks and `renderBlock` results never reach it. It runs
     * when a block is drawn or changes, and must be synchronous.
     */
    inlineHook?: MarkdownInlineHook;
    /** When set, the hook runs only on blocks and cells whose source contains one of these strings. */
    inlineHookFilter?: readonly string[];
    /**
     * Delimiter extensions to parse. `"math"`: `$…$` and `\(…\)` are inline math, and `$$` or `\[` lines open a
     * display math block, a code block of the language `math`.
     */
    extensions?: readonly "math"[];
}
/** One piece of a prose block's display text, as an inline hook sees and returns it. */
export interface MarkdownInlineSpan {
    text: string;
    fg?: RGBA;
    bg?: RGBA;
    attributes?: number;
    /** A hyperlink Markdown already found (a Markdown link, an autolink or a bare URL). */
    link?: {
        url: string;
    };
    /** Whether the span is a code span. Without conceal its text keeps the backticks. */
    code: boolean;
    /** Inline math: its TeX without delimiters. Set only with `extensions: ["math"]`. */
    math?: string;
    /** What a click on the span means to the app, such as a session ID. Never sent to the terminal. */
    target?: string;
}
/** What an inline hook knows about the block or table cell. */
export interface MarkdownInlineContext {
    /** The block's or cell's Markdown source. */
    source: string;
    conceal: boolean;
    syntaxStyle: SyntaxStyle;
    /** Whether the spans are one table cell's content; false for paragraphs and headings, in lists and quotes too. */
    tableCell: boolean;
}
export type MarkdownInlineHook = (spans: MarkdownInlineSpan[], context: MarkdownInlineContext) => MarkdownInlineSpan[];
export interface RenderNodeContext {
    syntaxStyle: SyntaxStyle;
    conceal: boolean;
    concealCode: boolean;
    treeSitterClient?: TreeSitterClient;
    /** Creates the default renderable for this block, or returns the one it shows. */
    defaultRender: () => Renderable | null;
}
export type MarkdownBlockKind = "paragraph" | "heading" | "code" | "html" | "rule" | "table" | "row" | "cell" | "quote" | "list" | "item";
/** A block of the document, read when a renderer needs it. */
export interface MarkdownBlock {
    /** The block's id: its place in document order, counting nested blocks. */
    readonly index: number;
    readonly kind: MarkdownBlockKind;
    /** A heading's level, 1 to 6. */
    readonly level?: number;
    /** Whether a list is numbered, and its first number. */
    readonly ordered?: boolean;
    readonly start?: number;
    /** A task item's box; undefined for other items. */
    readonly checked?: boolean;
    /** A code block's language (the first word of its info string; `math` for display math) and info string. */
    readonly lang?: string;
    readonly info?: string;
    /** Whether a code block's closing delimiter arrived. */
    readonly closed?: boolean;
    /** The block's Markdown source. */
    readonly raw: string;
    /** A code block's code, or a paragraph's, heading's or cell's display text; empty for other blocks. */
    readonly text: string;
    readonly children: readonly MarkdownBlock[];
}
/** A fenced, indented or display math code block. */
export interface MarkdownCodeBlock extends MarkdownBlock {
    readonly type: "code";
    readonly kind: "code";
    readonly lang: string;
    readonly info: string;
    readonly closed: boolean;
}
export type MarkdownCodeBlockRenderer = (block: MarkdownCodeBlock, context: RenderNodeContext) => Renderable | undefined | null;
export type MarkdownCodeBlockRendererMap = ReadonlyMap<string, MarkdownCodeBlockRenderer> | Readonly<Record<string, MarkdownCodeBlockRenderer>>;
export declare function createMarkdownCodeBlockRenderer(renderers: MarkdownCodeBlockRendererMap): MarkdownOptions["renderBlock"];
export declare class MarkdownRenderable extends Renderable {
    static readonly nativeIntegration: NativeRenderableIntegration;
    private static _capabilitySubscriptions;
    private _doc;
    private _shown;
    private _syntaxStyle;
    private _fg?;
    private _bg?;
    private _conceal;
    private _concealCode;
    private _treeSitterClient?;
    private _tableOptions?;
    private _renderBlock?;
    private _streaming;
    private _inlineHook?;
    private _inlineHookFilter?;
    private _extensions;
    private _styleCopy?;
    private _flags;
    private _before?;
    private _beforeBytes?;
    private _shownInCall?;
    private _styleDirty;
    private readonly applyStyleChanges;
    protected _contentDefaultOptions: {
        content: string;
        conceal: true;
        concealCode: false;
        streaming: false;
    };
    constructor(ctx: RenderContext, options: MarkdownOptions);
    get content(): string;
    set content(value: string);
    get syntaxStyle(): SyntaxStyle;
    set syntaxStyle(value: SyntaxStyle);
    get treeSitterClient(): TreeSitterClient | undefined;
    set treeSitterClient(value: TreeSitterClient | undefined);
    get fg(): RGBA | undefined;
    set fg(value: ColorInput | undefined);
    get bg(): RGBA | undefined;
    set bg(value: ColorInput | undefined);
    get conceal(): boolean;
    set conceal(value: boolean);
    get concealCode(): boolean;
    set concealCode(value: boolean);
    get streaming(): boolean;
    set streaming(value: boolean);
    get tableOptions(): MarkdownTableOptions | undefined;
    set tableOptions(value: MarkdownTableOptions | undefined);
    get renderBlock(): MarkdownOptions["renderBlock"] | undefined;
    set renderBlock(value: MarkdownOptions["renderBlock"] | undefined);
    get inlineHook(): MarkdownInlineHook | undefined;
    set inlineHook(value: MarkdownInlineHook | undefined);
    get inlineHookFilter(): readonly string[] | undefined;
    set inlineHookFilter(value: readonly string[] | undefined);
    get extensions(): readonly "math"[];
    set extensions(value: readonly "math"[] | null | undefined);
    /** Each block the document holds, in document order (the index is the block's id), with what shows it. */
    get blocks(): readonly {
        kind: MarkdownBlockKind;
        renderable: Renderable | undefined;
    }[];
    /**
     * How many top-level blocks are final: their rows equal those a render of the finished document draws, except
     * that a link definition arriving after a committed block used its label makes that label a link. It counts from
     * the first block and never goes down while the content only grows.
     */
    get committedBlockCount(): number;
    /**
     * Runs the inline hook again on the paragraphs, headings and table cells it rewrites whose source `select`
     * accepts, for a change only the hook knows about, such as a new title for an ID it links. Nothing is parsed or
     * highlighted again. Does nothing without a hook.
     */
    rerunInlineHook(select: (source: string) => boolean): void;
    /** The `target` of the inline hook span the latest finished frame drew at screen cell (x, y), if any. */
    targetAt(x: number, y: number): string | undefined;
    clearCache(): void;
    refreshStyles(): void;
    private engineFlags;
    private engineOptions;
    /** The style the doc binds: the style itself, or a copy of its definitions when it lives in another Context. */
    private nativeStyle;
    /** Sends changed engine flags; `force` sends the hook filter too. */
    private changeOptions;
    private change;
    /** Whether a removed block's source (before this call) equals a new block's: the same bytes at its range. */
    private sameSource;
    /** Binds a paragraph's or heading's node, which hands it to the doc. */
    private bind;
    /**
     * After an option change, each paragraph and heading goes to the writer the options now give it: the doc does not
     * list a leaf whose output did not change, so the host hands it over or takes it back here.
     */
    private syncLeaves;
    /** Whether the host writes a paragraph or heading: the doc writes only concealed, linked, unhooked text. */
    private hostWrites;
    /**
     * Shows a call's changes: builds or updates each listed block, then drops the renderables of removed blocks. A code
     * block or text that takes a removed one's place, index and kind, keeps its renderable and highlight.
     */
    private apply;
    private refresh;
    private update;
    /** Builds the renderable of block `index` and puts it where `old` was, or last in its parent. */
    private show;
    private showDescendants;
    private subtreeEnd;
    private parentOf;
    /** Whether block `index` lies in a table or a renderer's result without a default, so nothing shows it on its own. */
    private isHidden;
    private rendersCustom;
    /**
     * The renderable of block `index`, a renderer's or the default one, and the default one if it shows (the one shown
     * already, when it is still right).
     */
    private resolve;
    /** The default renderable of block `index`; `current` is kept when it already shows a block of that kind. */
    private buildDefault;
    private setCode;
    /** What a changed block changes besides its own renderable: text the host writes, the table or list around it. */
    private afterChange;
    /**
     * Writes a paragraph, heading or HTML block the host writes: the parser's output, through the inline hook when
     * the doc marked it, with its click targets. An unchanged output is not written again unless `force`.
     */
    private writeProse;
    private spans;
    private hook;
    private tableOf;
    /** The blocks that are children of block `index`, in order. */
    private childrenOf;
    /**
     * Fills a table from its rows and cells: a header row in the heading style, then the body, as wide as the header,
     * each column aligned as its delimiter row says.
     */
    private fillTable;
    /** A cell's content: the parser's output, in the heading style in a header row, through the hook. */
    private readCell;
    /**
     * A list's gaps and its items' markers: numbers align on their right, and the list is loose when items are. With
     * `listed`, only those items changed: they are counted and marked, and the rest is written only when the gap or the
     * marker width changes.
     */
    private updateList;
    /** Whether an item has a blank line after it or between two of its blocks. */
    private isLoose;
    /** The style of text in block `index` that no part of it styles: the text style, under each quote around it. */
    private baseStyle;
    private styleText;
    private getStyle;
    /**
     * Styles every renderable again for new colors, a new theme or new table options, and asks the renderers again,
     * since they read the style; nothing is parsed again.
     */
    private restyle;
    /** Builds every block's renderable again (a new renderer), keeping the doc. */
    private rebuild;
    /** A read-only view of block `index` for renderers. */
    private view;
    private leafText;
    private sourceText;
    private resolveTableStyle;
    private resolveTableRenderableOptions;
    private applyTableRenderableOptions;
    private markStyleDirty;
    private rerenderDirtyStyles;
    _needsLifecyclePass(): boolean;
    protected destroySelf(): void;
}
