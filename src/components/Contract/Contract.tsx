"use client";

import styles from "./Contract.module.css";
import { Section } from "@/components/ui/Section";
import { AddressRow } from "@/components/ui/AddressRow";
import { TheatrePanel } from "@/components/ui/TheatrePanel";
import { Notice } from "@/components/System/Notice";
import {
  HOOK_ADDRESS,
  POOL_MANAGER_ADDRESS,
  TOKEN_ADDRESS,
  TOKEN_SYMBOL,
  CHAIN_NAME,
} from "@/config/project";
import {
  HOOK_ABI_CONFIGURED,
  TOKEN_ABI_CONFIGURED,
  TOKEN_ABI_IS_DEPLOYED_ARTIFACT,
} from "@/lib/contracts";

/**
 * THE CONTRACT — the playbill's back page. Every address comes from
 * configuration; every one that is missing says so.
 */
export function Contract() {
  const allConfigured = Boolean(TOKEN_ADDRESS && HOOK_ADDRESS && POOL_MANAGER_ADDRESS);

  return (
    <Section
      id="the-contract"
      act="THE RECORD"
      eyebrow="Verify everything"
      title="The Contract"
      statement="DON'T TAKE THE HOUSE'S WORD FOR IT."
    >
      <div className={styles.wrap}>
        <div className={styles.plate}>
          <AddressRow name={`$${TOKEN_SYMBOL} token`} address={TOKEN_ADDRESS} isToken />
          <AddressRow name="SHOWTIME hook" address={HOOK_ADDRESS} />
          <AddressRow name="Pool manager" address={POOL_MANAGER_ADDRESS} />
        </div>

        <div className={styles.side}>
          <TheatrePanel label="ABI status" ornate>
            <div className={styles.abiState}>
              <span>Token ABI</span>
              <span
                className={`${styles.badge} ${
                  TOKEN_ABI_IS_DEPLOYED_ARTIFACT
                    ? styles.ok
                    : TOKEN_ABI_CONFIGURED
                      ? styles.partial
                      : styles.missing
                }`}
              >
                {TOKEN_ABI_IS_DEPLOYED_ARTIFACT
                  ? "Deployed artifact"
                  : TOKEN_ABI_CONFIGURED
                    ? "Standard ERC-20 only"
                    : "Not configured"}
              </span>
            </div>

            <div className={styles.abiState}>
              <span>Hook ABI</span>
              <span
                className={`${styles.badge} ${
                  HOOK_ABI_CONFIGURED ? styles.ok : styles.missing
                }`}
              >
                {HOOK_ABI_CONFIGURED ? "Installed" : "Not configured"}
              </span>
            </div>

            <p className={styles.note}>
              The token reads use the EIP-20 standard interface, which is safe to
              assume of any ERC-20. Nothing beyond it is assumed. Hook behaviour
              is only ever described from an installed artifact.
            </p>
          </TheatrePanel>

          {!allConfigured && (
            <Notice title="Contract unavailable">
              One or more addresses are unset. Populate NEXT_PUBLIC_TOKEN_ADDRESS,
              NEXT_PUBLIC_HOOK_ADDRESS and NEXT_PUBLIC_POOL_MANAGER_ADDRESS in
              <span className="mono"> .env.local</span>. All three must be
              {" "}{CHAIN_NAME} addresses.
            </Notice>
          )}
        </div>
      </div>
    </Section>
  );
}

export default Contract;
