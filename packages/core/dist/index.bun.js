// @bun
import {
  nativeConstants,
  toArrayBuffer,
  envRegistry2,
  registerEnvVar2,
  clearEnvCache2,
  generateEnvMarkdown2,
  generateEnvColored2,
  env2,
  resolveBundledFilePath2,
  TextAttributes2,
  ATTRIBUTE_BASE_BITS2,
  ATTRIBUTE_BASE_MASK2,
  getBaseAttributes2,
  DebugOverlayCorner2,
  TargetChannel2,
  DEFAULT_FOREGROUND_RGB2,
  DEFAULT_BACKGROUND_RGB2,
  normalizeIndexedColorIndex2,
  ansi256IndexToRgb2,
  RGBA2,
  normalizeColorValue2,
  hexToRgb2,
  rgbToHex2,
  hsvToRgb2,
  parseColor2,
  createTextAttributes2,
  attributesWithLink2,
  getLinkId2,
  visualizeRenderableTree2,
  isStyledText2,
  StyledText2,
  stringToStyledText2,
  black2,
  red2,
  green2,
  yellow2,
  blue2,
  magenta2,
  cyan2,
  white2,
  brightBlack2,
  brightRed2,
  brightGreen2,
  brightYellow2,
  brightBlue2,
  brightMagenta2,
  brightCyan2,
  brightWhite2,
  bgBlack2,
  bgRed2,
  bgGreen2,
  bgYellow2,
  bgBlue2,
  bgMagenta2,
  bgCyan2,
  bgWhite2,
  bold2,
  italic2,
  underline2,
  strikethrough2,
  dim2,
  reverse2,
  blink2,
  fg2,
  bg2,
  link2,
  t2,
  SpanInfoStruct,
  NativeAudioStreamFormat2,
  NativeAudioStreamState2,
  NativeAudioStreamStateNames,
  NativeAudioStreamCloseReason2,
  NativeAudioStreamState3,
  NativeAudioStreamCloseReason3,
  NativeAudioStreamFormat3,
  MAX_LINK_URL_BYTES2,
  NativeTextViewCommand2,
  NativeEditCommand2,
  NativeEditPositionQuery2,
  NativeEditorStyleMask2,
  NativeEditHighlightOperation2,
  NativeEditorCommand2,
  NativeEditorSelectionOperation2,
  NativeEditorPositionQuery2,
  NativeEditEvent2,
  NATIVE_EDGE_NONE2,
  NativeBorder2,
  NativeSceneHook2,
  NativeSceneFrame2,
  NativeScenePaintPhase2,
  NATIVE_BUFFER_TEXT_BYTES_MAX2,
  NativeSessionState2,
  NativeSessionRenderStatus2,
  NATIVE_SESSION_CONTROL_PACKET_BYTES2,
  NativeSessionTerminalPhase2,
  NativeSessionPumpStatus2,
  NativeStatus2,
  NativeError2,
  NativeClipboardOperationStatus2,
  NativeClipboardStartStatus2,
  NativeClipboardCancelStatus2,
  NativeClipboardCopyStatus2,
  NativeClipboardDestroyStatus2,
  NativeClipboardShutdownStatus2,
  LogLevel2,
  FFIRenderLib2,
  setRenderLibPath2,
  resolveRenderLib2,
  Gutter2,
  MeasureMode2,
  exports_yoga
} from "./chunk-bun-3tbfth66.js";
import {
  isValidBorderStyle2,
  parseBorderStyle2,
  BorderChars2,
  getBorderFromSides2,
  getBorderSides2,
  borderCharsToArray2,
  BorderCharArrays2,
  KeyEvent2,
  PasteEvent2,
  KeyHandler2,
  InternalKeyHandler2,
  fonts2,
  measureText2,
  getCharacterPositions2,
  coordinateToCharacterIndex2,
  renderFontToFrameBuffer2,
  hastToStyledText2,
  SystemClock2,
  terminalNamedSingleStrokeKeys2,
  parseKeypress2,
  LinearScrollAccel2,
  MacOSScrollAccel2,
  parseAlign2,
  parseAlignItems2,
  parseBoxSizing2,
  parseDimension2,
  parseDirection2,
  parseDisplay2,
  parseEdge2,
  parseFlexDirection2,
  parseGutter2,
  parseJustify2,
  parseLayoutMode2,
  parseLogLevel2,
  parseMeasureMode2,
  parseOverflow2,
  parsePositionType2,
  parseUnit2,
  parseWrap2,
  Selection2,
  convertGlobalToLocalSelection2,
  ASCIIFontSelectionHelper2,
  treeSitterToTextChunks2,
  treeSitterToStyledText2,
  addDefaultParsers2,
  TreeSitterClient2,
  DataPathsManager2,
  getDataPaths2,
  extensionToFiletype2,
  basenameToFiletype2,
  extToFiletype2,
  pathToFiletype2,
  infoStringToFiletype2,
  getTreeSitterClient2,
  destroyTreeSitterClient2,
  ExtmarksController2,
  createExtmarksController2,
  TerminalPalette2,
  createTerminalPalette2,
  normalizeTerminalPalette2,
  buildTerminalPaletteSignature2,
  decodePasteBytes2,
  stripAnsiSequences2,
  createHostClipboard2,
  createClipboard2,
  ClipboardTarget2,
  createRendererClipboardAdapter2,
  detectLinks2,
  acquireSessionBufferLease2,
  ResourceContext2,
  OptimizedBuffer2,
  LayoutEvents2,
  RenderableEvents2,
  isRenderable2,
  BaseRenderable2,
  Renderable2,
  RootRenderable2,
  TextBuffer2,
  TextBufferView2,
  EditBuffer2,
  measureEditText2,
  EditorView2,
  Timeline2,
  engine2,
  getTimelineEngine2,
  createTimeline2,
  BoxRenderable2,
  TextBufferRenderable2,
  SliderRenderable2,
  ScrollBarRenderable2,
  ArrowRenderable2,
  scrollUnitSize2,
  ScrollBoxWrapper2,
  ScrollBoxViewport2,
  ScrollBoxContent2,
  ScrollBoxBar2,
  ScrollBoxRenderable2,
  CodeRenderable2,
  ImageLoadError2,
  ImageError2,
  imageInfo2,
  NativeImage2,
  NativeImagePool2,
  resolveImageRenderProtocol2,
  checkCrop2,
  sameCrop2,
  ImageRenderable2,
  isTextNodeRenderable2,
  TextNodeRenderable2,
  RootTextNodeRenderable2,
  TextRenderable2,
  NativeSession2,
  defaultKeyAliases,
  mergeKeyAliases,
  mergeKeyBindings,
  getKeyBindingAction,
  buildKeyBindingsMap,
  capture2,
  ConsolePosition2,
  TerminalConsole2,
  EditBufferRenderableEvents2,
  isEditBufferRenderable2,
  EditBufferRenderable2,
  buildKittyKeyboardFlags2,
  MouseEvent2,
  MouseButton2,
  createCliRenderer2,
  CliRenderEvents2,
  RendererControlState2,
  CliRenderer2
} from "./chunk-bun-rcry6xvz.js";
// src/syntax-style.ts
var attributeNames = ["bold", "italic", "underline", "dim", "strikethrough"];
function cloneStyle(style) {
  return {
    ...style,
    fg: style.fg ? RGBA2.clone(style.fg) : undefined,
    bg: style.bg ? RGBA2.clone(style.bg) : undefined
  };
}
function convertThemeToStyles(theme) {
  const flatStyles = {};
  for (const tokenStyle of theme) {
    const { foreground, background } = tokenStyle.style;
    const styleDefinition = {};
    if (foreground)
      styleDefinition.fg = parseColor2(foreground);
    if (background)
      styleDefinition.bg = parseColor2(background);
    for (const name of attributeNames) {
      if (tokenStyle.style[name] !== undefined)
        styleDefinition[name] = tokenStyle.style[name];
    }
    for (const scope of tokenStyle.scope) {
      flatStyles[scope] = cloneStyle(styleDefinition);
    }
  }
  return flatStyles;
}

class SyntaxStyle {
  lib;
  native;
  _destroyed = false;
  nameCache = new Map;
  styleDefs = new Map;
  mergedCache = new Map;
  constructor(lib, handle, source) {
    const owner = source?.resourceContext;
    if (!owner)
      throw new Error("SyntaxStyle requires an explicit resource owner");
    owner.assertAlive();
    if (owner.renderLib !== lib || !handle || typeof handle !== "object" || handle.context !== owner.context) {
      throw new Error("SyntaxStyle Context owner mismatch");
    }
    this.lib = lib;
    this.native = { owner, handle };
  }
  static create(source) {
    const owner = source?.resourceContext;
    if (!owner)
      throw new Error("SyntaxStyle requires an explicit resource owner: pass renderer.nativeScene, or a ResourceContext when there is no renderer");
    owner.assertAlive();
    const lib = owner.renderLib;
    const handle = lib.createContextSyntaxStyle(owner.context);
    try {
      return new SyntaxStyle(lib, handle, owner);
    } catch (error) {
      lib.destroyContextSyntaxStyle(owner.context, handle);
      throw error;
    }
  }
  static fromTheme(theme, owner) {
    return SyntaxStyle.fromStyles(convertThemeToStyles(theme), owner);
  }
  static fromStyles(styles, owner) {
    const style = SyntaxStyle.create(owner);
    try {
      for (const [name, styleDef] of styles instanceof Map ? styles : Object.entries(styles)) {
        style.registerStyle(name, styleDef);
      }
      return style;
    } catch (error) {
      style.destroy();
      throw error;
    }
  }
  guard() {
    if (this._destroyed)
      throw new Error("NativeSyntaxStyle is destroyed");
    this.native.owner.assertAlive();
  }
  _ownedBy(scene) {
    return this.native.owner === scene.resourceContext;
  }
  _getSceneHandle(scene) {
    this.guard();
    if (this.native.owner !== scene.resourceContext)
      throw new Error("SyntaxStyle owner mismatch: bind definitions in the destination Context");
    return this.native.handle;
  }
  registerStyle(name, style) {
    this.guard();
    const { bold, italic, underline, dim, strikethrough, fg: foreground, bg: background } = style;
    const definition = {
      bold,
      italic,
      underline,
      dim,
      strikethrough,
      fg: foreground ? RGBA2.clone(parseColor2(foreground)) : undefined,
      bg: background ? RGBA2.clone(parseColor2(background)) : undefined
    };
    const attributes = createTextAttributes2(definition);
    const suppliedAttributes = createTextAttributes2(Object.fromEntries(attributeNames.map((key) => [key, definition[key] !== undefined])));
    const fg = definition.fg ?? null;
    const bg = definition.bg ?? null;
    return this.lib.getYogaHost().runMutation(() => {
      const id = this.lib.contextSyntaxStyleRegister(this.native.handle.context, this.native.handle, name, {
        fg,
        bg,
        attributes,
        suppliedAttributes
      });
      this.nameCache.set(name, id);
      this.styleDefs.set(name, definition);
      this.mergedCache.clear();
      return id;
    });
  }
  resolveStyleId(name) {
    this.guard();
    const cached = this.nameCache.get(name);
    if (cached !== undefined)
      return cached;
    const id = this.lib.contextSyntaxStyleResolveByName(this.native.handle.context, this.native.handle, name);
    if (id !== null) {
      this.nameCache.set(name, id);
    }
    return id;
  }
  getStyleId(name) {
    this.guard();
    const id = this.resolveStyleId(name);
    if (id !== null)
      return id;
    if (name.includes(".")) {
      const baseName = name.split(".")[0];
      return this.resolveStyleId(baseName);
    }
    return null;
  }
  getStyleCount() {
    this.guard();
    return this.lib.contextSyntaxStyleGetStyleCount(this.native.handle.context, this.native.handle);
  }
  clearNameCache() {
    this.guard();
    this.nameCache.clear();
  }
  getStyle(name) {
    this.guard();
    const style = this.styleDefs.get(name) ?? (name.includes(".") ? this.styleDefs.get(name.split(".")[0]) : undefined);
    if (name === "markup.strikethrough" && style?.strikethrough === undefined) {
      return { ...cloneStyle(style ?? this.styleDefs.get("default") ?? {}), strikethrough: true };
    }
    return style ? cloneStyle(style) : undefined;
  }
  mergeStyles(...styleNames) {
    this.guard();
    const cacheKey = JSON.stringify(styleNames);
    const cached = this.mergedCache.get(cacheKey);
    if (cached)
      return cloneStyle(cached);
    const styleDefinition = {};
    for (const name of styleNames) {
      const style = this.getStyle(name);
      if (!style)
        continue;
      if (style.fg)
        styleDefinition.fg = style.fg;
      if (style.bg)
        styleDefinition.bg = style.bg;
      for (const name of attributeNames) {
        if (style[name] !== undefined)
          styleDefinition[name] = style[name];
      }
    }
    const merged = {
      fg: styleDefinition.fg,
      bg: styleDefinition.bg,
      attributes: createTextAttributes2(styleDefinition)
    };
    this.mergedCache.set(cacheKey, merged);
    return cloneStyle(merged);
  }
  clearCache() {
    this.guard();
    this.mergedCache.clear();
  }
  getCacheSize() {
    this.guard();
    return this.mergedCache.size;
  }
  getAllStyles() {
    this.guard();
    return new Map(Array.from(this.styleDefs, ([name, style]) => [name, cloneStyle(style)]));
  }
  getRegisteredNames() {
    this.guard();
    return Array.from(this.styleDefs.keys());
  }
  destroy() {
    if (this._destroyed)
      return;
    this.lib.getYogaHost().runMutation(() => {
      if (!this.native.owner.disposed)
        this.lib.destroyContextSyntaxStyle(this.native.handle.context, this.native.handle);
      this._destroyed = true;
      this.nameCache.clear();
      this.styleDefs.clear();
      this.mergedCache.clear();
    });
  }
}
// src/post/effects.ts
function toU8(value) {
  return Math.round(Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0)) * 255);
}
function channel(buffer, index) {
  return (buffer[index] & 255) / 255;
}
function setRgb(buffer, base, r, g, b) {
  const a = buffer[base + 3] & 255;
  buffer[base] = toU8(r);
  buffer[base + 1] = toU8(g);
  buffer[base + 2] = toU8(b);
  buffer[base + 3] = a;
}
function isGraphemeCell(char) {
  return char >>> 30 >= 2;
}

class DistortionEffect {
  glitchChancePerSecond = 0.5;
  maxGlitchLines = 3;
  minGlitchDuration = 0.05;
  maxGlitchDuration = 0.2;
  maxShiftAmount = 10;
  shiftFlipRatio = 0.6;
  colorGlitchChance = 0.2;
  lastGlitchTime = 0;
  glitchDuration = 0;
  activeGlitches = [];
  constructor(options) {
    if (options) {
      Object.assign(this, options);
    }
  }
  apply(buffer, deltaTime) {
    buffer.withBuffers((buf) => {
      const { width, height } = buf;
      this.lastGlitchTime += deltaTime;
      if (this.activeGlitches.length > 0 && this.lastGlitchTime >= this.glitchDuration) {
        this.activeGlitches = [];
        this.glitchDuration = 0;
      }
      if (this.activeGlitches.length === 0 && Math.random() < this.glitchChancePerSecond * deltaTime) {
        this.lastGlitchTime = 0;
        this.glitchDuration = this.minGlitchDuration + Math.random() * (this.maxGlitchDuration - this.minGlitchDuration);
        const numGlitches = 1 + Math.floor(Math.random() * this.maxGlitchLines);
        for (let i = 0;i < numGlitches; i++) {
          const y = Math.floor(Math.random() * height);
          let type;
          let amount = 0;
          const typeRoll = Math.random();
          if (typeRoll < this.colorGlitchChance) {
            type = "color";
          } else {
            const shiftRoll = (typeRoll - this.colorGlitchChance) / (1 - this.colorGlitchChance);
            if (shiftRoll < this.shiftFlipRatio) {
              type = "shift";
              amount = Math.floor((Math.random() - 0.5) * 2 * this.maxShiftAmount);
            } else {
              type = "flip";
            }
          }
          if (!this.activeGlitches.some((g) => g.y === y)) {
            this.activeGlitches.push({ y, type, amount });
          }
        }
      }
      if (this.activeGlitches.length > 0) {
        let tempChar = null;
        let tempFg = null;
        let tempBg = null;
        let tempAttr = null;
        for (const glitch of this.activeGlitches) {
          const y = glitch.y;
          if (y < 0 || y >= height)
            continue;
          const baseIndex = y * width;
          if (glitch.type === "shift" || glitch.type === "flip") {
            const { char, fg, bg, attributes } = buf;
            if (!tempChar) {
              tempChar = new Uint32Array(width);
              tempFg = new Uint16Array(width * 4);
              tempBg = new Uint16Array(width * 4);
              tempAttr = new Uint8Array(width);
            }
            tempChar.set(char.subarray(baseIndex, baseIndex + width));
            tempFg.set(fg.subarray(baseIndex * 4, (baseIndex + width) * 4));
            tempBg.set(bg.subarray(baseIndex * 4, (baseIndex + width) * 4));
            tempAttr.set(attributes.subarray(baseIndex, baseIndex + width));
            if (glitch.type === "shift") {
              const shift = glitch.amount;
              for (let x = 0;x < width; x++) {
                const srcX = (x - shift + width) % width;
                const destIndex = baseIndex + x;
                const srcTempIndex = srcX;
                char[destIndex] = tempChar[srcTempIndex];
                attributes[destIndex] = tempAttr[srcTempIndex];
                const destColorIndex = destIndex * 4;
                const srcTempColorIndex = srcTempIndex * 4;
                fg.set(tempFg.subarray(srcTempColorIndex, srcTempColorIndex + 4), destColorIndex);
                bg.set(tempBg.subarray(srcTempColorIndex, srcTempColorIndex + 4), destColorIndex);
              }
            } else {
              for (let x = 0;x < width; x++) {
                const srcX = width - 1 - x;
                const destIndex = baseIndex + x;
                const srcTempIndex = srcX;
                char[destIndex] = tempChar[srcTempIndex];
                attributes[destIndex] = tempAttr[srcTempIndex];
                const destColorIndex = destIndex * 4;
                const srcTempColorIndex = srcTempIndex * 4;
                fg.set(tempFg.subarray(srcTempColorIndex, srcTempColorIndex + 4), destColorIndex);
                bg.set(tempBg.subarray(srcTempColorIndex, srcTempColorIndex + 4), destColorIndex);
              }
            }
          } else if (glitch.type === "color") {
            const { fg, bg } = buf;
            const glitchStart = Math.floor(Math.random() * width);
            const maxPossibleLength = width - glitchStart;
            let glitchLength = Math.floor(Math.random() * maxPossibleLength) + 1;
            if (Math.random() < 0.2) {
              glitchLength = Math.floor(Math.random() * (width / 4)) + 1;
            }
            glitchLength = Math.min(glitchLength, maxPossibleLength);
            for (let x = glitchStart;x < glitchStart + glitchLength; x++) {
              if (x >= width)
                break;
              const destIndex = baseIndex + x;
              const destColorIndex = destIndex * 4;
              let rFg, gFg, bFg, rBg, gBg, bBg;
              const colorMode = Math.random();
              if (colorMode < 0.33) {
                rFg = Math.random();
                gFg = Math.random();
                bFg = Math.random();
                rBg = Math.random();
                gBg = Math.random();
                bBg = Math.random();
              } else if (colorMode < 0.66) {
                const emphasis = Math.random();
                if (emphasis < 0.25) {
                  rFg = Math.random();
                  gFg = 0;
                  bFg = 0;
                } else if (emphasis < 0.5) {
                  rFg = 0;
                  gFg = Math.random();
                  bFg = 0;
                } else if (emphasis < 0.75) {
                  rFg = 0;
                  gFg = 0;
                  bFg = Math.random();
                } else {
                  const glitchColorRoll = Math.random();
                  if (glitchColorRoll < 0.33) {
                    rFg = 1;
                    gFg = 0;
                    bFg = 1;
                  } else if (glitchColorRoll < 0.66) {
                    rFg = 0;
                    gFg = 1;
                    bFg = 1;
                  } else {
                    rFg = 1;
                    gFg = 1;
                    bFg = 0;
                  }
                }
                if (Math.random() < 0.5) {
                  rBg = 1 - rFg;
                  gBg = 1 - gFg;
                  bBg = 1 - bFg;
                } else {
                  rBg = rFg * (Math.random() * 0.5 + 0.2);
                  gBg = gFg * (Math.random() * 0.5 + 0.2);
                  bBg = bFg * (Math.random() * 0.5 + 0.2);
                }
              } else {
                rFg = Math.random() > 0.5 ? 1 : 0;
                gFg = Math.random() > 0.5 ? 1 : 0;
                bFg = Math.random() > 0.5 ? 1 : 0;
                rBg = 1 - rFg;
                gBg = 1 - gFg;
                bBg = 1 - bFg;
              }
              setRgb(fg, destColorIndex, rFg, gFg, bFg);
              setRgb(bg, destColorIndex, rBg, gBg, bBg);
            }
          }
        }
      }
    });
  }
}

class VignetteEffect {
  _strength;
  precomputedAttenuationCellMask = null;
  precomputedAttenuation = null;
  cachedWidth = -1;
  cachedHeight = -1;
  static zeroMatrix = new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  constructor(strength = 0.5) {
    this._strength = strength;
  }
  set strength(newStrength) {
    this._strength = Math.max(0, newStrength);
    this.cachedWidth = -1;
    this.cachedHeight = -1;
    this.precomputedAttenuationCellMask = null;
    this.precomputedAttenuation = null;
  }
  get strength() {
    return this._strength;
  }
  _computeFactors(width, height) {
    this.precomputedAttenuationCellMask = new Float32Array(width * height * 3);
    this.precomputedAttenuation = new Float32Array(width * height);
    const centerX = width / 2;
    const centerY = height / 2;
    const maxDistSq = centerX * centerX + centerY * centerY;
    const safeMaxDistSq = maxDistSq === 0 ? 1 : maxDistSq;
    const strength = this._strength;
    let i = 0;
    for (let y = 0;y < height; y++) {
      const dy = y - centerY;
      const dySq = dy * dy;
      for (let x = 0;x < width; x++) {
        const dx = x - centerX;
        const distSq = dx * dx + dySq;
        const baseAttenuation = Math.min(1, distSq / safeMaxDistSq);
        const attenuation = baseAttenuation * strength;
        this.precomputedAttenuationCellMask[i++] = x;
        this.precomputedAttenuationCellMask[i++] = y;
        this.precomputedAttenuationCellMask[i++] = attenuation;
        this.precomputedAttenuation[y * width + x] = attenuation;
      }
    }
    this.cachedWidth = width;
    this.cachedHeight = height;
  }
  _preserveGraphemeRuns(chars, width, height) {
    const baseAttenuation = this.precomputedAttenuation;
    const cellMask = this.precomputedAttenuationCellMask;
    for (let y = 0;y < height; y++) {
      let x = 0;
      while (x < width) {
        const cell = y * width + x;
        if (!isGraphemeCell(chars[cell])) {
          cellMask[cell * 3 + 2] = baseAttenuation[cell];
          x++;
          continue;
        }
        const start = x;
        while (x < width && isGraphemeCell(chars[y * width + x]))
          x++;
        const attenuation = baseAttenuation[y * width + start + Math.floor((x - start) / 2)];
        for (let runX = start;runX < x; runX++)
          cellMask[(y * width + runX) * 3 + 2] = attenuation;
      }
    }
  }
  apply(buffer) {
    buffer.withBuffers(({ char, width, height }) => {
      if (width !== this.cachedWidth || height !== this.cachedHeight || !this.precomputedAttenuationCellMask) {
        this._computeFactors(width, height);
      }
      this._preserveGraphemeRuns(char, width, height);
      buffer.colorMatrix(VignetteEffect.zeroMatrix, this.precomputedAttenuationCellMask, 1, 3);
    });
  }
}

class PerlinNoise {
  perm;
  grad3 = [
    [1, 1, 0],
    [-1, 1, 0],
    [1, -1, 0],
    [-1, -1, 0],
    [1, 0, 1],
    [-1, 0, 1],
    [1, 0, -1],
    [-1, 0, -1],
    [0, 1, 1],
    [0, -1, 1],
    [0, 1, -1],
    [0, -1, -1]
  ];
  constructor() {
    this.perm = new Uint8Array(512);
    const p = new Uint8Array(256);
    for (let i = 0;i < 256; i++) {
      p[i] = i;
    }
    for (let i = 255;i > 0; i--) {
      const r = Math.floor(Math.random() * (i + 1));
      [p[i], p[r]] = [p[r], p[i]];
    }
    for (let i = 0;i < 512; i++) {
      this.perm[i] = p[i & 255];
    }
  }
  dot(g, x, y, z) {
    return g[0] * x + g[1] * y + g[2] * z;
  }
  mix(a, b, t) {
    return a + (b - a) * t;
  }
  fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }
  noise3d(x, y, z) {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const Z = Math.floor(z) & 255;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);
    const zf = z - Math.floor(z);
    const u = this.fade(xf);
    const v = this.fade(yf);
    const w = this.fade(zf);
    const A = this.perm[X] + Y;
    const AA = this.perm[A] + Z;
    const AB = this.perm[A + 1] + Z;
    const B = this.perm[X + 1] + Y;
    const BA = this.perm[B] + Z;
    const BB = this.perm[B + 1] + Z;
    let res = this.mix(this.mix(this.mix(this.dot(this.grad3[this.perm[AA] % 12], xf, yf, zf), this.dot(this.grad3[this.perm[BA] % 12], xf - 1, yf, zf), u), this.mix(this.dot(this.grad3[this.perm[AB] % 12], xf, yf - 1, zf), this.dot(this.grad3[this.perm[BB] % 12], xf - 1, yf - 1, zf), u), v), this.mix(this.mix(this.dot(this.grad3[this.perm[AA + 1] % 12], xf, yf, zf - 1), this.dot(this.grad3[this.perm[BA + 1] % 12], xf - 1, yf, zf - 1), u), this.mix(this.dot(this.grad3[this.perm[AB + 1] % 12], xf, yf - 1, zf - 1), this.dot(this.grad3[this.perm[BB + 1] % 12], xf - 1, yf - 1, zf - 1), u), v), w);
    return res;
  }
}

class CloudsEffect {
  noise;
  _scale;
  _speed;
  _density;
  _darkness;
  time = 0;
  constructor(scale = 0.02, speed = 0.5, density = 0.6, darkness = 0.7) {
    this.noise = new PerlinNoise;
    this._scale = scale;
    this._speed = speed;
    this._density = density;
    this._darkness = darkness;
  }
  set scale(newScale) {
    this._scale = Math.max(0.001, newScale);
  }
  get scale() {
    return this._scale;
  }
  set speed(newSpeed) {
    this._speed = Math.max(0, newSpeed);
  }
  get speed() {
    return this._speed;
  }
  set density(newDensity) {
    this._density = Math.max(0, Math.min(1, newDensity));
  }
  get density() {
    return this._density;
  }
  set darkness(newDarkness) {
    this._darkness = Math.max(0, Math.min(1, newDarkness));
  }
  get darkness() {
    return this._darkness;
  }
  apply(buffer, deltaTime) {
    buffer.withBuffers(({ width, height }) => {
      this.time += deltaTime * this._speed;
      const scale = this._scale;
      const timeOffset = this.time;
      const cellMask = new Float32Array(width * height * 3);
      let maskIdx = 0;
      for (let y = 0;y < height; y++) {
        for (let x = 0;x < width; x++) {
          let noiseValue = 0;
          let amplitude = 1;
          let frequency = 1;
          let maxValue = 0;
          for (let i = 0;i < 4; i++) {
            const nx = (x * scale * frequency + timeOffset) * 0.5;
            const ny = y * scale * frequency * 0.5;
            const nz = timeOffset * 0.3;
            noiseValue += this.noise.noise3d(nx, ny, nz) * amplitude;
            maxValue += amplitude;
            amplitude *= 0.5;
            frequency *= 2;
          }
          noiseValue = (noiseValue / maxValue + 1) * 0.5;
          const cloudDensity = Math.max(0, noiseValue - (1 - this._density));
          const attenuation = cloudDensity * this._darkness;
          cellMask[maskIdx++] = x;
          cellMask[maskIdx++] = y;
          cellMask[maskIdx++] = attenuation;
        }
      }
      const zeroMatrix = new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      buffer.colorMatrix(zeroMatrix, cellMask, 1, 2);
    });
  }
}

class FlamesEffect {
  noise;
  _scale;
  _speed;
  _intensity;
  time = 0;
  constructor(scale = 0.03, speed = 0.02, intensity = 0.8) {
    this.noise = new PerlinNoise;
    this._scale = scale;
    this._speed = speed;
    this._intensity = intensity;
  }
  set scale(newScale) {
    this._scale = Math.max(0.001, newScale);
  }
  get scale() {
    return this._scale;
  }
  set speed(newSpeed) {
    this._speed = Math.max(0, newSpeed);
  }
  get speed() {
    return this._speed;
  }
  set intensity(newIntensity) {
    this._intensity = Math.max(0, Math.min(1, newIntensity));
  }
  get intensity() {
    return this._intensity;
  }
  apply(buffer, deltaTime) {
    buffer.withBuffers(({ width, height, bg }) => {
      this.time += deltaTime * this._speed;
      const scale = this._scale;
      const timeOffset = this.time;
      for (let y = 0;y < height; y++) {
        const heightFactor = 1 - y / height;
        for (let x = 0;x < width; x++) {
          let noiseValue = 0;
          let amplitude = 1;
          let frequency = 1;
          let maxValue = 0;
          for (let i = 0;i < 3; i++) {
            const nx = (x * scale * frequency + timeOffset) * 0.5;
            const ny = (height - y) * scale * frequency * 2 * 0.5;
            const nz = timeOffset * 2;
            noiseValue += this.noise.noise3d(nx, ny, nz) * amplitude;
            maxValue += amplitude;
            amplitude *= 0.5;
            frequency *= 2;
          }
          noiseValue = (noiseValue / maxValue + 1) * 0.5;
          const flameIntensity = noiseValue * heightFactor * this._intensity;
          if (flameIntensity > 0) {
            const colorIndex = (y * width + x) * 4;
            let r, g, b;
            if (flameIntensity > 0.7) {
              r = 1;
              g = 1;
              b = 0.3 + (flameIntensity - 0.7) * 2.3;
            } else if (flameIntensity > 0.4) {
              r = 1;
              g = 0.5 + (flameIntensity - 0.4) * 1.67;
              b = 0;
            } else {
              r = 0.3 + flameIntensity * 1.75;
              g = flameIntensity * 0.5;
              b = 0;
            }
            setRgb(bg, colorIndex, Math.max(channel(bg, colorIndex), r * flameIntensity), Math.max(channel(bg, colorIndex + 1), g * flameIntensity), Math.max(channel(bg, colorIndex + 2), b * flameIntensity));
          }
        }
      }
    });
  }
}

class CRTRollingBarEffect {
  _speed;
  _height;
  _intensity;
  _fadeDistance;
  position = 0;
  constructor(speed = 0.5, height = 0.15, intensity = 0.3, fadeDistance = 0.3) {
    this._speed = speed;
    this._height = Math.max(0.01, Math.min(0.5, height));
    this._intensity = Math.max(0, Math.min(1, intensity));
    this._fadeDistance = Math.max(0, Math.min(1, fadeDistance));
  }
  set speed(newSpeed) {
    this._speed = newSpeed;
  }
  get speed() {
    return this._speed;
  }
  set height(newHeight) {
    this._height = Math.max(0.01, Math.min(0.5, newHeight));
  }
  get height() {
    return this._height;
  }
  set intensity(newIntensity) {
    this._intensity = Math.max(0, Math.min(1, newIntensity));
  }
  get intensity() {
    return this._intensity;
  }
  set fadeDistance(newFadeDistance) {
    this._fadeDistance = Math.max(0, Math.min(1, newFadeDistance));
  }
  get fadeDistance() {
    return this._fadeDistance;
  }
  apply(buffer, deltaTime) {
    buffer.withBuffers(({ width, height, fg, bg }) => {
      this.position += deltaTime / 1000 * this._speed;
      const cycleHeight = height + this._height * height * 2;
      this.position = this.position % cycleHeight;
      const barPixelHeight = this._height * height;
      const fadePixelDistance = this._fadeDistance * barPixelHeight;
      const totalEffectHeight = barPixelHeight + fadePixelDistance * 2;
      const effectCenter = this.position - totalEffectHeight / 2 + barPixelHeight / 2;
      for (let y = 0;y < height; y++) {
        const distFromCenter = Math.abs(y - effectCenter);
        let barFactor = 0;
        if (distFromCenter <= totalEffectHeight / 2) {
          const normalizedDist = distFromCenter / (totalEffectHeight / 2);
          barFactor = Math.cos(normalizedDist * Math.PI / 2);
        }
        if (barFactor > 0.001) {
          const rowMultiplier = 1 + this._intensity * barFactor;
          for (let x = 0;x < width; x++) {
            const colorIndex = (y * width + x) * 4;
            setRgb(fg, colorIndex, Math.min(1, channel(fg, colorIndex) * rowMultiplier), Math.min(1, channel(fg, colorIndex + 1) * rowMultiplier), Math.min(1, channel(fg, colorIndex + 2) * rowMultiplier));
            setRgb(bg, colorIndex, Math.min(1, channel(bg, colorIndex) * rowMultiplier), Math.min(1, channel(bg, colorIndex + 1) * rowMultiplier), Math.min(1, channel(bg, colorIndex + 2) * rowMultiplier));
          }
        }
      }
    });
  }
}

class RainbowTextEffect {
  _speed;
  _saturation;
  _value;
  _repeats;
  time = 0;
  constructor(speed = 0.01, saturation = 1, value = 1, repeats = 3) {
    this._speed = speed;
    this._saturation = saturation;
    this._value = value;
    this._repeats = repeats;
  }
  set speed(newSpeed) {
    this._speed = Math.max(0, newSpeed);
  }
  get speed() {
    return this._speed;
  }
  set saturation(newSaturation) {
    this._saturation = Math.max(0, Math.min(1, newSaturation));
  }
  get saturation() {
    return this._saturation;
  }
  set value(newValue) {
    this._value = Math.max(0, Math.min(1, newValue));
  }
  get value() {
    return this._value;
  }
  set repeats(newRepeats) {
    this._repeats = Math.max(0.1, newRepeats);
  }
  get repeats() {
    return this._repeats;
  }
  hsvToRgb(h, s, v) {
    let r = 0, g = 0, b = 0;
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    switch (i % 6) {
      case 0:
        r = v;
        g = t;
        b = p;
        break;
      case 1:
        r = q;
        g = v;
        b = p;
        break;
      case 2:
        r = p;
        g = v;
        b = t;
        break;
      case 3:
        r = p;
        g = q;
        b = v;
        break;
      case 4:
        r = t;
        g = p;
        b = v;
        break;
      case 5:
        r = v;
        g = p;
        b = q;
        break;
    }
    return [r, g, b];
  }
  apply(buffer, deltaTime) {
    buffer.withBuffers(({ width, height, fg }) => {
      this.time += deltaTime * this._speed;
      const saturation = this._saturation;
      const value = this._value;
      const repeats = this._repeats;
      const angleRad = 25 * Math.PI / 180;
      const cosAngle = Math.cos(angleRad);
      const sinAngle = Math.sin(angleRad);
      const whiteThreshold = 0.9;
      for (let y = 0;y < height; y++) {
        for (let x = 0;x < width; x++) {
          const colorIndex = (y * width + x) * 4;
          const r = channel(fg, colorIndex);
          const g = channel(fg, colorIndex + 1);
          const b = channel(fg, colorIndex + 2);
          if (r >= whiteThreshold && g >= whiteThreshold && b >= whiteThreshold) {
            const projection = x * cosAngle + y * sinAngle;
            const maxProjection = width * cosAngle + height * sinAngle;
            const hue = (projection / maxProjection * repeats + this.time * 0.1) % 1;
            const [newR, newG, newB] = this.hsvToRgb(hue, saturation, value);
            setRgb(fg, colorIndex, newR, newG, newB);
          }
        }
      }
    });
  }
}
// src/post/filters.ts
function toU82(value) {
  return Math.round(Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0)) * 255);
}
function channel2(buffer, index) {
  return (buffer[index] & 255) / 255;
}
function setRgb2(buffer, base, r, g, b) {
  const a = buffer[base + 3] & 255;
  buffer[base] = toU82(r);
  buffer[base + 1] = toU82(g);
  buffer[base + 2] = toU82(b);
  buffer[base + 3] = a;
}
function applyScanlines(buffer, strength = 0.8, step = 2) {
  if (strength === 1 || step < 1)
    return;
  buffer.withBuffers(({ width, height }) => {
    const affectedRows = Math.ceil(height / step);
    const cellCount = width * affectedRows;
    const cellMask = new Float32Array(cellCount * 3);
    let maskIdx = 0;
    for (let y = 0;y < height; y += step) {
      for (let x = 0;x < width; x++) {
        cellMask[maskIdx++] = x;
        cellMask[maskIdx++] = y;
        cellMask[maskIdx++] = 1;
      }
    }
    const s = strength;
    const matrix = new Float32Array([
      s,
      0,
      0,
      0,
      0,
      s,
      0,
      0,
      0,
      0,
      s,
      0,
      0,
      0,
      0,
      1
    ]);
    buffer.colorMatrix(matrix, cellMask, 1, 2);
  });
}
function applyInvert(buffer, strength = 1) {
  if (strength === 0)
    return;
  const matrix = new Float32Array([
    -1,
    0,
    0,
    1,
    0,
    -1,
    0,
    1,
    0,
    0,
    -1,
    1,
    0,
    0,
    0,
    1
  ]);
  buffer.colorMatrixUniform(matrix, strength, 3);
}
function applyNoise(buffer, strength = 0.1) {
  if (strength === 0)
    return;
  buffer.withBuffers(({ width, height }) => {
    const size = width * height;
    const cellMask = new Float32Array(size * 3);
    let cellMaskIndex = 0;
    for (let y = 0;y < height; y++) {
      for (let x = 0;x < width; x++) {
        cellMask[cellMaskIndex++] = x;
        cellMask[cellMaskIndex++] = y;
        cellMask[cellMaskIndex++] = (Math.random() - 0.5) * 2;
      }
    }
    const b = 1 + strength;
    const matrix = new Float32Array([
      b,
      0,
      0,
      0,
      0,
      b,
      0,
      0,
      0,
      0,
      b,
      0,
      0,
      0,
      0,
      1
    ]);
    buffer.colorMatrix(matrix, cellMask, 1, 3);
  });
}
function applyChromaticAberration(buffer, strength = 1) {
  buffer.withBuffers(({ width, height, fg: destFg }) => {
    const srcFg = Uint16Array.from(destFg);
    const centerX = width / 2;
    const centerY = height / 2;
    for (let y = 0;y < height; y++) {
      for (let x = 0;x < width; x++) {
        const dx = x - centerX;
        const dy = y - centerY;
        const offset = Math.round(Math.sqrt(dx * dx + dy * dy) / Math.max(centerX, centerY) * strength);
        const rX = Math.max(0, Math.min(width - 1, x - offset));
        const bX = Math.max(0, Math.min(width - 1, x + offset));
        const rIndex = (y * width + rX) * 4;
        const gIndex = (y * width + x) * 4;
        const bIndex = (y * width + bX) * 4;
        const destIndex = (y * width + x) * 4;
        setRgb2(destFg, destIndex, channel2(srcFg, rIndex), channel2(srcFg, gIndex + 1), channel2(srcFg, bIndex + 2));
      }
    }
  });
}
function applyAsciiArt(buffer, ramp = ' .\'`^"",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$', fgColor = { r: 1, g: 1, b: 1 }, bgColor = { r: 0, g: 0, b: 0 }) {
  buffer.withBuffers(({ width, height, char: chars, bg }) => {
    const rampLength = ramp.length;
    for (let y = 0;y < height; y++) {
      for (let x = 0;x < width; x++) {
        const index = y * width + x;
        const colorIndex = index * 4;
        const bgR = channel2(bg, colorIndex);
        const bgG = channel2(bg, colorIndex + 1);
        const bgB = channel2(bg, colorIndex + 2);
        const lum = 0.299 * bgR + 0.587 * bgG + 0.114 * bgB;
        const rampIndex = Math.min(rampLength - 1, Math.floor(lum * rampLength));
        chars[index] = ramp[rampIndex].charCodeAt(0);
      }
    }
    const fgMatrix = new Float32Array([
      0,
      0,
      0,
      fgColor.r,
      0,
      0,
      0,
      fgColor.g,
      0,
      0,
      0,
      fgColor.b,
      0,
      0,
      0,
      1
    ]);
    const bgMatrix = new Float32Array([
      0,
      0,
      0,
      bgColor.r,
      0,
      0,
      0,
      bgColor.g,
      0,
      0,
      0,
      bgColor.b,
      0,
      0,
      0,
      1
    ]);
    buffer.colorMatrixUniform(fgMatrix, 1, 1);
    buffer.colorMatrixUniform(bgMatrix, 1, 2);
  });
}
function applyBrightness(buffer, brightness = 0, cellMask) {
  if (brightness === 0)
    return;
  const b = brightness;
  const matrix = new Float32Array([
    1,
    0,
    0,
    b,
    0,
    1,
    0,
    b,
    0,
    0,
    1,
    b,
    0,
    0,
    0,
    1
  ]);
  if (!cellMask || cellMask.length === 0) {
    buffer.colorMatrixUniform(matrix, 1, 3);
  } else {
    buffer.colorMatrix(matrix, cellMask, 1, 3);
  }
}
function applyGain(buffer, gain = 1, cellMask) {
  if (gain === 1)
    return;
  const g = Math.max(0, gain);
  const matrix = new Float32Array([
    g,
    0,
    0,
    0,
    0,
    g,
    0,
    0,
    0,
    0,
    g,
    0,
    0,
    0,
    0,
    1
  ]);
  if (!cellMask || cellMask.length === 0) {
    buffer.colorMatrixUniform(matrix, 1, 3);
  } else {
    buffer.colorMatrix(matrix, cellMask, 1, 3);
  }
}
function createSaturationMatrix(saturation) {
  const s = Math.max(0, saturation);
  const sr = 0.299 * (1 - s);
  const sg = 0.587 * (1 - s);
  const sb = 0.114 * (1 - s);
  const m00 = sr + s;
  const m01 = sg;
  const m02 = sb;
  const m10 = sr;
  const m11 = sg + s;
  const m12 = sb;
  const m20 = sr;
  const m21 = sg;
  const m22 = sb + s;
  return new Float32Array([
    m00,
    m01,
    m02,
    0,
    m10,
    m11,
    m12,
    0,
    m20,
    m21,
    m22,
    0,
    0,
    0,
    0,
    1
  ]);
}
function applySaturation(buffer, cellMask, strength = 1) {
  if (strength === 1 || strength === 0) {
    return;
  }
  const matrix = createSaturationMatrix(strength);
  if (!cellMask || cellMask.length === 0) {
    buffer.colorMatrixUniform(matrix, 1, 3);
  } else {
    buffer.colorMatrix(matrix, cellMask, 1, 3);
  }
}

class BloomEffect {
  _threshold;
  _strength;
  _radius;
  constructor(threshold = 0.8, strength = 0.2, radius = 2) {
    this._threshold = Math.max(0, Math.min(1, threshold));
    this._strength = Math.max(0, strength);
    this._radius = Math.max(0, Math.round(radius));
  }
  set threshold(newThreshold) {
    this._threshold = Math.max(0, Math.min(1, newThreshold));
  }
  get threshold() {
    return this._threshold;
  }
  set strength(newStrength) {
    this._strength = Math.max(0, newStrength);
  }
  get strength() {
    return this._strength;
  }
  set radius(newRadius) {
    this._radius = Math.max(0, Math.round(newRadius));
  }
  get radius() {
    return this._radius;
  }
  apply(buffer) {
    const threshold = this._threshold;
    const strength = this._strength;
    const radius = this._radius;
    if (strength <= 0 || radius <= 0)
      return;
    buffer.withBuffers(({ width, height, fg: destFg, bg: destBg }) => {
      const brightPixels = [];
      for (let y = 0;y < height; y++) {
        for (let x = 0;x < width; x++) {
          const index = (y * width + x) * 4;
          const fgLum = 0.299 * channel2(destFg, index) + 0.587 * channel2(destFg, index + 1) + 0.114 * channel2(destFg, index + 2);
          const bgLum = 0.299 * channel2(destBg, index) + 0.587 * channel2(destBg, index + 1) + 0.114 * channel2(destBg, index + 2);
          const lum = Math.max(fgLum, bgLum);
          if (lum > threshold) {
            const intensity = (lum - threshold) / (1 - threshold + 0.000001);
            brightPixels.push({ x, y, intensity: Math.max(0, intensity) });
          }
        }
      }
      if (brightPixels.length === 0)
        return;
      for (const bright of brightPixels) {
        for (let ky = -radius;ky <= radius; ky++) {
          for (let kx = -radius;kx <= radius; kx++) {
            if (kx === 0 && ky === 0)
              continue;
            const sampleX = bright.x + kx;
            const sampleY = bright.y + ky;
            if (sampleX >= 0 && sampleX < width && sampleY >= 0 && sampleY < height) {
              const distSq = kx * kx + ky * ky;
              const radiusSq = radius * radius;
              if (distSq <= radiusSq) {
                const falloff = 1 - distSq / radiusSq;
                const bloomAmount = bright.intensity * strength * falloff;
                const destIndex = (sampleY * width + sampleX) * 4;
                setRgb2(destFg, destIndex, Math.min(1, channel2(destFg, destIndex) + bloomAmount), Math.min(1, channel2(destFg, destIndex + 1) + bloomAmount), Math.min(1, channel2(destFg, destIndex + 2) + bloomAmount));
                setRgb2(destBg, destIndex, Math.min(1, channel2(destBg, destIndex) + bloomAmount), Math.min(1, channel2(destBg, destIndex + 1) + bloomAmount), Math.min(1, channel2(destBg, destIndex + 2) + bloomAmount));
              }
            }
          }
        }
      }
    });
  }
}
// src/post/matrices.ts
var SEPIA_MATRIX = new Float32Array([
  0.393,
  0.769,
  0.189,
  0,
  0.349,
  0.686,
  0.168,
  0,
  0.272,
  0.534,
  0.131,
  0,
  0,
  0,
  0,
  1
]);
var PROTANOPIA_SIM_MATRIX = new Float32Array([
  0.567,
  0.433,
  0,
  0,
  0.558,
  0.442,
  0,
  0,
  0,
  0.242,
  0.758,
  0,
  0,
  0,
  0,
  1
]);
var DEUTERANOPIA_SIM_MATRIX = new Float32Array([
  0.625,
  0.375,
  0,
  0,
  0.7,
  0.3,
  0,
  0,
  0,
  0.3,
  0.7,
  0,
  0,
  0,
  0,
  1
]);
var TRITANOPIA_SIM_MATRIX = new Float32Array([
  0.95,
  0.05,
  0,
  0,
  0,
  0.433,
  0.567,
  0,
  0,
  0.475,
  0.525,
  0,
  0,
  0,
  0,
  1
]);
var ACHROMATOPSIA_MATRIX = new Float32Array([
  0.299,
  0.587,
  0.114,
  0,
  0.299,
  0.587,
  0.114,
  0,
  0.299,
  0.587,
  0.114,
  0,
  0,
  0,
  0,
  1
]);
var PROTANOPIA_COMP_MATRIX = new Float32Array([
  1,
  0.2,
  0,
  0,
  0,
  0.9,
  0.1,
  0,
  0,
  0.1,
  0.9,
  0,
  0,
  0,
  0,
  1
]);
var DEUTERANOPIA_COMP_MATRIX = new Float32Array([
  0.9,
  0.1,
  0,
  0,
  0.2,
  0.8,
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  0,
  1
]);
var TRITANOPIA_COMP_MATRIX = new Float32Array([
  1,
  0,
  0,
  0,
  0,
  0.9,
  0.1,
  0,
  0.1,
  0,
  0.9,
  0,
  0,
  0,
  0,
  1
]);
var TECHNICOLOR_MATRIX = new Float32Array([
  1.5,
  -0.2,
  -0.3,
  0,
  -0.3,
  1.4,
  -0.1,
  0,
  -0.2,
  -0.2,
  1.4,
  0,
  0,
  0,
  0,
  1
]);
var SOLARIZATION_MATRIX = new Float32Array([
  -0.5,
  0.5,
  0.5,
  0,
  0.5,
  -0.5,
  0.5,
  0,
  0.5,
  0.5,
  -0.5,
  0,
  0,
  0,
  0,
  1
]);
var SYNTHWAVE_MATRIX = new Float32Array([
  1,
  0,
  0.25,
  0,
  0.1,
  0.1,
  0.1,
  0,
  0.25,
  0,
  1,
  0,
  0,
  0,
  0,
  1
]);
var GREENSCALE_MATRIX = new Float32Array([
  0,
  0,
  0,
  0,
  0.299,
  0.587,
  0.114,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1
]);
var GRAYSCALE_MATRIX = new Float32Array([
  0.299,
  0.587,
  0.114,
  0,
  0.299,
  0.587,
  0.114,
  0,
  0.299,
  0.587,
  0.114,
  0,
  0,
  0,
  0,
  1
]);
var INVERT_MATRIX = new Float32Array([
  -1,
  0,
  0,
  1,
  0,
  -1,
  0,
  1,
  0,
  0,
  -1,
  1,
  0,
  0,
  0,
  1
]);
// src/plugins/registry.ts
var noop = () => {};
var DEFAULT_DEBUG_PLUGIN_ERRORS = false;
var DEFAULT_MAX_PLUGIN_ERRORS = 100;
function normalizeError(error) {
  if (error instanceof Error) {
    return error;
  }
  if (typeof error === "string") {
    return new Error(error);
  }
  return new Error(`Unknown plugin error: ${String(error)}`);
}

class SlotRegistry {
  plugins = [];
  sortedPluginsCache = null;
  listeners = new Set;
  errorListeners = new Set;
  pluginErrors = [];
  registrationOrder = 0;
  batchDepth = 0;
  batchedNotify = false;
  rendererInstance;
  hostContext;
  options;
  constructor(renderer, context, options = {}) {
    this.rendererInstance = renderer;
    this.hostContext = context;
    this.options = {
      debugPluginErrors: options.debugPluginErrors ?? DEFAULT_DEBUG_PLUGIN_ERRORS,
      maxPluginErrors: options.maxPluginErrors ?? DEFAULT_MAX_PLUGIN_ERRORS,
      onPluginError: options.onPluginError
    };
  }
  get renderer() {
    return this.rendererInstance;
  }
  get context() {
    return this.hostContext;
  }
  configure(options) {
    if ("debugPluginErrors" in options) {
      this.options.debugPluginErrors = options.debugPluginErrors ?? DEFAULT_DEBUG_PLUGIN_ERRORS;
    }
    if ("maxPluginErrors" in options) {
      this.options.maxPluginErrors = options.maxPluginErrors ?? DEFAULT_MAX_PLUGIN_ERRORS;
    }
    if ("onPluginError" in options) {
      this.options.onPluginError = options.onPluginError;
    }
  }
  register(plugin) {
    if (this.plugins.some((entry) => entry.plugin.id === plugin.id)) {
      throw new Error(`Plugin with id "${plugin.id}" is already registered`);
    }
    try {
      plugin.setup?.(this.hostContext, this.rendererInstance);
    } catch (error) {
      this.reportPluginError({
        pluginId: plugin.id,
        phase: "setup",
        source: "registry",
        error
      });
      return noop;
    }
    this.plugins.push({
      plugin,
      registrationOrder: this.registrationOrder++,
      cachedOrder: plugin.order ?? 0,
      cachedId: plugin.id
    });
    this.invalidateSortedPluginsCache();
    this.notifyListeners();
    return () => {
      this.unregister(plugin.id);
    };
  }
  unregister(id) {
    const index = this.plugins.findIndex((entry) => entry.plugin.id === id);
    if (index === -1) {
      return false;
    }
    const [entry] = this.plugins.splice(index, 1);
    this.invalidateSortedPluginsCache();
    try {
      entry?.plugin.dispose?.();
    } catch (error) {
      this.reportPluginError({
        pluginId: id,
        phase: "dispose",
        source: "registry",
        error
      });
    }
    this.notifyListeners();
    return true;
  }
  updateOrder(id, order) {
    const entry = this.plugins.find((pluginEntry) => pluginEntry.plugin.id === id);
    if (!entry) {
      return false;
    }
    if ((entry.plugin.order ?? 0) === order) {
      return true;
    }
    entry.plugin.order = order;
    entry.cachedOrder = order;
    this.invalidateSortedPluginsCache();
    this.notifyListeners();
    return true;
  }
  clear() {
    if (this.plugins.length === 0) {
      return;
    }
    const plugins = [...this.plugins];
    this.plugins = [];
    this.invalidateSortedPluginsCache();
    for (const entry of plugins) {
      try {
        entry.plugin.dispose?.();
      } catch (error) {
        this.reportPluginError({
          pluginId: entry.plugin.id,
          phase: "dispose",
          source: "registry",
          error
        });
      }
    }
    this.notifyListeners();
  }
  subscribe(listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
  onPluginError(listener) {
    this.errorListeners.add(listener);
    return () => {
      this.errorListeners.delete(listener);
    };
  }
  batch(run) {
    this.batchDepth += 1;
    try {
      return run();
    } finally {
      this.batchDepth -= 1;
      if (this.batchDepth === 0 && this.batchedNotify) {
        this.batchedNotify = false;
        this.flushListeners();
      }
    }
  }
  getPluginErrors() {
    return this.pluginErrors;
  }
  clearPluginErrors() {
    this.pluginErrors = [];
  }
  reportPluginError(report) {
    const event = {
      pluginId: report.pluginId,
      slot: report.slot,
      phase: report.phase,
      source: report.source ?? "registry",
      error: normalizeError(report.error),
      timestamp: Date.now()
    };
    this.pluginErrors.push(event);
    if (this.pluginErrors.length > this.options.maxPluginErrors) {
      this.pluginErrors.splice(0, this.pluginErrors.length - this.options.maxPluginErrors);
    }
    if (this.options.debugPluginErrors) {
      const slotLabel = event.slot ? ` slot="${event.slot}"` : "";
      console.debug(`[SlotRegistry][PluginError] plugin="${event.pluginId}" phase="${event.phase}" source="${event.source}"${slotLabel}`);
      console.debug(event.error);
    }
    for (const listener of this.errorListeners) {
      try {
        listener(event);
      } catch (error) {
        console.error("Error in plugin error listener:", error);
      }
    }
    try {
      this.options.onPluginError?.(event);
    } catch (error) {
      console.error("Error in plugin error callback:", error);
    }
    return event;
  }
  resolve(slot) {
    return this.resolveEntries(slot).map((entry) => entry.renderer);
  }
  resolveEntries(slot) {
    const slotRenderers = [];
    for (const entry of this.getSortedPlugins()) {
      const renderer = entry.plugin.slots[slot];
      if (renderer) {
        slotRenderers.push({
          id: entry.plugin.id,
          renderer
        });
      }
    }
    return slotRenderers;
  }
  getSortedPlugins() {
    this.syncPluginSortMetadata();
    if (this.sortedPluginsCache) {
      return this.sortedPluginsCache;
    }
    this.sortedPluginsCache = [...this.plugins].sort((left, right) => {
      const leftOrder = left.cachedOrder;
      const rightOrder = right.cachedOrder;
      if (leftOrder !== rightOrder) {
        return leftOrder - rightOrder;
      }
      if (left.registrationOrder !== right.registrationOrder) {
        return left.registrationOrder - right.registrationOrder;
      }
      return left.cachedId.localeCompare(right.cachedId);
    });
    return this.sortedPluginsCache;
  }
  syncPluginSortMetadata() {
    let hasChanges = false;
    for (const entry of this.plugins) {
      const nextOrder = entry.plugin.order ?? 0;
      const nextId = entry.plugin.id;
      if (entry.cachedOrder !== nextOrder || entry.cachedId !== nextId) {
        entry.cachedOrder = nextOrder;
        entry.cachedId = nextId;
        hasChanges = true;
      }
    }
    if (hasChanges) {
      this.invalidateSortedPluginsCache();
    }
  }
  invalidateSortedPluginsCache() {
    this.sortedPluginsCache = null;
  }
  notifyListeners() {
    if (this.batchDepth > 0) {
      this.batchedNotify = true;
      return;
    }
    this.flushListeners();
  }
  flushListeners() {
    for (const listener of this.listeners) {
      try {
        listener();
      } catch (error) {
        console.error("Error in slot registry listener:", error);
      }
    }
  }
}
var slotRegistriesByRenderer = new WeakMap;
function getSlotRegistryStore(renderer) {
  const existingStore = slotRegistriesByRenderer.get(renderer);
  if (existingStore) {
    return existingStore;
  }
  const createdStore = new Map;
  slotRegistriesByRenderer.set(renderer, createdStore);
  renderer.once("destroy", () => {
    for (const registry of createdStore.values()) {
      try {
        registry.clear();
      } catch (error) {
        console.error("Error disposing slot registry:", error);
      }
    }
    createdStore.clear();
    slotRegistriesByRenderer.delete(renderer);
  });
  return createdStore;
}
function createSlotRegistry(renderer, key, context, options = {}) {
  const store = getSlotRegistryStore(renderer);
  const existing = store.get(key);
  if (existing) {
    if (existing.context !== context) {
      throw new Error(`createSlotRegistry called with a different context for renderer key "${key}". Reuse the original context object.`);
    }
    const typedExisting = existing;
    typedExisting.configure(options);
    return typedExisting;
  }
  const created = new SlotRegistry(renderer, context, options);
  store.set(key, created);
  return created;
}
// src/plugins/core-slot.ts
function isCoreManagedSlot(contribution) {
  return typeof contribution === "object" && contribution !== null && "render" in contribution;
}
function toCorePlugin(plugin) {
  const slots = {};
  for (const [slotName, contribution] of Object.entries(plugin.slots)) {
    const wrappedRenderer = (ctx, data) => {
      if (isCoreManagedSlot(contribution)) {
        return contribution.render(ctx, data);
      }
      return contribution(ctx, data);
    };
    if (isCoreManagedSlot(contribution)) {
      wrappedRenderer.__coreSlotOwnership = "plugin";
      wrappedRenderer.__coreManagedSlot = contribution;
    } else {
      wrappedRenderer.__coreSlotOwnership = "host";
    }
    slots[slotName] = wrappedRenderer;
  }
  return {
    id: plugin.id,
    order: plugin.order,
    setup: plugin.setup,
    dispose: plugin.dispose,
    slots
  };
}
function asArray(value) {
  if (!value) {
    return [];
  }
  return Array.isArray(value) ? [...value] : [value];
}
function ensureValidNode(node, pluginId, mount) {
  if (!node) {
    throw new Error(`Plugin "${pluginId}" did not return a renderable node`);
  }
  if (typeof node.then === "function") {
    throw new Error(`Plugin "${pluginId}" returned an async value. Core slots require synchronous renderers.`);
  }
  if (!isRenderable2(node)) {
    throw new Error(`Plugin "${pluginId}" must return a BaseRenderable`);
  }
  if (node === mount) {
    throw new Error(`Plugin "${pluginId}" returned the slot mount container as its node`);
  }
  if (node.parent && node.parent !== mount) {
    throw new Error(`Plugin "${pluginId}" returned a renderable already attached to another parent`);
  }
}
function createCoreSlotRegistry(renderer, context, options = {}) {
  return createSlotRegistry(renderer, "core:slot-registry", context, options);
}
function registerCorePlugin(registry, plugin) {
  return registry.register(toCorePlugin(plugin));
}
function resolveCoreSlot(registry, slot) {
  return resolveCoreSlotEntries(registry, slot).map((entry) => {
    return {
      id: entry.id,
      renderer: entry.renderer
    };
  });
}
function resolveCoreSlotEntries(registry, slot) {
  return registry.resolveEntries(slot).map((entry) => {
    const wrappedRenderer = entry.renderer;
    return {
      id: entry.id,
      renderer: (ctx, data) => wrappedRenderer(ctx, data),
      ownership: wrappedRenderer.__coreSlotOwnership ?? "host",
      managedSlot: wrappedRenderer.__coreManagedSlot
    };
  });
}

class SlotRenderable extends Renderable2 {
  _mode;
  _slotRegistry;
  _slotName;
  _data;
  _fallbackOption;
  _pluginFailurePlaceholder;
  _disposed = false;
  _mountedNodes = [];
  _pluginNodes = new Map;
  _activePluginIds = new Set;
  _fallbackNodes = null;
  _unsubscribe = null;
  constructor(ctx, options) {
    super(ctx, options);
    this._slotRegistry = options.registry;
    this._slotName = options.name;
    this._data = options.data ?? {};
    this._mode = options.mode ?? "append";
    this._fallbackOption = options.fallback;
    this._pluginFailurePlaceholder = options.pluginFailurePlaceholder;
    this._unsubscribe = this._slotRegistry.subscribe(() => this.refresh());
    try {
      this.refresh();
    } catch (error) {
      this._cleanupAll();
      throw error;
    }
  }
  get mode() {
    return this._mode;
  }
  set mode(value) {
    this._mode = value;
    this.refresh();
  }
  get data() {
    return this._data;
  }
  set data(value) {
    this._data = value;
    this.refresh();
  }
  refresh() {
    if (this._disposed) {
      return;
    }
    const allEntries = resolveCoreSlotEntries(this._slotRegistry, this._slotName);
    const activeEntries = this._mode === "single_winner" && allEntries.length > 0 ? [allEntries[0]] : allEntries;
    const nextActivePluginIds = new Set(activeEntries.map((entry) => entry.id));
    const registeredPluginIds = new Set(allEntries.map((entry) => entry.id));
    this._cleanupInactivePluginNodes(nextActivePluginIds, registeredPluginIds);
    for (const entry of activeEntries) {
      let state = this._pluginNodes.get(entry.id);
      const shouldRender = !state || state.ownership === "plugin" && state.nodes.length === 0 || state.dataRef !== this._data;
      if (shouldRender) {
        const previousState = state;
        try {
          const node = entry.renderer(this._slotRegistry.context, this._data);
          ensureValidNode(node, entry.id, this);
          state = {
            nodes: [node],
            ownership: entry.ownership,
            managedSlot: entry.managedSlot ?? state?.managedSlot,
            dataRef: this._data
          };
        } catch (error) {
          const failure = this._slotRegistry.reportPluginError({
            pluginId: entry.id,
            slot: String(this._slotName),
            phase: "render",
            source: "core",
            error
          });
          state = {
            nodes: this._resolvePluginFailurePlaceholder(failure),
            ownership: "host",
            managedSlot: entry.managedSlot ?? state?.managedSlot,
            dataRef: this._data
          };
        }
        if (previousState) {
          this._cleanupReplacedPluginNodes(previousState, state.nodes);
        }
        this._pluginNodes.set(entry.id, state);
      }
      if (!this._activePluginIds.has(entry.id)) {
        const activeState = this._pluginNodes.get(entry.id);
        if (activeState) {
          this._callManagedHook(entry.id, activeState.managedSlot, "onActivate", "setup");
        }
      }
    }
    const desiredNodes = [];
    if (this._mode === "append" || activeEntries.length === 0) {
      desiredNodes.push(...this._ensureFallbackNodes());
    }
    for (const entry of activeEntries) {
      const state = this._pluginNodes.get(entry.id);
      if (state) {
        desiredNodes.push(...state.nodes);
      }
    }
    if (this._mode !== "append" && desiredNodes.length === 0) {
      desiredNodes.push(...this._ensureFallbackNodes());
    }
    this._reconcileMountedNodes(desiredNodes);
    this._activePluginIds = nextActivePluginIds;
  }
  destroySelf() {
    this._cleanupAll();
  }
  _cleanupAll() {
    if (this._disposed) {
      return;
    }
    this._disposed = true;
    this._unsubscribe?.();
    this._unsubscribe = null;
    for (const [pluginId, state] of this._pluginNodes) {
      if (this._activePluginIds.has(pluginId)) {
        this._callManagedHook(pluginId, state.managedSlot, "onDeactivate", "dispose");
      }
      this._callManagedHook(pluginId, state.managedSlot, "onDispose", "dispose");
      for (const node of state.nodes) {
        this._detachNodeFromMount(node);
      }
      if (state.ownership === "host") {
        for (const node of state.nodes) {
          node.destroyRecursively();
        }
      }
    }
    this._pluginNodes.clear();
    this._activePluginIds = new Set;
    if (this._fallbackNodes) {
      for (const node of this._fallbackNodes) {
        node.destroyRecursively();
      }
      this._fallbackNodes = null;
    }
    this._mountedNodes = [];
  }
  _ensureFallbackNodes() {
    if (this._fallbackNodes !== null) {
      return this._fallbackNodes;
    }
    const source = typeof this._fallbackOption === "function" ? this._fallbackOption() : this._fallbackOption;
    const nodes = asArray(source);
    for (const node of nodes) {
      ensureValidNode(node, "fallback", this);
    }
    this._fallbackNodes = nodes;
    return this._fallbackNodes;
  }
  _callManagedHook(pluginId, managedSlot, hook, phase) {
    const callback = managedSlot?.[hook];
    if (!callback) {
      return;
    }
    try {
      callback(this._slotRegistry.context);
    } catch (error) {
      this._slotRegistry.reportPluginError({
        pluginId,
        slot: String(this._slotName),
        phase,
        source: "core",
        error
      });
    }
  }
  _detachNodeFromMount(node) {
    if (node.parent === this) {
      this.remove(node);
    }
  }
  _cleanupInactivePluginNodes(nextActivePluginIds, registeredPluginIds) {
    for (const [pluginId, state] of this._pluginNodes) {
      if (nextActivePluginIds.has(pluginId)) {
        continue;
      }
      if (this._activePluginIds.has(pluginId)) {
        this._callManagedHook(pluginId, state.managedSlot, "onDeactivate", "dispose");
      }
      for (const node of state.nodes) {
        this._detachNodeFromMount(node);
      }
      if (!registeredPluginIds.has(pluginId)) {
        this._callManagedHook(pluginId, state.managedSlot, "onDispose", "dispose");
        if (state.ownership === "host") {
          for (const node of state.nodes) {
            node.destroyRecursively();
          }
        }
        this._pluginNodes.delete(pluginId);
        continue;
      }
      if (state.ownership === "host") {
        for (const node of state.nodes) {
          node.destroyRecursively();
        }
        this._pluginNodes.delete(pluginId);
        continue;
      }
      state.nodes = [];
    }
  }
  _cleanupReplacedPluginNodes(previousState, nextNodes) {
    const retainedNodes = new Set(nextNodes);
    for (const node of previousState.nodes) {
      if (retainedNodes.has(node)) {
        continue;
      }
      this._detachNodeFromMount(node);
      if (previousState.ownership === "host") {
        node.destroyRecursively();
      }
    }
  }
  _resolvePluginFailurePlaceholder(failure) {
    if (!this._pluginFailurePlaceholder) {
      return [];
    }
    try {
      const placeholderSource = this._pluginFailurePlaceholder(failure, this._slotRegistry.context);
      const placeholderNodes = asArray(placeholderSource);
      for (const node of placeholderNodes) {
        ensureValidNode(node, `${failure.pluginId}:error-placeholder`, this);
      }
      return placeholderNodes;
    } catch (placeholderError) {
      this._slotRegistry.reportPluginError({
        pluginId: failure.pluginId,
        slot: String(this._slotName),
        phase: "error_placeholder",
        source: "core",
        error: placeholderError
      });
      return [];
    }
  }
  _reconcileMountedNodes(desiredNodes) {
    const desiredNodeSet = new Set(desiredNodes);
    for (const node of this._mountedNodes) {
      if (!desiredNodeSet.has(node)) {
        if (node.parent === this) {
          this.remove(node);
        }
      }
    }
    const mountTarget = this;
    for (let index = 0;index < desiredNodes.length; index++) {
      const node = desiredNodes[index];
      if (node.parent !== this) {
        mountTarget.add(node, index);
        continue;
      }
      const childAtIndex = this.getChildren()[index];
      if (childAtIndex !== node) {
        mountTarget.add(node, index);
      }
    }
    this._mountedNodes = [...desiredNodes];
  }
}
// src/NativeSpanFeed.ts
function toNumber(value) {
  return typeof value === "bigint" ? Number(value) : value;
}
var canThrowAcrossNativeCallback = typeof process !== "undefined" && typeof process.versions === "object" && process.versions !== null && typeof process.versions.bun === "string";

class NativeSpanFeed {
  static create(options) {
    const lib = resolveRenderLib2();
    const streamPtr = lib.createNativeSpanFeed(options);
    try {
      const stream = new NativeSpanFeed(streamPtr);
      lib.registerNativeSpanFeedStream(streamPtr, stream.eventHandler);
      const status = lib.attachNativeSpanFeed(streamPtr);
      if (status !== 0)
        throw new Error(`Failed to attach stream: ${status}`);
      return stream;
    } catch (error) {
      lib.unregisterNativeSpanFeedStream(streamPtr);
      lib.destroyNativeSpanFeed(streamPtr);
      throw error;
    }
  }
  static attach(streamPtr, _options) {
    const lib = resolveRenderLib2();
    const stream = new NativeSpanFeed(streamPtr);
    try {
      lib.registerNativeSpanFeedStream(streamPtr, stream.eventHandler);
      const status = lib.attachNativeSpanFeed(streamPtr);
      if (status !== 0)
        throw new Error(`Failed to attach stream: ${status}`);
      return stream;
    } catch (error) {
      lib.unregisterNativeSpanFeedStream(streamPtr);
      throw error;
    }
  }
  streamPtr;
  lib = resolveRenderLib2();
  eventHandler;
  chunkMap = new Map;
  dataHandlers = new Set;
  errorHandlers = new Set;
  drainBuffer = null;
  closed = false;
  destroyed = false;
  draining = false;
  pendingDataAvailable = false;
  pendingClose = false;
  closing = false;
  pendingAsyncHandlers = 0;
  inCallback = false;
  closeQueued = false;
  idleResolvers = [];
  pendingHandlerError = null;
  pendingHandlerErrorQueued = false;
  constructor(streamPtr) {
    this.streamPtr = streamPtr;
    this.eventHandler = (eventId, arg0, arg1) => {
      this.handleEvent(eventId, arg0, arg1);
    };
    this.ensureDrainBuffer();
  }
  ensureDrainBuffer() {
    if (this.drainBuffer)
      return;
    const capacity = 256;
    this.drainBuffer = new Uint8Array(capacity * SpanInfoStruct.size);
  }
  onData(handler) {
    this.dataHandlers.add(handler);
    if (this.pendingDataAvailable) {
      this.pendingDataAvailable = false;
      this.drainAll();
    }
    return () => this.dataHandlers.delete(handler);
  }
  onError(handler) {
    this.errorHandlers.add(handler);
    return () => this.errorHandlers.delete(handler);
  }
  hasPinnedChunks() {
    return !this.destroyed && (this.lib.streamGetStats(this.streamPtr)?.outstandingSpans ?? 0) > 0;
  }
  isBackpressured() {
    return this.pendingAsyncHandlers > 0 || this.pendingDataAvailable || this.hasPinnedChunks();
  }
  close() {
    if (this.destroyed)
      return;
    if (this.inCallback || this.draining || this.pendingAsyncHandlers > 0) {
      this.pendingClose = true;
      if (!this.closeQueued) {
        this.closeQueued = true;
        queueMicrotask(() => {
          this.closeQueued = false;
          this.processPendingClose();
        });
      }
      return;
    }
    this.performClose();
  }
  processPendingClose() {
    if (!this.pendingClose || this.destroyed)
      return;
    if (this.inCallback || this.draining || this.pendingAsyncHandlers > 0)
      return;
    this.pendingClose = false;
    this.performClose();
    this.resolveIdleIfNeeded();
  }
  performClose() {
    if (this.closing)
      return;
    this.closing = true;
    if (!this.closed) {
      const status = this.lib.streamClose(this.streamPtr);
      if (status !== 0) {
        this.closing = false;
        return;
      }
      this.closed = true;
    }
    this.finalizeDestroy();
  }
  finalizeDestroy() {
    if (this.destroyed)
      return;
    if (this.lib.destroyNativeSpanFeed(this.streamPtr) !== 0) {
      this.closing = false;
      return;
    }
    this.destroyed = true;
    this.chunkMap.clear();
    this.drainBuffer = null;
    this.dataHandlers.clear();
    this.errorHandlers.clear();
    this.pendingDataAvailable = false;
    this.resolveIdleIfNeeded();
  }
  isIdle() {
    return !this.inCallback && !this.draining && this.pendingAsyncHandlers === 0 && !this.pendingDataAvailable && !this.hasPinnedChunks();
  }
  resolveIdleIfNeeded() {
    if (this.idleResolvers.length === 0 || !this.isIdle())
      return;
    const resolvers = this.idleResolvers.splice(0);
    for (const resolve of resolvers) {
      resolve();
    }
  }
  idle() {
    if (this.isIdle())
      return Promise.resolve();
    return new Promise((resolve) => {
      this.idleResolvers.push(resolve);
    });
  }
  handleEvent(eventId, arg0, arg1) {
    const wasInCallback = this.inCallback;
    this.inCallback = true;
    try {
      switch (eventId) {
        case 7 /* DataAvailable */: {
          if (this.closing)
            break;
          if (this.dataHandlers.size === 0) {
            this.pendingDataAvailable = true;
            break;
          }
          this.drainAll();
          break;
        }
        case 2 /* ChunkAdded */: {
          const chunkLen = toNumber(arg1);
          if (chunkLen > 0 && arg0) {
            if (!this.chunkMap.has(arg0)) {
              const buffer = toArrayBuffer(arg0, 0, chunkLen);
              this.chunkMap.set(arg0, buffer);
            }
          }
          break;
        }
        case 6 /* Error */: {
          const code = toNumber(arg0);
          for (const handler of this.errorHandlers)
            handler(code);
          break;
        }
        case 5 /* Closed */: {
          this.closed = true;
          break;
        }
        default:
          break;
      }
    } finally {
      this.inCallback = wasInCallback;
      this.resolveIdleIfNeeded();
    }
  }
  queuePendingHandlerError(error) {
    this.pendingHandlerError ??= { value: error };
    if (this.pendingHandlerErrorQueued)
      return;
    this.pendingHandlerErrorQueued = true;
    queueMicrotask(() => {
      this.pendingHandlerErrorQueued = false;
      this.throwPendingHandlerError();
    });
  }
  throwPendingHandlerError() {
    if (this.pendingHandlerError === null)
      return;
    const pendingError = this.pendingHandlerError;
    this.pendingHandlerError = null;
    throw pendingError.value;
  }
  drainOnce() {
    if (!this.drainBuffer || this.draining || this.pendingClose)
      return 0;
    const capacity = Math.floor(this.drainBuffer.byteLength / SpanInfoStruct.size);
    if (capacity === 0)
      return 0;
    const count = this.lib.streamDrainSpans(this.streamPtr, this.drainBuffer, capacity);
    if (count === 0)
      return 0;
    this.draining = true;
    const spans = SpanInfoStruct.unpackList(this.drainBuffer.buffer, count);
    let firstError = null;
    try {
      for (const span of spans) {
        let asyncResults = null;
        try {
          if (this.pendingClose || span.len === 0)
            continue;
          const buffer = this.chunkMap.get(span.chunkPtr);
          if (!buffer || span.offset + span.len > buffer.byteLength)
            continue;
          const slice = new Uint8Array(buffer, span.offset, span.len);
          for (const handler of this.dataHandlers) {
            try {
              const result = handler(slice);
              if (result && typeof result.then === "function") {
                asyncResults ??= [];
                asyncResults.push(result);
              }
            } catch (e) {
              firstError ??= { value: e };
            }
          }
        } finally {
          if (asyncResults) {
            this.pendingAsyncHandlers += 1;
            Promise.allSettled(asyncResults).then(() => {
              this.lib.streamReleaseSpan(this.streamPtr, span.slotIndex, span.releaseId);
              this.pendingAsyncHandlers -= 1;
              this.processPendingClose();
              this.resolveIdleIfNeeded();
            });
          } else {
            this.lib.streamReleaseSpan(this.streamPtr, span.slotIndex, span.releaseId);
          }
        }
      }
    } finally {
      this.draining = false;
      this.resolveIdleIfNeeded();
    }
    if (firstError) {
      if (!this.inCallback || canThrowAcrossNativeCallback) {
        throw firstError.value;
      }
      this.queuePendingHandlerError(firstError.value);
    }
    return count;
  }
  drainAll() {
    let count = this.drainOnce();
    while (count > 0) {
      count = this.drainOnce();
    }
    if (!this.inCallback) {
      this.throwPendingHandlerError();
    }
  }
}
// src/audio.ts
import { EventEmitter } from "events";
import { randomBytes } from "crypto";
import { open as openFile, readFile, rename, unlink } from "fs/promises";
import { basename, dirname, join } from "path";

// src/audio-stream/icy/metadata.ts
function parseIcyMetadata(bytes, decoder) {
  const decoded = decoder.decode(bytes);
  const nul = decoded.indexOf("\x00");
  const text = nul === -1 ? decoded : decoded.slice(0, nul);
  if (text.length === 0)
    return null;
  const fields = Object.create(null);
  let found = false;
  let offset = 0;
  while (offset < text.length) {
    const separator = text.indexOf("='", offset);
    if (separator === -1)
      break;
    const key = text.slice(offset, separator);
    if (key.length === 0 || /[';=]/.test(key))
      break;
    const end = text.indexOf("';", separator + 2);
    if (end === -1)
      break;
    Object.defineProperty(fields, key, {
      configurable: true,
      enumerable: true,
      writable: true,
      value: text.slice(separator + 2, end)
    });
    found = true;
    offset = end + 2;
  }
  return found ? Object.freeze(fields) : null;
}

// src/audio-stream/icy/demuxer.ts
var EMPTY_FIELDS = Object.freeze(Object.create(null));
function copyHeaders(headers) {
  const copy = Object.create(null);
  for (const [name, value] of Object.entries(headers ?? {}))
    copy[name.toLowerCase()] = value;
  return Object.freeze(copy);
}
function fieldsEqual(left, right) {
  const keys = Object.keys(left);
  return keys.length === Object.keys(right).length && keys.every((key) => Object.prototype.hasOwnProperty.call(right, key) && left[key] === right[key]);
}

class IcyStreamDemuxer {
  initialMetadata;
  audioRemaining;
  metadata = null;
  metadataOffset = 0;
  fields = EMPTY_FIELDS;
  interval;
  decoder;
  headers;
  constructor(options) {
    if (!Number.isSafeInteger(options.metadataInterval) || options.metadataInterval < 0) {
      throw new TypeError("metadataInterval must be a non-negative safe integer");
    }
    this.interval = options.metadataInterval;
    try {
      this.decoder = new TextDecoder(options.metadataEncoding ?? "iso-8859-1");
    } catch {
      throw new TypeError(`Unsupported metadataEncoding: ${options.metadataEncoding}`);
    }
    this.headers = copyHeaders(options.headers);
    this.audioRemaining = this.interval;
    this.initialMetadata = Object.freeze({ format: "icy", headers: this.headers, fields: this.fields });
  }
  *push(chunk) {
    if (this.interval === 0) {
      if (chunk.byteLength > 0)
        yield { type: "audio", data: chunk };
      return;
    }
    let offset = 0;
    while (offset < chunk.byteLength) {
      if (this.audioRemaining > 0) {
        const length = Math.min(this.audioRemaining, chunk.byteLength - offset);
        yield { type: "audio", data: chunk.subarray(offset, offset + length) };
        offset += length;
        this.audioRemaining -= length;
        continue;
      }
      if (this.metadata == null) {
        const metadataLength = (chunk[offset] ?? 0) * 16;
        offset += 1;
        if (metadataLength === 0) {
          this.audioRemaining = this.interval;
          continue;
        }
        this.metadata = new Uint8Array(metadataLength);
        this.metadataOffset = 0;
      }
      const metadata = this.metadata;
      const length = Math.min(metadata.byteLength - this.metadataOffset, chunk.byteLength - offset);
      metadata.set(chunk.subarray(offset, offset + length), this.metadataOffset);
      offset += length;
      this.metadataOffset += length;
      if (this.metadataOffset !== metadata.byteLength)
        continue;
      const fields = parseIcyMetadata(metadata, this.decoder);
      this.metadata = null;
      this.metadataOffset = 0;
      this.audioRemaining = this.interval;
      if (fields != null && !fieldsEqual(this.fields, fields)) {
        this.fields = fields;
        yield {
          type: "metadata",
          metadata: Object.freeze({ format: "icy", headers: this.headers, fields })
        };
      }
    }
  }
  *flush() {
    if (this.interval === 0)
      return;
    if (this.audioRemaining === 0 || this.metadata != null) {
      throw new Error("ICY stream ended inside a metadata block");
    }
  }
}
function createIcyStreamDemuxer(options) {
  return new IcyStreamDemuxer(options);
}

// src/audio-stream/demuxer.ts
function selectAudioStreamDemuxer(options) {
  const icyHeaders = Object.create(null);
  options.headers.forEach((value, name) => {
    if (name.toLowerCase().startsWith("icy-"))
      icyHeaders[name.toLowerCase()] = value;
  });
  const headers = Object.freeze(icyHeaders);
  const rawInterval = options.headers.get("icy-metaint");
  if (rawInterval == null) {
    return Object.keys(headers).length === 0 ? null : createIcyStreamDemuxer({ metadataInterval: 0, metadataEncoding: options.metadataEncoding, headers });
  }
  const value = rawInterval.trim();
  if (!/^\d+$/.test(value))
    throw new Error(`Invalid icy-metaint response header: ${rawInterval}`);
  const interval = Number(value);
  if (!Number.isSafeInteger(interval))
    throw new Error(`Invalid icy-metaint response header: ${rawInterval}`);
  return createIcyStreamDemuxer({ metadataInterval: interval, metadataEncoding: options.metadataEncoding, headers });
}

// src/audio.ts
class AudioInitializationError extends Error {
  action;
  status;
  constructor(action, message, status, cause) {
    super(message);
    this.name = "AudioInitializationError";
    this.action = action;
    this.status = status;
    if (cause !== undefined)
      this.cause = cause;
  }
}

class AudioCaptureStreamError extends Error {
  context;
  constructor(message, context, cause) {
    super(message);
    this.name = "AudioCaptureStreamError";
    this.context = context;
    if (cause !== undefined)
      this.cause = cause;
  }
}

class AudioRecorderError extends Error {
  context;
  constructor(message, context, cause) {
    super(message);
    this.name = "AudioRecorderError";
    this.context = context;
    if (cause !== undefined)
      this.cause = cause;
  }
}
function statusToError(action, status) {
  return new Error(`Audio ${action} failed: ${status}`);
}
function toBytes(data) {
  return data instanceof Uint8Array ? data : new Uint8Array(data);
}
var DEFAULT_AUDIO_SAMPLE_RATE = 48000;
var DEFAULT_STREAM_PROBE_BYTES = 1024 * 1024;
var STREAM_POLL_INTERVAL_MS = 5;
var MAX_TIMER_DELAY_MS = 2147483647;
var MAX_U32 = 4294967295;
var DEFAULT_CAPTURE_CHUNK_FRAMES = 2048;
var CAPTURE_DISCARD_BATCH_CHUNKS = 32;
var WAV_HEADER_BYTES = 44;
var MAX_WAV_DATA_BYTES = BigInt(MAX_U32 - 36);
var INVALID_STREAM_CHUNK_MESSAGE = "Audio stream chunks must be Uint8Array instances";

class AudioStreamError extends Error {
  context;
  constructor(message, context, cause) {
    super(message);
    this.name = "AudioStreamError";
    this.context = context;
    if (cause !== undefined)
      this.cause = cause;
  }
}

class ClassifiedAudioStreamError extends AudioStreamError {
  retryable;
  retryAfterMs;
  constructor(message, context, retryable, retryAfterMs, cause) {
    super(message, context, cause);
    this.retryable = retryable;
    this.retryAfterMs = retryAfterMs;
  }
}
function createAbortError() {
  return new DOMException("The operation was aborted", "AbortError");
}
var isU32 = (value) => Number.isInteger(value) && value >= 0 && value <= MAX_U32;
function resolvePositiveU32(value, fallback, name) {
  const resolved = value ?? fallback;
  if (!Number.isFinite(resolved) || !Number.isInteger(resolved) || resolved <= 0) {
    throw new TypeError(`${name} must be a finite positive integer`);
  }
  if (resolved > MAX_U32)
    throw new RangeError(`${name} exceeds the supported limit`);
  return resolved;
}
function resolveAudioCaptureStreamOptions(options, sampleRate) {
  const channels = resolvePositiveU32(options.channels, 1, "channels");
  const capacityFrames = resolvePositiveU32(options.capacityFrames, sampleRate, "capacityFrames");
  const chunkFrames = resolvePositiveU32(options.chunkFrames, DEFAULT_CAPTURE_CHUNK_FRAMES, "chunkFrames");
  if (chunkFrames > capacityFrames)
    throw new RangeError("chunkFrames must not exceed capacityFrames");
  if (chunkFrames > Math.floor(MAX_U32 / channels)) {
    throw new RangeError("chunkFrames * channels exceeds the supported limit");
  }
  return {
    sampleRate,
    channels,
    capacityFrames,
    chunkFrames,
    startOptions: options.startOptions,
    signal: options.signal
  };
}
function resolveU32Index(value, name) {
  if (!Number.isFinite(value) || !Number.isInteger(value) || value < 0) {
    throw new TypeError(`${name} must be a finite non-negative integer`);
  }
  if (value > MAX_U32)
    throw new RangeError(`${name} exceeds the supported limit`);
  return value;
}
function resolveReconnectOptions(options) {
  const maxRetries = options.maxRetries ?? Number.POSITIVE_INFINITY;
  const initialDelayMs = options.initialDelayMs ?? 1000;
  const maxDelayMs = options.maxDelayMs ?? 15000;
  const backoffFactor = options.backoffFactor ?? 2;
  const retryOnEnd = options.retryOnEnd ?? false;
  const retry = options.retry;
  if (maxRetries !== Number.POSITIVE_INFINITY && (!Number.isInteger(maxRetries) || maxRetries < 0)) {
    throw new TypeError("reconnect.maxRetries must be a non-negative integer or Infinity");
  }
  if (!Number.isFinite(initialDelayMs) || !Number.isInteger(initialDelayMs) || initialDelayMs < 0) {
    throw new TypeError("reconnect.initialDelayMs must be a finite non-negative integer");
  }
  if (!Number.isFinite(maxDelayMs) || !Number.isInteger(maxDelayMs) || maxDelayMs < 0) {
    throw new TypeError("reconnect.maxDelayMs must be a finite non-negative integer");
  }
  if (!Number.isFinite(backoffFactor) || backoffFactor < 1) {
    throw new TypeError("reconnect.backoffFactor must be a finite number greater than or equal to 1");
  }
  if (typeof retryOnEnd !== "boolean") {
    throw new TypeError("reconnect.retryOnEnd must be a boolean");
  }
  if (retry !== undefined && typeof retry !== "function") {
    throw new TypeError("reconnect.retry must be a function");
  }
  return {
    maxRetries,
    initialDelayMs,
    maxDelayMs,
    backoffFactor,
    retryOnEnd,
    retry: retry == null ? undefined : (error, context) => retry.call(options, error, context)
  };
}
function resolveAudioStreamOptions(options) {
  const format = resolveAudioStreamFormat(options.format);
  const sampleRate = options.sampleRate;
  const channels = options.channels;
  if (format === "pcm") {
    if (options.sampleFormat !== "f32le")
      throw new TypeError("PCM sampleFormat must be 'f32le'");
    if (typeof sampleRate !== "number" || !Number.isInteger(sampleRate) || sampleRate < 8000 || sampleRate > 192000) {
      throw new RangeError("PCM sampleRate must be an integer from 8000 to 192000 Hz");
    }
    if (channels !== 1 && channels !== 2)
      throw new RangeError("PCM channels must be 1 or 2");
    if (options.reconnect !== undefined)
      throw new TypeError("PCM reconnect is not supported");
  } else if (sampleRate !== undefined || channels !== undefined || options.sampleFormat !== undefined) {
    throw new TypeError("sampleFormat, sampleRate, and channels are only supported for PCM streams");
  }
  const capacityMs = resolvePositiveU32(options.buffer?.capacityMs, 2000, "buffer.capacityMs");
  const startupMs = resolvePositiveU32(options.buffer?.startupMs, 1000, "buffer.startupMs");
  const resumeMs = resolvePositiveU32(options.buffer?.resumeMs, 1000, "buffer.resumeMs");
  const maxProbeBytes = resolvePositiveU32(options.maxProbeBytes, DEFAULT_STREAM_PROBE_BYTES, "maxProbeBytes");
  if (startupMs > capacityMs)
    throw new RangeError("buffer.startupMs must not exceed buffer.capacityMs");
  if (resumeMs > capacityMs)
    throw new RangeError("buffer.resumeMs must not exceed buffer.capacityMs");
  return {
    format,
    native: {
      format: toNativeAudioStreamFormat(format),
      sampleRate,
      channels,
      capacityMs,
      startupMs,
      resumeMs,
      volume: options.volume ?? 1,
      pan: options.pan ?? 0,
      groupId: options.groupId ?? 0,
      maxProbeBytes
    },
    signal: options.signal,
    reconnect: options.reconnect === undefined ? undefined : resolveReconnectOptions(options.reconnect)
  };
}
function resolveAudioStreamConnector(connector) {
  const connect = connector?.connect;
  if (typeof connect !== "function")
    throw new TypeError("Audio stream connector must define connect()");
  return { connect: (context) => connect.call(connector, context) };
}
function runBoundedCleanup(cleanup, timeoutMs = 50) {
  let result;
  try {
    result = Promise.resolve(cleanup()).catch(() => {
      return;
    });
  } catch {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    const timer = setTimeout(resolve, timeoutMs);
    result.then(() => {
      clearTimeout(timer);
      resolve();
    });
  });
}
function waitForDelay(delayMs, signal) {
  if (signal.aborted)
    return Promise.reject(createAbortError());
  return new Promise((resolve, reject) => {
    let remainingMs = delayMs;
    let timer;
    const schedule = () => {
      const currentDelayMs = Math.min(remainingMs, MAX_TIMER_DELAY_MS);
      timer = setTimeout(() => {
        remainingMs -= currentDelayMs;
        if (remainingMs > 0)
          schedule();
        else {
          signal.removeEventListener("abort", onAbort);
          resolve();
        }
      }, currentDelayMs);
    };
    const onAbort = () => {
      clearTimeout(timer);
      reject(createAbortError());
    };
    signal.addEventListener("abort", onAbort, { once: true });
    schedule();
  });
}
function waitForPoll(signal) {
  return waitForDelay(STREAM_POLL_INTERVAL_MS, signal).then(() => true).catch(() => false);
}
function parseRetryAfter(value, maxDelayMs) {
  if (value == null)
    return;
  const seconds = Number(value.trim());
  if (Number.isFinite(seconds) && seconds >= 0)
    return Math.min(maxDelayMs, Math.ceil(seconds * 1000));
  const date = Date.parse(value);
  if (!Number.isFinite(date))
    return;
  return Math.min(maxDelayMs, Math.max(0, date - Date.now()));
}
function resolveAudioStreamFormat(value) {
  const format = value ?? "mp3";
  if (format !== "mp3" && format !== "flac" && format !== "pcm")
    throw new TypeError(`Unsupported audio stream format: ${format}`);
  return format;
}
function toNativeAudioStreamFormat(format) {
  switch (format) {
    case "mp3":
      return NativeAudioStreamFormat2.Mp3;
    case "flac":
      return NativeAudioStreamFormat2.Flac;
    case "pcm":
      return NativeAudioStreamFormat2.Pcm;
  }
}
function resolveContentTypePolicy(value, receiver) {
  const policy = value ?? "validate";
  if (policy !== "validate" && policy !== "ignore" && typeof policy !== "function") {
    throw new TypeError("contentTypePolicy must be 'validate', 'ignore', or a function");
  }
  return typeof policy === "function" ? (context) => policy.call(receiver, context) : policy;
}
function isAllowedContentType(format, value) {
  const contentType = value.split(";", 1)[0]?.trim().toLowerCase();
  switch (format) {
    case "mp3":
      return ["audio/mpeg", "audio/mp3", "application/octet-stream", "application/mp3"].includes(contentType ?? "");
    case "flac":
      return ["audio/flac", "audio/x-flac", "application/octet-stream"].includes(contentType ?? "");
    case "pcm":
      return ["audio/pcm", "application/octet-stream"].includes(contentType ?? "");
  }
}
function createAudioStreamUrlConnector(source, request, format, contentTypePolicy) {
  return {
    async connect({ signal, attempt }) {
      let response;
      try {
        const headers = new Headers(request?.headers);
        if (!headers.has("icy-metadata"))
          headers.set("Icy-MetaData", "1");
        response = await globalThis.fetch(source, { ...request, headers, signal });
      } catch (cause) {
        throw new ClassifiedAudioStreamError("Audio stream fetch failed", { action: "fetch", attempt }, true, undefined, cause);
      }
      if (!response.ok) {
        const retryAfterMs = parseRetryAfter(response.headers.get("retry-after"), Number.POSITIVE_INFINITY);
        await runBoundedCleanup(() => response.body?.cancel());
        const retryable = [408, 425, 429].includes(response.status) || response.status >= 500 && response.status <= 599;
        throw new ClassifiedAudioStreamError(`Audio stream request failed with HTTP ${response.status}`, { action: "response", status: response.status, attempt }, retryable, retryAfterMs);
      }
      const contentType = response.headers.get("content-type");
      let contentTypeAccepted = contentType == null || contentTypePolicy === "ignore";
      if (!contentTypeAccepted && contentTypePolicy === "validate") {
        contentTypeAccepted = isAllowedContentType(format, contentType);
      } else if (typeof contentTypePolicy === "function") {
        try {
          const result = contentTypePolicy(Object.freeze({
            format,
            contentType,
            status: response.status,
            url: response.url || String(source)
          }));
          if (typeof result !== "boolean")
            throw new TypeError("contentTypePolicy must return a boolean");
          contentTypeAccepted = result;
        } catch (cause) {
          await runBoundedCleanup(() => response.body?.cancel());
          throw new ClassifiedAudioStreamError(cause instanceof Error ? cause.message : "Audio stream content type policy failed", { action: "response", status: response.status, attempt }, false, undefined, cause);
        }
      }
      if (!contentTypeAccepted) {
        await runBoundedCleanup(() => response.body?.cancel());
        throw new ClassifiedAudioStreamError(`Unsupported audio stream Content-Type: ${contentType}`, { action: "response", status: response.status, attempt }, false);
      }
      if (response.body == null) {
        throw new ClassifiedAudioStreamError("Audio stream response has no body", { action: "response", status: response.status, attempt }, true);
      }
      return {
        body: response.body,
        info: { headers: response.headers, status: response.status }
      };
    }
  };
}
function resolveMetadataEncoding(value) {
  try {
    return new TextDecoder(value ?? "iso-8859-1").encoding;
  } catch {
    throw new TypeError(`Unsupported metadataEncoding: ${value}`);
  }
}
function resolveAudioStreamRequest(request) {
  if (request === undefined)
    return;
  const { body: _body, signal: _signal, ...safeRequest } = request;
  return safeRequest;
}
function isReadableStreamSource(source) {
  try {
    return typeof source?.getReader === "function";
  } catch {
    return false;
  }
}
function isAsyncIterableSource(source) {
  try {
    return typeof source?.[Symbol.asyncIterator] === "function";
  } catch {
    return false;
  }
}
function isUint8Array(value) {
  return ArrayBuffer.isView(value) && Object.prototype.toString.call(value) === "[object Uint8Array]";
}
var createAudioStream;
var openAudioStream;

class AudioStream extends EventEmitter {
  closed;
  format;
  lib;
  engine;
  connector;
  demuxerFactory;
  readAction;
  options;
  removeFromOwner;
  lifecycleController = new AbortController;
  nativeStreamId = null;
  nativeStats = null;
  readyGeneration = 0;
  activeAttempt = null;
  pendingCleanup = null;
  reconnectAttempts = 0;
  consecutiveReconnectAttempts = 0;
  disposed = false;
  exposed = false;
  terminalError = null;
  metadata = null;
  pendingMetadataEvent = false;
  metadataEventScheduled = false;
  terminalEventScheduled = false;
  setupResolve;
  setupReject;
  closedResolve;
  setupPromise;
  overallAbortListener = () => this.dispose();
  static {
    createAudioStream = (init) => new AudioStream(init);
    openAudioStream = (stream) => stream.open();
  }
  constructor(init) {
    super();
    this.lib = init.lib;
    this.engine = init.engine;
    this.connector = init.connector;
    this.demuxerFactory = init.demuxer;
    this.readAction = init.readAction;
    this.options = resolveAudioStreamOptions(init.options);
    this.format = this.options.format;
    this.removeFromOwner = init.removeFromOwner;
    this.setupPromise = new Promise((resolve, reject) => (this.setupResolve = resolve, this.setupReject = reject));
    this.closed = new Promise((resolve) => this.closedResolve = resolve);
    this.options.signal?.addEventListener("abort", this.overallAbortListener, { once: true });
  }
  get state() {
    if (this.disposed)
      return "disposed";
    if (this.terminalError != null)
      return "errored";
    return this.nativeStats == null ? "initializing" : NativeAudioStreamStateNames[this.nativeStats.state] ?? "errored";
  }
  async open() {
    if (this.options.signal?.aborted)
      this.dispose();
    else
      this.runLifecycle();
    await this.setupPromise;
    if (this.lifecycleController.signal.aborted && this.state !== "ended")
      throw this.terminalError ?? createAbortError();
    this.exposed = true;
    if (this.pendingMetadataEvent && this.metadata != null)
      this.emitMetadata();
    this.pendingMetadataEvent = false;
    if (this.state === "ended")
      this.emitTerminal("ended");
  }
  getStats() {
    const stats = this.readNativeStats();
    if (!this.lifecycleController.signal.aborted && this.nativeStreamId != null) {
      const error = this.snapshotError(stats);
      const ended = stats?.state === NativeAudioStreamState2.Ended && !this.options.reconnect?.retryOnEnd;
      if (error != null || ended) {
        queueMicrotask(() => {
          if (this.lifecycleController.signal.aborted)
            return;
          const reason = error == null || error.context.action === "decoder" ? NativeAudioStreamCloseReason2.PreserveNativeTerminal : NativeAudioStreamCloseReason2.TransportError;
          this.finish(reason, error ?? undefined);
        });
      }
    }
    return this.toPublicStats();
  }
  getMetadata() {
    return this.metadata;
  }
  setVolume(volume) {
    return this.control("setVolume", (streamId) => this.lib.audioSetStreamVolume(this.engine, streamId, volume));
  }
  setPan(pan) {
    return this.control("setPan", (streamId) => this.lib.audioSetStreamPan(this.engine, streamId, pan));
  }
  setGroup(groupId) {
    if (!isU32(groupId)) {
      const context = { action: "setGroup" };
      if (this.exposed) {
        this.emitAsync("error", new AudioStreamError("Invalid audio stream group", context), context);
      }
      return false;
    }
    return this.control("setGroup", (streamId) => this.lib.audioSetStreamGroup(this.engine, streamId, groupId));
  }
  control(action, call) {
    const streamId = this.nativeStreamId;
    if (this.disposed || this.lifecycleController.signal.aborted || streamId == null)
      return false;
    const status = call(streamId);
    if (status !== 0) {
      const context = { action, status };
      if (this.exposed) {
        this.emitAsync("error", new AudioStreamError(`Audio stream ${action} failed: ${status}`, context), context);
      }
      return false;
    }
    return true;
  }
  dispose() {
    const wasExposed = this.exposed;
    if (!this.disposed) {
      this.disposed = true;
      this.lifecycleController.abort();
      this.setupReject(createAbortError());
    }
    const cleanup = this.stopSource();
    const closeStatus = this.closeNativeStream(NativeAudioStreamCloseReason2.Disposed);
    if (closeStatus !== 0) {
      throw new AudioStreamError(`Audio stream destroy failed: ${closeStatus}`, {
        action: "destroy",
        status: closeStatus
      });
    }
    this.removeOwner();
    cleanup.finally(() => {
      if (wasExposed && !this.terminalEventScheduled)
        this.emitTerminal("disposed");
      else if (!this.terminalEventScheduled)
        this.closedResolve();
    });
  }
  async runLifecycle() {
    while (!this.lifecycleController.signal.aborted) {
      const attempt = {
        controller: new AbortController,
        writeBatches: 0,
        body: null,
        closeConnection: null,
        reader: null,
        iterator: null,
        demuxer: null,
        demuxerFinished: false,
        sourceReleased: false,
        sourceAcquisitionAttempted: false,
        connectionClosed: false,
        demuxerAborted: false,
        resourceAcquisition: null,
        cleanupPromise: null
      };
      this.activeAttempt = attempt;
      let connection;
      try {
        let returnedConnection;
        const finishConnectionAcquisition = this.beginResourceAcquisition(attempt);
        try {
          returnedConnection = await this.connector.connect({
            signal: attempt.controller.signal,
            attempt: this.consecutiveReconnectAttempts
          });
        } finally {
          finishConnectionAcquisition();
        }
        connection = this.resolveConnection(returnedConnection, attempt);
      } catch (failure) {
        const active = this.isAttemptActive(attempt);
        await this.stopSource(attempt);
        if (!active)
          return;
        const context = {
          action: this.readAction,
          attempt: this.consecutiveReconnectAttempts
        };
        const error = failure instanceof AudioStreamError ? failure : new AudioStreamError(failure instanceof Error ? failure.message : "Audio stream connection failed", context, failure);
        if (await this.retry(error, attempt, "connect"))
          continue;
        return;
      }
      if (!this.isAttemptActive(attempt)) {
        await this.stopSource(attempt);
        return;
      }
      if (!isReadableStreamSource(connection.body) && !isAsyncIterableSource(connection.body)) {
        await this.stopSource(attempt);
        const context = { action: "source" };
        await this.finish(NativeAudioStreamCloseReason2.TransportError, new AudioStreamError("Audio stream connection body must be a ReadableStream or AsyncIterable", context));
        return;
      }
      if (!this.isAttemptActive(attempt)) {
        await this.stopSource(attempt);
        return;
      }
      let initialMetadata = null;
      let demuxerFailed = false;
      let demuxerFailure;
      const finishDemuxerAcquisition = this.beginResourceAcquisition(attempt);
      try {
        attempt.demuxer = this.demuxerFactory?.(connection.info) ?? null;
        initialMetadata = attempt.demuxer?.initialMetadata ?? null;
      } catch (cause) {
        demuxerFailed = true;
        demuxerFailure = cause;
      } finally {
        finishDemuxerAcquisition();
      }
      if (demuxerFailed) {
        await this.stopSource(attempt);
        const error = demuxerFailure instanceof AudioStreamError ? demuxerFailure : new AudioStreamError(demuxerFailure instanceof Error ? demuxerFailure.message : "Audio stream demuxer creation failed", { action: "demuxer" }, demuxerFailure);
        await this.finish(NativeAudioStreamCloseReason2.TransportError, error);
        return;
      }
      if (!this.isAttemptActive(attempt)) {
        await this.stopSource(attempt);
        return;
      }
      this.publishMetadata(initialMetadata, attempt);
      try {
        this.createNativeStream();
      } catch (cause) {
        await this.stopSource(attempt);
        const error = cause instanceof AudioStreamError ? cause : new AudioStreamError("Audio stream create failed", { action: "create" }, cause);
        await this.finish(NativeAudioStreamCloseReason2.TransportError, error);
        return;
      }
      try {
        if (!await this.consumeSource(connection, attempt))
          return;
      } catch (cause) {
        if (this.lifecycleController.signal.aborted)
          return;
        const error = cause instanceof AudioStreamError ? cause : cause instanceof TypeError && cause.message === INVALID_STREAM_CHUNK_MESSAGE ? cause : new AudioStreamError("Audio stream source failed", { action: "source" }, cause);
        if (error instanceof ClassifiedAudioStreamError) {
          if (await this.retry(error, attempt, "read"))
            continue;
          return;
        }
        const context = error instanceof AudioStreamError ? error.context : { action: "source" };
        await this.finish(NativeAudioStreamCloseReason2.TransportError, error, context);
        return;
      }
      if (!this.options.reconnect?.retryOnEnd) {
        await this.finish(NativeAudioStreamCloseReason2.PreserveNativeTerminal);
        return;
      }
      const error = new AudioStreamError("Audio stream source ended", { action: "source" });
      if (await this.retry(error, attempt, undefined, true))
        continue;
      return;
    }
  }
  createNativeStream() {
    if (this.nativeStreamId != null)
      return;
    const created = this.lib.audioCreateStream(this.engine, this.options.native);
    if (created.status !== 0 || created.streamId == null) {
      const context = { action: "create", status: created.status };
      throw new AudioStreamError(`Audio stream create failed: ${created.status}`, context);
    }
    this.nativeStreamId = created.streamId;
  }
  async consumeSource(connection, attempt) {
    const previousGeneration = this.readyGeneration;
    if (await this.pollNativeSnapshot(attempt) == null || !this.isAttemptActive(attempt))
      return false;
    const decoderReady = this.awaitReady(attempt, previousGeneration);
    try {
      await this.pumpSource(connection, attempt);
    } catch (cause) {
      this.observeReady(this.readNativeStats(), previousGeneration);
      await this.stopSource(attempt);
      await decoderReady;
      if (!this.lifecycleController.signal.aborted)
        throw cause;
      return false;
    }
    if (this.lifecycleController.signal.aborted)
      return false;
    const status = this.lib.audioEndStream(this.engine, this.nativeStreamId);
    if (status !== 0)
      throw this.nativeCallError("end", status);
    if (!await decoderReady || this.lifecycleController.signal.aborted)
      return false;
    if (!await this.awaitEnded(attempt))
      return false;
    await this.stopSource(attempt);
    return !this.lifecycleController.signal.aborted;
  }
  async pumpSource(connection, attempt) {
    const source = connection.body;
    if (!this.isAttemptActive(attempt)) {
      await this.runBoundedAttemptCleanup(attempt);
      return;
    }
    const release = () => {
      if (attempt.sourceReleased)
        return;
      if (attempt.reader == null) {
        attempt.sourceReleased = true;
        return;
      }
      try {
        attempt.reader.releaseLock();
        attempt.sourceReleased = true;
      } catch {}
    };
    const next = () => attempt.reader == null ? attempt.iterator.next() : attempt.reader.read();
    attempt.sourceAcquisitionAttempted = true;
    const finishSourceAcquisition = this.beginResourceAcquisition(attempt);
    try {
      attempt.reader = isReadableStreamSource(source) ? source.getReader() : null;
      attempt.iterator = attempt.reader == null ? source[Symbol.asyncIterator]() : null;
    } catch (cause) {
      const context = { action: this.readAction };
      throw new ClassifiedAudioStreamError("Audio stream source failed", context, true, undefined, cause);
    } finally {
      finishSourceAcquisition();
    }
    if (!this.isAttemptActive(attempt)) {
      await this.runBoundedAttemptCleanup(attempt);
      return;
    }
    while (this.isAttemptActive(attempt)) {
      let result;
      try {
        result = await next();
      } catch (cause) {
        const context = { action: this.readAction };
        throw new ClassifiedAudioStreamError("Audio stream source failed", context, true, undefined, cause);
      }
      if (!this.isAttemptActive(attempt))
        return;
      if (result.done) {
        release();
        if (attempt.demuxer != null) {
          try {
            await this.processDemuxOutput(attempt.demuxer.flush(), attempt);
          } catch (cause) {
            if (cause instanceof AudioStreamError)
              throw cause;
            const context = { action: this.readAction };
            throw new ClassifiedAudioStreamError(cause instanceof Error ? cause.message : "Audio stream demuxer flush failed", context, true, undefined, cause);
          }
        }
        attempt.demuxerFinished = true;
        await this.runBoundedAttemptCleanup(attempt);
        return;
      }
      const chunk = result.value;
      if (!isUint8Array(chunk))
        throw new TypeError(INVALID_STREAM_CHUNK_MESSAGE);
      if (chunk.byteLength === 0) {
        await waitForDelay(0, attempt.controller.signal);
        continue;
      }
      if (attempt.demuxer == null) {
        await this.writeStreamChunk(chunk, attempt);
        continue;
      }
      try {
        await this.processDemuxOutput(attempt.demuxer.push(chunk), attempt);
      } catch (cause) {
        if (cause instanceof AudioStreamError)
          throw cause;
        throw new AudioStreamError(cause instanceof Error ? cause.message : "Audio stream demuxer failed", { action: "demuxer" }, cause);
      }
    }
  }
  async processDemuxOutput(outputs, attempt) {
    for (const output of outputs) {
      if (!this.isAttemptActive(attempt))
        return;
      if (output.type === "audio") {
        if (!isUint8Array(output.data)) {
          throw new AudioStreamError("Audio stream demuxer audio output must be a Uint8Array", {
            action: "demuxer"
          });
        }
        await this.writeStreamChunk(output.data, attempt);
      } else if (output.type === "metadata") {
        this.publishMetadata(output.metadata, attempt);
      } else {
        throw new AudioStreamError("Audio stream demuxer returned an invalid output", { action: "demuxer" });
      }
    }
  }
  async writeStreamChunk(chunk, attempt) {
    if (Object.prototype.toString.call(chunk.buffer) === "[object SharedArrayBuffer]") {
      throw new AudioStreamError("Audio stream chunks must have non-shared backing memory", { action: "write" });
    }
    let offset = 0;
    while (offset < chunk.byteLength && this.isAttemptActive(attempt)) {
      const streamId = this.nativeStreamId;
      if (streamId == null)
        return;
      let accepted;
      try {
        accepted = this.lib.audioWriteStream(this.engine, streamId, chunk.subarray(offset));
      } catch (cause) {
        const context = { action: "write" };
        throw new AudioStreamError("Audio stream write failed", context, cause);
      }
      if (accepted < 0)
        throw this.nativeCallError("write", accepted);
      offset += accepted;
      if (accepted === 0 || ++attempt.writeBatches >= 32) {
        attempt.writeBatches = 0;
        if (await this.pollNativeSnapshot(attempt) == null)
          return;
        await waitForDelay(accepted === 0 ? STREAM_POLL_INTERVAL_MS : 0, attempt.controller.signal);
      }
    }
  }
  nativeCallError(action, status) {
    const nativeError = this.snapshotError(this.readNativeStats());
    if (nativeError?.context.action === "decoder")
      return nativeError;
    return new AudioStreamError(`Audio stream ${action} failed: ${status}`, { action, status });
  }
  resolveConnection(connection, attempt) {
    const finishAcquisition = this.beginResourceAcquisition(attempt);
    try {
      const close = connection.close;
      if (close !== undefined && typeof close !== "function") {
        throw new TypeError("Audio stream connection close must be a function");
      }
      attempt.closeConnection = close == null ? null : () => close.call(connection);
      const info = connection.info;
      const body = connection.body;
      attempt.body = body;
      return { body, info };
    } finally {
      finishAcquisition();
    }
  }
  beginResourceAcquisition(attempt) {
    let resolve;
    const acquisition = new Promise((done) => {
      resolve = done;
    });
    attempt.resourceAcquisition = acquisition;
    return () => {
      if (attempt.resourceAcquisition === acquisition)
        attempt.resourceAcquisition = null;
      resolve();
    };
  }
  cleanupAttempt(attempt) {
    if (attempt.cleanupPromise != null)
      return attempt.cleanupPromise;
    let resolveCleanup;
    let rejectCleanup;
    const cleanup = new Promise((resolve, reject) => {
      resolveCleanup = resolve;
      rejectCleanup = reject;
    });
    attempt.cleanupPromise = cleanup;
    this.performAttemptCleanup(attempt).then(resolveCleanup, rejectCleanup);
    const clearCleanup = () => {
      if (attempt.cleanupPromise === cleanup)
        attempt.cleanupPromise = null;
    };
    cleanup.then(clearCleanup, clearCleanup);
    return cleanup;
  }
  async performAttemptCleanup(attempt) {
    if (attempt.resourceAcquisition != null)
      await attempt.resourceAcquisition;
    const pending = [];
    const reason = createAbortError();
    if (!attempt.demuxerFinished && !attempt.demuxerAborted && attempt.demuxer != null) {
      attempt.demuxerAborted = true;
      try {
        attempt.demuxer.abort?.(reason);
      } catch {}
    }
    if (!attempt.sourceReleased) {
      if (attempt.reader != null) {
        attempt.sourceReleased = true;
        try {
          const result = attempt.reader.cancel(reason);
          try {
            attempt.reader.releaseLock();
          } catch {}
          pending.push(result);
        } catch {}
      } else if (attempt.iterator != null) {
        attempt.sourceReleased = true;
        try {
          pending.push(Promise.resolve(attempt.iterator.return?.()));
        } catch {}
      } else if (attempt.body != null && !attempt.sourceAcquisitionAttempted) {
        attempt.sourceReleased = true;
        try {
          if (isReadableStreamSource(attempt.body)) {
            pending.push(attempt.body.cancel(reason));
          } else if (isAsyncIterableSource(attempt.body)) {
            attempt.iterator = attempt.body[Symbol.asyncIterator]();
            pending.push(Promise.resolve(attempt.iterator.return?.()));
          }
        } catch {}
      }
    }
    if (!attempt.connectionClosed && attempt.closeConnection != null) {
      attempt.connectionClosed = true;
      try {
        pending.push(Promise.resolve(attempt.closeConnection()));
      } catch {}
    }
    await Promise.allSettled(pending);
  }
  runBoundedAttemptCleanup(attempt) {
    if (this.pendingCleanup != null)
      return this.pendingCleanup;
    let resolveCleanup;
    let rejectCleanup;
    const pendingCleanup = new Promise((resolve, reject) => {
      resolveCleanup = resolve;
      rejectCleanup = reject;
    });
    this.pendingCleanup = pendingCleanup;
    const cleanup = runBoundedCleanup(() => this.cleanupAttempt(attempt));
    cleanup.then(resolveCleanup, rejectCleanup);
    const clearCleanup = () => {
      if (this.pendingCleanup === pendingCleanup)
        this.pendingCleanup = null;
    };
    pendingCleanup.then(clearCleanup, clearCleanup);
    return pendingCleanup;
  }
  async retry(error, attempt, phase, cleanEnd = false) {
    if (this.lifecycleController.signal.aborted)
      return false;
    const reconnect = this.options.reconnect;
    const retryable = phase == null || !(error instanceof ClassifiedAudioStreamError) || error.retryable;
    if (reconnect == null || this.consecutiveReconnectAttempts >= reconnect.maxRetries) {
      if (cleanEnd)
        await this.finish(NativeAudioStreamCloseReason2.PreserveNativeTerminal);
      else
        await this.finish(NativeAudioStreamCloseReason2.TransportError, error);
      return false;
    }
    let retryDelayMs = error instanceof ClassifiedAudioStreamError ? error.retryAfterMs : undefined;
    if (phase != null && reconnect.retry != null) {
      let decision;
      try {
        decision = reconnect.retry(error, {
          attempt: this.consecutiveReconnectAttempts + 1,
          maxRetries: reconnect.maxRetries,
          phase
        });
        if (decision !== false && (decision == null || typeof decision !== "object")) {
          throw new TypeError("Audio stream retry policy must return false or a retry decision");
        }
      } catch (cause) {
        await this.finish(NativeAudioStreamCloseReason2.TransportError, new AudioStreamError("Audio stream retry policy failed", { action: "source" }, cause));
        return false;
      }
      if (decision === false) {
        await this.finish(NativeAudioStreamCloseReason2.TransportError, error);
        return false;
      }
      if (this.lifecycleController.signal.aborted)
        return false;
      let policyDelayMs;
      try {
        policyDelayMs = decision.delayMs;
      } catch (cause) {
        await this.finish(NativeAudioStreamCloseReason2.TransportError, new AudioStreamError("Audio stream retry policy failed", { action: "source" }, cause));
        return false;
      }
      if (policyDelayMs !== undefined && (!Number.isFinite(policyDelayMs) || !Number.isInteger(policyDelayMs) || policyDelayMs < 0)) {
        await this.finish(NativeAudioStreamCloseReason2.TransportError, new AudioStreamError("Audio stream retry delay must be a finite non-negative integer", {
          action: "source"
        }));
        return false;
      }
      if (policyDelayMs !== undefined)
        retryDelayMs = Math.min(reconnect.maxDelayMs, policyDelayMs);
    } else if (!retryable) {
      await this.finish(NativeAudioStreamCloseReason2.TransportError, error);
      return false;
    }
    if (retryDelayMs !== undefined)
      retryDelayMs = Math.min(reconnect.maxDelayMs, retryDelayMs);
    await this.cleanupAttempt(attempt);
    if (this.lifecycleController.signal.aborted)
      return false;
    if (this.nativeStreamId != null) {
      const stats = this.readNativeStats();
      const nativeError = this.snapshotError(stats);
      if (nativeError != null) {
        const reason = nativeError.context.action === "decoder" ? NativeAudioStreamCloseReason2.PreserveNativeTerminal : NativeAudioStreamCloseReason2.TransportError;
        await this.finish(reason, nativeError);
        return false;
      }
      if (stats != null)
        this.readyGeneration = stats.readyGeneration;
      const restartStatus = this.lib.audioRestartStream(this.engine, this.nativeStreamId);
      if (restartStatus !== 0) {
        const restartContext = { action: "restart", status: restartStatus };
        await this.finish(NativeAudioStreamCloseReason2.TransportError, new AudioStreamError("Audio stream restart failed during reconnect", restartContext));
        return false;
      }
      this.readNativeStats();
    }
    this.reconnectAttempts += 1;
    this.consecutiveReconnectAttempts += 1;
    const delayMs = retryDelayMs ?? Math.min(reconnect.maxDelayMs, reconnect.initialDelayMs * reconnect.backoffFactor ** (this.consecutiveReconnectAttempts - 1));
    if (this.exposed) {
      this.emitAsync("reconnecting", {
        attempt: this.consecutiveReconnectAttempts,
        delayMs,
        maxRetries: reconnect.maxRetries,
        error
      });
    }
    return waitForDelay(delayMs, this.lifecycleController.signal).then(() => true).catch(() => false);
  }
  async awaitReady(attempt, previousGeneration) {
    while (this.isAttemptActive(attempt)) {
      const stats = await this.pollNativeSnapshot(attempt);
      if (stats == null)
        return false;
      if (this.observeReady(stats, previousGeneration))
        return true;
      if (!await waitForPoll(attempt.controller.signal))
        return false;
    }
    return false;
  }
  observeReady(stats, previousGeneration) {
    if (stats == null || stats.readyGeneration === previousGeneration)
      return false;
    this.readyGeneration = stats.readyGeneration;
    this.consecutiveReconnectAttempts = 0;
    this.setupResolve();
    return true;
  }
  async awaitEnded(attempt) {
    while (this.isAttemptActive(attempt)) {
      const stats = await this.pollNativeSnapshot(attempt);
      if (stats == null)
        return false;
      if (stats.state === NativeAudioStreamState2.Ended)
        return true;
      if (!await waitForPoll(attempt.controller.signal))
        return false;
    }
    return false;
  }
  async pollNativeSnapshot(attempt) {
    if (!this.isAttemptActive(attempt))
      return null;
    const stats = this.readNativeStats();
    const error = this.snapshotError(stats);
    if (error != null) {
      const reason = error.context.action === "decoder" ? NativeAudioStreamCloseReason2.PreserveNativeTerminal : NativeAudioStreamCloseReason2.TransportError;
      await this.finish(reason, error);
      return null;
    }
    return stats;
  }
  snapshotError(stats) {
    if (stats == null)
      return new AudioStreamError("Audio stream stats failed", { action: "stats" });
    if (NativeAudioStreamStateNames[stats.state] == null) {
      return new AudioStreamError(`Unknown native audio stream state: ${stats.state}`, { action: "stats" });
    }
    if (stats.state !== NativeAudioStreamState2.Failed && stats.state !== NativeAudioStreamState2.Cancelled)
      return null;
    const context = { action: "decoder", errorCode: stats.errorCode };
    return new AudioStreamError(stats.state === NativeAudioStreamState2.Failed ? `Audio stream decoder failed: ${stats.errorCode}` : "Audio stream was cancelled by the decoder", context);
  }
  async finish(reason, error, context) {
    if (this.lifecycleController.signal.aborted)
      return;
    if (error instanceof AudioStreamError)
      context = error.context;
    this.lifecycleController.abort();
    this.terminalError = error ?? null;
    const cleanup = this.stopSource();
    const closeStatus = this.closeNativeStream(reason);
    if (error == null && closeStatus !== 0) {
      context = { action: "destroy", status: closeStatus };
      error = new AudioStreamError("Audio stream destroy failed after end", context);
      this.terminalError = error;
    }
    await cleanup;
    if (error != null)
      this.setupReject(error);
    else
      this.setupResolve();
    if (closeStatus === 0)
      this.removeOwner();
    if (!this.disposed && this.exposed) {
      if (error != null)
        this.emitTerminal("error", error, context);
      else
        this.emitTerminal("ended");
    } else if (error != null && !this.disposed)
      this.closedResolve();
  }
  publishMetadata(metadata, attempt) {
    if (!this.isAttemptActive(attempt) || Object.is(this.metadata, metadata))
      return;
    this.metadata = metadata;
    if (!this.exposed) {
      this.pendingMetadataEvent = true;
      return;
    }
    this.emitMetadata();
  }
  emitMetadata() {
    if (this.metadataEventScheduled)
      return;
    this.metadataEventScheduled = true;
    setTimeout(() => {
      this.metadataEventScheduled = false;
      if (!this.disposed)
        EventEmitter.prototype.emit.call(this, "metadata", this.metadata);
    }, 0);
  }
  emitAsync(event, ...args) {
    setTimeout(() => EventEmitter.prototype.emit.call(this, event, ...args), 0);
  }
  emitTerminal(event, ...args) {
    if (this.terminalEventScheduled)
      return;
    this.terminalEventScheduled = true;
    setTimeout(() => {
      try {
        EventEmitter.prototype.emit.call(this, event, ...args);
      } finally {
        this.closedResolve();
      }
    }, 0);
  }
  isAttemptActive(attempt) {
    return !this.lifecycleController.signal.aborted && this.activeAttempt === attempt;
  }
  stopSource(attempt = this.activeAttempt) {
    if (attempt == null)
      return this.pendingCleanup ?? Promise.resolve();
    if (this.activeAttempt === attempt)
      this.activeAttempt = null;
    attempt.controller.abort();
    return this.runBoundedAttemptCleanup(attempt);
  }
  closeNativeStream(reason) {
    const streamId = this.nativeStreamId;
    if (streamId == null)
      return 0;
    const result = this.lib.audioCloseStream(this.engine, streamId, reason);
    if (result.status !== 0 || result.stats == null)
      return result.status === 0 ? -1 : result.status;
    this.nativeStats = result.stats;
    this.nativeStreamId = null;
    return 0;
  }
  readNativeStats() {
    if (this.nativeStreamId == null)
      return this.nativeStats;
    const stats = this.lib.audioGetStreamStats(this.engine, this.nativeStreamId);
    if (stats != null)
      this.nativeStats = stats;
    return stats;
  }
  toPublicStats() {
    const stats = this.nativeStats;
    const sampleRate = stats?.sampleRate ?? 0;
    const bufferedFrames = stats?.bufferedFrames ?? 0;
    return {
      state: this.state,
      sampleRate,
      channels: stats?.channels ?? 0,
      bufferedFrames,
      capacityFrames: stats?.capacityFrames ?? 0,
      bufferedDurationMs: sampleRate === 0 ? 0 : bufferedFrames * 1000 / sampleRate,
      bytesReceived: stats?.bytesReceived ?? 0n,
      framesDecoded: stats?.framesDecoded ?? 0n,
      framesPlayed: stats?.framesPlayed ?? 0n,
      underruns: stats?.underruns ?? 0,
      reconnectAttempts: this.reconnectAttempts
    };
  }
  removeOwner() {
    this.options.signal?.removeEventListener("abort", this.overallAbortListener);
    this.removeFromOwner();
  }
}
var createAudioCaptureStream;
var openAudioCaptureStream;
var refreshAudioCaptureStreamFinalStats;

class AudioCaptureStream extends EventEmitter {
  readable;
  sampleRate;
  channels;
  chunkFrames;
  closed;
  init;
  lifecycleController = new AbortController;
  streamController = null;
  nativeStats;
  currentState = "initializing";
  pendingFrames = 0;
  pendingSamples;
  producerStopAttempted = false;
  producerStopped = false;
  producerMayBeRunning = false;
  ownerRemoved = false;
  exposed = false;
  terminal = false;
  discardRequested = false;
  discardDecisionScheduled = false;
  pumpPromise = null;
  producerCleanupPromise = null;
  lastCleanupFailure = null;
  terminalCompletionPromise = null;
  closedResolve;
  signalAbortListener = () => this.dispose();
  static {
    createAudioCaptureStream = (init) => new AudioCaptureStream(init);
    openAudioCaptureStream = (stream) => stream.open();
    refreshAudioCaptureStreamFinalStats = (stream) => stream.refreshFinalStats();
  }
  constructor(init) {
    super();
    this.init = init;
    this.sampleRate = init.options.sampleRate;
    this.channels = init.options.channels;
    this.chunkFrames = init.options.chunkFrames;
    this.pendingSamples = new Float32Array(this.chunkFrames * this.channels);
    this.nativeStats = {
      sampleRate: this.sampleRate,
      channels: this.channels,
      capacityFrames: init.options.capacityFrames,
      bufferedFrames: 0,
      framesReceived: 0n,
      framesRead: 0n,
      framesDropped: 0n
    };
    this.closed = new Promise((resolve) => this.closedResolve = resolve);
    this.readable = new ReadableStream({
      start: (controller) => {
        this.streamController = controller;
      },
      pull: () => this.pull(),
      cancel: () => this.disposeInternal(true)
    }, { highWaterMark: 0 });
    this.init.options.signal?.addEventListener("abort", this.signalAbortListener, { once: true });
  }
  get state() {
    return this.currentState;
  }
  async open() {
    if (this.init.options.signal?.aborted) {
      await this.disposeInternal(false);
      throw createAbortError();
    }
    let result;
    this.producerMayBeRunning = true;
    try {
      result = this.init.start();
    } catch (cause) {
      this.currentState = "errored";
      await this.cleanupProducer();
      this.closedResolve();
      throw new AudioCaptureStreamError("Audio capture stream start failed", { action: "start" }, cause);
    }
    if (result.status !== 0) {
      this.producerMayBeRunning = false;
      this.currentState = "errored";
      this.removeOwner();
      this.closedResolve();
      throw this.operationError("start", result);
    }
    if (this.terminal || this.init.options.signal?.aborted) {
      await (this.terminalCompletionPromise ?? this.disposeInternal(false));
      throw createAbortError();
    }
    let stats;
    try {
      stats = this.init.stats();
    } catch (cause) {
      stats = { status: -1, stats: null, cause };
    }
    if (stats.status !== 0 || stats.stats == null) {
      this.currentState = "errored";
      await this.cleanupProducer();
      this.closedResolve();
      throw this.operationError("stats", stats);
    }
    this.nativeStats = stats.stats;
    if (this.terminal || this.init.options.signal?.aborted) {
      await (this.terminalCompletionPromise ?? this.disposeInternal(false));
      throw createAbortError();
    }
    this.currentState = "capturing";
    this.exposed = true;
  }
  getStats() {
    if (!this.terminal) {
      const stats = this.refreshStats();
      if (stats != null && !this.observeProducer())
        this.scheduleDiscardIfIdle();
    }
    return this.publicStats();
  }
  stop() {
    if (this.terminal || this.currentState === "stopping")
      return;
    this.currentState = "stopping";
    const result = this.stopProducer();
    if (result != null && result.status !== 0)
      this.fail(this.operationError("stop", result));
    else
      this.scheduleDiscardIfIdle();
  }
  dispose() {
    this.disposeInternal(false);
  }
  disposeInternal(fromCancel) {
    if (this.terminal) {
      if (this.ownerRemoved)
        return this.terminalCompletionPromise ?? Promise.resolve();
      return this.retryTerminalCleanup();
    }
    this.terminal = true;
    this.currentState = "disposed";
    this.refreshFinalStats();
    this.lifecycleController.abort();
    const immediateCleanup = !this.producerMayBeRunning || this.producerStopped ? { status: 0 } : this.producerStopAttempted ? null : this.stopProducer();
    if (immediateCleanup?.status === 0)
      this.refreshFinalStats();
    this.terminalCompletionPromise = (async () => {
      const cleanup = immediateCleanup?.status === 0 ? immediateCleanup : await this.cleanupProducer();
      this.refreshFinalStats();
      if (cleanup.status === 0) {
        this.removeOwner();
        if (!fromCancel) {
          try {
            this.streamController?.close();
          } catch {}
        }
        if (this.exposed)
          this.emitTerminal("disposed");
        else
          this.closedResolve();
        return;
      }
      this.currentState = "errored";
      const error = this.operationError("destroy", cleanup);
      try {
        this.streamController?.error(error);
      } catch {}
      if (this.exposed)
        this.emitTerminal("error", error, error.context);
      else
        this.closedResolve();
    })();
    return this.terminalCompletionPromise;
  }
  pull() {
    return this.pump();
  }
  pump() {
    if (this.pumpPromise != null)
      return this.pumpPromise;
    const pump = Promise.resolve().then(async () => {
      do {
        await this.pumpSource();
      } while (this.discardRequested && !this.terminal);
    });
    this.pumpPromise = pump;
    const clear = () => {
      if (this.pumpPromise === pump)
        this.pumpPromise = null;
    };
    pump.then(clear, clear);
    return pump;
  }
  async pumpSource() {
    if (this.discardRequested) {
      await this.discardNativeRing();
      return;
    }
    const controller = this.streamController;
    while (!this.terminal) {
      if (this.discardRequested) {
        await this.discardNativeRing();
        return;
      }
      const stats = this.refreshStats();
      if (stats == null || this.terminal)
        return;
      const running = this.observeProducer();
      if (this.terminal)
        return;
      const neededFrames = this.chunkFrames - this.pendingFrames;
      const readableFrames = running ? stats.bufferedFrames >= neededFrames ? neededFrames : 0 : Math.min(neededFrames, stats.bufferedFrames);
      let framesRead = 0;
      if (readableFrames > 0) {
        let result;
        try {
          result = this.init.read(readableFrames);
        } catch (cause) {
          this.fail(new AudioCaptureStreamError("Audio capture stream read failed", { action: "read" }, cause));
          return;
        }
        if (result.status !== 0) {
          this.fail(this.operationError("read", result));
          return;
        }
        framesRead = Math.min(readableFrames, result.framesRead);
        if (framesRead > 0) {
          const sampleCount = framesRead * this.channels;
          this.pendingSamples.set(result.frames.subarray(0, sampleCount), this.pendingFrames * this.channels);
          this.pendingFrames += framesRead;
          if (this.pendingFrames === this.chunkFrames) {
            controller.enqueue(this.pendingSamples.slice());
            this.pendingFrames = 0;
            if (!running && stats.bufferedFrames <= framesRead)
              this.finishStopped();
            return;
          }
        }
      }
      if (!running && stats.bufferedFrames <= framesRead) {
        if (this.pendingFrames > 0) {
          controller.enqueue(this.pendingSamples.slice(0, this.pendingFrames * this.channels));
          this.pendingFrames = 0;
        }
        this.finishStopped();
        return;
      }
      if (!await waitForPoll(this.lifecycleController.signal))
        return;
    }
  }
  async discardNativeRing() {
    this.pendingFrames = 0;
    let chunksThisTurn = 0;
    while (!this.terminal) {
      const stats = this.refreshStats();
      if (stats == null || this.terminal)
        return;
      if (stats.bufferedFrames === 0) {
        this.finishStopped();
        return;
      }
      const frameCount = Math.min(this.chunkFrames, stats.bufferedFrames);
      let result;
      try {
        result = this.init.read(frameCount);
      } catch (cause) {
        this.fail(new AudioCaptureStreamError("Audio capture stream read failed", { action: "read" }, cause));
        return;
      }
      if (result.status !== 0) {
        this.fail(this.operationError("read", result));
        return;
      }
      chunksThisTurn += 1;
      if (result.framesRead === 0) {
        if (!await waitForPoll(this.lifecycleController.signal))
          return;
      } else if (chunksThisTurn >= CAPTURE_DISCARD_BATCH_CHUNKS) {
        chunksThisTurn = 0;
        await waitForDelay(0, this.lifecycleController.signal).catch(() => {
          return;
        });
      }
    }
  }
  requestDiscardDrain() {
    if (this.terminal || this.discardRequested)
      return;
    this.discardRequested = true;
    this.pump();
  }
  scheduleDiscardIfIdle() {
    if (this.terminal || this.discardRequested || this.discardDecisionScheduled)
      return;
    this.discardDecisionScheduled = true;
    setTimeout(() => {
      this.discardDecisionScheduled = false;
      if (this.terminal)
        return;
      if (this.readable.locked)
        this.scheduleDiscardIfIdle();
      else
        this.requestDiscardDrain();
    }, STREAM_POLL_INTERVAL_MS);
  }
  refreshStats() {
    let result;
    try {
      result = this.init.stats();
    } catch (cause) {
      this.fail(new AudioCaptureStreamError("Audio capture stream stats failed", { action: "stats" }, cause));
      return null;
    }
    if (result.status !== 0 || result.stats == null) {
      this.fail(this.operationError("stats", result));
      return null;
    }
    this.nativeStats = result.stats;
    return result.stats;
  }
  observeProducer() {
    if (this.producerStopAttempted)
      return false;
    let running;
    try {
      running = this.init.isRunning();
    } catch (cause) {
      this.fail(new AudioCaptureStreamError("Audio capture stream stats failed", { action: "stats" }, cause));
      return false;
    }
    if (this.terminal)
      return false;
    if (running)
      return true;
    this.currentState = "stopping";
    const result = this.stopProducer();
    if (result != null && result.status !== 0)
      this.fail(this.operationError("stop", result));
    return false;
  }
  stopProducer() {
    if (this.producerStopAttempted)
      return null;
    this.producerStopAttempted = true;
    try {
      const result = this.init.stop();
      if (result.status === 0) {
        this.producerStopped = true;
        this.producerMayBeRunning = false;
      }
      return result;
    } catch (cause) {
      return { status: -1, cause };
    }
  }
  finishStopped() {
    if (this.terminal)
      return;
    if (this.refreshStats() == null || this.terminal)
      return;
    this.terminal = true;
    this.currentState = "stopped";
    this.lifecycleController.abort();
    this.removeOwner();
    this.streamController?.close();
    this.emitTerminal("stopped");
  }
  fail(error) {
    if (this.terminal)
      return;
    this.terminal = true;
    this.currentState = "errored";
    this.lifecycleController.abort();
    try {
      this.streamController?.error(error);
    } catch {}
    this.terminalCompletionPromise = (async () => {
      if ((await this.cleanupProducer()).status === 0)
        this.removeOwner();
      this.refreshFinalStats();
      if (this.exposed)
        this.emitTerminal("error", error, error.context);
      else
        this.closedResolve();
    })();
  }
  operationError(action, result) {
    const context = { action };
    if (result.status !== 0)
      context.status = result.status;
    return new AudioCaptureStreamError(`Audio capture stream ${action} failed${result.status ? `: ${result.status}` : ""}`, context, result.cause);
  }
  cleanupProducer() {
    if (!this.producerMayBeRunning || this.producerStopped)
      return Promise.resolve({ status: 0 });
    if (this.producerCleanupPromise != null)
      return this.producerCleanupPromise;
    const cleanup = (async () => {
      let lastFailure = this.lastCleanupFailure ?? { status: -1 };
      for (let attempt = 0;attempt < 3; attempt += 1) {
        this.producerStopAttempted = false;
        const result = this.stopProducer();
        if (result?.status === 0) {
          this.lastCleanupFailure = null;
          return result;
        }
        if (result != null) {
          lastFailure = result;
          this.lastCleanupFailure = result;
        }
        if (attempt < 2)
          await new Promise((resolve) => setTimeout(resolve, STREAM_POLL_INTERVAL_MS));
      }
      return lastFailure;
    })();
    this.producerCleanupPromise = cleanup;
    cleanup.finally(() => {
      if (this.producerCleanupPromise === cleanup)
        this.producerCleanupPromise = null;
    });
    return cleanup;
  }
  retryTerminalCleanup() {
    return this.cleanupProducer().then((result) => {
      if (result.status === 0)
        this.removeOwner();
    });
  }
  publicStats() {
    return {
      ...this.nativeStats,
      state: this.currentState,
      bufferedDurationMs: this.nativeStats.sampleRate === 0 ? 0 : this.nativeStats.bufferedFrames * 1000 / this.nativeStats.sampleRate
    };
  }
  refreshFinalStats() {
    try {
      const result = this.init.stats();
      if (result.status === 0 && result.stats != null)
        this.nativeStats = result.stats;
    } catch {}
  }
  removeOwner() {
    if (this.ownerRemoved)
      return;
    this.ownerRemoved = true;
    this.init.options.signal?.removeEventListener("abort", this.signalAbortListener);
    this.init.removeFromOwner();
  }
  emitTerminal(event, ...args) {
    setTimeout(() => {
      try {
        EventEmitter.prototype.emit.call(this, event, ...args);
      } finally {
        this.closedResolve();
      }
    }, 0);
  }
}
var createAudioRecorder;
var openAudioRecorder;
function createWavHeader(sampleRate, channels, dataBytes) {
  const header = new Uint8Array(WAV_HEADER_BYTES);
  const view = new DataView(header.buffer);
  header.set([82, 73, 70, 70], 0);
  view.setUint32(4, dataBytes + 36, true);
  header.set([87, 65, 86, 69], 8);
  header.set([102, 109, 116, 32], 12);
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, channels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * channels * 2, true);
  view.setUint16(32, channels * 2, true);
  view.setUint16(34, 16, true);
  header.set([100, 97, 116, 97], 36);
  view.setUint32(40, dataBytes, true);
  return header;
}

class AudioRecorder extends EventEmitter {
  static fileSystem = { open: openFile, rename, unlink };
  filePath;
  format = "wav";
  sampleRate;
  channels;
  closed;
  init;
  currentState = "initializing";
  capture = null;
  reader = null;
  fileHandle = null;
  tempPath = null;
  captureStats;
  framesWritten = 0n;
  dataBytesWritten = 0n;
  stopRequested = false;
  terminal = null;
  terminationRequest = null;
  publicationStarted = false;
  exposed = false;
  ownerRemoved = false;
  cleanupPromise = null;
  resourceCleanupPromise = null;
  retainedCleanupScheduled = false;
  lifecyclePromise = null;
  closedResolve;
  signalAbortListener = () => this.dispose();
  captureErrorListener = (error) => {
    this.fail(this.fromCaptureError(error));
  };
  static {
    createAudioRecorder = (init) => new AudioRecorder(init);
    openAudioRecorder = (recorder) => recorder.open();
  }
  constructor(init) {
    super();
    this.init = init;
    this.filePath = init.filePath;
    this.sampleRate = init.captureOptions.sampleRate;
    this.channels = init.captureOptions.channels;
    this.captureStats = {
      state: "initializing",
      sampleRate: this.sampleRate,
      channels: this.channels,
      capacityFrames: init.captureOptions.capacityFrames,
      bufferedFrames: 0,
      bufferedDurationMs: 0,
      framesReceived: 0n,
      framesRead: 0n,
      framesDropped: 0n
    };
    this.closed = new Promise((resolve) => this.closedResolve = resolve);
    this.init.signal?.addEventListener("abort", this.signalAbortListener, { once: true });
  }
  get state() {
    return this.currentState;
  }
  async open() {
    try {
      this.fileHandle = await this.openTemporaryFile();
      this.ensureOpening();
      await this.writeFully(new Uint8Array(WAV_HEADER_BYTES), 0, "write");
      this.ensureOpening();
      try {
        this.capture = await this.init.openCapture({
          channels: this.init.captureOptions.channels,
          capacityFrames: this.init.captureOptions.capacityFrames,
          chunkFrames: this.init.captureOptions.chunkFrames,
          startOptions: this.init.captureOptions.startOptions
        });
        this.capture.on("error", this.captureErrorListener);
      } catch (cause) {
        if (cause instanceof DOMException && cause.name === "AbortError")
          throw cause;
        throw new AudioRecorderError("Audio recorder capture start failed", { action: "start" }, cause);
      }
      this.ensureOpening();
      this.captureStats = this.capture.getStats();
      if (this.captureStats.framesDropped > 0n) {
        throw new AudioRecorderError("Audio recorder capture dropped frames", { action: "stats" });
      }
      this.currentState = "recording";
      this.exposed = true;
      this.reader = this.capture.readable.getReader();
      const lifecycle = this.consume();
      this.lifecyclePromise = lifecycle;
      lifecycle.finally(() => {
        if (this.lifecyclePromise === lifecycle)
          this.lifecyclePromise = null;
        const request = this.terminationRequest;
        if (request != null)
          this.finishCleanup(request.kind, request.error);
      });
    } catch (cause) {
      if (this.terminationRequest == null) {
        if (cause instanceof DOMException && cause.name === "AbortError")
          this.requestTermination("disposed");
        else {
          const error = cause instanceof AudioRecorderError ? cause : new AudioRecorderError("Audio recorder open failed", { action: "open" }, cause);
          this.requestTermination("error", error);
        }
      }
      const request = this.terminationRequest;
      const cleanupError = await this.finishCleanup(request.kind, request.error);
      if (cleanupError != null) {
        throw new AudioRecorderError("Audio recorder setup cleanup failed", { action: "destroy" }, new AggregateError([cause, cleanupError], "Audio recorder setup and cleanup failed"));
      }
      if (request.kind === "disposed")
        throw createAbortError();
      if (cause instanceof AudioRecorderError)
        throw cause;
      throw new AudioRecorderError("Audio recorder open failed", { action: "open" }, cause);
    }
  }
  getStats() {
    if (this.capture != null && this.terminal == null && this.terminationRequest == null) {
      this.captureStats = this.capture.getStats();
      if (this.captureStats.framesDropped > 0n) {
        this.fail(new AudioRecorderError("Audio recorder capture dropped frames", { action: "stats" }));
      }
    }
    return {
      sampleRate: this.captureStats.sampleRate,
      channels: this.captureStats.channels,
      capacityFrames: this.captureStats.capacityFrames,
      bufferedFrames: this.captureStats.bufferedFrames,
      bufferedDurationMs: this.captureStats.bufferedDurationMs,
      framesReceived: this.captureStats.framesReceived,
      framesRead: this.captureStats.framesRead,
      framesDropped: this.captureStats.framesDropped,
      state: this.currentState,
      framesWritten: this.framesWritten,
      dataBytesWritten: this.dataBytesWritten,
      durationMs: this.sampleRate === 0 ? 0 : Number(this.framesWritten) * 1000 / this.sampleRate
    };
  }
  stop() {
    if (this.terminal != null || this.terminationRequest != null || this.stopRequested)
      return;
    this.stopRequested = true;
    this.currentState = "stopping";
    try {
      this.capture?.stop();
    } catch (cause) {
      this.fail(new AudioRecorderError("Audio recorder capture stop failed", { action: "stop" }, cause));
    }
  }
  dispose() {
    if (this.terminal != null) {
      this.retryRetainedCleanup();
      return;
    }
    if (this.publicationStarted)
      return;
    this.requestTermination("disposed");
  }
  async consume() {
    const reader = this.reader;
    let pendingRead = this.readWithStats(reader);
    try {
      while (this.terminal == null && this.terminationRequest == null) {
        const result = await pendingRead;
        pendingRead = null;
        if (this.terminal != null || this.terminationRequest != null)
          return;
        if (result.done) {
          if (!this.stopRequested) {
            this.fail(new AudioRecorderError("Audio capture stopped unexpectedly", { action: "stop" }));
          } else {
            await this.complete();
          }
          return;
        }
        pendingRead = this.readWithStats(reader);
        this.captureStats = this.capture.getStats();
        if (this.captureStats.framesDropped > 0n) {
          this.fail(new AudioRecorderError("Audio recorder capture dropped frames", { action: "stats" }));
          return;
        }
        await this.writeSamples(result.value);
      }
    } catch (cause) {
      if (this.terminal == null && this.terminationRequest == null) {
        const error = cause instanceof AudioRecorderError ? cause : cause instanceof AudioCaptureStreamError ? this.fromCaptureError(cause) : new AudioRecorderError("Audio recorder read failed", { action: "read" }, cause);
        this.fail(error);
      }
    } finally {
      if (pendingRead != null)
        pendingRead.catch(() => {
          return;
        });
      try {
        reader.releaseLock();
      } catch {}
    }
  }
  async writeSamples(samples) {
    if (samples.length % this.channels !== 0) {
      throw new AudioRecorderError("Audio recorder received a partial frame", { action: "read" });
    }
    const bytes = new Uint8Array(samples.length * 2);
    const view = new DataView(bytes.buffer);
    for (let index = 0;index < samples.length; index += 1) {
      const sample = Math.max(-1, Math.min(1, samples[index]));
      view.setInt16(index * 2, Math.round(sample * 32767), true);
    }
    const nextDataBytes = this.dataBytesWritten + BigInt(bytes.byteLength);
    if (nextDataBytes > MAX_WAV_DATA_BYTES) {
      throw new AudioRecorderError("Audio recorder exceeded the classic RIFF size limit", { action: "write" });
    }
    await this.writeFully(bytes, WAV_HEADER_BYTES + Number(this.dataBytesWritten), "write");
    this.dataBytesWritten = nextDataBytes;
    this.framesWritten += BigInt(samples.length / this.channels);
  }
  readWithStats(reader) {
    return new Promise((resolve, reject) => {
      let settled = false;
      let timer;
      const finish = (callback) => {
        if (settled)
          return;
        settled = true;
        if (timer !== undefined)
          clearTimeout(timer);
        callback();
      };
      const poll = () => {
        if (settled)
          return;
        if (this.terminal != null || this.terminationRequest != null) {
          finish(() => resolve({ done: true, value: undefined }));
          return;
        }
        this.captureStats = this.capture.getStats();
        if (this.captureStats.framesDropped > 0n) {
          finish(() => reject(new AudioRecorderError("Audio recorder capture dropped frames", { action: "stats" })));
          return;
        }
        timer = setTimeout(poll, STREAM_POLL_INTERVAL_MS);
      };
      reader.read().then((result) => finish(() => resolve(result)), (cause) => finish(() => reject(cause)));
      timer = setTimeout(poll, STREAM_POLL_INTERVAL_MS);
    });
  }
  async complete() {
    if (this.terminal != null || this.terminationRequest != null)
      return;
    this.captureStats = this.capture.getStats();
    if (this.captureStats.framesDropped > 0n) {
      this.fail(new AudioRecorderError("Audio recorder capture dropped frames", { action: "stats" }));
      return;
    }
    try {
      await this.writeFully(createWavHeader(this.sampleRate, this.channels, Number(this.dataBytesWritten)), 0, "finalize");
      if (this.terminationRequest != null)
        return;
      await this.fileHandle.sync().catch((cause) => {
        if (cause.code !== "ERR_ACCESS_DENIED")
          throw cause;
      });
      if (this.terminationRequest != null)
        return;
      await this.fileHandle.close();
      this.fileHandle = null;
    } catch (cause) {
      if (this.terminationRequest == null) {
        this.fail(cause instanceof AudioRecorderError ? cause : new AudioRecorderError("Audio recorder finalize failed", { action: "finalize" }, cause));
      }
      return;
    }
    if (this.terminationRequest != null)
      return;
    this.publicationStarted = true;
    try {
      await this.publish();
    } catch (cause) {
      const error = new AudioRecorderError("Audio recorder publish failed", { action: "publish" }, cause);
      this.terminal = "error";
      this.currentState = "errored";
      await this.finishCleanup("error", error);
      return;
    }
    this.terminal = "stopped";
    this.currentState = "stopped";
    this.init.signal?.removeEventListener("abort", this.signalAbortListener);
    this.capture?.removeListener("error", this.captureErrorListener);
    if (this.hasRetainedResources())
      this.scheduleRetainedCleanup();
    else
      this.removeOwner();
    this.emitTerminal("stopped");
  }
  async publish() {
    const tempPath = this.tempPath;
    await AudioRecorder.fileSystem.rename(tempPath, this.filePath);
    this.tempPath = null;
  }
  fail(error) {
    if (this.terminal != null || this.publicationStarted)
      return;
    this.requestTermination("error", error);
  }
  requestTermination(kind, error) {
    if (this.terminal != null || this.publicationStarted || this.terminationRequest != null)
      return;
    this.terminationRequest = { kind, error };
    this.currentState = kind === "disposed" ? "disposed" : "errored";
    this.capture?.dispose();
    if (this.exposed && this.lifecyclePromise == null)
      this.finishCleanup(kind, error);
  }
  finishCleanup(kind, error) {
    if (this.cleanupPromise != null)
      return this.cleanupPromise;
    this.cleanupPromise = (async () => {
      this.init.signal?.removeEventListener("abort", this.signalAbortListener);
      const capture = this.capture;
      capture?.dispose();
      if (capture != null) {
        await capture.closed;
        this.captureStats = capture.getStats();
      }
      capture?.removeListener("error", this.captureErrorListener);
      const cleanupError = await this.cleanupOwnedResources();
      const captureCleanupError = capture?.state === "errored" ? new AudioRecorderError("Audio recorder capture cleanup failed", { action: "destroy" }) : null;
      const terminalKind = cleanupError == null && captureCleanupError == null ? kind : "error";
      const terminalError = cleanupError ?? error ?? captureCleanupError;
      this.terminal = terminalKind;
      this.currentState = terminalKind === "disposed" ? "disposed" : "errored";
      if (this.hasRetainedResources())
        this.scheduleRetainedCleanup();
      else
        this.removeOwner();
      if (!this.exposed) {
        this.closedResolve();
      } else if (terminalKind === "error") {
        this.emitTerminal("error", terminalError, terminalError.context);
      } else {
        this.emitTerminal("disposed");
      }
      return cleanupError ?? captureCleanupError;
    })();
    return this.cleanupPromise;
  }
  cleanupOwnedResources() {
    if (!this.hasRetainedResources())
      return Promise.resolve(null);
    if (this.resourceCleanupPromise != null)
      return this.resourceCleanupPromise;
    const cleanup = (async () => {
      let lastError = null;
      for (let attempt = 0;attempt < 3; attempt += 1) {
        const handle = this.fileHandle;
        if (handle != null) {
          try {
            await handle.close();
            if (this.fileHandle === handle)
              this.fileHandle = null;
          } catch (cause) {
            lastError = new AudioRecorderError("Audio recorder file close failed", { action: "destroy" }, cause);
          }
        }
        if (this.fileHandle == null) {
          const tempPath = this.tempPath;
          if (tempPath != null) {
            try {
              await AudioRecorder.fileSystem.unlink(tempPath);
              if (this.tempPath === tempPath)
                this.tempPath = null;
            } catch (cause) {
              lastError = new AudioRecorderError("Audio recorder temp file cleanup failed", { action: "destroy" }, cause);
            }
          }
        }
        if (!this.hasRetainedResources())
          return null;
        if (attempt < 2)
          await new Promise((resolve) => setTimeout(resolve, STREAM_POLL_INTERVAL_MS));
      }
      return lastError ?? new AudioRecorderError("Audio recorder resource cleanup failed", { action: "destroy" });
    })();
    this.resourceCleanupPromise = cleanup;
    const clear = () => {
      if (this.resourceCleanupPromise === cleanup)
        this.resourceCleanupPromise = null;
    };
    cleanup.then(clear, clear);
    return cleanup;
  }
  retryRetainedCleanup() {
    this.capture?.dispose();
    if (!this.hasRetainedResources()) {
      this.removeOwner();
      return Promise.resolve();
    }
    return this.cleanupOwnedResources().then(() => {
      if (!this.hasRetainedResources())
        this.removeOwner();
    });
  }
  scheduleRetainedCleanup() {
    if (this.retainedCleanupScheduled || !this.hasRetainedResources())
      return;
    this.retainedCleanupScheduled = true;
    setTimeout(() => {
      this.retainedCleanupScheduled = false;
      this.retryRetainedCleanup();
    }, STREAM_POLL_INTERVAL_MS);
  }
  hasRetainedResources() {
    return this.fileHandle != null || this.tempPath != null;
  }
  async openTemporaryFile() {
    const directory = dirname(this.filePath);
    const destinationName = basename(this.filePath);
    const tempNameLength = Math.max(1, Math.min(24, destinationName.length));
    const singleCharacterNames = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-";
    for (let attempt = 0;attempt < singleCharacterNames.length; attempt += 1) {
      const tempName = tempNameLength === 1 ? singleCharacterNames[attempt] : randomBytes(16).toString("hex").slice(0, tempNameLength);
      if (tempName === destinationName)
        continue;
      const tempPath = join(directory, tempName);
      try {
        const handle = await AudioRecorder.fileSystem.open(tempPath, "wx");
        this.tempPath = tempPath;
        return handle;
      } catch (cause) {
        if (cause.code !== "EEXIST") {
          throw new AudioRecorderError("Audio recorder temp file open failed", { action: "open" }, cause);
        }
      }
    }
    throw new AudioRecorderError("Audio recorder could not allocate a temporary file", { action: "open" });
  }
  async writeFully(bytes, position, action) {
    let offset = 0;
    while (offset < bytes.byteLength) {
      let bytesWritten;
      try {
        ({ bytesWritten } = await this.fileHandle.write(bytes, offset, bytes.byteLength - offset, position + offset));
      } catch (cause) {
        throw new AudioRecorderError(`Audio recorder ${action} write failed`, { action }, cause);
      }
      if (bytesWritten <= 0) {
        throw new AudioRecorderError(`Audio recorder ${action} write made no progress`, { action });
      }
      offset += Math.min(bytesWritten, bytes.byteLength - offset);
    }
  }
  ensureOpening() {
    if (this.terminationRequest?.kind === "disposed" || this.init.signal?.aborted)
      throw createAbortError();
    if (this.terminationRequest?.kind === "error")
      throw this.terminationRequest.error;
  }
  fromCaptureError(error) {
    const action = error.context.action === "stop" ? "stop" : error.context.action === "stats" ? "stats" : error.context.action === "destroy" ? "destroy" : "read";
    const context = { action };
    if (error.context.status !== undefined)
      context.status = error.context.status;
    return new AudioRecorderError(`Audio recorder capture ${action} failed`, context, error);
  }
  removeOwner() {
    if (this.ownerRemoved)
      return;
    this.ownerRemoved = true;
    this.init.removeFromOwner();
  }
  emitTerminal(event, ...args) {
    setTimeout(() => {
      try {
        EventEmitter.prototype.emit.call(this, event, ...args);
      } finally {
        this.closedResolve();
      }
    }, 0);
  }
}

class Audio extends EventEmitter {
  static create(options = {}) {
    let lib;
    try {
      lib = resolveRenderLib2();
    } catch (cause) {
      throw new AudioInitializationError("resolveRenderLib", "Failed to resolve the native audio library", undefined, cause);
    }
    return new Audio(lib, options);
  }
  sampleRate;
  lib;
  defaultStartOptions;
  engine = null;
  groups = new Map;
  streams = new Set;
  playbackStarted = false;
  mixerStarted = false;
  captureStarted = false;
  captureDeviceOpen = false;
  captureBufferAvailable = false;
  captureChannels = 1;
  captureCapacityFrames = 0;
  captureOwner = null;
  captureStream = null;
  disposing = false;
  constructor(lib, options) {
    super();
    this.lib = lib;
    this.defaultStartOptions = options.startOptions;
    const normalizedSampleRate = options.sampleRate == null || !Number.isFinite(options.sampleRate) ? 0 : Math.min(MAX_U32, Math.max(0, Math.trunc(options.sampleRate)));
    this.sampleRate = normalizedSampleRate || DEFAULT_AUDIO_SAMPLE_RATE;
    const createOptions = options.sampleRate == null && options.playbackChannels == null ? undefined : {
      sampleRate: options.sampleRate == null ? undefined : normalizedSampleRate,
      playbackChannels: options.playbackChannels == null ? undefined : Math.max(0, Math.trunc(options.playbackChannels))
    };
    this.engine = this.lib.createAudioEngine(createOptions);
    if (!this.engine) {
      throw new AudioInitializationError("createAudioEngine", "Audio createAudioEngine returned null");
    }
    if (options.autoStart ?? false) {
      const status = this.lib.audioStart(this.engine, this.defaultStartOptions);
      if (status !== 0) {
        this.throwAfterInitializationCleanup(new AudioInitializationError("start", `Audio auto-start failed: ${status}`, status));
      }
      this.playbackStarted = true;
      this.mixerStarted = true;
    }
  }
  throwAfterInitializationCleanup(error) {
    const engine = this.engine;
    this.engine = null;
    if (engine)
      this.lib.destroyAudioEngine(engine);
    throw error;
  }
  emitError(action, status, message, cause) {
    const error = message ? new Error(message) : statusToError(action, status ?? -1);
    if (cause)
      error.cause = cause;
    this.emit("error", error, { action, status });
  }
  start(options) {
    if (this.playbackStarted)
      return true;
    const engine = this.engine;
    if (!engine) {
      this.emitError("start", undefined, "Audio engine unavailable during start");
      return false;
    }
    const startOptions = options ?? this.defaultStartOptions;
    const status = this.lib.audioStart(engine, startOptions);
    if (status !== 0) {
      this.emitError("start", status);
      return false;
    }
    this.playbackStarted = true;
    this.mixerStarted = true;
    this.emit("started");
    return true;
  }
  startMixer() {
    if (this.mixerStarted)
      return true;
    const engine = this.engine;
    if (!engine) {
      this.emitError("startMixer", undefined, "Audio engine unavailable during startMixer");
      return false;
    }
    const status = this.lib.audioStartMixer(engine);
    if (status !== 0) {
      this.emitError("startMixer", status);
      return false;
    }
    this.mixerStarted = true;
    this.emit("mixerStarted");
    return true;
  }
  stop() {
    if (!this.mixerStarted)
      return true;
    const engine = this.engine;
    if (!engine) {
      this.emitError("stop", undefined, "Audio engine unavailable during stop");
      return false;
    }
    const status = this.lib.audioStop(engine);
    if (status !== 0) {
      this.emitError("stop", status);
      return false;
    }
    this.playbackStarted = false;
    this.mixerStarted = false;
    this.emit("stopped");
    return true;
  }
  isStarted() {
    return this.playbackStarted;
  }
  isMixerStarted() {
    return this.mixerStarted;
  }
  loadSound(data) {
    const engine = this.engine;
    if (!engine) {
      this.emitError("loadSound", undefined, "Audio engine unavailable during loadSound");
      return null;
    }
    const result = this.lib.audioLoad(engine, toBytes(data));
    if (result.status !== 0 || result.soundId == null) {
      this.emitError("loadSound", result.status);
      return null;
    }
    return result.soundId;
  }
  async loadSoundFile(filePath) {
    const bytes = await readFile(filePath).catch((err) => {
      this.emitError("loadSoundFile", undefined, `Failed to read file '${filePath}': ${err.message}`, err);
      return null;
    });
    if (bytes == null)
      return null;
    return this.loadSound(bytes);
  }
  unloadSound(sound) {
    const engine = this.engine;
    if (!engine) {
      this.emitError("unloadSound", undefined, "Audio engine unavailable during unloadSound");
      return false;
    }
    const status = this.lib.audioUnload(engine, sound);
    if (status !== 0) {
      this.emitError("unloadSound", status);
      return false;
    }
    return true;
  }
  group(name) {
    const existing = this.groups.get(name);
    if (existing != null) {
      return existing;
    }
    const engine = this.engine;
    if (!engine) {
      this.emitError("group", undefined, "Audio engine unavailable during group");
      return null;
    }
    const result = this.lib.audioCreateGroup(engine, name);
    if (result.status !== 0 || result.groupId == null) {
      this.emitError("group", result.status);
      return null;
    }
    this.groups.set(name, result.groupId);
    return result.groupId;
  }
  play(sound, options) {
    const rawOptions = options ? {
      volume: options.volume,
      pan: options.pan,
      loop: options.loop,
      groupId: options.groupId ?? 0
    } : undefined;
    const engine = this.engine;
    if (!engine) {
      this.emitError("play", undefined, "Audio engine unavailable during play");
      return null;
    }
    const result = this.lib.audioPlay(engine, sound, rawOptions);
    if (result.status !== 0 || result.voiceId == null) {
      this.emitError("play", result.status);
      return null;
    }
    return result.voiceId;
  }
  async playStream(source, options = {}) {
    const urlOptions = options;
    if (urlOptions.request !== undefined || urlOptions.reconnect !== undefined || urlOptions.metadataEncoding !== undefined || urlOptions.contentTypePolicy !== undefined) {
      return Promise.reject(new TypeError("request, reconnect, metadataEncoding, and contentTypePolicy options are only supported by playStreamUrl()"));
    }
    if (!isReadableStreamSource(source) && !isAsyncIterableSource(source)) {
      return Promise.reject(new TypeError("Audio stream source must be a ReadableStream or AsyncIterable"));
    }
    const { demuxer, ...streamOptions } = options;
    const connector = {
      async connect() {
        return { body: source, info: undefined };
      }
    };
    return this.openStream(connector, demuxer == null ? undefined : () => demuxer(), streamOptions, "source");
  }
  async playStreamUrl(source, options = {}) {
    if (options.demuxer !== undefined) {
      throw new TypeError("demuxer is only supported by playStream() and playStreamSource()");
    }
    if (typeof source !== "string" && Object.prototype.toString.call(source) !== "[object URL]") {
      return Promise.reject(new TypeError("Audio stream URL source must be a string or URL"));
    }
    const { request, metadataEncoding, reconnect, format, contentTypePolicy, ...streamOptions } = options;
    const resolvedFormat = resolveAudioStreamFormat(format);
    const resolvedContentTypePolicy = resolveContentTypePolicy(contentTypePolicy, options);
    const encoding = resolveMetadataEncoding(metadataEncoding);
    const connector = createAudioStreamUrlConnector(source, resolveAudioStreamRequest(request), resolvedFormat, resolvedContentTypePolicy);
    return this.openStream(connector, (info) => {
      try {
        return selectAudioStreamDemuxer({ headers: info.headers, metadataEncoding: encoding });
      } catch (cause) {
        throw new AudioStreamError(cause instanceof Error ? cause.message : "Invalid audio stream metadata response", { action: "response", status: info.status }, cause);
      }
    }, { ...streamOptions, reconnect, format: resolvedFormat }, "fetch");
  }
  async playStreamSource(connector, options = {}) {
    const urlOptions = options;
    if (urlOptions.request !== undefined || urlOptions.metadataEncoding !== undefined || urlOptions.contentTypePolicy !== undefined) {
      return Promise.reject(new TypeError("request, metadataEncoding, and contentTypePolicy are only supported by playStreamUrl()"));
    }
    const { demuxer, ...streamOptions } = options;
    return this.openStream(connector, demuxer, streamOptions, "source");
  }
  async openStream(connector, demuxer, options, readAction) {
    const engine = this.engine;
    if (!engine)
      throw new Error("Audio engine unavailable during stream playback");
    const resolvedConnector = resolveAudioStreamConnector(connector);
    let stream;
    stream = createAudioStream({
      lib: this.lib,
      engine,
      connector: resolvedConnector,
      demuxer,
      options,
      readAction,
      removeFromOwner: () => this.streams.delete(stream)
    });
    this.streams.add(stream);
    try {
      await openAudioStream(stream);
      return stream;
    } catch (error) {
      stream.dispose();
      throw error;
    }
  }
  stopVoice(voice) {
    const engine = this.engine;
    if (!engine) {
      this.emitError("stopVoice", undefined, "Audio engine unavailable during stopVoice");
      return false;
    }
    const status = this.lib.audioStopVoice(engine, voice);
    if (status !== 0) {
      this.emitError("stopVoice", status);
      return false;
    }
    return true;
  }
  setVoiceGroup(voice, group) {
    const engine = this.engine;
    if (!engine) {
      this.emitError("setVoiceGroup", undefined, "Audio engine unavailable during setVoiceGroup");
      return false;
    }
    const status = this.lib.audioSetVoiceGroup(engine, voice, group);
    if (status !== 0) {
      this.emitError("setVoiceGroup", status);
      return false;
    }
    return true;
  }
  setGroupVolume(group, volume) {
    const engine = this.engine;
    if (!engine) {
      this.emitError("setGroupVolume", undefined, "Audio engine unavailable during setGroupVolume");
      return false;
    }
    const status = this.lib.audioSetGroupVolume(engine, group, volume);
    if (status !== 0) {
      this.emitError("setGroupVolume", status);
      return false;
    }
    return true;
  }
  setMasterVolume(volume) {
    const engine = this.engine;
    if (!engine) {
      this.emitError("setMasterVolume", undefined, "Audio engine unavailable during setMasterVolume");
      return false;
    }
    const status = this.lib.audioSetMasterVolume(engine, volume);
    if (status !== 0) {
      this.emitError("setMasterVolume", status);
      return false;
    }
    return true;
  }
  mixFrames(frameCount, channels = 2) {
    const engine = this.engine;
    if (!engine) {
      this.emitError("mixFrames", undefined, "Audio engine unavailable during mixFrames");
      return null;
    }
    const output = new Float32Array(frameCount * channels);
    const status = this.lib.audioMixToBuffer(engine, output, frameCount, channels);
    if (status !== 0) {
      this.emitError("mixFrames", status);
      return null;
    }
    return output;
  }
  enableTap(capacityFrames = 8192) {
    const engine = this.engine;
    if (!engine) {
      this.emitError("enableTap", undefined, "Audio engine unavailable during enableTap");
      return false;
    }
    const status = this.lib.audioEnableTap(engine, true, capacityFrames);
    if (status !== 0) {
      this.emitError("enableTap", status);
      return false;
    }
    return true;
  }
  disableTap() {
    const engine = this.engine;
    if (!engine) {
      this.emitError("enableTap", undefined, "Audio engine unavailable during disableTap");
      return false;
    }
    const status = this.lib.audioEnableTap(engine, false, 0);
    if (status !== 0) {
      this.emitError("enableTap", status);
      return false;
    }
    return true;
  }
  readTapFrames(frameCount, channels = 2) {
    const engine = this.engine;
    if (!engine) {
      this.emitError("readTapFrames", undefined, "Audio engine unavailable during readTapFrames");
      return null;
    }
    const output = new Float32Array(frameCount * channels);
    const result = this.lib.audioReadTap(engine, output, frameCount, channels);
    if (result.status !== 0) {
      this.emitError("readTapFrames", result.status);
      return null;
    }
    return { frames: output, framesRead: result.framesRead };
  }
  listPlaybackDevices() {
    const engine = this.engine;
    if (!engine) {
      this.emitError("listPlaybackDevices", undefined, "Audio engine unavailable during listPlaybackDevices");
      return null;
    }
    const refreshStatus = this.lib.audioRefreshPlaybackDevices(engine);
    if (refreshStatus !== 0) {
      this.emitError("listPlaybackDevices", refreshStatus);
      return null;
    }
    const count = this.lib.audioGetPlaybackDeviceCount(engine);
    const devices = [];
    for (let index = 0;index < count; index += 1) {
      devices.push({
        index,
        name: this.lib.audioGetPlaybackDeviceName(engine, index),
        isDefault: this.lib.audioIsPlaybackDeviceDefault(engine, index)
      });
    }
    return devices;
  }
  selectPlaybackDevice(index) {
    const engine = this.engine;
    if (!engine) {
      this.emitError("selectPlaybackDevice", undefined, "Audio engine unavailable during selectPlaybackDevice");
      return false;
    }
    const refreshStatus = this.lib.audioRefreshPlaybackDevices(engine);
    if (refreshStatus !== 0) {
      this.emitError("selectPlaybackDevice", refreshStatus);
      return false;
    }
    const status = this.lib.audioSelectPlaybackDevice(engine, index);
    if (status !== 0) {
      this.emitError("selectPlaybackDevice", status);
      return false;
    }
    return true;
  }
  clearPlaybackDeviceSelection() {
    const engine = this.engine;
    if (!engine) {
      this.emitError("clearPlaybackDeviceSelection", undefined, "Audio engine unavailable during clearPlaybackDeviceSelection");
      return;
    }
    this.lib.audioClearPlaybackDeviceSelection(engine);
  }
  async openCapture(options = {}) {
    const resolved = resolveAudioCaptureStreamOptions(options, this.sampleRate);
    if (resolved.signal?.aborted)
      throw createAbortError();
    if (!this.engine) {
      throw new AudioCaptureStreamError("Audio engine unavailable during capture stream start", { action: "start" });
    }
    if (this.captureOwner != null || this.isCapturing()) {
      throw new AudioCaptureStreamError("Audio capture ring is already in use", { action: "start" });
    }
    const owner = {};
    this.captureOwner = owner;
    let stream = null;
    try {
      stream = createAudioCaptureStream({
        options: resolved,
        start: () => this.startCaptureInternal(resolved, owner),
        read: (frameCount) => this.readCaptureInternal(frameCount, owner),
        stats: () => this.getCaptureStatsInternal(owner),
        stop: () => this.stopCaptureInternal(owner),
        isRunning: () => this.isCapturingInternal(owner),
        removeFromOwner: () => {
          if (this.captureOwner === owner)
            this.captureOwner = null;
          if (this.captureStream === stream)
            this.captureStream = null;
          if (stream != null)
            this.streams.delete(stream);
        }
      });
      this.captureStream = stream;
      this.streams.add(stream);
      await openAudioCaptureStream(stream);
      return stream;
    } catch (error) {
      if (stream == null) {
        if (this.captureOwner === owner)
          this.captureOwner = null;
      } else {
        stream.dispose();
        if (this.captureOwner !== owner)
          this.streams.delete(stream);
      }
      throw error;
    }
  }
  async recordToFile(filePath, options = {}) {
    if (typeof filePath !== "string" || filePath.length === 0)
      throw new TypeError("filePath must be a nonempty string");
    if (filePath.includes("\x00"))
      throw new TypeError("filePath must not contain NUL bytes");
    const resolved = resolveAudioCaptureStreamOptions(options, this.sampleRate);
    if (resolved.channels !== 1 && resolved.channels !== 2) {
      throw new RangeError("WAV recording supports only 1 or 2 channels");
    }
    if (this.sampleRate * resolved.channels * 2 > MAX_U32) {
      throw new RangeError("WAV byte rate exceeds the supported limit");
    }
    if (resolved.signal?.aborted)
      throw createAbortError();
    if (!this.engine)
      throw new AudioRecorderError("Audio engine unavailable during recorder open", { action: "open" });
    let recorder;
    recorder = createAudioRecorder({
      filePath,
      signal: resolved.signal,
      captureOptions: resolved,
      openCapture: (captureOptions) => this.openCapture(captureOptions),
      removeFromOwner: () => this.streams.delete(recorder)
    });
    this.streams.add(recorder);
    try {
      await openAudioRecorder(recorder);
      return recorder;
    } catch (error) {
      throw error;
    }
  }
  listCaptureDevices() {
    const engine = this.engine;
    if (!engine) {
      this.emitError("listCaptureDevices", undefined, "Audio engine unavailable during listCaptureDevices");
      return null;
    }
    const refreshStatus = this.lib.audioRefreshCaptureDevices(engine);
    if (refreshStatus !== 0) {
      this.emitError("listCaptureDevices", refreshStatus);
      return null;
    }
    const count = this.lib.audioGetCaptureDeviceCount(engine);
    const devices = [];
    for (let index = 0;index < count; index += 1) {
      devices.push({
        index,
        name: this.lib.audioGetCaptureDeviceName(engine, index),
        isDefault: this.lib.audioIsCaptureDeviceDefault(engine, index)
      });
    }
    return devices;
  }
  selectCaptureDevice(index) {
    const resolvedIndex = resolveU32Index(index, "index");
    if (this.captureOwner != null) {
      this.emitCaptureOwnershipError("selectCaptureDevice");
      return false;
    }
    const engine = this.engine;
    if (!engine) {
      this.emitError("selectCaptureDevice", undefined, "Audio engine unavailable during selectCaptureDevice");
      return false;
    }
    const status = this.lib.audioSelectCaptureDevice(engine, resolvedIndex);
    if (status !== 0) {
      this.emitError("selectCaptureDevice", status);
      return false;
    }
    return true;
  }
  clearCaptureDeviceSelection() {
    if (this.captureOwner != null) {
      this.emitCaptureOwnershipError("clearCaptureDeviceSelection");
      return;
    }
    const engine = this.engine;
    if (!engine) {
      this.emitError("clearCaptureDeviceSelection", undefined, "Audio engine unavailable during clearCaptureDeviceSelection");
      return;
    }
    this.lib.audioClearCaptureDeviceSelection(engine);
  }
  startCapture(options = {}) {
    if (this.disposing)
      return false;
    const channels = resolvePositiveU32(options.channels, 1, "channels");
    const capacityFrames = resolvePositiveU32(options.capacityFrames, this.sampleRate, "capacityFrames");
    if (this.captureOwner != null) {
      this.emitCaptureOwnershipError("startCapture");
      return false;
    }
    if (this.isCapturing()) {
      const configurationMatches = (options.channels === undefined || channels === this.captureChannels) && (options.capacityFrames === undefined || capacityFrames === this.captureCapacityFrames) && options.startOptions === undefined;
      if (configurationMatches)
        return true;
      this.emitError("startCapture", undefined, "Audio capture is already running with a different configuration");
      return false;
    }
    const engine = this.engine;
    if (!engine) {
      this.emitError("startCapture", undefined, "Audio engine unavailable during startCapture");
      return false;
    }
    const result = this.startCaptureInternal({ sampleRate: this.sampleRate, channels, capacityFrames, chunkFrames: 1, startOptions: options.startOptions }, null);
    if (result.status !== 0) {
      this.emitError("startCapture", result.status, undefined, result.cause);
      return false;
    }
    return true;
  }
  isCapturing() {
    return this.isCapturingInternal(null);
  }
  isCapturingInternal(_owner) {
    if (!this.captureStarted)
      return false;
    const engine = this.engine;
    if (engine && this.lib.audioIsCaptureRunning(engine))
      return true;
    this.captureStarted = false;
    this.emit("captureStopped");
    return this.captureStarted;
  }
  readCaptureFrames(frameCount) {
    const resolvedFrameCount = resolvePositiveU32(frameCount, frameCount, "frameCount");
    if (this.captureOwner != null) {
      this.emitCaptureOwnershipError("readCaptureFrames");
      return null;
    }
    if (!this.captureBufferAvailable) {
      this.emitError("readCaptureFrames", -4);
      return null;
    }
    if (resolvedFrameCount > this.captureCapacityFrames) {
      throw new RangeError("frameCount exceeds the capture buffer capacity");
    }
    if (resolvedFrameCount > Math.floor(MAX_U32 / this.captureChannels)) {
      throw new RangeError("frameCount * channels exceeds the supported limit");
    }
    const engine = this.engine;
    if (!engine) {
      this.emitError("readCaptureFrames", undefined, "Audio engine unavailable during readCaptureFrames");
      return null;
    }
    const result = this.readCaptureInternal(resolvedFrameCount, null);
    if (result.status !== 0) {
      this.emitError("readCaptureFrames", result.status, undefined, result.cause);
      return null;
    }
    return { frames: result.frames, framesRead: result.framesRead };
  }
  getCaptureStats() {
    const engine = this.engine;
    if (!engine) {
      this.emitError("getCaptureStats", undefined, "Audio engine unavailable during getCaptureStats");
      return null;
    }
    const result = this.getCaptureStatsInternal(null);
    if (result.status !== 0 || result.stats == null) {
      this.emitError("getCaptureStats", result.status, undefined, result.cause);
      return null;
    }
    return result.stats;
  }
  stopCapture() {
    if (this.captureOwner != null) {
      this.emitCaptureOwnershipError("stopCapture");
      return false;
    }
    if (!this.captureDeviceOpen)
      return true;
    const engine = this.engine;
    if (!engine) {
      this.emitError("stopCapture", undefined, "Audio engine unavailable during stopCapture");
      return false;
    }
    const result = this.stopCaptureInternal(null);
    if (result.status !== 0) {
      this.emitError("stopCapture", result.status, undefined, result.cause);
      return false;
    }
    return true;
  }
  emitCaptureOwnershipError(action) {
    this.emitError(action, undefined, `Audio ${action} failed: capture is owned by a stream`);
  }
  startCaptureInternal(options, owner) {
    if (this.captureOwner != null && this.captureOwner !== owner)
      return { status: -1 };
    const engine = this.engine;
    if (!engine)
      return { status: -1 };
    let status;
    try {
      status = this.lib.audioStartCapture(engine, options.startOptions, options.channels, options.capacityFrames);
    } catch (cause) {
      return { status: -1, cause };
    }
    if (status !== 0)
      return { status };
    this.captureChannels = options.channels;
    this.captureCapacityFrames = options.capacityFrames;
    this.captureBufferAvailable = true;
    this.captureDeviceOpen = true;
    this.captureStarted = true;
    this.emit("captureStarted");
    return { status: 0 };
  }
  readCaptureInternal(frameCount, owner) {
    const output = new Float32Array(frameCount * this.captureChannels);
    if (this.captureOwner != null && this.captureOwner !== owner)
      return { status: -1, frames: output, framesRead: 0 };
    const engine = this.engine;
    if (!engine || !this.captureBufferAvailable)
      return { status: -4, frames: output, framesRead: 0 };
    try {
      const result = this.lib.audioReadCapture(engine, output, frameCount);
      return { status: result.status, frames: output, framesRead: Math.min(frameCount, result.framesRead) };
    } catch (cause) {
      return { status: -1, frames: output, framesRead: 0, cause };
    }
  }
  getCaptureStatsInternal(_owner) {
    const engine = this.engine;
    if (!engine)
      return { status: -1, stats: null };
    try {
      const result = this.lib.audioGetCaptureStats(engine);
      if (result.status !== 0 || result.stats == null)
        return { status: result.status, stats: null };
      return {
        status: 0,
        stats: {
          sampleRate: result.stats.sampleRate,
          channels: result.stats.channels,
          capacityFrames: result.stats.capacityFrames,
          bufferedFrames: result.stats.bufferedFrames,
          framesReceived: result.stats.framesReceived,
          framesRead: result.stats.framesRead,
          framesDropped: result.stats.framesDropped
        }
      };
    } catch (cause) {
      return { status: -1, stats: null, cause };
    }
  }
  stopCaptureInternal(owner) {
    if (this.captureOwner != null && this.captureOwner !== owner)
      return { status: -1 };
    if (!this.captureDeviceOpen)
      return { status: 0 };
    const engine = this.engine;
    if (!engine)
      return { status: -1 };
    let status;
    try {
      status = this.lib.audioStopCapture(engine);
    } catch (cause) {
      return { status: -1, cause };
    }
    if (status !== 0)
      return { status };
    const wasStarted = this.captureStarted;
    this.captureDeviceOpen = false;
    this.captureStarted = false;
    if (wasStarted)
      this.emit("captureStopped");
    return { status: 0 };
  }
  getStats() {
    const engine = this.engine;
    if (!engine) {
      this.emitError("getStats", undefined, "Audio engine unavailable during getStats");
      return null;
    }
    const stats = this.lib.audioGetStats(engine);
    if (stats == null) {
      this.emitError("getStats", undefined, "Failed to retrieve audio stats");
    }
    return stats;
  }
  dispose() {
    if (!this.engine || this.disposing)
      return;
    this.disposing = true;
    let firstError;
    let hasError = false;
    let childCleanupFailed = false;
    const runCleanup = (operation) => {
      try {
        operation();
      } catch (error) {
        if (!hasError) {
          firstError = error;
          hasError = true;
        }
      }
    };
    try {
      for (const stream of [...this.streams]) {
        try {
          stream.dispose();
        } catch (error) {
          childCleanupFailed = true;
          if (!hasError) {
            firstError = error;
            hasError = true;
          }
        }
      }
      if (this.captureDeviceOpen) {
        let result;
        runCleanup(() => {
          result = this.stopCaptureInternal(this.captureOwner);
        });
        if (result && result.status !== 0) {
          const wasStarted = this.captureStarted;
          this.captureDeviceOpen = false;
          this.captureStarted = false;
          runCleanup(() => this.emitError("stopCapture", result.status, undefined, result.cause));
          if (wasStarted)
            runCleanup(() => void this.emit("captureStopped"));
        }
      }
      if (this.captureStream != null) {
        runCleanup(() => refreshAudioCaptureStreamFinalStats(this.captureStream));
      }
      if (this.mixerStarted) {
        runCleanup(() => void this.stop());
      }
      this.groups.clear();
      const engine = this.engine;
      let engineDestroyed = false;
      if (!childCleanupFailed) {
        runCleanup(() => {
          this.lib.destroyAudioEngine(engine);
          engineDestroyed = true;
        });
      }
      if (engineDestroyed) {
        this.engine = null;
        this.captureStarted = false;
        this.captureDeviceOpen = false;
        this.captureBufferAvailable = false;
        this.captureCapacityFrames = 0;
        this.captureOwner = null;
        this.captureStream = null;
        runCleanup(() => void this.emit("disposed"));
      }
    } finally {
      this.disposing = false;
    }
    if (hasError)
      throw firstError;
  }
}
function setupAudio(options = {}) {
  return Audio.create(options);
}
// src/renderables/FrameBuffer.ts
class FrameBufferRenderable extends Renderable2 {
  static nativeIntegration = {
    kind: "custom",
    body: { native: this.prototype.renderSelf }
  };
  respectAlpha;
  constructor(ctx, options) {
    super(ctx, options);
    try {
      this.respectAlpha = options.respectAlpha || false;
      this.frameBuffer?.destroy();
      this.frameBuffer = OptimizedBuffer2.create(options.width, options.height, this._ctx.widthMethod, {
        respectAlpha: this.respectAlpha,
        id: options.id || `framebufferrenderable-${this.id}`,
        owner: ctx.nativeScene
      });
      this._refreshNativeSceneSurface();
    } catch (error) {
      this.abortConstruction(error);
    }
  }
  _refreshNativeSceneSurface() {
    if (Object.getOwnPropertyDescriptor(this, "frameBuffer")?.get)
      return;
    let surface = this.frameBuffer;
    this._ctx.nativeScene.setSurface(this, surface);
    Object.defineProperty(this, "frameBuffer", {
      enumerable: true,
      configurable: true,
      get: () => surface,
      set: (value) => {
        if (this.isDestroyed) {
          surface = null;
          return;
        }
        if (value === surface)
          return;
        this._ctx.nativeScene.setSurface(this, value);
        surface = value;
        this.requestRender();
      }
    });
  }
  onResize(width, height) {
    if (width <= 0 || height <= 0) {
      throw new Error(`Invalid resize dimensions for FrameBufferRenderable ${this.id}: ${width}x${height}`);
    }
    this.frameBuffer.resize(width, height);
    super.onResize(width, height);
    this.requestRender();
  }
  renderSelf(buffer) {
    if (!this.visible || this.isDestroyed)
      return;
    buffer.drawFrameBuffer(Math.trunc(this._screenX), Math.trunc(this._screenY), this.frameBuffer);
  }
}

// src/renderables/ASCIIFont.ts
class ASCIIFontRenderable extends FrameBufferRenderable {
  selectable = true;
  static _defaultOptions = {
    text: "",
    font: "tiny",
    color: "#FFFFFF",
    backgroundColor: "transparent",
    selectionBg: undefined,
    selectionFg: undefined,
    selectable: true
  };
  _text;
  _font;
  _color;
  _backgroundColor;
  _selectionBg;
  _selectionFg;
  lastLocalSelection = null;
  selectionHelper;
  constructor(ctx, options) {
    const defaultOptions = ASCIIFontRenderable._defaultOptions;
    const font = options.font || defaultOptions.font;
    const text = options.text || defaultOptions.text;
    const measurements = measureText2({ text, font });
    super(ctx, {
      flexShrink: 0,
      ...options,
      width: measurements.width || 1,
      height: measurements.height || 1,
      respectAlpha: true
    });
    try {
      this._text = text;
      this._font = font;
      const color = options.color || defaultOptions.color;
      this._color = Array.isArray(color) ? color.map((value) => RGBA2.clone(parseColor2(value))) : RGBA2.clone(parseColor2(color));
      this._backgroundColor = RGBA2.clone(parseColor2(options.backgroundColor || defaultOptions.backgroundColor));
      this._selectionBg = options.selectionBg ? RGBA2.clone(parseColor2(options.selectionBg)) : undefined;
      this._selectionFg = options.selectionFg ? RGBA2.clone(parseColor2(options.selectionFg)) : undefined;
      this.selectable = options.selectable ?? true;
      this.selectionHelper = new ASCIIFontSelectionHelper2(() => this._text, () => this._font);
      this.renderFontToBuffer();
    } catch (error) {
      this.abortConstruction(error);
    }
  }
  get text() {
    return this._text;
  }
  set text(value) {
    this._text = value;
    this.updateDimensions();
    if (this.lastLocalSelection) {
      this.selectionHelper.onLocalSelectionChanged(this.lastLocalSelection, this.width, this.height);
    }
    this.renderFontToBuffer();
    this.requestRender();
  }
  get font() {
    return this._font;
  }
  set font(value) {
    this._font = value;
    this.updateDimensions();
    if (this.lastLocalSelection) {
      this.selectionHelper.onLocalSelectionChanged(this.lastLocalSelection, this.width, this.height);
    }
    this.renderFontToBuffer();
    this.requestRender();
  }
  get color() {
    return Array.isArray(this._color) ? this._color.map((color) => RGBA2.clone(color)) : RGBA2.clone(this._color);
  }
  set color(value) {
    value ??= ASCIIFontRenderable._defaultOptions.color;
    this._color = Array.isArray(value) ? value.map((color) => RGBA2.clone(parseColor2(color))) : RGBA2.clone(parseColor2(value));
    this.renderFontToBuffer();
    this.requestRender();
  }
  get backgroundColor() {
    return RGBA2.clone(this._backgroundColor);
  }
  set backgroundColor(value) {
    this._backgroundColor = RGBA2.clone(parseColor2(value ?? ASCIIFontRenderable._defaultOptions.backgroundColor));
    this.renderFontToBuffer();
    this.requestRender();
  }
  defaultDimension(kind) {
    return measureText2({ text: this._text, font: this._font })[kind] || 1;
  }
  updateDimensions() {
    const measurements = measureText2({ text: this._text, font: this._font });
    this.width = measurements.width;
    this.height = measurements.height;
  }
  shouldStartSelection(x, y) {
    const localX = x - this.x;
    const localY = y - this.y;
    return this.selectionHelper.shouldStartSelection(localX, localY, this.width, this.height);
  }
  onSelectionChanged(selection) {
    const localSelection = convertGlobalToLocalSelection2(selection, Math.trunc(this.x), Math.trunc(this.y));
    this.lastLocalSelection = localSelection;
    const changed = this.selectionHelper.onLocalSelectionChanged(localSelection, this.width, this.height);
    if (changed) {
      this.renderFontToBuffer();
      this.requestRender();
    }
    return this.selectionHelper.hasSelection();
  }
  getSelectedText() {
    const selection = this.selectionHelper.getSelection();
    if (!selection)
      return "";
    return this._text.slice(selection.start, selection.end);
  }
  hasSelection() {
    return this.selectionHelper.hasSelection();
  }
  onResize(width, height) {
    super.onResize(width, height);
    this.renderFontToBuffer();
  }
  renderFontToBuffer() {
    if (this.isDestroyed)
      return;
    this.frameBuffer.clear(parseColor2(this._backgroundColor));
    renderFontToFrameBuffer2(this.frameBuffer, {
      text: this._text,
      x: 0,
      y: 0,
      color: this._color,
      backgroundColor: this._backgroundColor,
      font: this._font
    });
    const selection = this.selectionHelper.getSelection();
    if (selection && (this._selectionBg || this._selectionFg)) {
      this.renderSelectionHighlight(selection);
    }
  }
  renderSelectionHighlight(selection) {
    if (!this._selectionBg && !this._selectionFg)
      return;
    const selectedText = this._text.slice(selection.start, selection.end);
    if (!selectedText)
      return;
    const positions = getCharacterPositions2(this._text, this._font);
    const startX = positions[selection.start] || 0;
    const endX = selection.end < positions.length ? positions[selection.end] : measureText2({ text: this._text, font: this._font }).width;
    if (this._selectionBg) {
      this.frameBuffer.fillRect(startX, 0, endX - startX, this.height, parseColor2(this._selectionBg));
    }
    if (this._selectionFg || this._selectionBg) {
      renderFontToFrameBuffer2(this.frameBuffer, {
        text: selectedText,
        x: startX,
        y: 0,
        color: this._selectionFg ? this._selectionFg : this._color,
        backgroundColor: this._selectionBg ? this._selectionBg : this._backgroundColor,
        font: this._font
      });
    }
  }
}
// src/renderables/LineNumberRenderable.ts
var DEFAULT_GUTTER_FG = "#888888";
var DEFAULT_GUTTER_BG = "transparent";
var transparent = RGBA2.fromValues(0, 0, 0, 0);
function cloneLineSign(sign) {
  return {
    ...sign,
    beforeColor: typeof sign.beforeColor === "object" ? RGBA2.clone(sign.beforeColor) : sign.beforeColor,
    afterColor: typeof sign.afterColor === "object" ? RGBA2.clone(sign.afterColor) : sign.afterColor
  };
}

class GutterRenderable extends Renderable2 {
  target;
  _fg;
  _bg;
  _layout;
  _lineColorsGutter;
  _lineColorsContent;
  _lineSigns;
  _lineNumberOffset;
  _hideLineNumbers;
  _lineNumbers;
  _maxBeforeWidth = 0;
  _maxAfterWidth = 0;
  _lastKnownLineCount = 0;
  _signWidths = new Map;
  _signWidthMethod;
  constructor(ctx, target, options) {
    super(ctx, {
      id: options.id,
      width: "auto",
      height: "auto",
      flexGrow: 0,
      flexShrink: 0
    });
    try {
      this.target = target;
      this._fg = options.fg;
      this._bg = options.bg;
      this._layout = options.layout;
      this._lineColorsGutter = options.lineColorsGutter;
      this._lineColorsContent = options.lineColorsContent;
      this._lineSigns = options.lineSigns;
      this._lineNumberOffset = options.lineNumberOffset;
      this._hideLineNumbers = options.hideLineNumbers;
      this._lineNumbers = options.lineNumbers ?? new Map;
      this._lastKnownLineCount = this.target.virtualLineCount;
      this.calculateSignWidths();
      this.setupMeasureFunc();
      this.onLifecyclePass = () => {
        const currentLineCount = this.target.virtualLineCount;
        const signsStale = this._ctx.widthMethod !== this._signWidthMethod;
        if (signsStale)
          this.calculateSignWidths();
        if (currentLineCount !== this._lastKnownLineCount || signsStale) {
          this._lastKnownLineCount = currentLineCount;
          this.invalidateIntrinsicSize();
          this.requestRender();
        }
      };
    } catch (error) {
      this.abortConstruction(error);
    }
  }
  setupMeasureFunc() {
    const measureFunc = (width, widthMode, height, heightMode) => {
      const gutterWidth = this.calculateWidth();
      const gutterHeight = this.target.virtualLineCount;
      return {
        width: gutterWidth,
        height: gutterHeight
      };
    };
    this.setMeasureProvider(measureFunc);
  }
  remeasure() {
    this.invalidateIntrinsicSize();
    this.requestRender();
  }
  setLineNumberOffset(offset) {
    if (this._lineNumberOffset !== offset) {
      this._lineNumberOffset = offset;
      this.invalidateIntrinsicSize();
      this.requestRender();
    }
  }
  setHideLineNumbers(hideLineNumbers) {
    this._hideLineNumbers = hideLineNumbers;
    this.invalidateIntrinsicSize();
    this.requestRender();
  }
  setLineNumbers(lineNumbers) {
    this._lineNumbers = lineNumbers;
    this.invalidateIntrinsicSize();
    this.requestRender();
  }
  setLayout(layout) {
    this._layout = layout;
    this.calculateSignWidths();
    this.invalidateIntrinsicSize();
    this.requestRender();
  }
  calculateSignWidths() {
    this._maxBeforeWidth = 0;
    this._maxAfterWidth = this._layout.minAfterWidth;
    this._signWidths.clear();
    this._signWidthMethod = this._ctx.widthMethod;
    for (const sign of this._lineSigns.values()) {
      if (sign.before)
        this._maxBeforeWidth = Math.max(this._maxBeforeWidth, this.signWidth(sign.before));
      if (sign.after)
        this._maxAfterWidth = Math.max(this._maxAfterWidth, this.signWidth(sign.after));
    }
  }
  signWidth(sign) {
    if (/^[\x20-\x7e]*$/.test(sign))
      return sign.length;
    let width = this._signWidths.get(sign);
    if (width !== undefined)
      return width;
    const { context, renderLib } = this._ctx.nativeScene.driver;
    const unicode = renderLib.createContextUnicode(context, sign, this._signWidthMethod);
    try {
      width = renderLib.getContextUnicode(context, unicode).reduce((sum, glyph) => sum + glyph.width, 0);
    } finally {
      renderLib.destroyContextUnicode(context, unicode);
    }
    this._signWidths.set(sign, width);
    return width;
  }
  calculateWidth() {
    const totalLines = Math.max(this.target.lineCount, this.target.virtualLineCount);
    let maxLineNumber = totalLines + this._lineNumberOffset;
    if (this._lineNumbers.size > 0) {
      for (const customLineNum of this._lineNumbers.values()) {
        maxLineNumber = Math.max(maxLineNumber, customLineNum);
      }
    }
    const digits = Math.max(maxLineNumber > 0 ? Math.floor(Math.log10(maxLineNumber)) + 1 : 1, this._layout.minDigits);
    const baseWidth = Math.max(this._layout.minWidth, digits + this._layout.paddingLeft + this._layout.paddingRight);
    return baseWidth + this._maxBeforeWidth + this._maxAfterWidth;
  }
  setLineColors(lineColorsGutter, lineColorsContent) {
    this._lineColorsGutter = lineColorsGutter;
    this._lineColorsContent = lineColorsContent;
    this.requestRender();
  }
  get fg() {
    return RGBA2.clone(this._fg);
  }
  setFg(fg) {
    if (this._fg !== fg) {
      this._fg = fg;
      this.requestRender();
    }
  }
  get bg() {
    return RGBA2.clone(this._bg);
  }
  setBg(bg) {
    if (this._bg !== bg) {
      this._bg = bg;
      this.requestRender();
    }
  }
  getLineColors() {
    return {
      gutter: new Map(Array.from(this._lineColorsGutter, ([line, color]) => [line, RGBA2.clone(color)])),
      content: new Map(Array.from(this._lineColorsContent, ([line, color]) => [line, RGBA2.clone(color)]))
    };
  }
  setLineSigns(lineSigns) {
    const oldMaxBefore = this._maxBeforeWidth;
    const oldMaxAfter = this._maxAfterWidth;
    this._lineSigns = lineSigns;
    this.calculateSignWidths();
    if (this._maxBeforeWidth !== oldMaxBefore || this._maxAfterWidth !== oldMaxAfter) {
      this.invalidateIntrinsicSize();
    }
    this.requestRender();
  }
  getLineSigns() {
    return this._lineSigns;
  }
  renderSelf(buffer) {
    const [x, y] = this._paintOrigin(buffer);
    const start = Math.max(0, -y);
    const end = Math.min(this.height, buffer.height - y);
    if (end <= start || x >= buffer.width || x + this.width <= 0)
      return;
    const [top, rows] = textRows(this._ctx.nativeScene, this.target);
    const from = Math.max(start, top);
    const to = Math.max(from, Math.min(end, top + rows));
    for (let row = start;row < end; row++)
      if (row < from || row >= to)
        buffer.fillRect(x, y + row, this.width, 1, this._bg);
    const startLine = Math.trunc(this.target.scrollY) + from - top;
    const sourceStart = Math.max(0, startLine - 1);
    const sourceOffset = startLine - sourceStart;
    const sources = getLineSources(this.target, sourceStart, to - from + sourceOffset);
    let lastSource = sourceOffset > 0 ? sources[0] : -1;
    for (let i = sourceOffset;i < to - from + sourceOffset; i++) {
      const row = y + from + i - sourceOffset;
      const logicalLine = sources[i];
      const lineBg = this._lineColorsGutter.get(logicalLine);
      if (!lineBg || lineBg.a < 1)
        buffer.fillRect(x, row, this.width, 1, this._bg);
      if (lineBg)
        buffer.fillRect(x, row, this.width, 1, lineBg);
      if (logicalLine !== undefined && logicalLine !== lastSource) {
        const sign = this._lineSigns.get(logicalLine);
        if (sign?.before) {
          const beforeX = x + this._maxBeforeWidth - this.signWidth(sign.before);
          const beforeColor = sign.beforeColor ? parseColor2(sign.beforeColor) : this._fg;
          buffer.drawText(sign.before, beforeX, row, beforeColor, transparent);
        }
        if (!this._hideLineNumbers.has(logicalLine)) {
          const customLineNum = this._lineNumbers.get(logicalLine);
          const lineNumStr = (customLineNum ?? logicalLine + 1 + this._lineNumberOffset).toString();
          const lineNumX = this.width - this._maxAfterWidth - this._layout.paddingRight - lineNumStr.length;
          if (lineNumX >= this._maxBeforeWidth + this._layout.paddingLeft) {
            buffer.drawText(lineNumStr, x + lineNumX, row, this._fg, transparent);
          }
        }
        if (sign?.after) {
          const afterX = x + this.width - this._layout.paddingRight - this._maxAfterWidth;
          const afterColor = sign.afterColor ? parseColor2(sign.afterColor) : this._fg;
          buffer.drawText(sign.after, afterX, row, afterColor, transparent);
        }
      }
      lastSource = logicalLine;
    }
  }
}
function textRows(scene, target) {
  const box = scene.getLayout(target, "paint");
  const content = scene.getLayout(target, "content");
  return [Math.trunc(content.screenY) - Math.trunc(box.screenY), content.height];
}
function getLineSources(target, startLine, lineCount) {
  return target.getLineSources ? target.getLineSources(startLine, lineCount) : target.lineInfo.lineSources.slice(startLine, startLine + lineCount);
}
function darkenColor(color) {
  return RGBA2.fromValues(color.r * 0.8, color.g * 0.8, color.b * 0.8, color.a);
}

class LineNumberRenderable extends Renderable2 {
  gutter = null;
  target = null;
  _lineColorsGutter;
  _lineColorsContent;
  _lineSigns;
  _fg;
  _bg;
  _layout;
  _lineNumberOffset;
  _hideLineNumbers;
  _lineNumbers;
  _isDestroying = false;
  handleLineInfoChange = () => {
    this.gutter?.remeasure();
    this.requestRender();
  };
  parseLineColor(line, color) {
    if (typeof color === "object" && "gutter" in color) {
      const config = color;
      if (config.gutter) {
        this._lineColorsGutter.set(line, RGBA2.clone(parseColor2(config.gutter)));
      }
      if (config.content) {
        this._lineColorsContent.set(line, RGBA2.clone(parseColor2(config.content)));
      } else if (config.gutter) {
        this._lineColorsContent.set(line, darkenColor(parseColor2(config.gutter)));
      }
    } else {
      const parsedColor = RGBA2.clone(parseColor2(color));
      this._lineColorsGutter.set(line, parsedColor);
      this._lineColorsContent.set(line, darkenColor(parsedColor));
    }
  }
  constructor(ctx, options) {
    super(ctx, {
      ...options,
      flexDirection: "row",
      height: "auto"
    });
    try {
      this._fg = RGBA2.clone(parseColor2(options.fg ?? DEFAULT_GUTTER_FG));
      this._bg = RGBA2.clone(parseColor2(options.bg ?? DEFAULT_GUTTER_BG));
      this._layout = {
        minWidth: options.minWidth ?? 3,
        paddingLeft: 1,
        paddingRight: options.paddingRight ?? 1,
        minDigits: 0,
        minAfterWidth: 0
      };
      this._lineNumberOffset = options.lineNumberOffset ?? 0;
      this._hideLineNumbers = options.hideLineNumbers ?? new Set;
      this._lineNumbers = options.lineNumbers ?? new Map;
      this._lineColorsGutter = new Map;
      this._lineColorsContent = new Map;
      if (options.lineColors) {
        for (const [line, color] of options.lineColors) {
          this.parseLineColor(line, color);
        }
      }
      this._lineSigns = new Map;
      if (options.lineSigns) {
        for (const [line, sign] of options.lineSigns) {
          this._lineSigns.set(line, cloneLineSign(sign));
        }
      }
      if (options.target && !this.setTarget(options.target)) {
        throw new Error("LineNumberRenderable: Cannot use a destroyed target.");
      }
    } catch (error) {
      try {
        this.clearTarget();
      } catch {}
      this.abortConstruction(error);
    }
  }
  setTarget(target) {
    if (this.isDestroyed || target.isDestroyed)
      return false;
    this.target = target;
    try {
      target.on("line-info-change", this.handleLineInfoChange);
      this.gutter = new GutterRenderable(this.ctx, target, {
        fg: this._fg,
        bg: this._bg,
        layout: this._layout,
        lineColorsGutter: this._lineColorsGutter,
        lineColorsContent: this._lineColorsContent,
        lineSigns: this._lineSigns,
        lineNumberOffset: this._lineNumberOffset,
        hideLineNumbers: this._hideLineNumbers,
        lineNumbers: this._lineNumbers,
        id: this.id ? `${this.id}-gutter` : undefined
      });
      if (super.add(this.gutter) < 0 || super.add(target) < 0) {
        throw new Error("LineNumberRenderable: Failed to attach target.");
      }
      return true;
    } catch (error) {
      try {
        this.clearTarget();
      } catch {}
      throw error;
    }
  }
  add(child) {
    if (this.isDestroyed)
      return -1;
    if (!this.target && "lineInfo" in child && "lineCount" in child && "virtualLineCount" in child && "scrollY" in child) {
      return this.setTarget(child) ? this.getChildrenCount() - 1 : -1;
    }
    return -1;
  }
  remove(child) {
    if (this._isDestroying) {
      super.remove(child);
      return;
    }
    if (this.gutter && child === this.gutter) {
      if (this.gutter.isDestroyed) {
        this.clearTarget();
        return;
      }
      throw new Error("LineNumberRenderable: Cannot remove gutter directly.");
    }
    if (this.target && child === this.target) {
      if (this.target.isDestroyed) {
        this.clearTarget();
        return;
      }
      throw new Error("LineNumberRenderable: Cannot remove target directly. Use clearTarget() instead.");
    }
    super.remove(child);
  }
  destroy() {
    if (this.isDestroyed)
      return;
    this.assertMutable();
    this._isDestroying = true;
    super.destroy();
  }
  destroyRecursively() {
    if (this.isDestroyed)
      return;
    this.assertMutable();
    this._isDestroying = true;
    super.destroyRecursively();
  }
  destroySelf() {
    const gutter = this.gutter;
    this.runCleanup((run) => {
      run(() => this.target?.off("line-info-change", this.handleLineInfoChange));
      this.gutter = null;
      this.target = null;
      if (gutter && !gutter.isDestroyed)
        run(() => gutter.destroy());
    });
  }
  clearTarget() {
    const target = this.target;
    const gutter = this.gutter;
    if (!target && !gutter)
      return;
    this.assertMutable();
    this.runCleanup((run) => {
      if (target) {
        run(() => target.off("line-info-change", this.handleLineInfoChange));
        if (target.parent === this)
          run(() => super.remove(target));
        this.target = null;
      }
      if (gutter) {
        if (gutter.parent === this)
          run(() => super.remove(gutter));
        this.gutter = null;
        run(() => gutter.destroy());
      }
    });
  }
  renderSelf(buffer) {
    if (!this.target || !this.gutter || this._lineColorsContent.size === 0)
      return;
    const [x, y] = this._paintOrigin(buffer);
    const start = Math.max(0, -y);
    const end = Math.min(this.height, buffer.height - y);
    if (end <= start || x >= buffer.width || x + this.width <= 0)
      return;
    const [top, rows] = textRows(this._ctx.nativeScene, this.target);
    const from = Math.max(start, top);
    const sources = getLineSources(this.target, Math.trunc(this.target.scrollY) + from - top, Math.max(0, Math.min(end, top + rows) - from));
    const gutterWidth = this.gutter.visible ? this.gutter.width : 0;
    const contentWidth = this.width - gutterWidth;
    for (let i = 0;i < sources.length; i++) {
      const logicalLine = sources[i];
      const lineBg = this._lineColorsContent.get(logicalLine);
      if (lineBg) {
        buffer.fillRect(x + gutterWidth, y + from + i, contentWidth, 1, lineBg);
      }
    }
  }
  set showLineNumbers(value) {
    if (this.gutter) {
      this.gutter.visible = value;
    }
  }
  get showLineNumbers() {
    return this.gutter?.visible ?? false;
  }
  get fg() {
    return RGBA2.clone(this._fg);
  }
  set fg(value) {
    const parsed = RGBA2.clone(parseColor2(value ?? DEFAULT_GUTTER_FG));
    this._fg = parsed;
    this.gutter?.setFg(parsed);
  }
  get bg() {
    return RGBA2.clone(this._bg);
  }
  set bg(value) {
    const parsed = RGBA2.clone(parseColor2(value ?? DEFAULT_GUTTER_BG));
    this._bg = parsed;
    this.gutter?.setBg(parsed);
  }
  setLineColor(line, color) {
    this.parseLineColor(line, color);
    if (this.gutter) {
      this.gutter.setLineColors(this._lineColorsGutter, this._lineColorsContent);
    }
  }
  clearLineColor(line) {
    this._lineColorsGutter.delete(line);
    this._lineColorsContent.delete(line);
    if (this.gutter) {
      this.gutter.setLineColors(this._lineColorsGutter, this._lineColorsContent);
    }
  }
  clearAllLineColors() {
    this._lineColorsGutter.clear();
    this._lineColorsContent.clear();
    if (this.gutter) {
      this.gutter.setLineColors(this._lineColorsGutter, this._lineColorsContent);
    }
  }
  setLineColors(lineColors) {
    this._lineColorsGutter.clear();
    this._lineColorsContent.clear();
    for (const [line, color] of lineColors) {
      this.parseLineColor(line, color);
    }
    if (this.gutter) {
      this.gutter.setLineColors(this._lineColorsGutter, this._lineColorsContent);
    }
  }
  getLineColors() {
    return {
      gutter: new Map(Array.from(this._lineColorsGutter, ([line, color]) => [line, RGBA2.clone(color)])),
      content: new Map(Array.from(this._lineColorsContent, ([line, color]) => [line, RGBA2.clone(color)]))
    };
  }
  setLineSign(line, sign) {
    this._lineSigns.set(line, cloneLineSign(sign));
    if (this.gutter) {
      this.gutter.setLineSigns(this._lineSigns);
    }
  }
  clearLineSign(line) {
    this._lineSigns.delete(line);
    if (this.gutter) {
      this.gutter.setLineSigns(this._lineSigns);
    }
  }
  clearAllLineSigns() {
    this._lineSigns.clear();
    if (this.gutter) {
      this.gutter.setLineSigns(this._lineSigns);
    }
  }
  setLineSigns(lineSigns) {
    const signs = Array.from(lineSigns, ([line, sign]) => [line, cloneLineSign(sign)]);
    this._lineSigns.clear();
    for (const [line, sign] of signs) {
      this._lineSigns.set(line, sign);
    }
    if (this.gutter) {
      this.gutter.setLineSigns(this._lineSigns);
    }
  }
  getLineSigns() {
    return new Map(Array.from(this._lineSigns, ([line, sign]) => [line, cloneLineSign(sign)]));
  }
  getGutterLayout() {
    return { ...this._layout };
  }
  setGutterLayout(layout) {
    if (layout.minWidth === this._layout.minWidth && layout.paddingLeft === this._layout.paddingLeft && layout.paddingRight === this._layout.paddingRight && layout.minDigits === this._layout.minDigits && layout.minAfterWidth === this._layout.minAfterWidth)
      return;
    this._layout = { ...layout };
    this.gutter?.setLayout(this._layout);
  }
  set lineNumberOffset(value) {
    if (this._lineNumberOffset !== value) {
      this._lineNumberOffset = value;
      if (this.gutter) {
        this.gutter.setLineNumberOffset(value);
      }
    }
  }
  get lineNumberOffset() {
    return this._lineNumberOffset;
  }
  setHideLineNumbers(hideLineNumbers) {
    this._hideLineNumbers = hideLineNumbers;
    if (this.gutter) {
      this.gutter.setHideLineNumbers(hideLineNumbers);
    }
  }
  getHideLineNumbers() {
    return this._hideLineNumbers;
  }
  setLineNumbers(lineNumbers) {
    this._lineNumbers = lineNumbers;
    if (this.gutter) {
      this.gutter.setLineNumbers(lineNumbers);
    }
  }
  getLineNumbers() {
    return this._lineNumbers;
  }
  highlightLines(startLine, endLine, color) {
    for (let i = startLine;i <= endLine; i++) {
      this.parseLineColor(i, color);
    }
    if (this.gutter) {
      this.gutter.setLineColors(this._lineColorsGutter, this._lineColorsContent);
    }
  }
  clearHighlightLines(startLine, endLine) {
    for (let i = startLine;i <= endLine; i++) {
      this._lineColorsGutter.delete(i);
      this._lineColorsContent.delete(i);
    }
    if (this.gutter) {
      this.gutter.setLineColors(this._lineColorsGutter, this._lineColorsContent);
    }
  }
}
// ../../node_modules/.bun/diff@9.0.0/node_modules/diff/libesm/patch/parse.js
function parsePatch(uniDiff) {
  const diffstr = uniDiff.split(/\n/), list = [];
  let i = 0;
  function isGitDiffHeader(line) {
    return /^diff --git /.test(line);
  }
  function isDiffHeader(line) {
    return isGitDiffHeader(line) || /^Index:\s/.test(line) || /^diff(?: -r \w+)+\s/.test(line);
  }
  function isFileHeader(line) {
    return /^(---|\+\+\+)\s/.test(line);
  }
  function isHunkHeader(line) {
    return /^@@\s/.test(line);
  }
  function parseIndex() {
    var _a;
    const index = {};
    index.hunks = [];
    list.push(index);
    let seenDiffHeader = false;
    while (i < diffstr.length) {
      const line = diffstr[i];
      if (isFileHeader(line) || isHunkHeader(line)) {
        break;
      }
      if (isGitDiffHeader(line)) {
        if (seenDiffHeader) {
          return;
        }
        seenDiffHeader = true;
        index.isGit = true;
        const paths = parseGitDiffHeader(line);
        if (paths) {
          index.oldFileName = paths.oldFileName;
          index.newFileName = paths.newFileName;
        }
        i++;
        while (i < diffstr.length) {
          const extLine = diffstr[i];
          if (isFileHeader(extLine) || isHunkHeader(extLine) || isDiffHeader(extLine)) {
            break;
          }
          const renameFromMatch = /^rename from (.*)/.exec(extLine);
          if (renameFromMatch) {
            index.oldFileName = "a/" + unquoteIfQuoted(renameFromMatch[1]);
            index.isRename = true;
          }
          const renameToMatch = /^rename to (.*)/.exec(extLine);
          if (renameToMatch) {
            index.newFileName = "b/" + unquoteIfQuoted(renameToMatch[1]);
            index.isRename = true;
          }
          const copyFromMatch = /^copy from (.*)/.exec(extLine);
          if (copyFromMatch) {
            index.oldFileName = "a/" + unquoteIfQuoted(copyFromMatch[1]);
            index.isCopy = true;
          }
          const copyToMatch = /^copy to (.*)/.exec(extLine);
          if (copyToMatch) {
            index.newFileName = "b/" + unquoteIfQuoted(copyToMatch[1]);
            index.isCopy = true;
          }
          const newFileModeMatch = /^new file mode (\d+)/.exec(extLine);
          if (newFileModeMatch) {
            index.isCreate = true;
            index.newMode = newFileModeMatch[1];
          }
          const deletedFileModeMatch = /^deleted file mode (\d+)/.exec(extLine);
          if (deletedFileModeMatch) {
            index.isDelete = true;
            index.oldMode = deletedFileModeMatch[1];
          }
          const oldModeMatch = /^old mode (\d+)/.exec(extLine);
          if (oldModeMatch) {
            index.oldMode = oldModeMatch[1];
          }
          const newModeMatch = /^new mode (\d+)/.exec(extLine);
          if (newModeMatch) {
            index.newMode = newModeMatch[1];
          }
          if (/^Binary files /.test(extLine)) {
            index.isBinary = true;
          }
          i++;
        }
        continue;
      } else if (isDiffHeader(line)) {
        if (seenDiffHeader) {
          return;
        }
        seenDiffHeader = true;
        const headerMatch = /^(?:Index:|diff(?: -r \w+)+)\s+/.exec(line);
        if (headerMatch) {
          index.index = line.substring(headerMatch[0].length).trim();
        }
      }
      i++;
    }
    parseFileHeader(index);
    parseFileHeader(index);
    if (index.oldFileName === undefined !== (index.newFileName === undefined)) {
      throw new Error("Missing " + (index.oldFileName !== undefined ? '"+++ ..."' : '"--- ..."') + " file header for " + ((_a = index.oldFileName) !== null && _a !== undefined ? _a : index.newFileName));
    }
    while (i < diffstr.length) {
      const line = diffstr[i];
      if (isDiffHeader(line) || isFileHeader(line) || /^===================================================================/.test(line)) {
        break;
      } else if (isHunkHeader(line)) {
        index.hunks.push(parseHunk());
      } else {
        i++;
      }
    }
  }
  function parseGitDiffHeader(line) {
    const rest = line.substring("diff --git ".length);
    if (rest.startsWith('"')) {
      const oldPath = parseQuotedFileName(rest);
      if (oldPath === null) {
        return null;
      }
      const afterOld = rest.substring(oldPath.rawLength + 1);
      let newFileName;
      if (afterOld.startsWith('"')) {
        const newPath = parseQuotedFileName(afterOld);
        if (newPath === null) {
          return null;
        }
        newFileName = newPath.fileName;
      } else {
        newFileName = afterOld;
      }
      return {
        oldFileName: oldPath.fileName,
        newFileName
      };
    }
    const quoteIdx = rest.indexOf('"');
    if (quoteIdx > 0) {
      const oldFileName = rest.substring(0, quoteIdx - 1);
      const newPath = parseQuotedFileName(rest.substring(quoteIdx));
      if (newPath === null) {
        return null;
      }
      return {
        oldFileName,
        newFileName: newPath.fileName
      };
    }
    if (rest.startsWith("a/")) {
      const splits = [];
      let idx = 0;
      while (true) {
        idx = rest.indexOf(" b/", idx + 1);
        if (idx === -1) {
          break;
        }
        splits.push(idx);
      }
      if (splits.length > 0) {
        const mid = splits[Math.floor(splits.length / 2)];
        return {
          oldFileName: rest.substring(0, mid),
          newFileName: rest.substring(mid + 1)
        };
      }
    }
    return null;
  }
  function unquoteIfQuoted(s) {
    if (s.startsWith('"')) {
      const parsed = parseQuotedFileName(s);
      if (parsed) {
        return parsed.fileName;
      }
    }
    return s;
  }
  function parseQuotedFileName(s) {
    if (!s.startsWith('"')) {
      return null;
    }
    let result = "";
    let j = 1;
    while (j < s.length) {
      if (s[j] === '"') {
        return { fileName: result, rawLength: j + 1 };
      }
      if (s[j] === "\\" && j + 1 < s.length) {
        j++;
        switch (s[j]) {
          case "a":
            result += "\x07";
            break;
          case "b":
            result += "\b";
            break;
          case "f":
            result += "\f";
            break;
          case "n":
            result += `
`;
            break;
          case "r":
            result += "\r";
            break;
          case "t":
            result += "\t";
            break;
          case "v":
            result += "\v";
            break;
          case "\\":
            result += "\\";
            break;
          case '"':
            result += '"';
            break;
          case "0":
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
          case "7": {
            if (j + 2 >= s.length || s[j + 1] < "0" || s[j + 1] > "7" || s[j + 2] < "0" || s[j + 2] > "7") {
              return null;
            }
            const bytes = [parseInt(s.substring(j, j + 3), 8)];
            j += 3;
            while (s[j] === "\\" && s[j + 1] >= "0" && s[j + 1] <= "7") {
              if (j + 3 >= s.length || s[j + 2] < "0" || s[j + 2] > "7" || s[j + 3] < "0" || s[j + 3] > "7") {
                return null;
              }
              bytes.push(parseInt(s.substring(j + 1, j + 4), 8));
              j += 4;
            }
            result += new TextDecoder("utf-8").decode(new Uint8Array(bytes));
            continue;
          }
          default:
            return null;
        }
      } else {
        result += s[j];
      }
      j++;
    }
    return null;
  }
  function parseFileHeader(index) {
    const fileHeaderMatch = /^(---|\+\+\+)\s+/.exec(diffstr[i]);
    if (fileHeaderMatch) {
      const prefix = fileHeaderMatch[1], data = diffstr[i].substring(3).trim().split("\t", 2), header = (data[1] || "").trim();
      let fileName = data[0];
      if (fileName.startsWith('"')) {
        fileName = unquoteIfQuoted(fileName);
      } else {
        fileName = fileName.replace(/\\\\/g, "\\");
      }
      if (prefix === "---") {
        index.oldFileName = fileName;
        index.oldHeader = header;
      } else {
        index.newFileName = fileName;
        index.newHeader = header;
      }
      i++;
    }
  }
  function parseHunk() {
    var _a;
    const chunkHeaderIndex = i, chunkHeaderLine = diffstr[i++], chunkHeader = chunkHeaderLine.split(/@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/);
    const hunk = {
      oldStart: +chunkHeader[1],
      oldLines: typeof chunkHeader[2] === "undefined" ? 1 : +chunkHeader[2],
      newStart: +chunkHeader[3],
      newLines: typeof chunkHeader[4] === "undefined" ? 1 : +chunkHeader[4],
      lines: []
    };
    if (hunk.oldLines === 0) {
      hunk.oldStart += 1;
    }
    if (hunk.newLines === 0) {
      hunk.newStart += 1;
    }
    let addCount = 0, removeCount = 0;
    for (;i < diffstr.length && (removeCount < hunk.oldLines || addCount < hunk.newLines || ((_a = diffstr[i]) === null || _a === undefined ? undefined : _a.startsWith("\\"))); i++) {
      const operation = diffstr[i].length == 0 && i != diffstr.length - 1 ? " " : diffstr[i][0];
      if (operation === "+" || operation === "-" || operation === " " || operation === "\\") {
        hunk.lines.push(diffstr[i]);
        if (operation === "+") {
          addCount++;
        } else if (operation === "-") {
          removeCount++;
        } else if (operation === " ") {
          addCount++;
          removeCount++;
        }
      } else {
        throw new Error(`Hunk at line ${chunkHeaderIndex + 1} contained invalid line ${diffstr[i]}`);
      }
    }
    if (!addCount && hunk.newLines === 1) {
      hunk.newLines = 0;
    }
    if (!removeCount && hunk.oldLines === 1) {
      hunk.oldLines = 0;
    }
    if (addCount !== hunk.newLines) {
      throw new Error("Added line count did not match for hunk at line " + (chunkHeaderIndex + 1));
    }
    if (removeCount !== hunk.oldLines) {
      throw new Error("Removed line count did not match for hunk at line " + (chunkHeaderIndex + 1));
    }
    if (i < diffstr.length && diffstr[i] && /^[+ -]/.test(diffstr[i]) && !isFileHeader(diffstr[i])) {
      throw new Error("Hunk at line " + (chunkHeaderIndex + 1) + " has more lines than expected (expected " + hunk.oldLines + " old lines and " + hunk.newLines + " new lines)");
    }
    return hunk;
  }
  while (i < diffstr.length) {
    parseIndex();
  }
  return list;
}
// src/renderables/Diff.ts
var SIGN_WIDTH = 2;
var defaultColors = {
  lineNumberFg: "#888888",
  lineNumberBg: "transparent",
  addedBg: "#1a4d1a",
  removedBg: "#4d1a1a",
  contextBg: "transparent",
  addedSignColor: "#22c55e",
  removedSignColor: "#ef4444",
  addedLineNumberBg: "transparent",
  removedLineNumberBg: "transparent"
};

class DiffRenderable extends Renderable2 {
  static nativeIntegration = {
    ...Renderable2.nativeIntegration
  };
  _diff;
  _syncScroll = false;
  _view;
  _parsedDiff = null;
  _parseError = null;
  _hunkStartLines = [];
  _hunkRowOffsets = null;
  _fg;
  _filetype;
  _syntaxStyle;
  fallbackSyntaxStyle;
  _wrapMode;
  _conceal;
  _selectionBg;
  _selectionFg;
  _treeSitterClient;
  _showLineNumbers;
  _lineNumberFg;
  _lineNumberBg;
  _gutter;
  _addedBg;
  _removedBg;
  _contextBg;
  _addedContentBg;
  _removedContentBg;
  _contextContentBg;
  _addedSignColor;
  _removedSignColor;
  _addedLineNumberBg;
  _removedLineNumberBg;
  leftSide = null;
  rightSide = null;
  leftSideAdded = false;
  rightSideAdded = false;
  leftCodeRenderable = null;
  rightCodeRenderable = null;
  pendingRebuild = false;
  _lastCodeWidths = [0, 0];
  errorTextRenderable = null;
  errorCodeRenderable = null;
  _waitingForHighlight = false;
  _lineInfoChangeHandler = null;
  constructor(ctx, options) {
    super(ctx, {
      ...options,
      flexDirection: options.view === "split" ? "row" : "column"
    });
    try {
      this._diff = options.diff ?? "";
      this._syncScroll = options.syncScroll ?? false;
      this._view = options.view ?? "unified";
      this._fg = options.fg ? RGBA2.clone(parseColor2(options.fg)) : undefined;
      this._filetype = options.filetype;
      this._syntaxStyle = options.syntaxStyle;
      this._wrapMode = options.wrapMode;
      this._conceal = options.conceal ?? false;
      this._selectionBg = options.selectionBg ? RGBA2.clone(parseColor2(options.selectionBg)) : undefined;
      this._selectionFg = options.selectionFg ? RGBA2.clone(parseColor2(options.selectionFg)) : undefined;
      this._treeSitterClient = options.treeSitterClient;
      this._showLineNumbers = options.showLineNumbers ?? true;
      this._lineNumberFg = RGBA2.clone(parseColor2(options.lineNumberFg ?? defaultColors.lineNumberFg));
      this._lineNumberBg = RGBA2.clone(parseColor2(options.lineNumberBg ?? defaultColors.lineNumberBg));
      this._gutter = { ...options.gutter };
      this._addedBg = RGBA2.clone(parseColor2(options.addedBg ?? defaultColors.addedBg));
      this._removedBg = RGBA2.clone(parseColor2(options.removedBg ?? defaultColors.removedBg));
      this._contextBg = RGBA2.clone(parseColor2(options.contextBg ?? defaultColors.contextBg));
      this._addedContentBg = options.addedContentBg ? RGBA2.clone(parseColor2(options.addedContentBg)) : null;
      this._removedContentBg = options.removedContentBg ? RGBA2.clone(parseColor2(options.removedContentBg)) : null;
      this._contextContentBg = options.contextContentBg ? RGBA2.clone(parseColor2(options.contextContentBg)) : null;
      this._addedSignColor = RGBA2.clone(parseColor2(options.addedSignColor ?? defaultColors.addedSignColor));
      this._removedSignColor = RGBA2.clone(parseColor2(options.removedSignColor ?? defaultColors.removedSignColor));
      this._addedLineNumberBg = RGBA2.clone(parseColor2(options.addedLineNumberBg ?? defaultColors.addedLineNumberBg));
      this._removedLineNumberBg = RGBA2.clone(parseColor2(options.removedLineNumberBg ?? defaultColors.removedLineNumberBg));
      if (this._diff) {
        this.parseDiff();
        this.buildView();
      }
    } catch (error) {
      this.rollbackConstruction(error);
    }
  }
  parseDiff() {
    if (!this._diff) {
      this._parsedDiff = null;
      this._parseError = null;
      return;
    }
    try {
      const patches = parsePatch(this._diff);
      if (patches.length === 0) {
        this._parsedDiff = null;
        this._parseError = null;
        return;
      }
      this._parsedDiff = patches[0];
      this._parseError = null;
    } catch (error) {
      this._parsedDiff = null;
      this._parseError = error instanceof Error ? error : new Error(String(error));
    }
  }
  buildView() {
    if (this.isDestroyed)
      return;
    this._hunkStartLines = [];
    this.invalidateHunkRowOffsets();
    if (this._parseError) {
      this.buildErrorView();
      return;
    }
    if (!this._parsedDiff || this._parsedDiff.hunks.length === 0) {
      return;
    }
    if (this._view === "unified") {
      this.buildUnifiedView();
    } else {
      this.buildSplitView();
    }
  }
  onMouseEvent(event) {
    if (event.type !== "scroll" || this._view !== "split" || !this._syncScroll)
      return;
    if (!this.leftCodeRenderable || !this.rightCodeRenderable)
      return;
    if (!event.target)
      return;
    if (this.isInsideSide(event.target, "left")) {
      this.rightCodeRenderable.scrollY = this.leftCodeRenderable.scrollY;
      this.rightCodeRenderable.scrollX = this.leftCodeRenderable.scrollX;
    } else if (this.isInsideSide(event.target, "right")) {
      this.leftCodeRenderable.scrollY = this.rightCodeRenderable.scrollY;
      this.leftCodeRenderable.scrollX = this.rightCodeRenderable.scrollX;
    }
  }
  isInsideSide(target, side) {
    const container = side === "left" ? this.leftCodeRenderable : this.rightCodeRenderable;
    let current = target;
    while (current) {
      if (current === container)
        return true;
      current = current.parent;
    }
    return false;
  }
  requestRebuild() {
    if (this.pendingRebuild) {
      return;
    }
    this.pendingRebuild = true;
    queueMicrotask(() => {
      if (!this.isDestroyed && this.pendingRebuild) {
        this.pendingRebuild = false;
        this.buildView();
        this.requestRender();
      }
    });
  }
  invalidateHunkRowOffsets() {
    this._hunkRowOffsets = null;
  }
  rebuildView() {
    if (this._view === "split") {
      this.requestRebuild();
    } else {
      this.buildView();
    }
  }
  handleLineInfoChange = () => {
    this.invalidateHunkRowOffsets();
    if (!this.leftCodeRenderable || !this.rightCodeRenderable)
      return;
    if (this._view === "split" && (this._wrapMode === "word" || this._wrapMode === "char") && (this.leftCodeRenderable.width !== this._lastCodeWidths[0] || this.rightCodeRenderable.width !== this._lastCodeWidths[1])) {
      this.requestRebuild();
    }
    if (!this._waitingForHighlight)
      return;
    const leftIsHighlighting = this.leftCodeRenderable.isHighlighting;
    const rightIsHighlighting = this.rightCodeRenderable.isHighlighting;
    if (!leftIsHighlighting && !rightIsHighlighting) {
      this._waitingForHighlight = false;
      this.requestRebuild();
    }
  };
  attachLineInfoListeners() {
    if (!this.leftCodeRenderable && !this.rightCodeRenderable)
      return;
    this._lineInfoChangeHandler ??= this.handleLineInfoChange;
    if (this.leftCodeRenderable) {
      this.leftCodeRenderable.off("line-info-change", this._lineInfoChangeHandler);
      this.leftCodeRenderable.on("line-info-change", this._lineInfoChangeHandler);
    }
    if (this.rightCodeRenderable) {
      this.rightCodeRenderable.off("line-info-change", this._lineInfoChangeHandler);
      this.rightCodeRenderable.on("line-info-change", this._lineInfoChangeHandler);
    }
  }
  detachLineInfoListeners() {
    if (!this._lineInfoChangeHandler)
      return;
    const handler = this._lineInfoChangeHandler;
    this._lineInfoChangeHandler = null;
    this.runCleanup((run) => {
      run(() => this.leftCodeRenderable?.off("line-info-change", handler));
      run(() => this.rightCodeRenderable?.off("line-info-change", handler));
    });
  }
  destroyRecursively() {
    if (this.isDestroyed)
      return;
    this.assertMutable();
    this.runCleanup((run) => {
      run(() => this.detachLineInfoListeners());
      this.pendingRebuild = false;
      this.leftSideAdded = false;
      this.rightSideAdded = false;
      run(() => super.destroyRecursively());
    });
  }
  destroySelf() {
    this.pendingRebuild = false;
    this.runCleanup((run) => {
      run(() => this.detachLineInfoListeners());
      for (const child of [
        this.leftSide,
        this.rightSide,
        this.leftCodeRenderable,
        this.rightCodeRenderable,
        this.errorTextRenderable,
        this.errorCodeRenderable
      ]) {
        if (child && !child.isDestroyed)
          run(() => child.destroyRecursively());
      }
      this.leftSide = this.rightSide = this.leftCodeRenderable = this.rightCodeRenderable = null;
      this.errorTextRenderable = this.errorCodeRenderable = null;
      run(() => this.fallbackSyntaxStyle?.destroy());
    });
  }
  get codeSyntaxStyle() {
    return this._syntaxStyle ?? (this.fallbackSyntaxStyle ??= SyntaxStyle.create(this.ctx.nativeScene));
  }
  buildErrorView() {
    this.flexDirection = "column";
    if (this.leftSide && this.leftSideAdded) {
      super.remove(this.leftSide);
      this.leftSideAdded = false;
    }
    if (this.rightSide && this.rightSideAdded) {
      super.remove(this.rightSide);
      this.rightSideAdded = false;
    }
    const errorMessage = `Error parsing diff: ${this._parseError?.message || "Unknown error"}
`;
    if (!this.errorTextRenderable) {
      this.errorTextRenderable = new TextRenderable2(this.ctx, {
        id: this.id ? `${this.id}-error-text` : undefined,
        content: errorMessage,
        fg: "#ef4444",
        width: "100%",
        flexShrink: 0
      });
      super.add(this.errorTextRenderable);
    } else {
      this.errorTextRenderable.content = errorMessage;
      const errorTextIndex = this.getChildren().indexOf(this.errorTextRenderable);
      if (errorTextIndex === -1) {
        super.add(this.errorTextRenderable);
      }
    }
    if (!this.errorCodeRenderable) {
      this.errorCodeRenderable = new CodeRenderable2(this.ctx, {
        id: this.id ? `${this.id}-error-code` : undefined,
        content: this._diff,
        filetype: "diff",
        syntaxStyle: this.codeSyntaxStyle,
        wrapMode: this._wrapMode,
        conceal: this._conceal,
        width: "100%",
        flexGrow: 1,
        flexShrink: 1,
        ...this._treeSitterClient !== undefined && { treeSitterClient: this._treeSitterClient }
      });
      super.add(this.errorCodeRenderable);
    } else {
      this.errorCodeRenderable.content = this._diff;
      this.errorCodeRenderable.wrapMode = this._wrapMode ?? "none";
      if (this._syntaxStyle) {
        this.errorCodeRenderable.syntaxStyle = this._syntaxStyle;
      }
      const errorCodeIndex = this.getChildren().indexOf(this.errorCodeRenderable);
      if (errorCodeIndex === -1) {
        super.add(this.errorCodeRenderable);
      }
    }
  }
  createOrUpdateCodeRenderable(side, content, wrapMode, drawUnstyledText) {
    const existingRenderable = side === "left" ? this.leftCodeRenderable : this.rightCodeRenderable;
    if (!existingRenderable) {
      const codeOptions = {
        id: this.id ? `${this.id}-${side}-code` : undefined,
        content,
        filetype: this._filetype,
        wrapMode,
        conceal: this._conceal,
        syntaxStyle: this.codeSyntaxStyle,
        width: "100%",
        height: "100%",
        ...this._fg !== undefined && { fg: this._fg },
        ...drawUnstyledText !== undefined && { drawUnstyledText },
        ...this._selectionBg !== undefined && { selectionBg: this._selectionBg },
        ...this._selectionFg !== undefined && { selectionFg: this._selectionFg },
        ...this._treeSitterClient !== undefined && { treeSitterClient: this._treeSitterClient }
      };
      const newRenderable = new CodeRenderable2(this.ctx, codeOptions);
      if (side === "left") {
        this.leftCodeRenderable = newRenderable;
      } else {
        this.rightCodeRenderable = newRenderable;
      }
      return newRenderable;
    } else {
      existingRenderable.content = content;
      existingRenderable.wrapMode = wrapMode ?? "none";
      existingRenderable.conceal = this._conceal;
      if (drawUnstyledText !== undefined) {
        existingRenderable.drawUnstyledText = drawUnstyledText;
      }
      if (this._filetype !== undefined) {
        existingRenderable.filetype = this._filetype;
      }
      if (this._syntaxStyle !== undefined) {
        existingRenderable.syntaxStyle = this._syntaxStyle;
      }
      if (this._selectionBg !== undefined) {
        existingRenderable.selectionBg = this._selectionBg;
      }
      if (this._selectionFg !== undefined) {
        existingRenderable.selectionFg = this._selectionFg;
      }
      if (this._fg !== undefined) {
        existingRenderable.fg = this._fg;
      }
      return existingRenderable;
    }
  }
  createOrUpdateSide(side, target, lineColors, lineSigns, lineNumbers, hideLineNumbers, width) {
    const sideRef = side === "left" ? this.leftSide : this.rightSide;
    const addedFlag = side === "left" ? this.leftSideAdded : this.rightSideAdded;
    if (!sideRef) {
      const newSide = new LineNumberRenderable(this.ctx, {
        id: this.id ? `${this.id}-${side}` : undefined,
        target,
        fg: this._lineNumberFg,
        bg: this._lineNumberBg,
        lineColors,
        lineSigns,
        lineNumbers,
        lineNumberOffset: 0,
        hideLineNumbers,
        width,
        height: "100%"
      });
      newSide.showLineNumbers = this._showLineNumbers;
      newSide.setGutterLayout(this.gutterLayout());
      super.add(newSide);
      if (side === "left") {
        this.leftSide = newSide;
        this.leftSideAdded = true;
      } else {
        this.rightSide = newSide;
        this.rightSideAdded = true;
      }
    } else {
      sideRef.width = width;
      sideRef.fg = this._lineNumberFg;
      sideRef.bg = this._lineNumberBg;
      sideRef.setGutterLayout(this.gutterLayout());
      sideRef.setLineColors(lineColors);
      const padding = sideRef.getLineSigns().get(-1);
      if (padding)
        lineSigns.set(-1, padding);
      sideRef.setLineSigns(lineSigns);
      sideRef.setLineNumbers(lineNumbers);
      sideRef.setHideLineNumbers(hideLineNumbers);
      if (!addedFlag) {
        super.add(sideRef);
        if (side === "left") {
          this.leftSideAdded = true;
        } else {
          this.rightSideAdded = true;
        }
      }
    }
  }
  gutterLayout() {
    return {
      minWidth: 0,
      paddingLeft: this._gutter.paddingLeft ?? 1,
      paddingRight: this._gutter.paddingRight ?? 1,
      minDigits: this._gutter.minDigits ?? 0,
      minAfterWidth: this._gutter.minDigits === undefined ? 0 : SIGN_WIDTH
    };
  }
  buildUnifiedView() {
    if (!this._parsedDiff)
      return;
    this.flexDirection = "column";
    if (this.errorTextRenderable) {
      const errorTextIndex = this.getChildren().indexOf(this.errorTextRenderable);
      if (errorTextIndex !== -1) {
        super.remove(this.errorTextRenderable);
      }
    }
    if (this.errorCodeRenderable) {
      const errorCodeIndex = this.getChildren().indexOf(this.errorCodeRenderable);
      if (errorCodeIndex !== -1) {
        super.remove(this.errorCodeRenderable);
      }
    }
    const contentLines = [];
    const lineColors = new Map;
    const lineSigns = new Map;
    const lineNumbers = new Map;
    let lineIndex = 0;
    for (const hunk of this._parsedDiff.hunks) {
      this._hunkStartLines.push(lineIndex);
      let oldLineNum = hunk.oldStart;
      let newLineNum = hunk.newStart;
      for (const line of hunk.lines) {
        const firstChar = line[0] ?? " ";
        const content = line.slice(1);
        if (firstChar === "+") {
          contentLines.push(content);
          const config = {
            gutter: this._addedLineNumberBg
          };
          if (this._addedContentBg) {
            config.content = this._addedContentBg;
          } else {
            config.content = this._addedBg;
          }
          lineColors.set(lineIndex, config);
          lineSigns.set(lineIndex, {
            after: " +",
            afterColor: this._addedSignColor
          });
          lineNumbers.set(lineIndex, newLineNum);
          newLineNum++;
          lineIndex++;
        } else if (firstChar === "-") {
          contentLines.push(content);
          const config = {
            gutter: this._removedLineNumberBg
          };
          if (this._removedContentBg) {
            config.content = this._removedContentBg;
          } else {
            config.content = this._removedBg;
          }
          lineColors.set(lineIndex, config);
          lineSigns.set(lineIndex, {
            after: " -",
            afterColor: this._removedSignColor
          });
          lineNumbers.set(lineIndex, oldLineNum);
          oldLineNum++;
          lineIndex++;
        } else if (firstChar === " ") {
          contentLines.push(content);
          const config = {
            gutter: this._lineNumberBg
          };
          if (this._contextContentBg) {
            config.content = this._contextContentBg;
          } else {
            config.content = this._contextBg;
          }
          lineColors.set(lineIndex, config);
          lineNumbers.set(lineIndex, newLineNum);
          oldLineNum++;
          newLineNum++;
          lineIndex++;
        }
      }
    }
    const content = contentLines.join(`
`);
    const codeRenderable = this.createOrUpdateCodeRenderable("left", content, this._wrapMode);
    this.attachLineInfoListeners();
    this.createOrUpdateSide("left", codeRenderable, lineColors, lineSigns, lineNumbers, new Set, "100%");
    if (this.rightSide && this.rightSideAdded) {
      super.remove(this.rightSide);
      this.rightSideAdded = false;
    }
  }
  buildSplitView() {
    if (!this._parsedDiff)
      return;
    this.flexDirection = "row";
    if (this.errorTextRenderable) {
      const errorTextIndex = this.getChildren().indexOf(this.errorTextRenderable);
      if (errorTextIndex !== -1) {
        super.remove(this.errorTextRenderable);
      }
    }
    if (this.errorCodeRenderable) {
      const errorCodeIndex = this.getChildren().indexOf(this.errorCodeRenderable);
      if (errorCodeIndex !== -1) {
        super.remove(this.errorCodeRenderable);
      }
    }
    const leftLogicalLines = [];
    const rightLogicalLines = [];
    const hunkFirstLeftLine = [];
    for (const hunk of this._parsedDiff.hunks) {
      hunkFirstLeftLine.push(leftLogicalLines.length);
      let oldLineNum = hunk.oldStart;
      let newLineNum = hunk.newStart;
      let i = 0;
      while (i < hunk.lines.length) {
        const line = hunk.lines[i];
        const firstChar = line[0] ?? " ";
        if (firstChar === " ") {
          const content = line.slice(1);
          leftLogicalLines.push({
            content,
            lineNum: oldLineNum,
            color: this._contextBg,
            type: "context"
          });
          rightLogicalLines.push({
            content,
            lineNum: newLineNum,
            color: this._contextBg,
            type: "context"
          });
          oldLineNum++;
          newLineNum++;
          i++;
        } else if (firstChar === "\\") {
          i++;
        } else {
          const removes = [];
          const adds = [];
          while (i < hunk.lines.length) {
            const currentLine = hunk.lines[i];
            const currentChar = currentLine[0] ?? " ";
            if (currentChar === " " || currentChar === "\\") {
              break;
            }
            const content = currentLine.slice(1);
            if (currentChar === "-") {
              removes.push({ content, lineNum: oldLineNum });
              oldLineNum++;
            } else if (currentChar === "+") {
              adds.push({ content, lineNum: newLineNum });
              newLineNum++;
            }
            i++;
          }
          const maxLength = Math.max(removes.length, adds.length);
          for (let j = 0;j < maxLength; j++) {
            if (j < removes.length) {
              leftLogicalLines.push({
                content: removes[j].content,
                lineNum: removes[j].lineNum,
                color: this._removedBg,
                sign: {
                  after: " -",
                  afterColor: this._removedSignColor
                },
                type: "remove"
              });
            } else {
              leftLogicalLines.push({
                content: "",
                hideLineNumber: true,
                type: "empty"
              });
            }
            if (j < adds.length) {
              rightLogicalLines.push({
                content: adds[j].content,
                lineNum: adds[j].lineNum,
                color: this._addedBg,
                sign: {
                  after: " +",
                  afterColor: this._addedSignColor
                },
                type: "add"
              });
            } else {
              rightLogicalLines.push({
                content: "",
                hideLineNumber: true,
                type: "empty"
              });
            }
          }
        }
      }
    }
    for (const startIndex of hunkFirstLeftLine) {
      const firstLine = leftLogicalLines[startIndex];
      if (firstLine)
        firstLine.hunkStart = true;
    }
    const canDoWrapAlignment = this.width > 0 && (this._wrapMode === "word" || this._wrapMode === "char");
    const preLeftContent = leftLogicalLines.map((l) => l.content).join(`
`);
    const preRightContent = rightLogicalLines.map((l) => l.content).join(`
`);
    this._lastCodeWidths = [this.leftCodeRenderable?.width ?? 0, this.rightCodeRenderable?.width ?? 0];
    const needsConsistentConcealing = (this._wrapMode === "word" || this._wrapMode === "char") && this._conceal && this._filetype;
    const drawUnstyledText = !needsConsistentConcealing;
    const leftCodeRenderable = this.createOrUpdateCodeRenderable("left", preLeftContent, this._wrapMode, drawUnstyledText);
    const rightCodeRenderable = this.createOrUpdateCodeRenderable("right", preRightContent, this._wrapMode, drawUnstyledText);
    this.attachLineInfoListeners();
    let finalLeftLines;
    let finalRightLines;
    const leftIsHighlighting = leftCodeRenderable.isHighlighting;
    const rightIsHighlighting = rightCodeRenderable.isHighlighting;
    const highlightingInProgress = needsConsistentConcealing && (leftIsHighlighting || rightIsHighlighting);
    if (highlightingInProgress) {
      this._waitingForHighlight = true;
      this.attachLineInfoListeners();
    }
    const shouldDoAlignment = canDoWrapAlignment && !highlightingInProgress;
    if (shouldDoAlignment) {
      const leftLineInfo = leftCodeRenderable.lineInfo;
      const rightLineInfo = rightCodeRenderable.lineInfo;
      const leftSources = leftLineInfo.lineSources || [];
      const rightSources = rightLineInfo.lineSources || [];
      const leftVisualCounts = new Map;
      const rightVisualCounts = new Map;
      for (const logicalLine of leftSources) {
        leftVisualCounts.set(logicalLine, (leftVisualCounts.get(logicalLine) || 0) + 1);
      }
      for (const logicalLine of rightSources) {
        rightVisualCounts.set(logicalLine, (rightVisualCounts.get(logicalLine) || 0) + 1);
      }
      finalLeftLines = [];
      finalRightLines = [];
      let leftVisualPos = 0;
      let rightVisualPos = 0;
      for (let i = 0;i < leftLogicalLines.length; i++) {
        const leftLine = leftLogicalLines[i];
        const rightLine = rightLogicalLines[i];
        const leftVisualCount = leftVisualCounts.get(i) ?? 0;
        const rightVisualCount = rightVisualCounts.get(i) ?? 0;
        if (leftVisualPos < rightVisualPos) {
          const pad = rightVisualPos - leftVisualPos;
          for (let p = 0;p < pad; p++) {
            finalLeftLines.push({ content: "", hideLineNumber: true, type: "empty" });
          }
          leftVisualPos += pad;
        } else if (rightVisualPos < leftVisualPos) {
          const pad = leftVisualPos - rightVisualPos;
          for (let p = 0;p < pad; p++) {
            finalRightLines.push({ content: "", hideLineNumber: true, type: "empty" });
          }
          rightVisualPos += pad;
        }
        finalLeftLines.push(leftLine);
        finalRightLines.push(rightLine);
        leftVisualPos += leftVisualCount;
        rightVisualPos += rightVisualCount;
      }
      if (leftVisualPos < rightVisualPos) {
        const pad = rightVisualPos - leftVisualPos;
        for (let p = 0;p < pad; p++) {
          finalLeftLines.push({ content: "", hideLineNumber: true, type: "empty" });
        }
      } else if (rightVisualPos < leftVisualPos) {
        const pad = leftVisualPos - rightVisualPos;
        for (let p = 0;p < pad; p++) {
          finalRightLines.push({ content: "", hideLineNumber: true, type: "empty" });
        }
      }
    } else {
      finalLeftLines = leftLogicalLines;
      finalRightLines = rightLogicalLines;
    }
    const leftLineColors = new Map;
    const rightLineColors = new Map;
    const leftLineSigns = new Map;
    const rightLineSigns = new Map;
    const leftHideLineNumbers = new Set;
    const rightHideLineNumbers = new Set;
    const leftLineNumbers = new Map;
    const rightLineNumbers = new Map;
    finalLeftLines.forEach((line, index) => {
      if (line.hunkStart) {
        this._hunkStartLines.push(index);
      }
      if (line.lineNum !== undefined) {
        leftLineNumbers.set(index, line.lineNum);
      }
      if (line.hideLineNumber) {
        leftHideLineNumbers.add(index);
      }
      if (line.type === "remove") {
        const config = {
          gutter: this._removedLineNumberBg
        };
        if (this._removedContentBg) {
          config.content = this._removedContentBg;
        } else {
          config.content = this._removedBg;
        }
        leftLineColors.set(index, config);
      } else if (line.type === "context") {
        const config = {
          gutter: this._lineNumberBg
        };
        if (this._contextContentBg) {
          config.content = this._contextContentBg;
        } else {
          config.content = this._contextBg;
        }
        leftLineColors.set(index, config);
      }
      if (line.sign) {
        leftLineSigns.set(index, line.sign);
      }
    });
    finalRightLines.forEach((line, index) => {
      if (line.lineNum !== undefined) {
        rightLineNumbers.set(index, line.lineNum);
      }
      if (line.hideLineNumber) {
        rightHideLineNumbers.add(index);
      }
      if (line.type === "add") {
        const config = {
          gutter: this._addedLineNumberBg
        };
        if (this._addedContentBg) {
          config.content = this._addedContentBg;
        } else {
          config.content = this._addedBg;
        }
        rightLineColors.set(index, config);
      } else if (line.type === "context") {
        const config = {
          gutter: this._lineNumberBg
        };
        if (this._contextContentBg) {
          config.content = this._contextContentBg;
        } else {
          config.content = this._contextBg;
        }
        rightLineColors.set(index, config);
      }
      if (line.sign) {
        rightLineSigns.set(index, line.sign);
      }
    });
    const leftContentFinal = finalLeftLines.map((l) => l.content).join(`
`);
    const rightContentFinal = finalRightLines.map((l) => l.content).join(`
`);
    leftCodeRenderable.content = leftContentFinal;
    rightCodeRenderable.content = rightContentFinal;
    this.createOrUpdateSide("left", leftCodeRenderable, leftLineColors, leftLineSigns, leftLineNumbers, leftHideLineNumbers, "50%");
    this.createOrUpdateSide("right", rightCodeRenderable, rightLineColors, rightLineSigns, rightLineNumbers, rightHideLineNumbers, "50%");
  }
  get diff() {
    return this._diff;
  }
  set diff(value) {
    if (this._diff !== value) {
      this._diff = value;
      this._waitingForHighlight = false;
      this.parseDiff();
      this.rebuildView();
    }
  }
  get syncScroll() {
    return this._syncScroll;
  }
  set syncScroll(value) {
    if (this._syncScroll !== value) {
      this._syncScroll = value;
    }
  }
  get view() {
    return this._view;
  }
  set view(value) {
    if (this._view !== value) {
      this._view = value;
      this.flexDirection = value === "split" ? "row" : "column";
      this.buildView();
    }
  }
  get filetype() {
    return this._filetype;
  }
  set filetype(value) {
    if (this._filetype !== value) {
      this._filetype = value;
      this.rebuildView();
    }
  }
  get syntaxStyle() {
    return this._syntaxStyle;
  }
  set syntaxStyle(value) {
    if (this._syntaxStyle !== value) {
      this._syntaxStyle = value;
      for (const code of [this.leftCodeRenderable, this.rightCodeRenderable, this.errorCodeRenderable]) {
        if (code && !code.isDestroyed)
          code.syntaxStyle = this.codeSyntaxStyle;
      }
      this.rebuildView();
    }
  }
  get wrapMode() {
    return this._wrapMode;
  }
  set wrapMode(value) {
    if (this._wrapMode !== value) {
      this._wrapMode = value;
      this.invalidateHunkRowOffsets();
      if (this._view === "unified" && this.leftCodeRenderable) {
        this.leftCodeRenderable.wrapMode = value ?? "none";
      } else if (this._view === "split") {
        this.requestRebuild();
      }
    }
  }
  get showLineNumbers() {
    return this._showLineNumbers;
  }
  set showLineNumbers(value) {
    if (this._showLineNumbers !== value) {
      this._showLineNumbers = value;
      if (this.leftSide) {
        this.leftSide.showLineNumbers = value;
      }
      if (this.rightSide) {
        this.rightSide.showLineNumbers = value;
      }
    }
  }
  get addedBg() {
    return RGBA2.clone(this._addedBg);
  }
  set addedBg(value) {
    this._addedBg = RGBA2.clone(parseColor2(value ?? defaultColors.addedBg));
    this.rebuildView();
  }
  get removedBg() {
    return RGBA2.clone(this._removedBg);
  }
  set removedBg(value) {
    this._removedBg = RGBA2.clone(parseColor2(value ?? defaultColors.removedBg));
    this.rebuildView();
  }
  get contextBg() {
    return RGBA2.clone(this._contextBg);
  }
  set contextBg(value) {
    this._contextBg = RGBA2.clone(parseColor2(value ?? defaultColors.contextBg));
    this.rebuildView();
  }
  get addedSignColor() {
    return RGBA2.clone(this._addedSignColor);
  }
  set addedSignColor(value) {
    this._addedSignColor = RGBA2.clone(parseColor2(value ?? defaultColors.addedSignColor));
    this.rebuildView();
  }
  get removedSignColor() {
    return RGBA2.clone(this._removedSignColor);
  }
  set removedSignColor(value) {
    this._removedSignColor = RGBA2.clone(parseColor2(value ?? defaultColors.removedSignColor));
    this.rebuildView();
  }
  get addedLineNumberBg() {
    return RGBA2.clone(this._addedLineNumberBg);
  }
  set addedLineNumberBg(value) {
    this._addedLineNumberBg = RGBA2.clone(parseColor2(value ?? defaultColors.addedLineNumberBg));
    this.rebuildView();
  }
  get removedLineNumberBg() {
    return RGBA2.clone(this._removedLineNumberBg);
  }
  set removedLineNumberBg(value) {
    this._removedLineNumberBg = RGBA2.clone(parseColor2(value ?? defaultColors.removedLineNumberBg));
    this.rebuildView();
  }
  get lineNumberFg() {
    return RGBA2.clone(this._lineNumberFg);
  }
  set lineNumberFg(value) {
    this._lineNumberFg = RGBA2.clone(parseColor2(value ?? defaultColors.lineNumberFg));
    this.rebuildView();
  }
  get lineNumberBg() {
    return RGBA2.clone(this._lineNumberBg);
  }
  set lineNumberBg(value) {
    this._lineNumberBg = RGBA2.clone(parseColor2(value ?? defaultColors.lineNumberBg));
    this.rebuildView();
  }
  get gutter() {
    return { ...this._gutter };
  }
  set gutter(value) {
    const next = { ...value };
    if (next.paddingLeft === this._gutter.paddingLeft && next.paddingRight === this._gutter.paddingRight && next.minDigits === this._gutter.minDigits)
      return;
    this._gutter = next;
    this.rebuildView();
  }
  get addedContentBg() {
    return this._addedContentBg ? RGBA2.clone(this._addedContentBg) : null;
  }
  set addedContentBg(value) {
    const parsed = value ? RGBA2.clone(parseColor2(value)) : null;
    if (this._addedContentBg !== parsed) {
      this._addedContentBg = parsed;
      this.rebuildView();
    }
  }
  get removedContentBg() {
    return this._removedContentBg ? RGBA2.clone(this._removedContentBg) : null;
  }
  set removedContentBg(value) {
    const parsed = value ? RGBA2.clone(parseColor2(value)) : null;
    if (this._removedContentBg !== parsed) {
      this._removedContentBg = parsed;
      this.rebuildView();
    }
  }
  get contextContentBg() {
    return this._contextContentBg ? RGBA2.clone(this._contextContentBg) : null;
  }
  set contextContentBg(value) {
    const parsed = value ? RGBA2.clone(parseColor2(value)) : null;
    if (this._contextContentBg !== parsed) {
      this._contextContentBg = parsed;
      this.rebuildView();
    }
  }
  get selectionBg() {
    return this._selectionBg ? RGBA2.clone(this._selectionBg) : undefined;
  }
  set selectionBg(value) {
    const parsed = value ? RGBA2.clone(parseColor2(value)) : undefined;
    if (this._selectionBg !== parsed) {
      this._selectionBg = parsed;
      if (this.leftCodeRenderable) {
        this.leftCodeRenderable.selectionBg = parsed;
      }
      if (this.rightCodeRenderable) {
        this.rightCodeRenderable.selectionBg = parsed;
      }
    }
  }
  get selectionFg() {
    return this._selectionFg ? RGBA2.clone(this._selectionFg) : undefined;
  }
  set selectionFg(value) {
    const parsed = value ? RGBA2.clone(parseColor2(value)) : undefined;
    if (this._selectionFg !== parsed) {
      this._selectionFg = parsed;
      if (this.leftCodeRenderable) {
        this.leftCodeRenderable.selectionFg = parsed;
      }
      if (this.rightCodeRenderable) {
        this.rightCodeRenderable.selectionFg = parsed;
      }
    }
  }
  get conceal() {
    return this._conceal;
  }
  set conceal(value) {
    if (this._conceal !== value) {
      this._conceal = value;
      this.rebuildView();
    }
  }
  get fg() {
    return this._fg ? RGBA2.clone(this._fg) : undefined;
  }
  set fg(value) {
    const parsed = value ? RGBA2.clone(parseColor2(value)) : undefined;
    if (this._fg !== parsed) {
      this._fg = parsed;
      if (this.leftCodeRenderable) {
        this.leftCodeRenderable.fg = parsed;
      }
      if (this.rightCodeRenderable) {
        this.rightCodeRenderable.fg = parsed;
      }
    }
  }
  setLineColor(line, color) {
    this.leftSide?.setLineColor(line, color);
    this.rightSide?.setLineColor(line, color);
  }
  clearLineColor(line) {
    this.leftSide?.clearLineColor(line);
    this.rightSide?.clearLineColor(line);
  }
  setLineColors(lineColors) {
    this.leftSide?.setLineColors(lineColors);
    this.rightSide?.setLineColors(lineColors);
  }
  clearAllLineColors() {
    this.leftSide?.clearAllLineColors();
    this.rightSide?.clearAllLineColors();
  }
  highlightLines(startLine, endLine, color) {
    this.leftSide?.highlightLines(startLine, endLine, color);
    this.rightSide?.highlightLines(startLine, endLine, color);
  }
  clearHighlightLines(startLine, endLine) {
    this.leftSide?.clearHighlightLines(startLine, endLine);
    this.rightSide?.clearHighlightLines(startLine, endLine);
  }
  getHunkRowOffsets() {
    if (this._hunkRowOffsets)
      return [...this._hunkRowOffsets];
    this._hunkRowOffsets = this.computeHunkRowOffsets();
    return [...this._hunkRowOffsets];
  }
  computeHunkRowOffsets() {
    if (this._hunkStartLines.length === 0)
      return [];
    const sources = this.leftCodeRenderable?.lineInfo.lineSources;
    if (!sources || sources.length === 0)
      return [...this._hunkStartLines];
    const offsets = [];
    let visualRow = 0;
    for (const hunkStartLine of this._hunkStartLines) {
      while (visualRow < sources.length && sources[visualRow] < hunkStartLine) {
        visualRow++;
      }
      offsets.push(visualRow < sources.length ? visualRow : hunkStartLine);
    }
    return offsets;
  }
}
// src/renderables/EmbeddedTerminal.ts
var MOD_SHIFT = nativeConstants.OT_EMBEDDED_TERMINAL_MOD_SHIFT;
var MOD_CTRL = nativeConstants.OT_EMBEDDED_TERMINAL_MOD_CTRL;
var MOD_ALT = nativeConstants.OT_EMBEDDED_TERMINAL_MOD_ALT;
var MOD_SUPER = nativeConstants.OT_EMBEDDED_TERMINAL_MOD_SUPER;
var MOD_CAPS_LOCK = nativeConstants.OT_EMBEDDED_TERMINAL_MOD_CAPS_LOCK;
var MOD_NUM_LOCK = nativeConstants.OT_EMBEDDED_TERMINAL_MOD_NUM_LOCK;

class EmbeddedTerminalRenderable extends Renderable2 {
  static nativeIntegration = {
    kind: "custom",
    body: "host"
  };
  lib;
  handle = null;
  _onData;
  _onTerminalResize;
  _onScreenChange;
  keyreleaseHandler = null;
  selection = false;
  composedHookGeneration = 0n;
  _transparentBackground = false;
  _cellSize = { width: 0, height: 0 };
  sizeDefaults;
  constructor(ctx, options) {
    const cols = options.cols ?? (typeof options.width === "number" ? options.width : 80);
    const rows = options.rows ?? (typeof options.height === "number" ? options.height : 24);
    super(ctx, {
      ...options,
      width: options.width ?? cols,
      height: options.height ?? rows,
      buffered: true
    });
    this._focusable = true;
    this.lib = ctx.nativeScene.driver.renderLib;
    this.sizeDefaults = { width: options.cols ?? 80, height: options.rows ?? 24 };
    try {
      this._onData = options.onData;
      this._onTerminalResize = options.onTerminalResize;
      this._onScreenChange = options.onScreenChange;
      this.selectable = options.selectable ?? true;
      const cell = this.hostCellSize();
      const config = {
        cols,
        rows,
        maxScrollback: options.maxScrollback,
        cellWidthPx: cell.width,
        cellHeightPx: cell.height
      };
      this.handle = this.lib.createContextEmbeddedTerminal(ctx.nativeScene.driver.context, config);
      this.transparentBackground = options.transparentBackground ?? false;
      this.setupMouse(options);
    } catch (error) {
      this.rollbackConstruction(error);
    }
  }
  hostCellSize() {
    const resolution = this._ctx.resolution;
    const width = this._ctx.terminalWidth ?? 0;
    const height = this._ctx.terminalHeight ?? 0;
    if (!resolution || width <= 0 || height <= 0)
      return { width: 0, height: 0 };
    return {
      width: Math.max(1, Math.floor(resolution.width / width)),
      height: Math.max(1, Math.floor(resolution.height / height))
    };
  }
  syncCellSize() {
    if (!this.handle)
      return;
    const cell = this.hostCellSize();
    if (cell.width === this._cellSize.width && cell.height === this._cellSize.height)
      return;
    this._cellSize = cell;
    if (cell.width === 0 && cell.height === 0)
      return;
    this.lib.contextEmbeddedTerminalSetCellSize(this._ctx.nativeScene.driver.context, this.handle, cell.width, cell.height);
  }
  defaultDimension(kind) {
    return this.sizeDefaults[kind];
  }
  get onData() {
    return this._onData;
  }
  set onData(value) {
    this._onData = value;
  }
  get onTerminalResize() {
    return this._onTerminalResize;
  }
  set onTerminalResize(value) {
    this._onTerminalResize = value;
  }
  get onScreenChange() {
    return this._onScreenChange;
  }
  set onScreenChange(value) {
    this._onScreenChange = value;
  }
  get transparentBackground() {
    return this._transparentBackground;
  }
  set transparentBackground(value) {
    if (this._transparentBackground === value)
      return;
    this._transparentBackground = value;
    if (this.handle !== null) {
      this.lib.contextEmbeddedTerminalSetTransparentBackground(this.handle.context, this.handle, value);
      this.requestRender();
    }
  }
  screen() {
    const cursor = this.handle ? this.lib.contextEmbeddedTerminalCursor(this.handle.context, this.handle) : { x: 0, y: 0, visible: false, hasValue: false };
    const lines = this.frameBuffer ? new TextDecoder().decode(this.frameBuffer.getRealCharBytes(true)).split(`
`).slice(0, this.height).map((line) => line.trimEnd()) : [];
    while (lines.at(-1) === "")
      lines.pop();
    return {
      text: lines.join(`
`),
      lines,
      columns: this.width,
      rows: this.height,
      cursor: {
        x: cursor.x,
        y: cursor.y,
        visible: cursor.hasValue && cursor.visible
      }
    };
  }
  getScroll() {
    if (!this.handle)
      return { offset: 0, total: 0, visible: 0 };
    return this.lib.contextEmbeddedTerminalScrollbar(this.handle.context, this.handle);
  }
  write(data) {
    if (!this.handle)
      return;
    this.lib.contextEmbeddedTerminalWrite(this.handle.context, this.handle, data);
    try {
      this.flushResponses();
    } finally {
      this.requestRender();
    }
  }
  invalidate() {
    if (!this.handle)
      return;
    this.lib.contextEmbeddedTerminalInvalidate(this.handle.context, this.handle);
    this.requestRender();
  }
  encodeKey(key) {
    if (!this.handle)
      return new Uint8Array;
    if (key.name === "linefeed")
      key = new KeyEvent2({ ...key, name: "j", ctrl: true, sequence: key.shift ? "J" : "j" });
    const text = textualKey(key);
    const physical = physicalKey(key);
    const options = {
      action: key.eventType === "release" ? "release" : key.repeated ? "repeat" : "press",
      key: physical,
      mods: modifiers(key),
      text,
      unshiftedCodepoint: unshiftedCodepoint(key, physical)
    };
    return this.lib.contextEmbeddedTerminalEncodeKey(this.handle.context, this.handle, options);
  }
  encodePaste(bytes) {
    if (!this.handle)
      return new Uint8Array;
    return this.lib.contextEmbeddedTerminalEncodePaste(this.handle.context, this.handle, bytes);
  }
  shouldStartSelection(x, y) {
    if (!this.selectable)
      return false;
    const localX = x - this.x;
    const localY = y - this.y;
    return localX >= 0 && localX < this.width && localY >= 0 && localY < this.height;
  }
  onSelectionChanged(selection) {
    if (!this.handle)
      return false;
    const local = convertGlobalToLocalSelection2(selection, Math.trunc(this.x), Math.trunc(this.y));
    if (!local?.isActive) {
      if (!this.selection)
        return false;
      this.lib.contextEmbeddedTerminalClearSelection(this.handle.context, this.handle);
      this.selection = false;
      this.requestRender();
      return false;
    }
    if (!this.selection && local.behavior === "cell" && local.anchorX === local.focusX && local.anchorY === local.focusY)
      return false;
    const point = (x, y) => {
      if (y < 0)
        return { x: 0, y: 0 };
      if (y >= this.height)
        return { x: this.width - 1, y: this.height - 1 };
      return { x: Math.max(0, Math.min(this.width - 1, x)), y };
    };
    const start = point(local.anchorX, local.anchorY);
    const end = point(local.focusX, local.focusY);
    this.lib.contextEmbeddedTerminalSetSelection(this.handle.context, this.handle, start, end);
    this.selection = true;
    this.requestRender();
    return true;
  }
  hasSelection() {
    return this.selection;
  }
  getSelectedText() {
    if (!this.handle || !this.selection)
      return "";
    return new TextDecoder().decode(this.lib.contextEmbeddedTerminalGetSelectedText(this.handle.context, this.handle));
  }
  focus() {
    if (this.focused)
      return;
    super.focus();
    if (!this.focused)
      return;
    this.keyreleaseHandler = (key) => this.handleKeyPress(key);
    this.ctx._internalKeyInput.onInternal("keyrelease", this.keyreleaseHandler);
    try {
      this.sendFocus(true);
    } catch (error) {
      this.removeKeyreleaseHandler();
      super.blur();
      throw error;
    }
  }
  blur() {
    if (!this.focused)
      return;
    try {
      this.sendFocus(false);
    } catch {} finally {
      this.removeKeyreleaseHandler();
      super.blur();
      this._ctx.setCursorPosition(0, 0, false);
    }
  }
  handleKeyPress(key) {
    const output = this.encodeKey(key);
    this.send(output, "input");
    return output.byteLength > 0;
  }
  handlePaste(event) {
    this.send(this.encodePaste(event.bytes), "input");
  }
  onResize(width, height) {
    super.onResize(width, height);
    if (!this.handle || !Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0)
      return;
    const cols = Math.min(Math.floor(width), 65535);
    const rows = Math.min(Math.floor(height), 65535);
    this.lib.contextEmbeddedTerminalResize(this.handle.context, this.handle, cols, rows);
    this.lib.contextEmbeddedTerminalInvalidate(this.handle.context, this.handle);
    this.syncCellSize();
    this.flushResponses();
    this._onTerminalResize?.(cols, rows);
  }
  _invokeNativePaint(buffer, deltaTime) {
    const generation = this._nativeSceneHookGeneration;
    super._invokeNativePaint(buffer, deltaTime);
    if (this.visible)
      this.composedHookGeneration = generation;
  }
  renderSelf(buffer) {
    if (!this.handle || !this.frameBuffer || !this.visible || this.isDestroyed)
      return;
    this.syncCellSize();
    if (this.renderBefore || this.renderAfter || this.composedHookGeneration !== this._nativeSceneHookGeneration || this.renderSelf !== EmbeddedTerminalRenderable.prototype.renderSelf) {
      this.lib.contextEmbeddedTerminalInvalidate(this.handle.context, this.handle);
    }
    const target = buffer._getSceneDrawTarget(this._ctx.nativeScene);
    this.lib.contextEmbeddedTerminalCompose(target, this.handle, 0, 0);
    this._onScreenChange?.();
    if (!this.focused)
      return;
    const cursor = this.lib.contextEmbeddedTerminalCursor(this.handle.context, this.handle);
    const visible = cursor.visible && cursor.hasValue;
    const cursorX = cursor.wideTail && cursor.x > 0 ? cursor.x - 1 : cursor.x;
    this._ctx.setCursorPosition(this._screenX + cursorX + 1, this._screenY + cursor.y + 1, visible);
    if (!visible)
      return;
    this._ctx.setCursorStyle({
      style: cursor.style === "bar" ? "line" : cursor.style === "underline" ? "underline" : "block",
      blinking: cursor.blinking
    });
    if (cursor.color)
      this._ctx.setCursorColor(RGBA2.fromInts(cursor.color.r, cursor.color.g, cursor.color.b, 255));
  }
  destroySelf() {
    const handle = this.handle;
    this.handle = null;
    this.selection = false;
    this.removeKeyreleaseHandler();
    try {
      if (handle && !this._ctx.nativeScene.driver.contextDisposed) {
        this.lib.destroyContextEmbeddedTerminal(handle.context, handle);
      }
    } finally {
      this._ctx.setCursorPosition(0, 0, false);
      super.destroySelf();
    }
  }
  onRemove() {
    if (this.focused)
      this.blur();
  }
  setupMouse(options) {
    const { onMouseDown, onMouseUp, onMouseMove, onMouseDrag, onMouseScroll } = options;
    this.onMouseDown = (event) => {
      this.forwardMouse(event, "press");
      onMouseDown?.call(this, event);
    };
    this.onMouseUp = (event) => {
      this.forwardMouse(event, "release");
      onMouseUp?.call(this, event);
    };
    this.onMouseMove = (event) => {
      this.forwardMouse(event, "motion");
      onMouseMove?.call(this, event);
    };
    this.onMouseDrag = (event) => {
      this.forwardMouse(event, "motion");
      onMouseDrag?.call(this, event);
    };
    this.onMouseScroll = (event) => {
      this.forwardMouse(event, "press");
      onMouseScroll?.call(this, event);
    };
  }
  forwardMouse(event, action) {
    if (!this.handle)
      return;
    if (event.type === "down" && event.button === 0)
      this.focus();
    if (!this.handle)
      return;
    const mouse = {
      action,
      button: event.type === "move" && !event.isDragging ? undefined : mouseButton(event),
      mods: modifiers(event.modifiers),
      x: event.x - this._screenX,
      y: event.y - this._screenY,
      anyButtonPressed: event.isDragging === true || event.type === "down"
    };
    const output = this.lib.contextEmbeddedTerminalEncodeMouse(this.handle.context, this.handle, mouse);
    if (event.type === "scroll" && output.byteLength === 0) {
      const direction = event.scroll?.direction;
      if (direction !== "up" && direction !== "down")
        return;
      const delta = direction === "up" ? -3 : 3;
      this.lib.contextEmbeddedTerminalScroll(this.handle.context, this.handle, delta);
      this.requestRender();
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (output.byteLength === 0)
      return;
    event.preventDefault();
    event.stopPropagation();
    this.send(output, "input");
  }
  flushResponses() {
    if (!this.handle)
      return;
    this.send(this.lib.contextEmbeddedTerminalDrainResponses(this.handle.context, this.handle), "response");
  }
  sendFocus(focused) {
    if (!this.handle)
      return;
    this.send(this.lib.contextEmbeddedTerminalEncodeFocus(this.handle.context, this.handle, focused), "input");
  }
  removeKeyreleaseHandler() {
    if (!this.keyreleaseHandler)
      return;
    this.ctx._internalKeyInput.offInternal("keyrelease", this.keyreleaseHandler);
    this.keyreleaseHandler = null;
  }
  send(data, source) {
    if (data.byteLength > 0)
      this._onData?.(data, source);
  }
}
function modifiers(input) {
  let value = 0;
  if (input.shift)
    value |= MOD_SHIFT;
  if (input.ctrl)
    value |= MOD_CTRL;
  if (input.alt || input.option || input.meta)
    value |= MOD_ALT;
  if (input.super)
    value |= MOD_SUPER;
  if (input.capsLock)
    value |= MOD_CAPS_LOCK;
  if (input.numLock)
    value |= MOD_NUM_LOCK;
  return value;
}
function physicalKey(key) {
  if (key.code && !/^[[O]/.test(key.code))
    return key.code;
  const name = key.baseCode === undefined ? key.name : String.fromCodePoint(key.baseCode);
  if (/^[a-z]$/i.test(name))
    return `Key${name.toUpperCase()}`;
  if (/^[0-9]$/.test(name))
    return `Digit${name}`;
  if (/^f([1-9]|1[0-9]|2[0-5])$/i.test(key.name))
    return key.name.toUpperCase();
  if (/^kp[0-9]$/i.test(key.name))
    return `Numpad${key.name.slice(2)}`;
  return {
    backspace: "Backspace",
    clear: "NumpadBegin",
    kpdecimal: "NumpadDecimal",
    kpdivide: "NumpadDivide",
    kpmultiply: "NumpadMultiply",
    kpminus: "NumpadSubtract",
    kpplus: "NumpadAdd",
    kpenter: "NumpadEnter",
    kpequal: "NumpadEqual",
    kpseparator: "NumpadSeparator",
    kpleft: "NumpadLeft",
    kpright: "NumpadRight",
    kpup: "NumpadUp",
    kpdown: "NumpadDown",
    kppageup: "NumpadPageUp",
    kppagedown: "NumpadPageDown",
    kphome: "NumpadHome",
    kpend: "NumpadEnd",
    kpinsert: "NumpadInsert",
    kpdelete: "NumpadDelete",
    capslock: "CapsLock",
    scrolllock: "ScrollLock",
    numlock: "NumLock",
    printscreen: "PrintScreen",
    pause: "Pause",
    leftshift: "ShiftLeft",
    leftctrl: "ControlLeft",
    leftalt: "AltLeft",
    leftsuper: "MetaLeft",
    rightshift: "ShiftRight",
    rightctrl: "ControlRight",
    rightalt: "AltRight",
    rightsuper: "MetaRight",
    enter: "Enter",
    return: "Enter",
    space: "Space",
    tab: "Tab",
    delete: "Delete",
    end: "End",
    home: "Home",
    insert: "Insert",
    pagedown: "PageDown",
    pageup: "PageUp",
    down: "ArrowDown",
    left: "ArrowLeft",
    right: "ArrowRight",
    up: "ArrowUp",
    escape: "Escape"
  }[key.name.toLowerCase()] ?? "";
}
function textualKey(key) {
  if (key.sequence.length > 0 && !/[\p{Cc}]/u.test(key.sequence))
    return key.sequence;
  if (key.name === "space")
    return " ";
  if (key.name.length === 0 || /[\p{Cc}]/u.test(key.name))
    return;
  if ([...key.name].length === 1 || /[^\x00-\x7f]/.test(key.name))
    return key.name;
}
function unshiftedCodepoint(key, code) {
  if (key.name === "space")
    return 32;
  if ([...key.name].length === 1)
    return key.name.codePointAt(0);
  if (code?.startsWith("Key") && code.length === 4)
    return code.charCodeAt(3) + 32;
  if (code?.startsWith("Digit") && code.length === 6)
    return code.charCodeAt(5);
  return 0;
}
function mouseButton(event) {
  if (event.type === "scroll") {
    if (event.scroll?.direction === "up")
      return "four";
    if (event.scroll?.direction === "down")
      return "five";
    if (event.scroll?.direction === "left")
      return "six";
    if (event.scroll?.direction === "right")
      return "seven";
    return;
  }
  return { 0: "left", 1: "middle", 2: "right", 4: "four", 5: "five" }[event.button];
}
// src/renderables/Textarea.ts
var unsupportedKeyCharacters = /[\x00-\x1f\x7f-\x9f]/;
function clonePlaceholder(value) {
  if (value === null || typeof value === "string")
    return value;
  return new StyledText2(value.chunks.map((chunk) => ({
    ...chunk,
    fg: chunk.fg ? RGBA2.clone(chunk.fg) : undefined,
    bg: chunk.bg ? RGBA2.clone(chunk.bg) : undefined
  })));
}
var defaultTextareaKeyBindings = [
  { name: "left", action: "move-left" },
  { name: "right", action: "move-right" },
  { name: "up", action: "move-up" },
  { name: "down", action: "move-down" },
  { name: "left", shift: true, action: "select-left" },
  { name: "right", shift: true, action: "select-right" },
  { name: "up", shift: true, action: "select-up" },
  { name: "down", shift: true, action: "select-down" },
  { name: "home", action: "buffer-home" },
  { name: "end", action: "buffer-end" },
  { name: "home", shift: true, action: "select-buffer-home" },
  { name: "end", shift: true, action: "select-buffer-end" },
  { name: "a", ctrl: true, action: "line-home" },
  { name: "e", ctrl: true, action: "line-end" },
  { name: "a", ctrl: true, shift: true, action: "select-line-home" },
  { name: "e", ctrl: true, shift: true, action: "select-line-end" },
  { name: "a", meta: true, action: "visual-line-home" },
  { name: "e", meta: true, action: "visual-line-end" },
  { name: "a", meta: true, shift: true, action: "select-visual-line-home" },
  { name: "e", meta: true, shift: true, action: "select-visual-line-end" },
  { name: "f", ctrl: true, action: "move-right" },
  { name: "b", ctrl: true, action: "move-left" },
  { name: "w", ctrl: true, action: "delete-word-backward" },
  { name: "backspace", ctrl: true, action: "delete-word-backward" },
  { name: "d", meta: true, action: "delete-word-forward" },
  { name: "delete", meta: true, action: "delete-word-forward" },
  { name: "delete", ctrl: true, action: "delete-word-forward" },
  { name: "d", ctrl: true, shift: true, action: "delete-line" },
  { name: "k", ctrl: true, action: "delete-to-line-end" },
  { name: "u", ctrl: true, action: "delete-to-line-start" },
  { name: "backspace", action: "backspace" },
  { name: "backspace", shift: true, action: "backspace" },
  { name: "d", ctrl: true, action: "delete" },
  { name: "delete", action: "delete" },
  { name: "delete", shift: true, action: "delete" },
  { name: "return", action: "newline" },
  { name: "kpenter", action: "newline" },
  { name: "linefeed", action: "newline" },
  { name: "return", meta: true, action: "submit" },
  { name: "kpenter", meta: true, action: "submit" },
  { name: "-", ctrl: true, action: "undo" },
  { name: ".", ctrl: true, action: "redo" },
  { name: "z", super: true, action: "undo" },
  { name: "z", super: true, shift: true, action: "redo" },
  { name: "f", meta: true, action: "word-forward" },
  { name: "b", meta: true, action: "word-backward" },
  { name: "right", meta: true, action: "word-forward" },
  { name: "left", meta: true, action: "word-backward" },
  { name: "right", ctrl: true, action: "word-forward" },
  { name: "left", ctrl: true, action: "word-backward" },
  { name: "f", meta: true, shift: true, action: "select-word-forward" },
  { name: "b", meta: true, shift: true, action: "select-word-backward" },
  { name: "right", meta: true, shift: true, action: "select-word-forward" },
  { name: "left", meta: true, shift: true, action: "select-word-backward" },
  { name: "backspace", meta: true, action: "delete-word-backward" },
  { name: "left", super: true, action: "visual-line-home" },
  { name: "right", super: true, action: "visual-line-end" },
  { name: "up", super: true, action: "buffer-home" },
  { name: "down", super: true, action: "buffer-end" },
  { name: "backspace", super: true, action: "delete-to-line-start" },
  { name: "left", super: true, shift: true, action: "select-visual-line-home" },
  { name: "right", super: true, shift: true, action: "select-visual-line-end" },
  { name: "up", super: true, shift: true, action: "select-buffer-home" },
  { name: "down", super: true, shift: true, action: "select-buffer-end" },
  { name: "a", super: true, action: "select-all" }
];

class TextareaRenderable extends EditBufferRenderable2 {
  _placeholder;
  _placeholderColor;
  _unfocusedBackgroundColor;
  _unfocusedTextColor;
  _focusedBackgroundColor;
  _focusedTextColor;
  _keyBindingsMap;
  _keyAliasMap;
  _keyBindings;
  _actionHandlers;
  _initialValueSet = false;
  _submitListener = undefined;
  static defaults = {
    backgroundColor: "transparent",
    textColor: "#FFFFFF",
    focusedBackgroundColor: "transparent",
    focusedTextColor: "#FFFFFF",
    placeholder: null,
    placeholderColor: "#666666"
  };
  constructor(ctx, options) {
    const defaults = TextareaRenderable.defaults;
    const baseOptions = {
      ...options,
      backgroundColor: options.backgroundColor || defaults.backgroundColor,
      textColor: options.textColor || defaults.textColor
    };
    super(ctx, baseOptions);
    try {
      this._unfocusedBackgroundColor = RGBA2.clone(parseColor2(options.backgroundColor || defaults.backgroundColor));
      this._unfocusedTextColor = RGBA2.clone(parseColor2(options.textColor || defaults.textColor));
      this._focusedBackgroundColor = RGBA2.clone(parseColor2(options.focusedBackgroundColor || options.backgroundColor || defaults.focusedBackgroundColor));
      this._focusedTextColor = RGBA2.clone(parseColor2(options.focusedTextColor || options.textColor || defaults.focusedTextColor));
      this._placeholder = clonePlaceholder(options.placeholder ?? defaults.placeholder);
      this._placeholderColor = RGBA2.clone(parseColor2(options.placeholderColor ?? defaults.placeholderColor));
      this._keyAliasMap = mergeKeyAliases(defaultKeyAliases, options.keyAliasMap || {});
      this._keyBindings = options.keyBindings || [];
      const mergedBindings = mergeKeyBindings(defaultTextareaKeyBindings, this._keyBindings);
      this._keyBindingsMap = buildKeyBindingsMap(mergedBindings, this._keyAliasMap);
      this._actionHandlers = this.buildActionHandlers();
      this._submitListener = options.onSubmit;
      const initialValue = options.initialValue;
      if (initialValue) {
        this.runMutation(() => {
          this.setText(initialValue);
          this._initialValueSet = true;
        });
      }
      this.updateColors();
      this.applyPlaceholder(this._placeholder);
    } catch (error) {
      this.rollbackConstruction(error);
    }
  }
  applyPlaceholder(placeholder, color = this._placeholderColor) {
    if (placeholder === null) {
      this.editorView.setPlaceholderStyledText([]);
      return;
    }
    if (typeof placeholder === "string") {
      const colorStyle = fg2(color);
      const chunks = [colorStyle(placeholder)];
      this.editorView.setPlaceholderStyledText(chunks);
    } else {
      this.editorView.setPlaceholderStyledText(placeholder.chunks);
    }
  }
  buildActionHandlers() {
    return new Map([
      ["move-left", () => this.moveCursorLeft()],
      ["move-right", () => this.moveCursorRight()],
      ["move-up", () => this.moveCursorUp()],
      ["move-down", () => this.moveCursorDown()],
      ["select-left", () => this.moveCursorLeft({ select: true })],
      ["select-right", () => this.moveCursorRight({ select: true })],
      ["select-up", () => this.moveCursorUp({ select: true })],
      ["select-down", () => this.moveCursorDown({ select: true })],
      ["line-home", () => this.gotoLineHome()],
      ["line-end", () => this.gotoLineEnd()],
      ["select-line-home", () => this.gotoLineHome({ select: true })],
      ["select-line-end", () => this.gotoLineEnd({ select: true })],
      ["visual-line-home", () => this.gotoVisualLineHome()],
      ["visual-line-end", () => this.gotoVisualLineEnd()],
      ["select-visual-line-home", () => this.gotoVisualLineHome({ select: true })],
      ["select-visual-line-end", () => this.gotoVisualLineEnd({ select: true })],
      ["select-buffer-home", () => this.gotoBufferHome({ select: true })],
      ["select-buffer-end", () => this.gotoBufferEnd({ select: true })],
      ["buffer-home", () => this.gotoBufferHome()],
      ["buffer-end", () => this.gotoBufferEnd()],
      ["delete-line", () => this.deleteLine()],
      ["delete-to-line-end", () => this.deleteToLineEnd()],
      ["delete-to-line-start", () => this.deleteToLineStart()],
      ["backspace", () => this.deleteCharBackward()],
      ["delete", () => this.deleteChar()],
      ["newline", () => this.newLine()],
      ["undo", () => this.undo()],
      ["redo", () => this.redo()],
      ["word-forward", () => this.moveWordForward()],
      ["word-backward", () => this.moveWordBackward()],
      ["select-word-forward", () => this.moveWordForward({ select: true })],
      ["select-word-backward", () => this.moveWordBackward({ select: true })],
      ["delete-word-forward", () => this.deleteWordForward()],
      ["delete-word-backward", () => this.deleteWordBackward()],
      ["select-all", () => this.selectAll()],
      ["submit", () => this.submit()]
    ]);
  }
  handlePaste(event) {
    this.insertText(stripAnsiSequences2(decodePasteBytes2(event.bytes)));
  }
  handleKeyPress(key) {
    if (this.traits.suspend !== true) {
      const action = getKeyBindingAction(this._keyBindingsMap, key);
      if (action) {
        const handler = this._actionHandlers.get(action);
        if (handler) {
          return handler();
        }
      }
    }
    if (!key.ctrl && !key.meta && !key.super && !key.hyper) {
      if (key.name === "space") {
        this.insertText(" ");
        return true;
      }
      if (key.sequence && !unsupportedKeyCharacters.test(key.sequence)) {
        this.insertText(key.sequence);
        return true;
      }
    }
    return false;
  }
  updateColors() {
    if (this.isDestroyed)
      return;
    const effectiveBg = this._focused ? this._focusedBackgroundColor : this._unfocusedBackgroundColor;
    const effectiveFg = this._focused ? this._focusedTextColor : this._unfocusedTextColor;
    super.backgroundColor = effectiveBg;
    super.textColor = effectiveFg;
  }
  focus() {
    super.focus();
    this.updateColors();
  }
  blur() {
    super.blur();
    this.updateColors();
  }
  get placeholder() {
    return clonePlaceholder(this._placeholder);
  }
  set placeholder(value) {
    const normalizedValue = clonePlaceholder(value ?? null);
    if (this._placeholder !== normalizedValue) {
      this.runMutation(() => {
        this.applyPlaceholder(normalizedValue);
        this._placeholder = normalizedValue;
        this.requestRender();
      });
    }
  }
  get placeholderColor() {
    return RGBA2.clone(this._placeholderColor);
  }
  set placeholderColor(value) {
    const color = RGBA2.clone(parseColor2(value ?? TextareaRenderable.defaults.placeholderColor));
    this.runMutation(() => {
      this.applyPlaceholder(this._placeholder, color);
      this._placeholderColor = color;
      this.requestRender();
    });
  }
  get backgroundColor() {
    return RGBA2.clone(this._unfocusedBackgroundColor);
  }
  set backgroundColor(value) {
    this._unfocusedBackgroundColor = RGBA2.clone(parseColor2(value ?? TextareaRenderable.defaults.backgroundColor));
    this.updateColors();
  }
  get textColor() {
    return RGBA2.clone(this._unfocusedTextColor);
  }
  set textColor(value) {
    this._unfocusedTextColor = RGBA2.clone(parseColor2(value ?? TextareaRenderable.defaults.textColor));
    this.updateColors();
  }
  set focusedBackgroundColor(value) {
    this._focusedBackgroundColor = RGBA2.clone(parseColor2(value ?? TextareaRenderable.defaults.focusedBackgroundColor));
    this.updateColors();
  }
  set focusedTextColor(value) {
    this._focusedTextColor = RGBA2.clone(parseColor2(value ?? TextareaRenderable.defaults.focusedTextColor));
    this.updateColors();
  }
  set initialValue(value) {
    if (!this._initialValueSet) {
      this.runMutation(() => {
        this.setText(value);
        this._initialValueSet = true;
      });
    }
  }
  submit() {
    if (this._submitListener) {
      this._submitListener({});
    }
    return true;
  }
  set onSubmit(handler) {
    this._submitListener = handler;
  }
  get onSubmit() {
    return this._submitListener;
  }
  set keyBindings(bindings) {
    this._keyBindings = bindings ?? [];
    const mergedBindings = mergeKeyBindings(defaultTextareaKeyBindings, this._keyBindings);
    this._keyBindingsMap = buildKeyBindingsMap(mergedBindings, this._keyAliasMap);
  }
  set keyAliasMap(aliases) {
    this._keyAliasMap = mergeKeyAliases(defaultKeyAliases, aliases);
    const mergedBindings = mergeKeyBindings(defaultTextareaKeyBindings, this._keyBindings);
    this._keyBindingsMap = buildKeyBindingsMap(mergedBindings, this._keyAliasMap);
  }
  get extmarks() {
    return this.editorView.extmarks;
  }
}

// src/renderables/Input.ts
function fit(text, max) {
  const cut = text.substring(0, max);
  return (text.codePointAt(cut.length - 1) ?? 0) > 65535 ? cut.slice(0, -1) : cut;
}
var InputRenderableEvents;
((InputRenderableEvents) => {
  InputRenderableEvents["INPUT"] = "input";
  InputRenderableEvents["CHANGE"] = "change";
  InputRenderableEvents["ENTER"] = "enter";
})(InputRenderableEvents ||= {});

class InputRenderable extends TextareaRenderable {
  _maxLength;
  _minLength;
  _lastCommittedValue = "";
  static defaultOptions = {
    placeholder: "",
    maxLength: 1000,
    minLength: 0,
    value: ""
  };
  constructor(ctx, options) {
    const defaults = InputRenderable.defaultOptions;
    const maxLength = options.maxLength ?? defaults.maxLength;
    const minLength = options.minLength ?? defaults.minLength;
    const rawValue = options.value ?? defaults.value;
    const initialValue = fit(rawValue.replace(/[\n\r]/g, ""), maxLength);
    if (minLength > maxLength) {
      throw new Error(`InputRenderable: minLength (${minLength}) cannot be greater than maxLength (${maxLength})`);
    }
    super(ctx, {
      ...options,
      placeholder: options.placeholder ?? defaults.placeholder,
      initialValue,
      height: 1,
      wrapMode: "none",
      keyBindings: [
        { name: "return", action: "submit" },
        { name: "kpenter", action: "submit" },
        { name: "linefeed", action: "submit" },
        ...options.keyBindings || []
      ]
    });
    try {
      this._maxLength = maxLength;
      this._minLength = minLength;
      this._lastCommittedValue = this.plainText;
      if (initialValue) {
        this.cursorOffset = this.editBuffer.getEOL().offset;
      }
    } catch (error) {
      this.rollbackConstruction(error);
    }
  }
  newLine() {
    return false;
  }
  insertText(text) {
    const sanitized = text.replace(/[\n\r]/g, "");
    if (!sanitized)
      return;
    const toInsert = fit(sanitized, this._maxLength - this.plainText.length + this.getSelectedText().length);
    if (!toInsert)
      return;
    this.runMutation(() => {
      super.insertText(toInsert);
      this.emit("input" /* INPUT */, this.plainText);
    });
  }
  defaultDimension(kind) {
    return kind === "height" ? 1 : super.defaultDimension(kind);
  }
  get value() {
    return this.plainText;
  }
  set value(value) {
    const newValue = fit(value.replace(/[\n\r]/g, ""), this._maxLength);
    const currentValue = this.plainText;
    if (currentValue !== newValue) {
      this.runMutation(() => {
        this.setText(newValue);
        this.cursorOffset = this.editBuffer.getEOL().offset;
        this.emit("input" /* INPUT */, newValue);
      });
    }
  }
  focus() {
    super.focus();
    this._lastCommittedValue = this.plainText;
  }
  blur() {
    if (!this.isDestroyed) {
      const currentValue = this.plainText;
      if (currentValue !== this._lastCommittedValue) {
        this._lastCommittedValue = currentValue;
        this.emit("change" /* CHANGE */, currentValue);
      }
    }
    super.blur();
  }
  submit() {
    const currentValue = this.plainText;
    if (currentValue.length < this._minLength) {
      return false;
    }
    if (currentValue !== this._lastCommittedValue) {
      this._lastCommittedValue = currentValue;
      this.emit("change" /* CHANGE */, currentValue);
    }
    this.emit("enter" /* ENTER */, currentValue);
    return true;
  }
  deleteCharBackward() {
    const result = super.deleteCharBackward();
    this.emit("input" /* INPUT */, this.plainText);
    return result;
  }
  deleteChar() {
    const result = super.deleteChar();
    this.emit("input" /* INPUT */, this.plainText);
    return result;
  }
  deleteLine() {
    const result = super.deleteLine();
    this.emit("input" /* INPUT */, this.plainText);
    return result;
  }
  deleteWordBackward() {
    const result = super.deleteWordBackward();
    this.emit("input" /* INPUT */, this.plainText);
    return result;
  }
  deleteWordForward() {
    const result = super.deleteWordForward();
    this.emit("input" /* INPUT */, this.plainText);
    return result;
  }
  deleteToLineStart() {
    const result = super.deleteToLineStart();
    this.emit("input" /* INPUT */, this.plainText);
    return result;
  }
  deleteToLineEnd() {
    const result = super.deleteToLineEnd();
    this.emit("input" /* INPUT */, this.plainText);
    return result;
  }
  undo() {
    const result = super.undo();
    this.emit("input" /* INPUT */, this.plainText);
    return result;
  }
  redo() {
    const result = super.redo();
    this.emit("input" /* INPUT */, this.plainText);
    return result;
  }
  deleteCharacter(direction) {
    if (direction === "backward") {
      this.deleteCharBackward();
    } else {
      this.deleteChar();
    }
  }
  set maxLength(maxLength) {
    const currentValue = this.plainText;
    if (currentValue.length > maxLength) {
      this.runMutation(() => {
        this.setText(fit(currentValue, maxLength));
        this._maxLength = maxLength;
      });
    } else {
      this._maxLength = maxLength;
    }
  }
  get maxLength() {
    return this._maxLength;
  }
  set minLength(minLength) {
    if (minLength > this._maxLength) {
      throw new Error(`InputRenderable: minLength (${minLength}) cannot be greater than maxLength (${this._maxLength})`);
    }
    this._minLength = minLength;
  }
  get minLength() {
    return this._minLength;
  }
  set placeholder(placeholder) {
    super.placeholder = placeholder;
  }
  get placeholder() {
    const p = super.placeholder;
    return typeof p === "string" ? p : "";
  }
  set initialValue(value) {}
}
// src/renderables/Video.ts
function validateVolume(value) {
  if (!Number.isFinite(value) || value < 0 || value > 340282346638528860000000000000000000000)
    throw new RangeError("volume must be a finite, non-negative 32-bit float");
}
function validateAvSyncOffset(value) {
  if (!Number.isFinite(value) || Math.abs(value) > 60000)
    throw new RangeError("avSyncOffsetMs must be from -60000 to 60000");
}
function validateMaxFps(value) {
  if (!Number.isInteger(value) || value < 1 || value > 120)
    throw new RangeError("maxFps must be an integer from 1 to 120");
}
function toMicroseconds(seconds, label) {
  const value = Math.round(seconds * 1e6);
  if (!Number.isFinite(seconds) || !Number.isSafeInteger(value))
    throw new RangeError(`${label} must be finite`);
  return BigInt(value);
}

class VideoRenderable extends Renderable2 {
  static nativeIntegration = {
    kind: "video",
    body: { native: this.prototype.renderSelf, buffered: true },
    bufferComposition: "native"
  };
  _source;
  _fit;
  _crop;
  _loop;
  _audio;
  _muted;
  _volume;
  _avSyncOffsetMs;
  _maxFps;
  _autoplay;
  _metadata = null;
  _playRequested = false;
  stopTick;
  _opens = 0;
  onReady;
  onError;
  onEnd;
  onPlay;
  onPause;
  onSeek;
  onTimeUpdate;
  constructor(ctx, options) {
    super(ctx, options);
    try {
      this._fit = options.fit ?? "fit";
      this._loop = options.loop ?? false;
      this._audio = options.audio ?? true;
      this._muted = options.muted ?? false;
      this._volume = options.volume ?? 1;
      validateVolume(this._volume);
      this._avSyncOffsetMs = options.avSyncOffsetMs ?? 0;
      validateAvSyncOffset(this._avSyncOffsetMs);
      this._maxFps = options.maxFps ?? 30;
      validateMaxFps(this._maxFps);
      this._autoplay = options.autoplay ?? false;
      this.onReady = options.onReady;
      this.onError = options.onError;
      this.onEnd = options.onEnd;
      this.onPlay = options.onPlay;
      this.onPause = options.onPause;
      this.onSeek = options.onSeek;
      this.onTimeUpdate = options.onTimeUpdate;
      this.setNativeSceneVideo();
      if (options.source !== undefined)
        this.source = options.source;
      this.crop = options.crop;
    } catch (error) {
      this.abortConstruction(error, () => this.destroySelf());
    }
  }
  get source() {
    return this._source;
  }
  set source(value) {
    value ??= undefined;
    if (value === this._source && !this.failed() || this.isDestroyed)
      return;
    this.open(value, this.playing);
  }
  open(value, resume) {
    this._opens++;
    this._source = value;
    this._metadata = null;
    this._playRequested = resume;
    const native = this.native();
    try {
      const info = native.lib.videoOpen(native.context, native.node, value ?? "", this._audio);
      if (!value)
        return;
      this._playRequested = resume || this._autoplay;
      this._metadata = {
        width: info.width,
        height: info.height,
        fps: info.fpsDen > 0 ? info.fpsNum / info.fpsDen : 0,
        duration: Number(info.durationUs) / 1e6,
        hasAudio: info.hasAudio
      };
      native.lib.videoSetLoop(native.context, native.node, this._loop);
      native.lib.videoSetMuted(native.context, native.node, this._muted);
      native.lib.videoSetVolume(native.context, native.node, this._volume);
      native.lib.videoSetAvSyncOffset(native.context, native.node, toMicroseconds(this._avSyncOffsetMs / 1000, "avSyncOffsetMs"));
      native.lib.videoSetMaxFps(native.context, native.node, this._maxFps);
      const metadata = { ...this._metadata };
      this.afterOpen(() => {
        this.onReady?.(metadata);
        this.startRequested();
        try {
          if (this._crop)
            checkCrop2(this._crop, metadata.width, metadata.height);
        } catch (error) {
          this.reportError(error, "");
        }
      });
    } catch (error) {
      this._metadata = null;
      this._playRequested = false;
      const detail = this.errorDetail("");
      this.afterOpen(() => this.reportError(error, detail));
    } finally {
      this.syncPlayback();
      this.requestRender();
    }
  }
  get fit() {
    return this._fit;
  }
  set fit(value) {
    const next = value ?? "fit";
    if (this._fit === next || this.isDestroyed)
      return;
    this.setNativeSceneVideo(next);
    this._fit = next;
    this.requestRender();
  }
  get crop() {
    return this._crop && { ...this._crop };
  }
  set crop(value) {
    if (sameCrop2(this._crop, value ?? undefined) || this.isDestroyed)
      return;
    const next = this.acceptCrop(value ?? undefined);
    if (next === null)
      return;
    this._ctx.nativeScene.setCrop(this, next);
    this._crop = next;
    this.requestRender();
  }
  get loop() {
    return this._loop;
  }
  set loop(value) {
    const next = value ?? false;
    if (this._loop === next || this.isDestroyed)
      return;
    if (this.applyOption((native) => native.lib.videoSetLoop(native.context, native.node, next)))
      this._loop = next;
  }
  get audio() {
    return this._audio;
  }
  set audio(value) {
    const next = value ?? true;
    if (this._audio === next || this.isDestroyed)
      return;
    this._audio = next;
    if (this._metadata)
      this.open(this._source, this.playing);
  }
  get muted() {
    return this._muted;
  }
  set muted(value) {
    const next = value ?? false;
    if (this._muted === next || this.isDestroyed)
      return;
    if (this.applyOption((native) => native.lib.videoSetMuted(native.context, native.node, next)))
      this._muted = next;
  }
  get volume() {
    return this._volume;
  }
  set volume(value) {
    const next = value ?? 1;
    validateVolume(next);
    if (this._volume === next || this.isDestroyed)
      return;
    if (this.applyOption((native) => native.lib.videoSetVolume(native.context, native.node, next)))
      this._volume = next;
  }
  get avSyncOffsetMs() {
    return this._avSyncOffsetMs;
  }
  set avSyncOffsetMs(value) {
    const next = value ?? 0;
    validateAvSyncOffset(next);
    if (this._avSyncOffsetMs === next || this.isDestroyed)
      return;
    const offset = toMicroseconds(next / 1000, "avSyncOffsetMs");
    if (this.applyOption((native) => native.lib.videoSetAvSyncOffset(native.context, native.node, offset)))
      this._avSyncOffsetMs = next;
  }
  get maxFps() {
    return this._maxFps;
  }
  set maxFps(value) {
    const next = value ?? 30;
    validateMaxFps(next);
    if (this._maxFps === next || this.isDestroyed)
      return;
    if (!this.applyOption((native) => native.lib.videoSetMaxFps(native.context, native.node, next)))
      return;
    this._maxFps = next;
    this.syncPlayback();
  }
  get autoplay() {
    return this._autoplay;
  }
  set autoplay(value) {
    const next = value ?? false;
    if (this._autoplay === next || this.isDestroyed)
      return;
    this._autoplay = next;
    if (!next || !this._metadata)
      return;
    const requested = this.control((native) => {
      const state = native.lib.videoGetState(native.context, native.node);
      if (state.playing || state.ended || state.currentTimeUs !== 0n)
        return false;
      this._playRequested = true;
    });
    if (requested)
      this.afterOpen(() => this.startRequested());
  }
  get ready() {
    return this._metadata !== null;
  }
  get videoMetadata() {
    return this._metadata ? { ...this._metadata } : null;
  }
  get playing() {
    if (this.isDestroyed)
      return false;
    return this._playRequested || this._metadata !== null && this.readState().playing;
  }
  get paused() {
    return !this.playing;
  }
  get ended() {
    return this._metadata !== null && !this.isDestroyed && this.readState().ended;
  }
  get duration() {
    return this._metadata?.duration ?? 0;
  }
  get durationMs() {
    return this.duration * 1000;
  }
  get currentTime() {
    if (!this._metadata || this.isDestroyed)
      return 0;
    return Number(this.readState().currentTimeUs) / 1e6;
  }
  set currentTime(value) {
    if (value == null)
      return;
    this.seek(value);
  }
  get qualityTier() {
    if (!this._metadata || this.isDestroyed)
      return 0;
    return this.readState().qualityTier;
  }
  get currentTimeMs() {
    return this.currentTime * 1000;
  }
  play() {
    if (this.isDestroyed || this._playRequested)
      return;
    if (!this._metadata) {
      if (this._source !== undefined)
        this.open(this._source, true);
      else
        this._playRequested = true;
      return;
    }
    const started = this.control((native) => {
      if (native.lib.videoGetState(native.context, native.node).playing)
        return false;
      native.lib.videoCall(native.context, native.node, "ot_video_play");
    });
    if (started)
      this.onPlay?.();
  }
  resume() {
    this.play();
  }
  pause() {
    if (this.isDestroyed)
      return;
    const requested = this._playRequested;
    this._playRequested = false;
    if (!this._metadata)
      return;
    const paused = this.control((native) => {
      if (requested)
        return;
      if (!native.lib.videoGetState(native.context, native.node).playing)
        return false;
      native.lib.videoCall(native.context, native.node, "ot_video_pause");
    });
    if (!paused)
      return;
    const time = this.currentTime;
    this.onPause?.();
    this.onTimeUpdate?.(time);
  }
  toggle() {
    if (this.playing)
      this.pause();
    else
      this.play();
  }
  seek(time) {
    const target = toMicroseconds(time, "Video time");
    if (!this._metadata || this.isDestroyed)
      return;
    if (!this.control((native) => native.lib.videoSeek(native.context, native.node, target)))
      return;
    const position = this.currentTime;
    this.onSeek?.(position);
    this.onTimeUpdate?.(position);
  }
  seekBy(delta) {
    if (!Number.isFinite(delta))
      throw new RangeError("Video seek delta must be finite");
    this.seek(this.currentTime + delta);
  }
  seekToMs(milliseconds) {
    if (!Number.isFinite(milliseconds))
      throw new RangeError("Video time must be finite");
    this.seek(milliseconds / 1000);
  }
  createFrameBuffer() {
    const previous = this.frameBuffer;
    super.createFrameBuffer();
    if (this._fit === undefined || this.frameBuffer === previous)
      return;
    this.setNativeSceneVideo();
  }
  renderSelf(_buffer) {}
  poll() {
    if (!this._metadata || this.isDestroyed)
      return;
    let state;
    try {
      state = this.readState();
    } catch (error) {
      this.reportError(error);
      this.syncPlayback(false);
      return;
    }
    if (state.failed) {
      this.reportError(new Error(this.errorDetail("Video playback failed")));
      this.syncPlayback();
      return;
    }
    this.onTimeUpdate?.(Number(state.currentTimeUs) / 1e6);
    if (state.ended) {
      this.syncPlayback();
      this.onEnd?.();
    }
  }
  native() {
    return this._ctx.nativeScene.videoNode(this);
  }
  readState() {
    const native = this.native();
    return native.lib.videoGetState(native.context, native.node);
  }
  failed() {
    if (!this._metadata)
      return false;
    try {
      return this.readState().failed;
    } catch {
      return true;
    }
  }
  errorDetail(fallback) {
    try {
      const native = this.native();
      return native.lib.videoGetError(native.context, native.node) || fallback;
    } catch {
      return fallback;
    }
  }
  applyOption(call) {
    return !this._metadata || this.control(call);
  }
  control(call) {
    let reported = false;
    try {
      return call(this.native()) !== false;
    } catch (error) {
      reported = true;
      this.reportError(error);
      return false;
    } finally {
      this.syncPlayback(!reported);
      this.requestRender();
    }
  }
  syncPlayback(report = true) {
    if (this.isDestroyed)
      return;
    let active = false;
    try {
      active = this._metadata !== null && (this._playRequested || this.readState().playing);
    } catch (error) {
      if (report)
        this.reportError(error);
    }
    this.stopTick?.();
    this.stopTick = active ? this._ctx.onAnimationTick(this._maxFps, () => this.poll()) : undefined;
  }
  setNativeSceneVideo(fit = this._fit) {
    this._ctx.nativeScene.setVideo(this, fit, this.buffered ? this.frameBuffer : null);
  }
  acceptCrop(crop) {
    try {
      return crop && checkCrop2(crop, this._metadata?.width, this._metadata?.height);
    } catch (error) {
      queueMicrotask(() => this.isDestroyed || this.reportError(error, ""));
      return null;
    }
  }
  startRequested() {
    if (!this._playRequested)
      return;
    this._playRequested = false;
    if (this.control((native) => native.lib.videoCall(native.context, native.node, "ot_video_play")))
      this.onPlay?.();
  }
  afterOpen(report) {
    const opens = this._opens;
    queueMicrotask(() => {
      if (this._opens === opens && !this.isDestroyed)
        report();
    });
  }
  reportError(error, detail = this.errorDetail("")) {
    const value = error instanceof Error ? error : new Error(String(error));
    this.onError?.(detail && !value.message.includes(detail) ? new Error(`${value.message}: ${detail}`) : value);
  }
  destroySelf() {
    this.runCleanup((run) => {
      run(() => this.stopTick?.());
      run(() => super.destroySelf());
    });
  }
}
// src/renderables/text-table-width.ts
function comparePriority(leftGrowth, leftCapacity, rightGrowth, rightCapacity) {
  const left = leftGrowth * leftGrowth * rightCapacity;
  const right = rightGrowth * rightGrowth * leftCapacity;
  if (Number.isSafeInteger(left) && Number.isSafeInteger(right)) {
    return left < right ? -1 : left > right ? 1 : 0;
  }
  const exactLeft = BigInt(leftGrowth) * BigInt(leftGrowth) * BigInt(rightCapacity);
  const exactRight = BigInt(rightGrowth) * BigInt(rightGrowth) * BigInt(leftCapacity);
  return exactLeft < exactRight ? -1 : exactLeft > exactRight ? 1 : 0;
}
function allocateProportionalColumnWidths(widths, targetWidth, minWidth) {
  const baseWidths = widths.map((width) => Math.max(minWidth, Math.floor(width)));
  const totalBaseWidth = baseWidths.reduce((sum, width) => sum + width, 0);
  const capacity = baseWidths.map((width) => width - minWidth);
  const growth = new Array(baseWidths.length).fill(0);
  const available = Math.min(Math.max(0, targetWidth - minWidth * baseWidths.length), totalBaseWidth - minWidth * baseWidths.length);
  if (available === 0)
    return growth.map(() => minWidth);
  if (available === capacity.reduce((sum, width) => sum + width, 0))
    return baseWidths;
  const weights = capacity.map(Math.sqrt);
  const active = capacity.map((width, idx) => ({ idx, width, weight: weights[idx] })).filter((column) => column.width > 0).sort((a, b) => a.weight - b.weight);
  if (active.length === capacity.length && capacity.every((width) => width === capacity[0])) {
    const sharedGrowth = Math.floor(available / capacity.length);
    const remainder = available % capacity.length;
    return growth.map((_, idx) => minWidth + sharedGrowth + (idx < remainder ? 1 : 0));
  }
  let remaining = available;
  let totalWeight = active.reduce((sum, column) => sum + column.weight, 0);
  for (const column of active) {
    if (remaining / totalWeight <= column.weight)
      break;
    growth[column.idx] = column.width;
    remaining -= column.width;
    totalWeight -= column.weight;
  }
  const level = remaining / totalWeight;
  for (const column of active) {
    if (growth[column.idx] === column.width)
      continue;
    growth[column.idx] = Math.min(column.width, Math.floor(level * column.weight));
  }
  let allocatedGrowth = growth.reduce((sum, width) => sum + width, 0);
  while (allocatedGrowth > available) {
    let worstIdx = -1;
    for (let idx = 0;idx < baseWidths.length; idx++) {
      if (growth[idx] === 0)
        continue;
      const comparison = worstIdx === -1 ? 1 : comparePriority(growth[idx], capacity[idx], growth[worstIdx], capacity[worstIdx]);
      if (comparison > 0 || comparison === 0 && idx > worstIdx) {
        worstIdx = idx;
      }
    }
    if (worstIdx === -1)
      break;
    growth[worstIdx] -= 1;
    allocatedGrowth -= 1;
  }
  while (allocatedGrowth < available) {
    let bestIdx = -1;
    for (let idx = 0;idx < baseWidths.length; idx++) {
      if (growth[idx] >= capacity[idx])
        continue;
      const comparison = bestIdx === -1 ? -1 : comparePriority(growth[idx] + 1, capacity[idx], growth[bestIdx] + 1, capacity[bestIdx]);
      if (comparison < 0) {
        bestIdx = idx;
      }
    }
    if (bestIdx === -1)
      break;
    growth[bestIdx] += 1;
    allocatedGrowth += 1;
  }
  return growth.map((width) => width + minWidth);
}

// src/renderables/TextTable.ts
var MEASURE_HEIGHT = 1e4;

class TextTableRenderable extends Renderable2 {
  _content;
  _wrapMode;
  _columnWidthMode;
  _columnFitter;
  _cellPaddingX;
  _cellPaddingY;
  _columnGap;
  _showBorders;
  _border;
  _outerBorder;
  _hasExplicitOuterBorder;
  _borderStyle;
  _borderColor;
  _borderBackgroundColor;
  _backgroundColor;
  _defaultFg;
  _defaultBg;
  _defaultAttributes;
  _selectionBg;
  _selectionFg;
  _lastLocalSelection = null;
  _lastSelectionMode = null;
  _cells = [];
  _prevCellContent = [];
  _rowCount = 0;
  _columnCount = 0;
  _layout = this.createEmptyLayout();
  _layoutDirty = true;
  _cachedMeasureLayout = null;
  _cachedMeasureWidth = undefined;
  _defaultOptions = {
    content: [],
    wrapMode: "word",
    columnWidthMode: "full",
    columnFitter: "proportional",
    cellPadding: 0,
    cellPaddingX: undefined,
    cellPaddingY: undefined,
    columnGap: 0,
    showBorders: true,
    border: true,
    outerBorder: true,
    selectable: true,
    selectionBg: undefined,
    selectionFg: undefined,
    borderStyle: "single",
    borderColor: "#FFFFFF",
    borderBackgroundColor: "transparent",
    backgroundColor: "transparent",
    fg: "#FFFFFF",
    bg: "transparent",
    attributes: 0
  };
  constructor(ctx, options = {}) {
    super(ctx, { ...options, flexShrink: options.flexShrink ?? 0 });
    try {
      this._content = options.content ?? this._defaultOptions.content;
      this._wrapMode = options.wrapMode ?? this._defaultOptions.wrapMode;
      this._columnWidthMode = options.columnWidthMode ?? this._defaultOptions.columnWidthMode;
      this._columnFitter = this.resolveColumnFitter(options.columnFitter);
      this._cellPaddingX = this.resolveCellPadding(options.cellPaddingX ?? options.cellPadding);
      this._cellPaddingY = this.resolveCellPadding(options.cellPaddingY ?? options.cellPadding);
      this._columnGap = this.resolveColumnGap(options.columnGap);
      this._showBorders = options.showBorders ?? this._defaultOptions.showBorders;
      this._border = options.border ?? this._defaultOptions.border;
      this._hasExplicitOuterBorder = options.outerBorder !== undefined;
      this._outerBorder = options.outerBorder ?? this._border;
      this.selectable = options.selectable ?? this._defaultOptions.selectable;
      this._selectionBg = options.selectionBg ? RGBA2.clone(parseColor2(options.selectionBg)) : undefined;
      this._selectionFg = options.selectionFg ? RGBA2.clone(parseColor2(options.selectionFg)) : undefined;
      this._borderStyle = parseBorderStyle2(options.borderStyle, this._defaultOptions.borderStyle);
      this._borderColor = RGBA2.clone(parseColor2(options.borderColor ?? this._defaultOptions.borderColor));
      this._borderBackgroundColor = RGBA2.clone(parseColor2(options.borderBackgroundColor ?? this._defaultOptions.borderBackgroundColor));
      this._backgroundColor = RGBA2.clone(parseColor2(options.backgroundColor ?? this._defaultOptions.backgroundColor));
      this._defaultFg = RGBA2.clone(parseColor2(options.fg ?? this._defaultOptions.fg));
      this._defaultBg = RGBA2.clone(parseColor2(options.bg ?? this._defaultOptions.bg));
      this._defaultAttributes = options.attributes ?? this._defaultOptions.attributes;
      this.setupMeasureFunc();
      this.runMutation(() => this.rebuildCells(this._content));
    } catch (error) {
      this.abortConstruction(error, () => this.destroyCells());
    }
  }
  get content() {
    return this._content;
  }
  set content(value) {
    this.runMutation(() => this.rebuildCells(value ?? []));
  }
  get wrapMode() {
    return this._wrapMode;
  }
  set wrapMode(value) {
    if (this._wrapMode === value)
      return;
    this.runMutation(() => {
      this._wrapMode = value;
      for (const row of this._cells) {
        for (const cell of row)
          cell.textBufferView.setWrapMode(value);
      }
      this.invalidateLayout();
    });
  }
  get columnWidthMode() {
    return this._columnWidthMode;
  }
  set columnWidthMode(value) {
    if (this._columnWidthMode === value)
      return;
    this._columnWidthMode = value;
    this.invalidateLayout();
  }
  get columnFitter() {
    return this._columnFitter;
  }
  set columnFitter(value) {
    const next = this.resolveColumnFitter(value);
    if (this._columnFitter === next)
      return;
    this._columnFitter = next;
    this.invalidateLayout();
  }
  get cellPadding() {
    return this._cellPaddingX === this._cellPaddingY ? this._cellPaddingX : 0;
  }
  set cellPadding(value) {
    const next = this.resolveCellPadding(value);
    if (this._cellPaddingX === next && this._cellPaddingY === next)
      return;
    this._cellPaddingX = next;
    this._cellPaddingY = next;
    this.invalidateLayout();
  }
  get cellPaddingX() {
    return this._cellPaddingX;
  }
  set cellPaddingX(value) {
    const next = this.resolveCellPadding(value);
    if (this._cellPaddingX === next)
      return;
    this._cellPaddingX = next;
    this.invalidateLayout();
  }
  get cellPaddingY() {
    return this._cellPaddingY;
  }
  set cellPaddingY(value) {
    const next = this.resolveCellPadding(value);
    if (this._cellPaddingY === next)
      return;
    this._cellPaddingY = next;
    this.invalidateLayout();
  }
  get columnGap() {
    return this._columnGap;
  }
  set columnGap(value) {
    const next = this.resolveColumnGap(value);
    if (this._columnGap === next)
      return;
    this._columnGap = next;
    this.invalidateLayout();
  }
  get showBorders() {
    return this._showBorders;
  }
  set showBorders(value) {
    if (this._showBorders === value)
      return;
    this._showBorders = value;
    this.requestRender();
  }
  get outerBorder() {
    return this._outerBorder;
  }
  set outerBorder(value) {
    if (value == null)
      this._hasExplicitOuterBorder = false;
    const next = value ?? this._border;
    if (this._outerBorder === next)
      return;
    this._hasExplicitOuterBorder = value != null;
    this._outerBorder = next;
    this.invalidateLayout();
  }
  get border() {
    return this._border;
  }
  set border(value) {
    if (this._border === value)
      return;
    this._border = value;
    if (!this._hasExplicitOuterBorder) {
      this._outerBorder = value;
    }
    this.invalidateLayout();
  }
  get borderStyle() {
    return this._borderStyle;
  }
  set borderStyle(value) {
    const next = parseBorderStyle2(value, this._defaultOptions.borderStyle);
    if (this._borderStyle === next)
      return;
    this._borderStyle = next;
    this.requestRender();
  }
  get borderColor() {
    return RGBA2.clone(this._borderColor);
  }
  set borderColor(value) {
    this._borderColor = RGBA2.clone(parseColor2(value ?? this._defaultOptions.borderColor));
    this.requestRender();
  }
  get fg() {
    return this._defaultFg;
  }
  set fg(value) {
    const next = parseColor2(value ?? this._defaultOptions.fg);
    if (this._defaultFg.equals(next))
      return;
    this._defaultFg = next;
    for (const row of this._cells) {
      for (const cell of row) {
        cell.textBuffer.setDefaultFg(next);
      }
    }
    this.requestRender();
  }
  shouldStartSelection(x, y) {
    if (!this.selectable)
      return false;
    this.ensureLayoutReady();
    const localX = x - this.x;
    const localY = y - this.y;
    return this.getCellAtLocalPosition(localX, localY) !== null;
  }
  onSelectionChanged(selection) {
    this.ensureLayoutReady();
    const localSelection = convertGlobalToLocalSelection2(selection, Math.trunc(this.x), Math.trunc(this.y));
    this._lastLocalSelection = localSelection;
    if (!localSelection?.isActive) {
      this.resetCellSelections();
      this._lastSelectionMode = null;
    } else {
      this.applySelectionToCells(localSelection, selection?.isStart ?? false);
    }
    this.requestRender();
    return this.hasSelection();
  }
  hasSelection() {
    for (const row of this._cells) {
      for (const cell of row) {
        if (cell.textBufferView.hasSelection()) {
          return true;
        }
      }
    }
    return false;
  }
  getSelection() {
    for (const row of this._cells) {
      for (const cell of row) {
        const selection = cell.textBufferView.getSelection();
        if (selection) {
          return selection;
        }
      }
    }
    return null;
  }
  getSelectedText() {
    const selectedRows = [];
    for (let rowIdx = 0;rowIdx < this._rowCount; rowIdx++) {
      const rowSelections = [];
      for (let colIdx = 0;colIdx < this._columnCount; colIdx++) {
        const cell = this._cells[rowIdx]?.[colIdx];
        if (!cell || !cell.textBufferView.hasSelection())
          continue;
        const selectedText = cell.textBufferView.getSelectedText();
        if (selectedText.length > 0) {
          rowSelections.push(selectedText);
        }
      }
      if (rowSelections.length > 0) {
        selectedRows.push(rowSelections.join("\t"));
      }
    }
    return selectedRows.join(`
`);
  }
  onResize(width, height) {
    this.invalidateLayout(false);
    super.onResize(width, height);
  }
  renderSelf(buffer) {
    if (!this.visible || this.isDestroyed)
      return;
    this.ensureLayoutReady();
    const [x, y] = this._paintOrigin(buffer);
    buffer.pushScissorRect(x, y, this._paintWidth, this._paintHeight);
    if (buffer === this.frameBuffer)
      buffer.clear(this._backgroundColor);
    else if (this._backgroundColor.a > 0) {
      buffer.fillRect(x, y, this._paintWidth, this._paintHeight, this._backgroundColor);
    }
    this.drawBorders(buffer, x, y);
    this.drawCells(buffer, x, y);
    buffer.popScissorRect();
  }
  destroySelf() {
    this.destroyCells();
    super.destroySelf();
  }
  setupMeasureFunc() {
    const measureFunc = (width, widthMode, _height, _heightMode) => {
      const hasWidthConstraint = widthMode !== MeasureMode2.Undefined && Number.isFinite(width);
      const rawWidthConstraint = hasWidthConstraint ? Math.max(1, Math.floor(width)) : undefined;
      const widthConstraint = this.resolveLayoutWidthConstraint(rawWidthConstraint);
      const measuredLayout = this.computeLayout(widthConstraint);
      this._cachedMeasureLayout = measuredLayout;
      this._cachedMeasureWidth = widthConstraint;
      let measuredWidth = measuredLayout.tableWidth > 0 ? measuredLayout.tableWidth : 1;
      let measuredHeight = measuredLayout.tableHeight > 0 ? measuredLayout.tableHeight : 1;
      if (widthMode === MeasureMode2.AtMost && rawWidthConstraint !== undefined && this._positionType !== "absolute") {
        measuredWidth = Math.min(rawWidthConstraint, measuredWidth);
      }
      return {
        width: measuredWidth,
        height: measuredHeight
      };
    };
    this.setMeasureProvider(measureFunc);
  }
  rebuildCells(content) {
    const previous = this._cells;
    const previousContent = this._prevCellContent;
    const newRowCount = content.length;
    const rows = Array.from({ length: newRowCount }, (_, index) => content[index] ?? []);
    const newColumnCount = rows.reduce((max, row) => Math.max(max, row.length), 0);
    const cells = [];
    const refs = [];
    const created = [];
    const changes = [];
    const assertCurrent = () => {
      if (this.isDestroyed || this._cells !== previous)
        throw new Error("TextTable changed during cell preparation");
    };
    const lib = this._ctx.nativeScene.driver.renderLib;
    for (let rowIdx = 0;rowIdx < newRowCount; rowIdx++) {
      const row = rows[rowIdx];
      const rowRefs = [];
      for (let colIdx = 0;colIdx < newColumnCount; colIdx++) {
        const cellContent = row[colIdx];
        rowRefs.push(cellContent);
        if (!previous[rowIdx]?.[colIdx] || cellContent !== previousContent[rowIdx][colIdx]) {
          changes.push({
            row: rowIdx,
            col: colIdx,
            text: lib.encodeTextBufferStyledText(this.toStyledText(cellContent))
          });
        }
      }
      refs.push(rowRefs);
      cells.push(previous[rowIdx]?.slice(0, newColumnCount) ?? []);
    }
    assertCurrent();
    const reused = newRowCount === this._rowCount && newColumnCount === this._columnCount && TextBuffer2._replaceStyledTextBatch(changes.map(({ row, col, text }) => ({ ...previous[row][col], text })), assertCurrent);
    try {
      if (!reused) {
        for (const { row, col, text } of changes) {
          const cell = this.createCell(text);
          created.push(cell);
          cells[row][col] = cell;
        }
        for (const cell of created)
          cell.textBufferView.setWrapMode(this._wrapMode);
        assertCurrent();
      }
    } catch (error) {
      try {
        this.runCleanup((run) => {
          for (const cell of created)
            run(() => this.destroyCell(cell));
        });
      } catch {}
      throw error;
    }
    this._content = content;
    this._cells = cells;
    this._prevCellContent = refs;
    this._rowCount = newRowCount;
    this._columnCount = newColumnCount;
    this.runCleanup((run) => {
      run(() => this.invalidateLayout());
      for (let rowIdx = 0;rowIdx < previous.length; rowIdx++) {
        for (let colIdx = 0;colIdx < previous[rowIdx].length; colIdx++) {
          const cell = previous[rowIdx][colIdx];
          if (cell !== cells[rowIdx]?.[colIdx])
            run(() => this.destroyCell(cell));
        }
      }
    });
  }
  createCell(text) {
    const textBuffer = TextBuffer2.create(this._ctx.widthMethod, this._ctx.nativeScene);
    let textBufferView;
    try {
      textBuffer._setDefaults(this._defaultFg, this._defaultBg, this._defaultAttributes);
      textBuffer._setEncodedStyledText(text);
      textBufferView = TextBufferView2.create(textBuffer);
      return { textBuffer, textBufferView };
    } catch (error) {
      try {
        this.runCleanup((run) => {
          run(() => textBufferView?.destroy());
          run(() => textBuffer.destroy());
        });
      } catch {}
      throw error;
    }
  }
  toStyledText(content) {
    if (Array.isArray(content)) {
      return new StyledText2(content);
    }
    if (content === null || content === undefined) {
      return stringToStyledText2("");
    }
    return stringToStyledText2(String(content));
  }
  destroyCell(cell) {
    this.runCleanup((run) => {
      run(() => cell.textBufferView.destroy());
      run(() => cell.textBuffer.destroy());
    });
  }
  destroyCells() {
    const cells = this._cells;
    this._cells = [];
    this._prevCellContent = [];
    this._rowCount = 0;
    this._columnCount = 0;
    this._layout = this.createEmptyLayout();
    this.runCleanup((run) => {
      for (const row of cells) {
        for (const cell of row)
          run(() => this.destroyCell(cell));
      }
    });
  }
  rebuildLayoutForCurrentWidth() {
    const maxTableWidth = this.resolveLayoutWidthConstraint(this.width);
    let layout;
    if (this._cachedMeasureLayout !== null && this._cachedMeasureWidth === maxTableWidth) {
      layout = this._cachedMeasureLayout;
    } else {
      layout = this.computeLayout(maxTableWidth);
    }
    this._cachedMeasureLayout = null;
    this._cachedMeasureWidth = undefined;
    this._layout = layout;
    this.applyLayoutToViews(layout);
    this._layoutDirty = false;
    if (this._lastLocalSelection?.isActive) {
      this.applySelectionToCells(this._lastLocalSelection, true);
    }
  }
  computeLayout(maxTableWidth) {
    if (this._rowCount === 0 || this._columnCount === 0) {
      return this.createEmptyLayout();
    }
    const borderLayout = this.resolveBorderLayout();
    const intrinsicMeasures = this._cells.map((row) => row.map((cell) => cell.textBufferView.measureForDimensions(0, MEASURE_HEIGHT)));
    const columnWidths = this.computeColumnWidths(maxTableWidth, borderLayout, intrinsicMeasures);
    const rowHeights = this.computeRowHeights(columnWidths, intrinsicMeasures);
    const columnOffsets = this.computeOffsets(columnWidths, borderLayout.left, borderLayout.right, borderLayout.innerVertical, this.getInterColumnGap(borderLayout));
    const rowOffsets = this.computeOffsets(rowHeights, borderLayout.top, borderLayout.bottom, borderLayout.innerHorizontal);
    return {
      columnWidths,
      rowHeights,
      columnOffsets,
      rowOffsets,
      columnOffsetsI32: new Int32Array(columnOffsets),
      rowOffsetsI32: new Int32Array(rowOffsets),
      tableWidth: (columnOffsets[columnOffsets.length - 1] ?? 0) + 1,
      tableHeight: (rowOffsets[rowOffsets.length - 1] ?? 0) + 1
    };
  }
  isFullWidthMode() {
    return this._columnWidthMode === "full";
  }
  computeColumnWidths(maxTableWidth, borderLayout, intrinsicMeasures) {
    const horizontalPadding = this.getHorizontalCellPadding();
    const intrinsicWidths = new Array(this._columnCount).fill(1 + horizontalPadding);
    for (let rowIdx = 0;rowIdx < this._rowCount; rowIdx++) {
      for (let colIdx = 0;colIdx < this._columnCount; colIdx++) {
        const measure = intrinsicMeasures[rowIdx]?.[colIdx];
        const measuredWidth = Math.max(1, measure?.widthColsMax ?? 0) + horizontalPadding;
        intrinsicWidths[colIdx] = Math.max(intrinsicWidths[colIdx], measuredWidth);
      }
    }
    if (maxTableWidth === undefined || !Number.isFinite(maxTableWidth) || maxTableWidth <= 0) {
      return intrinsicWidths;
    }
    const maxContentWidth = Math.max(1, Math.floor(maxTableWidth) - this.getVerticalBorderCount(borderLayout) - this.getTotalInterColumnGap(borderLayout));
    const currentWidth = intrinsicWidths.reduce((sum, width) => sum + width, 0);
    if (currentWidth === maxContentWidth) {
      return intrinsicWidths;
    }
    if (currentWidth < maxContentWidth) {
      if (this.isFullWidthMode()) {
        return this.expandColumnWidths(intrinsicWidths, maxContentWidth);
      }
      return intrinsicWidths;
    }
    if (this._wrapMode === "none") {
      return intrinsicWidths;
    }
    return this.fitColumnWidths(intrinsicWidths, maxContentWidth);
  }
  expandColumnWidths(widths, targetContentWidth) {
    const baseWidths = widths.map((width) => Math.max(1, Math.floor(width)));
    const totalBaseWidth = baseWidths.reduce((sum, width) => sum + width, 0);
    if (totalBaseWidth >= targetContentWidth) {
      return baseWidths;
    }
    const expanded = [...baseWidths];
    const columns = expanded.length;
    const extraWidth = targetContentWidth - totalBaseWidth;
    const sharedWidth = Math.floor(extraWidth / columns);
    const remainder = extraWidth % columns;
    for (let idx = 0;idx < columns; idx++) {
      expanded[idx] += sharedWidth;
      if (idx < remainder) {
        expanded[idx] += 1;
      }
    }
    return expanded;
  }
  fitColumnWidths(widths, targetContentWidth) {
    if (this._columnFitter === "balanced") {
      return this.fitColumnWidthsBalanced(widths, targetContentWidth);
    }
    return this.fitColumnWidthsProportional(widths, targetContentWidth);
  }
  fitColumnWidthsProportional(widths, targetContentWidth) {
    const minWidth = 1 + this.getHorizontalCellPadding();
    return allocateProportionalColumnWidths(widths, targetContentWidth, minWidth);
  }
  fitColumnWidthsBalanced(widths, targetContentWidth) {
    const minWidth = 1 + this.getHorizontalCellPadding();
    const hardMinWidths = new Array(widths.length).fill(minWidth);
    const baseWidths = widths.map((width) => Math.max(1, Math.floor(width)));
    const totalBaseWidth = baseWidths.reduce((sum, width) => sum + width, 0);
    const columns = baseWidths.length;
    if (columns === 0 || totalBaseWidth <= targetContentWidth) {
      return baseWidths;
    }
    const evenShare = Math.max(minWidth, Math.floor(targetContentWidth / columns));
    const preferredMinWidths = baseWidths.map((width) => Math.min(width, evenShare));
    const preferredMinTotal = preferredMinWidths.reduce((sum, width) => sum + width, 0);
    const floorWidths = preferredMinTotal <= targetContentWidth ? preferredMinWidths : hardMinWidths;
    const floorTotal = floorWidths.reduce((sum, width) => sum + width, 0);
    const clampedTarget = Math.max(floorTotal, targetContentWidth);
    if (totalBaseWidth <= clampedTarget) {
      return baseWidths;
    }
    const shrinkable = baseWidths.map((width, idx) => width - floorWidths[idx]);
    const totalShrinkable = shrinkable.reduce((sum, value) => sum + value, 0);
    if (totalShrinkable <= 0) {
      return [...floorWidths];
    }
    const targetShrink = totalBaseWidth - clampedTarget;
    const shrink = this.allocateShrinkByWeight(shrinkable, targetShrink, "sqrt");
    return baseWidths.map((width, idx) => Math.max(floorWidths[idx], width - shrink[idx]));
  }
  allocateShrinkByWeight(shrinkable, targetShrink, mode) {
    const shrink = new Array(shrinkable.length).fill(0);
    if (targetShrink <= 0) {
      return shrink;
    }
    const weights = shrinkable.map((value) => {
      if (value <= 0) {
        return 0;
      }
      return mode === "sqrt" ? Math.sqrt(value) : value;
    });
    const totalWeight = weights.reduce((sum, value) => sum + value, 0);
    if (totalWeight <= 0) {
      return shrink;
    }
    const fractions = new Array(shrinkable.length).fill(0);
    let usedShrink = 0;
    for (let idx = 0;idx < shrinkable.length; idx++) {
      if (shrinkable[idx] <= 0 || weights[idx] <= 0)
        continue;
      const exact = weights[idx] / totalWeight * targetShrink;
      const whole = Math.min(shrinkable[idx], Math.floor(exact));
      shrink[idx] = whole;
      fractions[idx] = exact - whole;
      usedShrink += whole;
    }
    let remainingShrink = targetShrink - usedShrink;
    while (remainingShrink > 0) {
      let bestIdx = -1;
      let bestFraction = -1;
      for (let idx = 0;idx < shrinkable.length; idx++) {
        if (shrinkable[idx] - shrink[idx] <= 0)
          continue;
        if (bestIdx === -1 || fractions[idx] > bestFraction || fractions[idx] === bestFraction && shrinkable[idx] > shrinkable[bestIdx]) {
          bestIdx = idx;
          bestFraction = fractions[idx];
        }
      }
      if (bestIdx === -1) {
        break;
      }
      shrink[bestIdx] += 1;
      fractions[bestIdx] = 0;
      remainingShrink -= 1;
    }
    return shrink;
  }
  computeRowHeights(columnWidths, intrinsicMeasures) {
    const horizontalPadding = this.getHorizontalCellPadding();
    const verticalPadding = this.getVerticalCellPadding();
    const rowHeights = new Array(this._rowCount).fill(1 + verticalPadding);
    for (let rowIdx = 0;rowIdx < this._rowCount; rowIdx++) {
      for (let colIdx = 0;colIdx < this._columnCount; colIdx++) {
        const cell = this._cells[rowIdx]?.[colIdx];
        if (!cell)
          continue;
        const width = Math.max(1, (columnWidths[colIdx] ?? 1) - horizontalPadding);
        const intrinsic = intrinsicMeasures[rowIdx]?.[colIdx];
        const measure = intrinsic && (this._wrapMode === "none" || intrinsic.widthColsMax <= width) ? intrinsic : cell.textBufferView.measureForDimensions(width, MEASURE_HEIGHT);
        const lineCount = Math.max(1, measure?.lineCount ?? 1);
        rowHeights[rowIdx] = Math.max(rowHeights[rowIdx], lineCount + verticalPadding);
      }
    }
    return rowHeights;
  }
  computeOffsets(parts, startBoundary, endBoundary, includeInnerBoundaries, innerGap = 0) {
    const offsets = [startBoundary ? 0 : -1];
    let cursor = offsets[0] ?? 0;
    for (let idx = 0;idx < parts.length; idx++) {
      const size = parts[idx] ?? 1;
      const separatorAfter = idx < parts.length - 1 ? includeInnerBoundaries ? 1 : innerGap : endBoundary ? 1 : 0;
      cursor += size + separatorAfter;
      offsets.push(cursor);
    }
    return offsets;
  }
  getInterColumnGap(borderLayout) {
    if (borderLayout.innerVertical) {
      return 0;
    }
    return this._columnGap;
  }
  getTotalInterColumnGap(borderLayout) {
    return Math.max(0, this._columnCount - 1) * this.getInterColumnGap(borderLayout);
  }
  applyLayoutToViews(layout) {
    const horizontalPadding = this.getHorizontalCellPadding();
    const verticalPadding = this.getVerticalCellPadding();
    for (let rowIdx = 0;rowIdx < this._rowCount; rowIdx++) {
      for (let colIdx = 0;colIdx < this._columnCount; colIdx++) {
        const cell = this._cells[rowIdx]?.[colIdx];
        if (!cell)
          continue;
        const colWidth = layout.columnWidths[colIdx] ?? 1;
        const rowHeight = layout.rowHeights[rowIdx] ?? 1;
        const contentWidth = Math.max(1, colWidth - horizontalPadding);
        const contentHeight = Math.max(1, rowHeight - verticalPadding);
        cell.textBufferView.setViewport(0, 0, contentWidth, contentHeight);
      }
    }
  }
  resolveBorderLayout() {
    return {
      left: this._outerBorder,
      right: this._outerBorder,
      top: this._outerBorder,
      bottom: this._outerBorder,
      innerVertical: this._border && this._columnCount > 1,
      innerHorizontal: this._border && this._rowCount > 1
    };
  }
  getVerticalBorderCount(borderLayout) {
    return (borderLayout.left ? 1 : 0) + (borderLayout.right ? 1 : 0) + (borderLayout.innerVertical ? Math.max(0, this._columnCount - 1) : 0);
  }
  getHorizontalBorderCount(borderLayout) {
    return (borderLayout.top ? 1 : 0) + (borderLayout.bottom ? 1 : 0) + (borderLayout.innerHorizontal ? Math.max(0, this._rowCount - 1) : 0);
  }
  drawBorders(buffer, x, y) {
    if (!this._showBorders) {
      return;
    }
    const borderLayout = this.resolveBorderLayout();
    if (this.getVerticalBorderCount(borderLayout) === 0 && this.getHorizontalBorderCount(borderLayout) === 0) {
      return;
    }
    const { columnOffsets, rowOffsets, columnOffsetsI32, rowOffsetsI32 } = this._layout;
    columnOffsets.forEach((offset, index) => columnOffsetsI32[index] = offset + x);
    rowOffsets.forEach((offset, index) => rowOffsetsI32[index] = offset + y);
    buffer.drawGrid({
      borderChars: BorderCharArrays2[this._borderStyle],
      borderFg: this._borderColor,
      borderBg: this._borderBackgroundColor,
      columnOffsets: columnOffsetsI32,
      rowOffsets: rowOffsetsI32,
      drawInner: this._border,
      drawOuter: this._outerBorder
    });
  }
  drawCells(buffer, x, y) {
    const colOffsets = this._layout.columnOffsets;
    const rowOffsets = this._layout.rowOffsets;
    const cellX = x + 1 + this._cellPaddingX;
    const cellPaddingY = this._cellPaddingY;
    for (let rowIdx = 0;rowIdx < this._rowCount; rowIdx++) {
      const cellY = y + (rowOffsets[rowIdx] ?? 0) + 1 + cellPaddingY;
      for (let colIdx = 0;colIdx < this._columnCount; colIdx++) {
        const cell = this._cells[rowIdx]?.[colIdx];
        if (!cell)
          continue;
        buffer.drawTextBuffer(cell.textBufferView, cellX + (colOffsets[colIdx] ?? 0), cellY);
      }
    }
  }
  ensureLayoutReady() {
    if (!this._layoutDirty)
      return;
    this.rebuildLayoutForCurrentWidth();
  }
  getCellAtLocalPosition(localX, localY) {
    if (this._rowCount === 0 || this._columnCount === 0)
      return null;
    if (localX < 0 || localY < 0 || localX >= this._layout.tableWidth || localY >= this._layout.tableHeight) {
      return null;
    }
    let rowIdx = -1;
    for (let idx = 0;idx < this._rowCount; idx++) {
      const top = (this._layout.rowOffsets[idx] ?? 0) + 1;
      const bottom = top + (this._layout.rowHeights[idx] ?? 1) - 1;
      if (localY >= top && localY <= bottom) {
        rowIdx = idx;
        break;
      }
    }
    if (rowIdx < 0)
      return null;
    let colIdx = -1;
    for (let idx = 0;idx < this._columnCount; idx++) {
      const left = (this._layout.columnOffsets[idx] ?? 0) + 1;
      const right = left + (this._layout.columnWidths[idx] ?? 1) - 1;
      if (localX >= left && localX <= right) {
        colIdx = idx;
        break;
      }
    }
    if (colIdx < 0)
      return null;
    return { rowIdx, colIdx };
  }
  applySelectionToCells(localSelection, isStart) {
    if (localSelection.anchorX === localSelection.focusX && localSelection.anchorY === localSelection.focusY) {
      this.resetCellSelections();
      this._lastSelectionMode = null;
      return;
    }
    const minSelY = Math.min(localSelection.anchorY, localSelection.focusY);
    const maxSelY = Math.max(localSelection.anchorY, localSelection.focusY);
    const firstRow = this.findRowForLocalY(minSelY);
    const lastRow = this.findRowForLocalY(maxSelY);
    const selection = this.resolveSelectionResolution(localSelection);
    const modeChanged = this._lastSelectionMode !== selection.mode;
    this._lastSelectionMode = selection.mode;
    const lockToAnchorColumn = selection.mode === "column-locked" && selection.anchorColumn !== null;
    for (let rowIdx = 0;rowIdx < this._rowCount; rowIdx++) {
      if (rowIdx < firstRow || rowIdx > lastRow) {
        this.resetRowSelection(rowIdx);
        continue;
      }
      const cellTop = (this._layout.rowOffsets[rowIdx] ?? 0) + 1 + this._cellPaddingY;
      for (let colIdx = 0;colIdx < this._columnCount; colIdx++) {
        const cell = this._cells[rowIdx]?.[colIdx];
        if (!cell)
          continue;
        if (lockToAnchorColumn && colIdx !== selection.anchorColumn) {
          cell.textBufferView.resetLocalSelection();
          continue;
        }
        const cellLeft = (this._layout.columnOffsets[colIdx] ?? 0) + 1 + this._cellPaddingX;
        let coords = {
          anchorX: localSelection.anchorX - cellLeft,
          anchorY: localSelection.anchorY - cellTop,
          focusX: localSelection.focusX - cellLeft,
          focusY: localSelection.focusY - cellTop
        };
        const isAnchorCell = selection.anchorCell !== null && selection.anchorCell.rowIdx === rowIdx && selection.anchorCell.colIdx === colIdx;
        if (selection.mode === "single-cell" && !isAnchorCell) {
          cell.textBufferView.resetLocalSelection();
          continue;
        }
        const forceSet = isAnchorCell && selection.mode !== "single-cell";
        if (forceSet) {
          coords = this.getFullCellSelectionCoords(rowIdx, colIdx);
        }
        const shouldUseSet = isStart || modeChanged || forceSet;
        if (shouldUseSet) {
          cell.textBufferView.setLocalSelection(coords.anchorX, coords.anchorY, coords.focusX, coords.focusY, this._selectionBg, this._selectionFg);
        } else {
          cell.textBufferView.updateLocalSelection(coords.anchorX, coords.anchorY, coords.focusX, coords.focusY, this._selectionBg, this._selectionFg);
        }
      }
    }
  }
  resolveSelectionResolution(localSelection) {
    const anchorCell = this.getCellAtLocalPosition(localSelection.anchorX, localSelection.anchorY);
    const focusCell = this.getCellAtLocalPosition(localSelection.focusX, localSelection.focusY);
    const anchorColumn = anchorCell?.colIdx ?? this.getColumnAtLocalX(localSelection.anchorX);
    if (anchorCell !== null && focusCell !== null && anchorCell.rowIdx === focusCell.rowIdx && anchorCell.colIdx === focusCell.colIdx) {
      return {
        mode: "single-cell",
        anchorCell,
        anchorColumn
      };
    }
    const focusColumn = this.getColumnAtLocalX(localSelection.focusX);
    if (anchorColumn !== null && focusColumn === anchorColumn) {
      return {
        mode: "column-locked",
        anchorCell,
        anchorColumn
      };
    }
    return {
      mode: "grid",
      anchorCell,
      anchorColumn
    };
  }
  getColumnAtLocalX(localX) {
    if (this._columnCount === 0)
      return null;
    if (localX < 0 || localX >= this._layout.tableWidth)
      return null;
    for (let colIdx = 0;colIdx < this._columnCount; colIdx++) {
      const colStart = (this._layout.columnOffsets[colIdx] ?? 0) + 1;
      const colEnd = colStart + (this._layout.columnWidths[colIdx] ?? 1) - 1;
      if (localX >= colStart && localX <= colEnd) {
        return colIdx;
      }
    }
    return null;
  }
  getFullCellSelectionCoords(rowIdx, colIdx) {
    const colWidth = this._layout.columnWidths[colIdx] ?? 1;
    const rowHeight = this._layout.rowHeights[rowIdx] ?? 1;
    const contentWidth = Math.max(1, colWidth - this.getHorizontalCellPadding());
    const contentHeight = Math.max(1, rowHeight - this.getVerticalCellPadding());
    return {
      anchorX: -1,
      anchorY: 0,
      focusX: contentWidth,
      focusY: contentHeight
    };
  }
  findRowForLocalY(localY) {
    if (this._rowCount === 0)
      return 0;
    if (localY < 0)
      return 0;
    for (let rowIdx = 0;rowIdx < this._rowCount; rowIdx++) {
      const rowStart = (this._layout.rowOffsets[rowIdx] ?? 0) + 1;
      const rowEnd = rowStart + (this._layout.rowHeights[rowIdx] ?? 1) - 1;
      if (localY <= rowEnd)
        return rowIdx;
    }
    return this._rowCount - 1;
  }
  resetRowSelection(rowIdx) {
    const row = this._cells[rowIdx];
    if (!row)
      return;
    for (const cell of row) {
      cell.textBufferView.resetLocalSelection();
    }
  }
  resetCellSelections() {
    for (let rowIdx = 0;rowIdx < this._rowCount; rowIdx++) {
      this.resetRowSelection(rowIdx);
    }
  }
  createEmptyLayout() {
    return {
      columnWidths: [],
      rowHeights: [],
      columnOffsets: [0],
      rowOffsets: [0],
      columnOffsetsI32: new Int32Array([0]),
      rowOffsetsI32: new Int32Array([0]),
      tableWidth: 0,
      tableHeight: 0
    };
  }
  resolveLayoutWidthConstraint(width) {
    if (width === undefined || !Number.isFinite(width) || width <= 0) {
      return;
    }
    if (this._wrapMode !== "none" || this.isFullWidthMode()) {
      return Math.max(1, Math.floor(width));
    }
    return;
  }
  getHorizontalCellPadding() {
    return this._cellPaddingX * 2;
  }
  getVerticalCellPadding() {
    return this._cellPaddingY * 2;
  }
  resolveColumnFitter(value) {
    if (value === undefined) {
      return this._defaultOptions.columnFitter;
    }
    return value === "balanced" ? "balanced" : "proportional";
  }
  resolveCellPadding(value) {
    if (value === undefined || !Number.isFinite(value)) {
      return this._defaultOptions.cellPadding;
    }
    return Math.max(0, Math.floor(value));
  }
  resolveColumnGap(value) {
    if (value === undefined || !Number.isFinite(value)) {
      return this._defaultOptions.columnGap;
    }
    return Math.max(0, Math.floor(value));
  }
  invalidateLayout(markYogaDirty = true) {
    this._layoutDirty = true;
    this._cachedMeasureLayout = null;
    this._cachedMeasureWidth = undefined;
    if (markYogaDirty) {
      this.invalidateIntrinsicSize();
    }
    this.requestRender();
  }
}

// src/renderables/markdown-document.ts
var unchanged = { removedFrom: undefined, changed: [] };

class MarkdownDocument {
  lib;
  context;
  blocks = [];
  encoder = new TextEncoder;
  doc;
  _content = "";
  _committed = 0;
  _finished = false;
  constructor(lib, context, options) {
    this.lib = lib;
    this.context = context;
    this.doc = lib.markdownCreate(context, options);
  }
  get content() {
    return this._content;
  }
  get committed() {
    return this._committed;
  }
  get finished() {
    return this._finished;
  }
  write(content, streaming) {
    let result;
    if (content !== this._content || this._finished === streaming) {
      const extends_ = !this._finished && content.startsWith(this._content) && !/[\uD800-\uDBFF]$/.test(this._content);
      const bytes = this.encoder.encode(extends_ ? content.slice(this._content.length) : content);
      if (!extends_ || bytes.length > 0) {
        result = this.lib.markdownWrite(this.context, this.doc, bytes, !extends_);
        this._content = content;
        this._finished = false;
      }
    }
    if (!streaming && !this._finished)
      result = this.finish();
    return result ? this.apply(result) : unchanged;
  }
  setOptions(options) {
    return this.apply(this.lib.markdownSetOptions(this.context, this.doc, options));
  }
  readLeaf(index) {
    return this.lib.markdownReadLeaf(this.context, this.doc, index);
  }
  readSource(index) {
    return this.lib.markdownReadSource(this.context, this.doc, index);
  }
  source(start, end) {
    return this.lib.markdownGetSource(this.context, this.doc, start, end);
  }
  bind(index, node) {
    this.lib.markdownBind(this.context, this.doc, index, node);
  }
  destroy() {
    this.lib.markdownDestroy(this.context, this.doc);
  }
  finish() {
    const result = this.lib.markdownFinish(this.context, this.doc);
    this._finished = true;
    return result;
  }
  apply(result) {
    this._committed = result.committed;
    if (result.removedFrom !== undefined)
      this.blocks.length = Math.min(this.blocks.length, result.removedFrom);
    if (result.changed === 0)
      return { removedFrom: result.removedFrom, changed: [] };
    const changed = this.lib.markdownReadChanges(this.context, this.doc, result.changed);
    for (const block of changed)
      this.blocks[block.index] = block;
    return { removedFrom: result.removedFrom, changed };
  }
}

// src/renderables/Markdown.ts
function createMarkdownCodeBlockRenderer(renderers) {
  const rendererMap = new Map;
  const maybeMap = renderers;
  if (typeof maybeMap.forEach === "function")
    maybeMap.forEach((renderer, language) => rendererMap.set(language, renderer));
  else
    for (const [language, renderer] of Object.entries(renderers))
      rendererMap.set(language, renderer);
  const renderBlock = (block, context) => {
    if (block.kind !== "code")
      return;
    const language = infoStringToFiletype2(block.lang ?? "");
    if (!language)
      return;
    return rendererMap.get(language)?.(block, context);
  };
  renderBlock.codeBlockOnly = true;
  return renderBlock;
}
function colorsEqual(left, right) {
  if (!left || !right)
    return left === right;
  return left.equals(right);
}
function cloneTableOptions(options) {
  if (!options)
    return;
  return {
    ...options,
    borderColor: options.borderColor ? RGBA2.clone(parseColor2(options.borderColor)) : undefined
  };
}
var kindNames = [
  "paragraph",
  "heading",
  "code",
  "html",
  "rule",
  "table",
  "row",
  "cell",
  "quote",
  "list",
  "item"
];
var isProse = (kind) => kind === nativeConstants.OT_MD_PARAGRAPH || kind === nativeConstants.OT_MD_HEADING;
var sameRecord = (a, b) => a.kind === b.kind && a.flags === b.flags && a.parent === b.parent && a.sourceStart === b.sourceStart && a.sourceEnd === b.sourceEnd && a.infoStart === b.infoStart && a.infoEnd === b.infoEnd && a.number === b.number;
var textEncoder = new TextEncoder;
var textDecoder = new TextDecoder("utf-8", { ignoreBOM: true });
var sameChunks = (a, b) => a.length === b.length && a.every((chunk, index) => chunk.text === b[index].text && colorsEqual(chunk.fg, b[index].fg) && colorsEqual(chunk.bg, b[index].bg) && (chunk.attributes ?? 0) === (b[index].attributes ?? 0) && chunk.link?.url === b[index].link?.url);
function holds(outer, inner) {
  for (let at = inner;at; at = at.parent)
    if (at === outer)
      return true;
  return false;
}

class MarkdownRenderable extends Renderable2 {
  static nativeIntegration = {
    ...Renderable2.nativeIntegration
  };
  static _capabilitySubscriptions = new WeakMap;
  _doc;
  _shown = [];
  _syntaxStyle;
  _fg;
  _bg;
  _conceal;
  _concealCode;
  _treeSitterClient;
  _tableOptions;
  _renderBlock;
  _streaming;
  _inlineHook;
  _inlineHookFilter;
  _extensions;
  _styleCopy;
  _flags = 0;
  _before;
  _beforeBytes;
  _shownInCall;
  _styleDirty = false;
  applyStyleChanges = () => this.rerenderDirtyStyles();
  _contentDefaultOptions = {
    content: "",
    conceal: true,
    concealCode: false,
    streaming: false
  };
  constructor(ctx, options) {
    super(ctx, {
      ...options,
      flexDirection: "column",
      flexShrink: options.flexShrink ?? 0
    });
    try {
      this._syntaxStyle = options.syntaxStyle;
      this._fg = options.fg ? RGBA2.clone(parseColor2(options.fg)) : undefined;
      this._bg = options.bg ? RGBA2.clone(parseColor2(options.bg)) : undefined;
      this._conceal = options.conceal ?? this._contentDefaultOptions.conceal;
      this._concealCode = options.concealCode ?? this._contentDefaultOptions.concealCode;
      this._treeSitterClient = options.treeSitterClient;
      this._tableOptions = cloneTableOptions(options.tableOptions);
      this._renderBlock = options.renderBlock;
      this._streaming = options.streaming ?? this._contentDefaultOptions.streaming;
      this._inlineHook = options.inlineHook;
      this._inlineHookFilter = options.inlineHookFilter;
      this._extensions = options.extensions ?? [];
      this.setGap(Gutter2.Row, 1);
      const { renderLib, context } = ctx.nativeScene.driver;
      this._doc = new MarkdownDocument(renderLib, context, this.engineOptions());
      this._flags = this.engineFlags();
      this.apply(this._doc.write(options.content ?? this._contentDefaultOptions.content, this._streaming));
      this.onLifecyclePass = this.applyStyleChanges;
      let subscription = MarkdownRenderable._capabilitySubscriptions.get(ctx);
      if (!subscription) {
        const renderables = new Set;
        subscription = {
          renderables,
          listener: () => {
            for (const renderable of renderables)
              renderable.changeOptions();
          }
        };
        ctx.on("capabilities", subscription.listener);
        MarkdownRenderable._capabilitySubscriptions.set(ctx, subscription);
      }
      subscription.renderables.add(this);
    } catch (error) {
      try {
        this.destroyRecursively();
      } catch {}
      throw error;
    }
  }
  get content() {
    return this._doc.content;
  }
  set content(value) {
    if (this.isDestroyed || value === this._doc.content)
      return;
    this.assertMutable();
    this.change(() => this._doc.write(value, this._streaming));
  }
  get syntaxStyle() {
    return this._syntaxStyle;
  }
  set syntaxStyle(value) {
    if (this._syntaxStyle !== value) {
      this._syntaxStyle = value;
      for (const shown of this._shown)
        shown.written = undefined;
      this.change(() => this._doc.setOptions(this.engineOptions()));
      this.markStyleDirty();
    }
  }
  get fg() {
    return this._fg ? RGBA2.clone(this._fg) : undefined;
  }
  set fg(value) {
    const next = value ? RGBA2.clone(parseColor2(value)) : undefined;
    if (!colorsEqual(this._fg, next)) {
      this._fg = next;
      this.markStyleDirty();
    }
  }
  get bg() {
    return this._bg ? RGBA2.clone(this._bg) : undefined;
  }
  set bg(value) {
    const next = value ? RGBA2.clone(parseColor2(value)) : undefined;
    if (!colorsEqual(this._bg, next)) {
      this._bg = next;
      this.markStyleDirty();
    }
  }
  get conceal() {
    return this._conceal;
  }
  set conceal(value) {
    if (this._conceal !== value) {
      this._conceal = value;
      this.changeOptions();
      this.rerunInlineHook(() => true);
      this.markStyleDirty();
    }
  }
  get concealCode() {
    return this._concealCode;
  }
  set concealCode(value) {
    if (this._concealCode !== value) {
      this._concealCode = value;
      this.markStyleDirty();
    }
  }
  get streaming() {
    return this._streaming;
  }
  set streaming(value) {
    if (this.isDestroyed || this._streaming === value)
      return;
    this.assertMutable();
    this._streaming = value;
    const shown = new Set;
    this._shownInCall = shown;
    try {
      this.change(() => this._doc.write(this._doc.content, value));
    } finally {
      this._shownInCall = undefined;
    }
    this.restyle(shown);
  }
  get tableOptions() {
    return cloneTableOptions(this._tableOptions);
  }
  set tableOptions(value) {
    this._tableOptions = cloneTableOptions(value);
    this.restyle();
    this.requestRender();
  }
  get renderBlock() {
    return this._renderBlock;
  }
  set renderBlock(value) {
    if (this.isDestroyed || this._renderBlock === value)
      return;
    this.assertMutable();
    this._renderBlock = value;
    this.rebuild();
  }
  get inlineHook() {
    return this._inlineHook;
  }
  set inlineHook(value) {
    if (this._inlineHook === value)
      return;
    const swap = this._inlineHook && value;
    this._inlineHook = value;
    if (swap)
      this.rerunInlineHook(() => true);
    else
      this.changeOptions(true);
  }
  get inlineHookFilter() {
    return this._inlineHookFilter;
  }
  set inlineHookFilter(value) {
    if (this._inlineHookFilter === value)
      return;
    this._inlineHookFilter = value;
    this.changeOptions(true);
  }
  get extensions() {
    return this._extensions;
  }
  set extensions(value) {
    if (this._extensions === value)
      return;
    this._extensions = value ?? [];
    this.changeOptions();
  }
  get blocks() {
    return this._shown.map((shown) => ({ kind: kindNames[shown.record.kind], renderable: shown.renderable }));
  }
  get committedBlockCount() {
    return this._doc.committed;
  }
  rerunInlineHook(select) {
    if (!this._inlineHook)
      return;
    const tables = new Set;
    this._doc.blocks.forEach((block, index) => {
      if ((block.flags & nativeConstants.OT_MD_BLOCK_HOOKED) === 0)
        return;
      if (block.kind === nativeConstants.OT_MD_TABLE_CELL) {
        if (select(this._doc.readSource(index)))
          tables.add(this.tableOf(index));
      } else if (isProse(block.kind) && !this.isHidden(index) && select(this._doc.readSource(index))) {
        this.writeProse(index, true);
      }
    });
    for (const table of tables) {
      for (let at = table + 1, end = this.subtreeEnd(table);at < end; at++)
        this._shown[at].cell = undefined;
      this.fillTable(table);
    }
    this.requestRender();
  }
  targetAt(x, y) {
    const scene = this.ctx.nativeScene;
    const hit = Renderable2.renderablesByNumber.get(scene.hitTest(x, y));
    if (!hit)
      return;
    const shown = this._shown.find((shown) => shown.targets && shown.default === hit);
    if (!shown?.targets)
      return;
    const byte = scene.textByteAt(hit, x, y);
    if (byte === undefined)
      return;
    return shown.targets.find(([start, end]) => start <= byte && byte < end)?.[2];
  }
  clearCache() {
    this.rebuild();
  }
  refreshStyles() {
    this._styleDirty = false;
    this._ctx.nativeScene.lifecyclePasses.refresh(this);
    if (this._styleCopy) {
      this._styleCopy.copy.destroy();
      this._styleCopy = undefined;
      this.change(() => this._doc.setOptions(this.engineOptions()));
    }
    this.restyle();
    this._shown.forEach((_, index) => {
      const block = this._doc.blocks[index];
      const host = block.kind === nativeConstants.OT_MD_HTML || isProse(block.kind) && this.hostWrites(block);
      if (host && !this.isHidden(index))
        this.writeProse(index, true);
    });
    this.requestRender();
  }
  engineFlags() {
    let flags = 0;
    if (this._conceal)
      flags |= nativeConstants.OT_MD_CONCEAL;
    if (this.ctx.capabilities?.hyperlinks === true)
      flags |= nativeConstants.OT_MD_HYPERLINKS;
    if (this._extensions.includes("math"))
      flags |= nativeConstants.OT_MD_MATH;
    if (this._inlineHook && this._inlineHookFilter?.length !== 0)
      flags |= nativeConstants.OT_MD_HOOK;
    return flags;
  }
  engineOptions() {
    return {
      flags: this.engineFlags(),
      syntaxStyle: this.nativeStyle(),
      hookFilter: this._inlineHook ? this._inlineHookFilter : undefined
    };
  }
  nativeStyle() {
    const style = this._syntaxStyle;
    const scene = this.ctx.nativeScene;
    if (!style)
      return null;
    if (style._ownedBy(scene))
      return style._getSceneHandle(scene);
    if (this._styleCopy?.source !== style) {
      this._styleCopy?.copy.destroy();
      this._styleCopy = { source: style, copy: SyntaxStyle.fromStyles(style.getAllStyles(), scene) };
    }
    return this._styleCopy.copy._getSceneHandle(scene);
  }
  changeOptions(force = false) {
    if (this.isDestroyed)
      return;
    const flags = this.engineFlags();
    if (!force && flags === this._flags)
      return;
    this._flags = flags;
    this.change(() => this._doc.setOptions(this.engineOptions()));
    this.syncLeaves();
  }
  change(run) {
    if (this.isDestroyed)
      return;
    const before = this._doc.content;
    const changes = run();
    this._before = before === this._doc.content ? undefined : before;
    try {
      this.apply(changes);
    } finally {
      this._before = this._beforeBytes = undefined;
    }
    this.requestRender();
  }
  sameSource(old, block) {
    if (this._before === undefined)
      return true;
    const before = this._beforeBytes ??= textEncoder.encode(this._before);
    const source = before.subarray(old.sourceStart, old.sourceEnd);
    return source.length === block.sourceEnd - block.sourceStart && textDecoder.decode(source) === this.sourceText(block.sourceStart, block.sourceEnd);
  }
  bind(index, text) {
    this._doc.bind(index, this.ctx.nativeScene.textNode(text));
    const shown = this._shown[index];
    if (shown) {
      shown.bound = true;
      shown.written = shown.targets = undefined;
    }
  }
  syncLeaves() {
    this._shown.forEach((shown, index) => {
      const block = this._doc.blocks[index];
      if (!isProse(block.kind) || this.isHidden(index) || !(shown.default instanceof TextRenderable2))
        return;
      if (this.hostWrites(block))
        this.writeProse(index, false);
      else if (!shown.bound || shown.written !== undefined)
        this.bind(index, shown.default);
    });
  }
  hostWrites(block) {
    const live = nativeConstants.OT_MD_CONCEAL | nativeConstants.OT_MD_HYPERLINKS;
    return (this._flags & live) !== live || (block.flags & nativeConstants.OT_MD_BLOCK_HOOKED) !== 0;
  }
  apply(changes) {
    const from = changes.removedFrom ?? this._shown.length;
    const removed = new Map(this._shown.splice(from).map((shown, at) => [from + at, shown]));
    if (removed.size > 0)
      for (const shown of this._shown)
        shown.count = undefined;
    const refresh = { tables: new Set, lists: new Set, items: new Set };
    for (const block of changes.changed)
      this.update(block, refresh, removed);
    for (const shown of [...removed.values()].reverse()) {
      if (shown.renderable && !shown.renderable.isDestroyed)
        shown.renderable.destroyRecursively();
    }
    this.refresh(refresh);
  }
  refresh(refresh) {
    for (const table of refresh.tables)
      this.fillTable(table);
    for (const list of refresh.lists)
      this.updateList(list);
    const items = new Map;
    for (const item of refresh.items) {
      const list = this._doc.blocks[item].parent;
      if (!refresh.lists.has(list))
        items.set(list, [...items.get(list) ?? [], item]);
    }
    for (const [list, listed] of items)
      this.updateList(list, listed);
  }
  update(block, refresh, removed = new Map) {
    const index = block.index;
    const shown = this._shown[index];
    let layout = true;
    if (!shown) {
      const old = removed.get(index);
      const leaf = block.kind !== nativeConstants.OT_MD_QUOTE && block.kind !== nativeConstants.OT_MD_LIST && block.kind !== nativeConstants.OT_MD_ITEM;
      const equal = old && sameRecord(old.record, block) && this.sameSource(old.record, block);
      if (leaf && old?.renderable && equal && !this.isHidden(index)) {
        this._shown.push({ ...old, record: block, written: undefined, targets: undefined });
        this.parentOf(index).add(old.renderable);
        old.renderable = undefined;
        this._shown[index].bound = false;
        if (old.default instanceof TextRenderable2 && isProse(block.kind) && !this.hostWrites(block)) {
          this.bind(index, old.default);
        }
        this.afterChange(index, refresh, true);
        return;
      }
      const same = old?.record.kind === block.kind || isProse(block.kind) && isProse(old?.record.kind ?? -1);
      const reuse = leaf && same && old.default === old.renderable ? old.default : undefined;
      this._shown.push({ record: block, default: reuse });
      if (reuse)
        old.renderable = undefined;
      if (!this.isHidden(index))
        this.show(index, undefined);
      if (reuse instanceof TextRenderable2 && isProse(block.kind) && !this.hostWrites(block))
        this.bind(index, reuse);
    } else {
      layout = shown.record.flags !== block.flags || shown.record.number !== block.number;
      const rebuild = shown.record.kind !== block.kind && !(isProse(shown.record.kind) && isProse(block.kind));
      const changed = rebuild || !sameRecord(shown.record, block);
      shown.record = block;
      if (this.isHidden(index)) {} else if (rebuild || changed && this.rendersCustom(block))
        this.show(index, shown.renderable);
      else if (shown.default instanceof CodeRenderable2)
        this.setCode(index, shown.default);
    }
    this.afterChange(index, refresh, layout);
  }
  show(index, old) {
    this._shownInCall?.add(index);
    const shown = this._shown[index];
    const before = shown.default;
    const { renderable, fallback } = this.resolve(index);
    shown.default = fallback;
    if (renderable !== old) {
      const parent = this.parentOf(index);
      const position = old ? parent.getChildren().indexOf(old) : -1;
      if (fallback && old && old !== fallback && holds(old, fallback))
        fallback.parent?.remove(fallback);
      if (old !== fallback)
        old?.destroyRecursively();
      shown.renderable = renderable;
      if (renderable)
        parent.add(renderable, position === -1 ? undefined : position);
    }
    if (before === fallback)
      return;
    if (before && !before.isDestroyed)
      before.destroyRecursively();
    shown.written = shown.targets = shown.gap = shown.width = shown.count = undefined;
    if (!fallback)
      shown.container = shown.marker = undefined;
    if (before || fallback && this._shown[index + 1]?.record.parent === index)
      this.showDescendants(index);
  }
  showDescendants(index) {
    const end = Math.min(this.subtreeEnd(index), this._shown.length);
    for (let at = index + 1;at < end; at++) {
      const shown = this._shown[at];
      shown.renderable = shown.default = shown.container = shown.marker = shown.written = shown.targets = undefined;
      shown.gap = shown.width = shown.count = shown.ordinal = undefined;
    }
    const refresh = { tables: new Set, lists: new Set, items: new Set };
    for (let at = index + 1;at < end; at++) {
      if (!this.isHidden(at))
        this.show(at, undefined);
      this.afterChange(at, refresh, true);
    }
    this.afterChange(index, refresh, true);
    this.refresh(refresh);
  }
  subtreeEnd(index) {
    const blocks = this._doc.blocks;
    let at = index + 1;
    while (at < blocks.length && blocks[at].parent !== undefined && blocks[at].parent >= index)
      at++;
    return at;
  }
  parentOf(index) {
    const parent = this._doc.blocks[index].parent;
    return parent === undefined ? this : this._shown[parent].container;
  }
  isHidden(index) {
    for (let parent = this._doc.blocks[index].parent;parent !== undefined; parent = this._doc.blocks[parent].parent) {
      const shown = this._shown[parent];
      if (shown.record.kind === nativeConstants.OT_MD_TABLE || !shown.default)
        return true;
    }
    return false;
  }
  rendersCustom(block) {
    const renderBlock = this._renderBlock;
    if (!renderBlock)
      return false;
    if (block.kind === nativeConstants.OT_MD_CODE)
      return true;
    return !renderBlock.codeBlockOnly && block.parent === undefined;
  }
  resolve(index) {
    const block = this._doc.blocks[index];
    const shown = this._shown[index];
    let fallback;
    const defaultRender = () => fallback ??= this.buildDefault(index, shown.default);
    if (!this.rendersCustom(block))
      return { renderable: defaultRender(), fallback };
    const unused = () => fallback && fallback !== shown.default && !fallback.parent && fallback.destroyRecursively();
    let custom;
    try {
      custom = this._renderBlock(this.view(index), {
        syntaxStyle: this._syntaxStyle,
        conceal: this._conceal,
        concealCode: this._concealCode,
        treeSitterClient: this._treeSitterClient,
        defaultRender: () => defaultRender() ?? null
      });
    } catch (error) {
      unused();
      throw error;
    }
    if (!custom)
      return { renderable: defaultRender(), fallback };
    if (fallback && holds(custom, fallback))
      return { renderable: custom, fallback };
    unused();
    return { renderable: custom, fallback: undefined };
  }
  buildDefault(index, current) {
    const block = this._doc.blocks[index];
    const shown = this._shown[index];
    const id = `${this.id}-block-${index}`;
    switch (block.kind) {
      case nativeConstants.OT_MD_PARAGRAPH:
      case nativeConstants.OT_MD_HEADING:
      case nativeConstants.OT_MD_HTML: {
        const text = current instanceof TextRenderable2 ? current : new TextRenderable2(this.ctx, { id, flexShrink: 0, wrapMode: "word" });
        this.styleText(index, text);
        if (text === current)
          return text;
        if (isProse(block.kind) && !this.hostWrites(block)) {
          this._doc.bind(index, this.ctx.nativeScene.textNode(text));
          shown.bound = true;
        }
        return text;
      }
      case nativeConstants.OT_MD_CODE: {
        if (current instanceof CodeRenderable2) {
          this.setCode(index, current);
          return current;
        }
        const code = new CodeRenderable2(this.ctx, {
          id,
          syntaxStyle: this._syntaxStyle,
          treeSitterClient: this._treeSitterClient,
          width: "100%",
          flexShrink: 0
        });
        this.setCode(index, code);
        return code;
      }
      case nativeConstants.OT_MD_RULE:
        if (current instanceof BoxRenderable2)
          return current;
        return new BoxRenderable2(this.ctx, {
          id,
          width: "100%",
          height: 1,
          border: ["top"],
          borderColor: this.getStyle("conceal")?.fg ?? this._fg ?? "#888888",
          flexShrink: 0
        });
      case nativeConstants.OT_MD_TABLE: {
        if (current instanceof TextTableRenderable)
          return current;
        const table = new TextTableRenderable(this.ctx, { id, width: "100%", flexShrink: 0, content: [] });
        this.applyTableRenderableOptions(table, this.resolveTableRenderableOptions());
        shown.container = undefined;
        return table;
      }
      case nativeConstants.OT_MD_QUOTE: {
        const quote = new BoxRenderable2(this.ctx, {
          id,
          width: "100%",
          minHeight: 1,
          border: ["left"],
          borderColor: this.getStyle("conceal")?.fg ?? this.getStyle("default")?.fg ?? this._fg ?? "#FFFFFF",
          paddingLeft: 1,
          flexDirection: "column",
          rowGap: 1,
          flexShrink: 0
        });
        shown.container = quote;
        return quote;
      }
      case nativeConstants.OT_MD_LIST: {
        const list = new BoxRenderable2(this.ctx, { id, width: "100%", flexDirection: "column", flexShrink: 0 });
        shown.container = list;
        return list;
      }
      case nativeConstants.OT_MD_ITEM: {
        const row = new BoxRenderable2(this.ctx, { id, width: "100%", flexDirection: "row", flexShrink: 0 });
        shown.marker = new TextRenderable2(this.ctx, { id: `${id}-marker`, flexShrink: 0 });
        shown.container = new BoxRenderable2(this.ctx, {
          id: `${id}-content`,
          flexDirection: "column",
          flexGrow: 1,
          flexShrink: 1
        });
        row.add(shown.marker);
        row.add(shown.container);
        return row;
      }
      default:
        return;
    }
  }
  setCode(index, code) {
    const block = this._doc.blocks[index];
    code.filetype = (block.flags & nativeConstants.OT_MD_BLOCK_MATH) !== 0 ? undefined : infoStringToFiletype2(this.view(index).lang ?? "");
    code.syntaxStyle = this._syntaxStyle;
    code.fg = this._fg;
    code.bg = this._bg;
    code.conceal = this._concealCode;
    code.drawUnstyledText = (block.flags & nativeConstants.OT_MD_BLOCK_MATH) !== 0 || !this._streaming;
    code.streaming = this._streaming;
    code.content = this.leafText(index);
  }
  afterChange(index, refresh, layout) {
    const block = this._doc.blocks[index];
    const shown = this._shown[index];
    if (block.kind === nativeConstants.OT_MD_TABLE)
      refresh.tables.add(index);
    if (block.kind === nativeConstants.OT_MD_TABLE_ROW || block.kind === nativeConstants.OT_MD_TABLE_CELL)
      refresh.tables.add(this.tableOf(index));
    if (block.kind === nativeConstants.OT_MD_TABLE_CELL)
      shown.cell = undefined;
    if (layout && block.kind === nativeConstants.OT_MD_LIST)
      refresh.lists.add(index);
    if (layout && block.kind === nativeConstants.OT_MD_ITEM)
      refresh.items.add(index);
    const parent = block.parent === undefined ? undefined : this._doc.blocks[block.parent];
    if (layout && parent?.kind === nativeConstants.OT_MD_ITEM)
      refresh.items.add(block.parent);
    const text = isProse(block.kind) || block.kind === nativeConstants.OT_MD_HTML;
    if (!text || this.isHidden(index) || !(shown.default instanceof TextRenderable2))
      return;
    if (block.kind === nativeConstants.OT_MD_HTML || this.hostWrites(block)) {
      this.writeProse(index, false);
    } else if (shown.written !== undefined) {
      this.bind(index, shown.default);
    }
  }
  writeProse(index, force) {
    const shown = this._shown[index];
    const text = shown.default;
    if (!(text instanceof TextRenderable2) || !this._syntaxStyle)
      return;
    const leaf = this._doc.readLeaf(index);
    const hooked = this._inlineHook && (this._doc.blocks[index].flags & nativeConstants.OT_MD_BLOCK_HOOKED) !== 0;
    const source = hooked ? this._doc.readSource(index) : undefined;
    const written = JSON.stringify([leaf.chunks, [...leaf.spans], source]);
    if (!force && shown.written === written)
      return;
    shown.written = written;
    const spans = this.spans(leaf.chunks, leaf.spans);
    const output = hooked ? this.hook(spans, source, false) : spans;
    const ranges = [];
    let end = 0;
    const chunks = output.map(({ text, fg, bg, attributes, link, target }) => {
      const start = end;
      end += textEncoder.encode(text).length;
      if (target !== undefined)
        ranges.push([start, end, target]);
      return { __isChunk: true, text, fg, bg, attributes, link };
    });
    text.content = new StyledText2(chunks);
    shown.targets = ranges.length > 0 ? ranges : undefined;
  }
  spans(chunks, flags) {
    return chunks.map(({ text, fg, bg, attributes, link }, index) => {
      const span = {
        text,
        fg,
        bg,
        attributes,
        link,
        code: (flags[index] & nativeConstants.OT_MD_SPAN_CODE) !== 0
      };
      if (flags[index] & nativeConstants.OT_MD_SPAN_MATH)
        span.math = text;
      return span;
    });
  }
  hook(spans, source, tableCell) {
    const context = { source, conceal: this._conceal, syntaxStyle: this._syntaxStyle, tableCell };
    return this._inlineHook(spans, context);
  }
  tableOf(index) {
    let at = index;
    while (this._doc.blocks[at].kind !== nativeConstants.OT_MD_TABLE)
      at = this._doc.blocks[at].parent;
    return at;
  }
  childrenOf(index) {
    const children = [];
    const blocks = this._doc.blocks;
    for (let at = index + 1;at < blocks.length; at++) {
      const parent = blocks[at].parent;
      if (parent === undefined || parent < index)
        break;
      if (parent === index)
        children.push(at);
    }
    return children;
  }
  fillTable(index) {
    const table = this._shown[index]?.default;
    if (!(table instanceof TextTableRenderable) || !this._syntaxStyle)
      return;
    const columns = this._doc.blocks[index].number;
    const previous = table.content;
    const content = this.childrenOf(index).map((row, r) => {
      const header = (this._doc.blocks[row].flags & nativeConstants.OT_MD_BLOCK_HEADER) !== 0;
      const cells = this.childrenOf(row).map((cell, c) => {
        const shown = this._shown[cell];
        if (shown?.cell)
          return shown.cell;
        const read = this.readCell(cell, header);
        const before = previous[r]?.[c];
        const chunks = before && sameChunks(before, read) ? before : read;
        if (shown)
          shown.cell = chunks;
        return chunks;
      });
      while (cells.length < columns)
        cells.push([{ __isChunk: true, text: " " }]);
      return cells;
    });
    table.content = content;
  }
  readCell(cell, header) {
    const heading = header ? this.getStyle("markup.heading") ?? this.getStyle("default") : undefined;
    const headingAttributes = heading ? createTextAttributes2(heading) : 0;
    const leaf = this._doc.readLeaf(cell);
    let spans = this.spans(leaf.chunks, leaf.spans).map((span) => {
      if (!heading)
        return span;
      const strike = heading.strikethrough === undefined ? (span.attributes ?? 0) & TextAttributes2.STRIKETHROUGH : 0;
      return { ...span, fg: heading.fg ?? span.fg, bg: heading.bg ?? span.bg, attributes: headingAttributes | strike };
    });
    if (this._inlineHook && (this._doc.blocks[cell].flags & nativeConstants.OT_MD_BLOCK_HOOKED) !== 0) {
      spans = this.hook(spans, this._doc.readSource(cell), true);
    }
    const chunks = spans.map(({ text, fg, bg, attributes, link }) => ({
      __isChunk: true,
      text,
      fg,
      bg,
      attributes,
      link
    }));
    return chunks.length > 0 ? chunks : [{ __isChunk: true, text: " " }];
  }
  updateList(index, listed) {
    const list = this._shown[index];
    if (!list || !(list.default instanceof BoxRenderable2) || this.isHidden(index))
      return;
    const block = this._doc.blocks[index];
    const recount = listed === undefined || list.count === undefined;
    let items = recount ? this.childrenOf(index) : listed;
    let count = recount ? 0 : list.count;
    if (recount)
      list.loose = false;
    for (const item of items) {
      const shown = this._shown[item];
      if (recount || shown.ordinal === undefined)
        shown.ordinal = count++;
      list.loose ||= this.isLoose(item);
    }
    list.count = count;
    const tight = (block.flags & nativeConstants.OT_MD_BLOCK_OPEN) !== 0 ? !list.loose : (block.flags & nativeConstants.OT_MD_BLOCK_TIGHT) !== 0;
    const gap = tight ? 0 : 1;
    const ordered = (block.flags & nativeConstants.OT_MD_BLOCK_ORDERED) !== 0;
    const width = ordered ? `${block.number + Math.max(0, count - 1)}`.length + 1 : 1;
    if (gap !== list.gap || width !== list.width) {
      list.gap = gap;
      list.width = width;
      list.default.rowGap = gap;
      if (listed)
        items = this.childrenOf(index);
    }
    const base = this.baseStyle(index);
    const style = this.getStyle("markup.list");
    for (const item of items) {
      const shown = this._shown[item];
      if (!shown.marker || !(shown.container instanceof BoxRenderable2))
        continue;
      const flags = this._doc.blocks[item].flags;
      const checked = (flags & nativeConstants.OT_MD_BLOCK_CHECKED) !== 0;
      const task = (flags & nativeConstants.OT_MD_BLOCK_TASK) === 0 ? "" : this._conceal ? checked ? " \u2611" : " \u2610" : checked ? " [x]" : " [ ]";
      const label = (ordered ? `${block.number + shown.ordinal}.`.padStart(width) : "-") + task + " ";
      const chunk = {
        __isChunk: true,
        text: label,
        fg: style?.fg ?? base.fg,
        bg: style?.bg ?? base.bg,
        attributes: style ? createTextAttributes2(style) : base.attributes
      };
      const [shownChunk, ...rest] = shown.marker.chunks;
      const same = rest.length === 0 && shownChunk?.text === chunk.text && colorsEqual(shownChunk.fg, chunk.fg) && colorsEqual(shownChunk.bg, chunk.bg) && shownChunk.attributes === chunk.attributes;
      if (!same)
        shown.marker.content = new StyledText2([chunk]);
      if (shown.gap !== gap)
        shown.container.rowGap = shown.gap = gap;
    }
  }
  isLoose(item) {
    if ((this._doc.blocks[item].flags & nativeConstants.OT_MD_BLOCK_BLANK_AFTER) !== 0)
      return true;
    const children = this.childrenOf(item);
    return children.slice(1).some((child, n) => {
      const gap = this.sourceText(this._doc.blocks[children[n]].sourceEnd, this._doc.blocks[child].sourceStart);
      return (gap.match(/\r\n|\r|\n/g)?.length ?? 0) > 1;
    });
  }
  baseStyle(index) {
    const style = this.getStyle("default");
    const base = {
      fg: this._fg ?? style?.fg,
      bg: this._bg ?? style?.bg,
      attributes: style ? createTextAttributes2(style) : 0
    };
    const quote = this.getStyle("markup.quote");
    for (let at = index;at !== undefined; at = this._doc.blocks[at].parent) {
      if (this._doc.blocks[at].kind !== nativeConstants.OT_MD_QUOTE || !quote)
        continue;
      base.fg = quote.fg ?? base.fg;
      base.bg = quote.bg ?? base.bg;
      base.attributes |= createTextAttributes2(quote);
    }
    return base;
  }
  styleText(index, text) {
    const base = this.baseStyle(this._doc.blocks[index].parent);
    text.fg = base.fg;
    text.bg = base.bg;
    text.attributes = base.attributes;
  }
  getStyle(group) {
    return this._syntaxStyle?.getStyle(group);
  }
  restyle(skip = new Set) {
    const tables = [];
    const lists = [];
    this._shown.forEach((shown, index) => {
      const block = this._doc.blocks[index];
      if (this.isHidden(index))
        return;
      if (this.rendersCustom(block) && !skip.has(index))
        this.show(index, shown.renderable);
      const renderable = shown.default;
      if (!renderable)
        return;
      if (renderable instanceof TextRenderable2)
        this.styleText(index, renderable);
      else if (renderable instanceof CodeRenderable2)
        this.setCode(index, renderable);
      else if (renderable instanceof TextTableRenderable) {
        this.applyTableRenderableOptions(renderable, this.resolveTableRenderableOptions());
        for (let at = index + 1, end = this.subtreeEnd(index);at < end; at++)
          this._shown[at].cell = undefined;
        tables.push(index);
      } else if (block.kind === nativeConstants.OT_MD_LIST)
        lists.push(index);
      else if (block.kind === nativeConstants.OT_MD_RULE && renderable instanceof BoxRenderable2) {
        renderable.borderColor = this.getStyle("conceal")?.fg ?? this._fg ?? "#888888";
      } else if (block.kind === nativeConstants.OT_MD_QUOTE && renderable instanceof BoxRenderable2) {
        renderable.borderColor = this.getStyle("conceal")?.fg ?? this.getStyle("default")?.fg ?? this._fg ?? "#FFFFFF";
      }
    });
    for (const table of tables)
      this.fillTable(table);
    for (const list of lists)
      this.updateList(list);
  }
  rebuild() {
    for (const shown of this._shown) {
      for (const renderable of [shown.renderable, shown.default]) {
        if (renderable && !renderable.isDestroyed)
          renderable.destroyRecursively();
      }
    }
    const blocks = this._doc.blocks;
    this._shown = [];
    this.apply({ removedFrom: undefined, changed: blocks.slice() });
    this.requestRender();
  }
  view(index) {
    const block = this._doc.blocks[index];
    const kind = kindNames[block.kind];
    const self = this;
    const view = {
      index,
      kind,
      get raw() {
        return self.sourceText(block.sourceStart, block.sourceEnd);
      },
      get text() {
        return block.kind === nativeConstants.OT_MD_PARAGRAPH || block.kind === nativeConstants.OT_MD_HEADING || block.kind === nativeConstants.OT_MD_CODE || block.kind === nativeConstants.OT_MD_TABLE_CELL ? self.leafText(index) : "";
      },
      get children() {
        return self.childrenOf(index).map((child) => self.view(child));
      }
    };
    if (block.kind === nativeConstants.OT_MD_HEADING)
      view.level = block.number;
    if (block.kind === nativeConstants.OT_MD_LIST) {
      view.ordered = (block.flags & nativeConstants.OT_MD_BLOCK_ORDERED) !== 0;
      view.start = block.number;
    }
    if (block.kind === nativeConstants.OT_MD_ITEM && (block.flags & nativeConstants.OT_MD_BLOCK_TASK) !== 0) {
      view.checked = (block.flags & nativeConstants.OT_MD_BLOCK_CHECKED) !== 0;
    }
    if (block.kind === nativeConstants.OT_MD_CODE) {
      const info = this.sourceText(block.infoStart, block.infoEnd);
      view.type = "code";
      view.info = info;
      view.lang = (block.flags & nativeConstants.OT_MD_BLOCK_MATH) !== 0 ? "math" : info.split(/\s/)[0] ?? "";
      view.closed = (block.flags & nativeConstants.OT_MD_BLOCK_CLOSED) !== 0;
    }
    return view;
  }
  leafText(index) {
    return this._doc.readLeaf(index).chunks.map((chunk) => chunk.text).join("");
  }
  sourceText(start, end) {
    return this._doc.source(start, end);
  }
  resolveTableStyle() {
    return this._tableOptions?.style ?? "grid";
  }
  resolveTableRenderableOptions() {
    const style = this.resolveTableStyle();
    const borders = this._tableOptions?.borders ?? style === "grid";
    return {
      columnWidthMode: this._tableOptions?.widthMode ?? (style === "columns" ? "content" : "full"),
      columnFitter: this._tableOptions?.columnFitter ?? "proportional",
      wrapMode: this._tableOptions?.wrapMode ?? "word",
      cellPadding: this._tableOptions?.cellPadding ?? 0,
      cellPaddingX: this._tableOptions?.cellPaddingX ?? this._tableOptions?.cellPadding ?? 0,
      cellPaddingY: this._tableOptions?.cellPaddingY ?? this._tableOptions?.cellPadding ?? 0,
      columnGap: style === "columns" && !borders ? 2 : 0,
      border: borders,
      outerBorder: this._tableOptions?.outerBorder ?? borders,
      showBorders: borders,
      borderStyle: this._tableOptions?.borderStyle ?? "single",
      borderColor: this._tableOptions?.borderColor ?? this.getStyle("conceal")?.fg ?? "#888888",
      fg: this._fg,
      selectable: this._tableOptions?.selectable ?? true
    };
  }
  applyTableRenderableOptions(tableRenderable, options) {
    tableRenderable.columnWidthMode = options.columnWidthMode;
    tableRenderable.columnFitter = options.columnFitter;
    tableRenderable.wrapMode = options.wrapMode;
    tableRenderable.cellPaddingX = options.cellPaddingX;
    tableRenderable.cellPaddingY = options.cellPaddingY;
    tableRenderable.columnGap = options.columnGap;
    tableRenderable.border = options.border;
    tableRenderable.outerBorder = options.outerBorder;
    tableRenderable.showBorders = options.showBorders;
    tableRenderable.borderStyle = options.borderStyle;
    tableRenderable.borderColor = options.borderColor;
    tableRenderable.fg = options.fg;
    tableRenderable.selectable = options.selectable;
  }
  markStyleDirty() {
    this._styleDirty = true;
    this._ctx.nativeScene.lifecyclePasses.refresh(this);
  }
  rerenderDirtyStyles() {
    if (!this._styleDirty)
      return;
    this._styleDirty = false;
    this._ctx.nativeScene.lifecyclePasses.refresh(this);
    this.restyle();
  }
  _needsLifecyclePass() {
    if (this.onLifecyclePass !== this.applyStyleChanges)
      return super._needsLifecyclePass();
    return this._styleDirty;
  }
  destroySelf() {
    const subscription = MarkdownRenderable._capabilitySubscriptions.get(this.ctx);
    if (subscription) {
      subscription.renderables.delete(this);
      if (subscription.renderables.size === 0) {
        this.ctx.off("capabilities", subscription.listener);
        MarkdownRenderable._capabilitySubscriptions.delete(this.ctx);
      }
    }
    this._doc?.destroy();
    this._styleCopy?.copy.destroy();
    super.destroySelf();
  }
}
// src/renderables/Select.ts
var transparent2 = RGBA2.fromValues(0, 0, 0, 0);
var indicatorColor = parseColor2("#666666");
var defaultSelectKeybindings = [
  { name: "up", action: "move-up" },
  { name: "k", action: "move-up" },
  { name: "down", action: "move-down" },
  { name: "j", action: "move-down" },
  { name: "up", shift: true, action: "move-up-fast" },
  { name: "down", shift: true, action: "move-down-fast" },
  { name: "return", action: "select-current" },
  { name: "linefeed", action: "select-current" }
];
var SelectRenderableEvents;
((SelectRenderableEvents) => {
  SelectRenderableEvents["SELECTION_CHANGED"] = "selectionChanged";
  SelectRenderableEvents["ITEM_SELECTED"] = "itemSelected";
})(SelectRenderableEvents ||= {});

class SelectRenderable extends Renderable2 {
  static defaultFocusable = true;
  _options = [];
  _selectedIndex = 0;
  scrollOffset = 0;
  maxVisibleItems;
  _backgroundColor;
  _textColor;
  _focusedBackgroundColor;
  _focusedTextColor;
  _selectedBackgroundColor;
  _selectedTextColor;
  _descriptionColor;
  _selectedDescriptionColor;
  _showScrollIndicator;
  _wrapSelection;
  _showDescription;
  _showSelectionIndicator;
  _font;
  _itemSpacing;
  linesPerItem;
  fontHeight;
  _fastScrollStep;
  _keyBindingsMap;
  _keyAliasMap;
  _keyBindings;
  _defaultOptions = {
    backgroundColor: "transparent",
    textColor: "#FFFFFF",
    focusedBackgroundColor: "#1a1a1a",
    focusedTextColor: "#FFFFFF",
    selectedBackgroundColor: "#334455",
    selectedTextColor: "#FFFF00",
    selectedIndex: 0,
    descriptionColor: "#888888",
    selectedDescriptionColor: "#CCCCCC",
    showScrollIndicator: false,
    wrapSelection: false,
    showDescription: true,
    showSelectionIndicator: true,
    itemSpacing: 0,
    fastScrollStep: 5
  };
  constructor(ctx, options) {
    super(ctx, options);
    try {
      this._options = options.options || [];
      const requestedIndex = options.selectedIndex ?? this._defaultOptions.selectedIndex;
      this._selectedIndex = this._options.length > 0 ? Math.min(requestedIndex, this._options.length - 1) : 0;
      this._backgroundColor = RGBA2.clone(parseColor2(options.backgroundColor || this._defaultOptions.backgroundColor));
      this._textColor = RGBA2.clone(parseColor2(options.textColor || this._defaultOptions.textColor));
      this._focusedBackgroundColor = RGBA2.clone(parseColor2(options.focusedBackgroundColor || this._defaultOptions.focusedBackgroundColor));
      this._focusedTextColor = RGBA2.clone(parseColor2(options.focusedTextColor || this._defaultOptions.focusedTextColor));
      this._showScrollIndicator = options.showScrollIndicator ?? this._defaultOptions.showScrollIndicator;
      this._wrapSelection = options.wrapSelection ?? this._defaultOptions.wrapSelection;
      this._showDescription = options.showDescription ?? this._defaultOptions.showDescription;
      this._showSelectionIndicator = options.showSelectionIndicator ?? this._defaultOptions.showSelectionIndicator;
      this._font = options.font;
      this._itemSpacing = options.itemSpacing || this._defaultOptions.itemSpacing;
      this.fontHeight = this._font ? measureText2({ text: "A", font: this._font }).height : 1;
      this.updateItemLayout();
      this._selectedBackgroundColor = RGBA2.clone(parseColor2(options.selectedBackgroundColor || this._defaultOptions.selectedBackgroundColor));
      this._selectedTextColor = RGBA2.clone(parseColor2(options.selectedTextColor || this._defaultOptions.selectedTextColor));
      this._descriptionColor = RGBA2.clone(parseColor2(options.descriptionColor || this._defaultOptions.descriptionColor));
      this._selectedDescriptionColor = RGBA2.clone(parseColor2(options.selectedDescriptionColor || this._defaultOptions.selectedDescriptionColor));
      this._fastScrollStep = options.fastScrollStep || this._defaultOptions.fastScrollStep;
      this._keyAliasMap = mergeKeyAliases(defaultKeyAliases, options.keyAliasMap || {});
      this._keyBindings = options.keyBindings || [];
      const mergedBindings = mergeKeyBindings(defaultSelectKeybindings, this._keyBindings);
      this._keyBindingsMap = buildKeyBindingsMap(mergedBindings, this._keyAliasMap);
      this.updateScrollOffset();
      this.requestRender();
    } catch (error) {
      this.abortConstruction(error);
    }
  }
  renderSelf(buffer, deltaTime) {
    const [x, y] = this._paintOrigin(buffer);
    const width = this._paintWidth;
    const height = this._paintHeight;
    const bgColor = this._focused ? this._focusedBackgroundColor : this._backgroundColor;
    const selectedY = (this._selectedIndex - this.scrollOffset) * this.linesPerItem;
    const selectedHeight = this.linesPerItem - this._itemSpacing;
    const hole = this._options.length > 0 && selectedY + this.linesPerItem <= height && this._selectedBackgroundColor.a === 1;
    const top = hole ? selectedY : height;
    const bottom = hole ? selectedY + selectedHeight : height;
    const scrolls = this._showScrollIndicator && this._options.length > this.maxVisibleItems;
    const scrollPercent = this.scrollOffset / (this._options.length - this.maxVisibleItems);
    const indicatorY = scrolls ? y + 1 + Math.floor(scrollPercent * Math.max(1, height - 2)) : -1;
    const draw = (text, textX, textY, color) => {
      const end = textY === indicatorY ? x + width - 1 : x + width;
      buffer.drawTextFit(text, textX, textY, end - textX, color, transparent2);
    };
    buffer.pushScissorRect(x, y, width, height);
    if (buffer === this.frameBuffer)
      buffer.clear(bgColor);
    else {
      buffer.fillRect(x, y, width, top, bgColor);
      buffer.fillRect(x, y + bottom, width, height - bottom, bgColor);
    }
    const visibleOptions = this._options.slice(this.scrollOffset, this.scrollOffset + this.maxVisibleItems);
    for (let i = 0;i < visibleOptions.length; i++) {
      const option = visibleOptions[i];
      const isSelected = this.scrollOffset + i === this._selectedIndex;
      const itemY = y + i * this.linesPerItem;
      if (itemY + this.linesPerItem - 1 >= y + height)
        break;
      if (isSelected) {
        buffer.fillRect(x, itemY, width, selectedHeight, this._selectedBackgroundColor);
      }
      const indicator = this._showSelectionIndicator ? isSelected ? "\u25B6 " : "  " : "";
      const baseTextColor = this._focused ? this._focusedTextColor : this._textColor;
      const nameColor = isSelected ? this._selectedTextColor : baseTextColor;
      const textX = x + 1 + (this._showSelectionIndicator ? 2 : 0);
      if (this._font) {
        if (indicator)
          draw(indicator, x + 1, itemY, nameColor);
        renderFontToFrameBuffer2(buffer, {
          text: option.name,
          x: textX,
          y: itemY,
          color: nameColor,
          backgroundColor: transparent2,
          font: this._font
        });
      } else {
        draw(`${indicator}${option.name}`, x + 1, itemY, nameColor);
      }
      if (this._showDescription && itemY + this.fontHeight < y + height) {
        const descColor = isSelected ? this._selectedDescriptionColor : this._descriptionColor;
        draw(option.description, textX, itemY + this.fontHeight, descColor);
      }
    }
    if (scrolls)
      buffer.drawText("\u2588", x + width - 1, indicatorY, indicatorColor, transparent2);
    buffer.popScissorRect();
  }
  get options() {
    return this._options;
  }
  set options(options) {
    this._options = options ?? [];
    this._selectedIndex = Math.min(this._selectedIndex, Math.max(0, this._options.length - 1));
    this.updateScrollOffset();
    this.requestRender();
  }
  getSelectedOption() {
    return this._options[this._selectedIndex] || null;
  }
  getSelectedIndex() {
    return this._selectedIndex;
  }
  moveUp(steps = 1) {
    const newIndex = this._selectedIndex - steps;
    if (newIndex >= 0) {
      this._selectedIndex = newIndex;
    } else if (this._wrapSelection && this._options.length > 0) {
      this._selectedIndex = this._options.length - 1;
    } else {
      this._selectedIndex = 0;
    }
    this.updateScrollOffset();
    this.requestRender();
    this.emit("selectionChanged" /* SELECTION_CHANGED */, this._selectedIndex, this.getSelectedOption());
  }
  moveDown(steps = 1) {
    const newIndex = this._selectedIndex + steps;
    if (newIndex < this._options.length) {
      this._selectedIndex = newIndex;
    } else if (this._wrapSelection && this._options.length > 0) {
      this._selectedIndex = 0;
    } else {
      this._selectedIndex = this._options.length - 1;
    }
    this.updateScrollOffset();
    this.requestRender();
    this.emit("selectionChanged" /* SELECTION_CHANGED */, this._selectedIndex, this.getSelectedOption());
  }
  selectCurrent() {
    const selected = this.getSelectedOption();
    if (selected) {
      this.emit("itemSelected" /* ITEM_SELECTED */, this._selectedIndex, selected);
    }
  }
  setSelectedIndex(index) {
    if (index >= 0 && index < this._options.length) {
      this._selectedIndex = index;
      this.updateScrollOffset();
      this.requestRender();
      this.emit("selectionChanged" /* SELECTION_CHANGED */, this._selectedIndex, this.getSelectedOption());
    }
  }
  updateItemLayout() {
    const nameLines = this._font ? this.fontHeight : 1;
    this.linesPerItem = nameLines + (this._showDescription ? 1 : 0) + this._itemSpacing;
    this.maxVisibleItems = Math.max(1, Math.floor(this.height / this.linesPerItem));
  }
  updateScrollOffset() {
    const halfVisible = Math.floor(this.maxVisibleItems / 2);
    const newScrollOffset = Math.max(0, Math.min(this._selectedIndex - halfVisible, this._options.length - this.maxVisibleItems));
    if (newScrollOffset !== this.scrollOffset) {
      this.scrollOffset = newScrollOffset;
      this.requestRender();
    }
  }
  onResize(width, height) {
    this.maxVisibleItems = Math.max(1, Math.floor(height / this.linesPerItem));
    this.updateScrollOffset();
    this.requestRender();
  }
  handleKeyPress(key) {
    const action = getKeyBindingAction(this._keyBindingsMap, key);
    if (action) {
      switch (action) {
        case "move-up":
          this.moveUp(1);
          return true;
        case "move-down":
          this.moveDown(1);
          return true;
        case "move-up-fast":
          this.moveUp(this._fastScrollStep);
          return true;
        case "move-down-fast":
          this.moveDown(this._fastScrollStep);
          return true;
        case "select-current":
          this.selectCurrent();
          return true;
      }
    }
    return false;
  }
  get showScrollIndicator() {
    return this._showScrollIndicator;
  }
  set showScrollIndicator(show) {
    this._showScrollIndicator = show;
    this.requestRender();
  }
  get showDescription() {
    return this._showDescription;
  }
  set showDescription(show) {
    if (this._showDescription !== show) {
      this._showDescription = show;
      this.updateItemLayout();
      this.updateScrollOffset();
      this.requestRender();
    }
  }
  get showSelectionIndicator() {
    return this._showSelectionIndicator;
  }
  set showSelectionIndicator(show) {
    const next = show ?? this._defaultOptions.showSelectionIndicator;
    if (this._showSelectionIndicator !== next) {
      this._showSelectionIndicator = next;
      this.requestRender();
    }
  }
  get wrapSelection() {
    return this._wrapSelection;
  }
  set wrapSelection(wrap) {
    this._wrapSelection = wrap;
  }
  set backgroundColor(value) {
    this._backgroundColor = RGBA2.clone(parseColor2(value ?? this._defaultOptions.backgroundColor));
    this.requestRender();
  }
  set textColor(value) {
    this._textColor = RGBA2.clone(parseColor2(value ?? this._defaultOptions.textColor));
    this.requestRender();
  }
  set focusedBackgroundColor(value) {
    this._focusedBackgroundColor = RGBA2.clone(parseColor2(value ?? this._defaultOptions.focusedBackgroundColor));
    this.requestRender();
  }
  set focusedTextColor(value) {
    this._focusedTextColor = RGBA2.clone(parseColor2(value ?? this._defaultOptions.focusedTextColor));
    this.requestRender();
  }
  set selectedBackgroundColor(value) {
    this._selectedBackgroundColor = RGBA2.clone(parseColor2(value ?? this._defaultOptions.selectedBackgroundColor));
    this.requestRender();
  }
  set selectedTextColor(value) {
    this._selectedTextColor = RGBA2.clone(parseColor2(value ?? this._defaultOptions.selectedTextColor));
    this.requestRender();
  }
  set descriptionColor(value) {
    this._descriptionColor = RGBA2.clone(parseColor2(value ?? this._defaultOptions.descriptionColor));
    this.requestRender();
  }
  set selectedDescriptionColor(value) {
    this._selectedDescriptionColor = RGBA2.clone(parseColor2(value ?? this._defaultOptions.selectedDescriptionColor));
    this.requestRender();
  }
  set font(font) {
    this._font = font;
    this.fontHeight = measureText2({ text: "A", font: this._font }).height;
    this.updateItemLayout();
    this.updateScrollOffset();
    this.requestRender();
  }
  set itemSpacing(spacing) {
    this._itemSpacing = spacing;
    this.updateItemLayout();
    this.updateScrollOffset();
    this.requestRender();
  }
  set fastScrollStep(step) {
    this._fastScrollStep = step;
  }
  set keyBindings(bindings) {
    this._keyBindings = bindings ?? [];
    const mergedBindings = mergeKeyBindings(defaultSelectKeybindings, this._keyBindings);
    this._keyBindingsMap = buildKeyBindingsMap(mergedBindings, this._keyAliasMap);
  }
  set keyAliasMap(aliases) {
    this._keyAliasMap = mergeKeyAliases(defaultKeyAliases, aliases);
    const mergedBindings = mergeKeyBindings(defaultSelectKeybindings, this._keyBindings);
    this._keyBindingsMap = buildKeyBindingsMap(mergedBindings, this._keyAliasMap);
  }
  set selectedIndex(value) {
    const newIndex = value ?? this._defaultOptions.selectedIndex;
    const clampedIndex = this._options.length > 0 ? Math.min(Math.max(0, newIndex), this._options.length - 1) : 0;
    if (this._selectedIndex !== clampedIndex) {
      this._selectedIndex = clampedIndex;
      this.updateScrollOffset();
      this.requestRender();
    }
  }
}

// src/renderables/TabSelect.ts
var transparent3 = RGBA2.fromValues(0, 0, 0, 0);
var arrowColor = parseColor2("#AAAAAA");
var defaultTabSelectKeybindings = [
  { name: "left", action: "move-left" },
  { name: "[", action: "move-left" },
  { name: "right", action: "move-right" },
  { name: "]", action: "move-right" },
  { name: "return", action: "select-current" },
  { name: "linefeed", action: "select-current" }
];
var TabSelectRenderableEvents;
((TabSelectRenderableEvents) => {
  TabSelectRenderableEvents["SELECTION_CHANGED"] = "selectionChanged";
  TabSelectRenderableEvents["ITEM_SELECTED"] = "itemSelected";
})(TabSelectRenderableEvents ||= {});
function calculateDynamicHeight(showUnderline, showDescription) {
  let height = 1;
  if (showUnderline) {
    height += 1;
  }
  if (showDescription) {
    height += 1;
  }
  return height;
}
var defaultColors2 = {
  backgroundColor: "transparent",
  textColor: "#FFFFFF",
  focusedBackgroundColor: "#1a1a1a",
  selectedBackgroundColor: "#334455",
  selectedTextColor: "#FFFF00",
  selectedDescriptionColor: "#CCCCCC"
};

class TabSelectRenderable extends Renderable2 {
  static defaultFocusable = true;
  _options = [];
  selectedIndex = 0;
  scrollOffset = 0;
  _tabWidth;
  maxVisibleTabs;
  _backgroundColor;
  _hasBackgroundColor;
  _textColor;
  _focusedBackgroundColor;
  _focusedTextColor;
  _selectedBackgroundColor;
  _selectedTextColor;
  _selectedDescriptionColor;
  _showScrollArrows;
  _showDescription;
  _showUnderline;
  _wrapSelection;
  _keyBindingsMap;
  _keyAliasMap;
  _keyBindings;
  constructor(ctx, options) {
    const calculatedHeight = calculateDynamicHeight(options.showUnderline ?? true, options.showDescription ?? true);
    super(ctx, { ...options, height: calculatedHeight });
    try {
      this._backgroundColor = RGBA2.clone(parseColor2(options.backgroundColor || defaultColors2.backgroundColor));
      this._hasBackgroundColor = !!options.backgroundColor;
      this._textColor = RGBA2.clone(parseColor2(options.textColor || defaultColors2.textColor));
      this._focusedBackgroundColor = RGBA2.clone(parseColor2(options.focusedBackgroundColor || options.backgroundColor || defaultColors2.focusedBackgroundColor));
      this._focusedTextColor = RGBA2.clone(parseColor2(options.focusedTextColor || this._textColor));
      this._options = options.options || [];
      this._tabWidth = options.tabWidth || 20;
      this._showDescription = options.showDescription ?? true;
      this._showUnderline = options.showUnderline ?? true;
      this._showScrollArrows = options.showScrollArrows ?? true;
      this._wrapSelection = options.wrapSelection ?? false;
      this.maxVisibleTabs = Math.max(1, Math.floor(this.width / this._tabWidth));
      this._selectedBackgroundColor = RGBA2.clone(parseColor2(options.selectedBackgroundColor || defaultColors2.selectedBackgroundColor));
      this._selectedTextColor = RGBA2.clone(parseColor2(options.selectedTextColor || defaultColors2.selectedTextColor));
      this._selectedDescriptionColor = RGBA2.clone(parseColor2(options.selectedDescriptionColor || defaultColors2.selectedDescriptionColor));
      this._keyAliasMap = mergeKeyAliases(defaultKeyAliases, options.keyAliasMap || {});
      this._keyBindings = options.keyBindings || [];
      const mergedBindings = mergeKeyBindings(defaultTabSelectKeybindings, this._keyBindings);
      this._keyBindingsMap = buildKeyBindingsMap(mergedBindings, this._keyAliasMap);
    } catch (error) {
      this.abortConstruction(error);
    }
  }
  calculateDynamicHeight() {
    return calculateDynamicHeight(this._showUnderline, this._showDescription);
  }
  defaultDimension(kind) {
    return kind === "height" ? this.calculateDynamicHeight() : super.defaultDimension(kind);
  }
  renderSelf(buffer, deltaTime) {
    const [x, y] = this._paintOrigin(buffer);
    const width = this._paintWidth;
    const height = this._paintHeight;
    const bgColor = this._focused ? this._focusedBackgroundColor : this._backgroundColor;
    const selectedX = (this.selectedIndex - this.scrollOffset) * this._tabWidth;
    const selectedWidth = Math.min(this._tabWidth, width - selectedX);
    const selectedRows = this._showUnderline && height >= 2 ? 2 : 1;
    const hole = this._options.length > 0 && selectedX < width && this._selectedBackgroundColor.a === 1;
    const rows = hole ? selectedRows : 0;
    if (buffer === this.frameBuffer)
      buffer.clear(bgColor);
    else {
      buffer.fillRect(x, y, selectedX, rows, bgColor);
      buffer.fillRect(x + selectedX + selectedWidth, y, width - selectedX - selectedWidth, rows, bgColor);
      buffer.fillRect(x, y + rows, width, height - rows, bgColor);
    }
    const visibleOptions = this._options.slice(this.scrollOffset, this.scrollOffset + this.maxVisibleTabs);
    for (let i = 0;i < visibleOptions.length; i++) {
      const option = visibleOptions[i];
      const isSelected = this.scrollOffset + i === this.selectedIndex;
      const tabX = x + i * this._tabWidth;
      if (tabX >= x + width)
        break;
      const actualTabWidth = Math.min(this._tabWidth, width - i * this._tabWidth);
      const baseTextColor = this._focused ? this._focusedTextColor : this._textColor;
      const nameColor = isSelected ? this._selectedTextColor : baseTextColor;
      if (isSelected) {
        buffer.fillRect(tabX, y, actualTabWidth, selectedRows, this._selectedBackgroundColor);
      }
      buffer.drawTextFit(option.name, tabX + 1, y, actualTabWidth - 2, nameColor, transparent3, true);
      if (isSelected && selectedRows === 2) {
        buffer.drawText("\u25AC".repeat(actualTabWidth), tabX, y + 1, nameColor, transparent3);
      }
    }
    const selectedOption = this.getSelectedOption();
    if (selectedOption && this._showDescription && height >= (this._showUnderline ? 3 : 2)) {
      const descriptionY = y + (this._showUnderline ? 2 : 1);
      const description = selectedOption.description;
      buffer.drawTextFit(description, x + 1, descriptionY, width - 2, this._selectedDescriptionColor, transparent3, true);
    }
    if (this._showScrollArrows && this._options.length > this.maxVisibleTabs) {
      if (this.scrollOffset > 0)
        buffer.drawText("\u2039", x, y, arrowColor, transparent3);
      if (this.scrollOffset + this.maxVisibleTabs < this._options.length) {
        buffer.drawText("\u203A", x + width - 1, y, arrowColor, transparent3);
      }
    }
  }
  setOptions(options) {
    this._options = options;
    this.selectedIndex = Math.min(this.selectedIndex, Math.max(0, options.length - 1));
    this.updateScrollOffset();
    this.requestRender();
  }
  getSelectedOption() {
    return this._options[this.selectedIndex] || null;
  }
  getSelectedIndex() {
    return this.selectedIndex;
  }
  moveLeft() {
    if (this.selectedIndex > 0) {
      this.selectedIndex--;
    } else if (this._wrapSelection && this._options.length > 0) {
      this.selectedIndex = this._options.length - 1;
    } else {
      return;
    }
    this.updateScrollOffset();
    this.requestRender();
    this.emit("selectionChanged" /* SELECTION_CHANGED */, this.selectedIndex, this.getSelectedOption());
  }
  moveRight() {
    if (this.selectedIndex < this._options.length - 1) {
      this.selectedIndex++;
    } else if (this._wrapSelection && this._options.length > 0) {
      this.selectedIndex = 0;
    } else {
      return;
    }
    this.updateScrollOffset();
    this.requestRender();
    this.emit("selectionChanged" /* SELECTION_CHANGED */, this.selectedIndex, this.getSelectedOption());
  }
  selectCurrent() {
    const selected = this.getSelectedOption();
    if (selected) {
      this.emit("itemSelected" /* ITEM_SELECTED */, this.selectedIndex, selected);
    }
  }
  setSelectedIndex(index) {
    if (index >= 0 && index < this._options.length) {
      this.selectedIndex = index;
      this.updateScrollOffset();
      this.requestRender();
      this.emit("selectionChanged" /* SELECTION_CHANGED */, this.selectedIndex, this.getSelectedOption());
    }
  }
  updateScrollOffset() {
    const halfVisible = Math.floor(this.maxVisibleTabs / 2);
    const newScrollOffset = Math.max(0, Math.min(this.selectedIndex - halfVisible, this._options.length - this.maxVisibleTabs));
    if (newScrollOffset !== this.scrollOffset) {
      this.scrollOffset = newScrollOffset;
      this.requestRender();
    }
  }
  onResize(width, height) {
    this.maxVisibleTabs = Math.max(1, Math.floor(width / this._tabWidth));
    this.updateScrollOffset();
    this.requestRender();
  }
  setTabWidth(tabWidth) {
    if (this._tabWidth === tabWidth)
      return;
    this._tabWidth = tabWidth;
    this.maxVisibleTabs = Math.max(1, Math.floor(this.width / this._tabWidth));
    this.updateScrollOffset();
    this.requestRender();
  }
  getTabWidth() {
    return this._tabWidth;
  }
  handleKeyPress(key) {
    const action = getKeyBindingAction(this._keyBindingsMap, key);
    if (action) {
      switch (action) {
        case "move-left":
          this.moveLeft();
          return true;
        case "move-right":
          this.moveRight();
          return true;
        case "select-current":
          this.selectCurrent();
          return true;
      }
    }
    return false;
  }
  get options() {
    return this._options;
  }
  set options(options) {
    this.setOptions(options ?? []);
  }
  set backgroundColor(color) {
    this._backgroundColor = RGBA2.clone(parseColor2(color ?? defaultColors2.backgroundColor));
    this._hasBackgroundColor = color != null;
    this.requestRender();
  }
  set textColor(color) {
    this._textColor = RGBA2.clone(parseColor2(color ?? defaultColors2.textColor));
    this.requestRender();
  }
  set focusedBackgroundColor(color) {
    const fallback = this._hasBackgroundColor ? this._backgroundColor : defaultColors2.focusedBackgroundColor;
    this._focusedBackgroundColor = RGBA2.clone(parseColor2(color ?? fallback));
    this.requestRender();
  }
  set focusedTextColor(color) {
    this._focusedTextColor = RGBA2.clone(parseColor2(color ?? this._textColor));
    this.requestRender();
  }
  set selectedBackgroundColor(color) {
    this._selectedBackgroundColor = RGBA2.clone(parseColor2(color ?? defaultColors2.selectedBackgroundColor));
    this.requestRender();
  }
  set selectedTextColor(color) {
    this._selectedTextColor = RGBA2.clone(parseColor2(color ?? defaultColors2.selectedTextColor));
    this.requestRender();
  }
  set selectedDescriptionColor(color) {
    this._selectedDescriptionColor = RGBA2.clone(parseColor2(color ?? defaultColors2.selectedDescriptionColor));
    this.requestRender();
  }
  get showDescription() {
    return this._showDescription;
  }
  set showDescription(show) {
    if (this._showDescription !== show) {
      this._showDescription = show;
      const newHeight = this.calculateDynamicHeight();
      this.height = newHeight;
      this.requestRender();
    }
  }
  get showUnderline() {
    return this._showUnderline;
  }
  set showUnderline(show) {
    if (this._showUnderline !== show) {
      this._showUnderline = show;
      const newHeight = this.calculateDynamicHeight();
      this.height = newHeight;
      this.requestRender();
    }
  }
  get showScrollArrows() {
    return this._showScrollArrows;
  }
  set showScrollArrows(show) {
    if (this._showScrollArrows !== show) {
      this._showScrollArrows = show;
      this.requestRender();
    }
  }
  get wrapSelection() {
    return this._wrapSelection;
  }
  set wrapSelection(wrap) {
    this._wrapSelection = wrap;
  }
  get tabWidth() {
    return this._tabWidth;
  }
  set tabWidth(tabWidth) {
    this.setTabWidth(tabWidth);
  }
  set keyBindings(bindings) {
    this._keyBindings = bindings ?? [];
    const mergedBindings = mergeKeyBindings(defaultTabSelectKeybindings, this._keyBindings);
    this._keyBindingsMap = buildKeyBindingsMap(mergedBindings, this._keyAliasMap);
  }
  set keyAliasMap(aliases) {
    this._keyAliasMap = mergeKeyAliases(defaultKeyAliases, aliases);
    const mergedBindings = mergeKeyBindings(defaultTabSelectKeybindings, this._keyBindings);
    this._keyBindingsMap = buildKeyBindingsMap(mergedBindings, this._keyAliasMap);
  }
}

// src/renderables/props.ts
var empty = {};
function setRenderableProp(node, name, value, prev) {
  const target = node;
  let event;
  switch (name) {
    case "focused":
      if (value)
        node.focus?.();
      else
        node.blur?.();
      return;
    case "style": {
      const next = value ?? empty;
      const last = prev ?? empty;
      for (const key in last)
        if (next[key] === undefined)
          target[key] = undefined;
      for (const key in next)
        if (next[key] !== last[key])
          target[key] = next[key];
      return;
    }
    case "onChange":
      if (node instanceof InputRenderable)
        event = "change" /* CHANGE */;
      else if (node instanceof SelectRenderable)
        event = "selectionChanged" /* SELECTION_CHANGED */;
      else if (node instanceof TabSelectRenderable)
        event = "selectionChanged" /* SELECTION_CHANGED */;
      break;
    case "onInput":
      if (node instanceof InputRenderable)
        event = "input" /* INPUT */;
      break;
    case "onSubmit":
      if (node instanceof InputRenderable) {
        event = "enter" /* ENTER */;
        break;
      }
      target.onSubmit = value;
      return;
    case "onSelect":
      if (node instanceof SelectRenderable)
        event = "itemSelected" /* ITEM_SELECTED */;
      else if (node instanceof TabSelectRenderable)
        event = "itemSelected" /* ITEM_SELECTED */;
      break;
  }
  if (!event) {
    target[name] = value;
    return;
  }
  if (prev)
    node.off(event, prev);
  if (value)
    node.on(event, value);
}
// src/renderables/TimeToFirstDraw.ts
var transparent4 = RGBA2.fromValues(0, 0, 0, 0);
function fittedWidth(buffer, text, maxWidth) {
  if (/^[\x20-\x7e]*$/.test(text))
    return Math.min(text.length, maxWidth);
  const encoded = buffer.encodeUnicode(text);
  let width = 0;
  for (const glyph of encoded.data) {
    if (width + glyph.width > maxWidth)
      break;
    width += glyph.width;
  }
  buffer.freeUnicode(encoded);
  return width;
}

class TimeToFirstDrawRenderable extends Renderable2 {
  _runtimeMs = null;
  textColor;
  label;
  precision;
  constructor(ctx, options = {}) {
    super(ctx, {
      width: "100%",
      height: 1,
      flexShrink: 0,
      alignSelf: "center",
      ...options
    });
    this.textColor = parseColor2(options.fg ?? "#AAAAAA");
    this.label = options.label ?? "Time to first draw";
    this.precision = this.normalizePrecision(options.precision ?? 2);
  }
  defaultDimension(kind) {
    return kind === "width" ? "100%" : 1;
  }
  get runtimeMs() {
    return this._runtimeMs;
  }
  set fg(value) {
    this.textColor = parseColor2(value);
    this.requestRender();
  }
  set color(value) {
    this.fg = value;
  }
  set textLabel(value) {
    if (value === this.label) {
      return;
    }
    this.label = value;
    this.requestRender();
  }
  set decimals(value) {
    const nextPrecision = this.normalizePrecision(value);
    if (nextPrecision === this.precision) {
      return;
    }
    this.precision = nextPrecision;
    this.requestRender();
  }
  reset() {
    this._runtimeMs = null;
    this.requestRender();
  }
  renderSelf(buffer) {
    if (this._runtimeMs === null) {
      this._runtimeMs = performance.now();
    }
    const content = `${this.label}: ${this._runtimeMs.toFixed(this.precision)}ms`;
    const maxWidth = Math.max(this.width, 1);
    const [x, y] = this._paintOrigin(buffer);
    const width = fittedWidth(buffer, content, maxWidth);
    buffer.drawTextFit(content, x + Math.floor((maxWidth - width) / 2), y, width, this.textColor, transparent4);
  }
  normalizePrecision(value) {
    if (!Number.isFinite(value)) {
      return 2;
    }
    return Math.max(0, Math.floor(value));
  }
}
export {
  ACHROMATOPSIA_MATRIX,
  ASCIIFontRenderable,
  ASCIIFontSelectionHelper2 as ASCIIFontSelectionHelper,
  ATTRIBUTE_BASE_BITS2 as ATTRIBUTE_BASE_BITS,
  ATTRIBUTE_BASE_MASK2 as ATTRIBUTE_BASE_MASK,
  ArrowRenderable2 as ArrowRenderable,
  Audio,
  AudioCaptureStream,
  AudioCaptureStreamError,
  AudioInitializationError,
  AudioRecorder,
  AudioRecorderError,
  AudioStream,
  AudioStreamError,
  BaseRenderable2 as BaseRenderable,
  BloomEffect,
  BorderCharArrays2 as BorderCharArrays,
  BorderChars2 as BorderChars,
  BoxRenderable2 as BoxRenderable,
  CRTRollingBarEffect,
  CliRenderEvents2 as CliRenderEvents,
  CliRenderer2 as CliRenderer,
  ClipboardTarget2 as ClipboardTarget,
  CloudsEffect,
  CodeRenderable2 as CodeRenderable,
  ConsolePosition2 as ConsolePosition,
  DEFAULT_BACKGROUND_RGB2 as DEFAULT_BACKGROUND_RGB,
  DEFAULT_FOREGROUND_RGB2 as DEFAULT_FOREGROUND_RGB,
  DEUTERANOPIA_COMP_MATRIX,
  DEUTERANOPIA_SIM_MATRIX,
  DataPathsManager2 as DataPathsManager,
  DebugOverlayCorner2 as DebugOverlayCorner,
  DiffRenderable,
  DistortionEffect,
  EditBuffer2 as EditBuffer,
  EditBufferRenderable2 as EditBufferRenderable,
  EditBufferRenderableEvents2 as EditBufferRenderableEvents,
  EditorView2 as EditorView,
  EmbeddedTerminalRenderable,
  ExtmarksController2 as ExtmarksController,
  FFIRenderLib2 as FFIRenderLib,
  FlamesEffect,
  FrameBufferRenderable,
  GRAYSCALE_MATRIX,
  GREENSCALE_MATRIX,
  INVERT_MATRIX,
  ImageError2 as ImageError,
  ImageLoadError2 as ImageLoadError,
  ImageRenderable2 as ImageRenderable,
  InputRenderable,
  InputRenderableEvents,
  InternalKeyHandler2 as InternalKeyHandler,
  KeyEvent2 as KeyEvent,
  KeyHandler2 as KeyHandler,
  LayoutEvents2 as LayoutEvents,
  LineNumberRenderable,
  LinearScrollAccel2 as LinearScrollAccel,
  LogLevel2 as LogLevel,
  MAX_LINK_URL_BYTES2 as MAX_LINK_URL_BYTES,
  MacOSScrollAccel2 as MacOSScrollAccel,
  MarkdownRenderable,
  MouseButton2 as MouseButton,
  MouseEvent2 as MouseEvent,
  NATIVE_BUFFER_TEXT_BYTES_MAX2 as NATIVE_BUFFER_TEXT_BYTES_MAX,
  NATIVE_EDGE_NONE2 as NATIVE_EDGE_NONE,
  NATIVE_SESSION_CONTROL_PACKET_BYTES2 as NATIVE_SESSION_CONTROL_PACKET_BYTES,
  NativeAudioStreamCloseReason3 as NativeAudioStreamCloseReason,
  NativeAudioStreamFormat3 as NativeAudioStreamFormat,
  NativeAudioStreamState3 as NativeAudioStreamState,
  NativeBorder2 as NativeBorder,
  NativeClipboardCancelStatus2 as NativeClipboardCancelStatus,
  NativeClipboardCopyStatus2 as NativeClipboardCopyStatus,
  NativeClipboardDestroyStatus2 as NativeClipboardDestroyStatus,
  NativeClipboardOperationStatus2 as NativeClipboardOperationStatus,
  NativeClipboardShutdownStatus2 as NativeClipboardShutdownStatus,
  NativeClipboardStartStatus2 as NativeClipboardStartStatus,
  NativeEditCommand2 as NativeEditCommand,
  NativeEditEvent2 as NativeEditEvent,
  NativeEditHighlightOperation2 as NativeEditHighlightOperation,
  NativeEditPositionQuery2 as NativeEditPositionQuery,
  NativeEditorCommand2 as NativeEditorCommand,
  NativeEditorPositionQuery2 as NativeEditorPositionQuery,
  NativeEditorSelectionOperation2 as NativeEditorSelectionOperation,
  NativeEditorStyleMask2 as NativeEditorStyleMask,
  NativeError2 as NativeError,
  NativeImage2 as NativeImage,
  NativeImagePool2 as NativeImagePool,
  NativeSceneFrame2 as NativeSceneFrame,
  NativeSceneHook2 as NativeSceneHook,
  NativeScenePaintPhase2 as NativeScenePaintPhase,
  NativeSession2 as NativeSession,
  NativeSessionPumpStatus2 as NativeSessionPumpStatus,
  NativeSessionRenderStatus2 as NativeSessionRenderStatus,
  NativeSessionState2 as NativeSessionState,
  NativeSessionTerminalPhase2 as NativeSessionTerminalPhase,
  NativeSpanFeed,
  NativeStatus2 as NativeStatus,
  NativeTextViewCommand2 as NativeTextViewCommand,
  OptimizedBuffer2 as OptimizedBuffer,
  PROTANOPIA_COMP_MATRIX,
  PROTANOPIA_SIM_MATRIX,
  PasteEvent2 as PasteEvent,
  RGBA2 as RGBA,
  RainbowTextEffect,
  Renderable2 as Renderable,
  RenderableEvents2 as RenderableEvents,
  RendererControlState2 as RendererControlState,
  ResourceContext2 as ResourceContext,
  RootRenderable2 as RootRenderable,
  RootTextNodeRenderable2 as RootTextNodeRenderable,
  SEPIA_MATRIX,
  SOLARIZATION_MATRIX,
  SYNTHWAVE_MATRIX,
  ScrollBarRenderable2 as ScrollBarRenderable,
  ScrollBoxBar2 as ScrollBoxBar,
  ScrollBoxContent2 as ScrollBoxContent,
  ScrollBoxRenderable2 as ScrollBoxRenderable,
  ScrollBoxViewport2 as ScrollBoxViewport,
  ScrollBoxWrapper2 as ScrollBoxWrapper,
  SelectRenderable,
  SelectRenderableEvents,
  Selection2 as Selection,
  SliderRenderable2 as SliderRenderable,
  SlotRegistry,
  SlotRenderable,
  StyledText2 as StyledText,
  SyntaxStyle,
  SystemClock2 as SystemClock,
  TECHNICOLOR_MATRIX,
  TRITANOPIA_COMP_MATRIX,
  TRITANOPIA_SIM_MATRIX,
  TabSelectRenderable,
  TabSelectRenderableEvents,
  TargetChannel2 as TargetChannel,
  TerminalConsole2 as TerminalConsole,
  TerminalPalette2 as TerminalPalette,
  TextAttributes2 as TextAttributes,
  TextBuffer2 as TextBuffer,
  TextBufferRenderable2 as TextBufferRenderable,
  TextBufferView2 as TextBufferView,
  TextNodeRenderable2 as TextNodeRenderable,
  TextRenderable2 as TextRenderable,
  TextTableRenderable,
  TextareaRenderable,
  TimeToFirstDrawRenderable,
  Timeline2 as Timeline,
  TreeSitterClient2 as TreeSitterClient,
  VideoRenderable,
  VignetteEffect,
  exports_yoga as Yoga,
  acquireSessionBufferLease2 as acquireSessionBufferLease,
  addDefaultParsers2 as addDefaultParsers,
  ansi256IndexToRgb2 as ansi256IndexToRgb,
  applyAsciiArt,
  applyBrightness,
  applyChromaticAberration,
  applyGain,
  applyInvert,
  applyNoise,
  applySaturation,
  applyScanlines,
  attributesWithLink2 as attributesWithLink,
  basenameToFiletype2 as basenameToFiletype,
  bg2 as bg,
  bgBlack2 as bgBlack,
  bgBlue2 as bgBlue,
  bgCyan2 as bgCyan,
  bgGreen2 as bgGreen,
  bgMagenta2 as bgMagenta,
  bgRed2 as bgRed,
  bgWhite2 as bgWhite,
  bgYellow2 as bgYellow,
  black2 as black,
  blink2 as blink,
  blue2 as blue,
  bold2 as bold,
  borderCharsToArray2 as borderCharsToArray,
  brightBlack2 as brightBlack,
  brightBlue2 as brightBlue,
  brightCyan2 as brightCyan,
  brightGreen2 as brightGreen,
  brightMagenta2 as brightMagenta,
  brightRed2 as brightRed,
  brightWhite2 as brightWhite,
  brightYellow2 as brightYellow,
  buildKittyKeyboardFlags2 as buildKittyKeyboardFlags,
  buildTerminalPaletteSignature2 as buildTerminalPaletteSignature,
  capture2 as capture,
  checkCrop2 as checkCrop,
  clearEnvCache2 as clearEnvCache,
  convertGlobalToLocalSelection2 as convertGlobalToLocalSelection,
  convertThemeToStyles,
  coordinateToCharacterIndex2 as coordinateToCharacterIndex,
  createCliRenderer2 as createCliRenderer,
  createClipboard2 as createClipboard,
  createCoreSlotRegistry,
  createExtmarksController2 as createExtmarksController,
  createHostClipboard2 as createHostClipboard,
  createIcyStreamDemuxer,
  createMarkdownCodeBlockRenderer,
  createRendererClipboardAdapter2 as createRendererClipboardAdapter,
  createSlotRegistry,
  createTerminalPalette2 as createTerminalPalette,
  createTextAttributes2 as createTextAttributes,
  createTimeline2 as createTimeline,
  cyan2 as cyan,
  decodePasteBytes2 as decodePasteBytes,
  defaultTextareaKeyBindings,
  destroyTreeSitterClient2 as destroyTreeSitterClient,
  detectLinks2 as detectLinks,
  dim2 as dim,
  engine2 as engine,
  env2 as env,
  envRegistry2 as envRegistry,
  extToFiletype2 as extToFiletype,
  extensionToFiletype2 as extensionToFiletype,
  fg2 as fg,
  fonts2 as fonts,
  generateEnvColored2 as generateEnvColored,
  generateEnvMarkdown2 as generateEnvMarkdown,
  getBaseAttributes2 as getBaseAttributes,
  getBorderFromSides2 as getBorderFromSides,
  getBorderSides2 as getBorderSides,
  getCharacterPositions2 as getCharacterPositions,
  getDataPaths2 as getDataPaths,
  getLinkId2 as getLinkId,
  getTimelineEngine2 as getTimelineEngine,
  getTreeSitterClient2 as getTreeSitterClient,
  green2 as green,
  hastToStyledText2 as hastToStyledText,
  hexToRgb2 as hexToRgb,
  hsvToRgb2 as hsvToRgb,
  imageInfo2 as imageInfo,
  infoStringToFiletype2 as infoStringToFiletype,
  isEditBufferRenderable2 as isEditBufferRenderable,
  isRenderable2 as isRenderable,
  isStyledText2 as isStyledText,
  isTextNodeRenderable2 as isTextNodeRenderable,
  isValidBorderStyle2 as isValidBorderStyle,
  italic2 as italic,
  link2 as link,
  magenta2 as magenta,
  measureEditText2 as measureEditText,
  measureText2 as measureText,
  normalizeColorValue2 as normalizeColorValue,
  normalizeIndexedColorIndex2 as normalizeIndexedColorIndex,
  normalizeTerminalPalette2 as normalizeTerminalPalette,
  parseAlign2 as parseAlign,
  parseAlignItems2 as parseAlignItems,
  parseBorderStyle2 as parseBorderStyle,
  parseBoxSizing2 as parseBoxSizing,
  parseColor2 as parseColor,
  parseDimension2 as parseDimension,
  parseDirection2 as parseDirection,
  parseDisplay2 as parseDisplay,
  parseEdge2 as parseEdge,
  parseFlexDirection2 as parseFlexDirection,
  parseGutter2 as parseGutter,
  parseJustify2 as parseJustify,
  parseKeypress2 as parseKeypress,
  parseLayoutMode2 as parseLayoutMode,
  parseLogLevel2 as parseLogLevel,
  parseMeasureMode2 as parseMeasureMode,
  parseOverflow2 as parseOverflow,
  parsePositionType2 as parsePositionType,
  parseUnit2 as parseUnit,
  parseWrap2 as parseWrap,
  pathToFiletype2 as pathToFiletype,
  red2 as red,
  registerCorePlugin,
  registerEnvVar2 as registerEnvVar,
  renderFontToFrameBuffer2 as renderFontToFrameBuffer,
  resolveBundledFilePath2 as resolveBundledFilePath,
  resolveCoreSlot,
  resolveImageRenderProtocol2 as resolveImageRenderProtocol,
  resolveRenderLib2 as resolveRenderLib,
  reverse2 as reverse,
  rgbToHex2 as rgbToHex,
  sameCrop2 as sameCrop,
  scrollUnitSize2 as scrollUnitSize,
  setRenderLibPath2 as setRenderLibPath,
  setRenderableProp,
  setupAudio,
  strikethrough2 as strikethrough,
  stringToStyledText2 as stringToStyledText,
  stripAnsiSequences2 as stripAnsiSequences,
  t2 as t,
  terminalNamedSingleStrokeKeys2 as terminalNamedSingleStrokeKeys,
  treeSitterToStyledText2 as treeSitterToStyledText,
  treeSitterToTextChunks2 as treeSitterToTextChunks,
  underline2 as underline,
  visualizeRenderableTree2 as visualizeRenderableTree,
  white2 as white,
  yellow2 as yellow
};

//# debugId=09B11551EF0E88F364756E2164756E21
//# sourceMappingURL=index.bun.js.map
