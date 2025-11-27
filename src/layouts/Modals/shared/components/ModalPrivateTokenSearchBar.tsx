import { useState } from "react";
import { ModalSearchBar } from "./ModalSearchBar";
import { UserToken } from "~~/src/shared/types";
import { isAddress } from "ethers";
import { GENERAL_NOTIFICATIONS } from "~~/src/constants/notifications";
import toast from "react-hot-toast";

interface ModalPrivateTokenSearchBarProps {
  tokens: UserToken[];
  onSearchResult: (result: UserToken | undefined) => void;
}

export const ModalPrivateTokenSearchBar = ({ tokens, onSearchResult }: ModalPrivateTokenSearchBarProps) => {
  const [input, setInput] = useState("");

  const handleSearch = () => {
    const trimmedInput = input.trim();

    if (!isAddress(trimmedInput)) {
      toast.error(GENERAL_NOTIFICATIONS.CHECK_ADDRESS);
      onSearchResult(undefined);
      return;
    }
    
    const found = tokens.find(
      token => token.address?.toLowerCase() === trimmedInput.toLowerCase()
    );

    found ? onSearchResult(found) : handleNoTokenFound();
  };

  const handleNoTokenFound = () => {
    toast.error("Token not found");
    onSearchResult(undefined);
  };

  const handleClear = () => {
    setInput("");
    onSearchResult(undefined);
  };

  return (
    <ModalSearchBar
      value={input}
      onChange={setInput}
      onSearch={handleSearch}
      onClear={handleClear}
    />
  );
};