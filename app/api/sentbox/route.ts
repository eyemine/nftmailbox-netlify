/// GET /api/sentbox?label=<local-part>
/// Fetch sent messages from KV via worker for a given label@nftmail.box address.
/// Messages stored by send-email API with full body content.

import { NextRequest, NextResponse } from 'next/server';
import { requireVerifiedWallet } from '@/app/lib/wallet-auth';

const WORKER_URL = process.env.NFTMAIL_WORKER_URL || 'https://worker.nftmail.box';

const WORKER_SECRET = process.env.WORKER_SECRET || '';
const NO_STORE = { 'Cache-Control': 'no-store' } as const;

export async function GET(req: NextRequest) {
  const label = req.nextUrl.searchParams.get('label');
  if (!label || !/^[a-z0-9_.-]+$/.test(label)) {
    return NextResponse.json({ error: 'Missing or invalid label' }, { status: 400 });
  }

  // Sent mail contains full bodies — require a verified wallet matching the
  // mailbox's on-chain owner before returning anything.
  const claimedWallet = req.nextUrl.searchParams.get('wallet') || undefined;
  const auth = await requireVerifiedWallet(req, claimedWallet, {
    signature: req.nextUrl.searchParams.get('signature') || undefined,
    signedAt: req.nextUrl.searchParams.get('signedAt') || undefined,
  });
  if ('res' in auth) return auth.res;
  const wallet = auth.wallet;

  try {
    const resolveRes = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Worker-Secret': WORKER_SECRET },
      body: JSON.stringify({ action: 'resolveAddress', name: label }),
      cache: 'no-store',
    });
    if (resolveRes.ok) {
      const resolved = await resolveRes.json() as Record<string, unknown>;
      if (resolved.exists === false) {
        return NextResponse.json({ error: 'Mailbox does not exist.' }, { status: 404, headers: NO_STORE });
      }
      const controller = (resolved.onChainOwner as string | undefined)?.toLowerCase();
      if (controller && controller !== wallet) {
        return NextResponse.json({ error: 'Wallet does not match the registered owner' }, { status: 403, headers: NO_STORE });
      }
    }

    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Worker-Secret': WORKER_SECRET },
      body: JSON.stringify({ action: 'getSentMessages', localPart: label }),
    });

    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as Record<string, unknown>;
      return NextResponse.json(
        { error: String(err.error || `Worker error ${res.status}`) },
        { status: res.status },
      );
    }

    const data = (await res.json()) as { messages?: Array<Record<string, unknown>> };
    const messages = (data.messages || []).map((msg: Record<string, unknown>) => ({
      id: String(msg.id || msg.sentId || ''),
      timestamp: Math.floor((msg.timestamp as number || msg.sentAt as number || Date.now()) / 1000),
      from: String(msg.from || ''),
      to: String(msg.to || ''),
      cc: msg.cc ? String(msg.cc) : undefined,
      bcc: msg.bcc ? String(msg.bcc) : undefined,
      subject: String(msg.subject || '(no subject)'),
      body: msg.body ? String(msg.body) : undefined,
      messageId: String(msg.messageId || msg.id || ''),
    }));

    return NextResponse.json({ label, messages }, { headers: NO_STORE });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch sentbox';
    console.error('[sentbox]', err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
