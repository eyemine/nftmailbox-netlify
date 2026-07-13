'use client';

/// FaxKeySetup — provision the recipient's private-fax key vault.
///
/// One-time per address: the browser generates a P-256 key pair, the wallet
/// signs FAX_KEY_MESSAGE, and the private key is AES-GCM-wrapped with that
/// signature before registration. The server only ever stores the public key
/// and the wrapped (encrypted) private key — never plaintext key material.
/// Once enabled, other users can send this address end-to-end encrypted faxes.

import { useCallback, useEffect, useState } from 'react';
import { FAX_KEY_MESSAGE, provisionFaxKey } from '@/app/lib/fax-crypto';

interface FaxKeySetupProps {
  local: string;         // mailbox local-part (e.g. "alice" or "mac.slave")
  walletAddress: string; // connected wallet used to sign
}

async function signMessage(message: string, account: string): Promise<string> {
  const eth = (window as unknown as { ethereum?: { request: (a: { method: string; params?: unknown[] }) => Promise<string> } }).ethereum;
  if (!eth) throw new Error('No wallet provider available');
  return eth.request({ method: 'personal_sign', params: [message, account] });
}

export default function FaxKeySetup({ local, walletAddress }: FaxKeySetupProps) {
  const [status, setStatus] = useState<'checking' | 'enabled' | 'disabled' | 'error'>('checking');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setStatus('checking');
    try {
      const res = await fetch(`/api/fax-key?local=${encodeURIComponent(local)}`);
      const data = await res.json() as { hasKey?: boolean };
      setStatus(data.hasKey ? 'enabled' : 'disabled');
    } catch {
      setStatus('error');
    }
  }, [local]);

  useEffect(() => { void refresh(); }, [refresh]);

  const handleEnable = async () => {
    setBusy(true);
    setMessage(null);
    try {
      const signature = await signMessage(FAX_KEY_MESSAGE, walletAddress);
      const wrapped = await provisionFaxKey(signature);
      const res = await fetch('/api/fax-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          local,
          publicKey: wrapped.publicKey,
          wrappedPrivateKey: wrapped.wrappedPrivateKey,
          wrapIv: wrapped.wrapIv,
          ownerWallet: walletAddress,
        }),
      });
      const data = await res.json() as { error?: string };
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      setStatus('enabled');
      setMessage('Private fax enabled. Others can now send you encrypted faxes.');
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : 'Failed to enable private fax');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-emerald-300">PRIVATE FAX &mdash; END-TO-END ENCRYPTED</span>
      </div>
      <p className="text-[11px] text-[var(--muted)]">
        Enable a wallet-held fax key so senders can transmit bitmaps encrypted to
        you alone. The image is ciphertext at rest &mdash; the public tray URL can
        never reveal it. Only your wallet signature can decrypt.
      </p>

      {status === 'checking' && (
        <div className="text-[10px] text-[var(--muted)]">Checking key vault&hellip;</div>
      )}

      {status === 'enabled' && (
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-[10px] text-emerald-300">
          Private fax is active for <strong>{local}@nftmail.box</strong>.
        </div>
      )}

      {(status === 'disabled' || status === 'error') && (
        <button
          onClick={handleEnable}
          disabled={busy || !walletAddress}
          className="w-full rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/20 disabled:opacity-40"
        >
          {busy ? 'Signing&hellip;' : 'Enable Private Fax'}
        </button>
      )}

      {message && (
        <div className={`rounded-lg px-3 py-2 text-[10px] ${
          /fail|error|match/i.test(message)
            ? 'border border-red-500/20 bg-red-500/5 text-red-300'
            : 'border border-emerald-500/20 bg-emerald-500/5 text-emerald-300'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
}
