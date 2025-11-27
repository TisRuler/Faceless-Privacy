export const ModalPrivateScanProgress = ({
  privateAddressBalanceScanPercentage,
  txidMerkletreeScanPercentage,
}: {
  privateAddressBalanceScanPercentage: string;
  txidMerkletreeScanPercentage: string;
}) => {

  const isBalancesRefreshing = Number.parseFloat(privateAddressBalanceScanPercentage) > 0;
  const isMerkleTreeRefreshing = Number.parseFloat(txidMerkletreeScanPercentage) > 0;

  return (
    <div className="mb-2 mt-[-0.5em] flex w-full gap-3">

      {/* Private-address card */}
      {isBalancesRefreshing &&
        <div className="rounded-md bg-modal-accent-200 p-2 font-im text-sm">
          {privateAddressBalanceScanPercentage} Refreshed
        </div>
      }

      {/* Merkle-tree card */}
      {isMerkleTreeRefreshing && 
        <div className="rounded-md bg-modal-accent-200 p-2 font-im text-sm">
          {txidMerkletreeScanPercentage} Merkle Tree Synced
        </div>
      }
    </div>
  );
};