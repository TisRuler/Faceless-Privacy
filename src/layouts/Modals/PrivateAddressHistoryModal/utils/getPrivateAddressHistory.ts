import { formatTokenAmountFromHex } from "./formatTokenAmountFromHex";
import { howLongSince } from "~~/src/layouts/Modals/PrivateAddressHistoryModal/utils/howLongSince";
import { getWalletTransactionHistory as getRawHistory } from "@railgun-community/wallet";
import { TransactionHistoryItem, TransactionHistoryItemCategory } from "@railgun-community/shared-models";
import { JsonRpcProvider, FallbackProvider } from "ethers";
import { GENERAL_NOTIFICATIONS } from "~~/src/constants/notifications";
import { PrivateTxHistoryData } from "../types";
import { getOrFetchTokenMetaData, formatWei } from "~~/src/shared/utils/tokens";
import { ChainData } from "~~/src/config/chains/types";
import { SupportedChainId } from "~~/src/shared/types";
import { getTransactionWithResilientFallback } from "./getTransactionWithResilientFallback";
import { logError } from "~~/src/shared/utils/other/logError";
import toast from "react-hot-toast";

const ADDRESS_PRIVATE = "Private Address";
const CACHE_TTL_MS = 20 * 60 * 1000; // 20 minutes

// Two-level cache: chainId -> Map<txid, { data, timestamp }>
const txCache = new Map<SupportedChainId, Map<string, { data: PrivateTxHistoryData; timestamp: number }>>();

function getChainCache(networkId: SupportedChainId): Map<string, { data: PrivateTxHistoryData; timestamp: number }> {
  if (!txCache.has(networkId)) {
    txCache.set(networkId, new Map());
  }
  return txCache.get(networkId)!;
}

let callCount = 0;
const handleGetShieldFromAddress = async (
  txid: string,
  provider: JsonRpcProvider | FallbackProvider,
): Promise<string> => {
  callCount++;
  if (callCount % 25 === 0) {
    await new Promise((resolve) => setTimeout(resolve, 10000));
  }

  const tx = await getTransactionWithResilientFallback(txid, provider);
  if (!tx) throw Error(GENERAL_NOTIFICATIONS.CHECK_PROVIDER);

  return tx.from;
};

const enrichPrivateHistoryData = async (
  txHistory: TransactionHistoryItem[],
  network: ChainData,
  provider: JsonRpcProvider | FallbackProvider,
): Promise<PrivateTxHistoryData[]> => {
  const chainCache = getChainCache(network.id);

  const promises = txHistory.map(async (tx) => {
    const cached = chainCache.get(tx.txid);
    const now = Date.now();

    if (cached && now - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }

    try {
      let amountInfo;
      let tokenAddress: string;
      let tokenAmount: string;
      let tokenMetaData: { symbol: string; name: string };
      let txTo: string;
      let txFrom: string | undefined;
      let txType: string;
      let unshieldFee: string | undefined;
      let hasValidPoi: boolean | undefined;

      switch (tx.category) {
      case TransactionHistoryItemCategory.UnshieldERC20s: {
        amountInfo = tx.unshieldERC20Amounts[0];
        const rawFee = BigInt(amountInfo.unshieldFee!);
        unshieldFee = formatWei(rawFee, "eth", 12);
        tokenAddress = amountInfo.tokenAddress;
        [tokenMetaData, tokenAmount] = await Promise.all([
          getOrFetchTokenMetaData(network, tokenAddress),
          formatTokenAmountFromHex(amountInfo.amount.toString(), tokenAddress, network.id),
        ]);
        txFrom = ADDRESS_PRIVATE;
        txTo = amountInfo.recipientAddress!;
        txType = tx.category;
        hasValidPoi = amountInfo.hasValidPOIForActiveLists;
        break;
      }
      case TransactionHistoryItemCategory.ShieldERC20s: {
        amountInfo = tx.receiveERC20Amounts[0];
        const rawFee = BigInt(amountInfo.shieldFee!);
        unshieldFee = formatWei(rawFee, "eth", 12);
        tokenAddress = amountInfo.tokenAddress;
        [tokenMetaData, tokenAmount, txFrom] = await Promise.all([
          getOrFetchTokenMetaData(network, tokenAddress),
          formatTokenAmountFromHex(amountInfo.amount.toString(), tokenAddress, network.id),
          handleGetShieldFromAddress(tx.txid, provider),
        ]);
        txTo = ADDRESS_PRIVATE;
        txType = tx.category;
        break;
      }
      case TransactionHistoryItemCategory.TransferReceiveERC20s: {
        amountInfo = tx.receiveERC20Amounts[0];
        tokenAddress = amountInfo.tokenAddress;
        [tokenMetaData, tokenAmount] = await Promise.all([
          getOrFetchTokenMetaData(network, tokenAddress),
          formatTokenAmountFromHex(amountInfo.amount.toString(), tokenAddress, network.id),
        ]);
        txFrom = tx.transferERC20Amounts[0]?.recipientAddress;
        txTo = ADDRESS_PRIVATE;
        txType = tx.category;
        break;
      }
      case TransactionHistoryItemCategory.TransferSendERC20s: {
        amountInfo = tx.transferERC20Amounts[0];
        tokenAddress = amountInfo.tokenAddress;
        [tokenMetaData, tokenAmount] = await Promise.all([
          getOrFetchTokenMetaData(network, tokenAddress),
          formatTokenAmountFromHex(amountInfo.amount.toString(), tokenAddress, network.id),
        ]);
        txFrom = ADDRESS_PRIVATE;
        txTo = amountInfo.recipientAddress!;
        txType = tx.category;
        break;
      }
      default: {
        throw new Error("Unknown tx category"); // Don't cache unknowns
      }
      }

      hasValidPoi = amountInfo?.hasValidPOIForActiveLists;
      const howLongAgo = await howLongSince(tx, provider);

      const data: PrivateTxHistoryData = {
        txType,
        howLongAgo,
        tokenSymbol: tokenMetaData.symbol,
        tokenName: tokenMetaData.name,
        tokenAddress,
        tokenAmount,
        txTo,
        txFrom,
        txId: tx.txid,
        unshieldFee,
        hasValidPoi,
      };

      if (hasValidPoi) chainCache.set(tx.txid, { data, timestamp: now });

      return data;
    } catch {
      return {
        txType: TransactionHistoryItemCategory.Unknown,
        howLongAgo: {
          readableDateTime: "",
          relativeTimeText: "",
          elapsedMs: Infinity,
        },
        tokenSymbol: "",
        tokenName: "",
        tokenAddress: "",
        tokenAmount: "",
        txTo: "",
        txFrom: "",
        txId: tx.txid,
        unshieldFee: undefined,
        hasValidPoi: undefined,
      };
    }
  });

  const resolved = await Promise.all(promises);
  return resolved.reverse();
};

export const getPrivateAddressHistory = async (
  network: ChainData,
  startingBlock: number,
  provider: JsonRpcProvider | FallbackProvider,
  railgunWalletId: string,
) => {
  try {
    const transactionHistory = await getRawHistory(network.railgunChain, railgunWalletId, startingBlock);

    return await enrichPrivateHistoryData(transactionHistory, network, provider);
  } catch (error) {
    toast.error(GENERAL_NOTIFICATIONS.BACKUP_ERROR);
    logError(error);
  }
};
