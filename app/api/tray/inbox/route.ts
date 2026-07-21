/// GET /api/tray/inbox?local=<mailbox>&wallet=<0x...>&domain=fax|nftmail.box
///
/// In-Tray gallery listing for the standalone NFTfax app. Returns light
/// metadata (NO bitmap) for every fax received by `local`, enriched with the
/// chain-letter game flags (forwarded / mintedBase / savedGnosis).
///
/// Ownership is enforced fail-CLOSED for @nftmail.box: the caller's wallet
/// must match the on-chain controller of `local`. @fax is a free public
/// namespace in Phase 1, so it only requires a valid wallet signature.

import { NextRequest, NextResponse } from 'next/server';

const WORKER_URL = process.env.NFTMAIL_WORKER_URL || 'https://worker.nftmail.box';
const WORKER_SECRET = process.env.WORKER_SECRET || '';

const NO_STORE = { 'Cache-Control': 'no-store' } as const;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const domain = (searchParams.get('domain') || 'nftmail.box').toLowerCase();
  let local = (searchParams.get('local') || '').toLowerCase().trim();
  local = local.replace(new RegExp(`@${domain.replace(/\./g, '\\.')}$`), '');
  local = local.replace(/@fax$/, '').replace(/@nftmail\.box$/, '');
  const wallet = (searchParams.get('wallet') || '').trim();

  if (!local) {
    return NextResponse.json({ error: 'Missing local' }, { status: 400, headers: NO_STORE });
  }
  if (!wallet || !/^0x[a-fA-F0-9]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401, headers: NO_STORE });
  }

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (WORKER_SECRET) headers['X-Worker-Secret'] = WORKER_SECRET;

  try {
    // @fax is the free public namespace; skip resolveAddress ownership check.
    if (domain !== 'fax') {
      const resolveRes = await fetch(WORKER_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify({ action: 'resolveAddress', name: local, domain }),
        cache: 'no-store',
      });
      if (!resolveRes.ok) {
        return NextResponse.json({ error: 'Could not verify mailbox ownership. Try again.' }, { status: 503, headers: NO_STORE });
      }
      const resolved = await resolveRes.json() as Record<string, unknown>;
      if (resolved.exists === false) {
        return NextResponse.json({ error: 'Mailbox does not exist.' }, { status: 404, headers: NO_STORE });
      }
      const controller = (resolved.onChainOwner as string | undefined)?.toLowerCase();
      if (!controller) {
        return NextResponse.json({
          error: 'Ownership could not be verified. Connect the wallet that controls this mailbox.',
        }, { status: 403, headers: NO_STORE });
      }
      if (controller !== wallet.toLowerCase()) {
        return NextResponse.json({ error: 'Wallet does not match the registered owner' }, { status: 403, headers: NO_STORE });
      }
    }

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
