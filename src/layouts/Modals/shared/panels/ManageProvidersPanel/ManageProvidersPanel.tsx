import { useEffect, useState } from "react";
import { UpdateProviderPanel, InputCustomRpcPanel, ModalHeader, ProviderButtonChoicesPanel } from "./SubComponents";
import { useSettingsStore } from "~~/src/state-managers";
import { RpcState } from "~~/src/shared/enums";
import { initialiseActiveNetworkProviders, finaliseNetworkSwitch, shutdownWeb3ConnectionStack } from "./utils";
import { refreshPrivateAddressBalances } from "~~/src/shared/utils/tokens";
import { GENERAL_NOTIFICATIONS } from "~~/src/constants/notifications";
import { useShouldBootstrapNetworkStack } from "~~/src/shared/hooks/useShouldBootstrapNetworkStack";
import { logError } from "~~/src/shared/utils/other";
import { WakuBroadcasterClient } from "@railgun-community/waku-broadcaster-client-web";
import toast from "react-hot-toast";

interface ManageProvidersPanelProps {
  closeModal: () => void;
  modalClosureListener?: number;
  isPanelAlone?: boolean;
}

const setUpcomingNetwork = useSettingsStore.getState().setUpcomingNetwork;

/*
 *  Purpose:
 *  - Manage active network providers (view, update, or activate).
 *  - Update and apply upcoming network configurations when switching networks.
 * 
 *  Notes:
 *  - The app starts with no active providers for any chain. In that state, this panel functions as a provider initialisation panel.
 *  - This panel handles the full provider lifecycle: viewing, updating, initialising connections, and switching the network stack to a new chain (broadcaster chain included).
 *  - This is to be displayed every time you switch networks, so you can confirm provider choices.
 */
