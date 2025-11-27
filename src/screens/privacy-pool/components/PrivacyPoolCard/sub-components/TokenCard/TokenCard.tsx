// TokenCard shows token info with expandable transactions (Disclosure UI)

import React from "react";
import { PoolTokenDetails } from "../../../../types";
import { CardDisclosureButton, CardDisclosurePanel } from "./sub-components";
import { Disclosure } from "@headlessui/react";
import { CardView } from "~~/src/shared/enums";

interface TokenCardProps {
  poolTokenDetails: PoolTokenDetails;
  viewOption: CardView;
}

export const TokenCard: React.FC<TokenCardProps> = ({ poolTokenDetails, viewOption }) => {
  return (
    <Disclosure key={poolTokenDetails.name}>
      {({ open: itemOpen }) => (
        <>
          <CardDisclosureButton tokenItem={poolTokenDetails} itemOpen={itemOpen} />
          <CardDisclosurePanel viewOption={viewOption} transactionData={poolTokenDetails} />
        </>
      )}
    </Disclosure>
  );
};