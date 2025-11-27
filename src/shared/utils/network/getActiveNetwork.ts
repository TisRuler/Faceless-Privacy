import { useSettingsStore } from "~~/src/state-managers/settingsStore";

export function getActiveNetwork() {
  const activeNetwork = useSettingsStore.getState().activeNetwork;

  return activeNetwork;
};