import React, { useState } from "react";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { handleBuyWithFiat } from "~~/src/shared/utils/dfx/handleBuyWithFiat";
import toast from "react-hot-toast";

interface BuyWithFiatButtonProps {
  yourPrivateAddress: string;
}

export const BuyWithFiatButton: React.FC<BuyWithFiatButtonProps> = ({
  yourPrivateAddress,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!yourPrivateAddress) return null;

  const onClick = async () => {
    setIsLoading(true);
    try {
      await handleBuyWithFiat();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to open DFX");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4 flex flex-col items-center">
      <button
        onClick={onClick}
        disabled={isLoading}
        className="flex items-center justify-center space-x-2 rounded-lg border-[0.12em] border-main-base px-5 py-2 font-isb text-sm text-main-base transition duration-500 hover:brightness-150 disabled:cursor-not-allowed disabled:opacity-50 sm:border"
      >
        <ArrowTopRightOnSquareIcon className="h-4 w-4" />
        <span>{isLoading ? "Loading..." : "Buy with Fiat"}</span>
      </button>
    </div>
  );
};
