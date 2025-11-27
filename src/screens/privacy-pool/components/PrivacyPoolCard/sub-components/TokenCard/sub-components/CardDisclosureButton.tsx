import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { TokenLogoDisplayer } from "./TokenLogoDisplayer";
import { PoolTokenDetails } from "../../../../../types";

interface TokenDisclosureButtonProps {
  tokenItem: PoolTokenDetails;
  itemOpen: boolean;
}

export const CardDisclosureButton: React.FC<TokenDisclosureButtonProps> = ({ tokenItem, itemOpen }) => {
  return (
    <Disclosure.Button
      className="mt-2 flex w-full cursor-pointer items-center justify-between rounded-lg border border-main-base bg-black px-3.5 py-3"
      style={{
        backgroundImage: `radial-gradient(
          ellipse 500px 110px at 100px 60px,
          #000000 90%,
          #B8FFAD 100%
        )`,
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <div className="flex w-full flex-col items-start justify-between sm:flex-row sm:items-center">
        <div className="flex items-center">
          <div className="mr-4 hidden sm:block">
            <TokenLogoDisplayer token={tokenItem} />
          </div>
          <div className="whitespace-nowrap text-left font-isb">
            <p>{tokenItem.name}</p>
          </div>
        </div>
        <div className="flex  w-full justify-between whitespace-nowrap sm:w-auto">
          <div className="whitespace-nowrap font-isb">
            <p>
              {tokenItem.anonymityPoolTokenBalance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} Tokens
            </p>
          </div>
          <ChevronUpIcon 
            className={`${itemOpen ? "rotate-180 transform" : ""} ml-2 mt-[0.1em] h-5 w-5 stroke-current`} 
            strokeWidth={1}
          />
        </div>
      </div>
    </Disclosure.Button>
  );
};
