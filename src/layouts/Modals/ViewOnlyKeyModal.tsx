import React, { useState, useRef, useEffect } from "react";
import { 
  ModalFrame, 
  ModalTitle, 
  ModalInfoCard,
  ModalInfoBox
} from "./shared/components";
import { closeViewOnlyKeyModal } from "./modalUtils";
import { usePrivateAddressStore } from "~~/src/state-managers";
import { getWalletShareableViewingKey } from "@railgun-community/wallet";
import { CheckCircleIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { handleCopyToClipboard } from "./shared/utils/handleCopyToClipboard";
import { VerifyOwnershipPanel } from "./shared/panels";
import { getNotificationFromError } from "~~/src/shared/utils/other/getNotificationFromError";
import { logError } from "~~/src/shared/utils/other/logError";
import toast from "react-hot-toast";

export const ViewOnlyKeyModal = () => {
  const [addressCopied, setAddressCopied] = useState(false);
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

  const handleClick = () => { 
    handleCopyToClipboard(viewingKeyRef.current);
    setAddressCopied(true);
    setTimeout(() => setAddressCopied(false), 2000);
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
            <ModalInfoCard
              title="Key"
              body={viewingKeyRef.current}
              icon={
                addressCopied ? (
                  <CheckCircleIcon
                    className="ml-1 h-6 w-4 cursor-pointer text-xl font-normal"
                    aria-hidden="true"
                    strokeWidth={2}
                  />
                ) : (
                  <DocumentDuplicateIcon
                    className="ml-1 h-6 w-4 cursor-pointer text-xl font-normal"
                    aria-hidden="true"
                    strokeWidth={1.8}
                  />
                )
              }
              onClick={handleClick}
            />
          </>
        )}
      </>
    </ModalFrame>
  );
};
