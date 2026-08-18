# SHOWTIME

**THE SHOW NEVER STOPS.**
A programmable Uniswap V4 Hook experiment. Ethereum Mainnet only.

The pool is the Big Top. The Hook is the Ringmaster. Every trade is a ticket,
fees are the show revenue, and the burn is the final act. Then the curtain opens
again.

---

## Contents

1. [Installation](#1-installation)
2. [Environment variables](#2-environment-variables)
3. [Ethereum Mainnet configuration](#3-ethereum-mainnet-configuration)
4. [Alchemy setup](#4-alchemy-setup)
5. [Supabase setup](#5-supabase-setup)
6. [Contract configuration](#6-contract-configuration)
7. [ABI configuration](#7-abi-configuration)
8. [Wallet setup](#8-wallet-setup)
9. [Event indexing](#9-event-indexing)
10. [Fee tracking](#10-fee-tracking)
11. [Burn tracking](#11-burn-tracking)
12. [Deployment](#12-deployment)
13. [Demo mode](#13-demo-mode)
14. [Project structure](#14-project-structure)
15. [Design system](#15-design-system)
16. [The honesty rule](#16-the-honesty-rule)

---

## 1. Installation

Requirements: **Node 20.9+**, npm 10+.

```bash
npm install
cp .env.example .env.local     # then fill it in — see §2
npm run dev                    # http://localhost:3000
```

Other scripts:

```bash
npm run build   # production build (Turbopack)
npm run start   # serve the production build
```

The app builds and runs with **no environment variables at all**. Every data
surface then renders an explicit `NOT CONFIGURED` state. That is the intended
pre-deployment experience — you can design, review and ship the site before the
contracts exist, without a single fabricated number on screen.

---

## 2. Environment variables

All configuration lives in `src/config/project.ts`. It is the only module that
reads `process.env`; everything else imports from it. Full annotated list in
[`.env.example`](./.env.example).

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_CHAIN_ID` | — | `1`. Only overridden for a local mainnet fork. |
| `NEXT_PUBLIC_CHAIN_NAME` | — | Label shown in the header and footer. |
| `NEXT_PUBLIC_EXPLORER_URL` | — | Defaults to `https://etherscan.io`. |
| `NEXT_PUBLIC_RPC_URL` | recommended | Full RPC endpoint. |
| `NEXT_PUBLIC_ALCHEMY_API_KEY` | recommended | Derives the RPC URL if the above is blank; also powers transfer history. |
| `NEXT_PUBLIC_TOKEN_ADDRESS` | yes | `$SHOWTIME` ERC-20. |
| `NEXT_PUBLIC_HOOK_ADDRESS` | yes | The Hook contract. |
| `NEXT_PUBLIC_POOL_MANAGER_ADDRESS` | yes | Uniswap V4 PoolManager. |
| `NEXT_PUBLIC_POOL_ID` | optional | `bytes32` pool id, shown on the Live Show board. |
| `NEXT_PUBLIC_TOKEN_SYMBOL` / `_NAME` / `_DECIMALS` | optional | Labels and pre-contract fallbacks. |
| `NEXT_PUBLIC_POOL_FEE` / `_TICK_SPACING` | optional | Displayed pool parameters. |
| `NEXT_PUBLIC_FEE_DESCRIPTION` | optional | One sentence on fee routing. Blank ⇒ `NOT CONFIGURED`. |
| `NEXT_PUBLIC_BURN_DESCRIPTION` | optional | One sentence on the burn mechanism. Blank ⇒ a neutral placeholder. |
| `NEXT_PUBLIC_DEPLOYMENT_BLOCK` | optional | Lower bound for log queries. |
| `NEXT_PUBLIC_MAX_LOOKBACK_BLOCKS` | optional | Client-side scan window. Default `50000`. |
| `NEXT_PUBLIC_SUPABASE_URL` / `_ANON_KEY` | optional | Indexer cache. |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | optional | Adds WalletConnect to the box office. |
| `NEXT_PUBLIC_DEMO_MODE` | — | `false` in production. See §13. |
| `NEXT_PUBLIC_SOCIAL_*` | optional | Footer links; unset links don't render. |

Addresses are validated (`0x` + 40 hex, zero address rejected). An invalid value
is treated as absent rather than passed to a contract call.

---

## 3. Ethereum Mainnet configuration

SHOWTIME runs on Ethereum Mainnet and nowhere else. This is enforced, not just
stated:

- `src/lib/web3/config.ts` builds wagmi with `chains: [mainnet]` — a single
  entry. There is no chain array to extend and no selector component.
- `useNetworkGuard` compares the connected wallet's chain to `mainnet.id`. On a
  mismatch, a sticky **WRONG NETWORK · SWITCH TO ETHEREUM MAINNET** bar appears
  with exactly one target.
- Every contract read passes `chainId: CHAIN_ID` explicitly.
- The header shows a live `● ETHEREUM MAINNET` chip.

To add another chain you would have to change the wagmi config, the guard and
the config module — which is the point.

---

## 4. Alchemy setup

1. Create an app on [alchemy.com](https://alchemy.com) for **Ethereum Mainnet**.
2. Put the key in `NEXT_PUBLIC_ALCHEMY_API_KEY`.

The RPC URL is derived automatically as
`https://eth-mainnet.g.alchemy.com/v2/<key>` unless `NEXT_PUBLIC_RPC_URL` is set.

Alchemy is used for:

- `getTokenBalances` — wallet balance fallback
- `getAssetTransfers` — wallet transfer history and burn-sink transfers
- `getBlockNumber` — the Live Show block height

All of it goes through TanStack Query with a 30s stale time and a 60s refetch
interval, so an idle tab does not burn your compute units. `getAlchemy()`
returns `null` when unconfigured and every caller handles that by returning
`null` — never `0`.

> Note the trade-off: `NEXT_PUBLIC_` variables are visible in the browser
> bundle. Restrict the key by domain in the Alchemy dashboard, or proxy it
> through a route handler if you need it hidden.

---

## 5. Supabase setup

Supabase is an **optional cache**. The chain is always the source of truth. With
Supabase absent the site shows `INDEXER OFFLINE` and keeps every chain-derived
figure working.

1. Create a project.
2. Run the schema:

   ```bash
   supabase db execute --file supabase/schema.sql
   # or paste it into the SQL editor
   ```

3. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

The schema creates four tables:

| Table | Holds |
| --- | --- |
| `showtime_events` | Every normalised event (swap, fee, burn, transfer, hook) |
| `showtime_fees` | Fee events with amounts |
| `showtime_burns` | Burn events with amounts |
| `showtime_state` | Single-row rollup: totals, last block |

Row Level Security is on with public **read** policies. The site only ever
reads, using the anon key. Your indexer writes with the service-role key, which
bypasses RLS — never ship the service-role key to the browser.

Realtime is enabled on all four tables; `subscribeToShow()` invalidates the
React Query cache on insert, so the Live Show board updates without polling.

---

## 6. Contract configuration

Set the three addresses in `.env.local`:

```bash
NEXT_PUBLIC_TOKEN_ADDRESS=0x…
NEXT_PUBLIC_HOOK_ADDRESS=0x…
NEXT_PUBLIC_POOL_MANAGER_ADDRESS=0x…
```

They appear in the Contract section, the Live Show board, the footer and the
docs page — each with copy and Etherscan buttons. **No address is ever hardcoded
in a component.** An unset address renders `CONTRACT UNAVAILABLE — NOT
CONFIGURED`.

The Hook's V4 permission bits are decoded from its address (Uniswap V4 encodes
which callbacks the PoolManager may invoke in the low bits of the deployed
address). That is a protocol-level fact derived from the address itself — it
says nothing about what SHOWTIME's logic does inside those callbacks.

---

## 7. ABI configuration

### Hook ABI — ships empty, on purpose

`src/lib/contracts/hookAbi.ts` exports `deployedHookAbi: Abi = []`.

While it is empty:

- every Hook surface renders **HOOK ABI NOT CONFIGURED**
- no Hook function is called
- no callback, permission, event or fee route is described anywhere

To install the real one:

1. Copy the ABI array from Etherscan, or from
   `out/ShowtimeHook.sol/ShowtimeHook.json` (Foundry) /
   `artifacts/…` (Hardhat).
2. Paste it into `deployedHookAbi`.
3. Nothing else to toggle — `HOOK_ABI_CONFIGURED` is derived from array length.

Act 03 then lists what the contract *actually* implements, grouped by
`describeHookAbi()` into V4 lifecycle callbacks, reads, writes and events. The
`V4_CALLBACK_NAMES` list is used **only to classify entries already present in
your ABI** — it never adds one.

### Token ABI — standard interface only

`src/lib/contracts/tokenAbi.ts` contains the EIP-20 standard interface: safe to
assume of any ERC-20, and nothing more. No taxes, reflections, owner controls or
buyback triggers, because those are only real if they are in the artifact.

To install the verified ABI: replace `deployedTokenAbi` and set
`TOKEN_ABI_IS_DEPLOYED_ARTIFACT = true`. The Contract section's ABI status panel
reflects this — `Standard ERC-20 only` vs `Deployed artifact`.

### PoolManager ABI

`poolManagerAbi.ts` carries canonical `IPoolManager` fragments (`Swap`,
`ModifyLiquidity`, `Initialize`, `extsload`) from v4-core, for decoding logs.
Protocol-level, not SHOWTIME-specific.

---

## 8. Wallet setup

Built on **wagmi v2 + viem v2**. Connectors, in order:

1. **Injected** (MetaMask, Rabby, Brave…) — always available
2. **Coinbase Wallet** — always available
3. **WalletConnect** — added only when `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` is
   set (get one at [cloud.reown.com](https://cloud.reown.com))

SSR is handled with `ssr: true` + `cookieStorage`, and `ConnectButton` renders a
neutral disabled state until mount so the server and client markup match.

The wallet is used for reads only. Nothing on this site asks for a signature to
display information. Holder actions in **Your Ticket** are generated from the
Hook ABI's write functions — with no ABI installed, no buttons are rendered, and
`CLAIMABLE` reads `NO CLAIM FUNCTION IN HOOK ABI` rather than `0`.

---

## 9. Event indexing

The site reads an index; it does not build one. Write a small worker that
follows Mainnet and inserts into the Supabase tables. Sketch:

```ts
import { createPublicClient, http, parseAbiItem } from "viem";
import { mainnet } from "viem/chains";
import { createClient } from "@supabase/supabase-js";

const chain = createPublicClient({ chain: mainnet, transport: http(RPC_URL) });
const db = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const swapEvent = parseAbiItem(
  "event Swap(bytes32 indexed id, address indexed sender, int128 amount0, int128 amount1, uint160 sqrtPriceX96, uint128 liquidity, int24 tick, uint24 fee)"
);

const logs = await chain.getLogs({
  address: POOL_MANAGER_ADDRESS,
  event: swapEvent,
  args: { id: POOL_ID },
  fromBlock,
  toBlock,
});

await db.from("showtime_events").upsert(
  logs.map((log) => ({
    event_type: "swap",
    address: log.args.sender,
    block_number: Number(log.blockNumber),
    tx_hash: log.transactionHash,
    log_index: log.logIndex,
  })),
  { onConflict: "tx_hash,log_index" }
);
```

Notes:

- Every table has a `unique (tx_hash, log_index)` constraint — upsert on it and
  re-runs are idempotent.
- Keep `showtime_state` updated with running totals and `last_block`; the Live
  Show board reads that single row rather than aggregating client-side.
- Respect reorgs: index a few blocks behind head, or delete rows above the
  reorg point before re-inserting.
- `amount` columns are `numeric(78,0)` so a full `uint256` fits. Insert the raw
  integer as a string; the client converts to `bigint`.

---

## 10. Fee tracking

Fee events populate `showtime_fees` and drive Act 05 (**Show Revenue**):
`TOTAL FEES`, `LAST PERFORMANCE`, `LAST FEE EVENT`, plus a ledger of recent
events linking to Etherscan.

Which log is a "fee event" depends on your Hook — that is exactly why this file
does not tell you. Once the Hook ABI is installed, Act 03 lists its real events
and you can point the indexer at the right one.

`FEE FLOW` is prose from `NEXT_PUBLIC_FEE_DESCRIPTION`. Blank ⇒ `NOT
CONFIGURED`. Do not write a description you cannot defend against the verified
source.

---

## 11. Burn tracking

Burns are read two ways, in this order:

1. **Indexer** — `showtime_burns`, if Supabase has rows.
2. **Chain, via Alchemy** — `getAssetTransfers` into the standard sinks
   (`0x0000…0000` and `0x0000…dEaD`).

Total burned prefers a direct contract read: the sum of `balanceOf()` at each
burn sink, which is a fact about the token rather than a reconstruction from
history. That number feeds the Final Act, the Tokenomics supply bar and the
Live Show board.

If neither source is available, the burn figures stay empty — they never fall
back to `0`.

---

## 12. Deployment

Any Node host or Vercel. There are no server-side secrets: everything is
`NEXT_PUBLIC_`.

```bash
npm run build
npm run start
```

Checklist:

- [ ] Set every variable from §2 in the host's environment
- [ ] `NEXT_PUBLIC_DEMO_MODE=false`
- [ ] Restrict the Alchemy key to your domain
- [ ] Confirm the Supabase anon key is the **anon** key, never service-role
- [ ] Run the schema against the production Supabase project
- [ ] Update `metadataBase` in `src/app/layout.tsx` to your real origin
- [ ] Replace `public/images/showtime-marquee.webp` if you want a different OG
      card (the shipped one is a render of the hero at 1200×630)

---

## 13. Demo mode

```bash
NEXT_PUBLIC_DEMO_MODE=true
```

When on:

- A permanent striped banner reads **DEMO SHOW — SAMPLE VALUES, NOT LIVE
  ETHEREUM MAINNET DATA**
- Every figure carries a red `DEMO SHOW` source tag
- Live queries are disabled entirely so nothing real is mixed in

The mechanism is structural, not cosmetic. Every number on the site travels as a
`Metric<T>` carrying `{ status, value, source }`, and `MetricValue` is the only
component that renders one. There is no code path that prints a demo value
without the `demo` source attached.

Never ship `true`.

---

## 14. Project structure

```
src/
  app/
    layout.tsx           root layout, fonts, SEO, providers
    page.tsx             the running order (all acts)
    providers.tsx        wagmi + React Query + MUI theme
    globals.css          palette, type scale, canonical keyframes
    status.module.css    shared staging for 404 / error / loading
    error.tsx            SHOW INTERRUPTED
    not-found.tsx        404 — no such performance
    loading.tsx          the house lights coming up
    docs/                the programme
    holders/             ticket holders
  components/
    Hero/                the giant marquee, CTAs, slogan ribbon
    Marquee/             MarqueeWord — the SHOWTIME sign
    CircusStage/         StageAtmosphere (fixed venue), BigTopBackdrop
    Curtain/             Curtains (reusable drapes), CurtainAct (Act 07)
    Show/                Act 01 + TicketStream
    Ringmaster/          Act 02
    Programmable/        Act 03 — reads the Hook ABI
    BigTop/              Act 04
    HookExplainer/       Why a Hook?
    Revenue/             Act 05
    FinalAct/            Act 06 — the burn
    Tokenomics/          The Cast
    LiveShow/            the stage manager's board
    Wallet/              ConnectButton, WalletTicket
    Contract/            addresses + ABI status
    Navigation/  Footer/
    System/              Notice, DemoBanner, NetworkGuard
    ui/                  Section, TheatrePanel, TicketButton,
                         MetricValue, FlowDiagram, AddressRow
  config/
    project.ts           every env var, once
    images.ts            local image manifest
  lib/
    contracts/           tokenAbi, hookAbi, poolManagerAbi
    alchemy/             client + queries
    supabase/            client, typed queries, realtime
    web3/                wagmi config, viem client, formatters
    demo.ts              DEMO SHOW fixtures
  hooks/                 useShowtime, useHook, useFees, useBurns,
                         useToken, useTokenBalance, useEvents,
                         useNetworkGuard, useReveal, useCopy
  types/                 showtime, events, fees, token
  fonts/                 self-hosted variable WOFF2 + README
supabase/schema.sql      indexer schema, RLS, realtime
public/images/           local artwork (no external URLs)
```

---

## 15. Design system

**Stack:** Next.js 16 (App Router, Turbopack) · React 19 · TypeScript ·
CSS Modules · MUI (behaviour only) · wagmi · viem · TanStack Query · Supabase ·
Alchemy · Framer Motion · Lucide. **No Tailwind.**

**Palette** — red, gold, black, nothing else:

| Token | Value |
| --- | --- |
| `--black` | `#050505` |
| `--black-2` | `#12090A` |
| `--curtain` | `#6E0E12` |
| `--red` | `#A3161C` |
| `--gold` | `#D6A84A` |
| `--bulb` | `#FFD76A` |
| `--cream` | `#F4E7C5` |

**Type** — Cinzel (display/marquee), Playfair Display italic (statements), Inter
(UI), JetBrains Mono (addresses, hashes, machine states). All four are
self-hosted variable WOFF2 under `src/fonts` — see `src/fonts/README.md`. No
Google Fonts request at build or runtime.

**The marquee.** `MarqueeWord` renders each character as a plaque: a velvet
backing, an extruded body, a gradient-filled face with a gold stroke, a raked
specular highlight, and two interleaved banks of bulbs. The banks alternate on a
`steps(1)` timeline to produce a real chase circuit, with a rare flicker on two
plaques. Screen readers get the plain word once; the plaques are `aria-hidden`.

**No generic Web3 cards.** Panels are poster plates with cut corners and brass
rules (`TheatrePanel`). Buttons are ticket stubs with notched corners and a bulb
rail that brightens on hover (`TicketButton`). Flows are billed running orders
with travelling cue lights (`FlowDiagram`).

**Motion.** Marquee bulbs, sweeping spotlights, breathing curtains, drifting
tickets, drifting haze, cue lights, the Final Act sequence, and Act 07's
close→question→open→answer beat. Everything collapses under
`prefers-reduced-motion: reduce`.

> **CSS Modules and keyframes.** CSS Modules scopes every animation name it
> sees, so a module *cannot* reference a `@keyframes` declared in `globals.css`
> — the reference gets renamed and silently resolves to nothing (elements with
> `opacity: 0` simply never appear). Shared keyframes are therefore duplicated
> into each module that uses them, each marked with a pointer back to the
> canonical block in `globals.css`. Change one, change the mirrors.

---

## 16. The honesty rule

The single rule the whole codebase is built around: **never show a number the
site cannot source.**

It is enforced by types, not by discipline:

```ts
interface Metric<T> {
  status: "idle" | "loading" | "ready" | "unavailable" | "not-configured" | "error";
  value: T | null;
  source: "chain" | "indexer" | "demo" | null;
}
```

Every figure is a `Metric<T>`. `MetricValue` is the only component that renders
one, and it can only print a value that arrived with a status of `ready` and a
`source`. Everything else becomes a stated absence:

`SHOW INTERRUPTED` · `WRONG NETWORK` · `HOOK UNAVAILABLE` ·
`CONTRACT UNAVAILABLE` · `ABI NOT CONFIGURED` · `INDEXER OFFLINE` ·
`DATA UNAVAILABLE` · `NOT CONFIGURED`

Consequences you will notice:

- The Hook ABI ships empty and no Hook behaviour is described until you install
  the artifact.
- The token ABI is the ERC-20 standard interface and nothing more.
- `CLAIMABLE` says `NO CLAIM FUNCTION IN HOOK ABI` instead of `0`.
- Holder counts are absent, because they cannot be derived honestly from an
  ERC-20 without a full transfer index.
- Fee routing and burn behaviour are prose you supply, or `NOT CONFIGURED`.

A missing number is a smaller problem than a wrong one.

---

**SHOWTIME** — THE SHOW NEVER STOPS.
A programmable Uniswap V4 Hook · Ethereum Mainnet
