import { getClient, getConnectors } from "wagmi/actions";
import { Connector } from "wagmi";
import { getInstalledWallets } from "~~/src/layouts/Modals/shared/utils/getInstalledWallets";
import { useSettingsStore, useConnectorRolesStore, ConnectorRole } from "~~/src/state-managers";
import { switchAccount } from "wagmi/actions";

function getConnectorById(targetId: string, connectors: readonly Connector[]): Connector {
  const installedConnectors = getInstalledWallets(connectors);
  const connector = installedConnectors.find((c) => c.id === targetId);
  if (!connector) {
    throw new Error(`Connector with id "${targetId}" not found among installed connectors.`);
  }
  return connector;
}

/**
 * Enforces a wallet switch for the given ConnectorRole.
 */
export const enforceAccountSwitch = async (targetRole: ConnectorRole): Promise<{ address: `0x${string}` }> => {
  const getConnectorIdForRole = useConnectorRolesStore.getState().getConnectorIdForRole;

  const wagmiConfig = useSettingsStore.getState().wagmiConfig;
  const targetConnectorId = await getConnectorIdForRole(targetRole);

  if (!targetConnectorId) {
    throw new Error(`Target connector ID not found for ${targetRole}`);
  }

  const connectors = getConnectors(wagmiConfig);
  const targetConnector = getConnectorById(targetConnectorId, connectors);

  const client = getClient(wagmiConfig);

  if (!client) {
    throw new Error(`No Client found for ${targetRole}`);
  }

  const { accounts } = await switchAccount(wagmiConfig, { connector: targetConnector });

  if (!accounts[0]) {
    throw new Error(`No accounts returned for ${targetRole}`);
  }

  return { address: accounts[0] };
};