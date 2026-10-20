/// PGP Crypto — usable OpenPGP for @nftmail.box, keyed to on-chain identity (ERC-8048).
///
/// Why PGP (vs the internal ECIES fax channel): PGP is the interoperable RFC 4880
/// standard. A PGP-encrypted message is opaque ciphertext at the SMTP boundary, so
/// Mailgun/Gmail/Outlook relay and store only ciphertext — closing the external-mail
/// cleartext gap that the closed ECIES/mail.locker network cannot.
///
/// Custody model (self-custodial, no plaintext key stored server-side) — mirrors
/// app/lib/fax-crypto.ts:
///   1. Provision (once): generate an OpenPGP key pair in the browser. The wallet
///      signs PGP_KEY_MESSAGE; that signature is HKDF-stretched into an AES-GCM
///      "wrap key" that encrypts the armored private key. The worker stores only
///      { publicKey (armored), wrappedPrivateKey, wrapIv, fingerprint } — never the
///      raw private key. Recoverable on any device by re-signing.
///   2. Encrypt: fetch the recipient's armored public key (getPgpKey / WKD) and
///      encrypt to it. No key material is exchanged.
///   3. Decrypt: re-sign PGP_KEY_MESSAGE, re-derive the wrap key, unwrap the private
///      key in the browser, and decrypt the PGP message.
///
/// Uses openpgp@6 (Web Crypto under the hood). All private-key operations are
/// browser-only; this module must not run its provision/decrypt paths on the server.

import * as openpgp from 'openpgp';

// Fixed message the wallet signs to derive the PGP key-wrapping secret.
// Versioned so we can rotate the derivation without ambiguity.
export const PGP_KEY_MESSAGE =
  'NFTmail PGP Identity Key v1\n\nSign to unlock your encrypted PGP mailbox. This signature never leaves your device.';

export interface WrappedPgpKey {
  publicKey: string;         // ASCII-armored OpenPGP public key
  wrappedPrivateKey: string; // hex, AES-GCM(wrapKey, armored private key bytes)
  wrapIv: string;            // hex, 12-byte IV for the wrap
  fingerprint: string;       // lowercase hex fingerprint
  keyId: string;             // lowercase hex key id (last 16 hex of fingerprint)
}

const SUBTLE = (): SubtleCrypto => {
  const c = (globalThis as { crypto?: Crypto }).crypto;
  if (!c || !c.subtle) throw new Error('Web Crypto (crypto.subtle) is not available in this environment');
  return c.subtle;
};

// ── hex helpers ──────────────────────────────────────────────────────────────

function hexToBytes(hex: string): Uint8Array {
  const clean = hex.startsWith('0x') ? hex.slice(2) : hex;
  if (clean.length % 2 !== 0) throw new Error('Invalid hex length');
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(clean.substr(i * 2, 2), 16);
  }
  return bytes;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
}

// ── wallet-signature key custody ───────────────────────────────────────────

