import { RailgunStorageKey, RailgunWalletConnectionType } from "../../enums";

export const isRailgunWalletReconnectionTypeSignatureOrUnknown = () => {
  const railgunWalletConnectionType = localStorage.getItem(RailgunStorageKey.HowWasRailgunWalletConnected);
  const result = railgunWalletConnectionType === RailgunWalletConnectionType.Signature || railgunWalletConnectionType === null;

  return result;
};