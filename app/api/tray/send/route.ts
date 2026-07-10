/// POST /api/tray/send
///
/// Document Tray — secure bitmap-only transmission channel, separate from HTML
/// email. The fax/image is never embedded in an email; the inbox only ever
/// receives a plaintext pointer notification ("T/#9923 FROM:alice.agent.gno
/// [VIEW]"). This keeps the entire HTML tracking surface (pixels, remote
/// loads, CSS tricks, script-adjacent behavior) out of the transmission path.
///
/// Body: { fromLabel, ownerWallet, to, format: 'png'|'bmp', dataBase64 }
/// Auth: ownerWallet must match the on-chain controller of fromLabel (same
///       pattern as /api/inbox-action and /api/send-email).

import { NextRequest, NextResponse } from 'next/server';

const WORKER_URL = process.env.NFTMAIL_WORKER_URL || 'https://worker.nftmail.box';
const WORKER_SECRET = process.env.WORKER_SECRET || '';

const MAX_BASE64_LENGTH = 1_400_000; // ~1MB binary
const ALLOWED_FORMATS = new Set(['png', 'bmp', 'jpg']);

// Minimal magic-byte check so a mislabeled/malicious file can't ride through
// as a "bitmap" — this is a transmission channel with no HTML/script context,
// but we still only want to store what we claim to store.
function matchesFormat(base64: string, format: string): boolean {
  try {
    const header = Buffer.from(base64.slice(0, 24), 'base64');
    if (format === 'png') {
      // 89 50 4E 47 0D 0A 1A 0A
      return header.length >= 8 &&
        header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4e && header[3] === 0x47;
    }
    if (format === 'bmp') {
      // 'BM'
      return header.length >= 2 && header[0] === 0x42 && header[1] === 0x4d;
    }
    if (format === 'jpg') {
      // FF D8 FF
      return header.length >= 3 &&
        header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff;
    }
    return false;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      fromLabel?: string;
      ownerWallet?: string;
      to?: string;
      format?: string;
      dataBase64?: string;
    };

    const { fromLabel, ownerWallet, to, format, dataBase64 } = body;

    if (!fromLabel) {
      return NextResponse.json({ error: 'Missing fromLabel' }, { status: 400 });
    }
    if (!ownerWallet || !/^0x[a-fA-F0-9]{40}$/.test(ownerWallet)) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    if (!to || !to.includes('@')) {
      return NextResponse.json({ error: 'Invalid recipient address' }, { status: 400 });
    }
    const normFormat = (format || '').toLowerCase() === 'jpeg' ? 'jpg' : (format || '').toLowerCase();
    if (!normFormat || !ALLOWED_FORMATS.has(normFormat)) {
      return NextResponse.json({ error: 'Only PNG, JPG, or BMP formats are permitted' }, { status: 400 });
    }
    if (!dataBase64) {
      return NextResponse.json({ error: 'Missing dataBase64' }, { status: 400 });
    }
    if (dataBase64.length > MAX_BASE64_LENGTH) {
      return NextResponse.json({ error: 'Document too large (max ~1MB)' }, { status: 413 });
    }
    if (!matchesFormat(dataBase64, normFormat)) {
      return NextResponse.json({ error: 'File content does not match declared format' }, { status: 400 });
    }

    // Verify caller against on-chain controller of the sending address
    const resolveRes = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'resolveAddress', name: fromLabel }),
    });
    if (resolveRes.ok) {
      const resolved = await resolveRes.json() as Record<string, unknown>;
      const controller = (resolved.onChainOwner as string | undefined)?.toLowerCase();
      if (controller && controller !== ownerWallet.toLowerCase()) {
        return NextResponse.json({ error: 'Wallet does not match the registered owner' }, { status: 403 });
      }
      const accountTier = ((resolved.accountTier as string | undefined) || 'basic').toLowerCase();
      const isPremium = accountTier === 'premium' || accountTier === 'imago' || accountTier === 'ghost';
      if (!isPremium) {
        return NextResponse.json({
          error: 'Document Tray is a PREMIUM feature.',
          upgradeUrl: `/nftmail?upgrade=premium&label=${fromLabel}`,
        }, { status: 402 });
      }
    }

    const fromEmail = `${fromLabel}@nftmail.box`;
    const setRes = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'setTrayDocument',
        secret: WORKER_SECRET,
        from: fromEmail,
        to,
        format: normFormat,
        dataBase64,
      }),
    });

    const data = await setRes.json() as { id?: string; trayUrl?: string; error?: string };
    if (!setRes.ok) {
      return NextResponse.json({ error: data.error || 'Failed to store document' }, { status: setRes.status });
    }

    return NextResponse.json({ success: true, id: data.id, trayUrl: data.trayUrl });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Transmission failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
