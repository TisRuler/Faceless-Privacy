import React, { useState } from "react";
import { 
  ModalTokenCard, 
  ModalFrame, 
  ModalToggleTokensView,
  ModalPrivateTokenSearchBar,
  ModalPrivateScanProgress,
  ModalCentreMessage,
  ModalTitle
} from "./shared/components";
import { UserToken } from "~~/src/shared/types";
import { CardView } from "~~/src/shared/enums";
import { GENERAL_NOTIFICATIONS } from "~~/src/constants/notifications";
import { closeViewPrivateAddressTokensModal } from "./modalUtils";
import { RailgunWalletBalanceBucket } from "@railgun-community/shared-models";
import { getActiveNetwork } from "~~/src/shared/utils/network";
import { ModalInfoBox } from "./shared/components";
import toast from "react-hot-toast";

const NON_SPENDABLE_BUCKETS = "nonSpendable";

interface ViewPrivateAddressTokensModalProps {
  showOnlyNonSpendable: boolean,
  setShowOnlyNonSpendable: React.Dispatch<React.SetStateAction<boolean>>;
  pendingPrivateTokens: UserToken[];
  spendablePrivateTokens: UserToken[];
  nonSpendablePrivateTokens: UserToken[];
  privateAddressBalanceScanPercentage: string;
  txidMerkletreeScanPercentage: string;
};

export const ViewPrivateAddressTokensModal: React.FC<ViewPrivateAddressTokensModalProps> = ({
  showOnlyNonSpendable,
  setShowOnlyNonSpendable,
  pendingPrivateTokens,
  spendablePrivateTokens,
  nonSpendablePrivateTokens,
  privateAddressBalanceScanPercentage,
  txidMerkletreeScanPercentage,
}) => {

  const activeNetwork = getActiveNetwork();

  const [searchResult, setSearchResult] = useState<UserToken | undefined>(undefined);

  const hasTokens =
    pendingPrivateTokens.length > 0 ||
    spendablePrivateTokens.length > 0 ||
    nonSpendablePrivateTokens.length > 0;

  const handleCardClick = async (token: UserToken) => {
    await navigator.clipboard.writeText(token.address.toString()); // Copy token address to clipboard
    toast.success(GENERAL_NOTIFICATIONS.COPIED_TO_CLIPBOARD);
  };

  const renderTokensByType = (tokens: UserToken[], type: RailgunWalletBalanceBucket.Spendable | RailgunWalletBalanceBucket.ShieldPending | typeof NON_SPENDABLE_BUCKETS) =>
    tokens.map((token) => (
      <ModalTokenCard
        key={token.address}
        onClick={() => handleCardClick(token)}
        token={token}
        type={type}
        showOnlyNonSpendable={showOnlyNonSpendable}
        isTokenSelectable={true}
      />
    )
    );

  const isBalancesRefreshing = Number.parseFloat(privateAddressBalanceScanPercentage) > 0;
  const isMerkleTreeRefreshing = Number.parseFloat(txidMerkletreeScanPercentage) > 0;
  const isScanningBalances = isBalancesRefreshing || isMerkleTreeRefreshing;

  const unwrappingMessage = `Any ${activeNetwork.privateModeBaseToken.symbol} sent to a public address through Faceless is automatically converted to ${activeNetwork.publicModeBaseToken.symbol}.`;
  const ifTokensAreUnavailable = "If your tokens aren't available within the next 15 minutes: Settings > Other > Generate All POIs.";

  const modalInfoBoxText = showOnlyNonSpendable ? ifTokensAreUnavailable : unwrappingMessage;

  const backupMessage = isScanningBalances && !hasTokens ? "Scanning balances..." : "You have no tokens";

  return (
    <ModalFrame onExitClick={closeViewPrivateAddressTokensModal}>

      <ModalTitle title="Your Private Tokens" />

      <ModalPrivateTokenSearchBar
        tokens={spendablePrivateTokens}
        onSearchResult={setSearchResult}
      />

      <ModalPrivateScanProgress 
        privateAddressBalanceScanPercentage={privateAddressBalanceScanPercentage}
        txidMerkletreeScanPercentage={txidMerkletreeScanPercentage}
      />

      {hasTokens && 
        <ModalInfoBox>
          {modalInfoBoxText}
        </ModalInfoBox>
      }

      <hr className="border-3 border border-modal-accent-100" />

      {/* Token cards */}
      <div className="max-h-[24.25em] overflow-y-scroll rounded-bl-md rounded-br-md">
        {searchResult ? (
          <ModalTokenCard 
            token={searchResult} 
            type={RailgunWalletBalanceBucket.Spendable} 
            isTokenSelectable={true} 
          />
        ) : (
          <>
            {renderTokensByType(pendingPrivateTokens, RailgunWalletBalanceBucket.ShieldPending)}
            {renderTokensByType(spendablePrivateTokens, RailgunWalletBalanceBucket.Spendable)}
            {renderTokensByType(nonSpendablePrivateTokens, NON_SPENDABLE_BUCKETS)}
            <ModalCentreMessage isVisible={!hasTokens} message={backupMessage}/>
          </>
        )}
      </div>

      <hr className="border-3 mb-1 border border-modal-accent-100" />

      <ModalToggleTokensView
        walletModeCardView={CardView.Private}
        pendingPrivateTokens={pendingPrivateTokens}
        spendablePrivateTokens={spendablePrivateTokens}
        nonSpendablePrivateTokens={nonSpendablePrivateTokens}
        showOnlyNonSpendable={showOnlyNonSpendable} 
        setShowOnlyNonSpendable={setShowOnlyNonSpendable} 
      />
      
    </ModalFrame>
  );
};