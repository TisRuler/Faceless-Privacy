import { 
  getBaseGasFees, 
  getGasEstimateForUnprovenTransfer, 
  calculateFeesToDisplay, 
  getBroadcasterFeeRaw, 
  getBroadcasterFeeERC20AmountRecipient, 
  getSelectedBroadcaster 
} from "../../proccessors";
import { getActiveNetwork, getEthersProvider } from "~~/src/shared/utils/network";
import { RailgunERC20AmountRecipient } from "@railgun-community/shared-models";
import { stringAmountToBigint } from "~~/src/screens/wallet-mode/utils/transactions/coreLogic/helper/stringAmountToBigInt";
import { SharedEstimateParams } from "~~/src/screens/wallet-mode/types";
import { validateReceiverAddress, validateAmount , validatePrivateModeFee, createFeeTokenDetails} from "../helper";
import { requestEncryptionKey } from "~~/src/shared/bus/encryptionKeyBus";
import { SendableToken } from "~~/src/shared/types";

type EstimateTokenTransferLogicParams = {
  sharedPrivateModeEstimateParams: SharedEstimateParams;
  tokenToSend: SendableToken;
  memoText: string;
};

export async function estimatePrivateTokenTransferLogic({
  sharedPrivateModeEstimateParams,
  tokenToSend,
  memoText,
}: EstimateTokenTransferLogicParams) {
    
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
    customGweiAmount,
  } = sharedPrivateModeEstimateParams;

  // Validate Inputs
  validateAmount(amount);
  validateReceiverAddress(recipientAddress, true);
  validatePrivateModeFee(
    isUsingSelfSignMethod, 
    broadcasterFeeToken.address, 
    privateModeBaseToken.address
  );

  const provider = getEthersProvider();

  // Get wallet transaction sender and broadcaster details
  const { selectedBroadcaster } = await getSelectedBroadcaster(isUsingSelfSignMethod);

  // Create fee token details
  const feeTokenDetails = createFeeTokenDetails(
    isUsingSelfSignMethod, 
    broadcasterFeeToken.address, 
    selectedBroadcaster
  );

  // Get gas prices
  const {
    gasPriceInGwei, 
    gasPriceInWei, 
    maxFeePerGasInWei, 
    maxPriorityFeePerGasInWei
  } = await getBaseGasFees(gasChoiceDefault, customGweiAmount, supportsEIP1559, provider);

  const erc20AmountRecipients: RailgunERC20AmountRecipient[] = [
    {
      tokenAddress: tokenToSend.address,
      amount: await stringAmountToBigint(chainId, tokenToSend.address, amount),
      recipientAddress: recipientAddress,
    },
  ];

  const transactionGasDetails = await getGasEstimateForUnprovenTransfer(
    network, 
    isUsingSelfSignMethod, 
    railgunWalletId, 
    memoText,
    gasPriceInWei, 
    maxFeePerGasInWei, 
    maxPriorityFeePerGasInWei, 
    feeTokenDetails, 
    txIDVersion, 
    recipientAddress, 
    await requestEncryptionKey(), 
    erc20AmountRecipients
  );

  const broadcasterFeeRaw = await getBroadcasterFeeRaw(
    feeTokenDetails, 
    transactionGasDetails
  );

  const broadcasterFeeERC20AmountRecipient = await getBroadcasterFeeERC20AmountRecipient(
    isUsingSelfSignMethod, 
    broadcasterFeeToken.address, 
    broadcasterFeeRaw, 
    selectedBroadcaster?.railgunAddress
  );

  // Update states so the data is available for the Unshield Tx submission
  const dataForPrivateModeTxSubmission = {
    transactionGasDetails,
    selectedBroadcaster,
    broadcasterFeeRaw,
    erc20AmountRecipients,
    broadcasterFeeERC20AmountRecipient
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
    tokenToSend,
    true,
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
    
  return {feeDataToDisplay, dataForPrivateModeTxSubmission};
};