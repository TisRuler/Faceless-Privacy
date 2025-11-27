
import { ModalInfoBox } from "./";
import { isRailgunWalletStorageCorrupted } from "~~/src/shared/utils/wallet";
  
/*
   * Mode: Get encryptionkey from signature or password input, derive the mnemonic from that and store it in a ref, display it
   *
   * Note: On unmount, password and mnemonic are cleared from memory. This is critical for security.
  */
export const LocalStorageWarning = () => {

  const isStorageCorrupted = isRailgunWalletStorageCorrupted();
  
  // Ui
  return (
    <>
      {isStorageCorrupted &&
        <ModalInfoBox>
            Some data in your device’s local storage is missing. <br/>
            Your privacy is secure, but certain features may not work reliably without recovering your private address.
        </ModalInfoBox>
      }
    </>
  );
};