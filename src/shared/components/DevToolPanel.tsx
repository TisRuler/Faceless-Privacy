import React from "react";
import { useAccount } from "wagmi";
import { useConnectorRolesStore } from "~~/src/state-managers";
import { WALLET_MODE_NOTIFICATIONS } from "~~/src/constants/notifications";
import { getDefaultBroadcasterForToken } from "../utils/broadcaster";
import { getActiveNetwork } from "../utils/network";
import { useBroadcasterStore } from "~~/src/state-managers";
import { WakuBroadcasterClient } from "@railgun-community/waku-broadcaster-client-web";
import toast from "react-hot-toast";

export const DevToolPanel = () => {
  const { chainId: walletsCurrentChainId, isConnected, address } = useAccount(); 
  const { publicConnectorId, selfSigningConnectorId } = useConnectorRolesStore();

  const defaultButtonStyle = "cursor-pointer text-center text-main-base font-im bg-primary-button-gradient border-t border-r border-b border-secondary font-isb text-lg text-main-base p-4 my-1";
  
  const test = async () => {
    const broadcaster = await getDefaultBroadcasterForToken();
    console.log(broadcaster.railgunAddress);
  };

  const findBroadcastersForToken = async () => {

    const DEFAULT_RAILGUN_ADDRESS = "";
    const { railgunChain, id: chainId } = getActiveNetwork();
    const { broadcasterFeeToken } = useBroadcasterStore.getState();

    const freshBroadcasters = await WakuBroadcasterClient.findBroadcastersForToken(
      railgunChain,
      broadcasterFeeToken.address,
      false
    );

    const getWakuCore = await WakuBroadcasterClient.getWakuCore();

    const getLightPushPeerCount = await WakuBroadcasterClient.getLightPushPeerCount();
    const getMeshPeerCount = await WakuBroadcasterClient.getMeshPeerCount();

    // const freshBroadcasters = await WakuBroadcasterClient.findAllBroadcastersForChain(
    //   railgunChain,
    //   true
    // );

    const selectedBroadcaster = freshBroadcasters.find(
      (b: any) => b.railgunAddress.toLowerCase() === DEFAULT_RAILGUN_ADDRESS.toLowerCase()
    );
    
    if (selectedBroadcaster) {
      toast.success("Found!");
    }
    console.log("selectedBroadcaster:", selectedBroadcaster);
    console.log("freshBroadcasters:", freshBroadcasters);

    console.log("getLightPushPeerCount:", getLightPushPeerCount);
    console.log("getMeshPeerCount:", getMeshPeerCount);
    console.log("getWakuCore:", getWakuCore);
  };

  return (
    <div>
      {/* Connector data */}
      <div className="mb-4 ml-4 text-main-base">
        <p>{`isConnected: ${isConnected}... chainId: ${walletsCurrentChainId}... address: ${address}`}</p>
        <p>{`publicConnectorId: ${publicConnectorId}`}</p>
        <p>{`selfSigningConnectorId: ${selfSigningConnectorId}`}</p>
      </div>

      {/* Buttons */}
      <button
        onClick={findBroadcastersForToken}
        className={defaultButtonStyle}
      >
        <p>findBroadcastersForToken result test</p>
      </button>

      {/* <button
        onClick={() => {
          toast.success("Funds on the move");
          toast.error("Tx rejected");
        }}
        className={defaultButtonStyle}
      >
        <p>toast checker</p>
      </button> */}

      <button
        onClick={() => {
          console.warn("GENERAL_BROADCASTER_ERROR", WALLET_MODE_NOTIFICATIONS.TRY_CUSTOM_FEE);
        }}
        className={defaultButtonStyle}
      >
        <p>console.log test</p>
      </button>

    </div>
  );
};
