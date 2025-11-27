import React from "react";
import { DataForPrivateModeTxSubmission, FeeDataToDisplay, SharedEstimateParams } from "~~/src/screens/wallet-mode/types";
import { estimateUnshieldTokensLogic } from "../../coreLogic/private/estimateUnshieldTokensLogic";
import { estimatePrivateModeActionFeeWithUI } from "../helpers/estimatePrivateModeActionFeeWithUI";
import { SendableToken } from "~~/src/shared/types";

type EstimateUnshieldTokensParams = {
  sharedPrivateModeEstimateParams: SharedEstimateParams,
  tokenToSend: SendableToken,
  setDataForPrivateModeTxSubmission: React.Dispatch<React.SetStateAction<DataForPrivateModeTxSubmission>>,
  setFeeDataToDisplay: (value: FeeDataToDisplay) => void,
};
  
export async function estimateUnshieldTokens({
  sharedPrivateModeEstimateParams,
  tokenToSend,
  setDataForPrivateModeTxSubmission,
  setFeeDataToDisplay,
}: EstimateUnshieldTokensParams) {

  await estimatePrivateModeActionFeeWithUI({
    sharedPrivateModeEstimateParams,
    logicFunction: async () => {
      return estimateUnshieldTokensLogic({
        sharedPrivateModeEstimateParams,
        tokenToSend,
      });
    },
    onSuccess: ({ feeDataToDisplay, dataForPrivateModeTxSubmission }) => {
      setFeeDataToDisplay(feeDataToDisplay);
      setDataForPrivateModeTxSubmission(dataForPrivateModeTxSubmission);
    }
  });
};