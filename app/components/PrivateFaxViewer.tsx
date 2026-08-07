'use client';

/// PrivateFaxViewer — decrypts and renders an end-to-end encrypted NFTfax.
///
/// Flow: fetch the ciphertext envelope (+ the recipient's wrapped key), have the
/// wallet re-sign FAX_KEY_MESSAGE, unwrap the private key in-browser, then
/// ECIES-decrypt the bitmap. Plaintext exists only transiently in this tab.

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { FAX_KEY_MESSAGE, unwrapFaxKey, eciesDecrypt, type FaxEnvelope, type WrappedFaxKey } from '@/app/lib/fax-crypto';
import { signWithWallet } from '@/app/lib/wallet-sign';

interface PrivateFaxViewerProps {
  trayId: string;
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
  local?: string;        // recipient mailbox local-part (auto-exposed from tray)
  createdAt: number;
}

function drawStochasticBitmap(canvas: HTMLCanvasElement, envelope: FaxEnvelope) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const modules = 33;
  const size = 420;
  const mod = size / modules;
  ctx.fillStyle = '#f4f1e8';
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = '#2a2a2a';
  const seed = (envelope.ct || '') + (envelope.hash || '') + (envelope.epk || '');
  if (!seed) return;
  let idx = 0;
  for (let y = 0; y < modules; y += 1) {
    for (let x = 0; x < modules; x += 1) {
      if (seed.charCodeAt(idx % seed.length) % 2 === 1) {
        ctx.fillRect(x * mod, y * mod, mod, mod);
      }
      idx += 1;
    }
  }
}

export default function PrivateFaxViewer({ trayId, walletAddress }: PrivateFaxViewerProps) {
  const [doc, setDoc] = useState<TrayEnvelopeDoc | null>(null);
  const [plaintextB64, setPlaintextB64] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { wallets } = useWallets();
  const { signMessage } = usePrivy();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/tray/${trayId}`);
        const data = await res.json() as TrayEnvelopeDoc & { error?: string };
        if (!res.ok) throw new Error(data.error || 'Fax not found');
        if (!cancelled) {
          setDoc(data);
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !doc?.envelope || plaintextB64) return;
    drawStochasticBitmap(canvas, doc.envelope);
  }, [doc, plaintextB64]);

  const handleDecrypt = useCallback(async () => {
    if (!doc?.envelope || !doc.local) return;
    setBusy(true);
    setError(null);
    try {
      const keyRes = await fetch(`/api/fax-key?local=${encodeURIComponent(doc.local)}`);
      const keyData = await keyRes.json() as (WrappedFaxKey & { hasKey?: boolean; error?: string });
      if (!keyRes.ok || !keyData.hasKey) {
        throw new Error('No private fax key found for this mailbox. Enable Private Fax first.');
      }
      const signature = await signWithWallet(FAX_KEY_MESSAGE, walletAddress, wallets, signMessage);
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
  }, [doc, walletAddress, wallets, signMessage]);

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
      padding: '20px 20px 28px', fontFamily: "'Courier New', Courier, monospace", color: '#2a2a2a', margin: '0 auto',
    }}>
      <div style={{ borderBottom: '2px dashed #999', paddingBottom: 10, marginBottom: 14 }}>
        <div style={{ fontSize: 11, letterSpacing: 1, color: '#666' }}>NFTfax · ENCRYPTED TRANSMISSION</div>
        <div style={{ fontSize: 10, color: '#888', marginTop: 4 }}>FROM: {doc.from}</div>
        <div style={{ fontSize: 10, color: '#888' }}>T/#{doc.id.toUpperCase()}</div>
      </div>

      {plaintextB64 ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`data:${mimeType};base64,${plaintextB64}`}
          alt={`Decrypted transmission from ${doc.from}`}
          style={{ width: '100%', maxWidth: 420, display: 'block', margin: '0 auto', filter: 'grayscale(1)', imageRendering: 'pixelated' }}
        />
      ) : (
        <div style={{ textAlign: 'center', padding: '12px 8px' }}>
          <canvas
            ref={canvasRef}
            width={420}
            height={420}
            style={{ width: '100%', maxWidth: 420, display: 'block', margin: '0 auto', imageRendering: 'pixelated', marginBottom: 14 }}
          />
          <button
            onClick={handleDecrypt}
            disabled={busy || !walletAddress}
            style={{
              padding: '10px 18px', background: '#31372e', color: '#a9c99f', border: 'none',
              fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', cursor: 'pointer',
              fontFamily: 'inherit', opacity: busy || !walletAddress ? 0.4 : 1,
            }}
          >
            {busy ? 'DECRYPTING…' : 'DECRYPT WITH WALLET'}
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
