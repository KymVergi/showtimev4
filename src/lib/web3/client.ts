import { createPublicClient, http, type PublicClient } from "viem";
import { mainnet } from "viem/chains";

import { RPC_URL } from "@/config/project";

let client: PublicClient | undefined;

/**
 * Read-only Ethereum Mainnet client. Used for direct contract reads and log
 * queries. Returns `null` when no RPC has been configured so callers can show
 * "SHOW INTERRUPTED" rather than silently failing.
 */
export function getPublicClient(): PublicClient | null {
  if (!RPC_URL) return null;
  if (!client) {
    client = createPublicClient({
      chain: mainnet,
      transport: http(RPC_URL, { batch: true, retryCount: 2 }),
    }) as PublicClient;
  }
  return client;
}
