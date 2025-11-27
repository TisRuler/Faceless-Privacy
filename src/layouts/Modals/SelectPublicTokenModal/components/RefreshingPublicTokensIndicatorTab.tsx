export const RefreshingPublicTokensIndicatorTab = ({
  isLoading,
  length,
}: {
  isLoading: boolean;
  length: number;
}) => {
  const shouldShow = isLoading && length > 0;
  if (!shouldShow) return null;

  return (
    <div className="flex w-full">
      <span className="mb-2 mt-[-0.25em] rounded-md bg-modal-accent-200 p-2 font-im text-sm">
        Refreshing...
      </span>
    </div>
  );
};
