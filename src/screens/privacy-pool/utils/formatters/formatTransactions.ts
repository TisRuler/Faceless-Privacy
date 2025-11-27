import { formatUnits, PublicClient } from "viem";
import { formatAnonymitySetTokenQuantity } from "./formatAnonymitySetTokenQuantity";
import { formatTimeSince } from "./formatTimeSince";
import { withRetry } from "~~/src/shared/utils/tokens";
import { sleep } from "~~/src/shared/utils/other/sleep";

export const formatTransactions = async (
  events: any[], 
  tokenDecimals: number, 
  isShield: boolean, // false = unshield
  publicClient: PublicClient,
) => {

  return Promise.all(
    events.map(async (event) => {

      await sleep(2000);
      
      const { timestamp: unformattedTimeStamp } = await withRetry(() => publicClient.getBlock({
        blockNumber: event.blockNumber,
        includeTransactions: false,
      }), "publicClient.getBlock");

      const timeSinceTx = formatTimeSince(unformattedTimeStamp);
      const rawTokenValue = isShield ? event.args.value.toString() : event.args.amount.toString();
      const formattedTokenValue = formatUnits(rawTokenValue, tokenDecimals);
      const finalFormattedValue = formatAnonymitySetTokenQuantity(formattedTokenValue);

      return {
        value: finalFormattedValue,
        time: timeSinceTx,
      };

    })
  );
};