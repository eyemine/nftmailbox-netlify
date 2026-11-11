/// Server-side wallet authentication.
///
/// Two accepted credentials, in precedence order:
///   1. `Authorization: Bearer <token>` — a session token issued by
///      POST /api/session after one wallet signature (24h TTL).
///   2. Inline one-shot signature — `signature` + `signedAt` fields over the
///      canonical statement from app/lib/auth-statement.ts (±10min freshness).
///
/// Both prove control of the wallet; routes then compare the VERIFIED wallet
/// against on-chain owner records exactly as they did with the claimed one.
/// A bare wallet string is never sufficient.

import { createHmac, timingSafeEqual } from 'crypto';
import { recoverMessageAddress } from 'viem';
import { NextRequest, NextResponse } from 'next/server';
import { authStatement } from './auth-statement';

const SESSION_SECRET = process.env.NFTMAIL_SESSION_SECRET || '';
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;
const SIG_FRESHNESS_MS = 10 * 60 * 1000;
const WALLET_RE = /^0x[a-fA-F0-9]{40}$/;

export const NO_STORE = { 'Cache-Control': 'no-store' } as const;

const b64u = (buf: Buffer | string): string => (typeof buf === 'string' ? Buffer.from(buf) : buf).toString('base64url');

function hmac(payload: string): Buffer {
  return createHmac('sha256', SESSION_SECRET).update(payload).digest();
}

export function signSessionToken(wallet: string, ttlMs = SESSION_TTL_MS): { token: string; expiresAt: number } {
  const expiresAt = Date.now() + ttlMs;
  const payload = `v1.${wallet.toLowerCase()}.${expiresAt}`;
  return { token: `${b64u(payload)}.${b64u(hmac(payload))}`, expiresAt };
}

export function verifySessionToken(token: string): string | null {
  if (!SESSION_SECRET) return null;
  const [p64, s64] = token.split('.');
  if (!p64 || !s64) return null;
  const payload = Buffer.from(p64, 'base64url').toString();
  const expected = hmac(payload);
  const given = Buffer.from(s64, 'base64url');
  if (given.length !== expected.length || !timingSafeEqual(new Uint8Array(given), new Uint8Array(expected))) return null;
  const parts = payload.split('.');
  if (parts.length !== 3 || parts[0] !== 'v1') return null;
  const exp = parseInt(parts[2], 10);
  if (!exp || Date.now() > exp) return null;
  return parts[1];
}

/// Verify an EIP-191 personal_sign over the canonical statement. The signedAt
/// timestamp is inside the signed message, so it cannot be replayed beyond
/// the freshness window.
export async function verifySignedStatement(
  wallet: string,
  signedAt: number,
  signature: string,
): Promise<boolean> {
  if (!WALLET_RE.test(wallet)) return false;
  if (!signedAt || Math.abs(Date.now() - signedAt) > SIG_FRESHNESS_MS) return false;
  try {
    const recovered = await recoverMessageAddress({
      message: authStatement(wallet, signedAt),
      signature: signature as `0x${string}`,
    });
    return recovered.toLowerCase() === wallet.toLowerCase();
  } catch {
    return false;
  }
}

interface WalletCreds {
  signature?: string;
  signedAt?: string | number;
}

type Verified = { wallet: string } | { res: NextResponse };

/// Resolve the verified caller wallet for a route. `claimedWallet` is the
/// wallet the caller says they are — it is only used for comparison, never
/// trusted. Pass signature credentials from body (POST) or searchParams (GET).
export async function requireVerifiedWallet(
  req: NextRequest,
  claimedWallet: string | undefined,
  creds: WalletCreds = {},
): Promise<Verified> {
  const claimed = (claimedWallet || '').toLowerCase();

  const bearer = req.headers.get('authorization');
  if (bearer?.startsWith('Bearer ')) {
    const wallet = verifySessionToken(bearer.slice(7));
    if (!wallet) {
      return { res: NextResponse.json({ error: 'Session expired — reconnect your wallet', code: 'SESSION_EXPIRED' }, { status: 401, headers: NO_STORE }) };
    }
    if (claimed && claimed !== wallet) {
      return { res: NextResponse.json({ error: 'Session wallet does not match the request wallet' }, { status: 403, headers: NO_STORE }) };
    }
    return { wallet };
  }

  const signedAt = Number(creds.signedAt);
  if (claimed && creds.signature && signedAt) {
    const ok = await verifySignedStatement(claimed, signedAt, creds.signature);
    if (!ok) {
      return { res: NextResponse.json({ error: 'Invalid or stale wallet signature' }, { status: 401, headers: NO_STORE }) };
    }
    return { wallet: claimed };
  }

  return { res: NextResponse.json({ error: 'Authentication required', code: 'AUTH_REQUIRED' }, { status: 401, headers: NO_STORE }) };
}
