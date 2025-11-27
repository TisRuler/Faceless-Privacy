import React, { useEffect, useState } from "react";
import { usePrivateAddressStore, useSettingsStore } from "~~/src/state-managers";
import { getEthersProvider } from "~~/src/shared/utils/network"; 
import { getPrivateAddressHistory } from "./utils/getPrivateAddressHistory";
import { ModalFrame } from "../shared/components";
import { ModalHeaderControls } from "./Components/ModalHeaderControls";
import { HistoryPanel } from "./Components/HistoryPanel";
import { loadPrivateAddressHistoryTrigger } from "../../Header/components/utils/loadPrivateAddressHistoryTrigger";
import { closePrivateAddressHistoryModal } from "../modalUtils";
import { validateRailgunAddress } from "@railgun-community/wallet";
import { PrivateTxHistoryData } from "./types";

export const PrivateAddressHistoryModal = () => {

  const { activeNetwork } = useSettingsStore();
  const activeStartingBlock = 0;

  // Private Address states
  const yourPrivateAddress = usePrivateAddressStore((state) => state.yourPrivateAddress);
  const isYourPrivateAddressConnected = validateRailgunAddress(yourPrivateAddress);
  const loadPrivateAddressHistoryTriggerListener = usePrivateAddressStore((state) => state.loadPrivateAddressHistoryTriggerListener);
  const railgunWalletId = usePrivateAddressStore((state) => state.railgunWalletId);
  
  const provider = getEthersProvider();

  const [tokenData, setTokenData] = useState<PrivateTxHistoryData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGetHistory = async () => {
    setIsLoading(true);

    const history = await getPrivateAddressHistory(
      activeNetwork,
      activeStartingBlock,
      provider,
      railgunWalletId,
    );

    if (history) setTokenData(history);

    setIsLoading(false);
  };

  useEffect(() => {
    if (!isLoading && loadPrivateAddressHistoryTriggerListener > 0) {
      handleGetHistory();
    }
  }, [loadPrivateAddressHistoryTriggerListener]);

  if (!isYourPrivateAddressConnected) return null;
  
  return (
    <ModalFrame onExitClick={closePrivateAddressHistoryModal} shouldHandleProvider={true}>

      <ModalHeaderControls
        fetchPrivateTxHistoryData={() => loadPrivateAddressHistoryTrigger()} 
        isLoading={isLoading}
        tokenData={tokenData}
      />

      <HistoryPanel
        network={activeNetwork}
        tokenData={tokenData}
        isLoading={isLoading}
        activeStartingBlock={activeStartingBlock}
        provider={provider}
        yourPrivateAddress={yourPrivateAddress}
      />

    </ModalFrame>
  );
};
