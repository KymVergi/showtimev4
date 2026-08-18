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

function AddressCell({
  label,
  address,
}: {
  label: string;
  address: string | null;
}) {
  return (
    <div className={styles.addr}>
      <span className={styles.addrLabel}>{label}</span>
      {address ? (
        <a
          className={styles.addrValue}
          href={explorerAddress(address)}
          target="_blank"
          rel="noopener noreferrer"
        >
          {shortAddress(address, 6)} ↗
        </a>
      ) : (
        <span className={styles.addrMissing}>NOT CONFIGURED</span>
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
          <AddressCell label="Pool" address={POOL_ID ?? POOL_MANAGER_ADDRESS} />
          <AddressCell label="Hook" address={HOOK_ADDRESS} />
          <AddressCell label="Token" address={TOKEN_ADDRESS} />
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
