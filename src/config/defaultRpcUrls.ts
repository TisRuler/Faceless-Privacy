import { SupportedChainId } from "../shared/types";

export const DEFAULT_RPC_URLS: Record<SupportedChainId, string[]> = {
  1: [
    "https://eth-pokt.nodies.app",
    "https://eth.llamarpc.com",
    "https://ethereum-rpc.publicnode.com",
    "https://endpoints.omniatech.io/v1/eth/mainnet/public",
  ],
  56: [
    "https://bsc-rpc.publicnode.com",
    "https://binance.llamarpc.com",
    "https://bsc.drpc.org",
    "https://bsc.api.pocket.network"
  ],
  137: [
    "https://polygon-bor-rpc.publicnode.com",
    "https://polygon.drpc.org",
    "https://endpoints.omniatech.io/v1/matic/mainnet/public"
  ],
  //   80002: [
  //     "https://polygon-amoy.drpc.org",
  //     "https://rpc-amoy.polygon.technology",
  //     "https://polygon-amoy.blockpi.network/v1/rpc/public",
  //   ],
  42161: [
    "https://arbitrum-one-rpc.publicnode.com",
    "https://arbitrum.drpc.org",
    "https://arbitrum.llamarpc.com",
    "https://arb-one.api.pocket.network",
  ],
  11155111: [
    "https://ethereum-sepolia-rpc.publicnode.com",
    "https://endpoints.omniatech.io/v1/eth/sepolia/public",
    "https://ethereum-sepolia-rpc.publicnode.com",
    "https://eth-sepolia-testnet.api.pocket.network"
  ],
};