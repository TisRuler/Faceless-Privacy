export const UpdatingHistoryIndicatorTab = ({
  historyData,
  isLoading,
}: {
  historyData: any;
  isLoading: boolean;
}) => {
  
  if (!isLoading || historyData.length === 0) return null;

  return (
    <div className="flex w-full">
      <h1 className="rounded-md bg-modal-accent-200 p-2 font-im text-sm">
        Updating...
      </h1>
    </div>
  );
};