import { NextRequest, NextResponse } from 'next/server';

const WORKER_SECRET = process.env.WORKER_SECRET || '';
const ZOHO_MAIL_API = 'https://mail.zoho.com.au/api';

async function getZohoAccessToken(): Promise<string | null> {
  const existing = process.env.ZOHO_OAUTH_TOKEN;
  if (existing) return existing;

  const accountsDomain = process.env.ZOHO_ACCOUNTS_DOMAIN;
  const refreshToken = process.env.ZOHO_REFRESH_TOKEN;
  const clientId = process.env.ZOHO_CLIENT_ID;
  const clientSecret = process.env.ZOHO_CLIENT_SECRET;

  if (!accountsDomain || !refreshToken || !clientId || !clientSecret) return null;

  const form = new URLSearchParams();
  form.set('grant_type', 'refresh_token');
  form.set('refresh_token', refreshToken);
  form.set('client_id', clientId);
  form.set('client_secret', clientSecret);

  const res = await fetch(`https://${accountsDomain}/oauth/v2/token`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: form.toString(),
  });

  const data = (await res.json().catch(() => ({}))) as Record<string, any>;
  if (!res.ok) return null;
  return (data.access_token as string) || null;
}

interface ZohoMessage {
  messageId: string;
  subject: string;
  sender: string;
  fromAddress: string;
  receivedTime: string;
  summary: string;
  isRead: boolean;
  hasAttachment: boolean;
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
      // Decay policy comes from resolveAddress (the authority), NOT getBlindInbox.
      // `decayDays: null` = NEVER decays (Premium/Agent). A Free/Basic account
      // is 8 days, Pro 30. Agent addresses (trailing _) never decay.
      let accountDecayDays = 8;
      let decayIsNever = isAgentAddress;
      if (resolveRes.ok) {
        const rd = await resolveRes.json() as Record<string, any>;
        accountTier = rd.accountTier || null;
        controller = (rd.controller || '').toLowerCase();
        onChainOwner = (rd.onChainOwner || '').toLowerCase();
        safe = (rd.safe || '').toLowerCase();
        const tierLower = (accountTier || '').toLowerCase();
        // 'imago'/'ghost' are legacy aliases for Premium (kept for old KV values).
        if (['premium', 'imago', 'ghost'].includes(tierLower) || rd.decayDays === null) {
          decayIsNever = true;
        } else if (typeof rd.decayDays === 'number' && rd.decayDays > 0) {
          accountDecayDays = rd.decayDays;
        }
      }

      // Enforce auth gate for human accounts (no trailing _)
      if (!isAgentAddress) {
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
        kvMessages = (workerData.messages || []).map((m: any) => {
          const isEnc = m.encrypted === true;
          const now = Date.now();
          const receivedMs = m.receivedAt || now;
          const frozen = m.frozen === true;
          // A message never decays if it is frozen, or the account tier never
          // decays (Premium/Agent). Otherwise use per-message decayDays,
          // else the account default (8 Free/Basic / 30 Pro).
          const msgNever = frozen || decayIsNever;
          const msgDecayDays = m.decayDays ?? accountDecayDays;
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
        console.error('Worker KV fetch failed:', workerError);
      }
    } catch (e: any) {
      workerError = e?.message || String(e);
      console.error('Worker KV fetch error:', workerError);
    }

    // If we have KV messages, return them directly (KV is the source of truth)
    if (kvMessages.length > 0) {
      const active = kvMessages.filter((m: any) => !m.expired);
      const hasEncrypted = active.some((m: any) => m.encrypted);
      const hasCleartext = active.some((m: any) => !m.encrypted);
      const tier = hasEncrypted && !hasCleartext ? 'L2' : hasEncrypted ? 'L1' : 'L0';

      return NextResponse.json({
        messages: active,
        total: active.length,
        tier,
        accountTier,
      }, { headers: { 'Cache-Control': 'no-store' } });
    }

    // For human stream (no underscore or dot), try Zoho API as fallback
    const zohoOrgId = process.env.ZOHO_ORG_ID;
    const token = await getZohoAccessToken();
    if (!token || !zohoOrgId) {
      return NextResponse.json({ 
        messages: [], 
        tier: 'free',
        accountTier,
        ...(workerError ? { workerError } : {}),
      }, { headers: { 'Cache-Control': 'no-store' } });
    }

    // 1. Find the account ID for this email
    const accountsRes = await fetch(
      `${ZOHO_MAIL_API}/organization/${zohoOrgId}/accounts`,
      {
        headers: { Authorization: `Zoho-oauthtoken ${token}` },
      }
    );

    if (!accountsRes.ok) {
      return NextResponse.json(
        { error: `Zoho accounts API returned ${accountsRes.status}` },
        { status: 502, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const accountsData = (await accountsRes.json()) as Record<string, any>;
    const accounts = accountsData?.data || [];
    const account = accounts.find(
      (a: any) =>
        a.primaryEmailAddress?.toLowerCase() === email.toLowerCase() ||
        a.mailboxAddress?.toLowerCase() === email.toLowerCase()
    );

    if (!account) {
      // No Zoho mailbox provisioned — return empty inbox (free tier)
      return NextResponse.json({
        messages: [],
        tier: 'free',
        accountTier,
        note: 'No Zoho mailbox provisioned. Emails received via Cloudflare Worker routing.',
      }, { headers: { 'Cache-Control': 'no-store' } });
    }

    const accountId = account.accountId || account.zuid;

    // 2. Fetch inbox messages
    const messagesRes = await fetch(
      `${ZOHO_MAIL_API}/accounts/${accountId}/messages/view?folderId=inbox&limit=50&sortBy=date&sortOrder=desc`,
      {
        headers: { Authorization: `Zoho-oauthtoken ${token}` },
      }
    );

    if (!messagesRes.ok) {
      return NextResponse.json(
        { error: `Zoho messages API returned ${messagesRes.status}` },
        { status: 502, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const messagesData = (await messagesRes.json()) as Record<string, any>;
    const rawMessages = messagesData?.data || [];

    // 3. Zoho fallback — basic tier, 8-day decay
    const now = Date.now();
    const EIGHT_DAYS_MS = 8 * 24 * 60 * 60 * 1000;

    const messages = rawMessages.map((m: any) => {
      const receivedMs = parseInt(m.receivedTime, 10) || Date.parse(m.receivedTime) || now;
      const ageMs = now - receivedMs;
      const decayPct = Math.min(100, Math.round((ageMs / EIGHT_DAYS_MS) * 100));
      const expiresAt = new Date(receivedMs + EIGHT_DAYS_MS).toISOString();
      const expired = ageMs >= EIGHT_DAYS_MS;

      return {
        messageId: m.messageId,
        subject: m.subject || '(no subject)',
        sender: m.sender || m.fromAddress || 'unknown',
        fromAddress: m.fromAddress || '',
        receivedTime: m.receivedTime,
        summary: m.summary || '',
        isRead: m.flagid === '5' || m.status === '1',
        hasAttachment: m.hasAttachment === 'true' || m.hasAttachment === true,
        decayPct,
        expiresAt,
        expired,
      };
    });

    // Filter out expired messages (8-day decay)
    const activeMessages = messages.filter((m: any) => !m.expired);

    return NextResponse.json({
      messages: activeMessages,
      total: activeMessages.length,
      tier: 'premium',
      accountTier,
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (err: any) {
    console.error('Inbox error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to fetch inbox' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
