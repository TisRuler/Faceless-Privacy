import React from "react";
import { connectPrivateAddressWithPassword, connectPrivateAddressWithSignature } from "../utils/privateAddress";
import { PRIVATE_ADDRESS_NOTIFICATIONS } from "~~/src/constants/notifications";
import { PrivateAddressAuthForm } from "./PrivateAddressAuthForm";
import toast from "react-hot-toast";

interface ReconnectPrivateAddressPanelProps {
  onConnection?: () => void;
  closeParent?: () => void;
  isSignatureConnectionOnly?: boolean;
}

export const ConnectPrivateAddressPanel: React.FC<ReconnectPrivateAddressPanelProps> = ({
  onConnection,
  closeParent,
  isSignatureConnectionOnly,
}) => {

  const handleSuccess = () => {
    toast.success(PRIVATE_ADDRESS_NOTIFICATIONS.CONNECTED);
    onConnection?.();
  };
  
  const signatureReconnection = async (signature: string) => {
    await connectPrivateAddressWithSignature(signature);
    handleSuccess();
  };

  const handlePasswordConnection = async (password: string) => {
    await connectPrivateAddressWithPassword(password);
    handleSuccess();
  };

  return (
    <PrivateAddressAuthForm
      isSignatureConnectionOnly={isSignatureConnectionOnly}
      signatureAction={signatureReconnection}
      passwordAction={handlePasswordConnection}
      closeParent={closeParent}
      doHandleToastErrors={true}
    />
  );
};