import { formatUnits } from "ethers";
import { SupportedChainId } from "~~/src/shared/types";
import { getCachedEthersERC20Contract, getCachedTokenDecimals } from "~~/src/shared/utils/tokens";

export const formatTokenAmountFromHex = async (hexString: string, tokenAddress: string, chainId: SupportedChainId): Promise<string> => {

  const decimalValue = BigInt(hexString).toString();

  const tokenContract = await getCachedEthersERC20Contract(chainId, tokenAddress);

  const decimals = await getCachedTokenDecimals(chainId, tokenContract, tokenAddress);

  const numberBalance = parseFloat(formatUnits(decimalValue, decimals));

  return numberBalance.toString();
};
