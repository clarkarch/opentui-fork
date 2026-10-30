// @bun
import {
  BaseRenderable,
  Edge,
  Gutter,
  InternalKeyHandler,
  KeyHandler,
  NativeError,
  NativePaintRecorder,
  NativeSceneFrame,
  NativeStyleFlags,
  NativeStyleGroup,
  OptimizedBuffer,
  RGBA,
  Renderable,
  ResourceContext,
  RootRenderable,
  SceneStaging,
  Selection,
  StdinParser,
  StyledText,
  SystemClock,
  YogaValueKind,
  borderCharsToArray,
  buildTerminalPaletteSignature,
  convertGlobalToLocalSelection,
  createExtmarksController,
  createTerminalPalette,
  destroyTreeSitterClient,
  env,
  getBorderSides,
  getTreeSitterClient,
  isStyledText,
  isValidPercentage,
  kittyKeyMap,
  nativeConstants,
  nativeLayouts,
  normalizeTerminalPalette,
  parseBorderStyle,
  parseColor,
  printableKeypadText,
  registerEnvVar,
  resolveRenderLib,
  singleton,
  stringToStyledText,
  stringWidth,
  toArrayBuffer,
  treeSitterToTextChunks
} from "./chunk-bun-fsx01y4t.js";

// src/text-buffer.ts
import { readFileSync } from "fs";
class TextBuffer {
  lib;
  native;
  _length = 0;
  _byteSize = 0;
  _destroyed = false;
  _syntaxStyle;
  constructor(lib, handle, source) {
    const owner = source?.resourceContext;
    if (!owner)
      throw new Error("TextBuffer requires an explicit resource owner");
    owner.assertAlive();
    if (owner.renderLib !== lib || !handle || typeof handle !== "object" || handle.context !== owner.context) {
      throw new Error("TextBuffer Context owner mismatch");
    }
    this.lib = lib;
    this.native = { owner, handle };
    this.updateLengths();
  }
  static create(widthMethod, source) {
    const owner = source?.resourceContext;
    if (!owner)
      throw new Error("TextBuffer requires an explicit resource owner: pass renderer.nativeScene, or a ResourceContext when there is no renderer");
    owner.assertAlive();
    const lib = owner.renderLib;
    const handle = lib.createContextTextBuffer(owner.context, { widthMethod });
    try {
      return new TextBuffer(lib, handle, owner);
    } catch (error) {
      lib.destroyContextTextBuffer(owner.context, handle);
      throw error;
    }
  }
  guard() {
    if (this._destroyed)
      throw new Error("TextBuffer is destroyed");
    this.native.owner.assertAlive();
  }
  _getOwner() {
    this.guard();
    return this.native.owner;
  }
  _getSceneHandle(scene) {
    this.guard();
    if (this.native.owner !== scene.resourceContext)
      throw new Error("TextBuffer Context owner mismatch");
    return this.native.handle;
  }
  updateLengths() {
    const info = this.lib.contextTextBufferGetInfo(this.native.handle.context, this.native.handle);
    this._length = info.textLength;
    this._byteSize = info.byteLength;
  }
  setText(text) {
    this.guard();
    this.lib.getYogaHost().runMutation(() => {
      const textBytes = this.lib.encoder.encode(text);
      this.lib.contextTextBufferSetText(this.native.handle.context, this.native.handle, textBytes);
      this.updateLengths();
    });
  }
  append(text) {
    this.guard();
    this.lib.getYogaHost().runMutation(() => {
      const textBytes = this.lib.encoder.encode(text);
      this.lib.contextTextBufferAppend(this.native.handle.context, this.native.handle, textBytes);
      this.updateLengths();
    });
  }
  loadFile(path) {
    this.guard();
    this.lib.getYogaHost().runMutation(() => {
      let bytes;
      try {
        bytes = readFileSync(path);
      } catch (cause) {
        throw new Error(`Failed to load file: ${path}`, { cause });
      }
      this.lib.contextTextBufferSetText(this.native.handle.context, this.native.handle, bytes);
      this.updateLengths();
    });
  }
  setStyledText(text) {
    this.guard();
    this.lib.getYogaHost().runMutation(() => {
      const chunks = text.chunks;
      if (Array.isArray(chunks) && chunks.length === 0) {
        this.lib.contextTextBufferClear(this.native.handle.context, this.native.handle);
      } else {
        this.lib.contextTextBufferSetStyledText(this.native.handle.context, this.native.handle, new StyledText(chunks));
      }
      this.updateLengths();
    });
  }
  _setEncodedStyledText(text) {
    this.guard();
    this.lib.getYogaHost().runMutation(() => {
      this.lib.contextTextBufferSetEncodedStyledText(this.native.handle.context, this.native.handle, text);
      this.updateLengths();
    });
  }
  static _replaceStyledTextBatch(replacements, beforeNative) {
    if (replacements.length === 0) {
      beforeNative();
      return true;
    }
    const owner = replacements[0].textBuffer._getOwner();
    const lib = owner.renderLib;
    const entries = replacements.map(({ textBuffer, textBufferView, text }) => ({
      buffer: textBuffer._getSceneHandle(owner),
      view: textBufferView._getSceneHandle(owner),
      text
    }));
    return lib.getYogaHost().runMutation(() => {
      const info = lib.contextTextBufferReplaceStyledBatch(owner.context, entries, beforeNative);
      if (info === null)
        return false;
      for (let index = 0;index < replacements.length; index++) {
        replacements[index].textBuffer._length = info[index * 2];
        replacements[index].textBuffer._byteSize = info[index * 2 + 1];
      }
      return true;
    });
  }
  setDefaults(mask, style) {
    this.guard();
    this.lib.contextTextBufferSetDefaults(this.native.handle.context, this.native.handle, mask, style);
  }
  _setDefaults(fg, bg, attributes) {
    this.setDefaults(7 /* All */, { fg, bg, attributes });
  }
  setDefaultFg(fg) {
    this.setDefaults(1 /* Foreground */, { fg });
  }
  setDefaultBg(bg) {
    this.setDefaults(2 /* Background */, { bg });
  }
  setDefaultAttributes(attributes) {
    this.setDefaults(4 /* Attributes */, { attributes });
  }
  resetDefaults() {
    this.setDefaults(7 /* All */, {});
  }
  getLineCount() {
    this.guard();
    return this.lib.contextTextBufferGetInfo(this.native.handle.context, this.native.handle).lineCount;
  }
  get length() {
    this.guard();
    return this._length;
  }
  get byteSize() {
    this.guard();
    return this._byteSize;
  }
  getPlainText() {
    this.guard();
    return this.lib.contextTextBufferGetText(this.native.handle.context, this.native.handle);
  }
  getTextRange(startOffset, endOffset) {
    this.guard();
    if (startOffset >= endOffset)
      return "";
    return this.lib.contextTextBufferGetRange(this.native.handle.context, this.native.handle, startOffset, endOffset);
  }
  highlight(operation, argument, highlight) {
    this.guard();
    this.lib.contextTextBufferHighlight(this.native.handle.context, this.native.handle, operation, argument, highlight);
  }
  addHighlightByCharRange(highlight) {
    this.highlight(1 /* AddRange */, 0, highlight);
  }
  addHighlight(lineIdx, highlight) {
    this.highlight(0 /* AddLine */, lineIdx, highlight);
  }
  removeHighlightsByRef(hlRef) {
    this.highlight(2 /* RemoveRef */, hlRef);
  }
  clearLineHighlights(lineIdx) {
    this.highlight(3 /* ClearLine */, lineIdx);
  }
  clearAllHighlights() {
    this.highlight(4 /* ClearAll */);
  }
  getLineHighlights(lineIdx) {
    this.guard();
    return this.lib.contextTextBufferGetHighlights(this.native.handle.context, this.native.handle, lineIdx);
  }
  getHighlightCount() {
    this.guard();
    return this.lib.contextTextBufferGetInfo(this.native.handle.context, this.native.handle).highlightCount;
  }
  setSyntaxStyle(style) {
    this.guard();
    this.lib.getYogaHost().runMutation(() => {
      this.lib.contextTextBufferSetSyntaxStyle(this.native.handle.context, this.native.handle, style?._getSceneHandle(this.native.owner) ?? null);
      this._syntaxStyle = style ?? undefined;
    });
  }
  getSyntaxStyle() {
    this.guard();
    return this._syntaxStyle ?? null;
  }
  setTabWidth(width) {
    this.guard();
    this.lib.getYogaHost().runMutation(() => {
      this.lib.contextTextBufferSetTabWidth(this.native.handle.context, this.native.handle, width);
      this.updateLengths();
    });
  }
  getTabWidth() {
    this.guard();
    return this.lib.contextTextBufferGetInfo(this.native.handle.context, this.native.handle).tabWidth;
  }
  clear() {
    this.guard();
    this.lib.getYogaHost().runMutation(() => {
      this.lib.contextTextBufferClear(this.native.handle.context, this.native.handle);
      this._length = 0;
      this._byteSize = 0;
    });
  }
  reset() {
    this.guard();
    this.lib.getYogaHost().runMutation(() => {
      this.lib.contextTextBufferClear(this.native.handle.context, this.native.handle, true);
      this._length = 0;
      this._byteSize = 0;
    });
  }
  destroy() {
    if (this._destroyed)
      return;
    this.lib.getYogaHost().runMutation(() => {
      if (!this.native.owner.disposed) {
        try {
          this.lib.releaseAfterPaint(this.native.handle.context, () => this.lib.destroyContextTextBuffer(this.native.handle.context, this.native.handle));
        } catch (error) {
          if (!(error instanceof NativeError) || error.status !== -9 /* StaleHandle */)
            throw error;
        }
      }
      this._destroyed = true;
      this._syntaxStyle = undefined;
    });
  }
}

// src/text-buffer-view.ts
class TextBufferView {
  lib;
  native;
  textBuffer;
  _destroyed = false;
  selectionClear = true;
  constructor(lib, handle, textBuffer, source) {
    const owner = source?.resourceContext;
    if (!owner)
      throw new Error("TextBufferView requires an explicit resource owner");
    owner.assertAlive();
    if (owner.renderLib !== lib)
      throw new Error("TextBufferView library owner mismatch");
    if (textBuffer._getOwner() !== owner || !handle || typeof handle !== "object" || handle.context !== owner.context) {
      throw new Error("TextBufferView Context owner mismatch");
    }
    this.lib = lib;
    this.native = { owner, handle };
    this.textBuffer = textBuffer;
  }
  static create(textBuffer) {
    const owner = textBuffer._getOwner();
    const lib = owner.renderLib;
    const handle = lib.createContextTextBufferView(owner.context, textBuffer._getSceneHandle(owner));
    try {
      return new TextBufferView(lib, handle, textBuffer, owner);
    } catch (error) {
      lib.destroyContextTextBufferView(owner.context, handle);
      throw error;
    }
  }
  guard() {
    if (this._destroyed)
      throw new Error("TextBufferView is destroyed");
    this.native.owner.assertAlive();
    this.textBuffer._getSceneHandle(this.native.owner);
  }
  _getOwner() {
    this.guard();
    return this.native.owner;
  }
  _getSceneHandle(scene) {
    this.guard();
    if (this.native.owner !== scene.resourceContext)
      throw new Error("TextBufferView Context owner mismatch");
    return this.native.handle;
  }
  select(selection) {
    this.guard();
    this.selectionClear = false;
    return this.lib.contextTextBufferViewSelect(this.native.handle.context, this.native.handle, selection);
  }
  reset(local) {
    this.guard();
    const { context } = this.native.handle;
    this.lib.contextTextBufferViewResetSelection(context, this.native.handle, local, this.selectionClear);
    this.selectionClear = true;
  }
  setSelection(start, end, bgColor, fgColor) {
    this.select({ operation: 0 /* Set */, start, end, bg: bgColor, fg: fgColor });
  }
  updateSelection(end, bgColor, fgColor) {
    this.select({ operation: 1 /* Update */, end, bg: bgColor, fg: fgColor });
  }
  resetSelection() {
    this.reset(false);
  }
  getSelection() {
    this.guard();
    return this.lib.contextTextBufferViewGetInfo(this.native.handle.context, this.native.handle).selection;
  }
  hasSelection() {
    this.guard();
    return this.getSelection() !== null;
  }
  setLocalSelection(anchorX, anchorY, focusX, focusY, bgColor, fgColor, behavior = "cell") {
    return this.select({
      operation: 3 /* Local */,
      anchorX,
      anchorY,
      focusX,
      focusY,
      bg: bgColor,
      fg: fgColor,
      behavior: behavior === "cell" ? 0 : behavior === "word" ? 1 : 2
    });
  }
  updateLocalSelection(anchorX, anchorY, focusX, focusY, bgColor, fgColor, behavior = "cell") {
    return this.select({
      operation: 4 /* LocalUpdate */,
      anchorX,
      anchorY,
      focusX,
      focusY,
      bg: bgColor,
      fg: fgColor,
      behavior: behavior === "cell" ? 0 : behavior === "word" ? 1 : 2
    });
  }
  resetLocalSelection() {
    this.reset(true);
  }
  setSelectionOccupancy(occupancy) {
    this.guard();
    this.lib.contextTextBufferViewSelect(this.native.handle.context, this.native.handle, {
      operation: 7 /* Occupancy */,
      behavior: occupancy === "boundary" ? 1 : 0
    });
  }
  getSelectionOccupancy() {
    this.guard();
    return this.lib.contextTextBufferViewGetInfo(this.native.handle.context, this.native.handle).selectionOccupancy;
  }
  command(command, argument) {
    this.guard();
    this.lib.contextTextBufferViewCommand(this.native.handle.context, this.native.handle, command, argument);
  }
  setWrapWidth(width) {
    this.command(0 /* WrapWidth */, width ?? 0);
  }
  setWrapMode(mode) {
    this.command(1 /* WrapMode */, mode === "none" ? 0 : mode === "char" ? 1 : 2);
  }
  setTextAlign(alignment) {
    this.command(5 /* TextAlign */, alignment === "left" ? 0 : alignment === "center" ? 1 : 2);
  }
  setFirstLineOffset(offset) {
    this.command(2 /* FirstLineOffset */, offset);
  }
  setViewportSize(width, height) {
    this.guard();
    return this.lib.contextTextBufferViewSetViewport(this.native.handle.context, this.native.handle, { x: 0, y: 0, width, height }, true);
  }
  setViewport(x, y, width, height) {
    this.guard();
    return this.lib.contextTextBufferViewSetViewport(this.native.handle.context, this.native.handle, {
      x,
      y,
      width,
      height
    });
  }
  get lineInfo() {
    this.guard();
    return this.lib.contextTextBufferViewGetLines(this.native.handle.context, this.native.handle);
  }
  get logicalLineInfo() {
    this.guard();
    return this.lib.contextTextBufferViewGetLines(this.native.handle.context, this.native.handle, true);
  }
  getLineSources(startLine, lineCount) {
    this.guard();
    const { context } = this.native.handle;
    return this.lib.contextTextBufferViewGetLines(context, this.native.handle, true, startLine, lineCount).lineSources;
  }
  getSelectedText() {
    this.guard();
    return this.lib.contextTextBufferViewGetSelectedText(this.native.handle.context, this.native.handle);
  }
  getPlainText() {
    this.guard();
    return this.textBuffer.getPlainText();
  }
  setTabIndicator(indicator) {
    const codePoint = typeof indicator === "string" ? indicator.codePointAt(0) ?? 0 : indicator;
    this.command(3 /* TabIndicator */, codePoint);
  }
  setTabIndicatorColor(color) {
    this.guard();
    return this.lib.contextTextBufferViewSetTabColor(this.native.handle.context, this.native.handle, color);
  }
  setTruncate(truncate) {
    this.command(4 /* Truncate */, truncate ? 1 : 0);
  }
  measureForDimensions(width, height) {
    this.guard();
    return this.lib.contextTextBufferViewMeasure(this.native.handle.context, this.native.handle, width, height);
  }
  getVirtualLineCount() {
    this.guard();
    return this.lib.contextTextBufferViewGetInfo(this.native.handle.context, this.native.handle).virtualLineCount;
  }
  destroy() {
    if (this._destroyed)
      return;
    this.lib.getYogaHost().runMutation(() => {
      if (!this.native.owner.disposed) {
        try {
          this.lib.releaseAfterPaint(this.native.handle.context, () => this.lib.destroyContextTextBufferView(this.native.handle.context, this.native.handle));
        } catch (error) {
          if (!(error instanceof NativeError) || error.status !== -9 /* StaleHandle */)
            throw error;
        }
      }
      this._destroyed = true;
    });
  }
}

// src/edit-buffer.ts
import { EventEmitter } from "events";

class EditBuffer extends EventEmitter {
  lib;
  native;
  unsubscribe;
  id;
  _destroyed = false;
  _syntaxStyle;
  constructor(lib, handle, source) {
    super();
    const owner = source?.resourceContext;
    if (!owner)
      throw new Error("EditBuffer requires an explicit resource owner");
    owner.assertAlive();
    if (owner.renderLib !== lib || !handle || typeof handle !== "object" || handle.context !== owner.context) {
      throw new Error("EditBuffer Context owner mismatch");
    }
    this.lib = lib;
    this.native = { owner, handle };
    this.id = handle.slot;
    this.unsubscribe = lib.onContextEditEvent(handle.context, handle, (name) => {
      if (!this._destroyed && !owner.disposed)
        this.emit(name);
    });
  }
  static create(widthMethod, source) {
    const owner = source?.resourceContext;
    if (!owner)
      throw new Error("EditBuffer requires an explicit resource owner: pass renderer.nativeScene, or a ResourceContext when there is no renderer");
    owner.assertAlive();
    const lib = owner.renderLib;
    const handle = lib.createContextEditBuffer(owner.context, { widthMethod });
    try {
      return new EditBuffer(lib, handle, owner);
    } catch (error) {
      lib.destroyContextEditBuffer(owner.context, handle);
      throw error;
    }
  }
  guard() {
    if (this._destroyed)
      throw new Error("EditBuffer is destroyed");
    this.native.owner.assertAlive();
  }
  _getOwner() {
    this.guard();
    return this.native.owner;
  }
  _getSceneHandle(scene) {
    this.guard();
    if (this.native.owner !== scene.resourceContext)
      throw new Error("EditBuffer Context owner mismatch");
    return this.native.handle;
  }
  runMutation(operation) {
    this.guard();
    return this.lib.getYogaHost().runMutation(operation);
  }
  command(command, argument) {
    this.guard();
    this.lib.contextEditBufferCommand(this.native.handle.context, this.native.handle, command, argument);
  }
  position(query, a, b) {
    this.guard();
    return this.lib.contextEditBufferGetPosition(this.native.handle.context, this.native.handle, query, a, b);
  }
  highlight(operation, argument, highlight) {
    this.guard();
    this.lib.contextEditBufferHighlight(this.native.handle.context, this.native.handle, operation, argument, highlight);
  }
  setDefaults(mask, style) {
    this.guard();
    this.lib.contextEditBufferSetDefaults(this.native.handle.context, this.native.handle, mask, style);
  }
  setNativeText(text, preserveHistory = false) {
    const textBytes = this.lib.encoder.encode(text);
    this.lib.contextEditBufferSetText(this.native.handle.context, this.native.handle, textBytes, preserveHistory);
  }
  setText(text) {
    this.runMutation(() => this.setNativeText(text));
  }
  setTextOwned(text) {
    this.guard();
    this.setNativeText(text);
  }
  replaceText(text) {
    this.runMutation(() => this.setNativeText(text, true));
  }
  replaceTextOwned(text) {
    this.guard();
    this.setNativeText(text, true);
  }
  getLineCount() {
    this.guard();
    return this.lib.contextEditBufferGetInfo(this.native.handle.context, this.native.handle).lineCount;
  }
  setTabWidth(width) {
    this.runMutation(() => {
      this.lib.contextEditBufferSetTabWidth(this.native.handle.context, this.native.handle, width);
    });
  }
  getTabWidth() {
    this.guard();
    return this.lib.contextEditBufferGetInfo(this.native.handle.context, this.native.handle).tabWidth;
  }
  getText() {
    this.guard();
    return this.lib.contextEditBufferGetText(this.native.handle.context, this.native.handle);
  }
  insertChar(char) {
    this.guard();
    return this.lib.contextEditBufferInsertText(this.native.handle.context, this.native.handle, this.lib.encoder.encode(char));
  }
  insertText(text) {
    this.guard();
    return this.lib.contextEditBufferInsertText(this.native.handle.context, this.native.handle, this.lib.encoder.encode(text));
  }
  deleteChar() {
    this.command(0 /* DeleteForward */);
  }
  deleteCharBackward() {
    this.command(1 /* Backspace */);
  }
  deleteRange(startLine, startCol, endLine, endCol) {
    this.guard();
    return this.lib.contextEditBufferDeleteRange(this.native.handle.context, this.native.handle, startLine, startCol, endLine, endCol);
  }
  newLine() {
    this.command(2 /* NewLine */);
  }
  deleteLine() {
    this.command(3 /* DeleteLine */);
  }
  moveCursorLeft() {
    this.command(4 /* MoveLeft */);
  }
  moveCursorRight() {
    this.command(5 /* MoveRight */);
  }
  moveCursorUp() {
    this.command(6 /* MoveUp */);
  }
  moveCursorDown() {
    this.command(7 /* MoveDown */);
  }
  gotoLine(line) {
    this.command(8 /* GotoLine */, line);
  }
  setCursor(line, col) {
    this.guard();
    return this.lib.contextEditBufferSetCursor(this.native.handle.context, this.native.handle, line, col);
  }
  setCursorToLineCol(line, col) {
    this.guard();
    return this.lib.contextEditBufferSetCursor(this.native.handle.context, this.native.handle, line, col);
  }
  setCursorByOffset(offset) {
    this.command(9 /* CursorOffset */, offset);
  }
  getCursorPosition() {
    this.guard();
    return this.lib.contextEditBufferGetInfo(this.native.handle.context, this.native.handle).cursor;
  }
  getNextWordBoundary() {
    return this.position(1 /* NextWord */);
  }
  getPrevWordBoundary() {
    return this.position(2 /* PrevWord */);
  }
  getEOL() {
    return this.position(3 /* Eol */);
  }
  _getEOF() {
    return this.position(7 /* End */);
  }
  _getPrevCharBoundary() {
    return this.position(8 /* PrevChar */);
  }
  offsetToPosition(offset) {
    const result = this.position(4 /* Offset */, offset);
    return result && { row: result.row, col: result.col };
  }
  positionToOffset(row, col) {
    return this.position(5 /* Coords */, row, col)?.offset ?? 0;
  }
  getLineStartOffset(row) {
    return this.position(6 /* LineStart */, row)?.offset ?? 0;
  }
  measureText(text) {
    this.guard();
    return this.lib.contextEditBufferMeasureText(this.native.handle.context, this.native.handle, this.lib.encoder.encode(text));
  }
  getTextRange(startOffset, endOffset) {
    this.guard();
    if (startOffset >= endOffset)
      return "";
    return this.lib.contextEditBufferGetRange(this.native.handle.context, this.native.handle, false, 0, startOffset, 0, endOffset);
  }
  getTextRangeByCoords(startRow, startCol, endRow, endCol) {
    this.guard();
    return this.lib.contextEditBufferGetRange(this.native.handle.context, this.native.handle, true, startRow, startCol, endRow, endCol);
  }
  debugLogRope() {
    this.command(12 /* DebugRope */);
    this.lib.logContextDiagnostics(this.native.handle.context);
  }
  undo() {
    this.guard();
    return this.lib.contextEditBufferHistory(this.native.handle.context, this.native.handle, false);
  }
  redo() {
    this.guard();
    return this.lib.contextEditBufferHistory(this.native.handle.context, this.native.handle, true);
  }
  canUndo() {
    this.guard();
    return this.lib.contextEditBufferGetInfo(this.native.handle.context, this.native.handle).canUndo;
  }
  canRedo() {
    this.guard();
    return this.lib.contextEditBufferGetInfo(this.native.handle.context, this.native.handle).canRedo;
  }
  clearHistory() {
    this.command(11 /* ClearHistory */);
  }
  setDefaultFg(fg) {
    this.setDefaults(1 /* Foreground */, { fg });
  }
  setDefaultBg(bg) {
    this.setDefaults(2 /* Background */, { bg });
  }
  setDefaultAttributes(attributes) {
    this.setDefaults(4 /* Attributes */, { attributes });
  }
  resetDefaults() {
    this.setDefaults(7 /* All */, {});
  }
  setSyntaxStyle(style) {
    this.runMutation(() => {
      this.lib.contextEditBufferSetSyntaxStyle(this.native.handle.context, this.native.handle, style?._getSceneHandle(this.native.owner) ?? null);
      this._syntaxStyle = style ?? undefined;
    });
  }
  getSyntaxStyle() {
    this.guard();
    return this._syntaxStyle ?? null;
  }
  addHighlight(lineIdx, highlight) {
    this.highlight(0 /* AddLine */, lineIdx, highlight);
  }
  addHighlightByCharRange(highlight) {
    this.highlight(1 /* AddRange */, 0, highlight);
  }
  removeHighlightsByRef(hlRef) {
    this.highlight(2 /* RemoveRef */, hlRef);
  }
  clearLineHighlights(lineIdx) {
    this.highlight(3 /* ClearLine */, lineIdx);
  }
  clearAllHighlights() {
    this.highlight(4 /* ClearAll */);
  }
  getLineHighlights(lineIdx) {
    this.guard();
    return this.lib.contextEditBufferGetHighlights(this.native.handle.context, this.native.handle, lineIdx);
  }
  clear() {
    this.command(10 /* Clear */);
  }
  destroy() {
    if (this._destroyed)
      return;
    this.lib.getYogaHost().runMutation(() => {
      if (!this.native.owner.disposed)
        this.lib.releaseAfterPaint(this.native.handle.context, () => this.lib.destroyContextEditBuffer(this.native.handle.context, this.native.handle));
      this._destroyed = true;
      this.unsubscribe?.();
      this.unsubscribe = undefined;
      this.removeAllListeners();
      this._syntaxStyle = undefined;
    });
  }
}
function measureEditText(text, options) {
  const lib = resolveRenderLib();
  return lib.editMeasureText(lib.encoder.encode(text), options.widthMethod, options.tabWidth ?? 0);
}

// src/editor-view.ts
class EditorView {
  lib;
  native;
  editBuffer;
  _destroyed = false;
  _extmarksController;
  constructor(lib, handle, editBuffer, source) {
    const owner = source?.resourceContext;
    if (!owner)
      throw new Error("EditorView requires an explicit resource owner");
    owner.assertAlive();
    if (owner.renderLib !== lib)
      throw new Error("EditorView library owner mismatch");
    if (editBuffer._getOwner() !== owner || !handle || typeof handle !== "object" || handle.context !== owner.context) {
      throw new Error("EditorView Context owner mismatch");
    }
    this.lib = lib;
    this.native = { owner, handle };
    this.editBuffer = editBuffer;
  }
  static create(editBuffer, viewportWidth, viewportHeight) {
    const owner = editBuffer._getOwner();
    const lib = owner.renderLib;
    const handle = lib.createContextEditorView(owner.context, editBuffer._getSceneHandle(owner), viewportWidth, viewportHeight);
    try {
      return new EditorView(lib, handle, editBuffer, owner);
    } catch (error) {
      lib.destroyContextEditorView(owner.context, handle);
      throw error;
    }
  }
  get isDestroyed() {
    return this._destroyed;
  }
  guard() {
    if (this._destroyed)
      throw new Error("EditorView is destroyed");
    this.native.owner.assertAlive();
    this.editBuffer._getOwner();
  }
  _getOwner() {
    this.guard();
    return this.native.owner;
  }
  _getSceneHandle(scene) {
    this.guard();
    if (this.native.owner !== scene.resourceContext)
      throw new Error("EditorView Context owner mismatch");
    return this.native.handle;
  }
  command(command, argument) {
    this.guard();
    this.lib.contextEditorViewCommand(this.native.handle.context, this.native.handle, command, argument);
  }
  position(query) {
    this.guard();
    return this.lib.contextEditorViewGetPosition(this.native.handle.context, this.native.handle, query);
  }
  select(selection) {
    this.guard();
    return this.lib.contextEditorViewSelect(this.native.handle.context, this.native.handle, selection);
  }
  setViewportSize(width, height) {
    this.guard();
    return this.lib.contextEditorViewSetViewport(this.native.handle.context, this.native.handle, { x: 0, y: 0, width, height }, true);
  }
  setViewport(x, y, width, height, moveCursor = true) {
    this.guard();
    return this.lib.contextEditorViewSetViewport(this.native.handle.context, this.native.handle, { x, y, width, height }, false, moveCursor);
  }
  getViewport() {
    this.guard();
    const { x, y, width, height } = this.lib.contextEditorViewGetViewport(this.native.handle.context, this.native.handle);
    return { offsetX: x, offsetY: y, width, height };
  }
  setScrollMargin(margin) {
    this.guard();
    return this.lib.contextEditorViewSetScrollMargin(this.native.handle.context, this.native.handle, margin);
  }
  setWrapMode(mode) {
    this.command(5 /* WrapMode */, mode === "none" ? 0 : mode === "char" ? 1 : 2);
  }
  getVirtualLineCount() {
    this.guard();
    return this.lib.contextEditorViewGetInfo(this.native.handle.context, this.native.handle, true).virtualLineCount;
  }
  getTotalVirtualLineCount() {
    this.guard();
    return this.lib.contextEditorViewGetInfo(this.native.handle.context, this.native.handle).totalVirtualLineCount;
  }
  setSelection(start, end, bgColor, fgColor) {
    this.select({ operation: 0 /* Set */, start, end, bg: bgColor, fg: fgColor });
  }
  updateSelection(end, bgColor, fgColor) {
    this.select({ operation: 1 /* Update */, end, bg: bgColor, fg: fgColor });
  }
  resetSelection() {
    this.select({ operation: 2 /* Reset */ });
  }
  getSelection() {
    this.guard();
    return this.lib.contextEditorViewGetSelection(this.native.handle.context, this.native.handle).selection;
  }
  hasSelection() {
    return this.getSelection() !== null;
  }
  setLocalSelection(anchorX, anchorY, focusX, focusY, bgColor, fgColor, updateCursor, followCursor, behavior = "cell") {
    return this.select({
      operation: 3 /* Local */,
      anchorX,
      anchorY,
      focusX,
      focusY,
      bg: bgColor,
      fg: fgColor,
      updateCursor,
      followCursor,
      behavior: behavior === "cell" ? 0 : behavior === "word" ? 1 : 2
    });
  }
  updateLocalSelection(anchorX, anchorY, focusX, focusY, bgColor, fgColor, updateCursor, followCursor, behavior = "cell") {
    return this.select({
      operation: 4 /* LocalUpdate */,
      anchorX,
      anchorY,
      focusX,
      focusY,
      bg: bgColor,
      fg: fgColor,
      updateCursor,
      followCursor,
      behavior: behavior === "cell" ? 0 : behavior === "word" ? 1 : 2
    });
  }
  resetLocalSelection() {
    this.select({ operation: 5 /* LocalReset */ });
  }
  convertSelectionToCell() {
    return this.select({ operation: 6 /* Cell */ });
  }
  setSelectionOccupancy(occupancy) {
    this.select({
      operation: 7 /* Occupancy */,
      behavior: occupancy === "boundary" ? 1 : 0
    });
  }
  getSelectionOccupancy() {
    this.guard();
    return this.lib.contextEditorViewGetSelection(this.native.handle.context, this.native.handle).selectionOccupancy;
  }
  setSelectionInclusive(start, end, bgColor, fgColor) {
    this.select({ operation: 8 /* Inclusive */, start, end, bg: bgColor, fg: fgColor });
  }
  setSelectionColors(bgColor, fgColor) {
    this.select({ operation: 9 /* Colors */, bg: bgColor, fg: fgColor });
  }
  getSelectedText() {
    this.guard();
    return this.lib.contextEditorViewGetSelectedText(this.native.handle.context, this.native.handle);
  }
  getCursor() {
    this.guard();
    const { row, col } = this.editBuffer.getCursorPosition();
    return { row, col };
  }
  getText() {
    this.guard();
    return this.editBuffer.getText();
  }
  getVisualCursor() {
    return this.position(0 /* Cursor */);
  }
  moveUpVisual() {
    this.command(0 /* MoveUp */);
  }
  moveDownVisual() {
    this.command(1 /* MoveDown */);
  }
  deleteSelectedText() {
    this.command(3 /* DeleteSelection */);
  }
  _replaceSelectedText(text) {
    this.guard();
    return this.lib.contextEditorViewReplaceSelection(this.native.handle.context, this.native.handle, this.lib.encoder.encode(text));
  }
  setCursorByOffset(offset) {
    this.command(4 /* CursorOffset */, offset);
  }
  getNextWordBoundary() {
    return this.position(1 /* NextWord */);
  }
  getPrevWordBoundary() {
    return this.position(2 /* PrevWord */);
  }
  getEOL() {
    return this.position(3 /* Eol */);
  }
  getVisualSOL() {
    return this.position(4 /* VisualSol */);
  }
  getVisualEOL() {
    return this.position(5 /* VisualEol */);
  }
  gotoVisualLineEnd() {
    this.command(2 /* GotoLineEnd */);
  }
  getLineInfo() {
    this.guard();
    return this.lib.contextEditorViewGetLines(this.native.handle.context, this.native.handle, false);
  }
  getLogicalLineInfo() {
    this.guard();
    return this.lib.contextEditorViewGetLines(this.native.handle.context, this.native.handle, true);
  }
  get extmarks() {
    this.guard();
    if (!this._extmarksController) {
      this._extmarksController = createExtmarksController(this.editBuffer, this);
    }
    return this._extmarksController;
  }
  setPlaceholderStyledText(chunks) {
    this.guard();
    return this.lib.contextEditorViewSetPlaceholder(this.native.handle.context, this.native.handle, new StyledText(chunks.map((chunk) => ({ ...chunk, __isChunk: true }))));
  }
  setTabIndicator(indicator) {
    const codePoint = typeof indicator === "string" ? indicator.codePointAt(0) ?? 0 : indicator;
    this.command(6 /* TabIndicator */, codePoint);
  }
  setTabIndicatorColor(color) {
    this.guard();
    return this.lib.contextEditorViewSetTabColor(this.native.handle.context, this.native.handle, color);
  }
  measureForDimensions(width, height) {
    this.guard();
    return this.lib.contextEditorViewMeasure(this.native.handle.context, this.native.handle, width, height);
  }
  destroy() {
    if (this._destroyed)
      return;
    this.lib.getYogaHost().runMutation(() => {
      if (!this.native.owner.disposed) {
        try {
          this.lib.releaseAfterPaint(this.native.handle.context, () => this.lib.destroyContextEditorView(this.native.handle.context, this.native.handle));
        } catch (error) {
          if (!(error instanceof NativeError) || error.status !== -9 /* StaleHandle */)
            throw error;
        }
      }
      this._destroyed = true;
      this._extmarksController?.destroy();
      this._extmarksController = undefined;
    });
  }
}

// src/animation/Timeline.ts
var easingFunctions = {
  linear: (t) => t,
  inQuad: (t) => t * t,
  outQuad: (t) => t * (2 - t),
  inOutQuad: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  inExpo: (t) => t === 0 ? 0 : Math.pow(2, 10 * (t - 1)),
  outExpo: (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
  inOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
  outBounce: (t) => {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (t < 1 / d1) {
      return n1 * t * t;
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
  },
  outElastic: (t) => {
    const c4 = 2 * Math.PI / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
  inBounce: (t) => 1 - easingFunctions.outBounce(1 - t),
  inCirc: (t) => 1 - Math.sqrt(1 - t * t),
  outCirc: (t) => Math.sqrt(1 - Math.pow(t - 1, 2)),
  inOutCirc: (t) => {
    if ((t *= 2) < 1)
      return -0.5 * (Math.sqrt(1 - t * t) - 1);
    return 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
  },
  inBack: (t, s = 1.70158) => t * t * ((s + 1) * t - s),
  outBack: (t, s = 1.70158) => --t * t * ((s + 1) * t + s) + 1,
  inOutBack: (t, s = 1.70158) => {
    s *= 1.525;
    if ((t *= 2) < 1)
      return 0.5 * (t * t * ((s + 1) * t - s));
    return 0.5 * ((t -= 2) * t * ((s + 1) * t + s) + 2);
  }
};
function captureInitialValues(item) {
  if (!item.properties)
    return;
  if (!item.initialValues || item.initialValues.length === 0) {
    const initialValues = [];
    for (let i = 0;i < item.target.length; i++) {
      const target = item.target[i];
      const targetInitialValues = {};
      for (const key of Object.keys(item.properties)) {
        if (typeof target[key] === "number") {
          targetInitialValues[key] = target[key];
        }
      }
      initialValues.push(targetInitialValues);
    }
    item.initialValues = initialValues;
  }
}
function applyAnimationAtProgress(item, progress, reversed, timelineTime, deltaTime = 0) {
  if (!item.properties || !item.initialValues)
    return;
  const easingFn = easingFunctions[item.ease || "linear"] || easingFunctions.linear;
  const easedProgress = easingFn(Math.max(0, Math.min(1, progress)));
  const finalProgress = reversed ? 1 - easedProgress : easedProgress;
  for (let i = 0;i < item.target.length; i++) {
    const target = item.target[i];
    const targetInitialValues = item.initialValues[i];
    if (!targetInitialValues)
      continue;
    for (const [key, endValue] of Object.entries(item.properties)) {
      const startValue = targetInitialValues[key];
      const newValue = startValue + (endValue - startValue) * finalProgress;
      target[key] = newValue;
    }
  }
  if (item.onUpdate) {
    const animation = {
      targets: item.target,
      progress: easedProgress,
      currentTime: timelineTime,
      deltaTime
    };
    item.onUpdate(animation);
  }
}
function evaluateAnimation(item, timelineTime, deltaTime = 0) {
  if (timelineTime < item.startTime) {
    return;
  }
  const animationTime = timelineTime - item.startTime;
  const duration = item.duration || 0;
  if (timelineTime >= item.startTime && !item.started) {
    captureInitialValues(item);
    if (item.onStart) {
      item.onStart();
    }
    item.started = true;
  }
  if (duration === 0) {
    if (!item.completed) {
      applyAnimationAtProgress(item, 1, false, timelineTime, deltaTime);
      if (item.onComplete) {
        item.onComplete();
      }
      item.completed = true;
    }
    return;
  }
  const maxLoops = !item.loop || item.loop === 1 ? 1 : typeof item.loop === "number" ? item.loop : Infinity;
  const loopDelay = item.loopDelay || 0;
  const cycleTime = duration + loopDelay;
  let currentCycle = Math.floor(animationTime / cycleTime);
  let timeInCycle = animationTime % cycleTime;
  if (item.onLoop && item.currentLoop !== undefined && currentCycle > item.currentLoop && currentCycle < maxLoops) {
    item.onLoop();
  }
  item.currentLoop = currentCycle;
  if (item.onComplete && !item.completed && currentCycle === maxLoops - 1 && timeInCycle >= duration) {
    const finalLoopReversed = (item.alternate || false) && currentCycle % 2 === 1;
    applyAnimationAtProgress(item, 1, finalLoopReversed, timelineTime, deltaTime);
    item.onComplete();
    item.completed = true;
    return;
  }
  if (currentCycle >= maxLoops) {
    if (!item.completed) {
      const finalReversed = (item.alternate || false) && (maxLoops - 1) % 2 === 1;
      applyAnimationAtProgress(item, 1, finalReversed, timelineTime, deltaTime);
      if (item.onComplete) {
        item.onComplete();
      }
      item.completed = true;
    }
    return;
  }
  if (timeInCycle === 0 && animationTime > 0 && currentCycle < maxLoops) {
    currentCycle = currentCycle - 1;
    timeInCycle = cycleTime;
  }
  if (timeInCycle >= duration) {
    const isReversed2 = (item.alternate || false) && currentCycle % 2 === 1;
    applyAnimationAtProgress(item, 1, isReversed2, timelineTime, deltaTime);
    return;
  }
  const progress = timeInCycle / duration;
  const isReversed = (item.alternate || false) && currentCycle % 2 === 1;
  applyAnimationAtProgress(item, progress, isReversed, timelineTime, deltaTime);
}
function evaluateCallback(item, timelineTime) {
  if (!item.executed && timelineTime >= item.startTime && item.callback) {
    item.callback();
    item.executed = true;
  }
}
function evaluateTimelineSync(item, timelineTime, deltaTime = 0) {
  if (!item.timeline)
    return;
  if (timelineTime < item.startTime) {
    return;
  }
  if (!item.timelineStarted) {
    item.timelineStarted = true;
    item.timeline.play();
    const overshoot = timelineTime - item.startTime;
    item.timeline.update(overshoot);
    return;
  }
  item.timeline.update(deltaTime);
}
function evaluateItem(item, timelineTime, deltaTime = 0) {
  if (item.type === "animation") {
    evaluateAnimation(item, timelineTime, deltaTime);
  } else if (item.type === "callback") {
    evaluateCallback(item, timelineTime);
  }
}

class Timeline {
  items = [];
  subTimelines = [];
  currentTime = 0;
  isPlaying = false;
  isComplete = false;
  duration;
  _frameRate;
  loop;
  synced = false;
  autoplay;
  onComplete;
  onPause;
  stateChangeListeners = [];
  constructor(options = {}) {
    this.duration = options.duration || 1000;
    this.frameRate = options.frameRate;
    this.loop = options.loop === true;
    this.autoplay = options.autoplay !== false;
    this.onComplete = options.onComplete;
    this.onPause = options.onPause;
  }
  get frameRate() {
    return this._frameRate;
  }
  set frameRate(value) {
    if (value !== undefined && !(value > 0))
      throw new RangeError(`frameRate must be above 0, got ${value}`);
    this._frameRate = value;
  }
  addStateChangeListener(listener) {
    this.stateChangeListeners.push(listener);
  }
  removeStateChangeListener(listener) {
    this.stateChangeListeners = this.stateChangeListeners.filter((l) => l !== listener);
  }
  notifyStateChange() {
    for (const listener of this.stateChangeListeners) {
      listener(this);
    }
  }
  add(target, properties, startTime = 0) {
    const resolvedStartTime = typeof startTime === "string" ? 0 : startTime;
    const animationProperties = {};
    for (const key in properties) {
      if (!["duration", "ease", "onUpdate", "onComplete", "onStart", "onLoop", "loop", "loopDelay", "alternate"].includes(key)) {
        if (typeof properties[key] === "number") {
          animationProperties[key] = properties[key];
        }
      }
    }
    this.items.push({
      type: "animation",
      startTime: resolvedStartTime,
      target: Array.isArray(target) ? target : [target],
      properties: animationProperties,
      initialValues: [],
      duration: properties.duration !== undefined ? properties.duration : 1000,
      ease: properties.ease || "linear",
      loop: properties.loop,
      loopDelay: properties.loopDelay || 0,
      alternate: properties.alternate || false,
      onUpdate: properties.onUpdate,
      onComplete: properties.onComplete,
      onStart: properties.onStart,
      onLoop: properties.onLoop,
      completed: false,
      started: false,
      currentLoop: 0,
      once: properties.once ?? false
    });
    return this;
  }
  once(target, properties) {
    this.add(target, {
      ...properties,
      once: true
    }, this.currentTime);
    return this;
  }
  call(callback, startTime = 0) {
    const resolvedStartTime = typeof startTime === "string" ? 0 : startTime;
    this.items.push({
      type: "callback",
      startTime: resolvedStartTime,
      callback,
      executed: false
    });
    return this;
  }
  sync(timeline, startTime = 0) {
    if (timeline.synced) {
      throw new Error("Timeline already synced");
    }
    this.subTimelines.push({
      type: "timeline",
      startTime,
      timeline
    });
    timeline.synced = true;
    return this;
  }
  play() {
    if (this.isComplete) {
      return this.restart();
    }
    this.subTimelines.forEach((subTimeline) => {
      if (subTimeline.timelineStarted) {
        subTimeline.timeline.play();
      }
    });
    this.isPlaying = true;
    this.notifyStateChange();
    return this;
  }
  pause() {
    this.subTimelines.forEach((subTimeline) => {
      subTimeline.timeline.pause();
    });
    this.isPlaying = false;
    try {
      this.onPause?.();
    } finally {
      this.notifyStateChange();
    }
    return this;
  }
  resetItems() {
    this.items.forEach((item) => {
      if (item.type === "callback") {
        item.executed = false;
      } else if (item.type === "animation") {
        item.completed = false;
        item.started = false;
        item.currentLoop = 0;
      }
    });
    this.subTimelines.forEach((subTimeline) => {
      subTimeline.timelineStarted = false;
      if (subTimeline.timeline) {
        subTimeline.timeline.restart();
        subTimeline.timeline.pause();
      }
    });
  }
  restart() {
    this.isComplete = false;
    this.currentTime = 0;
    this.isPlaying = true;
    this.resetItems();
    this.notifyStateChange();
    return this;
  }
  update(deltaTime) {
    for (const subTimeline of this.subTimelines) {
      evaluateTimelineSync(subTimeline, this.currentTime + deltaTime, deltaTime);
    }
    if (!this.isPlaying)
      return;
    this.currentTime += deltaTime;
    for (const item of this.items) {
      evaluateItem(item, this.currentTime, deltaTime);
    }
    for (let i = this.items.length - 1;i >= 0; i--) {
      const item = this.items[i];
      if (item.type === "animation" && item.once && item.completed) {
        this.items.splice(i, 1);
      }
    }
    if (this.loop && this.currentTime >= this.duration) {
      const overshoot = this.currentTime % this.duration;
      this.resetItems();
      this.currentTime = 0;
      if (overshoot > 0) {
        this.update(overshoot);
      }
    } else if (!this.loop && this.currentTime >= this.duration) {
      this.currentTime = this.duration;
      this.isPlaying = false;
      this.isComplete = true;
      try {
        this.onComplete?.();
      } finally {
        this.notifyStateChange();
      }
    }
  }
}
var rendererEngines = new WeakMap;
var timelineOwners = new WeakMap;

class TimelineEngine {
  timelines = new Set;
  renderer = null;
  frameCallback = async (deltaTime) => {
    if (this.tickFps === 0)
      this.update(deltaTime);
  };
  isLive = false;
  tickFps = 0;
  stopTicks;
  defaults = {
    frameRate: 60
  };
  attach(renderer) {
    if (renderer.isDestroyed)
      throw new Error("Cannot attach timelines to a destroyed renderer");
    if (this.renderer === renderer) {
      if (!renderer.hasFrameCallback(this.frameCallback))
        renderer.setFrameCallback(this.frameCallback);
      return;
    }
    if (this === engine)
      this.detach();
    else if (this.renderer)
      throw new Error("Timeline engine is already attached; use getTimelineEngine(renderer) for another renderer");
    else if (rendererEngines.has(renderer))
      throw new Error("Renderer already has a timeline engine; use getTimelineEngine(renderer)");
    else
      rendererEngines.set(renderer, this);
    this.renderer = renderer;
    renderer.setFrameCallback(this.frameCallback);
    this.updateLiveState();
  }
  detach() {
    if (this.renderer) {
      if (this !== engine)
        rendererEngines.delete(this.renderer);
      this.renderer.removeFrameCallback(this.frameCallback);
      if (this.isLive) {
        this.renderer.dropLive();
        this.isLive = false;
      }
      this.setTickFps(0);
    }
    this.renderer = null;
  }
  updateLiveState() {
    if (!this.renderer)
      return;
    let fps = 0;
    for (const timeline of this.timelines) {
      if (timeline.synced || !timeline.isPlaying || timeline.isComplete)
        continue;
      fps = Math.max(fps, timeline.frameRate ?? this.defaults.frameRate);
    }
    const live = fps > 0 && fps >= this.renderer.targetFps;
    if (live && !this.isLive) {
      this.renderer.requestLive();
      this.isLive = true;
    } else if (!live && this.isLive) {
      this.renderer.dropLive();
      this.isLive = false;
    }
    this.setTickFps(live ? 0 : fps);
  }
  setTickFps(fps) {
    if (fps === this.tickFps)
      return;
    this.stopTicks?.();
    this.stopTicks = fps > 0 ? this.renderer?.onAnimationTick(fps, (deltaTime) => this.update(deltaTime)) : undefined;
    this.tickFps = fps;
  }
  onTimelineStateChange = (timeline) => {
    this.updateLiveState();
  };
  register(timeline) {
    const owner = timelineOwners.get(timeline);
    if (owner && owner !== this)
      throw new Error("Timeline belongs to another timeline engine; unregister it first");
    if (!this.timelines.has(timeline)) {
      timelineOwners.set(timeline, this);
      this.timelines.add(timeline);
      timeline.addStateChangeListener(this.onTimelineStateChange);
      this.updateLiveState();
    }
  }
  unregister(timeline) {
    if (this.timelines.has(timeline)) {
      this.timelines.delete(timeline);
      timelineOwners.delete(timeline);
      timeline.removeStateChangeListener(this.onTimelineStateChange);
      this.updateLiveState();
    }
  }
  clear() {
    for (const timeline of this.timelines) {
      timelineOwners.delete(timeline);
      timeline.removeStateChangeListener(this.onTimelineStateChange);
    }
    this.timelines.clear();
    this.updateLiveState();
  }
  update(deltaTime) {
    for (const timeline of this.timelines) {
      if (this.renderer?.isDestroyed)
        break;
      if (!timeline.synced) {
        timeline.update(deltaTime);
      }
    }
  }
}
var engine = new TimelineEngine;
function getTimelineEngine(renderer) {
  const owner = rendererEngines.get(renderer) ?? new TimelineEngine;
  owner.attach(renderer);
  return owner;
}
function destroyTimelineEngine(renderer) {
  const owner = rendererEngines.get(renderer);
  owner?.clear();
  owner?.detach();
  if (engine["renderer"] === renderer)
    engine.detach();
}
function createTimeline(options = {}, renderer) {
  const owner = renderer ? getTimelineEngine(renderer) : engine;
  const timeline = new Timeline(options);
  if (options.autoplay !== false) {
    timeline.play();
  }
  owner.register(timeline);
  return timeline;
}

// src/renderables/Box.ts
function isGapType(value) {
  if (value === undefined) {
    return true;
  }
  if (typeof value === "number" && !Number.isNaN(value)) {
    return true;
  }
  return isValidPercentage(value);
}
function borderMask(sides) {
  return (sides.left ? 1 : 0) | (sides.bottom ? 2 : 0) | (sides.right ? 4 : 0) | (sides.top ? 8 : 0);
}

class BoxRenderable extends Renderable {
  static nativeIntegration = {
    kind: "box",
    body: { native: this.prototype.renderSelf }
  };
  _backgroundColor;
  _border;
  _borderStyle;
  _borderColor;
  _focusedBorderColor;
  _customBorderCharsObj;
  _customBorderChars;
  borderSides;
  _shouldFill;
  _fillDimsImages;
  _title;
  _titleColor;
  _titleAlignment;
  _bottomTitle;
  _bottomTitleAlignment;
  _defaultOptions = {
    backgroundColor: "transparent",
    borderStyle: "single",
    border: false,
    borderColor: "#FFFFFF",
    shouldFill: true,
    titleAlignment: "left",
    bottomTitleAlignment: "left",
    focusedBorderColor: "#00AAFF"
  };
  constructor(ctx, options) {
    super(ctx, options);
    try {
      if (options.focusable === true) {
        this._focusable = true;
      }
      this._backgroundColor = RGBA.clone(parseColor(options.backgroundColor || this._defaultOptions.backgroundColor));
      this._border = options.border ?? this._defaultOptions.border;
      if (!options.border && (options.borderStyle || options.borderColor || options.focusedBorderColor || options.customBorderChars)) {
        this._border = true;
      }
      this._borderStyle = parseBorderStyle(options.borderStyle, this._defaultOptions.borderStyle);
      this._borderColor = RGBA.clone(parseColor(options.borderColor || this._defaultOptions.borderColor));
      if (Array.isArray(this._border))
        this._border = [...this._border];
      this._focusedBorderColor = RGBA.clone(parseColor(options.focusedBorderColor || this._defaultOptions.focusedBorderColor));
      this._customBorderCharsObj = options.customBorderChars;
      this._customBorderChars = this._customBorderCharsObj ? borderCharsToArray(this._customBorderCharsObj) : undefined;
      this.borderSides = getBorderSides(this._border);
      this._shouldFill = options.shouldFill ?? this._defaultOptions.shouldFill;
      this._fillDimsImages = options.fillDimsImages ?? false;
      if (this._fillDimsImages)
        this._ctx.nativeScene.setFillDimsImages(this, true);
      this._title = options.title;
      this._titleColor = options.titleColor ? RGBA.clone(parseColor(options.titleColor)) : undefined;
      this._titleAlignment = options.titleAlignment || this._defaultOptions.titleAlignment;
      this._bottomTitle = options.bottomTitle;
      this._bottomTitleAlignment = options.bottomTitleAlignment || this._defaultOptions.bottomTitleAlignment;
      this.setNativeScenePaint();
      this.requestRender();
      if (this._title || this._bottomTitle || this._titleColor || this._customBorderChars || this._titleAlignment !== "left" || this._bottomTitleAlignment !== "left") {
        this.setNativeBoxDetails();
      }
      const hasInitialGapProps = options.gap !== undefined || options.rowGap !== undefined || options.columnGap !== undefined;
      if (hasInitialGapProps) {
        this.applyYogaGap(options);
      }
    } catch (error) {
      this.abortConstruction(error);
    }
  }
  initializeBorder() {
    if (this._border === false) {
      this._border = true;
      this.borderSides = getBorderSides(this._border);
    }
  }
  get customBorderChars() {
    return this._customBorderCharsObj;
  }
  set customBorderChars(value) {
    const chars = value ? borderCharsToArray(value) : undefined;
    this.setNativeBoxDetails({ customBorderChars: chars });
    this._customBorderCharsObj = value;
    this._customBorderChars = chars;
    this.requestRender();
  }
  get backgroundColor() {
    return RGBA.clone(this._backgroundColor);
  }
  set backgroundColor(value) {
    if (this.isFreed())
      return;
    const newColor = RGBA.clone(parseColor(value ?? this._defaultOptions.backgroundColor));
    this._ctx.nativeScene.setBackground(this, newColor);
    this._backgroundColor = newColor;
    this.requestRender();
  }
  get border() {
    if (Array.isArray(this._border))
      return [...this._border];
    return this._border;
  }
  set border(value) {
    if (this._border !== value) {
      const sides = getBorderSides(value);
      this.setNativeScenePaint({ border: borderMask(sides) });
      this._border = Array.isArray(value) ? [...value] : value;
      this.borderSides = sides;
      this.requestRender();
    }
  }
  get borderStyle() {
    return this._borderStyle;
  }
  set borderStyle(value) {
    const _value = parseBorderStyle(value, this._defaultOptions.borderStyle);
    if (this._borderStyle !== _value || !this._border) {
      this.runMutation(() => {
        this._ctx.nativeScene.setBoxBorderStyle(this, _value, this._border === false ? 15 : borderMask(this.borderSides));
        this._borderStyle = _value;
        this._customBorderChars = undefined;
        this._customBorderCharsObj = undefined;
        this.initializeBorder();
        this.requestRender();
      });
    }
  }
  get borderColor() {
    return RGBA.clone(this._borderColor);
  }
  set borderColor(value) {
    const newColor = RGBA.clone(parseColor(value ?? this._defaultOptions.borderColor));
    this.setNativeScenePaint({
      borderColor: newColor,
      border: this._border === false ? 15 : borderMask(this.borderSides)
    });
    this._borderColor = newColor;
    this.initializeBorder();
    this.requestRender();
  }
  get focusedBorderColor() {
    return RGBA.clone(this._focusedBorderColor);
  }
  set focusedBorderColor(value) {
    const newColor = RGBA.clone(parseColor(value ?? this._defaultOptions.focusedBorderColor));
    this.setNativeScenePaint({
      focusedBorderColor: newColor,
      border: this._border === false ? 15 : borderMask(this.borderSides)
    });
    this._focusedBorderColor = newColor;
    this.initializeBorder();
    this.requestRender();
  }
  get title() {
    return this._title;
  }
  set title(value) {
    if (this._title !== value) {
      this.setNativeBoxDetails({ title: value });
      this._title = value;
      this.requestRender();
    }
  }
  get titleColor() {
    return this._titleColor ? RGBA.clone(this._titleColor) : undefined;
  }
  set titleColor(value) {
    const newColor = value ? RGBA.clone(parseColor(value)) : undefined;
    if (this._titleColor !== newColor) {
      this.setNativeBoxDetails({ titleColor: newColor });
      this._titleColor = newColor;
      this.requestRender();
    }
  }
  get titleAlignment() {
    return this._titleAlignment;
  }
  set titleAlignment(value) {
    value ??= this._defaultOptions.titleAlignment;
    if (this._titleAlignment !== value) {
      this.setNativeBoxDetails({ titleAlignment: value });
      this._titleAlignment = value;
      this.requestRender();
    }
  }
  get bottomTitle() {
    return this._bottomTitle;
  }
  set bottomTitle(value) {
    if (this._bottomTitle !== value) {
      this.setNativeBoxDetails({ bottomTitle: value });
      this._bottomTitle = value;
      this.requestRender();
    }
  }
  get bottomTitleAlignment() {
    return this._bottomTitleAlignment;
  }
  set bottomTitleAlignment(value) {
    value ??= this._defaultOptions.bottomTitleAlignment;
    if (this._bottomTitleAlignment !== value) {
      this.setNativeBoxDetails({ bottomTitleAlignment: value });
      this._bottomTitleAlignment = value;
      this.requestRender();
    }
  }
  setNativeBoxDetails(details = {}) {
    if (this.isFreed())
      return;
    this._ctx.nativeScene.setBoxDetails(this, {
      title: this._title,
      bottomTitle: this._bottomTitle,
      titleAlignment: this._titleAlignment,
      bottomTitleAlignment: this._bottomTitleAlignment,
      titleColor: this._titleColor,
      customBorderChars: this._customBorderChars,
      ...details
    });
  }
  renderSelf(buffer) {
    if (borderMask(this.borderSides) === 0 && !(this._shouldFill && this._backgroundColor.a > 0))
      return;
    this._drawNativeBody(buffer);
  }
  get shouldFill() {
    return this._shouldFill;
  }
  set shouldFill(value) {
    value ??= this._defaultOptions.shouldFill;
    if (this._shouldFill === value)
      return;
    this.setNativeScenePaint({ shouldFill: value });
    this._shouldFill = value;
    this.requestRender();
  }
  get fillDimsImages() {
    return this._fillDimsImages;
  }
  set fillDimsImages(value) {
    const next = value ?? false;
    if (this._fillDimsImages === next)
      return;
    this._fillDimsImages = next;
    if (this.isFreed())
      return;
    this._ctx.nativeScene.setFillDimsImages(this, next);
    this.requestRender();
  }
  getNativeScenePaint() {
    return {
      zIndex: this._zIndex,
      opacity: this._opacity,
      translateX: this._translateX,
      translateY: this._translateY,
      focusable: this._focusable,
      border: borderMask(this.borderSides),
      shouldFill: this._shouldFill,
      backgroundColor: this._backgroundColor,
      borderColor: this._borderColor,
      focusedBorderColor: this._focusedBorderColor,
      borderStyle: this._borderStyle
    };
  }
  applyYogaGap(options) {
    if (isGapType(options.gap)) {
      this.setGap(Gutter.All, options.gap);
    }
    if (isGapType(options.rowGap)) {
      this.setGap(Gutter.Row, options.rowGap);
    }
    if (isGapType(options.columnGap)) {
      this.setGap(Gutter.Column, options.columnGap);
    }
  }
  set gap(gap) {
    this.setGapStyle(Gutter.All, gap);
  }
  set rowGap(rowGap) {
    this.setGapStyle(Gutter.Row, rowGap);
  }
  set columnGap(columnGap) {
    this.setGapStyle(Gutter.Column, columnGap);
  }
  setGapStyle(gutter, gap) {
    if (gap != null && !isGapType(gap))
      return;
    this.setGap(gutter, gap ?? undefined);
    this.requestRender();
  }
}

// src/lib/scroll-chain.ts
var takers = new WeakMap;
function wheelDirection(event) {
  const direction = event.scroll?.direction;
  if (!direction || !event.modifiers?.shift)
    return direction;
  return direction === "up" ? "left" : direction === "down" ? "right" : direction === "right" ? "down" : "up";
}
function scrollOnce(event, scroller, scroll) {
  for (let node = takers.get(event) ?? null;node; node = node.parent)
    if (node === scroller)
      return;
  if (scroll())
    takers.set(event, scroller);
}

// src/renderables/TextBufferRenderable.ts
class TextBufferRenderable extends Renderable {
  static nativeIntegration = {
    kind: "text",
    body: { native: this.prototype.renderSelf },
    lifecycle: { resize: { native: this.prototype.onResize } },
    beforeAfter: false,
    paintBuffer: "destination"
  };
  _defaultFg;
  _defaultBg;
  _defaultAttributes;
  _selectionBg;
  _selectionFg;
  _wrapMode = "word";
  _textAlign = "left";
  lastLocalSelection = null;
  _tabIndicator;
  _tabIndicatorColor;
  _scrollX = 0;
  _scrollY = 0;
  _truncate = false;
  _firstLineOffset = 0;
  textBuffer;
  textBufferView;
  nativeTextScene;
  _defaultOptions = {
    fg: RGBA.fromValues(1, 1, 1, 1),
    bg: RGBA.fromValues(0, 0, 0, 0),
    selectionBg: undefined,
    selectionFg: undefined,
    selectable: true,
    attributes: 0,
    wrapMode: "word",
    textAlign: "left",
    tabIndicator: undefined,
    tabIndicatorColor: undefined,
    truncate: false
  };
  constructor(ctx, options, sharedText = false) {
    super(ctx, options);
    this.nativeTextScene = sharedText ? undefined : ctx.nativeScene;
    let textBuffer;
    let textBufferView;
    try {
      this._defaultFg = RGBA.clone(parseColor(options.fg ?? this._defaultOptions.fg));
      this._defaultBg = RGBA.clone(parseColor(options.bg ?? this._defaultOptions.bg));
      this._defaultAttributes = options.attributes ?? this._defaultOptions.attributes;
      this._selectionBg = options.selectionBg ? RGBA.clone(parseColor(options.selectionBg)) : undefined;
      this._selectionFg = options.selectionFg ? RGBA.clone(parseColor(options.selectionFg)) : undefined;
      this.selectable = options.selectable ?? this._defaultOptions.selectable;
      this._wrapMode = options.wrapMode ?? this._defaultOptions.wrapMode;
      this._textAlign = options.textAlign ?? this._defaultOptions.textAlign;
      this._tabIndicator = options.tabIndicator ?? this._defaultOptions.tabIndicator;
      this._tabIndicatorColor = options.tabIndicatorColor ? RGBA.clone(parseColor(options.tabIndicatorColor)) : this._defaultOptions.tabIndicatorColor;
      this._truncate = options.truncate ?? this._defaultOptions.truncate;
      if (this.nativeTextScene) {
        this._firstLineOffset = ctx.claimFirstLineOffset?.(this) ?? 0;
        this.setNativeScenePaint();
        this.setNativeSceneTextOptions();
        return;
      }
      textBuffer = TextBuffer.create(this._ctx.widthMethod, ctx.nativeScene);
      this.textBuffer = textBuffer;
      textBufferView = TextBufferView.create(textBuffer);
      this.textBufferView = textBufferView;
      this._firstLineOffset = ctx.claimFirstLineOffset?.(this) ?? 0;
      this.textBufferView.setWrapMode(this._wrapMode);
      this.textBufferView.setTextAlign(this._textAlign);
      this.textBufferView.setFirstLineOffset(this._firstLineOffset);
      ctx.nativeScene.setTextView(this, textBufferView._getSceneHandle(ctx.nativeScene));
      this.textBuffer._setDefaults(this._defaultFg, this._defaultBg, this._defaultAttributes);
      if (this._tabIndicator !== undefined) {
        this.textBufferView.setTabIndicator(this._tabIndicator);
      }
      if (this._tabIndicatorColor !== undefined) {
        this.textBufferView.setTabIndicatorColor(this._tabIndicatorColor);
      }
      const width = this.width;
      if (width > 0 && this.height > 0)
        this.updateViewportOffset();
      else if (this._wrapMode !== "none" && width > 0)
        this.textBufferView.setWrapWidth(Math.trunc(width));
      this.textBufferView.setTruncate(this._truncate);
      this.updateTextInfo();
    } catch (error) {
      this.abortConstruction(error, (run) => {
        run(() => textBufferView?.destroy());
        run(() => textBuffer?.destroy());
      });
    }
  }
  onMouseEvent(event) {
    if (event.type === "scroll") {
      scrollOnce(event, this, () => {
        const [x, y] = [this.scrollX, this.scrollY];
        this.handleScroll(event);
        return this.scrollX !== x || this.scrollY !== y;
      });
    }
  }
  handleScroll(event) {
    if (!event.scroll)
      return;
    const { delta } = event.scroll;
    const direction = wheelDirection(event);
    if (direction === "up") {
      this.scrollY -= delta;
    } else if (direction === "down") {
      this.scrollY += delta;
    }
    if (this._wrapMode === "none" && !this._truncate) {
      if (direction === "left") {
        this.scrollX -= delta;
      } else if (direction === "right") {
        this.scrollX += delta;
      }
    }
  }
  get lineInfo() {
    if (this.nativeTextScene)
      return this.nativeTextScene.getTextLineInfo(this);
    return this.textBufferView.logicalLineInfo;
  }
  getLineSources(startLine, lineCount) {
    if (this.needsLineInfoFallback(TextBufferRenderable.prototype)) {
      return this.lineInfo.lineSources.slice(startLine, startLine + lineCount);
    }
    if (this.nativeTextScene) {
      return this.nativeTextScene.getTextLineInfo(this, startLine, lineCount).lineSources;
    }
    return this.textBufferView.getLineSources(startLine, lineCount);
  }
  needsLineInfoFallback(owner) {
    let prototype = this;
    while (prototype && prototype !== owner) {
      if (Object.hasOwn(prototype, "getLineSources"))
        return false;
      if (Object.hasOwn(prototype, "lineInfo"))
        return true;
      prototype = Object.getPrototypeOf(prototype);
    }
    return false;
  }
  get lineCount() {
    if (this.nativeTextScene)
      return this.nativeTextScene.getTextMetrics(this).lineCount;
    return this.textBuffer.getLineCount();
  }
  get virtualLineCount() {
    if (this.nativeTextScene)
      return this.nativeTextScene.getTextMetrics(this).virtualLineCount;
    return this.textBufferView.getVirtualLineCount();
  }
  get scrollY() {
    return this._scrollY;
  }
  set scrollY(value) {
    const maxScrollY = Math.max(0, this.scrollHeight - this.height);
    const clamped = Math.max(0, Math.min(value ?? 0, maxScrollY));
    if (this._scrollY !== clamped) {
      this.runMutation(() => {
        this.setNativeSceneTextOptions({ scrollY: clamped });
        if (!this.nativeTextScene)
          this.updateViewportOffset(this._scrollX, clamped);
        this._scrollY = clamped;
        this.requestRender();
      });
    }
  }
  get scrollX() {
    return this._scrollX;
  }
  set scrollX(value) {
    const maxScrollX = Math.max(0, this.scrollWidth - this.width);
    const clamped = Math.max(0, Math.min(value ?? 0, maxScrollX));
    if (this._scrollX !== clamped) {
      this.runMutation(() => {
        this.setNativeSceneTextOptions({ scrollX: clamped });
        if (!this.nativeTextScene)
          this.updateViewportOffset(clamped, this._scrollY);
        this._scrollX = clamped;
        this.requestRender();
      });
    }
  }
  get scrollWidth() {
    if (this.nativeTextScene)
      return this.nativeTextScene.getTextMetrics(this).widthColsMax;
    return this.lineInfo.lineWidthColsMax;
  }
  get scrollHeight() {
    if (this.nativeTextScene)
      return this.nativeTextScene.getTextMetrics(this).virtualLineCount;
    return this.virtualLineCount;
  }
  get maxScrollY() {
    return Math.max(0, this.scrollHeight - this.height);
  }
  get maxScrollX() {
    return Math.max(0, this.scrollWidth - this.width);
  }
  updateViewportOffset(scrollX = this._scrollX, scrollY = this._scrollY) {
    const width = this.width;
    const height = this.height;
    if (width > 0 && height > 0) {
      this.textBufferView.setViewport(Math.trunc(scrollX), Math.trunc(scrollY), Math.trunc(width), Math.trunc(height));
    }
  }
  get plainText() {
    if (this.nativeTextScene)
      return this.nativeTextScene.getText(this);
    return this.textBuffer.getPlainText();
  }
  get textLength() {
    if (this.nativeTextScene)
      return this.nativeTextScene.getTextMetrics(this).textLength;
    return this.textBuffer.length;
  }
  get fg() {
    return RGBA.clone(this._defaultFg);
  }
  set fg(value) {
    const newColor = RGBA.clone(parseColor(value ?? this._defaultOptions.fg));
    this.runMutation(() => {
      this.setNativeSceneTextOptions({ fg: newColor });
      if (!this.nativeTextScene)
        this.textBuffer.setDefaultFg(newColor);
      this._defaultFg = newColor;
      this.onFgChanged(newColor);
      this.requestRender();
    });
  }
  get selectionBg() {
    return this._selectionBg ? RGBA.clone(this._selectionBg) : undefined;
  }
  set selectionBg(value) {
    const newColor = value ? RGBA.clone(parseColor(value)) : undefined;
    if (this._selectionBg !== newColor) {
      this.runMutation(() => {
        if (this.nativeTextScene || this.lastLocalSelection) {
          this.updateLocalSelection(this.lastLocalSelection, true, { bg: newColor, fg: this._selectionFg });
        }
        this._selectionBg = newColor;
        this.requestRender();
      });
    }
  }
  get selectionFg() {
    return this._selectionFg ? RGBA.clone(this._selectionFg) : undefined;
  }
  set selectionFg(value) {
    const newColor = value ? RGBA.clone(parseColor(value)) : undefined;
    if (this._selectionFg !== newColor) {
      this.runMutation(() => {
        if (this.nativeTextScene || this.lastLocalSelection) {
          this.updateLocalSelection(this.lastLocalSelection, true, { bg: this._selectionBg, fg: newColor });
        }
        this._selectionFg = newColor;
        this.requestRender();
      });
    }
  }
  get bg() {
    return RGBA.clone(this._defaultBg);
  }
  set bg(value) {
    const newColor = RGBA.clone(parseColor(value ?? this._defaultOptions.bg));
    this.runMutation(() => {
      this.setNativeSceneTextOptions({ bg: newColor });
      if (!this.nativeTextScene)
        this.textBuffer.setDefaultBg(newColor);
      this._defaultBg = newColor;
      this.onBgChanged(newColor);
      this.requestRender();
    });
  }
  get attributes() {
    return this._defaultAttributes;
  }
  set attributes(value) {
    const attributes = value ?? this._defaultOptions.attributes;
    if (this._defaultAttributes !== attributes) {
      this.runMutation(() => {
        this.setNativeSceneTextOptions({ attributes });
        if (!this.nativeTextScene)
          this.textBuffer.setDefaultAttributes(attributes);
        this._defaultAttributes = attributes;
        this.onAttributesChanged(attributes);
        this.requestRender();
      });
    }
  }
  get wrapMode() {
    return this._wrapMode;
  }
  set wrapMode(value) {
    value ??= this._defaultOptions.wrapMode;
    if (this._wrapMode !== value) {
      this.runMutation(() => {
        this.setNativeSceneTextOptions({ wrapMode: value });
        if (!this.nativeTextScene)
          this.textBufferView.setWrapMode(value);
        this._wrapMode = value;
        if (!this.nativeTextScene && value !== "none") {
          const width = this.width;
          if (width > 0)
            this.textBufferView.setWrapWidth(Math.trunc(width));
        }
        if (value !== "none")
          this.scrollX = 0;
        this.requestRender();
      });
    }
  }
  get textAlign() {
    return this._textAlign;
  }
  set textAlign(value) {
    value ??= this._defaultOptions.textAlign;
    if (this._textAlign !== value) {
      this.runMutation(() => {
        this.setNativeSceneTextOptions({ textAlign: value });
        if (!this.nativeTextScene)
          this.textBufferView.setTextAlign(value);
        this._textAlign = value;
        this.requestRender();
      });
    }
  }
  get tabIndicator() {
    return this._tabIndicator;
  }
  set tabIndicator(value) {
    if (this._tabIndicator !== value) {
      this.runMutation(() => {
        this.setNativeSceneTextOptions({ tabIndicator: value });
        if (!this.nativeTextScene)
          this.textBufferView.setTabIndicator(value ?? 0);
        this._tabIndicator = value;
        this.requestRender();
      });
    }
  }
  get tabIndicatorColor() {
    return this._tabIndicatorColor ? RGBA.clone(this._tabIndicatorColor) : undefined;
  }
  set tabIndicatorColor(value) {
    const newColor = value ? RGBA.clone(parseColor(value)) : undefined;
    if (this._tabIndicatorColor !== newColor) {
      this.runMutation(() => {
        this.setNativeSceneTextOptions({ tabIndicatorColor: newColor });
        if (!this.nativeTextScene && newColor !== undefined)
          this.textBufferView.setTabIndicatorColor(newColor);
        this._tabIndicatorColor = newColor;
        this.requestRender();
      });
    }
  }
  get truncate() {
    return this._truncate;
  }
  set truncate(value) {
    value ??= this._defaultOptions.truncate;
    if (this._truncate !== value) {
      this.runMutation(() => {
        this.setNativeSceneTextOptions({ truncate: value });
        if (!this.nativeTextScene)
          this.textBufferView.setTruncate(value);
        this._truncate = value;
        if (value)
          this.scrollX = 0;
        this.requestRender();
      });
    }
  }
  onResize(width, height) {
    if (!this.nativeTextScene) {
      this.textBufferView.setViewport(Math.trunc(this._scrollX), Math.trunc(this._scrollY), width, height);
    }
    this.requestRender();
    this.emit("line-info-change");
  }
  refreshLocalSelection() {
    if (this.lastLocalSelection) {
      return this.updateLocalSelection(this.lastLocalSelection);
    }
    return false;
  }
  updateLocalSelection(localSelection, isStart = true, colors) {
    const bg = colors ? colors.bg : this._selectionBg;
    const fg = colors ? colors.fg : this._selectionFg;
    if (this.nativeTextScene) {
      return this.nativeTextScene.setTextSelection(this, !localSelection?.isActive ? "reset" : isStart ? "set" : "update", localSelection, bg, fg);
    }
    if (!localSelection?.isActive) {
      this.textBufferView.resetLocalSelection();
      return true;
    }
    return this.textBufferView[isStart ? "setLocalSelection" : "updateLocalSelection"](localSelection.anchorX, localSelection.anchorY, localSelection.focusX, localSelection.focusY, bg, fg, localSelection.behavior);
  }
  updateTextInfo() {
    if (this.lastLocalSelection) {
      this.updateLocalSelection(this.lastLocalSelection);
    }
    this.requestRender();
    this.emit("line-info-change");
  }
  shouldStartSelection(x, y) {
    if (!this.selectable)
      return false;
    const localX = x - this.x;
    const localY = y - this.y;
    return localX >= 0 && localX < this.width && localY >= 0 && localY < this.height;
  }
  onSelectionChanged(selection) {
    const localSelection = convertGlobalToLocalSelection(selection, Math.trunc(this.x), Math.trunc(this.y));
    const changed = this.updateLocalSelection(localSelection, selection?.isStart ?? false);
    this.lastLocalSelection = localSelection;
    if (changed) {
      this.requestRender();
    }
    return this.hasSelection();
  }
  getSelectedText() {
    if (this.nativeTextScene)
      return this.nativeTextScene.getSelectedText(this);
    return this.textBufferView.getSelectedText();
  }
  hasSelection() {
    if (this.nativeTextScene)
      return this.nativeTextScene.getTextSelection(this) !== null;
    return this.textBufferView.hasSelection();
  }
  getSelection() {
    if (this.nativeTextScene)
      return this.nativeTextScene.getTextSelection(this);
    return this.textBufferView.getSelection();
  }
  renderSelf(buffer) {
    this.drawToBuffer(buffer, this._screenX, this._screenY);
  }
  drawToBuffer(buffer, x, y) {
    if (this.isDestroyed)
      throw new Error("Cannot draw destroyed text");
    if (this.nativeTextScene) {
      this.nativeTextScene.drawBody(this, buffer, Math.trunc(x), Math.trunc(y));
      return;
    }
    buffer.drawTextBuffer(this.textBufferView, Math.trunc(x), Math.trunc(y));
  }
  destroyOwnedResources() {
    if (this.nativeTextScene)
      return;
    this.runCleanup((run) => {
      run(() => this.textBufferView.destroy());
      run(() => this.textBuffer.destroy());
    });
  }
  setNativeSceneTextOptions(options = {}) {
    this.nativeTextScene?.setTextOptions(this, {
      fg: this._defaultFg,
      bg: this._defaultBg,
      attributes: this._defaultAttributes,
      wrapMode: this._wrapMode,
      textAlign: this._textAlign,
      truncate: this._truncate,
      scrollX: this._scrollX,
      scrollY: this._scrollY,
      firstLineOffset: this._firstLineOffset,
      tabIndicator: this._tabIndicator,
      tabIndicatorColor: this._tabIndicatorColor,
      ...options
    });
  }
  onFgChanged(newColor) {}
  onBgChanged(newColor) {}
  onAttributesChanged(newAttributes) {}
}

// src/renderables/Code.ts
class CodeRenderable extends TextBufferRenderable {
  static nativeIntegration = {
    ...TextBufferRenderable.nativeIntegration,
    kind: "text_view",
    body: { native: this.prototype.renderSelf },
    lifecycle: {
      ...TextBufferRenderable.nativeIntegration.lifecycle,
      update: {
        idle: this.prototype.onUpdate,
        active: (renderable) => renderable._highlightsDirty
      }
    }
  };
  _content;
  _filetype;
  _syntaxStyle;
  _isHighlighting = false;
  _treeSitterClient;
  _highlightsDirty = false;
  _highlightSnapshotId = 0;
  _highlightLoopActive = false;
  _highlightPromise;
  _highlightRerun = false;
  _conceal;
  _drawUnstyledText;
  _shouldRenderTextBuffer = true;
  _streaming;
  _initialStyledText;
  _hadInitialContent = false;
  _baseHighlight;
  _onHighlight;
  _onChunks;
  _highlightingPromise = Promise.resolve();
  _renderedLineSources;
  _mappedLineInfo;
  _contentDefaultOptions = {
    content: "",
    conceal: true,
    drawUnstyledText: true,
    streaming: false
  };
  constructor(ctx, options) {
    super(ctx, options, true);
    try {
      this._content = options.content ?? this._contentDefaultOptions.content;
      this._filetype = options.filetype;
      this._syntaxStyle = options.syntaxStyle;
      this._treeSitterClient = options.treeSitterClient ?? getTreeSitterClient();
      this._conceal = options.conceal ?? this._contentDefaultOptions.conceal;
      this._drawUnstyledText = options.drawUnstyledText ?? this._contentDefaultOptions.drawUnstyledText;
      this._streaming = options.streaming ?? this._contentDefaultOptions.streaming;
      this._initialStyledText = options.initialStyledText;
      this._baseHighlight = options.baseHighlight;
      this._onHighlight = options.onHighlight;
      this._onChunks = options.onChunks;
      if (this._content.length > 0) {
        if (this._initialStyledText && this._drawUnstyledText) {
          this.textBuffer.setStyledText(this._initialStyledText);
        } else {
          this.textBuffer.setText(this._content);
        }
        this.updateTextInfo();
        this.setShouldRenderTextBuffer(this._drawUnstyledText || !this._filetype);
      }
      this.setHighlightsDirty(this._content.length > 0);
    } catch (error) {
      this.rollbackConstruction(error);
    }
  }
  get content() {
    return this._content;
  }
  invalidateHighlights() {
    this.setHighlightsDirty(true);
    this._highlightSnapshotId++;
  }
  setHighlightsDirty(value) {
    if (this._highlightsDirty === value)
      return;
    this._highlightsDirty = value;
    if (!this.isDestroyed)
      this.refreshNativeSceneHooks();
  }
  setShouldRenderTextBuffer(value) {
    if (this._shouldRenderTextBuffer === value)
      return;
    this._shouldRenderTextBuffer = value;
    if (!this.isDestroyed)
      this._ctx.nativeScene.setTextViewPaint(this, value);
  }
  set content(value) {
    if (this._content === value)
      return;
    this.runMutation(() => {
      if (this._streaming && this._filetype && !this._drawUnstyledText) {
        this._content = value;
        this.invalidateHighlights();
        this.requestRender();
        return;
      }
      if (value && this._initialStyledText && this._drawUnstyledText) {
        this.textBuffer.setStyledText(this._initialStyledText);
      } else {
        this.textBuffer.setText(value);
      }
      this._content = value;
      this.invalidateHighlights();
      this.setRenderedLineSources(undefined);
      this.updateTextInfo();
    });
  }
  updateStreamingPreview(content, initialStyledText) {
    this._content = content;
    this._initialStyledText = initialStyledText;
    this.invalidateHighlights();
    this.textBuffer.setStyledText(initialStyledText);
    this.setRenderedLineSources(undefined);
    this.updateTextInfo();
  }
  get lineInfo() {
    if (!this._renderedLineSources)
      return super.lineInfo;
    if (this._mappedLineInfo)
      return this._mappedLineInfo;
    const lineInfo = super.lineInfo;
    const renderedLineSources = this._renderedLineSources;
    this._mappedLineInfo = {
      ...lineInfo,
      lineSources: lineInfo.lineSources.map((line) => renderedLineSources[line] ?? line)
    };
    return this._mappedLineInfo;
  }
  getLineSources(startLine, lineCount) {
    if (this.needsLineInfoFallback(CodeRenderable.prototype)) {
      return this.lineInfo.lineSources.slice(startLine, startLine + lineCount);
    }
    const sources = this.textBufferView.getLineSources(startLine, lineCount);
    const renderedLineSources = this._renderedLineSources;
    return renderedLineSources ? sources.map((line) => renderedLineSources[line] ?? line) : sources;
  }
  get wrapMode() {
    return super.wrapMode;
  }
  set wrapMode(value) {
    if (super.wrapMode !== value) {
      this._mappedLineInfo = undefined;
      super.wrapMode = value;
    }
  }
  onResize(width, height) {
    this._mappedLineInfo = undefined;
    super.onResize(width, height);
  }
  updateTextInfo() {
    this._mappedLineInfo = undefined;
    super.updateTextInfo();
  }
  get filetype() {
    return this._filetype;
  }
  set filetype(value) {
    if (this._filetype !== value) {
      this._filetype = value;
      this.invalidateHighlights();
    }
  }
  get syntaxStyle() {
    return this._syntaxStyle;
  }
  set syntaxStyle(value) {
    if (this._syntaxStyle !== value) {
      this._syntaxStyle = value;
      this.invalidateHighlights();
    }
  }
  get conceal() {
    return this._conceal;
  }
  set conceal(value) {
    if (this._conceal !== value) {
      this._conceal = value;
      this.invalidateHighlights();
    }
  }
  get drawUnstyledText() {
    return this._drawUnstyledText;
  }
  set drawUnstyledText(value) {
    if (this._drawUnstyledText !== value) {
      this._drawUnstyledText = value;
      this.invalidateHighlights();
    }
  }
  get streaming() {
    return this._streaming;
  }
  set initialStyledText(value) {
    if (this._initialStyledText !== value) {
      if (value && this._streaming && this._drawUnstyledText && this._isHighlighting) {
        this.updateStreamingPreview(this._content, value);
        return;
      }
      this._initialStyledText = value;
      this.invalidateHighlights();
    }
  }
  set streaming(value) {
    if (this._streaming !== value) {
      this._streaming = value;
      this._hadInitialContent = false;
      this.invalidateHighlights();
    }
  }
  get treeSitterClient() {
    return this._treeSitterClient;
  }
  set treeSitterClient(value) {
    if (this._treeSitterClient !== value) {
      this._treeSitterClient = value;
      this.invalidateHighlights();
    }
  }
  get onHighlight() {
    return this._onHighlight;
  }
  get baseHighlight() {
    return this._baseHighlight;
  }
  set baseHighlight(value) {
    if (this._baseHighlight !== value) {
      this._baseHighlight = value;
      this.invalidateHighlights();
    }
  }
  set onHighlight(value) {
    if (this._onHighlight !== value) {
      this._onHighlight = value;
      this.invalidateHighlights();
    }
  }
  get onChunks() {
    return this._onChunks;
  }
  set onChunks(value) {
    if (this._onChunks !== value) {
      this._onChunks = value;
      this.invalidateHighlights();
    }
  }
  get isHighlighting() {
    return this._isHighlighting || this._highlightRerun;
  }
  get highlightingDone() {
    return this._highlightingPromise;
  }
  async transformChunks(chunks, context) {
    if (!this._onChunks)
      return chunks;
    const modified = await this._onChunks(chunks, context);
    return modified ?? chunks;
  }
  ensureVisibleTextBeforeHighlight() {
    const content = this._content;
    const isInitialContent = this._streaming && !this._hadInitialContent;
    const shouldDrawUnstyledNow = this._streaming ? isInitialContent && this._drawUnstyledText : this._drawUnstyledText;
    if (this._streaming && !isInitialContent) {
      this.setShouldRenderTextBuffer(true);
    } else if (shouldDrawUnstyledNow) {
      if (this._initialStyledText) {
        this.textBuffer.setStyledText(this._initialStyledText);
      } else {
        this.textBuffer.setText(content);
      }
      this.setRenderedLineSources(undefined);
      this.setShouldRenderTextBuffer(true);
    } else {
      this.setShouldRenderTextBuffer(false);
    }
  }
  async startHighlight() {
    const content = this._content;
    const filetype = this._filetype;
    const snapshotId = ++this._highlightSnapshotId;
    if (!filetype)
      return;
    const isInitialContent = this._streaming && !this._hadInitialContent;
    if (isInitialContent) {
      this._hadInitialContent = true;
    }
    this._isHighlighting = true;
    try {
      const result = await this._treeSitterClient.highlightOnce(content, filetype);
      if (snapshotId !== this._highlightSnapshotId) {
        this.requestRender();
        return;
      }
      if (this.isDestroyed)
        return;
      let highlights = result.highlights ?? [];
      if (this._onHighlight && highlights.length >= 0) {
        const context = {
          content,
          filetype,
          syntaxStyle: this._syntaxStyle
        };
        const modified = await this._onHighlight(highlights, context);
        if (modified !== undefined) {
          highlights = modified;
        }
      }
      if (snapshotId !== this._highlightSnapshotId) {
        this.requestRender();
        return;
      }
      if (this.isDestroyed)
        return;
      if (highlights.length > 0 || this._onChunks || this._baseHighlight) {
        const sourceRanges = this._onChunks ? [] : undefined;
        const context = {
          content,
          filetype,
          syntaxStyle: this._syntaxStyle,
          highlights,
          sourceRanges
        };
        let chunks = treeSitterToTextChunks(content, highlights, this._syntaxStyle, {
          enabled: this._conceal,
          baseHighlight: this._baseHighlight,
          ranges: sourceRanges
        });
        const renderedLineSources = this._onChunks ? undefined : this.getConcealLinesSourceMap(content, highlights);
        chunks = await this.transformChunks(chunks, context);
        if (snapshotId !== this._highlightSnapshotId) {
          this.requestRender();
          return;
        }
        if (this.isDestroyed)
          return;
        const styledText = new StyledText(chunks);
        this.textBuffer.setStyledText(styledText);
        this.setRenderedLineSources(renderedLineSources);
      } else {
        this.textBuffer.setText(content);
        this.setRenderedLineSources(undefined);
      }
      this.setShouldRenderTextBuffer(true);
      this._isHighlighting = false;
      this.setHighlightsDirty(false);
      this.updateTextInfo();
      this.requestRender();
    } catch (error) {
      if (snapshotId !== this._highlightSnapshotId) {
        this.requestRender();
        return;
      }
      console.warn("Code highlighting failed, falling back to plain text:", error);
      if (this.isDestroyed)
        return;
      this.textBuffer.setText(content);
      this.setRenderedLineSources(undefined);
      this.setShouldRenderTextBuffer(true);
      this._isHighlighting = false;
      this.setHighlightsDirty(false);
      this.updateTextInfo();
      this.requestRender();
    }
  }
  async runHighlights() {
    try {
      do {
        this._highlightRerun = false;
        await this.startHighlight();
      } while (this._highlightRerun && !this.isDestroyed && this._content.length > 0 && this._filetype);
    } finally {
      this._isHighlighting = false;
      this._highlightLoopActive = false;
      this._highlightRerun = false;
    }
  }
  clearPendingHighlight() {
    this._highlightSnapshotId++;
    this._isHighlighting = false;
    this._highlightRerun = false;
    this._highlightingPromise = Promise.resolve();
  }
  setRenderedLineSources(lineSources) {
    this._renderedLineSources = lineSources;
    this._mappedLineInfo = undefined;
  }
  static isIdentityLineSources(lineSources) {
    for (let i = 0;i < lineSources.length; i++) {
      if (lineSources[i] !== i)
        return false;
    }
    return true;
  }
  static getMergedConcealLineRanges(highlights) {
    const ranges = [];
    for (const highlight of highlights) {
      const meta = highlight[3];
      if (meta?.concealLines === undefined)
        continue;
      const group = highlight[2];
      const isEmptyConceal = meta.conceal === "" || meta.conceal === undefined && (group === "conceal" || group.startsWith("conceal."));
      if (isEmptyConceal) {
        ranges.push([highlight[0], highlight[1]]);
      }
    }
    if (ranges.length <= 1)
      return ranges;
    ranges.sort((a, b) => a[0] - b[0]);
    let writeIndex = 0;
    for (let i = 1;i < ranges.length; i++) {
      const current = ranges[writeIndex];
      const next = ranges[i];
      if (next[0] <= current[1]) {
        current[1] = Math.max(current[1], next[1]);
      } else {
        writeIndex++;
        ranges[writeIndex] = next;
      }
    }
    ranges.length = writeIndex + 1;
    return ranges;
  }
  getConcealLinesSourceMap(content, highlights) {
    if (!this._conceal || content.length === 0)
      return;
    const concealLineRanges = CodeRenderable.getMergedConcealLineRanges(highlights);
    if (concealLineRanges.length === 0)
      return;
    const lineSources = [];
    let sourceLine = 0;
    let lineStart = 0;
    let rangeIndex = 0;
    let currentRenderedLineHasText = false;
    const setCurrentRenderedLineSource = (line, hasText) => {
      if (lineSources.length === 0) {
        lineSources.push(line);
      } else if (!currentRenderedLineHasText) {
        lineSources[lineSources.length - 1] = line;
      }
      if (hasText)
        currentRenderedLineHasText = true;
    };
    while (lineStart <= content.length) {
      const newlineOffset = content.indexOf(`
`, lineStart);
      const lineEnd = newlineOffset === -1 ? content.length : newlineOffset;
      while (rangeIndex < concealLineRanges.length && concealLineRanges[rangeIndex][1] <= lineStart) {
        rangeIndex++;
      }
      const range = concealLineRanges[rangeIndex];
      const fullyConcealed = !!range && lineEnd > lineStart && range[0] <= lineStart && range[1] >= lineEnd;
      const lineBreakConcealed = newlineOffset !== -1 && !!range && range[0] <= newlineOffset && range[1] >= newlineOffset;
      if (!fullyConcealed || !lineBreakConcealed) {
        const hasText = lineEnd > lineStart && !fullyConcealed;
        if (hasText || newlineOffset !== -1 || !fullyConcealed) {
          setCurrentRenderedLineSource(sourceLine, hasText);
        }
        if (newlineOffset !== -1 && !lineBreakConcealed) {
          lineSources.push(sourceLine + 1);
          currentRenderedLineHasText = false;
        }
      }
      sourceLine++;
      if (newlineOffset === -1)
        break;
      lineStart = newlineOffset + 1;
    }
    if (lineSources.length === 0 || CodeRenderable.isIdentityLineSources(lineSources))
      return;
    return lineSources;
  }
  getLineHighlights(lineIdx) {
    return this.textBuffer.getLineHighlights(lineIdx);
  }
  onUpdate(deltaTime) {
    super.onUpdate(deltaTime);
    this.scheduleHighlights();
  }
  scheduleHighlights() {
    if (!this._highlightsDirty || this.isDestroyed)
      return;
    const hasContent = this._content.length > 0;
    if (!hasContent || !this._filetype) {
      this.setShouldRenderTextBuffer(hasContent);
      this.setHighlightsDirty(false);
      this.clearPendingHighlight();
      if (hasContent) {
        this.textBuffer.setText(this._content);
        this.setRenderedLineSources(undefined);
        this.updateTextInfo();
      }
      return;
    }
    this.ensureVisibleTextBeforeHighlight();
    this.setHighlightsDirty(false);
    if (this._highlightLoopActive) {
      this._isHighlighting = true;
      this._highlightRerun = true;
      this._highlightingPromise = this._highlightPromise;
      return;
    }
    this._highlightLoopActive = true;
    this._highlightPromise = this.runHighlights();
    this._highlightingPromise = this._highlightPromise;
  }
  renderSelf(buffer) {
    if (!this._shouldRenderTextBuffer)
      return;
    super.renderSelf(buffer);
  }
  destroyOwnedResources() {
    this.runCleanup((run) => {
      run(() => this.clearPendingHighlight());
      run(() => super.destroyOwnedResources());
    });
  }
}

// src/image.ts
import { open, stat } from "fs/promises";
class ImageLoadError extends Error {
  code;
  source;
  status;
  constructor(code, source, message, options) {
    super(message, { cause: options?.cause });
    this.name = "ImageLoadError";
    this.code = code;
    this.source = source;
    this.status = options?.status;
  }
}

class OwnedRawImageImpl {
  data;
  width;
  height;
  stride;
  lib;
  owner;
  handle;
  format = "rgba8";
  colorSpace = "srgb";
  alpha = "straight";
  constructor(data, width, height, stride, lib, handle, owner) {
    this.data = data;
    this.width = width;
    this.height = height;
    this.stride = stride;
    this.lib = lib;
    this.owner = owner;
    this.handle = handle;
  }
  dispose() {
    if (!this.handle)
      return;
    this.lib.imageReleasePixels(this.handle);
    this.handle = null;
    this.owner.release();
  }
}

class ImageOwner {
  resources;
  automatic;
  static automaticOwner;
  references = 0;
  constructor(resources, automatic) {
    this.resources = resources;
    this.automatic = automatic;
  }
  static acquire(options) {
    resolveRenderLib().getYogaHost().assertMutable();
    const owner = options.owner;
    let result;
    if (owner !== undefined) {
      owner.assertAlive();
      result = new ImageOwner(owner, false);
    } else {
      result = this.automaticOwner ??= new ImageOwner(new ResourceContext({ objectCapacity: 4096, renderCellsMax: 1 }), true);
    }
    result.retain();
    return result;
  }
  retain() {
    this.references++;
  }
  release() {
    this.references--;
    if (this.references === 0 && this.automatic) {
      this.resources.destroy();
      ImageOwner.automaticOwner = undefined;
    }
  }
}
var STATUS_MESSAGES = [
  "ok",
  "invalid image handle",
  "unsupported image format",
  "unsupported image color space",
  "malformed image data",
  "image dimensions exceed limits",
  "image memory limit exceeded",
  "invalid image argument",
  "out of memory",
  "image output buffer is too small",
  "internal image error",
  "unsupported image feature",
  "image is retained"
];
var STATUS_CODES = [
  "internal-error",
  "invalid-handle",
  "unsupported-format",
  "unsupported-color-space",
  "malformed-data",
  "dimension-limit",
  "memory-limit",
  "invalid-argument",
  "out-of-memory",
  "output-too-small",
  "internal-error",
  "unsupported-feature",
  "busy"
];
var BUSY_STATUS = 12;

class ImageError extends Error {
  code;
  status;
  constructor(status) {
    super(`Native image operation failed: ${STATUS_MESSAGES[status] ?? `unknown status ${status}`}`);
    this.name = "ImageError";
    this.status = status;
    this.code = STATUS_CODES[status] ?? "internal-error";
  }
}
var FILTER_IDS = {
  default: 0,
  area: 1,
  triangle: 2,
  "cubic-bspline": 3,
  "catmull-rom": 4,
  mitchell: 5,
  nearest: 6
};
var BLEND_IDS = {
  "source-over": 0,
  source: 1,
  "destination-over": 2
};
var PIXEL_FORMAT_BGRA = {
  rgba8: false,
  bgra8: true
};
var PIXEL_ALPHA_IDS = { straight: 0, opaque: 1 };
var MAX_ENCODED_BYTES = 64 * 1024 * 1024;
function imageError(status) {
  return new ImageError(status);
}
function checkStatus(status) {
  if (status !== 0)
    throw imageError(status);
}
function requireMappedOption(mapping, value, name) {
  if (!Object.prototype.hasOwnProperty.call(mapping, value))
    throw new TypeError(`Unsupported ${name}: ${String(value)}`);
  return mapping[value];
}
function requireU32(value, name, allowZero = false) {
  if (!Number.isSafeInteger(value) || value < (allowZero ? 0 : 1) || value > 4294967295) {
    throw new RangeError(`${name} must be ${allowZero ? "a non-negative" : "a positive"} u32 integer`);
  }
  return value;
}
function pixelImportOptions(width, options) {
  const stride = requireU32(options.stride ?? width * 4, "stride");
  const bgra = requireMappedOption(PIXEL_FORMAT_BGRA, options.format ?? "rgba8", "pixel format");
  const alpha = requireMappedOption(PIXEL_ALPHA_IDS, options.alpha ?? "straight", "pixel alpha");
  if (options.colorSpace !== undefined && options.colorSpace !== "srgb") {
    throw new TypeError(`Unsupported pixel color space: ${String(options.colorSpace)}`);
  }
  return { stride, format: Number(bgra), alpha };
}
function requireI32(value, name) {
  if (!Number.isSafeInteger(value) || value < -2147483648 || value > 2147483647) {
    throw new RangeError(`${name} must be an i32 integer`);
  }
  return value;
}
function requireByte(value, name) {
  if (!Number.isInteger(value) || value < 0 || value > 255)
    throw new RangeError(`${name} must be an integer from 0 to 255`);
  return value;
}
function unpackInfo(info) {
  const format = ["unknown", "png", "raw-rgba", "jpeg", "webp", "gif"][info.format];
  if (!format || format === "unknown")
    throw new Error(`Unknown native image format ${info.format}`);
  return {
    width: info.width,
    height: info.height,
    sourceWidth: info.sourceWidth,
    sourceHeight: info.sourceHeight,
    format,
    colorStatus: info.colorStatus === 1 ? "explicit-srgb" : "assumed-srgb",
    orientation: info.orientation,
    hasAlpha: info.hasAlpha !== 0
  };
}
function encodedBytes(data) {
  if (data instanceof Uint8Array)
    return data;
  if (data instanceof ArrayBuffer)
    return new Uint8Array(data);
  throw new TypeError("image data must be a Uint8Array or ArrayBuffer");
}
async function readResponseBytes(response, signal) {
  const contentLength = response.headers.get("content-length");
  if (contentLength !== null) {
    const declaredLength = Number(contentLength);
    if (Number.isFinite(declaredLength) && declaredLength > MAX_ENCODED_BYTES) {
      response.body?.cancel().catch(() => {});
      throw imageError(6);
    }
  }
  if (!response.body)
    return new Uint8Array;
  const reader = response.body.getReader();
  const abort = () => void reader.cancel(signal?.reason).catch(() => {});
  signal?.addEventListener("abort", abort, { once: true });
  let data = new Uint8Array;
  let total = 0;
  try {
    while (true) {
      signal?.throwIfAborted();
      const { done, value } = await reader.read();
      if (done)
        break;
      if (value.byteLength > MAX_ENCODED_BYTES - total) {
        throw imageError(6);
      }
      if (value.byteLength === 0)
        continue;
      const required = total + value.byteLength;
      if (required > data.byteLength) {
        const capacity = Math.min(MAX_ENCODED_BYTES, Math.max(required, data.byteLength * 2));
        const grown = new Uint8Array(capacity);
        grown.set(data.subarray(0, total));
        data = grown;
      }
      data.set(value, total);
      total = required;
    }
  } catch (error) {
    reader.cancel().catch(() => {});
    throw error;
  } finally {
    signal?.removeEventListener("abort", abort);
    reader.releaseLock();
  }
  return data.byteLength === total ? data : data.slice(0, total);
}
async function readFileBytes(path, signal) {
  signal?.throwIfAborted();
  if ((await stat(path)).size > MAX_ENCODED_BYTES)
    throw imageError(6);
  const file = await open(path, "r");
  const chunks = [];
  let total = 0;
  try {
    while (true) {
      signal?.throwIfAborted();
      const chunk = new Uint8Array(Math.min(64 * 1024, MAX_ENCODED_BYTES - total + 1));
      const { bytesRead } = await file.read(chunk, 0, chunk.byteLength, null);
      if (bytesRead === 0)
        break;
      total += bytesRead;
      if (total > MAX_ENCODED_BYTES)
        throw imageError(6);
      chunks.push(chunk.subarray(0, bytesRead));
    }
  } finally {
    await file.close();
  }
  const data = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    data.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return data;
}
async function loadResponseBytes(response, source, signal) {
  try {
    signal?.throwIfAborted();
  } catch (error) {
    response.body?.cancel().catch(() => {});
    throw error;
  }
  if (!response.ok) {
    response.body?.cancel().catch(() => {});
    throw new ImageLoadError("http-status", source, `Failed to fetch image: HTTP ${response.status}`, {
      status: response.status
    });
  }
  try {
    const data = await readResponseBytes(response, signal);
    signal?.throwIfAborted();
    return data;
  } catch (error) {
    if (signal?.aborted)
      throw signal.reason;
    if (error instanceof ImageError)
      throw error;
    throw new ImageLoadError("network", source, `Failed to read image response: ${source}`, { cause: error });
  }
}
function imageInfo(data, options = {}) {
  const bytes = encodedBytes(data);
  if (bytes.byteLength === 0)
    throw new TypeError("image data must not be empty");
  const owner = ImageOwner.acquire(options);
  try {
    const result = owner.resources.renderLib.imageInfo(owner.resources.context, bytes);
    checkStatus(result.status);
    return unpackInfo(result.info);
  } finally {
    owner.release();
  }
}

class NativeImage {
  owner;
  lib;
  handle;
  imageInfo;
  contextImages = new Map;
  constructor(owner, handle, info) {
    this.owner = owner;
    this.lib = owner.resources.renderLib;
    this.handle = handle;
    this.imageInfo = info;
    owner.retain();
  }
  static create(options, operation) {
    const owner = ImageOwner.acquire(options);
    try {
      const result = operation(owner);
      checkStatus(result.status);
      if (!result.handle)
        throw imageError(10);
      return NativeImage.fromHandle(owner, result.handle);
    } finally {
      owner.release();
    }
  }
  static decode(data, options = {}) {
    const bytes = encodedBytes(data);
    if (bytes.byteLength === 0)
      throw new TypeError("image data must not be empty");
    return NativeImage.create(options, ({ resources }) => resources.renderLib.imageDecode(resources.context, bytes));
  }
  static async load(source, options = {}) {
    if (source instanceof Response) {
      return NativeImage.decode(await loadResponseBytes(source, source.url || "Response", options.signal), options);
    }
    options.signal?.throwIfAborted();
    if (source instanceof Uint8Array || source instanceof ArrayBuffer)
      return NativeImage.decode(source, options);
    if (source instanceof Blob) {
      if (source.size > MAX_ENCODED_BYTES)
        throw imageError(6);
      return NativeImage.decode(await loadResponseBytes(new Response(source), "Blob", options.signal), options);
    }
    const url = source instanceof URL ? source : (/^(?:https?|file|blob|data):/i.test(source) || /^[a-z][a-z0-9+.-]*:\/\//i.test(source)) && !/^[a-z]:[\\/]/i.test(source) ? new URL(source) : null;
    if (!url || url.protocol === "file:") {
      const path = url ?? source;
      let data;
      try {
        data = await readFileBytes(path, options.signal);
      } catch (error) {
        if (options.signal?.aborted)
          throw options.signal.reason;
        if (error instanceof ImageError)
          throw error;
        throw new ImageLoadError("file-read", String(source), `Failed to read image: ${String(source)}`, {
          cause: error
        });
      }
      options.signal?.throwIfAborted();
      return NativeImage.decode(data, options);
    }
    if (url.protocol !== "http:" && url.protocol !== "https:" && url.protocol !== "blob:" && url.protocol !== "data:") {
      throw new ImageLoadError("unsupported-url-scheme", url.href, `Unsupported image URL scheme: ${url.protocol}`);
    }
    let response;
    try {
      response = await (options.fetch ?? globalThis.fetch)(url, { signal: options.signal });
    } catch (error) {
      if (options.signal?.aborted)
        throw options.signal.reason;
      throw new ImageLoadError("network", url.href, `Failed to fetch image: ${url.href}`, { cause: error });
    }
    return NativeImage.decode(await loadResponseBytes(response, url.href, options.signal), options);
  }
  static fromRgba(pixels, width, height, stride = width * 4, options = {}) {
    if (!(pixels instanceof Uint8Array))
      throw new TypeError("pixels must be a Uint8Array");
    requireU32(width, "width");
    requireU32(height, "height");
    requireU32(stride, "stride");
    return NativeImage.create(options, ({ resources }) => resources.renderLib.imageCreateFromRgba(resources.context, pixels, width, height, stride));
  }
  static fromPixels(pixels, width, height, options = {}) {
    if (!(pixels instanceof Uint8Array))
      throw new TypeError("pixels must be a Uint8Array");
    requireU32(width, "width");
    requireU32(height, "height");
    const { stride, format, alpha } = pixelImportOptions(width, options);
    return NativeImage.create(options, ({ resources }) => resources.renderLib.imageCreateFromPixels(resources.context, pixels, width, height, stride, format, alpha));
  }
  static fromHandle(owner, handle) {
    const lib = owner.resources.renderLib;
    try {
      const result = lib.imageGetInfo(handle);
      checkStatus(result.status);
      return new NativeImage(owner, handle, unpackInfo(result.info));
    } catch (error) {
      lib.imageDestroy(handle);
      throw error;
    }
  }
  guard() {
    if (!this.handle)
      throw new Error("NativeImage is disposed");
    this.owner.resources.assertAlive();
    return this.handle;
  }
  get ptr() {
    return this.guard();
  }
  _getContextHandle(lib, context) {
    const source = this.guard();
    if (lib !== this.lib)
      throw new Error("NativeImage library owner mismatch");
    if (source.context === context)
      return source;
    for (const [owner, identity2] of this.contextImages) {
      const current = owner.deref();
      if (!current)
        this.contextImages.delete(owner);
      else if (current === context)
        return { ...identity2, context };
    }
    const result = lib.imageClone(source, context);
    checkStatus(result.status);
    const { context: _, ...identity } = result.handle;
    this.contextImages.set(new WeakRef(context), identity);
    return result.handle;
  }
  releaseContextImages() {
    let failure;
    for (const [owner, identity] of this.contextImages) {
      const context = owner.deref();
      try {
        if (context)
          this.lib.releaseAfterPaint(context, () => this.lib.destroyContextImage(context, { ...identity, context }));
        this.contextImages.delete(owner);
      } catch (error) {
        if (error instanceof NativeError && error.status === -7 /* WrongContext */) {
          this.contextImages.delete(owner);
        } else
          failure ??= { error };
      }
    }
    if (failure)
      throw failure.error;
  }
  wrap(result) {
    checkStatus(result.status);
    if (!result.handle)
      throw imageError(10);
    return NativeImage.fromHandle(this.owner, result.handle);
  }
  info() {
    this.guard();
    return { ...this.imageInfo };
  }
  get width() {
    this.guard();
    return this.imageInfo.width;
  }
  get height() {
    this.guard();
    return this.imageInfo.height;
  }
  clone() {
    return this.wrap(this.lib.imageClone(this.guard()));
  }
  retain() {
    return this.wrap(this.lib.imageRetain(this.guard()));
  }
  resize(options) {
    if (!options || options.width === undefined && options.height === undefined) {
      throw new TypeError("resize requires width, height, or both");
    }
    let width = options.width;
    let height = options.height;
    if (width !== undefined)
      requireU32(width, "width");
    if (height !== undefined)
      requireU32(height, "height");
    if (width === undefined)
      width = Math.max(1, Math.round(this.width * height / this.height));
    if (height === undefined)
      height = Math.max(1, Math.round(this.height * width / this.width));
    requireU32(width, "width");
    requireU32(height, "height");
    const filter = requireMappedOption(FILTER_IDS, options.kernel ?? "area", "resize kernel");
    return this.wrap(this.lib.imageResize(this.guard(), width, height, filter));
  }
  extract(options) {
    return this.wrap(this.lib.imageExtract(this.guard(), requireU32(options.left, "left", true), requireU32(options.top, "top", true), requireU32(options.width, "width"), requireU32(options.height, "height")));
  }
  extend(options = {}) {
    const background = options.background ?? [0, 0, 0, 0];
    if (background.length !== 4)
      throw new TypeError("background must contain four RGBA channels");
    const color = Uint8Array.from(background.map((value, index) => requireByte(value, `background[${index}]`)));
    return this.wrap(this.lib.imageExtend(this.guard(), requireU32(options.top ?? 0, "top", true), requireU32(options.right ?? 0, "right", true), requireU32(options.bottom ?? 0, "bottom", true), requireU32(options.left ?? 0, "left", true), color));
  }
  rotate(angle) {
    const operation = angle === 90 ? 0 : angle === 180 ? 1 : angle === 270 ? 2 : -1;
    if (operation < 0)
      throw new RangeError("angle must be 90, 180, or 270");
    return this.wrap(this.lib.imageTransform(this.guard(), operation));
  }
  flip() {
    return this.wrap(this.lib.imageTransform(this.guard(), 3));
  }
  flop() {
    return this.wrap(this.lib.imageTransform(this.guard(), 4));
  }
  composite(overlay, options = {}) {
    if (!(overlay instanceof NativeImage))
      throw new TypeError("overlay must be a NativeImage");
    const opacity = options.opacity ?? 1;
    if (!Number.isFinite(opacity) || opacity < 0 || opacity > 1)
      throw new RangeError("opacity must be between 0 and 1");
    return this.wrap(this.lib.imageComposite(this.guard(), overlay._getContextHandle(this.lib, this.guard().context), requireI32(options.left ?? 0, "left"), requireI32(options.top ?? 0, "top"), requireMappedOption(BLEND_IDS, options.blend ?? "source-over", "blend mode"), Math.round(opacity * 255)));
  }
  ensureEncodedPng() {
    checkStatus(this.lib.imageEnsureEncodedPng(this.guard()));
  }
  raw(format = "rgba8") {
    const stride = this.width * 4;
    const data = new Uint8Array(stride * this.height);
    checkStatus(this.lib.imageCopyPixels(this.guard(), data, stride, requireMappedOption(PIXEL_FORMAT_BGRA, format, "pixel format")));
    return { data, width: this.width, height: this.height, stride, format, colorSpace: "srgb", alpha: "straight" };
  }
  takeRaw() {
    const handle = this.guard();
    this.releaseContextImages();
    const result = this.lib.imageTakePixels(handle);
    if (result.status === BUSY_STATUS) {
      throw new Error("Cannot transfer image pixels while native buffers retain the image");
    }
    checkStatus(result.status);
    const width = this.imageInfo.width;
    const height = this.imageInfo.height;
    const stride = width * 4;
    this.handle = null;
    try {
      const data = new Uint8Array(toArrayBuffer(result.pointer, 0, result.byteCount));
      return new OwnedRawImageImpl(data, width, height, stride, this.lib, result.lease, this.owner);
    } catch (error) {
      this.lib.imageReleasePixels(result.lease);
      this.owner.release();
      throw error;
    }
  }
  copyTo(destination, options = {}) {
    if (!(destination instanceof Uint8Array))
      throw new TypeError("destination must be a Uint8Array");
    const stride = options.stride ?? this.width * 4;
    requireU32(stride, "stride");
    const bgra = requireMappedOption(PIXEL_FORMAT_BGRA, options.format ?? "rgba8", "pixel format");
    checkStatus(this.lib.imageCopyPixels(this.guard(), destination, stride, bgra));
  }
  dispose() {
    try {
      this.releaseContextImages();
    } finally {
      if (this.handle) {
        const handle = this.handle;
        if (!this.owner.resources.disposed)
          this.lib.releaseAfterPaint(handle.context, () => this.lib.imageDestroy(handle));
        this.handle = null;
        this.owner.release();
      }
    }
  }
}

class NativeImagePool {
  lib;
  owner;
  images = [];
  disposed = false;
  width;
  height;
  capacity;
  constructor(options) {
    this.owner = options.owner;
    this.width = requireU32(options.width, "width");
    this.height = requireU32(options.height, "height");
    this.capacity = requireU32(options.capacity ?? 3, "capacity");
    if (this.capacity > 8)
      throw new RangeError("capacity must be between 1 and 8");
    this.lib = resolveRenderLib();
  }
  publishRgba(pixels, stride = this.width * 4) {
    return this.publishPixels(pixels, { stride: requireU32(stride, "stride") });
  }
  publishPixels(pixels, options = {}) {
    if (this.disposed)
      throw new Error("NativeImagePool is disposed");
    if (!(pixels instanceof Uint8Array))
      throw new TypeError("pixels must be a Uint8Array");
    const { stride, format, alpha } = pixelImportOptions(this.width, options);
    for (const image2 of this.images) {
      const status = this.lib.imageUpdatePixels(image2.ptr, pixels, stride, format, alpha);
      if (status === BUSY_STATUS)
        continue;
      checkStatus(status);
      return image2.retain();
    }
    if (this.images.length === this.capacity)
      return null;
    const image = NativeImage.fromPixels(pixels, this.width, this.height, { ...options, owner: this.owner });
    this.images.push(image);
    return image.retain();
  }
  dispose() {
    if (this.disposed)
      return;
    for (const image of this.images)
      image.dispose();
    this.images.length = 0;
    this.disposed = true;
  }
}

// src/renderables/Image.ts
function resolveImageRenderProtocol(requested, capabilities, hasResolution) {
  if (requested !== "auto")
    return requested === "sixel" && !hasResolution ? "blocks" : requested;
  const configured = capabilities?.image_protocol ?? "auto";
  if (configured !== "auto")
    return configured === "sixel" && !hasResolution ? "blocks" : configured;
  if (!capabilities || capabilities.multiplexer === "tmux")
    return "blocks";
  if (capabilities.kitty_graphics)
    return "kitty";
  if (capabilities.sixel && hasResolution)
    return "sixel";
  return "blocks";
}
function pixelResolution(ctx) {
  const terminalWidth = ctx.terminalWidth ?? 0;
  const terminalHeight = ctx.terminalHeight ?? 0;
  const resolution = terminalWidth > 0 && terminalHeight > 0 ? ctx.resolution : null;
  return resolution && resolution.width > 0 && resolution.height > 0 ? resolution : null;
}

class ImageRenderable extends Renderable {
  static nativeIntegration = {
    kind: "image",
    body: { native: this.prototype.renderSelf, buffered: true },
    bufferComposition: "native"
  };
  _source;
  _image = null;
  _pendingImage = null;
  _loadError = null;
  _loadController = null;
  onLoad;
  onError;
  _fit;
  _protocol;
  _placementOpacity;
  loadPromise = null;
  constructor(ctx, options) {
    super(ctx, options);
    try {
      this._fit = options.fit ?? "fit";
      this._protocol = options.protocol ?? "auto";
      this._placementOpacity = options.placementOpacity ?? null;
      this.onLoad = options.onLoad;
      this.onError = options.onError;
      this.setNativeSceneImage();
      if (options.source !== undefined)
        this.source = options.source;
    } catch (error) {
      this.abortConstruction(error, () => this.destroySelf());
    }
  }
  get source() {
    return this._source;
  }
  set source(source) {
    source ??= undefined;
    if (source === this._source)
      return;
    if (source === undefined)
      this.setNativeSceneImage(null);
    this._source = source;
    const previous = this._loadController;
    previous?.abort();
    if (this.isDestroyed || this._loadController !== previous)
      return;
    this._loadController = null;
    this._pendingImage?.dispose();
    this._pendingImage = null;
    if (source === undefined) {
      this._loadError = null;
      this._image?.dispose();
      this._image = null;
      this.loadPromise = null;
      this.requestRender();
      return;
    }
    const controller = new AbortController;
    this._loadController = controller;
    this._loadError = null;
    let imagePromise;
    if (source instanceof NativeImage) {
      try {
        const image = source.retain();
        this._pendingImage = image;
        imagePromise = Promise.resolve(image);
      } catch (error) {
        imagePromise = Promise.reject(error);
      }
    } else {
      imagePromise = NativeImage.load(source, {
        signal: controller.signal,
        owner: this._ctx.nativeScene.resourceContext
      });
    }
    this.loadPromise = this.load(imagePromise, controller);
  }
  get image() {
    return this._image;
  }
  get fit() {
    return this._fit;
  }
  set fit(value) {
    const next = value ?? "fit";
    if (this._fit === next)
      return;
    this.setNativeSceneImage(this._image, next);
    this._fit = next;
    this.requestRender();
  }
  get protocol() {
    return this._protocol;
  }
  set protocol(value) {
    const next = value ?? "auto";
    if (this._protocol === next)
      return;
    this.setNativeSceneImage(this._image, this._fit, next);
    this._protocol = next;
    this.requestRender();
  }
  get placementOpacity() {
    return this._placementOpacity;
  }
  set placementOpacity(value) {
    const next = value ?? null;
    if (this._placementOpacity === next)
      return;
    this._placementOpacity = next;
    this.setNativeSceneImage(this._image, this._fit, this._protocol);
    this.requestRender();
  }
  get effectiveProtocol() {
    return resolveImageRenderProtocol(this._protocol, this._ctx.capabilities, pixelResolution(this._ctx) !== null);
  }
  get cellAspectRatio() {
    const resolution = pixelResolution(this._ctx);
    if (!resolution)
      return 2;
    const cellWidth = resolution.width / this._ctx.terminalWidth;
    const cellHeight = resolution.height / this._ctx.terminalHeight;
    return cellWidth > 0 && cellHeight > 0 ? cellHeight / cellWidth : 2;
  }
  getFittedSize(targetWidth, targetHeight, cellAspectRatio = this.cellAspectRatio, sourceWidth = this._image?.width ?? 0, sourceHeight = this._image?.height ?? 0) {
    if (sourceWidth <= 0 || sourceHeight <= 0 || targetWidth <= 0 || targetHeight <= 0)
      return { width: 0, height: 0 };
    if (this._fit === "fill")
      return { width: targetWidth, height: targetHeight };
    const displayAspect = sourceWidth / sourceHeight * cellAspectRatio;
    const scale = this._fit === "fit" ? Math.min(targetWidth / displayAspect, targetHeight) : Math.max(targetWidth / displayAspect, targetHeight);
    return {
      width: Math.max(1, Math.round(displayAspect * scale)),
      height: Math.max(1, Math.round(scale))
    };
  }
  get loading() {
    return this._loadController !== null;
  }
  get loadError() {
    return this._loadError;
  }
  createFrameBuffer() {
    const previous = this.frameBuffer;
    super.createFrameBuffer();
    if (this._fit === undefined || this.frameBuffer === previous)
      return;
    try {
      this.setNativeSceneImage();
    } catch (error) {
      const candidate = this.frameBuffer;
      this.frameBuffer = previous;
      try {
        candidate?.destroy();
      } catch {}
      throw error;
    }
  }
  renderSelf(buffer) {
    const width = this._paintWidth;
    const height = this._paintHeight;
    if (!this._image || width <= 0 || height <= 0)
      return;
    const fitted = this._fit === "cover" ? { width, height } : this.getFittedSize(width, height);
    if (fitted.width <= 0 || fitted.height <= 0)
      return;
    const originX = this.buffered ? 0 : this._screenX;
    const originY = this.buffered ? 0 : this._screenY;
    const x = originX + Math.floor((width - fitted.width) / 2);
    const y = originY + Math.floor((height - fitted.height) / 2);
    const resolution = pixelResolution(this._ctx);
    const pixelWidth = resolution ? Math.max(1, Math.round(fitted.width * resolution.width / this._ctx.terminalWidth)) : 0;
    const pixelHeight = resolution ? Math.max(1, Math.round(fitted.height * resolution.height / this._ctx.terminalHeight)) : 0;
    let sourceX = 0;
    let sourceY = 0;
    let sourceWidth = this._image.width;
    let sourceHeight = this._image.height;
    if (this._fit === "cover") {
      const targetAspect = width / (height * this.cellAspectRatio);
      const sourceAspect = sourceWidth / sourceHeight;
      if (sourceAspect > targetAspect) {
        sourceWidth = Math.max(1, Math.round(sourceHeight * targetAspect));
        sourceX = Math.floor((this._image.width - sourceWidth) / 2);
      } else {
        sourceHeight = Math.max(1, Math.round(sourceWidth / targetAspect));
        sourceY = Math.floor((this._image.height - sourceHeight) / 2);
      }
    }
    buffer.drawImage(this._image, x, y, fitted.width, fitted.height, pixelWidth, pixelHeight, sourceX, sourceY, sourceWidth, sourceHeight, this._protocol, this._placementOpacity ?? undefined);
  }
  async load(imagePromise, controller) {
    let image;
    try {
      image = await imagePromise;
      if (this.isDestroyed || this._loadController !== controller) {
        image.dispose();
        return;
      }
      if (this._pendingImage === image)
        this._pendingImage = null;
      this.setNativeSceneImage(image);
    } catch (error) {
      try {
        image?.dispose();
      } catch {}
      if (controller.signal.aborted || this.isDestroyed || this._loadController !== controller)
        return;
      this._loadController = null;
      this._loadError = error;
      this.onError?.(error);
      return;
    }
    const previous = this._image;
    this._image = image;
    this._loadController = null;
    this.runCleanup((run) => {
      run(() => previous?.dispose());
      run(() => this.requestRender());
      run(() => this.onLoad?.(image));
    });
  }
  setNativeSceneImage(image = this._image, fit = this._fit, protocol = this._protocol) {
    this._ctx.nativeScene.setImage(this, image, fit, protocol, this.buffered ? this.frameBuffer : null, this._placementOpacity);
  }
  destroySelf() {
    const controller = this._loadController;
    const pending = this._pendingImage;
    const image = this._image;
    this._loadController = null;
    this._pendingImage = null;
    this._image = null;
    this.runCleanup((run) => {
      run(() => controller?.abort());
      run(() => pending?.dispose());
      run(() => image?.dispose());
      run(() => super.destroySelf());
    });
  }
}

// src/renderables/TextNode.ts
var BrandedTextNodeRenderable = Symbol.for("@opentui/core/TextNodeRenderable");
function isTextNodeRenderable(obj) {
  return !!obj?.[BrandedTextNodeRenderable];
}
function styledTextToTextNodes(styledText) {
  return styledText.chunks.map((chunk) => {
    const node = new TextNodeRenderable({
      fg: chunk.fg,
      bg: chunk.bg,
      attributes: chunk.attributes,
      link: chunk.link
    });
    node.add(chunk.text);
    return node;
  });
}

class TextNodeRenderable extends BaseRenderable {
  [BrandedTextNodeRenderable] = true;
  _fg;
  _bg;
  _attributes;
  _link;
  _children = [];
  dirtyRevision = 0;
  parent = null;
  constructor(options) {
    super(options);
    this._fg = options.fg ? RGBA.clone(parseColor(options.fg)) : undefined;
    this._bg = options.bg ? RGBA.clone(parseColor(options.bg)) : undefined;
    this._attributes = options.attributes ?? 0;
    this._link = options.link;
  }
  get children() {
    return this._children;
  }
  set children(children) {
    for (const child of this._children) {
      if (isTextNodeRenderable(child) && child.parent === this) {
        child.parent = null;
      }
    }
    for (const child of children) {
      if (isTextNodeRenderable(child)) {
        if (child.parent && child.parent !== this) {
          child.parent.remove(child);
        }
        child.parent = this;
      }
    }
    this._children = children;
    this.requestRender();
  }
  requestRender() {
    this.markDirty();
    this.parent?.requestRender();
  }
  markDirty() {
    super.markDirty();
    this.dirtyRevision++;
  }
  add(obj, index) {
    if (typeof obj === "string") {
      if (index !== undefined) {
        this._children.splice(index, 0, obj);
        this.requestRender();
        return index;
      }
      const insertIndex = this._children.length;
      this._children.push(obj);
      this.requestRender();
      return insertIndex;
    }
    if (isTextNodeRenderable(obj)) {
      const insertIndex = this.prepareChildInsert(obj, index);
      this._children.splice(insertIndex, 0, obj);
      obj.parent = this;
      this.requestRender();
      return insertIndex;
    }
    if (isStyledText(obj)) {
      const textNodes = styledTextToTextNodes(obj);
      if (index !== undefined) {
        this._children.splice(index, 0, ...textNodes);
        textNodes.forEach((node) => node.parent = this);
        this.requestRender();
        return index;
      }
      const insertIndex = this._children.length;
      this._children.push(...textNodes);
      textNodes.forEach((node) => node.parent = this);
      this.requestRender();
      return insertIndex;
    }
    throw new Error("TextNodeRenderable only accepts strings, TextNodeRenderable instances, or StyledText instances");
  }
  prepareChildInsert(child, index) {
    let insertIndex = index ?? this._children.length;
    if (child.parent && child.parent !== this) {
      child.parent.remove(child);
    } else if (child.parent === this) {
      const currentIndex = this._children.indexOf(child);
      if (currentIndex !== -1) {
        this._children.splice(currentIndex, 1);
        if (currentIndex < insertIndex)
          insertIndex -= 1;
      }
    }
    return Math.max(0, Math.min(insertIndex, this._children.length));
  }
  replace(obj, index) {
    const existing = this._children[index];
    if (isTextNodeRenderable(existing) && existing.parent === this) {
      existing.parent = null;
    }
    if (isTextNodeRenderable(obj)) {
      if (obj.parent && obj.parent !== this) {
        obj.parent.remove(obj);
      } else if (obj.parent === this) {
        const currentIndex = this._children.indexOf(obj);
        if (currentIndex !== -1 && currentIndex !== index) {
          this._children.splice(currentIndex, 1);
          if (currentIndex < index)
            index -= 1;
        }
      }
      obj.parent = this;
    }
    this._children[index] = obj;
    this.requestRender();
  }
  insertBefore(child, anchorNode) {
    if (!anchorNode || !isTextNodeRenderable(anchorNode)) {
      throw new Error("Anchor must be a TextNodeRenderable");
    }
    const anchorIndex = this._children.indexOf(anchorNode);
    if (anchorIndex === -1) {
      throw new Error("Anchor node not found in children");
    }
    if (child === anchorNode) {
      return this;
    }
    if (isTextNodeRenderable(child)) {
      this.add(child, anchorIndex);
      return this;
    }
    if (typeof child === "string") {
      this._children.splice(anchorIndex, 0, child);
    } else if (isStyledText(child)) {
      const textNodes = styledTextToTextNodes(child);
      this._children.splice(anchorIndex, 0, ...textNodes);
      textNodes.forEach((node) => node.parent = this);
    } else {
      throw new Error("Child must be a string, TextNodeRenderable, or StyledText instance");
    }
    this.requestRender();
    return this;
  }
  remove(child) {
    if (!isTextNodeRenderable(child)) {
      throw new Error("remove expects a TextNodeRenderable child object");
    }
    const childIndex = this._children.indexOf(child);
    if (childIndex === -1) {
      if (true) {
        console.warn(`TextNodeRenderable with id ${child.id} is not a child of ${this.id}, skipping remove`);
      }
      return;
    }
    this._children.splice(childIndex, 1);
    child.parent = null;
    this.requestRender();
  }
  clear() {
    for (const child of this._children) {
      if (isTextNodeRenderable(child) && child.parent === this) {
        child.parent = null;
      }
    }
    this._children = [];
    this.requestRender();
  }
  mergeStyles(parentStyle) {
    return {
      fg: this.fg ?? parentStyle.fg,
      bg: this.bg ?? parentStyle.bg,
      attributes: this._attributes | parentStyle.attributes,
      link: this._link ?? parentStyle.link
    };
  }
  gatherWithInheritedStyle(parentStyle = {
    fg: undefined,
    bg: undefined,
    attributes: 0
  }) {
    return this.gatherChunks(parentStyle);
  }
  prepareWithInheritedStyle(parentStyle) {
    const revisions = new Map;
    const chunks = this.gatherChunks(parentStyle, revisions);
    return {
      chunks,
      acknowledge: () => {
        for (const [node, revision] of revisions) {
          if (node.dirtyRevision === revision)
            node.markClean();
        }
      }
    };
  }
  gatherChunks(parentStyle, revisions) {
    revisions?.set(this, this.dirtyRevision);
    const currentStyle = this.mergeStyles(parentStyle);
    const chunks = [];
    for (const child of this._children) {
      if (typeof child === "string") {
        chunks.push({
          __isChunk: true,
          text: child,
          fg: currentStyle.fg,
          bg: currentStyle.bg,
          attributes: currentStyle.attributes,
          link: currentStyle.link
        });
      } else {
        const childChunks = revisions ? child.gatherChunks(currentStyle, revisions) : child.gatherWithInheritedStyle(currentStyle);
        chunks.push(...childChunks);
      }
    }
    if (!revisions)
      this.markClean();
    return chunks;
  }
  static fromString(text, options = {}) {
    const node = new TextNodeRenderable(options);
    node.add(text);
    return node;
  }
  static fromNodes(nodes, options = {}) {
    const node = new TextNodeRenderable(options);
    for (const childNode of nodes) {
      node.add(childNode);
    }
    return node;
  }
  toChunks(parentStyle = {
    fg: undefined,
    bg: undefined,
    attributes: 0
  }) {
    return this.gatherWithInheritedStyle(parentStyle);
  }
  getChildren() {
    return this._children.filter((child) => typeof child !== "string");
  }
  getChildrenCount() {
    return this._children.length;
  }
  getRenderable(id) {
    return this._children.find((child) => typeof child !== "string" && child.id === id);
  }
  getRenderableIndex(id) {
    return this._children.findIndex((child) => isTextNodeRenderable(child) && child.id === id);
  }
  get fg() {
    return this._fg ? RGBA.clone(this._fg) : undefined;
  }
  set fg(fg) {
    if (!fg) {
      this._fg = undefined;
      this.requestRender();
      return;
    }
    this._fg = RGBA.clone(parseColor(fg));
    this.requestRender();
  }
  set bg(bg) {
    if (!bg) {
      this._bg = undefined;
      this.requestRender();
      return;
    }
    this._bg = RGBA.clone(parseColor(bg));
    this.requestRender();
  }
  get bg() {
    return this._bg ? RGBA.clone(this._bg) : undefined;
  }
  set attributes(attributes) {
    this._attributes = attributes;
    this.requestRender();
  }
  get attributes() {
    return this._attributes;
  }
  set link(link) {
    this._link = link;
    this.requestRender();
  }
  get link() {
    return this._link;
  }
  findDescendantById(id) {
    return;
  }
}

class RootTextNodeRenderable extends TextNodeRenderable {
  ctx;
  textParent;
  constructor(ctx, options, textParent) {
    super(options);
    this.ctx = ctx;
    this.textParent = textParent;
  }
  requestRender() {
    this.markDirty();
    this.textParent.requestRender();
  }
}

// src/renderables/Text.ts
class TextRenderable extends TextBufferRenderable {
  static nativeIntegration = {
    ...TextBufferRenderable.nativeIntegration,
    lineInfo: true
  };
  _text;
  _hasManualStyledText = false;
  rootTextNode;
  composeText = () => this.updateTextFromNodes();
  _contentDefaultOptions = {
    content: ""
  };
  constructor(ctx, options) {
    super(ctx, options);
    try {
      const initialContent = options.content;
      const content = initialContent ?? this._contentDefaultOptions.content;
      this.content = content;
      this._hasManualStyledText = initialContent !== undefined && content !== "";
      this.onLifecyclePass = this.composeText;
    } catch (error) {
      this.rollbackConstruction(error);
    }
  }
  get content() {
    if (typeof this._text === "string")
      this._text = stringToStyledText(this._text);
    return this._text;
  }
  get chunks() {
    return this.content.chunks;
  }
  get textNode() {
    return this.rootTextNode ??= new RootTextNodeRenderable(this._ctx, {
      id: `${this.id}-root`,
      fg: this._defaultFg,
      bg: this._defaultBg,
      attributes: this._defaultAttributes
    }, this);
  }
  set content(value) {
    if (typeof value !== "string" && this._text === value) {
      this._hasManualStyledText = true;
      this._ctx.nativeScene.lifecyclePasses.refresh(this);
      return;
    }
    this._ctx.nativeScene.setText(this, value);
    this._text = value;
    this._hasManualStyledText = true;
    this._ctx.nativeScene.lifecyclePasses.refresh(this);
    this.requestRender();
    this.refreshLocalSelection();
    this.emit("line-info-change");
  }
  updateTextFromNodes() {
    if (this.rootTextNode?.isDirty && !this._hasManualStyledText) {
      const style = {
        fg: this._defaultFg,
        bg: this._defaultBg,
        attributes: this._defaultAttributes,
        link: undefined
      };
      const prepared = this.rootTextNode.prepareWithInheritedStyle(style);
      this._ctx.nativeScene.setText(this, new StyledText(prepared.chunks));
      prepared.acknowledge();
      this._ctx.nativeScene.lifecyclePasses.refresh(this);
      this.refreshLocalSelection();
      this.emit("line-info-change");
      return;
    }
    this._ctx.nativeScene.lifecyclePasses.refresh(this);
  }
  _needsLifecyclePass() {
    if (this.onLifecyclePass !== this.composeText)
      return super._needsLifecyclePass();
    return !this._hasManualStyledText && !!this.rootTextNode?.isDirty;
  }
  requestRender() {
    if (this.isDestroyed)
      return;
    this._ctx.nativeScene.lifecyclePasses.refresh(this);
    super.requestRender();
  }
  add(obj, index) {
    return this.textNode.add(obj, index);
  }
  remove(child) {
    this.textNode.remove(child);
  }
  insertBefore(obj, anchor) {
    this.textNode.insertBefore(obj, anchor);
    return this.textNode.children.indexOf(obj);
  }
  getTextChildren() {
    return this.rootTextNode?.getChildren() ?? [];
  }
  clear() {
    this._ctx.nativeScene.setText(this, "");
    this._text = stringToStyledText("");
    this.rootTextNode?.clear();
    this.requestRender();
    this.refreshLocalSelection();
    this.emit("line-info-change");
  }
  onFgChanged(newColor) {
    if (this.rootTextNode)
      this.rootTextNode.fg = newColor;
  }
  onBgChanged(newColor) {
    if (this.rootTextNode)
      this.rootTextNode.bg = newColor;
  }
  onAttributesChanged(newAttributes) {
    if (this.rootTextNode)
      this.rootTextNode.attributes = newAttributes;
  }
  destroyOwnedResources() {
    this.runCleanup((run) => {
      run(() => {
        if (this.rootTextNode) {
          for (const child of this.rootTextNode.getChildren()) {
            if (child.parent === this.rootTextNode)
              child.parent = null;
          }
        }
        if (this.rootTextNode)
          this.rootTextNode.children.length = 0;
      });
      run(() => super.destroyOwnedResources());
    });
  }
}

// src/NativeSession.ts
import { Writable } from "stream";
var scheduler = {
  now: () => process.hrtime.bigint(),
  schedule(callback, delayMs) {
    if (delayMs === undefined) {
      const handle2 = setImmediate(callback);
      return () => clearImmediate(handle2);
    }
    const handle = setTimeout(callback, delayMs);
    return () => clearTimeout(handle);
  }
};
var emptyOutput = new Uint8Array(0);

class ReadySessions {
  host;
  ready = new Set;
  pending = new Set;
  current = null;
  cancelTurn = null;
  failure = null;
  constructor(host) {
    this.host = host;
  }
  scope(onError) {
    if (this.failure)
      throw this.failure;
    const tasks = new Set;
    const scoped = {
      now: () => this.host.now(),
      schedule: (callback, delayMs) => {
        if (this.failure)
          throw this.failure;
        let cancelTimer;
        const task = {
          callback,
          active: true,
          onError,
          cancel: () => {
            task.active = false;
            tasks.delete(task);
            this.pending.delete(task);
            if (tasks.size === 0)
              this.ready.delete(tasks);
            const cancel = cancelTimer;
            cancelTimer = undefined;
            try {
              cancel?.();
            } finally {
              if (this.ready.size === 0) {
                const cancel2 = this.cancelTurn;
                this.cancelTurn = null;
                cancel2?.();
              }
            }
          }
        };
        this.pending.add(task);
        const enqueue = () => {
          if (!task.active)
            return;
          tasks.add(task);
          this.ready.add(tasks);
          this.arm();
        };
        try {
          if (delayMs === undefined)
            enqueue();
          else
            cancelTimer = this.host.schedule(enqueue, delayMs);
        } catch (error) {
          this.fail(error);
        }
        if (this.failure)
          throw this.failure;
        return task.cancel;
      }
    };
    readyServices.set(scoped, this);
    return scoped;
  }
  arm() {
    if (this.failure || this.cancelTurn || this.ready.size === 0)
      return;
    let arming = true;
    try {
      this.cancelTurn = this.host.schedule(() => {
        if (arming)
          throw new Error("NativeSessionScheduler.schedule ran a callback inline");
        this.cancelTurn = null;
        const tasks = this.ready.values().next().value;
        if (!tasks)
          return;
        const task = this.current = tasks.values().next().value;
        this.ready.delete(tasks);
        tasks.delete(task);
        if (tasks.size > 0)
          this.ready.add(tasks);
        task.active = false;
        this.pending.delete(task);
        try {
          task.callback();
        } finally {
          try {
            this.arm();
          } finally {
            this.current = null;
          }
        }
      });
    } catch (error) {
      this.fail(error);
    } finally {
      arming = false;
    }
  }
  fail(error) {
    if (this.failure)
      return;
    this.failure = asError(error);
    const affected = new Set(this.pending);
    if (this.current)
      affected.add(this.current);
    const owners = new Set;
    let cleanupFailure;
    for (const task of affected) {
      owners.add(task.onError);
      try {
        task.cancel();
      } catch (error2) {
        cleanupFailure ??= { error: error2 };
      }
    }
    this.ready.clear();
    this.pending.clear();
    for (const onError of owners) {
      try {
        onError(this.failure);
      } catch (error2) {
        cleanupFailure ??= { error: error2 };
      }
    }
    if (cleanupFailure)
      throw cleanupFailure.error;
  }
}
var readyServices = new WeakMap;
function sessionScheduler(host, onError) {
  let service = readyServices.get(host);
  if (!service) {
    service = new ReadySessions(host);
    readyServices.set(host, service);
  }
  return service.scope(onError);
}
function completion() {
  const result = Promise.withResolvers();
  result.promise.catch(() => {});
  return result;
}
function asError(error) {
  return error instanceof Error ? error : new Error("NativeSession failed", { cause: error });
}

class NativeSession {
  sink;
  owner;
  lib = resolveRenderLib();
  attachmentCleanup;
  resourceContext;
  nativeSession;
  buffer;
  outputBufferSize;
  sinkWrite;
  scheduler;
  maxWriteBytes;
  maxAtomicWriteBytes;
  closeTimeoutNs;
  closeWait = completion();
  idleWait = null;
  presentationWait = null;
  transition = null;
  scheduled = null;
  output = null;
  blocked = false;
  sinkErrorSeen = false;
  detached = false;
  closeDeadlineNs = null;
  closeRequested = false;
  closeInterruption = null;
  stopped = false;
  exiting = false;
  finishing = false;
  _disposed = false;
  _error = null;
  detachedSessions = new Set;
  closed = this.closeWait.promise;
  constructor(sink, options = {}, owner) {
    this.sink = sink;
    this.owner = owner;
    this.lib.getYogaHost().assertMutable();
    const size = options.outputBufferSize ?? 65536;
    const timeout = options.closeTimeoutMs ?? 1000;
    const output = options.output ?? {
      chunkSize: 65536,
      spanCapacity: 128,
      maxBytes: 8388608n,
      controlCapacity: 4096
    };
    if (!Number.isInteger(size) || size <= 0 || size > 4294967295) {
      throw new RangeError("NativeSession outputBufferSize must be a positive u32");
    }
    if (!Number.isInteger(timeout) || timeout < 0 || timeout > 2147483647) {
      throw new RangeError("NativeSession closeTimeoutMs must be an integer from 0 to 2147483647");
    }
    if (!sink.writable || sink.destroyed || sink.writableEnded)
      throw new Error("NativeSession sink is not writable");
    this.sinkWrite = sink.write;
    this.outputBufferSize = size;
    this.buffer = sink === process.stdout && process.stdout.fd === 1 ? null : new Uint8Array(size);
    this.scheduler = sessionScheduler(options.scheduler ?? scheduler, (error) => {
      if (this.stopped) {
        if (this.canDetach())
          this.detach();
      } else
        this.finish(error);
    });
    this.maxWriteBytes = output.maxBytes;
    this.closeTimeoutNs = BigInt(timeout) * 1000000n;
    owner?.checkOpen();
    this.resourceContext = owner?.resourceContext ?? new ResourceContext(options.context ?? { objectCapacity: 65536, renderCellsMax: 1e6 });
    let session;
    try {
      session = this.lib.createSession(this.context, output);
      this.nativeSession = Object.freeze(session);
      this.maxAtomicWriteBytes = this.lib.sessionGetWriteLimit(this.context, session);
      sink.on("error", this.onError);
      sink.on("close", this.onClose);
      sink.on("finish", this.onFinish);
      sink.on("drain", this.onDrain);
      if (this._error)
        throw this._error;
      if (!sink.writable || sink.destroyed || sink.writableEnded)
        throw new Error("NativeSession sink is not writable");
      this.blocked = sink.writableNeedDrain;
      owner?.detachedSessions.add(this);
    } catch (error) {
      this.stopped = true;
      try {
        if (session)
          this.finish(asError(error));
        else if (!owner)
          this.resourceContext.destroy();
      } catch {} finally {
        this.detach();
      }
      throw error;
    }
  }
  get context() {
    return this.resourceContext.context;
  }
  get renderLib() {
    return this.lib;
  }
  get session() {
    return this.nativeSession;
  }
  get disposed() {
    return this._disposed;
  }
  get contextDisposed() {
    return this.resourceContext.disposed;
  }
  get error() {
    return this._error;
  }
  usesOutput(sink) {
    return this.sink === sink;
  }
  attachRenderer(options, beforeDispose) {
    this.checkOpen();
    this.lib.sessionAttachRenderer(this.context, this.session, options);
    this.attachmentCleanup = beforeDispose;
  }
  createDetached(options, beforeDispose) {
    this.checkOpen();
    const detached = new NativeSession(new Writable({
      write(_bytes, _encoding, complete) {
        complete();
      }
    }), {
      output: { chunkSize: 4096, spanCapacity: 2, maxBytes: 8192n, controlCapacity: 0 },
      outputBufferSize: 4096,
      scheduler: this.scheduler
    }, this);
    try {
      detached.attachRenderer(options, beforeDispose);
      return detached;
    } catch (error) {
      detached.dispose();
      throw error;
    }
  }
  setupTerminal(options = {}) {
    return this.changeTerminal("setup", options);
  }
  suspend() {
    return this.changeTerminal("suspend");
  }
  resume() {
    return this.changeTerminal("resume");
  }
  render(force, frame) {
    this.checkOpen();
    const result = this.lib.sceneFrameCommit(this.context, this.session, frame, force);
    if (result === 1 /* Pending */)
      this.schedule();
    return result;
  }
  renderSplit(frame, commits, pinnedRenderOffset, force) {
    this.checkOpen();
    const result = this.lib.sessionRenderSplit(this.context, this.session, frame, commits, pinnedRenderOffset, force);
    if (result.status === 1 /* Pending */)
      this.schedule();
    return result;
  }
  setScreen(alternate, width, height, trailingOutput) {
    this.checkOpen();
    this.lib.sessionSetScreen(this.context, this.session, alternate, width, height, trailingOutput);
    this.schedule();
  }
  whenPresented() {
    this.checkOpen();
    if (this.presentationWait)
      return this.presentationWait.promise;
    if (!this.lib.sessionGetRendererState(this.context, this.session).framePending)
      return Promise.resolve();
    const wait = this.presentationWait = completion();
    this.schedule();
    return wait.promise;
  }
  resize(width, height) {
    this.checkOpen();
    this.lib.sessionResizeRenderer(this.context, this.session, width, height);
  }
  control(command) {
    this.checkOpen();
    this.lib.sessionControl(this.context, this.session, command);
    this.schedule();
  }
  writeClipboard(target, bytes) {
    this.checkOpen();
    const accepted = this.lib.sessionClipboard(this.context, this.session, target, bytes);
    if (accepted)
      this.schedule();
    return accepted;
  }
  triggerNotification(message, title) {
    this.checkOpen();
    const accepted = this.lib.sessionNotification(this.context, this.session, message, title);
    if (accepted)
      this.schedule();
    return accepted;
  }
  setProgramStatus(status) {
    this.checkOpen();
    try {
      this.lib.sessionControl(this.context, this.session, { kind: "program-status", status });
    } catch (error) {
      if (error instanceof NativeError && (error.status === -19 /* InvalidPhase */ || error.status === -11 /* OutputBackpressure */)) {
        return false;
      }
      throw error;
    }
    this.schedule();
    return true;
  }
  setKittyImageTransport(mode) {
    this.checkOpen();
    this.lib.sessionSetKittyImageTransport(this.context, this.session, mode);
    this.schedule();
  }
  getKittyImageTransport() {
    this.checkOpen();
    return this.lib.sessionGetKittyImageTransport(this.context, this.session);
  }
  pollKittyImageTransport() {
    this.checkOpen();
    return this.lib.sessionPollKittyImageTransport(this.context, this.session, this.scheduler.now());
  }
  cancelKittyImageTransport(failed) {
    this.checkOpen();
    this.lib.sessionCancelKittyImageTransport(this.context, this.session, failed);
  }
  processKittyImageReply(bytes) {
    this.checkOpen();
    return this.lib.sessionProcessKittyImageReply(this.context, this.session, bytes);
  }
  startKittyFileProbe() {
    this.checkOpen();
    this.lib.sessionStartKittyFileProbe(this.context, this.session);
    this.schedule();
  }
  getCapabilities() {
    this.checkOpen();
    return this.lib.sessionGetCapabilities(this.context, this.session);
  }
  write(bytes) {
    this.checkOpen();
    try {
      this.lib.sessionWrite(this.context, this.session, bytes);
    } catch (error) {
      if (error instanceof NativeError && error.status === -11 /* OutputBackpressure */)
        return false;
      throw error;
    }
    this.schedule();
    return true;
  }
  idle() {
    this.lib.getYogaHost().assertMutable();
    if (this.stopped)
      return this.closed;
    if (this.idleWait)
      return this.idleWait.promise;
    const wait = this.idleWait = completion();
    this.schedule();
    return wait.promise;
  }
  close() {
    this.lib.getYogaHost().assertMutable();
    if (this.stopped || this.closeRequested)
      return this.closed;
    try {
      this.closeRequested = true;
      this.closeDeadlineNs ??= this.scheduler.now() + this.closeTimeoutNs;
      if (this.transition) {
        this.closeInterruption = new Error("NativeSession terminal transition interrupted by close");
        this.transition.wait.reject(this.closeInterruption);
        this.transition = null;
      }
      if (this._error)
        throw this._error;
      this.lib.sessionClose(this.context, this.session);
      if (this.lib.sessionGetState(this.context, this.session) === 2 /* Closed */)
        this.finish(null);
      else
        this.schedule();
    } catch (error) {
      this.finish(asError(error));
    }
    return this.closed;
  }
  armCloseTimeout() {
    this.checkOpen();
    this.closeDeadlineNs ??= this.scheduler.now() + this.closeTimeoutNs;
    this.schedule();
  }
  isCloseInterruption(error) {
    return this.closeInterruption !== null && error === this.closeInterruption;
  }
  dispose() {
    this.lib.getYogaHost().assertMutable();
    this.finish(this._error ?? new Error("NativeSession disposed without graceful close"));
  }
  restoreOnExit() {
    if (this._disposed || this.finishing)
      return false;
    this.exiting = true;
    try {
      if (this.sink !== process.stdout || process.stdout.fd !== 1 || this.sink.writableLength !== 0 || this.sink.writableCorked !== 0 || this._error || this.sink.destroyed || this.sink.errored || !this.sink.writable || this.sink.writableEnded)
        return false;
      if (this.output) {
        if (!this.output.completed || this.output.failed)
          return false;
        if (this.output.ticket)
          this.lib.sessionCompleteOutput(this.context, this.session, this.output.ticket, true);
        this.output = null;
      }
      for (;; ) {
        const status = this.lib.sessionPumpExit(this.context, this.session);
        if (status === 4 /* Closed */)
          return true;
        if (status === 1 /* Again */)
          continue;
        if (status !== 2 /* OutputPending */)
          throw new Error("Unexpected native exit pump status");
        if (this.lib.sessionDrainStdout(this.context, this.session) === 0)
          return false;
      }
    } catch (error) {
      this._error ??= asError(error);
      return false;
    }
  }
  checkOpen() {
    this.lib.getYogaHost().assertMutable();
    if (this._error)
      throw this._error;
    if (this.stopped || this.closeRequested)
      throw new Error("NativeSession is closing or disposed");
    this.owner?.checkOpen();
  }
  changeTerminal(kind, options) {
    this.checkOpen();
    if (this.transition) {
      if (this.transition.kind === kind)
        return this.transition.wait.promise;
      throw new Error("NativeSession terminal transition is pending");
    }
    switch (kind) {
      case "setup":
        this.lib.sessionSetupTerminal(this.context, this.session, options);
        break;
      case "suspend":
        this.lib.sessionSuspend(this.context, this.session);
        break;
      case "resume":
        this.lib.sessionResume(this.context, this.session);
        break;
    }
    const wait = completion();
    this.transition = { kind, wait };
    this.schedule();
    return wait.promise;
  }
  onError = (error) => {
    this.sinkErrorSeen = true;
    if (!this.stopped)
      this._error ??= asError(error);
    this.schedule();
  };
  onClose = () => {
    this.output = null;
    if (this.stopped)
      this.detach();
    else {
      this._error ??= new Error("NativeSession sink closed before graceful close");
      this.schedule();
    }
  };
  onFinish = () => {
    if (!this.stopped)
      this._error ??= new Error("NativeSession sink finished before graceful close");
    this.schedule();
  };
  onDrain = () => {
    if (this.stopped)
      return;
    this.blocked = false;
    this.schedule();
  };
  schedule(deadlineNs = null) {
    if (this.exiting) {
      if (this.stopped && this.canDetach())
        this.detach();
      return;
    }
    if (this.stopped && (this.detached || !this.canDetach()))
      return;
    const previous = this.scheduled;
    if (previous && (previous.deadlineNs === null || deadlineNs !== null && previous.deadlineNs <= deadlineNs)) {
      return;
    }
    const task = { deadlineNs, cancel: () => {} };
    try {
      previous?.cancel();
      this.scheduled = task;
      let delayMs;
      if (deadlineNs !== null) {
        const remaining = deadlineNs - this.scheduler.now();
        delayMs = Math.min(Number(((remaining > 0n ? remaining : 0n) + 999999n) / 1000000n), 2147483647);
      }
      task.cancel = this.scheduler.schedule(() => {
        if (this.scheduled !== task)
          return;
        this.scheduled = null;
        if (this.stopped) {
          if (this.canDetach())
            this.detach();
        } else
          this.turn();
      }, delayMs);
    } catch (error) {
      if (this.stopped) {
        if (this.canDetach())
          this.detach();
      } else
        this.finish(asError(error));
    }
  }
  turn() {
    let deadlineNs = null;
    try {
      if (this._error)
        throw this._error;
      const now = this.scheduler.now();
      const expired = this.closeDeadlineNs !== null && now >= this.closeDeadlineNs;
      if (this.output?.completed) {
        if (this.output.ticket)
          this.lib.sessionCompleteOutput(this.context, this.session, this.output.ticket, true);
        this.output = null;
        this.completePresentation();
      }
      const result = this.output ? null : this.lib.sessionPump(this.context, this.session, now, 1);
      if (expired && result?.status !== 4 /* Closed */) {
        throw new Error("NativeSession graceful close timed out; output cancelled without restoration");
      }
      if (!result)
        return;
      switch (result.status) {
        case 0 /* Idle */:
          if (this.transition) {
            const phase = this.transition.kind === "suspend" ? 4 /* Suspended */ : 2 /* Active */;
            if (this.lib.sessionGetTerminalState(this.context, this.session) !== phase) {
              throw new Error("NativeSession terminal transition did not complete");
            }
            this.transition.wait.resolve();
            this.transition = null;
          }
          if (!this.blocked) {
            this.idleWait?.resolve();
            this.idleWait = null;
          }
          break;
        case 1 /* Again */:
          this.schedule();
          break;
        case 2 /* OutputPending */:
          if (!this.blocked)
            this.writeOutput();
          break;
        case 3 /* WaitUntil */:
          deadlineNs = result.deadlineNs;
          break;
        case 4 /* Closed */:
          this.finish(null);
          break;
      }
    } catch (error) {
      this.finish(asError(error));
    } finally {
      if (this.closeDeadlineNs !== null && (deadlineNs === null || this.closeDeadlineNs < deadlineNs)) {
        deadlineNs = this.closeDeadlineNs;
      }
      if (deadlineNs !== null)
        this.schedule(deadlineNs);
    }
  }
  writeOutput() {
    if (this.buffer === null) {
      if (this.sink.writableLength > 0 || this.sink.writableCorked > 0) {
        this.writeSink(emptyOutput, null);
        return;
      }
      try {
        const written = this.lib.sessionDrainStdout(this.context, this.session);
        this.completePresentation();
        this.schedule(written === 0 ? this.scheduler.now() + 1000000n : null);
        return;
      } catch (error) {
        if (!(error instanceof NativeError) || error.status !== -24 /* UnsupportedResource */)
          throw error;
        this.buffer = new Uint8Array(this.outputBufferSize);
      }
    }
    const ticket = this.lib.sessionReadOutput(this.context, this.session, this.buffer);
    if (!ticket)
      throw new Error("NativeSession output pending without bytes");
    if (ticket.byteCount > this.buffer.length)
      throw new Error("NativeSession output ticket exceeds its buffer");
    this.writeSink(this.buffer.subarray(0, ticket.byteCount), ticket);
  }
  writeSink(bytes, ticket) {
    if (this.output)
      throw new Error("NativeSession output is already in flight");
    const output = { ticket, completed: false, failed: false };
    this.output = output;
    this.blocked = true;
    try {
      const ready = this.sinkWrite.call(this.sink, bytes, "utf8", (error) => {
        if (this.output !== output || output.completed)
          return;
        output.completed = true;
        output.failed = error != null;
        if (error && !this.stopped)
          this._error ??= asError(error);
        this.schedule();
      });
      if (!this.stopped && ready)
        this.blocked = false;
    } catch (error) {
      this.output = null;
      if (this.stopped)
        this.detach();
      throw error;
    }
  }
  completePresentation() {
    if (this.presentationWait && !this.lib.sessionGetRendererState(this.context, this.session).framePending) {
      this.presentationWait.resolve();
      this.presentationWait = null;
    }
  }
  detach() {
    this.detached = true;
    this.output = null;
    for (const [event, listener] of [
      ["error", this.onError],
      ["close", this.onClose],
      ["finish", this.onFinish],
      ["drain", this.onDrain]
    ]) {
      try {
        this.sink.off(event, listener);
      } catch (error) {
        this._error ??= asError(error);
      }
    }
  }
  canDetach() {
    if (this.output && !this.output.completed)
      return false;
    return this.sink.closed || this.sinkErrorSeen || !this.output?.failed && !this.sink.destroyed;
  }
  finish(error) {
    if (this.finishing)
      return;
    if (this._disposed) {
      this.schedule();
      return;
    }
    this.finishing = true;
    try {
      this.stopped = true;
      this._error ??= error;
      const scheduled = this.scheduled;
      this.scheduled = null;
      try {
        scheduled?.cancel();
      } catch (error2) {
        this._error ??= asError(error2);
      }
      if (this._error) {
        try {
          this.lib.sessionCancel(this.context, this.session);
        } catch (error2) {
          this._error ??= asError(error2);
        }
      }
      for (const child of this.detachedSessions) {
        try {
          child.dispose();
          if (!child.disposed)
            this._error ??= child.error;
        } catch (error2) {
          this._error ??= asError(error2);
        }
      }
      if (this.detachedSessions.size === 0) {
        try {
          this.attachmentCleanup?.();
        } catch (error2) {
          this._error ??= asError(error2);
          try {
            this.lib.sessionCancel(this.context, this.session);
          } catch (error3) {
            this._error ??= asError(error3);
          }
        }
        try {
          this.lib.getYogaHost().runMutation(() => {
            if (!this.resourceContext.disposed) {
              if (this.owner)
                this.lib.destroySession(this.context, this.session);
              else
                this.resourceContext.destroy();
            }
            this._disposed = true;
            this.owner?.detachedSessions.delete(this);
          });
        } catch (error2) {
          this._error ??= asError(error2);
        }
      }
      if (!this.output && !this.sink.destroyed && !this.sink.writableFinished && !this.sink.errored)
        this.detach();
      else
        this.schedule();
      if (!this._disposed && !this._error)
        return;
      for (const wait of [this.closeWait, this.idleWait, this.presentationWait, this.transition?.wait]) {
        if (this._error)
          wait?.reject(this._error);
        else
          wait?.resolve();
      }
      this.idleWait = null;
      this.presentationWait = null;
      this.transition = null;
    } finally {
      try {
        if ((this._disposed || this._error) && this.owner?.stopped && !this.owner.finishing) {
          this.owner.finish(this._disposed ? this.owner.error : this._error);
        }
      } finally {
        this.finishing = false;
      }
    }
  }
}

// src/console.ts
import { EventEmitter as EventEmitter3 } from "events";
import { Console } from "console";
import fs from "fs";
import path from "path";
import util from "util";

// src/lib/output.capture.ts
import { Writable as Writable2 } from "stream";
import { EventEmitter as EventEmitter2 } from "events";

class Capture extends EventEmitter2 {
  output = [];
  constructor() {
    super();
  }
  get size() {
    return this.output.length;
  }
  write(stream, data) {
    this.output.push({ stream, output: data });
    this.emit("write", stream, data);
  }
  claimOutput() {
    const output = this.output.map((o) => o.output).join("");
    this.clear();
    return output;
  }
  clear() {
    this.output = [];
  }
}

class CapturedWritableStream extends Writable2 {
  stream;
  capture;
  isTTY = true;
  columns = process.stdout.columns || 80;
  rows = process.stdout.rows || 24;
  constructor(stream, capture) {
    super();
    this.stream = stream;
    this.capture = capture;
  }
  _write(chunk, encoding, callback) {
    const data = chunk.toString();
    this.capture.write(this.stream, data);
    callback();
  }
  getColorDepth() {
    return process.stdout.getColorDepth?.() || 8;
  }
}

// src/lib/keybinding.internal.ts
var defaultKeyAliases = {
  enter: "return",
  esc: "escape",
  kp0: "0",
  kp1: "1",
  kp2: "2",
  kp3: "3",
  kp4: "4",
  kp5: "5",
  kp6: "6",
  kp7: "7",
  kp8: "8",
  kp9: "9",
  kpdecimal: ".",
  kpdivide: "/",
  kpmultiply: "*",
  kpminus: "-",
  kpplus: "+",
  kpenter: "enter",
  kpequal: "=",
  kpseparator: ",",
  kpleft: "left",
  kpright: "right",
  kpup: "up",
  kpdown: "down",
  kppageup: "pageup",
  kppagedown: "pagedown",
  kphome: "home",
  kpend: "end",
  kpinsert: "insert",
  kpdelete: "delete"
};
function mergeKeyAliases(defaults, custom) {
  return { ...defaults, ...custom };
}
function mergeKeyBindings(defaults, custom) {
  const map = new Map;
  for (const binding of defaults) {
    const key = getKeyBindingKey(binding);
    map.set(key, binding);
  }
  for (const binding of custom) {
    const key = getKeyBindingKey(binding);
    map.set(key, binding);
  }
  return Array.from(map.values());
}
function getKeyBindingKey(binding) {
  return `${binding.name}:${binding.ctrl ? 1 : 0}:${binding.shift ? 1 : 0}:${binding.meta ? 1 : 0}:${binding.super ? 1 : 0}`;
}
function getBaseCodeKeyName({ name: typedName, baseCode }) {
  if (baseCode === undefined || baseCode <= 32 || baseCode === 127) {
    return;
  }
  if (!/^[^\x00-\x7f]$/u.test(typedName) && (baseCode < 48 || baseCode > 57)) {
    return;
  }
  try {
    const name = String.fromCodePoint(baseCode);
    if (name.length === 1 && name >= "A" && name <= "Z") {
      return name.toLowerCase();
    }
    return name;
  } catch {
    return;
  }
}
function getKeyBindingKeys(binding) {
  const names = new Set([binding.name]);
  const baseCodeName = getBaseCodeKeyName(binding);
  if (baseCodeName) {
    names.add(baseCodeName);
  }
  return [...names].map((name) => getKeyBindingKey({ ...binding, name }));
}
function getKeyBindingAction(map, binding) {
  for (const key of getKeyBindingKeys(binding)) {
    const action = map.get(key);
    if (action !== undefined) {
      return action;
    }
  }
  return;
}
function matchesKeyBinding(binding, match) {
  const matchKey = getKeyBindingKey(match);
  return getKeyBindingKeys(binding).includes(matchKey);
}
function buildKeyBindingsMap(bindings, aliasMap) {
  const map = new Map;
  const aliases = aliasMap || {};
  for (const binding of bindings) {
    const key = getKeyBindingKey(binding);
    map.set(key, binding.action);
  }
  for (const binding of bindings) {
    const normalizedName = aliases[binding.name] || binding.name;
    if (normalizedName !== binding.name) {
      const aliasedKey = getKeyBindingKey({ ...binding, name: normalizedName });
      map.set(aliasedKey, binding.action);
    }
  }
  return map;
}
function keyBindingToString(binding) {
  const parts = [];
  if (binding.ctrl)
    parts.push("ctrl");
  if (binding.shift)
    parts.push("shift");
  if (binding.meta)
    parts.push("meta");
  if (binding.super)
    parts.push("super");
  parts.push(binding.name);
  return parts.join("+");
}

// src/console.ts
function getCallerInfo() {
  const err = new Error;
  const stackLines = err.stack?.split(`
`).slice(5) || [];
  if (!stackLines.length)
    return null;
  const callerLine = stackLines[0].trim();
  const regex = /at\s+(?:([\w$.<>]+)\s+\()?((?:\/|[A-Za-z]:\\)[^:]+):(\d+):(\d+)\)?/;
  const match = callerLine.match(regex);
  if (!match)
    return null;
  const functionName = match[1] || "<anonymous>";
  const fullPath = match[2];
  const fileName = fullPath.split(/[\\/]/).pop() || "<unknown>";
  const lineNumber = parseInt(match[3], 10) || 0;
  const columnNumber = parseInt(match[4], 10) || 0;
  return { functionName, fullPath, fileName, lineNumber, columnNumber };
}
var capture = singleton("ConsoleCapture", () => new Capture);
registerEnvVar({
  name: "OTUI_USE_CONSOLE",
  description: "Whether to use the console. Will not capture console output if set to false.",
  type: "boolean",
  default: true
});
registerEnvVar({
  name: "SHOW_CONSOLE",
  description: "Show the console at startup if set to true.",
  type: "boolean",
  default: false
});

class TerminalConsoleCache extends EventEmitter3 {
  _cachedLogs = [];
  MAX_CACHE_SIZE = 1000;
  _collectCallerInfo = false;
  _cachingEnabled = true;
  _originalConsole = null;
  get cachedLogs() {
    return this._cachedLogs;
  }
  constructor() {
    super();
  }
  activate() {
    if (!env.OTUI_USE_CONSOLE)
      return;
    if (!this._originalConsole) {
      this._originalConsole = global.console;
    }
    this.setupConsoleCapture();
    this.overrideConsoleMethods();
  }
  setupConsoleCapture() {
    if (!env.OTUI_USE_CONSOLE)
      return;
    const mockStdout = new CapturedWritableStream("stdout", capture);
    const mockStderr = new CapturedWritableStream("stderr", capture);
    global.console = new Console({
      stdout: mockStdout,
      stderr: mockStderr,
      colorMode: true,
      inspectOptions: {
        compact: false,
        breakLength: 80,
        depth: 2
      }
    });
  }
  overrideConsoleMethods() {
    console.log = (...args) => {
      this.appendToConsole("LOG" /* LOG */, ...args);
    };
    console.info = (...args) => {
      this.appendToConsole("INFO" /* INFO */, ...args);
    };
    console.warn = (...args) => {
      this.appendToConsole("WARN" /* WARN */, ...args);
    };
    console.error = (...args) => {
      this.appendToConsole("ERROR" /* ERROR */, ...args);
    };
    console.debug = (...args) => {
      this.appendToConsole("DEBUG" /* DEBUG */, ...args);
    };
    if (typeof console.timeStamp !== "function") {
      console.timeStamp = () => {};
    }
  }
  setCollectCallerInfo(enabled) {
    this._collectCallerInfo = enabled;
  }
  clearConsole() {
    this._cachedLogs = [];
  }
  setCachingEnabled(enabled) {
    this._cachingEnabled = enabled;
  }
  deactivate() {
    this.restoreOriginalConsole();
  }
  restoreOriginalConsole() {
    if (this._originalConsole) {
      global.console = this._originalConsole;
    }
  }
  addLogEntry(level, ...args) {
    const callerInfo = this._collectCallerInfo ? getCallerInfo() : null;
    const logEntry = [new Date, level, args, callerInfo];
    if (this._cachingEnabled) {
      if (this._cachedLogs.length >= this.MAX_CACHE_SIZE) {
        this._cachedLogs.shift();
      }
      this._cachedLogs.push(logEntry);
    }
    return logEntry;
  }
  appendToConsole(level, ...args) {
    if (this._cachedLogs.length >= this.MAX_CACHE_SIZE) {
      this._cachedLogs.shift();
    }
    const entry = this.addLogEntry(level, ...args);
    this.emit("entry", entry);
  }
  destroy() {
    this.deactivate();
  }
}
var terminalConsoleCache = singleton("TerminalConsoleCache", () => {
  const terminalConsoleCache2 = new TerminalConsoleCache;
  process.on("exit", () => {
    terminalConsoleCache2.destroy();
  });
  return terminalConsoleCache2;
});
var ConsolePosition;
((ConsolePosition2) => {
  ConsolePosition2["TOP"] = "top";
  ConsolePosition2["BOTTOM"] = "bottom";
  ConsolePosition2["LEFT"] = "left";
  ConsolePosition2["RIGHT"] = "right";
})(ConsolePosition ||= {});
var defaultConsoleKeybindings = [
  { name: "up", action: "scroll-up" },
  { name: "down", action: "scroll-down" },
  { name: "up", shift: true, action: "scroll-to-top" },
  { name: "down", shift: true, action: "scroll-to-bottom" },
  { name: "p", ctrl: true, action: "position-previous" },
  { name: "o", ctrl: true, action: "position-next" },
  { name: "+", action: "size-increase" },
  { name: "=", shift: true, action: "size-increase" },
  { name: "-", action: "size-decrease" },
  { name: "s", ctrl: true, action: "save-logs" },
  { name: "c", ctrl: true, shift: true, action: "copy-selection" }
];
var DEFAULT_CONSOLE_OPTIONS = {
  position: "bottom" /* BOTTOM */,
  sizePercent: 30,
  zIndex: Infinity,
  colorInfo: "#00FFFF",
  colorWarn: "#FFFF00",
  colorError: "#FF0000",
  colorDebug: "#808080",
  colorDefault: "#FFFFFF",
  backgroundColor: RGBA.fromValues(0.1, 0.1, 0.1, 0.7),
  startInDebugMode: false,
  title: "Console",
  titleBarColor: RGBA.fromValues(0.05, 0.05, 0.05, 0.7),
  titleBarTextColor: "#FFFFFF",
  cursorColor: "#00A0FF",
  maxStoredLogs: 2000,
  maxDisplayLines: 3000,
  onCopySelection: undefined,
  keyBindings: undefined,
  keyAliasMap: undefined,
  selectionColor: RGBA.fromValues(0.3, 0.5, 0.8, 0.5),
  copyButtonColor: "#00A0FF"
};
var INDENT_WIDTH = 2;
var graphemeSegmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
function wrapDisplayCells(text, firstCells, restCells) {
  const segments = [];
  let segment = "";
  let cells = 0;
  for (const { segment: grapheme } of graphemeSegmenter.segment(text)) {
    const width = stringWidth(grapheme);
    const budget = segments.length === 0 ? firstCells : restCells;
    if (segment.length > 0 && cells + width > budget) {
      segments.push(segment);
      segment = "";
      cells = 0;
    }
    segment += grapheme;
    cells += width;
  }
  if (segment.length > 0)
    segments.push(segment);
  return segments;
}

class TerminalConsole extends EventEmitter3 {
  isVisible = false;
  isFocused = false;
  renderer;
  keyHandler;
  options;
  _debugModeEnabled = false;
  frameBuffer = null;
  consoleX = 0;
  consoleY = 0;
  consoleWidth = 0;
  consoleHeight = 0;
  scrollTopIndex = 0;
  isScrolledToBottom = true;
  currentLineIndex = 0;
  _displayLines = [];
  _allLogEntries = [];
  _needsFrameBufferUpdate = false;
  _entryListener;
  _selectionStart = null;
  _selectionEnd = null;
  _isDragging = false;
  _copyButtonBounds = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  };
  _autoScrollInterval = null;
  clock;
  _keyBindingsMap;
  _keyAliasMap;
  _keyBindings;
  _mergedKeyBindings;
  _actionHandlers;
  markNeedsRerender() {
    this._needsFrameBufferUpdate = true;
    this.renderer.requestRender();
  }
  getCopyButtonLabel() {
    const copyBindings = this._mergedKeyBindings.filter((b) => b.action === "copy-selection");
    const copyBinding = copyBindings[copyBindings.length - 1];
    if (copyBinding) {
      const shortcut = keyBindingToString(copyBinding);
      return `[Copy (${shortcut})]`;
    }
    return "[Copy]";
  }
  _rgbaInfo;
  _rgbaWarn;
  _rgbaError;
  _rgbaDebug;
  _rgbaDefault;
  backgroundColor;
  _rgbaTitleBar;
  _rgbaTitleBarText;
  _title;
  _rgbaCursor;
  _rgbaSelection;
  _rgbaCopyButton;
  _positions = [
    "top" /* TOP */,
    "right" /* RIGHT */,
    "bottom" /* BOTTOM */,
    "left" /* LEFT */
  ];
  constructor(renderer, options = {}) {
    super();
    this.renderer = renderer;
    this.clock = options.clock ?? new SystemClock;
    this.options = { ...DEFAULT_CONSOLE_OPTIONS, ...options };
    this.keyHandler = this.handleKeyPress.bind(this);
    this._debugModeEnabled = this.options.startInDebugMode;
    terminalConsoleCache.setCollectCallerInfo(this._debugModeEnabled);
    this._rgbaInfo = RGBA.clone(parseColor(this.options.colorInfo));
    this._rgbaWarn = RGBA.clone(parseColor(this.options.colorWarn));
    this._rgbaError = RGBA.clone(parseColor(this.options.colorError));
    this._rgbaDebug = RGBA.clone(parseColor(this.options.colorDebug));
    this._rgbaDefault = RGBA.clone(parseColor(this.options.colorDefault));
    this.backgroundColor = RGBA.clone(parseColor(this.options.backgroundColor));
    this._rgbaTitleBar = RGBA.clone(parseColor(this.options.titleBarColor));
    this._rgbaTitleBarText = RGBA.clone(parseColor(this.options.titleBarTextColor || this.options.colorDefault));
    this._title = this.options.title;
    this._rgbaCursor = RGBA.clone(parseColor(this.options.cursorColor));
    this._rgbaSelection = RGBA.clone(parseColor(this.options.selectionColor));
    this._rgbaCopyButton = RGBA.clone(parseColor(this.options.copyButtonColor));
    this._keyAliasMap = mergeKeyAliases(defaultKeyAliases, options.keyAliasMap || {});
    this._keyBindings = options.keyBindings || [];
    this._mergedKeyBindings = mergeKeyBindings(defaultConsoleKeybindings, this._keyBindings);
    this._keyBindingsMap = buildKeyBindingsMap(this._mergedKeyBindings, this._keyAliasMap);
    this._actionHandlers = this.buildActionHandlers();
    this._updateConsoleDimensions();
    this._scrollToBottom(true);
    this._entryListener = (logEntry) => {
      this._handleNewLog(logEntry);
    };
    terminalConsoleCache.on("entry", this._entryListener);
    if (env.SHOW_CONSOLE) {
      this.show();
    }
  }
  buildActionHandlers() {
    return new Map([
      ["scroll-up", () => this.scrollUp()],
      ["scroll-down", () => this.scrollDown()],
      ["scroll-to-top", () => this.scrollToTop()],
      ["scroll-to-bottom", () => this.scrollToBottomAction()],
      ["position-previous", () => this.positionPrevious()],
      ["position-next", () => this.positionNext()],
      ["size-increase", () => this.sizeIncrease()],
      ["size-decrease", () => this.sizeDecrease()],
      ["save-logs", () => this.saveLogsAction()],
      ["copy-selection", () => this.triggerCopyAction()]
    ]);
  }
  activate() {
    terminalConsoleCache.activate();
  }
  deactivate() {
    terminalConsoleCache.deactivate();
  }
  _handleNewLog(logEntry) {
    if (!this.isVisible)
      return;
    this._allLogEntries.push(logEntry);
    if (this._allLogEntries.length > this.options.maxStoredLogs) {
      this._allLogEntries.splice(0, this._allLogEntries.length - this.options.maxStoredLogs);
    }
    const newDisplayLines = this._processLogEntry(logEntry);
    this._displayLines.push(...newDisplayLines);
    if (this._displayLines.length > this.options.maxDisplayLines) {
      this._displayLines.splice(0, this._displayLines.length - this.options.maxDisplayLines);
      const linesRemoved = this._displayLines.length - this.options.maxDisplayLines;
      this.scrollTopIndex = Math.max(0, this.scrollTopIndex - linesRemoved);
    }
    if (this.isScrolledToBottom) {
      this._scrollToBottom();
    }
    this.markNeedsRerender();
  }
  _updateConsoleDimensions(termWidth, termHeight) {
    const width = termWidth ?? this.renderer.width;
    const height = termHeight ?? this.renderer.height;
    const sizePercent = this.options.sizePercent / 100;
    switch (this.options.position) {
      case "top" /* TOP */:
        this.consoleX = 0;
        this.consoleY = 0;
        this.consoleWidth = width;
        this.consoleHeight = Math.max(1, Math.floor(height * sizePercent));
        break;
      case "bottom" /* BOTTOM */:
        this.consoleHeight = Math.max(1, Math.floor(height * sizePercent));
        this.consoleWidth = width;
        this.consoleX = 0;
        this.consoleY = height - this.consoleHeight;
        break;
      case "left" /* LEFT */:
        this.consoleWidth = Math.max(1, Math.floor(width * sizePercent));
        this.consoleHeight = height;
        this.consoleX = 0;
        this.consoleY = 0;
        break;
      case "right" /* RIGHT */:
        this.consoleWidth = Math.max(1, Math.floor(width * sizePercent));
        this.consoleHeight = height;
        this.consoleY = 0;
        this.consoleX = width - this.consoleWidth;
        break;
    }
    this.currentLineIndex = Math.max(0, Math.min(this.currentLineIndex, this.consoleHeight - 1));
  }
  handleKeyPress(event) {
    if (event.name === "escape") {
      this.blur();
      return;
    }
    const action = getKeyBindingAction(this._keyBindingsMap, event);
    if (action) {
      const handler = this._actionHandlers.get(action);
      if (handler) {
        handler();
        return;
      }
    }
  }
  scrollUp() {
    const logAreaHeight = Math.max(1, this.consoleHeight - 1);
    if (this.currentLineIndex > 0) {
      this.currentLineIndex--;
      this.markNeedsRerender();
    } else if (this.scrollTopIndex > 0) {
      this.scrollTopIndex--;
      this.isScrolledToBottom = false;
      this.markNeedsRerender();
    }
    return true;
  }
  scrollDown() {
    const displayLineCount = this._displayLines.length;
    const logAreaHeight = Math.max(1, this.consoleHeight - 1);
    const maxScrollTop = Math.max(0, displayLineCount - logAreaHeight);
    const canCursorMoveDown = this.currentLineIndex < logAreaHeight - 1 && this.scrollTopIndex + this.currentLineIndex < displayLineCount - 1;
    if (canCursorMoveDown) {
      this.currentLineIndex++;
      this.markNeedsRerender();
    } else if (this.scrollTopIndex < maxScrollTop) {
      this.scrollTopIndex++;
      this.isScrolledToBottom = this.scrollTopIndex === maxScrollTop;
      this.markNeedsRerender();
    }
    return true;
  }
  scrollToTop() {
    if (this.scrollTopIndex > 0 || this.currentLineIndex > 0) {
      this.scrollTopIndex = 0;
      this.currentLineIndex = 0;
      this.isScrolledToBottom = this._displayLines.length <= Math.max(1, this.consoleHeight - 1);
      this.markNeedsRerender();
    }
    return true;
  }
  scrollToBottomAction() {
    const logAreaHeightForScroll = Math.max(1, this.consoleHeight - 1);
    const maxScrollPossible = Math.max(0, this._displayLines.length - logAreaHeightForScroll);
    if (this.scrollTopIndex < maxScrollPossible || !this.isScrolledToBottom) {
      this._scrollToBottom(true);
      this.markNeedsRerender();
    }
    return true;
  }
  positionPrevious() {
    const currentPositionIndex = this._positions.indexOf(this.options.position);
    const prevIndex = (currentPositionIndex - 1 + this._positions.length) % this._positions.length;
    this.options.position = this._positions[prevIndex];
    this.resize(this.renderer.width, this.renderer.height);
    return true;
  }
  positionNext() {
    const currentPositionIndex = this._positions.indexOf(this.options.position);
    const nextIndex = (currentPositionIndex + 1) % this._positions.length;
    this.options.position = this._positions[nextIndex];
    this.resize(this.renderer.width, this.renderer.height);
    return true;
  }
  sizeIncrease() {
    this.options.sizePercent = Math.min(100, this.options.sizePercent + 5);
    this.resize(this.renderer.width, this.renderer.height);
    return true;
  }
  sizeDecrease() {
    this.options.sizePercent = Math.max(10, this.options.sizePercent - 5);
    this.resize(this.renderer.width, this.renderer.height);
    return true;
  }
  saveLogsAction() {
    this.saveLogsToFile();
    return true;
  }
  triggerCopyAction() {
    this.triggerCopy();
    return true;
  }
  attachStdin() {
    if (this.isFocused)
      return;
    this.renderer.keyInput.on("keypress", this.keyHandler);
    this.isFocused = true;
  }
  detachStdin() {
    if (!this.isFocused)
      return;
    this.renderer.keyInput.off("keypress", this.keyHandler);
    this.isFocused = false;
  }
  formatTimestamp(date) {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    }).format(date);
  }
  formatArguments(args) {
    return args.map((arg) => {
      if (arg instanceof Error) {
        const errorProps = arg;
        return `Error: ${errorProps.message}
` + (errorProps.stack ? `${errorProps.stack}
` : "");
      }
      try {
        return util.inspect(arg, { depth: 2 });
      } catch (e) {
        return String(arg);
      }
    }).join(" ").replace(/\r\n/g, `
`).replace(/[\x00-\x08\x0b-\x1f\x7f-\x9f]/g, (control) => `\\x${control.charCodeAt(0).toString(16).padStart(2, "0")}`);
  }
  resize(width, height) {
    this._updateConsoleDimensions(width, height);
    if (this.frameBuffer) {
      this.frameBuffer.resize(this.consoleWidth, this.consoleHeight);
      const displayLineCount = this._displayLines.length;
      const logAreaHeight = Math.max(1, this.consoleHeight - 1);
      const maxScrollTop = Math.max(0, displayLineCount - logAreaHeight);
      this.scrollTopIndex = Math.min(this.scrollTopIndex, maxScrollTop);
      this.isScrolledToBottom = this.scrollTopIndex === maxScrollTop;
      const visibleLineCount = Math.min(logAreaHeight, displayLineCount - this.scrollTopIndex);
      this.currentLineIndex = Math.max(0, Math.min(this.currentLineIndex, visibleLineCount - 1));
      if (this.isVisible) {
        this.markNeedsRerender();
      }
    }
  }
  clear() {
    terminalConsoleCache.clearConsole();
    this._allLogEntries = [];
    this._displayLines = [];
    this.markNeedsRerender();
  }
  toggle() {
    if (this.isVisible) {
      if (this.isFocused) {
        this.hide();
      } else {
        this.focus();
      }
    } else {
      this.show();
    }
    if (!this.renderer.isRunning) {
      this.renderer.requestRender();
    }
  }
  focus() {
    this.attachStdin();
    this._scrollToBottom(true);
    this.markNeedsRerender();
  }
  blur() {
    this.detachStdin();
    this.markNeedsRerender();
  }
  show() {
    if (this.renderer.isDestroyed)
      throw new Error("Cannot show the console after renderer destruction");
    if (!this.isVisible) {
      if (!this.frameBuffer) {
        this.frameBuffer = OptimizedBuffer.create(this.consoleWidth, this.consoleHeight, this.renderer.widthMethod, {
          respectAlpha: this.backgroundColor.a < 1,
          id: "console framebuffer",
          owner: this.renderer.nativeScene
        });
      }
      this.isVisible = true;
      this._processCachedLogs();
      terminalConsoleCache.setCachingEnabled(false);
      const logCount = terminalConsoleCache.cachedLogs.length;
      const visibleLogLines = Math.min(this.consoleHeight, logCount);
      this.currentLineIndex = Math.max(0, visibleLogLines - 1);
      this.scrollTopIndex = 0;
      this._scrollToBottom(true);
      this.focus();
      this.markNeedsRerender();
    }
  }
  hide() {
    if (this.isVisible) {
      this.stopAutoScroll();
      this.isVisible = false;
      this.blur();
      terminalConsoleCache.setCachingEnabled(true);
    }
  }
  destroy() {
    this.stopAutoScroll();
    this.hide();
    this.deactivate();
    terminalConsoleCache.off("entry", this._entryListener);
    this.frameBuffer?.destroy();
    this.frameBuffer = null;
  }
  getCachedLogs() {
    return terminalConsoleCache.cachedLogs.map((logEntry) => logEntry[0].toISOString() + " " + logEntry.slice(1).join(" ")).join(`
`);
  }
  updateFrameBuffer() {
    if (!this.frameBuffer)
      return;
    this.frameBuffer.clear(this.backgroundColor);
    const displayLines = this._displayLines;
    const displayLineCount = displayLines.length;
    const logAreaHeight = Math.max(1, this.consoleHeight - 1);
    this.frameBuffer.fillRect(0, 0, this.consoleWidth, 1, this._rgbaTitleBar);
    const dynamicTitle = `${this._title}${this.isFocused ? " (Focused)" : ""}`;
    const titleX = Math.max(0, Math.floor((this.consoleWidth - dynamicTitle.length) / 2));
    this.frameBuffer.drawText(dynamicTitle, titleX, 0, this._rgbaTitleBarText, this._rgbaTitleBar);
    const copyLabel = this.getCopyButtonLabel();
    const copyButtonX = this.consoleWidth - copyLabel.length - 1;
    if (copyButtonX >= 0) {
      const copyButtonEnabled = this.hasSelection();
      const disabledColor = RGBA.fromInts(100, 100, 100, 255);
      const copyColor = copyButtonEnabled ? this._rgbaCopyButton : disabledColor;
      this.frameBuffer.drawText(copyLabel, copyButtonX, 0, copyColor, this._rgbaTitleBar);
      this._copyButtonBounds = { x: copyButtonX, y: 0, width: copyLabel.length, height: 1 };
    } else {
      this._copyButtonBounds = { x: -1, y: -1, width: 0, height: 0 };
    }
    const startIndex = this.scrollTopIndex;
    const endIndex = Math.min(startIndex + logAreaHeight, displayLineCount);
    const visibleDisplayLines = displayLines.slice(startIndex, endIndex);
    let lineY = 1;
    for (let i = 0;i < visibleDisplayLines.length; i++) {
      if (lineY >= this.consoleHeight)
        break;
      const displayLine = visibleDisplayLines[i];
      const absoluteLineIndex = startIndex + i;
      let levelColor = this._rgbaDefault;
      switch (displayLine.level) {
        case "INFO" /* INFO */:
          levelColor = this._rgbaInfo;
          break;
        case "WARN" /* WARN */:
          levelColor = this._rgbaWarn;
          break;
        case "ERROR" /* ERROR */:
          levelColor = this._rgbaError;
          break;
        case "DEBUG" /* DEBUG */:
          levelColor = this._rgbaDebug;
          break;
      }
      const showCursor = this.isFocused && lineY - 1 === this.currentLineIndex;
      if (showCursor) {
        this.frameBuffer.drawText(">", 0, lineY, this._rgbaCursor, this.backgroundColor);
      } else {
        this.frameBuffer.drawText(" ", 0, lineY, this._rgbaDefault, this.backgroundColor);
      }
      const fullText = (displayLine.indent ? " ".repeat(INDENT_WIDTH) : "") + displayLine.text;
      const selectionRange = this.getLineSelectionRange(absoluteLineIndex);
      if (selectionRange) {
        const adjustedStart = Math.max(0, selectionRange.start);
        const adjustedEnd = Math.min(fullText.length, selectionRange.end);
        if (adjustedStart > 0) {
          this.frameBuffer.drawText(fullText.substring(0, adjustedStart), 1, lineY, levelColor);
        }
        if (adjustedStart < adjustedEnd) {
          this.frameBuffer.fillRect(1 + adjustedStart, lineY, adjustedEnd - adjustedStart, 1, this._rgbaSelection);
          this.frameBuffer.drawText(fullText.substring(adjustedStart, adjustedEnd), 1 + adjustedStart, lineY, levelColor, this._rgbaSelection);
        }
        if (adjustedEnd < fullText.length) {
          this.frameBuffer.drawText(fullText.substring(adjustedEnd), 1 + adjustedEnd, lineY, levelColor);
        }
      } else {
        this.frameBuffer.drawText(fullText, 1, lineY, levelColor);
      }
      lineY++;
    }
  }
  renderToBuffer(buffer) {
    if (!this.isVisible || !this.frameBuffer)
      return;
    if (this._needsFrameBufferUpdate) {
      this.updateFrameBuffer();
      this._needsFrameBufferUpdate = false;
    }
    buffer.drawFrameBuffer(this.consoleX, this.consoleY, this.frameBuffer);
  }
  setDebugMode(enabled) {
    this._debugModeEnabled = enabled;
    terminalConsoleCache.setCollectCallerInfo(enabled);
    if (this.isVisible) {
      this.markNeedsRerender();
    }
  }
  toggleDebugMode() {
    this.setDebugMode(!this._debugModeEnabled);
  }
  set keyBindings(bindings) {
    this._keyBindings = bindings;
    this._mergedKeyBindings = mergeKeyBindings(defaultConsoleKeybindings, bindings);
    this._keyBindingsMap = buildKeyBindingsMap(this._mergedKeyBindings, this._keyAliasMap);
    this.markNeedsRerender();
  }
  set keyAliasMap(aliases) {
    this._keyAliasMap = mergeKeyAliases(defaultKeyAliases, aliases);
    this._mergedKeyBindings = mergeKeyBindings(defaultConsoleKeybindings, this._keyBindings);
    this._keyBindingsMap = buildKeyBindingsMap(this._mergedKeyBindings, this._keyAliasMap);
    this.markNeedsRerender();
  }
  set onCopySelection(callback) {
    this.options.onCopySelection = callback;
  }
  get onCopySelection() {
    return this.options.onCopySelection;
  }
  _scrollToBottom(forceCursorToLastLine = false) {
    const displayLineCount = this._displayLines.length;
    const logAreaHeight = Math.max(1, this.consoleHeight - 1);
    const maxScrollTop = Math.max(0, displayLineCount - logAreaHeight);
    this.scrollTopIndex = maxScrollTop;
    this.isScrolledToBottom = true;
    const visibleLineCount = Math.min(logAreaHeight, displayLineCount - this.scrollTopIndex);
    if (forceCursorToLastLine || this.currentLineIndex >= visibleLineCount) {
      this.currentLineIndex = Math.max(0, visibleLineCount - 1);
    }
  }
  _processLogEntry(logEntry) {
    const [date, level, args, callerInfo] = logEntry;
    const displayLines = [];
    const timestamp = this.formatTimestamp(date);
    const callerSource = callerInfo ? `${callerInfo.fileName}:${callerInfo.lineNumber}` : "unknown";
    const prefix = `[${timestamp}] [${level}]` + (this._debugModeEnabled ? ` [${callerSource}]` : "") + " ";
    const formattedArgs = this.formatArguments(args);
    const initialLines = formattedArgs.split(`
`);
    const cells = Math.max(1, this.consoleWidth - 1);
    const indentedCells = Math.max(1, this.consoleWidth - 1 - INDENT_WIDTH);
    for (let i = 0;i < initialLines.length; i++) {
      const isFirstLineOfEntry = i === 0;
      const segments = isFirstLineOfEntry ? wrapDisplayCells(prefix + initialLines[i], cells, indentedCells) : wrapDisplayCells(initialLines[i], indentedCells, indentedCells);
      for (let segment = 0;segment < segments.length; segment++) {
        displayLines.push({ text: segments[segment], level, indent: !isFirstLineOfEntry || segment > 0 });
      }
    }
    return displayLines;
  }
  _processCachedLogs() {
    const logsToProcess = [...terminalConsoleCache.cachedLogs];
    terminalConsoleCache.clearConsole();
    this._allLogEntries.push(...logsToProcess);
    if (this._allLogEntries.length > this.options.maxStoredLogs) {
      this._allLogEntries.splice(0, this._allLogEntries.length - this.options.maxStoredLogs);
    }
    for (const logEntry of logsToProcess) {
      const processed = this._processLogEntry(logEntry);
      this._displayLines.push(...processed);
    }
    if (this._displayLines.length > this.options.maxDisplayLines) {
      this._displayLines.splice(0, this._displayLines.length - this.options.maxDisplayLines);
    }
  }
  hasSelection() {
    if (this._selectionStart === null || this._selectionEnd === null)
      return false;
    return this._selectionStart.line !== this._selectionEnd.line || this._selectionStart.col !== this._selectionEnd.col;
  }
  normalizeSelection() {
    if (!this._selectionStart || !this._selectionEnd)
      return null;
    const start = this._selectionStart;
    const end = this._selectionEnd;
    const startBeforeEnd = start.line < end.line || start.line === end.line && start.col <= end.col;
    if (startBeforeEnd) {
      return {
        startLine: start.line,
        startCol: start.col,
        endLine: end.line,
        endCol: end.col
      };
    } else {
      return {
        startLine: end.line,
        startCol: end.col,
        endLine: start.line,
        endCol: start.col
      };
    }
  }
  getSelectedText() {
    const selection = this.normalizeSelection();
    if (!selection)
      return "";
    const lines = [];
    for (let i = selection.startLine;i <= selection.endLine; i++) {
      if (i < 0 || i >= this._displayLines.length)
        continue;
      const line = this._displayLines[i];
      const fullText = (line.indent ? " ".repeat(INDENT_WIDTH) : "") + line.text;
      let text = fullText;
      if (i === selection.startLine && i === selection.endLine) {
        text = fullText.substring(selection.startCol, selection.endCol);
      } else if (i === selection.startLine) {
        text = fullText.substring(selection.startCol);
      } else if (i === selection.endLine) {
        text = fullText.substring(0, selection.endCol);
      }
      lines.push(text);
    }
    return lines.join(`
`);
  }
  clearSelection() {
    this._selectionStart = null;
    this._selectionEnd = null;
    this._isDragging = false;
    this.stopAutoScroll();
  }
  stopAutoScroll() {
    if (this._autoScrollInterval !== null) {
      this.clock.clearInterval(this._autoScrollInterval);
      this._autoScrollInterval = null;
    }
  }
  startAutoScroll(direction) {
    this.stopAutoScroll();
    this._autoScrollInterval = this.clock.setInterval(() => {
      if (direction === "up") {
        if (this.scrollTopIndex > 0) {
          this.scrollTopIndex--;
          this.isScrolledToBottom = false;
          if (this._selectionEnd) {
            this._selectionEnd = {
              line: this.scrollTopIndex,
              col: this._selectionEnd.col
            };
          }
          this.markNeedsRerender();
        } else {
          this.stopAutoScroll();
        }
      } else {
        const displayLineCount = this._displayLines.length;
        const logAreaHeight = Math.max(1, this.consoleHeight - 1);
        const maxScrollTop = Math.max(0, displayLineCount - logAreaHeight);
        if (this.scrollTopIndex < maxScrollTop) {
          this.scrollTopIndex++;
          this.isScrolledToBottom = this.scrollTopIndex === maxScrollTop;
          if (this._selectionEnd) {
            const maxLine = this.scrollTopIndex + logAreaHeight - 1;
            this._selectionEnd = {
              line: Math.min(maxLine, displayLineCount - 1),
              col: this._selectionEnd.col
            };
          }
          this.markNeedsRerender();
        } else {
          this.stopAutoScroll();
        }
      }
    }, 50);
  }
  triggerCopy() {
    if (!this.hasSelection())
      return;
    const text = this.getSelectedText();
    if (text && this.options.onCopySelection) {
      try {
        this.options.onCopySelection(text);
      } catch {}
      this.clearSelection();
      this.markNeedsRerender();
    }
  }
  getLineSelectionRange(lineIndex) {
    const selection = this.normalizeSelection();
    if (!selection)
      return null;
    if (lineIndex < selection.startLine || lineIndex > selection.endLine) {
      return null;
    }
    const line = this._displayLines[lineIndex];
    if (!line)
      return null;
    const fullTextLength = (line.indent ? INDENT_WIDTH : 0) + line.text.length;
    let start = 0;
    let end = fullTextLength;
    if (lineIndex === selection.startLine) {
      start = Math.max(0, selection.startCol);
    }
    if (lineIndex === selection.endLine) {
      end = Math.min(fullTextLength, selection.endCol);
    }
    if (start >= end)
      return null;
    return { start, end };
  }
  handleMouse(event) {
    if (!this.isVisible)
      return false;
    const localX = event.x - this.consoleX;
    const localY = event.y - this.consoleY;
    if (localX < 0 || localX >= this.consoleWidth || localY < 0 || localY >= this.consoleHeight) {
      return false;
    }
    if (event.type === "scroll" && event.scroll) {
      if (event.scroll.direction === "up") {
        this.scrollUp();
      } else if (event.scroll.direction === "down") {
        this.scrollDown();
      }
      return true;
    }
    if (localY === 0) {
      if (event.type === "down" && event.button === 0 && localX >= this._copyButtonBounds.x && localX < this._copyButtonBounds.x + this._copyButtonBounds.width) {
        this.triggerCopy();
        return true;
      }
      return true;
    }
    const lineIndex = this.scrollTopIndex + (localY - 1);
    const colIndex = Math.max(0, localX - 1);
    if (event.type === "down" && event.button === 0) {
      this.clearSelection();
      this._selectionStart = { line: lineIndex, col: colIndex };
      this._selectionEnd = { line: lineIndex, col: colIndex };
      this._isDragging = true;
      this.markNeedsRerender();
      return true;
    }
    if (event.type === "drag" && this._isDragging) {
      this._selectionEnd = { line: lineIndex, col: colIndex };
      const logAreaHeight = Math.max(1, this.consoleHeight - 1);
      const relativeY = localY - 1;
      if (relativeY <= 0) {
        this.startAutoScroll("up");
      } else if (relativeY >= logAreaHeight - 1) {
        this.startAutoScroll("down");
      } else {
        this.stopAutoScroll();
      }
      this.markNeedsRerender();
      return true;
    }
    if (event.type === "up") {
      if (this._isDragging) {
        this._selectionEnd = { line: lineIndex, col: colIndex };
        this._isDragging = false;
        this.stopAutoScroll();
        this.markNeedsRerender();
      }
      return true;
    }
    return true;
  }
  get visible() {
    return this.isVisible;
  }
  get bounds() {
    return {
      x: this.consoleX,
      y: this.consoleY,
      width: this.consoleWidth,
      height: this.consoleHeight
    };
  }
  saveLogsToFile() {
    try {
      const timestamp = Date.now();
      const filename = `_console_${timestamp}.log`;
      const filepath = path.join(process.cwd(), filename);
      const allLogEntries = [...this._allLogEntries, ...terminalConsoleCache.cachedLogs];
      const logLines = [];
      for (const [date, level, args, callerInfo] of allLogEntries) {
        const timestampStr = this.formatTimestamp(date);
        const callerSource = callerInfo ? `${callerInfo.fileName}:${callerInfo.lineNumber}` : "unknown";
        const prefix = `[${timestampStr}] [${level}]` + (this._debugModeEnabled ? ` [${callerSource}]` : "") + " ";
        const formattedArgs = this.formatArguments(args);
        logLines.push(prefix + formattedArgs);
      }
      const content = logLines.join(`
`);
      fs.writeFileSync(filepath, content, "utf8");
      console.info(`Console logs saved to: ${filename}`);
    } catch (error) {
      console.error(`Failed to save console logs:`, error);
    }
  }
}

// src/renderables/EditBufferRenderable.ts
var BrandedEditBufferRenderable = Symbol.for("@opentui/core/EditBufferRenderable");
var emptyVisualCursor = Object.freeze({
  visualRow: 0,
  visualCol: 0,
  logicalRow: 0,
  logicalCol: 0,
  offset: 0
});
var EditBufferRenderableEvents;
((EditBufferRenderableEvents2) => {
  EditBufferRenderableEvents2["TRAITS_CHANGED"] = "traits-changed";
})(EditBufferRenderableEvents ||= {});
function sameCapture(a, b) {
  if (a === b)
    return true;
  if (!a || !b)
    return !a && !b;
  if (a.length !== b.length)
    return false;
  return a.every((item, i) => item === b[i]);
}
function sameTraits(a, b) {
  return a.suspend === b.suspend && a.status === b.status && sameCapture(a.capture, b.capture);
}
function isEditBufferRenderable(obj) {
  return !!(obj && typeof obj === "object" && (BrandedEditBufferRenderable in obj));
}

class EditBufferRenderable extends Renderable {
  static nativeIntegration = {
    kind: "editor",
    body: { native: this.prototype.renderSelf },
    lifecycle: {
      resize: { native: this.prototype.onResize },
      update: {
        idle: this.prototype.onUpdate,
        active: (renderable) => renderable._needsAutoScrollUpdate
      }
    },
    beforeAfter: false,
    paintBuffer: "destination",
    bufferComposition: "native"
  };
  [BrandedEditBufferRenderable] = true;
  static defaultFocusable = true;
  _traits = {};
  _textColor;
  _backgroundColor;
  _defaultAttributes;
  _selectionBg;
  _selectionFg;
  _wrapMode = "word";
  _scrollMargin = 0.2;
  _showCursor = true;
  _cursorColor;
  _cursorStyle;
  lastLocalSelection = null;
  _tabIndicator;
  _tabIndicatorColor;
  _cursorChangeListener = undefined;
  _contentChangeListener = undefined;
  _autoScrollVelocity = 0;
  _autoScrollAccumulator = 0;
  _scrollSpeed = 16;
  _keyboardSelectionActive = false;
  editBuffer;
  editorView;
  _defaultOptions = {
    textColor: RGBA.fromValues(1, 1, 1, 1),
    backgroundColor: "transparent",
    selectionBg: undefined,
    selectionFg: undefined,
    selectable: true,
    attributes: 0,
    wrapMode: "word",
    scrollMargin: 0.2,
    scrollSpeed: 16,
    showCursor: true,
    cursorColor: RGBA.fromValues(1, 1, 1, 1),
    cursorStyle: {
      style: "block",
      blinking: true
    },
    tabIndicator: undefined,
    tabIndicatorColor: undefined
  };
  constructor(ctx, options) {
    super(ctx, options);
    let editBuffer;
    let editorView;
    try {
      this._textColor = RGBA.clone(parseColor(options.textColor ?? this._defaultOptions.textColor));
      this._backgroundColor = RGBA.clone(parseColor(options.backgroundColor ?? this._defaultOptions.backgroundColor));
      this._defaultAttributes = options.attributes ?? this._defaultOptions.attributes;
      this._selectionBg = options.selectionBg ? RGBA.clone(parseColor(options.selectionBg)) : undefined;
      this._selectionFg = options.selectionFg ? RGBA.clone(parseColor(options.selectionFg)) : undefined;
      this.selectable = options.selectable ?? this._defaultOptions.selectable;
      this._wrapMode = options.wrapMode ?? this._defaultOptions.wrapMode;
      this._scrollMargin = options.scrollMargin ?? this._defaultOptions.scrollMargin;
      this._scrollSpeed = options.scrollSpeed ?? this._defaultOptions.scrollSpeed;
      this._showCursor = options.showCursor ?? this._defaultOptions.showCursor;
      this._cursorColor = RGBA.clone(parseColor(options.cursorColor ?? this._defaultOptions.cursorColor));
      this._cursorStyle = { ...options.cursorStyle ?? this._defaultOptions.cursorStyle };
      if (this._cursorStyle.color)
        this._cursorStyle.color = RGBA.clone(this._cursorStyle.color);
      this._tabIndicator = options.tabIndicator ?? this._defaultOptions.tabIndicator;
      this._tabIndicatorColor = options.tabIndicatorColor ? RGBA.clone(parseColor(options.tabIndicatorColor)) : this._defaultOptions.tabIndicatorColor;
      editBuffer = EditBuffer.create(this._ctx.widthMethod, this._ctx.nativeScene);
      this.editBuffer = editBuffer;
      editorView = EditorView.create(editBuffer, Math.max(1, Math.trunc(this.width || 80)), Math.max(1, Math.trunc(this.height || 24)));
      this.editorView = editorView;
      this.editorView.setWrapMode(this._wrapMode);
      this.editorView.setScrollMargin(this._scrollMargin);
      if (options.selectionOccupancy === "boundary") {
        this.editorView.setSelectionOccupancy("boundary");
      }
      this.editBuffer.setDefaultFg(this._textColor);
      this.editBuffer.setDefaultBg(this._backgroundColor);
      this.editBuffer.setDefaultAttributes(this._defaultAttributes);
      if (options.syntaxStyle) {
        this.editBuffer.setSyntaxStyle(options.syntaxStyle);
      }
      if (this._tabIndicator !== undefined) {
        this.editorView.setTabIndicator(this._tabIndicator);
      }
      if (this._tabIndicatorColor !== undefined) {
        this.editorView.setTabIndicatorColor(this._tabIndicatorColor);
      }
      this._ctx.nativeScene.setEditorView(this, this.editorView._getSceneHandle(this._ctx.nativeScene));
      this.setNativeEditorOptions();
      this.setupEventListeners(options);
    } catch (error) {
      this.abortConstruction(error, (run) => {
        run(() => editorView?.destroy());
        run(() => editBuffer?.destroy());
      });
    }
  }
  get lineInfo() {
    return this.editorView.getLogicalLineInfo();
  }
  setupEventListeners(options) {
    this._cursorChangeListener = options.onCursorChange;
    this._contentChangeListener = options.onContentChange;
    this.editBuffer.on("cursor-changed", () => {
      if (this._cursorChangeListener) {
        const cursor = this.editBuffer.getCursorPosition();
        this._cursorChangeListener({
          line: cursor.row,
          visualColumn: cursor.col
        });
      }
    });
    this.editBuffer.on("content-changed", () => {
      this.requestRender();
      this.emit("line-info-change");
      if (this._contentChangeListener) {
        this._contentChangeListener({});
      }
    });
  }
  get lineCount() {
    return this.editBuffer.getLineCount();
  }
  get virtualLineCount() {
    return this.editorView.getVirtualLineCount();
  }
  get scrollY() {
    return this.editorView.getViewport().offsetY;
  }
  get plainText() {
    return this.editBuffer.getText();
  }
  get logicalCursor() {
    return this.editBuffer.getCursorPosition();
  }
  get visualCursor() {
    if (this.editorView.isDestroyed)
      return emptyVisualCursor;
    return this.editorView.getVisualCursor();
  }
  get cursorOffset() {
    return this.editorView.isDestroyed ? emptyVisualCursor.offset : this.editBuffer.getCursorPosition().offset;
  }
  set cursorOffset(offset) {
    this.clearSelection();
    this.editorView.setCursorByOffset(offset ?? 0);
    this.requestRender();
  }
  get cursorCharacterOffset() {
    const len = this.plainText.length;
    if (len <= 0)
      return;
    const cursor = this.logicalCursor;
    const offset = this.cursorOffset;
    if (offset >= len) {
      if (cursor.col > 0)
        return len - 1;
      return 0;
    }
    if (this.plainText[offset] === `
` && cursor.col > 0) {
      return offset - 1;
    }
    return offset;
  }
  get textColor() {
    return RGBA.clone(this._textColor);
  }
  set textColor(value) {
    const newColor = RGBA.clone(parseColor(value ?? this._defaultOptions.textColor));
    this.editBuffer.setDefaultFg(newColor);
    this._textColor = newColor;
    this.requestRender();
  }
  get selectionBg() {
    return this._selectionBg ? RGBA.clone(this._selectionBg) : undefined;
  }
  get traits() {
    return this._traits;
  }
  set traits(value) {
    if (sameTraits(this._traits, value))
      return;
    const prev = this._traits;
    this._traits = value;
    this.emit("traits-changed" /* TRAITS_CHANGED */, value, prev);
  }
  set selectionBg(value) {
    const newColor = value ? RGBA.clone(parseColor(value)) : undefined;
    if (this._selectionBg !== newColor) {
      this.editorView.setSelectionColors(newColor, this._selectionFg);
      this._selectionBg = newColor;
      this.requestRender();
    }
  }
  get selectionFg() {
    return this._selectionFg ? RGBA.clone(this._selectionFg) : undefined;
  }
  set selectionFg(value) {
    const newColor = value ? RGBA.clone(parseColor(value)) : undefined;
    if (this._selectionFg !== newColor) {
      this.editorView.setSelectionColors(this._selectionBg, newColor);
      this._selectionFg = newColor;
      this.requestRender();
    }
  }
  get backgroundColor() {
    return RGBA.clone(this._backgroundColor);
  }
  set backgroundColor(value) {
    const newColor = RGBA.clone(parseColor(value ?? this._defaultOptions.backgroundColor));
    this.editBuffer.setDefaultBg(newColor);
    this._backgroundColor = newColor;
    this.requestRender();
  }
  get attributes() {
    return this._defaultAttributes;
  }
  set attributes(value) {
    const attributes = value ?? this._defaultOptions.attributes;
    if (this._defaultAttributes !== attributes) {
      this.runMutation(() => {
        this.editBuffer.setDefaultAttributes(attributes);
        this._defaultAttributes = attributes;
        this.requestRender();
      });
    }
  }
  get wrapMode() {
    return this._wrapMode;
  }
  set wrapMode(value) {
    if (this._wrapMode !== value) {
      this.runMutation(() => {
        this.editorView.setWrapMode(value);
        this._wrapMode = value;
        this.requestRender();
      });
    }
  }
  get showCursor() {
    return this._showCursor;
  }
  set showCursor(value) {
    value ??= this._defaultOptions.showCursor;
    if (this._showCursor !== value) {
      this.setNativeEditorOptions({ showCursor: value });
      this._showCursor = value;
      this.requestRender();
    }
  }
  get cursorColor() {
    return RGBA.clone(this._cursorColor);
  }
  set cursorColor(value) {
    const newColor = RGBA.clone(parseColor(value ?? this._defaultOptions.cursorColor));
    this.setNativeEditorOptions({ color: newColor });
    this._cursorColor = newColor;
    if (this._focused) {
      this.requestRender();
    }
  }
  get cursorStyle() {
    return { ...this._cursorStyle, color: this._cursorStyle.color ? RGBA.clone(this._cursorStyle.color) : undefined };
  }
  set cursorStyle(style) {
    const newStyle = { ...style, color: style.color ? RGBA.clone(style.color) : undefined };
    if (this._cursorStyle.style !== newStyle.style || this._cursorStyle.blinking !== newStyle.blinking || this._cursorStyle.cursor !== newStyle.cursor) {
      this.setNativeEditorOptions({
        style: newStyle.style ?? "block",
        blinking: newStyle.blinking ?? true,
        cursor: newStyle.cursor
      });
      this._cursorStyle = newStyle;
      if (this._focused) {
        this.requestRender();
      }
    }
  }
  get selectionOccupancy() {
    return this.editorView.getSelectionOccupancy();
  }
  set selectionOccupancy(value) {
    const occupancy = value ?? "cell";
    if (this.selectionOccupancy === occupancy)
      return;
    this.editorView.setSelectionOccupancy(occupancy);
    this.requestRender();
  }
  get tabIndicator() {
    return this._tabIndicator;
  }
  set tabIndicator(value) {
    value ??= this._defaultOptions.tabIndicator;
    if (this._tabIndicator !== value) {
      this._tabIndicator = value;
      if (value !== undefined) {
        this.editorView.setTabIndicator(value);
      }
      this.requestRender();
    }
  }
  get tabIndicatorColor() {
    return this._tabIndicatorColor ? RGBA.clone(this._tabIndicatorColor) : undefined;
  }
  set tabIndicatorColor(value) {
    const newColor = value ? RGBA.clone(parseColor(value)) : undefined;
    if (this._tabIndicatorColor !== newColor) {
      if (newColor !== undefined) {
        this.editorView.setTabIndicatorColor(newColor);
      }
      this._tabIndicatorColor = newColor;
      this.requestRender();
    }
  }
  get scrollSpeed() {
    return this._scrollSpeed;
  }
  set scrollSpeed(value) {
    this._scrollSpeed = Math.max(0, value);
  }
  onMouseEvent(event) {
    if (event.type === "scroll") {
      scrollOnce(event, this, () => {
        const before = this.editorView.getViewport();
        this.handleScroll(event);
        const after = this.editorView.getViewport();
        return after.offsetX !== before.offsetX || after.offsetY !== before.offsetY;
      });
    }
  }
  handleScroll(event) {
    if (!event.scroll)
      return;
    const { delta } = event.scroll;
    const direction = wheelDirection(event);
    const viewport = this.editorView.getViewport();
    if (direction === "up") {
      const newOffsetY = Math.max(0, viewport.offsetY - delta);
      this.editorView.setViewport(viewport.offsetX, newOffsetY, viewport.width, viewport.height, true);
      this.requestRender();
    } else if (direction === "down") {
      const totalVirtualLines = this.editorView.getTotalVirtualLineCount();
      const maxOffsetY = Math.max(0, totalVirtualLines - viewport.height);
      const newOffsetY = Math.min(viewport.offsetY + delta, maxOffsetY);
      this.editorView.setViewport(viewport.offsetX, newOffsetY, viewport.width, viewport.height, true);
      this.requestRender();
    }
    if (this._wrapMode === "none") {
      if (direction === "left") {
        const newOffsetX = Math.max(0, viewport.offsetX - delta);
        this.editorView.setViewport(newOffsetX, viewport.offsetY, viewport.width, viewport.height, true);
        this.requestRender();
      } else if (direction === "right") {
        const maxOffsetX = Math.max(0, this.lineInfo.lineWidthColsMax - viewport.width);
        const newOffsetX = Math.min(viewport.offsetX + delta, Math.max(viewport.offsetX, maxOffsetX));
        this.editorView.setViewport(newOffsetX, viewport.offsetY, viewport.width, viewport.height, true);
        this.requestRender();
      }
    }
  }
  onResize(width, height) {
    this.editorView.setViewportSize(width, height);
  }
  refreshLocalSelection() {
    if (this.lastLocalSelection) {
      return this.updateLocalSelection(this.lastLocalSelection);
    }
    return false;
  }
  updateLocalSelection(localSelection) {
    if (!localSelection?.isActive) {
      this.editorView.resetLocalSelection();
      return true;
    }
    return this.editorView.setLocalSelection(localSelection.anchorX, localSelection.anchorY, localSelection.focusX, localSelection.focusY, this._selectionBg, this._selectionFg, false, false, localSelection.behavior);
  }
  shouldStartSelection(x, y) {
    if (!this.selectable)
      return false;
    const localX = x - this.x;
    const localY = y - this.y;
    return localX >= 0 && localX < this.width && localY >= 0 && localY < this.height;
  }
  onSelectionChanged(selection) {
    const localSelection = convertGlobalToLocalSelection(selection, Math.trunc(this.x), Math.trunc(this.y));
    this.lastLocalSelection = localSelection;
    const updateCursor = true;
    const followCursor = this._keyboardSelectionActive;
    let changed;
    if (!localSelection?.isActive) {
      this._keyboardSelectionActive = false;
      this.editorView.resetLocalSelection();
      changed = true;
    } else if (selection?.isStart) {
      changed = this.editorView.setLocalSelection(localSelection.anchorX, localSelection.anchorY, localSelection.focusX, localSelection.focusY, this._selectionBg, this._selectionFg, updateCursor, followCursor, localSelection.behavior);
    } else {
      changed = this.editorView.updateLocalSelection(localSelection.anchorX, localSelection.anchorY, localSelection.focusX, localSelection.focusY, this._selectionBg, this._selectionFg, updateCursor, followCursor, localSelection.behavior);
    }
    const previousVelocity = this._autoScrollVelocity;
    const previousAccumulator = this._autoScrollAccumulator;
    if (changed && localSelection?.isActive && selection?.isDragging) {
      const viewport = this.editorView.getViewport();
      const focusY = localSelection.focusY;
      const scrollMargin = Math.max(1, Math.floor(viewport.height * this._scrollMargin));
      if (focusY < scrollMargin) {
        this._autoScrollVelocity = -this._scrollSpeed;
      } else if (focusY >= viewport.height - scrollMargin) {
        this._autoScrollVelocity = this._scrollSpeed;
      } else {
        this._autoScrollVelocity = 0;
      }
    } else {
      this._keyboardSelectionActive = false;
      this._autoScrollVelocity = 0;
      this._autoScrollAccumulator = 0;
    }
    if (previousVelocity !== 0 !== this._needsAutoScrollUpdate) {
      const generation = this._nativeSceneHookGeneration;
      try {
        this.refreshNativeSceneHooks();
      } catch (error) {
        if (generation === this._nativeSceneHookGeneration) {
          this._autoScrollVelocity = previousVelocity;
          this._autoScrollAccumulator = previousAccumulator;
        }
        throw error;
      }
    }
    if (changed) {
      this.requestRender();
    }
    return this.hasSelection();
  }
  get _needsAutoScrollUpdate() {
    return (this._autoScrollVelocity ?? 0) !== 0;
  }
  onUpdate(deltaTime) {
    super.onUpdate(deltaTime);
    if (this._autoScrollVelocity !== 0 && this.hasSelection()) {
      const deltaSeconds = deltaTime / 1000;
      this._autoScrollAccumulator += this._autoScrollVelocity * deltaSeconds;
      const linesToScroll = Math.floor(Math.abs(this._autoScrollAccumulator));
      if (linesToScroll > 0) {
        const direction = this._autoScrollVelocity > 0 ? 1 : -1;
        const viewport = this.editorView.getViewport();
        const totalVirtualLines = this.editorView.getTotalVirtualLineCount();
        const maxOffsetY = Math.max(0, totalVirtualLines - viewport.height);
        const newOffsetY = Math.max(0, Math.min(viewport.offsetY + direction * linesToScroll, maxOffsetY));
        if (newOffsetY !== viewport.offsetY) {
          this.editorView.setViewport(viewport.offsetX, newOffsetY, viewport.width, viewport.height, false);
          this._ctx.requestSelectionUpdate();
        }
        this._autoScrollAccumulator -= direction * linesToScroll;
      }
    }
  }
  getSelectedText() {
    return this.editorView.getSelectedText();
  }
  hasSelection() {
    return this.editorView.hasSelection();
  }
  getSelection() {
    return this.editorView.getSelection();
  }
  deleteSelectedText() {
    this.editorView.deleteSelectedText();
    this._ctx.clearSelection();
    this.requestRender();
  }
  setSelection(start, end) {
    this.lastLocalSelection = null;
    this.editorView.resetLocalSelection();
    this._ctx.clearSelection();
    this.editorView.setSelection(start, end, this._selectionBg, this._selectionFg);
    this.requestRender();
  }
  setSelectionInclusive(start, end) {
    this.lastLocalSelection = null;
    this.editorView.resetLocalSelection();
    this._ctx.clearSelection();
    this.editorView.setSelectionInclusive(start, end, this._selectionBg, this._selectionFg);
    this.requestRender();
  }
  clearSelection() {
    const had = this.hasSelection();
    this.lastLocalSelection = null;
    this.editorView.resetLocalSelection();
    this._ctx.clearSelection();
    if (had) {
      this.requestRender();
    }
    return had;
  }
  deleteSelection() {
    if (!this.hasSelection())
      return false;
    this.lastLocalSelection = null;
    this.deleteSelectedText();
    return true;
  }
  setCursor(row, col) {
    this.clearSelection();
    this.editBuffer.setCursor(row, col);
    this.requestRender();
  }
  insertChar(char) {
    this.insertOrReplaceSelection(char, () => this.editBuffer.insertChar(char));
  }
  insertText(text) {
    this.insertOrReplaceSelection(text, () => this.editBuffer.insertText(text));
  }
  insertOrReplaceSelection(text, insert) {
    const hasSelection = this.hasSelection();
    this.editBuffer.runMutation(() => {
      if (hasSelection) {
        this.editorView._replaceSelectedText(text);
        this._ctx.clearSelection();
      } else {
        insert();
      }
      this.requestRender();
    });
  }
  deleteChar() {
    if (this.hasSelection()) {
      this.deleteSelectedText();
      return true;
    }
    this._ctx.clearSelection();
    this.editBuffer.deleteChar();
    this.requestRender();
    return true;
  }
  deleteCharBackward() {
    if (this.hasSelection()) {
      this.deleteSelectedText();
      return true;
    }
    this._ctx.clearSelection();
    this.editBuffer.deleteCharBackward();
    this.requestRender();
    return true;
  }
  newLine() {
    this._ctx.clearSelection();
    this.editBuffer.newLine();
    this.requestRender();
    return true;
  }
  deleteLine() {
    this._ctx.clearSelection();
    this.editBuffer.deleteLine();
    this.requestRender();
    return true;
  }
  collapseSelectionToEdge(edge) {
    const selection = this.getSelection();
    if (!selection)
      return false;
    this.editBuffer.setCursorByOffset(edge === "start" ? selection.start : selection.end);
    this.clearSelection();
    return true;
  }
  moveCursorLeft(options) {
    const select = options?.select ?? false;
    if (!select && this.collapseSelectionToEdge("start"))
      return true;
    this.updateSelectionForMovement(select, true);
    this.editBuffer.moveCursorLeft();
    this.updateSelectionForMovement(select, false);
    this.requestRender();
    return true;
  }
  moveCursorRight(options) {
    const select = options?.select ?? false;
    if (!select && this.collapseSelectionToEdge("end"))
      return true;
    this.updateSelectionForMovement(select, true);
    this.editBuffer.moveCursorRight();
    this.updateSelectionForMovement(select, false);
    this.requestRender();
    return true;
  }
  moveCursorUp(options) {
    const select = options?.select ?? false;
    this.updateSelectionForMovement(select, true);
    this.editorView.moveUpVisual();
    this.updateSelectionForMovement(select, false);
    this.requestRender();
    return true;
  }
  moveCursorDown(options) {
    const select = options?.select ?? false;
    this.updateSelectionForMovement(select, true);
    this.editorView.moveDownVisual();
    this.updateSelectionForMovement(select, false);
    this.requestRender();
    return true;
  }
  gotoLine(line) {
    this.clearSelection();
    this.editBuffer.gotoLine(line);
    this.requestRender();
  }
  gotoLineStart() {
    this.setCursor(this.logicalCursor.row, 0);
  }
  gotoLineTextEnd() {
    const eol = this.editBuffer.getEOL();
    this.setCursor(eol.row, eol.col);
  }
  gotoLineHome(options) {
    const select = options?.select ?? false;
    if (!select && this.collapseSelectionToEdge("start"))
      return true;
    this.updateSelectionForMovement(select, true);
    const cursor = this.editorView.getCursor();
    if (cursor.col === 0 && cursor.row > 0) {
      this.editBuffer.setCursor(cursor.row - 1, 0);
      const prevLineEol = this.editBuffer.getEOL();
      this.editBuffer.setCursor(prevLineEol.row, prevLineEol.col);
    } else {
      this.editBuffer.setCursor(cursor.row, 0);
    }
    this.updateSelectionForMovement(select, false);
    this.requestRender();
    return true;
  }
  gotoLineEnd(options) {
    const select = options?.select ?? false;
    if (!select && this.collapseSelectionToEdge("end"))
      return true;
    this.updateSelectionForMovement(select, true);
    const cursor = this.editorView.getCursor();
    const eol = this.editBuffer.getEOL();
    const lineCount = this.editBuffer.getLineCount();
    if (cursor.col === eol.col && cursor.row < lineCount - 1) {
      this.editBuffer.setCursor(cursor.row + 1, 0);
    } else {
      this.editBuffer.setCursor(eol.row, eol.col);
    }
    this.updateSelectionForMovement(select, false);
    this.requestRender();
    return true;
  }
  gotoVisualLineHome(options) {
    const select = options?.select ?? false;
    if (!select && this.collapseSelectionToEdge("start"))
      return true;
    this.updateSelectionForMovement(select, true);
    const sol = this.editorView.getVisualSOL();
    this.editBuffer.setCursor(sol.logicalRow, sol.logicalCol);
    this.updateSelectionForMovement(select, false);
    this.requestRender();
    return true;
  }
  gotoVisualLineEnd(options) {
    const select = options?.select ?? false;
    if (!select && this.collapseSelectionToEdge("end"))
      return true;
    this.updateSelectionForMovement(select, true);
    this.editorView.gotoVisualLineEnd();
    this.updateSelectionForMovement(select, false);
    this.requestRender();
    return true;
  }
  gotoBufferHome(options) {
    const select = options?.select ?? false;
    if (!select && this.collapseSelectionToEdge("start"))
      return true;
    this.updateSelectionForMovement(select, true);
    this.editBuffer.setCursor(0, 0);
    this.updateSelectionForMovement(select, false);
    this.requestRender();
    return true;
  }
  gotoBufferEnd(options) {
    const select = options?.select ?? false;
    if (!select && this.collapseSelectionToEdge("end"))
      return true;
    this.updateSelectionForMovement(select, true);
    this.editBuffer.gotoLine(999999);
    this.updateSelectionForMovement(select, false);
    this.requestRender();
    return true;
  }
  selectAll() {
    this.updateSelectionForMovement(false, true);
    this.editBuffer.setCursor(0, 0);
    return this.gotoBufferEnd({ select: true });
  }
  deleteToLineEnd() {
    const cursor = this.editorView.getCursor();
    const eol = this.editBuffer.getEOL();
    if (eol.col > cursor.col) {
      this.editBuffer.deleteRange(cursor.row, cursor.col, eol.row, eol.col);
    }
    this.requestRender();
    return true;
  }
  deleteToLineStart() {
    const cursor = this.editorView.getCursor();
    if (cursor.col > 0) {
      this.editBuffer.deleteRange(cursor.row, 0, cursor.row, cursor.col);
    } else if (cursor.row > 0) {
      this.editBuffer.deleteCharBackward();
    }
    this.requestRender();
    return true;
  }
  undo() {
    this._ctx.clearSelection();
    this.editBuffer.undo();
    this.requestRender();
    return true;
  }
  redo() {
    this._ctx.clearSelection();
    this.editBuffer.redo();
    this.requestRender();
    return true;
  }
  moveWordForward(options) {
    const select = options?.select ?? false;
    if (!select && this.collapseSelectionToEdge("end"))
      return true;
    this.updateSelectionForMovement(select, true);
    const nextWord = this.editBuffer.getNextWordBoundary();
    this.editBuffer.setCursorByOffset(nextWord.offset);
    this.updateSelectionForMovement(select, false);
    this.requestRender();
    return true;
  }
  moveWordBackward(options) {
    const select = options?.select ?? false;
    if (!select && this.collapseSelectionToEdge("start"))
      return true;
    this.updateSelectionForMovement(select, true);
    const prevWord = this.editBuffer.getPrevWordBoundary();
    this.editBuffer.setCursorByOffset(prevWord.offset);
    this.updateSelectionForMovement(select, false);
    this.requestRender();
    return true;
  }
  deleteWordForward() {
    if (this.hasSelection()) {
      this.deleteSelectedText();
      return true;
    }
    const currentCursor = this.editBuffer.getCursorPosition();
    const nextWord = this.editBuffer.getNextWordBoundary();
    if (nextWord.offset > currentCursor.offset) {
      this.editBuffer.deleteRange(currentCursor.row, currentCursor.col, nextWord.row, nextWord.col);
    }
    this._ctx.clearSelection();
    this.requestRender();
    return true;
  }
  deleteWordBackward() {
    if (this.hasSelection()) {
      this.deleteSelectedText();
      return true;
    }
    const currentCursor = this.editBuffer.getCursorPosition();
    const prevWord = this.editBuffer.getPrevWordBoundary();
    if (prevWord.offset < currentCursor.offset) {
      this.editBuffer.deleteRange(prevWord.row, prevWord.col, currentCursor.row, currentCursor.col);
    }
    this._ctx.clearSelection();
    this.requestRender();
    return true;
  }
  renderSelf(buffer) {
    buffer.drawEditorView(this.editorView, Math.trunc(this._screenX), Math.trunc(this._screenY));
  }
  focus() {
    super.focus();
    this.requestRender();
  }
  blur() {
    super.blur();
    this.requestRender();
  }
  destroyOwnedResources() {
    this.runCleanup((run) => {
      run(() => {
        this.traits = {};
      });
      if (this._focused) {
        run(() => this.blur());
      }
      run(() => this.editorView.destroy());
      run(() => this.editBuffer.destroy());
    });
  }
  set onCursorChange(handler) {
    this._cursorChangeListener = handler;
  }
  get onCursorChange() {
    return this._cursorChangeListener;
  }
  set onContentChange(handler) {
    this._contentChangeListener = handler;
  }
  get onContentChange() {
    return this._contentChangeListener;
  }
  get syntaxStyle() {
    return this.editBuffer.getSyntaxStyle();
  }
  set syntaxStyle(style) {
    this.editBuffer.setSyntaxStyle(style);
    this.requestRender();
  }
  addHighlight(lineIdx, highlight) {
    this.editBuffer.addHighlight(lineIdx, highlight);
    this.requestRender();
  }
  addHighlightByCharRange(highlight) {
    this.editBuffer.addHighlightByCharRange(highlight);
    this.requestRender();
  }
  removeHighlightsByRef(hlRef) {
    this.editBuffer.removeHighlightsByRef(hlRef);
    this.requestRender();
  }
  clearLineHighlights(lineIdx) {
    this.editBuffer.clearLineHighlights(lineIdx);
    this.requestRender();
  }
  clearAllHighlights() {
    this.editBuffer.clearAllHighlights();
    this.requestRender();
  }
  getLineHighlights(lineIdx) {
    return this.editBuffer.getLineHighlights(lineIdx);
  }
  setText(text) {
    this.runMutation(() => {
      this.editBuffer.setText(text);
      this.requestRender();
    });
  }
  replaceText(text) {
    this.runMutation(() => {
      this.editBuffer.replaceText(text);
      this.requestRender();
    });
  }
  clear() {
    this.editBuffer.clear();
    this.editBuffer.clearAllHighlights();
    this.requestRender();
  }
  deleteRange(startLine, startCol, endLine, endCol) {
    this.editBuffer.deleteRange(startLine, startCol, endLine, endCol);
    this.requestRender();
  }
  getTextRange(startOffset, endOffset) {
    return this.editBuffer.getTextRange(startOffset, endOffset);
  }
  getTextRangeByCoords(startRow, startCol, endRow, endCol) {
    return this.editBuffer.getTextRangeByCoords(startRow, startCol, endRow, endCol);
  }
  setNativeEditorOptions(options = {}) {
    if (this.isDestroyed)
      return;
    this._ctx.nativeScene.setEditorOptions(this, {
      showCursor: this._showCursor,
      style: this._cursorStyle.style ?? "block",
      blinking: this._cursorStyle.blinking ?? true,
      color: this._cursorColor,
      cursor: this._cursorStyle.cursor,
      ...options
    });
  }
  updateSelectionForMovement(shiftPressed, isBeforeMovement) {
    if (!shiftPressed) {
      this._keyboardSelectionActive = false;
      this.clearSelection();
      return;
    }
    if (!this.selectable)
      return;
    this._keyboardSelectionActive = true;
    const visualCursor = this.editorView.getVisualCursor();
    const cursorX = Math.trunc(this.x) + visualCursor.visualCol;
    const cursorY = Math.trunc(this.y) + visualCursor.visualRow;
    if (isBeforeMovement) {
      if (!this._ctx.hasSelection || !this.hasSelection()) {
        this._ctx.startSelection(this, cursorX, cursorY);
      } else if (this._ctx.getSelection()?.behavior !== "cell") {
        if (this.editorView.convertSelectionToCell()) {
          const selection = this._ctx.getSelection();
          if (selection)
            selection.behavior = "cell";
        }
      }
      return;
    }
    this._ctx.updateSelection(this, cursorX, cursorY, { finishDragging: true });
  }
}

// src/renderer.ts
import { appendFileSync, writeFileSync } from "fs";
import { Writable as Writable3 } from "stream";

// src/ansi.ts
var ANSI = {
  switchToAlternateScreen: "\x1B[?1049h",
  switchToMainScreen: "\x1B[?1049l",
  reset: "\x1B[0m",
  resetScrollRegion: "\x1B[r",
  home: "\x1B[H",
  clearScreen: "\x1B[2J",
  clearSavedLines: "\x1B[3J",
  scrollDown: (lines) => `\x1B[${lines}T`,
  scrollUp: (lines) => `\x1B[${lines}S`,
  moveCursor: (row, col) => `\x1B[${row};${col}H`,
  moveCursorAndClear: (row, col) => `\x1B[${row};${col}H\x1B[J`,
  setRgbBackground: (r, g, b) => `\x1B[48;2;${r};${g};${b}m`,
  resetBackground: "\x1B[49m",
  bracketedPasteStart: "\x1B[200~",
  bracketedPasteEnd: "\x1B[201~"
};

// src/NativeScene.ts
var maxLayoutRounds = 8;
var maxHostRequests = 65536;

class NativeLifecyclePasses extends Set {
  order = new WeakMap;
  nextOrder = 0;
  work;
  add(renderable) {
    if (!this.order.has(renderable))
      this.order.set(renderable, ++this.nextOrder);
    this.refresh(renderable);
    return this;
  }
  refresh(renderable) {
    const order = this.order.get(renderable);
    if (order === undefined)
      return;
    const active = renderable._needsLifecyclePass();
    if (active === super.has(renderable))
      return;
    if (!active) {
      super.delete(renderable);
      return;
    }
    super.add(renderable);
    const work = this.work;
    if (!work || order <= work.order)
      return;
    let low = work.index;
    let high = work.pending.length;
    while (low < high) {
      const middle = low + high >>> 1;
      if (work.pending[middle].order < order)
        low = middle + 1;
      else
        high = middle;
    }
    if (work.pending[low]?.order !== order)
      work.pending.splice(low, 0, { renderable, order });
  }
  delete(renderable) {
    this.order.delete(renderable);
    return super.delete(renderable);
  }
  clear() {
    super.clear();
    this.order = new WeakMap;
  }
  *iteratePending() {
    if (this.work)
      throw new Error("Native scene lifecycle pass is already active");
    if (this.size === 0)
      return;
    const work = {
      pending: Array.from(this, (renderable) => ({ renderable, order: this.order.get(renderable) })),
      index: 0,
      order: 0
    };
    work.pending.sort((a, b) => a.order - b.order);
    this.work = work;
    try {
      while (work.index < work.pending.length) {
        const next = work.pending[work.index++];
        work.order = next.order;
        if (this.has(next.renderable) && this.order.get(next.renderable) === next.order)
          yield next.renderable;
      }
    } finally {
      this.work = undefined;
    }
  }
}

class NativeScene {
  driver;
  renderer;
  get resourceContext() {
    return this.driver.resourceContext;
  }
  lifecyclePasses = new NativeLifecyclePasses;
  cleanupOwners = new Set;
  nodes = new Map;
  paintedFrame = null;
  paintRecording;
  destroyed = false;
  destroying = false;
  layoutRevision = 0;
  staging = new SceneStaging;
  yogaHost;
  constructor(driver, renderer) {
    this.driver = driver;
    this.renderer = renderer;
    this.yogaHost = driver.renderLib.getYogaHost();
  }
  get frame() {
    return this.paintedFrame;
  }
  get observedLayoutRevision() {
    if (this.yogaHost.inCallback || this.destroyed || this.driver.disposed)
      return;
    return this.layoutRevision;
  }
  get stopped() {
    return this.destroyed || this.destroying || this.driver.disposed || this.renderer.isDestroyed;
  }
  changeLayout() {
    this.layoutRevision = this.layoutRevision === Number.MAX_SAFE_INTEGER ? 0 : this.layoutRevision + 1;
  }
  get hasStagedMutations() {
    return this.staging.pending;
  }
  flushStaged() {
    if (this.destroyed || this.driver.disposed) {
      this.staging.clear();
      this.yogaHost.forgetScene(this);
      return;
    }
    if (!this.staging.pending)
      return;
    try {
      this.driver.renderLib.sceneFlush(this.driver.context, this.staging);
    } catch (error) {
      if (!(error instanceof NativeError) || error.status !== -12 /* SessionClosed */)
        throw error;
      this.staging.clear();
    } finally {
      if (!this.staging.pending)
        this.yogaHost.forgetScene(this);
    }
  }
  getRenderables() {
    return this.nodes.values();
  }
  assertAlive() {
    if (this.destroyed || this.driver.disposed)
      throw new Error("Native scene is destroyed");
  }
  createNode(renderable, options) {
    this.yogaHost.assertMutable();
    this.assertAlive();
    if (this.destroying)
      throw new Error("Native scene is being destroyed");
    const kind = renderable.nativeIntegration.kind;
    if (options.enableLayout === false)
      throw new Error("Native scene requires Yoga layout");
    const handle = this.driver.renderLib.sceneCreateNode(this.driver.context, this.driver.session, kind, renderable.num);
    try {
      renderable._bindSceneHandle(handle);
      this.nodes.set(renderable.num, renderable);
    } catch (error) {
      try {
        this.driver.renderLib.sceneDestroyNode(this.driver.context, handle);
      } catch {}
      throw error;
    }
  }
  moveNode(child, parent, index) {
    const handle = child._getSceneHandle(this);
    const parentHandle = parent?._getSceneHandle(this) ?? null;
    this.driver.renderLib.sceneMoveNode(this.driver.context, handle, parentHandle, index);
    this.changeLayout();
  }
  setViewport(content, viewport) {
    this.flushStaged();
    this.driver.renderLib.sceneSetViewport(this.driver.context, content._getSceneHandle(this), viewport ? viewport._getSceneHandle(this) : null);
  }
  setFocus(renderable, focused) {
    this.flushStaged();
    this.driver.renderLib.sceneSetFocus(this.driver.context, renderable._getSceneHandle(this), focused);
  }
  destroyNode(renderable) {
    renderable.assertMutable();
    const handle = renderable._getSceneHandle(this);
    let flushFailure;
    try {
      this.flushStaged();
    } catch (error) {
      flushFailure = { error };
    }
    try {
      this.driver.renderLib.sceneDestroyNode(this.driver.context, handle);
      this.staging.discard(handle);
      if (!this.staging.pending)
        this.yogaHost.forgetScene(this);
      this.changeLayout();
      renderable._releaseSceneHandle();
      this.nodes.delete(renderable.num);
      this.renderer.unregisterLifecyclePass(renderable);
    } catch (error) {
      if (flushFailure) {
        throw new AggregateError([flushFailure.error, error], "Native scene flush and node cleanup both failed");
      }
      throw error;
    }
    if (flushFailure)
      throw flushFailure.error;
  }
  setHooks(renderable, flags, generation, initialWidth, initialHeight) {
    this.flushStaged();
    this.driver.renderLib.sceneSetHooks(this.driver.context, renderable._getSceneHandle(this), flags, generation, initialWidth, initialHeight);
  }
  setStyle(node, group, kind, edge, unit, value, flags = 0) {
    this.yogaHost.assertMutable();
    const handle = node._getSceneHandle(this);
    if (this.staging.full)
      this.flushStaged();
    if (this.staging.stageStyle(this.driver.context, handle, group, kind, edge, unit, value, flags)) {
      this.yogaHost.stageScene(this);
    }
  }
  getStyle(node, group, kind, edge) {
    const handle = node._getSceneHandle(this);
    this.flushStaged();
    return this.driver.renderLib.sceneGetStyle(this.driver.context, handle, group, kind, edge);
  }
  setMeasureFunc(node, measure) {
    this.flushStaged();
    this.driver.renderLib.sceneSetMeasure(this.driver.context, node._getSceneHandle(this), measure);
  }
  hasMeasureFunc(node) {
    this.flushStaged();
    return this.driver.renderLib.sceneHasMeasure(this.driver.context, node._getSceneHandle(this));
  }
  markDirty(node) {
    this.flushStaged();
    this.driver.renderLib.sceneMarkDirty(this.driver.context, node._getSceneHandle(this));
  }
  setPositions(node, mask, units, values) {
    const edgeMaskMax = (1 << Edge.Bottom + 1) - 1;
    if (!Number.isInteger(mask) || mask < 0 || mask > edgeMaskMax)
      throw new RangeError("Scene position mask must use four edges");
    for (let edge = 0;edge <= Edge.Bottom; edge++) {
      if ((mask & 1 << edge) !== 0)
        SceneStaging.checkStyleValue(NativeStyleGroup.Value, values[edge]);
    }
    for (let edge = 0;edge <= Edge.Bottom; edge++) {
      if ((mask & 1 << edge) === 0)
        continue;
      this.setStyle(node, NativeStyleGroup.Value, YogaValueKind.Position, edge, units[edge], values[edge], NativeStyleFlags.None);
    }
  }
  setPaint(renderable, paint) {
    this.yogaHost.assertMutable();
    const handle = renderable._getSceneHandle(this);
    if (this.staging.full)
      this.flushStaged();
    if (this.staging.stagePaint(this.driver.context, handle, paint, renderable))
      this.yogaHost.stageScene(this);
    const { translateX = renderable.translateX, translateY = renderable.translateY } = paint;
    if (translateX !== renderable.translateX || translateY !== renderable.translateY)
      this.changeLayout();
  }
  setBackground(renderable, color) {
    this.yogaHost.assertMutable();
    const handle = renderable._getSceneHandle(this);
    if (this.staging.full)
      this.flushStaged();
    if (this.staging.stageBackground(this.driver.context, handle, color, renderable))
      this.yogaHost.stageScene(this);
  }
  setFillDimsImages(renderable, on) {
    this.flushStaged();
    this.driver.renderLib.sceneSetFillDimsImages(this.driver.context, renderable._getSceneHandle(this), on);
  }
  setBoxDetails(renderable, details) {
    this.flushStaged();
    this.driver.renderLib.sceneSetBoxDetails(this.driver.context, renderable._getSceneHandle(this), details);
  }
  setBoxBorderStyle(renderable, style, sides) {
    this.setPaint(renderable, { borderStyle: style, border: sides, resetBorderCharacters: true });
  }
  setText(renderable, content) {
    this.flushStaged();
    const node = renderable._getSceneHandle(this);
    if (typeof content === "string") {
      this.driver.renderLib.sceneSetText(this.driver.context, node, this.driver.renderLib.encoder.encode(content));
    } else {
      this.driver.renderLib.sceneSetStyledText(this.driver.context, node, content);
    }
  }
  setTextOptions(renderable, options) {
    this.flushStaged();
    this.driver.renderLib.sceneSetTextOptions(this.driver.context, renderable._getSceneHandle(this), options);
  }
  setSlider(renderable, options) {
    this.flushStaged();
    this.driver.renderLib.sceneSetSlider(this.driver.context, renderable._getSceneHandle(this), options);
  }
  getSliderThumb(renderable) {
    this.flushStaged();
    return this.driver.renderLib.sceneGetSliderThumb(this.driver.context, renderable._getSceneHandle(this));
  }
  setArrow(renderable, options) {
    this.flushStaged();
    this.driver.renderLib.sceneSetArrow(this.driver.context, renderable._getSceneHandle(this), options);
  }
  setImage(renderable, image, fit, protocol, buffer, placementOpacity) {
    this.flushStaged();
    const { renderLib: lib, context } = this.driver;
    lib.sceneSetImage(context, renderable._getSceneHandle(this), image?._getContextHandle(lib, context) ?? null, fit, protocol, buffer?._getSceneHandle(this) ?? null, placementOpacity ?? null);
  }
  setScroll(renderable, options) {
    this.flushStaged();
    this.driver.renderLib.sceneSetScroll(this.driver.context, renderable._getSceneHandle(this), options);
    this.changeLayout();
  }
  setScrollArrow(renderable, axis, end, options) {
    this.flushStaged();
    this.driver.renderLib.sceneSetScrollArrow(this.driver.context, renderable._getSceneHandle(this), axis, end, options);
  }
  scrollTo(renderable, x, y, relativeX, relativeY, reapply = false) {
    this.flushStaged();
    const handle = renderable._getSceneHandle(this);
    const state = this.driver.renderLib.sceneScrollTo(this.driver.context, handle, x, y, relativeX, relativeY, reapply);
    this.changeLayout();
    return state;
  }
  scrollRequest(renderable, kind, target, align, inset) {
    this.flushStaged();
    const { renderLib: lib, context } = this.driver;
    const handle = renderable._getSceneHandle(this);
    const state = lib.sceneScrollRequest(context, handle, kind, target?._getSceneHandle(this) ?? null, align, inset);
    this.changeLayout();
    return state;
  }
  getScroll(renderable) {
    this.flushStaged();
    return this.driver.renderLib.sceneGetScroll(this.driver.context, renderable._getSceneHandle(this));
  }
  setEditorView(renderable, view) {
    this.flushStaged();
    this.driver.renderLib.sceneSetEditorView(this.driver.context, renderable._getSceneHandle(this), view);
  }
  setSurface(renderable, buffer) {
    this.flushStaged();
    this.driver.renderLib.sceneSetSurface(this.driver.context, renderable._getSceneHandle(this), buffer?._getSceneHandle(this) ?? null);
  }
  setTextView(renderable, view) {
    this.flushStaged();
    this.driver.renderLib.sceneSetTextView(this.driver.context, renderable._getSceneHandle(this), view);
  }
  setTextViewPaint(renderable, enabled) {
    this.flushStaged();
    this.driver.renderLib.sceneSetTextViewPaint(this.driver.context, renderable._getSceneHandle(this), enabled);
  }
  setEditorOptions(renderable, options) {
    this.flushStaged();
    this.driver.renderLib.sceneSetEditorOptions(this.driver.context, renderable._getSceneHandle(this), options);
  }
  getText(renderable) {
    this.flushStaged();
    return this.driver.renderLib.sceneGetText(this.driver.context, renderable._getSceneHandle(this));
  }
  drawBody(renderable, buffer, x, y) {
    this.flushStaged();
    buffer._drawSceneBody(this, renderable._getSceneHandle(this), x, y);
  }
  setTextSelection(renderable, operation, bounds, bg, fg) {
    this.flushStaged();
    return this.driver.renderLib.sceneSetTextSelection(this.driver.context, renderable._getSceneHandle(this), {
      operation,
      anchorX: bounds?.anchorX ?? 0,
      anchorY: bounds?.anchorY ?? 0,
      focusX: bounds?.focusX ?? 0,
      focusY: bounds?.focusY ?? 0,
      behavior: bounds?.behavior ?? "cell",
      bg,
      fg
    });
  }
  getTextSelection(renderable) {
    this.flushStaged();
    return this.driver.renderLib.sceneGetTextSelection(this.driver.context, renderable._getSceneHandle(this));
  }
  getSelectedText(renderable) {
    this.flushStaged();
    return this.driver.renderLib.sceneGetSelectedText(this.driver.context, renderable._getSceneHandle(this));
  }
  getTextLineInfo(renderable, firstLine, lineCount) {
    this.flushStaged();
    const handle = renderable._getSceneHandle(this);
    return this.driver.renderLib.sceneGetTextLineInfo(this.driver.context, handle, firstLine, lineCount);
  }
  getTextMetrics(renderable) {
    this.flushStaged();
    return this.driver.renderLib.sceneGetTextMetrics(this.driver.context, renderable._getSceneHandle(this));
  }
  getLayout(node, rawYoga = false) {
    const handle = node._getSceneHandle(this);
    this.flushStaged();
    return this.driver.renderLib.sceneGetLayout(this.driver.context, handle, rawYoga);
  }
  measureSnapshot(root) {
    this.yogaHost.assertMutable();
    this.assertAlive();
    if (this.frame)
      throw new Error("Cannot measure a snapshot during a native scene frame");
    const owner = this.renderer.root;
    root._getSceneHandle(this);
    const attached = root.parent === owner;
    if (root === owner || root.parent && !attached)
      throw new Error("Snapshot root belongs to another parent");
    if (!attached)
      owner.add(root);
    try {
      this.runLifecyclePasses();
      this.assertAlive();
      this.flushStaged();
      try {
        this.driver.renderLib.sceneMeasureLayout(this.driver.context, this.driver.session, owner._getSceneHandle(this));
      } finally {
        this.changeLayout();
      }
      return Math.max(1, Math.trunc(this.getLayout(root, true).height));
    } finally {
      if (!attached && root.parent === owner)
        owner.remove(root);
    }
  }
  paint(deltaTime, getPaintOptions) {
    this.yogaHost.assertMutable();
    this.assertAlive();
    if (this.paintedFrame)
      throw new Error("Native scene is already painting a frame");
    this.renderer.root._setCurrentRenderable(undefined);
    this.runLifecyclePasses();
    this.advancePaint(deltaTime, getPaintOptions);
  }
  runLifecyclePasses() {
    if (this.renderer.root.visible) {
      let visits = 0;
      for (const renderable of this.lifecyclePasses.iteratePending()) {
        if (this.stopped || this.renderer.controlState === "explicit_suspended" /* EXPLICIT_SUSPENDED */)
          return;
        if (++visits > maxHostRequests)
          throw new Error("Native scene lifecycle work limit exceeded");
        if (!renderable.isDestroyed) {
          renderable.onLifecyclePass?.call(renderable);
        }
      }
    }
  }
  advancePaint(deltaTime, getPaintOptions) {
    let request = null;
    let recording = null;
    try {
      while (!this.stopped) {
        const options = { ...getPaintOptions(), maxLayoutRounds, maxHostRequests };
        if (this.stopped || this.renderer.controlState === "explicit_suspended" /* EXPLICIT_SUSPENDED */)
          return;
        this.flushStaged();
        try {
          request = this.driver.renderLib.sceneFrameStep(this.driver.context, this.driver.session, request, options, recording);
        } finally {
          this.changeLayout();
          this.paintRecording?.recorder.settle();
        }
        recording = null;
        if (request.kind === NativeSceneFrame.Done) {
          this.paintedFrame = request;
          return;
        }
        if (!sameHandle(request.session, this.driver.session) || !sameHandle(request.root, this.renderer.root._getSceneHandle(this))) {
          throw new Error("Native scene returned a stale host request");
        }
        if (request.kind === NativeSceneFrame.Record) {
          recording = this.recordPaint(request, deltaTime);
          continue;
        }
        const renderable = this.nodes.get(request.num);
        if (!renderable || renderable.isDestroyed)
          continue;
        if (!sameHandle(request.node, renderable._getSceneHandle(this))) {
          throw new Error("Native scene returned a stale host request");
        }
        renderable._runNativeSceneHook(request, deltaTime);
      }
    } finally {
      this.paintRecording?.recorder.settle();
      if (request && request !== this.paintedFrame)
        this.cancelAttempt(request);
    }
  }
  cancelAttempt(request) {
    if (this.driver.disposed)
      return;
    this.changeLayout();
    try {
      this.driver.renderLib.sceneFrameCancel(this.driver.context, this.driver.session, request.frameId);
    } catch {}
  }
  recordPaint(request, deltaTime) {
    const { renderLib: lib, context, session } = this.driver;
    const slots = lib.sceneFrameGetPaintSlots(context, session, request);
    const paint = this.paintRecording ??= this.createPaintRecording();
    const revision = this.layoutRevision;
    paint.recorder.begin(context);
    try {
      for (let index = 0;index < slots.length; index++) {
        if (this.stopped)
          return null;
        const slot = slots[index];
        const renderable = this.nodes.get(slot.num);
        if (!renderable || renderable.isDestroyed)
          continue;
        if (!sameHandle(slot.node, renderable._getSceneHandle(this))) {
          throw new Error("Native scene returned a stale paint slot");
        }
        this.renderer.root._setCurrentRenderable(renderable);
        renderable._recordNativeScenePaint(slot, index, deltaTime, paint.buffer, paint.recorder, this.layoutRevision === revision ? slot.publicLayout : undefined);
        this.renderer.root._setCurrentRenderable(undefined);
      }
      return paint.recorder.recording;
    } finally {
      paint.recorder.end();
    }
  }
  createPaintRecording() {
    const recorder = new NativePaintRecorder;
    const { renderLib: lib, context, session } = this.driver;
    return { recorder, buffer: OptimizedBuffer.fromRecorder(lib, context, session, recorder) };
  }
  commit(force = false) {
    const frame = this.paintedFrame;
    if (!frame)
      throw new Error("Native scene has no painted frame");
    const result = this.driver.render(force, frame);
    this.paintedFrame = null;
    return result;
  }
  commitSplit(commits, pinnedRenderOffset, force) {
    const frame = this.paintedFrame;
    if (!frame)
      throw new Error("Native scene has no painted frame");
    const result = this.driver.renderSplit(frame, commits, pinnedRenderOffset, force);
    this.paintedFrame = null;
    return result;
  }
  cancelFrame() {
    const frame = this.paintedFrame;
    this.paintedFrame = null;
    if (frame)
      this.cancelAttempt(frame);
  }
  hitTest(x, y) {
    this.assertAlive();
    const id = this.driver.renderLib.sceneHitTest(this.driver.context, this.driver.session, x, y);
    const renderable = this.nodes.get(id);
    return renderable && !renderable.isDestroyed ? id : 0;
  }
  destroy() {
    if (this.destroyed || this.destroying)
      return;
    this.yogaHost.assertMutable();
    this.destroying = true;
    this.staging.clear();
    this.yogaHost.forgetScene(this);
    let failure;
    try {
      for (const renderable of this.nodes.values()) {
        try {
          renderable.destroyRecursively();
        } catch (error) {
          failure ??= { error };
        }
      }
      this.destroyed = this.nodes.size === 0;
    } finally {
      this.staging.clear();
      this.yogaHost.forgetScene(this);
      this.destroying = false;
    }
    if (failure)
      throw failure.error;
  }
}
function sameHandle(left, right) {
  return left.contextId === right.contextId && left.slot === right.slot && left.generation === right.generation;
}

// src/renderer.ts
import { EventEmitter as EventEmitter4 } from "events";

// src/lib/objects-in-viewport.ts
function getObjectsInViewport(viewport, objects, direction = "column", padding = 10, minTriggerSize = 16) {
  if (viewport.width <= 0 || viewport.height <= 0) {
    return [];
  }
  if (objects.length === 0) {
    return [];
  }
  if (objects.length < minTriggerSize) {
    return objects;
  }
  const viewportTop = viewport.y - padding;
  const viewportBottom = viewport.y + viewport.height + padding;
  const viewportLeft = viewport.x - padding;
  const viewportRight = viewport.x + viewport.width + padding;
  const isRow = direction === "row";
  const children = objects;
  const totalChildren = children.length;
  if (totalChildren === 0)
    return [];
  const vpStart = isRow ? viewportLeft : viewportTop;
  const vpEnd = isRow ? viewportRight : viewportBottom;
  let lo = 0;
  let hi = totalChildren - 1;
  let candidate = -1;
  while (lo <= hi) {
    const mid = lo + hi >> 1;
    const c = children[mid];
    const start = isRow ? c.screenX : c.screenY;
    const end = isRow ? c.screenX + c.width : c.screenY + c.height;
    if (end < vpStart) {
      lo = mid + 1;
    } else if (start > vpEnd) {
      hi = mid - 1;
    } else {
      candidate = mid;
      break;
    }
  }
  const visibleChildren = [];
  if (candidate === -1) {
    candidate = lo > 0 ? lo - 1 : 0;
  }
  const maxLookBehind = 50;
  let left = candidate;
  let gapCount = 0;
  while (left - 1 >= 0) {
    const prev = children[left - 1];
    const prevEnd = isRow ? prev.screenX + prev.width : prev.screenY + prev.height;
    if (prevEnd <= vpStart) {
      gapCount++;
      if (gapCount >= maxLookBehind) {
        break;
      }
    } else {
      gapCount = 0;
    }
    left--;
  }
  let right = candidate + 1;
  while (right < totalChildren) {
    const next = children[right];
    if ((isRow ? next.screenX : next.screenY) >= vpEnd)
      break;
    right++;
  }
  for (let i = left;i < right; i++) {
    const child = children[i];
    const start = isRow ? child.screenX : child.screenY;
    const end = isRow ? child.screenX + child.width : child.screenY + child.height;
    if (end <= vpStart)
      continue;
    if (start >= vpEnd)
      break;
    if (isRow) {
      const childBottom = child.screenY + child.height;
      if (childBottom < viewportTop)
        continue;
      const childTop = child.screenY;
      if (childTop > viewportBottom)
        continue;
    } else {
      const childRight = child.screenX + child.width;
      if (childRight < viewportLeft)
        continue;
      const childLeft = child.screenX;
      if (childLeft > viewportRight)
        continue;
    }
    visibleChildren.push(child);
  }
  if (visibleChildren.length > 1) {
    visibleChildren.sort((a, b) => a.zIndex > b.zIndex ? 1 : a.zIndex < b.zIndex ? -1 : 0);
  }
  return visibleChildren;
}

// src/lib/render-geometry.ts
function calculateRenderGeometry(screenMode, terminalWidth, terminalHeight, footerHeight) {
  const safeTerminalWidth = Math.max(terminalWidth, 0);
  const safeTerminalHeight = Math.max(terminalHeight, 0);
  if (screenMode !== "split-footer") {
    return {
      effectiveFooterHeight: 0,
      renderOffset: 0,
      renderWidth: safeTerminalWidth,
      renderHeight: safeTerminalHeight
    };
  }
  const effectiveFooterHeight = Math.min(footerHeight, safeTerminalHeight);
  return {
    effectiveFooterHeight,
    renderOffset: safeTerminalHeight - effectiveFooterHeight,
    renderWidth: safeTerminalWidth,
    renderHeight: effectiveFooterHeight
  };
}

// src/lib/terminal-capability-detection.ts
function isCapabilityResponse(sequence) {
  if (/\x1b\[\?\d+(?:;\d+)*\$y/.test(sequence)) {
    return true;
  }
  if (/\x1bP>\|[\s\S]*?\x1b\\/.test(sequence)) {
    return true;
  }
  if (/\x1bP(?:1\+r4d73(?:=[^\x1b]*)?|0\+r(?:4d73)?)\x1b\\/i.test(sequence)) {
    return true;
  }
  if (/\x1b_G[\s\S]*?\x1b\\/.test(sequence)) {
    return true;
  }
  if (/\x1b\[\?\d+(?:;\d+)?u/.test(sequence)) {
    return true;
  }
  if (/\x1b\[\?[0-9;]*c/.test(sequence)) {
    return true;
  }
  if (/\x1b\]99;[^\x07\x1b]*i=opentui-notifications[^\x07\x1b]*p=\?[\s\S]*?(?:\x07|\x1b\\)/.test(sequence)) {
    return true;
  }
  if (/\x1b\]1337;Capabilities=[\s\S]*?(?:\x07|\x1b\\)/.test(sequence)) {
    return true;
  }
  if (/\x1b\]7501; *\?[^\x07\x1b]*(?:\x07|\x1b\\)/.test(sequence)) {
    return true;
  }
  return false;
}
function isExplicitWidthReport(sequence) {
  return /\x1b\[1;(?!1R)\d+R/.test(sequence);
}
function isPixelResolutionResponse(sequence) {
  return /\x1b\[4;\d+;\d+t/.test(sequence);
}
function parsePixelResolution(sequence) {
  const match = sequence.match(/\x1b\[4;(\d+);(\d+)t/);
  if (match) {
    const width = Number(match[2]);
    const height = Number(match[1]);
    if (!Number.isSafeInteger(width) || !Number.isSafeInteger(height) || width > 2147483647 || height > 2147483647)
      return null;
    return { width, height };
  }
  return null;
}

// src/lib/stdin-parser-native.ts
import { Buffer as Buffer2 } from "buffer";
var RECORD_CAPACITY = 64;
var PAYLOAD_CAPACITY = 16 * 1024;
var RECORD = nativeLayouts.ot_input_event;
var FIELD = {
  kind: RECORD.fields.kind.offset,
  action: RECORD.fields.action.offset,
  modifiers: RECORD.fields.modifiers.offset,
  flags: RECORD.fields.flags.offset,
  code: RECORD.fields.code.offset / 4,
  baseCode: RECORD.fields.base_code.offset / 4,
  x: RECORD.fields.x.offset / 2,
  y: RECORD.fields.y.offset / 2,
  rawOffset: RECORD.fields.raw_offset.offset / 4,
  rawLength: RECORD.fields.raw_len.offset / 4,
  textOffset: RECORD.fields.text_offset.offset / 4,
  textLength: RECORD.fields.text_len.offset / 4
};
var C = nativeConstants;
var EMPTY = new Uint8Array(0);
var UTF8 = new TextDecoder;
var MOUSE_TYPES = {
  [C.OT_INPUT_MOUSE_DOWN]: "down",
  [C.OT_INPUT_MOUSE_UP]: "up",
  [C.OT_INPUT_MOUSE_MOVE]: "move",
  [C.OT_INPUT_MOUSE_DRAG]: "drag",
  [C.OT_INPUT_MOUSE_SCROLL]: "scroll"
};
var SCROLL_DIRECTIONS = ["up", "down", "left", "right"];
var NO_EXPECTATIONS = {
  kittyKeyboardEnabled: false,
  privateCapabilityRepliesActive: false,
  pixelResolutionQueryActive: false,
  explicitWidthCprActive: false,
  startupCursorCprActive: false,
  replySentinelActive: false
};
var REPLY_PROTOCOLS = {
  [C.OT_INPUT_REPLY_CSI]: "csi",
  [C.OT_INPUT_REPLY_SS3]: "unknown",
  [C.OT_INPUT_REPLY_OSC]: "osc",
  [C.OT_INPUT_REPLY_DCS]: "dcs",
  [C.OT_INPUT_REPLY_APC]: "apc"
};
var LEGACY_CODE_RE = /^\x1b+(O|\[\[?)(?:(\d+)(?:;\d+)?([~^$])|(?:1;)?\d*([a-zA-Z]))/;
var LEGACY_SEQUENCE_RE = /^\x1b\x1b?[[O]./s;
var KEYPAD_TEXT = new Set(Object.values(printableKeypadText));
function concat(parts) {
  let length = 0;
  for (const part of parts)
    length += part.length;
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const part of parts) {
    bytes.set(part, offset);
    offset += part.length;
  }
  return bytes;
}
function latin1(bytes) {
  return Buffer2.from(bytes.buffer, bytes.byteOffset, bytes.byteLength).toString("latin1");
}
function expectationFlags(context) {
  const cursorPosition = context.explicitWidthCprActive || context.startupCursorCprActive;
  const replies = context.privateCapabilityRepliesActive || context.pixelResolutionQueryActive || cursorPosition;
  return (replies ? C.OT_INPUT_EXPECT_REPLIES : 0) | (context.kittyKeyboardEnabled ? C.OT_INPUT_EXPECT_KITTY_KEYBOARD : 0) | (cursorPosition ? C.OT_INPUT_EXPECT_CURSOR_POSITION : 0) | (context.replySentinelActive ? C.OT_INPUT_EXPECT_SENTINEL : 0);
}

class NativeStdinParser {
  lib;
  context;
  session;
  ownsContext;
  records = new Uint8Array(RECORD_CAPACITY * RECORD.size);
  words = new Uint32Array(this.records.buffer);
  halves = new Uint16Array(this.records.buffer);
  payload = new Uint8Array(PAYLOAD_CAPACITY);
  events = [];
  clock;
  armTimeouts;
  onTimeoutFlush;
  protocolContext;
  appliedExpectations = 0;
  timeoutId = null;
  deadlineNs = null;
  lastNs = 0n;
  paste = null;
  suspended = false;
  sessionGone = false;
  destroyed = false;
  constructor(options = {}) {
    this.clock = options.clock ?? new SystemClock;
    this.armTimeouts = options.armTimeouts ?? true;
    this.onTimeoutFlush = options.onTimeoutFlush ?? null;
    this.protocolContext = { ...NO_EXPECTATIONS, ...options.protocolContext };
    if (options.session) {
      this.lib = options.session.lib;
      this.context = options.session.context;
      this.session = options.session.session;
      this.ownsContext = false;
    } else {
      this.lib = resolveRenderLib();
      this.context = this.lib.createContext({ objectCapacity: 4, renderCellsMax: 1 });
      try {
        this.session = this.lib.createSession(this.context, { chunkSize: 4096, spanCapacity: 2, maxBytes: 8192n });
      } catch (error) {
        this.destroyContext();
        throw error;
      }
      this.ownsContext = true;
    }
    try {
      this.applyExpectations();
    } catch (error) {
      if (this.ownsContext)
        this.destroyContext();
      throw error;
    }
  }
  updateProtocolContext(patch) {
    this.ensureAlive();
    this.protocolContext = { ...this.protocolContext, ...patch };
    this.native(() => {
      this.applyExpectations();
      this.feed(EMPTY, this.nowNs());
    });
    this.reconcileTimeout(this.events.length > 0);
  }
  get pasting() {
    return this.paste !== null;
  }
  push(data) {
    this.ensureAlive();
    this.native(() => this.feed(data, this.nowNs()));
    this.reconcileTimeout();
  }
  read() {
    this.ensureAlive();
    return this.events.shift() ?? null;
  }
  drain(onEvent) {
    this.ensureAlive();
    while (!this.destroyed) {
      const event = this.events.shift();
      if (!event)
        return;
      onEvent(event);
    }
  }
  flushTimeout(nowMsValue = this.clock.now()) {
    this.ensureAlive();
    this.native(() => this.feed(EMPTY, this.toNs(nowMsValue)));
    this.reconcileTimeout();
  }
  suspend() {
    this.ensureAlive();
    this.suspended = true;
    this.clearTimeout();
  }
  resume() {
    this.ensureAlive();
    this.suspended = false;
    this.native(() => this.lib.sessionInputReset(this.context, this.session, C.OT_INPUT_RESET_KEEP_REPLY));
    this.paste = null;
    this.deadlineNs = null;
  }
  reset() {
    if (this.destroyed)
      return;
    this.clearTimeout();
    this.native(() => this.lib.sessionInputReset(this.context, this.session, 0));
    this.events.length = 0;
    this.paste = null;
    this.deadlineNs = null;
  }
  destroy() {
    if (this.destroyed)
      return;
    this.clearTimeout();
    this.destroyed = true;
    this.events.length = 0;
    this.paste = null;
    if (this.ownsContext)
      this.destroyContext();
  }
  ensureAlive() {
    if (this.destroyed)
      throw new Error("StdinParser has been destroyed");
  }
  native(call) {
    if (this.sessionGone)
      return;
    try {
      call();
    } catch (error) {
      if (!(error instanceof NativeError) || error.status !== -12 /* SessionClosed */ && error.status !== -15 /* OutputFailed */ && error.status !== -9 /* StaleHandle */ && error.status !== -7 /* WrongContext */) {
        throw error;
      }
      this.sessionGone = true;
      this.deadlineNs = null;
      this.paste = null;
      this.clearTimeout();
    }
  }
  destroyContext() {
    this.lib.getYogaHost().runMutation(() => this.lib.destroyContext(this.context));
  }
  applyExpectations() {
    const flags = expectationFlags(this.protocolContext);
    if (flags === this.appliedExpectations)
      return;
    this.lib.sessionInputExpect(this.context, this.session, flags);
    this.appliedExpectations = flags;
  }
  toNs(ms) {
    const ns = BigInt(Math.max(0, Math.round(ms * 1e6)));
    return ns > this.lastNs ? ns : this.lastNs;
  }
  nowNs() {
    return this.suspended ? this.lastNs : this.toNs(this.clock.now());
  }
  feed(bytes, nowNs) {
    this.lastNs = nowNs;
    let offset = 0;
    do {
      const rest = offset === 0 ? bytes : bytes.subarray(offset);
      const drain = this.lib.sessionInputFeed(this.context, this.session, rest, nowNs, this.records, this.payload);
      this.deadlineNs = drain.deadlineNs;
      for (let index = 0;index < drain.count; index++)
        this.translate(index);
      if (drain.consumed === 0 && drain.count === 0 && offset < bytes.length) {
        throw new Error("native input parser made no progress");
      }
      offset += drain.consumed;
    } while (offset < bytes.length);
  }
  reconcileTimeout(flushNow = false) {
    if (!this.armTimeouts)
      return;
    this.clearTimeout();
    const deadline = flushNow ? null : this.deadlineNs;
    if (deadline === null && !flushNow || this.suspended || this.sessionGone)
      return;
    const delayMs = deadline === null ? 0 : Number((deadline - this.lastNs + 999999n) / 1000000n);
    this.timeoutId = this.clock.setTimeout(() => {
      this.timeoutId = null;
      if (this.destroyed)
        return;
      try {
        const now = this.nowNs();
        this.native(() => this.feed(EMPTY, deadline !== null && now < deadline ? deadline : now));
        this.reconcileTimeout();
        this.onTimeoutFlush?.();
      } catch (error) {
        console.error("stdin parser timeout flush failed", error);
      }
    }, delayMs);
  }
  clearTimeout() {
    if (this.timeoutId === null)
      return;
    this.clock.clearTimeout(this.timeoutId);
    this.timeoutId = null;
  }
  span(offset, length) {
    return this.payload.subarray(offset, offset + length);
  }
  translate(index) {
    const base = index * RECORD.size;
    const word = base / 4;
    const half = base / 2;
    const kind = this.records[base + FIELD.kind];
    const action = this.records[base + FIELD.action];
    const modifiers = this.records[base + FIELD.modifiers];
    const flags = this.records[base + FIELD.flags];
    const code = this.words[word + FIELD.code];
    const raw = this.span(this.words[word + FIELD.rawOffset], this.words[word + FIELD.rawLength]);
    const text = this.span(this.words[word + FIELD.textOffset], this.words[word + FIELD.textLength]);
    switch (kind) {
      case C.OT_INPUT_KEY: {
        const key = parsedKey(code, this.words[word + FIELD.baseCode], action, modifiers, flags, raw, text);
        this.events.push({ type: "key", raw: key.raw, key });
        return;
      }
      case C.OT_INPUT_MOUSE: {
        const sequence = latin1(raw);
        const encoding = raw[2] === 60 ? "sgr" : "x10";
        const event = rawMouseEvent(action, code, this.halves[half + FIELD.x], this.halves[half + FIELD.y], modifiers, encoding);
        this.events.push({ type: "mouse", raw: sequence, encoding, event });
        return;
      }
      case C.OT_INPUT_PASTE: {
        if (flags & C.OT_INPUT_PASTE_START)
          this.paste = [];
        if (text.length > 0)
          this.paste.push(Uint8Array.from(text));
        if (flags & C.OT_INPUT_PASTE_END) {
          const parts = this.paste;
          this.paste = null;
          this.events.push({ type: "paste", bytes: parts.length === 1 ? parts[0] : concat(parts) });
        }
        return;
      }
      case C.OT_INPUT_FOCUS:
        this.events.push({ type: "response", protocol: "csi", sequence: latin1(raw) });
        return;
      case C.OT_INPUT_REPLY: {
        const protocol = flags & C.OT_INPUT_REPLY_CURSOR_POSITION ? "cpr" : flags & C.OT_INPUT_REPLY_FRAGMENT ? "unknown" : REPLY_PROTOCOLS[code];
        this.events.push({ type: "response", protocol, sequence: latin1(raw) });
        return;
      }
    }
    throw new Error(`Unknown native input event kind: ${kind}`);
  }
}
function keyRaw(raw) {
  if (raw.length === 1 && raw[0] >= 128)
    return "\x1B" + String.fromCharCode(raw[0] & 127);
  return UTF8.decode(raw);
}
function compatCode(raw, code, kitty) {
  if (kitty) {
    if (!raw.endsWith("u") || kittyKeyMap[code] === undefined)
      return;
    return `[${/^\x1b+\[(\d+)/.exec(raw)[1]}u`;
  }
  if (kittyKeyMap[code] === undefined && !KEYPAD_TEXT.has(String.fromCodePoint(code)))
    return;
  const match = LEGACY_CODE_RE.exec(raw);
  return match ? [match[1], match[2], match[3], match[4]].filter(Boolean).join("") : undefined;
}
function parsedKey(code, baseCode, action, modifiers, flags, rawBytes, textBytes) {
  const kitty = (flags & C.OT_INPUT_KEY_KITTY) !== 0;
  const raw = keyRaw(rawBytes);
  const text = textBytes.length === 0 ? "" : UTF8.decode(textBytes);
  const alt = (modifiers & C.OT_INPUT_MOD_ALT) !== 0;
  const sequence = kitty || LEGACY_SEQUENCE_RE.test(raw);
  let shift = (modifiers & C.OT_INPUT_MOD_SHIFT) !== 0;
  let name;
  if (code === 0) {
    name = text;
  } else if (kittyKeyMap[code] !== undefined) {
    name = code === C.OT_INPUT_KEY_ENTER && !kitty && raw.endsWith(`
`) ? "linefeed" : kittyKeyMap[code];
  } else if (code === 32) {
    name = "space";
  } else {
    name = String.fromCodePoint(code);
    if (!sequence && code >= 65 && code <= 90) {
      shift = true;
      if (!alt)
        name = name.toLowerCase();
    }
  }
  const key = {
    name,
    ctrl: (modifiers & C.OT_INPUT_MOD_CTRL) !== 0,
    meta: alt || (modifiers & C.OT_INPUT_MOD_META) !== 0,
    shift,
    option: alt && sequence,
    sequence: text || raw,
    number: /^[0-9]$/.test(name),
    raw,
    eventType: action === C.OT_INPUT_KEY_RELEASE ? "release" : "press",
    source: kitty ? "kitty" : "raw",
    super: (modifiers & C.OT_INPUT_MOD_SUPER) !== 0,
    hyper: (modifiers & C.OT_INPUT_MOD_HYPER) !== 0,
    capsLock: (modifiers & C.OT_INPUT_MOD_CAPS_LOCK) !== 0,
    numLock: (modifiers & C.OT_INPUT_MOD_NUM_LOCK) !== 0
  };
  if (action === C.OT_INPUT_KEY_REPEAT)
    key.repeated = true;
  if (baseCode !== 0)
    key.baseCode = baseCode;
  const legacy = compatCode(raw, code, kitty);
  if (legacy !== undefined)
    key.code = legacy;
  return key;
}
function rawMouseEvent(action, code, x, y, modifiers, encoding) {
  const type = MOUSE_TYPES[action];
  if (!type)
    throw new Error(`Unknown native mouse action: ${action}`);
  let button = code;
  if (code === C.OT_INPUT_MOUSE_BUTTON_NONE)
    button = encoding === "x10" ? -1 : 0;
  if (type === "scroll")
    button = encoding === "x10" || code === 3 ? 0 : code;
  const event = {
    type,
    button,
    x,
    y,
    modifiers: {
      shift: (modifiers & C.OT_INPUT_MOD_SHIFT) !== 0,
      alt: (modifiers & C.OT_INPUT_MOD_ALT) !== 0,
      ctrl: (modifiers & C.OT_INPUT_MOD_CTRL) !== 0
    }
  };
  if (type === "scroll")
    event.scroll = { direction: SCROLL_DIRECTIONS[code & 3], delta: 1 };
  return event;
}
var SHADOW_BACKLOG_MAX = 256;
var SHADOW_WINDOW = 8;
function describeEvent(event) {
  switch (event.type) {
    case "key": {
      const { name, ctrl, meta, shift, eventType } = event.key;
      return JSON.stringify(["key", event.raw, name, ctrl, meta, shift, eventType]);
    }
    case "mouse": {
      const { type, button, x, y, modifiers } = event.event;
      return JSON.stringify(["mouse", event.raw, type, button, x, y, modifiers.shift, modifiers.alt, modifiers.ctrl]);
    }
    case "paste":
      return JSON.stringify(["paste", event.bytes.length, Buffer2.from(event.bytes).toString("base64")]);
    case "response":
      return JSON.stringify(["response", event.protocol, event.sequence]);
  }
}

class StdinShadowComparator {
  primaryName;
  log;
  delivered = [];
  shadowed = [];
  constructor(primaryName, log) {
    this.primaryName = primaryName;
    this.log = log;
  }
  primary(event) {
    this.queue(this.delivered, event);
  }
  shadow(event) {
    this.queue(this.shadowed, event);
  }
  flush() {
    this.pair(true);
  }
  queue(events, event) {
    events.push(describeEvent(event));
    this.pair(false);
    if (events.length > SHADOW_BACKLOG_MAX) {
      const dropped = events.shift();
      if (events === this.delivered)
        this.report(dropped, "");
      else
        this.report("", dropped);
    }
  }
  pair(final) {
    const { delivered, shadowed } = this;
    while (delivered.length > 0 && shadowed.length > 0) {
      const [i, j] = commonEvent(delivered, shadowed) ?? [-1, -1];
      if (i >= 0) {
        for (let k = 0;k < Math.max(i, j); k++)
          this.report(k < i ? delivered[k] : "", k < j ? shadowed[k] : "");
        delivered.splice(0, i + 1);
        shadowed.splice(0, j + 1);
      } else if (final || Math.min(delivered.length, shadowed.length) >= SHADOW_WINDOW) {
        this.report(delivered.shift(), shadowed.shift());
      } else
        return;
    }
    if (final) {
      for (const event of delivered.splice(0))
        this.report(event, "");
      for (const event of shadowed.splice(0))
        this.report("", event);
    }
  }
  report(delivered, shadowed) {
    const shadowName = this.primaryName === "native" ? "legacy" : "native";
    this.log(`[stdin-shadow] ${this.primaryName}=${delivered || "none"} ${shadowName}=${shadowed || "none"}`);
  }
}
function commonEvent(a, b) {
  const aEnd = Math.min(a.length, SHADOW_WINDOW);
  const bEnd = Math.min(b.length, SHADOW_WINDOW);
  for (let sum = 0;sum < aEnd + bEnd - 1; sum++) {
    for (let i = Math.max(0, sum - bEnd + 1);i <= Math.min(sum, aEnd - 1); i++) {
      if (a[i] === b[sum - i])
        return [i, sum - i];
    }
  }
  return null;
}

// src/renderer-theme-mode.ts
var OSC_THEME_RESPONSE = /\x1b](10|11);(?:(?:rgb:)([0-9a-fA-F]+)\/([0-9a-fA-F]+)\/([0-9a-fA-F]+)|#([0-9a-fA-F]{6}))(?:\x07|\x1b\\)/g;
function scaleOscThemeComponent(component) {
  const value = parseInt(component, 16);
  const maxValue = (1 << 4 * component.length) - 1;
  return Math.round(value / maxValue * 255).toString(16).padStart(2, "0");
}
function oscThemeColorToHex(r, g, b, hex6) {
  if (hex6) {
    return `#${hex6.toLowerCase()}`;
  }
  if (r && g && b) {
    return `#${scaleOscThemeComponent(r)}${scaleOscThemeComponent(g)}${scaleOscThemeComponent(b)}`;
  }
  return "#000000";
}
function inferThemeModeFromBackgroundColor(color) {
  const [r, g, b] = parseColor(color).toInts();
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? "light" : "dark";
}

class RendererThemeMode {
  host;
  clock;
  static QUERY_TIMEOUT_MS = 250;
  _themeMode = null;
  themeRefreshTimeoutId = null;
  waiters = new Set;
  constructor(host, clock) {
    this.host = host;
    this.clock = clock;
  }
  get themeMode() {
    return this._themeMode;
  }
  waitForThemeMode(timeoutMs, isDestroyed) {
    if (this._themeMode !== null || isDestroyed || timeoutMs === 0) {
      return Promise.resolve(this._themeMode);
    }
    return new Promise((resolve) => {
      const waiter = {
        resolve,
        timeoutHandle: null
      };
      if (timeoutMs > 0) {
        waiter.timeoutHandle = this.clock.setTimeout(() => {
          this.waiters.delete(waiter);
          waiter.timeoutHandle = null;
          resolve(this._themeMode);
        }, timeoutMs);
      }
      this.waiters.add(waiter);
    });
  }
  dispose() {
    this.cancelRefresh();
    for (const waiter of this.waiters) {
      if (waiter.timeoutHandle !== null) {
        this.clock.clearTimeout(waiter.timeoutHandle);
      }
      waiter.resolve(this._themeMode);
    }
    this.waiters.clear();
  }
  handleSequence(sequence) {
    if (sequence === "\x1B[?997;1n" || sequence === "\x1B[?997;2n") {
      this.requestThemeOscColors();
      return { handled: true, changedMode: null };
    }
    let handled = false;
    let background = null;
    let match;
    OSC_THEME_RESPONSE.lastIndex = 0;
    while (match = OSC_THEME_RESPONSE.exec(sequence)) {
      handled = true;
      if (match[1] === "11")
        background = oscThemeColorToHex(match[2], match[3], match[4], match[5]);
    }
    if (background === null) {
      return { handled, changedMode: null };
    }
    this.cancelRefresh();
    return { handled, changedMode: this.applyThemeMode(inferThemeModeFromBackgroundColor(background)) };
  }
  cancelRefresh() {
    if (this.themeRefreshTimeoutId === null) {
      return;
    }
    this.clock.clearTimeout(this.themeRefreshTimeoutId);
    this.themeRefreshTimeoutId = null;
  }
  requestThemeOscColors() {
    if (this.themeRefreshTimeoutId !== null) {
      return;
    }
    this.host.queryThemeColors();
    this.themeRefreshTimeoutId = this.clock.setTimeout(() => {
      this.themeRefreshTimeoutId = null;
    }, RendererThemeMode.QUERY_TIMEOUT_MS);
  }
  applyThemeMode(mode) {
    const changed = this._themeMode !== mode;
    this._themeMode = mode;
    if (!changed) {
      return null;
    }
    for (const waiter of this.waiters) {
      if (waiter.timeoutHandle !== null) {
        this.clock.clearTimeout(waiter.timeoutHandle);
      }
      waiter.resolve(mode);
    }
    this.waiters.clear();
    return mode;
  }
}

// src/renderer.ts
registerEnvVar({
  name: "OTUI_DUMP_CAPTURES",
  description: "Dump captured stdout and console caches when the renderer exit handler runs.",
  type: "boolean",
  default: false
});
registerEnvVar({
  name: "OTUI_USE_ALTERNATE_SCREEN",
  description: "When explicitly set, force screen mode selection: true=alternate-screen, false=main-screen.",
  type: "boolean",
  default: true
});
registerEnvVar({
  name: "OTUI_OVERRIDE_STDOUT",
  description: "When explicitly set, force stdout routing: false=passthrough, true=capture in split-footer mode.",
  type: "boolean",
  default: true
});
registerEnvVar({
  name: "OTUI_DEBUG",
  description: "Enable debug mode to capture all raw input for debugging purposes.",
  type: "boolean",
  default: false
});
registerEnvVar({
  name: "OTUI_STDIN_LOG",
  description: "Write the raw stdin byte stream to this file for debugging.",
  type: "string",
  default: ""
});
registerEnvVar({
  name: "OTUI_SHOW_STATS",
  description: "Show the debug overlay at startup.",
  type: "boolean",
  default: false
});
registerEnvVar({
  name: "OTUI_NATIVE_INPUT_PARSER",
  description: "Parse stdin with the experimental native input parser unless experimental_nativeInput is set.",
  type: "boolean",
  default: false
});
registerEnvVar({
  name: "OTUI_NATIVE_INPUT_SHADOW",
  description: "Also run the other stdin parser and log one line for each event that differs.",
  type: "boolean",
  default: false
});
var KITTY_IMAGE_TRANSPORTS = ["raw", "zlib", "file"];
var DEFAULT_FOOTER_HEIGHT = 12;
var MAX_SCROLLBACK_SURFACE_HEIGHT_PASSES = 4;
var TRANSPARENT_RGBA = RGBA.fromValues(0, 0, 0, 0);
var scrollbackSurfaceCounter = 0;
function normalizeFooterHeight(footerHeight) {
  if (footerHeight === undefined) {
    return DEFAULT_FOOTER_HEIGHT;
  }
  if (!Number.isFinite(footerHeight)) {
    throw new Error("footerHeight must be a finite number");
  }
  const normalizedFooterHeight = Math.trunc(footerHeight);
  if (normalizedFooterHeight <= 0) {
    throw new Error("footerHeight must be greater than 0");
  }
  return normalizedFooterHeight;
}
function resolveModes(config) {
  let screenMode = config.screenMode ?? "alternate-screen";
  if (process.env.OTUI_USE_ALTERNATE_SCREEN !== undefined) {
    screenMode = env.OTUI_USE_ALTERNATE_SCREEN ? "alternate-screen" : "main-screen";
  }
  const footerHeight = screenMode === "split-footer" ? normalizeFooterHeight(config.footerHeight) : DEFAULT_FOOTER_HEIGHT;
  let externalOutputMode = config.externalOutputMode ?? (screenMode === "split-footer" ? "capture-stdout" : "passthrough");
  if (process.env.OTUI_OVERRIDE_STDOUT !== undefined) {
    externalOutputMode = env.OTUI_OVERRIDE_STDOUT && screenMode === "split-footer" ? "capture-stdout" : "passthrough";
  }
  if (externalOutputMode === "capture-stdout" && screenMode !== "split-footer") {
    throw new Error('externalOutputMode "capture-stdout" requires screenMode "split-footer"');
  }
  return {
    screenMode,
    footerHeight,
    externalOutputMode
  };
}
var STDOUT_TAB_WIDTH = 8;
var graphemeSegmenter2 = new Intl.Segmenter(undefined, { granularity: "grapheme" });
function snapshotRowWidths(snapshot, rowColumns) {
  return snapshot.withBuffers(({ width, height, char }) => {
    const widths = [];
    for (let y = 0;y < height; y += 1) {
      let x = rowColumns;
      while (x > 0 && char[y * width + x - 1] === 0)
        x -= 1;
      widths.push(x);
    }
    return widths;
  });
}
function runCleanups(cleanups) {
  let failure;
  for (const cleanup of cleanups) {
    try {
      cleanup();
    } catch (error) {
      failure ??= { error };
    }
  }
  if (failure)
    throw failure.error;
}

class ExternalOutputQueue {
  maxCells;
  commits = [];
  constructor(maxCells) {
    this.maxCells = maxCells;
  }
  owns(snapshot) {
    return this.commits.some((commit) => commit.snapshot === snapshot);
  }
  get size() {
    return this.commits.length;
  }
  writeSnapshots(commits) {
    for (const { rowColumns, snapshot } of commits) {
      if (!Number.isInteger(rowColumns) || rowColumns < 0 || rowColumns > snapshot.width) {
        throw new RangeError("Scrollback commit rowColumns must be an integer from 0 to the snapshot width");
      }
      if (snapshot.width * snapshot.height > this.maxCells) {
        throw new Error("Scrollback snapshot exceeds the Session output capacity");
      }
    }
    const entries = commits.map((commit) => ({
      ...commit,
      cells: commit.snapshot.width * commit.snapshot.height,
      rowWidths: snapshotRowWidths(commit.snapshot, commit.rowColumns)
    }));
    for (const entry of entries)
      this.commits.push(entry);
    return entries;
  }
  batch(limit) {
    if (!(limit >= 1))
      throw new RangeError("ExternalOutputQueue.batch requires a limit of at least 1");
    let count = 0;
    let cells = 0;
    while (count < Math.min(limit, this.commits.length)) {
      cells += this.commits[count].cells;
      if (cells > this.maxCells)
        break;
      count += 1;
    }
    return this.commits.slice(0, count);
  }
  peek(limit = Number.POSITIVE_INFINITY) {
    return this.commits.slice(0, limit);
  }
  claim() {
    const output = this.commits;
    this.commits = [];
    return output;
  }
  drop(count) {
    for (const commit of this.commits.splice(0, count))
      commit.snapshot.destroy();
  }
  clear() {
    this.drop(this.commits.length);
  }
}

class ScrollbackSnapshotRenderContext extends EventEmitter4 {
  nativeOwner;
  clock;
  width;
  height;
  terminalWidth;
  terminalHeight;
  resolution;
  frameId = 0;
  widthMethod;
  capabilities;
  hasSelection = false;
  currentFocusedRenderable = null;
  keyInput;
  _internalKeyInput;
  nativeScene;
  root;
  nextRenderBuffer;
  isDestroyed = false;
  controlState = "idle" /* IDLE */;
  detachedSession;
  constructor(width, height, widthMethod, terminalWidth, terminalHeight, resolution, capabilities, nativeOwner, clock) {
    super();
    this.nativeOwner = nativeOwner;
    this.clock = clock;
    this.width = width;
    this.height = height;
    this.terminalWidth = terminalWidth;
    this.terminalHeight = terminalHeight;
    this.resolution = resolution;
    this.capabilities = capabilities;
    this.widthMethod = widthMethod;
    this.keyInput = new KeyHandler;
    this._internalKeyInput = new InternalKeyHandler;
    this.detachedSession = nativeOwner.createDetached({ width, height, remote: true, environment: {} }, () => {
      this.nativeScene?.cancelFrame();
      this.nativeScene?.destroy();
    });
    try {
      nativeOwner.renderLib.sessionSyncDetached(nativeOwner.context, this.detachedSession.session, nativeOwner.session);
      this.nativeScene = new NativeScene(this.detachedSession, this);
      this.nextRenderBuffer = OptimizedBuffer.fromSession(nativeOwner.renderLib, nativeOwner.context, this.detachedSession.session, "next", () => this.nativeScene.frame);
    } catch (error) {
      this.detachedSession.dispose();
      throw error;
    }
  }
  renderSnapshot(root, buffer) {
    this.root = root;
    this.detachedSession.renderLib.sessionSyncDetached(this.detachedSession.context, this.detachedSession.session, this.nativeOwner.session);
    this.detachedSession.resize(this.width, this.height);
    try {
      this.nativeScene.paint(0, () => ({
        background: TRANSPARENT_RGBA,
        useMouse: false,
        excludedHitNum: 0,
        preserveUnwritten: true
      }));
      if (!this.nativeScene.frame)
        throw new Error("Detached scene did not complete painting");
      this.detachedSession.renderLib.sceneFrameCopyBuffer(this.detachedSession.context, this.detachedSession.session, this.nativeScene.frame, buffer._getSceneHandle(this.nativeScene));
    } finally {
      this.nativeScene.cancelFrame();
      if (this.isDestroyed)
        this.disposeSession();
    }
  }
  destroy() {
    if (this.isDestroyed)
      return;
    this.isDestroyed = true;
    runCleanups([
      () => this.removeAllListeners(),
      () => this.keyInput.removeAllListeners(),
      () => this._internalKeyInput.removeAllListeners(),
      () => this.disposeSession()
    ]);
  }
  disposeSession() {
    const dispose = () => this.detachedSession.dispose();
    if (!this.root?._deferUntilCleanupComplete(dispose))
      dispose();
  }
  requestRender() {}
  requestAnimationFrame(_callback) {
    return -1;
  }
  cancelAnimationFrame(_handle) {}
  setCursorPosition(_x, _y, _visible) {}
  setCursorStyle(_options) {}
  setCursorColor(_color) {}
  setMousePointer(_shape) {}
  requestLive() {}
  dropLive() {}
  onAnimationTick() {
    return () => {};
  }
  getSelection() {
    return null;
  }
  get currentFocusedEditor() {
    if (!this.currentFocusedRenderable)
      return null;
    if (!isEditBufferRenderable(this.currentFocusedRenderable))
      return null;
    return this.currentFocusedRenderable;
  }
  requestSelectionUpdate() {}
  focusRenderable(renderable) {
    this.currentFocusedRenderable = renderable;
  }
  blurRenderable(renderable) {
    if (this.currentFocusedRenderable === renderable) {
      this.currentFocusedRenderable = null;
    }
  }
  registerLifecyclePass(renderable) {
    this.getLifecyclePasses().add(renderable);
  }
  unregisterLifecyclePass(renderable) {
    this.getLifecyclePasses().delete(renderable);
  }
  getLifecyclePasses() {
    return this.nativeScene.lifecyclePasses;
  }
  clearSelection() {}
  startSelection(_renderable, _x, _y, _behavior) {}
  updateSelection(_currentRenderable, _x, _y, _options) {}
}
var DEFAULT_FORWARDED_ENV_KEYS = [
  "TMPDIR",
  "SSH_CONNECTION",
  "SSH_CLIENT",
  "SSH_TTY",
  "MOSH_CONNECTION",
  "TMUX",
  "ZELLIJ",
  "ZELLIJ_SESSION_NAME",
  "ZELLIJ_PANE_ID",
  "TERM",
  "OPENTUI_GRAPHICS",
  "OPENTUI_IMAGE_PROTOCOL",
  "TERM_PROGRAM",
  "TERM_PROGRAM_VERSION",
  "TERM_FEATURES",
  "VTE_VERSION",
  "FORCE_HYPERLINK",
  "ALACRITTY_SOCKET",
  "ALACRITTY_LOG",
  "COLORTERM",
  "TERMUX_VERSION",
  "VHS_RECORD",
  "OPENTUI_FORCE_WCWIDTH",
  "OPENTUI_FORCE_UNICODE",
  "OPENTUI_FORCE_NOZWJ",
  "OPENTUI_FORCE_EXPLICIT_WIDTH",
  "OPENTUI_NOTIFICATION_PROTOCOL",
  "OPENTUI_NOTIFICATIONS",
  "WT_SESSION",
  "STY",
  "WSL_DISTRO_NAME",
  "WSL_INTEROP"
];
var KITTY_FLAG_DISAMBIGUATE = 1;
var KITTY_FLAG_EVENT_TYPES = 2;
var KITTY_FLAG_ALTERNATE_KEYS = 4;
var KITTY_FLAG_ALL_KEYS_AS_ESCAPES = 8;
var KITTY_FLAG_REPORT_TEXT = 16;
var DEFAULT_STDIN_PARSER_MAX_BUFFER_BYTES = 64 * 1024 * 1024;
var NATIVE_PALETTE_QUERY_SIZE = 16;
var REPLY_BACKSTOP_MS = 5000;
var PIXEL_QUERIES_MAX = 4;
var DA1_REPLY = /^\x1b\[\?[\d;]*c$/;
function buildKittyKeyboardFlags(config) {
  if (!config) {
    return 0;
  }
  let flags = 0;
  if (config.disambiguate !== false) {
    flags |= KITTY_FLAG_DISAMBIGUATE;
  }
  if (config.alternateKeys !== false) {
    flags |= KITTY_FLAG_ALTERNATE_KEYS;
  }
  if (config.events === true) {
    flags |= KITTY_FLAG_EVENT_TYPES;
  }
  if (config.allKeysAsEscapes === true) {
    flags |= KITTY_FLAG_ALL_KEYS_AS_ESCAPES;
  }
  if (config.reportText === true) {
    flags |= KITTY_FLAG_REPORT_TEXT;
  }
  return flags;
}

class MouseEvent {
  type;
  button;
  x;
  y;
  source;
  modifiers;
  scroll;
  target;
  currentTarget = null;
  isDragging;
  _propagationStopped = false;
  _defaultPrevented = false;
  get propagationStopped() {
    return this._propagationStopped;
  }
  get defaultPrevented() {
    return this._defaultPrevented;
  }
  constructor(target, attributes) {
    this.target = target;
    this.type = attributes.type;
    this.button = attributes.button;
    this.x = attributes.x;
    this.y = attributes.y;
    this.modifiers = attributes.modifiers;
    this.scroll = attributes.scroll;
    this.source = attributes.source;
    this.isDragging = attributes.isDragging;
  }
  stopPropagation() {
    this._propagationStopped = true;
  }
  preventDefault() {
    this._defaultPrevented = true;
  }
}
var MouseButton;
((MouseButton2) => {
  MouseButton2[MouseButton2["LEFT"] = 0] = "LEFT";
  MouseButton2[MouseButton2["MIDDLE"] = 1] = "MIDDLE";
  MouseButton2[MouseButton2["RIGHT"] = 2] = "RIGHT";
  MouseButton2[MouseButton2["WHEEL_UP"] = 4] = "WHEEL_UP";
  MouseButton2[MouseButton2["WHEEL_DOWN"] = 5] = "WHEEL_DOWN";
})(MouseButton ||= {});
var rendererTracker = singleton("RendererTracker", () => ({
  renderers: new Set,
  streamOwners: new WeakMap
}));
async function createCliRenderer(config = {}) {
  if (process.argv.includes("--delay-start")) {
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
  const stdin = config.stdin ?? process.stdin;
  const stdout = config.stdout ?? process.stdout;
  const width = stdout.columns || config.width || 80;
  const height = stdout.rows || config.height || 24;
  const renderer = new CliRenderer(stdin, stdout, width, height, config);
  try {
    await renderer.setupTerminal();
    return renderer;
  } catch (error) {
    try {
      renderer.destroy();
    } catch (destroyError) {
      console.error("Error destroying partially-set-up renderer:", destroyError);
    }
    await renderer.closed.catch(() => {});
    throw error;
  }
}
var CliRenderEvents;
((CliRenderEvents2) => {
  CliRenderEvents2["RESIZE"] = "resize";
  CliRenderEvents2["FRAME"] = "frame";
  CliRenderEvents2["RENDER_ERROR"] = "render:error";
  CliRenderEvents2["HANDLER_ERROR"] = "handler:error";
  CliRenderEvents2["EXTERNAL_OUTPUT"] = "external_output";
  CliRenderEvents2["FOCUS"] = "focus";
  CliRenderEvents2["BLUR"] = "blur";
  CliRenderEvents2["FOCUSED_RENDERABLE"] = "focused_renderable";
  CliRenderEvents2["FOCUSED_EDITOR"] = "focused_editor";
  CliRenderEvents2["THEME_MODE"] = "theme_mode";
  CliRenderEvents2["PALETTE"] = "palette";
  CliRenderEvents2["CAPABILITIES"] = "capabilities";
  CliRenderEvents2["SELECTION"] = "selection";
  CliRenderEvents2["DEBUG_OVERLAY_TOGGLE"] = "debugOverlay:toggle";
  CliRenderEvents2["DESTROY"] = "destroy";
  CliRenderEvents2["MEMORY_SNAPSHOT"] = "memory:snapshot";
})(CliRenderEvents ||= {});
var RendererControlState;
((RendererControlState2) => {
  RendererControlState2["IDLE"] = "idle";
  RendererControlState2["AUTO_STARTED"] = "auto_started";
  RendererControlState2["EXPLICIT_STARTED"] = "explicit_started";
  RendererControlState2["EXPLICIT_PAUSED"] = "explicit_paused";
  RendererControlState2["EXPLICIT_SUSPENDED"] = "explicit_suspended";
  RendererControlState2["EXPLICIT_STOPPED"] = "explicit_stopped";
})(RendererControlState ||= {});
var CLICK_REPEAT_INTERVAL_MS = 500;
var ANIMATION_TIMER_SLACK_MS = 1;

class CliRenderer extends EventEmitter4 {
  static animationFrameId = 0;
  lib;
  nativeScene;
  nativeSession;
  nativeDestroyWait;
  nativeClosed;
  nativeTerminalTransition = null;
  pendingNativeResize = null;
  pendingNativeMode = null;
  nativeSplitAcceptedCount = 0;
  nativeSplitFlush = null;
  pendingNativeReplay = null;
  detachedSurfaces = new Set;
  nativeResizeWait = null;
  nativeKittyKeyboardFlags = 0;
  kittyTransportMode = "raw";
  synchronizedOutput;
  kittyTransportTimer = null;
  _lastSceneTimeMs = 0;
  get lastSceneTimeMs() {
    return this._lastSceneTimeMs;
  }
  get closed() {
    return this.nativeClosed;
  }
  stdin;
  stdout;
  exitOnCtrlC;
  exitSignals;
  _exitListenersAdded = false;
  _isDestroyed = false;
  _destroyPending = false;
  _destroyFinalized = false;
  _destroyCleanupPrepared = false;
  _streamLeaseAcquired = false;
  flushTerminalInputOnClose = false;
  nextRenderBuffer;
  currentRenderBuffer;
  _isRunning = false;
  _targetFps = 30;
  _maxFps = 60;
  automaticMemorySnapshot = false;
  memorySnapshotInterval;
  memorySnapshotTimer = null;
  lastMemorySnapshot = {
    heapUsed: 0,
    heapTotal: 0,
    arrayBuffers: 0
  };
  root;
  width;
  height;
  gatherStats = false;
  frameTimes = [];
  maxStatSamples = 300;
  postProcessFns = [];
  backgroundColor = RGBA.fromInts(0, 0, 0, 0);
  waitingForPixelResolution = false;
  pixelResolutionRequeryPending = false;
  unansweredPixelQueries = 0;
  replyBatches = [];
  replySentinel = false;
  clock;
  rendering = false;
  renderingCompletion = null;
  renderTimeout = null;
  lastTime = 0;
  frameCount = 0;
  _frameId = 0;
  lastFpsTime = 0;
  currentFps = 0;
  targetFrameTime = 1000 / this._targetFps;
  minTargetFrameTime = 1000 / this._maxFps;
  immediateRerenderRequested = false;
  liveRequestCounter = 0;
  animationTickers = new Set;
  animationTimer = null;
  _controlState = "idle" /* IDLE */;
  frameCallbacks = [];
  renderStats = {
    frameCount: 0,
    fps: 0,
    renderTime: 0,
    frameCallbackTime: 0
  };
  debugOverlay = {
    enabled: env.OTUI_SHOW_STATS,
    corner: 3 /* bottomRight */
  };
  _console;
  _resolution = null;
  _keyHandler;
  stdinParser = null;
  stdinShadow = null;
  oscSubscribers = new Set;
  hasLoggedStdinParserError = false;
  animationRequest = new Map;
  cancelFrameContinuation = null;
  cancelReadyFrame = null;
  resizeTimeoutId = null;
  pendingResizeSawDifferentSize = false;
  terminalKeepAliveTimer = null;
  xtVersionWaiters = new Set;
  splitStartupSeedTimeoutId = null;
  pendingSplitStartupCursorSeed = false;
  resizeDebounceDelay = 100;
  enableMouseMovement = false;
  _useMouse = true;
  autoFocus = true;
  _screenMode = "alternate-screen";
  _footerHeight = DEFAULT_FOOTER_HEIGHT;
  _externalOutputMode = "passthrough";
  clearOnShutdown = true;
  _suspendedMouseEnabled = false;
  _previousControlState = "idle" /* IDLE */;
  capturedRenderable;
  pressedRenderable;
  lastOverRenderableNum = 0;
  lastOverRenderable;
  currentSelection = null;
  selectionContainers = [];
  lastClick = null;
  _splitHeight = 0;
  renderOffset = 0;
  splitTailColumn = 0;
  queuedSplitTail = null;
  pendingSplitFooterTransition = null;
  forceFullRepaintRequested = false;
  maxSplitCommitsPerFrame = 8;
  _terminalWidth = 0;
  _terminalHeight = 0;
  _terminalIsSetup = false;
  externalOutputQueue;
  pendingExternalOutputMode = null;
  realStdoutWrite;
  _useConsole = true;
  sigwinchHandler = (() => {
    const width = this.stdout.columns;
    const height = this.stdout.rows;
    if (width > 0 && height > 0)
      this.requestResize(width, height);
  }).bind(this);
  _capabilities = null;
  _latestPointer = { x: 0, y: 0 };
  _hasPointer = false;
  _lastPointerModifiers = {
    shift: false,
    alt: false,
    ctrl: false
  };
  _currentMousePointerStyle = undefined;
  _currentFocusedRenderable = null;
  focusChange;
  _openConsoleOnError = true;
  _paletteDetector = null;
  _paletteCache = new Map;
  _paletteDetectionPromise = null;
  _cancelPaletteDetection = null;
  _paletteDetectionSize = 0;
  _paletteDetectionGeneration = 0;
  _paletteEpoch = 0;
  _nativePaletteSignature = null;
  _emittedPaletteSignature = null;
  _palettePublishGeneration = 0;
  _onDestroy;
  themeModeState;
  _terminalFocusState = null;
  sequenceHandlers = [];
  prependedInputHandlers = [];
  shouldRestoreModesOnNextFocus = false;
  themeModeHandler;
  idleResolvers = [];
  _debugInputs = [];
  _debugModeEnabled = env.OTUI_DEBUG;
  stdinLogPath = env.OTUI_STDIN_LOG;
  handleError = ((error) => {
    console.error(error);
    if (this._openConsoleOnError && !this._isDestroyed && !this.nativeSession?.error && !this.nativeSession?.disposed) {
      this.console.show();
    }
  }).bind(this);
  dumpOutputCache(optionalMessage = "") {
    const cachedLogs = this._console.getCachedLogs();
    const capturedConsoleOutput = capture.claimOutput();
    const capturedExternalOutputCommits = this.externalOutputQueue.claim();
    let capturedExternalOutput = "";
    for (const commit of capturedExternalOutputCommits) {
      capturedExternalOutput += `[snapshot ${commit.snapshot.width}x${commit.snapshot.height}]
`;
      commit.snapshot.destroy();
    }
    if (capturedConsoleOutput.length > 0 || capturedExternalOutput.length > 0 || cachedLogs.length > 0) {
      this.realStdoutWrite.call(this.stdout, optionalMessage);
    }
    if (cachedLogs.length > 0) {
      this.realStdoutWrite.call(this.stdout, `Console cache:
`);
      this.realStdoutWrite.call(this.stdout, cachedLogs);
    }
    if (capturedConsoleOutput.length > 0) {
      this.realStdoutWrite.call(this.stdout, `
Captured console output:
`);
      this.realStdoutWrite.call(this.stdout, capturedConsoleOutput + `
`);
    }
    if (capturedExternalOutput.length > 0) {
      this.realStdoutWrite.call(this.stdout, `
Captured external output:
`);
      this.realStdoutWrite.call(this.stdout, capturedExternalOutput + `
`);
    }
    this.realStdoutWrite.call(this.stdout, ANSI.reset);
  }
  exitHandler = (() => {
    this.destroy();
    this.closed.then(() => {
      if (env.OTUI_DUMP_CAPTURES)
        this.dumpOutputCache(`=== CAPTURED OUTPUT ===
`);
    }).catch((error) => console.error("Native scene shutdown failed:", error));
  }).bind(this);
  nativeProcessExitHandler = () => {
    const disposed = this.nativeSession.disposed;
    const restored = !disposed && this.nativeSession.restoreOnExit();
    try {
      this.leaveRawMode();
      this.destroy();
      if (this.flushTerminalInputOnClose)
        this.lib.terminalFlushInput();
    } finally {
      this.nativeSession.dispose();
      if (!disposed && !restored && this._terminalIsSetup) {
        console.error("Native scene output cancelled at process exit; terminal restoration did not complete");
      }
    }
  };
  warningHandler = ((warning) => {
    console.warn(JSON.stringify(warning.message, null, 2));
  }).bind(this);
  _usesProcessStdout;
  outputIdleRenderScheduled = false;
  ordinaryFrameWaitingForOutput = false;
  ordinaryFrameWaitControlState = null;
  get controlState() {
    return this._controlState;
  }
  constructor(stdin, stdout, width, height, config = {}) {
    super();
    this.stdin = stdin;
    this.stdout = stdout;
    this._usesProcessStdout = stdout === process.stdout;
    this.realStdoutWrite = stdout.write;
    if (config.nativeSceneWorkBudget !== undefined) {
      throw new Error("nativeSceneWorkBudget was removed: frames always paint synchronously");
    }
    this.kittyTransportMode = config.kittyImageTransport ?? "raw";
    this.synchronizedOutput = config.synchronizedOutput;
    const transportCode = KITTY_IMAGE_TRANSPORTS.indexOf(this.kittyTransportMode);
    if (transportCode < 0)
      throw new TypeError("Invalid kittyImageTransport");
    const useMemoryBufferedOutput = config.bufferedOutput === "memory";
    if (config.nativeSession) {
      if (useMemoryBufferedOutput)
        throw new Error("nativeSession does not support memory buffered output");
      if (!config.nativeSession.usesOutput(stdout))
        throw new Error("nativeSession must use the renderer stdout");
    }
    const { screenMode, footerHeight, externalOutputMode } = resolveModes(config);
    const initialGeometry = calculateRenderGeometry(screenMode, width, height, footerHeight);
    const remoteMode = config.remote ?? (!this._usesProcessStdout && !useMemoryBufferedOutput ? true : undefined);
    const forwardEnvKeys = config.forwardEnvKeys ?? (remoteMode === true ? [] : DEFAULT_FORWARDED_ENV_KEYS);
    if (rendererTracker.streamOwners.get(stdin)) {
      throw new Error("Cannot create CliRenderer: stdin is already used by another CliRenderer");
    }
    if (rendererTracker.streamOwners.get(stdout)) {
      throw new Error("Cannot create CliRenderer: stdout is already used by another CliRenderer");
    }
    let driver;
    try {
      const sink = useMemoryBufferedOutput ? new Writable3({
        write(_bytes, _encoding, complete) {
          complete();
        }
      }) : stdout;
      driver = config.nativeSession ?? new NativeSession(sink);
      driver.attachRenderer({
        width: initialGeometry.renderWidth,
        height: initialGeometry.renderHeight,
        remote: remoteMode,
        environment: {
          ...Object.fromEntries(forwardEnvKeys.flatMap((key) => {
            const value = process.env[key];
            return value === undefined ? [] : [[key, value]];
          })),
          ...config.environment
        }
      }, () => {
        try {
          this.nativeScene?.cancelFrame();
        } finally {
          this.nativeScene?.destroy();
        }
      });
      this.nativeSession = driver;
      this.externalOutputQueue = new ExternalOutputQueue(Number(driver.maxWriteBytes / 24n));
      this.nativeDestroyWait = Promise.withResolvers();
      this.nativeClosed = this.nativeSession.closed.finally(() => this.nativeDestroyWait.promise).finally(() => {
        if (this.nativeSession.error && !this.nativeSession.disposed)
          this.nativeSession.dispose();
        this.leaveRawMode();
        this.removeCleanupListener(process, "exit", this.nativeProcessExitHandler);
        if (this.flushTerminalInputOnClose)
          this.lib.terminalFlushInput();
        this.releaseStreamLease();
      });
      this.nativeClosed.catch(() => {});
      this.nativeScene = new NativeScene(this.nativeSession, this);
      this.nativeSession.setKittyImageTransport(transportCode);
    } catch (error) {
      if (!config.nativeSession || this.nativeSession)
        driver?.dispose();
      this.nativeDestroyWait?.resolve();
      throw error;
    }
    this.lib = this.nativeSession.renderLib;
    try {
      const kittyConfig = config.useKittyKeyboard ?? {};
      this.nativeKittyKeyboardFlags = buildKittyKeyboardFlags(kittyConfig);
      this._terminalWidth = width;
      this._terminalHeight = height;
      this._externalOutputMode = externalOutputMode;
      this.width = initialGeometry.renderWidth;
      this.height = initialGeometry.renderHeight;
      this._splitHeight = initialGeometry.effectiveFooterHeight;
      this.renderOffset = screenMode === "split-footer" ? 0 : initialGeometry.renderOffset;
      this._footerHeight = footerHeight;
      this.clearOnShutdown = config.clearOnShutdown ?? true;
      this.exitOnCtrlC = config.exitOnCtrlC === undefined ? true : config.exitOnCtrlC;
      this.exitSignals = config.exitSignals || [
        "SIGINT",
        "SIGTERM",
        "SIGQUIT",
        "SIGABRT",
        "SIGHUP",
        "SIGPIPE",
        "SIGBREAK",
        "SIGBUS"
      ];
      this.resizeDebounceDelay = config.debounceDelay || 100;
      this.targetFps = config.targetFps || 30;
      this.maxFps = config.maxFps || 60;
      this.clock = config.clock ?? new SystemClock;
      this.themeModeState = new RendererThemeMode({
        queryThemeColors: () => {
          this.nativeSession.control({ kind: "query-theme-colors" });
        }
      }, this.clock);
      this.themeModeHandler = (sequence) => {
        const result = this.themeModeState.handleSequence(sequence);
        if (result.changedMode) {
          this.clearPaletteCache();
          if (this.shouldSyncNativePaletteState() || this.listenerCount("palette" /* PALETTE */) > 0) {
            this.refreshPalette();
          }
          this.emit("theme_mode" /* THEME_MODE */, result.changedMode);
        }
        return result.handled;
      };
      this.memorySnapshotInterval = config.memorySnapshotInterval ?? 0;
      this.gatherStats = config.gatherStats || false;
      this.maxStatSamples = config.maxStatSamples || 300;
      this.enableMouseMovement = config.enableMouseMovement ?? true;
      this._useMouse = config.useMouse ?? true;
      this.autoFocus = config.autoFocus ?? true;
      this.nextRenderBuffer = OptimizedBuffer.fromSession(this.lib, this.nativeSession.context, this.nativeSession.session, "next", () => this.nativeScene.frame);
      this.currentRenderBuffer = OptimizedBuffer.fromSession(this.lib, this.nativeSession.context, this.nativeSession.session, "current", () => this.nativeScene.frame);
      this._capabilities = this.nativeSession.getCapabilities();
      if (config.backgroundColor !== undefined)
        this.backgroundColor = RGBA.clone(parseColor(config.backgroundColor));
      this.postProcessFns = config.postProcessFns || [];
      this.prependedInputHandlers = config.prependInputHandlers || [];
      this.root = new RootRenderable(this);
      if (this.memorySnapshotInterval > 0) {
        this.startMemorySnapshotTimer();
      }
      if (this._usesProcessStdout) {
        process.on("SIGWINCH", this.sigwinchHandler);
      }
      process.on("warning", this.warningHandler);
      process.on("uncaughtException", this.handleError);
      process.on("unhandledRejection", this.handleError);
      const useKittyForParsing = kittyConfig !== null;
      this._keyHandler = new InternalKeyHandler;
      this._keyHandler.on("keypress", (event) => {
        if (this.exitOnCtrlC && matchesKeyBinding(event, { name: "c", ctrl: true })) {
          process.nextTick(this.exitHandler);
          return;
        }
      });
      this.addExitListeners();
      const stdinParserMaxBufferBytes = config.stdinParserMaxBufferBytes ?? DEFAULT_STDIN_PARSER_MAX_BUFFER_BYTES;
      const createStdinParser = (native, onTimeoutFlush) => {
        const protocolContext = {
          kittyKeyboardEnabled: useKittyForParsing,
          privateCapabilityRepliesActive: false,
          pixelResolutionQueryActive: false,
          explicitWidthCprActive: false,
          startupCursorCprActive: false
        };
        if (native) {
          return new NativeStdinParser({
            armTimeouts: true,
            onTimeoutFlush,
            protocolContext,
            clock: this.clock,
            session: { lib: this.lib, context: this.nativeSession.context, session: this.nativeSession.session }
          });
        }
        return new StdinParser({
          timeoutMs: 20,
          maxPendingBytes: stdinParserMaxBufferBytes,
          armTimeouts: true,
          onTimeoutFlush,
          useKittyKeyboard: useKittyForParsing,
          protocolContext,
          clock: this.clock
        });
      };
      const nativeInput = config.experimental_nativeInput ?? env.OTUI_NATIVE_INPUT_PARSER;
      this.stdinParser = createStdinParser(nativeInput, () => this.drainStdinParser());
      this.replySentinel = this.stdinParser instanceof NativeStdinParser;
      if (env.OTUI_NATIVE_INPUT_SHADOW) {
        this.stdinShadow = {
          parser: createStdinParser(!nativeInput, () => this.drainStdinShadow()),
          comparator: new StdinShadowComparator(nativeInput ? "native" : "legacy", (line) => console.warn(line))
        };
      }
      this._console = new TerminalConsole(this, {
        ...config.consoleOptions ?? {},
        clock: this.clock
      });
      this.consoleMode = config.consoleMode ?? "console-overlay";
      this.applyScreenMode(screenMode, false, false);
      rendererTracker.streamOwners.set(stdin, this);
      rendererTracker.streamOwners.set(stdout, this);
      this._streamLeaseAcquired = true;
      rendererTracker.renderers.add(this);
      this.stdout.write = externalOutputMode === "capture-stdout" ? this.interceptStdoutWrite : this.realStdoutWrite;
      this._openConsoleOnError = config.openConsoleOnError ?? true;
      this._onDestroy = config.onDestroy;
      process.on("exit", this.nativeProcessExitHandler);
      this.setupInput();
      this.nativeSession.closed.catch((error) => {
        if (this._isDestroyed)
          return;
        try {
          const setupPending = !this._terminalIsSetup && this.nativeTerminalTransition !== null;
          if (!setupPending)
            this.handleError(error);
        } catch {} finally {
          this.destroy();
        }
      });
    } catch (error) {
      try {
        this.destroy();
      } catch (destroyError) {
        console.error("Error destroying partially constructed renderer:", destroyError);
      } finally {
        this.nativeSession.dispose();
        this.nativeDestroyWait?.resolve();
        this.releaseStreamLease();
      }
      throw error;
    }
  }
  addExitListeners() {
    if (this._exitListenersAdded || this.exitSignals.length === 0)
      return;
    this.exitSignals.forEach((signal) => {
      process.addListener(signal, this.exitHandler);
    });
    this._exitListenersAdded = true;
  }
  startTerminalKeepAlive() {
    if (this.stdin !== process.stdin || this.terminalKeepAliveTimer !== null)
      return;
    this.terminalKeepAliveTimer = setInterval(() => {}, 60000);
  }
  stopTerminalKeepAlive() {
    if (this.terminalKeepAliveTimer === null)
      return;
    clearInterval(this.terminalKeepAliveTimer);
    this.terminalKeepAliveTimer = null;
  }
  removeExitListeners() {
    if (!this._exitListenersAdded || this.exitSignals.length === 0)
      return;
    this.exitSignals.forEach((signal) => {
      this.removeCleanupListener(process, signal, this.exitHandler);
    });
    this._exitListenersAdded = false;
  }
  removeCleanupListener(target, event, listener) {
    try {
      target.removeListener(event, listener);
    } catch (error) {
      if (!this._isDestroyed)
        throw error;
      console.error("Error removing native scene lifecycle listener:", error);
    }
  }
  get isDestroyed() {
    return this._isDestroyed;
  }
  registerLifecyclePass(renderable) {
    this.getLifecyclePasses().add(renderable);
  }
  unregisterLifecyclePass(renderable) {
    this.getLifecyclePasses().delete(renderable);
  }
  getLifecyclePasses() {
    return this.nativeScene.lifecyclePasses;
  }
  get currentFocusedRenderable() {
    return this._currentFocusedRenderable;
  }
  get currentFocusedEditor() {
    if (!this._currentFocusedRenderable)
      return null;
    if (!isEditBufferRenderable(this._currentFocusedRenderable))
      return null;
    return this._currentFocusedRenderable;
  }
  normalizeClockTime(now, fallback) {
    if (Number.isFinite(now)) {
      return now;
    }
    return Number.isFinite(fallback) ? fallback : 0;
  }
  getElapsedMs(now, then) {
    if (!Number.isFinite(now) || !Number.isFinite(then)) {
      return 0;
    }
    return Math.max(now - then, 0);
  }
  focusRenderable(renderable) {
    if (renderable.ctx !== this) {
      throw new Error("Cannot focus renderables from another render context");
    }
    this.changeFocus(renderable);
  }
  blurRenderable(renderable) {
    if (this._currentFocusedRenderable !== renderable) {
      return;
    }
    this.changeFocus(null);
  }
  changeFocus(renderable) {
    if (this._currentFocusedRenderable === renderable)
      return;
    const change = this.focusChange = {};
    const previous = this._currentFocusedRenderable;
    const previousEditor = this.currentFocusedEditor;
    this._currentFocusedRenderable = renderable;
    let failure;
    const run = (operation) => {
      try {
        operation();
      } catch (error) {
        failure ??= { error };
      }
    };
    if (renderable)
      run(() => previous?.blur());
    const currentEditor = this.currentFocusedEditor;
    if (previousEditor !== currentEditor)
      run(() => this.emit("focused_editor" /* FOCUSED_EDITOR */, currentEditor, previousEditor));
    if (this.focusChange === change && this._currentFocusedRenderable === renderable && !renderable?.isDestroyed) {
      run(() => this.emit("focused_renderable" /* FOCUSED_RENDERABLE */, renderable, previous));
    }
    if (failure)
      throw failure.error;
  }
  get widthMethod() {
    return this.capabilities?.unicode ?? this.nextRenderBuffer.widthMethod;
  }
  get frameId() {
    return this._frameId;
  }
  scheduleRenderAfterOutputIdle() {
    if (this.outputIdleRenderScheduled || this._isDestroyed)
      return;
    this.outputIdleRenderScheduled = true;
    this.nativeSession.idle().then(() => {
      this.outputIdleRenderScheduled = false;
      const ordinaryFrameWasWaiting = this.ordinaryFrameWaitingForOutput;
      const ordinaryFrameWaitControlState = this.ordinaryFrameWaitControlState;
      this.ordinaryFrameWaitingForOutput = false;
      if (!this.rendering)
        this.ordinaryFrameWaitControlState = null;
      if (this._isDestroyed || ordinaryFrameWasWaiting && this._controlState !== ordinaryFrameWaitControlState && (this._controlState === "explicit_paused" /* EXPLICIT_PAUSED */ || this._controlState === "explicit_stopped" /* EXPLICIT_STOPPED */ || this._controlState === "explicit_suspended" /* EXPLICIT_SUSPENDED */)) {
        this.resolveIdleIfNeeded();
        return;
      }
      this.scheduleRenderTimer();
      this.resolveIdleIfNeeded();
    }).catch((error) => {
      this.outputIdleRenderScheduled = false;
      this.ordinaryFrameWaitingForOutput = false;
      this.ordinaryFrameWaitControlState = null;
      if (!this._isDestroyed)
        this.handleError(error);
      this.resolveIdleIfNeeded();
    });
  }
  scheduleRenderTimer() {
    if (this.renderTimeout || this.cancelReadyFrame || this._isDestroyed || this._controlState === "explicit_suspended" /* EXPLICIT_SUSPENDED */)
      return;
    this.scheduleFrame(this.nextFrameDelay());
  }
  nextFrameDelay() {
    const now = this.normalizeClockTime(this.clock.now(), this.lastTime);
    return Math.max(this.minTargetFrameTime - this.getElapsedMs(now, this.lastTime), 0);
  }
  scheduleFrame(delayMs) {
    this.clearFrameTimer();
    this.renderTimeout = this.clock.setTimeout(() => {
      this.renderTimeout = null;
      this.queueFrame();
    }, delayMs);
  }
  clearFrameTimer() {
    if (this.renderTimeout === null)
      return;
    this.clock.clearTimeout(this.renderTimeout);
    this.renderTimeout = null;
  }
  requestRender() {
    if (this._isDestroyed || this._controlState === "explicit_suspended" /* EXPLICIT_SUSPENDED */) {
      return;
    }
    if (this.outputIdleRenderScheduled) {
      this.ordinaryFrameWaitControlState = this._controlState;
      return;
    }
    if (this._isRunning) {
      if (!this.rendering)
        this.scheduleRenderTimer();
      return;
    }
    if (this.rendering) {
      this.immediateRerenderRequested = true;
      this.ordinaryFrameWaitControlState = this._controlState;
      return;
    }
    if (!this.cancelReadyFrame && !this.renderTimeout) {
      const delay = this.nextFrameDelay();
      if (delay === 0)
        this.queueFrame();
      else
        this.scheduleFrame(delay);
    }
  }
  get consoleMode() {
    return this._useConsole ? "console-overlay" : "disabled";
  }
  set consoleMode(mode) {
    this._useConsole = mode === "console-overlay";
    if (this._useConsole) {
      this._console.activate();
    } else {
      this._console.deactivate();
    }
  }
  get isRunning() {
    return this._isRunning;
  }
  hasScheduledWork() {
    return Boolean(this.renderTimeout || this.cancelReadyFrame || this.outputIdleRenderScheduled || this.immediateRerenderRequested || this.nativeTerminalTransition || this.nativeResizeWait || this.pendingNativeResize && this._controlState !== "explicit_suspended" /* EXPLICIT_SUSPENDED */);
  }
  isIdleNow() {
    return this._isDestroyed || !this._isRunning && !this.rendering && !this.hasScheduledWork();
  }
  resolveIdleIfNeeded() {
    if (!this.isIdleNow())
      return;
    const resolvers = this.idleResolvers.splice(0);
    for (const resolve of resolvers) {
      resolve();
    }
  }
  idle() {
    if (this._isDestroyed)
      return this.closed;
    const idle = this.isIdleNow() ? Promise.resolve() : new Promise((resolve) => {
      this.idleResolvers.push(resolve);
    });
    return idle.then(() => this.nativeSession.idle());
  }
  getSchedulerState() {
    return {
      isRunning: this._isRunning,
      isRendering: this.rendering,
      hasScheduledRender: this.hasScheduledWork()
    };
  }
  get resolution() {
    return this._resolution;
  }
  get console() {
    return this._console;
  }
  get keyInput() {
    return this._keyHandler;
  }
  get _internalKeyInput() {
    return this._keyHandler;
  }
  get terminalWidth() {
    return this._terminalWidth;
  }
  get terminalHeight() {
    return this._terminalHeight;
  }
  get targetFps() {
    return this._targetFps;
  }
  set targetFps(targetFps) {
    this._targetFps = targetFps;
    this.targetFrameTime = 1000 / this._targetFps;
  }
  get maxFps() {
    return this._maxFps;
  }
  set maxFps(maxFps) {
    this._maxFps = maxFps;
    this.minTargetFrameTime = 1000 / this._maxFps;
  }
  get useMouse() {
    return this._useMouse;
  }
  set useMouse(useMouse) {
    if (this.nativeTerminalTransition || this._controlState === "explicit_suspended" /* EXPLICIT_SUSPENDED */) {
      throw new Error("Cannot change native scene mouse modes during a terminal transition or suspension");
    }
    if (this._useMouse === useMouse)
      return;
    if (useMouse) {
      this.enableMouse();
      this.requestRender();
    } else {
      this.disableMouse();
      this.requestRender();
    }
  }
  get screenMode() {
    return this.pendingNativeMode?.screenMode ?? this._screenMode;
  }
  set screenMode(mode) {
    if (this.pendingExternalOutputMode === "passthrough" && mode !== "split-footer") {
      this.applyScreenMode(mode);
      return;
    }
    if (this.externalOutputMode === "capture-stdout" && mode !== "split-footer") {
      throw new Error('externalOutputMode "capture-stdout" requires screenMode "split-footer"');
    }
    this.applyScreenMode(mode);
  }
  get footerHeight() {
    return this.pendingNativeMode?.footerHeight ?? this._footerHeight;
  }
  set footerHeight(footerHeight) {
    const normalizedFooterHeight = normalizeFooterHeight(footerHeight);
    if (normalizedFooterHeight === this.footerHeight) {
      return;
    }
    if (this.screenMode === "split-footer") {
      this.applyScreenMode("split-footer", true, true, normalizedFooterHeight);
    } else {
      this._footerHeight = normalizedFooterHeight;
    }
  }
  get externalOutputMode() {
    return this.pendingExternalOutputMode ?? this._externalOutputMode;
  }
  set externalOutputMode(mode) {
    if (mode === "capture-stdout" && this.screenMode !== "split-footer") {
      throw new Error('externalOutputMode "capture-stdout" requires screenMode "split-footer"');
    }
    if (this._isDestroyed) {
      this.pendingExternalOutputMode = null;
      if (mode === "passthrough")
        this.applyExternalOutputMode(mode);
      return;
    }
    if (this.rendering || this.pendingNativeMode || this.externalOutputQueue.size > 0) {
      this.pendingExternalOutputMode = mode;
      this.requestRender();
      return;
    }
    const previousMode = this._externalOutputMode;
    if (previousMode === mode) {
      if (this.pendingExternalOutputMode !== null && this.pendingExternalOutputMode !== mode) {
        this.pendingExternalOutputMode = null;
      }
      return;
    }
    this.pendingExternalOutputMode = null;
    this.applyExternalOutputMode(mode);
    this.afterExternalOutputModeChanged(previousMode, mode);
  }
  applyExternalOutputMode(mode) {
    this._externalOutputMode = mode;
    this.stdout.write = mode === "capture-stdout" ? this.interceptStdoutWrite : this.realStdoutWrite;
  }
  afterExternalOutputModeChanged(previousMode, mode) {
    if (this._screenMode === "split-footer" && this._splitHeight > 0 && mode === "capture-stdout") {
      const previousSurfaceTopLine = this.renderOffset + 1;
      const previousSurfaceHeight = this._splitHeight;
      this.clearPendingSplitFooterTransition();
      this.resetSplitScrollback(this.getSplitCursorSeedRows());
      if (previousMode === "passthrough" && this._terminalIsSetup) {
        const nextSurfaceTopLine = this.renderOffset + 1;
        if (previousSurfaceTopLine !== nextSurfaceTopLine) {
          this.setPendingSplitFooterTransition({
            mode: "clear-stale-rows",
            sourceTopLine: previousSurfaceTopLine,
            sourceHeight: previousSurfaceHeight,
            targetTopLine: nextSurfaceTopLine,
            targetHeight: this._splitHeight,
            scrollLines: 0
          });
          this.forceFullRepaintRequested = true;
        }
      }
      this.requestRender();
      return;
    }
    if (this._screenMode === "split-footer" && this._splitHeight > 0 && previousMode === "capture-stdout" && mode === "passthrough") {
      this.clearPendingSplitFooterTransition();
      return;
    }
    this.syncSplitFooterState();
  }
  applyPendingExternalOutputModeIfReady() {
    if (this.rendering)
      return;
    const pendingMode = this.pendingExternalOutputMode;
    if (pendingMode === null || this.externalOutputQueue.size > 0 && !(pendingMode === "capture-stdout" && this._screenMode === "split-footer")) {
      return;
    }
    const previousMode = this._externalOutputMode;
    this.pendingExternalOutputMode = null;
    if (previousMode === pendingMode) {
      return;
    }
    this.applyExternalOutputMode(pendingMode);
    this.afterExternalOutputModeChanged(previousMode, pendingMode);
  }
  get liveRequestCount() {
    return this.liveRequestCounter;
  }
  get currentControlState() {
    return this._controlState;
  }
  get capabilities() {
    return this._capabilities;
  }
  get kittyImageTransport() {
    return this.kittyTransportMode;
  }
  set kittyImageTransport(mode) {
    const code = KITTY_IMAGE_TRANSPORTS.indexOf(mode);
    if (code < 0)
      throw new TypeError("Invalid kittyImageTransport");
    if (this._isDestroyed || mode === this.kittyTransportMode)
      return;
    this.kittyTransportMode = mode;
    this.startKittyTransportPolling();
    this.nativeSession.setKittyImageTransport(code);
    this.requestRender();
  }
  startKittyTransportPolling() {
    if (!this._terminalIsSetup || this.kittyTransportMode !== "file" || this.kittyTransportTimer !== null)
      return;
    this.kittyTransportTimer = this.clock.setInterval(() => {
      if (!this._isDestroyed && this.nativeSession.pollKittyImageTransport())
        this.requestRender();
    }, 1000);
  }
  get kittyImageTransportStatus() {
    const status = this.nativeSession.getKittyImageTransport();
    return {
      requested: KITTY_IMAGE_TRANSPORTS[status.requested],
      effective: ["raw", "zlib", "png", "file"][status.effective],
      fileState: ["disabled", "probing", "ready", "unsupported", "timeout", "io-error", "cancelled"][status.fileState],
      fallback: ["none", "not-ready", "unavailable", "budget", "busy", "preparation", "compression"][status.fallback],
      pendingFiles: status.pendingFiles,
      pendingBytes: status.pendingBytes
    };
  }
  cancelKittyImageTransport() {
    if (this._isDestroyed)
      return;
    this.nativeSession.cancelKittyImageTransport(false);
    this.requestRender();
  }
  triggerNotification(message, title) {
    if (this._isDestroyed)
      return false;
    return this.nativeSession.triggerNotification(message, title);
  }
  setProgramStatus(status) {
    if (this._isDestroyed)
      return false;
    return this.nativeSession.setProgramStatus(status);
  }
  get themeMode() {
    return this.themeModeState.themeMode;
  }
  waitForThemeMode(timeoutMs = 1000) {
    if (!Number.isFinite(timeoutMs) || timeoutMs < 0) {
      throw new Error("timeoutMs must be a non-negative finite number");
    }
    return this.themeModeState.waitForThemeMode(timeoutMs, this._isDestroyed);
  }
  getDebugInputs() {
    return [...this._debugInputs];
  }
  get useKittyKeyboard() {
    return this.nativeKittyKeyboardFlags !== 0;
  }
  set useKittyKeyboard(use) {
    const flags = use ? KITTY_FLAG_DISAMBIGUATE | KITTY_FLAG_ALTERNATE_KEYS : 0;
    this.enableKittyKeyboard(flags);
  }
  createScrollbackSurface(options = {}) {
    if (this._isDestroyed)
      throw new Error("Renderer is destroyed");
    if (this.screenMode !== "split-footer" || this.externalOutputMode !== "capture-stdout") {
      throw new Error('createScrollbackSurface requires screenMode "split-footer" and externalOutputMode "capture-stdout"');
    }
    const renderer = this;
    const surfaceId = scrollbackSurfaceCounter++;
    const startOnNewLine = options.startOnNewLine ?? true;
    const tailColumn = renderer.getPendingSplitTailColumn();
    const firstLineOffset = !startOnNewLine && tailColumn > 0 && tailColumn < renderer.width ? tailColumn : 0;
    const snapshotContext = new ScrollbackSnapshotRenderContext(renderer.width, 1, renderer.widthMethod, renderer._terminalWidth, renderer._terminalHeight, renderer.resolution, renderer.capabilities, renderer.nativeSession, renderer.clock);
    let firstLineOffsetOwner = null;
    const renderContext = Object.create(snapshotContext);
    Object.defineProperty(renderContext, "claimFirstLineOffset", {
      value: (renderable) => {
        if (firstLineOffsetOwner?.isDestroyed) {
          firstLineOffsetOwner = null;
        }
        if (firstLineOffsetOwner) {
          return 0;
        }
        firstLineOffsetOwner = renderable ?? null;
        return firstLineOffset;
      },
      enumerable: true,
      configurable: true
    });
    let internalRoot;
    let publicRoot;
    let backingBuffer;
    try {
      internalRoot = new RootRenderable(renderContext);
      snapshotContext.root = internalRoot;
      publicRoot = new BoxRenderable(renderContext, {
        id: `scrollback-surface-root-${surfaceId}`,
        position: "absolute",
        left: 0,
        top: 0,
        width: renderer.width,
        height: "auto",
        border: false,
        backgroundColor: "transparent",
        shouldFill: false,
        flexDirection: "column"
      });
      internalRoot.add(publicRoot);
      backingBuffer = OptimizedBuffer.create(renderer.width, 1, renderer.widthMethod, {
        id: `scrollback-surface-buffer-${surfaceId}`,
        owner: renderer.nativeScene
      });
    } catch (error) {
      runCleanups([() => internalRoot?.destroyRecursively(), () => snapshotContext.destroy()]);
      throw error;
    }
    const readGeometry = () => [
      renderer.width,
      renderer.widthMethod,
      renderer._terminalWidth,
      renderer._terminalHeight,
      renderer.resolution?.width,
      renderer.resolution?.height
    ].join();
    let renderedGeometry = readGeometry();
    let surfaceWidth = renderer.width;
    let surfaceHeight = 1;
    let surfaceDestroyed = false;
    let hasRendered = false;
    let nextCommitStartOnNewLine = startOnNewLine;
    const pendingWaits = new Set;
    const capabilitiesListener = (capabilities) => {
      snapshotContext.capabilities = capabilities;
      renderContext.emit("capabilities" /* CAPABILITIES */, capabilities);
    };
    const assertNotDestroyed = () => {
      if (surfaceDestroyed) {
        throw new Error("ScrollbackSurface is destroyed");
      }
    };
    const assertRendered = () => {
      if (!hasRendered) {
        throw new Error("ScrollbackSurface.commitRows requires render() before commitRows()");
      }
    };
    const assertGeometryStillCurrent = () => {
      if (readGeometry() !== renderedGeometry) {
        throw new Error("ScrollbackSurface.commitRows requires render() after renderer geometry changes");
      }
    };
    const assertRowRange = (startRow, endRowExclusive) => {
      if (!Number.isInteger(startRow) || !Number.isInteger(endRowExclusive)) {
        throw new Error("ScrollbackSurface.commitRows requires finite integer row bounds");
      }
      if (startRow < 0) {
        throw new Error("ScrollbackSurface.commitRows requires startRow >= 0");
      }
      if (endRowExclusive < startRow) {
        throw new Error("ScrollbackSurface.commitRows requires endRowExclusive >= startRow");
      }
      if (endRowExclusive > surfaceHeight) {
        throw new Error("ScrollbackSurface.commitRows row range exceeds rendered surface height");
      }
    };
    const collectPendingResources = (node) => {
      const pending = [];
      for (const resource of snapshotContext.nativeScene.getRenderables()) {
        if (resource.isDestroyed)
          continue;
        const promise = resource instanceof CodeRenderable && resource.isHighlighting ? resource.highlightingDone : resource instanceof ImageRenderable && resource.loading ? resource.loadPromise : null;
        if (!promise)
          continue;
        let ancestor = resource;
        while (ancestor && ancestor !== node)
          ancestor = ancestor.parent;
        if (ancestor === node)
          pending.push(promise);
      }
      return pending;
    };
    const waitForPendingHighlights = async (pending, timeoutMs) => {
      await new Promise((resolve, reject) => {
        let settled = false;
        const finish = (error) => {
          if (settled)
            return;
          settled = true;
          renderer.clock.clearTimeout(timeoutHandle);
          pendingWaits.delete(cancel);
          if (error)
            reject(error);
          else
            resolve();
        };
        const cancel = () => finish(new Error("ScrollbackSurface is destroyed"));
        const timeoutHandle = renderer.clock.setTimeout(() => finish(new Error("ScrollbackSurface.settle timed out waiting for CodeRenderable highlighting")), timeoutMs);
        pendingWaits.add(cancel);
        Promise.all(pending).then(() => finish(), finish);
      });
    };
    const renderSurface = () => {
      assertNotDestroyed();
      hasRendered = false;
      const geometry = readGeometry();
      const width = renderer.width;
      const widthMethod = renderer.widthMethod;
      snapshotContext.width = width;
      snapshotContext.widthMethod = widthMethod;
      snapshotContext.terminalWidth = renderer._terminalWidth;
      snapshotContext.terminalHeight = renderer._terminalHeight;
      snapshotContext.resolution = renderer.resolution;
      snapshotContext.capabilities = renderer.capabilities;
      publicRoot.width = width;
      let targetHeight = Math.max(1, surfaceHeight);
      if (backingBuffer.widthMethod !== widthMethod) {
        const replacement = OptimizedBuffer.create(width, targetHeight, widthMethod, {
          id: `scrollback-surface-buffer-${surfaceId}`,
          owner: renderer.nativeScene
        });
        backingBuffer.destroy();
        backingBuffer = replacement;
      }
      for (let pass = 0;; pass += 1) {
        snapshotContext.height = targetHeight;
        internalRoot.resize(width, targetHeight);
        backingBuffer.resize(width, targetHeight);
        backingBuffer.clear(TRANSPARENT_RGBA);
        snapshotContext.frameId += 1;
        snapshotContext.renderSnapshot(internalRoot, backingBuffer);
        const measuredHeight = Math.max(1, publicRoot.height);
        if (pass === MAX_SCROLLBACK_SURFACE_HEIGHT_PASSES || measuredHeight === targetHeight)
          break;
        targetHeight = measuredHeight;
      }
      renderedGeometry = geometry;
      surfaceWidth = width;
      surfaceHeight = targetHeight;
      hasRendered = true;
    };
    const settleSurface = async (timeoutMs = 2000) => {
      assertNotDestroyed();
      if (!Number.isFinite(timeoutMs) || timeoutMs < 0)
        throw new Error("ScrollbackSurface.settle requires a finite non-negative timeout");
      const startedAt = renderer.clock.now();
      renderSurface();
      while (true) {
        assertNotDestroyed();
        const pending = collectPendingResources(publicRoot);
        if (pending.length === 0) {
          return;
        }
        const remainingMs = timeoutMs - (renderer.clock.now() - startedAt);
        if (remainingMs <= 0) {
          throw new Error("ScrollbackSurface.settle timed out waiting for CodeRenderable highlighting");
        }
        await waitForPendingHighlights(pending, remainingMs);
        assertNotDestroyed();
        renderSurface();
      }
    };
    const commitRows = (startRow, endRowExclusive, commitOptions = {}) => {
      assertNotDestroyed();
      assertRendered();
      assertGeometryStillCurrent();
      assertRowRange(startRow, endRowExclusive);
      if (startRow === endRowExclusive) {
        return;
      }
      const rowCount = endRowExclusive - startRow;
      const commitBuffer = OptimizedBuffer.create(surfaceWidth, rowCount, backingBuffer.widthMethod, {
        id: `scrollback-surface-commit-${surfaceId}`,
        owner: renderer.nativeScene
      });
      try {
        commitBuffer.drawFrameBuffer(0, 0, backingBuffer, 0, startRow, surfaceWidth, rowCount);
        renderer.enqueueRenderedScrollbackCommit({
          snapshot: commitBuffer,
          rowColumns: commitOptions.rowColumns,
          startOnNewLine: nextCommitStartOnNewLine,
          trailingNewline: commitOptions.trailingNewline ?? true
        });
        nextCommitStartOnNewLine = false;
      } catch (error) {
        if (!renderer.externalOutputQueue.owns(commitBuffer))
          commitBuffer.destroy();
        throw error;
      }
    };
    const destroySurface = () => {
      if (surfaceDestroyed) {
        return;
      }
      surfaceDestroyed = true;
      renderer.detachedSurfaces.delete(destroySurface);
      renderer.off("capabilities" /* CAPABILITIES */, capabilitiesListener);
      for (const cancel of pendingWaits)
        cancel();
      runCleanups([
        () => internalRoot.destroyRecursively(),
        () => backingBuffer.destroy(),
        () => renderContext.removeAllListeners(),
        () => snapshotContext.destroy()
      ]);
    };
    renderer.detachedSurfaces.add(destroySurface);
    renderer.on("capabilities" /* CAPABILITIES */, capabilitiesListener);
    return {
      get renderContext() {
        return renderContext;
      },
      get root() {
        return publicRoot;
      },
      get width() {
        return surfaceWidth;
      },
      get height() {
        return surfaceHeight;
      },
      get isDestroyed() {
        return surfaceDestroyed;
      },
      render: renderSurface,
      settle: settleSurface,
      commitRows,
      destroy: destroySurface
    };
  }
  writeToScrollback(write) {
    if (this._isDestroyed)
      throw new Error("Renderer is destroyed");
    if (this.screenMode !== "split-footer" || this.externalOutputMode !== "capture-stdout") {
      throw new Error('writeToScrollback requires screenMode "split-footer" and externalOutputMode "capture-stdout"');
    }
    const snapshotContext = new ScrollbackSnapshotRenderContext(this.width, this.height, this.widthMethod, this._terminalWidth, this._terminalHeight, this.resolution, this.capabilities, this.nativeSession, this.clock);
    let snapshot;
    let renderFailed = false;
    let snapshotRoot = null;
    let snapshotBuffer = null;
    try {
      snapshotRoot = new RootRenderable(snapshotContext);
      snapshotContext.root = snapshotRoot;
      snapshot = write({
        width: this.width,
        widthMethod: this.widthMethod,
        tailColumn: this.getPendingSplitTailColumn(),
        renderContext: snapshotContext
      });
      if (!snapshot || !snapshot.root)
        throw new Error("writeToScrollback must return a snapshot root renderable");
      const rootRenderable = snapshot.root;
      const snapshotWidth = this.getSnapshotDimension("width", snapshot.width, rootRenderable.width, this.width);
      const snapshotHeight = this.getSnapshotDimension("height", snapshot.height, rootRenderable.height, Infinity);
      snapshotContext.width = snapshotWidth;
      snapshotContext.height = snapshotHeight;
      snapshotContext.widthMethod = this.widthMethod;
      snapshotRoot.resize(snapshotWidth, snapshotHeight);
      snapshotBuffer = OptimizedBuffer.create(snapshotWidth, snapshotHeight, this.widthMethod, {
        id: "scrollback-snapshot-commit",
        owner: this.nativeScene
      });
      snapshotRoot.add(rootRenderable);
      snapshotContext.renderSnapshot(snapshotRoot, snapshotBuffer);
      this.enqueueRenderedScrollbackCommit({
        snapshot: snapshotBuffer,
        rowColumns: snapshot.rowColumns,
        startOnNewLine: snapshot.startOnNewLine,
        trailingNewline: snapshot.trailingNewline
      });
    } catch (error) {
      renderFailed = true;
      if (snapshotBuffer && !this.externalOutputQueue.owns(snapshotBuffer))
        snapshotBuffer.destroy();
      throw error;
    } finally {
      try {
        runCleanups([
          () => snapshotRoot?.destroyRecursively(),
          () => snapshot?.teardown?.(),
          () => snapshotContext.destroy()
        ]);
      } catch (error) {
        if (!renderFailed)
          throw error;
      }
    }
  }
  resetSplitFooterForReplay(options = {}) {
    if (this._isDestroyed)
      return;
    if (this._screenMode !== "split-footer" || this._externalOutputMode !== "capture-stdout") {
      throw new Error('resetSplitFooterForReplay requires screenMode "split-footer" and externalOutputMode "capture-stdout"');
    }
    if (!this._terminalIsSetup || this._controlState === "explicit_suspended" /* EXPLICIT_SUSPENDED */) {
      throw new Error("resetSplitFooterForReplay requires an active terminal");
    }
    if (this.rendering || this.externalOutputQueue.size > 0) {
      this.pendingNativeReplay = { options, remaining: this.externalOutputQueue.size };
      this.requestRender();
      return;
    }
    this.applySplitFooterReplayReset(options);
  }
  applySplitFooterReplayReset(options) {
    const bytes = this.lib.encoder.encode(ANSI.resetScrollRegion + ANSI.reset + ANSI.home + ANSI.clearScreen + (options.clearSavedLines ? ANSI.clearSavedLines : "") + ANSI.home);
    if (!this.nativeSession.write(bytes))
      throw new NativeError("Native terminal output", -11 /* OutputBackpressure */);
    this.abortSplitStartupCursorSeed();
    this.clearPendingSplitFooterTransition();
    this.resetSplitScrollback();
    this.pendingNativeReplay = null;
    this.forceFullRepaintRequested = true;
    this.requestRender();
  }
  getSnapshotDimension(axis, value, fallback, max) {
    const rawValue = value ?? fallback;
    if (!Number.isFinite(rawValue)) {
      throw new Error(`writeToScrollback produced a non-finite ${axis}`);
    }
    return Math.min(Math.max(Math.trunc(rawValue), 1), Math.max(max, 1));
  }
  advanceSplitTailColumn(tailColumn, columns, width) {
    if (columns <= 0) {
      return tailColumn;
    }
    let tail = tailColumn;
    let remaining = columns;
    while (remaining > 0) {
      if (tail >= width) {
        tail = 0;
      }
      const step = Math.min(remaining, width - tail);
      tail += step;
      remaining -= step;
      if (remaining > 0 && tail >= width) {
        tail = 0;
      }
    }
    return tail;
  }
  getSplitTailColumnAfterCommit(commit, initialTailColumn, width) {
    let tailColumn = initialTailColumn;
    if (commit.startOnNewLine && tailColumn > 0) {
      tailColumn = 0;
    }
    const rowWidths = commit.rowWidths;
    for (const [index, rowWidth] of rowWidths.entries()) {
      tailColumn = this.advanceSplitTailColumn(tailColumn, rowWidth, width);
      if (index < rowWidths.length - 1 || commit.trailingNewline) {
        tailColumn = 0;
      }
    }
    return tailColumn;
  }
  recordSplitCommit(commit) {
    this.splitTailColumn = this.getSplitTailColumnAfterCommit(commit, this.splitTailColumn, Math.max(this.width, 1));
  }
  getPendingSplitTailColumn() {
    const width = Math.max(this.width, 1);
    const skipped = this.pendingNativeReplay?.remaining ?? 0;
    const cached = this.queuedSplitTail;
    if (this.externalOutputQueue.size > skipped && cached?.width === width)
      return cached.column;
    let tailColumn = this.pendingNativeReplay ? 0 : this.splitTailColumn;
    for (const commit of this.externalOutputQueue.peek().slice(skipped)) {
      tailColumn = this.getSplitTailColumnAfterCommit(commit, tailColumn, width);
    }
    return tailColumn;
  }
  enqueueRenderedScrollbackCommit(options) {
    if (this.screenMode !== "split-footer" || this.externalOutputMode !== "capture-stdout") {
      throw new Error('scrollback commit requires screenMode "split-footer" and externalOutputMode "capture-stdout"');
    }
    const rowColumns = Math.min(Math.max(Math.trunc(options.rowColumns ?? options.snapshot.width), 0), options.snapshot.width);
    this.enqueueSplitCommits([
      {
        snapshot: options.snapshot,
        rowColumns,
        startOnNewLine: Boolean(options.startOnNewLine ?? true),
        trailingNewline: Boolean(options.trailingNewline ?? true)
      }
    ]);
  }
  enqueueSplitCommits(commits) {
    for (const commit of commits)
      commit.nativeSnapshot = commit.snapshot._getSceneHandle(this.nativeScene);
    const width = Math.max(this.width, 1);
    let column = this.getPendingSplitTailColumn();
    for (const entry of this.externalOutputQueue.writeSnapshots(commits)) {
      column = this.getSplitTailColumnAfterCommit(entry, column, width);
    }
    this.queuedSplitTail = { column, width };
    this.requestRender();
    if (this.listenerCount("external_output" /* EXTERNAL_OUTPUT */) > 0) {
      for (const commit of commits)
        this.emit("external_output" /* EXTERNAL_OUTPUT */, commit);
    }
  }
  splitStdoutRows(text) {
    const width = Math.max(1, this.width);
    const tailColumn = this.getPendingSplitTailColumn();
    const rows = [];
    let rowStart = 0;
    let line = "";
    let cells = 0;
    for (const { segment } of graphemeSegmenter2.segment(text)) {
      if (segment === "\r") {
        rows.length = rowStart;
        line = "";
        cells = 0;
        continue;
      }
      if (segment === `
` || segment === `\r
`) {
        rows.push({ line, cells, trailingNewline: true });
        rowStart = rows.length;
        line = "";
        cells = 0;
        continue;
      }
      const column = (rows.length === 0 && tailColumn < width ? tailColumn : 0) + cells;
      const tabCells = Math.min(STDOUT_TAB_WIDTH - column % STDOUT_TAB_WIDTH, Math.max(0, width - 1 - column));
      const grapheme = segment === "\t" ? " ".repeat(tabCells) : segment;
      const graphemeCells = stringWidth(grapheme);
      if (column > 0 && column + graphemeCells > width) {
        const padding = Math.max(0, width - column);
        rows.push({ line: line + " ".repeat(padding), cells: cells + padding, trailingNewline: false });
        line = "";
        cells = 0;
      }
      line += grapheme;
      cells += graphemeCells;
    }
    if (line.length > 0) {
      rows.push({ line, cells, trailingNewline: false });
    }
    return rows;
  }
  createStdoutSnapshotCommits(text) {
    const rows = this.splitStdoutRows(text);
    if (rows.length === 0) {
      return [];
    }
    const snapshotContext = new ScrollbackSnapshotRenderContext(this.width, 1, this.widthMethod, this._terminalWidth, this._terminalHeight, this.resolution, this.capabilities, this.nativeSession, this.clock);
    const commits = [];
    let snapshotRoot;
    try {
      snapshotRoot = new RootRenderable(snapshotContext);
      const snapshotRenderable = new TextRenderable(snapshotContext, {
        id: "captured-stdout-snapshot",
        position: "absolute",
        left: 0,
        top: 0,
        height: 1
      });
      snapshotRoot.add(snapshotRenderable);
      for (const { line, cells, trailingNewline } of rows) {
        const snapshotWidth = Math.max(1, cells);
        snapshotContext.width = snapshotWidth;
        snapshotRoot.resize(snapshotWidth, 1);
        snapshotRenderable.width = snapshotWidth;
        snapshotRenderable.content = line;
        const snapshot = OptimizedBuffer.create(snapshotWidth, 1, this.widthMethod, {
          id: "captured-stdout-snapshot",
          owner: this.nativeScene
        });
        commits.push({ snapshot, rowColumns: cells, startOnNewLine: false, trailingNewline });
        snapshotContext.renderSnapshot(snapshotRoot, snapshot);
      }
      return commits;
    } catch (error) {
      for (const commit of commits)
        commit.snapshot.destroy();
      throw error;
    } finally {
      runCleanups([() => snapshotRoot?.destroyRecursively(), () => snapshotContext.destroy()]);
    }
  }
  interceptStdoutWrite = (chunk, encoding, callback) => {
    const resolvedCallback = typeof encoding === "function" ? encoding : callback;
    const resolvedEncoding = typeof encoding === "string" ? encoding : undefined;
    const text = typeof chunk === "string" ? chunk : chunk?.toString(resolvedEncoding) ?? "";
    if (this._externalOutputMode === "capture-stdout" && this._screenMode === "split-footer" && this._splitHeight > 0) {
      const commits = this.createStdoutSnapshotCommits(text);
      try {
        this.enqueueSplitCommits(commits);
      } catch (error) {
        for (const commit of commits) {
          if (!this.externalOutputQueue.owns(commit.snapshot))
            commit.snapshot.destroy();
        }
        throw error;
      }
    }
    if (typeof resolvedCallback === "function") {
      process.nextTick(resolvedCallback);
    }
    return true;
  };
  getSplitPinnedRenderOffset() {
    return this._screenMode === "split-footer" ? Math.max(this._terminalHeight - this._splitHeight, 0) : 0;
  }
  getSplitCursorSeedRows() {
    const cursorState = this.getCursorState();
    const cursorRow = Number.isFinite(cursorState.y) ? Math.max(Math.trunc(cursorState.y), 1) : 1;
    return Math.min(cursorRow, Math.max(this._terminalHeight, 1));
  }
  isSplitCursorSeedFrameBlocked() {
    return this._screenMode === "split-footer" && this._externalOutputMode === "capture-stdout" && this._splitHeight > 0 && this.pendingSplitStartupCursorSeed && this.splitStartupSeedTimeoutId !== null;
  }
  clearSplitStartupCursorSeed() {
    this.pendingSplitStartupCursorSeed = false;
    if (this.splitStartupSeedTimeoutId !== null) {
      this.clock.clearTimeout(this.splitStartupSeedTimeoutId);
      this.splitStartupSeedTimeoutId = null;
    }
  }
  abortSplitStartupCursorSeed() {
    this.clearSplitStartupCursorSeed();
    for (const parser of this.legacyStdinParsers())
      parser.abortPendingStartupCursorCpr();
    this.updateStdinParserProtocolContext({ startupCursorCprActive: false });
  }
  resetSplitScrollback(seedRows = 0) {
    this.renderOffset = this.lib.sessionSplitControl(this.nativeSession.context, this.nativeSession.session, {
      kind: "reset",
      seedRows,
      pinnedRenderOffset: this.getSplitPinnedRenderOffset()
    });
    this.splitTailColumn = 0;
    this.queuedSplitTail = null;
  }
  syncSplitScrollback() {
    this.renderOffset = this.lib.sessionSplitControl(this.nativeSession.context, this.nativeSession.session, {
      kind: "sync",
      pinnedRenderOffset: this.getSplitPinnedRenderOffset()
    });
  }
  getSplitOutputOffset(surfaceOffset = this.renderOffset) {
    return this.lib.sessionSplitControl(this.nativeSession.context, this.nativeSession.session, {
      kind: "output-offset",
      surfaceOffset
    });
  }
  clearPendingSplitFooterTransition() {
    if (this.pendingSplitFooterTransition === null) {
      return;
    }
    this.lib.sessionSplitControl(this.nativeSession.context, this.nativeSession.session, { kind: "clear-transition" });
    this.pendingSplitFooterTransition = null;
  }
  setPendingSplitFooterTransition(transition) {
    this.lib.sessionSplitControl(this.nativeSession.context, this.nativeSession.session, {
      kind: "transition",
      ...transition
    });
    this.pendingSplitFooterTransition = transition;
  }
  setRenderOffset(offset) {
    this.lib.sessionSplitControl(this.nativeSession.context, this.nativeSession.session, {
      kind: "render-offset",
      renderOffset: offset
    });
    this.renderOffset = offset;
  }
  syncSplitFooterState() {
    const splitActive = this._screenMode === "split-footer" && this._splitHeight > 0;
    if (!splitActive) {
      this.clearPendingSplitFooterTransition();
      this.resetSplitScrollback();
      this.setRenderOffset(0);
      return;
    }
    if (this._externalOutputMode === "capture-stdout") {
      this.syncSplitScrollback();
    } else {
      this.clearPendingSplitFooterTransition();
      this.resetSplitScrollback();
      this.setRenderOffset(this.getSplitPinnedRenderOffset());
    }
  }
  getStaleSplitSurfaceClear(previousTopLine, previousHeight, nextTopLine, nextHeight) {
    if (!this._terminalIsSetup || previousHeight <= 0 || this._terminalHeight <= 0) {
      return "";
    }
    const terminalBottom = this._terminalHeight;
    const previousStart = Math.max(1, previousTopLine);
    const previousEnd = Math.min(terminalBottom, previousTopLine + previousHeight - 1);
    if (previousEnd < previousStart) {
      return "";
    }
    const nextStart = Math.max(1, nextTopLine);
    const nextEnd = Math.min(terminalBottom, nextTopLine + Math.max(nextHeight, 0) - 1);
    let clear = "";
    for (let line = previousStart;line <= previousEnd; line += 1) {
      if (line >= nextStart && line <= nextEnd) {
        continue;
      }
      clear += `${ANSI.moveCursor(line, 1)}\x1B[2K`;
    }
    return clear;
  }
  applyScreenMode(screenMode, emitResize = true, requestRender = true, footerHeight = this._footerHeight) {
    if (this._isDestroyed)
      return;
    if (this.nativeTerminalTransition && this._screenMode !== screenMode) {
      throw new Error("Cannot change native scene screen mode during a terminal transition");
    }
    if (this._screenMode === "split-footer" && screenMode !== "split-footer") {
      this.abortSplitStartupCursorSeed();
    }
    if (this.rendering || this._screenMode === "split-footer" && this.externalOutputQueue.size > 0 || this.nativeTerminalTransition) {
      this.pendingNativeMode = { screenMode, footerHeight };
      this.requestRender();
      return;
    }
    const prevScreenMode = this._screenMode;
    const prevSplitHeight = this._splitHeight;
    const nextGeometry = calculateRenderGeometry(screenMode, this._terminalWidth, this._terminalHeight, footerHeight);
    const nextSplitHeight = nextGeometry.effectiveFooterHeight;
    if (prevScreenMode === screenMode && prevSplitHeight === nextSplitHeight) {
      this._footerHeight = footerHeight;
      this.pendingNativeMode = null;
      return;
    }
    const terminalWritable = this._terminalIsSetup && this._controlState !== "explicit_suspended" /* EXPLICIT_SUSPENDED */;
    const prevUseAlternateScreen = prevScreenMode === "alternate-screen";
    const nextUseAlternateScreen = screenMode === "alternate-screen";
    const terminalScreenModeChanged = this._terminalIsSetup && prevUseAlternateScreen !== nextUseAlternateScreen;
    const leavingSplitFooter = prevSplitHeight > 0 && nextSplitHeight === 0;
    const previousSurfaceTopLine = this.renderOffset + 1;
    const shouldDeferSplitFooterResizeTransition = this._terminalIsSetup && prevScreenMode === "split-footer" && screenMode === "split-footer" && this._externalOutputMode === "capture-stdout" && prevSplitHeight > 0 && nextSplitHeight > 0 && !terminalScreenModeChanged;
    const splitStartupSeedBlocksFirstNativeFrame = this.pendingSplitStartupCursorSeed && this.splitStartupSeedTimeoutId !== null;
    const splitTransitionSourceTopLine = this.pendingSplitFooterTransition?.sourceTopLine ?? previousSurfaceTopLine;
    const splitTransitionSourceHeight = this.pendingSplitFooterTransition?.sourceHeight ?? prevSplitHeight;
    const splitTransitionSourceSurfaceOffset = Math.max(splitTransitionSourceTopLine - 1, 0);
    const splitTransitionSourceOutputOffset = prevScreenMode === "split-footer" && prevSplitHeight > 0 && this._externalOutputMode === "capture-stdout" ? this.getSplitOutputOffset(splitTransitionSourceSurfaceOffset) : splitTransitionSourceSurfaceOffset;
    const nextPinnedRenderOffset = nextGeometry.renderOffset;
    const nextSplitOutputOffset = screenMode === "split-footer" && nextSplitHeight > 0 && this._externalOutputMode === "capture-stdout" ? this.getSplitOutputOffset(nextPinnedRenderOffset) : nextPinnedRenderOffset;
    const pendingSplitFooterTransition = this.pendingSplitFooterTransition;
    const pendingSplitFooterReturn = pendingSplitFooterTransition !== null && nextSplitHeight === splitTransitionSourceHeight;
    const pendingSplitFooterViewportReturn = pendingSplitFooterReturn && pendingSplitFooterTransition.mode === "viewport-scroll" && (pendingSplitFooterTransition.scrollLines ?? 0) > 0;
    const shrinkingSplitFooter = nextSplitHeight > 0 && nextSplitHeight < splitTransitionSourceHeight;
    const growingSplitFooter = nextSplitHeight > splitTransitionSourceHeight && splitTransitionSourceHeight > 0;
    const nextSplitSurfaceOffset = screenMode !== "split-footer" || nextSplitHeight === 0 ? 0 : pendingSplitFooterViewportReturn ? pendingSplitFooterTransition.targetTopLine - 1 : pendingSplitFooterReturn ? splitTransitionSourceSurfaceOffset : shrinkingSplitFooter && splitTransitionSourceSurfaceOffset > 0 ? splitTransitionSourceSurfaceOffset : shrinkingSplitFooter ? nextSplitOutputOffset : growingSplitFooter ? Math.max(nextSplitOutputOffset, Math.min(splitTransitionSourceSurfaceOffset, nextPinnedRenderOffset)) : nextPinnedRenderOffset;
    const splitTransitionTargetTopLine = nextSplitSurfaceOffset + 1;
    const splitViewportScrollLines = pendingSplitFooterViewportReturn ? pendingSplitFooterTransition.scrollLines ?? 0 : nextSplitHeight > 0 && !pendingSplitFooterReturn ? Math.max(splitTransitionSourceOutputOffset - nextSplitOutputOffset, 0) : 0;
    const splitTransitionMode = (!shrinkingSplitFooter || pendingSplitFooterViewportReturn) && splitViewportScrollLines > 0 ? "viewport-scroll" : "clear-stale-rows";
    const splitFooterSurfaceMovesDown = nextSplitSurfaceOffset > splitTransitionSourceSurfaceOffset;
    const splitFooterSurfaceLeavesStaleRows = splitFooterSurfaceMovesDown || shrinkingSplitFooter;
    const shouldClearSplitSurfaceRowsImmediately = terminalWritable && !terminalScreenModeChanged && !shouldDeferSplitFooterResizeTransition && splitFooterSurfaceLeavesStaleRows && nextSplitHeight > 0;
    let scrollOutput = "";
    if (terminalWritable && !terminalScreenModeChanged && !shouldDeferSplitFooterResizeTransition) {
      if (prevSplitHeight === 0 && nextSplitHeight > 0) {
        scrollOutput = ANSI.scrollDown(this._terminalHeight - nextSplitHeight);
      } else if (splitViewportScrollLines > 0) {
        scrollOutput = ANSI.scrollUp(splitViewportScrollLines);
      }
    }
    const clearOutput = terminalWritable && leavingSplitFooter && !terminalScreenModeChanged ? ANSI.moveCursorAndClear(splitTransitionSourceTopLine, 1) : shouldClearSplitSurfaceRowsImmediately ? this.getStaleSplitSurfaceClear(splitTransitionSourceTopLine, splitTransitionSourceHeight, this._externalOutputMode === "capture-stdout" ? splitTransitionTargetTopLine : nextPinnedRenderOffset + 1, nextSplitHeight) : "";
    this.nativeSession.setScreen(nextUseAlternateScreen, nextGeometry.renderWidth, nextGeometry.renderHeight, this.lib.encoder.encode(scrollOutput + clearOutput));
    this._screenMode = screenMode;
    this._footerHeight = footerHeight;
    this._splitHeight = nextSplitHeight;
    this.width = nextGeometry.renderWidth;
    this.height = nextGeometry.renderHeight;
    this.pendingNativeMode = null;
    if (terminalWritable && leavingSplitFooter) {
      this.clearPendingSplitFooterTransition();
      this.renderOffset = 0;
      this.setRenderOffset(0);
    }
    if (this._screenMode === "split-footer" && this._externalOutputMode === "capture-stdout") {
      if (prevScreenMode !== "split-footer") {
        this.resetSplitScrollback(this.getSplitCursorSeedRows());
      } else {
        this.renderOffset = nextSplitSurfaceOffset;
        this.setRenderOffset(this.renderOffset);
      }
      if (shouldDeferSplitFooterResizeTransition) {
        if (splitStartupSeedBlocksFirstNativeFrame) {
          this.clearPendingSplitFooterTransition();
        } else {
          this.setPendingSplitFooterTransition({
            mode: splitTransitionMode,
            sourceTopLine: splitTransitionSourceTopLine,
            sourceHeight: splitTransitionSourceHeight,
            targetTopLine: splitTransitionTargetTopLine,
            targetHeight: nextSplitHeight,
            scrollLines: splitViewportScrollLines
          });
        }
        this.forceFullRepaintRequested = true;
      } else {
        this.clearPendingSplitFooterTransition();
      }
    } else {
      this.syncSplitFooterState();
    }
    this._console.resize(this.width, this.height);
    this.root.resize(this.width, this.height);
    if (emitResize) {
      this.emit("resize" /* RESIZE */, this.width, this.height);
    }
    if (requestRender) {
      this.requestRender();
    }
  }
  applyPendingNativeMode() {
    if (this._isDestroyed || this.rendering || this.nativeSplitFlush || this.nativeTerminalTransition)
      return;
    try {
      if (this.pendingNativeReplay?.remaining === 0)
        this.applySplitFooterReplayReset(this.pendingNativeReplay.options);
      if (this.pendingExternalOutputMode === "capture-stdout" && this._screenMode === "split-footer") {
        this.applyPendingExternalOutputModeIfReady();
      }
      if (this._screenMode === "split-footer" && this.externalOutputQueue.size > 0)
        return;
      if (this.pendingExternalOutputMode === "passthrough")
        this.applyPendingExternalOutputModeIfReady();
      const mode = this.pendingNativeMode;
      if (mode)
        this.applyScreenMode(mode.screenMode, true, true, mode.footerHeight);
      if (!this.pendingNativeMode)
        this.applyPendingExternalOutputModeIfReady();
    } catch (error) {
      if (error instanceof NativeError && (error.status === -13 /* OutputBusy */ || error.status === -11 /* OutputBackpressure */)) {
        this.scheduleRenderAfterOutputIdle();
      } else
        throw error;
    }
  }
  applyPendingNativeModeReported() {
    try {
      this.applyPendingNativeMode();
    } catch (error) {
      this.handleError(error);
    }
  }
  enableMouse() {
    if (this._terminalIsSetup)
      this.nativeSession.control({ kind: "mouse", mode: this.enableMouseMovement ? "motion" : "drag" });
    this._useMouse = true;
  }
  disableMouse() {
    if (this._terminalIsSetup && !this._isDestroyed && this._controlState !== "explicit_suspended" /* EXPLICIT_SUSPENDED */) {
      this.nativeSession.control({ kind: "mouse", mode: "disabled" });
    }
    this._useMouse = false;
    this.capturedRenderable = undefined;
    for (const parser of this.legacyStdinParsers())
      parser.resetMouseState();
  }
  enableKittyKeyboard(flags = 3) {
    if (this.nativeTerminalTransition || this._controlState === "explicit_suspended" /* EXPLICIT_SUSPENDED */) {
      throw new Error("Cannot change native scene Kitty modes during a terminal transition or suspension");
    }
    if (!Number.isInteger(flags) || flags < 0 || flags > 31)
      throw new RangeError("Native scene Kitty flags must be in 0..31");
    if (this._terminalIsSetup)
      this.nativeSession.control({ kind: "kitty-keyboard-flags", flags });
    this.nativeKittyKeyboardFlags = flags;
    this.updateStdinParserProtocolContext({ kittyKeyboardEnabled: flags !== 0 });
  }
  disableKittyKeyboard() {
    if (this.nativeTerminalTransition || this._controlState === "explicit_suspended" /* EXPLICIT_SUSPENDED */) {
      throw new Error("Cannot change native scene Kitty modes during a terminal transition or suspension");
    }
    if (this._terminalIsSetup)
      this.nativeSession.control({ kind: "kitty-keyboard-flags", flags: 0 });
    this.nativeKittyKeyboardFlags = 0;
    this.updateStdinParserProtocolContext({ kittyKeyboardEnabled: false }, true);
  }
  async setupTerminal() {
    if (this._terminalIsSetup)
      return;
    if (this.nativeTerminalTransition)
      return this.nativeTerminalTransition;
    const startupCursorCprActive = this._screenMode === "split-footer" && this._externalOutputMode === "capture-stdout";
    this.pendingSplitStartupCursorSeed = startupCursorCprActive;
    this.updateStdinParserProtocolContext({ startupCursorCprActive });
    const startup = this.admitReplyBatch("startup");
    try {
      await this.trackNativeTerminalTransition(this.nativeSession.setupTerminal({
        useAlternateScreen: this._screenMode === "alternate-screen",
        mouse: this._useMouse,
        mouseMovement: this.enableMouseMovement,
        kittyKeyboardFlags: this.nativeKittyKeyboardFlags,
        clearOnClose: this.clearOnShutdown,
        replySentinel: this.replySentinel,
        synchronizedOutput: this.synchronizedOutput,
        hostMultiplexer: this._usesProcessStdout && !!(process.env.TMUX || process.env.STY || process.env.ZELLIJ)
      }), () => {
        if (this._isDestroyed)
          return;
        this._terminalIsSetup = true;
        this._capabilities = this.nativeSession.getCapabilities();
        this.startKittyTransportPolling();
        this.nativeSession.startKittyFileProbe();
      });
    } catch (error) {
      this.abortSplitStartupCursorSeed();
      this.endReplyBatch(startup);
      throw error;
    }
    if (this._isDestroyed)
      return;
    if (this.debugOverlay.enabled) {
      this.configureDebugOverlay({});
      if (!this.memorySnapshotInterval) {
        this.memorySnapshotInterval = 3000;
        this.startMemorySnapshotTimer();
        this.automaticMemorySnapshot = true;
      }
    }
    this.armReplyBackstop(startup);
    if (this.pendingSplitStartupCursorSeed) {
      if (this.splitStartupSeedTimeoutId !== null) {
        this.clock.clearTimeout(this.splitStartupSeedTimeoutId);
      }
      this.splitStartupSeedTimeoutId = this.clock.setTimeout(() => {
        this.splitStartupSeedTimeoutId = null;
        if (!this.pendingSplitStartupCursorSeed) {
          return;
        }
        this.updateStdinParserProtocolContext({ startupCursorCprActive: false });
        if (this._screenMode === "split-footer" && this._externalOutputMode === "capture-stdout") {
          this.requestRender();
        }
        if (this.externalOutputQueue.size > 0)
          this.requestRender();
      }, 120);
    }
    this.queryPixelResolution();
    if (this.shouldSyncNativePaletteState()) {
      this.refreshPalette();
    }
  }
  get startupRepliesPending() {
    return this.replyBatches.some((batch) => batch.kind === "startup");
  }
  admitReplyBatch(kind) {
    const batch = { kind, backstop: null, excused: this.replyBatches.some((earlier) => earlier.excused) };
    this.replyBatches.push(batch);
    this.syncReplyContext(false);
    return batch;
  }
  armReplyBackstop(batch) {
    if (!this.replyBatches.includes(batch) || batch.backstop !== null)
      return;
    if (this._controlState === "explicit_suspended" /* EXPLICIT_SUSPENDED */)
      return;
    batch.backstop = this.clock.setTimeout(() => {
      batch.backstop = null;
      const pasting = this.stdinParser instanceof NativeStdinParser && this.stdinParser.pasting;
      this.replySentinel &&= batch.excused || pasting;
      this.endReplyBatch(batch);
    }, REPLY_BACKSTOP_MS);
  }
  endReplyBatch(batch) {
    const index = this.replyBatches.indexOf(batch);
    if (index < 0)
      return;
    this.replyBatches.splice(index, 1);
    if (batch.backstop !== null)
      this.clock.clearTimeout(batch.backstop);
    if (batch.kind === "startup") {
      this.clearSplitStartupCursorSeed();
      if (this._screenMode === "split-footer" && this._externalOutputMode === "capture-stdout")
        this.requestRender();
      this.resolveXtVersionWaiters();
    } else if (!this.replyBatches.some((other) => other.kind === "pixel")) {
      this.waitingForPixelResolution = false;
    }
    this.syncReplyContext(true);
  }
  syncReplyContext(drain) {
    const startup = this.startupRepliesPending;
    this.updateStdinParserProtocolContext({
      privateCapabilityRepliesActive: startup,
      explicitWidthCprActive: startup,
      ...startup ? {} : { startupCursorCprActive: false },
      pixelResolutionQueryActive: this.waitingForPixelResolution,
      replySentinelActive: this.replySentinel && this.replyBatches.length > 0
    }, drain);
  }
  trackNativeTerminalTransition(transition, complete) {
    const tracked = transition.then(() => complete?.()).finally(() => {
      if (this.nativeTerminalTransition === tracked)
        this.nativeTerminalTransition = null;
      this.applyPendingNativeModeReported();
      this.applyPendingNativeResize();
      this.resolveIdleIfNeeded();
    });
    this.nativeTerminalTransition = tracked;
    tracked.catch((error) => {
      if (this.canRender && !this.nativeSession.isCloseInterruption(error)) {
        this.handleError(error);
      }
    });
    return tracked;
  }
  stdinListener = ((chunk) => {
    const data = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    if (!this.stdinParser)
      return;
    if (this.stdinLogPath) {
      appendFileSync(this.stdinLogPath, data);
    }
    try {
      this.stdinParser.push(data);
      this.drainStdinParser();
    } catch (error) {
      this.handleStdinParserFailure(error);
    }
    try {
      this.stdinShadow?.parser.push(data);
      this.drainStdinShadow();
    } catch (error) {
      console.warn("[stdin-shadow] parser failure", error);
    }
  }).bind(this);
  addInputHandler(handler) {
    this.sequenceHandlers.push(handler);
  }
  prependInputHandler(handler) {
    this.sequenceHandlers.unshift(handler);
  }
  removeInputHandler(handler) {
    this.sequenceHandlers = this.sequenceHandlers.filter((candidate) => candidate !== handler);
  }
  updateStdinParserProtocolContext(patch, drain = false) {
    if (!this.stdinParser)
      return;
    this.stdinParser.updateProtocolContext(patch);
    this.stdinShadow?.parser.updateProtocolContext(patch);
    if (drain)
      this.drainStdinParser();
    this.drainStdinShadow();
  }
  legacyStdinParsers() {
    return [this.stdinParser, this.stdinShadow?.parser].filter((parser) => parser instanceof StdinParser);
  }
  subscribeOsc(handler) {
    this.oscSubscribers.add(handler);
    return () => {
      this.oscSubscribers.delete(handler);
    };
  }
  processCapabilitySequence(sequence, hasCursorReport) {
    const hasStandardCapabilitySignature = isCapabilityResponse(sequence) || hasCursorReport && isExplicitWidthReport(sequence);
    const shouldProcessAsCapability = hasStandardCapabilitySignature || hasCursorReport && (this.startupRepliesPending || this.nativeTerminalTransition !== null);
    if (!shouldProcessAsCapability) {
      return false;
    }
    try {
      this.nativeSession.control({ kind: "capability-response", bytes: Buffer.from(sequence) });
    } catch (error) {
      if (!(error instanceof NativeError))
        throw error;
      return error.status !== -19 /* InvalidPhase */;
    }
    const previous = JSON.stringify(this._capabilities);
    this._capabilities = this.nativeSession.getCapabilities();
    if (this._capabilities?.terminal?.from_xtversion) {
      this.resolveXtVersionWaiters();
    }
    if (JSON.stringify(this._capabilities) !== previous) {
      this.forceFullRepaintRequested = true;
      this.requestRender();
      this.emit("capabilities" /* CAPABILITIES */, this._capabilities);
    }
    const hadPendingSplitStartupCursorSeed = this.pendingSplitStartupCursorSeed;
    if (hadPendingSplitStartupCursorSeed && hasCursorReport && this._screenMode === "split-footer" && this._externalOutputMode === "capture-stdout") {
      this.resetSplitScrollback(this.getSplitCursorSeedRows());
      this.clearPendingSplitFooterTransition();
      this.clearSplitStartupCursorSeed();
      this.updateStdinParserProtocolContext({ startupCursorCprActive: false });
      this.requestRender();
    }
    const consumeStartupCursorReport = hadPendingSplitStartupCursorSeed && hasCursorReport && this.splitStartupSeedTimeoutId !== null;
    return hasStandardCapabilitySignature || consumeStartupCursorReport;
  }
  capabilityHandler = ((sequence) => {
    return this.processCapabilitySequence(sequence, false);
  }).bind(this);
  focusHandler = ((sequence) => {
    if (sequence === "\x1B[I") {
      if (this.shouldRestoreModesOnNextFocus) {
        this.nativeSession.control({ kind: "restore-modes" });
        this.shouldRestoreModesOnNextFocus = false;
      }
      if (this._terminalFocusState !== true) {
        this._terminalFocusState = true;
        this.emit("focus" /* FOCUS */);
      }
      return true;
    }
    if (sequence === "\x1B[O") {
      this.shouldRestoreModesOnNextFocus = true;
      if (this._terminalFocusState !== false) {
        this._terminalFocusState = false;
        this.emit("blur" /* BLUR */);
      }
      return true;
    }
    return false;
  }).bind(this);
  dispatchSequenceHandlers(sequence) {
    if (this._debugModeEnabled) {
      this._debugInputs.push({
        timestamp: new Date().toISOString(),
        sequence
      });
    }
    for (const handler of this.sequenceHandlers) {
      if (handler(sequence)) {
        return true;
      }
    }
    return false;
  }
  drainStdinParser() {
    if (!this.stdinParser)
      return;
    this.stdinParser.drain((event) => {
      this.stdinShadow?.comparator.primary(event);
      this.handleStdinEvent(event);
    });
  }
  drainStdinShadow() {
    const shadow = this.stdinShadow;
    shadow?.parser.drain((event) => shadow.comparator.shadow(event));
  }
  handleStdinEvent(event) {
    if (event.type === "response" && event.sequence.startsWith("\x1B_G")) {
      try {
        const result = this.nativeSession.processKittyImageReply(Buffer.from(event.sequence));
        if (result !== 0) {
          if (result === 2)
            this.requestRender();
          return;
        }
      } catch (error) {
        if (!(error instanceof NativeError) || error.status !== -12 /* SessionClosed */ && error.status !== -9 /* StaleHandle */ && error.status !== -18 /* RendererNotAttached */) {
          throw error;
        }
      }
    }
    if (event.type === "response" && this.replySentinel && this.replyBatches.length > 0 && DA1_REPLY.test(event.sequence)) {
      const batch = this.replyBatches[0];
      this.endReplyBatch(batch);
      if (batch.kind === "startup")
        this.processCapabilitySequence(event.sequence, false);
      return;
    }
    if (this._controlState === "explicit_suspended" /* EXPLICIT_SUSPENDED */) {
      if (event.type === "response" && isPixelResolutionResponse(event.sequence)) {
        this.dispatchSequenceHandlers(event.sequence);
      }
      return;
    }
    switch (event.type) {
      case "key":
        if (this.dispatchSequenceHandlers(event.raw)) {
          return;
        }
        this._keyHandler.processParsedKey(event.key);
        return;
      case "mouse":
        if (this._useMouse && this.processSingleMouseEvent(event.event)) {
          return;
        }
        this.dispatchSequenceHandlers(event.raw);
        return;
      case "paste":
        for (const batch of this.replyBatches)
          batch.excused = true;
        this._keyHandler.processPaste(event.bytes, event.metadata);
        return;
      case "response":
        if (event.protocol === "osc") {
          for (const subscriber of this.oscSubscribers) {
            subscriber(event.sequence);
          }
        }
        if (event.protocol === "cpr" && this.processCapabilitySequence(event.sequence, true)) {
          return;
        }
        this.dispatchSequenceHandlers(event.sequence);
        return;
    }
  }
  handleStdinParserFailure(error) {
    if (!this.hasLoggedStdinParserError) {
      this.hasLoggedStdinParserError = true;
      if (true) {
        console.error("[stdin-parser-error] parser failure, resetting parser", error);
      }
    }
    try {
      this.stdinParser?.reset();
      this.stdinShadow?.parser.reset();
    } catch (resetError) {
      console.error("stdin parser reset failed after parser error", resetError);
    }
  }
  setupInput() {
    if (this.stdinLogPath) {
      writeFileSync(this.stdinLogPath, Buffer.alloc(0), { mode: 384 });
    }
    for (const handler of this.prependedInputHandlers) {
      this.addInputHandler(handler);
    }
    this.addInputHandler((sequence) => {
      if (!isPixelResolutionResponse(sequence) || this.unansweredPixelQueries === 0)
        return false;
      this.unansweredPixelQueries--;
      this.waitingForPixelResolution = false;
      if (this.pixelResolutionRequeryPending) {
        this.syncReplyContext(false);
        this.queryPixelResolution();
        return true;
      }
      try {
        const resolution = parsePixelResolution(sequence);
        if (resolution) {
          this.lib.sessionSetImageResolution(this.nativeSession.context, this.nativeSession.session, this._terminalWidth, this._terminalHeight, resolution.width, resolution.height);
          this._resolution = resolution;
          this.requestRender();
        }
      } finally {
        this.syncReplyContext(true);
      }
      return true;
    });
    this.addInputHandler(this.capabilityHandler);
    this.addInputHandler(this.focusHandler);
    this.addInputHandler(this.themeModeHandler);
    if (this.stdin.setRawMode) {
      this.stdin.setRawMode(true);
    }
    this.stdin.on("data", this.stdinListener);
    this.stdin.resume();
    this.startTerminalKeepAlive();
  }
  dispatchMouseEvent(target, attributes) {
    const event = new MouseEvent(target, attributes);
    this.sendMouseEvent(target, event);
    if (this._isDestroyed || target.isDestroyed)
      return event;
    if (this.autoFocus && event.type === "down" && event.button === 0 /* LEFT */ && !event.defaultPrevented) {
      let current = target;
      while (current) {
        if (current.focusable) {
          current.focus();
          break;
        }
        current = current.parent;
      }
    }
    return event;
  }
  sendMouseEvent(target, event) {
    if (this._isDestroyed || target.isDestroyed)
      return;
    try {
      target.processMouseEvent(event);
    } catch (error) {
      const handled = this.emit("handler:error" /* HANDLER_ERROR */, { error, event });
      if (!handled)
        console.error("Error in mouse handler:", error);
    }
  }
  processSingleMouseEvent(mouseEvent) {
    const pressed = this.pressedRenderable;
    const left = mouseEvent.button === 0 /* LEFT */;
    if (left && (mouseEvent.type === "down" || mouseEvent.type === "up"))
      this.pressedRenderable = undefined;
    if (this._splitHeight > 0) {
      if (mouseEvent.y < this.renderOffset) {
        return false;
      }
      mouseEvent.y -= this.renderOffset;
    }
    this._latestPointer.x = mouseEvent.x;
    this._latestPointer.y = mouseEvent.y;
    this._hasPointer = true;
    this._lastPointerModifiers = mouseEvent.modifiers;
    if (this._console.visible) {
      const consoleBounds = this._console.bounds;
      if (mouseEvent.x >= consoleBounds.x && mouseEvent.x < consoleBounds.x + consoleBounds.width && mouseEvent.y >= consoleBounds.y && mouseEvent.y < consoleBounds.y + consoleBounds.height) {
        const event2 = new MouseEvent(null, mouseEvent);
        const handled = this._console.handleMouse(event2);
        if (handled)
          return true;
      }
    }
    if (mouseEvent.type === "scroll") {
      const maybeRenderableId2 = this.hitTest(mouseEvent.x, mouseEvent.y);
      const maybeRenderable2 = Renderable.renderablesByNumber.get(maybeRenderableId2);
      const fallbackTarget = this._currentFocusedRenderable && !this._currentFocusedRenderable.isDestroyed && this._currentFocusedRenderable.focused ? this._currentFocusedRenderable : null;
      const scrollTarget = maybeRenderable2 ?? fallbackTarget;
      if (scrollTarget) {
        const event2 = new MouseEvent(scrollTarget, mouseEvent);
        this.sendMouseEvent(scrollTarget, event2);
      }
      return true;
    }
    const maybeRenderableId = this.hitTest(mouseEvent.x, mouseEvent.y);
    const sameElement = maybeRenderableId === this.lastOverRenderableNum;
    this.lastOverRenderableNum = maybeRenderableId;
    const maybeRenderable = Renderable.renderablesByNumber.get(maybeRenderableId);
    if (mouseEvent.type === "down" && mouseEvent.button === 0 /* LEFT */ && !this.currentSelection?.isDragging && !mouseEvent.modifiers.ctrl) {
      const canStartSelection = Boolean(maybeRenderable && maybeRenderable.selectable && !maybeRenderable.isDestroyed && maybeRenderable.shouldStartSelection(mouseEvent.x, mouseEvent.y));
      if (canStartSelection && maybeRenderable) {
        this.startSelection(maybeRenderable, mouseEvent.x, mouseEvent.y, this.nextClickBehavior(maybeRenderable, mouseEvent.x, mouseEvent.y));
        this.dispatchMouseEvent(maybeRenderable, mouseEvent);
        return true;
      }
    }
    if (mouseEvent.type === "drag" && this.currentSelection?.isDragging) {
      this.updateSelection(maybeRenderable, mouseEvent.x, mouseEvent.y);
      if (maybeRenderable) {
        const event2 = new MouseEvent(maybeRenderable, {
          ...mouseEvent,
          isDragging: true
        });
        this.sendMouseEvent(maybeRenderable, event2);
      }
      return true;
    }
    if (mouseEvent.type === "up" && mouseEvent.button === 0 /* LEFT */ && this.currentSelection?.isDragging) {
      if (maybeRenderable) {
        const event2 = new MouseEvent(maybeRenderable, {
          ...mouseEvent,
          isDragging: true
        });
        this.sendMouseEvent(maybeRenderable, event2);
      }
      this.finishSelection();
      return true;
    }
    if (mouseEvent.type === "down" && mouseEvent.button === 0 /* LEFT */ && this.currentSelection) {
      if (mouseEvent.modifiers.ctrl) {
        this.currentSelection.isDragging = true;
        this.updateSelection(maybeRenderable, mouseEvent.x, mouseEvent.y);
        return true;
      }
    }
    if (!sameElement && (mouseEvent.type === "drag" || mouseEvent.type === "move")) {
      if (this.lastOverRenderable && this.lastOverRenderable !== this.capturedRenderable && !this.lastOverRenderable.isDestroyed) {
        const event2 = new MouseEvent(this.lastOverRenderable, {
          ...mouseEvent,
          type: "out"
        });
        this.sendMouseEvent(this.lastOverRenderable, event2);
      }
      this.lastOverRenderable = maybeRenderable;
      if (maybeRenderable) {
        const event2 = new MouseEvent(maybeRenderable, {
          ...mouseEvent,
          type: "over",
          source: this.capturedRenderable
        });
        this.sendMouseEvent(maybeRenderable, event2);
      }
    }
    if (this.capturedRenderable && mouseEvent.type !== "up") {
      const event2 = new MouseEvent(this.capturedRenderable, mouseEvent);
      this.sendMouseEvent(this.capturedRenderable, event2);
      return true;
    }
    if (this.capturedRenderable && mouseEvent.type === "up") {
      const source = this.capturedRenderable;
      this.sendMouseEvent(source, new MouseEvent(source, { ...mouseEvent, type: "drag-end" }));
      this.sendMouseEvent(source, new MouseEvent(source, mouseEvent));
      this.lastOverRenderable = source;
      this.lastOverRenderableNum = source.num;
      this.capturedRenderable = undefined;
      this.requestRender();
      if (maybeRenderable && this.isWithinContainer(maybeRenderable, source))
        return true;
      if (maybeRenderable) {
        this.sendMouseEvent(maybeRenderable, new MouseEvent(maybeRenderable, { ...mouseEvent, type: "drop", source }));
      }
    }
    const isLeftDrag = left && mouseEvent.type === "drag";
    const target = isLeftDrag && pressed && !pressed.isDestroyed ? pressed : maybeRenderable;
    let event;
    if (target) {
      if (isLeftDrag)
        this.capturedRenderable = target;
      else if (left && mouseEvent.type === "down")
        this.pressedRenderable = target;
      event = this.dispatchMouseEvent(target, mouseEvent);
    } else {
      this.lastOverRenderable = undefined;
    }
    if (!event?.defaultPrevented && mouseEvent.type === "down" && mouseEvent.button === 0 /* LEFT */ && this.currentSelection) {
      this.clearSelection();
    }
    return true;
  }
  recheckHoverState() {
    if (this._isDestroyed || !this._hasPointer)
      return;
    if (this.capturedRenderable)
      return;
    const hitId = this.hitTest(this._latestPointer.x, this._latestPointer.y);
    const hitRenderable = Renderable.renderablesByNumber.get(hitId);
    const lastOver = this.lastOverRenderable;
    if (lastOver?.num === hitId) {
      this.lastOverRenderableNum = hitId;
      return;
    }
    const baseEvent = {
      type: "move",
      button: 0,
      x: this._latestPointer.x,
      y: this._latestPointer.y,
      modifiers: this._lastPointerModifiers
    };
    if (lastOver && !lastOver.isDestroyed) {
      const event = new MouseEvent(lastOver, { ...baseEvent, type: "out" });
      this.sendMouseEvent(lastOver, event);
    }
    if (this._isDestroyed || this.capturedRenderable || this.lastOverRenderable !== lastOver)
      return;
    this.lastOverRenderable = hitRenderable?.isDestroyed ? undefined : hitRenderable;
    this.lastOverRenderableNum = this.lastOverRenderable?.num ?? 0;
    if (hitRenderable && !hitRenderable.isDestroyed) {
      const event = new MouseEvent(hitRenderable, {
        ...baseEvent,
        type: "over"
      });
      this.sendMouseEvent(hitRenderable, event);
      if (this.lastOverRenderable === hitRenderable && (this._isDestroyed || hitRenderable.isDestroyed)) {
        this.lastOverRenderable = undefined;
        this.lastOverRenderableNum = 0;
      }
    }
  }
  setMousePointer(style) {
    this.setCursorStyle({ cursor: style });
  }
  hitTest(x, y) {
    return this.nativeScene.hitTest(x, y);
  }
  takeMemorySnapshot() {
    if (this._isDestroyed)
      return;
    const memoryUsage = process.memoryUsage();
    this.lastMemorySnapshot = {
      heapUsed: memoryUsage.heapUsed,
      heapTotal: memoryUsage.heapTotal,
      arrayBuffers: memoryUsage.arrayBuffers
    };
    this.lib.sessionUpdateMemoryStats(this.nativeSession.context, this.nativeSession.session, this.lastMemorySnapshot.heapUsed, this.lastMemorySnapshot.heapTotal, this.lastMemorySnapshot.arrayBuffers);
    this.emit("memory:snapshot" /* MEMORY_SNAPSHOT */, this.lastMemorySnapshot);
  }
  startMemorySnapshotTimer() {
    this.stopMemorySnapshotTimer();
    this.memorySnapshotTimer = this.clock.setInterval(() => {
      this.takeMemorySnapshot();
    }, this.memorySnapshotInterval);
  }
  stopMemorySnapshotTimer() {
    if (this.memorySnapshotTimer) {
      this.clock.clearInterval(this.memorySnapshotTimer);
      this.memorySnapshotTimer = null;
    }
  }
  setMemorySnapshotInterval(interval) {
    this.memorySnapshotInterval = interval;
    if (this._isRunning && interval > 0) {
      this.startMemorySnapshotTimer();
    } else if (interval <= 0 && this.memorySnapshotTimer) {
      this.clock.clearInterval(this.memorySnapshotTimer);
      this.memorySnapshotTimer = null;
    }
  }
  requestResize(width, height) {
    if (this._isDestroyed)
      return;
    if (width !== this._terminalWidth || height !== this._terminalHeight)
      this.pendingResizeSawDifferentSize = true;
    this.pendingNativeResize = { width, height };
    if (this.resizeTimeoutId !== null) {
      this.clock.clearTimeout(this.resizeTimeoutId);
      this.resizeTimeoutId = null;
    }
    if (this._splitHeight > 0) {
      this.applyPendingNativeResize();
      return;
    }
    this.resizeTimeoutId = this.clock.setTimeout(() => {
      this.resizeTimeoutId = null;
      this.applyPendingNativeResize();
    }, this.resizeDebounceDelay);
  }
  applyPendingNativeResize() {
    const resize = this.pendingNativeResize;
    if (!resize || this._isDestroyed || this.rendering || this.resizeTimeoutId !== null || this.nativeResizeWait || this.nativeTerminalTransition || this._controlState === "explicit_suspended" /* EXPLICIT_SUSPENDED */)
      return;
    if (this.externalOutputQueue.size > 0 && !this.isSplitCursorSeedFrameBlocked()) {
      this.requestRender();
      return;
    }
    try {
      this.processResize(resize.width, resize.height, this.pendingResizeSawDifferentSize);
      if (this.pendingNativeResize === resize) {
        this.pendingNativeResize = null;
        this.pendingResizeSawDifferentSize = false;
      }
    } catch (error) {
      if (error instanceof NativeError && error.status === -19 /* InvalidPhase */)
        return;
      if (error instanceof NativeError && error.status === -13 /* OutputBusy */) {
        const wait = this.nativeSession.idle();
        this.nativeResizeWait = wait;
        wait.then(() => {
          this.nativeResizeWait = null;
          this.applyPendingNativeResize();
          this.resolveIdleIfNeeded();
        }, (error2) => {
          this.nativeResizeWait = null;
          this.pendingNativeResize = null;
          if (!this._isDestroyed)
            this.handleError(error2);
          this.resolveIdleIfNeeded();
        });
        return;
      }
      if (this.pendingNativeResize === resize) {
        this.pendingNativeResize = null;
        this.pendingResizeSawDifferentSize = false;
      }
      this.handleError(error);
    }
    this.resolveIdleIfNeeded();
  }
  pixelResolutionRetry = null;
  queryPixelResolution(retry = true) {
    this.pixelResolutionRequeryPending = true;
    if (this._isDestroyed || !this._terminalIsSetup || this._controlState === "explicit_suspended" /* EXPLICIT_SUSPENDED */ || this.waitingForPixelResolution || this.unansweredPixelQueries >= PIXEL_QUERIES_MAX || this.pixelResolutionRetry)
      return;
    try {
      this.nativeSession.control({ kind: "query-pixel-resolution", sentinel: this.replySentinel });
      this.pixelResolutionRequeryPending = false;
      this.waitingForPixelResolution = true;
      this.unansweredPixelQueries++;
      const batch = this.admitReplyBatch("pixel");
      this.nativeSession.idle().then(() => this.armReplyBackstop(batch), () => {});
    } catch (error) {
      if (!(error instanceof NativeError))
        throw error;
      if (error.status === -19 /* InvalidPhase */)
        return;
      if (error.status !== -11 /* OutputBackpressure */ && error.status !== -13 /* OutputBusy */)
        throw error;
      if (!retry)
        return;
      const wait = this.nativeSession.idle();
      this.pixelResolutionRetry = wait;
      wait.then(() => {
        this.pixelResolutionRetry = null;
        if (!this._isDestroyed && this.pixelResolutionRequeryPending) {
          try {
            this.queryPixelResolution(false);
          } catch (error2) {
            this.handleError(error2);
          }
        }
      }, (error2) => {
        this.pixelResolutionRetry = null;
        if (!this._isDestroyed)
          this.handleError(error2);
      });
    }
  }
  processResize(width, height, repaintIfUnchanged = false) {
    if (width === this._terminalWidth && height === this._terminalHeight) {
      if (repaintIfUnchanged) {
        this.forceFullRepaintRequested = true;
        this.requestRender();
      }
      return;
    }
    const terminalWritable = this._terminalIsSetup && this._controlState !== "explicit_suspended" /* EXPLICIT_SUSPENDED */;
    if (terminalWritable && !this.isSplitCursorSeedFrameBlocked() && this.externalOutputQueue.size > 0) {
      this.pendingNativeResize = { width, height };
      this.requestRender();
      return;
    }
    const pendingSplitFooterTransition = this.pendingSplitFooterTransition;
    const previousGeometry = calculateRenderGeometry(this._screenMode, this._terminalWidth, this._terminalHeight, this._footerHeight);
    const prevWidth = this._terminalWidth;
    const previousTerminalHeight = this._terminalHeight;
    const visiblePreviousSplitHeight = pendingSplitFooterTransition?.sourceHeight ?? previousGeometry.effectiveFooterHeight;
    const nextGeometry = calculateRenderGeometry(this._screenMode, width, height, this._footerHeight);
    const splitFooterActive = this._screenMode === "split-footer";
    let clearStart = null;
    if (splitFooterActive && terminalWritable) {
      if (width < prevWidth && visiblePreviousSplitHeight > 0) {
        clearStart = Math.min(this.renderOffset + 1, Math.max(previousTerminalHeight - visiblePreviousSplitHeight * 2, 1));
      }
      if (pendingSplitFooterTransition !== null) {
        clearStart = clearStart === null ? pendingSplitFooterTransition.sourceTopLine : Math.min(clearStart, pendingSplitFooterTransition.sourceTopLine);
      }
    }
    if (clearStart === null)
      this.nativeSession.resize(nextGeometry.renderWidth, nextGeometry.renderHeight);
    else {
      this.nativeSession.setScreen(this._screenMode === "alternate-screen", nextGeometry.renderWidth, nextGeometry.renderHeight, this.lib.encoder.encode(ANSI.moveCursorAndClear(clearStart, 1)));
    }
    this._terminalWidth = width;
    this._terminalHeight = height;
    this._splitHeight = nextGeometry.effectiveFooterHeight;
    this.width = nextGeometry.renderWidth;
    this.height = nextGeometry.renderHeight;
    this._resolution = null;
    this.lib.sessionSetImageResolution(this.nativeSession.context, this.nativeSession.session, 0, 0, 0, 0);
    this.capturedRenderable = undefined;
    for (const parser of this.legacyStdinParsers())
      parser.resetMouseState();
    if (splitFooterActive) {
      this.forceFullRepaintRequested = true;
    }
    this.clearPendingSplitFooterTransition();
    if (this._screenMode === "split-footer" && this._externalOutputMode === "capture-stdout") {
      this.syncSplitScrollback();
    } else if (splitFooterActive) {
      this.syncSplitFooterState();
    }
    this._console.resize(this.width, this.height);
    this.root.resize(this.width, this.height);
    this.queryPixelResolution();
    this.emit("resize" /* RESIZE */, this.width, this.height);
    this.requestRender();
  }
  resize(width, height) {
    if (this._isDestroyed)
      return;
    if (this.resizeTimeoutId !== null) {
      this.clock.clearTimeout(this.resizeTimeoutId);
      this.resizeTimeoutId = null;
    }
    if (this.pendingNativeResize !== null) {
      this.deferResize(width, height);
      return;
    }
    try {
      this.processResize(width, height);
    } catch (error) {
      if (!(error instanceof NativeError) || error.status !== -13 /* OutputBusy */ && error.status !== -27 /* FrameBusy */) {
        throw error;
      }
      this.deferResize(width, height);
    }
  }
  deferResize(width, height) {
    if (width !== this._terminalWidth || height !== this._terminalHeight)
      this.pendingResizeSawDifferentSize = true;
    this.pendingNativeResize = { width, height };
    this.applyPendingNativeResize();
  }
  setBackgroundColor(color) {
    this.backgroundColor = RGBA.clone(parseColor(color));
    this.requestRender();
  }
  toggleDebugOverlay() {
    const willBeEnabled = !this.debugOverlay.enabled;
    this.configureDebugOverlay({ enabled: willBeEnabled });
    if (willBeEnabled && !this.memorySnapshotInterval) {
      this.memorySnapshotInterval = 3000;
      this.startMemorySnapshotTimer();
      this.automaticMemorySnapshot = true;
    } else if (!willBeEnabled && this.automaticMemorySnapshot) {
      this.stopMemorySnapshotTimer();
      this.memorySnapshotInterval = 0;
      this.automaticMemorySnapshot = false;
    }
    this.emit("debugOverlay:toggle" /* DEBUG_OVERLAY_TOGGLE */, this.debugOverlay.enabled);
  }
  configureDebugOverlay(options) {
    const enabled = options.enabled ?? this.debugOverlay.enabled;
    const corner = options.corner ?? this.debugOverlay.corner;
    this.lib.sessionSetDebugOverlay(this.nativeSession.context, this.nativeSession.session, enabled, corner);
    this.debugOverlay.enabled = enabled;
    this.debugOverlay.corner = corner;
    this.requestRender();
  }
  setTerminalTitle(title) {
    this.nativeSession.control({ kind: "title", title });
  }
  resetTerminalBgColor() {
    this.nativeSession.control({ kind: "reset-background" });
  }
  copyToClipboardOSC52(text, target) {
    if (!this.isOsc52Supported())
      return false;
    return this.nativeSession.writeClipboard(target ?? 0 /* Clipboard */, this.lib.encoder.encode(text));
  }
  clearClipboardOSC52(target) {
    return this.nativeSession.writeClipboard(target ?? 0 /* Clipboard */, new Uint8Array(0));
  }
  isOsc52Supported() {
    return this.nativeSession.getCapabilities().osc52_support !== "unsupported";
  }
  dumpHitGrid() {
    this.lib.sessionDumpHitGrid(this.nativeSession.context, this.nativeSession.session);
  }
  getLinkIdAt(x, y) {
    if (this._isDestroyed || !Number.isInteger(x) || !Number.isInteger(y) || x < 0 || y < 0 || x > 2147483647 || y > 2147483647) {
      return 0;
    }
    return this.lib.sessionGetLinkId(this.nativeSession.context, this.nativeSession.session, x, y);
  }
  getLinkAt(x, y) {
    const linkId = this.getLinkIdAt(x, y);
    return linkId === 0 ? null : this.lib.contextGetLinkUrl(this.nativeSession.context, linkId) || null;
  }
  static setCursorPosition(renderer, x, y, visible = true) {
    renderer.setCursorPosition(x, y, visible);
  }
  static setCursorStyle(renderer, options) {
    renderer.setCursorStyle(options);
  }
  static setCursorColor(renderer, color) {
    renderer.setCursorColor(color);
  }
  setCursorPosition(x, y, visible = true) {
    this.lib.sessionSetCursor(this.nativeSession.context, this.nativeSession.session, { position: { x, y, visible } });
  }
  setCursorStyle(options) {
    this.lib.sessionSetCursor(this.nativeSession.context, this.nativeSession.session, options);
    if (options.cursor !== undefined) {
      this._currentMousePointerStyle = options.cursor;
    }
  }
  setCursorColor(color) {
    this.lib.sessionSetCursor(this.nativeSession.context, this.nativeSession.session, { color });
  }
  getCursorState() {
    return this.lib.sceneGetCursorState(this.nativeSession.context, this.nativeSession.session);
  }
  addPostProcessFn(processFn) {
    this.postProcessFns.push(processFn);
  }
  removePostProcessFn(processFn) {
    this.postProcessFns = this.postProcessFns.filter((fn) => fn !== processFn);
  }
  clearPostProcessFns() {
    this.postProcessFns = [];
  }
  setFrameCallback(callback) {
    this.frameCallbacks.push(callback);
  }
  hasFrameCallback(callback) {
    return this.frameCallbacks.includes(callback);
  }
  removeFrameCallback(callback) {
    this.frameCallbacks = this.frameCallbacks.filter((cb) => cb !== callback);
  }
  clearFrameCallbacks() {
    this.frameCallbacks = [];
  }
  get canRender() {
    return !this._isDestroyed && !this.nativeSession.error && !this.nativeSession.disposed;
  }
  requestAnimationFrame(callback) {
    if (!this.canRender)
      return -1;
    const id = CliRenderer.animationFrameId++;
    this.animationRequest.set(id, callback);
    this.requestLive();
    return id;
  }
  cancelAnimationFrame(handle) {
    if (this.animationRequest.delete(handle))
      this.dropLive();
  }
  onAnimationTick(fps, callback, options = {}) {
    const interval = 1000 / fps;
    const { tolerance } = options;
    if (!(interval > 0 && interval < Infinity))
      throw new RangeError(`fps must be positive and finite, got ${fps}`);
    if (tolerance !== undefined && !(tolerance >= 0 && tolerance < interval)) {
      throw new RangeError(`tolerance must be at least 0 and below the interval (${interval} ms), got ${tolerance}`);
    }
    if (this._isDestroyed)
      return () => {};
    const now = this.clock.now();
    const window = Math.max(tolerance === undefined ? 500 : tolerance * fps, ANIMATION_TIMER_SLACK_MS * fps);
    const ticker = { fps, window, next: Math.floor((now * fps + window) / 1000) + 1, last: now, callback };
    this.animationTickers.add(ticker);
    this.scheduleAnimationTick();
    return () => {
      if (this.animationTickers.delete(ticker))
        this.scheduleAnimationTick();
    };
  }
  scheduleAnimationTick() {
    if (this.animationTimer !== null)
      this.clock.clearTimeout(this.animationTimer);
    this.animationTimer = null;
    let fastest = 0;
    for (const ticker of this.animationTickers)
      fastest = Math.max(fastest, ticker.fps);
    let due = Infinity;
    for (const ticker of this.animationTickers) {
      const late = ticker.fps === fastest ? 0 : ticker.window;
      due = Math.min(due, (ticker.next * 1000 + late) / ticker.fps);
    }
    if (due === Infinity)
      return;
    this.animationTimer = this.clock.setTimeout(() => {
      this.animationTimer = null;
      this.requestRender();
    }, Math.max(0, due - this.clock.now()));
  }
  runAnimationTicks(time) {
    if (this.animationTickers.size === 0)
      return;
    for (const ticker of this.animationTickers) {
      const reach = Math.floor((time * ticker.fps + ticker.window) / 1000);
      if (reach < ticker.next)
        continue;
      const ticks = reach + 1 - ticker.next;
      const deltaTime = Math.max(0, time - ticker.last);
      ticker.next = reach + 1;
      ticker.last = time;
      try {
        ticker.callback(deltaTime, ticks, time);
      } catch (error) {
        console.error("Error in animation tick callback:", error);
      }
    }
    this.scheduleAnimationTick();
  }
  yieldFrame() {
    if (!this.canRender)
      return Promise.resolve();
    return new Promise((resolve) => {
      const finish = () => {
        this.cancelFrameContinuation = null;
        resolve();
      };
      const cancel = this.nativeSession.scheduler.schedule(finish);
      this.cancelFrameContinuation = () => {
        cancel();
        finish();
      };
    });
  }
  queueFrame() {
    if (this.cancelReadyFrame || this._isDestroyed)
      return;
    if (!this.canRender) {
      this.destroy();
      return;
    }
    this.cancelReadyFrame = this.nativeSession.scheduler.schedule(() => {
      this.cancelReadyFrame = null;
      this.loop();
    });
  }
  requestLive() {
    if (!this.canRender)
      return;
    this.liveRequestCounter++;
    if (this._controlState === "idle" /* IDLE */ && this.liveRequestCounter > 0) {
      this._controlState = "auto_started" /* AUTO_STARTED */;
      this.internalStart();
    } else if (this._controlState === "explicit_suspended" /* EXPLICIT_SUSPENDED */ && this._previousControlState === "idle" /* IDLE */) {
      this._previousControlState = "auto_started" /* AUTO_STARTED */;
    }
  }
  dropLive() {
    if (this.liveRequestCounter === 0)
      return;
    this.liveRequestCounter--;
    if (this.liveRequestCounter === 0 && this._controlState === "explicit_suspended" /* EXPLICIT_SUSPENDED */ && this._previousControlState === "auto_started" /* AUTO_STARTED */) {
      this._previousControlState = "idle" /* IDLE */;
    }
    if (this._controlState === "auto_started" /* AUTO_STARTED */ && this.liveRequestCounter === 0) {
      this._controlState = "idle" /* IDLE */;
      this._isRunning = false;
      this.resolveIdleIfNeeded();
    }
  }
  start() {
    this._controlState = "explicit_started" /* EXPLICIT_STARTED */;
    this.internalStart();
  }
  auto() {
    this._controlState = this._isRunning ? "auto_started" /* AUTO_STARTED */ : "idle" /* IDLE */;
  }
  internalStart() {
    if (!this._isRunning && !this._isDestroyed) {
      this._isRunning = true;
      this.cancelReadyFrame?.();
      this.cancelReadyFrame = null;
      this.clearFrameTimer();
      if (this.memorySnapshotInterval > 0) {
        this.startMemorySnapshotTimer();
      }
      this.startRenderLoop();
    }
  }
  pause() {
    this._controlState = "explicit_paused" /* EXPLICIT_PAUSED */;
    this.ordinaryFrameWaitControlState = null;
    this.halt(false);
  }
  suspend() {
    if (this.nativeSplitFlush)
      return this.nativeTerminalTransition;
    if (!this._terminalIsSetup || this.nativeTerminalTransition) {
      throw new Error("Native scene suspension requires completed terminal setup and no pending transition");
    }
    const flushNativeSplit = this.externalOutputQueue.size > 0 || this.pendingNativeReplay;
    if (flushNativeSplit)
      this.lib.getYogaHost().assertMutable();
    let nativeTransition;
    if (flushNativeSplit) {
      const count = this.externalOutputQueue.size;
      this.nativeSplitFlush = Promise.resolve().then(() => this.flushNativeSplitOutput(count));
      nativeTransition = (async () => {
        try {
          await this.nativeSplitFlush;
          if (this._isDestroyed)
            throw new Error("Native scene suspension interrupted by renderer destruction");
          return this.nativeSession.suspend();
        } finally {
          this.nativeSplitFlush = null;
        }
      })();
    } else {
      nativeTransition = this.nativeSession.suspend();
    }
    nativeTransition = this.trackNativeTerminalTransition(nativeTransition);
    if (this._controlState !== "explicit_suspended" /* EXPLICIT_SUSPENDED */) {
      this._previousControlState = this._controlState;
      this._suspendedMouseEnabled = this._useMouse;
    }
    this._controlState = "explicit_suspended" /* EXPLICIT_SUSPENDED */;
    this._cancelPaletteDetection?.(new Error("Cannot detect palette while renderer is suspended"));
    this.resolveXtVersionWaiters();
    this.halt(false);
    this.clearSplitStartupCursorSeed();
    this.disableMouse();
    this.removeExitListeners();
    for (const batch of [...this.replyBatches]) {
      if (batch.backstop !== null)
        this.clock.clearTimeout(batch.backstop);
      batch.backstop = null;
      batch.excused = true;
      if (!this.replySentinel && batch.kind === "startup")
        this.endReplyBatch(batch);
    }
    this.updateStdinParserProtocolContext({ startupCursorCprActive: false }, true);
    this.pauseStdinParsers(false);
    this.stdin.removeListener("data", this.stdinListener);
    this.stopTerminalKeepAlive();
    this.themeModeState?.cancelRefresh();
    if (this.stdin.setRawMode) {
      this.stdin.setRawMode(false);
    }
    this.stdin.pause();
    return nativeTransition;
  }
  resume() {
    if (!this._terminalIsSetup || this._isDestroyed || this.nativeTerminalTransition || this._controlState !== "explicit_suspended" /* EXPLICIT_SUSPENDED */) {
      throw new Error("Native scene resume requires completed suspension");
    }
    if (this.pendingSplitFooterTransition) {
      this.lib.sessionSplitControl(this.nativeSession.context, this.nativeSession.session, {
        kind: "clear-transition"
      });
    }
    try {
      this.stdin.setRawMode?.(true);
    } catch (error) {
      return Promise.reject(error);
    }
    this.addExitListeners();
    const resumed = this.trackNativeTerminalTransition(this.nativeSession.resume(), () => {
      if (this._isDestroyed)
        return;
      if (this.pendingSplitFooterTransition)
        this.setPendingSplitFooterTransition(this.pendingSplitFooterTransition);
      this.finishResume();
    }).then(() => {
      if (!this._isDestroyed && (this.shouldSyncNativePaletteState() || this.listenerCount("palette" /* PALETTE */) > 0)) {
        this.clearPaletteCache();
        this.refreshPalette();
      }
    });
    resumed.catch(() => {});
    return resumed;
  }
  pauseStdinParsers(resuming) {
    for (const parser of [this.stdinParser, this.stdinShadow?.parser]) {
      if (parser instanceof NativeStdinParser)
        resuming ? parser.resume() : parser.suspend();
      else if (parser?.hasPendingPixelResolutionResponse())
        parser.pausePendingTimeout();
      else
        parser?.reset();
    }
  }
  finishResume() {
    let drained;
    while ((drained = this.stdin.read()) !== null)
      this.stdinListener(drained);
    this.updateStdinParserProtocolContext({
      privateCapabilityRepliesActive: false,
      explicitWidthCprActive: false,
      replySentinelActive: false
    }, true);
    this.pauseStdinParsers(true);
    this.stdin.on("data", this.stdinListener);
    this.stdin.resume();
    this.startTerminalKeepAlive();
    this._useMouse = this._suspendedMouseEnabled;
    if (this._screenMode === "split-footer" && this._splitHeight > 0) {
      this.syncSplitFooterState();
    }
    this.forceFullRepaintRequested = true;
    this.startKittyTransportPolling();
    this.nativeSession.startKittyFileProbe();
    this._controlState = this._previousControlState;
    for (const batch of this.replyBatches)
      this.armReplyBackstop(batch);
    this.syncReplyContext(false);
    if (this.pixelResolutionRequeryPending)
      this.queryPixelResolution();
    for (const parser of this.legacyStdinParsers())
      parser.resumePendingTimeout();
    this.applyPendingNativeResize();
    if (this._previousControlState === "auto_started" /* AUTO_STARTED */ || this._previousControlState === "explicit_started" /* EXPLICIT_STARTED */) {
      this.internalStart();
    } else {
      this.requestRender();
    }
  }
  stop() {
    this._controlState = "explicit_stopped" /* EXPLICIT_STOPPED */;
    this.ordinaryFrameWaitControlState = null;
    this.halt(true);
  }
  halt(stopSnapshots) {
    if (stopSnapshots && this._isRunning)
      this.stopMemorySnapshotTimer();
    this._isRunning = false;
    this.immediateRerenderRequested = false;
    this.cancelReadyFrame?.();
    this.cancelReadyFrame = null;
    this.clearFrameTimer();
    if (!this.rendering)
      this.resolveIdleIfNeeded();
  }
  destroy() {
    if (this._isDestroyed)
      return;
    this.lib.getYogaHost().assertMutable();
    this._isDestroyed = true;
    this._destroyPending = true;
    this._palettePublishGeneration++;
    this._cancelPaletteDetection?.(new Error("Cannot detect palette after renderer destruction"));
    const splitFlush = this.nativeSplitFlush;
    const terminalTransition = this.nativeTerminalTransition;
    queueMicrotask(async () => {
      try {
        if (splitFlush || this.externalOutputQueue.size > 0 || this.pendingNativeReplay) {
          this.nativeSession.armCloseTimeout();
          if (splitFlush)
            await splitFlush;
          else if (terminalTransition)
            await terminalTransition;
          if (this.externalOutputQueue.size > 0 || this.pendingNativeReplay)
            await this.flushNativeSplitOutput();
        }
        this.nativeSession.close();
      } catch (error) {
        this.externalOutputQueue.clear();
        this.nativeSession.dispose();
        console.error("Native split output cancelled during close:", error);
      }
    });
    this.finalizeDestroy();
  }
  cleanupBeforeDestroy() {
    if (this._destroyCleanupPrepared)
      return;
    this._destroyCleanupPrepared = true;
    if (this.kittyTransportTimer !== null) {
      this.clock.clearInterval(this.kittyTransportTimer);
      this.kittyTransportTimer = null;
      if (!this.nativeSession.disposed && !this.nativeSession.error)
        this.nativeSession.cancelKittyImageTransport(false);
    }
    this.pendingNativeResize = null;
    this.cancelReadyFrame?.();
    this.cancelReadyFrame = null;
    this.cancelFrameContinuation?.();
    this.animationRequest.clear();
    this.frameCallbacks = [];
    this.liveRequestCounter = 0;
    this.animationTickers.clear();
    this.scheduleAnimationTick();
    this.immediateRerenderRequested = false;
    if (this._usesProcessStdout) {
      this.removeCleanupListener(process, "SIGWINCH", this.sigwinchHandler);
    }
    this.removeCleanupListener(process, "uncaughtException", this.handleError);
    this.removeCleanupListener(process, "unhandledRejection", this.handleError);
    this.removeCleanupListener(process, "warning", this.warningHandler);
    this.removeExitListeners();
    if (this.resizeTimeoutId !== null) {
      this.clock.clearTimeout(this.resizeTimeoutId);
      this.resizeTimeoutId = null;
    }
    for (const batch of this.replyBatches) {
      if (batch.backstop !== null)
        this.clock.clearTimeout(batch.backstop);
    }
    this.replyBatches = [];
    this.clearSplitStartupCursorSeed();
    if (this.memorySnapshotTimer) {
      this.clock.clearInterval(this.memorySnapshotTimer);
      this.memorySnapshotTimer = null;
    }
    this.clearFrameTimer();
    this.themeModeState?.cancelRefresh();
    this._isRunning = false;
    this.waitingForPixelResolution = false;
    this.pixelResolutionRequeryPending = false;
    try {
      this.syncReplyContext(true);
    } catch (error) {
      this.handleStdinParserFailure(error);
    }
    this._useMouse = false;
    this.capturedRenderable = undefined;
    this.removeCleanupListener(this.stdin, "data", this.stdinListener);
    this.stopTerminalKeepAlive();
    try {
      this.stdin.pause();
    } catch (e) {
      console.error("Error pausing stdin during destroy:", e);
    }
    this.externalOutputMode = "passthrough";
  }
  finalizeDestroy() {
    if (this._destroyFinalized)
      return;
    if (this.root?._deferUntilCleanupComplete(() => this.finalizeDestroy())) {
      this.cleanupBeforeDestroy();
      return;
    }
    this._destroyFinalized = true;
    this._destroyPending = false;
    this.cleanupBeforeDestroy();
    if (this._paletteDetector) {
      this._paletteDetector.cleanup();
      this._paletteDetector = null;
    }
    this._paletteCache.clear();
    this._paletteDetectionPromise = null;
    this._paletteDetectionSize = 0;
    this._paletteDetectionGeneration = 0;
    this._nativePaletteSignature = null;
    this._emittedPaletteSignature = null;
    this._paletteEpoch = 0;
    this.resolveXtVersionWaiters();
    this.themeModeState?.dispose();
    for (const destroy of this.detachedSurfaces) {
      try {
        destroy();
      } catch (error) {
        console.error("Error destroying detached surface:", error);
      }
    }
    try {
      this.emit("destroy" /* DESTROY */);
    } catch (error) {
      console.error("Error in native scene destroy listener:", error);
    } finally {
      try {
        destroyTimelineEngine(this);
      } catch (error) {
        console.error("Error releasing timeline engine:", error);
      }
    }
    try {
      this.root?.destroyRecursively();
    } catch (e) {
      console.error("Error destroying root renderable:", e instanceof Error ? e.stack : String(e));
    }
    this.stdinParser?.destroy();
    this.stdinParser = null;
    this.stdinShadow?.parser.destroy();
    this.stdinShadow?.comparator.flush();
    this.stdinShadow = null;
    this.oscSubscribers.clear();
    try {
      this._console?.destroy();
    } catch (error) {
      console.error("Error destroying console:", error);
    }
    try {
      this.nativeScene.destroy();
    } catch (error) {
      console.error("Error destroying native scene:", error);
    }
    this._externalOutputMode = "passthrough";
    this.pendingExternalOutputMode = null;
    this.stdout.write = this.realStdoutWrite;
    const discardInput = this._terminalIsSetup && this._controlState !== "explicit_suspended" /* EXPLICIT_SUSPENDED */;
    if (discardInput) {
      const bufferedInput = this.stdin.readableLength;
      if (bufferedInput > 0)
        this.stdin.read(bufferedInput);
    }
    this.flushTerminalInputOnClose = discardInput && this.stdin === process.stdin;
    rendererTracker.renderers.delete(this);
    if (rendererTracker.renderers.size === 0) {
      destroyTreeSitterClient().catch((error) => {
        console.error("Failed to destroy tree-sitter client:", error);
      });
    }
    if (this._onDestroy) {
      try {
        this._onDestroy();
      } catch (e) {
        console.error("Error in onDestroy callback:", e instanceof Error ? e.stack : String(e));
      }
    }
    this.nativeDestroyWait?.resolve();
    this.resolveIdleIfNeeded();
  }
  leaveRawMode() {
    try {
      this.stdin.setRawMode?.(false);
    } catch (e) {
      console.error("Error disabling raw mode:", e);
    }
  }
  releaseStreamLease() {
    if (!this._streamLeaseAcquired)
      return;
    if (rendererTracker.streamOwners.get(this.stdin) === this)
      rendererTracker.streamOwners.delete(this.stdin);
    if (rendererTracker.streamOwners.get(this.stdout) === this)
      rendererTracker.streamOwners.delete(this.stdout);
    this._streamLeaseAcquired = false;
  }
  startRenderLoop() {
    if (!this._isRunning)
      return;
    this.lastTime = this.normalizeClockTime(this.clock.now(), 0);
    this.frameCount = 0;
    this.lastFpsTime = this.lastTime;
    this.currentFps = 0;
    this.renderStats.fps = 0;
    if (this.outputIdleRenderScheduled)
      return;
    this.queueFrame();
  }
  async loop(waitForActive = false) {
    if (this.rendering) {
      if (!waitForActive)
        return;
      this.renderingCompletion ??= Promise.withResolvers();
      return this.renderingCompletion.promise;
    }
    if (this._isDestroyed)
      return;
    this.cancelReadyFrame?.();
    this.cancelReadyFrame = null;
    this.clearFrameTimer();
    this.rendering = true;
    this.ordinaryFrameWaitControlState = this._controlState;
    let renderFailed = false;
    try {
      if (!this.canRender)
        return;
      if (this.nativeTerminalTransition && !await this.waitForTerminalTransition())
        return;
      if (!this.canRender || this.currentControlState === "explicit_suspended" /* EXPLICIT_SUSPENDED */ || this.isSplitCursorSeedFrameBlocked())
        return;
      this._frameId++;
      const now = this.normalizeClockTime(this.clock.now(), this.lastTime);
      const elapsed = this.getElapsedMs(now, this.lastTime);
      const deltaTime = elapsed;
      this.lastTime = now;
      this.renderStats.frameCount++;
      const overallStart = performance.now();
      const requestedBeforeTicks = this.immediateRerenderRequested;
      this.runAnimationTicks(now);
      this.immediateRerenderRequested = requestedBeforeTicks;
      const animationFrameEnd = CliRenderer.animationFrameId;
      const animationRequestStart = performance.now();
      for (const [id, callback] of this.animationRequest) {
        if (id >= animationFrameEnd)
          break;
        if (!this.canRender || this.currentControlState === "explicit_suspended" /* EXPLICIT_SUSPENDED */)
          break;
        this.animationRequest.delete(id);
        try {
          callback(deltaTime);
        } finally {
          this.dropLive();
        }
        await this.yieldFrame();
      }
      const animationRequestEnd = performance.now();
      const animationRequestTime = animationRequestEnd - animationRequestStart;
      const start = performance.now();
      const frameCallbacks = this.frameCallbacks;
      const callbackCount = frameCallbacks.length;
      for (let index = 0;index < callbackCount; index++) {
        if (!this.canRender || this.currentControlState === "explicit_suspended" /* EXPLICIT_SUSPENDED */)
          break;
        const frameCallback = frameCallbacks[index];
        if (this.frameCallbacks !== frameCallbacks && !this.frameCallbacks.includes(frameCallback))
          continue;
        try {
          await frameCallback(deltaTime);
        } catch (error) {
          console.error("Error in frame callback:", error);
        }
        await this.yieldFrame();
      }
      const end = performance.now();
      this.renderStats.frameCallbackTime = end - start;
      if (this.nativeTerminalTransition && !await this.waitForTerminalTransition())
        return;
      if (!this.canRender || this.currentControlState === "explicit_suspended" /* EXPLICIT_SUSPENDED */)
        return;
      const sceneStart = performance.now();
      const requestedBeforeScene = this.immediateRerenderRequested;
      try {
        this.nativeScene.paint(deltaTime, () => ({
          background: this.backgroundColor,
          useMouse: this._useMouse,
          excludedHitNum: this.capturedRenderable?.num ?? 0
        }));
      } catch (error) {
        this.immediateRerenderRequested = requestedBeforeScene;
        throw error;
      } finally {
        this._lastSceneTimeMs = performance.now() - sceneStart;
      }
      if (this._isDestroyed || this.currentControlState === "explicit_suspended" /* EXPLICIT_SUSPENDED */ || !this.nativeScene.frame)
        return;
      for (const postProcessFn of this.postProcessFns) {
        if (!this.canRender)
          break;
        this.nextRenderBuffer._withNativePaint(() => postProcessFn(this.nextRenderBuffer, deltaTime));
      }
      if (this.canRender)
        this._console.renderToBuffer(this.nextRenderBuffer);
      if (this.canRender && !this.nativeSplitFlush) {
        const nativeStatus = await this.presentNativeScene();
        if (!this.canRender || this.currentControlState === "explicit_suspended" /* EXPLICIT_SUSPENDED */)
          return;
        if (nativeStatus === "rendered")
          this.frameCount++;
        if (this.getElapsedMs(now, this.lastFpsTime) >= 1000) {
          this.currentFps = this.frameCount;
          this.frameCount = 0;
          this.lastFpsTime = now;
        }
        this.renderStats.fps = this.currentFps;
        if (nativeStatus === "rendered") {
          if (this._useMouse) {
            this.recheckHoverState();
          }
          if (!this.canRender)
            return;
          const overallFrameTime = performance.now() - overallStart;
          this.lib.sessionUpdateStats(this.nativeSession.context, this.nativeSession.session, overallFrameTime, this.renderStats.fps, this.renderStats.frameCallbackTime);
          if (this.listenerCount("frame" /* FRAME */) > 0) {
            this.emit("frame" /* FRAME */, {
              frameId: this.frameId
            });
          }
          if (!this.canRender)
            return;
          if (this.gatherStats) {
            this.collectStatSample(overallFrameTime);
          }
          if (this._isRunning || this.immediateRerenderRequested) {
            const immediate = this.immediateRerenderRequested;
            const targetFrameTime = immediate ? this.minTargetFrameTime : this.targetFrameTime;
            const remaining = targetFrameTime - this.getElapsedMs(this.normalizeClockTime(this.clock.now(), now), now);
            this.immediateRerenderRequested = false;
            if (immediate && remaining <= 0) {
              this.queueFrame();
            } else {
              this.scheduleFrame(Math.max(1, remaining));
            }
          } else {
            this.clearFrameTimer();
          }
        } else {
          this.immediateRerenderRequested = false;
          this.clearFrameTimer();
        }
      }
    } catch (error) {
      renderFailed = true;
      if (this.canRender) {
        const renderError = error instanceof Error ? error : new Error(String(error));
        const event = { error: renderError, renderable: this.root.takeCurrentRenderable() };
        const handled = this.emit("render:error" /* RENDER_ERROR */, event);
        if (!handled)
          this.handleError(renderError);
      }
    } finally {
      const completion2 = this.renderingCompletion;
      this.renderingCompletion = null;
      try {
        this.nativeScene.cancelFrame();
        this.rendering = false;
        this.logNativeDiagnostics();
        if (!this.canRender && !this._isDestroyed)
          this.destroy();
        if (this._destroyPending) {
          this.finalizeDestroy();
        }
        if (renderFailed && (this._isRunning || this.immediateRerenderRequested) && !this._isDestroyed) {
          this.immediateRerenderRequested = false;
          this.scheduleRenderTimer();
        }
        this.applyPendingNativeModeReported();
        this.applyPendingNativeResize();
        this.resolveIdleIfNeeded();
      } finally {
        completion2?.resolve();
      }
    }
  }
  logNativeDiagnostics() {
    if (!this.canRender)
      return;
    try {
      this.lib.logContextDiagnostics(this.nativeSession.context, 1 /* Warn */);
    } catch (error) {
      if (!(error instanceof NativeError) || error.status !== -6 /* ContextBusy */) {
        this.handleError(error);
      }
    }
  }
  async waitForTerminalTransition() {
    while (this.nativeTerminalTransition) {
      try {
        await this.nativeTerminalTransition;
      } catch {
        return false;
      }
    }
    return true;
  }
  intermediateRender() {
    this.immediateRerenderRequested = true;
    this.ordinaryFrameWaitControlState = this._controlState;
    this.loop();
  }
  async presentNativeScene() {
    if (this.isSplitCursorSeedFrameBlocked())
      return "blocked";
    const commits = this._splitHeight > 0 && this._externalOutputMode === "capture-stdout" ? this.pendingNativeReplay?.remaining === 0 ? [] : this.externalOutputQueue.batch(Math.min(this.maxSplitCommitsPerFrame, this.pendingNativeReplay?.remaining ?? Infinity)) : null;
    const split = commits === null ? null : this.nativeScene.commitSplit(commits.map((commit) => ({ ...commit, snapshot: commit.nativeSnapshot })), this.getSplitPinnedRenderOffset(), this.forceFullRepaintRequested);
    const status = split?.status ?? this.nativeScene.commit(this.forceFullRepaintRequested);
    if (commits && (status === 1 /* Pending */ || status === 0 /* Presented */)) {
      this.nativeSplitAcceptedCount = commits.length;
    }
    switch (status) {
      case 1 /* Pending */:
        await this.nativeSession.whenPresented();
        break;
      case 0 /* Presented */:
        break;
      case 2 /* Skipped */:
        this.ordinaryFrameWaitingForOutput = true;
        this.scheduleRenderAfterOutputIdle();
        return "retryable-skip";
      case 3 /* Failed */:
        console.error("[CliRenderer] Native frame render failed; waiting for the next render request to force repaint");
        return "failed";
      default:
        throw new Error("Unknown native scene presentation status");
    }
    if (this._isDestroyed || this.nativeSplitFlush)
      return "rendered";
    if (split && commits) {
      this.completeNativeSplitCommits(commits);
      if (this.externalOutputQueue.size > 0)
        this.requestRender();
      else
        this.applyPendingExternalOutputModeIfReady();
    }
    this.forceFullRepaintRequested = false;
    return "rendered";
  }
  completeNativeSplitCommits(commits) {
    if (!this._isDestroyed) {
      this.syncSplitScrollback();
      for (const commit of commits)
        this.recordSplitCommit(commit);
    }
    this.externalOutputQueue.drop(commits.length);
    if (this.pendingNativeReplay)
      this.pendingNativeReplay.remaining -= commits.length;
    this.nativeSplitAcceptedCount = 0;
    this.pendingSplitFooterTransition = null;
  }
  async flushNativeSplitOutput(remaining = this.externalOutputQueue.size) {
    const driver = this.nativeSession;
    await driver.whenPresented();
    this.nativeScene.cancelFrame();
    if (this.nativeSplitAcceptedCount > 0) {
      remaining -= this.nativeSplitAcceptedCount;
      this.completeNativeSplitCommits(this.externalOutputQueue.peek(this.nativeSplitAcceptedCount));
    }
    while (remaining > 0 || this.pendingNativeReplay?.remaining === 0) {
      if (this.pendingNativeReplay?.remaining === 0) {
        try {
          this.applySplitFooterReplayReset(this.pendingNativeReplay.options);
        } catch (error) {
          if (!(error instanceof NativeError) || error.status !== -11 /* OutputBackpressure */)
            throw error;
          await driver.idle();
          continue;
        }
      }
      if (remaining === 0)
        break;
      const commits = this.externalOutputQueue.batch(Math.min(remaining, this.maxSplitCommitsPerFrame, this.pendingNativeReplay?.remaining ?? Infinity));
      if (this.lib.sessionGetRendererState(driver.context, driver.session).framePending) {
        throw new Error("Native split output flush requires no pending frame presentation");
      }
      const result = driver.renderSplit(null, commits.map((commit) => ({ ...commit, snapshot: commit.nativeSnapshot })), this.getSplitPinnedRenderOffset(), false);
      if (result.status === 3 /* Failed */)
        throw new Error("Native split output frame failed");
      if (result.status === 2 /* Skipped */) {
        await driver.idle();
        continue;
      }
      await driver.whenPresented();
      remaining -= commits.length;
      this.completeNativeSplitCommits(commits);
    }
    if (!this._isDestroyed)
      this.applyPendingExternalOutputModeIfReady();
  }
  collectStatSample(frameTime) {
    this.frameTimes.push(frameTime);
    if (this.frameTimes.length > this.maxStatSamples) {
      this.frameTimes.shift();
    }
  }
  getNativeStats() {
    return this.lib.sceneGetStats(this.nativeSession.context, this.nativeSession.session);
  }
  getStats() {
    const nativeStats = this.getNativeStats();
    const frameTimes = [...this.frameTimes];
    const sum = frameTimes.reduce((acc, time) => acc + time, 0);
    const avg = frameTimes.length ? sum / frameTimes.length : 0;
    const min = frameTimes.length ? Math.min(...frameTimes) : 0;
    const max = frameTimes.length ? Math.max(...frameTimes) : 0;
    return {
      ...nativeStats,
      fps: this.renderStats.fps,
      frameCount: this.renderStats.frameCount,
      frameTimes,
      averageFrameTime: avg,
      minFrameTime: min,
      maxFrameTime: max,
      frameCallbackTime: this.renderStats.frameCallbackTime
    };
  }
  resetStats() {
    this.frameTimes = [];
    this.renderStats.frameCount = 0;
  }
  setGatherStats(enabled) {
    this.gatherStats = enabled;
    if (!enabled) {
      this.frameTimes = [];
    }
  }
  getSelection() {
    return this.currentSelection;
  }
  get hasSelection() {
    return !!this.currentSelection;
  }
  getSelectionContainer() {
    return this.selectionContainers.length > 0 ? this.selectionContainers[this.selectionContainers.length - 1] : null;
  }
  clearSelection() {
    this.clearSelectionState();
    this.lastClick = null;
  }
  clearSelectionState() {
    if (this.currentSelection) {
      for (const renderable of this.currentSelection.touchedRenderables) {
        if (renderable.selectable && !renderable.isDestroyed) {
          renderable.onSelectionChanged(null);
        }
      }
      this.currentSelection = null;
    }
    this.selectionContainers = [];
  }
  startSelection(renderable, x, y, behavior = "cell") {
    if (!renderable.selectable)
      return;
    this.clearSelectionState();
    this.selectionContainers.push(renderable.parent || this.root);
    this.currentSelection = new Selection(renderable, { x, y }, { x, y }, behavior);
    this.currentSelection.isStart = true;
    this.notifySelectablesOfSelectionChange();
  }
  nextClickBehavior(renderable, x, y) {
    const now = this.clock.now();
    const last = this.lastClick;
    const continued = last !== null && renderable.num === last.renderableId && now - last.time <= CLICK_REPEAT_INTERVAL_MS && Math.max(Math.abs(x - last.x), Math.abs(y - last.y)) <= 1;
    const count = continued ? Math.min(last.count + 1, 3) : 1;
    this.lastClick = { count, time: now, x, y, renderableId: renderable.num };
    return count === 1 ? "cell" : count === 2 ? "word" : "line";
  }
  updateSelection(currentRenderable, x, y, options) {
    if (this.currentSelection) {
      this.currentSelection.isStart = false;
      this.currentSelection.focus = { x, y };
      if (options?.finishDragging) {
        this.currentSelection.isDragging = false;
      }
      if (this.selectionContainers.length > 0) {
        const currentContainer = this.selectionContainers[this.selectionContainers.length - 1];
        if (!currentRenderable || !this.isWithinContainer(currentRenderable, currentContainer)) {
          const parentContainer = currentContainer.parent || this.root;
          this.selectionContainers.push(parentContainer);
        } else if (currentRenderable && this.selectionContainers.length > 1) {
          let containerIndex = this.selectionContainers.indexOf(currentRenderable);
          if (containerIndex === -1) {
            const immediateParent = currentRenderable.parent || this.root;
            containerIndex = this.selectionContainers.indexOf(immediateParent);
          }
          if (containerIndex !== -1 && containerIndex < this.selectionContainers.length - 1) {
            this.selectionContainers = this.selectionContainers.slice(0, containerIndex + 1);
          }
        }
      }
      this.notifySelectablesOfSelectionChange();
    }
  }
  requestSelectionUpdate() {
    if (this.currentSelection?.isDragging) {
      const pointer = this._latestPointer;
      const maybeRenderableId = this.hitTest(pointer.x, pointer.y);
      const maybeRenderable = Renderable.renderablesByNumber.get(maybeRenderableId);
      this.updateSelection(maybeRenderable, pointer.x, pointer.y);
    }
  }
  isWithinContainer(renderable, container) {
    let current = renderable;
    while (current) {
      if (current === container)
        return true;
      current = current.parent;
    }
    return false;
  }
  finishSelection() {
    if (this.currentSelection) {
      this.currentSelection.isDragging = false;
      this.emit("selection" /* SELECTION */, this.currentSelection);
      this.notifySelectablesOfSelectionChange();
    }
  }
  notifySelectablesOfSelectionChange() {
    const selectedRenderables = [];
    const touchedRenderables = [];
    const currentContainer = this.selectionContainers.length > 0 ? this.selectionContainers[this.selectionContainers.length - 1] : this.root;
    if (this.currentSelection) {
      this.walkSelectableRenderables(currentContainer, this.currentSelection.bounds, selectedRenderables, touchedRenderables);
      for (const renderable of this.currentSelection.touchedRenderables) {
        if (!touchedRenderables.includes(renderable) && !renderable.isDestroyed) {
          renderable.onSelectionChanged(null);
        }
      }
      this.currentSelection.updateSelectedRenderables(selectedRenderables);
      this.currentSelection.updateTouchedRenderables(touchedRenderables);
    }
  }
  walkSelectableRenderables(container, selectionBounds, selectedRenderables, touchedRenderables) {
    const children = getObjectsInViewport(selectionBounds, container.getChildrenSortedByPrimaryAxis(), container.primaryAxis, 0, 0);
    for (const child of children) {
      if (child.selectable) {
        const hasSelection = child.onSelectionChanged(this.currentSelection);
        if (hasSelection) {
          selectedRenderables.push(child);
        }
        touchedRenderables.push(child);
      }
      if (child.getChildrenCount() > 0) {
        this.walkSelectableRenderables(child, selectionBounds, selectedRenderables, touchedRenderables);
      }
    }
  }
  get paletteDetectionStatus() {
    if (this._paletteDetectionPromise)
      return "detecting";
    if (this._paletteCache.size > 0)
      return "cached";
    return "idle";
  }
  getCachedPaletteBySize(size) {
    const exactMatch = this._paletteCache.get(size);
    if (exactMatch) {
      return exactMatch;
    }
    const largerSize = [...this._paletteCache.keys()].sort((a, b) => a - b).find((candidate) => candidate >= size);
    if (largerSize === undefined) {
      return null;
    }
    const source = this._paletteCache.get(largerSize);
    if (!source) {
      return null;
    }
    const projected = {
      ...source,
      palette: source.palette.slice(0, size)
    };
    this._paletteCache.set(size, projected);
    return projected;
  }
  ensurePaletteDetector() {
    if (!this._paletteDetector) {
      const isTmux = Boolean(this.capabilities?.multiplexer === "tmux" || this.capabilities?.terminal?.name?.toLowerCase()?.includes("tmux"));
      const isLegacyTmux = this.capabilities?.terminal?.name?.toLowerCase()?.includes("tmux") && this.capabilities?.terminal?.version?.localeCompare("3.6") < 0;
      const detector = createTerminalPalette({
        stdin: this.stdin,
        stdout: this.stdout,
        writeFn: (data) => {
          if (this._isDestroyed || this._paletteDetector !== detector) {
            throw new Error("Palette detection was cancelled");
          }
          this.nativeSession.control({ kind: "palette-query", bytes: Buffer.from(data) });
          return true;
        },
        isLegacyTmux,
        isTmux,
        oscSource: {
          subscribeOsc: this.subscribeOsc.bind(this)
        },
        clock: this.clock
      });
      this._paletteDetector = detector;
    }
    return this._paletteDetector;
  }
  syncNativePaletteState(colors) {
    const signature = buildTerminalPaletteSignature(colors);
    const epoch = this._nativePaletteSignature !== signature ? this._paletteEpoch + 1 >>> 0 : this._paletteEpoch;
    const normalized = normalizeTerminalPalette(colors);
    this.lib.sessionSetPaletteState(this.nativeSession.context, this.nativeSession.session, normalized.palette, normalized.defaultForeground, normalized.defaultBackground, epoch);
    this._nativePaletteSignature = signature;
    this._paletteEpoch = epoch;
  }
  emitPaletteChange(colors) {
    if (this.listenerCount("palette" /* PALETTE */) === 0)
      return;
    const signature = buildTerminalPaletteSignature(colors);
    if (this._emittedPaletteSignature === signature)
      return;
    this._emittedPaletteSignature = signature;
    this.emit("palette" /* PALETTE */, colors);
  }
  resolveXtVersionWaiters() {
    if (this.xtVersionWaiters.size === 0)
      return;
    const resolvers = [...this.xtVersionWaiters];
    this.xtVersionWaiters.clear();
    for (const resolve of resolvers) {
      resolve();
    }
  }
  waitForXtVersion() {
    if (!this.startupRepliesPending || this._capabilities?.terminal?.from_xtversion) {
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      this.xtVersionWaiters.add(resolve);
    });
  }
  shouldSyncNativePaletteState() {
    return Boolean(this._terminalIsSetup && !this._isDestroyed && this._capabilities?.ansi256 && !this._capabilities?.rgb);
  }
  refreshPalette() {
    const publishGeneration = this._palettePublishGeneration;
    this.getPalette({ size: NATIVE_PALETTE_QUERY_SIZE }).then(() => {
      if (this._isDestroyed)
        return;
      if (this._palettePublishGeneration === publishGeneration)
        this.requestRender();
    }).catch(() => {});
  }
  clearPaletteCache() {
    this._palettePublishGeneration++;
    this._paletteCache.clear();
  }
  async getPalette(options) {
    if (this._controlState === "explicit_suspended" /* EXPLICIT_SUSPENDED */) {
      throw new Error("Cannot detect palette while renderer is suspended");
    }
    if (this._isDestroyed || !this._terminalIsSetup || this.nativeTerminalTransition) {
      throw new Error("Native palette detection requires an active terminal");
    }
    const requestedSize = options?.size ?? 16;
    const detectionTimeout = options?.timeout;
    if (!Number.isInteger(requestedSize) || requestedSize < 1 || requestedSize > 256) {
      throw new RangeError("Native palette size must be an integer from 1 to 256");
    }
    const requestedGeneration = this._palettePublishGeneration;
    const cachedPalette = this.getCachedPaletteBySize(requestedSize);
    if (cachedPalette) {
      return cachedPalette;
    }
    const terminal = this._capabilities?.terminal;
    const hasTmuxVersion = terminal?.name?.toLowerCase() === "tmux" && Boolean(terminal.version);
    if (this._capabilities?.multiplexer === "tmux" && !hasTmuxVersion) {
      await this.waitForXtVersion();
      if (this._isDestroyed || !this._terminalIsSetup || this.nativeTerminalTransition || this.currentControlState === "explicit_suspended" /* EXPLICIT_SUSPENDED */) {
        throw new Error("Palette detection was cancelled");
      }
      const afterCapabilityWait = this.getCachedPaletteBySize(requestedSize);
      if (afterCapabilityWait) {
        return afterCapabilityWait;
      }
    }
    while (this._paletteDetectionPromise) {
      if (this._paletteDetectionSize >= requestedSize && this._paletteDetectionGeneration === this._palettePublishGeneration) {
        return this._paletteDetectionPromise.then((palette) => {
          const cached = this.getCachedPaletteBySize(requestedSize);
          if (cached) {
            return cached;
          }
          const projected = {
            ...palette,
            palette: palette.palette.slice(0, requestedSize)
          };
          if (!this._isDestroyed && requestedGeneration === this._palettePublishGeneration) {
            this._paletteCache.set(requestedSize, projected);
          }
          return projected;
        });
      }
      await this._paletteDetectionPromise;
      if (this._isDestroyed || !this._terminalIsSetup || this.nativeTerminalTransition || this.currentControlState === "explicit_suspended" /* EXPLICIT_SUSPENDED */) {
        throw new Error("Palette detection was cancelled");
      }
      const afterWait = this.getCachedPaletteBySize(requestedSize);
      if (afterWait) {
        return afterWait;
      }
    }
    const detector = this.ensurePaletteDetector();
    const publishGeneration = this._palettePublishGeneration;
    this._paletteDetectionSize = requestedSize;
    this._paletteDetectionGeneration = publishGeneration;
    let cancel = null;
    const cancelled = new Promise((_resolve, reject) => {
      cancel = (reason) => {
        detector.cleanup();
        if (this._paletteDetector === detector)
          this._paletteDetector = null;
        reject(reason);
      };
    });
    this._cancelPaletteDetection = cancel;
    const detection = detector.detect({ ...options, timeout: detectionTimeout });
    detection.catch(() => detector.cleanup());
    const completion2 = Promise.race([detection, cancelled]).then((result) => {
      detector.cleanup();
      if (this._paletteDetector === detector)
        this._paletteDetector = null;
      if (this._paletteDetectionPromise === pending) {
        this._paletteDetectionPromise = null;
        this._paletteDetectionSize = 0;
        this._paletteDetectionGeneration = 0;
      }
      const publish = !this._isDestroyed && this._palettePublishGeneration === publishGeneration;
      if (publish && this.shouldSyncNativePaletteState() && result.palette.length >= NATIVE_PALETTE_QUERY_SIZE) {
        this.syncNativePaletteState(result);
      }
      if (publish)
        this._paletteCache.set(result.palette.length, result);
      if (publish) {
        this.emitPaletteChange(result);
        if (this.shouldSyncNativePaletteState() && !this._paletteCache.has(NATIVE_PALETTE_QUERY_SIZE)) {
          this.refreshPalette();
        }
      }
      return result;
    }).catch((error) => {
      if (this._paletteDetectionPromise === pending) {
        this._paletteDetectionPromise = null;
        this._paletteDetectionSize = 0;
        this._paletteDetectionGeneration = 0;
      }
      detector.cleanup();
      if (this._paletteDetector === detector)
        this._paletteDetector = null;
      throw error;
    });
    const pending = completion2.finally(() => {
      if (this._cancelPaletteDetection === cancel)
        this._cancelPaletteDetection = null;
    });
    this._paletteDetectionPromise = pending;
    const detected = await this._paletteDetectionPromise;
    const finalPalette = this.getCachedPaletteBySize(requestedSize) ?? detected;
    return finalPalette;
  }
}

export { TextBuffer, TextBufferView, EditBuffer, measureEditText, EditorView, Timeline, engine, getTimelineEngine, createTimeline, ANSI, BoxRenderable, wheelDirection, scrollOnce, TextBufferRenderable, CodeRenderable, ImageLoadError, ImageError, imageInfo, NativeImage, NativeImagePool, resolveImageRenderProtocol, ImageRenderable, isTextNodeRenderable, TextNodeRenderable, RootTextNodeRenderable, TextRenderable, NativeSession, defaultKeyAliases, mergeKeyAliases, mergeKeyBindings, getKeyBindingAction, buildKeyBindingsMap, capture, ConsolePosition, TerminalConsole, EditBufferRenderableEvents, isEditBufferRenderable, EditBufferRenderable, buildKittyKeyboardFlags, MouseEvent, MouseButton, createCliRenderer, CliRenderEvents, RendererControlState, CliRenderer };

//# debugId=F7293CF74199477664756E2164756E21
//# sourceMappingURL=chunk-bun-j1msfd64.js.map
