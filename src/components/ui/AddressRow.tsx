"use client";

import { Check, Copy, ExternalLink } from "lucide-react";
import { Tooltip } from "@mui/material";

import styles from "./AddressRow.module.css";
import { useCopy } from "@/hooks/useCopy";
import { shortAddress } from "@/lib/web3/format";
import { explorerAddress, explorerToken } from "@/config/project";

interface AddressRowProps {
  name: string;
  address: string | null;
  /** Links to the token page on the explorer rather than the address page. */
  isToken?: boolean;
  missingLabel?: string;
}

/**
 * One line of the playbill: what it is, where it lives, and two ways to go
 * look at it yourself. Addresses always come from configuration — when one is
 * absent the row says so instead of showing a plausible-looking placeholder.
 */
export function AddressRow({
  name,
  address,
  isToken = false,
  missingLabel = "CONTRACT UNAVAILABLE — NOT CONFIGURED",
}: AddressRowProps) {
  const { copy, copied } = useCopy();
  const href = address
    ? isToken
      ? explorerToken(address)
      : explorerAddress(address)
    : null;

  return (
    <div className={styles.row}>
      <div className={styles.meta}>
        <span className={styles.name}>{name}</span>
        {address ? (
          <>
            <span className={styles.address}>{address}</span>
            <span className={styles.addressShort}>{shortAddress(address, 8)}</span>
          </>
        ) : (
          <span className={styles.missing}>{missingLabel}</span>
        )}
      </div>

      {address && (
        <div className={styles.actions}>
          <Tooltip title={copied === address ? "COPIED" : "COPY"} arrow>
            <button
              type="button"
              className={`${styles.action} ${copied === address ? styles.copied : ""}`}
              onClick={() => copy(address)}
              aria-label={`Copy ${name} address`}
            >
              {copied === address ? <Check size={15} /> : <Copy size={15} />}
            </button>
          </Tooltip>

          <Tooltip title="VIEW ON ETHERSCAN" arrow>
            <a
              className={styles.action}
              href={href ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${name} on Etherscan`}
            >
              <ExternalLink size={15} />
            </a>
          </Tooltip>
        </div>
      )}
    </div>
  );
}

export default AddressRow;
