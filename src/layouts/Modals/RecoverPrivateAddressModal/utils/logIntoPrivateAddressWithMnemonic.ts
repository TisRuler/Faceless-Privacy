import {
  createRailgunWallet,
  refreshBalances
} from "@railgun-community/wallet";
import { setEncryptionKeyFromPassword } from "../../shared/utils/hashService";
import { getActiveNetwork } from "~~/src/shared/utils/network";
import { usePrivateAddressStore } from "~~/src/state-managers";
import { RailgunStorageKey, RailgunWalletConnectionType } from "~~/src/shared/enums";

export const logIntoPrivateAddressWithMnemonic = async (passwordKeyRaw: string, mnemonic: string) => {

  const encryptionKey = await setEncryptionKeyFromPassword(passwordKeyRaw);

  const railgunWallet = await createRailgunWallet(encryptionKey, mnemonic, 0);
  
  const id = railgunWallet.id;
  localStorage.setItem(RailgunStorageKey.WalletId, id);
  localStorage.setItem(RailgunStorageKey.HowWasRailgunWalletConnected, RailgunWalletConnectionType.Password);

  usePrivateAddressStore.setState({
    yourPrivateAddress: railgunWallet.railgunAddress,
    railgunWalletId: id,
  });

  const { railgunChain } = getActiveNetwork();

  refreshBalances(railgunChain, id);
};