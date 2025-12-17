import React from "react";
import { useSettingsStore, useWalletModeScreenStore } from "~~/src/state-managers";
import { 
  WalletModeCard,
  TransactionLinkTab,
  // FailedToConnectBroadcasterNotice
} from "./components";
import { CardView } from "~~/src/shared/enums";
import { WalletActionExplanation } from "./components/WalletActionExplanation";
import { Tooltip } from "~~/src/shared/components/Tooltip";

export const WalletModeScreen = () => {

  // get states
  const activeNetwork = useSettingsStore((state) => state.activeNetwork);
  const walletModeCardView = useSettingsStore((state) => state.walletModeCardView);

  const publicModeTxHash = useWalletModeScreenStore((state) => state.publicModeTxHash);
  const privateModeTxHash = useWalletModeScreenStore((state) => state.privateModeTxHash);

  // const displayBroadcasterNotices = walletModeCardView === CardView.Private;

  const tooltipText = 
    "Faceless gives wallets like MetaMask a private address.\n\n" +
    "Your private address, like everyone else's, holds private balances and a private transaction history, and lives inside Railgun's smart contracts. These contracts are well-audited, have processed over $4B in private volume, and act as a decentralized, encrypted database for all Railgun private addresses.\n\n" +
    "On-chain, observers can see that funds interacted with a smart contract, but they cannot tell which private address was involved - it could be any out of dozens...\n\n" +
    "For example:\n" + 
    "When funds move from a private address to a public address, observers only see that the funds came from the shared privacy pool. They cannot determine which private address sent them. \n\n" + 
    "Learn more in the [docs](https://faceless-privacy.gitbook.io/docs/general-information/what-is-faceless).";
  
  return (
    <div className="text-main-base">

      {/* {displayBroadcasterNotices && 
        <FailedToConnectBroadcasterNotice txHash={privateModeTxHash}/>
      } */}

      <WalletActionExplanation 
        activeNetwork={activeNetwork} 
        walletModeCardView={walletModeCardView} 
      />

      {/* main block */}
      <WalletModeCard
        activeNetwork={activeNetwork} 
        walletModeCardView={walletModeCardView}
      />
      
      <TransactionLinkTab
        displayText="View recent private address transaction"
        txHash={privateModeTxHash} 
        blockExplorer={activeNetwork.blockExplorer}
        tabActive={walletModeCardView} 
        tabToDisplayOn={CardView.Private}
      />

      <TransactionLinkTab
        displayText="View recent public address transaction"
        txHash={publicModeTxHash} 
        blockExplorer={activeNetwork.blockExplorer}
        tabActive={walletModeCardView} 
        tabToDisplayOn={CardView.Public}
      />

      <div className="fixed bottom-0 right-0 mr-4 sm:mr-8 mb-4 sm:mb-6">
        <Tooltip 
          title="Private Address Information" 
          tip={tooltipText}
          isXl={true} 
          isSolidColour={false}
        />
      </div>

    </div>
  );
};