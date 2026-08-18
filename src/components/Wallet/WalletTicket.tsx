"use client";

import styles from "./WalletTicket.module.css";
import { Section } from "@/components/ui/Section";
import { MetricValue } from "@/components/ui/MetricValue";
import { Notice } from "@/components/System/Notice";
import { ConnectButton } from "./ConnectButton";
import { useTokenBalance } from "@/hooks/useTokenBalance";
import { useHook } from "@/hooks/useHook";
import { formatAmount, shortAddress, timeAgo } from "@/lib/web3/format";
import { TOKEN_SYMBOL } from "@/config/project";

/**
 * YOUR TICKET — the connected wallet's standing in the show.
 *
 * Note what this component does NOT do: it does not offer a claim, stake or
 * harvest button. Those buttons only exist if the deployed Hook ABI contains
 * the functions behind them, so the action rail below is derived from the ABI.
 */
export function WalletTicket() {
  const { connected, ticket, configured } = useTokenBalance();
  const hook = useHook();
  const actions = hook.summary.writes;

  return (
    <Section
      id="your-ticket"
      act="THE HOLDER"
      eyebrow="Admit one"
      title="Your Ticket"
    >
      <div className={styles.ticket}>
        <div className={styles.main}>
          {!connected || !ticket ? (
            <div className={styles.empty}>
              <h3 className={styles.emptyTitle}>Enter the show</h3>
              <p className="prose">
                Connect a wallet to see your {`$${TOKEN_SYMBOL}`} balance, what
                you have received, and your last activity. SHOWTIME reads your
                wallet — it never asks for a signature to display anything.
              </p>
              <ConnectButton label="Enter the show" size="default" />
            </div>
          ) : (
            <>
              <div className={styles.walletRow}>
                <div>
                  <span className={styles.walletLabel}>Wallet</span>
                  <span className={styles.walletAddr}>{ticket.address}</span>
                </div>
                <ConnectButton />
              </div>

              <div className={styles.grid}>
                <MetricValue
                  label={`$${TOKEN_SYMBOL} balance`}
                  metric={ticket.balance}
                  format={(v) => formatAmount(v, 18, 4)}
                  showSource
                />
                <MetricValue
                  label="Total received"
                  metric={ticket.totalReceived}
                  format={(v) => formatAmount(v, 18, 4)}
                  notConfiguredLabel="NEEDS ALCHEMY KEY"
                  showSource
                />
                <MetricValue
                  label="Claimable"
                  metric={ticket.claimable}
                  format={(v) => formatAmount(v, 18, 4)}
                  notConfiguredLabel="NO CLAIM FUNCTION IN HOOK ABI"
                />
                <MetricValue
                  label="Last activity"
                  metric={ticket.lastActivity}
                  format={(v) => timeAgo(v)}
                  mono
                  notConfiguredLabel="NEEDS ALCHEMY KEY"
                  showSource
                />
              </div>

              <div className={styles.actions}>
                {actions.length === 0 ? (
                  <Notice title="No holder actions available" tone="calm">
                    Buttons here are generated from the deployed Hook&apos;s ABI.
                    None are shown because no ABI is installed — SHOWTIME will not
                    render an action it cannot prove the contract supports.
                  </Notice>
                ) : (
                  <Notice title="Holder actions" tone="calm">
                    The deployed Hook exposes{" "}
                    {actions.map((a) => a.name).join(", ")}. Wire these to
                    `useWriteContract` once you have confirmed their semantics
                    against the verified source.
                  </Notice>
                )}
              </div>
            </>
          )}
        </div>

        <aside className={styles.stub}>
          <span className={styles.stubLabel}>Admit</span>
          <span className={styles.stubValue}>ONE</span>
          <span className={styles.serial}>
            {connected && ticket ? shortAddress(ticket.address, 4) : "— — — —"}
          </span>
        </aside>
      </div>

      {connected && !configured && (
        <div className={styles.trailingNotice}>
          <Notice title="Contract unavailable">
            NEXT_PUBLIC_TOKEN_ADDRESS is not configured, so your balance cannot be
            read.
          </Notice>
        </div>
      )}
    </Section>
  );
}

export default WalletTicket;
