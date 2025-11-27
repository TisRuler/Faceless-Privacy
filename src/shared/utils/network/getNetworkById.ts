import { masterConfig } from "~~/src/config/masterConfig";
import { ChainData } from "~~/src/config/chains/types";

export function getNetworkById(chainId: number): ChainData {
  return masterConfig.networks[chainId as keyof typeof masterConfig.networks];
};