import React, { useState } from "react";
import {
  useWalletModeScreenStore,
  useSettingsStore,
  usePrivateAddressStore, 
  useModalStore,
  useBroadcasterStore
} from "~~/src/state-managers";
import {
  ModalFrame,
  ModalToggleTokensView,
  ModalTokenCard,
  ModalPrivateTokenSearchBar,
  ModalPrivateScanProgress,
  ModalCentreMessage,
  ModalTitle
} from "./shared/components";
import { UserToken } from "~~/src/shared/types";
import { closeSelectPrivateTokenModal } from "./modalUtils";
import { ConnectPrivateAddressPanel } from "./shared/panels";
import { RailgunWalletBalanceBucket } from "@railgun-community/shared-models";
import { validateRailgunAddress } from "@railgun-community/wallet";
import { ModalInfoBox } from "./shared/components";
import { getActiveNetwork } from "~~/src/shared/utils/network";
import toast from "react-hot-toast";

const NON_SPENDABLE_BUCKETS = "nonSpendable";

type TokenType = RailgunWalletBalanceBucket.Spendable | RailgunWalletBalanceBucket.ShieldPending | typeof NON_SPENDABLE_BUCKETS;

const setTokenForPrivateMode = useWalletModeScreenStore.getState().setTokenForPrivateMode;
const setBroadcasterFeeToken = useBroadcasterStore.getState().setBroadcasterFeeToken;

interface SelectPrivateTokenModalProps {
  showOnlyNonSpendable: boolean;
  setShowOnlyNonSpendable: React.Dispatch<React.SetStateAction<boolean>>;
  pendingPrivateTokens: UserToken[];
  spendablePrivateTokens: UserToken[];
  nonSpendablePrivateTokens: UserToken[];
  privateAddressBalanceScanPercentage: string;
  txidMerkletreeScanPercentage: string;
};

