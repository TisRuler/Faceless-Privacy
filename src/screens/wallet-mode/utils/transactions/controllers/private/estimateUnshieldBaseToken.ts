import { FeeDataToDisplay, SharedEstimateParams, DataForBaseTokenSubmission } from "~~/src/screens/wallet-mode/types";
import { estimateUnshieldBaseTokenLogic } from "../../coreLogic/private/estimateUnshieldBaseTokenLogic";
import { estimatePrivateModeActionFeeWithUI } from "../helpers/estimatePrivateModeActionFeeWithUI";

type EstimateUnshieldBaseTokenParams = {
  sharedPrivateModeEstimateParams: SharedEstimateParams,
  setDataForBaseTokenSubmission: React.Dispatch<React.SetStateAction<DataForBaseTokenSubmission>>,
  setFeeDataToDisplay: (value: FeeDataToDisplay) => void,
};

export async function estimateUnshieldBaseToken({
  sharedPrivateModeEstimateParams,
  setDataForBaseTokenSubmission,
  setFeeDataToDisplay,
}: EstimateUnshieldBaseTokenParams) {

  await estimatePrivateModeActionFeeWithUI({
    sharedPrivateModeEstimateParams,
    logicFunction: async () => {
      return estimateUnshieldBaseTokenLogic({ sharedPrivateModeEstimateParams });
    },
    onSuccess: ({ feeDataToDisplay, dataForBaseTokenSubmission }) => {
      setFeeDataToDisplay(feeDataToDisplay);
      setDataForBaseTokenSubmission(dataForBaseTokenSubmission);
    }
  });

}
  