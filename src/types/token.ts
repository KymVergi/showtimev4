import type { Address, Hex } from "viem";
import type { Metric } from "./showtime";

export interface TokenMeta {
  address: Address | null;
  name: string;
  symbol: string;
  decimals: number;
}

export interface TokenSupply {
  totalSupply: Metric<bigint>;
  burned: Metric<bigint>;
  circulating: Metric<bigint>;
}

export interface BurnEvent {
  id: string;
  amount: bigint;
  blockNumber: bigint;
  txHash: Hex;
  timestamp: number | null;
}

export interface BurnRow {
  id: string;
  amount: string;
  block_number: number;
  tx_hash: string;
  timestamp: string | null;
}

export interface WalletTicket {
  address: Address;
  balance: Metric<bigint>;
  totalReceived: Metric<bigint>;
  claimable: Metric<bigint>;
  lastActivity: Metric<number>;
}

export function rowToBurn(row: BurnRow): BurnEvent {
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
