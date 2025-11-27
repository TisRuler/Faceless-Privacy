/**
 * This component allows you to view all recent Privacy Pool history.
 * 
 * The `useEffect` is triggered by updates to `spendablePrivateTokens`, `newSearch`, 'viewOption' and 'refreshTrigger'. 
 * It first fetches the list of tokens to display, 
 * then retrieves the recent transactions for those listed tokens and formats that data into two columns within a card.
 * 
 * Key Components:
 * - `SearchBar`: Handles token search input.
 * - `RefreshButton`: Manually refreshes token data.
 * - `CardDisclosureButton` & `CardDisclosurePanel`: Displays token details in collapsible panels.
 */

import React, { useEffect, useState } from "react";
import { CardView } from "~~/src/shared/enums";
import { ViewOptionTitleAndSubtitle, RefreshButton, SearchBar, PrivacyCardMessage, TokenCard } from "./sub-components";
import { usePrivateAddressStore, useModalStore } from "~~/src/state-managers";
import { getActiveNetwork } from "~~/src/shared/utils/network";
import { PoolTokenDetails } from "../../types";
import { getTokenAddressesToDisplay, getAnonymityPoolTokenData } from "../../utils/getters";
import { useShouldBootstrapNetworkStack } from "~~/src/shared/hooks/useShouldBootstrapNetworkStack";
import { openManageProvidersModal } from "~~/src/layouts/Modals/modalUtils";
import { logError } from "~~/src/shared/utils/other/logError";
import cardBackground from "~~/src/assets/images/background/cardBackground.svg";

interface PrivacyPoolCardProps {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  viewOption: CardView;
}
  
export const PrivacyPoolCard: React.FC<PrivacyPoolCardProps> = ({ isLoading, setIsLoading, viewOption }) => {

  const spendablePrivateTokens = usePrivateAddressStore((state) => state.spendablePrivateTokens);

  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [poolTokenDetailsList, setPoolTokenDetailsList] = useState<PoolTokenDetails[]>([]);
  const [issueGettingDetails, setIssueGettingDetails] = useState<boolean>(false);
  const [newSearch, setNewSearch] = useState<string>("");

  const shouldBootstrapNetworkStack = useShouldBootstrapNetworkStack();

  useEffect(() => {

    if (shouldBootstrapNetworkStack) {
      setPoolTokenDetailsList([]);
      openManageProvidersModal();
      return;
    }

    if (newSearch === "" || newSearch.length === 42) {

      const updateTokenList = async () => {
        setPoolTokenDetailsList([]);
        setIsLoading(true);
        setIssueGettingDetails(false);
        try { 
          const configuredNetwork = getActiveNetwork();
        
          const addressesForDisplay = await getTokenAddressesToDisplay(
            newSearch, 
            spendablePrivateTokens, 
            configuredNetwork.defaultPrivacyPoolTokenList
          );
        
          const newTokenData = await getAnonymityPoolTokenData(
            viewOption, 
            addressesForDisplay, 
            configuredNetwork?.anonymityPoolAddress!, 
            configuredNetwork.blockExplorer,
            configuredNetwork.id
          );

          setPoolTokenDetailsList(newTokenData);
          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);
          setIssueGettingDetails(true);
          logError(error);
        }
      };
    
      updateTokenList();
    } 
  }, [spendablePrivateTokens, newSearch, viewOption, refreshTrigger, shouldBootstrapNetworkStack]);

  useEffect(() => {
    setPoolTokenDetailsList([]);
  }, [viewOption]);

  // Ui
  const hadIssuesGettingDetails = issueGettingDetails && poolTokenDetailsList.length < 1 && !isLoading;
  const isWaitingForProviderConnection = !issueGettingDetails && poolTokenDetailsList.length < 1 && !isLoading;

  const waitingForProviderText = "Click the refresh icon or add a provider";

  return (
    <div className="z-10 mx-4 w-[600px] sm:mt-4 lg:mt-16">
      <div className="rounded-2xl border border-secondary drop-shadow-card sm:mt-4"
        style={{
          backgroundImage: `url(${cardBackground.src})`,
          backgroundSize: "110% 300%",
          backgroundPosition: "center",
        }}
      >
        <div className="px-5 py-4 sm:px-8 sm:py-6">

          <div className="flex items-center justify-between">
            <ViewOptionTitleAndSubtitle viewOption={viewOption} />

            <RefreshButton
              shouldBootstrapNetworkStack={shouldBootstrapNetworkStack}
              refreshTrigger={refreshTrigger}
              setRefreshTrigger={setRefreshTrigger}
              isLoading={isLoading}
            />
          </div>

          <SearchBar
            setNewSearch={setNewSearch}
          />

          {isLoading && <PrivacyCardMessage text="Loading, please wait — 1 minute."/>}

          {hadIssuesGettingDetails && <PrivacyCardMessage text="couldn't get token details, try refreshing or using a new provider"/>}
          {isWaitingForProviderConnection && <PrivacyCardMessage text={waitingForProviderText}/>}

          <div className="hide-scrollbar max-h-[295px] overflow-y-scroll sm:max-h-[400px]">
            {poolTokenDetailsList.map((poolTokenDetails: PoolTokenDetails) => (
              <TokenCard key={poolTokenDetails.address} poolTokenDetails={poolTokenDetails} viewOption={viewOption} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};