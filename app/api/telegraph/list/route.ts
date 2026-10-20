import { NextRequest, NextResponse } from 'next/server';

const WORKER_URL = process.env.NFTMAIL_WORKER_URL || 'https://worker.nftmail.box';
const WORKER_SECRET = process.env.WORKER_SECRET || '';

export async function GET(req: NextRequest) {
  try {
    const collection = (req.nextUrl.searchParams.get('collection') || '').toLowerCase().trim();
    const limit = Math.min(Number(req.nextUrl.searchParams.get('limit')) || 1000, 1000);

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (WORKER_SECRET) headers['X-Worker-Secret'] = WORKER_SECRET;

    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        action: 'listTelegraph',
        collection,
        limit,
      }),
      cache: 'no-store',
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: text || 'Worker lookup failed' }, { status: res.status });
    }

    const json = (await res.json()) as { items: Record<string, unknown>[] };
    const response = NextResponse.json(json);
    response.headers.set('Cache-Control', 'no-store');
    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'List failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
