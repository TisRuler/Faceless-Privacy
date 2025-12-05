import { useState } from "react";
import { useSettingsStore, usePrivateAddressStore } from "~~/src/state-managers";
import { ModalInfoCard } from "../../shared/components";
import { ArrowPathIcon, BoltIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { generatePOIsForWallet } from "@railgun-community/wallet";
import { rescanFullUTXOMerkletreesAndWallets } from "@railgun-community/wallet";
import { logError } from "~~/src/shared/utils/other/logError";
import toast from "react-hot-toast";

interface OtherSettingsPanelProps {
  switchToGasSettings: () => void;

}

export const OtherSettingsPanel: React.FC<OtherSettingsPanelProps> = ({
  switchToGasSettings,
}) => {

  // Hooks
  const { customGweiAmount, gasChoiceDefault, activeNetwork } = useSettingsStore();
  const railgunWalletId = usePrivateAddressStore((state) => state.railgunWalletId);

  // Labels
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  
  const isPrivateAddressConnected = railgunWalletId ? true : false;

  const gasChoiceLabel = gasChoiceDefault ? "Default" : "Custom";
  const gasMethodLabel = gasChoiceLabel === "Default" ? "Default (Auto)" : `Custom ${customGweiAmount} Gwei`;

  // Handlers
  const handleFullRefresh = async () => {
    const toastId = toast.loading("Refreshing Private Balances");
  
    setIsRefreshing(true);
  
    try {
      await rescanFullUTXOMerkletreesAndWallets(activeNetwork.railgunChain, [railgunWalletId]);
      toast.success("Private Balances Refreshed", { id: toastId });
    } catch (error: any) {
      const message = error?.message || "";
  
      if (message.includes("already in progress")) {
        toast.success("Refresh already in progress", { id: toastId });
      } else {
        console.error("Rescan failed:", error);
        toast.error("Failed to Refresh Private Balances", { id: toastId });
      }
      logError(error);
    } finally {
      setIsRefreshing(false); 
    }
  };

  const handleGeneratePois = async (): Promise<void> => {
    const toastId = toast.loading("Generating POIs");
    setIsGenerating(true);
  
    try {
      await generatePOIsForWallet(activeNetwork.railgunNetworkName, railgunWalletId);
      toast.success(`Generating ${activeNetwork.name} POIs`, { id: toastId });
    } catch (error) {
      toast.error("Failed to Generate POIs", { id: toastId });
      logError(error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Ui
  return (
    <>
      <ModalInfoCard
        title="Gas"
        body={`${gasMethodLabel}`}
        icon={
          <ChevronRightIcon
            className="h-6 w-4 text-xl"
            aria-hidden="true"
            strokeWidth={1.8}
          />
        }
        onClick={switchToGasSettings}
      />

      <ModalInfoCard
        title="Refresh Private Address Balances"
        body={isRefreshing ? "Currently Refreshing..." : "This may take a few minutes"}
        icon={
          <ArrowPathIcon
            className="h-6 w-4 text-xl"
            aria-hidden="true"
            strokeWidth={1.6}
          />
        }
        onClick={handleFullRefresh}
        disabled={isRefreshing}
        isVisible={isPrivateAddressConnected}
      />

      <ModalInfoCard
        title="Generate All POIs"
        body={isGenerating ? "Currently Generating..." : "This may take a few minutes"}
        icon={
          <BoltIcon
            className="h-6 w-4 text-xl"
            aria-hidden="true"
            strokeWidth={1.6}
          />
        }
        onClick={handleGeneratePois}
        disabled={isRefreshing}
        isVisible={isPrivateAddressConnected}
      />
    </>
  );
};
