/// WKD Key Lookup — returns the armored PGP public key for a user.
///
/// GET /.well-known/openpgpkey/{domain}/hu/{hashed-local}
///
/// The {hashed-local} is the SHA-1 of the local part, Z-Base-32 encoded
/// (RFC 4648 variant). We decode it, look up the user's key via the worker
/// getPgpKey action, and return the armored public key as binary/octet-stream.

import { NextRequest } from 'next/server';

const WORKER_URL = process.env.NFTMAIL_WORKER_URL || 'https://worker.nftmail.box';
const WORKER_SECRET = process.env.WORKER_SECRET || '';

// Z-Base-32 alphabet (RFC 4648 variant used by WKD)
const ZBASE32_ALPHABET = 'ybndrfg8ejkmcpqxot1uwisza345h769';

function zBase32Decode(input: string): Uint8Array | null {
  const cleaned = input.toLowerCase().replace(/=+$/, '');
  const bits: number[] = [];
  for (const ch of cleaned) {
    const idx = ZBASE32_ALPHABET.indexOf(ch);
    if (idx === -1) return null;
    for (let i = 4; i >= 0; i--) {
      bits.push((idx >> i) & 1);
    }
  }
  const bytes: number[] = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    let b = 0;
    for (let j = 0; j < 8; j++) {
      b = (b << 1) | bits[i + j];
    }
    bytes.push(b);
  }
  return new Uint8Array(bytes);
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Since we can't reverse SHA-1, we list all PGP keys from the worker and
// match by comparing SHA-1(local) with the decoded hash. For small registries
// this is fine; for scale, a reverse index would be needed.
async function findLocalByHash(domain: string, hashHex: string): Promise<string | null> {
  // The worker doesn't have a "list all PGP keys" action, but we can try
  // the most common pattern: the hash is SHA-1 of the local part.
  // We'll attempt to decode and match against known locals.
  // For now, we rely on the caller providing the local part via a lookup table.
  // In practice, external PGP clients compute the hash from the email address,
  // so we need a reverse mapping. We'll fetch all PGP keys via a list action
  // if available, or use a direct lookup approach.

  // Attempt: try common local patterns by brute-forcing against the worker.
  // This is not practical at scale. Instead, we store a KV mapping
  // pgp-wkd:{hashHex} -> localPart when keys are registered.
  try {
    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Worker-Secret': WORKER_SECRET },
      body: JSON.stringify({ action: 'getWkdMapping', hashHex, domain }),
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json() as { localPart?: string };
      return data.localPart || null;
    }
  } catch {}
  return null;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { domain: string; hashed: string } },
) {
  const { domain, hashed } = params;

  // Only serve WKD for our own domains
  const validDomains = ['nftmail.box', 'ghostmail.box'];
  if (!validDomains.includes(domain)) {
    return new Response('Not found', { status: 404 });
  }

  // Decode the Z-Base-32 hash to get the raw SHA-1 bytes
  const hashBytes = zBase32Decode(hashed);
  if (!hashBytes) {
    return new Response('Invalid hash encoding', { status: 400 });
  }
  const hashHex = bytesToHex(hashBytes);

  // Look up the local part from the WKD reverse mapping
  const localPart = await findLocalByHash(domain, hashHex);
  if (!localPart) {
    return new Response('Key not found', { status: 404 });
  }

  // Fetch the armored public key from the worker
  try {
    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Worker-Secret': WORKER_SECRET },
      body: JSON.stringify({ action: 'getPgpKey', agentName: localPart }),
      cache: 'no-store',
    });
    if (!res.ok) {
      return new Response('Key not found', { status: 404 });
    }
    const data = await res.json() as { hasKey?: boolean; publicKey?: string };
    if (!data.hasKey || !data.publicKey) {
      return new Response('Key not found', { status: 404 });
    }

    // Return as binary/octet-stream (WKD spec)
    const keyBytes = new TextEncoder().encode(data.publicKey);
    return new Response(keyBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'attachment; filename="public.key"',
        'Cache-Control': 'no-store',
      },
    });
  } catch {
    return new Response('Key lookup failed', { status: 502 });
  }
}
