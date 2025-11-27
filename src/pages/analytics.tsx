import Head from "next/head";
import type { NextPage } from "next";
import PrivacyPoolScreen from "~~/src/screens/privacy-pool/PrivacyPoolScreen";

const AnalyticsPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Analytics</title>
        <meta name="description" content="Overview of Recent inflow/Outflow transactions and the remaining privacy pool balance" />
      </Head>
      <PrivacyPoolScreen />
    </>
  );
};

export default AnalyticsPage;
