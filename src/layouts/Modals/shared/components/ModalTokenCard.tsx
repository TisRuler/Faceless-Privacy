import { RailgunWalletBalanceBucket } from "@railgun-community/shared-models";
import { UserToken } from "~~/src/shared/types";
import { formatDisplayNumber } from "~~/src/shared/utils/tokens/formatDisplayBalance";
import Image from "next/image";

const NON_SPENDABLE_BUCKETS = "nonSpendable";

type TokenType = RailgunWalletBalanceBucket.Spendable | RailgunWalletBalanceBucket.ShieldPending | typeof NON_SPENDABLE_BUCKETS;

interface ModalTokenCardProps {
  token: UserToken;
  type: TokenType;
  showOnlyNonSpendable?: boolean; // Control visibility of private Spendable tokens
  isTokenSelectable: boolean;
  onClick?: () => void;
}

function numberWithCommas(num: string): string {
  const parsed = parseFloat(num);
  if (isNaN(parsed)) return "Not Calculated";
  return parsed.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const ModalTokenCard: React.FC<ModalTokenCardProps> = ({ token, type, showOnlyNonSpendable, isTokenSelectable, onClick }) => {
  const isVisible = showOnlyNonSpendable ? type === NON_SPENDABLE_BUCKETS : type !== NON_SPENDABLE_BUCKETS;
  
  if (!isVisible) return null;

  const isBalanceCalculated = token.balance !== undefined;
  const isTotalValueCalculated = token.totalValueInUsd !== undefined && token.totalValueInUsd !== "0";

  const totalValueToDisplay = isTotalValueCalculated && token.totalValueInUsd != null
    ? `$${numberWithCommas(token.totalValueInUsd)}`
    : isBalanceCalculated
      ? "Value not calculated"
      : "";

  const balanceToDisplay = isBalanceCalculated ? formatDisplayNumber(token.balance!) : "Not Calculated";

  return (
    <div
      className={`mb-3 mt-3 grid grid-cols-2 rounded-md bg-modal-accent-200 px-3.5 py-3 hover:bg-modal-accent-400
      ${isTokenSelectable ? "cursor-pointer" : "cursor-not-allowed"}`}
      onClick={onClick}
    >

      <div className="flex items-center">
        {token.logoURI ? (
          <Image
            unoptimized
            loader={() => token.logoURI!}
            src={token.logoURI}
            alt="tokenlogo"
            width={34}
            height={34}
            className="border-accent-200 rounded-full border"
          />
        ) : (
          <div className="border-accent-200 flex h-[33px] min-w-[33px] items-center rounded-full border bg-modal-token-icon">
            <p
              className="custom-letter-spacing font-im text-white"
              style={{ width: "100%", textAlign: "center" }}
            >
              {token.name.slice(0, 1)}
            </p>
          </div>
        )}
        
        <div className="ml-4 whitespace-nowrap font-isb">
          <p className={"text-sm sm:text-base"}>
            {type === RailgunWalletBalanceBucket.ShieldPending
              ? "Pending Funds (Incoming)"
              : type === NON_SPENDABLE_BUCKETS
                ? `${token.category} •`
                : token.symbol}
          </p>
          <p className="font-im text-sm text-modal-100">
            {token.name}
          </p>
        </div>
      </div>

      <div className="flex justify-end font-isb">
        <div>
          <p className="text-right text-sm sm:text-base">{totalValueToDisplay}</p>
          <p className="text-right font-im text-sm text-modal-100">{balanceToDisplay}</p>
        </div>
      </div>
    </div>
  );
};