import { openRequestEncryptionKeyModal } from "../../layouts/Modals/modalUtils";
import { WALLET_MODE_NOTIFICATIONS } from "~~/src/constants/notifications";

export class EncryptionKeyBus {
  private resolveFn: ((key: string) => void) | null = null;
  private rejectFn: ((reason?: any) => void) | null = null;
  private promise: Promise<string> | null = null;
  private isWaiting = false;
  
  async wait(): Promise<string> {
    if (this.isWaiting) {
      throw new Error(WALLET_MODE_NOTIFICATIONS.ERROR_ENCRYPTION_BUS_ALREADY_WAITING);
    }
  
    this.isWaiting = true;
  
    this.promise = new Promise<string>((resolve, reject) => {
      this.resolveFn = (key: string) => {
        resolve(key);
        this.clear();
      };
      this.rejectFn = (reason?: any) => {
        reject(reason);
        this.clear();
      };
    });
  
    return this.promise;
  }
  
  publish(key: string) {
    if (!this.resolveFn) {
      throw new Error(WALLET_MODE_NOTIFICATIONS.ERROR_NO_ACTIVE_ENCRYPTION_BUS_LISTENERS);
    }
    this.resolveFn(key);
  }
  
  cancel(reason: unknown = WALLET_MODE_NOTIFICATIONS.ERROR_CANCELLED_ENCRYPTION_BUS) {
    if (!this.rejectFn) return;
  
    const message =
      reason instanceof Error
        ? reason.message
        : typeof reason === "string"
          ? reason
          : "Unknown encryption key bus cancellation reason";
  
    this.rejectFn(new Error(message));
  }
  
  private clear() {
    this.promise = null;
    this.resolveFn = null;
    this.rejectFn = null;
    this.isWaiting = false;
  }
}

export const encryptionKeyBus = new EncryptionKeyBus();

export async function requestEncryptionKey(): Promise<string> {
  openRequestEncryptionKeyModal();
  return encryptionKeyBus.wait();
}
  