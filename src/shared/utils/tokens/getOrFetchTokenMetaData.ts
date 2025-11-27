import {
  getTokenUri,
  getCachedEthersERC20Contract,
  getCachedTokenMetadata,
  setCachedTokenMetadata,
  getCachedTokenDecimals,
} from "~~/src/shared/utils/tokens";
import { isAddress } from "ethers";
import { dedupeAsyncCall } from "../other/dedupeAsyncCall";
import { ChainData } from "~~/src/config/chains/types";
import { withRetry } from "./withRetry";

// internal function
async function fetchTokenMetadata(network: ChainData, tokenAddress: string) {
  const tokenContract = await getCachedEthersERC20Contract(network.id, tokenAddress);

  const [name, symbol, decimals] = await Promise.all([
    withRetry(() => tokenContract.name(), "tokenContract.name()"),
    withRetry(() => tokenContract.symbol(), "tokenContract.symbol()"),
    withRetry(() => getCachedTokenDecimals(network.id, tokenContract, tokenAddress), "getCachedTokenDecimals(network.id, tokenContract, tokenAddress)"),
  ]);

  const logoURI = getTokenUri(network, tokenAddress);
  const newMetadata = { name, symbol, decimals, logoURI };

  setCachedTokenMetadata(network.id, tokenAddress, newMetadata);
  return newMetadata;
}

// Without dedupe
export const getOrFetchTokenMetaData = async (configuredNetwork: ChainData, tokenAddress: string) => {

  if (!isAddress(tokenAddress)) {
    throw new Error(`Invalid token address: ${tokenAddress}`);
  }

  const cachedMetadata = getCachedTokenMetadata(configuredNetwork.id, tokenAddress);

  if (cachedMetadata) return cachedMetadata;

  return await fetchTokenMetadata(configuredNetwork, tokenAddress);
};

// Deduped version
export const getOrFetchTokenMetaDataDeduped = async (configuredNetwork: ChainData, tokenAddress: string) => {
  if (!isAddress(tokenAddress)) {
    throw new Error(`Invalid token address: ${tokenAddress}`);
  }

  const key = `metadata:${configuredNetwork.id}:${tokenAddress}`;
  return await dedupeAsyncCall(key, () => fetchTokenMetadata(configuredNetwork, tokenAddress));
};
