import styles from "./StageAtmosphere.module.css";

/**
 * The venue itself. Rendered once, fixed behind the whole document, so every
 * section is lit by the same rig instead of each one inventing its own box.
 * Purely decorative — no pointer events, hidden from assistive tech.
 */
export function StageAtmosphere() {
  return (
    <div className={styles.stage} aria-hidden="true">
      <div className={styles.tent} />
      <div className={styles.peak} />
      <div className={`${styles.spot} ${styles.spotA}`} />
      <div className={`${styles.spot} ${styles.spotB}`} />
      <div className={`${styles.spot} ${styles.spotC}`} />
      <div className={`${styles.curtain} ${styles.curtainLeft}`} />
      <div className={`${styles.curtain} ${styles.curtainRight}`} />
      <div className={styles.valance} />
      <div className={styles.smoke} />
      <div className={styles.crowd} />
      <div className={styles.vignette} />
      <div className={styles.grain} />
    </div>
  );
}

export default StageAtmosphere;
