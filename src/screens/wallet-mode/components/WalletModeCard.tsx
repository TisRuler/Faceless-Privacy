import React from "react";
import { useEffect } from "react";
import { 
  useWalletModeScreenStore, 
  useSettingsStore, 
  usePrivateAddressStore, 
  useBroadcasterStore 
} from "~~/src/state-managers";
import { CardView } from "~~/src/shared/enums";
import { 
  PrivateModeActionButton, 
  PrivateModeAmountInput, 
  PrivateModeRecipientInput, 
  PrivateModeFeeDetails 
} from "../subComponents/Private";
import { PublicModeActionButton, PublicModeAmountInput, PublicModeRecipientInput } from "../subComponents/Public";
import { WalletModeTabs, WalletModeCardHeader } from "../subComponents/Other";
import { TXIDVersion } from "@railgun-community/shared-models";
import { ChainData } from "~~/src/config/chains/types";
import { useAccount } from "wagmi";
import { ScaledContainer } from "~~/src/shared/components/ScaledContainer";
import { PublicModeDestination } from "~~/src/shared/enums";
import toast from "react-hot-toast";
import cardBackground from "~~/src/assets/images/background/cardBackground.svg";

interface WalletModeCardProps {
  activeNetwork: ChainData;
  walletModeCardView: CardView;
}

