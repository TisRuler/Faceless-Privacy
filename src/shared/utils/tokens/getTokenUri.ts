import { ChainData } from "~~/src/config/chains/types";

export function getTokenUri(network: ChainData, tokenAddress: string): string | undefined {

  const { popularTokenMetadata } = network;

  if (popularTokenMetadata) {
    const lowercaseAddress = tokenAddress.toLowerCase();
    const contractData = popularTokenMetadata[lowercaseAddress];
    if (contractData) {
      return contractData.logoUri;
    }
  }

  return undefined;
};