import {
  AssetTransfersCategory,
  SortingOrder,
  type AssetTransfersWithMetadataParams,
  type AssetTransfersWithMetadataResult,
} from "alchemy-sdk";
import type { Address } from "viem";

import { getAlchemy } from "./client";
import { BURN_ADDRESSES, TOKEN_DECIMALS } from "@/config/project";

/* -------------------------------------------------------------------------- */
/*  Token balances                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Raw token balance for `owner`. Returns `null` when Alchemy is not configured
 * or the balance could not be read — never `0n` as a substitute for unknown.
 */
export async function fetchTokenBalance(
  owner: Address,
  token: Address,
): Promise<bigint | null> {
  const alchemy = getAlchemy();
  if (!alchemy) return null;
  try {
    const res = await alchemy.core.getTokenBalances(owner, [token]);
    const entry = res.tokenBalances?.[0];
    if (!entry || entry.error || !entry.tokenBalance) return null;
    return BigInt(entry.tokenBalance);
  } catch {
    return null;
  }
}

/* -------------------------------------------------------------------------- */
/*  Transfers                                                                  */
/* -------------------------------------------------------------------------- */

export interface TransferRecord {
  hash: string;
  from: string | null;
  to: string | null;
  /** Raw units. `null` when Alchemy could not decode a raw value. */
  rawValue: bigint | null;
  blockNumber: bigint;
  timestamp: number | null;
}

function decodeRaw(rawContract?: { value?: string | null; decimal?: string | null }) {
  const value = rawContract?.value;
  if (!value) return null;
  try {
    return BigInt(value);
  } catch {
    return null;
  }
}

function baseParams(token: Address, limit: number): AssetTransfersWithMetadataParams {
  return {
    contractAddresses: [token],
    category: [AssetTransfersCategory.ERC20],
    order: SortingOrder.DESCENDING,
    withMetadata: true,
    maxCount: limit,
  };
}

/** Transfers of `token` involving `address` in either direction. */
export async function fetchWalletTransfers(
  address: Address,
  token: Address,
  limit = 25,
): Promise<TransferRecord[] | null> {
  const alchemy = getAlchemy();
  if (!alchemy) return null;
  try {
    const common = baseParams(token, limit);

    const [incoming, outgoing] = await Promise.all([
      alchemy.core.getAssetTransfers({ ...common, toAddress: address }),
      alchemy.core.getAssetTransfers({ ...common, fromAddress: address }),
    ]);

    const merged: AssetTransfersWithMetadataResult[] = [
      ...(incoming.transfers ?? []),
      ...(outgoing.transfers ?? []),
    ];

    return merged
      .map((t) => ({
        hash: t.hash,
        from: t.from ?? null,
        to: t.to ?? null,
        rawValue: decodeRaw(t.rawContract),
        blockNumber: BigInt(t.blockNum),
        timestamp: t.metadata?.blockTimestamp
          ? Math.floor(new Date(t.metadata.blockTimestamp).getTime() / 1000)
          : null,
      }))
      .sort((a, b) => Number(b.blockNumber - a.blockNumber))
      .slice(0, limit);
  } catch {
    return null;
  }
}

/** Every transfer into a burn sink — the Final Act ledger. */
export async function fetchBurnTransfers(
  token: Address,
  limit = 50,
): Promise<TransferRecord[] | null> {
  const alchemy = getAlchemy();
  if (!alchemy) return null;
  try {
    const results = await Promise.all(
      BURN_ADDRESSES.map((sink) =>
        alchemy.core.getAssetTransfers({ ...baseParams(token, limit), toAddress: sink }),
      ),
    );

    return results
      .flatMap((r): AssetTransfersWithMetadataResult[] => r.transfers ?? [])
      .map((t) => ({
        hash: t.hash,
        from: t.from ?? null,
        to: t.to ?? null,
        rawValue: decodeRaw(t.rawContract),
        blockNumber: BigInt(t.blockNum),
        timestamp: t.metadata?.blockTimestamp
          ? Math.floor(new Date(t.metadata.blockTimestamp).getTime() / 1000)
          : null,
      }))
      .sort((a, b) => Number(b.blockNumber - a.blockNumber))
      .slice(0, limit);
  } catch {
    return null;
  }
}

/* -------------------------------------------------------------------------- */
/*  Blocks                                                                     */
/* -------------------------------------------------------------------------- */

export async function fetchLatestBlock(): Promise<bigint | null> {
  const alchemy = getAlchemy();
  if (!alchemy) return null;
  try {
    return BigInt(await alchemy.core.getBlockNumber());
  } catch {
    return null;
  }
}

export const TOKEN_UNIT_DECIMALS = TOKEN_DECIMALS;
