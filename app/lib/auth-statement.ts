/// Canonical wallet-auth statement shared by the session route (server) and
/// the client signing helper. Any change here invalidates every issued
/// signature — it must stay identical on both sides.

export const AUTH_STATEMENT_VERSION = 1;

export function authStatement(wallet: string, signedAt: number): string {
  return [
    'nftmail.box wallet authentication',
    `version: ${AUTH_STATEMENT_VERSION}`,
    `wallet: ${wallet.toLowerCase()}`,
    `issued: ${new Date(signedAt).toISOString()}`,
  ].join('\n');
}
