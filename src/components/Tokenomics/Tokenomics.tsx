"use client";

import styles from "./Tokenomics.module.css";
import { Section } from "@/components/ui/Section";
import { MetricValue } from "@/components/ui/MetricValue";
import { AddressRow } from "@/components/ui/AddressRow";
import { Notice } from "@/components/System/Notice";
import { useToken } from "@/hooks/useToken";
import { useShowtime } from "@/hooks/useShowtime";
import { formatCompact, formatEth } from "@/lib/web3/format";
import { TOKEN_ADDRESS, TOKEN_SYMBOL } from "@/config/project";

/**
 * TOKENOMICS — billed as THE CAST.
 * Supply, circulation and burn, read from the token contract. No allocation
 * pie chart, because allocations are a claim and this page only prints facts.
 */
export function Tokenomics() {
  const token = useToken();
  const show = useShowtime();

  const total = token.totalSupply.value;
  const burned = token.burned.value;
  const burnedPct =
    total && total > 0n && burned !== null
      ? Number((burned * 10_000n) / total) / 100
      : null;

  return (
    <Section
      id="tokenomics"
      act="THE BILL"
      eyebrow="Who is on stage"
      title="The Cast"
      statement="ONE TOKEN. ONE POOL. ONE VENUE."
    >
      <div className={styles.poster}>
        <div className={styles.billing}>
          <p className={styles.ticker}>${TOKEN_SYMBOL}</p>
          <span className={styles.tokenName}>
            {token.meta.name} · {token.meta.decimals} decimals · Ethereum Mainnet
          </span>
        </div>

        <div className={styles.cast}>
          <div className={styles.role}>
            <MetricValue
              label="Total supply"
              metric={token.totalSupply}
              format={(v) => formatCompact(v, token.meta.decimals)}
              suffix={TOKEN_SYMBOL}
              showSource
            />
          </div>
          <div className={styles.role}>
            <MetricValue
              label="Circulating supply"
              metric={token.circulating}
              format={(v) => formatCompact(v, token.meta.decimals)}
              suffix={TOKEN_SYMBOL}
              showSource
            />
          </div>
          <div className={styles.role}>
            <MetricValue
              label="Burned"
              metric={token.burned}
              format={(v) => formatCompact(v, token.meta.decimals)}
              suffix={TOKEN_SYMBOL}
              showSource
            />
          </div>
          <div className={styles.role}>
            <MetricValue
              label="Total fees"
              metric={show.totalFeesWei}
              format={(v) => formatEth(v, 4)}
              suffix="ETH"
              showSource
            />
          </div>
        </div>

        <div className={styles.supplyBar}>
          {burnedPct !== null ? (
            <>
              <div className={styles.barLabel}>
                <span>Circulating {(100 - burnedPct).toFixed(2)}%</span>
                <span>Burned {burnedPct.toFixed(2)}%</span>
              </div>
              <div
                className={styles.bar}
                role="img"
                aria-label={`${burnedPct.toFixed(2)} percent of supply burned`}
              >
                <span
                  className={styles.barFill}
                  style={{ width: `${100 - burnedPct}%` }}
                />
                <span className={styles.barBurn} style={{ width: `${burnedPct}%` }} />
              </div>
            </>
          ) : (
            <p className={styles.barEmpty}>
              SUPPLY SPLIT UNAVAILABLE — TOTAL SUPPLY AND BURN BALANCES NOT YET READ
            </p>
          )}
        </div>

        <div className={styles.contractBlock}>
          <AddressRow name={`$${TOKEN_SYMBOL} contract`} address={TOKEN_ADDRESS} isToken />
        </div>
      </div>

      {!token.configured && (
        <div className={styles.notice}>
          <Notice title="Contract unavailable">
            NEXT_PUBLIC_TOKEN_ADDRESS is not set. Supply figures are read directly
            from the token contract on Ethereum Mainnet, so nothing can be shown
            until the address is configured — and nothing will be invented in the
            meantime.
          </Notice>
        </div>
      )}
    </Section>
  );
}

export default Tokenomics;
