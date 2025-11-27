import React, { useEffect, useRef, useState } from "react";
import { validateMnemonic } from "bip39";
import { ModalActionButton } from "../../shared/components/ModalActionButton";
import { MnemonicLength } from "../../shared/types";
import { ModalInfoBox, ModalPasswordInput, ModalCentreMessage } from "../../shared/components";
import { useEphemeralPassword } from "../../shared/hooks/useEphemeralPassword";
import { logIntoPrivateAddressWithMnemonic } from "../utils/logIntoPrivateAddressWithMnemonic";
import { PRIVATE_ADDRESS_NOTIFICATIONS } from "~~/src/constants/notifications";
import { MnemonicInputSection } from "./MnemonicInputSection";
import { logError } from "~~/src/shared/utils/other/logError";
import { validateNewPasswordChoice } from "../../shared/utils/validateNewPasswordChoice";
import toast from "react-hot-toast";
import { getNotificationFromError } from "~~/src/shared/utils/other";

interface MnemonicMethodFlowProps {
  mnemonicLength: MnemonicLength;
  switchToCreateWithPasswordView: () => void;
  closeModal: () => void;
}

export const MnemonicMethodFlow: React.FC<MnemonicMethodFlowProps> = ({
  mnemonicLength,
  switchToCreateWithPasswordView,
  closeModal,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInputMnemonicView, setIsInputMnemonicView] = useState<boolean>(true);

  // useRefs for sensitive ephemeral mnemonic
  const { passwordRef: passwordRef1, readPassword: readPassword1 } = useEphemeralPassword();
  const { passwordRef: passwordRef2, readPassword: readPassword2 } = useEphemeralPassword();
  const privateAddressMnemonicRef = useRef<string>("");

  const switchToPasswordView = () => setIsInputMnemonicView(false);

  const handleMnemonicFormFilled = (phraseInputs: string[]) => {
    const mnemonic = phraseInputs.join(" ").trim();
  
    if (!validateMnemonic(mnemonic)) {
      toast.error("Invalid mnemonic");
      return;
    };
  
    privateAddressMnemonicRef.current = mnemonic;
    switchToPasswordView();
  };  

  const handleImport = async () => {
    setIsLoading(true);
    try {
      const password1 = readPassword1();
      const password2 = readPassword2();
  
      validateNewPasswordChoice(password1, password2);
      
      await logIntoPrivateAddressWithMnemonic(password1!, privateAddressMnemonicRef.current);

      toast.success(PRIVATE_ADDRESS_NOTIFICATIONS.CONNECTED);
      closeModal(); // This triggers the useEffect too
    } catch (error) {
      const errorMessageToDisplay = getNotificationFromError(error, PRIVATE_ADDRESS_NOTIFICATIONS.ERROR_CONNECTING);
      toast.error(errorMessageToDisplay);
      logError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Wipes sensitive data right before the component unmounts
  useEffect(() => {
    return () => {
      privateAddressMnemonicRef.current = "";
    };
  }, []);

  return (
    <>
      {isLoading ? (
        <ModalCentreMessage message="Loading..."/>
      ) : (
        <>
          {isInputMnemonicView ? (
            <MnemonicInputSection 
              mnemonicLength={mnemonicLength}
              handleDone={handleMnemonicFormFilled}
              switchToCreatePanel={switchToCreateWithPasswordView}
            />
          ) : (
            <>
              <ModalInfoBox>
              This password will be required the next time you import your private address.
              </ModalInfoBox>
                        
              <ModalPasswordInput passwordRef={passwordRef1} />
              <ModalPasswordInput passwordRef={passwordRef2} isForConfirmation={true}/>

              <ModalActionButton 
                name="Done" 
                onClick={handleImport} 
              />
            </>
          )}
        </>
      )}
    </>      
  );
};