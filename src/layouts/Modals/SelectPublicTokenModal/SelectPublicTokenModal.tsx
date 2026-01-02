import React, { useState, useEffect } from "react";
import {
  usePublicWalletStore,
  useWalletModeScreenStore,
  useSettingsStore,
  useConnectorRolesStore,
  ConnectorRoles,
} from "~~/src/state-managers";
import { refreshPublicAddressBalances } from "~~/src/shared/utils/tokens";
import {
  ModalFrame,
  ModalTokenCard,
  ModalCentreMessage,
  ModalTitle
} from "../shared/components";
import { RefreshingPublicTokensIndicatorTab } from "./components/RefreshingPublicTokensIndicatorTab";
import { ConnectWalletPanel } from "../shared/panels";
import { useAccount } from "wagmi";
import { UserToken } from "~~/src/shared/types";
import { CardView } from "~~/src/shared/enums";
import { closeSelectPublicTokenModal } from "../modalUtils";
import { RailgunWalletBalanceBucket } from "@railgun-community/shared-models";
import { PublicTokenSearchBar } from "./components/PublicTokenSearchBar";
import { useIsTargetConnectorAuthorized } from "~~/src/shared/hooks/useIsTargetConnectorAuthorized";

export const SelectPublicTokenModal = () => {

  // States
  const activeNetwork = useSettingsStore((state) => state.activeNetwork);
  const isLoadingPublicWalletTokens = usePublicWalletStore((state) => state.isLoadingPublicWalletTokens);
  const tokensInPublicWallet = usePublicWalletStore((state) => state.tokensInPublicWallet);
  const walletModeCardView = useSettingsStore((state) => state.walletModeCardView);
  const publicConnectorId = useConnectorRolesStore((state) => state.publicConnectorId);

  const { 
    isConnected: isPublicWalletConnected,
    address: publicAddress,
    connector: activeConnector
  } = useAccount();

  // Wallet connection state flags
  const isPublicConnectorAuthorised = useIsTargetConnectorAuthorized(publicConnectorId);

  const isActiveConnectorOnTheCorrectRole =
    activeConnector?.id === publicConnectorId && 
    activeConnector !== undefined;

  const displayConnectWalletPanel =
    !isPublicWalletConnected ||
    !publicConnectorId && !isPublicConnectorAuthorised;

  const canFetchWalletBalances = isPublicWalletConnected && isPublicConnectorAuthorised;

  // Search result state
  const [searchResult, setSearchResult] = useState<UserToken>();

  useEffect(() => {
    if (canFetchWalletBalances) {
      refreshPublicAddressBalances(activeNetwork);
    }
  }, [
    isPublicWalletConnected, 
    publicAddress, 
    isActiveConnectorOnTheCorrectRole,
    isPublicConnectorAuthorised
  ]);

  // Token setting
  const setTokenForPublicMode = useWalletModeScreenStore.getState().setTokenForPublicMode;

  const handleSetShieldingToken = (token: UserToken) => {
    setTokenForPublicMode(token);
    closeSelectPublicTokenModal();
  };
    
  // Ui
  const renderPublicTokens = () => {
    const showBackupMessage = tokensInPublicWallet.length < 1;
    const displayBackupMessage = isLoadingPublicWalletTokens && tokensInPublicWallet.length < 1 ? "Loading Tokens..." : "You have no tokens";

    return (
      <>
        {searchResult &&
          <ModalTokenCard
            key={searchResult.address}
            token={searchResult}
            type={RailgunWalletBalanceBucket.Spendable}
            isTokenSelectable={true}
            onClick={() => handleSetShieldingToken(searchResult)}
          />
        }

        {!searchResult && (tokensInPublicWallet).map((token) => (
          <ModalTokenCard
            key={token.address}
            token={token}
            type={RailgunWalletBalanceBucket.Spendable}
            isTokenSelectable={true}
            onClick={() => handleSetShieldingToken(token)}
          />
        ))}
        <ModalCentreMessage isVisible={showBackupMessage} message={displayBackupMessage}/>
      </>
    );
  };

  const titleText = displayConnectWalletPanel ? "Select a Wallet" : "Select a Token";

  return (
    <ModalFrame onExitClick={closeSelectPublicTokenModal} shouldHandleProvider={true}>
      <ModalTitle title={titleText} />

      { displayConnectWalletPanel ? (
        <ConnectWalletPanel setRole={ConnectorRoles.PUBLIC}/>
      ) : (
        <>
          <PublicTokenSearchBar
            onSearchResult={setSearchResult}
          />

          <RefreshingPublicTokensIndicatorTab
            isLoading={isLoadingPublicWalletTokens}
            length={tokensInPublicWallet.length}
          />

          <hr className="border-3 border border-modal-accent-100" />

          <div className="max-h-[21.715em] overflow-y-scroll rounded-b-md">
            {walletModeCardView === CardView.Public && renderPublicTokens()}
          </div>

          <hr className="border-3 border border-modal-accent-100" />
        </>
      )
      }
    </ModalFrame>
  );
};
