import {
  TransactionHistoryItem,
} from "@railgun-community/shared-models";
import { Provider, FallbackProvider } from "ethers";
import { withRetry } from "~~/src/shared/utils/tokens";

export async function howLongSince(tx: TransactionHistoryItem, provider: Provider | FallbackProvider) {

  let timestamp;
  if (tx.timestamp) {
    timestamp = new Date(tx.timestamp * 1000);
  } else {
    if (tx.blockNumber == null) throw new Error("Missing blockNumber and timestamp in transaction");
    
    const blockNumber = tx.blockNumber;

    const block = await withRetry(() => provider.getBlock(blockNumber), `getBlock(${tx.blockNumber})`);

    if (!block) throw new Error(`Block not found for blockNumber: ${tx.blockNumber}`);

    timestamp = new Date(block.timestamp * 1000);
  }

  const now = Date.now();
  const elapsedMs = now - timestamp.getTime();

  const days = Math.floor(elapsedMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((elapsedMs / (1000 * 60 * 60)) % 24);

  let relativeTimeText = "";
  if (days === 1) {
    relativeTimeText = "1 day ago";
  } else if (days > 1) {
    relativeTimeText = `${days} days ago`;
  } else {
    relativeTimeText = `${hours} hours ago`;
  }

  const readableDateTime = timestamp.toLocaleString(undefined, {
    timeZoneName: "short",
  });

  return { readableDateTime, relativeTimeText, elapsedMs };
}
