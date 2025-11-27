import React from "react";
import Head from "next/head";
import { masterConfig } from "../config/masterConfig";

type MetaHeaderProps = {
  title?: string;
  description?: string;
  image?: string;
  twitterCard?: string;
  children?: React.ReactNode;
};

// Images must have an absolute path to work properly on Twitter.
const baseUrl = masterConfig.baseUrl;

export const MetaHeader = ({
  title = "Faceless",
  description = "Private transactions on Ethereum, Arbitrum and Polygon.",
  image = "thumbnail.jpg",
  twitterCard = "summary_large_image",
  children,
}: MetaHeaderProps) => {
  const imageUrl = `${baseUrl}/${image}`;

  return (
    <Head>
      {title && (
        <>
          <title>{title}</title>
          <meta property="og:title" content={title} />
          <meta name="twitter:title" content={title} />
        </>
      )}
      {description && (
        <>
          <meta name="description" content={description} />
          <meta property="og:description" content={description} />
          <meta name="twitter:description" content={description} />
        </>
      )}
      {image && (
        <>
          <meta property="og:image" content={imageUrl} />
          <meta name="twitter:image" content={imageUrl} />
        </>
      )}
      {twitterCard && <meta name="twitter:card" content={twitterCard} />}
      <link rel="icon" type="image/png" sizes="32x32" href={`${baseUrl}/favicon.png`} />
      {children}
    </Head>
  );
};
