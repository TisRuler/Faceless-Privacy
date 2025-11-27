import { useState, useCallback } from "react";
import { ModalSearchBar } from "../../shared/components/ModalSearchBar";
import { UserToken } from "~~/src/shared/types";
import { isAddress } from "ethers";
import { fetchSearchedPublicAddressToken } from "~~/src/shared/utils/wallet";
import { GENERAL_NOTIFICATIONS } from "~~/src/constants/notifications";
import toast from "react-hot-toast";

interface PublicTokenSearchProps {
  onSearchResult: (result: UserToken | undefined) => void;
}

export const PublicTokenSearchBar = ({ onSearchResult }: PublicTokenSearchProps) => {
  const [input, setInput] = useState("");

  const handleSearch = useCallback(async () => {
    const trimmedInput = input.trim();

    if (!isAddress(trimmedInput)) {
      toast.error(GENERAL_NOTIFICATIONS.CHECK_ADDRESS);
      onSearchResult(undefined);
      return;
    }

    try {
      const token = await fetchSearchedPublicAddressToken(input);
      token ? onSearchResult(token) : handleNoTokenFound();
    } catch {
      toast.error(GENERAL_NOTIFICATIONS.BACKUP_ERROR);
      onSearchResult(undefined);
    }
  }, [input, onSearchResult]);

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