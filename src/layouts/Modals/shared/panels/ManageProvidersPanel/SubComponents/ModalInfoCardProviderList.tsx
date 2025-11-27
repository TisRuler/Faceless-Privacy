import React from "react";
import { useSettingsStore } from "~~/src/state-managers";
import { DEFAULT_RPC_URLS } from "~~/src/config/defaultRpcUrls";
import { SupportedChainId } from "~~/src/shared/types";
import { shutdownWeb3ConnectionStack } from "../utils/shutdownWeb3ConnectionStack";
import { loadFreshProviders } from "../utils";
import { RpcState } from "~~/src/shared/enums";
import { SETTINGS_NOTIFICATIONS } from "~~/src/constants/notifications";
import { logError } from "~~/src/shared/utils/other/logError";
import toast from "react-hot-toast";

interface InfoCardProviderListProps {
  isCustom: boolean;
  chainId: SupportedChainId;
  activeRpcState: RpcState;
  setIsUpdatingRpcSettings?: (value: boolean) => void;
}

export const ModalInfoCardProviderList: React.FC<InfoCardProviderListProps> = ({
  isCustom,
  chainId,
  activeRpcState,
  setIsUpdatingRpcSettings,
}) => {

  const {
    customRpcs,
    removeCustomRpc,
    activeNetwork,
    upcomingNetwork,
  } = useSettingsStore();

  const isConfiguredNetworkActive = activeNetwork.id === upcomingNetwork.id;
  const isActiveRpcStateCustom = activeRpcState === RpcState.Custom;

  const rpcList = isCustom ? customRpcs[chainId] : DEFAULT_RPC_URLS[chainId];

  /* 
  * - Removes custom RPC from config.
  * - If custom RPC's are currently active, shut down the stack (to clear stale connections).
  * - If there is not enough RPC's to load fresh rpc's, notify the users that there providers are now off and leave it as is.
  * - Ottherwise load the providers with the updated list (the list without the removed rpc).
  * - If reloading fails, shut down the connection again to ensure clean state (no accidental leakage). 
  */
  const handleCustomRpcRemoval = async (rpc: string) => {
    setIsUpdatingRpcSettings?.(true);
    removeCustomRpc(chainId, rpc);
    if (isActiveRpcStateCustom) {
      try {
        await shutdownWeb3ConnectionStack(); // Clear stale connections

        const freshCustomRpcs = useSettingsStore.getState().customRpcs[chainId]; // Would be stale if we used the list above

        if (freshCustomRpcs.length < 2) {
          toast.error(SETTINGS_NOTIFICATIONS.PROVIDER_TURNED_OFF);
          setIsUpdatingRpcSettings?.(false);
          return;
        };

        await loadFreshProviders(
          chainId,
          activeNetwork.railgunNetworkName,
          isCustom,
          isConfiguredNetworkActive,
        );
      } catch (error) {
        await shutdownWeb3ConnectionStack();
        toast.error(SETTINGS_NOTIFICATIONS.PROVIDER_TURNED_OFF);
        logError(error);
      }
    }

    setIsUpdatingRpcSettings?.(false);
  };

  if (isCustom && rpcList.length === 0) {
    return (
      <p className="text-sm text-modal-100">
        No custom RPC providers added yet for this chain.
      </p>
    );
  }

  return (
    <ul className="space-y-1">
      {rpcList.map((rpc: string, index) => (
        <li key={rpc} className="text-accent-300 text-sm">
          <span className="mr-1">{index + 1}.</span>
          <span className="break-all">
            {rpc}
            {isCustom && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCustomRpcRemoval(rpc);
                }}
                className="ml-1 text-modal-accent-100 hover:text-modal-base hover:underline"
              >
                [remove]
              </button>
            )}
          </span>
        </li>
      ))}
    </ul>
  );
};
