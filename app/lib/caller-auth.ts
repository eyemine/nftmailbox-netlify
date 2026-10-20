/// Server-side caller authentication for routes that act on an inbox.
///
/// Every proxy that attaches WORKER_SECRET must first establish WHO is calling
/// and that they own the inbox they name. Request-body fields such as `fid`,
/// `ownerWallet` or `localPart` are claims, not proof: wallet addresses are
/// public and the mini-app context is supplied by the client.
///
/// Accepted proofs (sent as `Authorization: Bearer <jwt>` + `X-Auth-Kind`):
///   farcaster — Farcaster Quick Auth JWT (sdk.quickAuth.getToken()). The FID
///               is the token subject. Wallets = on-chain custody address +
///               the FID's verified Ethereum addresses.
///   privy     — Privy access token (getAccessToken()). Wallets = the wallets
///               linked to that Privy user, fetched with the app secret.
import { NextRequest } from 'next/server';
import { createClient as createQuickAuthClient } from '@farcaster/quick-auth';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { createPublicClient, http, parseAbi, type Address } from 'viem';
import { gnosis, optimism } from 'viem/chains';

export type Caller = { via: 'farcaster' | 'privy'; fid: number | null; wallets: string[] };

const WORKER_URL = process.env.NFTMAIL_WORKER_URL || process.env.NEXT_PUBLIC_WORKER_URL || 'https://worker.nftmail.box';
const WORKER_SECRET = process.env.WORKER_SECRET || '';
const APP_DOMAIN = new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://nftmail.box').hostname;
const PRIVY_APP_ID = process.env.PRIVY_APP_ID || process.env.NEXT_PUBLIC_PRIVY_APP_ID || '';
const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET || '';
// Farcaster ID Registry on Optimism: custodyOf(fid) is the authoritative owner.
const ID_REGISTRY = '0x00000000Fc6c5F01Fc30151999387Bb99A9f489b' as Address;

const quickAuth = createQuickAuthClient();
const privyJwks = PRIVY_APP_ID
  ? createRemoteJWKSet(new URL(`https://auth.privy.io/api/v1/apps/${PRIVY_APP_ID}/jwks.json`))
  : null;
const optimismClient = createPublicClient({ chain: optimism, transport: http(process.env.OPTIMISM_RPC || 'https://mainnet.optimism.io') });
const gnosisClient = createPublicClient({ chain: gnosis, transport: http(process.env.NEXT_PUBLIC_GNOSIS_RPC || 'https://rpc.gnosischain.com') });

const TTL_MS = 5 * 60_000;
const cache = new Map<string, { at: number; value: unknown }>();
async function cached<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.value as T;
  const value = await fn();
  cache.set(key, { at: Date.now(), value });
  if (cache.size > 5000) cache.delete(cache.keys().next().value as string);
  return value;
}

const isAddr = (a: unknown): a is string => typeof a === 'string' && /^0x[a-fA-F0-9]{40}$/.test(a);
const uniqLower = (xs: unknown[]) => Array.from(new Set(xs.filter(isAddr).map((a) => a.toLowerCase())));

async function farcasterWallets(fid: number): Promise<string[]> {
  return cached(`fcw:${fid}`, async () => {
    const [custody, verified] = await Promise.allSettled([
      optimismClient.readContract({ address: ID_REGISTRY, abi: parseAbi(['function custodyOf(uint256) view returns (address)']), functionName: 'custodyOf', args: [BigInt(fid)] }),
      fetch(`https://api.farcaster.xyz/v2/verifications?fid=${fid}`, { cache: 'no-store' })
        .then((r) => (r.ok ? r.json() : null))
        .then((d: { result?: { verifications?: { address?: string; protocol?: string }[] } } | null) =>
          (d?.result?.verifications ?? []).filter((v) => v.protocol === 'ethereum').map((v) => v.address)),
    ]);
    return uniqLower([
      custody.status === 'fulfilled' ? custody.value : null,
      ...(verified.status === 'fulfilled' ? verified.value : []),
    ]);
  });
}

async function privyWallets(userId: string): Promise<string[]> {
  return cached(`pw:${userId}`, async () => {
    const res = await fetch(`https://auth.privy.io/api/v1/users/${encodeURIComponent(userId)}`, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${PRIVY_APP_ID}:${PRIVY_APP_SECRET}`).toString('base64')}`,
        'privy-app-id': PRIVY_APP_ID,
      },
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const user = (await res.json()) as { linked_accounts?: { type?: string; address?: string }[] };
    return uniqLower((user.linked_accounts ?? []).filter((a) => a.type === 'wallet' || a.type === 'smart_wallet').map((a) => a.address));
  });
}

