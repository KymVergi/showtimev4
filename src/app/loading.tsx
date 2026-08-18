import styles from "./status.module.css";

/** The house lights coming up while the route resolves. */
export default function Loading() {
  return (
    <div className={styles.stage}>
      <div className={styles.panel}>
        <span className={styles.code}>Taking your seats</span>
        <h1 className={styles.title}>The show is about to begin</h1>
        <div className={styles.loadingBulbs} aria-label="Loading">
          <span className={styles.loadingBulb} />
          <span className={styles.loadingBulb} />
          <span className={styles.loadingBulb} />
          <span className={styles.loadingBulb} />
        </div>
      </div>
    </div>
  );
}
