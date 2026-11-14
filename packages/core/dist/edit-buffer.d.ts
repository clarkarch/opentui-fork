import { NativeEditMarkOperation, type LogicalCursor, type NativeEditMark, type RenderLib, type ContextEditBufferHandle } from "./zig.js";
import { type WidthMethod, type Highlight } from "./types.js";
import { RGBA } from "./lib/RGBA.js";
import { EventEmitter } from "events";
import type { SyntaxStyle } from "./syntax-style.js";
import type { NativeResourceOwner, ResourceContext } from "./buffer.js";
export type { LogicalCursor };
/**
 * EditBuffer provides a text editing buffer with cursor management,
 * incremental editing, and grapheme-aware operations.
 */
export declare class EditBuffer extends EventEmitter {
    private lib;
    private native;
    private unsubscribe?;
    readonly id: number;
    private _destroyed;
    private _syntaxStyle?;
    constructor(lib: RenderLib, handle: ContextEditBufferHandle, source: NativeResourceOwner);
    static create(widthMethod: WidthMethod, source: NativeResourceOwner): EditBuffer;
    get isDestroyed(): boolean;
    private guard;
    /** @internal Editor views must use the buffer's library and Context. */
    _getOwner(): ResourceContext;
    /** @internal Resources can be shared by scenes in the same Context. */
    _getSceneHandle(scene: NativeResourceOwner): ContextEditBufferHandle;
    runMutation<T>(operation: () => T): T;
    private command;
    private position;
    private highlight;
    private setDefaults;
    /** @internal Called when text replacement drops the marks with the history, or on destroy: nothing can restore them. */
    _onHistoryReset?: () => void;
    private setNativeText;
    /**
     * Set text and completely reset the buffer state (clears history, resets add_buffer).
     * Use this for initial text setting or when you want a clean slate.
     */
    setText(text: string): void;
    /** Historical name for copied text replacement without undo history. */
    setTextOwned(text: string): void;
    /**
     * Replace text while preserving undo history (creates an undo point).
     * Use this when you want the setText operation to be undoable.
     */
    replaceText(text: string): void;
    /** Historical name for copied text replacement that preserves undo history. */
    replaceTextOwned(text: string): void;
    getLineCount(): number;
    /** Sets the fixed width of each tab in display cells. */
    setTabWidth(width: number): void;
    /** Returns the fixed width of each tab in display cells. */
    getTabWidth(): number;
    /** Returns the buffer text with LF line breaks. JavaScript indexes this string in UTF-16 code units. */
    getText(): string;
    insertChar(char: string): void;
    insertText(text: string): void;
    /** @internal Set by extmarks controllers: whether the cursor rules around virtual extmarks apply now. */
    _atomic?: () => boolean;
    private rules;
    deleteChar(): void;
    deleteCharBackward(): void;
    /** Deletes a half-open range between (zero-based logical line, display-cell column) pairs. */
    deleteRange(startLine: number, startCol: number, endLine: number, endCol: number): void;
    newLine(): void;
    deleteLine(): void;
    /** Moves to the previous cursor stop, not necessarily one display cell or UTF-16 code unit. */
    moveCursorLeft(): void;
    /** Moves to the next cursor stop, not necessarily one display cell or UTF-16 code unit. */
    moveCursorRight(): void;
    /** Moves up one logical line using the desired display-cell column. */
    moveCursorUp(): void;
    /** Moves down one logical line using the desired display-cell column. */
    moveCursorDown(): void;
    /** Moves to a zero-based logical line. */
    gotoLine(line: number): void;
    /** Sets the cursor by zero-based logical line and display-cell column. */
    setCursor(line: number, col: number): void;
    /** Sets the cursor by zero-based logical line and display-cell column. */
    setCursorToLineCol(line: number, col: number): void;
    /** Sets the cursor in display cells from the document start, counting each newline as one cell. */
    setCursorByOffset(offset: number): void;
    /** @internal Moves a cursor inside virtual extmarks to their outer edge: the end (> 0), the start (< 0) or nearer. */
    _keepOutside(direction: number): void;
    /** Returns the logical line, display-cell column, and document cell offset (one cell per newline). */
    getCursorPosition(): LogicalCursor;
    /** Returns the next word boundary in logical line and cell coordinates. */
    getNextWordBoundary(): LogicalCursor;
    /** Returns the previous word boundary in logical line and cell coordinates. */
    getPrevWordBoundary(): LogicalCursor;
    /** Returns the logical line end in display cells. */
    getEOL(): LogicalCursor;
    /** @internal Extmarks are stored in the native buffer, which moves them with edits, undo and redo. */
    _mark(operation: NativeEditMarkOperation, mark?: Partial<NativeEditMark>): number;
    /** @internal */
    _getMarks(id?: number, kind?: number): NativeEditMark[];
    /** Maps document cells (one per newline) to a logical row and cell column, not a string index. */
    offsetToPosition(offset: number): {
        row: number;
        col: number;
    } | null;
    /** Maps a logical row and cell column to document cells, counting one cell per newline. */
    positionToOffset(row: number, col: number): number;
    /** Returns a logical line's start in document cells, counting one cell per newline. */
    getLineStartOffset(row: number): number;
    /**
     * Returns the global display offset at the end of `text` as this buffer would lay it out, without storing it: its
     * cells under this buffer's width method, tab width, and control notation, plus one per line break. Use
     * `measureEditText()` to measure without a buffer.
     */
    measureText(text: string): number;
    /** Converts a UTF-16 index in getText() to document cells (one per newline). Rounds down within a grapheme; clamps at EOF. */
    stringIndexToCellOffset(index: number): number;
    /** Converts document cells to a UTF-16 index in getText(). Rounds down within a grapheme, past zero-width text at a tie, and clamps at EOF. */
    cellOffsetToStringIndex(offset: number): number;
    /** Reads [startOffset, endOffset) in document display cells, counting one cell per newline. */
    getTextRange(startOffset: number, endOffset: number): string;
    /** Reads a half-open range between (zero-based logical row, display-cell column) pairs. */
    getTextRangeByCoords(startRow: number, startCol: number, endRow: number, endCol: number): string;
    debugLogRope(): void;
    undo(): string | null;
    redo(): string | null;
    canUndo(): boolean;
    canRedo(): boolean;
    clearHistory(): void;
    setDefaultFg(fg: RGBA | null): void;
    setDefaultBg(bg: RGBA | null): void;
    setDefaultAttributes(attributes: number | null): void;
    resetDefaults(): void;
    setSyntaxStyle(style: SyntaxStyle | null): void;
    getSyntaxStyle(): SyntaxStyle | null;
    /** Highlights a range in display cells relative to the logical line. */
    addHighlight(lineIdx: number, highlight: Highlight): void;
    /** Highlights a range in document display cells excluding newlines, not UTF-16 indices. */
    addHighlightByCharRange(highlight: Highlight): void;
    removeHighlightsByRef(hlRef: number): void;
    clearLineHighlights(lineIdx: number): void;
    clearAllHighlights(): void;
    getLineHighlights(lineIdx: number): Array<Highlight>;
    clear(): void;
    destroy(): void;
}
/**
 * Returns the editor offset at the end of `text` as an edit buffer with these settings lays it out, without an edit
 * buffer: its cells under `widthMethod`, `tabWidth`, and control notation, plus one per line break. `tabWidth` defaults
 * to the tab width of a new edit buffer and rounds as in `EditBuffer.setTabWidth()`.
 */
export declare function measureEditText(text: string, options: {
    widthMethod: WidthMethod;
    tabWidth?: number;
}): number;
