"use client";

import { AlertTriangle } from "lucide-react";

import styles from "./NetworkGuard.module.css";
import { TicketButton } from "@/components/ui/TicketButton";
import { useNetworkGuard } from "@/hooks/useNetworkGuard";

/**
 * One venue, one chain. If a connected wallet is anywhere other than Ethereum
 * Mainnet, this bar stays pinned until it isn't.
 */
export function NetworkGuard() {
  const { wrongNetwork, isSwitching, switchError, switchToMainnet } = useNetworkGuard();

  if (!wrongNetwork) return null;

  return (
    <div className={styles.bar} role="alert">
      <span className={styles.text}>
        <span className={styles.icon}>
          <AlertTriangle size={15} />
        </span>
        Wrong network — SHOWTIME plays on Ethereum Mainnet only
      </span>

      <TicketButton size="small" onClick={switchToMainnet} disabled={isSwitching}>
        {isSwitching ? "Switching…" : "Switch to Ethereum Mainnet"}
      </TicketButton>

      {switchError && <span className={styles.error}>{switchError}</span>}
    </div>
  );
}

export default NetworkGuard;
