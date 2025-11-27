import React, { useState } from "react";
import { ModalTitleWithToggle, ModalFrame } from "../shared/components";
import { closeRecoverPrivateAddressModal, openCreateWithPasswordModal } from "../modalUtils";
import { ConnectPrivateAddressPanel } from "../shared/panels";
import { MnemonicLength } from "../shared/types";
import { MnemonicMethodFlow } from "./components/MnemonicMethodFlow";
import { isRailgunWalletReconnectionTypePassword } from "~~/src/shared/utils/wallet";

/**
 * Internal states will be cleared if this gets unmounted externally, which is how it should be used.
 */
export const RecoverPrivateAddressModal = () => {

  const isReconnectionTypePassword = isRailgunWalletReconnectionTypePassword();

  const [mnemonicLength, setMnemonicLength] = useState<MnemonicLength>(12);
  const [isSignatureMode, setIsSignatureMode] = useState<boolean>(isReconnectionTypePassword);

  const switchRecoveryMode = () => {
    if (isSignatureMode) { // Switch to 12 word mnemonic view
      setIsSignatureMode(false);
      setMnemonicLength(12);
      return;
    } else if (mnemonicLength === 12) {
      setMnemonicLength(24);
      return;
    } else { // Is 24 word mnemonic view, switch to signature flow
      setIsSignatureMode(true);
    }
  };

  const switchToCreateWithPasswordModal = () => {
    closeRecoverPrivateAddressModal();
    openCreateWithPasswordModal();
  };

  return ( 
    <ModalFrame onExitClick={closeRecoverPrivateAddressModal}>

      <ModalTitleWithToggle 
        title="Recover Your Private Address" 
        toggleTitle={"Method"}
        onClick={switchRecoveryMode}
        isDisplayingToggle={true}
      />

      {isSignatureMode ? (
        <ConnectPrivateAddressPanel
          isSignatureConnectionOnly={true}
          onConnection={closeRecoverPrivateAddressModal}
        />
      ) : (
        <MnemonicMethodFlow 
          mnemonicLength={mnemonicLength}
          switchToCreateWithPasswordView={switchToCreateWithPasswordModal}
          closeModal={closeRecoverPrivateAddressModal}
        />
      )}

    </ModalFrame>
  );
};
