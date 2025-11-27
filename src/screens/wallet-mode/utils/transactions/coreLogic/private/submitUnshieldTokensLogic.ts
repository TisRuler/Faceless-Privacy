import { SharedSubmitParams, DataForPrivateModeTxSubmission } from "~~/src/screens/wallet-mode/types";
import { sendPrivateModeTx, populateUnshield, getOverallBatchMinGasPrice } from "../../proccessors";
import { generateUnshieldProof } from "@railgun-community/wallet";
import { requestEncryptionKey } from "~~/src/shared/bus/encryptionKeyBus";

type SubmitUnshieldTokensLogic = {
    sharedSubmitParams: SharedSubmitParams,
    dataForPrivateModeTxSubmission: DataForPrivateModeTxSubmission,
};
  
export async function submitUnshieldTokensLogic({
  sharedSubmitParams,
  dataForPrivateModeTxSubmission,
}: SubmitUnshieldTokensLogic) {

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
    erc20AmountRecipients,
    selectedBroadcaster,
    transactionGasDetails,
    broadcasterFeeERC20AmountRecipient,
  } = dataForPrivateModeTxSubmission;

  const overallBatchMinGasPrice = await getOverallBatchMinGasPrice(
    isUsingSelfSignMethod, 
    transactionGasDetails
  );

  // Generate and populate unshield token proof
  await generateUnshieldProof(
    txIDVersion, network, railgunWalletId, await requestEncryptionKey(),
        erc20AmountRecipients!, [], broadcasterFeeERC20AmountRecipient, isUsingSelfSignMethod,
        overallBatchMinGasPrice, progressCallback
  );

  // Prepare Transaction
  const transaction = await populateUnshield(
    isUsingSelfSignMethod, txIDVersion, network, railgunChain,
    railgunWalletId, erc20AmountRecipients!, broadcasterFeeERC20AmountRecipient,
    overallBatchMinGasPrice, transactionGasDetails!, selectedBroadcaster, false
  );

  // Submit Tx
  const txHash = await sendPrivateModeTx(
    isUsingSelfSignMethod, 
    transaction
  );
    
  return txHash;
};
