'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function ClaimPage() {
  const router = useRouter();
  const params = useParams();
  const claimCode = params.claimCode as string;

  const [walletAddress, setWalletAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [status, setStatus] = useState<'loading' | 'valid' | 'invalid' | 'claimed' | 'minted'>('loading');
  const [error, setError] = useState('');
  const [inboxName, setInboxName] = useState('');

  useEffect(() => {
    if (!claimCode) return;
    
    // Verify claim code
    fetch('https://nftmail-email-worker.richard-159.workers.dev', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'verifyClaim', claimCode })
    })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        setStatus('invalid');
        setError(data.error);
      } else if (data.claimed) {
        setStatus('claimed');
        setInboxName(data.name);
      } else {
        setStatus('valid');
        setInboxName(data.name);
      }
    })
    .catch(err => {
      setStatus('invalid');
      setError('Failed to verify claim code');
    });
  }, [claimCode]);

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('No wallet found. Install MetaMask or another Web3 wallet.');
      return;
    }

    setIsConnecting(true);
    setError('');

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      setWalletAddress(accounts[0]);
    } catch (err) {
      setError('Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const mintIdentity = async () => {
    if (!walletAddress) {
      setError('Please connect your wallet first');
      return;
    }

    setIsMinting(true);
    setError('');

    try {
      const response = await fetch('/api/claim-inbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          claimCode,
          walletAddress
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Minting failed');
      }

      setStatus('minted');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Minting failed');
    } finally {
      setIsMinting(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[radial-gradient(1200px_circle_at_20%_-10%,rgba(0,163,255,0.16),transparent_45%),linear-gradient(180deg,var(--background),#03040a)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[rgb(160,220,255)] mx-auto mb-4"></div>
          <p className="text-[var(--muted)]">Verifying claim code...</p>
        </div>
      </div>
    );
  }

  if (status === 'invalid') {
    return (
      <div className="min-h-screen bg-[radial-gradient(1200px_circle_at_20%_-10%,rgba(0,163,255,0.16),transparent_45%),linear-gradient(180deg,var(--background),#03040a)] flex items-center justify-center">
        <div className="max-w-md p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Invalid Claim Code</h1>
          <p className="text-[var(--muted)] mb-6">{error}</p>
          <Link href="/join" className="inline-block rounded-lg bg-[rgba(0,163,255,0.15)] border border-[rgba(0,163,255,0.35)] px-6 py-3 text-sm font-semibold text-[rgb(160,220,255)] hover:bg-[rgba(0,163,255,0.25)] transition">
            Create a new inbox
          </Link>
        </div>
      </div>
    );
  }

  if (status === 'claimed') {
    return (
      <div className="min-h-screen bg-[radial-gradient(1200px_circle_at_20%_-10%,rgba(0,163,255,0.16),transparent_45%),linear-gradient(180deg,var(--background),#03040a)] flex items-center justify-center">
        <div className="max-w-md p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Already Claimed</h1>
          <p className="text-[var(--muted)] mb-6">
            The inbox <span className="text-[rgb(160,220,255)]">{inboxName}@nftmail.box</span> has already been claimed.
          </p>
          <Link href={`/inbox/${inboxName}`} className="inline-block rounded-lg bg-[rgba(0,163,255,0.15)] border border-[rgba(0,163,255,0.35)] px-6 py-3 text-sm font-semibold text-[rgb(160,220,255)] hover:bg-[rgba(0,163,255,0.25)] transition">
            Open Inbox
          </Link>
        </div>
      </div>
    );
  }

  if (status === 'minted') {
    return (
      <div className="min-h-screen bg-[radial-gradient(1200px_circle_at_20%_-10%,rgba(0,163,255,0.16),transparent_45%),linear-gradient(180deg,var(--background),#03040a)] flex items-center justify-center">
        <div className="max-w-md p-6 rounded-2xl border border-[rgba(0,163,255,0.35)] bg-[rgba(0,163,255,0.05)] text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-400/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Identity Minted!</h1>
          <p className="text-[var(--muted)] mb-6">
            Your permanent address <span className="text-[rgb(160,220,255)]">{inboxName}@nftmail.box</span> is now an NFT.
          </p>
          <div className="space-y-3">
            <Link href={`/inbox/${inboxName}`} className="block rounded-lg bg-[rgba(0,163,255,0.15)] border border-[rgba(0,163,255,0.35)] px-6 py-3 text-sm font-semibold text-[rgb(160,220,255)] hover:bg-[rgba(0,163,255,0.25)] transition">
              Open Inbox
            </Link>
            <a href="https://ghostagent.ninja" target="_blank" rel="noopener noreferrer" className="block rounded-lg border border-[var(--border)] bg-black/20 px-6 py-3 text-sm font-semibold text-[var(--muted)] hover:text-white hover:bg-black/30 transition">
              GhostAgent.ninja
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_circle_at_20%_-10%,rgba(0,163,255,0.16),transparent_45%),linear-gradient(180deg,var(--background),#03040a)]">
      <div className="mx-auto max-w-lg px-4 py-16 md:px-6">
        
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Ayuthaya', serif" }}>
            Mint Your Identity
          </h1>
          <p className="text-sm text-[var(--muted)]">
            Claim permanent ownership of <span className="text-[rgb(160,220,255)]">{inboxName}@nftmail.box</span>
          </p>
        </header>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white mb-2">What you get</h2>
            <ul className="space-y-2 text-sm text-[var(--muted)]">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">·</span>
                <span><span className="text-white">{inboxName}.nftmail.gno</span> NFT minted to your wallet</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">·</span>
                <span>Unlimited email sending (no more 10-email limit)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">·</span>
                <span>Transferable identity - sell or gift the NFT</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">·</span>
                <span>Ready for GhostAgent molt cycle (ERC-6551 + Safe)</span>
              </li>
            </ul>
          </div>

          {!walletAddress ? (
            <button
              onClick={connectWallet}
              disabled={isConnecting}
              className="w-full rounded-lg bg-[rgba(0,163,255,0.15)] border border-[rgba(0,163,255,0.35)] px-6 py-3 text-sm font-semibold text-[rgb(160,220,255)] hover:bg-[rgba(0,163,255,0.25)] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </button>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg bg-black/30 border border-[var(--border)] p-3">
                <p className="text-xs text-[var(--muted)] mb-1">Connected wallet</p>
                <p className="text-sm text-white font-mono">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</p>
              </div>
              
              <button
                onClick={mintIdentity}
                disabled={isMinting}
                className="w-full rounded-lg bg-emerald-400/20 border border-emerald-400/30 px-6 py-3 text-sm font-semibold text-emerald-400 hover:bg-emerald-400/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isMinting ? 'Minting...' : 'Mint Identity'}
              </button>
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-lg bg-red-400/10 border border-red-400/20 p-3">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-[var(--muted)]">
            By minting, you agree to the NFTMail terms of service.
          </p>
          <Link href="/join" className="text-xs text-[rgb(160,220,255)] hover:underline mt-2 inline-block">
            Back to setup instructions
          </Link>
        </div>

      </div>
    </div>
  );
}