export const ManageProvidersPanel: React.FC<ManageProvidersPanelProps> = ({
  closeModal,
  modalClosureListener,
  isPanelAlone,
}) => {

  const { 
    activeNetwork,
    upcomingNetwork,
    rpcStateMap,
    customRpcs, 
    hasRailgunEngineStarted
  } = useSettingsStore();

  // Flags
  const shouldBootstrapNetworkStack = useShouldBootstrapNetworkStack();
  const rpcState = rpcStateMap[upcomingNetwork.id];
  const isRpcOff = rpcState === RpcState.Off;
  const isRpcCustom = rpcState === RpcState.Custom;
  const isInvalidCustomRpcLength = rpcState === RpcState.Custom && customRpcs[upcomingNetwork.id].length < 2;
  const isForActiveNetwork = activeNetwork.id === upcomingNetwork.id;
  const isSwitchingNetwork = !isForActiveNetwork;

  // Panel states helpers
  const isInitialPanelButtonChoice = shouldBootstrapNetworkStack;
  const isInitialPanelProviderSettings = !shouldBootstrapNetworkStack;
  const isInitialPanelInputCustomRpc = false;

  // Panel states
  const [isButtonChoicesDisplayed, setIsButtonChoicesDisplayed] = useState(isInitialPanelButtonChoice);
  const [isProviderSettingsDisplayed, setIsProviderSettingsDisplayed] = useState(isInitialPanelProviderSettings);
  const [isInputCustomRpcPanelDisplayed, setIsInputCustomRpcPanelDisplayed] = useState(isInitialPanelInputCustomRpc);
  const [isLoading, setIsLoading] = useState(false);

  // Other flags
  const isProviderChoiceCancelled = isForActiveNetwork && isInputCustomRpcPanelDisplayed; // For users who viewed the UpdateProviderPanel but didn't confirm a choice then went to InputCustomRpcPanel and did'nt input one

  // Main function - used when the modal is closed manually (outside modal clicks and the corner X click)
  const handleModalClosureRequest = async () => {
    if (isLoading) return;
    
    if (isRpcOff) {
      toast.error(isSwitchingNetwork ? "Network Switch Canceled" : "Provider Not Active");
      setUpcomingNetwork(activeNetwork);
      closeModal();
      return;
    }

    if (shouldBootstrapNetworkStack && !isButtonChoicesDisplayed) {
      const successfulNetworkConnection = await handleNetworkStack();
      if (!successfulNetworkConnection) return;
    }

    if (isProviderChoiceCancelled) { 
      await shutdownWeb3ConnectionStack();
    }

    setUpcomingNetwork(activeNetwork);
    closeModal();
  };

  // Purpose: Provider activator for your current chain and upcoming chain if switching
  // Extra Info: 
  // - Updates broadcaster chain and refreshes balances too if needed
  // - Returns True or false, to say if the network was connected succesfully
  const handleNetworkStack = async (): Promise<boolean> => {
    if (isLoading) return false;
    setIsLoading(true);

    if (isInvalidCustomRpcLength && isRpcCustom) {
      toast.error("Add 1 More Custom RPC");
      return false;
    }

    try {

      if (isForActiveNetwork) {
        await initialiseActiveNetworkProviders(
          activeNetwork, 
          rpcState, 
        );
      } else {   
        await finaliseNetworkSwitch(
          activeNetwork, 
          upcomingNetwork, 
          rpcState, 
          hasRailgunEngineStarted,
        );
        await refreshPrivateAddressBalances(shouldBootstrapNetworkStack, activeNetwork); 
      }

      return true;
      
    } catch (error) {
      await shutdownWeb3ConnectionStack();
      logError(error);
      await WakuBroadcasterClient.setChain(activeNetwork.railgunChain);
      toast.error(GENERAL_NOTIFICATIONS.CHECK_PROVIDER);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Important function for "ProviderButtonChoicesPanel"
  const handleDefaultButtonChoiceClick = async () => {
    const successfulNetworkConnection = await handleNetworkStack();
    if (!successfulNetworkConnection) return;

    if (isPanelAlone || isSwitchingNetwork) closeModal();
  };

  // Panel changing
  const switchToUpdateProviderPanel = () => {
    setIsButtonChoicesDisplayed(false);
    setIsInputCustomRpcPanelDisplayed(false);
    setIsProviderSettingsDisplayed(true);
  };

  const switchToInputPanel = () => {
    setIsButtonChoicesDisplayed(false);
    setIsProviderSettingsDisplayed(false);
    setIsInputCustomRpcPanelDisplayed(true);
  };

  // Listens to external clicks (modalClosureListener)
  useEffect(() => {
    if (modalClosureListener === 0) return;
    handleModalClosureRequest(); 
  }, [modalClosureListener]);

  return (
    <>
      <ModalHeader
        isButtonChoicesDisplayed={isButtonChoicesDisplayed}
        isProviderSettingsDisplayed={isProviderSettingsDisplayed}
        isInputCustomRpcPanelDisplayed={isInputCustomRpcPanelDisplayed}
        isSwitchingNetwork={!isForActiveNetwork}
        switchToUpdateProviderPanel={switchToUpdateProviderPanel}
        networkData={upcomingNetwork}
        shouldBootstrapNetworkStack={shouldBootstrapNetworkStack}
      />
      
      {isButtonChoicesDisplayed && 
        <ProviderButtonChoicesPanel
          handleDefaultChosen={handleDefaultButtonChoiceClick}
          switchToUpdateProviderPanel={switchToUpdateProviderPanel}
          isLoading={isLoading}
        />
      }

      {isProviderSettingsDisplayed && 
        <UpdateProviderPanel
          switchToInputPanel={switchToInputPanel}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          networkData={upcomingNetwork}
        />
      }

      {isInputCustomRpcPanelDisplayed && 
        <InputCustomRpcPanel
          switchToUpdateProviderPanel={switchToUpdateProviderPanel}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          configuredNetwork={upcomingNetwork}
        />
      }
    </>
  );
};