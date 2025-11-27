import { formatEther, JsonRpcProvider, FallbackProvider } from "ethers";
import { getCachedTokenPrice, withRetry } from "~~/src/shared/utils/tokens";
import { tokenDataFallback } from "~~/src/constants/tokenDataFallback";
import { UserToken } from "~~/src/shared/types";
import { logError } from "~~/src/shared/utils/other/logError";
import { ChainData } from "~~/src/config/chains/types";

export const getPublicBaseTokenBalance = async (
  network: ChainData,
  provider: JsonRpcProvider | FallbackProvider,
  publicAddress: string
): Promise<UserToken> => {
  const { publicModeBaseToken, id: chainId } = network;

  try {
    let tokenPrice: number | undefined;
    let balance: bigint | undefined;

    if (!publicModeBaseToken.address) {
      throw new Error("Missing publicModeBaseToken address");
    }

    try {
      balance = await withRetry(
        () => provider.getBalance(publicAddress),
        "getBalance"
      );
    } catch {
      balance = undefined;
    }

    const formattedBalance = balance !== undefined
      ? formatEther(balance)
      : undefined;

    try {
      tokenPrice = await withRetry(
        () => getCachedTokenPrice(network, publicModeBaseToken.address),
        "getCachedTokenPrice"
      );
    } catch {
      tokenPrice = undefined;
    }

    const isInvalidPrice = !tokenPrice || isNaN(tokenPrice);

    const totalValueInUsd = (!isInvalidPrice && formattedBalance)
      ? (parseFloat(formattedBalance) * tokenPrice!).toString()
      : undefined;  

    return {
      chainId,
      address: publicModeBaseToken.address,
      name: publicModeBaseToken.name,
      symbol: publicModeBaseToken.symbol,
      decimals: publicModeBaseToken.decimals,
      balance: formattedBalance,
      totalValueInUsd,
      logoURI: publicModeBaseToken.logoURI,
      isBaseToken: true,
    };
  } catch (error) {
    logError(error);
    return tokenDataFallback(network, publicModeBaseToken.address);
  }
};
