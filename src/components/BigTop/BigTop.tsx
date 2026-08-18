import styles from "./BigTop.module.css";
import { Section } from "@/components/ui/Section";
import { brand } from "@/config/project";

/**
 * ACT 04 — THE BIG TOP.
 * The pool, drawn as the tent: liquidity, trades and fees arranged around the
 * ring, with the Hook standing where the Ringmaster stands. Deliberately short.
 */

const NODES = [
  { label: "Liquidity", left: "22%", top: "40%", angle: 160, length: 26 },
  { label: "Trades", left: "78%", top: "40%", angle: 20, length: 26 },
  { label: "Fees", left: "26%", top: "76%", angle: 213, length: 26 },
  { label: "Hook", left: "74%", top: "76%", angle: -33, length: 26, hook: true },
];

export function BigTop() {
  return (
    <Section
      id="the-big-top"
      act="ACT 04"
      eyebrow="The venue"
      title="The Big Top"
      statement={brand.slogans.bigTop}
    >
      <div className={styles.wrap}>
        <div className={styles.copy}>
          <p className="prose">
            The pool is where the show happens. Every trade enters the Big Top.
            The Hook controls the programmable performance.
          </p>
          <p className="prose">
            Liquidity is the canvas. Trades are the audience arriving. Fees are
            the receipts at the end of the night. All of it happens under one
            roof, in one contract, on Ethereum Mainnet.
          </p>
          <p className={styles.legend}>
            The diagram is a metaphor, not a topology: it shows what the pool
            contains, not the call graph. The call graph is the ABI, in Act 03.
          </p>
        </div>

        <div className={styles.tent}>
          <span className={styles.canvas} aria-hidden="true" />
          <span className={styles.pole} aria-hidden="true" />
          <span className={styles.ring} aria-hidden="true" />

          {NODES.map((node, i) => (
            <span
              key={node.label}
              className={styles.spoke}
              aria-hidden="true"
              style={
                {
                  width: `${node.length}%`,
                  transform: `rotate(${node.angle}deg)`,
                  "--i": i,
                } as React.CSSProperties
              }
            />
          ))}

          <span className={styles.center}>POOL</span>

          {NODES.map((node, i) => (
            <span
              key={node.label}
              className={`${styles.node} ${node.hook ? styles.nodeHook : ""}`}
              style={
                { left: node.left, top: node.top, "--i": i + 1 } as React.CSSProperties
              }
            >
              {node.label}
            </span>
          ))}
        </div>
      </div>
    </Section>
  );
}

export default BigTop;
