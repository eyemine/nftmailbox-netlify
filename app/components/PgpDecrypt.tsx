'use client';

/// PgpDecrypt — decrypts a PGP-encrypted inbound email message in-browser.
///
/// Flow: the user clicks "Decrypt", signs PGP_KEY_MESSAGE with their wallet,
/// the hook unwraps the stored private key, and OpenPGP.js decrypts the
/// armored message. Plaintext exists only transiently in this tab.

import { useCallback, useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { PGP_KEY_MESSAGE } from '@/app/lib/pgp-crypto';
import { signWithWallet } from '@/app/lib/wallet-sign';
import { usePgpKey } from '@/app/hooks/usePgpKey';

interface PgpDecryptProps {
  armoredMessage: string;
  agentName: string;
  walletAddress: string;
}

export default function PgpDecrypt({ armoredMessage, agentName, walletAddress }: PgpDecryptProps) {
  const { wallets } = useWallets();
  const { signMessage } = usePrivy();
  const pgp = usePgpKey(agentName);
  const [plaintext, setPlaintext] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDecrypt = useCallback(async () => {
    setBusy(true);
    setError(null);

    // If not unlocked, unlock first
    if (!pgp.isUnlocked) {
      const unlocked = await pgp.unlock(async () => {
        return signWithWallet(PGP_KEY_MESSAGE, walletAddress, wallets, signMessage);
      });
      if (!unlocked) {
        setError(pgp.error || 'Failed to unlock PGP key');
        setBusy(false);
        return;
      }
    }

    // Now decrypt
    const result = await pgp.decryptMessage(armoredMessage);
    if (result) {
      setPlaintext(result);
    } else {
      setError(pgp.error || 'Decryption failed — wrong key?');
    }
    setBusy(false);
  }, [pgp, walletAddress, wallets, signMessage, armoredMessage]);

  if (plaintext) {
    return (
      <div className="space-y-2">
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
          <div className="text-[9px] font-semibold text-emerald-400 mb-2">DECRYPTED PGP MESSAGE</div>
          <pre className="whitespace-pre-wrap break-words text-[11px] text-[var(--foreground)] font-mono max-h-96 overflow-y-auto">
            {plaintext}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-violet-500/20 bg-violet-500/5 p-3 space-y-2">
      <div className="flex items-center gap-2">
        <svg className="h-3.5 w-3.5 text-violet-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <span className="text-[10px] font-semibold text-violet-300">PGP-ENCRYPTED MESSAGE</span>
      </div>
      <p className="text-[10px] text-[var(--muted)]">
        This message was encrypted with PGP/MIME. Click to decrypt with your wallet.
      </p>
      <button
        onClick={handleDecrypt}
        disabled={busy || !walletAddress}
        className="rounded-md border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 text-[10px] font-semibold text-violet-300 transition hover:bg-violet-500/20 disabled:opacity-40"
      >
        {busy ? 'Decrypting…' : 'Decrypt with Wallet'}
      </button>
      {error && <div className="text-[10px] text-red-400">{error}</div>}
    </div>
  );
}
