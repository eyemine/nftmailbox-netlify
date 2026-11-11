/// POST /api/send-email
/// Send email on behalf of a label@nftmail.box address.
///
/// Auth: ownerWallet in body (verified against KV-registered controller)
///
/// Tier gate: basic = 10 sends, 1 recipient, no CC/BCC. lite/premium/ghost = higher limits.
///
/// Send strategy:
///   - All tiers (lite, premium, ghost): Mailgun API, From: label@nftmail.box
///     True per-address sending — no relay, no ghostagent@nftmail.box in the envelope.
///   - PGP/MIME encryption when recipient key available (Phase C).

import { NextRequest, NextResponse } from 'next/server';
import * as openpgp from 'openpgp';
import { requireVerifiedWallet } from '@/app/lib/wallet-auth';

const WORKER_URL = process.env.NFTMAIL_WORKER_URL || 'https://worker.nftmail.box';

const WORKER_SECRET = process.env.WORKER_SECRET || '';

// Internal domains whose recipients' PGP keys are resolvable via the worker
// registry (getPgpKey). External recipients require WKD/keyserver discovery,
// which is Phase D — until then, external encryption needs an explicit
// recipientPublicKey or a client-encrypted (pgpArmored) payload.
const INTERNAL_PGP_DOMAINS = ['nftmail.box', 'ghostmail.box'];

// ─── Basic-tier monthly send quota ─────────────────────────────────────────
// 10 sends per calendar month (UTC), matching the fax-side basic allowance
// (MONTHLY_FREE_SENDS in app/lib/fax-credits.ts). Month-keyed worker KV — a
// new key each month means the count resets naturally without a cron.
const BASIC_MONTHLY_SEND_LIMIT = 10;
const WEBHOOK_SECRET = process.env.NFTMAIL_WEBHOOK_SECRET || process.env.WEBHOOK_SECRET || '';

async function sendCountKvGet(key: string): Promise<string | null> {
  try {
    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Worker-Secret': WORKER_SECRET },
      body: JSON.stringify({ action: 'kvGet', key }),
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { value: string | null };
    return data.value;
  } catch {
    return null;
  }
}

async function sendCountKvPut(key: string, value: string, ownerAddress: string) {
  await fetch(WORKER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Worker-Secret': WORKER_SECRET },
    body: JSON.stringify({
      action: 'kvPut',
      key,
      value,
      ownerAddress: ownerAddress.toLowerCase(),
      webhookSecret: WEBHOOK_SECRET,
    }),
    cache: 'no-store',
  });
}

/// Returns remaining monthly sends for a basic account; -1 when the counter
/// cannot be read (caller should fail open, not block sends on quota bugs).
async function monthlySendBudget(label: string): Promise<number> {
  const month = new Date().toISOString().slice(0, 7);
  const raw = await sendCountKvGet(`email-send-count:${label.toLowerCase()}:${month}`);
  if (raw === null) return BASIC_MONTHLY_SEND_LIMIT;
  const used = parseInt(raw, 10);
  return isNaN(used) ? BASIC_MONTHLY_SEND_LIMIT : BASIC_MONTHLY_SEND_LIMIT - used;
}

async function recordMonthlySend(label: string, ownerAddress: string): Promise<void> {
  const month = new Date().toISOString().slice(0, 7);
  const key = `email-send-count:${label.toLowerCase()}:${month}`;
  const raw = await sendCountKvGet(key);
  const used = raw ? parseInt(raw, 10) || 0 : 0;
  await sendCountKvPut(key, String(used + 1), ownerAddress);
}

// ─── Rate Limiting ─────────────────────────────────────────────────────────
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 30; // 30 emails per hour per IP per label
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string, label: string): { allowed: boolean; retryAfter?: number } {
  const key = `${ip}:${label}`;
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true };
  }
  
  if (entry.count >= RATE_LIMIT_MAX) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, retryAfter };
  }
  
  entry.count++;
  return { allowed: true };
}

// ─── Tier-based HTML Sanitization ───────────────────────────────────────────
function sanitizeHtmlForTier(html: string, tier: string): string {
  const normalizedTier = tier.toLowerCase();
  
  // Premium/Pro tiers: allow full HTML (strip dangerous tags only)
  if (normalizedTier === 'premium' || normalizedTier === 'pro' || 
      normalizedTier === 'imago' || normalizedTier === 'pupa' ||
      normalizedTier === 'ghost' || normalizedTier === 'lite') {
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/on\w+\s*=/gi, 'data-blocked-on=')
      .replace(/javascript:/gi, 'blocked-js:');
  }
  
  // Basic/Free tiers: strip all HTML to plain text
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

