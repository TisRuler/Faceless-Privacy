import { 
  useState, 
  useEffect, 
  useRef, 
  useCallback 
} from "react";
import { Chain } from "viem";
import { masterConfig } from "~~/src/config/masterConfig";
import { DropdownItemButton } from "./shared-subcomponents/DropdownItemButton";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

interface NetworkSelectorProps {
  selectedNetworkName: string;
  handleSwitchNetwork: (chain: Chain) => void;
}

export const NetworkSelector: React.FC<NetworkSelectorProps> = ({
  selectedNetworkName,
  handleSwitchNetwork,
}) => {
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const networkList = masterConfig.viem.supportedNetworks;

  // Handles clicks outside the dropdown to close it
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen, handleClickOutside]);

  return (
    <div className="flex items-center justify-end sm:mr-4 mt-2 sm:mt-0">
      <div className="relative leading-3" ref={dropdownRef}>

        {/* Toggle */}
        <div className="flex items-center justify-center">
          <button
            className={`
          flex h-[1.5em] cursor-pointer items-center whitespace-nowrap rounded-2xl border font-im sm:h-[1.75em] 
          ${isDropdownOpen ? "border-main-base text-main-base hover:bg-primary-button-gradient" 
      : "border-transparent text-main-100 hover:text-main-base"}
        `}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span className="ml-3 mr-1 text-xs sm:text-sm">{selectedNetworkName}</span>
            <ChevronDownIcon
              className="mr-2 h-3 w-3 sm:h-4 sm:w-4"
              strokeWidth={3.5}
            />
          </button>
        </div>

        {/* Menu */}
        {isDropdownOpen && (
          <ul className="absolute right-0 sm:right-auto z-50 mt-2 rounded-2xl border border-main-base bg-black px-1 py-1 text-main-base">
            {networkList.map((network: Chain) => (
              <DropdownItemButton 
                key={network.id}
                name={network.name}
                onClick={() => {
                  handleSwitchNetwork(network);
                  setIsDropdownOpen(false);
                }}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};