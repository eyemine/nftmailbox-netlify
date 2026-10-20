/// POST /api/tray/[id]/save   { local, ownerWallet, gnosisTx?, gnosisTokenId? }
///
/// "Save to Gnosis" — the permanence verb of the chain-letter game. Rescues a
/// received fax from the 8-day Thermal-Fade decay by persisting it (removing
/// the KV TTL) and recording tray-saved:gnosis:{id}. Distinct from "Mint to
/// Base" (the tradeable collectible). An optional Gnosis tx/tokenId is stored
/// when an on-chain anchor exists; the persistence itself works without one.
///
/// Ownership is enforced fail-CLOSED: the caller's wallet must control `local`.

import { NextRequest, NextResponse } from 'next/server';

const WORKER_URL = process.env.NFTMAIL_WORKER_URL || 'https://worker.nftmail.box';
const WORKER_SECRET = process.env.WORKER_SECRET || '';
const WEBHOOK_SECRET = process.env.NFTMAIL_WEBHOOK_SECRET || process.env.WEBHOOK_SECRET || '';

const NO_STORE = { 'Cache-Control': 'no-store' } as const;

function workerHeaders(): Record<string, string> {
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  if (WORKER_SECRET) h['X-Worker-Secret'] = WORKER_SECRET;
  return h;
}

async function verifyOwner(local: string, wallet: string): Promise<NextResponse | null> {
  const resolveRes = await fetch(WORKER_URL, {
    method: 'POST',
    headers: workerHeaders(),
    body: JSON.stringify({ action: 'resolveAddress', name: local }),
    cache: 'no-store',
  });
  if (!resolveRes.ok) {
    return NextResponse.json({ error: 'Could not verify mailbox ownership. Try again.' }, { status: 503, headers: NO_STORE });
  }
  const resolved = await resolveRes.json() as Record<string, unknown>;
  if (resolved.exists === false) {
    return NextResponse.json({ error: 'Mailbox does not exist.' }, { status: 404, headers: NO_STORE });
  }
  const controller = (resolved.onChainOwner as string | undefined)?.toLowerCase();
  if (!controller) {
    return NextResponse.json({ error: 'Ownership could not be verified. Connect the controlling wallet.' }, { status: 403, headers: NO_STORE });
  }
  if (controller !== wallet.toLowerCase()) {
    return NextResponse.json({ error: 'Wallet does not match the registered owner' }, { status: 403, headers: NO_STORE });
  }
  return null;
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => ({})) as {
    local?: string;
    ownerWallet?: string;
    gnosisTx?: string;
    gnosisTokenId?: string | number;
  };
  const local = (body.local || '').toLowerCase().trim().replace(/@nftmail\.box$/, '');
  const wallet = (body.ownerWallet || '').trim();

  if (!id) return NextResponse.json({ error: 'Missing tray id' }, { status: 400, headers: NO_STORE });
  if (!local) return NextResponse.json({ error: 'Missing local' }, { status: 400, headers: NO_STORE });
  if (!wallet || !/^0x[a-fA-F0-9]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401, headers: NO_STORE });
  }

  try {
    const denied = await verifyOwner(local, wallet);
    if (denied) return denied;

    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers: workerHeaders(),
      body: JSON.stringify({
        action: 'saveTrayDocument',
        secret: WEBHOOK_SECRET,
        trayId: id,
        local,
        gnosisTx: body.gnosisTx || null,
        gnosisTokenId: body.gnosisTokenId ?? null,
      }),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status, headers: NO_STORE });
  } catch {
    return NextResponse.json({ error: 'Save failed' }, { status: 502, headers: NO_STORE });
  }
}
