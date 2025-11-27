/* eslint-disable @next/next/no-sync-scripts */
import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <script src="snarkjs.min.js"></script>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
