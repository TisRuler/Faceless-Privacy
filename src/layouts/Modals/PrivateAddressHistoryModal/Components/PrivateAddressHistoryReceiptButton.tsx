import React from "react";
import { Provider, FallbackProvider } from "ethers";
import toast from "react-hot-toast";
import { handleCopyToClipboard } from "~~/src/layouts/Modals/shared/utils/handleCopyToClipboard";
import { GENERAL_NOTIFICATIONS } from "~~/src/constants/notifications";
import { ChainData } from "~~/src/config/chains/types";
import { TransactionHistoryItemCategory } from "@railgun-community/shared-models";
import { isAddress } from "ethers";
import { PrivateTxHistoryData } from "../types";
import { logError } from "~~/src/shared/utils/other/logError";

const COUNTERPARTY_PRIVATE_ADDRESS_TEXT = "Hidden 0zk Address";
const YOUR_PRIVATE_ADDRESS_TEXT = "Your Private Address";
const RELAY_ADAPT_CONTRACT_TEXT = "Relay Adapt Contract";
const SEPARATOR = "------------------------------------------------------------";

interface PrivateAddressHistoryReceiptButtonProps {
  network: ChainData
  tokenData: PrivateTxHistoryData[];
  startingBlock: number;
  provider: Provider | FallbackProvider;
  yourPrivateAddress: string;
}

export const PrivateAddressHistoryReceiptButton: React.FC<PrivateAddressHistoryReceiptButtonProps> = ({
  network,
  tokenData,
  startingBlock,
  provider,
  yourPrivateAddress,
}) => {

  const getHistoryReceipt = async () => {

    try {

      const todaysDate = new Date().toLocaleString(undefined, { timeZoneName: "short" });

      const block = await provider.getBlock(startingBlock);
      if (!block || !block.timestamp) throw new Error(`Block not found for number: ${startingBlock}`);
      const timestamp = new Date(block.timestamp * 1000).toLocaleDateString();

      const privateAddressDetails = `Receipt for your private address (${yourPrivateAddress})`;
      const dateRange = `All Tx's from ${timestamp} to ${todaysDate}`;

      let allTransactions = "";
      tokenData.forEach((tokenInfo: PrivateTxHistoryData, index: number) => {

        const {
          tokenName,
          tokenSymbol,
          tokenAddress,
          txFrom: rawTxFrom,
          txTo: rawTxTo,
          txId,
          txType,
          howLongAgo,
          unshieldFee,
          hasValidPoi
        } = tokenInfo;

        const isTxShield = txType === TransactionHistoryItemCategory.ShieldERC20s;
        const isTxTransferIn = txType === TransactionHistoryItemCategory.TransferReceiveERC20s;

        const isIncoming = isTxShield || isTxTransferIn;

        const counterpartyAddress = isIncoming ? rawTxFrom : rawTxTo;

        const isToAddressRelayAdaptContract = counterpartyAddress === network.relayAdaptContract;
        
        const txTo = isToAddressRelayAdaptContract ? `${RELAY_ADAPT_CONTRACT_TEXT} (${rawTxTo})` :
          isAddress(rawTxTo) ? rawTxTo : isIncoming
            ? YOUR_PRIVATE_ADDRESS_TEXT : COUNTERPARTY_PRIVATE_ADDRESS_TEXT;

        const txFrom = !isIncoming ? YOUR_PRIVATE_ADDRESS_TEXT : isAddress(rawTxFrom) ? rawTxFrom : COUNTERPARTY_PRIVATE_ADDRESS_TEXT;
        const readableDateTime = howLongAgo.readableDateTime;

        allTransactions += formatTxData({
          index,
          txType,
          dateText: readableDateTime,
          tokenName,
          tokenSymbol,
          tokenAddress,
          txFrom,
          txTo,
          txId,
          unshieldFee,
          hasValidPoi
        }) + "\n";
      });

      const transactionReceipt = `${SEPARATOR}
      ${dateRange}
      
      ${privateAddressDetails}
      ${SEPARATOR}
      
      ${allTransactions}${SEPARATOR}`;

      handleCopyToClipboard(transactionReceipt);
    } catch (error) {
      toast.error(GENERAL_NOTIFICATIONS.BACKUP_ERROR);
      logError(error);
    }
  };

  return (
    <>
      {tokenData.length > 0 && (
        <div
          onClick={getHistoryReceipt}
          className="mb-[-0.6em] cursor-pointer text-right"
        >
          <p className="font-isb">Copy receipt</p>
        </div>
      )}
    </>
  );
};

const formatTxData = ({
  index,
  txType,
  dateText,
  tokenName,
  tokenSymbol,
  tokenAddress,
  txFrom,
  txTo,
  txId,
  unshieldFee,
  hasValidPoi,
}: {
  index: number;
  txType: string;
  dateText: string;
  tokenName: string;
  tokenSymbol: string;
  tokenAddress: string;
  txFrom: string;
  txTo: string;
  txId: string;
  unshieldFee?: string;
  hasValidPoi?: boolean;
}) => {
  if (txType === TransactionHistoryItemCategory.Unknown) {
    return `${index + 1}.
    ${txType},
    Possibly a Provider issue - try a different one and try again or check out the Hash,
    Hash: ${txId}
    \n`;
  }

  const feeLine = unshieldFee ? `Fees: ${unshieldFee} ${tokenSymbol},\n` : "";

  return `${index + 1}.
  ${txType},
  Date: ${dateText},
  Token Name: ${tokenName},
  Token Address: ${tokenAddress},
  From: ${txFrom},
  To: ${txTo},
  ${feeLine}POI Status: ${hasValidPoi ? "Valid" : "Invalid"},
  Hash: ${txId}
  \n`;
};

