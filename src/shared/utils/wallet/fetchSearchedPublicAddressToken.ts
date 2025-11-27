import { getPublicWalletSigner } from "./";
import { getActiveNetwork } from "~~/src/shared/utils/network";
import { usePublicWalletStore } from "~~/src/state-managers";
import { GENERAL_NOTIFICATIONS } from "~~/src/constants/notifications";
import { fetchPublicAddressTokenData } from "~~/src/shared/utils/wallet";
import { getNotificationFromError } from "~~/src/shared/utils/other";
import { isAddress } from "ethers";
import { logError } from "~~/src/shared/utils/other/logError";
import toast from "react-hot-toast";

export const fetchSearchedPublicAddressToken = async (tokenAddress: string) => {
  const setIsLoadingPublicWalletTokens = usePublicWalletStore.getState().setIsLoadingPublicWalletTokens;
  const addTokenToPublicWallet = usePublicWalletStore.getState().addTokenToPublicWallet;
  
  if (!isAddress(tokenAddress)) {
    toast.error(GENERAL_NOTIFICATIONS.CHECK_ADDRESS);
    return;
  }

  setIsLoadingPublicWalletTokens(true);

  try {
    const network = getActiveNetwork();
    const { address: activeWalletAddress } = await getPublicWalletSigner();
    const token = await fetchPublicAddressTokenData(network, tokenAddress, activeWalletAddress);

    addTokenToPublicWallet(token);

    return token;
  } catch (error) {
    toast.error(getNotificationFromError(error));
    logError(error);
    return;
  } finally {
    setIsLoadingPublicWalletTokens(false);
  }
};