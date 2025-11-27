import { ChainData } from "~~/src/config/chains/types";
import { RpcState } from "~~/src/shared/enums";
import { loadFreshProviders } from "./";
import { SETTINGS_NOTIFICATIONS } from "~~/src/constants/notifications/settingsNotifications";
import toast from "react-hot-toast";

/** 
 * Selecting/confirming your active networks providers 
 */
export const initialiseActiveNetworkProviders = async (
  activeNetwork: ChainData,
  rpcState: RpcState, 
): Promise<void> => {

  const isCustom = rpcState === RpcState.Custom;
    
  await loadFreshProviders(
    activeNetwork.id,
    activeNetwork.railgunNetworkName, 
    isCustom, 
    true
  ); 

  toast.success(SETTINGS_NOTIFICATIONS.PROVIDER_ACTIVATED);
};