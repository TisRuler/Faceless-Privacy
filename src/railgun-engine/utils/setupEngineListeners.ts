import { setOnBalanceUpdateCallback, setOnUTXOMerkletreeScanCallback, setOnTXIDMerkletreeScanCallback, setLoggers } from "@railgun-community/wallet";
import { handlePrivateAddressBalancesUpdate } from "./handlePrivateAddressBalancesUpdate";
import { numberToPercentage } from "./numberToPercentage";
import { usePrivateAddressStore } from "~~/src/state-managers";

export function formatToNumber(number: number): string {
  // Multiply the number by 100 to convert it to a percentage
  const percentage = number * 100;
  // Format the percentage to have two decimal places
  const formattedPercentage = percentage.toFixed(0);
  // Add the percentage symbol at the end
  return formattedPercentage;
}

export const setupEngineListeners = () => {

  const setPrivateAddressBalanceScanPercentage = usePrivateAddressStore.getState().setPrivateAddressBalanceScanPercentage;
  const setTxidMerkletreeScanPercentage = usePrivateAddressStore.getState().setTxidMerkletreeScanPercentage;

  setOnUTXOMerkletreeScanCallback((event) => {
    const progressPercentage = numberToPercentage(event.progress);
    setPrivateAddressBalanceScanPercentage(progressPercentage);
  });

  setOnTXIDMerkletreeScanCallback((event) => {
    const progressPercentage = numberToPercentage(event.progress);
    setTxidMerkletreeScanPercentage(progressPercentage);
  });

  setOnBalanceUpdateCallback(async (balances) => {
    await handlePrivateAddressBalancesUpdate(balances);
  });

  setLoggers(console.log, console.log);
};