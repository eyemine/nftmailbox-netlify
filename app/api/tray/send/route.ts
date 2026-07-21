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
import { spendCredit, earnForwardCredit, setLastReceived, applyThermalFade, getCredits } from '@/app/lib/fax-credits';
import { eciesEncrypt } from '@/app/lib/fax-crypto';

const WORKER_URL = process.env.NFTMAIL_WORKER_URL || 'https://worker.nftmail.box';
const WORKER_SECRET = process.env.WORKER_SECRET || '';
const WEBHOOK_SECRET = process.env.NFTMAIL_WEBHOOK_SECRET || process.env.WEBHOOK_SECRET || '';

const MAX_SOURCE_BASE64_LENGTH = 28_000_000; // ~20MB binary before processing
const MAX_STORED_BASE64_LENGTH = 1_400_000; // ~1MB binary after processing
const MAX_FAX_WIDTH = 1728;
const MAX_FAX_HEIGHT = 2200;
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

async function getChainDocument(id: string): Promise<{ dataBase64: string; from: string; to?: string } | null> {
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (WORKER_SECRET) headers['X-Worker-Secret'] = WORKER_SECRET;
    if (WEBHOOK_SECRET) headers['X-Webhook-Secret'] = WEBHOOK_SECRET;
    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers,
      // `secret` authenticates this backend call so the worker returns `to`
      // (needed to verify the forwarder was the fax's recipient).
      body: JSON.stringify({ action: 'getTrayDocument', id, secret: WEBHOOK_SECRET }),
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return await res.json() as { dataBase64: string; from: string; to?: string };
  } catch {
    return null;
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
      chainTrayId?: string;
      isMultipage?: boolean;
      colorMode?: 'greyscale' | '256';
      channel?: 'public' | 'private';
      fromDomain?: string;
    };

    let { fromLabel, ownerWallet, to, format, dataBase64, chainTrayId, isMultipage, colorMode } = body;
    let fromDomain = (body.fromDomain || '').toLowerCase().trim();
    if (fromLabel) {
      const parts = fromLabel.toLowerCase().trim().split('@');
      if (parts.length > 1) {
        fromLabel = parts[0];
        if (!fromDomain) fromDomain = parts[1];
      }
    }
    if (!fromDomain) fromDomain = 'nftmail.box';
    const isFaxSender = fromDomain === 'fax';

    const channel = body.channel === 'private' && to && !to.toLowerCase().trim().endsWith('@fax')
      ? 'private'
      : 'public';

    if (!fromLabel) {
      return NextResponse.json({ error: 'Missing fromLabel' }, { status: 400 });
    }
    if (!ownerWallet || !/^0x[a-fA-F0-9]{40}$/.test(ownerWallet)) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    if (!to || !to.includes('@')) {
      return NextResponse.json({ error: 'Invalid recipient address' }, { status: 400 });
    }

    let isForward = false;
    let processedBase64: string;
    let rawDataBase64: string | undefined;
    if (chainTrayId) {
      const chain = await getChainDocument(chainTrayId);
      if (!chain || !chain.dataBase64) {
        return NextResponse.json({ error: 'Chain tray not found' }, { status: 404 });
      }
      // Ensure the forwarder is the recipient of the source fax.
      if (!chain.to) {
        return NextResponse.json({ error: 'Could not verify chain ownership. Try again.' }, { status: 502 });
      }
      const chainToLocal = chain.to.split('@')[0].toLowerCase();
      if (chainToLocal !== fromLabel.toLowerCase()) {
        return NextResponse.json({ error: 'You can only forward faxes sent to you' }, { status: 403 });
      }
      isForward = true;
      // A forward may carry a NEW composited image (the next chain link). If so,
      // use it; otherwise re-use the source fax bitmap unchanged.
      rawDataBase64 = dataBase64 || chain.dataBase64;
    } else {
      const normFormat = (format || '').toLowerCase() === 'jpeg' ? 'jpg' : (format || '').toLowerCase();
      if (!normFormat || !ALLOWED_FORMATS.has(normFormat)) {
        return NextResponse.json({ error: 'Only PNG, JPG, or BMP formats are permitted' }, { status: 400 });
      }
      if (!dataBase64) {
        return NextResponse.json({ error: 'Missing dataBase64 or chainTrayId' }, { status: 400 });
      }
      if (dataBase64.length > MAX_SOURCE_BASE64_LENGTH) {
        return NextResponse.json({ error: 'Source image too large (max ~20MB)' }, { status: 413 });
      }
      if (!matchesFormat(dataBase64, normFormat)) {
        return NextResponse.json({ error: 'File content does not match declared format' }, { status: 400 });
      }
      rawDataBase64 = dataBase64;
    }

    // Determine account tier. @fax is the free public namespace and skips
    // on-chain ownership resolution in Phase 1; @nftmail.box still enforces
    // fail-closed wallet ownership via resolveAddress.
    let isPremium = false;
    let isPro = false;
    let isBasic = true;

    if (!isFaxSender) {
      const resolveRes = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Worker-Secret': WORKER_SECRET },
        body: JSON.stringify({ action: 'resolveAddress', name: fromLabel, domain: fromDomain }),
      });
      if (!resolveRes.ok) {
        return NextResponse.json({ error: 'Could not verify sender ownership. Try again.' }, { status: 503 });
      }
      const resolved = await resolveRes.json() as Record<string, unknown>;
      if (resolved.exists === false) {
        return NextResponse.json({ error: 'Sender mailbox does not exist.' }, { status: 404 });
      }
      const controller = (resolved.onChainOwner as string | undefined)?.toLowerCase();
      if (!controller) {
        return NextResponse.json({
          error: 'Sender ownership could not be verified. Connect the wallet that controls this mailbox.',
        }, { status: 403 });
      }
      if (controller !== ownerWallet.toLowerCase()) {
        return NextResponse.json({ error: 'Wallet does not match the registered owner' }, { status: 403 });
      }
      const accountTier = ((resolved.accountTier as string | undefined) || 'basic').toLowerCase();

      // 'imago'/'ghost' → Premium, 'pupa'/'lite' → Pro (legacy KV aliases).
      isPremium = accountTier === 'premium' || accountTier === 'imago' || accountTier === 'ghost';
      isPro = accountTier === 'pro' || accountTier === 'pupa' || accountTier === 'lite';
      isBasic = !isPremium && !isPro;
    }

    // ── Private (end-to-end encrypted) fax gating ──
    // The bitmap is ECIES-encrypted to the recipient's public key so KV stores
    // only ciphertext and the public /tray/{id} URL can never reveal the image.
    // This is the Pro/Premium confidentiality tier — distinct from the public
    // chain-letter game. Forwarding an encrypted fax is not supported (the
    // forwarder would have to decrypt then re-encrypt to the next recipient).
    let recipientFaxPubKey: string | null = null;
    if (channel === 'private') {
      if (isBasic) {
        return NextResponse.json({
          error: 'Private (encrypted) NFTfax is a PRO/PREMIUM feature. Upgrade to send end-to-end encrypted faxes.',
          upgradeUrl: `/nftmail?upgrade=pro&label=${fromLabel}`,
        }, { status: 402 });
      }
      if (isForward) {
        return NextResponse.json({ error: 'Encrypted faxes cannot be forwarded into the public chain.' }, { status: 400 });
      }
      const privRecipientDomain = to.trim().toLowerCase().split('@').pop();
      if (privRecipientDomain !== 'nftmail.box') {
        return NextResponse.json({ error: 'Private faxes can only be sent to @nftmail.box recipients.' }, { status: 400 });
      }
      const recipientLocal = to.trim().toLowerCase().split('@')[0];
      const keyRes = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Worker-Secret': WORKER_SECRET },
        body: JSON.stringify({ action: 'getFaxKey', local: recipientLocal }),
        cache: 'no-store',
      });
      if (keyRes.ok) {
        const keyData = await keyRes.json() as { hasKey?: boolean; publicKey?: string };
        if (keyData.hasKey && keyData.publicKey) recipientFaxPubKey = keyData.publicKey;
      }
      if (!recipientFaxPubKey) {
        return NextResponse.json({
          error: `${recipientLocal}@nftmail.box has not enabled private fax. They must provision a fax key in their dashboard before you can send an encrypted fax.`,
        }, { status: 409 });
      }
    }

    // External delivery is Premium-only. Basic and Pro stay within @nftmail.box / @fax / fax.box.
    const recipientDomain = to.trim().toLowerCase().split('@').pop();
    if (recipientDomain !== 'nftmail.box' && recipientDomain !== 'fax.box' && recipientDomain !== 'fax') {
      if (!isPremium) {
        return NextResponse.json({
          error: 'External NFTfax delivery is a PREMIUM feature. Upgrade to send to non-@nftmail.box addresses.',
          upgradeUrl: `/nftmail?upgrade=premium&label=${fromLabel}`,
        }, { status: 402 });
      }
    }

    // Basic tier uses Thermal Fade credits: new sends cost 1 credit; forwards earn 1 credit
    // if performed within 72 hours of receiving. If a received fax is not forwarded in time,
    // all credits fade to zero.
    if (isBasic) {
      if (isForward) {
        await earnForwardCredit(fromLabel, ownerWallet);
      } else {
        const canSend = await spendCredit(fromLabel, ownerWallet);
        if (!canSend) {
          return NextResponse.json({
            error: 'LINE JAMMED — you have no fax send credits. Forward a received fax within 72 hours to earn a credit, or upgrade to PRO for unlimited internal faxes / PREMIUM for external delivery.',
            upgradeUrl: `/nftmail?upgrade=pro&label=${fromLabel}`,
          }, { status: 402 });
        }
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

    if (isForward && rawDataBase64 && !dataBase64) {
      // Forward with no new image: re-use the already-processed chain bitmap.
      processedBase64 = rawDataBase64;
    } else if (rawDataBase64) {
      try {
        processedBase64 = await processFaxImage(rawDataBase64, isPremium && colorMode === '256');
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Image processing failed';
        return NextResponse.json({ error: message }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: 'No image data to send' }, { status: 400 });
    }

    const fromEmail = `${fromLabel}@${fromDomain}`;

    // For the private channel, ECIES-encrypt the processed bitmap to the
    // recipient's public key. The worker (and the public /tray URL) only ever
    // see the envelope — never the plaintext image.
    const trayPayload: Record<string, unknown> = {
      action: 'setTrayDocument',
      secret: WEBHOOK_SECRET,
      from: fromEmail,
      to,
      format: 'png',
      isMultipage: !!isMultipage,
      colorMode: colorMode || 'greyscale',
    };
    if (chainTrayId) {
      trayPayload.chainTrayId = chainTrayId;
    }
    if (channel === 'private' && recipientFaxPubKey) {
      try {
        trayPayload.channel = 'private';
        trayPayload.envelope = await eciesEncrypt(processedBase64, recipientFaxPubKey);
      } catch {
        return NextResponse.json({ error: 'Failed to encrypt fax for recipient' }, { status: 500 });
      }
    } else {
      trayPayload.channel = 'public';
      trayPayload.dataBase64 = processedBase64;
    }

    const setRes = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Worker-Secret': WORKER_SECRET },
      body: JSON.stringify(trayPayload),
    });

    const rawSet = await setRes.text();
    let data: { id?: string; trayUrl?: string; error?: string };
    try {
      data = JSON.parse(rawSet) as { id?: string; trayUrl?: string; error?: string };
    } catch {
      // The worker returned a non-JSON body (e.g. an HTML 5xx/gateway page).
      // Surface a clear, actionable error instead of a raw JSON-parse message.
      return NextResponse.json({
        error: `Transmission relay error (worker returned ${setRes.status}). Please try again shortly.`,
      }, { status: 502 });
    }
    if (!setRes.ok) {
      return NextResponse.json({ error: data.error || 'Failed to store document' }, { status: setRes.status });
    }

    // Mark the recipient as having received a fax (starts the 72-hour Thermal Fade).
    if (recipientDomain === 'nftmail.box' || recipientDomain === 'fax.box' || recipientDomain === 'fax') {
      const recipientLocal = to.split('@')[0].toLowerCase();
      await setLastReceived(recipientLocal, Date.now(), ownerWallet);
    }

    // Chain-letter game: a successful forward UNLOCKS the "Mint to Base" action
    // for the source fax. The forwarder was already verified as the source
    // fax's recipient above (chainToLocal === fromLabel). Non-fatal.
    if (isForward && chainTrayId) {
      try {
        await fetch(WORKER_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Worker-Secret': WORKER_SECRET },
          body: JSON.stringify({ action: 'markTrayForwarded', secret: WEBHOOK_SECRET, trayId: chainTrayId }),
        });
      } catch { /* non-fatal — the mint gate can be retried by forwarding again */ }
    }

    return NextResponse.json({ success: true, id: data.id, trayUrl: data.trayUrl, isForward, channel, encrypted: channel === 'private' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Transmission failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
