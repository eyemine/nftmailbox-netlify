import { NextRequest, NextResponse } from 'next/server';
import { WORKER_URL } from '../../utils/config';

// GET /api/inbox?email=name@nftmail.box  — fetch inbox from KV worker (getBlindInbox)
export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email');
    if (!email || !email.endsWith('@nftmail.box')) {
      return NextResponse.json({ error: 'Invalid nftmail.box email' }, { status: 400 });
    }

    // Strip @nftmail.box and strip .agent suffix (agent alias → identity name)
    const localPart = email.split('@')[0];
    const agentName = localPart.endsWith('.agent') ? localPart.slice(0, -6) : localPart;

    let workerError = '';
    let kvMessages: any[] = [];

    try {
      const workerRes = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'getBlindInbox', localPart: agentName }),
      });

      if (workerRes.ok) {
        const workerData = await workerRes.json() as Record<string, any>;
        const acctDecayDays: number | null = workerData.decayDays ?? null;

        kvMessages = (workerData.messages || []).map((m: any) => {
          const isEnc = m.encrypted === true;
          const now = Date.now();
          // Defensive timestamp parsing: handle seconds (Unix), milliseconds, or ISO string
          let rawRa = m.receivedAt || m.timestamp || m.createdAt || 0;
          if (typeof rawRa === 'string') rawRa = Date.parse(rawRa) || 0;
          // If < year 2000 in ms (≈946684800000), treat as seconds and convert
          const receivedMs = rawRa > 0 && rawRa < 946684800000 ? rawRa * 1000 : (rawRa || now);
          console.log(`[inbox] msg ${m.id}: rawRa=${m.receivedAt}, receivedMs=${receivedMs}, date=${new Date(receivedMs).toISOString()}`);
          const frozen = m.frozen === true;
          const msgDecayDays = m.decayDays ?? acctDecayDays ?? 8;
          const decayMs = msgDecayDays * 24 * 60 * 60 * 1000;
          const ageMs = now - receivedMs;

          return {
            id: m.id,
            messageId: m.id,
            subject: isEnc ? '(encrypted)' : (m.payload?.subject || '(no subject)'),
            sender: isEnc ? '' : (m.payload?.from || 'unknown'),
            fromAddress: isEnc ? '' : (m.payload?.from || ''),
            receivedTime: new Date(receivedMs).toISOString(),
            summary: isEnc ? '' : (m.payload?.body?.slice(0, 200) || ''),
            body: isEnc ? '' : (m.payload?.body || ''),
            bodyHtml: isEnc ? '' : (m.payload?.bodyHtml || ''),
            isRead: false,
            hasAttachment: false,
            encrypted: isEnc,
            type: m.type || '',
            contentHash: m.envelope?.contentHash || m.plaintextHash || '',
            frozen,
            decayDays: frozen ? null : msgDecayDays,
            decayPct: frozen ? 0 : Math.min(100, Math.round((ageMs / decayMs) * 100)),
            expiresAt: frozen ? null : new Date(receivedMs + decayMs).toISOString(),
            expired: !frozen && ageMs >= decayMs,
          };
        });
      } else {
        workerError = `Worker returned ${workerRes.status}: ${await workerRes.text().catch(() => '')}`;
        console.error('Worker getBlindInbox failed:', workerError);
      }
    } catch (e: any) {
      workerError = e?.message || String(e);
      console.error('Worker getBlindInbox error:', workerError);
    }

    const active = kvMessages.filter((m: any) => !m.expired);
    const hasEncrypted = active.some((m: any) => m.encrypted);
    const hasCleartext = active.some((m: any) => !m.encrypted);
    const tier = hasEncrypted && !hasCleartext ? 'L2' : hasEncrypted ? 'L1' : 'L0';

    return NextResponse.json({
      messages: active,
      total: active.length,
      tier,
      ...(workerError ? { note: workerError } : {}),
    });
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
