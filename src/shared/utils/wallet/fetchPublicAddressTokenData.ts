import { Contract, formatUnits } from "ethers";
import {
  getCachedTokenPrice,
  getCachedEthersERC20Contract,
  getOrFetchTokenMetaData,
  getCachedTokenDecimals,
  withRetry
} from "~~/src/shared/utils/tokens";
import { ChainData } from "~~/src/config/chains/types";
import { tokenDataFallback } from "~~/src/constants/tokenDataFallback";
import { logError } from "~~/src/shared/utils/other/logError";
import { UserToken } from "~~/src/shared/types";

/**
 * Fetches token metadata and balance for a given wallet.
 */
export const fetchPublicAddressTokenData = async (
  network: ChainData,
  tokenAddress: string,
  walletAddress: string
): Promise<UserToken> => {
  try {
    const contract = await getCachedEthersERC20Contract(network.id, tokenAddress);
    const decimals = await getCachedTokenDecimals(network.id, contract, tokenAddress);

    const { balance, totalValueInUsd } = await getTokenBalanceAndValue(
      contract,
      walletAddress,
      decimals,
      network,
      tokenAddress
    );

    const tokenMetaData = await getOrFetchTokenMetaData(network, tokenAddress);

    return {
      chainId: network.id,
      address: tokenAddress,
      balance,
      totalValueInUsd,
      additionalInfo: network.popularTokenMetadata[tokenAddress.toLowerCase()]?.additionalInfo,
      ...tokenMetaData,
    };
  } catch (error) {
    logError(error);
    return tokenDataFallback(network, tokenAddress);
  }
};

/**
 * Fetches token balance and calculates its USD value.
 */
const getTokenBalanceAndValue = async (
  contract: Contract,
  walletAddress: string,
  decimals: number,
  network: ChainData,
  tokenAddress: string
): Promise<{ balance: string | undefined; totalValueInUsd: string | undefined }> => {
  let tokenPrice: number | undefined;
  let rawBalance: bigint | undefined;
    
  // Handle handle raw balance
  try {
    rawBalance = await withRetry(() => contract.balanceOf(walletAddress), "contract.balanceOf(walletAddress)");
  } catch (error) {
    rawBalance = undefined;
  }

  if (rawBalance === 0n) {
    return { balance: "0", totalValueInUsd: "0" };
  }

  // Handle Balance Formatting
  const balance = rawBalance ? formatUnits(rawBalance, decimals) : undefined;

  // Handle Value
  try {
    tokenPrice = await getCachedTokenPrice(network, tokenAddress);
  } catch (error) {
    tokenPrice = undefined;
  }

  if (!tokenPrice || tokenPrice === 0) {
    return { balance, totalValueInUsd: undefined };
  }

  const totalValue = balance ? (parseFloat(balance) * tokenPrice).toString() : undefined;

  return { balance, totalValueInUsd: totalValue };
};
