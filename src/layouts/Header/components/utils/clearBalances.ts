import { usePrivateAddressStore, usePublicWalletStore } from "~~/src/state-managers";

export const clearBalances = () => {
  usePrivateAddressStore.setState({
    spendablePrivateTokens: [],
    nonSpendablePrivateTokens: [],
    pendingPrivateTokens: [],
  });
  usePublicWalletStore.getState().setTokensInPublicWallet([]);
};