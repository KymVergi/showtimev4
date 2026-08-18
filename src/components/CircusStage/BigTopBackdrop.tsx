import styles from "./BigTopBackdrop.module.css";

/**
 * The Big Top on the horizon: striped canvas, centre pole and finial, bulb
 * garlands along the eaves, and a lit doorway. Decorative only.
 */
export function BigTopBackdrop({ className }: { className?: string }) {
  return (
    <div
      className={[styles.backdrop, className].filter(Boolean).join(" ")}
      aria-hidden="true"
    >
      <div className={styles.tent}>
        <span className={styles.pennants} />
        <span className={styles.canopy} />
        <span className={styles.garland} />
        <span className={styles.hem} />
        <span className={styles.pole} />
        <span className={styles.finial} />
        <span className={styles.doorway} />
      </div>
      <div className={styles.ring} />
      <div className={styles.fade} />
    </div>
  );
}

export default BigTopBackdrop;
