import { useSettingsStore, useWalletModeScreenStore, useBroadcasterStore } from "~~/src/state-managers";
import { ModalInfoCard } from "../../shared/components";
import { useShouldBootstrapNetworkStack } from "~~/src/shared/hooks/useShouldBootstrapNetworkStack";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { openSelectPrivateTokenModal } from "../../modalUtils";
import { refreshPrivateAddressBalances } from "~~/src/shared/utils/tokens";
import { useBroadcasterMethodStatus } from "~~/src/shared/hooks/useBroadcasterMethodStatus";

interface PrivateModeSettingsPanelProps {
  closeThisModal: () => void;
  switchToPrivateModeMethodPanel: () => void;
  switchToPrivateModeAmountsPanel: () => void;
}

/** Private Action Mode (Unshields, Private Transfers) */
export const PrivateModeSettingsPanel: React.FC<PrivateModeSettingsPanelProps> = ({
  closeThisModal,
  switchToPrivateModeMethodPanel,
  switchToPrivateModeAmountsPanel
}) => {

  const activeNetwork  = useSettingsStore.getState().activeNetwork;
    
  const { isUsingSelfSignMethod, isUsingDefaultBroadcasterMethod } = useBroadcasterMethodStatus();
  const broadcasterFeeToken = useBroadcasterStore.getState().broadcasterFeeToken;

  const isDisplayingCommonPrivateModeAmounts = useWalletModeScreenStore((store) => store.isDisplayingCommonPrivateModeAmounts);

  const shouldBootstrapNetworkStack = useShouldBootstrapNetworkStack();

  const handleDisplaySelectPrivateModeToken = () => {
    closeThisModal();
    openSelectPrivateTokenModal("tokenToPayTheFeeWith");
    refreshPrivateAddressBalances(shouldBootstrapNetworkStack, activeNetwork);
  };

  // Ui
  const privateModeAmountsMethod = isDisplayingCommonPrivateModeAmounts === false ? "Default (Custom Amounts)" : "Pre-Set Amounts";
  const privateModeMethod = isUsingSelfSignMethod ? "Self-Sign" : isUsingDefaultBroadcasterMethod ? "Broadcaster (Default)" : "Broadcaster (Picked by you)";

  return (
    <>   
      <ModalInfoCard
        title="Method"
        body={`Selected: ${privateModeMethod}`}
        icon={
          <ChevronRightIcon
            className="ml-1 h-6 w-4 cursor-pointer text-xl font-normal"
            aria-hidden="true"
            strokeWidth={1.8}
          />
        }
        onClick={switchToPrivateModeMethodPanel}
      />

      <ModalInfoCard
        title="Fee Paying Token"
        body={`Selected: ${broadcasterFeeToken.symbol} (Default)`}
        icon={
          <ChevronRightIcon
            className="ml-1 h-6 w-4 cursor-pointer text-xl font-normal"
            aria-hidden="true"
            strokeWidth={1.8}
          />
        }
        onClick={handleDisplaySelectPrivateModeToken}
      />

      <ModalInfoCard
        title="Amount Input Box"
        body={privateModeAmountsMethod}
        icon={
          <ChevronRightIcon
            className="h-6 w-4 text-xl"
            aria-hidden="true"
            strokeWidth={1.8}
          />
        }
        onClick={switchToPrivateModeAmountsPanel}
      />
    </>
  );
};
