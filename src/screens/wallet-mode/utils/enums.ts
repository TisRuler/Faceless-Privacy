export enum PrivateModeButtonState {
  ConnectPrivateAddress = "Connect",
  ConnectSelfSigner = "Connect Self Signer",
  ReadyToEstimate = "Send Funds", // Says "Send Funds" but will trigger estimation
  Estimating = "Estimating Fee...",
  ReadyToWithdraw = "Send Funds", // Says "Send Funds" and will trigger tx
  Withdrawing = "Sending...",
}

export enum PublicModeButtonState {
  Send = "Send Funds",
  Sending = "Sending...",
  WaitingForConfirmation = "Confirm In Wallet...",
  Wait = "Wait...",
  Approving = "Approving...",
  ConnectWallet = "Connect",
  ConnectPrivateAddress = "Connect Private Address",
  Error = "Error",
}