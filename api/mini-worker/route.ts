import { NextRequest, NextResponse } from 'next/server';
const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL || process.env.NFTMAIL_WORKER_URL || 'https://worker.nftmail.box';
const WORKER_SECRET = process.env.WORKER_SECRET || '';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    // Proxy runs server-side, so the secret never reaches the client. The Hetzner
    // worker requires X-Worker-Secret for all JSON actions (including getAgentProfile),
    // so always attach it when configured.
    if (WORKER_SECRET) {
      headers['X-Worker-Secret'] = WORKER_SECRET;
    }
    const res = await fetch(WORKER_URL, { method: 'POST', headers, body });
    const data = await res.text();
    return new NextResponse(data, {
      status: res.status,
      headers: {
        'Content-Type': res.headers.get('Content-Type') || 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Proxy error' }, { status: 502 });
  }
}