// HKDF-stretch a wallet signature into an AES-GCM key-wrapping secret.
async function deriveWrapKey(signatureHex: string): Promise<CryptoKey> {
  const material = await SUBTLE().importKey('raw', hexToBytes(signatureHex), 'HKDF', false, ['deriveKey']);
  return SUBTLE().deriveKey(
    {
      name: 'HKDF',
      hash: 'SHA-256',
      salt: new TextEncoder().encode('nftmail-pgp-wrap-v1'),
      info: new TextEncoder().encode('aes-256-gcm-wrap'),
    },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

// ── provision / recover ──────────────────────────────────────────────────────

/// Generate a new OpenPGP key pair and wrap the private key with a wallet
/// signature. Returns the public bundle to register server-side. The unwrapped
/// private key never leaves this function.
export async function provisionPgpKey(signatureHex: string, userId: string): Promise<WrappedPgpKey> {
  const { publicKey, privateKey } = await openpgp.generateKey({
    type: 'curve25519',
    userIDs: [{ name: userId, email: `${userId}@nftmail.box` }],
    format: 'armored',
  });

  const wrapKey = await deriveWrapKey(signatureHex);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const wrapped = await SUBTLE().encrypt(
    { name: 'AES-GCM', iv, tagLength: 128 },
    wrapKey,
    new TextEncoder().encode(privateKey),
  );

  const key = await openpgp.readKey({ armoredKey: publicKey });
  const fingerprint = key.getFingerprint().toLowerCase();
  const keyId = key.getKeyID().toHex().toLowerCase();

  return {
    publicKey,
    wrappedPrivateKey: bytesToHex(new Uint8Array(wrapped)),
    wrapIv: bytesToHex(iv),
    fingerprint,
    keyId,
  };
}

/// Unwrap a stored private key using a fresh wallet signature. Returns the
/// ASCII-armored private key for use with pgpDecrypt.
export async function unwrapPgpKey(
  wrapped: Pick<WrappedPgpKey, 'wrappedPrivateKey' | 'wrapIv'>,
  signatureHex: string,
): Promise<string> {
  const wrapKey = await deriveWrapKey(signatureHex);
  const priv = await SUBTLE().decrypt(
    { name: 'AES-GCM', iv: hexToBytes(wrapped.wrapIv), tagLength: 128 },
    wrapKey,
    hexToBytes(wrapped.wrappedPrivateKey),
  );
  return new TextDecoder().decode(priv);
}

// ── encrypt / decrypt ──────────────────────────────────────────────────────

/// Encrypt plaintext to one or more armored recipient public keys. Returns an
/// ASCII-armored PGP message suitable for PGP/MIME transport.
export async function pgpEncrypt(plaintext: string, recipientPublicKeysArmored: string[]): Promise<string> {
  if (recipientPublicKeysArmored.length === 0) {
    throw new Error('At least one recipient public key is required');
  }
  const encryptionKeys = await Promise.all(
    recipientPublicKeysArmored.map((armoredKey) => openpgp.readKey({ armoredKey })),
  );
  const message = await openpgp.createMessage({ text: plaintext });
  const encrypted = await openpgp.encrypt({ message, encryptionKeys, format: 'armored' });
  return encrypted as string;
}

/// Decrypt an armored PGP message with an armored private key. The private key
/// must already be unwrapped (see unwrapPgpKey). Returns the plaintext.
export async function pgpDecrypt(armoredMessage: string, armoredPrivateKey: string): Promise<string> {
  const privateKey = await openpgp.readPrivateKey({ armoredKey: armoredPrivateKey });
  const message = await openpgp.readMessage({ armoredMessage });
  const { data } = await openpgp.decrypt({ message, decryptionKeys: privateKey, format: 'utf8' });
  return data as string;
}

// ── fingerprint helpers ──────────────────────────────────────────────────────

/// Extract the lowercase fingerprint + key id from an armored public key.
export async function pgpKeyInfo(armoredPublicKey: string): Promise<{ fingerprint: string; keyId: string }> {
  const key = await openpgp.readKey({ armoredKey: armoredPublicKey });
  return {
    fingerprint: key.getFingerprint().toLowerCase(),
    keyId: key.getKeyID().toHex().toLowerCase(),
  };
}

// ── local cache (wrapped key + public key, scoped per agent) ─────────────────
// Only the WRAPPED (ciphertext) private key is cached — never the unwrapped key.

const STORAGE_PREFIX = 'nftmail-pgp:';

export function storeWrappedPgpKey(agentName: string, wrapped: WrappedPgpKey): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + agentName, JSON.stringify(wrapped));
  } catch {}
}

export function loadWrappedPgpKey(agentName: string): WrappedPgpKey | null {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + agentName);
    return raw ? (JSON.parse(raw) as WrappedPgpKey) : null;
  } catch {
    return null;
  }
}

export function clearWrappedPgpKey(agentName: string): void {
  try {
    localStorage.removeItem(STORAGE_PREFIX + agentName);
  } catch {}
}

export function hasWrappedPgpKey(agentName: string): boolean {
  return loadWrappedPgpKey(agentName) !== null;
}
