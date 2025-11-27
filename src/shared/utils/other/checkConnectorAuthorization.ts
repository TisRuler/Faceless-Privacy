import { getConnectors } from "@wagmi/core";
import { useSettingsStore } from "~~/src/state-managers";

/**
 * Checks if a target connector is authorized (connected).
 * Returns `false` for any failure (missing config, connector not found, etc.).
 */
export const checkConnectorAuthorization = async (
  targetConnectorId?: string
): Promise<boolean> => {
  if (!targetConnectorId) return false;

  try {
    const wagmiConfig = useSettingsStore.getState().wagmiConfig;
    const targetConnector = getConnectors(wagmiConfig).find(store => store.id === targetConnectorId);
    return !!(await targetConnector?.isAuthorized?.());
  } catch {
    return false; // Catch all errors (config, connectors, auth checks)
  }
};