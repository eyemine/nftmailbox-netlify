/// FaxChainComposer — dashboard UI for creating a Fax Chain Letter artifact.
///
/// 1. Generate: XOR-composite a source fax with previous links and a 1-bit glitch.
/// 2. Forward: pass the generated chainTrayId to /api/tray/send to keep the
///    chain alive. Forwarding a received fax within 72 hours earns a send credit.

'use client';

import { useState } from 'react';

interface FaxChainComposerProps {
  fromLabel: string;
  ownerWallet: string;
}

interface ChainLink {
  id: string;
  trayUrl: string;
  chainIndex: number;
  seed: string;
}

export default function FaxChainComposer({ fromLabel, ownerWallet }: FaxChainComposerProps) {
  const [sourceId, setSourceId] = useState('');
  const [previousIds, setPreviousIds] = useState('');
  const [blockHash, setBlockHash] = useState('');
  const [to, setTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [link, setLink] = useState<ChainLink | null>(null);
  const [forwarded, setForwarded] = useState<{ trayUrl: string } | null>(null);

  const generate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLink(null);
    setForwarded(null);

    if (!sourceId.trim()) {
      setError('Enter a source tray ID.');
      return;
    }

    const previousTrayIds = previousIds
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    setLoading(true);
    try {
      const res = await fetch(`/api/tray/${encodeURIComponent(sourceId.trim())}/chain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerWallet,
          previousTrayIds,
          ...(blockHash.trim() ? { blockHash: blockHash.trim() } : {}),
        }),
      });
      const data = await res.json() as {
        error?: string;
        id?: string;
        trayUrl?: string;
        chainIndex?: number;
        seed?: string;
      };
      if (!res.ok) {
        setError(data.error || 'Chain composition failed');
        return;
      }
      setLink({
        id: data.id || '',
        trayUrl: data.trayUrl || '',
        chainIndex: data.chainIndex || 0,
        seed: data.seed || '',
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const forward = async () => {
    if (!link || !to.trim()) {
      setError('Enter a recipient to forward the chain link.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/tray/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromLabel,
          ownerWallet,
          to: to.trim(),
          chainTrayId: link.id,
        }),
      });
      const data = await res.json() as { trayUrl?: string; error?: string; isForward?: boolean };
      if (!res.ok) {
        setError(data.error || 'Forward failed');
        return;
      }
      setForwarded({ trayUrl: data.trayUrl || '' });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold tracking-wider text-[var(--muted)]">CHAIN LETTER</span>
        <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[9px] text-amber-300">LAB</span>
      </div>
      <p className="text-xs text-[var(--muted)]">
        XOR-composite a source fax with previous links, then forward the 1-bit chain link to the next participant.
      </p>

      <form onSubmit={generate} className="space-y-3">
        <div>
          <label className="block text-[10px] text-[var(--muted)] mb-1">Source tray ID</label>
          <input
            type="text"
            value={sourceId}
            onChange={(e) => setSourceId(e.target.value)}
            placeholder="a1b2c3d4e5f6"
            className="w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs text-[var(--foreground)] outline-none focus:border-violet-500/50"
          />
        </div>
        <div>
          <label className="block text-[10px] text-[var(--muted)] mb-1">Previous tray ids (comma-separated)</label>
          <input
            type="text"
            value={previousIds}
            onChange={(e) => setPreviousIds(e.target.value)}
            placeholder="tray1, tray2, tray3"
            className="w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs text-[var(--foreground)] outline-none focus:border-violet-500/50"
          />
        </div>
        <div>
          <label className="block text-[10px] text-[var(--muted)] mb-1">Block hash (optional, seeds the glitch pass)</label>
          <input
            type="text"
            value={blockHash}
            onChange={(e) => setBlockHash(e.target.value)}
            placeholder="0x..."
            className="w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs text-[var(--foreground)] outline-none focus:border-violet-500/50"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg border border-violet-500/35 bg-violet-500/8 px-5 py-2 text-xs font-semibold text-violet-300 transition hover:bg-violet-500/16 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? 'Compositing...' : 'Generate chain link'}
        </button>
      </form>

      {error && <p className="text-xs text-red-400">{error}</p>}

      {link && !forwarded && (
        <div className="space-y-3 rounded border border-emerald-500/20 bg-emerald-500/5 p-3">
          <p className="text-xs text-emerald-300">Chain link #{link.chainIndex} created</p>
          <a href={link.trayUrl} target="_blank" rel="noopener noreferrer" className="block text-xs text-violet-300 hover:underline break-all">
            {link.trayUrl}
          </a>
          <p className="text-[10px] text-[var(--muted)] font-mono">Seed: {link.seed}</p>
          <div>
            <label className="block text-[10px] text-[var(--muted)] mb-1">Forward to</label>
            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="next@nftmail.box"
              className="w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs text-[var(--foreground)] outline-none focus:border-violet-500/50"
            />
          </div>
          <button
            onClick={() => void forward()}
            disabled={loading}
            className="rounded-lg border border-amber-500/35 bg-amber-500/8 px-5 py-2 text-xs font-semibold text-amber-300 transition hover:bg-amber-500/16 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? 'Dialing...' : 'Forward chain link'}
          </button>
        </div>
      )}

      {forwarded && (
        <div className="space-y-2 rounded border border-amber-500/20 bg-amber-500/5 p-3">
          <p className="text-xs text-amber-300">Chain link forwarded</p>
          <a href={forwarded.trayUrl} target="_blank" rel="noopener noreferrer" className="block text-xs text-violet-300 hover:underline break-all">
            {forwarded.trayUrl}
          </a>
        </div>
      )}
    </div>
  );
}
