
import {
  loadProvider,
  getProver,
  SnarkJSGroth16
} from "@railgun-community/wallet";
import { getEngineProviders } from "./utils/getEngineProviders";
import { initializeRailgunEngine } from "./utils/initializeRailgunEngine";
import { setupEngineListeners } from "./utils/setupEngineListeners";
import { RAILGUN_ENGINE_NOTIFICATIONS } from "~~/src/constants/notifications";
import { useSettingsStore } from "../state-managers";
import { SupportedChainId } from "../shared/types";
import { NetworkName } from "@railgun-community/shared-models";
import { logError } from "~~/src/shared/utils/other/logError";
import toast from "react-hot-toast";

export const startEngine = async (chainId: SupportedChainId, railgunNetworkName: NetworkName) => {

  const setHasRailgunEngineStarted = useSettingsStore.getState().setHasRailgunEngineStarted;

  try {
    await initializeRailgunEngine();

    // Load snarkjs groth16 from the global object
    const { snarkjs: { groth16 } } = global as unknown as { snarkjs: { groth16: SnarkJSGroth16 } };
    getProver().setSnarkJSGroth16(groth16);

    // Load and configure engine providers
    const engineProviders = await getEngineProviders(chainId);
    await loadProvider(engineProviders, railgunNetworkName);

    setupEngineListeners();
    setHasRailgunEngineStarted(true);
  } catch (error) {
    toast.error(RAILGUN_ENGINE_NOTIFICATIONS.INITILIALIZATION_ERROR);
    setHasRailgunEngineStarted(false);
    logError(error);
  }
};