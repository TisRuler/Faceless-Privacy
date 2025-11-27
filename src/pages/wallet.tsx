import Head from "next/head";
import type { NextPage } from "next";
import { WalletModeScreen } from "~~/src/screens/wallet-mode/WalletModeScreen";

const WalletMode: NextPage = () => {
  return (
    <>
      <Head>
        <title>Wallet</title>
        <meta name="description" content="Send/Receive crypto" />
      </Head>
      <WalletModeScreen />
    </>
  );
};

export default WalletMode;
