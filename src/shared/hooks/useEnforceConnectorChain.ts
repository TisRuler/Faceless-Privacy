import { useState, useCallback } from "react";
import { useSwitchChain } from "wagmi";
import { useAccount } from "wagmi";
import { INJECTED_WALLET_NOTIFICATIONS } from "~~/src/constants/notifications";
import { throwErrorWithTitle } from "../utils/other/throwErrorWithTitle";

type Params = {
  activeNetwork: { id: number };
  onConnection?: () => void;
};

export const useEnforceConnectorChain = ({
  activeNetwork,
  onConnection,
}: Params) => {
  const [isSwitching, setIsSwitching] = useState(false);
  const { switchChainAsync } = useSwitchChain();
  const { chainId: walletsCurrentChainId } = useAccount();
  
  const isWalletConnectedToWrongChain = walletsCurrentChainId !== activeNetwork.id;

  const enforceCorrectChain = useCallback(async () => {
    if (isWalletConnectedToWrongChain) {
      setIsSwitching(true);
      try {
        await switchChainAsync?.({ chainId: activeNetwork.id });
      } catch (error) {
        throwErrorWithTitle(INJECTED_WALLET_NOTIFICATIONS.ERROR_SWITCHING_CHAIN, error);
      } finally {
        setIsSwitching(false);
      }
    }
    
    onConnection?.();

  }, [isWalletConnectedToWrongChain, switchChainAsync, activeNetwork.id, onConnection]);

  return { enforceCorrectChain, isSwitching };
};
