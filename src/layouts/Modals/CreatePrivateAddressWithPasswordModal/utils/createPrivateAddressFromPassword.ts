import { createRailgunWallet } from "@railgun-community/wallet";
import { Mnemonic, randomBytes } from "ethers";
import { getCreationBlockMap } from "./getCreationBlockMap";
import { setEncryptionKeyFromPassword } from "../../shared/utils/hashService";
import { usePrivateAddressStore } from "~~/src/state-managers";
import { RailgunStorageKey, RailgunWalletConnectionType } from "~~/src/shared/enums";

export const createPrivateAddressFromPassword = async (passwordRaw: string) => {
  try {
    const encryptionKey = await setEncryptionKeyFromPassword(passwordRaw);

    const creationBlockNumberMap = await getCreationBlockMap();
  
    const mnemonic = Mnemonic.fromEntropy(randomBytes(16)).phrase.trim();
  
    const railgunWallet = await createRailgunWallet(encryptionKey, mnemonic, creationBlockNumberMap);
    const id = railgunWallet.id;
  
    localStorage.setItem(RailgunStorageKey.WalletId, id);
    localStorage.setItem(RailgunStorageKey.HowWasRailgunWalletConnected, RailgunWalletConnectionType.Password);
  
    usePrivateAddressStore.setState({
      yourPrivateAddress: railgunWallet.railgunAddress,
      railgunWalletId: id,
    });
    
    return mnemonic;
  } catch (error) {
    localStorage.removeItem(RailgunStorageKey.WalletId);
    localStorage.removeItem(RailgunStorageKey.HowWasRailgunWalletConnected);
    throw error;
  }
};