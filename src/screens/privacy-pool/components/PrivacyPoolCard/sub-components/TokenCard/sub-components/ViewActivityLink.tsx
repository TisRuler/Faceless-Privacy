import React from "react";
import { TokenInPoolLink } from "~~/src/screens/privacy-pool/types";
import { CardView } from "~~/src/shared/enums";

interface ViewActivityLinkLinkProps {
  viewOption: string;
  blockExplorerDetails: TokenInPoolLink;
}

export const ViewActivityLink: React.FC<ViewActivityLinkLinkProps> = ({ viewOption, blockExplorerDetails }) => {
  
  return (
    <a href={blockExplorerDetails.url} target="_blank" rel="noopener noreferrer">
      <h3 className={"ml-2 mt-4 font-isb text-main-base underline"}>
        View All {viewOption === CardView.Public ? "Inflow" : "Outflow"} Activity On {`${blockExplorerDetails.name}`}
      </h3>
    </a>
  );
};
