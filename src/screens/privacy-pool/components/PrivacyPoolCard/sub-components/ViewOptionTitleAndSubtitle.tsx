import React from "react";
import { CardView } from "~~/src/shared/enums";
import { Tooltip } from "~~/src/shared/components/Tooltip";

interface ViewOptionTitleAndSubtitleProps {
  viewOption: CardView;
}

export const ViewOptionTitleAndSubtitle: React.FC<ViewOptionTitleAndSubtitleProps> = ({ viewOption }) => {
  const isViewingShield = viewOption === CardView.Public;

  const toolTipTitle = isViewingShield ? "Inflow information" : "Outflow information";
  const toolTipTip = isViewingShield ? (
    "When funds move from a public address to a private one, they enter Railgun’s smart contracts, which hide each private address’s balances and history.\n\n" + 
    "On-chain, you can see that funds have been deposited into the contract, but you can’t tell which private address received them.\n\n" + 
    "The receiver could be any private address out of dozens.\n\n" + 
    "Learn more in the [docs](https://faceless-privacy.gitbook.io/docs/extras-user-guide/enhancing-anonymity)."
  ) : (
    "When funds move from a private address to a public one, they leave Railgun’s smart contracts, which keep each private address’s balances and history hidden.\n\n" + 
    "On-chain, you can see that funds have been withdrawn from the contract, but you can’t tell which private address they came from.\n\n" + 
    "The sender could be any private address out of dozens.\n\n" +
    "Learn more in the [docs](https://faceless-privacy.gitbook.io/docs/extras-user-guide/enhancing-anonymity)."
  );

  return (
    <div className="w-full">

      <div className="inline-flex items-center w-full">
        <p className="whitespace-nowrap font-isb text-lg sm:text-xl">{isViewingShield ? "Inflow of Public Funds" : "Outflow of Private Funds"}</p>
        <Tooltip title={toolTipTitle} tip={toolTipTip} />
      </div>
      
      <p className="mb-2 font-isb text-sm text-main-100 sm:text-base">{isViewingShield ? "Recent inflow and remaining privacy pool balance" : "Recent outflow and remaining privacy pool balance"}</p>

    </div>
  );
};