import { useSettingsStore } from "~~/src/state-managers";
import { getPublicClient as getPublicClientFromConfig } from "@wagmi/core";

export function getPublicClient() {
  
  const wagmiConfig = useSettingsStore.getState().wagmiConfig;
  const client = getPublicClientFromConfig(wagmiConfig);

  if (!client) {
    throw new Error("Wagmi client is not defined. Please check your wagmiConfig setup.");
  }

  return client;  // Return provider directly
};