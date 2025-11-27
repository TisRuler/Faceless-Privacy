import React from "react";
import { ModalFrame, ModalTitle } from "./shared/components";
import { closeConnectPrivateAddressModal } from "./modalUtils";
import { ConnectPrivateAddressPanel } from "./shared/panels";

export const ConnectPrivateAddressModal = () => {

  return (
    <ModalFrame onExitClick={closeConnectPrivateAddressModal} shouldHandleProvider={true}>

      <ModalTitle title="Connect Your Private Address" />

      <ConnectPrivateAddressPanel 
        onConnection={closeConnectPrivateAddressModal} 
        closeParent={closeConnectPrivateAddressModal} 
      />

    </ModalFrame> 
  );
};