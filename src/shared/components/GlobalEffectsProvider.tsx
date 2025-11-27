import { useEffect } from "react";
import { isAddress } from "ethers";
import { 
  usePublicWalletStore, 
  useBroadcasterStore, 
  useSettingsStore, 
  useWalletModeScreenStore 
} from "~~/src/state-managers";
import { useAccount } from "wagmi";
import { startBroadcasterClient } from "../utils/broadcaster";
import { clearBalances } from "~~/src/layouts/Header/components/utils/clearBalances";
import { refreshPrivateAddressBalances } from "../utils/tokens";
import { useShouldBootstrapNetworkStack } from "../hooks/useShouldBootstrapNetworkStack";
import { ChainData } from "~~/src/config/chains/types";
import { WakuBroadcasterClient } from "@railgun-community/waku-broadcaster-client-web";
import { logError } from "../utils/other";

// Setters
const { setTokenForPublicMode, setTokenForPrivateMode } = useWalletModeScreenStore.getState();
const { setSendMethod, setBroadcasterFeeToken } = useBroadcasterStore.getState();

const handleSwitchBroadcasterChain = async (activeNetwork: ChainData) => {
  try {
    await WakuBroadcasterClient.setChain(activeNetwork.railgunChain);
  } catch (error) {
    logError(error);
    await WakuBroadcasterClient.stop();
    await startBroadcasterClient();
  }
};

// Main
interface GlobalEffectsProviderProps {
  children: React.ReactNode;
}

export const GlobalEffectsProvider = ({ children }: GlobalEffectsProviderProps) => {

  const activeNetwork = useSettingsStore((store) => store.activeNetwork);
  const sendMethod = useBroadcasterStore((store) => store.sendMethod);

  const { address: publicAddress} = useAccount();
  const shouldBootstrapNetworkStack = useShouldBootstrapNetworkStack();
  
  // On Launch - play once
  useEffect(() => {
    startBroadcasterClient();
  }, []);

  // Clear tokens in public wallet when a user changes their address
  useEffect(() => {
    if (!isAddress(publicAddress)) return;

    const setTokensInPublicWallet = usePublicWalletStore.getState().setTokensInPublicWallet;
    setTokensInPublicWallet([]);
    
  }, [publicAddress]);


  // Default the broadcaster if the user changes chains
  useEffect(() => {
    clearBalances();

    setTokenForPublicMode(activeNetwork.publicModeBaseToken);
    setTokenForPrivateMode(activeNetwork.privateModeBaseToken);

    refreshPrivateAddressBalances(shouldBootstrapNetworkStack, activeNetwork);
    handleSwitchBroadcasterChain(activeNetwork);

    setBroadcasterFeeToken(activeNetwork.privateModeBaseToken);
    if (sendMethod === "CUSTOM_BROADCASTER") { 
      setSendMethod({ method: "DEFAULT_BROADCASTER" }); 
    }

  }, [activeNetwork]);

  return <>{children}</>;
};
