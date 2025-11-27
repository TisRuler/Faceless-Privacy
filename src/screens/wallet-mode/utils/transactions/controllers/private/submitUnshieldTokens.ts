import { DataForPrivateModeTxSubmission, SharedSubmitParams } from "~~/src/screens/wallet-mode/types";
import { submitUnshieldTokensLogic } from "../../coreLogic/private/submitUnshieldTokensLogic";
import { executePrivateModeTxWithUI } from "../helpers/executePrivateModeTxWithUI";

type SubmitUnshieldTokensParams = {
    sharedSubmitParams: SharedSubmitParams,
    dataForPrivateModeTxSubmission: DataForPrivateModeTxSubmission,
};
  
export async function submitUnshieldTokens({
  sharedSubmitParams,
  dataForPrivateModeTxSubmission,
}: SubmitUnshieldTokensParams): Promise<void> {

  await executePrivateModeTxWithUI(sharedSubmitParams, async () =>
    submitUnshieldTokensLogic({ sharedSubmitParams, dataForPrivateModeTxSubmission })
  );
    
};
