import type { ReactNode } from "react";
import { AlertTriangle, Info } from "lucide-react";

import styles from "./Notice.module.css";

interface NoticeProps {
  /** One of the theatrical error states, e.g. "HOOK ABI NOT CONFIGURED". */
  title: string;
  children?: ReactNode;
  tone?: "calm" | "warn" | "alarm";
  icon?: ReactNode;
  className?: string;
}

/**
 * The house announcement. Every unavailable, unconfigured or failed state on
 * the site is delivered through this, so the show never simply goes blank and
 * never fills the gap with invented numbers.
 */
export function Notice({
  title,
  children,
  tone = "warn",
  icon,
  className,
}: NoticeProps) {
  const fallbackIcon =
    tone === "alarm" ? <AlertTriangle size={16} /> : <Info size={16} />;

  return (
    <div
      className={[
        styles.notice,
        tone === "alarm" ? styles.alarm : "",
        tone === "calm" ? styles.calm : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      role={tone === "alarm" ? "alert" : "status"}
    >
      <span className={styles.icon}>{icon ?? fallbackIcon}</span>
      <div className={styles.body}>
        <strong className={styles.title}>{title}</strong>
        {children && <p className={styles.detail}>{children}</p>}
      </div>
    </div>
  );
}

export default Notice;
