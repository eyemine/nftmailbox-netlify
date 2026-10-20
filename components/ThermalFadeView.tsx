'use client';

import { useEffect, useMemo, useState } from 'react';

interface TrayDocument {
  id: string;
  from: string;
  format: 'png' | 'bmp' | 'jpg';
  dataBase64: string;
  createdAt: number;
}

const FADE_MS = 72 * 60 * 60 * 1000;

function contrastForElapsed(elapsedMs: number): number {
  if (elapsedMs <= 24 * 60 * 60 * 1000) return 1.0;
  if (elapsedMs <= 48 * 60 * 60 * 1000) return 0.7;
  if (elapsedMs <= 72 * 60 * 60 * 1000) return 0.4;
  return 0.1;
}

function formatRemaining(ms: number): string {
  if (ms <= 0) return '0h 0m';
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
}

export default function ThermalFadeView({ doc }: { doc: TrayDocument }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const { elapsedMs, remainingMs, contrast, isJammed } = useMemo(() => {
    const elapsed = now === null ? 0 : Math.max(0, now - doc.createdAt);
    const remaining = Math.max(0, FADE_MS - elapsed);
    return {
      elapsedMs: elapsed,
      remainingMs: remaining,
      contrast: contrastForElapsed(elapsed),
      isJammed: elapsed > FADE_MS,
    };
  }, [now, doc.createdAt]);

  const mimeType = doc.format === 'png' ? 'image/png' : doc.format === 'jpg' ? 'image/jpeg' : 'image/bmp';
  const dataUri = `data:${mimeType};base64,${doc.dataBase64}`;
  const receivedAt = new Date(doc.createdAt).toLocaleString();

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 16px',
      background: '#1a1a1a',
    }}>
      <div style={{
        maxWidth: 420,
        width: '100%',
        background: '#f4f1e8',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        padding: '20px 20px 28px',
        fontFamily: "'Courier New', Courier, monospace",
        color: '#2a2a2a',
      }}>
        <div style={{ borderBottom: '2px dashed #999', paddingBottom: 10, marginBottom: 14 }}>
          <div style={{ fontSize: 11, letterSpacing: 1, color: '#666' }}>NFTfax · SECURE TRANSMISSION</div>
          <div style={{ fontSize: 10, color: '#888', marginTop: 4 }}>FROM: {doc.from}</div>
          <div style={{ fontSize: 10, color: '#888' }}>T/#{doc.id.toUpperCase()} · {receivedAt}</div>
        </div>

        <div style={{
          padding: '8px 10px',
          marginBottom: 12,
          background: isJammed ? '#a94228' : '#31372e',
          color: isJammed ? '#fff' : '#a9c99f',
          fontSize: 10,
          textAlign: 'center',
          letterSpacing: 1,
          textTransform: 'uppercase',
        }}>
          {isJammed ? 'LINE JAMMED — THERMAL FADE EXPIRED' : `THERMAL FADE: ${formatRemaining(remainingMs)} REMAINING`}
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={dataUri}
          alt={`Secure transmission from ${doc.from}`}
          style={{
            width: '100%',
            display: 'block',
            filter: `grayscale(1) contrast(${contrast})`,
            imageRendering: 'pixelated',
            transition: 'filter 0.3s ease',
          }}
        />

        <div style={{ borderTop: '2px dashed #999', paddingTop: 8, marginTop: 14, fontSize: 9, color: '#999', textAlign: 'center' }}>
          NFTfax · nftmail.box · static image, no scripts, no tracking
        </div>
      </div>
    </main>
  );
}
