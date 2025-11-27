import { parseUnits } from "ethers";
import { SupportedChainId } from "~~/src/shared/types";
import { getCachedEthersERC20Contract, getCachedTokenDecimals } from "~~/src/shared/utils/tokens";

export async function stringAmountToBigint(chainId: SupportedChainId, tokenAddress: string, amount: string): Promise<bigint> {
  const tokenContract = await getCachedEthersERC20Contract(chainId, tokenAddress);
  const tokenDecimals = await getCachedTokenDecimals(chainId, tokenContract, tokenAddress);

  return parseUnits(amount, tokenDecimals);
};