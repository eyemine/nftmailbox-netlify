'use client';

/**
 * IdentityContext — universal identity layer for nftmail.box
 *
 * Handles two entry contexts with one codebase:
 *
 *   1. Farcaster Mini-App (inside Warpcast/Farcaster webview)
 *      — Detects via @farcaster/miniapp-sdk context.user
 *      — activeWalletAddress = Farcaster custody address (hot proxy)
 *      — coldVaultAddress = user-supplied cold wallet for delegate.xyz checks
 *
 *   2. Standard Web Browser (desktop, mobile Safari, MetaMask, Ledger, etc.)
 *      — Falls back to Privy wallet (usePrivy / useWallets)
 *      — activeWalletAddress = connected EOA
 *      — coldVaultAddress = user-supplied cold wallet for delegate.xyz checks
 *
 * Components should consume this context instead of calling sdk.context directly,
 * so the same component tree works in both environments.
 */

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';

interface IdentityContextType {
  /** true when running inside a Farcaster mini-app webview */
  isFarcasterEnv: boolean;
  /** Farcaster FID (null in standard browser) */
  fid: number | null;
  /** The hot/signing wallet address (Farcaster custody or Privy wallet) */
  activeWalletAddress: string | null;
  /** Optional cold vault wallet — set by user for delegate.xyz proxy access */
  coldVaultAddress: string | null;
  setColdVaultAddress: (addr: string | null) => void;
  /** Whether the SDK/wallet identity has finished loading */
  identityReady: boolean;
}

const IdentityContext = createContext<IdentityContextType>({
  isFarcasterEnv: false,
  fid: null,
  activeWalletAddress: null,
  coldVaultAddress: null,
  setColdVaultAddress: () => {},
  identityReady: false,
});

export function useIdentity() {
  return useContext(IdentityContext);
}

export function IdentityProvider({ children }: { children: ReactNode }) {
  const [isFarcasterEnv, setIsFarcasterEnv] = useState(false);
  const [fid, setFid] = useState<number | null>(null);
  const [activeWalletAddress, setActiveWalletAddress] = useState<string | null>(null);
  const [coldVaultAddress, setColdVaultAddressState] = useState<string | null>(null);
  const [identityReady, setIdentityReady] = useState(false);

  const setColdVaultAddress = useCallback((addr: string | null) => {
    setColdVaultAddressState(addr);
    // Persist across page navigations within the same session
    try {
      if (addr) sessionStorage.setItem('nftmail:coldVault', addr);
      else sessionStorage.removeItem('nftmail:coldVault');
    } catch {}
  }, []);

  useEffect(() => {
    // Restore cold vault from session (survives navigation, cleared on tab close)
    try {
      const saved = sessionStorage.getItem('nftmail:coldVault');
      if (saved) setColdVaultAddressState(saved);
    } catch {}

    const detect = async () => {
      // Dynamic import — SDK is only needed client-side and only present in Farcaster env
      try {
        const { sdk } = await import('@farcaster/miniapp-sdk');
        const context = await sdk.context;
        if (context?.user?.fid) {
          setIsFarcasterEnv(true);
          setFid(context.user.fid);
          // custodyAddress is the Farcaster-managed hot wallet
          const addr = (context.user as unknown as { custodyAddress?: string }).custodyAddress ?? null;
          setActiveWalletAddress(addr);
          // Signal to Farcaster that splash screen can be hidden
          try { await sdk.actions.ready(); } catch {}
        }
      } catch {
        // Not in a Farcaster environment — standard browser path
        // activeWalletAddress will be populated by usePrivy/useWallets in consuming components
      }
      setIdentityReady(true);
    };

    detect();
  }, []);

  return (
    <IdentityContext.Provider value={{
      isFarcasterEnv,
      fid,
      activeWalletAddress,
      coldVaultAddress,
      setColdVaultAddress,
      identityReady,
    }}>
      {children}
    </IdentityContext.Provider>
  );
}
