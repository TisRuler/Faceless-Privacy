import React from "react";
import { FeeDataToDisplay } from "../../types";
import { openGeneralSettingsModal } from "~~/src/layouts/Modals/modalUtils";
import { useBroadcasterMethodStatus } from "~~/src/shared/hooks/useBroadcasterMethodStatus";
import { PrivateModeDestination } from "~~/src/shared/enums";
import { formatDisplayNumber } from "~~/src/shared/utils/tokens/formatDisplayBalance";

interface PrivateModeFeeDetailsProps {
  privateModeDestination: PrivateModeDestination
  feeDataToDisplay: FeeDataToDisplay
}

export const PrivateModeFeeDetails: React.FC<PrivateModeFeeDetailsProps> = ({
  privateModeDestination,
  feeDataToDisplay
}) => {
  
  const { isUsingSelfSignMethod, isUsingDefaultBroadcasterMethod } = useBroadcasterMethodStatus();

  const methodToDisplay = isUsingSelfSignMethod ? "Self-Sign" : isUsingDefaultBroadcasterMethod ? "Default" : "Broadcaster";
  const isUnshield = privateModeDestination === PrivateModeDestination.PublicAddress;
  
  if (!feeDataToDisplay) return null;

  const {
    broadcasterFee,
    railgunFee,
    networkFee,
    totalFee,
    showTotalFee,
  } = feeDataToDisplay;
  
  return (
    <div 
      className="mt-5 cursor-pointer whitespace-nowrap rounded-xl border-[0.12em] border-main-base px-4 py-2 sm:border"
      style={{
        backgroundImage: `radial-gradient(
          ellipse 190px 80px at 120px 60px,
          #000000 80%,
          #1F1F1F 100%
        )`,
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
      onClick={openGeneralSettingsModal}
    >

      <div className="mb-1 flex items-center justify-between text-base text-main-base">
        <p className="text-left font-isb">Sending method</p>
        <div className="flex items-center text-left font-isb">
          <p>{methodToDisplay}</p>
        </div>
      </div>

      {isUsingSelfSignMethod ? (
        <div className="text-subtitle font-isb text-sm">
          <div className="flex justify-between">
            <p>Network fee</p>
            <p>{formatDisplayNumber(networkFee.amount)} {networkFee.token.symbol}</p>
          </div>
          {isUnshield &&
            <div className="flex justify-between">
              <p>Railgun fee</p>
              <p>{formatDisplayNumber(railgunFee.amount)} {railgunFee.token.symbol}</p>
            </div>
          }
          {showTotalFee && 
            <div className="flex justify-between">
              <p>Total Fee</p>
              <p>{formatDisplayNumber(totalFee!.amount)} {totalFee!.token.symbol}</p>
            </div>
          }
        </div>
      ) : (

        <div className="text-subtitle font-isb text-sm">
          <div className="flex justify-between">
            <p className="whitespace-nowrap">Broadcaster fee</p>
            <p>{formatDisplayNumber(broadcasterFee.amount)} {broadcasterFee.token.symbol}</p>
          </div>
          {isUnshield && 
            <div className="flex justify-between">
              <p>Railgun fee</p>
              <p>{formatDisplayNumber(railgunFee.amount)} {broadcasterFee.token.symbol}</p>
            </div>
          }
          {showTotalFee && 
            <div className="flex justify-between">
              <p>Total Fee</p>
              <p>{formatDisplayNumber(totalFee!.amount)} {broadcasterFee.token.symbol}</p>
            </div>
          }
        </div>

      )}

    </div>
  );
};