export const SelectPrivateTokenModal: React.FC<SelectPrivateTokenModalProps> = ({
  showOnlyNonSpendable,
  setShowOnlyNonSpendable,
  pendingPrivateTokens,
  spendablePrivateTokens,
  nonSpendablePrivateTokens,
  privateAddressBalanceScanPercentage,
  txidMerkletreeScanPercentage
}) => {

  const activeNetwork = getActiveNetwork();

  const walletModeCardView = useSettingsStore((state) => state.walletModeCardView);

  const yourPrivateAddress = usePrivateAddressStore((state) => state.yourPrivateAddress);
  const isYourPrivateAddressConnected = validateRailgunAddress(yourPrivateAddress);

  const displayConnectPrivateAddressPanel = !isYourPrivateAddressConnected;
  
  const isThisTokenBeingSentToRecipient = useModalStore(state => 
    state.isSelectPrivateTokenModalOpen !== false &&
    state.isSelectPrivateTokenModalOpen.purpose === "tokenToSend"
  );

  const isBalancesRefreshing = Number.parseFloat(privateAddressBalanceScanPercentage) > 0;
  const isMerkleTreeRefreshing = Number.parseFloat(txidMerkletreeScanPercentage) > 0;
  const isScanningBalances = isBalancesRefreshing || isMerkleTreeRefreshing;
  const areAnyTokensPending = pendingPrivateTokens.length > 0;

  const doesPrivateAddressHaveTokens =
    pendingPrivateTokens.length > 0 ||
    spendablePrivateTokens.length > 0 ||
    nonSpendablePrivateTokens.length > 0;

  const [searchResult, setSearchResult] = useState<UserToken>();

  // Helper functions 
  const handleSetToken = (token: UserToken) => {
    const setToken = isThisTokenBeingSentToRecipient ? setTokenForPrivateMode : setBroadcasterFeeToken;

    setToken(token);

    if (!isThisTokenBeingSentToRecipient) {
      toast.success(`${token.symbol} Selected For Fee`);
    }

    closeSelectPrivateTokenModal();
  };
  
  const renderTokensByType = (
    tokens: UserToken[],
    type: TokenType,
  ) => tokens.map((token) => {

    const isTokenSelectable =
      token.category === RailgunWalletBalanceBucket.Spendable ||
      token.category === RailgunWalletBalanceBucket.MissingExternalPOI ||
      token.category === RailgunWalletBalanceBucket.MissingInternalPOI ||
      token.category === RailgunWalletBalanceBucket.ShieldBlocked;

    return (
      <ModalTokenCard
        key={token.address}
        token={token}
        type={type}
        showOnlyNonSpendable={showOnlyNonSpendable}
        onClick={isTokenSelectable ? () => handleSetToken(token) : undefined}
        isTokenSelectable={isTokenSelectable}
      />
    );
  });

  const renderPrivateTokens = () => {
    const dipslayBackupMessage = isScanningBalances && !doesPrivateAddressHaveTokens ? "Scanning balance..." : "You have no tokens";
    return (
      <>
        {searchResult ? (
          renderTokensByType([searchResult], RailgunWalletBalanceBucket.Spendable)
        ) : (
          <>
            {renderTokensByType(pendingPrivateTokens, RailgunWalletBalanceBucket.ShieldPending)}
            {renderTokensByType(spendablePrivateTokens, RailgunWalletBalanceBucket.Spendable)}
            {renderTokensByType(nonSpendablePrivateTokens, NON_SPENDABLE_BUCKETS)}
            <ModalCentreMessage isVisible={!doesPrivateAddressHaveTokens} message={dipslayBackupMessage}/>
          </>
        )}
      </>
    );
  };

  const unwrappingMessage = `Any ${activeNetwork.privateModeBaseToken.symbol} sent to a public address through Faceless is automatically converted to ${activeNetwork.publicModeBaseToken.symbol}.`;
  const pendingTokensMessage = `The incoming tokens should be available within 1 hour.\nif not: Settings > Other > Generate All POIs.\n${unwrappingMessage}`;
  const ifTokensAreUnavailableMessage = "If your tokens aren't available within the next 15 minutes: Settings > Other > Generate All POIs.";

  const modalInfoBoxText = showOnlyNonSpendable ? ifTokensAreUnavailableMessage : 
    areAnyTokensPending ? pendingTokensMessage : unwrappingMessage;

  const titleText = displayConnectPrivateAddressPanel ? "Connect Private Address" : "Select a Token";

  return (
    <ModalFrame onExitClick={closeSelectPrivateTokenModal} shouldHandleProvider={true}>
      <ModalTitle title={titleText} />

      {displayConnectPrivateAddressPanel ? ( 
        <ConnectPrivateAddressPanel closeParent={closeSelectPrivateTokenModal}/>
      ) : (
        <>
          <ModalPrivateTokenSearchBar
            tokens={spendablePrivateTokens}
            onSearchResult={setSearchResult}
          />

          <ModalPrivateScanProgress
            privateAddressBalanceScanPercentage={privateAddressBalanceScanPercentage}
            txidMerkletreeScanPercentage={txidMerkletreeScanPercentage}
          />

          {doesPrivateAddressHaveTokens && 
            <ModalInfoBox>
              {modalInfoBoxText}
            </ModalInfoBox>
          }
          
          <hr className="border-3 border border-modal-accent-100" />

          <div className="hide-scrollbar max-h-[21.715em] overflow-y-scroll rounded-b-md">
            {renderPrivateTokens()}
          </div>

          <hr className="border-3 border border-modal-accent-100" />

          <ModalToggleTokensView
            walletModeCardView={walletModeCardView}
            pendingPrivateTokens={pendingPrivateTokens}
            spendablePrivateTokens={spendablePrivateTokens}
            nonSpendablePrivateTokens={nonSpendablePrivateTokens}
            showOnlyNonSpendable={showOnlyNonSpendable}
            setShowOnlyNonSpendable={setShowOnlyNonSpendable}
          />
        </>
      )}
    </ModalFrame>
  );
};
