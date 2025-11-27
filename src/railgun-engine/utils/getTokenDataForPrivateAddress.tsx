import { formatUnits } from "ethers";
import { getActiveNetwork } from "~~/src/shared/utils/network";
import { getCachedTokenPrice, getOrFetchTokenMetaDataDeduped } from "~~/src/shared/utils/tokens";
import { tokenDataFallback } from "~~/src/constants/tokenDataFallback";
import { RailgunERC20Amount } from "@railgun-community/shared-models";
import { logError } from "~~/src/shared/utils/other/logError";
import { ChainData } from "~~/src/config/chains/types";
import { UserToken } from "~~/src/shared/types";

export const getTokenDataForPrivateAddress = async (
  token: RailgunERC20Amount
): Promise<UserToken | null> => {
  if (token.amount === 0n) return null;

  const network = getActiveNetwork();

  try {
    const metaData = await getOrFetchTokenMetaDataDeduped(network, token.tokenAddress);

    const { balance, totalValueInUsd } = await getTokenBalance(token, metaData.decimals, network);

    return {
      chainId: network.id,
      address: token.tokenAddress,
      ...metaData,
      balance,
      totalValueInUsd,
    };
  } catch (error) {
    logError(error);
    return tokenDataFallback(network, token.tokenAddress);
  }
};

export const getTokenBalance = async (
  token: RailgunERC20Amount,
  tokenDecimals: number,
  network: ChainData
): Promise<{ balance: string | undefined; totalValueInUsd: string | undefined }> => {
  let tokenPrice: number | undefined;
  
  const balance = formatUnits(token.amount, tokenDecimals);

  // Handle Value
  try {
    tokenPrice = await getCachedTokenPrice(network, token.tokenAddress);
  } catch {
    tokenPrice = undefined;
  }

  if (!tokenPrice || tokenPrice === 0) {
    return { balance, totalValueInUsd: undefined };
  }

  const totalValue = balance ? (parseFloat(balance) * tokenPrice).toString() : undefined;

  return {
    balance,
    totalValueInUsd: totalValue,
  };
};
