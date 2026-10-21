'use client';

import { useState, useEffect, useCallback } from 'react';

interface AttachmentSettingsProps {
  label: string;
  ownerWallet: string;
  tier: string;
}

export function AttachmentSettings({ label, ownerWallet, tier }: AttachmentSettingsProps) {
  const [canSend, setCanSend] = useState(false);
  const [canReceive, setCanReceive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isProOrAbove = ['pro', 'pupa', 'premium', 'imago', 'ghost', 'lite'].includes(
    tier.toLowerCase()
  );

  // Fetch current settings from the inbox response (acct-tier KV)
  // Settings are loaded from the inbox API which returns accountTier data
  useEffect(() => {
    if (!label || !isProOrAbove) {
      setLoading(false);
      return;
    }
    void (async () => {
      try {
        const res = await fetch(`/api/inbox?email=${encodeURIComponent(label + '@nftmail.box')}&ownerWallet=${ownerWallet}`, {
          cache: 'no-store',
        });
        if (res.ok) {
          const data = await res.json() as { canSendAttachments?: boolean; canReceiveAttachments?: boolean };
          setCanSend(data.canSendAttachments ?? false);
          setCanReceive(data.canReceiveAttachments ?? false);
        }
      } catch {
        // Settings not yet configured — defaults are false
      } finally {
        setLoading(false);
      }
    })();
  }, [label, ownerWallet, isProOrAbove]);

  const toggleSetting = useCallback(async (setting: 'send' | 'receive', value: boolean) => {
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/attachment-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          label,
          ownerWallet,
          ...(setting === 'send' ? { canSendAttachments: value } : { canReceiveAttachments: value }),
        }),
      });
      if (!res.ok) {
        const data = await res.json() as { error?: string };
        throw new Error(data.error || 'Update failed');
      }
      if (setting === 'send') setCanSend(value);
      else setCanReceive(value);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  }, [label, ownerWallet]);

  if (!isProOrAbove) {
    return (
      <div className="border-t border-[var(--border)] pt-5">
        <h3 className="text-sm font-semibold text-white">Attachments</h3>
        <p className="text-xs text-[var(--muted)] mt-1">
          Upgrade to PRO to enable sending and receiving email attachments.
        </p>
      </div>
    );
  }

  return (
    <div className="border-t border-[var(--border)] pt-5 space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-white">Attachments</h3>
        <p className="text-xs text-[var(--muted)] mt-0.5">
          Control whether this inbox can send and receive file attachments.
        </p>
      </div>

      {loading ? (
        <p className="text-xs text-[var(--muted)]">Loading settings…</p>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-medium text-white/90">Allow sending attachments</h4>
              <p className="text-[10px] text-[var(--muted)] mt-0.5">
                Show a file upload button when composing emails.
              </p>
            </div>
            <button
              type="button"
              disabled={saving}
              onClick={() => toggleSetting('send', !canSend)}
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${canSend ? 'bg-blue-600' : 'bg-gray-600'} ${saving ? 'opacity-50' : ''}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${canSend ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-medium text-white/90">Allow receiving attachments</h4>
              <p className="text-[10px] text-[var(--muted)] mt-0.5">
                Auto-display attachments in incoming emails. When off, attachments are stored but require per-message approval to view.
              </p>
            </div>
            <button
              type="button"
              disabled={saving}
              onClick={() => toggleSetting('receive', !canReceive)}
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${canReceive ? 'bg-blue-600' : 'bg-gray-600'} ${saving ? 'opacity-50' : ''}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${canReceive ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          {error && <p className="text-[10px] text-red-400">{error}</p>}
        </>
      )}
    </div>
  );
}
