
import { TXIDVersion, NetworkName } from "@railgun-community/shared-models";
import { shieldBaseTokenLogic } from "../../coreLogic/public/shieldBaseTokenLogic";
import { FallbackProvider, JsonRpcProvider } from "ethers";
import { executePublicModeTxWithUI } from "../helpers/executePublicModeTxWithUI";

type ShieldTokenUIProps = {
  provider: JsonRpcProvider | FallbackProvider;
  networkName: NetworkName;
  txIDVersion: TXIDVersion;
  amount: string;
  recipientAddress: string;
  gasChoiceDefault: boolean;
  customGweiAmount: number;
  setPublicModeButtonText: React.Dispatch<React.SetStateAction<string>>;
};

/*  Logic + Ui */
export async function shieldBaseToken({
  provider,
  networkName,
  txIDVersion,
  amount,
  recipientAddress,
  gasChoiceDefault,
  customGweiAmount,
  setPublicModeButtonText,
}: ShieldTokenUIProps) {

  executePublicModeTxWithUI({
    provider,
    setPublicModeButtonText,
    sendLogic: () => shieldBaseTokenLogic({
      provider,
      network: networkName,
      txIDVersion,
      amount,
      recipientAddress,
      gasChoiceDefault,
      customGweiAmount,
    })
  });

};