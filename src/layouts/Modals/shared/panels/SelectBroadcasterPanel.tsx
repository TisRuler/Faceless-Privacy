import { useEffect, useState } from "react";
import { useBroadcasterStore } from "~~/src/state-managers";
import { ModalFlashingLight, ModalCentreMessage, ModalInfoCard } from "../../shared/components";
import { SelectedBroadcaster, BroadcasterConnectionStatus } from "@railgun-community/shared-models";
import { findBroadcastersForToken, mapBroadcasterStatusToMessage } from "~~/src/shared/utils/broadcaster";
import { logError } from "~~/src/shared/utils/other/logError";
import { useShouldBootstrapNetworkStack } from "~~/src/shared/hooks/useShouldBootstrapNetworkStack";
import { useBroadcasterMethodStatus } from "~~/src/shared/hooks/useBroadcasterMethodStatus";
import { ModalInfoBox } from "../../shared/components";

const shortenAddress = (address: string) => `${address.slice(0, 4)}...${address.slice(-4)}`;

const setSendMethod = useBroadcasterStore.getState().setSendMethod;

export const SelectBroadcasterPanel  = () => {

  // Stores
  const broadcasterConnectionStatus = useBroadcasterStore((state) => state.broadcasterConnectionStatus);
  const sendMethod = useBroadcasterStore((state) => state.sendMethod);
  const customSelectedBroadcaster = useBroadcasterStore((state) => state.customSelectedBroadcaster);
  const broadcasterFeeToken = useBroadcasterStore.getState().broadcasterFeeToken;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [broadcasterData, setBroadcasterData] = useState<SelectedBroadcaster[]>([]);

  const shouldBootstrapNetworkStack = useShouldBootstrapNetworkStack();

  const isBroadcasterConnected = broadcasterConnectionStatus === BroadcasterConnectionStatus.Connected;
  const isNoBroadcastersFound = broadcasterData.length === 0;
  const { isUsingDefaultBroadcasterMethod } = useBroadcasterMethodStatus();

  const isBroadcasterSelected = (encquiredBroadcaster: SelectedBroadcaster) => {
    if (sendMethod === "SELF_SIGN") return false;
    if (sendMethod === "DEFAULT_BROADCASTER") return false;
  
    // Only CUSTOM_BROADCASTER can have a selectedBroadcaster
    return customSelectedBroadcaster?.tokenFee.feesID === encquiredBroadcaster.tokenFee.feesID;
  };

  // Polling updating broadcasters
  useEffect(() => {
    const interval = setInterval(() => {
      handleBroadcasterFinding();
    }, 30000); // 30 seconds
  
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  useEffect(() => {
    if (isLoading) return;
    if (broadcasterConnectionStatus === BroadcasterConnectionStatus.Connected && broadcasterData.length === 0) {
      handleBroadcasterFinding();
    }
  }, [broadcasterConnectionStatus]);

  // Main function
  const handleBroadcasterFinding = async () => {
    if (shouldBootstrapNetworkStack) return;
    setIsLoading(true);
    try {
      const broadcastersFound = await findBroadcastersForToken();
      setBroadcasterData(broadcastersFound);
    } catch (error) {
      logError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Ui
  const messageToDisplay =
    isNoBroadcastersFound && isBroadcasterConnected
      ? "No Broadcasters Found"
      : mapBroadcasterStatusToMessage(broadcasterConnectionStatus);

  return (
    <div className="max-h-[21.715em] overflow-y-scroll rounded-b-md">
      {shouldBootstrapNetworkStack ? (
        <ModalCentreMessage message="Connect a RPC then try again"/>
      ) : isLoading ? (
        <ModalCentreMessage message="Loading..."/>
      ) : isNoBroadcastersFound ? (
        <ModalCentreMessage message={messageToDisplay} />
      ) : (
        <>
          <ModalInfoBox>Broadcasters send your private transactions for you safely.</ModalInfoBox>

          <ModalInfoCard
            title="Default Broadcaster (Auto)"
            icon={<ModalFlashingLight isActive={isUsingDefaultBroadcasterMethod} />}
            onClick={() => setSendMethod({ method: "DEFAULT_BROADCASTER" })}
          />
      
          {(broadcasterData as (SelectedBroadcaster & { broadcasterFee: number })[]).map(
            (broadcaster, index) => (
              <ModalInfoCard
                key={broadcaster.railgunAddress}
                title={`${index + 1}. ${shortenAddress(broadcaster.railgunAddress)}`}
                body={`Reliability: ${broadcaster.tokenFee.reliability}\nFee Ratio: (${broadcaster.broadcasterFee} : 1 ${broadcasterFeeToken.symbol})`}
                icon={<ModalFlashingLight isActive={isBroadcasterSelected(broadcaster)} />}
                onClick={() => setSendMethod({ method: "CUSTOM_BROADCASTER", broadcaster: broadcaster })}
              />
            )
          )}
        </>
      )}
    </div>
  );   
};