/// POST /api/inbox-action
///
/// Authenticated proxy for mutation actions on NFTMail inboxes.
/// Requires ownerWallet to match the on-chain controller recorded in the
/// worker KV. Adds X-Worker-Secret before forwarding to the worker.
///
/// Permitted mutation actions:
///   setPrivacy    — toggle inbox privacy tier (exposed / private)
///   deleteMessage — permanently delete a single message by ID

import { NextRequest, NextResponse } from 'next/server';

const WORKER_URL = process.env.NFTMAIL_WORKER_URL || 'https://nftmail-email-worker.richard-159.workers.dev';
const WORKER_SECRET = process.env.WORKER_SECRET || '';

const ALLOWED_ACTIONS = new Set(['setPrivacy', 'deleteMessage']);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      action?: string;
      localPart?: string;
      ownerWallet?: string;
      [key: string]: unknown;
    };

    const { action, localPart, ownerWallet } = body;

    if (!action || !ALLOWED_ACTIONS.has(action)) {
      return NextResponse.json({ error: 'Action not permitted' }, { status: 403 });
    }
    if (!localPart) {
      return NextResponse.json({ error: 'Missing localPart' }, { status: 400 });
    }
    if (!ownerWallet) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Verify caller against on-chain controller
    const resolveRes = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Worker-Secret': WORKER_SECRET },
      body: JSON.stringify({ action: 'resolveAddress', name: localPart }),
    });

    if (resolveRes.ok) {
      const rd = await resolveRes.json() as Record<string, unknown>;
      const controller = ((rd.onChainOwner || rd.controller || '') as string).toLowerCase();
      if (controller && ownerWallet.toLowerCase() !== controller) {
        return NextResponse.json({ error: 'Wallet does not match inbox owner' }, { status: 403 });
      }
    }

    // Forward mutation to worker with server-side secret
    const { ownerWallet: _omit, ...forwardBody } = body;
    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Worker-Secret': WORKER_SECRET },
      body: JSON.stringify(forwardBody),
    });

    const data: unknown = await res.json();
    return NextResponse.json(data, {
      status: res.status,
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
