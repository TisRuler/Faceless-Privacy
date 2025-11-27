import { useBroadcasterStore } from "~~/src/state-managers";
import { getDefaultBroadcasterForToken } from "~~/src/shared/utils/broadcaster";
import { SelectedBroadcaster } from "@railgun-community/shared-models";
import { WALLET_MODE_NOTIFICATIONS } from "~~/src/constants/notifications";

export const getSelectedBroadcaster = async (isUsingSelfSignMethod: boolean) => {
  
  let selectedBroadcaster: SelectedBroadcaster | undefined;

  if (isUsingSelfSignMethod === true) {
    selectedBroadcaster = undefined;
  } else {
    selectedBroadcaster = await getBroadcaster();
    if (!selectedBroadcaster) {  
      throw Error(WALLET_MODE_NOTIFICATIONS.ERROR_FINDING_BROADCASTER);
    }
  }

  return { selectedBroadcaster };
};

// Helper
const getBroadcaster = async () => {
  const sendMethod = useBroadcasterStore.getState().sendMethod;

  const isDefaultBroadcaster = sendMethod === "DEFAULT_BROADCASTER";
  const iscustomSelectedBroadcaster = sendMethod === "CUSTOM_BROADCASTER";
  const isUsingSelfSignMethod = sendMethod === "SELF_SIGN";
  
  if (isUsingSelfSignMethod) throw new Error("Using self-signer, no broadcaster needed");

  if (isDefaultBroadcaster) {
    return await getDefaultBroadcasterForToken();
  } else if (iscustomSelectedBroadcaster) {
    return useBroadcasterStore.getState().customSelectedBroadcaster;
  }
};