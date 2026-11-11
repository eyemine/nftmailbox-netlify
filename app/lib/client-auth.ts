/// Client-side session helpers. The dashboard calls `createSessionToken` once
/// when a wallet connects; every component then attaches `authHeaders` (or
/// uses `authedFetch`) so calls carry the Bearer token. If the token is
/// missing/expired the API returns 401 — the UI should offer to re-sign.

import { authStatement } from './auth-statement';

const key = (wallet: string) => `nftmail-session:${wallet.toLowerCase()}`;

interface CachedSession {
  token: string;
  expiresAt: number;
}

export function cachedSessionToken(wallet: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(key(wallet));
    if (!raw) return null;
    const session = JSON.parse(raw) as CachedSession;
    // 30s margin so a token doesn't expire mid-request.
    if (!session.token || session.expiresAt < Date.now() + 30_000) return null;
    return session.token;
  } catch {
    return null;
  }
}

/// Signs the canonical statement with `sign` and exchanges it for a Bearer
/// token at /api/session. `sign` is typically signWithWallet bound to the
/// user's wallet + Privy signMessage.
export async function createSessionToken(
  wallet: string,
  sign: (message: string) => Promise<string>,
): Promise<string> {
  const signedAt = Date.now();
  const signature = await sign(authStatement(wallet, signedAt));
  const res = await fetch('/api/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ wallet, signedAt, signature }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(err.error || `Session request failed (${res.status})`);
  }
  const data = await res.json() as { token: string; expiresAt: number };
  try {
    window.localStorage.setItem(key(wallet), JSON.stringify({ token: data.token, expiresAt: data.expiresAt }));
  } catch { /* private mode — session just won't persist */ }
  return data.token;
}

/// Authorization headers for a request, if a valid session is cached.
export function authHeaders(wallet: string): Record<string, string> {
  const token = cachedSessionToken(wallet);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/// fetch() with the session Bearer header attached.
export async function authedFetch(
  input: string,
  init: RequestInit,
  wallet: string,
): Promise<Response> {
  const headers = { ...(init.headers as Record<string, string> | undefined), ...authHeaders(wallet) };
  return fetch(input, { ...init, headers });
}
