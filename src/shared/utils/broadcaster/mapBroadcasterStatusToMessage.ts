import { BroadcasterConnectionStatus } from "@railgun-community/shared-models";

const broadcasterStatusMessages: Record<BroadcasterConnectionStatus, string> = {
  [BroadcasterConnectionStatus.Searching]: "Searching for Broadcasters...",
  [BroadcasterConnectionStatus.Disconnected]: "Broadcaster Connection Problem",
  [BroadcasterConnectionStatus.Error]: "Broadcaster Connection Error",
  [BroadcasterConnectionStatus.AllUnavailable]: "Broadcasters Unavailable",
  [BroadcasterConnectionStatus.Connected]: "Broadcaster Connected",
};
  
export const mapBroadcasterStatusToMessage = (
  status: BroadcasterConnectionStatus
): string => {
  return (
    broadcasterStatusMessages[status] || "Unknown Broadcaster Status"
  );
};
