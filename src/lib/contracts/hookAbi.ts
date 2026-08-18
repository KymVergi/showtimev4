/**
 * SHOWTIME Hook ABI — the Ringmaster's score.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * THIS FILE IS INTENTIONALLY EMPTY
 * ─────────────────────────────────────────────────────────────────────────────
 * The Hook's behaviour is a property of the deployed bytecode, not of this
 * website. Inventing callbacks, permissions, events or fee routing here would
 * make the site lie about the protocol.
 *
 * So: until the real artifact is pasted in, `hookAbi` stays `[]`, every Hook
 * surface in the UI renders
 *
 *     HOOK ABI NOT CONFIGURED
 *
 * and no Hook function is ever called.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * HOW TO INSTALL THE REAL ABI
 * ─────────────────────────────────────────────────────────────────────────────
 * 1. Deploy / verify the Hook, then copy the ABI array from Etherscan or from
 *    `out/ShowtimeHook.sol/ShowtimeHook.json` (Foundry) / `artifacts/…` (Hardhat).
 * 2. Paste it into `deployedHookAbi` below, keeping `as const satisfies Abi`
 *    off (a plain `Abi` is fine) or on (for literal inference).
 * 3. Set `HOOK_ABI_CONFIGURED` — it is derived automatically from array length,
 *    so there is nothing else to toggle.
 *
 * The UI then reads the ABI and renders the functions/events that genuinely
 * exist. `describeHookAbi()` below does that derivation — it never adds
 * anything that is not in the array.
 */

import type { Abi, AbiFunction, AbiEvent } from "viem";

/**
 * PASTE THE DEPLOYED HOOK ABI HERE.
 *
 * Example shape (do not uncomment unless it matches your deployment):
 *
 * export const deployedHookAbi: Abi = [
 *   { type: "function", name: "getHookPermissions", stateMutability: "pure",
 *     inputs: [], outputs: [{ name: "", type: "tuple", components: [...] }] },
 * ];
 */
export const deployedHookAbi: Abi = [];

export const hookAbi = deployedHookAbi;

/** True once a real artifact has been installed above. */
export const HOOK_ABI_CONFIGURED = deployedHookAbi.length > 0;

/* -------------------------------------------------------------------------- */
/*  Derivation helpers — read-only views over whatever ABI is installed        */
/* -------------------------------------------------------------------------- */

export interface HookAbiSummary {
  configured: boolean;
  /** Uniswap V4 lifecycle callbacks that are actually implemented. */
  callbacks: AbiFunction[];
  /** Every other externally callable function. */
  functions: AbiFunction[];
  /** Read-only functions, useful for dashboards. */
  reads: AbiFunction[];
  /** State-changing functions, i.e. candidate UI actions. */
  writes: AbiFunction[];
  events: AbiEvent[];
}

/**
 * The canonical Uniswap V4 `IHooks` callback names. Used ONLY to classify
 * entries that already exist in the installed ABI — never to add entries.
 */
export const V4_CALLBACK_NAMES = [
  "beforeInitialize",
  "afterInitialize",
  "beforeAddLiquidity",
  "afterAddLiquidity",
  "beforeRemoveLiquidity",
  "afterRemoveLiquidity",
  "beforeSwap",
  "afterSwap",
  "beforeDonate",
  "afterDonate",
] as const;

export type V4CallbackName = (typeof V4_CALLBACK_NAMES)[number];

export function describeHookAbi(abi: Abi = deployedHookAbi): HookAbiSummary {
  const functions = abi.filter((i): i is AbiFunction => i.type === "function");
  const events = abi.filter((i): i is AbiEvent => i.type === "event");

  const callbackSet = new Set<string>(V4_CALLBACK_NAMES);
  const callbacks = functions.filter((f) => callbackSet.has(f.name));
  const rest = functions.filter((f) => !callbackSet.has(f.name));

  return {
    configured: abi.length > 0,
    callbacks,
    functions: rest,
    reads: rest.filter(
      (f) => f.stateMutability === "view" || f.stateMutability === "pure",
    ),
    writes: rest.filter(
      (f) => f.stateMutability === "nonpayable" || f.stateMutability === "payable",
    ),
    events,
  };
}

/** Human readable signature, e.g. `afterSwap(address,tuple,tuple,bytes)`. */
export function signatureOf(item: AbiFunction | AbiEvent): string {
  const inputs = (item.inputs ?? []).map((i) => i.type).join(",");
  return `${item.name}(${inputs})`;
}

export default hookAbi;
