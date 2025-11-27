import React from "react";
import { PoolTransaction } from "../../../../../types";

interface TokenColumnDisplayerProps {
  transactions: PoolTransaction[];
}

export const TokenColumnDisplayer: React.FC<TokenColumnDisplayerProps> = ({ transactions }) => {
  return (
    <div className="w-full sm:w-[230px]">
      <div>
        {[...transactions].map((transaction, index) => (
          <div key={index} className="token-item text-md w-400 flex items-center font-im">
            <div className="w-auto">
              <p className="text-left">{transaction.time}</p>
            </div>
            <div className="flex-grow">
              <p className="text-center">-</p>
            </div>
            <div style={{ width: "100px" }} className="whitespace-nowrap">
              <h3>{transaction.value} Tokens</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};