import type { ReactNode } from "react";

import styles from "./Section.module.css";

interface SectionProps {
  id: string;
  /** Act number printed above the title, e.g. "ACT 01". */
  act?: string;
  eyebrow?: string;
  title?: string;
  statement?: string;
  children: ReactNode;
  dark?: boolean;
  className?: string;
}

/**
 * One act of the show. Provides the brass rule, the act number, the title and
 * the optional headline statement so every section shares the same billing.
 */
export function Section({
  id,
  act,
  eyebrow,
  title,
  statement,
  children,
  dark = false,
  className,
}: SectionProps) {
  return (
    <section
      id={id}
      className={[styles.section, dark ? styles.dark : "", className]
        .filter(Boolean)
        .join(" ")}
    >
      <span className={styles.rule} aria-hidden="true" />
      <div className={styles.inner}>
        {(act || eyebrow || title || statement) && (
          <header className={styles.head}>
            {act && <span className={styles.act}>{act}</span>}
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            {title && <h2 className="sectionTitle">{title}</h2>}
            {statement && <p className="statement">{statement}</p>}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}

export default Section;
