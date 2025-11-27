import { useSettingsStore } from "~~/src/state-managers";

export const getRpcStateForActiveNetwork = () => {
  const { rpcStateMap, activeNetwork } = useSettingsStore.getState();
    
  return rpcStateMap[activeNetwork.id];
};