import type { ReactNode } from "react";

import styles from "./TheatrePanel.module.css";

interface TheatrePanelProps {
  children: ReactNode;
  /** Small brass header plate, e.g. "SHOW REVENUE". */
  label?: string;
  icon?: ReactNode;
  variant?: "default" | "ticket";
  ornate?: boolean;
  hoverable?: boolean;
  className?: string;
  id?: string;
}

/**
 * The house panel. Velvet ground, brass rule, cut corners — deliberately not a
 * rounded glass card, while keeping ordinary modern padding and hit areas.
 */
export function TheatrePanel({
  children,
  label,
  icon,
  variant = "default",
  ornate = false,
  hoverable = false,
  className,
  id,
}: TheatrePanelProps) {
  return (
    <div
      id={id}
      className={[
        styles.panel,
        variant === "ticket" ? styles.ticket : "",
        ornate ? styles.ornate : "",
        hoverable ? styles.hoverable : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {ornate && (
        <>
          <span className={`${styles.corner} ${styles.tl}`} aria-hidden="true" />
          <span className={`${styles.corner} ${styles.tr}`} aria-hidden="true" />
          <span className={`${styles.corner} ${styles.bl}`} aria-hidden="true" />
          <span className={`${styles.corner} ${styles.br}`} aria-hidden="true" />
        </>
      )}
      {label && (
        <p className={styles.plate}>
          {icon && <span className={styles.plateIcon}>{icon}</span>}
          {label}
        </p>
      )}
      {children}
    </div>
  );
}

export default TheatrePanel;
