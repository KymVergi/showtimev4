"use client";

import { useEffect, useState } from "react";
import { Dialog } from "@mui/material";
import { LogOut, Ticket, Wallet } from "lucide-react";
import { useAccount, useConnect, useDisconnect } from "wagmi";

import styles from "./ConnectButton.module.css";
import { TicketButton } from "@/components/ui/TicketButton";
import { Notice } from "@/components/System/Notice";
import { shortAddress } from "@/lib/web3/format";
import { explorerAddress } from "@/config/project";

interface ConnectButtonProps {
  label?: string;
  size?: "default" | "small";
  block?: boolean;
}

/**
 * ENTER THE SHOW. Opens the box office, lists whichever connectors are actually
 * available in this browser, and afterwards becomes the ticket holder's stub.
 */
export function ConnectButton({
  label = "Enter the show",
  size = "small",
  block = false,
}: ConnectButtonProps) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();

  useEffect(() => setMounted(true), []);

  // Wallet state is client-only; render the neutral label during SSR so the
  // markup matches on hydration.
  if (!mounted) {
    return (
      <TicketButton size={size} block={block} icon={<Ticket size={15} />} disabled>
        {label}
      </TicketButton>
    );
  }

  if (isConnected && address) {
    return (
      <>
        <button
          type="button"
          className={styles.connected}
          onClick={() => setOpen(true)}
          aria-label="Wallet menu"
        >
          <span className={styles.dot} aria-hidden="true" />
          {shortAddress(address)}
        </button>

        <Dialog open={open} onClose={() => setOpen(false)}>
          <div className={styles.dialogHead}>
            <h2 className={styles.dialogTitle}>Your ticket</h2>
            <p className={styles.dialogSub}>Ethereum Mainnet</p>
          </div>
          <div className={styles.menu}>
            <div className={styles.walletLine}>
              <span>{shortAddress(address, 6)}</span>
              <a
                href={explorerAddress(address)}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.connectorHint}
              >
                ETHERSCAN ↗
              </a>
            </div>
            <TicketButton
              variant="secondary"
              size="small"
              block
              icon={<LogOut size={14} />}
              onClick={() => {
                disconnect();
                setOpen(false);
              }}
            >
              Leave the show
            </TicketButton>
          </div>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <TicketButton
        size={size}
        block={block}
        icon={<Ticket size={15} />}
        onClick={() => setOpen(true)}
      >
        {label}
      </TicketButton>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <div className={styles.dialogHead}>
          <h2 className={styles.dialogTitle}>Box office</h2>
          <p className={styles.dialogSub}>Ethereum Mainnet · one venue only</p>
        </div>

        <div className={styles.list}>
          {connectors.length === 0 && (
            <Notice title="No wallets detected">
              Install a browser wallet, or configure
              NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID to enable WalletConnect.
            </Notice>
          )}

          {connectors.map((connector) => (
            <button
              key={connector.uid}
              type="button"
              className={styles.connector}
              disabled={isPending}
              onClick={() => {
                connect({ connector });
                setOpen(false);
              }}
            >
              <span>
                <Wallet size={14} style={{ marginRight: 10, verticalAlign: -2 }} />
                {connector.name}
              </span>
              <span className={styles.connectorHint}>CONNECT</span>
            </button>
          ))}
        </div>

        {error && (
          <div className={styles.dialogError}>
            <Notice title="Show interrupted" tone="alarm">
              {error.message}
            </Notice>
          </div>
        )}
      </Dialog>
    </>
  );
}

export default ConnectButton;