// ─── Tier-based Sending Privileges (CC/BCC, Multi-send) ────────────────────
function validateTierPrivileges(
  tier: string, 
  to: string, 
  cc: string | undefined, 
  bcc: string | undefined
): { allowed: boolean; error?: string } {
  const normalizedTier = tier.toLowerCase();
  const toCount = to.split(',').filter(e => e.trim()).length;
  const ccCount = cc ? cc.split(',').filter(e => e.trim()).length : 0;
  const bccCount = bcc ? bcc.split(',').filter(e => e.trim()).length : 0;
  const totalRecipients = toCount + ccCount + bccCount;
  
  // Basic/Free tier: 1 recipient, no CC/BCC (10-send limit enforced by worker)
  if (normalizedTier === 'basic' || normalizedTier === 'free') {
    if (ccCount > 0 || bccCount > 0) {
      return { allowed: false, error: 'Basic tier cannot use CC/BCC' };
    }
    if (totalRecipients > 1) {
      return { allowed: false, error: 'Basic tier limited to 1 recipient' };
    }
    return { allowed: true };
  }
  
  // Lite tier: max 1 CC/BCC, max 3 total recipients
  if (normalizedTier === 'lite') {
    if (ccCount > 1 || bccCount > 1) {
      return { allowed: false, error: 'Lite tier limited to 1 CC/BCC address' };
    }
    if (totalRecipients > 3) {
      return { allowed: false, error: 'Lite tier limited to 3 total recipients' };
    }
    return { allowed: true };
  }
  
  // Pro/Pupa tier: max 2 CC/BCC, max 5 total recipients
  if (normalizedTier === 'pro' || normalizedTier === 'pupa') {
    if (ccCount > 2 || bccCount > 2) {
      return { allowed: false, error: 'Pro tier limited to 2 CC/BCC addresses' };
    }
    if (totalRecipients > 5) {
      return { allowed: false, error: 'Pro tier limited to 5 total recipients' };
    }
    return { allowed: true };
  }
  
  // Premium/Imago/Ghost tier: unlimited
  return { allowed: true };
}
const MAILGUN_API_BASE = process.env.MAILGUN_API_BASE || 'https://api.eu.mailgun.net/v3';
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN || 'mg.nftmail.box';

