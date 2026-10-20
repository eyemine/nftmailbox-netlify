import { NextRequest, NextResponse } from 'next/server';
import { verifyCaller, callerOwnsInbox, inboxRefs, type Caller } from '../../lib/caller-auth';

const WORKER_URL = process.env.NFTMAIL_WORKER_URL || process.env.NEXT_PUBLIC_WORKER_URL || 'https://worker.nftmail.box';
const WORKER_SECRET = process.env.WORKER_SECRET || '';

// The worker trusts anything carrying X-Worker-Secret, so this proxy is the
// security boundary for the mini-app and dashboard: only listed actions pass,
// and inbox actions only for a verified caller who owns the named inbox.

/// No caller proof needed: no inbox content, no state change on someone else's account.
const PUBLIC_ACTIONS = new Set(['checkSendLimit', 'verifyOTP']);

/// Caller must own every inbox named in the body.
const OWNER_ACTIONS = new Set([
  'getInbox', 'getSentbox', 'getBlindInbox', 'getAgentProfile',
  'getForwardingConfig', 'setForwardingConfig', 'sendTestEmail', 'sendOutbound',
  'saveSentMessage', 'storeSentMessage', 'deleteMessage', 'deleteSentMessage',
  'purgeInbox', 'registerEciesKey',
]);

const deny = (status: number, error: string) => NextResponse.json({ error }, { status, headers: { 'Cache-Control': 'no-store' } });

async function authorize(action: string, body: Record<string, unknown>, caller: Caller | null): Promise<NextResponse | null> {
  if (PUBLIC_ACTIONS.has(action)) return null;
  if (!caller) return deny(401, 'Sign in required');

  if (action === 'provisionFidAgent') {
    if (caller.via !== 'farcaster' || !caller.fid) return deny(403, 'Farcaster sign-in required');
    body.fid = caller.fid; // never trust a client-supplied fid
    return null;
  }
  if (action === 'listNftmailByController') {
    const controller = String(body.controller || '').toLowerCase();
    return caller.wallets.includes(controller) ? null : deny(403, 'Not your wallet');
  }
  if (OWNER_ACTIONS.has(action)) {
    // All named inboxes are checked, so a request cannot name an owned inbox in
    // one field and a victim's in another.
    const refs = inboxRefs(body);
    if (refs.length === 0) return deny(400, 'Inbox name required');
    for (const ref of refs) {
      if (!(await callerOwnsInbox(caller, ref))) return deny(403, 'Not your inbox');
    }
    return null;
  }
  return deny(403, 'Action not permitted');
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    const action = typeof body?.action === 'string' ? body.action : '';
    if (!body || !action) return deny(400, 'Missing action');

    const caller = PUBLIC_ACTIONS.has(action) ? null : await verifyCaller(req);
    const denied = await authorize(action, body, caller);
    if (denied) return denied;

    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(WORKER_SECRET ? { 'X-Worker-Secret': WORKER_SECRET } : {}) },
      body: JSON.stringify(body),
    });
    return new NextResponse(await res.text(), {
      status: res.status,
      headers: { 'Content-Type': res.headers.get('Content-Type') || 'application/json', 'Cache-Control': 'no-store' },
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Proxy error' }, { status: 502 });
  }
}
