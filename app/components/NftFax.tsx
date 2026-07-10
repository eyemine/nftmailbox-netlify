/// NFTfax compose panel — PREMIUM feature.
///
/// The transmission channel is bitmap-only: the recipient's inbox receives a
/// plaintext pointer notification, and the image is rendered as a static <img>
/// from a base64 data URI on our own domain (no HTML parsing, no remote loads,
/// no script context). This component builds that bitmap two ways:
///   1. Upload  — user supplies a PNG/BMP file.
///   2. Compose — user types a message that we render to a PNG via <canvas>,
///                giving a retro thermal-fax look with zero tracking surface.

'use client';

import { useRef, useState } from 'react';

interface NftFaxProps {
  fromLabel: string;
  ownerWallet: string;
}

type Mode = 'compose' | 'upload';

const MAX_BASE64_LENGTH = 1_400_000; // ~1MB binary, mirrors /api/tray/send

// Strip the `data:*;base64,` prefix so we send raw base64 to the worker.
function stripDataUri(dataUri: string): string {
  const comma = dataUri.indexOf(',');
  return comma >= 0 ? dataUri.slice(comma + 1) : dataUri;
}

// Render typed text to a monochrome PNG that looks like thermal fax paper.
function renderTextToPng(text: string): string {
  const width = 480;
  const padding = 24;
  const lineHeight = 22;
  const fontSize = 15;

  const measure = document.createElement('canvas').getContext('2d');
  if (!measure) return '';
  measure.font = `${fontSize}px 'Courier New', Courier, monospace`;

  // Word-wrap to the canvas width.
  const maxTextWidth = width - padding * 2;
  const lines: string[] = [];
  for (const rawLine of text.split('\n')) {
    const words = rawLine.split(' ');
    let current = '';
    for (const word of words) {
      const test = current ? `${current} ${word}` : word;
      if (measure.measureText(test).width > maxTextWidth && current) {
        lines.push(current);
        current = word;
      } else {
        current = test;
      }
    }
    lines.push(current);
  }

  const height = padding * 2 + 60 + lines.length * lineHeight;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Paper
  ctx.fillStyle = '#f4f1e8';
  ctx.fillRect(0, 0, width, height);

  // Header band
  ctx.fillStyle = '#2a2a2a';
  ctx.font = `bold 12px 'Courier New', Courier, monospace`;
  ctx.fillText('NFTfax · SECURE TRANSMISSION', padding, padding + 4);
  ctx.strokeStyle = '#999';
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(padding, padding + 18);
  ctx.lineTo(width - padding, padding + 18);
  ctx.stroke();
  ctx.setLineDash([]);

  // Body
  ctx.fillStyle = '#1a1a1a';
  ctx.font = `${fontSize}px 'Courier New', Courier, monospace`;
  let y = padding + 48;
  for (const line of lines) {
    ctx.fillText(line, padding, y);
    y += lineHeight;
  }

  return stripDataUri(canvas.toDataURL('image/png'));
}

