/// POST /api/send
/// Low-level send route used by internal tooling and agent-to-human outbound.
/// Sends via Mailgun — From address is always the real sender, never a relay.
/// For the full tier-gated UI send path, use /api/send-email instead.

import { NextRequest, NextResponse } from 'next/server';

const MAILGUN_API_BASE = process.env.MAILGUN_API_BASE || 'https://api.eu.mailgun.net/v3';
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN || 'nftmail.box';
const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL || 'https://nftmail-email-worker.richard-159.workers.dev';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      fromEmail?: string;
      toAddress?: string;
      subject?: string;
      content?: string;
      html?: string;
      ownerWallet?: string;
    };

    const { fromEmail, toAddress, subject, content, html, ownerWallet } = body;

    if (!fromEmail || (!fromEmail.endsWith('@nftmail.box') && !fromEmail.endsWith('@ghostmail.box'))) {
      return NextResponse.json({ error: 'Invalid sender — must be @nftmail.box or @ghostmail.box' }, { status: 400 });
    }
    if (!toAddress || !toAddress.includes('@')) {
      return NextResponse.json({ error: 'Invalid recipient address' }, { status: 400 });
    }
    if (!content?.trim() && !html) {
      return NextResponse.json({ error: 'Message body is required' }, { status: 400 });
    }
    if (!subject?.trim()) {
      return NextResponse.json({ error: 'Subject is required' }, { status: 400 });
    }

    // ── Ownership verification ──────────────────────────────────────────────
    if (!ownerWallet || !/^0x[a-fA-F0-9]{40}$/.test(ownerWallet)) {
      return NextResponse.json({ error: 'ownerWallet required' }, { status: 401 });
    }
    const localPart = fromEmail.split('@')[0];
    try {
      const resolveRes = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'resolveAddress', name: localPart }),
      });
      const resolved = await resolveRes.json() as Record<string, unknown>;
      if (!resolved?.exists) {
        return NextResponse.json({ error: 'Sender address does not exist' }, { status: 404 });
      }
      const onChainOwner = (resolved.onChainOwner as string | undefined)?.toLowerCase();
      const safe = (resolved.safe as string | undefined)?.toLowerCase();
      const wallet = ownerWallet.toLowerCase();
      if (onChainOwner && onChainOwner !== wallet && safe !== wallet) {
        return NextResponse.json({ error: 'Wallet does not own this address' }, { status: 403 });
      }

      // ── Freemium send limit (10 emails for basic tier) ──────────────────
      const accountTier = ((resolved.accountTier as string | undefined) || 'basic').toLowerCase();
      const sendCountRes = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'checkAndIncrementSendCount', localPart: localPart, tier: accountTier }),
      });
      const sendCount = await sendCountRes.json() as { allowed: boolean; remaining: number | null; count: number; limit: number | null };
      if (!sendCount.allowed) {
        return NextResponse.json({
          error: `Free tier send limit reached (${sendCount.limit} emails). Upgrade to PUPA to continue sending.`,
          upgradeUrl: '/nftmail',
          tier: 'basic',
          sendCount: sendCount.count,
        }, { status: 402 });
      }
    } catch {
      return NextResponse.json({ error: 'Could not verify sender ownership' }, { status: 503 });
    }
    // ───────────────────────────────────────────────────────────────────────

    const apiKey = process.env.MAILGUN_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'MAILGUN_API_KEY not configured' }, { status: 503 });
    }

    const label = fromEmail.replace('@nftmail.box', '').replace('@ghostmail.box', '');
    const mailgunDomain = fromEmail.endsWith('@ghostmail.box')
      ? (process.env.MAILGUN_GHOSTMAIL_DOMAIN || 'ghostmail.box')
      : MAILGUN_DOMAIN;
    const form = new URLSearchParams();
    form.set('from', `${label} <${fromEmail}>`);
    form.set('to', toAddress);
    form.set('subject', subject || '(no subject)');
    if (html) {
      form.set('html', html);
      form.set('text', content || html.replace(/<[^>]+>/g, ''));
    } else {
      form.set('text', content || '');
    }

    const res = await fetch(`${MAILGUN_API_BASE}/${mailgunDomain}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${btoa(`api:${apiKey}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: form.toString(),
    });

    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as Record<string, unknown>;
      return NextResponse.json(
        { error: String(err.message || `Mailgun error ${res.status}`) },
        { status: 502 },
      );
    }

    const data = (await res.json()) as Record<string, unknown>;
    const mailgunMessageId = String(data.id || 'sent');

    // Store in sent folder — non-fatal
    try {
      await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'storeSentMessage',
          localPart: label,
          payload: {
            to: toAddress,
            from: fromEmail,
            subject: subject || '(no subject)',
            body: content || '',
            messageId: mailgunMessageId,
          },
        }),
      });
    } catch {}

    return NextResponse.json({
      success: true,
      messageId: mailgunMessageId,
      from: fromEmail,
      to: toAddress,
      via: 'mailgun',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to send email';
    console.error('[send]', err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
