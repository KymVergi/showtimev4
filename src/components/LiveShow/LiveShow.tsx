"use client";

import styles from "./LiveShow.module.css";
import { Section } from "@/components/ui/Section";
import { MetricValue } from "@/components/ui/MetricValue";
import { Notice } from "@/components/System/Notice";
import { useShowtime } from "@/hooks/useShowtime";
import { useEvents } from "@/hooks/useEvents";
import { useToken } from "@/hooks/useToken";
import {
  CHAIN_NAME,
  HOOK_ADDRESS,
  POOL_MANAGER_ADDRESS,
  POOL_ID,
  TOKEN_ADDRESS,
  explorerAddress,
} from "@/config/project";
import { formatCompact, formatEth, formatInteger, shortAddress, timeAgo } from "@/lib/web3/format";
import { metric, UNAVAILABLE, type Metric } from "@/types/showtime";

/**
 * One cell of the board.
 *
 * `href` is optional on purpose: a Uniswap V4 pool id is a bytes32, not an
 * address, so there is no explorer page to send anyone to. Linking it to
 * /address/0x<64 hex> would produce a dead link that looks alive.
 */
function BoardCell({
  label,
  value,
  href,
  title,
}: {
  label: string;
  value: string | null;
  href?: string | null;
  title?: string;
}) {
  return (
    <div className={styles.addr}>
      <span className={styles.addrLabel}>{label}</span>
      {value === null ? (
        <span className={styles.addrMissing}>NOT CONFIGURED</span>
      ) : href ? (
        <a
          className={styles.addrValue}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          title={title ?? value}
        >
          {shortAddress(value, 6)} ↗
        </a>
      ) : (
        <span className={styles.addrValue} title={title ?? value}>
          {shortAddress(value, 6)}
        </span>
      )}
    </div>
  );
}

/**
 * LIVE SHOW — the compact board. Addresses, five figures, last event, last
 * block. Anything the site cannot see stays visibly empty.
 */
export function LiveShow() {
  const show = useShowtime();
  const events = useEvents(1);
  const token = useToken();

  const latest = events.events[0] ?? null;

  const lastEvent: Metric<string> = latest
    ? metric(
        `${(latest.name ?? latest.eventType).toUpperCase()} · ${
          timeAgo(latest.timestamp) ?? `block ${latest.blockNumber}`
        }`,
        events.demo ? "demo" : "indexer",
      )
    : events.indexerOffline
      ? UNAVAILABLE
      : UNAVAILABLE;

  const isLive = show.lastBlock.status === "ready";

  return (
    <Section
      id="live-show"
      act="THE BOARD"
      eyebrow="Front of house"
      title="Live Show"
    >
      <div className={styles.board}>
        <div className={styles.head}>
          <span className={styles.venue}>{CHAIN_NAME}</span>
          <span className={styles.live}>
            <span
              className={`${styles.liveDot} ${isLive ? "" : styles.liveDotIdle}`}
              aria-hidden="true"
            />
            {isLive ? "Live" : "Standing by"}
          </span>
        </div>

        <div className={styles.addresses}>
          {/* A V4 pool lives inside the singleton PoolManager and is identified
              by a bytes32 id, so the id is shown as an id and the manager is
              shown as the address you can actually go and read. */}
          {POOL_ID ? (
            <BoardCell label="Pool ID" value={POOL_ID} title={POOL_ID} />
          ) : (
            <BoardCell
              label="Pool manager"
              value={POOL_MANAGER_ADDRESS}
              href={POOL_MANAGER_ADDRESS ? explorerAddress(POOL_MANAGER_ADDRESS) : null}
            />
          )}
          <BoardCell
            label="Hook"
            value={HOOK_ADDRESS}
            href={HOOK_ADDRESS ? explorerAddress(HOOK_ADDRESS) : null}
          />
          <BoardCell
            label="Token"
            value={TOKEN_ADDRESS}
            href={TOKEN_ADDRESS ? explorerAddress(TOKEN_ADDRESS) : null}
          />
        </div>

        <div className={styles.figures}>
          <div className={styles.figure}>
            <MetricValue
              label="Total swaps"
              metric={show.totalSwaps}
              format={(v) => formatInteger(v)}
            />
          </div>
          <div className={styles.figure}>
            <MetricValue
              label="Total fees"
              metric={show.totalFeesWei}
              format={(v) => formatEth(v, 4)}
              suffix="ETH"
            />
          </div>
          <div className={styles.figure}>
            <MetricValue
              label="Total burned"
              metric={token.burned}
              format={(v) => formatCompact(v, token.meta.decimals)}
            />
          </div>
          <div className={styles.figure}>
            <MetricValue
              label="Last event"
              metric={lastEvent}
              format={(v) => v}
              mono
              emptyLabel="NO EVENTS INDEXED"
            />
          </div>
          <div className={styles.figure}>
            <MetricValue
              label="Last block"
              metric={show.lastBlock}
              format={(v) => formatInteger(v)}
              mono
            />
          </div>
        </div>

        <div className={styles.footer}>
          <span>SOURCE · CHAIN FIRST, INDEXER SECOND, NOTHING INVENTED</span>
          <span>{CHAIN_NAME.toUpperCase()} ONLY</span>
        </div>
      </div>

      {events.indexerOffline && !events.demo && (
        <div className={styles.notice}>
          <Notice title="Indexer offline" tone="calm">
            Event history comes from Supabase. Chain-derived figures (block
            height, token supply, burn balances) continue to work without it.
          </Notice>
        </div>
      )}
    </Section>
  );
}

export default LiveShow;
