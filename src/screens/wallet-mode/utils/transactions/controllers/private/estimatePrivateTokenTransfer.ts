import React from "react";
import { DataForPrivateModeTxSubmission, FeeDataToDisplay, SharedEstimateParams } from "~~/src/screens/wallet-mode/types";
import { estimatePrivateTokenTransferLogic } from "../../coreLogic/private/estimatePrivateTokenTransferLogic";
import { estimatePrivateModeActionFeeWithUI } from "../helpers/estimatePrivateModeActionFeeWithUI";
import { SendableToken } from "~~/src/shared/types";

type EstimateTokenTransferParams = {
  sharedPrivateModeEstimateParams: SharedEstimateParams;
  tokenToSend: SendableToken;
  memoText: string;
  setDataForPrivateModeTxSubmission: React.Dispatch<React.SetStateAction<DataForPrivateModeTxSubmission>>;
  setFeeDataToDisplay: (value: FeeDataToDisplay) => void;
};

export async function estimatePrivateTokenTransfer({
  sharedPrivateModeEstimateParams,
  tokenToSend,
  memoText,
  setDataForPrivateModeTxSubmission,
  setFeeDataToDisplay,
}: EstimateTokenTransferParams) {

  await estimatePrivateModeActionFeeWithUI({
    sharedPrivateModeEstimateParams,
    logicFunction: async () => {
      return estimatePrivateTokenTransferLogic({ 
        sharedPrivateModeEstimateParams,
        tokenToSend,
        memoText, 
      });
    },
    onSuccess: ({ feeDataToDisplay, dataForPrivateModeTxSubmission }) => {
      setFeeDataToDisplay(feeDataToDisplay);
      setDataForPrivateModeTxSubmission(dataForPrivateModeTxSubmission);
    }
  });
};