export const WalletModeCard: React.FC<WalletModeCardProps> = ({
  activeNetwork,
  walletModeCardView,
}) => {

  const txIDVersion = TXIDVersion.V2_PoseidonMerkle;

  // Stores
  const setWalletModeCardView = useSettingsStore.getState().setWalletModeCardView;

  const yourPrivateAddress = usePrivateAddressStore((state) => state.yourPrivateAddress);

  // Broadcaster
  const sendMethod = useBroadcasterStore((state) => state.sendMethod);
  const broadcasterFeeToken = useBroadcasterStore((state) => state.broadcasterFeeToken);
  const customSelectedBroadcaster = useBroadcasterStore((state) => state.customSelectedBroadcaster);

  // useSettingsStore
  const gasChoiceDefault = useSettingsStore((state) => state.gasChoiceDefault);
  const customGweiAmount = useSettingsStore((state) => state.customGweiAmount);
    
  // useWalletModeScreenStore
  const tokenForPublicMode = useWalletModeScreenStore((state) => state.tokenForPublicMode);
  const recipientAddress = useWalletModeScreenStore((state) => state.recipientAddress);
  const amount = useWalletModeScreenStore((state) => state.amount);
  const publicModeDestination = useWalletModeScreenStore((state) => state.publicModeDestination);
  const isNonModalWalletActionRequired = useWalletModeScreenStore((state) => state.isNonModalWalletActionRequired);
  
  const tokenForPrivateMode = useWalletModeScreenStore((state) => state.tokenForPrivateMode);
  const privateModeDestination = useWalletModeScreenStore((state) => state.privateModeDestination);
  const isTransactionInProgress = useWalletModeScreenStore((state) => state.isTransactionInProgress);

  const feeDataToDisplay = useWalletModeScreenStore((state) => state.feeDataToDisplay);

  const { isConnected: isPublicWalletConnected, address: yourPublicAddress } = useAccount();

  const {
    setRecipientAddress,
    setAmount,
    setPublicModeDestination,
    setPrivateModeDestination,
    setFeeDataToDisplay,
  } = useWalletModeScreenStore.getState();
    
  useEffect(() => {
    const isRecipientConnectedPrivateAddress = 
      publicModeDestination === PublicModeDestination.ConnectedPrivateAddress &&
      walletModeCardView === CardView.Public;

    if (isRecipientConnectedPrivateAddress) {
      setRecipientAddress(yourPrivateAddress);
    } else {
      setRecipientAddress("");
    }

    setAmount("0");
    setFeeDataToDisplay(undefined);
        
  }, [walletModeCardView]);

  useEffect(() => {
    setFeeDataToDisplay(undefined);
  }, [
    yourPrivateAddress,
    sendMethod, 
    gasChoiceDefault, 
    customGweiAmount, 
    amount, 
    recipientAddress, 
    tokenForPrivateMode, 
    broadcasterFeeToken,
    privateModeDestination,
    customSelectedBroadcaster
  ]);

  return (
    <ScaledContainer designWidth={520}>

      <div className="relative mt-16 flex justify-center px-10">
        <div
          className="relative w-[36em] rounded-2xl drop-shadow-card"
          style={{
            backgroundImage: `url(${cardBackground.src})`,
            backgroundSize: "100% 200%",
            backgroundPosition: "center",
          }}
        >
          {/* ---- Overlay intercept ---- */}
          {isTransactionInProgress && (
            <div
              className="absolute inset-0 z-50 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                toast.error(isNonModalWalletActionRequired ? "Check Wallet Extension" : "Wait...");
              }}
            />
          )}

          <WalletModeTabs 
            walletModeCardView={walletModeCardView} 
            setWalletModeCardView={setWalletModeCardView} 
          />
          {/* main block */}
          <div className="border-blue w-full rounded-b-2xl border-[0.12em] sm:border">
            <div className="px-[5em] py-6">
              <WalletModeCardHeader 
                walletModeCardView={walletModeCardView} 
                yourPrivateAddress={yourPrivateAddress} 
                yourPublicAddress={yourPublicAddress}
              />
              <div className="mt-2">
                {walletModeCardView === CardView.Public ? (
                  <>   
                    <PublicModeAmountInput 
                      activeNetwork={activeNetwork}
                      yourPublicAddress={yourPublicAddress}
                      isPublicWalletConnected={isPublicWalletConnected}
                      targetTokenToSend={tokenForPublicMode}
                      setAmount={setAmount}
                    />
                    <PublicModeRecipientInput 
                      recipientAddress={recipientAddress}
                      destination={publicModeDestination}
                      privateAddress={yourPrivateAddress}
                      setPublicModeDestination={setPublicModeDestination}
                      setRecipientAddress={setRecipientAddress}
                    />
                    <PublicModeActionButton 
                      activeNetwork={activeNetwork}
                      txIDVersion={txIDVersion}
                      tokenToSend={tokenForPublicMode}
                      amount={amount}
                      recipientAddress={recipientAddress}
                      gasChoiceDefault={gasChoiceDefault}
                      customGweiAmount={customGweiAmount}
                      isTransactionInProgress={isTransactionInProgress}
                    />
                  </>
                ) : (
                  <>
                    <PrivateModeAmountInput 
                      activeNetwork={activeNetwork}
                      privateAddress={yourPrivateAddress}
                      targetTokenToSend={tokenForPrivateMode}
                      setAmount={setAmount}
                    />
                    <PrivateModeRecipientInput 
                      recipientAddress={recipientAddress}
                      destination={privateModeDestination}
                      setPrivateModeDestination={setPrivateModeDestination}
                      setRecipientAddress={setRecipientAddress}
                    />          
                    {feeDataToDisplay && 
                      <PrivateModeFeeDetails 
                        privateModeDestination={privateModeDestination}
                        feeDataToDisplay={feeDataToDisplay}
                      />  
                    }  
                    <PrivateModeActionButton 
                      activeNetwork={activeNetwork}
                      txIDVersion={txIDVersion}
                      tokenToSend={tokenForPrivateMode}
                      amount={amount}
                      recipientAddress={recipientAddress}
                      privateModeDestination={privateModeDestination}
                      yourPrivateAddress={yourPrivateAddress}
                      feeDataToDisplay={feeDataToDisplay}
                      isTransactionInProgress={isTransactionInProgress}
                      setFeeDataToDisplay={setFeeDataToDisplay}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

    </ScaledContainer>
  );
};
