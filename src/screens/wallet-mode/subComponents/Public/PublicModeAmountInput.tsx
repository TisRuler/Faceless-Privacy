import React, { useEffect } from "react";
import { AmountInput } from "../Shared/AmountInput/AmountInput";
import { openSelectPublicTokenModal } from "~~/src/layouts/Modals/modalUtils";
import { useShouldBootstrapNetworkStack } from "~~/src/shared/hooks/useShouldBootstrapNetworkStack";
import { usePublicWalletStore, useConnectorRolesStore } from "~~/src/state-managers";
import { isAddressEqual, isAddress } from "viem";
import { refreshPublicAddressBalances } from "~~/src/shared/utils/tokens";
import { useIsTargetConnectorAuthorized } from "~~/src/shared/hooks/useIsTargetConnectorAuthorized";
import { ChainData } from "~~/src/config/chains/types";
import { SendableToken } from "~~/src/shared/types";
import { Address } from "viem";

interface PublicModeAmountInputProps {
  activeNetwork: ChainData;
  yourPublicAddress?: string;
  isPublicWalletConnected: boolean;
  targetTokenToSend: SendableToken;
  setAmount: (value: string) => void;
}

export const PublicModeAmountInput: React.FC<PublicModeAmountInputProps> = ({
  activeNetwork,
  isPublicWalletConnected,
  yourPublicAddress,
  targetTokenToSend,
  setAmount,
}) => {

  // Hooks
  const publicConnectorId = useConnectorRolesStore((store) => store.publicConnectorId);
  const tokensInPublicWallet = usePublicWalletStore((store) => store.tokensInPublicWallet);
  const isPublicConnectorAuthorised = useIsTargetConnectorAuthorized(publicConnectorId);
  const shouldBootstrapNetworkStack = useShouldBootstrapNetworkStack();

  // Main constant
  const userTokenToShield = tokensInPublicWallet.find((token) => {
    if (token.isBaseToken && targetTokenToSend?.isBaseToken) return true;
    if (token.isBaseToken !== targetTokenToSend?.isBaseToken) return false;
  
    const tokenAddress = token.address;
    const targetAddress = targetTokenToSend.address;

    if (!isAddress(tokenAddress) || !isAddress(targetAddress)) return false;

    return (
      isAddressEqual(tokenAddress as Address, targetAddress as Address)
    );
  });
  
  // Status flags
  const isLoadingPublicWalletTokens = usePublicWalletStore((state) => state.isLoadingPublicWalletTokens);
  const isBalanceNotCalculated = !userTokenToShield?.balance;
  const isWalletUsable = isPublicWalletConnected && publicConnectorId && !shouldBootstrapNetworkStack && isPublicConnectorAuthorised;

  // Triggers refresh
  useEffect(() => {
    if (isWalletUsable && isBalanceNotCalculated) {
      refreshPublicAddressBalances(activeNetwork);
    }
  }, [yourPublicAddress, userTokenToShield, isWalletUsable]);

  // Ui
  const balance = userTokenToShield?.balance ?? "not calculated";
  const displayBalance = isPublicWalletConnected && !!publicConnectorId && !shouldBootstrapNetworkStack;
  
  return (
    <AmountInput
      isForPrivateMode={false}
      setAmount={setAmount}
      handleClick={openSelectPublicTokenModal}
      symbol={targetTokenToSend.symbol}
      balance={balance}
      isBalanceLoading={isLoadingPublicWalletTokens}
      displayBalance={displayBalance}
    />
  );
};
