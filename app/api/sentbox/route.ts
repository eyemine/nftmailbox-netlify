/// GET /api/sentbox?label=<local-part>
/// Fetch sent messages from Mailgun Events API for a given label@nftmail.box address.
/// Mailgun retains events for 30+ days depending on plan.

import { NextRequest, NextResponse } from 'next/server';

const MAILGUN_API_BASE = process.env.MAILGUN_API_BASE || 'https://api.eu.mailgun.net/v3';
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN || 'mg.nftmail.box';

export async function GET(req: NextRequest) {
  const label = req.nextUrl.searchParams.get('label');
  if (!label || !/^[a-z0-9_.-]+$/.test(label)) {
    return NextResponse.json({ error: 'Missing or invalid label' }, { status: 400 });
  }

  const apiKey = process.env.MAILGUN_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'MAILGUN_API_KEY not configured' }, { status: 500 });
  }

  const from = `${label}@nftmail.box`;

  try {
    const params = new URLSearchParams({
      event: 'accepted',
      from,
      limit: '100',
      ascending: 'no',
    });

    const res = await fetch(
      `${MAILGUN_API_BASE}/${MAILGUN_DOMAIN}/events?${params.toString()}`,
      {
        headers: {
          Authorization: `Basic ${btoa(`api:${apiKey}`)}`,
        },
      },
    );

    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as Record<string, unknown>;
      return NextResponse.json(
        { error: String(err.message || `Mailgun error ${res.status}`) },
        { status: res.status },
      );
    }

    const data = (await res.json()) as { items?: Array<Record<string, unknown>> };
    const items = data.items || [];

    const messages = items.map((item: Record<string, unknown>) => {
      const message = (item.message as Record<string, unknown>) || {};
      const headers = (message.headers as Record<string, unknown>) || {};
      const recipients = (message.recipients as string[]) || [];
      const envelope = (item.envelope as Record<string, unknown>) || {};
      return {
        id: String(item.id || ''),
        timestamp: Number(item.timestamp || 0),
        event: String(item.event || 'accepted'),
        from: String(envelope.sender || from),
        to: recipients.join(', ') || String(envelope.targets || ''),
        subject: String(headers.subject || '(no subject)'),
        messageId: String(headers['message-id'] || ''),
        recipient: String(item.recipient || ''),
      };
    });

    return NextResponse.json({ label, messages });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch sentbox';
    console.error('[sentbox]', err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
