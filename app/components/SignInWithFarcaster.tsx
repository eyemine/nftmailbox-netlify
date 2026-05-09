'use client';

import { useState, useCallback } from 'react';
import { SignInButton } from '@farcaster/auth-kit';
import '@farcaster/auth-kit/styles.css';

interface FarcasterProfile {
  fid: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
  bio?: string;
  custodyAddress?: string;
}

interface SignInWithFarcasterProps {
  onSuccess?: (profile: FarcasterProfile) => void;
  onError?: (error: string) => void;
}

export function SignInWithFarcaster({ onSuccess, onError }: SignInWithFarcasterProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSuccess = useCallback(async (response: any) => {
    setIsVerifying(true);
    setError(null);
    
    try {
      // Verify the signature server-side
      const verifyRes = await fetch('/api/farcaster/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: response.message,
          signature: response.signature,
          nonce: response.nonce,
          domain: window.location.host,
        }),
      });
      
      const verifyData = await verifyRes.json();
      
      if (!verifyRes.ok || !verifyData.success) {
        throw new Error(verifyData.error || 'Signature verification failed');
      }
      
      const profile: FarcasterProfile = {
        fid: verifyData.fid,
        username: verifyData.username,
        displayName: verifyData.displayName,
        pfpUrl: verifyData.pfpUrl,
        bio: verifyData.bio,
        custodyAddress: verifyData.custodyAddress,
      };
      
      // Store session
      localStorage.setItem('farcaster:session', JSON.stringify({
        ...profile,
        verifiedAt: Date.now(),
      }));
      
      onSuccess?.(profile);
    } catch (err: any) {
      const msg = err?.message || 'Failed to verify Farcaster signature';
      setError(msg);
      onError?.(msg);
    } finally {
      setIsVerifying(false);
    }
  }, [onSuccess, onError]);

  const handleError = useCallback((err?: Error) => {
    const msg = err?.message || 'Farcaster sign-in failed';
    setError(msg);
    onError?.(msg);
  }, [onError]);

  return (
    <div className="flex flex-col gap-2">
      <SignInButton
        onSuccess={handleSuccess}
        onError={handleError}
        nonce={async () => {
          const res = await fetch('/api/farcaster/nonce');
          const data = await res.json();
          return data.nonce;
        }}
      />
      
      {isVerifying && (
        <div className="flex items-center justify-center gap-2 py-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
          <span className="text-sm text-gray-400">Verifying signature...</span>
        </div>
      )}
      
      {error && (
        <p className="text-center text-xs text-amber-400">{error}</p>
      )}
    </div>
  );
}

// Hook to check existing Farcaster session
export function useFarcasterSession(): FarcasterProfile | null {
  const [session, setSession] = useState<FarcasterProfile | null>(null);
  
  useState(() => {
    try {
      const stored = localStorage.getItem('farcaster:session');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Check if session is less than 7 days old
        if (Date.now() - parsed.verifiedAt < 7 * 24 * 60 * 60 * 1000) {
          setSession(parsed);
        } else {
          localStorage.removeItem('farcaster:session');
        }
      }
    } catch {}
  });
  
  return session;
}

export function clearFarcasterSession() {
  localStorage.removeItem('farcaster:session');
}
