"use client";

import styles from "./FinalAct.module.css";
import { Section } from "@/components/ui/Section";
import { FlowDiagram } from "@/components/ui/FlowDiagram";
import { MetricValue } from "@/components/ui/MetricValue";
import { Notice } from "@/components/System/Notice";
import { useBurns } from "@/hooks/useBurns";
import { useToken } from "@/hooks/useToken";
import { useReveal } from "@/hooks/useReveal";
import { formatCompact, timeAgo } from "@/lib/web3/format";
import { brand, burnConfig, TOKEN_SYMBOL } from "@/config/project";
import { LOADING, NOT_CONFIGURED, UNAVAILABLE, type Metric } from "@/types/showtime";

/** Six tokens walk into the light. Positions are fixed, not random. */
const TOKENS = [
  { x: "14%", tx: "138px", dur: "9s", delay: "0s" },
  { x: "27%", tx: "88px", dur: "9s", delay: "1.1s" },
  { x: "40%", tx: "34px", dur: "9s", delay: "2.2s" },
  { x: "58%", tx: "-30px", dur: "9s", delay: "1.6s" },
  { x: "71%", tx: "-84px", dur: "9s", delay: "0.5s" },
  { x: "84%", tx: "-134px", dur: "9s", delay: "2.8s" },
];

/**
 * ACT 06 — THE FINAL ACT.
 *
 * The burn, staged rather than dramatised as destruction: the spot tightens,
 * the drapes come in, the tokens step into the light and are gone. Then the
 * house whispers that the show continues.
 *
 * The copy is careful. It describes the mechanism as *configured*, and defers
 * to the deployed contract for what actually happens.
 */
export function FinalAct() {
  const { ref, visible } = useReveal<HTMLDivElement>(0.3, true);
  const burns = useBurns(8);
  const token = useToken();

  // How many burn events we can actually see — distinct from "how much".
  const trackedEvents: Metric<number> =
    burns.burns.length > 0
      ? { status: "ready", value: burns.burns.length, source: burns.source ?? "chain" }
      : burns.totalBurned.status === "not-configured"
        ? NOT_CONFIGURED
        : burns.totalBurned.status === "loading"
          ? LOADING
          : UNAVAILABLE;

  return (
    <Section
      id="the-final-act"
      act="ACT 06"
      eyebrow="The lights go down"
      title="The Final Act"
      statement={brand.slogans.finalAct}
      className={styles.section}
    >
      <div className={styles.layout}>
        <div className={styles.copy}>
          <p className="prose">
            Every show has a final act. The protocol&apos;s configured mechanism
            directs revenue toward buyback and burn according to the deployed
            contract implementation.
          </p>
          <p className="prose">
            Tokens that reach a burn address leave circulation permanently. What
            is counted below is exactly that: balances held at the standard burn
            sinks, and transfers into them — observable facts, not a description
            of intent.
          </p>

          <FlowDiagram
            caption="Revenue becomes buyback becomes burn becomes the final act"
            steps={[
              { label: "Revenue" },
              { label: "Buyback" },
              { label: "Burn", accent: true },
              { label: "Final act" },
            ]}
          />

          <p className={styles.caution}>
            {burnConfig.description ??
              "The exact buyback and burn behaviour is not documented in this deployment's configuration. Install the Hook ABI and set NEXT_PUBLIC_BURN_DESCRIPTION to describe the implemented mechanism — until then this site will not claim one."}
          </p>
        </div>

        <div
          ref={ref}
          className={`${styles.stage} ${visible ? styles.playing : ""}`}
          aria-label="The final act: tokens enter the spotlight and leave circulation"
        >
          <span className={styles.spot} aria-hidden="true" />
          <span className={styles.boards} aria-hidden="true" />

          {TOKENS.map((t, i) => (
            <span
              key={`token-${i}`}
              className={styles.token}
              aria-hidden="true"
              style={
                {
                  "--x": t.x,
                  "--tx": t.tx,
                  "--dur": t.dur,
                  "--delay": t.delay,
                } as React.CSSProperties
              }
            />
          ))}

          {TOKENS.map((t, i) => (
            <span
              key={`mote-${i}`}
              className={styles.mote}
              aria-hidden="true"
              style={
                {
                  "--x": t.x,
                  "--tx": t.tx,
                  "--dur": t.dur,
                  "--delay": t.delay,
                } as React.CSSProperties
              }
            />
          ))}

          <span className={`${styles.drape} ${styles.left}`} aria-hidden="true" />
          <span className={`${styles.drape} ${styles.right}`} aria-hidden="true" />
          <p className={styles.continues}>THE SHOW CONTINUES.</p>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.cell}>
          <MetricValue
            label="Total burned"
            metric={token.burned.status === "ready" ? token.burned : burns.totalBurned}
            format={(v) => formatCompact(v, token.meta.decimals)}
            suffix={TOKEN_SYMBOL}
            emptyLabel="NO BURNS OBSERVED"
            showSource
          />
        </div>
        <div className={styles.cell}>
          <MetricValue
            label="Last burn"
            metric={burns.lastBurn}
            format={(v) =>
              `${formatCompact(v.amount, token.meta.decimals) ?? "—"} · ${
                timeAgo(v.timestamp) ?? `block ${v.blockNumber}`
              }`
            }
            mono
            emptyLabel="NO BURN EVENTS FOUND"
            showSource
          />
        </div>
        <div className={styles.cell}>
          <MetricValue
            label="Burn events tracked"
            metric={trackedEvents}
            format={(v) => String(v)}
            emptyLabel="NONE TRACKED"
          />
        </div>
      </div>

      {burns.offline && (
        <div className={styles.notice}>
          <Notice title="Data unavailable">
            Burn tracking needs either the Supabase indexer or an Alchemy key plus
            a configured token address. Configure one and the ledger above will
            fill from Ethereum Mainnet.
          </Notice>
        </div>
      )}
    </Section>
  );
}

export default FinalAct;
