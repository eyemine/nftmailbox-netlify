'use client';

/// PrivateFaxViewer — decrypts and renders an end-to-end encrypted NFTfax.
///
/// Flow: fetch the ciphertext envelope (+ the recipient's wrapped key), have the
/// wallet re-sign FAX_KEY_MESSAGE, unwrap the private key in-browser, then
/// ECIES-decrypt the bitmap. Plaintext exists only transiently in this tab.

import { useCallback, useEffect, useMemo, useState } from 'react';
import { FAX_KEY_MESSAGE, unwrapFaxKey, eciesDecrypt, type FaxEnvelope, type WrappedFaxKey } from '@/app/lib/fax-crypto';

interface PrivateFaxViewerProps {
  trayId: string;
  local: string;         // recipient mailbox local-part (owns the wrapped key)
  walletAddress: string; // connected wallet used to sign
}

interface TrayEnvelopeDoc {
  id: string;
  from: string;
  format: 'png' | 'bmp' | 'jpg';
  channel?: 'public' | 'private';
  encrypted?: boolean;
  envelope?: FaxEnvelope;
  dataBase64?: string;
  createdAt: number;
}

const FADE_MS = 72 * 60 * 60 * 1000;

function contrastForElapsed(ms: number): number {
  if (ms <= 24 * 60 * 60 * 1000) return 1.0;
  if (ms <= 48 * 60 * 60 * 1000) return 0.7;
  if (ms <= 72 * 60 * 60 * 1000) return 0.4;
  return 0.1;
}

async function signMessage(message: string, account: string): Promise<string> {
  const eth = (window as unknown as { ethereum?: { request: (a: { method: string; params?: unknown[] }) => Promise<string> } }).ethereum;
  if (!eth) throw new Error('No wallet provider available');
  return eth.request({ method: 'personal_sign', params: [message, account] });
}

export default function PrivateFaxViewer({ trayId, local, walletAddress }: PrivateFaxViewerProps) {
  const [doc, setDoc] = useState<TrayEnvelopeDoc | null>(null);
  const [plaintextB64, setPlaintextB64] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/tray/${trayId}`);
        const data = await res.json() as TrayEnvelopeDoc & { error?: string };
        if (!res.ok) throw new Error(data.error || 'Fax not found');
        if (!cancelled) {
          setDoc(data);
          // Public faxes carry the plaintext bitmap — render immediately.
          if (!data.encrypted && data.channel !== 'private' && data.dataBase64) {
            setPlaintextB64(data.dataBase64);
          }
        }
      } catch (err: unknown) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load fax');
      }
    })();
    return () => { cancelled = true; };
  }, [trayId]);

  const handleDecrypt = useCallback(async () => {
    if (!doc?.envelope) return;
    setBusy(true);
    setError(null);
    try {
      const keyRes = await fetch(`/api/fax-key?local=${encodeURIComponent(local)}`);
      const keyData = await keyRes.json() as (WrappedFaxKey & { hasKey?: boolean; error?: string });
      if (!keyRes.ok || !keyData.hasKey) {
        throw new Error('No private fax key found for this mailbox. Enable Private Fax first.');
      }
      const signature = await signMessage(FAX_KEY_MESSAGE, walletAddress);
      const privPkcs8 = await unwrapFaxKey(
        { publicKey: keyData.publicKey, wrappedPrivateKey: keyData.wrappedPrivateKey, wrapIv: keyData.wrapIv },
        signature,
      );
      const plaintext = await eciesDecrypt(doc.envelope, privPkcs8);
      setPlaintextB64(plaintext);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Decryption failed — wrong wallet or corrupted fax');
    } finally {
      setBusy(false);
    }
  }, [doc, local, walletAddress]);

  const { contrast, remainingLabel, jammed } = useMemo(() => {
    const elapsed = doc ? Math.max(0, now - doc.createdAt) : 0;
    const remaining = Math.max(0, FADE_MS - elapsed);
    const totalMinutes = Math.floor(remaining / 60000);
    return {
      contrast: contrastForElapsed(elapsed),
      remainingLabel: `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`,
      jammed: elapsed > FADE_MS,
    };
  }, [doc, now]);

  if (error && !doc) {
    return <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-[11px] text-red-300">{error}</div>;
  }
  if (!doc) {
    return <div className="text-[11px] text-[var(--muted)]">Loading encrypted fax&hellip;</div>;
  }

  const mimeType = doc.format === 'png' ? 'image/png' : doc.format === 'jpg' ? 'image/jpeg' : 'image/bmp';

  return (
    <div style={{
      maxWidth: 420, width: '100%', background: '#f4f1e8', boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      padding: '20px 20px 28px', fontFamily: "'Courier New', Courier, monospace", color: '#2a2a2a',
    }}>
      <div style={{ borderBottom: '2px dashed #999', paddingBottom: 10, marginBottom: 14 }}>
        <div style={{ fontSize: 11, letterSpacing: 1, color: '#666' }}>NFTfax · ENCRYPTED TRANSMISSION</div>
        <div style={{ fontSize: 10, color: '#888', marginTop: 4 }}>FROM: {doc.from}</div>
        <div style={{ fontSize: 10, color: '#888' }}>T/#{doc.id.toUpperCase()}</div>
      </div>

      <div style={{
        padding: '8px 10px', marginBottom: 12, background: jammed ? '#a94228' : '#31372e',
        color: jammed ? '#fff' : '#a9c99f', fontSize: 10, textAlign: 'center', letterSpacing: 1, textTransform: 'uppercase',
      }}>
        {jammed ? 'LINE JAMMED — THERMAL FADE EXPIRED' : `THERMAL FADE: ${remainingLabel} REMAINING`}
      </div>

      {plaintextB64 ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`data:${mimeType};base64,${plaintextB64}`}
          alt={`Decrypted transmission from ${doc.from}`}
          style={{ width: '100%', display: 'block', filter: `grayscale(1) contrast(${contrast})`, imageRendering: 'pixelated' }}
        />
      ) : (
        <div style={{ textAlign: 'center', padding: '24px 8px' }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>&#128274;</div>
          <button
            onClick={handleDecrypt}
            disabled={busy || !walletAddress}
            style={{
              padding: '10px 18px', background: '#31372e', color: '#a9c99f', border: 'none',
              fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', cursor: 'pointer',
              fontFamily: 'inherit', opacity: busy || !walletAddress ? 0.4 : 1,
            }}
          >
            {busy ? 'Decrypting…' : 'Unlock with Wallet'}
          </button>
          {error && <div style={{ marginTop: 12, fontSize: 10, color: '#a94228' }}>{error}</div>}
        </div>
      )}

      <div style={{ borderTop: '2px dashed #999', paddingTop: 8, marginTop: 14, fontSize: 9, color: '#999', textAlign: 'center' }}>
        NFTfax · nftmail.box · end-to-end encrypted, decrypted in-browser
      </div>
    </div>
  );
}
