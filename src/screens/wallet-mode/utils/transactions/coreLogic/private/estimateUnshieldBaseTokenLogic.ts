import { 
  getBaseGasFees, 
  getGasEstimateForUnprovenUnshieldBaseToken, 
  calculateFeesToDisplay, 
  getBroadcasterFeeRaw, 
  getSelectedBroadcaster 
} from "../../proccessors";
import { RailgunERC20Amount } from "@railgun-community/shared-models";
import { stringAmountToBigint } from "~~/src/screens/wallet-mode/utils/transactions/coreLogic/helper/stringAmountToBigInt";
import { getActiveNetwork, getEthersProvider } from "~~/src/shared/utils/network";
import { SharedEstimateParams } from"~~/src/screens/wallet-mode/types";
import { 
  validateReceiverAddress, 
  validateAmount, 
  validatePrivateModeFee, 
  createFeeTokenDetails 
} from "../helper";
import { requestEncryptionKey } from "~~/src/shared/bus/encryptionKeyBus";

type EstimateUnshieldBaseTokenLogic = {
  sharedPrivateModeEstimateParams: SharedEstimateParams,
};
  
export async function estimateUnshieldBaseTokenLogic({
  sharedPrivateModeEstimateParams
}: EstimateUnshieldBaseTokenLogic) {

  const { id: chainId, privateModeBaseToken, supportsEIP1559 } = getActiveNetwork();

  const { 
    corePrivateModeActionParams: {
      network,
      txIDVersion,
      railgunWalletId,
      isUsingSelfSignMethod,
    },
    broadcasterFeeToken,
    recipientAddress,
    amount,
    gasChoiceDefault,
    customGweiAmount
  } = sharedPrivateModeEstimateParams;
    
  // Validate Inputs
  validateAmount(amount);
  validateReceiverAddress(recipientAddress, false); 
  validatePrivateModeFee(
    isUsingSelfSignMethod, 
    broadcasterFeeToken.address, 
    privateModeBaseToken.address
  );

  const provider = getEthersProvider();
    
  const baseTokenAmount: RailgunERC20Amount = {
    tokenAddress: privateModeBaseToken.address,
    amount: await stringAmountToBigint(chainId, privateModeBaseToken.address, amount)
  };

  // Get broadcaster details
  const { selectedBroadcaster } = await getSelectedBroadcaster(isUsingSelfSignMethod);

  // Create fee token details
  const feeTokenDetails = createFeeTokenDetails(
    isUsingSelfSignMethod, 
    broadcasterFeeToken.address, 
    selectedBroadcaster
  );

  // Get base gas fees
  const {
    gasPriceInGwei, 
    gasPriceInWei, 
    maxFeePerGasInWei, 
    maxPriorityFeePerGasInWei
  } = await getBaseGasFees(gasChoiceDefault, customGweiAmount, supportsEIP1559, provider);

  // Estimate transaction gas details
  const transactionGasDetails = await getGasEstimateForUnprovenUnshieldBaseToken(
    network, 
    isUsingSelfSignMethod, 
    railgunWalletId, 
    gasPriceInWei, 
    maxFeePerGasInWei, 
    maxPriorityFeePerGasInWei, 
    feeTokenDetails, 
    txIDVersion, 
    recipientAddress, 
    await requestEncryptionKey(), 
    baseTokenAmount
  );

  // Get unformatted broadcaster fee
  const broadcasterFeeRaw = await getBroadcasterFeeRaw(
    feeTokenDetails, 
    transactionGasDetails
  );

  // Update states so the data is available for the Unshield Tx submission
  const dataForBaseTokenSubmission = {
    transactionGasDetails,
    selectedBroadcaster,
    broadcasterFeeRaw,
    baseTokenAmount
  };

  // Calculate and format fees for display
  const { 
    networkFee, 
    railgunFee,
    broadcasterFee, 
    totalFee,
    showTotalFee,
  } = (await calculateFeesToDisplay(
    amount,
    privateModeBaseToken,
    privateModeBaseToken,
    false,
    isUsingSelfSignMethod,
    gasPriceInGwei,
    broadcasterFeeRaw, 
    transactionGasDetails.gasEstimate,
    broadcasterFeeToken
  ))!;

  // Update Fee UI states
  const feeDataToDisplay = {
    broadcasterFee,
    railgunFee,
    networkFee,
    totalFee,
    showTotalFee,
  };

  return { feeDataToDisplay, dataForBaseTokenSubmission };
};