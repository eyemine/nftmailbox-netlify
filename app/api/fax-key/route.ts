/// Private Fax Key Vault proxy.
///
/// GET  /api/fax-key?local=alice          → { hasKey, publicKey, wrappedPrivateKey?, wrapIv? }
///   Public key is needed by senders to encrypt; the wrapped private key is safe
///   to return (it is AES-GCM-encrypted with a wallet-signature-derived key the
///   server never sees).
///
/// POST /api/fax-key  { local, publicKey, wrappedPrivateKey, wrapIv, ownerWallet }
///   Registers a fax key. The caller's wallet must match the on-chain controller
///   of `local` (same ownership check as /api/tray/send) before the secret-gated
///   worker action is invoked.

import { NextRequest, NextResponse } from 'next/server';

const WORKER_URL = process.env.NFTMAIL_WORKER_URL || 'https://worker.nftmail.box';
const WORKER_SECRET = process.env.WORKER_SECRET || '';
const WEBHOOK_SECRET = process.env.NFTMAIL_WEBHOOK_SECRET || process.env.WEBHOOK_SECRET || '';

const NO_STORE = { 'Cache-Control': 'no-store' } as const;

export async function GET(req: NextRequest) {
  const local = req.nextUrl.searchParams.get('local')?.toLowerCase().trim();
  if (!local) {
    return NextResponse.json({ error: 'Missing local' }, { status: 400, headers: NO_STORE });
  }
  try {
    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Worker-Secret': WORKER_SECRET },
      body: JSON.stringify({ action: 'getFaxKey', local }),
      cache: 'no-store',
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status, headers: NO_STORE });
  } catch {
    return NextResponse.json({ error: 'Vault lookup failed' }, { status: 502, headers: NO_STORE });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      local?: string;
      publicKey?: string;
      wrappedPrivateKey?: string;
      wrapIv?: string;
      ownerWallet?: string;
    };
    const { local, publicKey, wrappedPrivateKey, wrapIv, ownerWallet } = body;

    if (!local || !publicKey || !wrappedPrivateKey || !wrapIv) {
      return NextResponse.json({ error: 'Missing local, publicKey, wrappedPrivateKey, or wrapIv' }, { status: 400, headers: NO_STORE });
    }
    if (!ownerWallet || !/^0x[a-fA-F0-9]{40}$/.test(ownerWallet)) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401, headers: NO_STORE });
    }

    // Verify the caller controls `local` before provisioning its key vault.
    // Fail CLOSED: registering a fax key sets the public key others encrypt to,
    // so an unverifiable owner must be rejected — otherwise an attacker could
    // register their own key for someone else's mailbox and intercept faxes.
    const resolveRes = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Worker-Secret': WORKER_SECRET },
      body: JSON.stringify({ action: 'resolveAddress', name: local }),
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
    if (controller !== ownerWallet.toLowerCase()) {
      return NextResponse.json({ error: 'Wallet does not match the registered owner' }, { status: 403, headers: NO_STORE });
    }

    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Worker-Secret': WORKER_SECRET },
      body: JSON.stringify({
        action: 'registerFaxKey',
        secret: WEBHOOK_SECRET,
        local: local.toLowerCase(),
        publicKey,
        wrappedPrivateKey,
        wrapIv,
        ownerWallet: ownerWallet.toLowerCase(),
      }),
    });
    const data = await res.json() as { error?: string };
    if (!res.ok) {
      return NextResponse.json({ error: data.error || 'Failed to register fax key' }, { status: res.status, headers: NO_STORE });
    }
    return NextResponse.json(data, { headers: NO_STORE });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Registration failed';
    return NextResponse.json({ error: message }, { status: 500, headers: NO_STORE });
  }
}
