import { usePrivateAddressStore } from "~~/src/state-managers";

export const loadPrivateAddressHistoryTrigger = () => {
  const loadPrivateAddressHistoryTriggerListener = usePrivateAddressStore.getState().loadPrivateAddressHistoryTriggerListener;
  const setLoadPrivateAddressHistoryTriggerListener = usePrivateAddressStore.getState().setLoadPrivateAddressHistoryTriggerListener;

  setLoadPrivateAddressHistoryTriggerListener(loadPrivateAddressHistoryTriggerListener +1);
};