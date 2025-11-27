# Threat Model

Device compromise or phished signature = full compromise.

## ANONYMITY

1. **Assumptions:**
- On-chain privacy is protected by cryptography; network-level privacy (IP address) requires users to combine a custom RPC with VPN/Tor.
- Users wait a sufficient interval after privatizing funds before withdrawing to a public address; withdrawing too soon increases linkability.
- Users who withdraw earlier rely on the current anonymity set to reduce timing correlation, with correspondingly weaker privacy.
- Privacy guarantees are probabilistic and depend on the size and activity of the anonymity set.
- Users seeking maximum privacy should select custom RPC endpoints and use VPN or Tor.

2. **Mitigations:**
- Main provider panel displays information explaining how custom RPCs and VPN/Tor strengthen privacy.
- Users can enable preset common withdrawal amounts instead of arbitrary values to reduce amount-based correlation.


## PRIVATE ADDRESS

1. **User Guidance:**
- Track which wallet is connected to which private address.
- Back up the derived mnemonic immediately if generated with a password.
- Do not sign untrusted messages with the same message used for this project.
- If a device or wallet is compromised, migrate funds to a new private/public address on a secure device.

2. **Assumptions:**
- Devices and wallets are uncompromised.
- Users may access private addresses from multiple devices if those devices remain uncompromised.
- Random entropy for derivation is cryptographically secure.
- User won't blindly sign any message.
- Wallet used for signature private address access is reputable.

3. **Encryption Key:**
- The mnemonic encryption key is derived from the user’s password or signature (depending on wallet creation method chosen) using Railgun’s PBKDF2 utility with salt and high iteration count; only the derived key is used for encryption, and no plaintext password is stored.

4. **Mnemonic Derivation:**
Note: 
- There are 2 methods to derive a private address (A) uses a signature for a deterministic recovery (B) uses a random entropy; both methods create a mnemonic which then gets passed into "createRailgunWallet from @railgun-community/wallet", only the private address features of the RAILGUN wallet are used in this project.

Method (A):
- The wallet entropy is derived deterministically from the raw signature produced by signing a project-specific message with the user’s private key.
- Specifically, the signature bytes are hashed using keccak256, and the resulting hash is truncated to the desired entropy length (128 bits for 12-word mnemonics, 256 bits for 24-word mnemonics).
- The truncated hash is converted to a Buffer and passed to entropyToMnemonic (BIP39), producing a mnemonic that fully determines the wallet.
- Both the exact signed message and the resulting signature are required; altering either produces a completely different mnemonic and wallet.

Method (B):
- We generate a random 128-bit entropy using randomBytes(16) from ethers.
- This entropy is converted into a BIP39 mnemonic with Mnemonic.fromEntropy().
- The resulting mnemonic is then fed into createRailgunWallet to deterministically create the wallet.

5. **Threats:**
- Phishing or malicious scripts trick users into signing arbitrary messages.
- Replay: recorded signatures reused to derive the same wallet.
- Compromise of the signing key itself.
- Users must verify the signing UI displays the appropriate project-specific message before approving any signature, and must never sign project-specific messages via non-official sources or compromised devices.

6. **Mitigations:**
- Mnemonic is hidden by default and only revealed by explicit UI action.
- No persistent storage of signatures or passwords.
- Ephemeral references used where possible.

7. **Recovery:**
- Mnemonic-based: Recover wallet and private address with the BIP39 mnemonic.
- Signature-derived: Deterministically re-derive from the same canonicalized signature and project-specific message. Requires access to the original signing key.


## PROVIDERS

1. **Assumptions:**
- Providers correctly display the signing message.
- Users may add VPN/Tor for network-level privacy.

2. **Threats:**
- Malicious providers log or leak signatures.
- Providers see user IPs and may link them to wallet usage.
- Providers alter signing messages pre-approval.

3. **Mitigations:**
- Users manually select and connect; no automatic provider connections.
- RPC changes force a full reinitialization; failure wipes session state.
- Users can configure custom providers.
- Maximum privacy requires trusted providers + VPN/Tor.


## BROADCASTERS

Note:
- Broadcasters cannot decrypt Unshield/Transfer requests or access funds.

1. **Assumptions:**
- Users have stable network connectivity.
- VPNs must support peer-to-peer traffic.
- Testnets will have fewer broadcasters.
- Broadcasters may differ in fee estimates and token support.
- If one broadcaster fails, another can be selected, or auto-selection retried.
- Users seeking maximum privacy combine broadcasters with VPN/Tor.

2. **Threats:**
- Some broadcasters may struggle with Tor/VPN traffic.
- No broadcasters available.

3. **Mitigations:**
- Railgun-audited dependencies are used for broadcaster integration.
- All messages are end-to-end encrypted; broadcasters cannot view private addresses or message contents.
- Users may broadcast via multiple broadcasters to reduce deanonymization risk.
- For maximal privacy: combine multiple broadcasters with VPN/Tor and custom RPC endpoints.
- If no broadcaster is available, users can self-sign and send directly to chain (loses privacy but restores access).


## PERSISTENCE

Note:
- No plaintext passwords, signatures, or mnemonics are stored persistently.  
- LocalStorage contains salted hashes and metadata; it cannot decrypt the mnemonic without the user’s password/signature.
- If localStorage is cleared during a session, all UI prompts related to private address recovery will assume the only safe recovery method is the mnemonic phrase.
