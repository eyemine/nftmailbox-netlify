import { NextRequest, NextResponse } from 'next/server';

const WORKER_SECRET = process.env.WORKER_SECRET || '';

function normalizeTimestamp(ts: unknown): number {
  if (ts == null) return Date.now();
  const n = typeof ts === 'number' ? ts : Number(ts);
  if (Number.isFinite(n) && n > 0) {
    // Timestamps < 1e11 ms are in the year 5138 in ms, so they are almost certainly Unix seconds.
    return n < 1e11 ? n * 1000 : n;
  }
  const parsed = typeof ts === 'string' ? Date.parse(ts) : NaN;
  return Number.isNaN(parsed) ? Date.now() : parsed;
}

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get('email');
    if (!email || !email.endsWith('@nftmail.box')) {
      return NextResponse.json({ error: 'Invalid nftmail.box email' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    }

    // Extract local part. Preserve trailing `_` so the agent inbox
    // (e.g. ghostagent_) stays distinct from the human inbox (ghostagent).
    const localPart = email.split('@')[0];
    const agentName = localPart;
    const isAgentAddress = localPart.endsWith('_');

    // ── Auth gate: non-agent (human) inboxes are private ──
    // Agent addresses (trailing _) are publicly readable.
    // All others require the caller to supply their ownerWallet, which must
    // match the controller recorded in the worker's KV.
    const ownerWalletParam = req.nextUrl.searchParams.get('ownerWallet')?.toLowerCase() || '';

    // Always fetch from Worker KV (all streams store here)
    const workerUrl = process.env.NFTMAIL_WORKER_URL || 'https://worker.nftmail.box';
    let kvMessages: any[] = [];
    let accountTier: string | null = null;

    let workerError = '';
    try {
      const [workerRes, resolveRes] = await Promise.all([
        fetch(workerUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Worker-Secret': WORKER_SECRET },
          body: JSON.stringify({ action: 'getBlindInbox', localPart: agentName }),
        }),
        fetch(workerUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Worker-Secret': WORKER_SECRET },
          body: JSON.stringify({ action: 'resolveAddress', name: agentName }),
        }),
      ]);

      let controller = '';
      let onChainOwner = '';
      let safe = '';
      let privacyTier = 'exposed';
      if (resolveRes.ok) {
        const rd = await resolveRes.json() as Record<string, any>;
        accountTier = rd.accountTier || null;
        privacyTier = (rd.privacyTier || 'exposed').toLowerCase();
        controller = (rd.controller || '').toLowerCase();
        onChainOwner = (rd.onChainOwner || '').toLowerCase();
        safe = (rd.safe || '').toLowerCase();
      }

      // Enforce auth gate for human accounts (no trailing _) unless explicitly public
      if (!isAgentAddress && privacyTier !== 'exposed') {
        if (!ownerWalletParam) {
          return NextResponse.json({ error: 'Authentication required to view this inbox', messages: [], total: 0 }, { status: 403, headers: { 'Cache-Control': 'no-store' } });
        }
        // If owner addresses are recorded, verify the caller matches one of them
        const hasOwnerRecord = !!(controller || onChainOwner || safe);
        if (hasOwnerRecord) {
          const isAuthorized = 
            (controller && ownerWalletParam === controller) ||
            (onChainOwner && ownerWalletParam === onChainOwner) ||
            (safe && ownerWalletParam === safe);
          if (!isAuthorized) {
            return NextResponse.json({ error: 'Wallet address does not match inbox owner', messages: [], total: 0 }, { status: 403, headers: { 'Cache-Control': 'no-store' } });
          }
        }
      }

      if (workerRes.ok) {
        const workerData = await workerRes.json() as Record<string, any>;
        // decayDays from resolveAddress: 8 for Larva, 30 for Pupa, null for Imago/Agent
        const acctDecayDays: number | null = workerData.decayDays ?? null;
        const normalizedTier = (accountTier || 'basic').toLowerCase();
        // Tier defaults: basic/larva 8 days, pro/pupa/lite 30 days, sovereign/imago/premium/ghost never decay
        const tierDefaultDays: number | null =
          normalizedTier === 'basic' ? 8 :
          ['pro', 'pupa', 'lite'].includes(normalizedTier) ? 30 :
          null;
        kvMessages = (workerData.messages || []).map((m: any) => {
          const isEnc = m.encrypted === true;
          const now = Date.now();
          const receivedMs = normalizeTimestamp(m.receivedAt || m.timestamp || now);
          const frozen = m.frozen === true;
          // Frozen emails never decay; use per-message decayDays if available, else account default
          const msgDecayDays: number | null = m.decayDays ?? acctDecayDays ?? tierDefaultDays;
          const ageMs = now - receivedMs;
          // null decayDays means the account has persistent history (never decay)
          const hasDecay = !frozen && msgDecayDays != null;
          const decayMs = hasDecay ? msgDecayDays * 24 * 60 * 60 * 1000 : null;
          const expired = hasDecay && decayMs != null && ageMs >= decayMs;
          const expiresAt = hasDecay && decayMs != null ? new Date(receivedMs + decayMs).toISOString() : null;
          const decayPct = hasDecay && decayMs != null ? Math.min(100, Math.round((ageMs / decayMs) * 100)) : 0;

          // PGP-encrypted detection: message body contains PGP/MIME markers
          const rawBody = m.payload?.body || '';
          const pgpEncrypted = !isEnc && (
            rawBody.includes('-----BEGIN PGP MESSAGE-----') ||
            rawBody.includes('multipart/encrypted') ||
            rawBody.includes('application/pgp-encrypted')
          );

          return {
            id: m.id,
            messageId: m.id,
            subject: isEnc ? '(encrypted)' : pgpEncrypted ? '(PGP encrypted)' : (m.payload?.subject || '(no subject)'),
            sender: isEnc ? '' : (m.payload?.from || 'unknown'),
            fromAddress: isEnc ? '' : (m.payload?.from || ''),
            receivedTime: new Date(receivedMs).toISOString(),
            summary: isEnc ? '' : pgpEncrypted ? '' : (m.payload?.body?.slice(0, 200) || ''),
            body: isEnc ? '' : rawBody,
            bodyHtml: isEnc ? '' : (m.payload?.bodyHtml || ''),
            isRead: false,
            hasAttachment: false,
            encrypted: isEnc,
            pgpEncrypted,
            type: m.type || '',
            contentHash: m.envelope?.contentHash || m.plaintextHash || '',
            frozen,
            decayDays: frozen ? null : msgDecayDays,
            decayPct,
            expiresAt,
            expired,
          };
        });
      } else {
        workerError = `Worker returned ${workerRes.status}: ${await workerRes.text().catch(() => '')}`;
        console.error('Worker KV fetch failed:', workerError);
      }
    } catch (e: any) {
      workerError = e?.message || String(e);
      console.error('Worker KV fetch error:', workerError);
    }

    // If we have KV messages, return them directly (KV is the source of truth)
    if (kvMessages.length > 0) {
      const active = kvMessages.filter((m: any) => !m.expired);
      const hasEncrypted = active.some((m: any) => m.encrypted || m.pgpEncrypted);
      const hasCleartext = active.some((m: any) => !m.encrypted && !m.pgpEncrypted);
      const tier = hasEncrypted && !hasCleartext ? 'L2' : hasEncrypted ? 'L1' : 'L0';

      return NextResponse.json({
        messages: active,
        total: active.length,
        tier,
        accountTier,
      }, { headers: { 'Cache-Control': 'no-store' } });
    }

    // No KV messages and no Zoho fallback — return empty inbox
    return NextResponse.json({
      messages: [],
      tier: 'free',
      accountTier,
      ...(workerError ? { workerError } : {}),
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (err: any) {
    console.error('Inbox error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to fetch inbox' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
