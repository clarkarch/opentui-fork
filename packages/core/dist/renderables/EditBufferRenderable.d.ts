import { Renderable, type RenderableOptions, type NativeRenderableIntegration } from "../Renderable.js";
import { Selection, type LocalSelectionBounds } from "../lib/selection.js";
import { EditBuffer, type LogicalCursor } from "../edit-buffer.js";
import { EditorView, type VisualCursor } from "../editor-view.js";
import { RGBA } from "../lib/RGBA.js";
import type { RenderContext, Highlight, CursorStyleOptions, LineInfoProvider, LineInfo, SelectionOccupancy } from "../types.js";
import type { OptimizedBuffer } from "../buffer.js";
import type { SyntaxStyle } from "../syntax-style.js";
declare const BrandedEditBufferRenderable: unique symbol;
export type EditorCapture = "escape" | "navigate" | "submit" | "tab";
export interface EditorTraits {
    capture?: readonly EditorCapture[];
    suspend?: boolean;
    status?: string;
}
export declare enum EditBufferRenderableEvents {
    TRAITS_CHANGED = "traits-changed"
}
export declare function isEditBufferRenderable(obj: unknown): obj is EditBufferRenderable;
export interface CursorChangeEvent {
    /** Zero-based logical line. */
    line: number;
    /** Display-cell column on that logical line, not a UTF-16 index. */
    visualColumn: number;
}
export interface ContentChangeEvent {
}
export interface EditBufferOptions extends RenderableOptions<EditBufferRenderable> {
    textColor?: string | RGBA;
    backgroundColor?: string | RGBA;
    selectionBg?: string | RGBA;
    selectionFg?: string | RGBA;
    selectable?: boolean;
    attributes?: number;
    wrapMode?: "none" | "char" | "word";
    scrollMargin?: number;
    scrollSpeed?: number;
    showCursor?: boolean;
    cursorColor?: string | RGBA;
    cursorStyle?: CursorStyleOptions;
    selectionOccupancy?: SelectionOccupancy;
    syntaxStyle?: SyntaxStyle;
    tabIndicator?: string | number;
    tabIndicatorColor?: string | RGBA;
    onCursorChange?: (event: CursorChangeEvent) => void;
    onContentChange?: (event: ContentChangeEvent) => void;
}
export declare abstract class EditBufferRenderable extends Renderable implements LineInfoProvider {
    static readonly nativeIntegration: NativeRenderableIntegration;
    [BrandedEditBufferRenderable]: boolean;
    protected static readonly defaultFocusable = true;
    private _traits;
    protected _textColor: RGBA;
    protected _backgroundColor: RGBA;
    protected _defaultAttributes: number;
    protected _selectionBg: RGBA | undefined;
    protected _selectionFg: RGBA | undefined;
    protected _wrapMode: "none" | "char" | "word";
    protected _scrollMargin: number;
    protected _showCursor: boolean;
    protected _cursorColor: RGBA;
    protected _cursorStyle: CursorStyleOptions;
    protected lastLocalSelection: LocalSelectionBounds | null;
    protected _tabIndicator?: string | number;
    protected _tabIndicatorColor?: RGBA;
    private _cursorChangeListener;
    private _contentChangeListener;
    private _autoScrollVelocity;
    private _autoScrollAccumulator;
    private _scrollSpeed;
    private _keyboardSelectionActive;
    readonly editBuffer: EditBuffer;
    readonly editorView: EditorView;
    protected _defaultOptions: {
        textColor: RGBA;
        backgroundColor: string;
        selectionBg: undefined;
        selectionFg: undefined;
        selectable: true;
        attributes: number;
        wrapMode: "none" | "char" | "word";
        scrollMargin: number;
        scrollSpeed: number;
        showCursor: true;
        cursorColor: RGBA;
        cursorStyle: {
            style: "block";
            blinking: true;
        };
        tabIndicator: undefined;
        tabIndicatorColor: undefined;
    };
    constructor(ctx: RenderContext, options: EditBufferOptions);
    get lineInfo(): LineInfo;
    private setupEventListeners;
    get lineCount(): number;
    get virtualLineCount(): number;
    get scrollY(): number;
    get scrollMargin(): number;
    set scrollMargin(value: number | undefined);
    /** Buffer text with LF line breaks. Index or slice it in UTF-16 units, not cursor offsets. */
    get plainText(): string;
    /** Logical row, display-cell column, and document cell offset (one per newline). */
    get logicalCursor(): LogicalCursor;
    /** Viewport-relative wrapped row and cell column, plus the logical position and document cell offset. */
    get visualCursor(): VisualCursor;
    /** Display cells from the document start, one per newline. Use editBuffer.cellOffsetToStringIndex for plainText. */
    get cursorOffset(): number;
    /** Sets the cursor in document display cells, counting each newline as one. */
    set cursorOffset(offset: number);
    private selectionSide;
    /** Legacy under-cursor lookup with line-end adjustments; not a conversion from cells to a UTF-16 caret index. */
    get cursorCharacterOffset(): number | undefined;
    get textColor(): RGBA;
    set textColor(value: RGBA | string | undefined);
    get selectionBg(): RGBA | undefined;
    get traits(): EditorTraits;
    set traits(value: EditorTraits);
    set selectionBg(value: RGBA | string | undefined);
    get selectionFg(): RGBA | undefined;
    set selectionFg(value: RGBA | string | undefined);
    get backgroundColor(): RGBA;
    set backgroundColor(value: RGBA | string | undefined);
    get attributes(): number;
    set attributes(value: number | undefined);
    get wrapMode(): "none" | "char" | "word";
    set wrapMode(value: "none" | "char" | "word");
    get showCursor(): boolean;
    set showCursor(value: boolean);
    get cursorColor(): RGBA;
    set cursorColor(value: RGBA | string);
    get cursorStyle(): CursorStyleOptions;
    set cursorStyle(value: CursorStyleOptions | null | undefined);
    get selectionOccupancy(): SelectionOccupancy;
    set selectionOccupancy(value: SelectionOccupancy | null | undefined);
    get tabIndicator(): string | number | undefined;
    set tabIndicator(value: string | number | undefined);
    get tabIndicatorColor(): RGBA | undefined;
    set tabIndicatorColor(value: RGBA | string | undefined);
    get scrollSpeed(): number;
    set scrollSpeed(value: number);
    protected onMouseEvent(event: any): void;
    protected handleScroll(event: any): void;
    protected onResize(width: number, height: number): void;
    protected refreshLocalSelection(): boolean;
    private updateLocalSelection;
    shouldStartSelection(x: number, y: number): boolean;
    onSelectionChanged(selection: Selection | null): boolean;
    /** @internal */
    get _needsAutoScrollUpdate(): boolean;
    protected onUpdate(deltaTime: number): void;
    /** Returns the selected text as a UTF-16-indexed JavaScript string. */
    getSelectedText(): string;
    hasSelection(): boolean;
    /** Returns half-open document cell bounds, counting one cell per newline. */
    getSelection(): {
        start: number;
        end: number;
    } | null;
    private deleteSelectedText;
    private resetSelection;
    /** Selects [start, end) in document display cells, counting one cell per newline. */
    setSelection(start: number, end: number): void;
    /** Takes document cell offsets (one per newline); cell occupancy includes the grapheme at the larger endpoint. */
    setSelectionInclusive(start: number, end: number): void;
    clearSelection(): boolean;
    deleteSelection(): boolean;
    /** Sets the cursor by zero-based logical row and display-cell column. */
    setCursor(row: number, col: number): void;
    insertChar(char: string): void;
    insertText(text: string): void;
    private insertOrReplaceSelection;
    deleteChar(): boolean;
    deleteCharBackward(): boolean;
    newLine(): boolean;
    deleteLine(): boolean;
    private collapseSelectionToEdge;
    /** Moves left by a cursor stop, not one UTF-16 unit; select extends the cell range. */
    moveCursorLeft(options?: {
        select?: boolean;
    }): boolean;
    /** Moves right by a cursor stop, not one UTF-16 unit; select extends the cell range. */
    moveCursorRight(options?: {
        select?: boolean;
    }): boolean;
    /** Moves up one wrapped row; select extends the document cell range. */
    moveCursorUp(options?: {
        select?: boolean;
    }): boolean;
    /** Moves down one wrapped row; select extends the document cell range. */
    moveCursorDown(options?: {
        select?: boolean;
    }): boolean;
    /** Moves to a zero-based logical line. */
    gotoLine(line: number): void;
    gotoLineStart(): void;
    gotoLineTextEnd(): void;
    gotoLineHome(options?: {
        select?: boolean;
    }): boolean;
    gotoLineEnd(options?: {
        select?: boolean;
    }): boolean;
    gotoVisualLineHome(options?: {
        select?: boolean;
    }): boolean;
    gotoVisualLineEnd(options?: {
        select?: boolean;
    }): boolean;
    gotoBufferHome(options?: {
        select?: boolean;
    }): boolean;
    gotoBufferEnd(options?: {
        select?: boolean;
    }): boolean;
    selectAll(): boolean;
    deleteToLineEnd(): boolean;
    deleteToLineStart(): boolean;
    undo(): boolean;
    redo(): boolean;
    /** Moves to the next word boundary; select extends the document cell range. */
    moveWordForward(options?: {
        select?: boolean;
    }): boolean;
    /** Moves to the previous word boundary; select extends the document cell range. */
    moveWordBackward(options?: {
        select?: boolean;
    }): boolean;
    deleteWordForward(): boolean;
    deleteWordBackward(): boolean;
    protected renderSelf(buffer: OptimizedBuffer): void;
    focus(): void;
    blur(): void;
    protected destroyOwnedResources(): void;
    set onCursorChange(handler: ((event: CursorChangeEvent) => void) | undefined);
    get onCursorChange(): ((event: CursorChangeEvent) => void) | undefined;
    set onContentChange(handler: ((event: ContentChangeEvent) => void) | undefined);
    get onContentChange(): ((event: ContentChangeEvent) => void) | undefined;
    get syntaxStyle(): SyntaxStyle | null;
    set syntaxStyle(style: SyntaxStyle | null);
    /** Highlights a range in display cells relative to the logical line. */
    addHighlight(lineIdx: number, highlight: Highlight): void;
    /** Highlights a range in document display cells excluding newlines, not UTF-16 indices. */
    addHighlightByCharRange(highlight: Highlight): void;
    removeHighlightsByRef(hlRef: number): void;
    clearLineHighlights(lineIdx: number): void;
    clearAllHighlights(): void;
    getLineHighlights(lineIdx: number): Array<Highlight>;
    /**
     * Set text and completely reset the buffer state (clears history, resets add_buffer).
     * Use this for initial text setting or when you want a clean slate.
     */
    setText(text: string): void;
    /**
     * Replace text while preserving undo history (creates an undo point).
     * Use this when you want the setText operation to be undoable.
     */
    replaceText(text: string): void;
    clear(): void;
    /** Deletes a half-open range between (zero-based logical line, display-cell column) pairs. */
    deleteRange(startLine: number, startCol: number, endLine: number, endCol: number): void;
    /** Reads [startOffset, endOffset) in document display cells, counting one cell per newline. */
    getTextRange(startOffset: number, endOffset: number): string;
    /** Reads a half-open range between (zero-based logical row, display-cell column) pairs. */
    getTextRangeByCoords(startRow: number, startCol: number, endRow: number, endCol: number): string;
    private setNativeEditorOptions;
    protected updateSelectionForMovement(shiftPressed: boolean, isBeforeMovement: boolean): void;
}
export {};
