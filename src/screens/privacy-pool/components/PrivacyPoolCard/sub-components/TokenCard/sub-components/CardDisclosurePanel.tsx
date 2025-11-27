import { Disclosure } from "@headlessui/react";
import { TokenColumnDisplayer } from "./TokenColumnDisplayer"; // Ensure these components are correctly imported
import { NoActivityNotice } from "./NoActivityNotice";
import { ViewActivityLink } from "./ViewActivityLink";
import { PoolTransactionData } from "../../../../../types";
import { CardView } from "~~/src/shared/enums";

interface CardDisclosurePanelProps {
  viewOption: CardView;
  transactionData: PoolTransactionData;
}

export const CardDisclosurePanel: React.FC<CardDisclosurePanelProps> = ({ viewOption, transactionData }) => {
  return (
    <Disclosure.Panel className="mt-[-13px] text-sm text-main-base">
      <div className="text-gl flex-between flex">
        <div className="mb-2 w-full items-center rounded-b-lg border border-t-0 border-main-base bg-black px-3.5 py-3">
          <div className="ml-2 mr-2 flex flex-wrap justify-between text-main-100">
            <TokenColumnDisplayer transactions={transactionData.column1TransactionData} />
            <TokenColumnDisplayer transactions={transactionData.column2TransactionData} />
          </div>
          <NoActivityNotice transactionData={transactionData} viewOption={viewOption} />
          <ViewActivityLink viewOption={viewOption} blockExplorerDetails={transactionData.tokenInPoolLink} />
        </div>
      </div>
    </Disclosure.Panel>
  );
};
