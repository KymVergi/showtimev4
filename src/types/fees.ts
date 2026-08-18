import type { Hex } from "viem";
import type { Metric } from "./showtime";

export interface FeeEvent {
  id: string;
  amount: bigint;
  blockNumber: bigint;
  txHash: Hex;
  timestamp: number | null;
}

export interface FeeRow {
  id: string;
  amount: string;
  block_number: number;
  tx_hash: string;
  timestamp: string | null;
}

export interface RevenueState {
  totalFees: Metric<bigint>;
  lastPerformance: Metric<FeeEvent>;
  lastFeeEvent: Metric<FeeEvent>;
  recent: FeeEvent[];
}

export function rowToFee(row: FeeRow): FeeEvent {
  return {
    id: row.id,
    amount: BigInt(row.amount),
    blockNumber: BigInt(row.block_number),
    txHash: row.tx_hash as Hex,
    timestamp: row.timestamp
      ? Math.floor(new Date(row.timestamp).getTime() / 1000)
      : null,
  };
}
