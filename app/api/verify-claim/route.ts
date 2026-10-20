/// Server-side proxy for client-side verifyClaim action.
/// Adds X-Worker-Secret so the browser never needs the secret.
import { NextRequest, NextResponse } from 'next/server';

const WORKER_URL = process.env.NFTMAIL_WORKER_URL || 'https://worker.nftmail.box';
const WORKER_SECRET = process.env.WORKER_SECRET || '';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    // Only the claim-code lookup; anything else would ride on WORKER_SECRET.
    const parsed = (() => { try { return JSON.parse(body) as Record<string, unknown>; } catch { return null; } })();
    if (!parsed || parsed.action !== 'verifyClaim' || typeof parsed.claimCode !== 'string') {
      return NextResponse.json({ error: 'Action not permitted' }, { status: 403 });
    }
    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Worker-Secret': WORKER_SECRET,
      },
      body: JSON.stringify({ action: 'verifyClaim', claimCode: parsed.claimCode }),
    });
    const data = await res.text();
    return new NextResponse(data, {
      status: res.status,
      headers: { 'Content-Type': res.headers.get('Content-Type') || 'application/json' },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Proxy error';
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
