import React from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { UpdatingHistoryIndicatorTab } from "./UpdatingHistoryIndicatorTab";
import { PrivateTxHistoryData } from "../types";

interface ModalHeaderControlsProps {
  fetchPrivateTxHistoryData: () => void;
  isLoading: boolean;
  tokenData: PrivateTxHistoryData[];
}

export const ModalHeaderControls: React.FC<ModalHeaderControlsProps> = ({
  fetchPrivateTxHistoryData,
  isLoading,
  tokenData,
}) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="font-ib text-2xl">Private History</h1>

        <button
          onClick={fetchPrivateTxHistoryData}
          disabled={isLoading}
          className="text-md mr-4 flex items-center gap-1.5 rounded-lg border border-modal-accent-200 bg-modal-accent-500 px-3 py-2 font-im hover:bg-modal-accent-200 focus:outline-none"
        >
          <span className="font-isb text-sm">Refresh</span>
          <ArrowPathIcon className="h-4 w-4" strokeWidth={2.25} />
        </button>
      </div>
      
      <UpdatingHistoryIndicatorTab historyData={tokenData} isLoading={isLoading} />
      <hr className="mt-2 border border-modal-accent-100" />
    </>
  );
};
