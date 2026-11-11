/// POST /api/attachment-settings
/// Toggle per-account attachment send/receive permissions.
/// Pro/Premium only. Auth via ownerWallet (verified against registered controller).

import { NextRequest, NextResponse } from 'next/server';
import { requireInboxOwner } from '@/app/lib/caller-auth';

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

    const { label, ownerWallet: claimedWallet, canSendAttachments, canReceiveAttachments } = body;

    if (!label) {
      return NextResponse.json({ error: 'Missing label' }, { status: 400 });
    }
    // ownerWallet is a claim; the caller token must prove control of label.
    const auth = await requireInboxOwner(req, label, claimedWallet);
    if ('res' in auth) return auth.res;
    const ownerWallet = auth.wallet;

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
