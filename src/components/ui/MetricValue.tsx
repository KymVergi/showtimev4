import type { ReactNode } from "react";

import styles from "./MetricValue.module.css";
import type { Metric } from "@/types/showtime";

interface MetricValueProps<T> {
  label: string;
  metric: Metric<T>;
  /** Turns a ready value into display text. Return `null` to fall back to "—". */
  format?: (value: T) => string | null;
  suffix?: string;
  mono?: boolean;
  /** Copy shown when the value is genuinely unknown. */
  emptyLabel?: string;
  /** Copy shown when the underlying config is missing. */
  notConfiguredLabel?: string;
  showSource?: boolean;
  children?: ReactNode;
}

const SOURCE_LABEL: Record<string, string> = {
  chain: "ON-CHAIN",
  indexer: "INDEXED",
  demo: "DEMO SHOW",
};

/**
 * Renders one number from the show — or, honestly, the reason there isn't one.
 *
 * This component is the enforcement point for "never fabricate data": it can
 * only ever print a value that arrived with a `Metric` and a source.
 */
export function MetricValue<T>({
  label,
  metric,
  format,
  suffix,
  mono = false,
  emptyLabel = "DATA UNAVAILABLE",
  notConfiguredLabel = "NOT CONFIGURED",
  showSource = false,
  children,
}: MetricValueProps<T>) {
  let body: ReactNode;

  switch (metric.status) {
    case "loading":
    case "idle":
      body = <span className={styles.loading} aria-label="Loading" />;
      break;

    case "not-configured":
      body = <p className={`${styles.empty} ${styles.emptyWarn}`}>{notConfiguredLabel}</p>;
      break;

    case "error":
      body = <p className={`${styles.empty} ${styles.emptyWarn}`}>SHOW INTERRUPTED</p>;
      break;

    case "unavailable":
      body = <p className={styles.empty}>{metric.reason ?? emptyLabel}</p>;
      break;

    case "ready": {
      const text = metric.value !== null ? (format ? format(metric.value) : String(metric.value)) : null;
      body =
        text === null ? (
          <p className={styles.empty}>{emptyLabel}</p>
        ) : (
          <p className={`${styles.value} ${mono ? styles.valueMono : ""}`}>
            {text}
            {suffix && <span className={styles.suffix}>{suffix}</span>}
          </p>
        );
      break;
    }
  }

  return (
    <div className={styles.stat}>
      <span className={styles.label}>{label}</span>
      {body}
      {children}
      {showSource && metric.source && (
        <span
          className={`${styles.source} ${
            metric.source === "demo" ? styles.sourceDemo : ""
          }`}
        >
          {SOURCE_LABEL[metric.source]}
        </span>
      )}
    </div>
  );
}

export default MetricValue;
