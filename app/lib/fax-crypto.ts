/// Fax Crypto — end-to-end ECIES for the private NFTfax channel.
///
/// Threat model: a private fax must be as confidential as the ECIES message
/// layer. The bitmap is encrypted to the RECIPIENT's public key before it ever
/// reaches the worker, so KV stores only ciphertext and the public `/tray/{id}`
/// URL can never reveal the image. Only the recipient's wallet can decrypt.
///
/// Custody model (self-custodial, no plaintext key stored server-side):
///   1. Provision (once): the browser generates a P-256 key pair. The wallet
///      signs FAX_KEY_MESSAGE; that signature is HKDF-stretched into an AES-GCM
///      "wrap key" that encrypts the exported private key. The server stores
///      only { publicKey, wrappedPrivateKey, iv } — never the raw private key.
///   2. Send: the sender fetches the recipient's public key and ECIES-encrypts
///      the bitmap. No key material is exchanged.
///   3. View: the recipient re-signs FAX_KEY_MESSAGE, re-derives the wrap key,
///      unwraps their private key in the browser, and decrypts the envelope.
///
/// Isomorphic: uses only Web Crypto (globalThis.crypto.subtle), available in
/// both the Next.js server runtime (encrypt) and the browser (provision/decrypt).

const SUBTLE = (): SubtleCrypto => {
  const c = (globalThis as { crypto?: Crypto }).crypto;
  if (!c || !c.subtle) throw new Error('Web Crypto (crypto.subtle) is not available in this environment');
  return c.subtle;
};

// Fixed message the wallet signs to derive the fax key-wrapping secret.
// Versioned so we can rotate the derivation without ambiguity.
export const FAX_KEY_MESSAGE =
  'NFTmail Private Fax Key v1\n\nSign to unlock your encrypted fax vault. This signature never leaves your device.';

export interface FaxEnvelope {
  v: 1;
  epk: string; // ephemeral public key, hex (65-byte uncompressed P-256)
  iv: string;  // AES-GCM IV, hex (12 bytes)
  ct: string;  // ciphertext (incl. GCM tag), hex
  hash: string; // SHA-256 of plaintext, hex — integrity check
}

export interface WrappedFaxKey {
  publicKey: string;         // hex, 65-byte uncompressed P-256 public key
  wrappedPrivateKey: string; // hex, AES-GCM(wrapKey, pkcs8 private key)
  wrapIv: string;            // hex, 12-byte IV for the wrap
}

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

async function sha256Hex(data: string): Promise<string> {
  const encoded = new TextEncoder().encode(data);
  const hash = await SUBTLE().digest('SHA-256', encoded);
  return bytesToHex(new Uint8Array(hash));
}

// ── key import/export ────────────────────────────────────────────────────────

async function importPublicKey(pubHex: string): Promise<CryptoKey> {
  return SUBTLE().importKey('raw', hexToBytes(pubHex), { name: 'ECDH', namedCurve: 'P-256' }, false, []);
}

async function importPrivateKeyPkcs8(pkcs8Hex: string): Promise<CryptoKey> {
  return SUBTLE().importKey('pkcs8', hexToBytes(pkcs8Hex), { name: 'ECDH', namedCurve: 'P-256' }, false, ['deriveBits']);
}

