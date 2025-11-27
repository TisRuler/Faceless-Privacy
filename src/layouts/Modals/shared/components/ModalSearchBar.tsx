import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { FC } from "react";

interface ModalSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
}

export const ModalSearchBar: FC<ModalSearchBarProps> = ({ 
  value, 
  onChange, 
  onSearch, 
  onClear,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSearch();
  };

  return (
    <div className="mt-4 flex items-center justify-between">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        type="text"
        placeholder="Search by token address"
        className="mb-4 w-full rounded-bl-lg rounded-tl-lg border border-r-0 border-modal-accent-100 bg-modal-accent-500 py-2 pl-3 font-im text-sm placeholder-modal-200 focus:outline-none sm:text-base"
      />
      {value && (
        <button 
          type="button" 
          aria-label="Clear search" 
          onClick={onClear} 
          className="mb-4 cursor-pointer border border-modal-accent-100 px-4 py-2"
        >
          <XMarkIcon className="h-5 w-4 sm:h-6 sm:w-5" />
        </button>
      )}
      <button 
        type="button" 
        aria-label="Search"
        onClick={onSearch}
        className="mb-4 cursor-pointer rounded-br-lg rounded-tr-lg border border-modal-accent-100 bg-primary-button-gradient px-4 py-2"
      >
        <MagnifyingGlassIcon className="h-5 w-4 sm:h-6 sm:w-5" />
      </button>
    </div>
  );
};