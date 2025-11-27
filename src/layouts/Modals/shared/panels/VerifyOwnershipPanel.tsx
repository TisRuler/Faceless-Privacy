import React from "react";
import { getEncryptionKeyFromPassword } from "../utils/hashService";
import { PrivateAddressAuthForm } from "./PrivateAddressAuthForm";

interface VerifyOwnershipPanelProps {
  deriveSecretWithVerificationFn?: (input?: string) => Promise<string>;
  onVerified: (result?: any) => void;
  closeParent: () => void;
}

export const VerifyOwnershipPanel: React.FC<VerifyOwnershipPanelProps> = ({
  deriveSecretWithVerificationFn,
  onVerified,
  closeParent,
}) => {

  // Main functions
  const verifyWithSignature = async (signature: string) => {
    await runVerification(signature);
  };

  const verifyWithPassword = async (password: string) => {
    await runVerification(password);
  };

  // Helper functions
  const runVerification = async (secret: string) => {
    let retrievedData: string | undefined | null;
    
    await getEncryptionKeyFromPassword(secret);

    retrievedData = await deriveSecretWithVerificationFn?.(secret);
    await onVerified(retrievedData);

    retrievedData = null;
  };

  return (
    <PrivateAddressAuthForm 
      signatureAction={verifyWithSignature}
      passwordAction={verifyWithPassword}
      doHandleToastErrors={true}
      closeParent={closeParent}
    />
  );
};