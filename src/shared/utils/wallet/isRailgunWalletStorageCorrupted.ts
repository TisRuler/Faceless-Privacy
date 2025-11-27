import { RailgunStorageKey } from "../../enums";
import { usePrivateAddressStore } from "~~/src/state-managers";
import { validateRailgunAddress } from "@railgun-community/wallet";

export const isRailgunWalletStorageCorrupted = (): boolean => {
  const { yourPrivateAddress } = usePrivateAddressStore.getState();
  
  // If no valid private address, consider it corrupted? Adjust based on your UX
  const isPrivateAddressValid = validateRailgunAddress(yourPrivateAddress);

  const requiredKeys = [
    RailgunStorageKey.HowWasRailgunWalletConnected,
    RailgunStorageKey.WalletId,
    RailgunStorageKey.HashPasswordStored,
    RailgunStorageKey.Salt,
  ];

  const isMissingAnyKeys = requiredKeys.some(key => !localStorage.getItem(key));

  return isPrivateAddressValid && isMissingAnyKeys;
};

