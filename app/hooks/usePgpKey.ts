'use client';

/// usePgpKey — React hook for browser-side PGP key management and decryption.
///
/// Mirrors useEciesDecrypt but for OpenPGP (RFC 4880) keys:
///   1. Check localStorage for a wrapped PGP key (ciphertext only).
///   2. If none: UI prompts to generate + register via wallet signature.
///   3. If present: user signs PGP_KEY_MESSAGE to unwrap the private key in-browser.
///   4. Unwrapped key decrypts PGP-encrypted inbound messages (in-memory only).
///
/// Key storage: localStorage key = `nftmail-pgp:{agentName}` (wrapped, never raw).

import { useState, useCallback, useEffect } from 'react';
import {
  PGP_KEY_MESSAGE,
  provisionPgpKey,
  unwrapPgpKey,
  pgpDecrypt,
  pgpKeyInfo,
  storeWrappedPgpKey,
  loadWrappedPgpKey,
  clearWrappedPgpKey,
  hasWrappedPgpKey,
  type WrappedPgpKey,
} from '../lib/pgp-crypto';
import { workerFetch } from '@/app/lib/worker-fetch';

export interface PgpKeyInfo {
  hasKey: boolean;
  publicKey?: string;
  fingerprint?: string;
  keyId?: string;
  wrappedPrivateKey?: string;
  wrapIv?: string;
}

type KeyState = 'unknown' | 'missing' | 'locked' | 'unlocked' | 'generating' | 'error';

interface UsePgpKeyReturn {
  keyState: KeyState;
  hasKey: boolean;
  isUnlocked: boolean;
  pgpKeyInfo: PgpKeyInfo | null;
  error: string | null;
  busy: boolean;
  refreshRemote: () => Promise<void>;
  provision: (agentName: string, walletAddress: string, signFn: () => Promise<string>) => Promise<boolean>;
  unlock: (signFn: () => Promise<string>) => Promise<boolean>;
  forgetKey: () => void;
  decryptMessage: (armoredMessage: string) => Promise<string | null>;
}

export function usePgpKey(agentName: string | null): UsePgpKeyReturn {
  const [keyState, setKeyState] = useState<KeyState>('unknown');
  const [remoteInfo, setRemoteInfo] = useState<PgpKeyInfo | null>(null);
  const [unwrappedPrivateKey, setUnwrappedPrivateKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const baseName = agentName ? agentName.replace(/_+$/, '') : null;

  // On mount: check localStorage for wrapped key + fetch remote key info
  const refreshRemote = useCallback(async () => {
    if (!baseName) return;
    try {
      const res = await fetch(`/api/pgp-key?local=${encodeURIComponent(baseName)}`, { cache: 'no-store' });
      if (!res.ok) {
        setRemoteInfo({ hasKey: false });
        return;
      }
      const data = await res.json() as PgpKeyInfo & { error?: string };
      setRemoteInfo({
        hasKey: !!data.hasKey,
        publicKey: data.publicKey,
        fingerprint: data.fingerprint,
        keyId: data.keyId,
        wrappedPrivateKey: data.wrappedPrivateKey,
        wrapIv: data.wrapIv,
      });
    } catch {
      setRemoteInfo({ hasKey: false });
    }
  }, [baseName]);

  useEffect(() => {
    if (!baseName) {
      setKeyState('missing');
      return;
    }
    const local = loadWrappedPgpKey(baseName);
    if (local) {
      setKeyState('locked');
    } else {
      setKeyState('missing');
    }
    void refreshRemote();
  }, [baseName, refreshRemote]);

  // Generate a new PGP key pair, wrap with wallet signature, register with worker
  const provision = useCallback(async (
    agent: string,
    _walletAddress: string,
    signFn: () => Promise<string>,
  ): Promise<boolean> => {
    const base = agent.replace(/_+$/, '');
    setKeyState('generating');
    setBusy(true);
    setError(null);
    try {
      const signature = await signFn();
      const wrapped = await provisionPgpKey(signature, base);

      // Register with worker via proxy
      const res = await workerFetch('/api/pgp-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          local: base,
          publicKey: wrapped.publicKey,
          fingerprint: wrapped.fingerprint,
          keyId: wrapped.keyId,
          wrappedPrivateKey: wrapped.wrappedPrivateKey,
          wrapIv: wrapped.wrapIv,
          ownerWallet: _walletAddress,
        }),
      });
      const data = await res.json() as { error?: string };
      if (!res.ok) throw new Error(data.error || 'PGP key registration failed');

      // Cache wrapped key locally (ciphertext only)
      storeWrappedPgpKey(base, wrapped);
      setUnwrappedPrivateKey(null);
      setKeyState('locked');
      await refreshRemote();
      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Key generation failed');
      setKeyState('error');
      return false;
    } finally {
      setBusy(false);
    }
  }, [refreshRemote]);

  // Unlock: re-sign PGP_KEY_MESSAGE, re-derive wrap key, unwrap private key in-browser
  const unlock = useCallback(async (signFn: () => Promise<string>): Promise<boolean> => {
    if (!baseName) return false;
    setBusy(true);
    setError(null);
    try {
      const local = loadWrappedPgpKey(baseName);
      if (!local) {
        // Try remote wrapped key (recoverable on new device)
        if (remoteInfo?.wrappedPrivateKey && remoteInfo?.wrapIv) {
          const remoteWrapped: WrappedPgpKey = {
            publicKey: remoteInfo.publicKey || '',
            wrappedPrivateKey: remoteInfo.wrappedPrivateKey,
            wrapIv: remoteInfo.wrapIv,
            fingerprint: remoteInfo.fingerprint || '',
            keyId: remoteInfo.keyId || '',
          };
          const signature = await signFn();
          const priv = await unwrapPgpKey(remoteWrapped, signature);
          setUnwrappedPrivateKey(priv);
          storeWrappedPgpKey(baseName, remoteWrapped);
          setKeyState('unlocked');
          return true;
        }
        throw new Error('No PGP key found. Provision one first.');
      }

      const signature = await signFn();
      const priv = await unwrapPgpKey(local, signature);
      setUnwrappedPrivateKey(priv);
      setKeyState('unlocked');
      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unlock failed — wrong wallet?');
      setKeyState('locked');
      return false;
    } finally {
      setBusy(false);
    }
  }, [baseName, remoteInfo]);

  // Forget: remove wrapped key from localStorage (does NOT delete from worker)
  const forgetKey = useCallback(() => {
    if (!baseName) return;
    clearWrappedPgpKey(baseName);
    setUnwrappedPrivateKey(null);
    setKeyState('missing');
  }, [baseName]);

  // Decrypt a single armored PGP message using the unlocked private key
  const decryptMessage = useCallback(async (armoredMessage: string): Promise<string | null> => {
    if (!unwrappedPrivateKey) {
      setError('PGP key is locked. Unlock first.');
      return null;
    }
    try {
      const plaintext = await pgpDecrypt(armoredMessage, unwrappedPrivateKey);
      return plaintext;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Decryption failed');
      return null;
    }
  }, [unwrappedPrivateKey]);

  const hasKey = keyState !== 'missing' && keyState !== 'unknown' && (hasWrappedPgpKey(baseName || '') || !!remoteInfo?.hasKey);
  const isUnlocked = keyState === 'unlocked' && !!unwrappedPrivateKey;

  return {
    keyState,
    hasKey,
    isUnlocked,
    pgpKeyInfo: remoteInfo,
    error,
    busy,
    refreshRemote,
    provision,
    unlock,
    forgetKey,
    decryptMessage,
  };
}
