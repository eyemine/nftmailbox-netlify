import { NextRequest, NextResponse } from 'next/server';
import { WORKER_URL } from '../../utils/config';

// GET /api/inbox?email=name@nftmail.box  — fetch inbox from KV worker for human accounts
export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email');
    if (!email || !email.endsWith('@nftmail.box')) {
      return NextResponse.json({ error: 'Invalid nftmail.box email' }, { status: 400 });
    }

    const localPart = email.replace('@nftmail.box', '');

    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'getInbox', localPart }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      return NextResponse.json({ error: `Worker error: ${res.status}`, messages: [], note: text }, { status: 200 });
    }

    const raw = await res.json() as { messages?: any[]; [key: string]: unknown };
    const messages = (raw.messages || []).map((m: any) => ({
      messageId: m.id || m.messageId || `msg-${Math.random().toString(36).slice(2)}`,
      subject: m.subject || '(no subject)',
      sender: m.sender || m.from || m.senderAgent || 'unknown',
      fromAddress: m.fromAddress || m.from || '',
      receivedTime: m.receivedTime || (m.receivedAt ? new Date(m.receivedAt).toISOString() : ''),
      summary: m.summary || m.content || '',
      body: m.body || m.content || '',
      bodyHtml: m.bodyHtml || '',
      encrypted: !!m.encrypted,
      isRead: m.isRead ?? false,
      hasAttachment: m.hasAttachment ?? false,
      decayPct: m.decayPct ?? 0,
      expiresAt: m.expiresAt || '',
    }));

    return NextResponse.json({ messages, tier: raw.tier || '', note: raw.note || '' });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to fetch inbox', messages: [] }, { status: 500 });
  }
}

// POST /api/inbox — agent status check (legacy)
export async function POST(request: Request) {
  try {
    const body = await request.json() as { agentName?: string };
    const { agentName } = body;

    if (!agentName) {
      return NextResponse.json({ error: 'Missing agentName' }, { status: 400 });
    }

    const localPart = `${agentName}_`;
    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'getAgentStatus', localPart }),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to fetch inbox' }, { status: 500 });
  }
}
