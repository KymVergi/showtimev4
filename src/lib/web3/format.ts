import { formatUnits } from "viem";

/** `0x1234…abcd` */
export function shortAddress(address?: string | null, size = 4): string {
  if (!address) return "—";
  if (address.length <= size * 2 + 2) return address;
  return `${address.slice(0, 2 + size)}…${address.slice(-size)}`;
}

export function shortHash(hash?: string | null): string {
  return shortAddress(hash, 6);
}

/**
 * Formats a bigint token amount for display. Returns `null` for nullish input
 * so callers are forced to render an explicit empty state instead of "0".
 */
export function formatAmount(
  value: bigint | null | undefined,
  decimals = 18,
  maximumFractionDigits = 4,
): string | null {
  if (value === null || value === undefined) return null;
  const asString = formatUnits(value, decimals);
  const asNumber = Number(asString);
  if (!Number.isFinite(asNumber)) return asString;
  return asNumber.toLocaleString("en-US", {
    maximumFractionDigits,
    minimumFractionDigits: 0,
  });
}

/** Compact display for very large supplies: 1.24B, 980.4M, 12.5K. */
export function formatCompact(
  value: bigint | null | undefined,
  decimals = 18,
): string | null {
  if (value === null || value === undefined) return null;
  const asNumber = Number(formatUnits(value, decimals));
  if (!Number.isFinite(asNumber)) return null;
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(asNumber);
}

export function formatEth(value: bigint | null | undefined, digits = 4): string | null {
  return formatAmount(value, 18, digits);
}

export function formatInteger(value: number | bigint | null | undefined): string | null {
  if (value === null || value === undefined) return null;
  return Number(value).toLocaleString("en-US");
}

export function formatPercent(value: number | null | undefined, digits = 2): string | null {
  if (value === null || value === undefined || !Number.isFinite(value)) return null;
  return `${value.toFixed(digits)}%`;
}

/** "4m ago", "2h ago", "3d ago" — from unix seconds. */
export function timeAgo(unixSeconds: number | null | undefined): string | null {
  if (!unixSeconds) return null;
  const deltaSeconds = Math.floor(Date.now() / 1000) - unixSeconds;
  if (deltaSeconds < 0) return "just now";
  if (deltaSeconds < 60) return `${deltaSeconds}s ago`;
  const minutes = Math.floor(deltaSeconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

/** Uniswap V4 fee units (hundredths of a bip) → percentage string. */
export function formatPoolFee(fee: string | number | null | undefined): string | null {
  if (fee === null || fee === undefined || fee === "") return null;
  const raw = Number(fee);
  if (!Number.isFinite(raw)) return null;
  // 0x800000 is the dynamic-fee flag in Uniswap V4.
  if (raw === 0x800000) return "DYNAMIC";
  return `${(raw / 10_000).toFixed(2)}%`;
}
