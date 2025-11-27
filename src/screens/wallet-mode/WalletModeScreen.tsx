import React from "react";
import { useSettingsStore, useWalletModeScreenStore } from "~~/src/state-managers";
import { 
  WalletModeCard,
  TransactionLinkTab,
  FailedToConnectBroadcasterNotice
} from "./components";
import { CardView } from "~~/src/shared/enums";
import { MainUnwrappingMessage } from "./components/MainUnwrappingMessage";

export const WalletModeScreen = () => {

  // get states
  const activeNetwork = useSettingsStore((state) => state.activeNetwork);
  const walletModeCardView = useSettingsStore((state) => state.walletModeCardView);

  const publicModeTxHash = useWalletModeScreenStore((state) => state.publicModeTxHash);
  const privateModeTxHash = useWalletModeScreenStore((state) => state.privateModeTxHash);

  const displayBroadcasterNotices = walletModeCardView === CardView.Private;

  return (
    <div className="text-main-base">

      {/* {displayBroadcasterNotices && 
        <FailedToConnectBroadcasterNotice txHash={privateModeTxHash}/>
      } */}

      <MainUnwrappingMessage activeNetwork={activeNetwork} />

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

    </div>
  );
};