"use client";

import styles from "./page.module.css";
import { TheatrePanel } from "@/components/ui/TheatrePanel";
import { MetricValue } from "@/components/ui/MetricValue";
import { Notice } from "@/components/System/Notice";
import { WalletTicket } from "@/components/Wallet/WalletTicket";
import { useEvents } from "@/hooks/useEvents";
import { useToken } from "@/hooks/useToken";
import { useBurns } from "@/hooks/useBurns";
import { explorerTx, TOKEN_SYMBOL } from "@/config/project";
import { formatCompact, shortHash, timeAgo } from "@/lib/web3/format";

/**
 * /holders — the ticket holders' entrance.
 *
 * Your own position, plus the house ledger of recent activity. Everything is
 * read-only and sourced; nothing is aggregated into a "holder count", because
 * that number cannot be derived honestly from an ERC-20 without an indexer that
 * tracks every transfer.
 */
export default function HoldersPage() {
  const events = useEvents(20);
  const token = useToken();
  const burns = useBurns(10);

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <span className="eyebrow">Ticket holders</span>
        <h1 className="sectionTitle">Holders</h1>
        <p className="statement">EVERY STUB IS ON THE RECORD.</p>
      </header>

      <WalletTicket />

      <div className={`${styles.grid} ${styles.gridSpaced}`}>
        <TheatrePanel label="House ledger — recent activity" ornate>
          {events.events.length === 0 ? (
            <p className={styles.empty}>
              {events.indexerOffline
                ? "INDEXER OFFLINE — NO EVENT HISTORY AVAILABLE"
                : "NO EVENTS INDEXED YET"}
            </p>
          ) : (
            <div className={styles.rows}>
              {events.events.map((event) => (
                <div key={event.id} className={styles.row}>
                  <span className={styles.kind}>
                    <span
                      className={`${styles.dot} ${
                        event.eventType === "burn"
                          ? styles.dotBurn
                          : event.eventType === "fee"
                            ? styles.dotFee
                            : ""
                      }`}
                      aria-hidden="true"
                    />
                    {event.name ?? event.eventType}
                  </span>
                  <span className={styles.amount}>
                    {event.amount !== null
                      ? (formatCompact(event.amount, token.meta.decimals) ?? "—")
                      : "—"}
                  </span>
                  <a
                    className={styles.link}
                    href={explorerTx(event.txHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {shortHash(event.txHash)} ↗
                  </a>
                </div>
              ))}
            </div>
          )}
        </TheatrePanel>

        <div className={styles.stack}>
          <TheatrePanel label="Supply">
            <MetricValue
              label="Total supply"
              metric={token.totalSupply}
              format={(v) => formatCompact(v, token.meta.decimals)}
              suffix={TOKEN_SYMBOL}
              showSource
            />
          </TheatrePanel>

          <TheatrePanel label="Final act">
            <MetricValue
              label="Total burned"
              metric={token.burned.status === "ready" ? token.burned : burns.totalBurned}
              format={(v) => formatCompact(v, token.meta.decimals)}
              suffix={TOKEN_SYMBOL}
              emptyLabel="NO BURNS OBSERVED"
              showSource
            />
            {burns.lastBurn.status === "ready" && burns.lastBurn.value && (
              <p className={styles.empty}>
                LAST · {timeAgo(burns.lastBurn.value.timestamp) ?? "—"}
              </p>
            )}
          </TheatrePanel>

          <Notice title="Holder counts are not shown" tone="calm">
            A trustworthy holder count needs a full transfer index. Rather than
            print an approximation, this page shows only what it can source
            directly.
          </Notice>
        </div>
      </div>
    </div>
  );
}
