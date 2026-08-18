import {
  createConfig,
  http,
  cookieStorage,
  createStorage,
  type CreateConnectorFn,
} from "wagmi";
import { mainnet } from "wagmi/chains";
import { injected, walletConnect, coinbaseWallet } from "wagmi/connectors";
import type { Transport } from "viem";

import { RPC_URL, WALLETCONNECT_PROJECT_ID } from "@/config/project";

/**
 * SHOWTIME runs on Ethereum Mainnet and only Ethereum Mainnet.
 * There is deliberately no chain array, no selector, and no switcher target
 * other than `mainnet`.
 */
export const SUPPORTED_CHAIN = mainnet;

const transport: Transport = RPC_URL
  ? http(RPC_URL, { batch: true, retryCount: 2 })
  : http(); // falls back to the chain's public RPC

function buildConnectors(): CreateConnectorFn[] {
  const connectors: CreateConnectorFn[] = [
    injected({ shimDisconnect: true }),
    coinbaseWallet({
      appName: "SHOWTIME",
      appLogoUrl: "/images/showtime-marquee.webp",
    }),
  ];

  if (WALLETCONNECT_PROJECT_ID) {
    connectors.push(
      walletConnect({
        projectId: WALLETCONNECT_PROJECT_ID,
        showQrModal: true,
        metadata: {
          name: "SHOWTIME",
          description:
            "SHOWTIME is a programmable Uniswap V4 Hook experiment where every trade becomes part of the show.",
          url: "https://showtime.example",
          icons: [],
        },
      }),
    );
  }

  return connectors;
}

let cached: ReturnType<typeof createConfig> | undefined;

export function getWagmiConfig() {
  if (!cached) {
    cached = createConfig({
      chains: [mainnet],
      connectors: buildConnectors(),
      transports: { [mainnet.id]: transport },
      ssr: true,
      storage: createStorage({ storage: cookieStorage }),
    });
  }
  return cached;
}

export const wagmiConfig = getWagmiConfig();

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}