/// Returns the verified caller, or null when no valid proof was sent.
export async function verifyCaller(req: NextRequest): Promise<Caller | null> {
  const auth = req.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  if (!token) return null;
  const kind = (req.headers.get('x-auth-kind') || '').toLowerCase();
  try {
    if (kind === 'farcaster') {
      const payload = await quickAuth.verifyJwt({ token, domain: APP_DOMAIN });
      const fid = Number(payload.sub);
      if (!Number.isInteger(fid) || fid <= 0) return null;
      return { via: 'farcaster', fid, wallets: await farcasterWallets(fid) };
    }
    if (kind === 'privy' && privyJwks && PRIVY_APP_SECRET) {
      const { payload } = await jwtVerify(token, privyJwks, { issuer: 'privy.io', audience: PRIVY_APP_ID });
      if (!payload.sub) return null;
      return { via: 'privy', fid: null, wallets: await privyWallets(payload.sub) };
    }
  } catch {
    return null;
  }
  return null;
}

async function worker(body: Record<string, unknown>): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Worker-Secret': WORKER_SECRET },
      body: JSON.stringify(body),
      cache: 'no-store',
    });
    return res.ok ? ((await res.json()) as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

/// Normalises any inbox reference (`alice`, `alice_`, `alice@nftmail.box`,
/// `alice.agent`) to the base identity that ownership is recorded under.
export function baseInboxName(ref: string): string {
  return ref.toLowerCase().trim().replace(/@.*$/, '').replace(/\.agent$/, '').replace(/_+$/, '');
}

/// Addresses (and fid: controllers) recorded as owning `name`.
async function inboxOwners(name: string): Promise<{ wallets: string[]; safes: string[]; fidControllers: string[] }> {
  return cached(`own:${name}`, async () => {
    const [resolved, profileRes] = await Promise.all([
      worker({ action: 'resolveAddress', name }),
      worker({ action: 'getAgentProfile', agentName: name }),
    ]);
    const p = (profileRes?.profile ?? {}) as Record<string, unknown>;
    const raw = [resolved?.onChainOwner, resolved?.controller, p.controller, p.walletAddress];
    return {
      wallets: uniqLower(raw),
      safes: uniqLower([resolved?.safe, p.safe]),
      fidControllers: raw.filter((c): c is string => typeof c === 'string' && c.startsWith('fid:')),
    };
  });
}

async function safeOwners(safe: string): Promise<string[]> {
  return cached(`safe:${safe}`, async () => {
    try {
      const owners = await gnosisClient.readContract({ address: safe as Address, abi: parseAbi(['function getOwners() view returns (address[])']), functionName: 'getOwners' });
      return uniqLower([...owners]);
    } catch {
      return [];
    }
  });
}

/// Inboxes anyone may read: agent addresses (trailing `_`) and inboxes whose
/// owner explicitly chose the public `exposed` tier. A missing tier is private.
export async function inboxIsPublic(ref: string): Promise<boolean> {
  const raw = ref.toLowerCase().trim().replace(/@.*$/, '');
  if (raw.endsWith('_')) return true;
  const resolved = await cached(`pub:${raw}`, () => worker({ action: 'resolveAddress', name: baseInboxName(raw) }));
  return String(resolved?.privacyTier || '').toLowerCase() === 'exposed';
}

/// For read routes: every inbox named in `refs` must be public or owned by the
/// verified caller. Returns true when the request may proceed.
export async function mayReadInboxes(req: NextRequest, refs: string[]): Promise<boolean> {
  if (refs.length === 0) return false;
  let caller: Caller | null | undefined;
  for (const ref of refs) {
    if (await inboxIsPublic(ref)) continue;
    if (caller === undefined) caller = await verifyCaller(req);
    if (!caller || !(await callerOwnsInbox(caller, ref))) return false;
  }
  return true;
}

/// Body fields the worker may read an inbox name from (getInbox reads
/// `localPart || email`), so all present ones must be checked.
export const INBOX_FIELDS = ['localPart', 'agentName', 'name', 'label', 'email', 'from'] as const;
export function inboxRefs(body: Record<string, unknown>): string[] {
  return INBOX_FIELDS.map((f) => body[f]).filter((v): v is string => typeof v === 'string' && v.trim() !== '');
}

/// True when the verified caller controls the inbox `ref`: a caller wallet is
/// the recorded owner/controller, is an owner of the inbox's Safe, or the
/// inbox is controlled by the caller's verified FID.
export async function callerOwnsInbox(caller: Caller, ref: string): Promise<boolean> {
  const name = baseInboxName(ref);
  if (!name) return false;
  const owners = await inboxOwners(name);
  if (caller.fid && owners.fidControllers.includes(`fid:${caller.fid}`)) return true;
  const mine = new Set(caller.wallets);
  if (owners.wallets.some((w) => mine.has(w)) || owners.safes.some((s) => mine.has(s))) return true;
  for (const safe of owners.safes) {
    if ((await safeOwners(safe)).some((o) => mine.has(o))) return true;
  }
  return false;
}
