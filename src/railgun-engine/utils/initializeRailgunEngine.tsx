import { startRailgunEngine } from "@railgun-community/wallet";
import LevelDB from "level-js";
import { createArtifactStore } from "./createArtifactStore";
import { masterConfig } from "~~/src/config/masterConfig";

export const initializeRailgunEngine = async () => {
  const walletSource = "Faceless";

  const db = new LevelDB("./engineDatabase");

  const shouldDebug = false;

  await startRailgunEngine(
    walletSource,
    db,
    shouldDebug,
    createArtifactStore,
    false, // useNativeArtifacts
    false, // skipMerkletreeScans
    [masterConfig.PoiNodeUrl],
    undefined, // customPOIList
    true // verboseScanLogging
  );
};