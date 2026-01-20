import React, { useState, useRef, useEffect } from "react";
import { 
  ModalFrame, 
  ModalTitle, 
  ModalCopyCard,
  ModalInfoBox
} from "./shared/components";
import { closeViewOnlyKeyModal } from "./modalUtils";
import { usePrivateAddressStore } from "~~/src/state-managers";
import { getWalletShareableViewingKey } from "@railgun-community/wallet";
import { VerifyOwnershipPanel } from "./shared/panels";
import { getNotificationFromError } from "~~/src/shared/utils/other/getNotificationFromError";
import { logError } from "~~/src/shared/utils/other/logError";
import toast from "react-hot-toast";

export const ViewOnlyKeyModal = () => {
  const [isUnlockSection, setIsUnlockSection] = useState(true);

  const viewingKeyRef = useRef<string>(""); // Ephemeral storage for parent usage

  // Called when VerifyOwnershipPanel returns ephemeral result
  const handleVerified = async () => {
    try {
      const railgunWalletId = usePrivateAddressStore.getState().railgunWalletId;
      viewingKeyRef.current = await getWalletShareableViewingKey(railgunWalletId);

      setIsUnlockSection(false);         // Show key panel
    } catch (error) {
      toast.error(getNotificationFromError(error));
      logError(error);
    }
  };

  useEffect(() => {
    return () => {
      viewingKeyRef.current = ""; // Wipe on unmount
    };
  }, []);

  return (
    <ModalFrame onExitClick={closeViewOnlyKeyModal}>
      <>
        <ModalTitle title="View-Only Key" />
        {isUnlockSection ? (
          <VerifyOwnershipPanel 
            onVerified={handleVerified} 
            closeParent={closeViewOnlyKeyModal}
          />
        ) : (
          <>
            <ModalInfoBox>
              Reminder: Be selective with who you share this with.
            </ModalInfoBox>
            <ModalCopyCard
              title="Key"
              textToBeCopied={viewingKeyRef.current}
            />
          </>
        )}
      </>
    </ModalFrame>
  );
};
