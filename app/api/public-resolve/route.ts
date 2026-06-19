/// GET/POST /api/public-resolve
///
/// Server-side proxy for read-only Cloudflare Worker actions called from the
/// public /inbox/[name] page. Adds X-Worker-Secret so the direct worker URL
/// (which requires auth) is never exposed to browsers.
///
/// Permitted actions (read-only):
///   resolveAddress  — existence + privacy metadata for any address
///   getInbox        — messages for agent (_) addresses only
///   getSentbox      — sent messages for agent (_) addresses only
///   getBlindInbox   — raw ECIES envelopes for agent addresses
///   classifyAddress — routing classification (no PII)
///   checkSendLimit  — tier/send-count check (no PII)
///
/// Mutation actions (setPrivacy, deleteMessage, purgeInbox, etc.) are
/// explicitly blocked — those require owner auth via the dashboard proxy.

import { NextRequest, NextResponse } from 'next/server';

const WORKER_URL = process.env.NFTMAIL_WORKER_URL || 'https://nftmail-email-worker.richard-159.workers.dev';
const WORKER_SECRET = process.env.WORKER_SECRET || '';

const READ_ONLY_ACTIONS = new Set([
  'resolveAddress',
  'getInbox',
  'getSentbox',
  'getBlindInbox',
  'classifyAddress',
  'checkSendLimit',
  'getStats',
]);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { action?: string; localPart?: string; name?: string; [key: string]: unknown };
    const action = body?.action;

    if (!action || !READ_ONLY_ACTIONS.has(action)) {
      return NextResponse.json({ error: 'Action not permitted via public proxy' }, { status: 403 });
    }

    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Worker-Secret': WORKER_SECRET,
      },
      body: JSON.stringify(body),
    });

    const data: unknown = await res.json();
    return NextResponse.json(data, {
      status: res.status,
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
