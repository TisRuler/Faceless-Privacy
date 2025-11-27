import { toast } from "react-hot-toast";
import { getAccount, switchChain } from "@wagmi/core";
import { enforceAccountSwitch } from "./enforceAccountSwitch";
import { checkConnectorAuthorization } from "../other/checkConnectorAuthorization"; 
import { Config } from "wagmi";
import { ChainData } from "~~/src/config/chains/types";
import { logError } from "../other/logError";
import type { ConnectorRole } from "~~/src/state-managers";

type EnsureWalletConnectorReadyParams = {
  activeNetwork: ChainData;
  wagmiConfig: Config;
  shouldBootstrapNetworkStack: boolean;
  targetConnectorId: string | undefined;
  targetRole: ConnectorRole;
  displayConnect: () => void | Promise<void>;
};

export const ensureWalletConnectorReady = async ({
  activeNetwork,
  wagmiConfig,
  shouldBootstrapNetworkStack,
  targetConnectorId,
  targetRole,
  displayConnect,
}: EnsureWalletConnectorReadyParams): Promise<boolean> => {
  
  if (shouldBootstrapNetworkStack) {
    displayConnect();
    return false;
  }

  const account = getAccount(wagmiConfig);
  const isWalletConnected = account.isConnected;
  const isWalletOnCorrectChain = account.chainId === activeNetwork.id;
  const isSelfSignerConnectorAuthorised = await checkConnectorAuthorization(targetConnectorId);

  if (!isWalletConnected || !isSelfSignerConnectorAuthorised) {
    displayConnect();
    return false;
  }

  if (!isWalletOnCorrectChain) {
    try {
      await switchChain(wagmiConfig, { chainId: activeNetwork.id });
    } catch (error) {
      logError(error);
      toast.error("Switch Your Wallet’s Network");

      return false;
    }
  }

  await enforceAccountSwitch(targetRole);
  return true;
};
