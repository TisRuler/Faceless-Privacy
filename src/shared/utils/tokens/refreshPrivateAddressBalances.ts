import { refreshBalances } from "@railgun-community/wallet";
import { usePrivateAddressStore } from "~~/src/state-managers";
import { logError } from "../other/logError";
import { ChainData } from "~~/src/config/chains/types";

export const refreshPrivateAddressBalances = async (shouldBootstrapNetworkStack: boolean, activeNetwork: ChainData) => {

  if (shouldBootstrapNetworkStack) return;

  const railgunChain = activeNetwork.railgunChain;
  const railgunWalletId = usePrivateAddressStore.getState().railgunWalletId;

  try {
    await refreshBalances(railgunChain, [railgunWalletId]);
  } catch (error) {
    logError(error);
  }
};