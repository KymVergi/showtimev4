"use client";

import { useReadContracts } from "wagmi";

import { tokenAbi } from "@/lib/contracts";
import {
  BURN_ADDRESSES,
  CHAIN_ID,
  TOKEN_ADDRESS,
  TOKEN_DECIMALS,
  TOKEN_SYMBOL,
  TOKEN_NAME,
} from "@/config/project";
import { demoState, isDemo } from "@/lib/demo";
import { LOADING, NOT_CONFIGURED, UNAVAILABLE, metric } from "@/types/showtime";
import type { TokenMeta, TokenSupply } from "@/types/token";

export interface UseTokenResult extends TokenSupply {
  meta: TokenMeta;
  isLoading: boolean;
  configured: boolean;
}

export function useToken(): UseTokenResult {
  const configured = TOKEN_ADDRESS !== null;

  const contracts = configured
    ? ([
        {
          address: TOKEN_ADDRESS,
          abi: tokenAbi,
          functionName: "totalSupply",
          chainId: CHAIN_ID,
        },
        {
          address: TOKEN_ADDRESS,
          abi: tokenAbi,
          functionName: "decimals",
          chainId: CHAIN_ID,
        },
        {
          address: TOKEN_ADDRESS,
          abi: tokenAbi,
          functionName: "symbol",
          chainId: CHAIN_ID,
        },
        {
          address: TOKEN_ADDRESS,
          abi: tokenAbi,
          functionName: "name",
          chainId: CHAIN_ID,
        },
        ...BURN_ADDRESSES.map((sink) => ({
          address: TOKEN_ADDRESS,
          abi: tokenAbi,
          functionName: "balanceOf" as const,
          args: [sink] as const,
          chainId: CHAIN_ID,
        })),
      ] as const)
    : undefined;

  const { data, isLoading } = useReadContracts({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    contracts: contracts as any,
    query: { enabled: configured && !isDemo, staleTime: 60_000 },
  });

  const meta: TokenMeta = {
    address: TOKEN_ADDRESS,
    name: TOKEN_NAME,
    symbol: TOKEN_SYMBOL,
    decimals: TOKEN_DECIMALS,
  };

  if (isDemo) {
    const burned = demoState.totalBurned;
    return {
      meta,
      totalSupply: metric(demoState.totalSupply, "demo"),
      burned: metric(burned, "demo"),
      circulating: metric(demoState.totalSupply - burned, "demo"),
      isLoading: false,
      configured: true,
    };
  }

  if (!configured) {
    return {
      meta,
      totalSupply: NOT_CONFIGURED,
      burned: NOT_CONFIGURED,
      circulating: NOT_CONFIGURED,
      isLoading: false,
      configured: false,
    };
  }

  if (isLoading) {
    return {
      meta,
      totalSupply: LOADING,
      burned: LOADING,
      circulating: LOADING,
      isLoading: true,
      configured: true,
    };
  }

  const results = data ?? [];
  const pick = <T,>(index: number): T | null => {
    const entry = results[index];
    if (!entry || entry.status !== "success") return null;
    return entry.result as T;
  };

  const totalSupply = pick<bigint>(0);
  const decimals = pick<number>(1);
  const symbol = pick<string>(2);
  const name = pick<string>(3);

  const burnBalances = BURN_ADDRESSES.map((_, i) => pick<bigint>(4 + i));
  const anyBurnKnown = burnBalances.some((b) => b !== null);
  const burned = anyBurnKnown
    ? burnBalances.reduce<bigint>((acc, b) => acc + (b ?? 0n), 0n)
    : null;

  const resolvedMeta: TokenMeta = {
    address: TOKEN_ADDRESS,
    name: name ?? TOKEN_NAME,
    symbol: symbol ?? TOKEN_SYMBOL,
    decimals: decimals ?? TOKEN_DECIMALS,
  };

  return {
    meta: resolvedMeta,
    totalSupply: totalSupply !== null ? metric(totalSupply, "chain") : UNAVAILABLE,
    burned: burned !== null ? metric(burned, "chain") : UNAVAILABLE,
    circulating:
      totalSupply !== null && burned !== null
        ? metric(totalSupply - burned, "chain")
        : UNAVAILABLE,
    isLoading: false,
    configured: true,
  };
}

export default useToken;
