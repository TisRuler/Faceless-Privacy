import { keccak256 } from "ethers";
import { getShieldPrivateKeySignatureMessage } from "@railgun-community/wallet";
import { getPublicWalletSigner } from "~~/src/shared/utils/wallet";

export const getPublicWalletData = async () => {
  const publicWalletSigner = await getPublicWalletSigner();
  const publicAddress = await publicWalletSigner.getAddress();
  const shieldSignatureMessage = getShieldPrivateKeySignatureMessage();
  const shieldPrivateKey = keccak256(await publicWalletSigner.signMessage(shieldSignatureMessage)); // Shield signature

  return {
    publicWalletSigner,
    publicAddress,
    shieldPrivateKey,
  }; 
};