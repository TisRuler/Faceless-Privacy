import React from "react";
import { CardView } from "~~/src/shared/enums";

interface ViewOptionTitleAndSubtitleProps {
  viewOption: CardView;
}

export const ViewOptionTitleAndSubtitle: React.FC<ViewOptionTitleAndSubtitleProps> = ({ viewOption }) => {
  return (
    <div>
      <p className="whitespace-nowrap font-isb text-lg sm:text-xl">{viewOption === CardView.Public ? "Inflow of Private Funds" : "Outflow of Private Funds"}</p>
      <p className="mb-2 font-isb text-sm text-main-100 sm:text-base">{viewOption === CardView.Public ? "Recent inflow and remaining privacy pool balance" : "Recent outflow and remaining privacy pool balance"}</p>
    </div>
  );
};