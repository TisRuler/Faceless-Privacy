import React from "react";
import { CardView } from "~~/src/shared/enums";
import { BlockExplorerDetails } from "~~/src/config/chains/types";
import cardBackground from "~~/src/assets/images/background/cardBackground.svg";

interface TransactionLinkTabProps {
    displayText: string;
    txHash: string;
    blockExplorer: BlockExplorerDetails;
    tabActive: CardView;
    tabToDisplayOn: CardView;
}

export const TransactionLinkTab: React.FC<TransactionLinkTabProps> = ({
  displayText,
  txHash,
  blockExplorer,
  tabActive,
  tabToDisplayOn,
}) => {

  const display = txHash !== "" && tabActive === tabToDisplayOn;

  return (
    <div className="fixed bottom-0 flex w-full justify-center">
      {display && (
        <div className="cursor-pointer rounded-t-xl border border-b-0 border-main-base px-4 py-2 text-center font-im text-sm text-main-base sm:text-lg"
          style={{
            backgroundImage: `url(${cardBackground.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <a
            href={`${blockExplorer.url}/tx/${txHash}`}
            rel="noreferrer"
            target="_blank"
          >
            {displayText}
          </a>
        </div>
      )}
    </div>
  );
};
