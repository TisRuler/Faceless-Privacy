import { useSettingsStore } from "~~/src/state-managers";
import { 
  ModalInfoCard, 
  ModalFlashingLight, 
  ModalFooterLink, 
  ModalCentreMessage, 
  ModalInfoBox 
} from "../../../components";
import { ModalInfoCardProviderList } from "./";
import { loadFreshProviders } from "../utils";
import { ChainData } from "~~/src/config/chains/types";
import { RpcState } from "~~/src/shared/enums";
import { shutdownWeb3ConnectionStack } from "../utils/shutdownWeb3ConnectionStack";
import { SETTINGS_NOTIFICATIONS } from "~~/src/constants/notifications/settingsNotifications";
import { GENERAL_NOTIFICATIONS } from "~~/src/constants/notifications";
import { logError } from "~~/src/shared/utils/other/logError";
import toast from "react-hot-toast";

interface UpdateProviderPanelProps {
  switchToInputPanel: () => void;
  isLoading: boolean
  setIsLoading: (value: boolean) => void;
  networkData: ChainData;
}

export const UpdateProviderPanel: React.FC<UpdateProviderPanelProps> = ({
  switchToInputPanel,
  isLoading,
  setIsLoading,
  networkData,
}) => {

  const { customRpcs, rpcStateMap } = useSettingsStore();
  const customRpcsLength = customRpcs[networkData.id].length;

  const rpcState = rpcStateMap[networkData.id];

  /* 
   * Updates the active RPC provider option.
   * Handles provider shutdown, custom RPC input panel navigation,
   * fresh provider loading, and error handling with user notifications.
   */
  const handleUpdateActiveInitiatorOption = async (option: RpcState) => {

    const isCustom = option === RpcState.Custom;
  
    // Go to input custom RPC panel if there are not 2 or more RPC's in the list
    if (isCustom && customRpcsLength < 2) {
      if (customRpcsLength === 1) toast.success("Add 1 more Custom RPC");
      await switchToInputPanel();
      return;
    }

    setIsLoading(true);

    // Turn off provider
    if (option === rpcState) {
      await shutdownWeb3ConnectionStack();
      toast.error(SETTINGS_NOTIFICATIONS.PROVIDER_TURNED_OFF);
      setIsLoading(false);
      return;
    }
  
    try {
      
      await loadFreshProviders(
        networkData.id, 
        networkData.railgunNetworkName, 
        isCustom, 
        true
      );
      
      toast.success(SETTINGS_NOTIFICATIONS.PROVIDER_UPDATED);

    } catch (error) {
      await shutdownWeb3ConnectionStack();
      toast.error(GENERAL_NOTIFICATIONS.CHECK_PROVIDER);
      logError(error);
    } finally {
      setIsLoading(false);
    }
  };  

  const isDefaultProvidersActive = rpcState === RpcState.Default;
  const isCustomProvidersActive = rpcState === RpcState.Custom;

  return (
    <>
      {isLoading ? (
        <ModalCentreMessage message="Updating Providers..."/>
      ) : (
        <>

          <ModalInfoBox>
            <p className="text-sm">
              {"Provider's are used to connect you to the Blockchain."}
            </p>
            <p className="text-xs">
              Tip: Using Default suits most users. Use custom for max privacy.
            </p>
          </ModalInfoBox>

          <ModalInfoCard
            title="Default Providers"
            body={
              <ModalInfoCardProviderList 
                isCustom={false} 
                chainId={networkData.id} 
                activeRpcState={rpcState}
              />
            }
            icon={<ModalFlashingLight isActive={isDefaultProvidersActive}/>}
            onClick={() => handleUpdateActiveInitiatorOption(RpcState.Default)}
          />

          <ModalInfoCard
            title="Custom Providers"
            body={
              <ModalInfoCardProviderList 
                isCustom={true} 
                chainId={networkData.id} 
                activeRpcState={rpcState} 
                setIsUpdatingRpcSettings={setIsLoading}/>
            }
            icon={<ModalFlashingLight isActive={isCustomProvidersActive}/>}
            onClick={() => handleUpdateActiveInitiatorOption(RpcState.Custom)}
          />
          
          <ModalFooterLink 
            text={"Want to add a custom provider?"}
            handleLinkClick={switchToInputPanel}
            isTagUnderACard={true} 
          />
        </> 
      )}
    </> 
  );
};