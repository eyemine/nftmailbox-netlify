'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface TogglePrivacyProps {
  name: string;
  walletAddress: string;
  onPrivacyChange?: (enabled: boolean) => void;
}

export function TogglePrivacy({ name, walletAddress, onPrivacyChange }: TogglePrivacyProps) {
  const [privacyEnabled, setPrivacyEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [toggleError, setToggleError] = useState<string | null>(null);

  // Use ref for callback to avoid fetchPrivacy dep-cycle re-triggering on every parent render
  const onPrivacyChangeRef = useRef(onPrivacyChange);
  useEffect(() => { onPrivacyChangeRef.current = onPrivacyChange; }, [onPrivacyChange]);

  // Privacy is stored under the base name (strip trailing _ for agent alias)
  const baseName = name.endsWith('_') ? name.slice(0, -1) : name;

  const fetchPrivacy = useCallback(async () => {
    try {
      const res = await fetch(`/api/resolve-privacy?name=${encodeURIComponent(baseName)}`);
      const data = await res.json() as { privacyEnabled?: boolean };
      setPrivacyEnabled(data.privacyEnabled ?? false);
      onPrivacyChangeRef.current?.(data.privacyEnabled ?? false);
    } catch {
      setPrivacyEnabled(false);
    } finally {
      setLoading(false);
    }
  }, [baseName]);

  useEffect(() => {
    if (name) fetchPrivacy();
  }, [name, fetchPrivacy]);

  const handleToggle = async () => {
    setToggling(true);
    setToggleError(null);
    try {
      const newState = !privacyEnabled;
      const res = await fetch('/api/toggle-privacy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: baseName,
          enabled: newState,
          walletAddress,
        }),
      });
      const data = await res.json() as { error?: string };
      if (res.ok) {
        setPrivacyEnabled(newState);
        onPrivacyChangeRef.current?.(newState);
      } else {
        setToggleError(data.error || 'Failed to update privacy');
      }
    } catch (err: any) {
      setToggleError(err?.message || 'Network error');
    } finally {
      setToggling(false);
    }
  };

  if (loading) return null;

  return (
    <div className="flex flex-col gap-2">
      {/* Exposed warning */}
      {!privacyEnabled && (
        <div className="rounded-lg border border-red-500/25 bg-red-500/5 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <svg className="h-3.5 w-3.5 text-red-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span className="text-[11px] text-red-300">
              Inbox is <strong>exposed</strong> — anyone can view your public inbox
            </span>
          </div>
        </div>
      )}

      {/* Private confirmation */}
      {privacyEnabled && (
        <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/5 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <svg className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span className="text-[11px] text-emerald-300">
              Inbox is <strong>private</strong> — public viewers see blurred data
            </span>
          </div>
        </div>
      )}

      {/* Toggle switch */}
      <div className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-black/20 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold tracking-wider text-[var(--muted)]">
            {privacyEnabled ? 'PRIVATE' : 'EXPOSED'}
          </span>
          <span className="text-[10px] text-[var(--muted)]">
            {privacyEnabled
              ? 'Public viewers see blurred data'
              : 'Flip to hide your inbox from the public'}
          </span>
        </div>
        <button
          onClick={handleToggle}
          disabled={toggling}
          className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50"
          style={{
            backgroundColor: privacyEnabled ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.25)',
          }}
        >
          <span
            className="inline-block h-4 w-4 rounded-full transition-transform"
            style={{
              backgroundColor: privacyEnabled ? '#10b981' : '#ef4444',
              transform: privacyEnabled ? 'translateX(22px)' : 'translateX(4px)',
            }}
          />
        </button>
      </div>

      {toggleError && (
        <p className="text-[10px] text-red-400 px-1">{toggleError}</p>
      )}

      {/* Upsell nudge when private */}
      {privacyEnabled && (
        <div className="rounded-lg border border-violet-500/15 bg-violet-500/5 px-4 py-2">
          <p className="text-[10px] text-violet-300">
            Your data is private, but still ephemeral (8-day decay).{' '}
            <strong>Harden</strong> to save it forever in your Gnosis Safe vault.
          </p>
        </div>
      )}
    </div>
  );
}
