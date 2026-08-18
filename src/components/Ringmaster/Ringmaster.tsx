import styles from "./Ringmaster.module.css";
import { Section } from "@/components/ui/Section";
import { FlowDiagram } from "@/components/ui/FlowDiagram";
import { brand } from "@/config/project";

/**
 * ACT 02 — THE RINGMASTER.
 * The Hook, personified. A silhouette in a follow-spot: hat, band, cane.
 * Sophisticated, not cartoonish — no face, no grin, no confetti.
 */
export function Ringmaster() {
  return (
    <Section
      id="the-ringmaster"
      act="ACT 02"
      eyebrow="Who runs the ring"
      title="The Ringmaster"
      statement={brand.slogans.hook}
    >
      <div className={styles.grid}>
        <div className={styles.portrait}>
          <span className={styles.beam} aria-hidden="true" />
          <span className={styles.pool} aria-hidden="true" />

          <div className={styles.figure}>
            <div className={styles.hat} aria-hidden="true">
              <span className={styles.cane}>
                <span className={styles.caneHandle} />
              </span>
              <span className={styles.crown} />
              <span className={styles.band} />
              <span className={styles.pip} />
              <span className={styles.brim} />
            </div>
            <p className={styles.plate}>THE HOOK</p>
          </div>
        </div>

        <div className={styles.copy}>
          <p className="prose">
            Uniswap V4 Hooks allow programmable logic to interact with pool
            activity. A Hook is a contract the pool calls at defined moments in
            its lifecycle — so protocol logic can run as part of the pool&apos;s
            own execution rather than alongside it.
          </p>

          <p className={styles.pullQuote}>
            The Ringmaster does not perform. He decides what happens next, and
            when — and the ring obeys.
          </p>

          <p className="prose">
            For SHOWTIME, the Hook is the mechanism controlling the performance:
            the piece of the system that sits between a swap and everything that
            follows it.
          </p>

          <div className={styles.flowHolder}>
            <FlowDiagram
              caption="A swap reaches the Hook, which runs programmable logic, which drives the show"
              steps={[
                { label: "Swap" },
                { label: "Hook", accent: true },
                { label: "Programmable logic" },
                { label: "Show" },
              ]}
            />
          </div>
        </div>
      </div>
    </Section>
  );
}

export default Ringmaster;
