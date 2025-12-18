import React, { useState, useEffect } from "react";
import { GeneralSettingsModal } from "./GeneralSettingsModal/GeneralSettingsModal";
import { ViewErrorLogModal } from "./ViewErrorLogModal";
import { ManageProvidersModal } from "./ManageProvidersModal/ManageProvidersModal";
import { LoadingModal } from "./LoadingModal";
import { PrivateAddressHistoryModal } from "./PrivateAddressHistoryModal/PrivateAddressHistoryModal";
import { ViewPrivateAddressTokensModal } from "./ViewPrivateAddressTokensModal";
import { PublicModeConnectionGateModal } from "./PublicModeConnectionGateModal";
import { PrivateModeConnectionGateModal } from "./PrivateModeConnectionGateModal";
import { ViewPrivateAddressMnemonicModal } from "./ViewPrivateAddressMnemonicModal/ViewPrivateAddressMnemonicModal";
import { ViewOnlyKeyModal } from "./ViewOnlyKeyModal";
import { PrivateAddressDetailsModal } from "./PrivateAddressDetailsModal";
import { CreatePrivateAddressWithPasswordModal } from "./CreatePrivateAddressWithPasswordModal/CreatePrivateAddressWithPasswordModal";
import { RequestEncryptionKeyModal } from "./RequestEncryptionKeyModal";
import { SelectBroadcasterModal } from "./SelectBroadcasterModal";
import { RecoverPrivateAddressModal } from "./RecoverPrivateAddressModal/RecoverPrivateAddressModal";
import { SelectPublicTokenModal } from "./SelectPublicTokenModal/SelectPublicTokenModal";
import { SelectPrivateTokenModal } from "./SelectPrivateTokenModal";
import { ConnectPrivateAddressModal } from "./ConnectPrivateAddressModal";
import { TooltipModal } from "./TooltipModal";
import { PrivacyPolicyModal } from "./PrivacyPolicyModal";
import { usePrivateAddressStore, useModalStore } from "~~/src/state-managers";

