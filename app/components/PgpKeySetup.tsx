'use client';

/// PgpKeySetup — provision the mailbox's PGP key for end-to-end encrypted email.
///
/// One-time per address: the browser generates an OpenPGP key pair (curve25519),
/// the wallet signs PGP_KEY_MESSAGE, and the armored private key is AES-GCM-wrapped
/// with that signature before registration. The server stores only the public key
/// and the wrapped (encrypted) private key — never plaintext key material.
/// Once enabled, senders can encrypt emails to this address via PGP/MIME.

import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useCallback, useEffect, useState } from 'react';
import { PGP_KEY_MESSAGE } from '@/app/lib/pgp-crypto';
import { signWithWallet } from '@/app/lib/wallet-sign';
import { usePgpKey } from '@/app/hooks/usePgpKey';

interface PgpKeySetupProps {
  local: string;
  walletAddress: string;
}

export default function PgpKeySetup({ local, walletAddress }: PgpKeySetupProps) {
  const { wallets } = useWallets();
  const { signMessage } = usePrivy();
  const pgp = usePgpKey(local);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const handleProvision = useCallback(async () => {
    setBusy(true);
    setMessage(null);
    setIsError(false);
    const ok = await pgp.provision(local, walletAddress, async () => {
      return signWithWallet(PGP_KEY_MESSAGE, walletAddress, wallets, signMessage);
    });
    if (ok) {
      setMessage('PGP key provisioned. Senders can now encrypt emails to you.');
    } else {
      setIsError(true);
      setMessage(pgp.error || 'Failed to provision PGP key');
    }
    setBusy(false);
  }, [pgp, local, walletAddress, wallets, signMessage]);

  const handleUnlock = useCallback(async () => {
    setBusy(true);
    setMessage(null);
    setIsError(false);
    const ok = await pgp.unlock(async () => {
      return signWithWallet(PGP_KEY_MESSAGE, walletAddress, wallets, signMessage);
    });
    if (ok) {
      setMessage('PGP key unlocked. You can now decrypt encrypted emails.');
    } else {
      setIsError(true);
      setMessage(pgp.error || 'Unlock failed');
    }
    setBusy(false);
  }, [pgp, walletAddress, wallets, signMessage]);

  const fingerprint = pgp.pgpKeyInfo?.fingerprint;
  const formattedFp = fingerprint
    ? fingerprint.match(/.{1,4}/g)?.join(' ') || fingerprint
    : null;

  return (
    <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <svg className="h-4 w-4 text-violet-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <span className="text-xs font-semibold text-violet-300">PGP ENCRYPTION &mdash; END-TO-END EMAIL</span>
      </div>
      <p className="text-[11px] text-[var(--muted)]">
        Provision an OpenPGP key (curve25519) held by your wallet. Senders can
        encrypt emails to you via PGP/MIME &mdash; even external clients (Gmail
        + extension, Thunderbird, etc.) via WKD auto-discovery. The private key
        is AES-GCM-wrapped with your wallet signature; the server never sees it.
      </p>

      {pgp.keyState === 'unknown' && (
        <div className="text-[10px] text-[var(--muted)]">Checking PGP key vault&hellip;</div>
      )}

      {pgp.pgpKeyInfo?.hasKey && (
        <div className="rounded-lg border border-violet-500/20 bg-violet-500/5 px-3 py-2 text-[10px] text-violet-300 space-y-1">
          <div>PGP key active for <strong>{local}@nftmail.box</strong></div>
          {formattedFp && (
            <div className="font-mono text-[9px] text-violet-400/70 break-all">
              Fingerprint: {formattedFp}
            </div>
          )}
          {pgp.pgpKeyInfo?.keyId && (
            <div className="font-mono text-[9px] text-violet-400/70">
              Key ID: {pgp.pgpKeyInfo.keyId}
            </div>
          )}
        </div>
      )}

      {!pgp.pgpKeyInfo?.hasKey && pgp.keyState !== 'unknown' && (
        <button
          onClick={handleProvision}
          disabled={busy || !walletAddress}
          className="w-full rounded-lg border border-violet-500/30 bg-violet-500/10 px-4 py-2.5 text-xs font-semibold text-violet-300 transition hover:bg-violet-500/20 disabled:opacity-40"
        >
          {busy ? 'Generating key…' : 'Enable PGP Encryption'}
        </button>
      )}

      {pgp.pgpKeyInfo?.hasKey && pgp.keyState === 'locked' && (
        <button
          onClick={handleUnlock}
          disabled={busy || !walletAddress}
          className="w-full rounded-lg border border-violet-500/30 bg-violet-500/10 px-4 py-2.5 text-xs font-semibold text-violet-300 transition hover:bg-violet-500/20 disabled:opacity-40"
        >
          {busy ? 'Unlocking…' : 'Unlock PGP Key (Sign with Wallet)'}
        </button>
      )}

      {pgp.isUnlocked && (
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-[10px] text-emerald-300">
          PGP key unlocked &mdash; you can decrypt encrypted emails in this session.
        </div>
      )}

      {message && (
        <div className={`rounded-lg px-3 py-2 text-[10px] border ${
          isError
            ? 'border-red-500/20 bg-red-500/5 text-red-300'
            : 'border-violet-500/20 bg-violet-500/5 text-violet-300'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
}
