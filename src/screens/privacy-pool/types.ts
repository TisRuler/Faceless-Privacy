export interface DecodedUnshieldEvent {
  args: {
    amount: bigint;
    fee: bigint;
    to: string;
    token: {
      tokenAddress: string;
      tokenSubID: bigint;
      tokenType: bigint;
    };
  };
}
  
export interface PoolTransaction {
  value: string;
  time: string;
};

export interface TokenInPoolLink {
  name: string, 
  url: string
}

export type PoolTransactionData = {
  tokenInPoolLink: TokenInPoolLink;
  column1TransactionData: PoolTransaction[];
  column2TransactionData: PoolTransaction[];
};

export interface PoolTokenData {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  anonymityPoolTokenBalance: number;
  logoUri?: string;
}

export interface PoolTokenDetails extends PoolTransactionData, PoolTokenData {}