export default function NftFax({ fromLabel, ownerWallet }: NftFaxProps) {
  const [mode, setMode] = useState<Mode>('compose');
  const [to, setTo] = useState('');
  const [message, setMessage] = useState('');
  const [fileB64, setFileB64] = useState('');
  const [fileFormat, setFileFormat] = useState<'png' | 'bmp' | 'jpg'>('png');
  const [fileName, setFileName] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [trayUrl, setTrayUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setError('');
    setTrayUrl('');
    const lower = file.name.toLowerCase();
    const format: 'png' | 'bmp' | 'jpg' | null = lower.endsWith('.png')
      ? 'png'
      : lower.endsWith('.bmp')
        ? 'bmp'
        : lower.endsWith('.jpg') || lower.endsWith('.jpeg')
          ? 'jpg'
          : null;
    if (!format) {
      setError('Only PNG, JPG, or BMP files are permitted.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const b64 = stripDataUri(String(reader.result || ''));
      if (b64.length > MAX_BASE64_LENGTH) {
        setError('Document too large (max ~1MB).');
        return;
      }
      setFileB64(b64);
      setFileFormat(format);
      setFileName(file.name);
    };
    reader.onerror = () => setError('Could not read file.');
    reader.readAsDataURL(file);
  };

  const handleSend = async () => {
    setError('');
    setTrayUrl('');

    if (!to || !to.includes('@')) {
      setError('Enter a valid recipient email address.');
      return;
    }

    let dataBase64 = '';
    let format: 'png' | 'bmp' | 'jpg' = 'png';
    if (mode === 'compose') {
      if (!message.trim()) {
        setError('Type a message to transmit.');
        return;
      }
      dataBase64 = renderTextToPng(message);
      format = 'png';
      if (!dataBase64) {
        setError('Could not render the message. Try the upload mode.');
        return;
      }
    } else {
      if (!fileB64) {
        setError('Choose a PNG or BMP file to transmit.');
        return;
      }
      dataBase64 = fileB64;
      format = fileFormat;
    }

    setSending(true);
    try {
      const res = await fetch('/api/tray/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromLabel, ownerWallet, to, format, dataBase64 }),
      });
      const data = (await res.json()) as { trayUrl?: string; error?: string; upgradeUrl?: string };
      if (!res.ok) {
        throw new Error(data.error || 'Transmission failed');
      }
      setTrayUrl(data.trayUrl || '');
      setMessage('');
      setFileB64('');
      setFileName('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transmission failed');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">NFTfax</h3>
          <p className="text-sm text-gray-400">
            Static-image secure transmission (PNG/JPG/BMP) — no tracking pixels, no remote loads, no scripts.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
          PREMIUM
        </span>
      </div>

      {/* Mode switch */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => { setMode('compose'); setError(''); }}
          className={`p-2.5 rounded-lg border text-sm font-semibold transition ${
            mode === 'compose'
              ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
              : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600'
          }`}
        >
          Compose message
        </button>
        <button
          type="button"
          onClick={() => { setMode('upload'); setError(''); }}
          className={`p-2.5 rounded-lg border text-sm font-semibold transition ${
            mode === 'upload'
              ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
              : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600'
          }`}
        >
          Upload PNG/BMP
        </button>
      </div>

      <div>
        <label htmlFor="faxTo" className="block text-sm font-medium text-gray-300 mb-1">
          Recipient
        </label>
        <input
          type="email"
          id="faxTo"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="agent@nftmail.box or any email"
          className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition"
        />
      </div>

      {mode === 'compose' ? (
        <div>
          <label htmlFor="faxMsg" className="block text-sm font-medium text-gray-300 mb-1">
            Message
          </label>
          <textarea
            id="faxMsg"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            placeholder="Typed here, rendered to a thermal-fax bitmap on send…"
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 font-mono text-sm focus:outline-none focus:border-amber-500 transition"
          />
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Image file (PNG/JPG/BMP)</label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".png,.bmp,.jpg,.jpeg,image/png,image/bmp,image/jpeg"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            className="block w-full text-sm text-gray-400 file:mr-3 file:rounded-lg file:border-0 file:bg-amber-600 file:px-3 file:py-2 file:text-white hover:file:bg-amber-700"
          />
          {fileName && <p className="text-xs text-emerald-300 mt-1">Ready: {fileName}</p>}
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-900/30 border border-red-700 rounded text-red-400 text-sm">
          {error}
        </div>
      )}

      {trayUrl && (
        <div className="p-3 bg-emerald-900/30 border border-emerald-700 rounded text-emerald-300 text-sm">
          ✓ Transmitted. Recipient inbox now has a pointer notification.{' '}
          <a href={trayUrl} target="_blank" rel="noopener noreferrer" className="underline">
            View transmission
          </a>
        </div>
      )}

      <button
        type="button"
        onClick={handleSend}
        disabled={sending}
        className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-amber-800 text-white font-semibold py-2.5 px-4 rounded-lg transition disabled:opacity-50"
      >
        {sending ? 'Transmitting…' : 'Send NFTfax'}
      </button>
    </div>
  );
}
