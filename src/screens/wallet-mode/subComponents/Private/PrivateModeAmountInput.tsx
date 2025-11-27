import React from "react";
import { AmountInput } from "../Shared/AmountInput/AmountInput";
import { usePrivateAddressStore, useWalletModeScreenStore } from "~~/src/state-managers";
import { SendableToken } from "~~/src/shared/types";
import { useShouldBootstrapNetworkStack } from "~~/src/shared/hooks/useShouldBootstrapNetworkStack";
import { ChainData } from "~~/src/config/chains/types";
import { openSelectPrivateTokenModal } from "~~/src/layouts/Modals/modalUtils";
import { isAddressEqual, isAddress } from "viem";
import { refreshPrivateAddressBalances } from "~~/src/shared/utils/tokens";
import type { Address } from "viem";

// Main
interface PrivateModeAmountInputProps {
  activeNetwork: ChainData;
  privateAddress: string;
  targetTokenToSend: SendableToken;
  setAmount: (value: string) => void;
}

export const PrivateModeAmountInput: React.FC<PrivateModeAmountInputProps> = ({
  activeNetwork,
  privateAddress,
  targetTokenToSend,
  setAmount,
}) => {
  
  const shouldBootstrapNetworkStack = useShouldBootstrapNetworkStack();
  const spendablePrivateTokens = usePrivateAddressStore((store) => store.spendablePrivateTokens);
  const amount = useWalletModeScreenStore((store) => store.amount);

  const privateAddressBalanceScanPercentage = usePrivateAddressStore((store) => store.privateAddressBalanceScanPercentage);
  const txidMerkletreeScanPercentage = usePrivateAddressStore((store) => store.txidMerkletreeScanPercentage);

  const isPrivateAddressConnected = privateAddress !== "";

  const userTokenToWithdraw = spendablePrivateTokens.find((token) => {
    const tokenAddress = token.address;
    const targetAddress = targetTokenToSend.address;
  
    if (!isAddress(tokenAddress) || !isAddress(targetAddress)) return false;
  
    try {
      return isAddressEqual(tokenAddress as Address, targetAddress as Address);
    } catch {
      return false;
    }
  });
  
  const handleStandardClick = () => {
    openSelectPrivateTokenModal("tokenToSend");
    refreshPrivateAddressBalances(shouldBootstrapNetworkStack, activeNetwork);
  };

  const isBalancesRefreshing = Number.parseFloat(privateAddressBalanceScanPercentage) > 0;
  const isMerkleTreeRefreshing = Number.parseFloat(txidMerkletreeScanPercentage) > 0;
  const isScanningBalances = isBalancesRefreshing || isMerkleTreeRefreshing;

  const balance = userTokenToWithdraw?.balance ?? "not calculated";
  const displayBalance = isPrivateAddressConnected && !shouldBootstrapNetworkStack;

  return (
    <AmountInput
      network={activeNetwork}
      isForPrivateMode={true}
      targetTokenAddress={targetTokenToSend.address}
      currentAmount={amount}
      setAmount={setAmount}
      handleClick={handleStandardClick}
      symbol={targetTokenToSend.symbol}
      balance={balance}
      isBalanceLoading={isScanningBalances}
      displayBalance={displayBalance}
    />
  );
};