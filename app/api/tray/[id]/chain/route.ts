/// POST /api/tray/[id]/chain
///
/// Create a Fax Chain Letter artifact by XOR-compositing the current tray
/// document with a list of previous tray links. The output is a new 1-bit
/// PNG stored as a tray document and seeded deterministically from the
/// chain ids.

import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { keccak256, toBytes, hexToBytes } from 'viem';

const WORKER_URL = process.env.NFTMAIL_WORKER_URL || 'https://worker.nftmail.box';
const WORKER_SECRET = process.env.WORKER_SECRET || '';
const WEBHOOK_SECRET = process.env.NFTMAIL_WEBHOOK_SECRET || process.env.WEBHOOK_SECRET || '';

const CANVAS_WIDTH = 1728;
const CANVAS_HEIGHT = 2200;

interface TrayDocument {
  id: string;
  from: string;
  to: string;
  format: 'png' | 'bmp' | 'jpg';
  dataBase64: string;
  createdAt: number;
}

async function getTrayDocument(id: string): Promise<TrayDocument | null> {
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (WORKER_SECRET) headers['X-Worker-Secret'] = WORKER_SECRET;
    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ action: 'getTrayDocument', id }),
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return await res.json() as TrayDocument;
  } catch {
    return null;
  }
}

function makeSeed(currentId: string, previousIds: string[]): Uint8Array {
  const payload = `${currentId}:${previousIds.join(',')}:${Date.now()}`;
  const hash = keccak256(toBytes(payload));
  return hexToBytes(hash);
}

async function base64To1BitBuffer(dataBase64: string): Promise<Buffer> {
  const buf = Buffer.from(dataBase64, 'base64');
  return sharp(buf)
    .rotate()
    .resize(CANVAS_WIDTH, CANVAS_HEIGHT, { fit: 'inside', withoutEnlargement: true, background: '#ffffff' })
    .flatten({ background: '#ffffff' })
    .greyscale()
    .threshold(128)
    .png({ compressionLevel: 9, palette: true, colours: 2 })
    .toBuffer();
}

async function compositeXor(base: Buffer, overlay: Buffer): Promise<Buffer> {
  return sharp(base)
    .composite([{ input: overlay, blend: 'xor' }])
    .png({ compressionLevel: 9, palette: true, colours: 2 })
    .toBuffer();
}

async function seededGlitch(input: Buffer, seed: Uint8Array): Promise<Buffer> {
  // Get raw 1-channel 8-bit pixels so we can apply deterministic shifts.
  const { data, info } = await sharp(input)
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;
  const output = Buffer.from(data);

  // Use every byte of the seed to drive row shifts and bit-flip runs.
  for (let y = 0; y < height; y += 1) {
    const rowSeed = seed[y % seed.length];
    if (rowSeed % 23 === 0) {
      const shift = (rowSeed % 31) - 15;
      const row = new Uint8Array(output.subarray(y * width, (y + 1) * width));
      for (let x = 0; x < width; x += 1) {
        const src = x - shift;
        if (src >= 0 && src < width) {
          output[y * width + x] = row[src];
        }
      }
    }
    if (rowSeed % 17 === 0) {
      const flipStart = (rowSeed * 7) % width;
      const flipLen = (rowSeed % 41) + 1;
      for (let x = 0; x < flipLen; x += 1) {
        const idx = y * width + ((flipStart + x) % width);
        output[idx] = output[idx] > 128 ? 0 : 255;
      }
    }
  }

  return sharp(output, { raw: { width, height, channels: 1 } })
    .png({ compressionLevel: 9, palette: true, colours: 2 })
    .toBuffer();
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json() as {
      previousTrayIds?: string[];
      ownerWallet?: string;
      blockHash?: string;
    };
    const { previousTrayIds = [], ownerWallet, blockHash } = body;

    if (!ownerWallet || !/^0x[a-fA-F0-9]{40}$/.test(ownerWallet)) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const current = await getTrayDocument(id);
    if (!current) {
      return NextResponse.json({ error: 'Tray document not found' }, { status: 404 });
    }

    const previous = (await Promise.all(previousTrayIds.map(getTrayDocument))).filter(Boolean) as TrayDocument[];
    const chain = [current, ...previous];

    const chainIndex = previous.length + 1;
    const seedInput = blockHash
      ? `${id}:${previousTrayIds.join(',')}:${blockHash}:${chainIndex}`
      : `${id}:${previousTrayIds.join(',')}:${chainIndex}`;
    const seed = makeSeed(id, previousTrayIds);
    const seedHash = keccak256(toBytes(seedInput));

    let image = await base64To1BitBuffer(current.dataBase64);
    for (const link of previous) {
      const linkBuf = await base64To1BitBuffer(link.dataBase64);
      image = await compositeXor(image, linkBuf);
    }

    image = await seededGlitch(image, seed);

    const dataBase64 = image.toString('base64');
    if (dataBase64.length > 1_400_000) {
      return NextResponse.json({ error: 'Chain artifact too large' }, { status: 413 });
    }

    const newId = crypto.randomUUID().replace(/-/g, '').slice(0, 12);
    const record = {
      id: newId,
      from: current.from,
      to: current.to,
      format: 'png' as const,
      dataBase64,
      createdAt: Date.now(),
      chain: {
        chainIndex,
        seed: seedHash,
        previousTrayIds,
        sourceTrayId: id,
      },
    };

    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'kvPut',
        key: `tray:${newId}`,
        value: record,
        ownerAddress: ownerWallet,
        webhookSecret: WEBHOOK_SECRET,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: `Failed to store chain artifact: ${err.slice(0, 200)}` }, { status: 502 });
    }

    return NextResponse.json({
      success: true,
      id: newId,
      trayUrl: `https://nftmail.box/tray/${newId}`,
      chainIndex,
      seed: seedHash,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Chain composition failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
