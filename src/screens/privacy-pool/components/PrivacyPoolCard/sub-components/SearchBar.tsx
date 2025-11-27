/**
 * 
 * This component enables searching the anonymity pool for any token.
 *
 * Key inputs:
 * - `setNewSearch`: Updating this useState triggers the `useEffect` in `PrivacyPoolCard`.
 *                   This causes the `getTokenListToDisplay` function to be called, followed by `getAnonymityPoolTokenData`.
 *                   The data fetched from these functions is then displayed on the UI.
 * 
 */

import { useState } from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import { GENERAL_NOTIFICATIONS } from "~~/src/constants/notifications";

interface SearchBarProps {
  setNewSearch: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  setNewSearch,
}) => {

  const [inputtedInSearchBar, setInputtedInSearchBar] = useState<any>("");

  return (
    <div className="flex items-center justify-between">
      <input
        onChange={(e) => {
          if (inputtedInSearchBar === "Your Searched Token Results") {
            return; // Prevent any changes when the value is "Your Searched Token Results"
          }
          
          setInputtedInSearchBar(e.target.value);
        }}
        value={inputtedInSearchBar}
        readOnly={inputtedInSearchBar === "Your Searched Token Results"}
        type="text"
        className="mb-3 mt-3 w-full rounded-bl-lg rounded-tl-lg border border-r-0 border-main-base bg-black py-2 pl-3 font-im text-sm focus:outline-none sm:text-base"
        placeholder="Search By Token Address..."
        style={{
          userSelect: "none",
          cursor: inputtedInSearchBar === "Your Searched Token Results" ? "default" : ""
        }}
      />

      {inputtedInSearchBar !== "" && (
        <button
          onClick={() => {
            setNewSearch("");
            setInputtedInSearchBar("");
          }}
          className="cursor-pointer border border-r-0 border-main-base bg-primary-button-gradient px-4 py-2"
        >
          <XMarkIcon className="ml-6 h-5 w-4 text-main-base sm:ml-0 sm:h-6 sm:w-5" />
        </button>
      )}

      <button
        onClick={() => {
          if (inputtedInSearchBar.length === 42) {
            setInputtedInSearchBar("Your Searched Token Results");
            setNewSearch(inputtedInSearchBar);
          } else {
            toast.error(GENERAL_NOTIFICATIONS.CHECK_ADDRESS);
          }
        }}
        className="relative cursor-pointer rounded-br-lg rounded-tr-lg border border-[white] bg-primary-button-gradient px-4 py-2"
      >
        <MagnifyingGlassIcon className="h-5 w-4 text-main-base sm:h-6 sm:w-5" />
      </button>
    </div>
  );
};