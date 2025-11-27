import React from "react";
import { TokenSelectToggle } from "./subComponents/TokenSelectToggle";
import { ChainData } from "~~/src/config/chains/types";
import { useWalletModeScreenStore } from "~~/src/state-managers";

const getTokenQuantities = (
  targetAddress: string,
  defaultShieldingTokensList: { address: string; commonQuantitys: string[] }[]
): string[] => {
  const token = defaultShieldingTokensList.find(
    (t) => t.address.toLowerCase() === targetAddress.toLowerCase()
  );
  return token?.commonQuantitys ?? ["0.01", "0.5", "10", "50"];
};

interface AmountInputProps {
  network?: ChainData;
  isForPrivateMode: boolean;
  targetTokenAddress?: string;
  currentAmount?: string;
  setAmount: (value: string) => void;
  handleClick: () => void;
  symbol: string;
  displayBalance: boolean;
  isBalanceLoading: boolean;
  balance: string;
}

export const AmountInput: React.FC<AmountInputProps> = ({
  network,
  isForPrivateMode,
  targetTokenAddress,
  currentAmount,
  setAmount,
  handleClick,
  symbol,
  displayBalance,
  isBalanceLoading,
  balance,
}) => {

  const isDisplayingCommonPrivateModeAmounts = useWalletModeScreenStore((store) => store.isDisplayingCommonPrivateModeAmounts);

  const buttonClass =
    "cursor-pointer border-[0.12em] sm:border border-x-0 bg-black border-main-base flex justify-center items-center h-[3.075em] sm:h-[3em] font-isb text-main-400 text-sm flex-1";
  const inputClass =
    "text-main-base bg-black px-4 py-2 font-isb border-[0.12em] sm:border border-r-0 border-main-base rounded-l-xl w-full outline-none";

  const CommonPrivateModeTokenQuantities =
    targetTokenAddress && network
      ? getTokenQuantities(targetTokenAddress, network.defaultShieldingTokensList)
      : [];

  return (
    <>
      <p className="cursor-default text-left font-isb text-main-base">Amount:</p>
      <div className="mt-1 flex w-full gap-0">
        {isForPrivateMode && isDisplayingCommonPrivateModeAmounts ? (
          CommonPrivateModeTokenQuantities.map((amount, index) => (
            <button
              key={amount}
              className={`${buttonClass} ${index === 0 ? "rounded-l-xl" : ""} ${index === CommonPrivateModeTokenQuantities.length - 1 ? "" : ""} ${currentAmount === amount ? "text-main-base" : ""}`}
              onClick={() => setAmount(amount)}
            >
              {amount}
            </button>
          ))
        ) : (
          <input
            type="text"
            inputMode="decimal"
            min="0"
            className={inputClass}
            placeholder="0.0"
            spellCheck={false}
            onChange={(e) => setAmount(e.target.value)}
          />
        )}

        <TokenSelectToggle
          handleClick={handleClick}
          symbol={symbol}
          displayBalance={displayBalance}
          isBalanceLoading={isBalanceLoading}
          balance={balance}
        />
      </div>
    </>
  );
};
