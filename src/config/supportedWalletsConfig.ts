export interface SupportedWallet {
  name: string;
  ids: string[];
  website: string;
  scheme?: string;
}

export const supportedWalletsConfig: readonly SupportedWallet[] = [
  { 
    name: "MetaMask", 
    ids: ["io.metamask", "io.metamask.mobile"], 
    website: "https://metamask.io/", 
    scheme: "https://link.metamask.io/dapp/facelessprivacy.eth.limo/wallet",
  },
  { 
    name: "Rabby Wallet", 
    ids: ["io.rabby", "com.debank.rabbymobile"], 
    website: "https://rabby.io/", 
    scheme: "rabby://",
  },
  { 
    name: "Brave Wallet", 
    ids: ["com.brave.wallet"], 
    website: "https://brave.com/wallet/", 
  },
  { 
    name: "Rainbow", 
    ids: ["me.rainbow"], 
    website: "https://rainbow.me/", 
    scheme: "rainbow://",
  },
  { 
    name: "Coinbase Wallet", 
    ids: ["com.coinbase.wallet"], 
    website: "https://www.coinbase.com/", 
  },
  { 
    name: "OKX Wallet", 
    ids: ["com.okex.wallet"], 
    website: "https://web3.okx.com/", 
  },
  { 
    name: "Zerion", 
    ids: ["io.zerion.wallet"], 
    website: "https://zerion.io/", 
    scheme: "zerion://"
  },
];