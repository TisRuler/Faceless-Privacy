import { RailgunStorageKey, RailgunWalletConnectionType } from "../../enums";

export const isRailgunWalletReconnectionTypePasswordOrUnknown = () => {
  const railgunWalletConnectionType = localStorage.getItem(RailgunStorageKey.HowWasRailgunWalletConnected);
  const result = railgunWalletConnectionType === RailgunWalletConnectionType.Password || railgunWalletConnectionType === null;

  return result;
};