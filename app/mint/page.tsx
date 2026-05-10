'use client';

import React, { useState, Suspense, useCallback } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { createWalletClient, createPublicClient, custom, http, decodeEventLog, keccak256, encodePacked, namehash } from 'viem';
import { gnosis } from '../utils/chains';
import NamespaceRegistrarABI from '../abi/NamespaceRegistrar.json';

const LOGO_URL = '/nftmail-logo.png';

const GNS_REGISTRY = '0xA505e447474bd1774977510e7a7C9459DA79c4b9' as const;
const NFTMAIL_GNO_NAMEHASH = namehash('nftmail.gno');
const GNSRegistryABI = [
  {
    inputs: [{ internalType: 'bytes32', name: 'node', type: 'bytes32' }],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const agentParam = searchParams.get('agent') || '';
  const fromParam = searchParams.get('from') || '';
  const codeParam = searchParams.get('code') || '';
  const { login, logout, authenticated, ready } = usePrivy();
  const { wallets } = useWallets();

  // Convert agent name: strip .cast suffix, replace dots with hyphens for display as SLD label
  const rawName = agentParam.replace(/\.cast$/i, '');
  const sldLabel = rawName.replace(/\./g, '-');
  const displayName = sldLabel || 'your-farcaster-name';

  const [selectedTier, setSelectedTier] = useState<'PUPA' | 'IMAGO'>('PUPA');
  const [step, setStep] = useState<'select' | 'minting' | 'success' | 'error'>('select');
  const [error, setError] = useState('');
  const [otpCode, setOtpCode] = useState(codeParam);
  const [txHash, setTxHash] = useState('');

  const injectedWallet = wallets.find((w: any) => w?.walletClientType === 'injected');
  const anyWallet = wallets[0];
  const walletAddress = (injectedWallet || anyWallet)?.address;

  // Card click: just select the tier, never navigate
  const handleCardClick = (tier: 'PUPA' | 'IMAGO') => {
    setSelectedTier(tier);
  };

  // Mint button: proceed directly to minting (wallet connect)
  const handleMintClick = () => {
    startMint(selectedTier);
  };

  const startMint = useCallback(async (tier: 'PUPA' | 'IMAGO') => {
    if (!authenticated || !walletAddress) {
      setError('Connect your wallet first');
      return;
    }
    if (!sldLabel || sldLabel.length < 2) {
      setError('Invalid name');
      return;
    }
    
    setStep('minting');
    setError('');
    
    try {
      const publicClient = createPublicClient({ chain: gnosis, transport: http() });
      
      // Check if already minted (best effort - don't block if check fails)
      try {
        const labelhash = keccak256(encodePacked(['string'], [sldLabel]));
        const subnode = keccak256(encodePacked(['bytes32', 'bytes32'], [NFTMAIL_GNO_NAMEHASH, labelhash]));
        const existingOwner = await publicClient.readContract({ 
          address: GNS_REGISTRY, 
          abi: GNSRegistryABI, 
          functionName: 'owner', 
          args: [subnode] 
        });
        
        if (existingOwner && existingOwner !== '0x0000000000000000000000000000000000000000') {
          throw new Error(`${sldLabel}.nftmail.gno is already minted.`);
        }
      } catch (checkErr: any) {
        // If the check itself failed (e.g., contract revert), log but continue
        // The actual mint transaction will fail if name is taken
        console.log('Pre-mint check failed, continuing:', checkErr?.message);
      }

      // Switch to Gnosis and get provider
      const wallet = injectedWallet || anyWallet;
      if (!wallet) throw new Error('No wallet connected. Use MetaMask or Rabby.');
      
      await wallet.switchChain(gnosis.id);
      const provider = await wallet.getEthereumProvider();
      const walletClient = createWalletClient({ 
        chain: gnosis, 
        transport: custom(provider), 
        account: wallet.address as `0x${string}` 
      });

      // Check balance (need 10 or 100 xDAI + gas)
      const mintPrice = selectedTier === 'IMAGO' ? BigInt(100 * 10**18) : BigInt(10 * 10**18);
      const balanceWei = await publicClient.getBalance({ address: wallet.address as `0x${string}` });
      if (balanceWei < mintPrice) {
        const needed = selectedTier === 'IMAGO' ? '100' : '10';
        throw new Error(`Need ${needed} xDAI + gas. Balance: ${Number(balanceWei) / 10**18} xDAI`);
      }

      // Mint NFT with payment
      const registrar = '0x831ddd71e7c33e16b674099129E6E379DA407fAF' as `0x${string}`;
      const hash = await walletClient.writeContract({
        address: registrar, 
        abi: NamespaceRegistrarABI, 
        functionName: 'mintSubname',
        args: [sldLabel, wallet.address as `0x${string}`, '0x', '0x0000000000000000000000000000000000000000000000000000000000000000'],
        value: mintPrice,
      });

      // Wait for receipt
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      setTxHash(hash);

      // Verify OTP and migrate if from mini app
      if (fromParam === 'mini' && otpCode) {
        try {
          await fetch('https://nftmail-email-worker.richard-159.workers.dev', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              action: 'verifyOTP', 
              code: otpCode,
              newAddress: wallet.address 
            }),
          });
        } catch {}
      }

      setStep('success');
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
      
    } catch (err: any) {
      setError(err?.shortMessage || err?.message || 'Minting failed');
      setStep('error');
    }
  }, [authenticated, walletAddress, sldLabel, injectedWallet, anyWallet, otpCode, fromParam, router, selectedTier]);

  const gradientBg = {
    background: 'radial-gradient(1200px circle at 20% -10%, rgba(0,163,255,0.16), transparent 45%), radial-gradient(900px circle at 90% 10%, rgba(124,77,255,0.14), transparent 40%), linear-gradient(180deg, #0a0a0a, #03040a)',
  };

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
          <h2 className="text-white font-bold text-2xl mb-2">Minted!</h2>
          <p className="text-green-400 font-mono text-sm mb-4">{sldLabel}.nftmail.gno ({selectedTier})</p>
          <p className="text-gray-400 text-xs mb-6">Redirecting to dashboard...</p>
          {txHash && (
            <a 
              href={`https://gnosisscan.io/tx/${txHash}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#855DCD] text-xs hover:underline block mb-4"
            >
              View Transaction →
            </a>
          )}
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

        {/* Agent Name Display */}
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-800 mb-6">
          <p className="text-gray-400 text-xs mb-1">Your NFTmail address:</p>
          <p className="text-[#43a574] font-mono text-sm font-bold">{displayName}.nftmail.gno</p>
        </div>

        {/* OTP Input (if from mini app) */}
        {fromParam === 'mini' && (
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800 mb-6">
            <label className="text-gray-400 text-xs mb-2 block">Upgrade Code (from Farcaster):</label>
            <input
              type="text"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="6-digit code"
              className="w-full bg-black border border-gray-700 text-white text-center text-xl font-mono tracking-widest py-3 rounded focus:border-[#43a574] focus:outline-none"
              maxLength={6}
            />
            <p className="text-gray-500 text-xs mt-2">Enter the 6-digit code shown in your Farcaster Mini App</p>
          </div>
        )}

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

        {/* Mint or Connect Wallet Button */}
        {!authenticated ? (
          <button
            onClick={login}
            className="w-full font-bold py-4 rounded-xl transition-colors mb-3 bg-[#855DCD] hover:bg-[#9a6fd9] text-white"
          >
            Connect Wallet to Mint →
          </button>
        ) : (
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
        )}

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
