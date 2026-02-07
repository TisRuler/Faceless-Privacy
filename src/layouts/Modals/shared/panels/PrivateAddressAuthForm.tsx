import React, { useEffect, useState } from "react";
import { 
  ModalCentreMessage, 
  ModalPasswordInput, 
  ModalActionButton, 
  ModalFooterLink, 
  ModalInfoBox
} from "../components";
import { ConnectWalletPanel } from "./ConnectWalletPanel";
import { ConnectorRoles } from "~~/src/state-managers";
import { useShouldBootstrapNetworkStack } from "~~/src/shared/hooks/useShouldBootstrapNetworkStack";
import { LocalStorageWarning } from "../components";
import { useSettingsStore, useConnectorRolesStore } from "~~/src/state-managers";
import { logError } from "~~/src/shared/utils/other";
import { useEphemeralPassword } from "../hooks/useEphemeralPassword";
import { 
  isRailgunWalletReconnectionTypeSignatureOrUnknown, 
  isRailgunWalletReconnectionTypePassword, 
  ensureWalletConnectorReady, 
  getSignatureForPrivateAddress 
} from "~~/src/shared/utils/wallet";
import { getNotificationFromError } from "~~/src/shared/utils/other";
import { openRecoverPrivateAddressModal } from "../../modalUtils";
import toast from "react-hot-toast";
import { PRIVATE_ADDRESS_NOTIFICATIONS } from "~~/src/constants/notifications";

// Helper
const clearPublicConnectorRole = () => useConnectorRolesStore.getState().clearRole(ConnectorRoles.PUBLIC);

// Main
interface PrivateAddressAuthFormProps {
  isSignatureConnectionOnly?: boolean;
  signatureAction: (value: string) => Promise<void>;
  passwordAction: (value: string) => Promise<void>;
  closeParent?: () => void;
  doHandleToastErrors?: boolean;
}

/** 
 * Requirement: This component must be unmounted from outside (e.g., via parent logic).
 * Features: 
 * - If "signatureAction" is required, ensures the connector is ready before calling it.
 * - On unmount, password and mnemonic are cleared from memory.
 * - Handles errors centrally for toast notifications.
 * Note: switching to the recovery modal from here is optional by providing the "closeParent" input.
 **/ 
export const PrivateAddressAuthForm: React.FC<PrivateAddressAuthFormProps> = ({
  isSignatureConnectionOnly = false,
  signatureAction,
  passwordAction,
  closeParent,
  doHandleToastErrors = false
}) => {
  
  const activeNetwork = useSettingsStore.getState().activeNetwork;
  const wagmiConfig = useSettingsStore.getState().wagmiConfig;

  // Reconnection type checks
  const isReconnectionTypeSignatureOrUnknown = isRailgunWalletReconnectionTypeSignatureOrUnknown();
  const isReconnectionTypePassword = isRailgunWalletReconnectionTypePassword();

  // Decides whether we should use signature flow
  const useSignatureFlow = isSignatureConnectionOnly || isReconnectionTypeSignatureOrUnknown;
  const usePasswordFlow = !useSignatureFlow && isReconnectionTypePassword;

  // Hooks
  const { passwordRef, readPassword } = useEphemeralPassword();
  const shouldBootstrapNetworkStack = useShouldBootstrapNetworkStack();
  const publicConnectorId = useConnectorRolesStore((store) => store.publicConnectorId);

  // Main states
  const [isPasswordProcessing, setIsPasswordProcessing] = useState(false);
  const [isWalletProcessing, setIsWalletProcessing] = useState(false);
  
  const isWalletConnectionDisplayed = useSignatureFlow && !publicConnectorId;
  const isSignatureSectionDisplayed = useSignatureFlow && !usePasswordFlow && !isWalletConnectionDisplayed;

  // Main functions
  const signatureHandler  = async () => {
    const publicConnectorId = useConnectorRolesStore.getState().publicConnectorId;

    const isConnectorReady = await ensureWalletConnectorReady({
      activeNetwork,
      wagmiConfig,
      shouldBootstrapNetworkStack,
      targetConnectorId: publicConnectorId,
      targetRole: ConnectorRoles.PUBLIC,
      displayConnect: () => clearPublicConnectorRole(),
    });
    
    if (!isConnectorReady) return;

    let signature;

    try {
      signature = await getSignatureForPrivateAddress();
      await signatureAction(signature);
    } catch (error) {
      clearPublicConnectorRole();
      if (doHandleToastErrors) toast.error(getNotificationFromError(error));
      logError(error);
    } finally {
      signature = null;
    }
  };

  const passwordHandler  = async () => {
    setIsPasswordProcessing(true);

    let password;

    try {
      password = readPassword();
      if (!password) {
        toast.error(PRIVATE_ADDRESS_NOTIFICATIONS.ERROR_PASSWORD_EMPTY);
        return;
      }
      
      await passwordAction(password);
    } catch (error) {
      if (doHandleToastErrors) toast.error(getNotificationFromError(error));
      logError(error);
    } finally {
      password = null;
      setIsPasswordProcessing(false);
    }
  };

  // Helper
  const switchToRecoveryModal = () => {
    closeParent?.();
    openRecoverPrivateAddressModal();
  };

  /*
   * useEffect trigger: If the user will need a signature to Authenticate, this flow gets used on initial render.
   *
   * How it works:
   * - This runs once when the component is rendered.
   * - Checks if a signature is required, continue the flow if true.
   * - Checks if there is no publicConnectorId, open the wallet connection panel if true.
   * - Otherwise call the signatureHandler so it can check if the connector is ready,
   *   so it can open wallet connection panel if the connector isn't ready or attempt signatureAction if ready.
  */
  useEffect(() => {
    if (useSignatureFlow) {
      const publicConnectorId = useConnectorRolesStore.getState().publicConnectorId;
      if (!publicConnectorId) return;
      
      signatureHandler();
    }
  }, []);

  // Ui
  const footerText = useSignatureFlow ? "Need seed phrase recovery?" : "Forgot your password?";
  
  const showFooter = (
    (closeParent && !isWalletProcessing && isWalletConnectionDisplayed) || 
    (closeParent && !isWalletConnectionDisplayed && !isSignatureSectionDisplayed)
  );

  return (
    <>

      {!isPasswordProcessing && <LocalStorageWarning />}

      {isPasswordProcessing ? (
        <ModalCentreMessage message="Loading..."/>
      ) : (
        <>
          {isWalletConnectionDisplayed ? (
            <ConnectWalletPanel 
              setRole={ConnectorRoles.PUBLIC} 
              onConnection={signatureHandler} 
              isProcessing={(processing) => setIsWalletProcessing(processing)}
            />
          ) : (
            <>
              <ModalInfoBox isStringWithLink={true}>
                For information about how your private address is generated, click [here](https://faceless-privacy.gitbook.io/docs/general-information/technical-info#how-your-private-address-is-generated).
              </ModalInfoBox>
              {isSignatureSectionDisplayed ? (
                <ModalActionButton 
                  onClick={() => toast.success("Check Your Wallet", { duration: 4000 })} 
                  name={"Complete Action In Wallet..."}
                />
              ) : (
                <>
                  <ModalPasswordInput passwordRef={passwordRef} />
                  <ModalActionButton 
                    name="Done"
                    onClick={passwordHandler}
                    isDisabled={isPasswordProcessing}
                  />
                </>
              )}

            </>
          )}

          {showFooter && 
            <ModalFooterLink 
              text={footerText}
              handleLinkClick={switchToRecoveryModal}
              isTagUnderACard={isWalletConnectionDisplayed}
            />
          }  
        </>
      )}
    </> 
  );
};