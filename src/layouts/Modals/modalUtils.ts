import { useModalStore } from "~~/src/state-managers";

// General Settings
export const openGeneralSettingsModal = (): void => {
  useModalStore.setState({ isGeneralSettingsModalOpen: true });
};
export const closeGeneralSettingsModal = (): void => {
  useModalStore.setState({ isGeneralSettingsModalOpen: false });
};

// Error Log
export const openErrorLogModal = (): void => {
  useModalStore.setState({ isViewErrorLogModalOpen: true });
};
export const closeErrorLogModal = (): void => {
  useModalStore.setState({ isViewErrorLogModalOpen: false });
};

// Confirm Provider
export const openManageProvidersModal = (): void => {
  useModalStore.setState({ isManageProvidersModalOpen: true });
};
export const closeManageProvidersModal = (): void => {
  useModalStore.setState({ isManageProvidersModalOpen: false });
};

// Select Token
export const openSelectPublicTokenModal = (): void => {
  useModalStore.setState({ isSelectPublicTokenModalOpen: true });
};
export const closeSelectPublicTokenModal = (): void => {
  useModalStore.setState({ isSelectPublicTokenModalOpen: false });
};

// Select Token
export const openSelectPrivateTokenModal = (purpose: "tokenToSend" | "tokenToPayTheFeeWith"): void => {
  useModalStore.setState({ isSelectPrivateTokenModalOpen: { purpose } });
};

export const closeSelectPrivateTokenModal = (): void => {
  useModalStore.setState({ isSelectPrivateTokenModalOpen: false });
};

// View Private Address Mnemonic
export const openViewPrivateAddressMnemonicModal = (): void => {
  useModalStore.setState({ isViewPrivateAddressMnemonicModalOpen: true });
};
export const closeViewPrivateAddressMnemonicModal = (): void => {
  useModalStore.setState({ isViewPrivateAddressMnemonicModalOpen: false });
};

// View Private Address View-Only key
export const openViewOnlyKeyModal = (): void => {
  useModalStore.setState({ isViewOnlyKeyModalOpen: true });
};
export const closeViewOnlyKeyModal = (): void => {
  useModalStore.setState({ isViewOnlyKeyModalOpen: false });
};

// Get Payment Link
export const openGetPaymentLinkModal = (): void => {
  useModalStore.setState({ isGetPaymentLinkModalOpen: true });
};
export const closeGetPaymentLinkModal = (): void => {
  useModalStore.setState({ isGetPaymentLinkModalOpen: false });
};

// Private Address History
export const openPrivateAddressHistoryModal = (): void => {
  useModalStore.setState({ isPrivateAddressHistoryModalOpen: true });
};
export const closePrivateAddressHistoryModal = (): void => {
  useModalStore.setState({ isPrivateAddressHistoryModalOpen: false });
};

// Public Mode Connection Gate
export const openPublicModeConnectionGateModal = (): void => {
  useModalStore.setState({ isPublicModeConnectionGateModalOpen: true });
};
export const closePublicModeConnectionGateModal = (): void => {
  useModalStore.setState({ isPublicModeConnectionGateModalOpen: false });
};

// Private Mode Connection Gate
export const openPrivateModeConnectionGate = (): void => {
  useModalStore.setState({ isPrivateModeConnectionGateModalOpen: true });
};
export const closePrivateModeConnectionGate = (): void => {
  useModalStore.setState({ isPrivateModeConnectionGateModalOpen: false });
};

// Loading Modal
export const openLoadingModal = (): void => {
  useModalStore.setState({ isLoadingModalOpen: true });
};
export const closeLoadingModal = (): void => {
  useModalStore.setState({ isLoadingModalOpen: false });
};

// Private Address Details
export const openPrivateAddressDetailsModal = (): void => {
  useModalStore.setState({ isPrivateAddressDetailsModalOpen: true });
};
export const closePrivateAddressDetailsModal = (): void => {
  useModalStore.setState({ isPrivateAddressDetailsModalOpen: false });
};

// View Private Address Tokens
export const openViewPrivateAddressTokensModal = (): void => {
  useModalStore.setState({ isViewPrivateAddressTokensModalOpen: true });
};
export const closeViewPrivateAddressTokensModal = (): void => {
  useModalStore.setState({ isViewPrivateAddressTokensModalOpen: false });
};

// Request Encryption Key
export const openRequestEncryptionKeyModal = (): void => {
  useModalStore.setState({ isRequestEncryptionKeyModalOpen: true });
};
export const closeRequestEncryptionKeyModal = (): void => {
  useModalStore.setState({ isRequestEncryptionKeyModalOpen: false });
};

// Request Encryption Key
export const openSelectBroadcasterModal = (): void => {
  useModalStore.setState({ isSelectBroadcasterModalOpen: true });
};
export const closeSelectBroadcasterModal = (): void => {
  useModalStore.setState({ isSelectBroadcasterModalOpen: false });
};

// Recover Private Address
export const openRecoverPrivateAddressModal = (): void => {
  useModalStore.setState({ isRecoverPrivateAddressModalOpen: true });
};
export const closeRecoverPrivateAddressModal = (): void => {
  useModalStore.setState({ isRecoverPrivateAddressModalOpen: false });
};

// Create With Password
export const openCreateWithPasswordModal = (): void => {
  useModalStore.setState({ isCreateWithPasswordModalOpen: true });
};
export const closeCreateWithPasswordModal = (): void => {
  useModalStore.setState({ isCreateWithPasswordModalOpen: false });
};

// Connect Private Address
export const openConnectPrivateAddressModal = (): void => {
  useModalStore.setState({ isConnectPrivateAddressModalOpen: true });
};

export const closeConnectPrivateAddressModal = (): void => {
  useModalStore.setState({ isConnectPrivateAddressModalOpen: false });
};

// Tooltip
export const openToolTipModal = (title: string, tip: string): void => {
  useModalStore.setState({ isToolTipModalOpen: true, toolTipText: {title, tip} });
};

export const closeToolTipModal = (): void => {
  useModalStore.setState({ isToolTipModalOpen: false, toolTipText: null });
};

// Privacy Policy
export const openPrivacyPolicyModal = (): void => {
  useModalStore.setState({ isPrivacyPolicyModalOpen: true});
};

export const closePrivacyPolicyModal = (): void => {
  useModalStore.setState({ isPrivacyPolicyModalOpen: false });
};