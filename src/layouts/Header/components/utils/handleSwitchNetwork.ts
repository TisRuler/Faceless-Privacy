import { Chain } from "wagmi/chains";
import { useSettingsStore } from "~~/src/state-managers";
import { getActiveNetwork, getNetworkById } from "~~/src/shared/utils/network";
import { openManageProvidersModal } from "~~/src/layouts/Modals/modalUtils";
import toast from "react-hot-toast";

const setUpcomingNetwork = useSettingsStore.getState().setUpcomingNetwork;

export const handleSwitchNetwork = async (chain: Chain) => {

  const outdatedNetworkData = getActiveNetwork();
  const newNetworkData = getNetworkById(chain.id);

  if (outdatedNetworkData === newNetworkData) {
    toast.error("Network Already Selected");
    return;
  }

  setUpcomingNetwork(newNetworkData);
  openManageProvidersModal();

};