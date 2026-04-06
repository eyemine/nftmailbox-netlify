/**
 * Security Tier Service for NFTMail Agents
 * 
 * Three tiers:
 * - standard: API key auth (default)
 * - hmac: HMAC-signed requests
 * - privy: Privy server wallet
 */

export type SecurityTier = 'standard' | 'hmac' | 'privy';

export interface SecurityConfig {
  tier: SecurityTier;
  apiKey?: string;
  apiSecret?: string;      // For HMAC signing
  walletAddress?: string;   // For Privy tier
  createdAt: string;
}

// HMAC utilities
export async function generateApiSecret(): Promise<string> {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export function createSignature(
  apiSecret: string,
  timestamp: string,
  method: string,
  path: string,
  body?: string
): string {
  const data = `${timestamp}:${method}:${path}:${body || ''}`;
  const encoder = new TextEncoder();
  const key = encoder.encode(apiSecret);
  const message = encoder.encode(data);
  
  return crypto.subtle.importKey('raw', key, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
    .then(cryptoKey => crypto.subtle.sign('HMAC', cryptoKey, message))
    .then(signature => {
      return Array.from(new Uint8Array(signature))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    });
}

export async function verifySignature(
  apiSecret: string,
  signature: string,
  timestamp: string,
  method: string,
  path: string,
  body?: string
): Promise<boolean> {
  // Replay protection: reject if timestamp > 5 minutes old
  const now = Math.floor(Date.now() / 1000);
  const requestTime = parseInt(timestamp, 10);
  if (Math.abs(now - requestTime) > 300) {
    return false;
  }
  
  const expected = await createSignature(apiSecret, timestamp, method, path, body);
  return signature === expected;
}

// Security tier detection
export function detectSecurityTier(headers: Headers): SecurityTier {
  if (headers.get('X-Wallet-Address') && headers.get('X-Signature')) {
    return 'privy';
  }
  if (headers.get('X-Signature') && headers.get('X-Timestamp')) {
    return 'hmac';
  }
  return 'standard';
}

// Upgrade path tracking
export interface SecurityUpgrade {
  from: SecurityTier;
  to: SecurityTier;
  migratedAt: string;
  previousApiKey?: string; // Revoked after migration
}

export default {
  generateApiSecret,
  createSignature,
  verifySignature,
  detectSecurityTier,
};
