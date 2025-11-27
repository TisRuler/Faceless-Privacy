import { GENERAL_NOTIFICATIONS } from "~~/src/constants/notifications";
import { validateRailgunAddress, validateEthAddress } from "@railgun-community/wallet";

export function validateReceiverAddress(address: string, isPrivateAddress: boolean): void {
  const isValid = isPrivateAddress
    ? validateRailgunAddress(address)
    : validateEthAddress(address);

  if (!isValid) {
    throw new Error(GENERAL_NOTIFICATIONS.CHECK_ADDRESS);
  }
}