"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchIndexedState, SUPABASE_CONFIGURED } from "@/lib/supabase";
import { fetchLatestBlock, ALCHEMY_CONFIGURED } from "@/lib/alchemy";
import { getPublicClient } from "@/lib/web3/client";
import { DEMO_MODE, readiness } from "@/config/project";
import { demoState, isDemo } from "@/lib/demo";
import {
  LOADING,
  NOT_CONFIGURED,
  UNAVAILABLE,
  metric,
  type Metric,
  type ShowState,
} from "@/types/showtime";

const STALE = 30_000;

export interface ShowtimeResult extends ShowState {
  isLoading: boolean;
  /** True when nothing at all is wired up yet. */
  isUnconfigured: boolean;
  indexerOffline: boolean;
  demo: boolean;
}

async function readShow() {
  const indexed = await fetchIndexedState();

  let latestBlock: bigint | null = null;
  if (ALCHEMY_CONFIGURED) {
    latestBlock = await fetchLatestBlock();
  }
  if (latestBlock === null) {
    const client = getPublicClient();
    if (client) {
      try {
        latestBlock = await client.getBlockNumber();
      } catch {
        latestBlock = null;
      }
    }
  }

  return { indexed, latestBlock };
}

export function useShowtime(): ShowtimeResult {
  const enabled = readiness.hasRpc || readiness.hasAlchemy || SUPABASE_CONFIGURED;

  const query = useQuery({
    queryKey: ["showtime", "state"],
    queryFn: readShow,
    enabled: enabled && !DEMO_MODE,
    staleTime: STALE,
    refetchInterval: 60_000,
    refetchOnWindowFocus: false,
  });

  if (isDemo) {
    return {
      totalSwaps: metric(demoState.totalSwaps, "demo"),
      totalFeesWei: metric(demoState.totalFeesWei, "demo"),
      ethGeneratedWei: metric(demoState.ethGeneratedWei, "demo"),
      totalBurned: metric(demoState.totalBurned, "demo"),
      lastBlock: metric(demoState.lastBlock, "demo"),
      lastEventAt: metric(demoState.lastEventAt, "demo"),
      isLoading: false,
      isUnconfigured: false,
      indexerOffline: false,
      demo: true,
    };
  }

  if (!enabled) {
    return {
      totalSwaps: NOT_CONFIGURED,
      totalFeesWei: NOT_CONFIGURED,
      ethGeneratedWei: NOT_CONFIGURED,
      totalBurned: NOT_CONFIGURED,
      lastBlock: NOT_CONFIGURED,
      lastEventAt: NOT_CONFIGURED,
      isLoading: false,
      isUnconfigured: true,
      indexerOffline: !SUPABASE_CONFIGURED,
      demo: false,
    };
  }

  if (query.isLoading) {
    return {
      totalSwaps: LOADING,
      totalFeesWei: LOADING,
      ethGeneratedWei: LOADING,
      totalBurned: LOADING,
      lastBlock: LOADING,
      lastEventAt: LOADING,
      isLoading: true,
      isUnconfigured: false,
      indexerOffline: !SUPABASE_CONFIGURED,
      demo: false,
    };
  }

  const indexed = query.data?.indexed ?? null;
  const latestBlock = query.data?.latestBlock ?? null;

  const fromIndexer = <T,>(value: T | null | undefined): Metric<T> =>
    value === null || value === undefined ? UNAVAILABLE : metric(value, "indexer");

  return {
    totalSwaps: fromIndexer(indexed?.totalSwaps ?? null),
    totalFeesWei: fromIndexer(indexed?.totalFees ?? null),
    ethGeneratedWei: fromIndexer(indexed?.totalFees ?? null),
    totalBurned: fromIndexer(indexed?.totalBurned ?? null),
    lastBlock:
      latestBlock !== null
        ? metric(latestBlock, "chain")
        : fromIndexer(indexed?.lastBlock ?? null),
    lastEventAt: fromIndexer(indexed?.updatedAt ?? null),
    isLoading: false,
    isUnconfigured: false,
    indexerOffline: !SUPABASE_CONFIGURED || indexed === null,
    demo: false,
  };
}

export default useShowtime;
