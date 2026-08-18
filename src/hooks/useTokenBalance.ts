"use client";

import { useAccount, useReadContract } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import type { Address } from "viem";

import { tokenAbi } from "@/lib/contracts";
import { CHAIN_ID, TOKEN_ADDRESS } from "@/config/project";
import { fetchWalletTransfers, ALCHEMY_CONFIGURED } from "@/lib/alchemy";
import { isDemo } from "@/lib/demo";
import { LOADING, NOT_CONFIGURED, UNAVAILABLE, metric, type Metric } from "@/types/showtime";
import type { WalletTicket } from "@/types/token";

export interface UseTicketResult {
  connected: boolean;
  ticket: WalletTicket | null;
  isLoading: boolean;
  configured: boolean;
}

/**
 * "YOUR TICKET" — the connected wallet's standing in the show.
 *
 * `claimable` is deliberately reported as NOT CONFIGURED unless the deployed
 * Hook ABI exposes a claim function. The site never invents a claim mechanic.
 */
export function useTokenBalance(): UseTicketResult {
  const { address, isConnected } = useAccount();
  const configured = TOKEN_ADDRESS !== null;

  const balanceQuery = useReadContract({
    address: TOKEN_ADDRESS ?? undefined,
    abi: tokenAbi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    chainId: CHAIN_ID,
    query: { enabled: Boolean(address && configured), staleTime: 30_000 },
  });

  const transfersQuery = useQuery({
    queryKey: ["showtime", "wallet-transfers", address],
    enabled: Boolean(address && configured && ALCHEMY_CONFIGURED && !isDemo),
    staleTime: 60_000,
    queryFn: () =>
      address && TOKEN_ADDRESS ? fetchWalletTransfers(address, TOKEN_ADDRESS) : null,
  });

  if (!isConnected || !address) {
    return { connected: false, ticket: null, isLoading: false, configured };
  }

  if (!configured) {
    return {
      connected: true,
      configured: false,
      isLoading: false,
      ticket: {
        address: address as Address,
        balance: NOT_CONFIGURED,
        totalReceived: NOT_CONFIGURED,
        claimable: NOT_CONFIGURED,
        lastActivity: NOT_CONFIGURED,
      },
    };
  }

  const isLoading = balanceQuery.isLoading || transfersQuery.isLoading;

  const balance: Metric<bigint> = balanceQuery.isLoading
    ? LOADING
    : typeof balanceQuery.data === "bigint"
      ? metric(balanceQuery.data, "chain")
      : UNAVAILABLE;

  const transfers = transfersQuery.data ?? null;

  const totalReceived: Metric<bigint> = !ALCHEMY_CONFIGURED
    ? NOT_CONFIGURED
    : transfersQuery.isLoading
      ? LOADING
      : transfers === null
        ? UNAVAILABLE
        : metric(
            transfers
              .filter((t) => t.to?.toLowerCase() === address.toLowerCase())
              .reduce<bigint>((acc, t) => acc + (t.rawValue ?? 0n), 0n),
            "chain",
          );

  const lastActivity: Metric<number> = !ALCHEMY_CONFIGURED
    ? NOT_CONFIGURED
    : transfersQuery.isLoading
      ? LOADING
      : transfers && transfers.length > 0 && transfers[0].timestamp
        ? metric(transfers[0].timestamp, "chain")
        : UNAVAILABLE;

  return {
    connected: true,
    configured: true,
    isLoading,
    ticket: {
      address: address as Address,
      balance,
      totalReceived,
      // No claim mechanic exists until the Hook ABI proves one does.
      claimable: NOT_CONFIGURED,
      lastActivity,
    },
  };
}

export default useTokenBalance;
