import { NextRequest, NextResponse } from 'next/server';
import { verifyCaller, callerOwnsInbox, inboxRefs } from '../../lib/caller-auth';
const WORKER_URL = process.env.NFTMAIL_WORKER_URL || 'https://worker.nftmail.box';
const WORKER_SECRET = process.env.WORKER_SECRET || '';

const ALLOWED_ACTIONS = new Set(['deleteMessage', 'deleteSentMessage']);

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body || !ALLOWED_ACTIONS.has(String(body.action))) {
      return NextResponse.json({ error: 'Action not permitted' }, { status: 403 });
    }
    const refs = inboxRefs(body);
    if (refs.length === 0) return NextResponse.json({ error: 'Missing localPart' }, { status: 400 });
    const caller = await verifyCaller(req);
    if (!caller) return NextResponse.json({ error: 'Sign in required' }, { status: 401 });
    for (const ref of refs) {
      if (!(await callerOwnsInbox(caller, ref))) return NextResponse.json({ error: 'Not your inbox' }, { status: 403 });
    }
    const res = await fetch(WORKER_URL, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Worker-Secret': WORKER_SECRET }, body: JSON.stringify(body) });
    const data = await res.text();
    return new NextResponse(data, { status: res.status, headers: { 'Content-Type': res.headers.get('Content-Type') || 'application/json' } });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Proxy error' }, { status: 502 });
  }
}
