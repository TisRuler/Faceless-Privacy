import { 
  useState, 
  useEffect, 
  useRef, 
  useCallback 
} from "react";
import {
  ArrowTopRightOnSquareIcon,
  ChevronDownIcon,
  QrCodeIcon,
  WalletIcon,
  ArrowLeftStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { usePrivateAddressStore, useSettingsStore } from "~~/src/state-managers";
import { disconnectPrivateAddress } from "~~/src/layouts/Header/components/utils/disconnectPrivateAddress";
import { loadPrivateAddressHistoryTrigger } from "~~/src/layouts/Header/components/utils/loadPrivateAddressHistoryTrigger";
import { DropdownItemButton } from "./shared-subcomponents/DropdownItemButton";
import {
  openPrivateAddressDetailsModal,
  openPrivateAddressHistoryModal,
  openViewPrivateAddressTokensModal,
  openConnectPrivateAddressModal,
} from "../../Modals/modalUtils";
import { useShouldBootstrapNetworkStack } from "~~/src/shared/hooks/useShouldBootstrapNetworkStack";
import { refreshPrivateAddressBalances } from "~~/src/shared/utils/tokens";
import { GENERAL_NOTIFICATIONS, PRIVATE_ADDRESS_NOTIFICATIONS } from "~~/src/constants/notifications";
import { logError } from "~~/src/shared/utils/other";
import toast from "react-hot-toast";

export const PrivateAddressDropdown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeNetwork = useSettingsStore((state) => state.activeNetwork);
  const yourPrivateAddress = usePrivateAddressStore((state) => state.yourPrivateAddress);
  const shouldBootstrapNetworkStack = useShouldBootstrapNetworkStack();

  const isPrivateAddressConnected = !yourPrivateAddress;

  // Functions
  const handleDisconnectPrivateAddress = async () => {
    try {
      await disconnectPrivateAddress();
      toast.error(PRIVATE_ADDRESS_NOTIFICATIONS.DISCONNECTED);
    } catch (error) {
      toast.error(GENERAL_NOTIFICATIONS.BACKUP_ERROR);
      logError(error);
    } finally {
      setIsDropdownOpen(false);
    }
  };

  const handleViewTokens = () => {
    openViewPrivateAddressTokensModal();
    refreshPrivateAddressBalances(shouldBootstrapNetworkStack, activeNetwork);
    setIsDropdownOpen(false);
  };

  const handleViewHistory = () => {
    openPrivateAddressHistoryModal();
    loadPrivateAddressHistoryTrigger();
    setIsDropdownOpen(false);
  };

  // Outside click managing
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

  // Ui
  const buttonClass = "pl-3 pr-2 flex items-center whitespace-nowrap text-modal-base h-[1.5em] sm:h-[1.75em] rounded-full border border-cardBorder hover:bg-primary-button-gradient cursor-pointer";
  const buttonTextClass = "mr-1 text-xs sm:text-sm";

  if (isPrivateAddressConnected) {
    return (
      <button onClick={openConnectPrivateAddressModal} className={buttonClass}>
        <span className={buttonTextClass}>Connect Private Address</span>
      </button>
    );
  }

  return (
    <div className="flex items-center justify-end text-main-base">
      <div className="relative leading-3" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(p => !p)}
          className={buttonClass}
          aria-expanded={isDropdownOpen}
        >
          <span className={buttonTextClass}>Private Address Connected</span>
          <ChevronDownIcon className="h-3 w-3 sm:h-4 sm:w-4" strokeWidth={3.5} />
        </button>

        {isDropdownOpen && (
          <ul className="absolute right-0 mt-2 w-[9.6em] rounded-2xl border border-main-base bg-black px-1 py-1 text-main-base">
            <DropdownItemButton name="View Details" 
              Icon={QrCodeIcon} 
              onClick={() => {
                openPrivateAddressDetailsModal();
                setIsDropdownOpen(false);
              }}
            />
            <DropdownItemButton name="View Tokens" Icon={WalletIcon} onClick={handleViewTokens}/>
            <DropdownItemButton name="View History" Icon={ArrowTopRightOnSquareIcon} onClick={handleViewHistory}/>
            <DropdownItemButton name="Disconnect" Icon={ArrowLeftStartOnRectangleIcon} onClick={handleDisconnectPrivateAddress} bonusClassName="text-error"/>
          </ul>
        )}
      </div>
    </div>
  );
};