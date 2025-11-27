import { DataForPrivateModeTxSubmission, SharedSubmitParams } from "~~/src/screens/wallet-mode/types";
import { submitTransferTokensLogic } from "../../coreLogic/private/submitTransferTokensLogic";
import { executePrivateModeTxWithUI } from "../helpers/executePrivateModeTxWithUI";

type SubmitTransferTokensParams = {
    sharedSubmitParams: SharedSubmitParams,
    memoText: string, 
    showSenderAddressToRecipient: boolean, 
    dataForPrivateModeTxSubmission: DataForPrivateModeTxSubmission
};
  
export async function submitTransferTokens({
  sharedSubmitParams, 
  memoText, 
  showSenderAddressToRecipient, 
  dataForPrivateModeTxSubmission
}: SubmitTransferTokensParams): Promise<void> {

  await executePrivateModeTxWithUI(sharedSubmitParams, async () =>
    submitTransferTokensLogic({  
      sharedSubmitParams, 
      memoText, 
      showSenderAddressToRecipient, 
      dataForPrivateModeTxSubmission
    })
  );

};
