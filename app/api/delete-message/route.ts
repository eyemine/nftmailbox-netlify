import { NextRequest, NextResponse } from 'next/server';
const WORKER_URL = process.env.NFTMAIL_WORKER_URL || 'https://worker.nftmail.box';
const WORKER_SECRET = process.env.WORKER_SECRET || '';
export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const res = await fetch(WORKER_URL, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Worker-Secret': WORKER_SECRET }, body });
    const data = await res.text();
    return new NextResponse(data, { status: res.status, headers: { 'Content-Type': res.headers.get('Content-Type') || 'application/json' } });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Proxy error' }, { status: 502 });
  }
}
