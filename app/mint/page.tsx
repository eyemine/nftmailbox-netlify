'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { sdk } from '@farcaster/miniapp-sdk';

const LOGO_URL = '/nftmail-logo.png';

interface TierInfo {
  name: string;
  sld: string;
  description: string;
  features: string[];
  price: string;
  popular?: boolean;
}

const TIERS: TierInfo[] = [
  {
    name: 'PUPA',
    sld: '.nftmail.gno',
    description: 'Permanent NFT-backed email address',
    features: [
      'Unlimited inbox storage',
      'Send 100 emails/day',
      'Gnosis Safe multi-sig',
      'Agent autonomies (HITL, Budget)',
      'On-chain identity verification',
      'Tradeable NFT',
      '30 day history window',
    ],
    price: '10',
  },
  {
    name: 'IMAGO',
    sld: '.nftmail.gno',
    description: 'Sovereign email with Safe treasury',
    features: [
      'Everything in PUPA',
      'Auto-forwarding',
      'Disposable email',
      'ghostmail.box',
      'Send and receive attachments',
      'Persistent history',
      'Transferable with governance',
    ],
    price: '24',
    popular: true,
  },
];

function isMobileUserAgent(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function MintPageContent() {
  const searchParams = useSearchParams();
  const agentParam = searchParams.get('agent') || '';
  const fromParam = searchParams.get('from') || '';
  
  const [agentName, setAgentName] = useState(agentParam.replace('.cast', ''));
  const [isMobile, setIsMobile] = useState(true);
  const [isInWarpcast, setIsInWarpcast] = useState(false);
  const [selectedTier, setSelectedTier] = useState<'PUPA' | 'IMAGO'>('PUPA');
  const [step, setStep] = useState<'select' | 'mobile-check' | 'minting' | 'success' | 'error'>('select');
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if mobile and if in Warpcast
    const mobile = isMobileUserAgent();
    setIsMobile(mobile);
    
    const checkWarpcast = async () => {
      try {
        const context = await sdk.context;
        if (context?.user?.fid) {
          setIsInWarpcast(true);
        }
      } catch {
        setIsInWarpcast(false);
      }
    };
    checkWarpcast();
  }, []);

  const handleTierSelect = (tier: 'PUPA' | 'IMAGO') => {
    setSelectedTier(tier);
    
    // If not mobile and coming from mini app, show mobile check
    if (fromParam === 'mini' && !isMobile) {
      setStep('mobile-check');
      return;
    }
    
    startMint(tier);
  };

  const startMint = async (tier: 'PUPA' | 'IMAGO') => {
    setStep('minting');
    setError('');
    
    try {
      // For now, open the main mint UI in Warpcast or redirect
      // This is a placeholder - the actual mint would integrate with the registry contract
      const mintUrl = `https://nftmail.box/?tier=${tier.toLowerCase()}&agent=${agentName}&source=${fromParam}`;
      
      if (isInWarpcast) {
        await sdk.actions.openUrl(mintUrl);
      } else {
        window.open(mintUrl, '_blank');
      }
      
      // Show success state briefly
      setTimeout(() => setStep('success'), 500);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Mint failed');
      setStep('error');
    }
  };

  if (step === 'mobile-check') {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-sm text-center">
          <Image src={LOGO_URL} alt="nftmail.box" width={80} height={80} className="mx-auto mb-6 rounded-xl" />
          <h2 className="text-white font-bold text-xl mb-4">Use Mobile for Minting</h2>
          <p className="text-gray-400 text-sm mb-6">
            To connect your Farcaster wallet and mint directly to your associated address, 
            please open this in the Warpcast mobile app.
          </p>
          <div className="space-y-3">
            <button 
              onClick={() => setStep('select')}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg transition-colors"
            >
              ← Back to Tiers
            </button>
            <button 
              onClick={() => startMint(selectedTier)}
              className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-lg transition-colors"
            >
              Continue Anyway →
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'minting') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Image src={LOGO_URL} alt="nftmail.box" width={64} height={64} className="mx-auto mb-4" />
          <div className="w-12 h-12 border-2 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-green-400 font-mono text-sm">Preparing mint...</p>
          <p className="text-gray-600 text-xs mt-2">{agentName}{selectedTier === 'PUPA' ? '.nftmail.gno (PUPA)' : '.nftmail.gno (IMAGO)'}</p>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-sm text-center">
          <Image src={LOGO_URL} alt="nftmail.box" width={80} height={80} className="mx-auto mb-6 rounded-xl" />
          <h2 className="text-white font-bold text-2xl mb-2">Opening Mint...</h2>
          <p className="text-green-400 font-mono text-sm mb-4">{agentName}{selectedTier === 'PUPA' ? '.nftmail.gno (PUPA)' : '.nftmail.gno (IMAGO)'}</p>
          <p className="text-gray-400 text-xs mb-6">
            Complete the mint in the opened window. Return here when done.
          </p>
          <button 
            onClick={() => setStep('select')}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg transition-colors"
          >
            Back to Tiers
          </button>
        </div>
      </div>
    );
  }

  if (step === 'error') {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-sm text-center">
          <h2 className="text-white font-bold text-xl mb-3">Mint Error</h2>
          <p className="text-red-400 font-mono text-xs mb-6">{error}</p>
          <button 
            onClick={() => setStep('select')}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Tier selection (default step)
  return (
    <div className="min-h-screen flex flex-col px-4 py-6" style={{
      background: 'radial-gradient(1200px circle at 20% -10%, rgba(0,163,255,0.16), transparent 45%), radial-gradient(900px circle at 90% 10%, rgba(124,77,255,0.14), transparent 40%), linear-gradient(180deg, #0a0a0a, #03040a)'
    }}>
      <div className="w-full max-w-sm mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Image src={LOGO_URL} alt="nftmail.box" width={48} height={48} className="opacity-95" />
            <span style={{ fontFamily: "'Ayuthaya', serif", color: '#d8d4cf' }} className="text-xl">nftmail.box</span>
          </div>
          <h1 style={{ fontFamily: "'Ayuthaya', serif", color: '#d8d4cf' }} className="text-2xl font-bold mb-1">Upgrade Your Inbox</h1>
          <p className="text-gray-400 text-sm">Mint a permanent NFT-backed address</p>
          {agentName && (
            <p className="text-green-400 font-mono text-xs mt-2">Current: {agentName}@nftmail.box</p>
          )}
        </div>

        {/* Tier Cards */}
        <div className="space-y-4 mb-8">
          {/* PUPA Tier */}
          <div
            onClick={() => handleTierSelect('PUPA')}
            className={`relative border rounded-xl p-5 cursor-pointer transition-all ${
              selectedTier === 'PUPA'
                ? 'border-green-400 bg-gray-900/80'
                : 'border-gray-800 bg-gray-900/40 hover:border-gray-700'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-white font-bold text-xl">PUPA</h3>
                <p className="text-gray-400 font-mono text-sm">{agentName || 'your-agent'}.nftmail.gno</p>
              </div>
              <div className="text-right">
                <p className="text-white font-bold text-xl">10 xDAI</p>
                <p className="text-gray-500 text-xs">~$10 USD</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-3">Permanent NFT-backed email address</p>
            <ul className="space-y-1.5">
              {['Unlimited inbox storage', 'Send 100 emails/day', 'Gnosis Safe multi-sig', 'Agent autonomies (HITL, Budget)', 'On-chain identity verification', 'Tradeable NFT', '30 day history window'].map((feature, i) => (
                <li key={i} className="text-gray-400 text-xs flex items-center gap-2">
                  <span className="text-green-400">✓</span> {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* IMAGO Tier - Purple */}
          <div
            onClick={() => handleTierSelect('IMAGO')}
            className={`relative border rounded-xl p-5 cursor-pointer transition-all ${
              selectedTier === 'IMAGO'
                ? 'border-[#4722d1] bg-[#4722d1]/20'
                : 'border-[#4722d1]/50 bg-[#4722d1]/10 hover:border-[#4722d1]'
            }`}
          >
            <span className="absolute -top-2 right-4 bg-[#4722d1] text-white text-xs font-bold px-2 py-0.5 rounded">
              RECOMMENDED
            </span>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-white font-bold text-xl">IMAGO</h3>
                <p className="text-[#a78bfa] font-mono text-sm">{agentName || 'your-agent'}.nftmail.gno</p>
              </div>
              <div className="text-right">
                <p className="text-white font-bold text-xl">24 xDAI</p>
                <p className="text-[#a78bfa] text-xs">~$24 USD annual</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm mb-3">Sovereign email with Safe treasury</p>
            <ul className="space-y-1.5">
              {['Everything in PUPA', 'Auto-forwarding', 'Disposable email', 'ghostmail.box', 'Send and receive attachments', 'Persistent history', 'Transferable with governance'].map((feature, i) => (
                <li key={i} className="text-gray-300 text-xs flex items-center gap-2">
                  <span className="text-[#a78bfa]">✓</span> {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Mint Button */}
        <button
          onClick={() => handleTierSelect(selectedTier)}
          className={`w-full font-bold py-4 rounded-xl transition-colors mb-4 ${
            selectedTier === 'IMAGO'
              ? 'bg-[#4722d1] hover:bg-[#5a35e0] text-white'
              : 'bg-green-500 hover:bg-green-400 text-black'
          }`}
        >
          Mint {selectedTier} →
        </button>

        {/* Info */}
        <p className="text-gray-600 text-xs text-center">
          Minted on Gnosis Chain. Gas paid in xDAI. 
          {isInWarpcast ? ' Connected to Farcaster wallet.' : ' Open in Warpcast for best experience.'}
        </p>

        {!isMobile && fromParam === 'mini' && (
          <div className="mt-4 p-3 bg-amber-900/20 border border-amber-500/30 rounded-lg">
            <p className="text-amber-300 text-xs text-center">
              Desktop detected. For wallet connection with your Farcaster account, 
              use Warpcast mobile app.
            </p>
          </div>
        )}
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
