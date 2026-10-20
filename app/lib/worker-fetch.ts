/// Client-side fetch for the authenticated API routes (/api/mini-worker,
/// /api/inbox, /api/send-email, ...). Adds a verifiable caller proof:
/// a Farcaster Quick Auth JWT inside a mini-app host (Farcaster, Quorum, ...),
/// otherwise the Privy access token of the signed-in web user.
import { getAccessToken } from '@privy-io/react-auth';

export async function callerAuthHeaders(): Promise<Record<string, string>> {
  try {
    const { sdk } = await import('@farcaster/miniapp-sdk');
    if (await sdk.isInMiniApp()) {
      const { token } = await sdk.quickAuth.getToken();
      if (token) return { Authorization: `Bearer ${token}`, 'X-Auth-Kind': 'farcaster' };
    }
  } catch {
    // not in a mini-app host, or the user declined — fall through to Privy
  }
  try {
    const token = await getAccessToken();
    if (token) return { Authorization: `Bearer ${token}`, 'X-Auth-Kind': 'privy' };
  } catch {
    // Privy not initialised on this page
  }
  return {};
}

export async function workerFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  for (const [k, v] of Object.entries(await callerAuthHeaders())) headers.set(k, v);
  return fetch(input, { ...init, headers });
}
