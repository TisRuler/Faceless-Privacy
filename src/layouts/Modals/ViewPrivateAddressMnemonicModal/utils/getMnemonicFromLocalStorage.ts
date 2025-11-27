import { getWalletMnemonic } from "@railgun-community/wallet";
import { getEncryptionKeyFromPassword } from "../../shared/utils/hashService";
import { PRIVATE_ADDRESS_NOTIFICATIONS } from "~~/src/constants/notifications";
import { RailgunStorageKey } from "~~/src/shared/enums";

/** Requirement: Handle error in parent **/
export const getMnemonicFromLocalStorage = async (passwordRaw: string): Promise<string> => {
  const encryptionKey = await getEncryptionKeyFromPassword(passwordRaw);

  const id = localStorage.getItem(RailgunStorageKey.WalletId);

  if (!id) {
    throw new Error(PRIVATE_ADDRESS_NOTIFICATIONS.ERROR_ID_NOT_FOUND_IN_STORAGE);
  }

  return getWalletMnemonic(encryptionKey, id);
};