/** Used only on a failed model check. The caller replays on a fresh fixture and
 * decides if the first failure is still the one at issue. Keep a confirmed
 * concrete input for CI output; a replay budget is not a minimality proof. */
export declare function shrinkSameCheck<T>(input: T[], same: (word: T[]) => boolean, maxReplays: number): T[];
