/**
 * SHOWTIME — central project configuration.
 *
 * Every address, key and tunable lives here and is sourced from environment
 * variables. Nothing in the UI may hardcode an address. If a value is missing,
 * the corresponding surface must render a theatrical "NOT CONFIGURED" state
 * rather than inventing data.
 */

import type { Address } from "viem";

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const ADDRESS_RE = /^0x[a-fA-F0-9]{40}$/;

/** Returns a checksum-shaped address or `null` when unset/invalid. */
function readAddress(raw: string | undefined): Address | null {
  if (!raw) return null;
  const value = raw.trim();
  if (!ADDRESS_RE.test(value)) return null;
  if (value.toLowerCase() === "0x0000000000000000000000000000000000000000") {
    return null;
  }
  return value as Address;
}

function readString(raw: string | undefined, fallback: string): string {
  const value = raw?.trim();
  return value && value.length > 0 ? value : fallback;
}

function readBool(raw: string | undefined, fallback = false): boolean {
  if (raw === undefined) return fallback;
  return raw.trim().toLowerCase() === "true";
}

function readOptional(raw: string | undefined): string | null {
  const value = raw?.trim();
  return value && value.length > 0 ? value : null;
}

/* -------------------------------------------------------------------------- */
/*  Chain — Ethereum Mainnet ONLY                                              */
/* -------------------------------------------------------------------------- */

/**
 * SHOWTIME is deployed on Ethereum Mainnet and nowhere else.
 * The chain id is read from the environment purely so local forks can be used
 * during development, but the production value is and must be 1.
 */
export const CHAIN_ID = Number(readString(process.env.NEXT_PUBLIC_CHAIN_ID, "1"));
export const CHAIN_NAME = readString(
  process.env.NEXT_PUBLIC_CHAIN_NAME,
  "Ethereum Mainnet",
);

/* -------------------------------------------------------------------------- */
/*  Addresses                                                                  */
/* -------------------------------------------------------------------------- */

export const TOKEN_ADDRESS = readAddress(process.env.NEXT_PUBLIC_TOKEN_ADDRESS);
export const HOOK_ADDRESS = readAddress(process.env.NEXT_PUBLIC_HOOK_ADDRESS);
export const POOL_MANAGER_ADDRESS = readAddress(
  process.env.NEXT_PUBLIC_POOL_MANAGER_ADDRESS,
);
export const POOL_ID = readOptional(process.env.NEXT_PUBLIC_POOL_ID);

/**
 * Common burn sinks. Balances held here are treated as removed from
 * circulation. These are protocol-agnostic constants, not project claims.
 */
export const BURN_ADDRESSES: readonly Address[] = [
  "0x0000000000000000000000000000000000000000",
  "0x000000000000000000000000000000000000dEaD",
] as const;

/* -------------------------------------------------------------------------- */
/*  Providers                                                                  */
/* -------------------------------------------------------------------------- */

export const ALCHEMY_API_KEY = readOptional(
  process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
);

export const RPC_URL =
  readOptional(process.env.NEXT_PUBLIC_RPC_URL) ??
  (ALCHEMY_API_KEY ? `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}` : null);

export const WALLETCONNECT_PROJECT_ID = readOptional(
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
);

