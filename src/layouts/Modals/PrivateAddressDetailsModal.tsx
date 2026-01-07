import React, { useState } from "react";
import { usePrivateAddressStore } from "~~/src/state-managers";
import { ModalFrame, ModalTitle, ModalInfoCard, LocalStorageWarning } from "./shared/components";
import { CheckCircleIcon, DocumentDuplicateIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { handleCopyToClipboard } from "./shared/utils/handleCopyToClipboard";
import { 
  openViewPrivateAddressMnemonicModal, 
  openViewOnlyKeyModal, 
  closePrivateAddressDetailsModal, 
  openGetPaymentLinkModal 
} from "./modalUtils";
import { isRailgunWalletReconnectionTypePasswordOrUnknown } from "~~/src/shared/utils/wallet";

const StyledChevronIcon = () => {
  return (
  <ChevronRightIcon
    className="h-4 w-4 text-xl font-normal"
    aria-hidden="true"
    strokeWidth={2.4}
  />
)}

export const PrivateAddressDetailsModal = () => {

  const yourPrivateAddress = usePrivateAddressStore((state) => state.yourPrivateAddress);
  const [addressCopied, setAddressCopied] = useState(false);
  
  const isReconnectionTypePasswordOrUknown = isRailgunWalletReconnectionTypePasswordOrUnknown();

  const handleCopyClick = () => { 
    handleCopyToClipboard(yourPrivateAddress);
    setAddressCopied(true);
    setTimeout(() => {
      setAddressCopied(false);
    }, 2000);
  };

  const handleViewYourSeedPhrase = () => {
    closePrivateAddressDetailsModal(); // close modal
    openViewPrivateAddressMnemonicModal(); //open modal
  };

  const handleViewViewOnlyKey = () => {
    closePrivateAddressDetailsModal(); // close modal
    openViewOnlyKeyModal(); //open modal
  };

  const handleGetPaymentLink = () => {
    closePrivateAddressDetailsModal(); // close modal
    openGetPaymentLinkModal(); //open modal
  };

  return (
    <>
      <ModalFrame onExitClick={closePrivateAddressDetailsModal} isExtraWide={true}>

        <ModalTitle title="Private Address Details" />

        <LocalStorageWarning />

        <ModalInfoCard
          title="Your Address"
          body={yourPrivateAddress}
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
          onClick={handleCopyClick}
        />

        <ModalInfoCard
          title="Get Payment Link"
          body="Makes it easier for people to pay you"
          icon={StyledChevronIcon}
          onClick={handleGetPaymentLink}
        />

        <ModalInfoCard
          title="View Your Seed Phrase"
          body={
            isReconnectionTypePasswordOrUknown ? 
              "Be sure to save your seed phrase in a secure offline location, otherwise you could lose your Private Address." : 
              "Saving this backup is unnecessary in most cases."
          }
          icon={StyledChevronIcon}
          onClick={handleViewYourSeedPhrase}
        />

        <ModalInfoCard
          title="View-Only Sharing Key"
          body="This viewing key is used to share the entire history of your private address. Once shared, the viewing key can't be revoked."
          icon={StyledChevronIcon}
          onClick={handleViewViewOnlyKey}
        />
                    
      </ModalFrame>
    </>
  );
};