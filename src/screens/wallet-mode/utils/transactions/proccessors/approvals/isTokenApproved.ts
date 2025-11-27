import { parseUnits } from "ethers";
import { getCachedEthersERC20Contract, getCachedTokenDecimals } from "~~/src/shared/utils/tokens";
import { WALLET_MODE_NOTIFICATIONS } from "~~/src/constants/notifications";
import { throwErrorWithTitle } from "~~/src/shared/utils/other/throwErrorWithTitle";

export const isTokenApproved = async (
  tokenAddress: string,
  publicAddress: string,
  amount: string,
  anonymityPoolAddress: string,
  chainId: number
): Promise<boolean> => {
  try {
    const tokenContract = await getCachedEthersERC20Contract(chainId, tokenAddress);
    
    const [allowance, tokenDecimals] = await Promise.all([
      tokenContract.allowance(publicAddress, anonymityPoolAddress),
      getCachedTokenDecimals(chainId, tokenContract, tokenAddress),
    ]);

    const formattedAmount = parseUnits(amount, tokenDecimals);

    return allowance >= formattedAmount; // returns true if the allowance is large enough for the Tx
  } catch (error) {
    throwErrorWithTitle(WALLET_MODE_NOTIFICATIONS.TOKEN_APPROVAL_ERROR, error);
  }
};