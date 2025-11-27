import { refreshBalances, loadWalletByID } from "@railgun-community/wallet";
import { usePrivateAddressStore } from "~~/src/state-managers";
import { getActiveNetwork } from "~~/src/shared/utils/network";
import { NETWORK_CONFIG } from "@railgun-community/shared-models";
import { RailgunStorageKey, RailgunWalletConnectionType } from "~~/src/shared/enums";
import { isUserRejectionError } from "~~/src/shared/utils/other/isUserRejectionError";
import { getEncryptionKeyFromPassword } from "../hashService";
import { GENERAL_NOTIFICATIONS, PRIVATE_ADDRESS_NOTIFICATIONS } from "~~/src/constants/notifications";
import { throwErrorWithTitle } from "~~/src/shared/utils/other/throwErrorWithTitle";
import { createRailgunWallet } from "@railgun-community/wallet";
import { getCreationBlockMap } from "../../../CreatePrivateAddressWithPasswordModal/utils/getCreationBlockMap";
import { keccak256, getBytes } from "ethers";
import { entropyToMnemonic, validateMnemonic } from "bip39";
import { setEncryptionKeyFromPassword } from "../hashService";
import { masterConfig } from "~~/src/config/masterConfig";

/* Note: needs to be error handled externally, including wiping ref */
export const connectPrivateAddressWithSignature = async (signature: string, enforceRecoveryFlow?: boolean): Promise<void> => {

  if (enforceRecoveryFlow) {
    await newAndRecoveryUserFlow(signature);
    return;
  }

  try {
    await returningUserFlow(signature);
  } catch (error) {
    if (isUserRejectionError(error)) {
      throwErrorWithTitle(GENERAL_NOTIFICATIONS.USER_REJECTION, error);
    } else {
      await newAndRecoveryUserFlow(signature); // Backup method
    }
  }
};

// Flow 1/2 - Efficency benefits, loads wallet
const returningUserFlow = async (signature: string | null) => {

  if (!signature) throw new Error ("Signature should not be empty");
  
  let encryptionKey: string | null = await getEncryptionKeyFromPassword(signature);
  signature = null; // Wipe

  const railgunWalletId = localStorage.getItem(RailgunStorageKey.WalletId);
  if (!railgunWalletId) throw new Error(PRIVATE_ADDRESS_NOTIFICATIONS.ERROR_ID_NOT_FOUND_IN_STORAGE);

  const railgunWalletInfo = await loadWalletByID(encryptionKey, railgunWalletId, false);

  encryptionKey = null; // Wipe

  // Wallet successfully loaded

  updateApp(railgunWalletInfo.railgunAddress , railgunWalletId);
};

// Flow 2/2 - For when the user does'nt have a encryption key in local storage
const ENTROPY_LENGTH_12_WORDS = 16;
const ENTROPY_LENGTH_24_WORDS = 32;

export const newAndRecoveryUserFlow = async (signature: string | null) => {

  if (!signature) throw new Error ("Signature should not be empty");
  
  const is12Words = 12 === masterConfig.facelessMnemonicLength;
      
  let encryptionKey: string | null = await setEncryptionKeyFromPassword(signature);

  // Build the mnemonic
  let entropyFull: string | null = keccak256(getBytes(signature));
  signature = null; // Wipe
  let entropyBytes: Uint8Array = getBytes(entropyFull).slice(0, is12Words ? ENTROPY_LENGTH_12_WORDS : ENTROPY_LENGTH_24_WORDS); // keccak256 output is always 32 bytes, slicing ensures deterministic entropy length    
  let entropyBuffer: Buffer = Buffer.from(entropyBytes);
  let mnemonic: string | null = entropyToMnemonic(entropyBuffer);

  // Wipes
  entropyBytes.fill(0);
  entropyBuffer.fill(0);
  entropyFull = null;
  if (!validateMnemonic(mnemonic)) {
    throw new Error("Generated mnemonic is invalid");
  }

  // Generate wallet
  const creationBlockNumberMap = await getCreationBlockMap();
  const railgunWallet = await createRailgunWallet(encryptionKey, mnemonic, creationBlockNumberMap);

  // Wipes
  mnemonic = null;
  encryptionKey = null;

  try {
    localStorage.setItem(RailgunStorageKey.WalletId, railgunWallet.id);
    localStorage.setItem(RailgunStorageKey.HowWasRailgunWalletConnected, RailgunWalletConnectionType.Signature);
  } catch (err) {
    throw new Error("Failed to persist wallet info");
  }
  
  // Wallet generation complete

  updateApp(railgunWallet.railgunAddress, railgunWallet.id);
};

// Shared flow helper
const updateApp = async (railgunAddress: string, railgunWalletId: string) => {
  
  // - Update store
  usePrivateAddressStore.setState({
    yourPrivateAddress: railgunAddress,
    railgunWalletId: railgunWalletId,
  });

  // - Refresh balances
  const configuredNetwork = getActiveNetwork();
  const { chain } = NETWORK_CONFIG[configuredNetwork.railgunNetworkName];
  await refreshBalances(chain, railgunWalletId);

};
