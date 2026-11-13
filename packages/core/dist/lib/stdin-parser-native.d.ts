import { type NativeContextHandle, type RenderLib, type SessionHandle } from "../zig.js";
import { type Clock } from "./clock.js";
import type { ParsedKey } from "./parse.keypress.js";
import type { RawMouseEvent } from "./parse.mouse.js";
export type StdinResponseProtocol = "csi" | "cpr" | "osc" | "dcs" | "apc" | "unknown";
export type StdinEvent = {
    type: "key";
    raw: string;
    key: ParsedKey;
} | {
    type: "mouse";
    raw: string;
    encoding: "sgr" | "x10";
    event: RawMouseEvent;
} | {
    type: "paste";
    bytes: Uint8Array;
} | {
    type: "response";
    protocol: StdinResponseProtocol;
    sequence: string;
};
export interface StdinParserProtocolContext {
    kittyKeyboardEnabled: boolean;
    privateCapabilityRepliesActive: boolean;
    pixelResolutionQueryActive: boolean;
    explicitWidthCprActive: boolean;
    startupCursorCprActive: boolean;
    /** A query batch's DA1 reply is outstanding, so split replies wait for it without a deadline. */
    replySentinelActive: boolean;
}
export interface NativeInputSession {
    lib: RenderLib;
    context: NativeContextHandle;
    session: SessionHandle;
}
export interface NativeStdinParserOptions {
    armTimeouts?: boolean;
    onTimeoutFlush?: () => void;
    protocolContext?: Partial<StdinParserProtocolContext>;
    clock?: Clock;
    /** Parse through this Session's input parser. Without one, the parser owns a private Context and Session. */
    session?: NativeInputSession;
}
/**
 * The renderer's stdin parser. A deferred reply has no deadline, so CPR aborts and
 * pixel queries need no special handling; suspension needs only suspend and resume.
 */
export declare class NativeStdinParser {
    private readonly lib;
    private readonly context;
    private readonly session;
    private readonly ownsContext;
    private readonly records;
    private readonly words;
    private readonly halves;
    private readonly payload;
    private readonly events;
    private readonly clock;
    private readonly armTimeouts;
    private readonly onTimeoutFlush;
    private protocolContext;
    private appliedExpectations;
    private timeoutId;
    private deadlineNs;
    private lastNs;
    private paste;
    private suspended;
    private sessionGone;
    private destroyed;
    constructor(options?: NativeStdinParserOptions);
    updateProtocolContext(patch: Partial<StdinParserProtocolContext>): void;
    /** A bracketed paste has started and not yet ended. */
    get pasting(): boolean;
    push(data: Uint8Array): void;
    read(): StdinEvent | null;
    drain(onEvent: (event: StdinEvent) => void): void;
    /** Resolves a partial unit whose deadline has passed at `nowMsValue`. */
    flushTimeout(nowMsValue?: number): void;
    /** Stops input time and the timer: a unit pending at suspension can still complete on resume. */
    suspend(): void;
    /**
     * Call after feeding the input drained on resume. Input sent before suspension has
     * arrived, so a unit still pending is stale (another process may have read its rest)
     * and is dropped. Only the prefix of a reply the host still awaits keeps waiting.
     */
    resume(): void;
    reset(): void;
    destroy(): void;
    private ensureAlive;
    /** Runs a native call. A Session or Context that closed, failed, or was destroyed ends parsing quietly. */
    private native;
    private destroyContext;
    private applyExpectations;
    private toNs;
    private nowNs;
    private feed;
    private reconcileTimeout;
    private clearTimeout;
    private span;
    private translate;
}
