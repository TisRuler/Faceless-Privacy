import { sendPublicBaseTokenLogic } from "../../coreLogic/public/sendPublicBaseTokenLogic";
import { executePublicModeTxWithUI } from "../helpers/executePublicModeTxWithUI";
import { FallbackProvider, JsonRpcProvider } from "ethers";

type SendPublicBaseTokenProps = {
    provider: JsonRpcProvider | FallbackProvider;
    amount: string;
    receiver: string;
    gasChoiceDefault: boolean;
    customGweiAmount: number;
    setPublicModeButtonText: React.Dispatch<React.SetStateAction<string>>;
};

/* Logic + Ui */
export async function sendPublicBaseToken({
  provider,
  amount,
  receiver,
  gasChoiceDefault,
  customGweiAmount,
  setPublicModeButtonText,
}: SendPublicBaseTokenProps) {

  executePublicModeTxWithUI({
    provider,
    setPublicModeButtonText,
    sendLogic: () => sendPublicBaseTokenLogic({
      amount,
      receiver,
      gasChoiceDefault,
      customGweiAmount,
      provider,
    })
  });

};