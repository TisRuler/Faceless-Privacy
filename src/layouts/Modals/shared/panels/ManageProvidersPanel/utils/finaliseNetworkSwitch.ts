import { useSettingsStore } from "~~/src/state-managers";
import { ChainData } from "~~/src/config/chains/types";
import { RpcState } from "~~/src/shared/enums";
import { loadFreshProviders } from "../utils";
import { WakuBroadcasterClient } from "@railgun-community/waku-broadcaster-client-web";
import toast from "react-hot-toast";

const setActiveNetwork = useSettingsStore.getState().setActiveNetwork;
const setUpcomingNetwork = useSettingsStore.getState().setUpcomingNetwork;

/**
 * Switches the config to the upcoming network.
 * Ensures broadcaster and provider sync before committing new state.
 */
export const finaliseNetworkSwitch = async (
  activeNetwork: ChainData,
  upcomingNetwork: ChainData,
  rpcState: RpcState,
  hasRailgunEngineStarted: boolean,
) => {

  const isCustom = rpcState === RpcState.Custom;

  await loadFreshProviders(
    upcomingNetwork.id, 
    upcomingNetwork.railgunNetworkName, 
    isCustom,
    hasRailgunEngineStarted ? true : false
  );
  
  await WakuBroadcasterClient.setChain(upcomingNetwork.railgunChain);
    
  // Update states & Notify
  setActiveNetwork(upcomingNetwork);
  toast.success(`${upcomingNetwork.name} Providers Activated`);
};