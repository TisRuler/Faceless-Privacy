import { useBroadcasterStore } from "~~/src/state-managers";
import { BroadcasterConnectionStatus } from "@railgun-community/shared-models";
import { useBroadcasterMethodStatus } from "~~/src/shared/hooks/useBroadcasterMethodStatus";
import { mapBroadcasterStatusToMessage } from "~~/src/shared/utils/broadcaster";

interface TransactionLinkTabProps {
    txHash: string;
}

export const FailedToConnectBroadcasterNotice: React.FC<TransactionLinkTabProps> = ({
  txHash,
}) => {
  const { isUsingSelfSignMethod} = useBroadcasterMethodStatus();
  const broadcasterConnectionStatus = useBroadcasterStore((state) => state.broadcasterConnectionStatus);
  const isConnected = broadcasterConnectionStatus === BroadcasterConnectionStatus.Connected;

  if (isConnected || isUsingSelfSignMethod) return null;

  //Ui
  const containerClasses = `${
    txHash?.length > 1 ? "fixed z-[1] bottom-12 lg:left-4 lg:bottom-4 left-1/2 -translate-x-1/2 lg:translate-x-0 max-w-fit" : 
      "bottom-4 left-4 fixed z-[1] max-w-fit"}`;

  const cardClasses = "rounded-2xl flex items-center gap-2 font-im cursor-pointer whitespace-nowrap";
  const paddingClasses = "px-2 sm:px-4 py-1 sm:py-2";
  const textClasses = "text-sm sm:text-sm font-im text-error";

  const statusMessage = mapBroadcasterStatusToMessage(broadcasterConnectionStatus);

  const Circle = () => (
    <div className="h-2 w-2 rounded-2xl border-2 border-error/70">
    </div>
  );
    
  return (
    <div className={containerClasses}>
      <div className={`${cardClasses} ${paddingClasses}`}>
        <Circle/>
        <p className={textClasses}>{statusMessage}</p>
      </div>
    </div>
  );
};