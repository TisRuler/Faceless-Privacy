import React from "react";
import { useSettingsStore } from "~~/src/state-managers";
import { PoolTransactionData } from "../../../../../types";
import { CardView, RpcState } from "~~/src/shared/enums";

interface NoActivityNoticeProps {
  transactionData: PoolTransactionData;
  viewOption: CardView;
}

export const NoActivityNotice: React.FC<NoActivityNoticeProps> = ({ transactionData, viewOption }) => {

  const { rpcStateMap, activeNetwork } = useSettingsStore.getState();
  const activityType = viewOption === CardView.Public ? "additions" : "subtractions";

  const rpcState = rpcStateMap[activeNetwork.id];

  const isRpcCustom = rpcState === RpcState.Custom;

  const noActivity =
    transactionData.column1TransactionData.length === 0 &&
    transactionData.column2TransactionData.length === 0;
  
  if (!noActivity) return null;
    
  return (
    <>
      {isRpcCustom ? (
        <h3 className="ml-2 font-im">
          No {activityType} added in the last few days.
        </h3>
      ) : (
        <h3 className="mb-2 ml-2 font-im">
          No recent {activityType} found in the last few hours.
        </h3>
      )}
    </>
  );    
};
