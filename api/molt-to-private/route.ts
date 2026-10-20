import { NextRequest, NextResponse } from 'next/server';

const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL || 'https://worker.nftmail.box';

const WORKER_SECRET = process.env.WORKER_SECRET || '';
/**
 * POST /api/molt-to-private
 * Body: { name: string, signature: string, newTld?: string }
 * 
 * Authenticated owner transitions a molt.gno agent to vault.gno (private).
 * Requires Safe signature for authorization.
 */
export async function POST(req: NextRequest) {
  try {
    const { name, signature, newTld } = await req.json();

    if (!name || !signature) {
      return NextResponse.json(
        { error: 'Missing name or signature' },
        { status: 400 }
      );
    }

    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Worker-Secret': WORKER_SECRET },
      body: JSON.stringify({
        action: 'moltToPrivate',
        localPart: name,
        signature,
        newTld: newTld || 'vault.gno',
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data.error || 'Worker error' }, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 });
  }
}
