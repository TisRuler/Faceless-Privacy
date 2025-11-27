import { Dispatch, SetStateAction, useState } from "react";
import { useAccount } from "wagmi";
import { useSettingsStore, useConnectorRolesStore, usePrivateAddressStore } from "~~/src/state-managers";
import { RpcState } from "~~/src/shared/enums";
import { logError } from "~~/src/shared/utils/other";
import { ModalInfoCard } from "../../shared/components";
import { ChevronRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { disconnectPrivateAddress } from "~~/src/layouts/Header/components/utils/disconnectPrivateAddress";
import { openManageProvidersModal } from "../../modalUtils";
import { INJECTED_WALLET_NOTIFICATIONS } from "~~/src/constants/notifications";
import { isRailgunWalletReconnectionTypeSignatureOrUnknown, disconnectAllConnectors } from "~~/src/shared/utils/wallet";
import { validateRailgunAddress } from "@railgun-community/wallet";
import toast from "react-hot-toast";

interface InitialPanelProps { 
  closeGeneralSettingsModal: () => void;
  setIsPrivateModeSettingsPanelDisplayed: Dispatch<SetStateAction<boolean>>;
  setIsOtherPanelDisplayed: Dispatch<SetStateAction<boolean>>;
}

export const InitialPanel: React.FC<InitialPanelProps> = ({
  closeGeneralSettingsModal,
  setIsPrivateModeSettingsPanelDisplayed,
  setIsOtherPanelDisplayed
}) => {

  // Hooks
  const [isWalletDisconnectionInProcess, setIsWalletDisconnectionInProcess] = useState(false);

  const { rpcStateMap, activeNetwork, hasRailgunEngineStarted, wagmiConfig } = useSettingsStore();
  const { address: publicAddress } = useAccount();
  
  const areMultipleConnectorsConnected = useConnectorRolesStore(
    (store) => Boolean(store.publicConnectorId && store.selfSigningConnectorId)
  );

  // Core function
  const handleWalletDisconnection = async () => {
    if (isWalletDisconnectionInProcess) return;
    setIsWalletDisconnectionInProcess(true);

    try {
      const isReconnectionTypeSignatureOrUnknown = isRailgunWalletReconnectionTypeSignatureOrUnknown();
      const privateAddress = usePrivateAddressStore.getState().yourPrivateAddress;
      const shouldDiconnectPrivateAddress = isReconnectionTypeSignatureOrUnknown && validateRailgunAddress(privateAddress);

      await disconnectAllConnectors(wagmiConfig);

      if (shouldDiconnectPrivateAddress) {
        await disconnectPrivateAddress();
      } 
    
      toast.success(INJECTED_WALLET_NOTIFICATIONS.DISCONNECTED);

    } catch (error) {
      toast.error("Disconnection Failed");
      logError(error);
    } finally {
      setIsWalletDisconnectionInProcess(false);
    }
  };

  // State flags
  const currentRpcState = rpcStateMap[activeNetwork.id];
  const isPublicWalletConnected = publicAddress !== undefined;

  // Ui
  const providerStateLabel = 
    !hasRailgunEngineStarted ? "Needs activating" :
      currentRpcState === RpcState.Custom ? "Custom" :
        currentRpcState === RpcState.Off ? "Down (RPC Off)" :
          "Default (Auto)";  
    
  return (
    <>
      <ModalInfoCard
        title="Providers"
        body={providerStateLabel}
        icon={
          <ChevronRightIcon
            className="h-6 w-4 text-xl"
            aria-hidden="true"
            strokeWidth={1.8}
          />
        }
        onClick={() => {
          closeGeneralSettingsModal();
          openManageProvidersModal();
        }}
      />

      <ModalInfoCard
        title="Sending From Private Address"
        body="Occasionally used"
        icon={
          <ChevronRightIcon
            className="h-6 w-4 text-xl"
            aria-hidden="true"
            strokeWidth={1.8}
          />
        }
        onClick={() => setIsPrivateModeSettingsPanelDisplayed(true)}
      />

      <ModalInfoCard
        title="Other"
        body="Less commonly used"
        icon={
          <ChevronRightIcon
            className="h-6 w-4 text-xl"
            aria-hidden="true"
            strokeWidth={1.8}
          />
        }
        onClick={() => setIsOtherPanelDisplayed(true)}
      />

      <ModalInfoCard
        title={areMultipleConnectorsConnected ? "Disconnect Wallets" : "Disconnect Wallet"}
        body={areMultipleConnectorsConnected ? "All connected wallets" : ""}
        icon={
          <ArrowLeftIcon
            className="h-6 w-4 text-xl"
            aria-hidden="true"
            strokeWidth={1.8}
          />
        }
        onClick={handleWalletDisconnection}
        isVisible={isPublicWalletConnected}
      />
    </>
  );
};
