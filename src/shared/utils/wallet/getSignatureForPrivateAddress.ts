import { getPublicWalletSigner } from "./";
import { masterConfig } from "~~/src/config/masterConfig";

export const getSignatureForPrivateAddress = async (): Promise<string> => {
  const signer = await getPublicWalletSigner();
  return await signer.signMessage(masterConfig.facelessAccessMessage);
};