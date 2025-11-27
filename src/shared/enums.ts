export enum RpcState {
    Custom = "custom",
    Default = "default",
    Off = "off",
}

export enum RailgunWalletConnectionType {
    Password = "password",
    Signature = "signature",
}

export enum RailgunStorageKey {
    HowWasRailgunWalletConnected = "railgunWalletConnectionType",
    WalletId = "WalletId",
    Salt = "Salt",
    HashPasswordStored = "HashPasswordStored",
}

export enum CardView {
    Public = "Public",
    Private = "Private"
}

export enum PrivateModeDestination {
    PublicAddress = "Public Address",
    PrivateAddress = "Private Address",
}

export enum PublicModeDestination {
    ConnectedPrivateAddress = "Connected Private Address",
    OtherPrivateAddress = "Any Private Address",
    OtherPublicAddress = "Any Public Address",
}