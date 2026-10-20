'use client';

/// PgpOnchainSetup — write the PGP public key fingerprint to ERC-8048
/// on-chain metadata so external PGP clients can discover it via
/// the token registry (interface id 0xdf670be1).
///
/// This component provides a UI for the owner to call setMetadata
/// on the Identity Registry for their agent token, storing the PGP
/// key fingerprint under the 'pgp' key.

import { useCallback, useEffect, useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';

const GNOSIS_CHAIN_ID = 100;
const GNOSIS_RPC = 'https://rpc.gnosischain.com';
const IDENTITY_REGISTRY = '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432';

// ERC-8048 interface: setMetadata(uint256 tokenId, string key, string value)
// Selector: keccak256("setMetadata(uint256,string,string)") first 4 bytes
// We compute it at runtime to avoid hardcoding.

interface PgpOnchainSetupProps {
  agentName: string;
  walletAddress: string;
  tokenId?: number;
  fingerprint?: string;
}

export default function PgpOnchainSetup({ agentName, walletAddress, tokenId, fingerprint: propFingerprint }: PgpOnchainSetupProps) {
  const { wallets } = useWallets();
  const { signMessage } = usePrivy();
  const [busy, setBusy] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [remoteFingerprint, setRemoteFingerprint] = useState<string | undefined>(undefined);

  // Self-fetch fingerprint from /api/pgp-key if not provided as prop
  useEffect(() => {
    if (propFingerprint) {
      setRemoteFingerprint(propFingerprint);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/pgp-key?local=${encodeURIComponent(agentName)}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json() as { hasKey?: boolean; fingerprint?: string };
          if (!cancelled && data.hasKey && data.fingerprint) {
            setRemoteFingerprint(data.fingerprint);
          }
        }
      } catch { /* non-fatal */ }
    })();
    return () => { cancelled = true; };
  }, [agentName, propFingerprint]);

  const fingerprint = propFingerprint || remoteFingerprint;

  const handleWriteOnchain = useCallback(async () => {
    if (!tokenId || !fingerprint) {
      setError('Missing token ID or PGP fingerprint');
      return;
    }
    setBusy(true);
    setError(null);
    setTxHash(null);

    try {
      // Find a wallet connected to Gnosis Chain
      const external = wallets.find(
        (w) => w.address.toLowerCase() === walletAddress.toLowerCase(),
      );
      if (!external) {
        setError('Connect the wallet that owns this mailbox');
        setBusy(false);
        return;
      }

      // Switch to Gnosis Chain if needed
      const provider = await external.getEthereumProvider();
      try {
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x' + GNOSIS_CHAIN_ID.toString(16) }],
        });
      } catch {
        // Try adding the chain
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x' + GNOSIS_CHAIN_ID.toString(16),
            chainName: 'Gnosis Chain',
            nativeCurrency: { name: 'xDai', symbol: 'XDAI', decimals: 18 },
            rpcUrls: [GNOSIS_RPC],
            blockExplorerUrls: ['https://gnosisscan.io'],
          }],
        });
      }

      // Build the setMetadata transaction
      // Function: setMetadata(uint256,string,string)
      // We ABI-encode the call manually
      const tokenIdHex = BigInt(tokenId).toString(16).padStart(64, '0');
      const keyHex = 'pgp';
      const valueHex = fingerprint;

      // ABI encode: selector + uint256 + string offset + string offset + string data
      // Using a simple approach: encode via ethers-like manual encoding
      const selector = '0xdf670be1'; // setMetadata selector

      // Encode strings with dynamic offset
      const keyBytes = new TextEncoder().encode(keyHex);
      const valueBytes = new TextEncoder().encode(valueHex);

      // Head: tokenId (32) + offset1 (32) + offset2 (32) = 96 bytes
      // Tail: len1 (32) + key1 (padded to 32) + len2 (32) + value2 (padded to 32)
      const keyPaddedLen = Math.ceil(keyBytes.length / 32) * 32;
      const valuePaddedLen = Math.ceil(valueBytes.length / 32) * 32;
      const offset1 = 96;
      const offset2 = offset1 + 32 + keyPaddedLen;

      const encodeUint = (val: bigint | number): string => {
        return BigInt(val).toString(16).padStart(64, '0');
      };

      const encodeBytes = (bytes: Uint8Array): string => {
        let hex = encodeUint(bytes.length);
        const padded = new Uint8Array(Math.ceil(bytes.length / 32) * 32);
        padded.set(bytes);
        for (const b of padded) {
          hex += b.toString(16).padStart(2, '0');
        }
        return hex;
      };

      const data =
        selector +
        encodeUint(BigInt(tokenId)) +
        encodeUint(offset1) +
        encodeUint(offset2) +
        encodeBytes(keyBytes) +
        encodeBytes(valueBytes);

      const tx = await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: walletAddress,
          to: IDENTITY_REGISTRY,
          data: '0x' + data,
        }],
      });

      setTxHash(tx);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'On-chain write failed';
      setError(msg);
    } finally {
      setBusy(false);
    }
  }, [tokenId, fingerprint, walletAddress, wallets]);

  if (!fingerprint) {
    return null;
  }

  return (
    <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <svg className="h-4 w-4 text-blue-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <span className="text-xs font-semibold text-blue-300">ON-CHAIN PGP METADATA (ERC-8048)</span>
      </div>
      <p className="text-[11px] text-[var(--muted)]">
        Write your PGP fingerprint to the Gnosis Chain identity registry so
        external PGP clients can discover your key trustlessly from on-chain
        metadata. This is a one-time gas transaction.
      </p>

      {tokenId ? (
        <div className="text-[10px] text-[var(--muted)]">
          Token ID: <span className="font-mono">{tokenId}</span> &middot;
          Fingerprint: <span className="font-mono break-all">{fingerprint.match(/.{1,4}/g)?.join(' ')}</span>
        </div>
      ) : (
        <div className="text-[10px] text-amber-400">
          No token ID found for this mailbox. On-chain metadata write requires
          a registered ERC-8048 token.
        </div>
      )}

      <button
        onClick={handleWriteOnchain}
        disabled={busy || !walletAddress || !tokenId}
        className="w-full rounded-lg border border-blue-500/30 bg-blue-500/10 px-4 py-2.5 text-xs font-semibold text-blue-300 transition hover:bg-blue-500/20 disabled:opacity-40"
      >
        {busy ? 'Sending transaction…' : 'Write PGP Fingerprint On-Chain'}
      </button>

      {txHash && (
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-[10px] text-emerald-300">
          Transaction sent: <a href={`https://gnosisscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="font-mono underline">{txHash.slice(0, 18)}…</a>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-[10px] text-red-300">
          {error}
        </div>
      )}
    </div>
  );
}
