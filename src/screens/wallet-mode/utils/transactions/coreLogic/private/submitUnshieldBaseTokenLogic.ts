import { getActiveNetwork } from "~~/src/shared/utils/network";
import { SharedSubmitParams, DataForBaseTokenSubmission } from "~~/src/screens/wallet-mode/types";
import { 
  sendPrivateModeTx, 
  populateUnshieldBaseToken, 
  getOverallBatchMinGasPrice, 
  getBroadcasterFeeERC20AmountRecipient 
} from "../../proccessors";
import { generateUnshieldBaseTokenProof } from "@railgun-community/wallet";
import { requestEncryptionKey } from "~~/src/shared/bus/encryptionKeyBus";

type SubmitUnshieldBaseTokenLogic = {
  sharedSubmitParams: SharedSubmitParams,
  recipientAddress: string,
  dataForBaseTokenSubmission: DataForBaseTokenSubmission,
};

export async function submitUnshieldBaseTokenLogic({
  sharedSubmitParams,
  recipientAddress,
  dataForBaseTokenSubmission
}: SubmitUnshieldBaseTokenLogic) {

  const { 
    corePrivateModeActionParams: {
      network,
      txIDVersion,
      railgunWalletId,
      isUsingSelfSignMethod,
    },
    railgunChain,
    progressCallback,
  } = sharedSubmitParams;
    
  const {
    broadcasterFeeRaw,
    selectedBroadcaster,
    transactionGasDetails,
    baseTokenAmount,
  } = dataForBaseTokenSubmission;

  const { privateModeBaseToken } = getActiveNetwork();

  try {
    const broadcasterFeeERC20AmountRecipient = await getBroadcasterFeeERC20AmountRecipient(
      isUsingSelfSignMethod, privateModeBaseToken.address, broadcasterFeeRaw, selectedBroadcaster?.railgunAddress
    );

    const overallBatchMinGasPrice = await getOverallBatchMinGasPrice(
      isUsingSelfSignMethod, 
      transactionGasDetails
    );

    // Generate and populate unshield token proof
    await generateUnshieldBaseTokenProof(
      txIDVersion, network, recipientAddress, railgunWalletId, await requestEncryptionKey(),
      baseTokenAmount!, broadcasterFeeERC20AmountRecipient, isUsingSelfSignMethod,
      overallBatchMinGasPrice, progressCallback
    );

    // Prepare Transaction
    const transaction = await populateUnshieldBaseToken(
      isUsingSelfSignMethod, txIDVersion, network, railgunChain, recipientAddress,
      railgunWalletId, baseTokenAmount!, broadcasterFeeERC20AmountRecipient,
      overallBatchMinGasPrice, transactionGasDetails!, selectedBroadcaster, true
    );

    // Submit Tx
    const txHash = await sendPrivateModeTx(
      isUsingSelfSignMethod, 
      transaction
    );
        
    return txHash;

  } catch (error) {
    throw error;
  };  
};