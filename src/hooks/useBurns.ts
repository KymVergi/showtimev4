"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchIndexedBurns, SUPABASE_CONFIGURED } from "@/lib/supabase";
import { fetchBurnTransfers, ALCHEMY_CONFIGURED } from "@/lib/alchemy";
import { TOKEN_ADDRESS } from "@/config/project";
import { demoBurns, isDemo } from "@/lib/demo";
import { LOADING, NOT_CONFIGURED, UNAVAILABLE, metric, type Metric } from "@/types/showtime";
import type { BurnEvent } from "@/types/token";
import type { Hex } from "viem";

export interface UseBurnsResult {
  burns: BurnEvent[];
  totalBurned: Metric<bigint>;
  lastBurn: Metric<BurnEvent>;
  isLoading: boolean;
  source: "indexer" | "chain" | "demo" | null;
  offline: boolean;
}

async function readBurns(limit: number): Promise<{
  burns: BurnEvent[];
  source: "indexer" | "chain";
} | null> {
  const indexed = await fetchIndexedBurns(limit);
  if (indexed && indexed.length > 0) return { burns: indexed, source: "indexer" };

  if (ALCHEMY_CONFIGURED && TOKEN_ADDRESS) {
    const transfers = await fetchBurnTransfers(TOKEN_ADDRESS, limit);
    if (transfers) {
      return {
        source: "chain",
        burns: transfers
          .filter((t) => t.rawValue !== null)
          .map((t, i) => ({
            id: `${t.hash}-${i}`,
            amount: t.rawValue as bigint,
            blockNumber: t.blockNumber,
            txHash: t.hash as Hex,
            timestamp: t.timestamp,
          })),
      };
    }
  }

  return indexed ? { burns: indexed, source: "indexer" } : null;
}

export function useBurns(limit = 12): UseBurnsResult {
  const enabled = (SUPABASE_CONFIGURED || (ALCHEMY_CONFIGURED && !!TOKEN_ADDRESS)) && !isDemo;

  const query = useQuery({
    queryKey: ["showtime", "burns", limit],
    queryFn: () => readBurns(limit),
    enabled,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

  if (isDemo) {
    const total = demoBurns.reduce((a, b) => a + b.amount, 0n);
    return {
      burns: demoBurns,
      totalBurned: metric(total, "demo"),
      lastBurn: metric(demoBurns[0], "demo"),
      isLoading: false,
      source: "demo",
      offline: false,
    };
  }

  if (!enabled) {
    return {
      burns: [],
      totalBurned: NOT_CONFIGURED,
      lastBurn: NOT_CONFIGURED,
      isLoading: false,
      source: null,
      offline: true,
    };
  }

  if (query.isLoading) {
    return {
      burns: [],
      totalBurned: LOADING,
      lastBurn: LOADING,
      isLoading: true,
      source: null,
      offline: false,
    };
  }

  const data = query.data;
  if (!data || data.burns.length === 0) {
    return {
      burns: [],
      totalBurned: UNAVAILABLE,
      lastBurn: UNAVAILABLE,
      isLoading: false,
      source: data?.source ?? null,
      offline: !data,
    };
  }

  const total = data.burns.reduce((a, b) => a + b.amount, 0n);
  return {
    burns: data.burns,
    totalBurned: metric(total, data.source),
    lastBurn: metric(data.burns[0], data.source),
    isLoading: false,
    source: data.source,
    offline: false,
  };
}

export default useBurns;
