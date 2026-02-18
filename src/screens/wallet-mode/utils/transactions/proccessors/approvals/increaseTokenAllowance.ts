import { Contract, parseUnits, JsonRpcSigner } from "ethers";
import { getCachedEthersERC20Contract, getCachedTokenDecimals } from "~~/src/shared/utils/tokens";
import { WALLET_MODE_NOTIFICATIONS } from "~~/src/constants/notifications";
import { isUserRejectionError } from "~~/src/shared/utils/other/isUserRejectionError";
import { SupportedChainId } from "~~/src/shared/types";
import { GENERAL_NOTIFICATIONS } from "~~/src/constants/notifications";
import { throwErrorWithTitle } from "~~/src/shared/utils/other/throwErrorWithTitle";
import ERC20Abi from "~~/src/assets/abis/ERCAbi.json";

export const increaseTokenAllowance = async (
  tokenAddress: string,
  publicAddress: string,
  amount: string,
  anonymityPoolAddress: string,
  publicWalletSigner: JsonRpcSigner,
  chainId: SupportedChainId,
) => {
  try {

    const tokenContractReadOnly = await getCachedEthersERC20Contract(chainId, tokenAddress);
    const allowance = await tokenContractReadOnly.allowance(publicAddress, anonymityPoolAddress);
    const tokenDecimals = await getCachedTokenDecimals(chainId, tokenContractReadOnly, tokenAddress);
    const formattedAmountToShield = parseUnits(amount, tokenDecimals);

    const tokenContractWithSigner = new Contract(tokenAddress, ERC20Abi, publicWalletSigner);
    const neededIncrease = formattedAmountToShield - allowance;

    // Attempt to increase allowance not all contracts work for this, so if it fails, use a fallback method
    const tx = await tokenContractWithSigner.increaseAllowance(anonymityPoolAddress, neededIncrease);
    return tx;
    
  } catch (error) {
    if (isUserRejectionError(error)) {
      throwErrorWithTitle(GENERAL_NOTIFICATIONS.USER_REJECTION, error);
    } else {
      throwErrorWithTitle(WALLET_MODE_NOTIFICATIONS.TOKEN_APPROVAL_ERROR, error);
    }
  }
};