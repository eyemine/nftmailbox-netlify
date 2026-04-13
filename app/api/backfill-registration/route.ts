import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { label, owner, adminKey } = await req.json() as { label?: string; owner?: string; adminKey?: string };

    if (!label || typeof label !== 'string') {
      return NextResponse.json({ error: 'Missing label' }, { status: 400 });
    }
    if (!owner || !/^0x[a-fA-F0-9]{40}$/.test(owner)) {
      return NextResponse.json({ error: 'Invalid owner address' }, { status: 400 });
    }

    const workerUrl = process.env.NFTMAIL_WORKER_URL || 'https://nftmail-email-worker.richard-159.workers.dev';
    const webhookSecret = process.env.NFTMAIL_WEBHOOK_SECRET || '';

    // Gate: require adminKey matching NFTMAIL_WEBHOOK_SECRET (if set)
    if (webhookSecret && adminKey !== webhookSecret) {
      return NextResponse.json({ error: 'Unauthorized — pass adminKey' }, { status: 401 });
    }

    const kvRes = await fetch(workerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'registerSovereign',
        secret: webhookSecret,
        label,
        controller: owner,
        originNft: `${label}.nftmail.gno`,
        legacyIdentity: label,
        mintedTokenId: null,
        privacyTier: 'exposed',
      }),
    });
    const kvJson = await kvRes.json() as { status?: string; error?: string };

    if (kvRes.status === 409) {
      return NextResponse.json({ alreadyRegistered: true, message: `${label} is already registered in KV — check your dashboard.` });
    }
    if (!kvRes.ok) {
      return NextResponse.json({ error: kvJson.error || 'KV registration failed' }, { status: 502 });
    }

    return NextResponse.json({ success: true, label, email: `${label}@nftmail.box` });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Backfill failed' }, { status: 500 });
  }
}
