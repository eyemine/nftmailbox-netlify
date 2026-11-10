/// POST /api/attachment-settings
/// Toggle per-account attachment send/receive permissions.
/// Pro/Premium only. Auth via ownerWallet (verified against registered controller).

import { NextRequest, NextResponse } from 'next/server';

const WORKER_URL = process.env.NFTMAIL_WORKER_URL || 'https://worker.nftmail.box';
const WORKER_SECRET = process.env.WORKER_SECRET || '';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      label?: string;
      ownerWallet?: string;
      canSendAttachments?: boolean;
      canReceiveAttachments?: boolean;
    };

    const { label, ownerWallet, canSendAttachments, canReceiveAttachments } = body;

    if (!label) {
      return NextResponse.json({ error: 'Missing label' }, { status: 400 });
    }
    if (!ownerWallet || !/^0x[a-fA-F0-9]{40}$/.test(ownerWallet)) {
      return NextResponse.json({ error: 'ownerWallet required for auth' }, { status: 401 });
    }

    // Verify ownership
    const resolveRes = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Worker-Secret': WORKER_SECRET },
      body: JSON.stringify({ action: 'resolveAddress', name: label }),
    });
    if (!resolveRes.ok) {
      return NextResponse.json({ error: 'Worker auth failed' }, { status: 502 });
    }
    const resolved = (await resolveRes.json()) as Record<string, unknown>;
    if (!resolved?.exists) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }
    const controller = (resolved.onChainOwner as string | undefined)?.toLowerCase();
    if (controller && controller !== ownerWallet.toLowerCase()) {
      return NextResponse.json({ error: 'Wallet does not match registered owner' }, { status: 403 });
    }

    // Update attachment settings via worker
    const updateRes = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Worker-Secret': WORKER_SECRET },
      body: JSON.stringify({
        action: 'setAttachmentSettings',
        agentName: label,
        secret: WORKER_SECRET,
        canSendAttachments,
        canReceiveAttachments,
      }),
    });
    if (!updateRes.ok) {
      const errText = await updateRes.text().catch(() => '');
      return NextResponse.json(
        { error: `Worker update failed: ${errText}` },
        { status: updateRes.status }
      );
    }
    const data = await updateRes.json();
    return NextResponse.json(data);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Settings update failed';
    console.error('[attachment-settings]', err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
