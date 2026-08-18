"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchIndexedFees, SUPABASE_CONFIGURED } from "@/lib/supabase";
import { demoFees, isDemo } from "@/lib/demo";
import { LOADING, NOT_CONFIGURED, UNAVAILABLE, metric } from "@/types/showtime";
import type { FeeEvent, RevenueState } from "@/types/fees";

export interface UseFeesResult extends RevenueState {
  isLoading: boolean;
  indexerOffline: boolean;
  demo: boolean;
}

function summarise(fees: FeeEvent[], source: "indexer" | "demo"): RevenueState {
  const total = fees.reduce((acc, f) => acc + f.amount, 0n);
  const [latest, previous] = fees;
  return {
    totalFees: fees.length ? metric(total, source) : UNAVAILABLE,
    lastFeeEvent: latest ? metric(latest, source) : UNAVAILABLE,
    lastPerformance: previous ? metric(previous, source) : UNAVAILABLE,
    recent: fees,
  };
}

export function useFees(limit = 12): UseFeesResult {
  const query = useQuery({
    queryKey: ["showtime", "fees", limit],
    queryFn: () => fetchIndexedFees(limit),
    enabled: SUPABASE_CONFIGURED && !isDemo,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  if (isDemo) {
    return {
      ...summarise(demoFees, "demo"),
      isLoading: false,
      indexerOffline: false,
      demo: true,
    };
  }

  if (!SUPABASE_CONFIGURED) {
    return {
      totalFees: NOT_CONFIGURED,
      lastFeeEvent: NOT_CONFIGURED,
      lastPerformance: NOT_CONFIGURED,
      recent: [],
      isLoading: false,
      indexerOffline: true,
      demo: false,
    };
  }

  if (query.isLoading) {
    return {
      totalFees: LOADING,
      lastFeeEvent: LOADING,
      lastPerformance: LOADING,
      recent: [],
      isLoading: true,
      indexerOffline: false,
      demo: false,
    };
  }

  const fees = query.data;
  if (fees === null || fees === undefined) {
    return {
      totalFees: UNAVAILABLE,
      lastFeeEvent: UNAVAILABLE,
      lastPerformance: UNAVAILABLE,
      recent: [],
      isLoading: false,
      indexerOffline: true,
      demo: false,
    };
  }

  return {
    ...summarise(fees, "indexer"),
    isLoading: false,
    indexerOffline: false,
    demo: false,
  };
}

export default useFees;
