/**
 * Types mirroring `supabase/schema.sql`.
 * Keep both files in sync when you change the indexer schema.
 */

export interface ShowtimeEventsRow {
  id: string;
  event_type: string;
  address: string | null;
  amount: string | null;
  block_number: number;
  tx_hash: string;
  timestamp: string | null;
  created_at: string;
}

export interface ShowtimeFeesRow {
  id: string;
  amount: string;
  block_number: number;
  tx_hash: string;
  timestamp: string | null;
}

export interface ShowtimeBurnsRow {
  id: string;
  amount: string;
  block_number: number;
  tx_hash: string;
  timestamp: string | null;
}

export interface ShowtimeStateRow {
  id: string;
  total_fees: string | null;
  total_burned: string | null;
  total_swaps: number | null;
  last_block: number | null;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      showtime_events: {
        Row: ShowtimeEventsRow;
        Insert: Partial<ShowtimeEventsRow> & { event_type: string; tx_hash: string; block_number: number };
        Update: Partial<ShowtimeEventsRow>;
      };
      showtime_fees: {
        Row: ShowtimeFeesRow;
        Insert: Partial<ShowtimeFeesRow> & { amount: string; tx_hash: string; block_number: number };
        Update: Partial<ShowtimeFeesRow>;
      };
      showtime_burns: {
        Row: ShowtimeBurnsRow;
        Insert: Partial<ShowtimeBurnsRow> & { amount: string; tx_hash: string; block_number: number };
        Update: Partial<ShowtimeBurnsRow>;
      };
      showtime_state: {
        Row: ShowtimeStateRow;
        Insert: Partial<ShowtimeStateRow> & { id: string };
        Update: Partial<ShowtimeStateRow>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
