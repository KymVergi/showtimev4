import { Alchemy, Network } from "alchemy-sdk";

import { ALCHEMY_API_KEY } from "@/config/project";

let alchemy: Alchemy | undefined;

/**
 * Alchemy client pinned to Ethereum Mainnet.
 * Returns `null` when unconfigured — the UI then renders "DATA UNAVAILABLE"
 * instead of fabricating values.
 */
export function getAlchemy(): Alchemy | null {
  if (!ALCHEMY_API_KEY) return null;
  if (!alchemy) {
    alchemy = new Alchemy({
      apiKey: ALCHEMY_API_KEY,
      network: Network.ETH_MAINNET,
    });
  }
  return alchemy;
}

export const ALCHEMY_CONFIGURED = ALCHEMY_API_KEY !== null;
