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
import sharp from 'sharp';

const WORKER_URL = process.env.NFTMAIL_WORKER_URL || 'https://worker.nftmail.box';
const WORKER_SECRET = process.env.WORKER_SECRET || '';
const WEBHOOK_SECRET = process.env.NFTMAIL_WEBHOOK_SECRET || process.env.WEBHOOK_SECRET || '';

const MAX_SOURCE_BASE64_LENGTH = 28_000_000; // ~20MB binary before processing
const MAX_STORED_BASE64_LENGTH = 1_400_000; // ~1MB binary after processing
const MAX_FAX_WIDTH = 1728;
const MAX_FAX_HEIGHT = 2200;
const ALLOWED_FORMATS = new Set(['png', 'bmp', 'jpg']);

const BASIC_MONTHLY_FAX_LIMIT = 2;

function currentMonthKey(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
}

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

async function processFaxImage(dataBase64: string, preserveColor: boolean): Promise<string> {
  const source = Buffer.from(dataBase64, 'base64');
  const metadata = await sharp(source).metadata();
  if (!metadata.width || !metadata.height || !['png', 'jpeg', 'bmp'].includes(metadata.format || '')) {
    throw new Error('Unsupported or invalid image');
  }

  let scale = 1;
  for (let attempt = 0; attempt < 7; attempt += 1) {
    const width = Math.max(320, Math.round(MAX_FAX_WIDTH * scale));
    const height = Math.max(400, Math.round(MAX_FAX_HEIGHT * scale));
    let pipeline = sharp(source, { failOn: 'error' })
      .rotate()
      .resize({ width, height, fit: 'inside', withoutEnlargement: true });

    pipeline = preserveColor ? pipeline : pipeline.greyscale();
    const output = await pipeline
      .png({ compressionLevel: 9, palette: true, colours: preserveColor ? 256 : 16, effort: 10 })
      .toBuffer();
    const encoded = output.toString('base64');
    if (encoded.length <= MAX_STORED_BASE64_LENGTH) return encoded;
    scale *= 0.8;
  }

  throw new Error('Image could not be reduced below the 1MB fax limit');
}

async function getFaxCount(label: string): Promise<number> {
  try {
    const key = `fax-sent:${label}:${currentMonthKey()}`;
    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Worker-Secret': WORKER_SECRET },
      body: JSON.stringify({ action: 'kvGet', key }),
    });
    if (!res.ok) return 0;
    const { value } = await res.json() as { value: string | null };
    const n = parseInt(value || '0', 10);
    return isNaN(n) ? 0 : n;
  } catch {
    return 0;
  }
}

async function incrementFaxCount(label: string, ownerWallet: string) {
  const key = `fax-sent:${label}:${currentMonthKey()}`;
  const count = await getFaxCount(label);
  await fetch(WORKER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Worker-Secret': WORKER_SECRET },
    body: JSON.stringify({
      action: 'kvPut',
      key,
      value: String(count + 1),
      ownerAddress: ownerWallet,
      webhookSecret: WEBHOOK_SECRET,
    }),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      fromLabel?: string;
      ownerWallet?: string;
      to?: string;
      format?: string;
      dataBase64?: string;
      isMultipage?: boolean;
      colorMode?: 'greyscale' | '256';
    };

    const { fromLabel, ownerWallet, to, format, dataBase64, isMultipage, colorMode } = body;

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
    if (dataBase64.length > MAX_SOURCE_BASE64_LENGTH) {
      return NextResponse.json({ error: 'Source image too large (max ~20MB)' }, { status: 413 });
    }
    if (!matchesFormat(dataBase64, normFormat)) {
      return NextResponse.json({ error: 'File content does not match declared format' }, { status: 400 });
    }

    // Verify caller against on-chain controller of the sending address
    const resolveRes = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Worker-Secret': WORKER_SECRET },
      body: JSON.stringify({ action: 'resolveAddress', name: fromLabel }),
    });

    let accountTier = 'basic';
    if (resolveRes.ok) {
      const resolved = await resolveRes.json() as Record<string, unknown>;
      const controller = (resolved.onChainOwner as string | undefined)?.toLowerCase();
      if (controller && controller !== ownerWallet.toLowerCase()) {
        return NextResponse.json({ error: 'Wallet does not match the registered owner' }, { status: 403 });
      }
      accountTier = ((resolved.accountTier as string | undefined) || 'basic').toLowerCase();
    }

    const isPremium = accountTier === 'premium' || accountTier === 'imago' || accountTier === 'ghost';
    const isPro = accountTier === 'pro' || accountTier === 'pupa' || accountTier === 'lite';
    const isBasic = !isPremium && !isPro;

    // Basic tier: 2 free 1-page greyscale faxes per month, internal delivery only
    if (isBasic) {
      const recipientDomain = to.trim().toLowerCase().split('@').pop();
      if (recipientDomain !== 'nftmail.box') {
        return NextResponse.json({
          error: 'Basic accounts can only send NFTfax to @nftmail.box recipients. Upgrade to PRO for external delivery.',
          upgradeUrl: `/nftmail?upgrade=pro&label=${fromLabel}`,
        }, { status: 402 });
      }
      const sent = await getFaxCount(fromLabel);
      if (sent >= BASIC_MONTHLY_FAX_LIMIT) {
        return NextResponse.json({
          error: 'You have used your 2 free NFTfax sends this month. Upgrade to PRO for unlimited faxes.',
          upgradeUrl: `/nftmail?upgrade=pro&label=${fromLabel}`,
        }, { status: 402 });
      }
    }

    // Pro and Premium: single-page bitmap only for now; multipage is Premium-only
    if (isMultipage && !isPremium) {
      return NextResponse.json({
        error: 'Multipage NFTfax is a PREMIUM feature.',
        upgradeUrl: `/nftmail?upgrade=premium&label=${fromLabel}`,
      }, { status: 402 });
    }

    // 256-color / color fax mode is Premium-only
    if (colorMode === '256' && !isPremium) {
      return NextResponse.json({
        error: 'Color NFTfax is a PREMIUM feature.',
        upgradeUrl: `/nftmail?upgrade=premium&label=${fromLabel}`,
      }, { status: 402 });
    }

    let processedBase64: string;
    try {
      processedBase64 = await processFaxImage(dataBase64, isPremium && colorMode === '256');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Image processing failed';
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const fromEmail = `${fromLabel}@nftmail.box`;
    const setRes = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Worker-Secret': WORKER_SECRET },
      body: JSON.stringify({
        action: 'setTrayDocument',
        secret: WEBHOOK_SECRET,
        from: fromEmail,
        to,
        format: 'png',
        dataBase64: processedBase64,
        isMultipage: !!isMultipage,
        colorMode: colorMode || 'greyscale',
      }),
    });

    const data = await setRes.json() as { id?: string; trayUrl?: string; error?: string };
    if (!setRes.ok) {
      return NextResponse.json({ error: data.error || 'Failed to store document' }, { status: setRes.status });
    }

    if (isBasic) await incrementFaxCount(fromLabel, ownerWallet);

    return NextResponse.json({ success: true, id: data.id, trayUrl: data.trayUrl });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Transmission failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
