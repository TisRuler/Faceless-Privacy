import React, { useRef, useState, useEffect } from "react";
import { PRIVATE_ADDRESS_NOTIFICATIONS } from "~~/src/constants/notifications";
import { 
  ModalCentreMessage, 
  ModalFrame, 
  ModalTitle, 
  ModalActionButton, 
  ModalPasswordInput, 
  ModalInfoBox, 
  MnemonicDisplaySection 
} from "../shared/components";
import { useEphemeralPassword } from "../shared/hooks/useEphemeralPassword";
import { createPrivateAddressFromPassword } from "./utils/createPrivateAddressFromPassword";
import { closeCreateWithPasswordModal } from "../modalUtils";
import { logError } from "~~/src/shared/utils/other/logError";
import { validateNewPasswordChoice } from "../shared/utils/validateNewPasswordChoice";
import { getNotificationFromError } from "~~/src/shared/utils/other";
import toast from "react-hot-toast";

/**
 * Private Addresses created via this flow rely primarily on a user-defined password for recovery.
 * However, the backup mnemonic is essential if localStorage is cleared or if the user switches devices or browsers.
 *
 * Requirement: This component must be unmounted from outside (e.g., via parent logic).
 * Note: On unmount, password and mnemonic are cleared from memory. This is critical for security.
 */
export const CreatePrivateAddressWithPasswordModal = () => {

  // States
  const [isPasswordSection, setIsPasswordSection] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Refs for sensitive data
  const { passwordRef: passwordRef1, readPassword: readPassword1 } = useEphemeralPassword();
  const { passwordRef: passwordRef2, readPassword: readPassword2 } = useEphemeralPassword();
  const privateAddressMnemonicRef = useRef<string>("");

  const handleCreatePrivateAddress = async () => { 
    setIsLoading(true);
    try {
      const password1 = readPassword1();
      const password2 = readPassword2();

      validateNewPasswordChoice(password1, password2);

      const mnemonic = await createPrivateAddressFromPassword(password1!);
      privateAddressMnemonicRef.current = mnemonic;
      setIsPasswordSection(false);
    } catch (error) {
      const errorMessageToDisplay = getNotificationFromError(error, PRIVATE_ADDRESS_NOTIFICATIONS.ERROR_CONNECTING);
      toast.error(errorMessageToDisplay);
      logError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDoneClick = () => {
    closeCreateWithPasswordModal();
    toast.success(PRIVATE_ADDRESS_NOTIFICATIONS.CONNECTED);
  };

  // Wipes sensitive data before unmount (password wipes within the hook by default)
  useEffect(() => {
    return () => {
      privateAddressMnemonicRef.current = "";
    };
  }, []);

  const renderPasswordUI = (
    <>
      <ModalInfoBox>
        This password will be required the next time you import your address.
      </ModalInfoBox>

      <ModalPasswordInput passwordRef={passwordRef1} />
      <ModalPasswordInput passwordRef={passwordRef2} isForConfirmation={true}/>

      <ModalActionButton name="Done" isDisabled={isLoading} onClick={handleCreatePrivateAddress}/>
    </>
  );

  return (
    <ModalFrame onExitClick={closeCreateWithPasswordModal} shouldHandleProvider={true}>

      <ModalTitle title="Create a Private Address" />

      {isLoading ? (
        <ModalCentreMessage message="Loading..."/>
      ) : (
        <>
          {isPasswordSection 
            ? renderPasswordUI : (
              <MnemonicDisplaySection 
                mnemonic={privateAddressMnemonicRef.current}
                handleDoneClick={handleDoneClick}
                isDerivedFromPasswordOrUknown={false}
              />
            )
          }
        </>
      )}
    </ModalFrame>
  );
};
