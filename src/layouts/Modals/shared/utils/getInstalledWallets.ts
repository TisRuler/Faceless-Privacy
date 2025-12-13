import { Connector } from "wagmi";
import { supportedWalletsConfig } from "~~/src/config/supportedWalletsConfig";

const allowedIds = new Set(
  supportedWalletsConfig.flatMap(w => w.ids)
);

export const getInstalledWallets = (connectors: readonly Connector[]) => {
  return connectors.filter((connector) => {
    if (connector.type !== "injected") return false;
    if (!connector.id) return false;
    return allowedIds.has(connector.id);
  });
};
