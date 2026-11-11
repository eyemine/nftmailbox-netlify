/// GET /api/tray/credits?local=<address>&domain=fax|nftmail.box
/// POST /api/tray/credits { local, domain, op: 'spend'|'earn'|'clear' }
/// Both require a caller token (Authorization + X-Auth-Kind, see caller-auth).
///
/// Thermal-fade credit balance and mutation proxy for the NFTfax chain-letter.
/// `local` is the address (e.g. `dfz.1234` for @fax or `name` for @nftmail.box).

import { NextRequest, NextResponse } from 'next/server';
import { requireCallerWallet, requireInboxOwner } from '@/app/lib/caller-auth';
import { isFaxEligible } from '@/app/lib/fax-eligibility';
import { getCredits, spendCredit, earnForwardCredit, clearJam, ensureCreditsAllowance } from '@/app/lib/fax-credits';

const NO_STORE = { 'Cache-Control': 'no-store' } as const;

/// Fail-closed owner check. @fax handles are NFT-collection inboxes: one of
/// the caller's verified wallets must hold (or be delegated) the token named
/// by the label. Everything else must be an inbox the caller controls.
async function verifyOwner(
  req: NextRequest,
  local: string,
  domain: string,
  claimedWallet: string,
): Promise<{ wallet: string } | { res: NextResponse }> {
  if (domain === 'fax') {
    const auth = await requireCallerWallet(req, claimedWallet);
    if ('res' in auth) return auth;
    const collection = local.split('.')[0];
    const candidates = claimedWallet ? [auth.wallet] : auth.caller.wallets;
    for (const w of candidates) {
      if ((await isFaxEligible(w, local, collection)).eligible) return { wallet: w };
    }
    return { res: NextResponse.json({ error: 'No signed-in wallet holds this fax handle' }, { status: 403, headers: NO_STORE }) };
  }
  return requireInboxOwner(req, local, claimedWallet);
}

function cleanLocal(raw: string, domain?: string): string {
  let local = raw.toLowerCase().trim();
  if (domain) {
    local = local.replace(new RegExp(`@${domain.replace(/\./g, '\\.')}$`), '');
  }
  local = local.replace(/@fax$/, '').replace(/@nftmail\.box$/, '');
  return local;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const domain = (searchParams.get('domain') || 'nftmail.box').toLowerCase();
  const local = cleanLocal(searchParams.get('local') || '', domain);
  if (!local) {
    return NextResponse.json({ error: 'Missing local' }, { status: 400, headers: NO_STORE });
  }
  const auth = await verifyOwner(req, local, domain, (searchParams.get('wallet') || '').trim());
  if ('res' in auth) return auth.res;
  const wallet = auth.wallet;

  try {
    const credits = await ensureCreditsAllowance(local, wallet);
    return NextResponse.json({ local, domain, credits }, { status: 200, headers: NO_STORE });
  } catch {
    return NextResponse.json({ error: 'Credit lookup failed' }, { status: 502, headers: NO_STORE });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({})) as {
    local?: string;
    ownerWallet?: string;
    domain?: string;
    op?: 'spend' | 'earn' | 'clear';
  };
  const domain = (body.domain || 'nftmail.box').toLowerCase();
  const local = cleanLocal(body.local || '', domain);
  if (!local) {
    return NextResponse.json({ error: 'Missing local' }, { status: 400, headers: NO_STORE });
  }
  const auth = await verifyOwner(req, local, domain, (body.ownerWallet || '').trim());
  if ('res' in auth) return auth.res;
  const wallet = auth.wallet;

  try {
    switch (body.op) {
      case 'spend': {
        const ok = await spendCredit(local, wallet);
        const credits = await getCredits(local);
        return NextResponse.json({ ok, credits }, { status: ok ? 200 : 402, headers: NO_STORE });
      }
      case 'earn': {
        await earnForwardCredit(local, wallet);
        const credits = await getCredits(local);
        return NextResponse.json({ ok: true, credits }, { status: 200, headers: NO_STORE });
      }
      case 'clear': {
        const credits = await clearJam(local, wallet);
        return NextResponse.json({ ok: true, credits }, { status: 200, headers: NO_STORE });
      }
      default:
        return NextResponse.json({ error: 'Invalid op. Use spend, earn, or clear.' }, { status: 400, headers: NO_STORE });
    }
  } catch (cause: unknown) {
    const message = cause instanceof Error ? cause.message : 'Credit operation failed';
    return NextResponse.json({ error: message }, { status: 502, headers: NO_STORE });
  }
}
