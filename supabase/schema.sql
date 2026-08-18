-- ============================================================================
-- SHOWTIME — Supabase indexer schema
-- ============================================================================
-- The blockchain is the source of truth. These tables are a read cache so the
-- site can render the Live Show without hammering RPC. Every column that can
-- legitimately be unknown is nullable, so the UI can render "DATA UNAVAILABLE"
-- instead of a fabricated zero.
--
-- Run with:  supabase db execute --file supabase/schema.sql
--        or: paste into the Supabase SQL editor.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- showtime_events — every normalised on-chain event (the ticket stubs)
-- ---------------------------------------------------------------------------
create table if not exists public.showtime_events (
  id            uuid primary key default gen_random_uuid(),
  event_type    text        not null check (
                  event_type in ('swap','fee','burn','transfer','hook','unknown')
                ),
  address       text,
  amount        numeric(78, 0),          -- uint256 fits in numeric(78,0)
  block_number  bigint      not null,
  tx_hash       text        not null,
  log_index     integer,
  timestamp     timestamptz,
  created_at    timestamptz not null default now(),
  unique (tx_hash, log_index)
);

create index if not exists showtime_events_block_idx
  on public.showtime_events (block_number desc);
create index if not exists showtime_events_type_idx
  on public.showtime_events (event_type, block_number desc);
create index if not exists showtime_events_address_idx
  on public.showtime_events (address);

-- ---------------------------------------------------------------------------
-- showtime_fees — show revenue events
-- ---------------------------------------------------------------------------
create table if not exists public.showtime_fees (
  id            uuid primary key default gen_random_uuid(),
  amount        numeric(78, 0) not null,
  block_number  bigint         not null,
  tx_hash       text           not null,
  log_index     integer,
  timestamp     timestamptz,
  created_at    timestamptz    not null default now(),
  unique (tx_hash, log_index)
);

create index if not exists showtime_fees_block_idx
  on public.showtime_fees (block_number desc);

-- ---------------------------------------------------------------------------
-- showtime_burns — the final act
-- ---------------------------------------------------------------------------
create table if not exists public.showtime_burns (
  id            uuid primary key default gen_random_uuid(),
  amount        numeric(78, 0) not null,
  block_number  bigint         not null,
  tx_hash       text           not null,
  log_index     integer,
  timestamp     timestamptz,
  created_at    timestamptz    not null default now(),
  unique (tx_hash, log_index)
);

create index if not exists showtime_burns_block_idx
  on public.showtime_burns (block_number desc);

-- ---------------------------------------------------------------------------
-- showtime_state — single-row rollup for the Live Show panel
-- ---------------------------------------------------------------------------
create table if not exists public.showtime_state (
  id            text primary key default 'singleton',
  total_fees    numeric(78, 0),
  total_burned  numeric(78, 0),
  total_swaps   bigint,
  last_block    bigint,
  updated_at    timestamptz not null default now()
);

insert into public.showtime_state (id) values ('singleton')
  on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Row level security — the site reads with the anon key and never writes.
-- Your indexer writes with the service-role key, which bypasses RLS.
-- ---------------------------------------------------------------------------
alter table public.showtime_events enable row level security;
alter table public.showtime_fees   enable row level security;
alter table public.showtime_burns  enable row level security;
alter table public.showtime_state  enable row level security;

drop policy if exists "public read events" on public.showtime_events;
create policy "public read events"
  on public.showtime_events for select using (true);

drop policy if exists "public read fees" on public.showtime_fees;
create policy "public read fees"
  on public.showtime_fees for select using (true);

drop policy if exists "public read burns" on public.showtime_burns;
create policy "public read burns"
  on public.showtime_burns for select using (true);

drop policy if exists "public read state" on public.showtime_state;
create policy "public read state"
  on public.showtime_state for select using (true);

-- ---------------------------------------------------------------------------
-- Realtime — used by the Live Show panel
-- ---------------------------------------------------------------------------
alter publication supabase_realtime add table public.showtime_events;
alter publication supabase_realtime add table public.showtime_fees;
alter publication supabase_realtime add table public.showtime_burns;
alter publication supabase_realtime add table public.showtime_state;
