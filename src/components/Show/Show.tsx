"use client";

import styles from "./Show.module.css";
import { Section } from "@/components/ui/Section";
import { FlowDiagram } from "@/components/ui/FlowDiagram";
import { MetricValue } from "@/components/ui/MetricValue";
import { Notice } from "@/components/System/Notice";
import { TicketStream } from "./TicketStream";
import { useShowtime } from "@/hooks/useShowtime";
import { formatEth, formatInteger } from "@/lib/web3/format";
import { brand } from "@/config/project";

/**
 * ACT 01 — THE SHOW.
 * Trade → ticket → show revenue, with the three numbers that describe the
 * house so far. Numbers appear only when the chain or indexer supplies them.
 */
export function Show() {
  const show = useShowtime();

  return (
    <Section
      id="the-show"
      act="ACT 01"
      eyebrow="The house is open"
      title="The Show"
      statement={brand.slogans.ticket}
    >
      <div className={styles.grid}>
        <div className={styles.copy}>
          <p className="prose">
            Every swap creates activity inside the pool. That activity generates
            fees. Those fees become the revenue that powers the show&apos;s
            mechanism.
          </p>
          <p className="prose">
            Nobody buys a seat at SHOWTIME. You trade, and the trade is the
            ticket — printed at the moment of the swap, torn at the door of the
            Big Top, and counted in the night&apos;s receipts.
          </p>

          <div className={styles.flowHolder}>
            <FlowDiagram
              caption="Trade becomes ticket becomes show revenue"
              steps={[
                { label: "Trade", note: "a swap in the pool" },
                { label: "Ticket", note: "one entry to the show" },
                { label: "Show revenue", note: "fees collected", accent: true },
              ]}
            />
          </div>
        </div>

        <div className={styles.theatre}>
          <TicketStream count={18} compact />
          <span className={styles.mouth} aria-hidden="true" />
          <span className={styles.arch} aria-hidden="true" />
          <span className={styles.mouthLabel}>THE BIG TOP</span>
        </div>
      </div>

      <div className={styles.metrics}>
        <div className={styles.metric}>
          <MetricValue
            label="Total swaps"
            metric={show.totalSwaps}
            format={(v) => formatInteger(v)}
            showSource
          />
        </div>
        <div className={styles.metric}>
          <MetricValue
            label="Total fees"
            metric={show.totalFeesWei}
            format={(v) => formatEth(v, 4)}
            suffix="ETH"
            showSource
          />
        </div>
        <div className={styles.metric}>
          <MetricValue
            label="ETH generated"
            metric={show.ethGeneratedWei}
            format={(v) => formatEth(v, 4)}
            suffix="ETH"
            showSource
          />
        </div>
      </div>

      {show.isUnconfigured && (
        <div className={styles.notice}>
          <Notice title="Data unavailable">
            No RPC, Alchemy key or Supabase project is configured yet, so the
            house has nothing to count. Set the environment variables in
            <span className="mono"> .env.local </span> and the numbers above will
            fill in from Ethereum Mainnet.
          </Notice>
        </div>
      )}

      {!show.isUnconfigured && show.indexerOffline && (
        <div className={styles.notice}>
          <Notice title="Indexer offline">
            Swap and fee totals are served by the Supabase indexer. Until it is
            configured and backfilled, these counters stay empty rather than
            showing an estimate.
          </Notice>
        </div>
      )}
    </Section>
  );
}

export default Show;
