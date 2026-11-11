/// GET /api/tray/inbox?local=<mailbox>  (Authorization: caller token)
///
/// In-Tray gallery listing for the standalone NFTfax app. Returns light
/// metadata (NO bitmap) for every fax received by `local`, enriched with the
/// chain-letter game flags (forwarded / mintedBase / savedGnosis).
///
/// Ownership is enforced fail-CLOSED: the verified caller must control
/// `local` (see app/lib/caller-auth.ts), otherwise a wallet could enumerate someone
/// else's received-fax metadata.

import { NextRequest, NextResponse } from 'next/server';
import { requireInboxOwner } from '@/app/lib/caller-auth';

const WORKER_URL = process.env.NFTMAIL_WORKER_URL || 'https://worker.nftmail.box';
const WORKER_SECRET = process.env.WORKER_SECRET || '';

const NO_STORE = { 'Cache-Control': 'no-store' } as const;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const local = (searchParams.get('local') || '').toLowerCase().trim().replace(/@nftmail\.box$/, '');

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
      body: JSON.stringify({ action: 'listTrayInbox', local }),
      cache: 'no-store',
    });
    const data = await res.json() as { faxes?: Array<{ channel?: string; encrypted?: boolean }> };

    // Standalone app is PUBLIC chain-letter only. Private (ECIES-encrypted) faxes
    // are a dashboard-only feature (decrypted in-browser with the owner's key),
    // so they must never surface in the standalone in-tray listing.
    if (Array.isArray(data.faxes)) {
      data.faxes = data.faxes.filter((f) => f.channel !== 'private' && !f.encrypted);
    }

    return NextResponse.json(data, { status: res.status, headers: NO_STORE });
  } catch {
    return NextResponse.json({ error: 'Inbox lookup failed' }, { status: 502, headers: NO_STORE });
  }
}
