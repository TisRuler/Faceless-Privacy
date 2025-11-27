import { ArrowPathIcon} from "@heroicons/react/24/outline";
import { openManageProvidersModal } from "~~/src/layouts/Modals/modalUtils";

interface RefreshButtonProps {
  shouldBootstrapNetworkStack: boolean;
  refreshTrigger: number;
  setRefreshTrigger: Function;
  isLoading: boolean;
}

export const RefreshButton: React.FC<RefreshButtonProps> = ({
  shouldBootstrapNetworkStack,
  refreshTrigger,
  setRefreshTrigger,
  isLoading,
}) => {

  const handleRefresh = () => {
    if (shouldBootstrapNetworkStack) {
      openManageProvidersModal();
      return;
    }

    setRefreshTrigger(refreshTrigger + 1);
  };

  return (
    <button
      onClick={handleRefresh}
      className={"ml-4 cursor-pointer rounded-lg border border-main-base bg-primary-button-gradient px-2 py-[0.3em]"}
      disabled={isLoading}
    >
      <ArrowPathIcon className={`h-5 w-4 text-main-base sm:h-6 sm:w-5 ${isLoading ? "animate-spin" : ""}`} />
    </button>
  );
};
