import { RailgunStorageKey, RailgunWalletConnectionType } from "../../enums";

export const isRailgunWalletReconnectionTypePassword = () => {
  const railgunWalletConnectionType = localStorage.getItem(RailgunStorageKey.HowWasRailgunWalletConnected);
  const result = railgunWalletConnectionType === RailgunWalletConnectionType.Password;

  return result;
};