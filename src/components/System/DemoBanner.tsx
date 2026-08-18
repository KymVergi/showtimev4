import { DEMO_MODE } from "@/config/project";
import styles from "./DemoBanner.module.css";

/**
 * When NEXT_PUBLIC_DEMO_MODE is on, this bar is unmissable and permanent.
 * Sample values may only appear on screen while it is showing.
 */
export function DemoBanner() {
  if (!DEMO_MODE) return null;

  return (
    <div className={styles.banner} role="status">
      <span className={styles.dot} aria-hidden="true" />
      <span>DEMO SHOW — SAMPLE VALUES, NOT LIVE ETHEREUM MAINNET DATA</span>
      <span className={styles.dot} aria-hidden="true" />
    </div>
  );
}

export default DemoBanner;
