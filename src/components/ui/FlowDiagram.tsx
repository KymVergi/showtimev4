import { Fragment } from "react";

import styles from "./FlowDiagram.module.css";

export interface FlowStep {
  label: string;
  note?: string;
  accent?: boolean;
}

interface FlowDiagramProps {
  steps: FlowStep[];
  orientation?: "vertical" | "horizontal";
  className?: string;
  /** Accessible description of what the running order represents. */
  caption?: string;
}

/**
 * The running order: TRADE → TICKET → SHOW REVENUE → … Rendered as an ordered
 * list so it reads correctly to assistive tech, with cue lights travelling the
 * connectors for everyone else.
 */
export function FlowDiagram({
  steps,
  orientation = "vertical",
  className,
  caption,
}: FlowDiagramProps) {
  return (
    <ol
      className={[styles.flow, styles[orientation], className].filter(Boolean).join(" ")}
      aria-label={caption}
    >
      {steps.map((step, index) => (
        <Fragment key={step.label}>
          {index > 0 && (
            <li
              className={styles.link}
              style={{ "--i": index } as React.CSSProperties}
              aria-hidden="true"
            />
          )}
          <li
            className={`${styles.step} ${step.accent ? styles.accent : ""}`}
            style={{ "--i": index } as React.CSSProperties}
          >
            <span className={styles.stepLabel}>{step.label}</span>
            {step.note && <span className={styles.stepNote}>{step.note}</span>}
          </li>
        </Fragment>
      ))}
    </ol>
  );
}

export default FlowDiagram;