async function sendViaMailgun(params: {
  from: string;
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  html: string;
  text: string;
  attachments?: Array<{ filename: string; contentType: string; data: string }>;
}): Promise<{ messageId: string }> {
  const apiKey = process.env.MAILGUN_API_KEY;
  if (!apiKey) throw new Error('MAILGUN_API_KEY not configured');

  const hasAttachments = params.attachments && params.attachments.length > 0;

  if (hasAttachments) {
    // Use multipart/form-data for attachments (Mailgun supports this)
    const formData = new FormData();
    formData.set('from', params.from);
    formData.set('to', params.to);
    if (params.cc) formData.set('cc', params.cc);
    if (params.bcc) formData.set('bcc', params.bcc);
    formData.set('subject', params.subject);
    formData.set('html', params.html);
    formData.set('text', params.text);

    for (const att of params.attachments!) {
      // Convert base64 to Blob
      const binaryStr = atob(att.data);
      const bytes = new Uint8Array(binaryStr.length);
      for (let i = 0; i < binaryStr.length; i++) bytes[i] = binaryStr.charCodeAt(i);
      const blob = new Blob([bytes], { type: att.contentType || 'application/octet-stream' });
      formData.append('attachment', blob, att.filename);
    }

    const res = await fetch(`${MAILGUN_API_BASE}/${MAILGUN_DOMAIN}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${btoa(`api:${apiKey}`)}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as Record<string, unknown>;
      throw new Error(String(err.message || `Mailgun error ${res.status}`));
    }

    const data = (await res.json()) as Record<string, unknown>;
    return { messageId: String(data.id || 'sent') };
  }

  // No attachments — use URL-encoded form (original path)
  const form = new URLSearchParams();
  form.set('from', params.from);
  form.set('to', params.to);
  if (params.cc) form.set('cc', params.cc);
  if (params.bcc) form.set('bcc', params.bcc);
  form.set('subject', params.subject);
  form.set('html', params.html);
  form.set('text', params.text);

  const res = await fetch(`${MAILGUN_API_BASE}/${MAILGUN_DOMAIN}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${btoa(`api:${apiKey}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: form.toString(),
  });

  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    throw new Error(String(err.message || `Mailgun error ${res.status}`));
  }

  const data = (await res.json()) as Record<string, unknown>;
  return { messageId: String(data.id || 'sent') };
}

// ─── PGP helpers (Phase C) ──────────────────────────────────────────────────

function randomToken(bytes = 12): string {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr).map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Base64-encode a UTF-8 string and wrap at 76 chars per RFC 2045.
function toBase64Mime(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  const b64 = btoa(bin);
  return b64.replace(/(.{76})/g, '$1\r\n');
}

// Look up a recipient's armored PGP public key from the worker registry.
// Returns null for external recipients (pre-WKD) or when no key is registered.
async function lookupRecipientPgpKey(to: string): Promise<string | null> {
  const [local, domain] = to.toLowerCase().trim().split('@');
  if (!local || !domain || !INTERNAL_PGP_DOMAINS.includes(domain)) return null;
  try {
    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Worker-Secret': WORKER_SECRET },
      body: JSON.stringify({ action: 'getPgpKey', agentName: local }),
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { hasKey?: boolean; publicKey?: string };
    return data.hasKey && data.publicKey ? data.publicKey : null;
  } catch {
    return null;
  }
}

// Encrypt a text+html body to recipient key(s) and wrap it as an RFC 3156
// PGP/MIME (multipart/encrypted) message. Returns the raw MIME string.
async function buildPgpMimeFromPlaintext(opts: {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
  cc?: string;
  bcc?: string;
  recipientPublicKeysArmored: string[];
}): Promise<string> {
  const innerBoundary = `nftmail-inner-${randomToken(8)}`;
  const innerMime =
    `Content-Type: multipart/alternative; boundary="${innerBoundary}"\r\n\r\n` +
    `--${innerBoundary}\r\n` +
    `Content-Type: text/plain; charset=utf-8\r\n` +
    `Content-Transfer-Encoding: base64\r\n\r\n` +
    `${toBase64Mime(opts.text)}\r\n\r\n` +
    `--${innerBoundary}\r\n` +
    `Content-Type: text/html; charset=utf-8\r\n` +
    `Content-Transfer-Encoding: base64\r\n\r\n` +
    `${toBase64Mime(opts.html)}\r\n\r\n` +
    `--${innerBoundary}--\r\n`;

  const encryptionKeys = await Promise.all(
    opts.recipientPublicKeysArmored.map((armoredKey) => openpgp.readKey({ armoredKey })),
  );
  const message = await openpgp.createMessage({ text: innerMime });
  const armored = (await openpgp.encrypt({ message, encryptionKeys, format: 'armored' })) as string;

  return wrapArmoredInPgpMime({ from: opts.from, to: opts.to, cc: opts.cc, bcc: opts.bcc, subject: opts.subject, armored });
}

// Wrap an already-armored PGP message (e.g. client-encrypted, E2EE) as a
// PGP/MIME message. Headers (From/To/Subject) are cleartext — PGP/MIME does
// not encrypt envelope metadata.
function wrapArmoredInPgpMime(opts: { from: string; to: string; subject: string; armored: string; cc?: string; bcc?: string }): string {
  const boundary = `nftmail-pgp-${randomToken(8)}`;
  const headers = [
    `From: ${opts.from}`,
    `To: ${opts.to}`,
    `Subject: ${opts.subject}`,
  ];
  if (opts.cc) headers.push(`Cc: ${opts.cc}`);
  if (opts.bcc) headers.push(`Bcc: ${opts.bcc}`);
  headers.push(
    `MIME-Version: 1.0`,
    `Content-Type: multipart/encrypted; protocol="application/pgp-encrypted"; boundary="${boundary}"`,
    ``,
    `This is an OpenPGP/MIME encrypted message (RFC 3156).`,
    ``,
    `--${boundary}`,
    `Content-Type: application/pgp-encrypted`,
    `Content-Description: PGP/MIME version identification`,
    ``,
    `Version: 1`,
    ``,
    `--${boundary}`,
    `Content-Type: application/octet-stream; name="encrypted.asc"`,
    `Content-Description: OpenPGP encrypted message`,
    `Content-Disposition: inline; filename="encrypted.asc"`,
    ``,
    opts.armored,
    `--${boundary}--`,
    ``,
  );
  return headers.join('\r\n');
}

// Send a raw MIME message via Mailgun's messages.mime endpoint.
async function sendMimeViaMailgun(params: { to: string; cc?: string; bcc?: string; mime: string }): Promise<{ messageId: string }> {
  const apiKey = process.env.MAILGUN_API_KEY;
  if (!apiKey) throw new Error('MAILGUN_API_KEY not configured');

  const form = new FormData();
  form.set('to', params.to);
  if (params.cc) form.set('cc', params.cc);
  if (params.bcc) form.set('bcc', params.bcc);
  form.append('message', new Blob([params.mime], { type: 'message/rfc822' }), 'message.mime');

  const res = await fetch(`${MAILGUN_API_BASE}/${MAILGUN_DOMAIN}/messages.mime`, {
    method: 'POST',
    headers: { Authorization: `Basic ${btoa(`api:${apiKey}`)}` },
    body: form,
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    throw new Error(String(err.message || `Mailgun MIME error ${res.status}`));
  }
  const data = (await res.json()) as Record<string, unknown>;
  return { messageId: String(data.id || 'sent') };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      label?: string;
      domain?: string;
      ownerWallet?: string;
      signature?: string;
      signedAt?: number;
      to?: string;
      subject?: string;
      body?: string;
      cc?: string;
      bcc?: string;
      replyToMessageId?: string;
      // ── PGP (Phase C) ──
      pgpArmored?: string;        // client-encrypted armored ciphertext (true E2EE); server never sees plaintext
      recipientPublicKey?: string; // explicit armored recipient key for server-side encryption (e.g. external)
      disablePgp?: boolean;        // force cleartext even if a recipient key is available
      attachments?: Array<{ filename: string; contentType: string; data: string }>; // base64-encoded attachment data
    };

    const { label, domain, ownerWallet, to, subject, cc, bcc } = body;
    const mailBody = body.body || '';
    const fromDomain = domain || 'nftmail.box';

    if (!label || typeof label !== 'string') {
      return NextResponse.json({ error: 'Missing label' }, { status: 400 });
    }
    const auth = await requireVerifiedWallet(req, ownerWallet, {
      signature: body.signature,
      signedAt: body.signedAt,
    });
    if ('res' in auth) return auth.res;
    const verifiedWallet = auth.wallet;
    if (!to || !to.includes('@')) {
      return NextResponse.json({ error: 'Invalid recipient address' }, { status: 400 });
    }
    if (!subject && !mailBody) {
      return NextResponse.json({ error: 'Subject or body required' }, { status: 400 });
    }

    // ── Resolve address + verify ownership ──────────────────────────────────
    const resolveRes = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Worker-Secret': WORKER_SECRET },
      body: JSON.stringify({ action: 'resolveAddress', name: label, domain: fromDomain }),
    });
    if (!resolveRes.ok) {
      const errText = await resolveRes.text().catch(() => '');
      console.error(`send-email: worker resolveAddress returned ${resolveRes.status} — ${errText}`);
      return NextResponse.json({ error: `Worker auth failed (${resolveRes.status}). Check WORKER_SECRET config.` }, { status: 502 });
    }
    const resolved = (await resolveRes.json()) as Record<string, unknown>;

    if (!resolved?.exists) {
      return NextResponse.json({ error: 'This address does not exist' }, { status: 404 });
    }

    const controller = (resolved.onChainOwner as string | undefined)?.toLowerCase();
    if (controller && controller !== verifiedWallet) {
      return NextResponse.json({ error: 'Wallet does not match the registered owner' }, { status: 403 });
    }

    const accountTier = (resolved.accountTier as string | undefined) || 'basic';
    const canSendAttachments = resolved.canSendAttachments === true;

    const fromEmail = `${label}@${fromDomain}`;

    // ── Attachment gate: only Pro/Premium with canSendAttachments enabled ──
    const attachments = body.attachments || [];
    if (attachments.length > 0) {
      if (!canSendAttachments) {
        return NextResponse.json(
          { error: 'Attachments are not enabled for this account. Enable in Settings (Pro/Premium required).' },
          { status: 403 }
        );
      }
      // 500KB max per attachment, max 3 attachments
      if (attachments.length > 3) {
        return NextResponse.json({ error: 'Maximum 3 attachments per email' }, { status: 400 });
      }
      for (const att of attachments) {
        const sizeBytes = Math.ceil((att.data || '').length * 3 / 4);
        if (sizeBytes > 500000) {
          return NextResponse.json({ error: `Attachment ${att.filename} exceeds 500KB limit` }, { status: 400 });
        }
      }
    }

    // Validate tier-based CC/BCC and multi-send privileges
    const tierValidation = validateTierPrivileges(accountTier, to, cc, bcc);
    if (!tierValidation.allowed) {
      return NextResponse.json(
        { error: tierValidation.error, tier: accountTier },
        { status: 403 }
      );
    }

    // ── Basic-tier monthly send quota: 10 sends/month (UTC) ────────────────
    // Mirrors the fax-side MONTHLY_FREE_SENDS allowance. Fail-open on counter
    // read errors — a KV hiccup must not block paying-less basic sends.
    const isBasicTier = accountTier === 'basic' || accountTier === 'free';
    if (isBasicTier) {
      const remaining = await monthlySendBudget(label);
      if (remaining <= 0) {
        return NextResponse.json({
          error: `Monthly send limit reached (${BASIC_MONTHLY_SEND_LIMIT}/month on basic tier). Upgrade to continue sending.`,
          upgradeUrl: `/nftmail?upgrade=standard&label=${label}`,
          tier: accountTier,
          sendsRemaining: 0,
        }, { status: 402 });
      }
    }

    // Tier-based HTML processing
    const rawHtmlBody = markdownToHtml(mailBody);
    const htmlBody = sanitizeHtmlForTier(rawHtmlBody, accountTier);
    const textBody = accountTier === 'basic' || accountTier === 'free' 
      ? htmlBody // Already stripped to text for basic tier
      : mailBody;

    // ── PGP encryption path (Phase C) ──────────────────────────────────────
    // Three modes:
    //   1. pgpArmored: client already encrypted the body (true E2EE). Wrap as
    //      PGP/MIME and send via Mailgun messages.mime.
    //   2. Server-side encryption: recipient key available (worker registry for
    //      internal domains, or explicit recipientPublicKey for external). Encrypt
    //      plaintext+html as PGP/MIME, send via messages.mime.
    //   3. Fallback: no key or PGP disabled → existing plaintext Mailgun path.
    if (!body.disablePgp) {
      // Mode 1: client-encrypted armored PGP ciphertext (true E2EE)
      if (body.pgpArmored) {
        const mime = wrapArmoredInPgpMime({
          from: `${label} <${fromEmail}>`,
          to,
          cc,
          bcc,
          subject: subject || '(no subject)',
          armored: body.pgpArmored,
        });
        const { messageId: pgpMsgId } = await sendMimeViaMailgun({ to, cc, bcc, mime });
        if (isBasicTier) await recordMonthlySend(label, verifiedWallet);

        try {
          await fetch(WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Worker-Secret': WORKER_SECRET },
            body: JSON.stringify({
              action: 'storeSentMessage',
              localPart: label,
              payload: {
                messageId: pgpMsgId,
                from: fromEmail,
                to,
                cc: cc || undefined,
                bcc: bcc || undefined,
                subject: subject || '(no subject)',
                body: '[PGP encrypted message]',
                pgpEncrypted: true,
                timestamp: Date.now(),
              },
            }),
          });
        } catch (e) {
          console.error('[send-email] Failed to store PGP sent message:', e);
        }

        return NextResponse.json({
          success: true,
          messageId: pgpMsgId,
          from: fromEmail,
          to,
          via: 'mailgun-mime',
          pgpEncrypted: true,
        });
      }

      // Mode 2: server-side encryption using recipient's public key
      const recipientKeys: string[] = [];
      if (body.recipientPublicKey) {
        recipientKeys.push(body.recipientPublicKey);
      }
      const toKey = await lookupRecipientPgpKey(to);
      if (toKey) recipientKeys.push(toKey);

      // Look up CC/BCC recipient keys (internal domains only)
      const ccRecipients = cc ? cc.split(',').map(e => e.trim()).filter(Boolean) : [];
      const bccRecipients = bcc ? bcc.split(',').map(e => e.trim()).filter(Boolean) : [];
      const extraRecipients = [...ccRecipients, ...bccRecipients];
      const extraKeys = await Promise.all(extraRecipients.map(r => lookupRecipientPgpKey(r)));
      for (const k of extraKeys) {
        if (k) recipientKeys.push(k);
      }

      if (recipientKeys.length > 0) {
        try {
          const mime = await buildPgpMimeFromPlaintext({
            from: `${label} <${fromEmail}>`,
            to,
            cc,
            bcc,
            subject: subject || '(no subject)',
            text: textBody,
            html: htmlBody,
            recipientPublicKeysArmored: recipientKeys,
          });
          const { messageId: pgpMsgId } = await sendMimeViaMailgun({ to, cc, bcc, mime });
          if (isBasicTier) await recordMonthlySend(label, verifiedWallet);

          try {
            await fetch(WORKER_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'X-Worker-Secret': WORKER_SECRET },
              body: JSON.stringify({
                action: 'storeSentMessage',
                localPart: label,
                payload: {
                  messageId: pgpMsgId,
                  from: fromEmail,
                  to,
                  cc: cc || undefined,
                  bcc: bcc || undefined,
                  subject: subject || '(no subject)',
                  body: '[PGP encrypted message]',
                  pgpEncrypted: true,
                  timestamp: Date.now(),
                },
              }),
            });
          } catch (e) {
            console.error('[send-email] Failed to store PGP sent message:', e);
          }

          return NextResponse.json({
            success: true,
            messageId: pgpMsgId,
            from: fromEmail,
            to,
            via: 'mailgun-mime',
            pgpEncrypted: true,
          });
        } catch (pgpErr) {
          console.error('[send-email] PGP encryption failed, falling back to plaintext:', pgpErr);
        }
      }
    }

    // ── Standard path: Mailgun (all lite/premium/ghost tiers) ───────────────
    const { messageId } = await sendViaMailgun({
      from: `${label} <${fromEmail}>`,
      to,
      cc,
      bcc,
      subject: subject || '(no subject)',
      html: htmlBody,
      text: textBody,
      ...(attachments.length > 0 ? { attachments } : {}),
    });
    if (isBasicTier) await recordMonthlySend(label, verifiedWallet);

    // Store sent message in KV for sentbox display
    try {
      const storeRes = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Worker-Secret': WORKER_SECRET },
        body: JSON.stringify({
          action: 'storeSentMessage',
          localPart: label,
          payload: {
            messageId,
            from: fromEmail,
            to,
            cc: cc || undefined,
            bcc: bcc || undefined,
            subject: subject || '(no subject)',
            body: htmlBody,
            timestamp: Date.now(),
          },
        }),
      });
      if (!storeRes.ok) {
        const errText = await storeRes.text().catch(() => '');
        console.error(`[send-email] storeSentMessage failed: ${storeRes.status} — ${errText}`);
      }
    } catch (e) {
      console.error('[send-email] Failed to store sent message:', e);
    }

    return NextResponse.json({
      success: true,
      messageId,
      from: fromEmail,
      to,
      via: 'mailgun',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Send failed';
    console.error('[send-email]', err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

/// Minimal markdown → HTML converter for email bodies
function markdownToHtml(md: string): string {
  return md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code style="background:#1a1a2e;padding:1px 4px;border-radius:3px;font-family:monospace">$1</code>')
    // Headers
    .replace(/^### (.+)$/gm, '<h3 style="margin:16px 0 6px;font-size:14px">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 style="margin:18px 0 8px;font-size:16px">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 style="margin:20px 0 10px;font-size:18px">$1</h1>')
    // Horizontal rule
    .replace(/^---+$/gm, '<hr style="border:none;border-top:1px solid #333;margin:16px 0">')
    // Blockquote
    .replace(/^> (.+)$/gm, '<blockquote style="border-left:3px solid #444;margin:8px 0;padding-left:12px;color:#aaa">$1</blockquote>')
    // Unordered list items
    .replace(/^[-*] (.+)$/gm, '<li style="margin:3px 0">$1</li>')
    // Line breaks → <br>
    .replace(/\n/g, '<br>\n')
    // Wrap list items
    .replace(/(<li[^>]*>.*<\/li>(\s*<br>\s*)*)+/g, (m) => `<ul style="margin:8px 0;padding-left:18px">${m.replace(/<br>\s*/g, '')}</ul>`)
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:#4fa8e8">$1</a>');
}
