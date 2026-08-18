/**
 * DEMO SHOW data.
 *
 * Only ever consulted when NEXT_PUBLIC_DEMO_MODE === "true". Every surface that
 * consumes it is labelled `DEMO SHOW` on screen, and the source field on each
 * Metric is set to "demo" so nothing can pass itself off as production data.
 */

import { parseUnits, type Hex } from "viem";

import { DEMO_MODE, TOKEN_DECIMALS } from "@/config/project";
import type { ShowEvent } from "@/types/events";
import type { FeeEvent } from "@/types/fees";
import type { BurnEvent } from "@/types/token";

export const isDemo = DEMO_MODE;

const hash = (n: number): Hex =>
  `0x${n.toString(16).padStart(4, "0").repeat(16).slice(0, 64)}` as Hex;

const NOW = 1_760_000_000; // fixed so SSR and client agree

export const demoState = {
  totalSwaps: 12_884,
  totalFeesWei: parseUnits("41.2073", 18),
  ethGeneratedWei: parseUnits("41.2073", 18),
  totalBurned: parseUnits("18400000", TOKEN_DECIMALS),
  totalSupply: parseUnits("1000000000", TOKEN_DECIMALS),
  lastBlock: 21_450_912n,
  lastEventAt: NOW - 92,
};

export const demoFees: FeeEvent[] = Array.from({ length: 8 }, (_, i) => ({
  id: `demo-fee-${i}`,
  amount: parseUnits((0.42 - i * 0.03).toFixed(4), 18),
  blockNumber: demoState.lastBlock - BigInt(i * 37),
  txHash: hash(1000 + i),
  timestamp: NOW - i * 640,
}));

export const demoBurns: BurnEvent[] = Array.from({ length: 6 }, (_, i) => ({
  id: `demo-burn-${i}`,
  amount: parseUnits((1_400_000 - i * 120_000).toString(), TOKEN_DECIMALS),
  blockNumber: demoState.lastBlock - BigInt(i * 1_240),
  txHash: hash(2000 + i),
  timestamp: NOW - i * 21_600,
}));

export const demoEvents: ShowEvent[] = [
  ...demoFees.slice(0, 5).map((f, i) => ({
    id: `demo-ev-fee-${i}`,
    eventType: "fee" as const,
    name: "FeeCollected",
    address: null,
    amount: f.amount,
    blockNumber: f.blockNumber,
    txHash: f.txHash,
    timestamp: f.timestamp,
  })),
  ...demoBurns.slice(0, 3).map((b, i) => ({
    id: `demo-ev-burn-${i}`,
    eventType: "burn" as const,
    name: "Burn",
    address: null,
    amount: b.amount,
    blockNumber: b.blockNumber,
    txHash: b.txHash,
    timestamp: b.timestamp,
  })),
].sort((a, b) => Number(b.blockNumber - a.blockNumber));
