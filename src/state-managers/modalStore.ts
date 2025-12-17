import { create } from "zustand";

// These are controlled (opened/closed) in modalUtils

interface ModalStore {
    isGeneralSettingsModalOpen: boolean,

    isViewErrorLogModalOpen: boolean,

    isManageProvidersModalOpen: boolean,

    isSelectPublicTokenModalOpen: boolean,

    isSelectPrivateTokenModalOpen: | false | { purpose: "tokenToSend" | "tokenToPayTheFeeWith"};

    isViewPrivateAddressMnemonicModalOpen: boolean,

    isViewOnlyKeyModalOpen: boolean,

    isPrivateAddressHistoryModalOpen: boolean,

    isPublicModeConnectionGateModalOpen: boolean,

    isPrivateModeConnectionGateModalOpen: boolean,

    isLoadingModalOpen: boolean,

    isPrivateAddressDetailsModalOpen: boolean,

    isViewPrivateAddressTokensModalOpen: boolean,

    isRequestEncryptionKeyModalOpen: boolean,

    isSelectBroadcasterModalOpen: boolean,

    isRecoverPrivateAddressModalOpen: boolean,

    isCreateWithPasswordModalOpen: boolean,

    isConnectPrivateAddressModalOpen: boolean,

    isToolTipModalOpen: boolean,
    toolTipText: {
      title: string;
      tip: string;
    } | null,

}

export const useModalStore = create<ModalStore>((set) => ({
  
  isGeneralSettingsModalOpen: false,

  isViewErrorLogModalOpen: false,

  isManageProvidersModalOpen: false,
    
  isSelectPublicTokenModalOpen: false,

  isSelectPrivateTokenModalOpen: false,

  isViewPrivateAddressMnemonicModalOpen: false,

  isViewOnlyKeyModalOpen: false,

  isPrivateAddressHistoryModalOpen: false,

  isPublicModeConnectionGateModalOpen: false,

  isPrivateModeConnectionGateModalOpen: false,

  isLoadingModalOpen: false,

  isPrivateAddressDetailsModalOpen: false,

  isViewPrivateAddressTokensModalOpen: false,

  isRequestEncryptionKeyModalOpen: false,

  isSelectBroadcasterModalOpen: false,

  isRecoverPrivateAddressModalOpen: false,

  isCreateWithPasswordModalOpen: false,

  isConnectPrivateAddressModalOpen: false,

  isToolTipModalOpen: false,
  toolTipText: null,
  
}));