export const SUPABASE_URL = readOptional(process.env.NEXT_PUBLIC_SUPABASE_URL);
export const SUPABASE_ANON_KEY = readOptional(
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

/* -------------------------------------------------------------------------- */
/*  Demo mode                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * When true, the UI may render illustrative sample values so the show can be
 * designed before deployment. It is always labelled "DEMO SHOW" on screen.
 * Never silently substitutes fake production data.
 */
export const DEMO_MODE = readBool(process.env.NEXT_PUBLIC_DEMO_MODE, false);

/* -------------------------------------------------------------------------- */
/*  Explorer                                                                   */
/* -------------------------------------------------------------------------- */

export const EXPLORER_URL = readString(
  process.env.NEXT_PUBLIC_EXPLORER_URL,
  "https://etherscan.io",
).replace(/\/$/, "");

export function explorerAddress(address: string): string {
  return `${EXPLORER_URL}/address/${address}`;
}

export function explorerTx(hash: string): string {
  return `${EXPLORER_URL}/tx/${hash}`;
}

export function explorerToken(address: string): string {
  return `${EXPLORER_URL}/token/${address}`;
}

export function explorerBlock(block: number | bigint): string {
  return `${EXPLORER_URL}/block/${block.toString()}`;
}

/* -------------------------------------------------------------------------- */
/*  Token                                                                      */
/* -------------------------------------------------------------------------- */

export const TOKEN_SYMBOL = readString(
  process.env.NEXT_PUBLIC_TOKEN_SYMBOL,
  "SHOWTIME",
);
export const TOKEN_NAME = readString(process.env.NEXT_PUBLIC_TOKEN_NAME, "SHOWTIME");
export const TOKEN_DECIMALS = Number(
  readString(process.env.NEXT_PUBLIC_TOKEN_DECIMALS, "18"),
);

/**
 * Declared total supply, used only as a display fallback before the contract
 * responds. `null` means "unknown" and the UI must say so.
 */
export const TOKEN_SUPPLY = readOptional(process.env.NEXT_PUBLIC_TOKEN_SUPPLY);

/* -------------------------------------------------------------------------- */
/*  Fee / burn configuration                                                   */
/* -------------------------------------------------------------------------- */

/**
 * These describe the *documented* configuration of the deployment. They are
 * display metadata only — the contract remains the source of truth, and the UI
 * renders "NOT CONFIGURED" wherever a value is absent instead of guessing.
 */
export const feeConfig = {
  /** Pool LP fee in hundredths of a bip (Uniswap V4 units), e.g. 3000 = 0.30%. */
  poolFee: readOptional(process.env.NEXT_PUBLIC_POOL_FEE),
  /** Tick spacing of the configured pool. */
  tickSpacing: readOptional(process.env.NEXT_PUBLIC_TICK_SPACING),
  /** Human readable description of where show revenue is routed. */
  description: readOptional(process.env.NEXT_PUBLIC_FEE_DESCRIPTION),
} as const;

export const burnConfig = {
  /** Human readable description of the final act, if documented. */
  description: readOptional(process.env.NEXT_PUBLIC_BURN_DESCRIPTION),
  addresses: BURN_ADDRESSES,
} as const;

/* -------------------------------------------------------------------------- */
/*  Indexing                                                                   */
/* -------------------------------------------------------------------------- */

export const indexerConfig = {
  /** Block from which the show began. Used to bound log queries. */
  deploymentBlock: (() => {
    const raw = readOptional(process.env.NEXT_PUBLIC_DEPLOYMENT_BLOCK);
    return raw ? BigInt(raw) : null;
  })(),
  /** Max blocks to scan client-side when Supabase is unavailable. */
  maxLookbackBlocks: BigInt(
    readString(process.env.NEXT_PUBLIC_MAX_LOOKBACK_BLOCKS, "50000"),
  ),
} as const;

/* -------------------------------------------------------------------------- */
/*  Social / links                                                             */
/* -------------------------------------------------------------------------- */

export const socials = {
  x: readOptional(process.env.NEXT_PUBLIC_SOCIAL_X),
  github: readOptional(process.env.NEXT_PUBLIC_SOCIAL_GITHUB),
  telegram: readOptional(process.env.NEXT_PUBLIC_SOCIAL_TELEGRAM),
  docs: readString(process.env.NEXT_PUBLIC_SOCIAL_DOCS, "/docs"),
  uniswap: readOptional(process.env.NEXT_PUBLIC_SOCIAL_UNISWAP),
} as const;

/* -------------------------------------------------------------------------- */
/*  Brand copy                                                                 */
/* -------------------------------------------------------------------------- */

export const brand = {
  name: "SHOWTIME",
  ticker: `$${TOKEN_SYMBOL}`,
  primarySlogan: "THE SHOW NEVER STOPS.",
  subtitle: "A PROGRAMMABLE UNISWAP V4 HOOK",
  network: CHAIN_NAME.toUpperCase(),
  slogans: {
    ticket: "EVERY TRADE IS A TICKET.",
    hook: "THE HOOK RUNS THE SHOW.",
    programmable: "PROGRAMMABLE BY DESIGN.",
    bigTop: "WELCOME TO THE BIG TOP.",
    finalAct: "EVERY SHOW HAS A FINAL ACT.",
    curtain: "THE CURTAIN NEVER CLOSES.",
  },
} as const;

/* -------------------------------------------------------------------------- */
/*  Readiness flags — drive every empty / error state in the UI                */
/* -------------------------------------------------------------------------- */

export const readiness = {
  hasToken: TOKEN_ADDRESS !== null,
  hasHook: HOOK_ADDRESS !== null,
  hasPoolManager: POOL_MANAGER_ADDRESS !== null,
  hasRpc: RPC_URL !== null,
  hasAlchemy: ALCHEMY_API_KEY !== null,
  hasSupabase: SUPABASE_URL !== null && SUPABASE_ANON_KEY !== null,
  hasWalletConnect: WALLETCONNECT_PROJECT_ID !== null,
} as const;

export const project = {
  chainId: CHAIN_ID,
  chainName: CHAIN_NAME,
  tokenAddress: TOKEN_ADDRESS,
  hookAddress: HOOK_ADDRESS,
  poolManagerAddress: POOL_MANAGER_ADDRESS,
  poolId: POOL_ID,
  explorerUrl: EXPLORER_URL,
  tokenSymbol: TOKEN_SYMBOL,
  tokenName: TOKEN_NAME,
  tokenDecimals: TOKEN_DECIMALS,
  tokenSupply: TOKEN_SUPPLY,
  feeConfig,
  burnConfig,
  indexerConfig,
  socials,
  brand,
  readiness,
  demoMode: DEMO_MODE,
} as const;

export default project;
