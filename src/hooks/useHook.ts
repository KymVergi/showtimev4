"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import {
  HOOK_ABI_CONFIGURED,
  describeHookAbi,
  hookAbi,
  type HookAbiSummary,
} from "@/lib/contracts";
import { HOOK_ADDRESS } from "@/config/project";
import { getPublicClient } from "@/lib/web3/client";

export type HookStatus =
  | "abi-not-configured"
  | "address-not-configured"
  | "no-code"
  | "live"
  | "unknown";

export interface UseHookResult {
  address: typeof HOOK_ADDRESS;
  abiConfigured: boolean;
  summary: HookAbiSummary;
  status: HookStatus;
  isLoading: boolean;
  /**
   * The V4 hook address encodes its permissions in its low bits. This is a
   * protocol-level fact, derived purely from the address — not a claim about
   * SHOWTIME's implementation.
   */
  addressFlags: { name: string; enabled: boolean }[] | null;
}

/**
 * Uniswap V4 encodes hook permissions in the deployed address' least
 * significant bits. Flag positions are from v4-core `Hooks.sol`.
 */
const HOOK_FLAGS: { name: string; bit: number }[] = [
  { name: "beforeInitialize", bit: 13 },
  { name: "afterInitialize", bit: 12 },
  { name: "beforeAddLiquidity", bit: 11 },
  { name: "afterAddLiquidity", bit: 10 },
  { name: "beforeRemoveLiquidity", bit: 9 },
  { name: "afterRemoveLiquidity", bit: 8 },
  { name: "beforeSwap", bit: 7 },
  { name: "afterSwap", bit: 6 },
  { name: "beforeDonate", bit: 5 },
  { name: "afterDonate", bit: 4 },
  { name: "beforeSwapReturnDelta", bit: 3 },
  { name: "afterSwapReturnDelta", bit: 2 },
  { name: "afterAddLiquidityReturnDelta", bit: 1 },
  { name: "afterRemoveLiquidityReturnDelta", bit: 0 },
];

function decodeAddressFlags(address: string | null) {
  if (!address) return null;
  try {
    const value = BigInt(address);
    return HOOK_FLAGS.map((flag) => ({
      name: flag.name,
      enabled: (value & (1n << BigInt(flag.bit))) !== 0n,
    }));
  } catch {
    return null;
  }
}

export function useHook(): UseHookResult {
  const summary = useMemo(() => describeHookAbi(hookAbi), []);
  const addressFlags = useMemo(() => decodeAddressFlags(HOOK_ADDRESS), []);

  const codeQuery = useQuery({
    queryKey: ["showtime", "hook", "code", HOOK_ADDRESS],
    enabled: HOOK_ADDRESS !== null,
    staleTime: Infinity,
    queryFn: async () => {
      const client = getPublicClient();
      if (!client || !HOOK_ADDRESS) return null;
      try {
        const code = await client.getCode({ address: HOOK_ADDRESS });
        return code && code !== "0x" ? code.length : 0;
      } catch {
        return null;
      }
    },
  });

  let status: HookStatus = "unknown";
  if (!HOOK_ADDRESS) status = "address-not-configured";
  else if (!HOOK_ABI_CONFIGURED) status = "abi-not-configured";
  else if (codeQuery.data === 0) status = "no-code";
  else if (typeof codeQuery.data === "number" && codeQuery.data > 0) status = "live";

  return {
    address: HOOK_ADDRESS,
    abiConfigured: HOOK_ABI_CONFIGURED,
    summary,
    status,
    isLoading: codeQuery.isLoading,
    addressFlags,
  };
}

export default useHook;
