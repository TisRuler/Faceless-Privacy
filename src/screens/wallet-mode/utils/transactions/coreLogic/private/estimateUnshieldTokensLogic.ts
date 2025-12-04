import { 
  getGasEstimateForUnprovenUnshield, 
  getBaseGasFees, 
  calculateFeesToDisplay, 
  getBroadcasterFeeRaw, 
  getBroadcasterFeeERC20AmountRecipient, 
  getSelectedBroadcaster 
} from "../../proccessors";
import { RailgunERC20AmountRecipient } from "@railgun-community/shared-models";
import { stringAmountToBigint } from "~~/src/screens/wallet-mode/utils/transactions/coreLogic/helper/stringAmountToBigInt";
import { getActiveNetwork, getEthersProvider } from "~~/src/shared/utils/network";
import { SharedEstimateParams } from "~~/src/screens/wallet-mode/types";
import { validateReceiverAddress, validatePrivateModeFee, validateAmount, createFeeTokenDetails } from "../helper";
import { requestEncryptionKey } from "~~/src/shared/bus/encryptionKeyBus";
import { SendableToken } from "~~/src/shared/types";

type EstimateUnshieldTokensLogic = {
  sharedPrivateModeEstimateParams: SharedEstimateParams,
  tokenToSend: SendableToken,
};

export async function estimateUnshieldTokensLogic({
  sharedPrivateModeEstimateParams,
  tokenToSend,
}: EstimateUnshieldTokensLogic) {

  const { privateModeBaseToken, id: chainId, supportsEIP1559 } = getActiveNetwork();

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
  validateReceiverAddress(recipientAddress, false);
  validateAmount(amount);
  validatePrivateModeFee(
    isUsingSelfSignMethod, 
    broadcasterFeeToken.address, 
    privateModeBaseToken.address
  );

  const provider = getEthersProvider();
    
  const { selectedBroadcaster } = await getSelectedBroadcaster(isUsingSelfSignMethod);

  const feeTokenDetails = createFeeTokenDetails(
    isUsingSelfSignMethod, 
    broadcasterFeeToken.address, 
    selectedBroadcaster
  );

  const {
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

  const transactionGasDetails = await getGasEstimateForUnprovenUnshield(
    network, 
    isUsingSelfSignMethod, 
    railgunWalletId, 
    gasPriceInWei, 
    maxFeePerGasInWei, 
    maxPriorityFeePerGasInWei, 
    feeTokenDetails, 
    txIDVersion,
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

  const dataForPrivateModeTxSubmission = {
    transactionGasDetails,
    selectedBroadcaster,
    broadcasterFeeRaw,
    erc20AmountRecipients,
    broadcasterFeeERC20AmountRecipient
  };

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
    false,
    isUsingSelfSignMethod,
    gasPriceInWei,
    broadcasterFeeRaw, 
    transactionGasDetails.gasEstimate,
    broadcasterFeeToken,
  ))!;

  const feeDataToDisplay = {
    broadcasterFee,
    railgunFee,
    networkFee,
    totalFee,
    showTotalFee,
  };

  return { feeDataToDisplay, dataForPrivateModeTxSubmission };
};