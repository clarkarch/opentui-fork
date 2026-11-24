import { type Clock } from "./lib/clock.js";
import type { ThemeMode } from "./types.js";
export interface RendererThemeModeHost {
    /** Returns true when the query ends with a DA1 sentinel; the host then calls `cancelRefresh` at its reply. */
    queryThemeColors(): boolean;
}
export declare class RendererThemeMode {
    private readonly host;
    private readonly clock;
    private static readonly QUERY_TIMEOUT_MS;
    private _themeMode;
    private refreshPending;
    private themeRefreshTimeoutId;
    private waiters;
    constructor(host: RendererThemeModeHost, clock: Clock);
    get themeMode(): ThemeMode | null;
    waitForThemeMode(timeoutMs: number, isDestroyed: boolean): Promise<ThemeMode | null>;
    dispose(): void;
    /** Resolves every wait with the current mode, also when no mode is known. */
    resolveWaiters(): void;
    handleSequence(sequence: string): {
        handled: boolean;
        changedMode: ThemeMode | null;
    };
    cancelRefresh(): void;
    private requestThemeOscColors;
    private applyThemeMode;
}