export const ModalsIndex = () => {

  // Modal states
  const isGeneralSettingsModalOpen = useModalStore((state) => state.isGeneralSettingsModalOpen);
  const isViewErrorLogModalOpen = useModalStore((state) => state.isViewErrorLogModalOpen);
  const isManageProvidersModalOpen = useModalStore((state) => state.isManageProvidersModalOpen);
  const isSelectPublicTokenModalOpen = useModalStore((state) => state.isSelectPublicTokenModalOpen);
  const isSelectPrivateTokenModalOpen = useModalStore((state) => state.isSelectPrivateTokenModalOpen);
  const isViewPrivateAddressMnemonicModalOpen = useModalStore((state) => state.isViewPrivateAddressMnemonicModalOpen);
  const isViewOnlyKeyModalOpen = useModalStore((state) => state.isViewOnlyKeyModalOpen);
  const isPrivateAddressHistoryModalOpen = useModalStore((state) => state.isPrivateAddressHistoryModalOpen);
  const isPrivateAddressDetailsModalOpen = useModalStore((state) => state.isPrivateAddressDetailsModalOpen);
  const isCreateWithPasswordModalOpen = useModalStore((state) => state.isCreateWithPasswordModalOpen);
  const isLoadingModalOpen = useModalStore((state) => state.isLoadingModalOpen);
  const isViewPrivateAddressTokensModalOpen = useModalStore((state) => state.isViewPrivateAddressTokensModalOpen);
  const isPublicModeConnectionGateModalOpen = useModalStore((state) => state.isPublicModeConnectionGateModalOpen);
  const isPrivateModeConnectionGateModalOpen = useModalStore((state) => state.isPrivateModeConnectionGateModalOpen);
  const isRecoverPrivateAddressModalOpen = useModalStore((state) => state.isRecoverPrivateAddressModalOpen);
  const isRequestEncryptionKeyModalOpen = useModalStore((state) => state.isRequestEncryptionKeyModalOpen);
  const isSelectBroadcasterModalOpen = useModalStore((state) => state.isSelectBroadcasterModalOpen);
  const isConnectPrivateAddressModalOpen = useModalStore((state) => state.isConnectPrivateAddressModalOpen);
  const isPrivacyPolicyModalOpen = useModalStore((state) => state.isPrivacyPolicyModalOpen);
  const isToolTipModalOpen = useModalStore((state) => state.isToolTipModalOpen);

  // Get Private Address details
  const spendablePrivateTokens = usePrivateAddressStore((state) => state.spendablePrivateTokens);
  const pendingPrivateTokens = usePrivateAddressStore((state) => state.pendingPrivateTokens);
  const nonSpendablePrivateTokens = usePrivateAddressStore((state) => state.nonSpendablePrivateTokens);
  const privateAddressBalanceScanPercentage = usePrivateAddressStore((state) => state.privateAddressBalanceScanPercentage);
  const txidMerkletreeScanPercentage = usePrivateAddressStore((state) => state.txidMerkletreeScanPercentage);

  // Token Viewing/Selecting
  const [showOnlyNonSpendable, setShowOnlyNonSpendable] = useState<boolean>(false);

  // Sets the default value for showOnlyNonSpendable
  useEffect(() => {
    const showNonSpendableByDefault =
      spendablePrivateTokens?.length === 0 &&
      pendingPrivateTokens?.length === 0 &&
      nonSpendablePrivateTokens?.length > 0;
  
    setShowOnlyNonSpendable(showNonSpendableByDefault);
  }, [
    spendablePrivateTokens,
    pendingPrivateTokens,
    nonSpendablePrivateTokens,
  ]);

  return (
    <>
      {isPrivateAddressDetailsModalOpen && <PrivateAddressDetailsModal />}

      {isViewErrorLogModalOpen && <ViewErrorLogModal />}

      {isCreateWithPasswordModalOpen && <CreatePrivateAddressWithPasswordModal />}

      {isRecoverPrivateAddressModalOpen && <RecoverPrivateAddressModal />}

      {isManageProvidersModalOpen && <ManageProvidersModal />}

      {isConnectPrivateAddressModalOpen && <ConnectPrivateAddressModal />}

      {isRequestEncryptionKeyModalOpen &&  <RequestEncryptionKeyModal />}
      
      {isSelectBroadcasterModalOpen &&  <SelectBroadcasterModal />}

      {isPublicModeConnectionGateModalOpen && <PublicModeConnectionGateModal />}

      {isPrivateModeConnectionGateModalOpen && <PrivateModeConnectionGateModal />}

      {isGeneralSettingsModalOpen && <GeneralSettingsModal />}

      {isPrivateAddressHistoryModalOpen && <PrivateAddressHistoryModal />}

      {isViewPrivateAddressTokensModalOpen && <ViewPrivateAddressTokensModal
        showOnlyNonSpendable={showOnlyNonSpendable}
        setShowOnlyNonSpendable={setShowOnlyNonSpendable} 
        pendingPrivateTokens={pendingPrivateTokens} 
        spendablePrivateTokens={spendablePrivateTokens} 
        nonSpendablePrivateTokens={nonSpendablePrivateTokens}
        privateAddressBalanceScanPercentage={privateAddressBalanceScanPercentage}
        txidMerkletreeScanPercentage={txidMerkletreeScanPercentage}
      />}

      {isSelectPublicTokenModalOpen && 
        <SelectPublicTokenModal/>
      }

      {isSelectPrivateTokenModalOpen && <SelectPrivateTokenModal
        showOnlyNonSpendable={showOnlyNonSpendable}
        setShowOnlyNonSpendable={setShowOnlyNonSpendable} 
        pendingPrivateTokens={pendingPrivateTokens} 
        spendablePrivateTokens={spendablePrivateTokens} 
        nonSpendablePrivateTokens={nonSpendablePrivateTokens}
        privateAddressBalanceScanPercentage={privateAddressBalanceScanPercentage}
        txidMerkletreeScanPercentage={txidMerkletreeScanPercentage}
      />}

      {isViewPrivateAddressMnemonicModalOpen && <ViewPrivateAddressMnemonicModal/>}

      {isViewOnlyKeyModalOpen && <ViewOnlyKeyModal/>}
      
      {isLoadingModalOpen && <LoadingModal />}

      {isToolTipModalOpen && <TooltipModal />}

      {isPrivacyPolicyModalOpen && <PrivacyPolicyModal />}
    </>
  );
};
