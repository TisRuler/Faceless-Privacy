import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { formatDisplayNumber } from "~~/src/shared/utils/tokens/formatDisplayBalance";
import React from "react";

interface TokenSelectToggleProps {
  handleClick: () => void;
  symbol: string;
  displayBalance: boolean;
  isBalanceLoading: boolean;
  balance: string;
}

export const TokenSelectToggle: React.FC<TokenSelectToggleProps> = ({
  handleClick,
  symbol,
  displayBalance,
  isBalanceLoading,
  balance,
}) => {

  const formattedBalance = React.useMemo(() => {
    if (isBalanceLoading) return "Updating...";

    return formatDisplayNumber(balance, true);
  }, [balance, isBalanceLoading]);

  // Ui
  return (
    <div className="relative flex flex-col items-end">
      {displayBalance && (
        <span className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-im text-xs text-main-300">
          Balance: {formattedBalance}
        </span>
      )}

      <button
        onClick={handleClick}
        className="cursor-pointer rounded-r-xl border-[0.12em] border-main-base bg-primary-button-gradient px-4 py-2 sm:border"
        aria-label={`Select token ${symbol}`}
      >
        <div className="flex items-center">
          <p className="mr-2 font-isb text-base text-main-base">{symbol}</p>
          <ChevronDownIcon className="h-6 w-4 text-main-base" strokeWidth={4} />
        </div>
      </button>
    </div>
  );
};
