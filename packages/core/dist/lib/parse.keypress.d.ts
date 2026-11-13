import { Buffer } from "node:buffer";
export type KeyEventType = "press" | "repeat" | "release";
export interface ParsedKey {
    name: string;
    ctrl: boolean;
    meta: boolean;
    shift: boolean;
    option: boolean;
    sequence: string;
    number: boolean;
    raw: string;
    eventType: KeyEventType;
    source: "raw" | "kitty";
    code?: string;
    super?: boolean;
    hyper?: boolean;
    capsLock?: boolean;
    numLock?: boolean;
    baseCode?: number;
    repeated?: boolean;
}
export type ParseKeypressOptions = {
    useKittyKeyboard?: boolean;
};
/** The input parser's key names: Kitty's functional keys, linefeed, space, and the SS3 keypad keys' names. */
export declare const terminalNamedSingleStrokeKeys: string[];
/**
 * Decodes `s` as one complete input with the native input parser and returns its first event if that is a key, else
 * null. A live renderer can read the same bytes differently: it delivers keys after a leading mouse, focus or paste
 * event, and while it awaits a terminal reply it takes `CSI 1;2 R` as that reply instead of Shift+F3.
 */
export declare function parseKeypress(s?: Buffer | string, options?: ParseKeypressOptions): ParsedKey | null;
