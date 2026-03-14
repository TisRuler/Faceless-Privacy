import { signWithWalletViewingKey } from "@railgun-community/wallet";
import { hexlify, toUtf8Bytes } from "ethers";
import { usePrivateAddressStore } from "~~/src/state-managers";

const DFX_API_BASE = "https://dev.api.dfx.swiss/v1";
const DFX_APP_BASE = "https://dev.app.dfx.swiss";
const WALLET_NAME = "Faceless";

export const handleBuyWithFiat = async () => {
  const { yourPrivateAddress, railgunWalletId } =
    usePrivateAddressStore.getState();

  if (!yourPrivateAddress || !railgunWalletId) {
    throw new Error("Connect your private address first");
  }

  // Open popup synchronously to avoid browser popup-blocker after await
  const popup = window.open("about:blank", "_blank");

  try {
    const res = await fetch(
      `${DFX_API_BASE}/auth/signMessage?address=${encodeURIComponent(yourPrivateAddress)}`,
    );
    if (!res.ok) throw new Error("Failed to fetch sign message from DFX");
    const { message } = await res.json();

    const messageHex = hexlify(toUtf8Bytes(message));
    const signatureWithPrefix = await signWithWalletViewingKey(
      railgunWalletId,
      messageHex,
    );
    const signature = signatureWithPrefix.replace(/^0x/, "");

    const url = `${DFX_APP_BASE}/buy/?address=${encodeURIComponent(yourPrivateAddress)}&signature=${signature}&wallet=${WALLET_NAME}`;

    if (popup) {
      popup.location.href = url;
    } else {
      window.open(url, "_blank");
    }
  } catch (error) {
    if (popup) popup.close();
    throw error;
  }
};
