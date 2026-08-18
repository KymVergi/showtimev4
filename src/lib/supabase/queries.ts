import { getSupabase } from "./client";
import type { ShowEvent } from "@/types/events";
import type { FeeEvent } from "@/types/fees";
import type { BurnEvent } from "@/types/token";
import type { Hex, Address } from "viem";
import type {
  ShowtimeBurnsRow,
  ShowtimeEventsRow,
  ShowtimeFeesRow,
  ShowtimeStateRow,
} from "./types";

/** `null` means "indexer offline / unconfigured", not "no data". */
export type IndexerResult<T> = T | null;

function toSeconds(iso: string | null): number | null {
  return iso ? Math.floor(new Date(iso).getTime() / 1000) : null;
}

function mapEvent(row: ShowtimeEventsRow): ShowEvent {
  const known = ["swap", "fee", "burn", "transfer", "hook"] as const;
  const type = (known as readonly string[]).includes(row.event_type)
    ? (row.event_type as ShowEvent["eventType"])
    : "unknown";
  return {
    id: row.id,
    eventType: type,
    name: row.event_type,
    address: (row.address as Address | null) ?? null,
    amount: row.amount !== null ? BigInt(row.amount) : null,
    blockNumber: BigInt(row.block_number),
    txHash: row.tx_hash as Hex,
    timestamp: toSeconds(row.timestamp),
  };
}

function mapFee(row: ShowtimeFeesRow): FeeEvent {
  return {
    id: row.id,
    amount: BigInt(row.amount),
    blockNumber: BigInt(row.block_number),
    txHash: row.tx_hash as Hex,
    timestamp: toSeconds(row.timestamp),
  };
}

function mapBurn(row: ShowtimeBurnsRow): BurnEvent {
  return {
    id: row.id,
    amount: BigInt(row.amount),
    blockNumber: BigInt(row.block_number),
    txHash: row.tx_hash as Hex,
    timestamp: toSeconds(row.timestamp),
  };
}

/* -------------------------------------------------------------------------- */

export async function fetchIndexedEvents(limit = 25): Promise<IndexerResult<ShowEvent[]>> {
  const db = getSupabase();
  if (!db) return null;
  const { data, error } = await db
    .from("showtime_events")
    .select("*")
    .order("block_number", { ascending: false })
    .limit(limit);
  if (error || !data) return null;
  return data.map(mapEvent);
}

export async function fetchIndexedFees(limit = 25): Promise<IndexerResult<FeeEvent[]>> {
  const db = getSupabase();
  if (!db) return null;
  const { data, error } = await db
    .from("showtime_fees")
    .select("*")
    .order("block_number", { ascending: false })
    .limit(limit);
  if (error || !data) return null;
  return data.map(mapFee);
}

export async function fetchIndexedBurns(limit = 25): Promise<IndexerResult<BurnEvent[]>> {
  const db = getSupabase();
  if (!db) return null;
  const { data, error } = await db
    .from("showtime_burns")
    .select("*")
    .order("block_number", { ascending: false })
    .limit(limit);
  if (error || !data) return null;
  return data.map(mapBurn);
}

export interface IndexedState {
  totalFees: bigint | null;
  totalBurned: bigint | null;
  totalSwaps: number | null;
  lastBlock: bigint | null;
  updatedAt: number | null;
}

export async function fetchIndexedState(): Promise<IndexerResult<IndexedState>> {
  const db = getSupabase();
  if (!db) return null;
  const { data, error } = await db
    .from("showtime_state")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error || !data) return null;
  const row = data as ShowtimeStateRow;
  return {
    totalFees: row.total_fees !== null ? BigInt(row.total_fees) : null,
    totalBurned: row.total_burned !== null ? BigInt(row.total_burned) : null,
    totalSwaps: row.total_swaps,
    lastBlock: row.last_block !== null ? BigInt(row.last_block) : null,
    updatedAt: toSeconds(row.updated_at),
  };
}

/* -------------------------------------------------------------------------- */
/*  Realtime                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Subscribes to inserts on the indexer tables. Returns an unsubscribe function,
 * or a no-op when Supabase is unconfigured.
 */
export function subscribeToShow(onChange: (table: string) => void): () => void {
  const db = getSupabase();
  if (!db) return () => {};

  const channel = db
    .channel("showtime-live")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "showtime_events" },
      () => onChange("showtime_events"),
    )
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "showtime_fees" },
      () => onChange("showtime_fees"),
    )
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "showtime_burns" },
      () => onChange("showtime_burns"),
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "showtime_state" },
      () => onChange("showtime_state"),
    )
    .subscribe();

  return () => {
    void db.removeChannel(channel);
  };
}
