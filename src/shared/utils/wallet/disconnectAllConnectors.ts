import { disconnect, getAccount } from "wagmi/actions";
import { usePublicWalletStore, useConnectorRolesStore } from "~~/src/state-managers";
import { Config } from "wagmi";
import { logError } from "../other/logError";

export const disconnectAllConnectors = async (wagmiConfig: Config) => {
  // Clear app state immediately
  usePublicWalletStore.getState().setTokensInPublicWallet([]);
  useConnectorRolesStore.getState().clearAllRoles();

  try {
    const account = getAccount(wagmiConfig);

    if (!account.isConnected) return;

    // Disconnect all connectors safely
    const disconnectPromises = wagmiConfig.connectors.map(async (connector) => {
      if (connector.disconnect) {
        try {
          await connector.disconnect();
        } catch (error) {
          throw new Error(`Failed to disconnect ${connector.name}: ${error}`);
        }
      }
    });

    await Promise.all(disconnectPromises);

    // Disconnect wagmi session
    disconnect(wagmiConfig);

  } catch (error) {
    logError(error);
    throw error;
  }
};
