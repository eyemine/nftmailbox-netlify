import { NextRequest, NextResponse } from 'next/server';

const WORKER_URL = process.env.NFTMAIL_WORKER_URL || 'https://nftmail-email-worker.richard-159.workers.dev';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      keyType: string;
      keyId: string;
      ownerAddress: string;
      claimedEmail: string;
    };

    const { keyType, keyId, ownerAddress, claimedEmail } = body;

    if (!keyType || !keyId || !ownerAddress || !claimedEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!['ens', 'nft-collection'].includes(keyType)) {
      return NextResponse.json({ error: 'keyType must be ens or nft-collection' }, { status: 400 });
    }

    if (!claimedEmail.endsWith('@nftmail.box')) {
      return NextResponse.json({ error: 'claimedEmail must end with @nftmail.box' }, { status: 400 });
    }

    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'claimSovereignInbox',
        keyType,
        keyId,
        ownerAddress: ownerAddress.toLowerCase(),
        claimedEmail,
      }),
    });

    const data = await res.json() as Record<string, unknown>;

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Claim failed' }, { status: 500 });
  }
}
