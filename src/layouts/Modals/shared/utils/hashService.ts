import { pbkdf2 , getRandomBytes} from "@railgun-community/wallet";
import { Pbkdf2Response } from "@railgun-community/shared-models";
import { RailgunStorageKey } from "~~/src/shared/enums";
import { PRIVATE_ADDRESS_NOTIFICATIONS } from "~~/src/constants/notifications";
import { isRailgunWalletReconnectionTypeSignature } from "~~/src/shared/utils/wallet";

// Function to hash the password with pbkdf2
export const hashPasswordString = async ({
  secret,
  salt,
  iterations,
}: {
  secret: string;
  salt: string;
  iterations: number;
}): Promise<Pbkdf2Response> => {
  return pbkdf2(secret, salt, iterations);
};

export const setEncryptionKeyFromPassword = async (password: string): Promise<string> => {
  // Generate salt for encryption
  const salt = getRandomBytes(16); // 16-byte salt

  // Generate encryption key using pbkdf2 with different iteration counts
  const [encryptionKey, hashPasswordStored] = await Promise.all([
    hashPasswordString({ secret: password, salt, iterations: 100000 }), // Generate key for encryption
    hashPasswordString({ secret: password, salt, iterations: 1000000 }), // Store with more iterations for security
  ]);

  // Save the generated hash and salt to local storage for later use
  await Promise.all([
    localStorage.setItem(RailgunStorageKey.HashPasswordStored, hashPasswordStored.toString()), // Store hash with higher iterations
    localStorage.setItem(RailgunStorageKey.Salt, salt.toString()), // Store the salt used for hashing
  ]);

  // Return the encryption key generated
  return encryptionKey.toString();
};

// Function to get the encryption key from the password
export const getEncryptionKeyFromPassword = async (password: string): Promise<string> => {

  // Fetch the stored password hash and salt from local storage
  const [storedPasswordHash, storedSalt] = await Promise.all([
    localStorage.getItem(RailgunStorageKey.HashPasswordStored), // Retrieve the stored password hash
    localStorage.getItem(RailgunStorageKey.Salt), // Retrieve the salt used for hashing
  ]);

  if (!storedPasswordHash || !storedSalt) {
    throw new Error(PRIVATE_ADDRESS_NOTIFICATIONS.ERROR_ENCRYPTION_KEY_NOT_FOUND_IN_STORAGE);
  }

  // Generate the encryption key using the password and stored salt
  const [encryptionKey, hashPassword] = await Promise.all([
    hashPasswordString({ secret: password, salt: storedSalt, iterations: 100000 }), // Same iterations as when generated
    hashPasswordString({ secret: password, salt: storedSalt, iterations: 1000000 }), // Same iterations for stored value
  ]);

  // Verify if the password matches the stored hash
  if (storedPasswordHash !== hashPassword.toString()) {
    const isReconnectionTypeSignature = isRailgunWalletReconnectionTypeSignature();
    
    throw new Error(
      isReconnectionTypeSignature ? 
        PRIVATE_ADDRESS_NOTIFICATIONS.ERROR_WRONG_SIGNER : 
        PRIVATE_ADDRESS_NOTIFICATIONS.ERROR_WRONG_PASSWORD
    );
  }

  return encryptionKey.toString();
};

export const deleteStoredEncryptionData = (): void => {
  localStorage.removeItem(RailgunStorageKey.HashPasswordStored);
  localStorage.removeItem(RailgunStorageKey.Salt);
  localStorage.removeItem(RailgunStorageKey.WalletId);
};

