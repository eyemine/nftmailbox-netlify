/// POST /api/session  { wallet, signedAt, signature }
///
/// Exchanges one fresh EIP-191 personal_sign over the canonical statement
/// (app/lib/auth-statement.ts) for a 24h Bearer session token. Clients send
/// the token on every authenticated route instead of signing per request.

import { NextRequest, NextResponse } from 'next/server';
import { NO_STORE, signSessionToken, verifySignedStatement } from '@/app/lib/wallet-auth';

export async function POST(req: NextRequest) {
  if (!process.env.NFTMAIL_SESSION_SECRET) {
    return NextResponse.json({ error: 'Session auth not configured' }, { status: 503, headers: NO_STORE });
  }
  const body = await req.json().catch(() => ({})) as {
    wallet?: string;
    signedAt?: number;
    signature?: string;
  };
  const wallet = (body.wallet || '').toLowerCase();
  const signedAt = Number(body.signedAt);
  if (!wallet || !signedAt || !body.signature) {
    return NextResponse.json({ error: 'Missing wallet, signedAt, or signature' }, { status: 400, headers: NO_STORE });
  }
  const ok = await verifySignedStatement(wallet, signedAt, body.signature);
  if (!ok) {
    return NextResponse.json({ error: 'Invalid or stale signature' }, { status: 401, headers: NO_STORE });
  }
  const { token, expiresAt } = signSessionToken(wallet);
  return NextResponse.json({ token, expiresAt }, { headers: NO_STORE });
}
