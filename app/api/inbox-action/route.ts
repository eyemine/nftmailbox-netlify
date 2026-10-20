/// POST /api/inbox-action
///
/// Authenticated proxy for mutation actions on NFTMail inboxes.
/// Requires a verified caller (Quick Auth / Privy token) who owns the inbox,
/// per caller-auth.ts. Adds X-Worker-Secret before forwarding to the worker.
///
/// Permitted mutation actions:
///   setPrivacy    — toggle inbox privacy tier (exposed / private)
///   deleteMessage — permanently delete a single message by ID

import { NextRequest, NextResponse } from 'next/server';
import { verifyCaller, callerOwnsInbox, inboxRefs } from '../../lib/caller-auth';

const WORKER_URL = process.env.NFTMAIL_WORKER_URL || 'https://worker.nftmail.box';
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

    const { action, localPart } = body;

    if (!action || !ALLOWED_ACTIONS.has(action)) {
      return NextResponse.json({ error: 'Action not permitted' }, { status: 403 });
    }
    if (!localPart) {
      return NextResponse.json({ error: 'Missing localPart' }, { status: 400 });
    }
    // Verified caller must own every inbox the body names (ownerWallet is
    // only a claim and is ignored).
    const caller = await verifyCaller(req);
    if (!caller) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    for (const ref of inboxRefs(body)) {
      if (!(await callerOwnsInbox(caller, ref))) {
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
