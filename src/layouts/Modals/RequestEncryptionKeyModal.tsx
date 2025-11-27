import { useState } from "react";
import { ModalFrame, ModalTitle } from "./shared/components";
import { getEncryptionKeyFromPassword } from "./shared/utils/hashService";
import { encryptionKeyBus } from "~~/src/shared/bus/encryptionKeyBus";
import { closeRequestEncryptionKeyModal } from "./modalUtils";
import { useWalletModeScreenStore } from "~~/src/state-managers";
import { PrivateAddressAuthForm } from "./shared/panels";
import { WALLET_MODE_NOTIFICATIONS } from "~~/src/constants/notifications";
import { getNotificationFromError } from "~~/src/shared/utils/other";
import toast from "react-hot-toast";

/* Note: Any component using this needs to be prepared for the error thrown in encryptionKeyBus by handleExitClick */
export const RequestEncryptionKeyModal = () => {

  const [isProcessing, setIsProcessing] = useState(false);

  const getEncryptionKey = async (password: string): Promise<void> => {
    setIsProcessing(true);

    let encryptionKey;

    try {
      encryptionKey = await getEncryptionKeyFromPassword(password);

      encryptionKeyBus.publish(encryptionKey);
      closeRequestEncryptionKeyModal();
    } catch (error) {
      toast.error(getNotificationFromError(error));
      throw(error);
    } finally {
      encryptionKey = null;
      setIsProcessing(false);
    }
  };
  
  const handleExitClick = () => {
    if (isProcessing) return;

    const feeDataToDisplay = useWalletModeScreenStore.getState().feeDataToDisplay;

    const errorMessage = feeDataToDisplay ? WALLET_MODE_NOTIFICATIONS.TX_CANCELLED : WALLET_MODE_NOTIFICATIONS.ESTIMATION_CANCELLED;

    encryptionKeyBus.cancel(errorMessage);
    closeRequestEncryptionKeyModal();
  };

  // UI
  const isFeeEstimated = useWalletModeScreenStore((state) => state.feeDataToDisplay);
  const titleText = isFeeEstimated ? "Send To Recipient" : "Estimate Fee";

  return (
    <ModalFrame onExitClick={handleExitClick} shouldHandleProvider={true}>
      <ModalTitle title={titleText} />
      
      <PrivateAddressAuthForm
        signatureAction={getEncryptionKey}
        passwordAction={getEncryptionKey}
        closeParent={handleExitClick}
      />

    </ModalFrame>
  );
};