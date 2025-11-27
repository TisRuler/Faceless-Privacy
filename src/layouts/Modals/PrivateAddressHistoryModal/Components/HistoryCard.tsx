import React from "react";
import { CopyAddressToClipboard } from "../../shared/components";
import { ChainData } from "~~/src/config/chains/types";
import { TransactionHistoryItemCategory } from "@railgun-community/shared-models";
import { PrivateTxHistoryData } from "../types";
import { ModalFlashingLight } from "../../shared/components";

interface HistoryCardProps {
  tokenData: PrivateTxHistoryData;
  network: ChainData
}

const renderTxDetails = (tokenData: PrivateTxHistoryData, network: ChainData) => {

  const {
    txType,
    txFrom,
    txTo,
    tokenAddress,
    tokenAmount,
    tokenSymbol,
    howLongAgo,
    unshieldFee,
    hasValidPoi
  } = tokenData;

  const isTxShield = txType === TransactionHistoryItemCategory.ShieldERC20s;
  const isTxTransferIn = txType === TransactionHistoryItemCategory.TransferReceiveERC20s;
  
  const isIncoming = isTxShield || isTxTransferIn;

  const counterparty = isIncoming ? txFrom : txTo;
  const timeAgo = howLongAgo?.relativeTimeText || "Check Tx";
  const fullDate = howLongAgo?.readableDateTime || "Check Tx";

  return(
    <>
      <div className="relative">
        {/* TOP-RIGHT TIMEAGO */}
        <span className="absolute right-0 font-isb text-sm">
          {timeAgo}
        </span>

        {/* STATUS */}
        {!hasValidPoi && <div className="flex items-center font-isb text-sm">
          <ModalFlashingLight isActive={Boolean(hasValidPoi)} lightOffWhenInactive={false} />
          <p className="ml-2">
            Invalid Private Proof Of Innocence
          </p>
        </div>}

        {/* AMOUNT + TYPE */}
        <div className="flex items-center space-x-2 font-isb text-lg">
          <span>{Number(tokenAmount)}</span>
          <span>{tokenSymbol}</span>
          <span>{isIncoming ? "Received" : "Sent"}</span>
        </div>

        {/* DATE */}
        <p className="font-im text-xs">
          <span className="text-xs">Token:</span>{" "}
          <span className="break-all">{tokenAddress}</span>
        </p>

        {/* ADDRESS */}
        <CopyAddressToClipboard
          network={network}
          tag={isIncoming ? "From:" : "To:"}
          address={counterparty}
          colourClass="text-modal-100"
        />

        <p className="font-im text-sm">Date: {fullDate}</p>
        {unshieldFee && <p className="font-im text-sm">Tx Fee: {unshieldFee} {tokenSymbol}</p>}
      </div>
    </>
  );
};

const renderUnknownTxDetails = () => (
  <>
    <div className="font-isb text-lg">
      <h2>Problem Displaying Transaction</h2>
    </div>
    <p className="font-isb text-sm text-modal-100">
      Try using a different RPC or click the link below
    </p>
  </>
);

export const HistoryCard: React.FC<HistoryCardProps> = ({ tokenData, network }) => {
  const isValidData = tokenData.txType !== TransactionHistoryItemCategory.Unknown;
  const isUnknownData = tokenData.txType === TransactionHistoryItemCategory.Unknown;

  return (
    <div className="mb-2 mt-2 rounded-md bg-modal-accent-200 px-4 py-3 hover:bg-modal-accent-300">

      {isValidData &&
        renderTxDetails(tokenData, network)
      }

      {isUnknownData &&
        renderUnknownTxDetails()
      }

      {/* EXPLORER LINK */}
      <a
        className="mt-1 inline-block font-im text-sm underline"
        target="_blank"
        rel="noreferrer"
        href={`${network.blockExplorer.url}/tx/${tokenData.txId}`}
      >
        View on {network.blockExplorer.name}
      </a>

    </div>
  );
};
