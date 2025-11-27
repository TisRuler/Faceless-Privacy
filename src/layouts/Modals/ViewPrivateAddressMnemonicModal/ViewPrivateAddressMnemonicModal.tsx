import React, { 
  useState, 
  useRef, 
  useEffect 
} from "react";
import { ModalFrame, ModalTitle, MnemonicDisplaySection } from "../shared/components";
import { getMnemonicFromLocalStorage } from "./utils/getMnemonicFromLocalStorage";
import { closeViewPrivateAddressMnemonicModal } from "../modalUtils";
import { useConnectorRolesStore, ConnectorRoles } from "~~/src/state-managers";
import { logError } from "~~/src/shared/utils/other/logError";
import { VerifyOwnershipPanel } from "../shared/panels";
import { isRailgunWalletReconnectionTypeSignatureOrUnknown, isRailgunWalletReconnectionTypePasswordOrUnknown } from "~~/src/shared/utils/wallet";
import { getNotificationFromError } from "~~/src/shared/utils/other";
import toast from "react-hot-toast";

const clearPublicRole = () => useConnectorRolesStore.getState().clearRole(ConnectorRoles.PUBLIC); // Used when you need to re-select a connector for the signature

/*
 * Mode: Get encryptionkey from signature or password input, derive the mnemonic from that and store it in a ref, display it
 *
 * Note: On unmount, password and mnemonic are cleared from memory. This is critical for security.
*/
export const ViewPrivateAddressMnemonicModal = () => {

  const [isUnlockSection, setIsUnlockSection]= useState<boolean>(true);

  const privateAddressMnemonicRef = useRef<string>("");

  const isReconnectionTypeSignatureOrUnknown = isRailgunWalletReconnectionTypeSignatureOrUnknown();
  const isReconnectionTypePasswordOrUnknown = isRailgunWalletReconnectionTypePasswordOrUnknown();

  // Main unlock function
  const handleViewYourSeedPhrase = async (password: string) => {
    try {
      privateAddressMnemonicRef.current = await getMnemonicFromLocalStorage(password);
  
      setIsUnlockSection(false);
    } catch (error) {
      toast.error(getNotificationFromError(error));
      if (isReconnectionTypeSignatureOrUnknown) clearPublicRole();
      setIsUnlockSection(true);
      logError(error);
    }
  };
  
  // Wipes sensitive data right before the component unmounts
  useEffect(() => {
    return () => {
      privateAddressMnemonicRef.current = "";
    };
  }, []);

  // Main Render
  return (
    <ModalFrame onExitClick={closeViewPrivateAddressMnemonicModal}>
      <>
        <ModalTitle title="Save Your Mnemonic" />

        {isUnlockSection ? (
          <VerifyOwnershipPanel
            deriveSecretWithVerificationFn={async (input?: string) => {
              if (!input) throw new Error("Missing verification input");
              return input;
            }}
            onVerified={handleViewYourSeedPhrase}
            closeParent={closeViewPrivateAddressMnemonicModal}
          />
        ) : (
          <MnemonicDisplaySection 
            mnemonic={privateAddressMnemonicRef.current}
            handleDoneClick={closeViewPrivateAddressMnemonicModal}
            isDerivedFromPasswordOrUknown={isReconnectionTypePasswordOrUnknown}
          />
        )} 
        
      </>
    </ModalFrame>
  );
};