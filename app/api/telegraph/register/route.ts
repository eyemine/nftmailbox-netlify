import { NextRequest, NextResponse } from 'next/server';
import { isFaxEligible } from '@/app/lib/fax-eligibility';

const WORKER_URL = process.env.NFTMAIL_WORKER_URL || 'https://worker.nftmail.box';
const WORKER_SECRET = process.env.WORKER_SECRET || '';
const WEBHOOK_SECRET = process.env.NFTMAIL_WEBHOOK_SECRET || process.env.WEBHOOK_SECRET || '';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      handle?: string;
      wallet?: string;
      collection?: string;
      ready?: boolean;
      readyUntil?: number;
      vaultWallet?: string;
      tokenId?: string;
    };

    const handle = (body.handle || '').toLowerCase().trim();
    const wallet = (body.wallet || '').toLowerCase().trim();
    const collection = (body.collection || '').toLowerCase().trim();
    const ready = body.ready === true;
    const readyUntil = Number(body.readyUntil) || 0;
    const vaultWallet = (body.vaultWallet || '').toLowerCase().trim();
    const tokenId = (body.tokenId || '').trim();

    if (!handle || !wallet || !collection) {
      return NextResponse.json({ error: 'Missing handle, wallet, or collection' }, { status: 400 });
    }

    if (!/^0x[a-f0-9]{40}$/i.test(wallet)) {
      return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 });
    }

    const eligibility = await isFaxEligible(wallet, handle, collection, vaultWallet || undefined, tokenId || undefined);
    if (!eligibility.eligible) {
      return NextResponse.json({ error: eligibility.reason || 'Not eligible for this collection' }, { status: 403 });
    }

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (WORKER_SECRET) headers['X-Worker-Secret'] = WORKER_SECRET;

    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        action: 'setTelegraph',
        secret: WEBHOOK_SECRET,
        handle,
        wallet,
        collection,
        ready,
        readyUntil,
      }),
      cache: 'no-store',
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: text || 'Worker rejected registration' }, { status: res.status });
    }

    const json = (await res.json()) as { status: string; handle: string } | { error: string };
    return NextResponse.json(json, { status: res.status });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Registration failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
