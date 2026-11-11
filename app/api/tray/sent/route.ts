/// GET /api/tray/sent?local=<mailbox>  (Authorization: caller token)
///
/// Sent-Tray gallery listing for the standalone NFTfax app. Returns light
/// metadata (NO bitmap) for every fax SENT by `local`.
///
/// Ownership is enforced fail-CLOSED: the verified caller must control
/// `local` (see app/lib/caller-auth.ts).

import { NextRequest, NextResponse } from 'next/server';
import { requireInboxOwner } from '@/app/lib/caller-auth';

const WORKER_URL = process.env.NFTMAIL_WORKER_URL || 'https://worker.nftmail.box';
const WORKER_SECRET = process.env.WORKER_SECRET || '';

const NO_STORE = { 'Cache-Control': 'no-store' } as const;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const local = (searchParams.get('local') || '').toLowerCase().trim().replace(/@nftmail\.box$/, '').replace(/@fax$/, '');

  if (!local) {
    return NextResponse.json({ error: 'Missing local' }, { status: 400, headers: NO_STORE });
  }

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (WORKER_SECRET) headers['X-Worker-Secret'] = WORKER_SECRET;

  try {
    // Fail-closed: the verified caller (Privy / Quick Auth token) must own
    // `local`. Unclaimed names have no owner, so they never match.
    const auth = await requireInboxOwner(req, local);
    if ('res' in auth) return auth.res;

    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ action: 'listTraySent', local }),
      cache: 'no-store',
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status, headers: NO_STORE });
  } catch {
    return NextResponse.json({ error: 'Sent tray lookup failed' }, { status: 502, headers: NO_STORE });
  }
}
