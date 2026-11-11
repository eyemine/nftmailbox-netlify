/// GET /api/tray/leaderboard
///
/// Mint leaderboard for the NFTfax chain-letter game, grouped by NFT collection.
/// Proxies the worker's getMintLeaderboard action.

import { NextRequest, NextResponse } from 'next/server';

const WORKER_URL = process.env.NFTMAIL_WORKER_URL || 'https://worker.nftmail.box';
const WORKER_SECRET = process.env.WORKER_SECRET || '';

export const dynamic = 'force-dynamic';

const NO_STORE = { 'Cache-Control': 'no-store' } as const;

export async function GET(_req: NextRequest) {
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (WORKER_SECRET) headers['X-Worker-Secret'] = WORKER_SECRET;
    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ action: 'getMintLeaderboard' }),
      cache: 'no-store',
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status, headers: NO_STORE });
  } catch {
    return NextResponse.json({ error: 'Leaderboard lookup failed' }, { status: 502, headers: NO_STORE });
  }
}
