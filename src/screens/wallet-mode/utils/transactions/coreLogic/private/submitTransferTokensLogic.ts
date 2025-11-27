import { sendPrivateModeTx, populateTransfer, getOverallBatchMinGasPrice } from "../../proccessors";
import { generateTransferProof } from "@railgun-community/wallet";
import { DataForPrivateModeTxSubmission, SharedSubmitParams } from "~~/src/screens/wallet-mode/types";
import { requestEncryptionKey } from "~~/src/shared/bus/encryptionKeyBus";

type SubmitUnshieldTokensLogic = {
    sharedSubmitParams: SharedSubmitParams,
    memoText: string,
    showSenderAddressToRecipient: boolean,
    dataForPrivateModeTxSubmission: DataForPrivateModeTxSubmission,
};
  
export async function submitTransferTokensLogic({
  sharedSubmitParams,
  memoText,
  showSenderAddressToRecipient,
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
  await generateTransferProof( 
    txIDVersion, network, railgunWalletId, await requestEncryptionKey(), showSenderAddressToRecipient, memoText,
    erc20AmountRecipients!, [], broadcasterFeeERC20AmountRecipient, isUsingSelfSignMethod,
    overallBatchMinGasPrice, progressCallback
  );

  // Prepare Transaction
  const transaction = await populateTransfer(
    isUsingSelfSignMethod, txIDVersion, network, railgunChain,
    railgunWalletId, showSenderAddressToRecipient, memoText, erc20AmountRecipients!, broadcasterFeeERC20AmountRecipient,
    overallBatchMinGasPrice, transactionGasDetails!, selectedBroadcaster, false
  );

  // Submit Tx
  const txHash = await sendPrivateModeTx(
    isUsingSelfSignMethod,
    transaction
  );
        
  return txHash;
};
