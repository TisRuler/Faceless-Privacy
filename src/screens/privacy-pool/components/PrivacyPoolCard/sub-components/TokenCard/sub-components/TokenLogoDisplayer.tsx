import Image from "next/image";

interface TokenLogoDisplayerProps {
  token: {
    logoUri?: string;
    name: string;
  };
}

export const TokenLogoDisplayer: React.FC<TokenLogoDisplayerProps> = ({ token }) => {
  return token.logoUri ? (
    <Image
      unoptimized
      loader={() => token.logoUri!}
      src={token.logoUri}
      alt="tokenlogo"
      width={33}
      height={33}
    />
  ) : (
    <div className="white-text flex h-[33px] min-w-[33px] items-center justify-center rounded-full border-2 border-main-base">
      <p className="font-isb">{token.name.slice(0, 1)}</p>
    </div>
  );
};
