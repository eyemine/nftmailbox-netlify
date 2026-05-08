'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { sdk } from '@farcaster/miniapp-sdk';

const LOGO_URL = '/nftmail-logo.png';

const PUPA_FEATURES = [
  'Unlimited inbox storage',
  'Send 100 emails/day',
  'Gnosis Safe multi-sig',
  'Agent autonomies (HITL, Budget)',
  'On-chain identity verification',
  'Attach an agent "brain"',
  'BYO NFT molt',
  'Tradeable NFT',
  '30-day history window',
];

const IMAGO_FEATURES = [
  'Everything in PUPA',
  'Auto-forwarding',
  'Disposable email',
  'ghostmail.box',
  'Send and receive attachments',
  'Persistent history',
  'Attach an agent "brain"',
  'Transferable with governance',
];

function isMobileUserAgent(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function MintPageContent() {
  const searchParams = useSearchParams();
  const agentParam = searchParams.get('agent') || '';
  const fromParam = searchParams.get('from') || '';

  // Convert agent name: strip .cast suffix, replace dots with hyphens for display as SLD label
  const rawName = agentParam.replace(/\.cast$/i, '');
  const sldLabel = rawName.replace(/\./g, '-');

  const [isMobile, setIsMobile] = useState(true);
  const [isInWarpcast, setIsInWarpcast] = useState(false);
  const [selectedTier, setSelectedTier] = useState<'PUPA' | 'IMAGO'>('PUPA');
  const [step, setStep] = useState<'select' | 'mobile-check' | 'minting' | 'success' | 'error'>('select');
  const [error, setError] = useState('');

  useEffect(() => {
    setIsMobile(isMobileUserAgent());
    const checkWarpcast = async () => {
      try {
        const context = await sdk.context;
        if (context?.user?.fid) setIsInWarpcast(true);
      } catch {
        setIsInWarpcast(false);
      }
    };
    checkWarpcast();
  }, []);

  // Card click: just select the tier, never navigate
  const handleCardClick = (tier: 'PUPA' | 'IMAGO') => {
    setSelectedTier(tier);
  };

  // Mint button: navigate (mobile-check on desktop, startMint on mobile/warpcast)
  const handleMintClick = () => {
    if (!isMobile && !isInWarpcast) {
      setStep('mobile-check');
      return;
    }
    startMint(selectedTier);
  };

  const startMint = async (tier: 'PUPA' | 'IMAGO') => {
    setStep('minting');
    setError('');
    try {
      const mintUrl = `https://nftmail.box/?tier=${tier.toLowerCase()}&agent=${sldLabel}&source=${fromParam}`;
      if (isInWarpcast) {
        await sdk.actions.openUrl(mintUrl);
      } else {
        window.open(mintUrl, '_blank');
      }
      setTimeout(() => setStep('success'), 500);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Mint failed');
      setStep('error');
    }
  };

  const handleBackToFarcaster = async () => {
    try {
      await sdk.actions.close();
    } catch {
      window.history.back();
    }
  };

  const gradientBg = {
    background: 'radial-gradient(1200px circle at 20% -10%, rgba(0,163,255,0.16), transparent 45%), radial-gradient(900px circle at 90% 10%, rgba(124,77,255,0.14), transparent 40%), linear-gradient(180deg, #0a0a0a, #03040a)',
  };

  if (step === 'mobile-check') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-8" style={gradientBg}>
        <div className="w-full max-w-sm text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Image src={LOGO_URL} alt="nftmail.box" width={40} height={40} className="opacity-95" />
            <span style={{ fontFamily: "'Ayuthaya', serif", color: '#d8d4cf' }} className="text-lg">nftmail.box</span>
          </div>
          <h2 className="text-white font-bold text-xl mb-4">Use Mobile for Minting</h2>
          <p className="text-gray-400 text-sm mb-2">
            To connect your Farcaster wallet and mint directly to your verified address, open this in Warpcast on your phone.
          </p>
          <p className="text-gray-500 font-mono text-xs mb-8">{sldLabel}.nftmail.gno ({selectedTier})</p>
          <div className="space-y-3">
            <button
              onClick={handleBackToFarcaster}
              className="w-full font-bold py-3 rounded-xl transition-colors text-white"
              style={{ backgroundColor: '#855DCD' }}
            >
              ← Back to Farcaster
            </button>
            <button
              onClick={() => setStep('select')}
              className="w-full bg-gray-900 border border-gray-700 text-gray-300 py-3 rounded-xl text-sm transition-colors hover:border-gray-500"
            >
              ← Back to Tiers
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'minting') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={gradientBg}>
        <div className="text-center">
          <Image src={LOGO_URL} alt="nftmail.box" width={64} height={64} className="mx-auto mb-4 opacity-95" />
          <div className="w-12 h-12 border-2 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-green-400 font-mono text-sm">Preparing mint...</p>
          <p className="text-gray-600 text-xs mt-2">{sldLabel}.nftmail.gno ({selectedTier})</p>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-8" style={gradientBg}>
        <div className="w-full max-w-sm text-center">
          <Image src={LOGO_URL} alt="nftmail.box" width={80} height={80} className="mx-auto mb-6 opacity-95" />
          <h2 className="text-white font-bold text-2xl mb-2">Opening Mint...</h2>
          <p className="text-green-400 font-mono text-sm mb-4">{sldLabel}.nftmail.gno ({selectedTier})</p>
          <p className="text-gray-400 text-xs mb-6">Complete the mint in the opened window. Return here when done.</p>
          <div className="space-y-3">
            <button
              onClick={handleBackToFarcaster}
              className="w-full font-bold py-3 rounded-xl transition-colors text-white"
              style={{ backgroundColor: '#855DCD' }}
            >
              ← Back to Farcaster
            </button>
            <button onClick={() => setStep('select')} className="w-full bg-gray-900 border border-gray-700 text-gray-300 py-3 rounded-xl text-sm">
              Back to Tiers
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'error') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-8" style={gradientBg}>
        <div className="w-full max-w-sm text-center">
          <h2 className="text-white font-bold text-xl mb-3">Mint Error</h2>
          <p className="text-red-400 font-mono text-xs mb-6">{error}</p>
          <div className="space-y-3">
            <button onClick={() => setStep('select')} className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl transition-colors">
              Try Again
            </button>
            <button
              onClick={handleBackToFarcaster}
              className="w-full font-bold py-3 rounded-xl transition-colors text-white"
              style={{ backgroundColor: '#855DCD' }}
            >
              ← Back to Farcaster
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Tier selection (default step)
  return (
    <div className="min-h-screen flex flex-col px-4 py-6" style={gradientBg}>
      <div className="w-full max-w-sm mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Image src={LOGO_URL} alt="nftmail.box" width={48} height={48} className="opacity-95" />
            <span style={{ fontFamily: "'Ayuthaya', serif", color: '#d8d4cf' }} className="text-xl">nftmail.box</span>
          </div>
          <h1 style={{ fontFamily: "'Ayuthaya', serif", color: '#d8d4cf' }} className="text-2xl font-bold mb-1">Upgrade Your Inbox</h1>
          <p className="text-gray-400 text-sm">Mint a permanent NFT-governed address</p>
          {sldLabel && (
            <p className="text-green-400 font-mono text-xs mt-2">Current: {rawName}@nftmail.box</p>
          )}
        </div>

        {/* Tier Cards — click only selects, does not navigate */}
        <div className="space-y-4 mb-6">
          {/* PUPA Tier */}
          <div
            onClick={() => handleCardClick('PUPA')}
            className={`relative border rounded-xl p-5 cursor-pointer transition-all ${
              selectedTier === 'PUPA'
                ? 'border-green-400 bg-gray-900/80'
                : 'border-gray-800 bg-gray-900/40 hover:border-gray-600'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-white font-bold text-xl">PUPA</h3>
                <p className="text-gray-400 font-mono text-sm">{sldLabel || 'your-agent'}.nftmail.gno</p>
              </div>
              <div className="text-right">
                <p className="text-white font-bold text-xl">10 xDAI</p>
                <p className="text-gray-500 text-xs">~$10 USD</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-3">Permanent NFT-governed email address</p>
            <ul className="space-y-1.5">
              {PUPA_FEATURES.map((feature, i) => (
                <li key={i} className="text-gray-400 text-xs flex items-center gap-2">
                  <span className="text-green-400">✓</span> {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* IMAGO Tier — purple */}
          <div
            onClick={() => handleCardClick('IMAGO')}
            className={`relative border rounded-xl p-5 cursor-pointer transition-all ${
              selectedTier === 'IMAGO'
                ? 'border-[#4722d1] bg-[#4722d1]/20'
                : 'border-[#4722d1]/50 bg-[#4722d1]/10 hover:border-[#4722d1]'
            }`}
          >
            <span className="absolute -top-2.5 right-4 bg-[#4722d1] text-white text-xs font-bold px-2 py-0.5 rounded">
              RECOMMENDED
            </span>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-white font-bold text-xl">IMAGO</h3>
                <p className="text-[#a78bfa] font-mono text-sm">{sldLabel || 'your-agent'}.nftmail.gno</p>
              </div>
              <div className="text-right">
                <p className="text-white font-bold text-xl">24 xDAI</p>
                <p className="text-[#a78bfa] text-xs">~$24 USD annual</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm mb-3">Sovereign email with Safe treasury</p>
            <ul className="space-y-1.5">
              {IMAGO_FEATURES.map((feature, i) => (
                <li key={i} className="text-gray-300 text-xs flex items-center gap-2">
                  <span className="text-[#a78bfa]">✓</span> {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Mint Button — this is what triggers navigation */}
        <button
          onClick={handleMintClick}
          className={`w-full font-bold py-4 rounded-xl transition-colors mb-3 ${
            selectedTier === 'IMAGO'
              ? 'bg-[#4722d1] hover:bg-[#5a35e0] text-white'
              : 'bg-green-500 hover:bg-green-400 text-black'
          }`}
        >
          Mint {selectedTier} →
        </button>

        <p className="text-gray-600 text-xs text-center">
          Minted on Gnosis Chain · Gas paid in xDAI
        </p>
      </div>
    </div>
  );
}

export default function MintPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-green-400 font-mono text-sm">Loading...</p>
        </div>
      </div>
    }>
      <MintPageContent />
    </Suspense>
  );
}
