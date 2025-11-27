import {
  loadWalletByID,
  refreshBalances
} from "@railgun-community/wallet";
import { getEncryptionKeyFromPassword } from "../hashService";
import { getActiveNetwork } from "~~/src/shared/utils/network";
import { usePrivateAddressStore } from "~~/src/state-managers";
import { RailgunStorageKey } from "~~/src/shared/enums";
import { PRIVATE_ADDRESS_NOTIFICATIONS } from "~~/src/constants/notifications";

export const connectPrivateAddressWithPassword = async (passwordRaw: string) => {

  const encryptionKey = await getEncryptionKeyFromPassword(passwordRaw);
  const id = localStorage.getItem(RailgunStorageKey.WalletId);

  if (!id) throw new Error(PRIVATE_ADDRESS_NOTIFICATIONS.ERROR_ID_NOT_FOUND_IN_STORAGE);

  const railgunWalletInfo = await loadWalletByID(encryptionKey, id, false);
  const railgunAddress = railgunWalletInfo.railgunAddress;

  usePrivateAddressStore.setState({
    yourPrivateAddress: railgunAddress,
    railgunWalletId: id,
  });

  const { railgunChain } = getActiveNetwork();

  refreshBalances(railgunChain, id);
};