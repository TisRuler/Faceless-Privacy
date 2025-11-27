import React from "react";
import { CardView } from "~~/src/shared/enums";
import { UserToken } from "~~/src/shared/types";

interface ModalToggleTokensViewProps {
  walletModeCardView: CardView;
  pendingPrivateTokens: UserToken[];
  spendablePrivateTokens: UserToken[]
  nonSpendablePrivateTokens: UserToken[];
  showOnlyNonSpendable: boolean;
  setShowOnlyNonSpendable: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ModalToggleTokensView: React.FC<ModalToggleTokensViewProps> = ({ walletModeCardView, pendingPrivateTokens, spendablePrivateTokens, nonSpendablePrivateTokens, showOnlyNonSpendable, setShowOnlyNonSpendable }) => {

  // Only show for private address
  if (walletModeCardView === CardView.Public) {
    return null;
  }
  
  const hasNoTokens =
        pendingPrivateTokens.length === 0 &&
        nonSpendablePrivateTokens.length === 0 &&
        spendablePrivateTokens.length === 0;

  const hasOnlySpendableAndPendingTokens= 
        spendablePrivateTokens.length > 0 &&
        pendingPrivateTokens.length > 0 &&
        nonSpendablePrivateTokens.length === 0;

  const hasOnlySpendableTokens =
        spendablePrivateTokens.length > 0 &&
        pendingPrivateTokens.length === 0 &&
        nonSpendablePrivateTokens.length === 0;

  const hasOnlyTokensNotSpendable =
        (pendingPrivateTokens.length > 0 || nonSpendablePrivateTokens.length > 0) &&
        spendablePrivateTokens.length === 0;

  if (hasOnlySpendableTokens || hasOnlyTokensNotSpendable || hasNoTokens || hasOnlySpendableAndPendingTokens) {
    return null;
  };

  const handleToggle = () => {
    setShowOnlyNonSpendable((prev) => !prev);
  };

  return (
    <div
      className="mb-[-0.9em] mt-3 cursor-pointer text-right font-isb text-sm"
      onClick={handleToggle}
    >
      <p>
        {showOnlyNonSpendable ? "View main Tokens" : "View other Tokens"}
      </p>
    </div>
  );
};
