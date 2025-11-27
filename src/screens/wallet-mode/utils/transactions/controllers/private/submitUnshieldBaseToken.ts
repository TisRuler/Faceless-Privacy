import { DataForBaseTokenSubmission, SharedSubmitParams } from "~~/src/screens/wallet-mode/types";
import { submitUnshieldBaseTokenLogic } from "../../coreLogic/private/submitUnshieldBaseTokenLogic";
import { executePrivateModeTxWithUI } from "../helpers/executePrivateModeTxWithUI";

type SubmitUnshieldBaseTokenParams = {
    sharedSubmitParams: SharedSubmitParams,
    recipientAddress: string,
    dataForBaseTokenSubmission: DataForBaseTokenSubmission,
};
  
export async function submitUnshieldBaseToken({
  sharedSubmitParams,
  recipientAddress,
  dataForBaseTokenSubmission,
}: SubmitUnshieldBaseTokenParams): Promise<void> {

  await executePrivateModeTxWithUI(sharedSubmitParams, async () =>
    submitUnshieldBaseTokenLogic({  
      sharedSubmitParams,
      recipientAddress,
      dataForBaseTokenSubmission, 
    })
  );

};
