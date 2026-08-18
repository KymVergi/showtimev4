"use client";

import { useAccount, useSwitchChain } from "wagmi";
import { mainnet } from "wagmi/chains";

/**
 * SHOWTIME plays one venue. If a wallet arrives on another chain the UI shows
 * WRONG NETWORK / SWITCH TO ETHEREUM MAINNET and offers exactly one target.
 */
export function useNetworkGuard() {
  const { isConnected, chainId } = useAccount();
  const { switchChain, isPending, error } = useSwitchChain();

  const wrongNetwork = isConnected && chainId !== mainnet.id;

  return {
    wrongNetwork,
    currentChainId: chainId ?? null,
    isSwitching: isPending,
    switchError: error?.message ?? null,
    switchToMainnet: () => switchChain({ chainId: mainnet.id }),
  };
}

export default useNetworkGuard;
