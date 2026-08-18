"use client";

import styles from "./Revenue.module.css";
import { Section } from "@/components/ui/Section";
import { FlowDiagram } from "@/components/ui/FlowDiagram";
import { MetricValue } from "@/components/ui/MetricValue";
import { TheatrePanel } from "@/components/ui/TheatrePanel";
import { Notice } from "@/components/System/Notice";
import { useFees } from "@/hooks/useFees";
import { explorerTx, feeConfig } from "@/config/project";
import { formatEth, formatPoolFee, shortHash, timeAgo } from "@/lib/web3/format";
import type { FeeEvent } from "@/types/fees";

function describeFee(event: FeeEvent): string {
  const amount = formatEth(event.amount, 5);
  return amount ? `${amount} ETH` : "—";
}

/**
 * ACT 05 — SHOW REVENUE.
 * Ticket sales become revenue, revenue meets programmable logic. The numbers
 * come from the indexer; the routing description comes from configuration and
 * says "not configured" when nobody has documented it.
 */
export function Revenue() {
  const fees = useFees(10);

  return (
    <Section
      id="show-revenue"
      act="ACT 05"
      eyebrow="The receipts"
      title="Show Revenue"
      statement="THE HOUSE COUNTS EVERY TICKET."
    >
      <div className={styles.top}>
        <div className={styles.copy}>
          <p className="prose">
            Trading against the pool produces fees. Those fees are the
            night&apos;s takings — the revenue that the protocol&apos;s configured
            mechanism then acts upon.
          </p>
          <p className="prose">
            Where that revenue goes is decided by the deployed contract, not by
            this page. The routing described below is read from configuration; if
            it has not been documented, the site says so rather than guessing.
          </p>
        </div>

        <div className={styles.till}>
          <FlowDiagram
            caption="Ticket sales become revenue, which meets programmable logic"
            steps={[
              { label: "Ticket sales", note: "swaps against the pool" },
              { label: "Revenue", note: "fees collected" },
              { label: "Programmable logic", note: "the Hook decides", accent: true },
            ]}
          />
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.cell}>
          <MetricValue
            label="Total fees"
            metric={fees.totalFees}
            format={(v) => formatEth(v, 5)}
            suffix="ETH"
            showSource
          />
        </div>

        <div className={styles.cell}>
          <MetricValue
            label="Last performance"
            metric={fees.lastPerformance}
            format={(v) => `${describeFee(v)} · ${timeAgo(v.timestamp) ?? `block ${v.blockNumber}`}`}
            mono
            emptyLabel="NO PRIOR PERFORMANCE RECORDED"
            showSource
          />
        </div>

        <div className={styles.cell}>
          <MetricValue
            label="Last fee event"
            metric={fees.lastFeeEvent}
            format={(v) => `${describeFee(v)} · ${timeAgo(v.timestamp) ?? `block ${v.blockNumber}`}`}
            mono
            emptyLabel="NO FEE EVENTS INDEXED"
            showSource
          />
        </div>

        <div className={styles.cell}>
          <span className={styles.cellLabel}>Fee flow</span>
          {feeConfig.description ? (
            <p className={styles.feeFlow}>{feeConfig.description}</p>
          ) : (
            <p className={`${styles.feeFlow} ${styles.feeFlowEmpty}`}>
              NOT CONFIGURED
            </p>
          )}
          {feeConfig.poolFee && (
            <p className={`${styles.feeFlow} ${styles.feeFlowSub}`}>
              POOL FEE · {formatPoolFee(feeConfig.poolFee) ?? "—"}
              {feeConfig.tickSpacing ? ` · TICK SPACING ${feeConfig.tickSpacing}` : ""}
            </p>
          )}
        </div>
      </div>

      {fees.recent.length > 0 && (
        <div className={styles.ledger}>
          <TheatrePanel label="Recent fee events">
            {fees.recent.map((event) => (
              <div key={event.id} className={styles.row}>
                <span className={styles.rowAmount}>{describeFee(event)}</span>
                <span className={styles.rowBlock}>
                  block {event.blockNumber.toString()}
                  {event.timestamp ? ` · ${timeAgo(event.timestamp)}` : ""}
                </span>
                <a
                  className={styles.rowLink}
                  href={explorerTx(event.txHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {shortHash(event.txHash)} ↗
                </a>
              </div>
            ))}
          </TheatrePanel>
        </div>
      )}

      {fees.indexerOffline && (
        <div className={styles.notice}>
          <Notice title="Indexer offline">
            Fee history is served by the Supabase indexer described in
            <span className="mono"> supabase/schema.sql</span>. Configure
            NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, then run
            your indexer to populate <span className="mono">showtime_fees</span>.
          </Notice>
        </div>
      )}
    </Section>
  );
}

export default Revenue;
