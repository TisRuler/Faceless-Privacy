import { useState } from "react";
import { ModalActionButton } from "../../../components";
import { useSettingsStore } from "~~/src/state-managers";
import { shutdownWeb3ConnectionStack, loadFreshProviders } from "../utils";
import { areRpcsValid } from "../../../utils/areRpcsValid";
import { ChainData } from "~~/src/config/chains/types";
import { SETTINGS_NOTIFICATIONS } from "~~/src/constants/notifications";
import toast from "react-hot-toast";

export interface InputCustomRpcPanelProps {
  switchToUpdateProviderPanel: () => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  configuredNetwork: ChainData;
}

export const InputCustomRpcPanel: React.FC<InputCustomRpcPanelProps> = ({
  switchToUpdateProviderPanel,
  isLoading,
  setIsLoading,
  configuredNetwork,
}) => {

  const { customRpcs, addCustomRpc } = useSettingsStore();

  const [rpc1, setRpc1] = useState("");
  const [rpc2, setRpc2] = useState(""); // Only used when there is no custom RPC's existing

  const networkId = configuredNetwork.id;
  const existingRpcs = customRpcs[networkId] || [];

  const isRpc1Duplicate = existingRpcs.includes(rpc1);

  const isDualMode = existingRpcs.length < 1;
  const isEmpty = !rpc1 || (isDualMode && !rpc2);
  const disableSubmit = isLoading || isEmpty || isRpc1Duplicate;

  // Used after RPC validation
  const switchRpcs = async () => {
    try {
      await loadFreshProviders(
        configuredNetwork.id,
        configuredNetwork.railgunNetworkName,
        true,
        true,
      );
      toast.success(SETTINGS_NOTIFICATIONS.PROVIDER_UPDATED);
    } catch (error) {
      console.error(error);
      shutdownWeb3ConnectionStack();
      toast.error(SETTINGS_NOTIFICATIONS.PROVIDER_TURNED_OFF);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (isLoading) return;
    setIsLoading(true);
    shutdownWeb3ConnectionStack();
    
    const rpcListToCheck = isDualMode ? [rpc1, rpc2] : [rpc1];
    const valid = await areRpcsValid(rpcListToCheck, networkId);

    if (!valid) {
      setIsLoading(false);
      return;
    }

    if (isDualMode) {
      addCustomRpc(networkId, rpc1);
      addCustomRpc(networkId, rpc2);
    } else {
      addCustomRpc(networkId, rpc1);
    }

    switchToUpdateProviderPanel();
    await switchRpcs();
  };

  const renderInput = (
    value: string,
    onChange: (value: string) => void,
    placeholder: string,
    isLast?: boolean
  ) => (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      type="text"
      className={`text-md w-full rounded-lg border border-modal-accent-100 bg-modal-accent-500 px-3 py-2 font-im placeholder-modal-200
        ${isDualMode
      ? isLast
        ? "mb-4 mt-2"
        : "mb-1"
      : "mb-3 mt-2"
    }`}
      placeholder={placeholder}
    />
  );

  return (
    <>
      {renderInput(rpc1, setRpc1, isDualMode ? "Enter RPC URL 1..." : "Enter Provider URL...")}
      {isDualMode && renderInput(rpc2, setRpc2, "Enter RPC URL 2...", true)}
      <ModalActionButton 
        onClick={handleSubmit} 
        isDisabled={disableSubmit} 
        name={isRpc1Duplicate && rpc1 ? "Added" : "Submit"}
      />
    </>
  );
  
};