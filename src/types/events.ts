import type { Address, Hex } from "viem";

export type ShowEventType =
  | "swap"
  | "fee"
  | "burn"
  | "transfer"
  | "hook"
  | "unknown";

/** Normalised event shape shared by the chain reader and the Supabase indexer. */
export interface ShowEvent {
  id: string;
  eventType: ShowEventType;
  /** Raw event name from the ABI, when known. */
  name: string | null;
  address: Address | null;
  amount: bigint | null;
  blockNumber: bigint;
  txHash: Hex;
  /** Unix seconds. */
  timestamp: number | null;
}

/** Row shape of `showtime_events` in Supabase. */
export interface ShowEventRow {
  id: string;
  event_type: string;
  address: string | null;
  amount: string | null;
  block_number: number;
  tx_hash: string;
  timestamp: string | null;
  created_at: string;
}

export function rowToEvent(row: ShowEventRow): ShowEvent {
  return {
    id: row.id,
    eventType: (["swap", "fee", "burn", "transfer", "hook"] as const).includes(
      row.event_type as ShowEventType as never,
    )
      ? (row.event_type as ShowEventType)
      : "unknown",
    name: row.event_type,
    address: (row.address as Address) ?? null,
    amount: row.amount !== null ? BigInt(row.amount) : null,
    blockNumber: BigInt(row.block_number),
    txHash: row.tx_hash as Hex,
    timestamp: row.timestamp ? Math.floor(new Date(row.timestamp).getTime() / 1000) : null,
  };
}
