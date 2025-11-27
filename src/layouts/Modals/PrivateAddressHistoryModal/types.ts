export interface PrivateTxHistoryData {
    txType: string;
    howLongAgo: {readableDateTime: string, relativeTimeText: string, elapsedMs: number};
    tokenSymbol: string;
    tokenName: string;
    tokenAddress: string;
    tokenAmount: string;
    txTo: string | undefined;
    txFrom: string | undefined;
    txId: string;
    unshieldFee: string | undefined;
    hasValidPoi: boolean | undefined;
  }