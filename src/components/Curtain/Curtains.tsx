import styles from "./Curtains.module.css";

export type CurtainState = "open" | "closed" | "ajar";

interface CurtainsProps {
  state?: CurtainState;
  /** Draw the scalloped pelmet and brass fringe across the top. */
  pelmet?: boolean;
  className?: string;
}

/**
 * The drapes. Decorative and inert — parents drive `state` to open, close or
 * hold them ajar. Pure CSS transforms, so closing the curtain costs nothing.
 */
export function Curtains({ state = "ajar", pelmet = true, className }: CurtainsProps) {
  return (
    <div
      className={[styles.stage, styles[state], className].filter(Boolean).join(" ")}
      aria-hidden="true"
    >
      <div className={`${styles.panel} ${styles.left}`} />
      <div className={`${styles.panel} ${styles.right}`} />
      <div className={styles.seam} />
      {pelmet && (
        <>
          <div className={styles.pelmet} />
          <div className={styles.fringe} />
        </>
      )}
    </div>
  );
}

export default Curtains;
