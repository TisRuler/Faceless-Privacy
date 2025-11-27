import { RailgunStorageKey, RailgunWalletConnectionType } from "../../enums";

export const isRailgunWalletReconnectionTypeSignature = () => {
  const railgunWalletConnectionType = localStorage.getItem(RailgunStorageKey.HowWasRailgunWalletConnected);
  const result = railgunWalletConnectionType === RailgunWalletConnectionType.Signature;

  return result;
};