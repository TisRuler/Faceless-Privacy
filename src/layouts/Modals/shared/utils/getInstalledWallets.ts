import { Connector } from "wagmi";
import { supportedWalletsConfig } from "~~/src/config/supportedWalletsConfig";

const allowedIds = new Set(supportedWalletsConfig.map(w => w.id)); 

export const getInstalledWallets = (connectors: readonly Connector[]) => {
  return connectors.filter((connector) => {
    if (connector.type !== "injected") return false;
    return connector.id && allowedIds.has(connector.id);
  });
};
