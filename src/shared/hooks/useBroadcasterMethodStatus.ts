import { useBroadcasterStore } from "~~/src/state-managers";

export const useBroadcasterMethodStatus = () => {
  const { sendMethod } = useBroadcasterStore();

  return {
    isUsingSelfSignMethod: sendMethod === "SELF_SIGN",
    isUsingDefaultBroadcasterMethod: sendMethod === "DEFAULT_BROADCASTER",
    isUsingcustomSelectedBroadcasterMethod: sendMethod === "CUSTOM_BROADCASTER"
  };
};
