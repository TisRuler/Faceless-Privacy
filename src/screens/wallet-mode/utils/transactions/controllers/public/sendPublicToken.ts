import { sendPublicTokenLogic } from "../../coreLogic/public/sendPublicTokenLogic";
import { FallbackProvider, JsonRpcProvider } from "ethers";
import { executePublicModeTxWithUI } from "../helpers/executePublicModeTxWithUI";

type SendPublicTokenProps = {
    provider: JsonRpcProvider | FallbackProvider;
    tokenAddress: string;
    amount: string;
    receiver: string;
    gasChoiceDefault: boolean;
    customGweiAmount: number;
    setPublicModeButtonText: React.Dispatch<React.SetStateAction<string>>;
};

/* Logic + Ui */
export async function sendPublicToken({
  provider,
  tokenAddress,
  amount,
  receiver,
  gasChoiceDefault,
  customGweiAmount,
  setPublicModeButtonText,
}: SendPublicTokenProps) {

  executePublicModeTxWithUI({
    provider,
    setPublicModeButtonText,
    sendLogic: () => sendPublicTokenLogic({
      tokenAddress,
      amount,
      receiver,
      gasChoiceDefault,
      customGweiAmount,
      provider
    })
  });
      
};