/// POST /api/attachment
/// Retrieve attachment data for a specific message.
/// Returns base64 attachment data so the frontend can offer download/preview.
///
/// Body: { label, messageId, ownerWallet }
/// Auth: ownerWallet must match the registered controller for the label.

import { NextRequest, NextResponse } from 'next/server';
import { requireInboxOwner } from '@/app/lib/caller-auth';

const WORKER_URL = process.env.NFTMAIL_WORKER_URL || 'https://worker.nftmail.box';
const WORKER_SECRET = process.env.WORKER_SECRET || '';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      label?: string;
      messageId?: string;
      ownerWallet?: string;
    };

    const { label, messageId, ownerWallet: claimedWallet } = body;

    if (!label || !messageId) {
      return NextResponse.json({ error: 'Missing label or messageId' }, { status: 400 });
    }
    // ownerWallet is a claim; the caller token must prove control of label.
    const auth = await requireInboxOwner(req, label, claimedWallet);
    if ('res' in auth) return auth.res;
    const ownerWallet = auth.wallet;

    // Verify ownership via resolveAddress
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

    // Fetch the full message from KV (includes attachment data)
    const msgRes = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Worker-Secret': WORKER_SECRET },
      body: JSON.stringify({ action: 'getBlindInbox', localPart: label }),
    });
    if (!msgRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 502 });
    }
    const msgData = (await msgRes.json()) as { messages?: Array<Record<string, unknown>> };
    const messages = msgData.messages || [];
    const msg = messages.find(m => m.id === messageId || m.messageId === messageId) as
      | (Record<string, unknown> & { attachments?: Array<{ filename: string; size: number; type: string; data?: string }>; envelope?: { attachments?: Array<{ filename: string; size: number; type: string; data?: string }> } })
      | undefined;

    if (!msg) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    const attachments = msg.attachments || msg.envelope?.attachments;

    if (!attachments || attachments.length === 0) {
      return NextResponse.json({ error: 'No attachments on this message' }, { status: 404 });
    }

    return NextResponse.json({
      messageId,
      attachments: attachments.map(a => ({
        filename: a.filename,
        size: a.size,
        type: a.type,
        data: a.data || null,
      })),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Attachment retrieval failed';
    console.error('[attachment]', err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
