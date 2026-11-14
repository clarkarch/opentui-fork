import type { EditBuffer } from "../edit-buffer.js";
import type { EditorView } from "../editor-view.js";
export interface Extmark {
    id: number;
    /** Inclusive document cell offset, counting one cell per newline. */
    start: number;
    /** Exclusive document cell offset, counting one cell per newline. */
    end: number;
    virtual: boolean;
    styleId?: number;
    priority?: number;
    data?: any;
    typeId: number;
}
export interface ExtmarkOptions {
    /** Inclusive document cell offset, counting one cell per newline. */
    start: number;
    /** Exclusive document cell offset, counting one cell per newline. */
    end: number;
    virtual?: boolean;
    styleId?: number;
    priority?: number;
    data?: any;
    typeId?: number;
    metadata?: any;
}
/**
 * Extmarks live in the native edit buffer, which moves them with edits and restores them with undo and redo. Ids are
 * never reused. Text inserted strictly inside a virtual extmark, or an edit that removes part of it, drops it. While a
 * controller lives and its view has no selection, the buffer's Left, Right, Backspace, Delete and offset setter and the
 * view's Up and Down apply the native cursor rules around virtual extmarks.
 */
export declare class ExtmarksController {
    private editBuffer;
    private editorView;
    private state;
    private destroyed;
    private readonly atomic;
    constructor(editBuffer: EditBuffer, editorView: EditorView);
    private toExtmark;
    /** Marks a half-open document cell range, counting one cell per newline. Returns a mark ID. */
    create(options: ExtmarkOptions): number;
    delete(id: number): boolean;
    get(id: number): Extmark | null;
    getAll(): Extmark[];
    getVirtual(): Extmark[];
    /** Looks up marks covering a document cell offset, counting one cell per newline. */
    getAtOffset(offset: number): Extmark[];
    getAllForTypeId(typeId: number): Extmark[];
    clear(): void;
    registerType(typeName: string): number;
    getTypeId(typeName: string): number | null;
    getTypeName(typeId: number): string | null;
    getMetadataFor(extmarkId: number): any;
    private get gone();
    /** Stops the cursor rules for its view. The marks, their payloads and the type names stay with the buffer. */
    destroy(): void;
}
export declare function createExtmarksController(editBuffer: EditBuffer, editorView: EditorView): ExtmarksController;
