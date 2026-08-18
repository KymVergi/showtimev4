import type { Address } from "viem";

/**
 * Every value surfaced in the UI carries provenance. The UI is not allowed to
 * render a number without knowing where it came from, which is what makes the
 * "never fabricate data" rule enforceable at the type level.
 */
export type DataSource = "chain" | "indexer" | "demo";

export type DataStatus =
  | "idle"
  | "loading"
  | "ready"
  | "unavailable"
  | "not-configured"
  | "error";

export interface Metric<T> {
  status: DataStatus;
  value: T | null;
  source: DataSource | null;
  /** Optional human readable reason shown in theatrical error copy. */
  reason?: string;
}

export function metric<T>(
  value: T | null | undefined,
  source: DataSource,
): Metric<T> {
  if (value === null || value === undefined) {
    return { status: "unavailable", value: null, source: null };
  }
  return { status: "ready", value, source };
}

export const NOT_CONFIGURED: Metric<never> = {
  status: "not-configured",
  value: null,
  source: null,
};

export const LOADING: Metric<never> = {
  status: "loading",
  value: null,
  source: null,
};

export const UNAVAILABLE: Metric<never> = {
  status: "unavailable",
  value: null,
  source: null,
};

/** Aggregate state of the show — the numbers behind the marquee. */
export interface ShowState {
  totalSwaps: Metric<number>;
  totalFeesWei: Metric<bigint>;
  ethGeneratedWei: Metric<bigint>;
  totalBurned: Metric<bigint>;
  lastBlock: Metric<bigint>;
  lastEventAt: Metric<number>;
}

export interface ContractTriple {
  token: Address | null;
  hook: Address | null;
  poolManager: Address | null;
}

/** Theatrical error identifiers used across the site. */
export type ShowError =
  | "SHOW INTERRUPTED"
  | "WRONG NETWORK"
  | "HOOK UNAVAILABLE"
  | "CONTRACT UNAVAILABLE"
  | "ABI NOT CONFIGURED"
  | "INDEXER OFFLINE"
  | "TRANSACTION PENDING"
  | "TRANSACTION FAILED"
  | "TRANSACTION CONFIRMED"
  | "DATA UNAVAILABLE";
