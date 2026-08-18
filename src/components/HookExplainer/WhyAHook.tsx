import styles from "./WhyAHook.module.css";
import { Section } from "@/components/ui/Section";
import { FlowDiagram } from "@/components/ui/FlowDiagram";

/**
 * WHY A HOOK? — the short version, kept visual. Sits between the narrative acts
 * and the technical ones as a hinge.
 */
export function WhyAHook() {
  return (
    <Section id="why-a-hook" act="INTERVAL" eyebrow="One question">
      <div className={styles.band}>
        <div className={styles.copy}>
          <h2 className={styles.q}>Why a Hook?</h2>
          <p className="prose">
            Uniswap V4 Hooks allow protocols to add programmable logic around
            pool activity — before and after swaps, before and after liquidity
            changes — inside the pool&apos;s own execution.
          </p>
          <p className="prose">
            SHOWTIME uses the Hook as its Ringmaster: the single place where the
            protocol decides what a trade means beyond the trade itself.
          </p>
        </div>

        <div className={styles.flowHolder}>
          <FlowDiagram
            orientation="horizontal"
            caption="Pool to hook to programmable logic to show"
            steps={[
              { label: "Pool" },
              { label: "Hook", accent: true },
              { label: "Programmable logic" },
              { label: "Show" },
            ]}
          />
        </div>
      </div>
    </Section>
  );
}

export default WhyAHook;
