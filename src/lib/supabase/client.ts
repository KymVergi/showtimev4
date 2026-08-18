import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/config/project";
import type { Database } from "./types";

let supabase: SupabaseClient<Database> | undefined;

/**
 * Optional indexing / cache layer.
 *
 * Supabase is never the source of truth — the chain is. When it is not
 * configured or unreachable, the UI renders "INDEXER OFFLINE" and falls back to
 * direct RPC reads.
 */
export function getSupabase(): SupabaseClient<Database> | null {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  if (!supabase) {
    supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false },
      realtime: { params: { eventsPerSecond: 2 } },
    });
  }
  return supabase;
}

export const SUPABASE_CONFIGURED = SUPABASE_URL !== null && SUPABASE_ANON_KEY !== null;