async function deriveAesKey(privateKey: CryptoKey, publicKey: CryptoKey): Promise<CryptoKey> {
  const sharedBits = await SUBTLE().deriveBits({ name: 'ECDH', public: publicKey }, privateKey, 256);
  const material = await SUBTLE().importKey('raw', sharedBits, 'HKDF', false, ['deriveKey']);
  return SUBTLE().deriveKey(
    {
      name: 'HKDF',
      hash: 'SHA-256',
      salt: new TextEncoder().encode('nftmail-fax-ecies-v1'),
      info: new TextEncoder().encode('aes-256-gcm'),
    },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

// ── ECIES encrypt (sender side — server or browser) ──────────────────────────

export async function eciesEncrypt(plaintext: string, recipientPublicKeyHex: string): Promise<FaxEnvelope> {
  const ephemeral = await SUBTLE().generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']);
  const ephPubRaw = await SUBTLE().exportKey('raw', ephemeral.publicKey);
  const recipientPub = await importPublicKey(recipientPublicKeyHex);
  const aesKey = await deriveAesKey(ephemeral.privateKey, recipientPub);

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await SUBTLE().encrypt(
    { name: 'AES-GCM', iv, tagLength: 128 },
    aesKey,
    new TextEncoder().encode(plaintext),
  );

  return {
    v: 1,
    epk: bytesToHex(new Uint8Array(ephPubRaw)),
    iv: bytesToHex(iv),
    ct: bytesToHex(new Uint8Array(encrypted)),
    hash: await sha256Hex(plaintext),
  };
}

// ── ECIES decrypt (recipient side — browser) ─────────────────────────────────

export async function eciesDecrypt(envelope: FaxEnvelope, recipientPrivateKeyPkcs8Hex: string): Promise<string> {
  const ephPub = await importPublicKey(envelope.epk);
  const recipientPriv = await importPrivateKeyPkcs8(recipientPrivateKeyPkcs8Hex);
  const aesKey = await deriveAesKey(recipientPriv, ephPub);

  const decrypted = await SUBTLE().decrypt(
    { name: 'AES-GCM', iv: hexToBytes(envelope.iv), tagLength: 128 },
    aesKey,
    hexToBytes(envelope.ct),
  );
  const plaintext = new TextDecoder().decode(decrypted);
  if ((await sha256Hex(plaintext)) !== envelope.hash) {
    throw new Error('Content hash mismatch — fax integrity compromised');
  }
  return plaintext;
}

// ── Wallet-signature key custody (browser) ───────────────────────────────────

// HKDF-stretch a wallet signature into an AES-GCM key-wrapping secret.
async function deriveWrapKey(signatureHex: string): Promise<CryptoKey> {
  const sigBytes = hexToBytes(signatureHex);
  const material = await SUBTLE().importKey('raw', sigBytes, 'HKDF', false, ['deriveKey']);
  return SUBTLE().deriveKey(
    {
      name: 'HKDF',
      hash: 'SHA-256',
      salt: new TextEncoder().encode('nftmail-fax-wrap-v1'),
      info: new TextEncoder().encode('aes-256-gcm-wrap'),
    },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

/// Provision a new fax key pair, wrapping the private key with a wallet signature.
/// Returns the public bundle to register server-side. The raw private key never
/// leaves this function.
export async function provisionFaxKey(signatureHex: string): Promise<WrappedFaxKey> {
  const keyPair = await SUBTLE().generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']);
  const pubRaw = await SUBTLE().exportKey('raw', keyPair.publicKey);
  const privPkcs8 = await SUBTLE().exportKey('pkcs8', keyPair.privateKey);

  const wrapKey = await deriveWrapKey(signatureHex);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const wrapped = await SUBTLE().encrypt({ name: 'AES-GCM', iv, tagLength: 128 }, wrapKey, privPkcs8);

  return {
    publicKey: bytesToHex(new Uint8Array(pubRaw)),
    wrappedPrivateKey: bytesToHex(new Uint8Array(wrapped)),
    wrapIv: bytesToHex(iv),
  };
}

/// Unwrap a stored private key using a fresh wallet signature. Returns the
/// pkcs8 private key hex for use with eciesDecrypt.
export async function unwrapFaxKey(wrapped: WrappedFaxKey, signatureHex: string): Promise<string> {
  const wrapKey = await deriveWrapKey(signatureHex);
  const priv = await SUBTLE().decrypt(
    { name: 'AES-GCM', iv: hexToBytes(wrapped.wrapIv), tagLength: 128 },
    wrapKey,
    hexToBytes(wrapped.wrappedPrivateKey),
  );
  return bytesToHex(new Uint8Array(priv));
}
