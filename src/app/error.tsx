"use client";

import { useEffect } from "react";

import styles from "./status.module.css";
import { TicketButton } from "@/components/ui/TicketButton";
import { Curtains } from "@/components/Curtain/Curtains";

/**
 * SHOW INTERRUPTED — the runtime error boundary, staged as a stopped
 * performance rather than a stack trace.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surfaced for whatever monitoring the deployment has wired up.
    console.error("[SHOWTIME] show interrupted:", error);
  }, [error]);

  return (
    <div className={styles.stage}>
      <Curtains state="closed" pelmet />
      <div className={styles.panel}>
        <span className={styles.code}>SHOW INTERRUPTED</span>
        <h1 className={styles.title}>The performance stopped</h1>
        <p className={styles.body}>
          Something went wrong backstage. Nothing on the chain has changed — this
          is a problem with the front of house.
        </p>
        {error.digest && <p className={styles.digest}>DIGEST · {error.digest}</p>}
        <div className={styles.actions}>
          <TicketButton onClick={reset}>Raise the curtain again</TicketButton>
          <TicketButton variant="secondary" href="/">
            Back to the entrance
          </TicketButton>
        </div>
      </div>
    </div>
  );
}
