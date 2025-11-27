import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WrenchIcon } from "@heroicons/react/24/outline";
import { PrivateAddressDropdown } from "./components/PrivateAddressDropdown";
import { Nav } from "./components/Nav";
import { NetworkSelector } from "./components/NetworkSelector";
import { useSettingsStore, useWalletModeScreenStore, usePrivacyPoolScreenStore } from "~~/src/state-managers";
import { handleSwitchNetwork } from "./components/utils/handleSwitchNetwork";
import { openGeneralSettingsModal } from "../Modals/modalUtils";
import toast from "react-hot-toast";
import logo from "../../assets/images/logo/logo.svg";

export const Header = () => {
  const pathname = usePathname();
  const activeNetwork = useSettingsStore((state) => state.activeNetwork);

  const isTransactionInProgress = useWalletModeScreenStore((state) => state.isTransactionInProgress);
  const isPrivacyPoolDataLoading = usePrivacyPoolScreenStore((state) => state.isLoading);
  const isRoot = pathname === "/";
  const shouldDisableHeader = pathname === "/wallet" && isTransactionInProgress || pathname === "/analytics" && isPrivacyPoolDataLoading ; // Without pathname checking, users could manually switch page and find them self stuck on it

  const toastMessage = isTransactionInProgress ? "Wait..." : "Wait for the Privacy Analytics to load...";

  return (
    <>
      {!isRoot && ( 
        <div className="bg-[#3C2268] py-2 text-center">
          <p className="px-4 font-im text-xs leading-tight text-white sm:text-sm sm:leading-normal">
          Faceless is currently open-source and unaudited.
            <span className="sm:hidden"><br/></span>
            {" "}Please use it responsibly and at your own risk.
          </p>
        </div>
      )}
      <div className={shouldDisableHeader ? "cursor-auto" : ""}
        onClick={() => {shouldDisableHeader &&
          toast.success(toastMessage, { duration: 5000 });
        }}
      >
      
        <div className={`
        ${shouldDisableHeader && "pointer-events-none"} 
        z-100 navbar sticky top-0 mt-2 min-h-0 flex-shrink-0 items-start justify-between sm:mt-0 lg:static
      `}>

          <div className="navbar-start w-auto lg:w-1/2">  
            <div className="ml-6 mr-3 hidden items-center gap-2 lg:flex">
              <Link href="/" passHref className="relative flex h-12 w-[2.8em]">
                <Image alt="Faceless logo" className="cursor-pointer" fill src={logo} />
              </Link>
            </div>

            {!isRoot && <Nav />}
          </div>

          {!isRoot && (      
            <div className="mr-2 mt-2 sm:mr-6 sm:mt-0">
              <div className="navbar-end flex flex-grow flex-col-reverse items-end font-isb sm:flex-row sm:items-center">
                <NetworkSelector 
                  selectedNetworkName={activeNetwork.name} 
                  handleSwitchNetwork={handleSwitchNetwork}
                />
                <PrivateAddressDropdown />     
              </div>

              <div className="ml-6 hidden sm:block">
                <button onClick={openGeneralSettingsModal} className="w-full gap-3 py-3 sm:w-auto">
                  <WrenchIcon 
                    className="h-4 w-4 text-main-100 hover:text-main-base sm:h-6 sm:w-5" 
                    style={{ strokeWidth: 1.5 }}  
                  />
                </button>
              </div>
            </div>
          )}

        </div> 
      </div>   
    </>
  );
};
