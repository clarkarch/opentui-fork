import { RGBA } from "./lib/RGBA.js";
import { type ContextEditorViewHandle, type RenderLib, type VisualCursor, type LineInfo, type NativeEditorReplacement } from "./zig.js";
import type { EditBuffer } from "./edit-buffer.js";
import type { NativeResourceOwner, ResourceContext } from "./buffer.js";
import type { SelectionBehavior, SelectionOccupancy } from "./types.js";
export interface Viewport {
    offsetY: number;
    offsetX: number;
    height: number;
    width: number;
}
export type { VisualCursor };
export declare class EditorView {
    private lib;
    private native;
    private editBuffer;
    private _destroyed;
    private _extmarksController?;
    constructor(lib: RenderLib, handle: ContextEditorViewHandle, editBuffer: EditBuffer, source: NativeResourceOwner);
    static create(editBuffer: EditBuffer, viewportWidth: number, viewportHeight: number): EditorView;
    get isDestroyed(): boolean;
    private guard;
    /** @internal Drawing targets must use the view's library and Context. */
    _getOwner(): ResourceContext;
    /** @internal Resources can be shared by scenes in the same Context. */
    _getSceneHandle(scene: NativeResourceOwner): ContextEditorViewHandle;
    private command;
    private position;
    private select;
    setViewportSize(width: number, height: number): void;
    setViewport(x: number, y: number, width: number, height: number, moveCursor?: boolean): void;
    getViewport(): Viewport;
    setScrollMargin(margin: number): void;
    setWrapMode(mode: "none" | "char" | "word"): void;
    getVirtualLineCount(): number;
    getTotalVirtualLineCount(): number;
    /** Selects [start, end) in document display cells, counting each newline as one. */
    setSelection(start: number, end: number, bgColor?: RGBA, fgColor?: RGBA): void;
    /** Sets the exclusive end in document display cells, counting each newline as one. */
    updateSelection(end: number, bgColor?: RGBA, fgColor?: RGBA): void;
    resetSelection(): void;
    /** Returns half-open bounds in document display cells, counting each newline as one. */
    getSelection(): {
        start: number;
        end: number;
    } | null;
    hasSelection(): boolean;
    /** Selects between viewport-local positions: x in display cells, y in wrapped rows. */
    setLocalSelection(anchorX: number, anchorY: number, focusX: number, focusY: number, bgColor?: RGBA, fgColor?: RGBA, updateCursor?: boolean, followCursor?: boolean, behavior?: SelectionBehavior): boolean;
    /** Updates the selection between viewport-local cell columns and wrapped rows. */
    updateLocalSelection(anchorX: number, anchorY: number, focusX: number, focusY: number, bgColor?: RGBA, fgColor?: RGBA, updateCursor?: boolean, followCursor?: boolean, behavior?: SelectionBehavior): boolean;
    resetLocalSelection(): void;
    convertSelectionToCell(): boolean;
    setSelectionOccupancy(occupancy: SelectionOccupancy): void;
    getSelectionOccupancy(): SelectionOccupancy;
    /** Selects document cell offsets (one per newline); cell occupancy includes the grapheme at the larger endpoint. */
    setSelectionInclusive(start: number, end: number, bgColor?: RGBA, fgColor?: RGBA): void;
    setSelectionColors(bgColor?: RGBA, fgColor?: RGBA): void;
    /** Returns selected text as a UTF-16-indexed JavaScript string. */
    getSelectedText(): string;
    /** Returns the zero-based logical row and display-cell column. */
    getCursor(): {
        row: number;
        col: number;
    };
    /** Returns the buffer text as a UTF-16-indexed JavaScript string. */
    getText(): string;
    /** Returns viewport and logical cell coordinates; the offset counts document cells, one per newline. */
    getVisualCursor(): VisualCursor;
    /** @internal Set while an extmarks controller lives: Up and Down apply the cursor rules around virtual extmarks. */
    _atomic: boolean;
    private rules;
    /** Moves the cursor up one wrapped row in the view. */
    moveUpVisual(): void;
    /** Moves the cursor down one wrapped row in the view. */
    moveDownVisual(): void;
    deleteSelectedText(): void;
    /** @internal The native controller replaces a selection in one checked operation. */
    _replaceSelectedText(text: string): NativeEditorReplacement;
    /** Sets the cursor in document display cells, counting each newline as one. */
    setCursorByOffset(offset: number): void;
    /** Returns the next word boundary in logical and viewport cell coordinates. */
    getNextWordBoundary(): VisualCursor;
    /** Returns the previous word boundary in logical and viewport cell coordinates. */
    getPrevWordBoundary(): VisualCursor;
    /** Returns the logical line end in logical and viewport cell coordinates. */
    getEOL(): VisualCursor;
    /** Returns the wrapped row start in logical and viewport cell coordinates. */
    getVisualSOL(): VisualCursor;
    /** Returns the wrapped row end in logical and viewport cell coordinates. */
    getVisualEOL(): VisualCursor;
    gotoVisualLineEnd(): void;
    getLineInfo(): LineInfo;
    getLogicalLineInfo(): LineInfo;
    /**
     * @internal A cursor that a wheel step, a pointer or the offset setter left inside virtual extmarks goes to the outer
     * edge of the marks around it: toward the end for a positive `direction`, the start for a negative one, or the nearer
     * edge. Only with an extmarks controller, and not while a selection is left: it holds the cursor at its focus.
     */
    _keepCursorOutside(direction: number): void;
    /** Marks use half-open document cell ranges, counting each newline as one. */
    get extmarks(): any;
    setPlaceholderStyledText(chunks: {
        text: string;
        fg?: RGBA;
        bg?: RGBA;
        attributes?: number;
    }[]): void;
    setTabIndicator(indicator: string | number): void;
    setTabIndicatorColor(color: RGBA): void;
    measureForDimensions(width: number, height: number): {
        lineCount: number;
        widthColsMax: number;
    } | null;
    destroy(): void;
}
