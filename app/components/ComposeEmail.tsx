'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

type NftmailTier = 'free' | 'pro' | 'premium';

interface ComposeEmailProps {
  label: string;            // sender label e.g. "mac.slave"
  ownerWallet: string;      // authenticated wallet for auth
  tier?: NftmailTier;       // user tier for feature gating
  onSent?: (messageId: string) => void;
  onClose?: () => void;
  defaultTo?: string;
  defaultSubject?: string;
  defaultBody?: string;
}

type SendState = 'idle' | 'sending' | 'sent' | 'error';

const MARKDOWN_TIPS = [
  ['**bold**', 'Bold'],
  ['*italic*', 'Italic'],
  ['`code`', 'Inline code'],
  ['# H1', 'Heading'],
  ['> quote', 'Blockquote'],
  ['- item', 'List item'],
  ['[text](url)', 'Link'],
];

export function ComposeEmail({ label, ownerWallet, tier = 'free', onSent, onClose, defaultTo = '', defaultSubject = '', defaultBody = '' }: ComposeEmailProps) {
  const [to, setTo] = useState(defaultTo);
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [showCcBcc, setShowCcBcc] = useState(false);
  const [subject, setSubject] = useState(defaultSubject);
  const [body, setBody] = useState(defaultBody);
  const [sendState, setSendState] = useState<SendState>('idle');
  const [error, setError] = useState('');
  const [sentInfo, setSentInfo] = useState<{ messageId: string; to: string } | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const isPro = tier === 'pro';
  const isPremium = tier === 'premium';

  const fromEmail = `${label}@nftmail.box`;
  const canSend = to.trim() && to.includes('@') && (subject.trim() || body.trim());

  const insertMarkdown = useCallback((prefix: string, suffix = '') => {
    const ta = bodyRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = body.slice(start, end);
    const replacement = prefix + (selected || 'text') + suffix;
    const newBody = body.slice(0, start) + replacement + body.slice(end);
    setBody(newBody);
    setTimeout(() => {
      ta.focus();
      const newCursor = start + prefix.length + (selected || 'text').length + suffix.length;
      ta.setSelectionRange(newCursor, newCursor);
    }, 0);
  }, [body]);

  // Draft auto-save to localStorage every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      if (to || subject || body) {
        const draft = {
          to,
          cc,
          bcc,
          subject,
          body,
          savedAt: Date.now(),
        };
        localStorage.setItem(`nftmail:draft:${label}`, JSON.stringify(draft));
        setDraftSavedAt(new Date().toLocaleTimeString());
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [label, to, cc, bcc, subject, body]);

  // Load draft on mount
  useEffect(() => {
    if (label) {
      const saved = localStorage.getItem(`nftmail:draft:${label}`);
      if (saved) {
        try {
          const draft = JSON.parse(saved);
          setTo(draft.to || defaultTo);
          setCc(draft.cc || '');
          setBcc(draft.bcc || '');
          setSubject(draft.subject || defaultSubject);
          setBody(draft.body || defaultBody);
          if (draft.cc || draft.bcc) setShowCcBcc(true);
        } catch {}
      }
    }
  }, [label, defaultTo, defaultSubject, defaultBody]);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(`nftmail:draft:${label}`);
    setTo(defaultTo);
    setCc('');
    setBcc('');
    setSubject(defaultSubject);
    setBody(defaultBody);
    setDraftSavedAt(null);
  }, [label, defaultTo, defaultSubject, defaultBody]);

  const handleSend = useCallback(async () => {
    if (!canSend || sendState === 'sending') return;
    setSendState('sending');
    setError('');
    try {
      // Parse recipients - split by comma for multi-send
      const allRecipients = to.split(',').map(e => e.trim()).filter(e => e);
      
      // Tier-based restrictions
      // Free: only 1 recipient
      // Pro: up to 10 recipients + CC/BCC
      // Premium: unlimited recipients + CC/BCC
      let recipients = allRecipients;
      if (!isPro && !isPremium) {
        recipients = [allRecipients[0]]; // Free tier: first recipient only
      } else if (isPro && allRecipients.length > 10) {
        recipients = allRecipients.slice(0, 10); // Pro: max 10
      }
      
      // CC/BCC only for Pro/Premium
      const ccList = (isPro || isPremium) && cc 
        ? cc.split(',').map(e => e.trim()).filter(e => e).slice(0, isPro ? 2 : undefined)
        : [];
      const bccList = (isPro || isPremium) && bcc
        ? bcc.split(',').map(e => e.trim()).filter(e => e).slice(0, isPro ? 2 : undefined)
        : [];
      
      // Send to each recipient
      for (const recipient of recipients) {
        const res = await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            label, 
            ownerWallet, 
            to: recipient,
            cc: ccList,
            bcc: bccList,
            subject: subject.trim(), 
            body 
          }),
        });
        const data = await res.json() as any;
        if (!res.ok) throw new Error(data.error || 'Send failed');
      }
      
      // Clear draft after successful send
      clearDraft();
      
      setSendState('sent');
      setSentInfo({ messageId: 'sent', to: recipients.join(', ') });
      onSent?.('sent');
    } catch (err: any) {
      setSendState('error');
      setError(err.message);
    }
  }, [canSend, sendState, label, ownerWallet, to, cc, bcc, subject, body, isPro, isPremium, onSent, clearDraft]);

  if (sendState === 'sent' && sentInfo) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 px-4">
        <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
          <svg className="h-5 w-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
        </div>
        <p className="text-sm font-semibold text-white">Message sent</p>
        <div className="rounded-lg border border-[var(--border)] bg-black/20 px-4 py-2.5 text-center w-full max-w-sm">
          <p className="text-[10px] text-[var(--muted)] mb-0.5">FROM</p>
          <p className="text-xs text-[rgb(160,220,255)]">{fromEmail}</p>
          <p className="text-[10px] text-[var(--muted)] mt-2 mb-0.5">TO</p>
          <p className="text-xs text-white">{sentInfo.to}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => { setSendState('idle'); setTo(''); setSubject(''); setBody(''); setSentInfo(null); }}
            className="rounded-lg border border-[var(--border)] bg-black/20 px-4 py-2 text-xs text-[var(--muted)] hover:text-white transition"
          >
            Compose another
          </button>
          {onClose && (
            <button onClick={onClose} className="rounded-lg border border-[rgba(0,163,255,0.3)] bg-[rgba(0,163,255,0.08)] px-4 py-2 text-xs text-[rgb(160,220,255)] hover:bg-[rgba(0,163,255,0.16)] transition">
              Close
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* From (read-only) */}
      <div className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-black/30 px-3 py-2">
        <span className="text-[10px] font-semibold text-[var(--muted)] w-12 flex-shrink-0">FROM</span>
        <span className="text-xs text-[rgb(160,220,255)]">{fromEmail}</span>
      </div>

      {/* To */}
      <div className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-black/30 px-3 py-2 focus-within:border-[rgba(0,163,255,0.4)]">
        <span className="text-[10px] font-semibold text-[var(--muted)] w-12 flex-shrink-0">TO</span>
        <input
          type="email"
          value={to}
          onChange={e => setTo(e.target.value)}
          placeholder={isPro || isPremium ? "recipient1@domain.com, recipient2@domain.com (multi-send)" : "recipient@domain.com"}
          className="flex-1 bg-transparent text-xs text-white placeholder-zinc-600 outline-none"
          disabled={sendState === 'sending'}
        />
      </div>

      {/* CC/BCC Toggle (Pro/Premium only) */}
      {(isPro || isPremium) && (
        <button
          onClick={() => setShowCcBcc(!showCcBcc)}
          className="text-[10px] text-[rgb(160,220,255)] hover:text-white text-left transition-colors -mt-1"
        >
          {showCcBcc ? 'Hide CC/BCC' : 'Show CC/BCC'}
        </button>
      )}

      {/* CC */}
      {showCcBcc && (isPro || isPremium) && (
        <div className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-black/30 px-3 py-2 focus-within:border-[rgba(0,163,255,0.4)]">
          <span className="text-[10px] font-semibold text-[var(--muted)] w-12 flex-shrink-0">CC</span>
          <input
            type="email"
            value={cc}
            onChange={e => setCc(e.target.value)}
            placeholder={isPro ? "cc@domain.com (max 2)" : "cc@domain.com (unlimited)"}
            className="flex-1 bg-transparent text-xs text-white placeholder-zinc-600 outline-none"
            disabled={sendState === 'sending'}
          />
        </div>
      )}

      {/* BCC */}
      {showCcBcc && (isPro || isPremium) && (
        <div className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-black/30 px-3 py-2 focus-within:border-[rgba(0,163,255,0.4)]">
          <span className="text-[10px] font-semibold text-[var(--muted)] w-12 flex-shrink-0">BCC</span>
          <input
            type="email"
            value={bcc}
            onChange={e => setBcc(e.target.value)}
            placeholder={isPro ? "bcc@domain.com (max 2)" : "bcc@domain.com (unlimited)"}
            className="flex-1 bg-transparent text-xs text-white placeholder-zinc-600 outline-none"
            disabled={sendState === 'sending'}
          />
        </div>
      )}

      {/* Subject */}
      <div className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-black/30 px-3 py-2 focus-within:border-[rgba(0,163,255,0.4)]">
        <span className="text-[10px] font-semibold text-[var(--muted)] w-12 flex-shrink-0">SUBJ</span>
        <input
          type="text"
          value={subject}
          onChange={e => setSubject(e.target.value)}
          placeholder="Subject line"
          className="flex-1 bg-transparent text-xs text-white placeholder-zinc-600 outline-none"
          disabled={sendState === 'sending'}
        />
      </div>

      {/* Markdown toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 flex-wrap">
          <button onClick={() => insertMarkdown('**', '**')} title="Bold" className="rounded px-1.5 py-0.5 text-[10px] font-bold text-[var(--muted)] hover:text-white hover:bg-white/5 transition">B</button>
          <button onClick={() => insertMarkdown('*', '*')} title="Italic" className="rounded px-1.5 py-0.5 text-[10px] italic text-[var(--muted)] hover:text-white hover:bg-white/5 transition">I</button>
          <button onClick={() => insertMarkdown('`', '`')} title="Code" className="rounded px-1.5 py-0.5 text-[10px] font-mono text-[var(--muted)] hover:text-white hover:bg-white/5 transition">&lt;/&gt;</button>
          <button onClick={() => insertMarkdown('# ')} title="Heading" className="rounded px-1.5 py-0.5 text-[10px] text-[var(--muted)] hover:text-white hover:bg-white/5 transition">H</button>
          <button onClick={() => insertMarkdown('> ')} title="Blockquote" className="rounded px-1.5 py-0.5 text-[10px] text-[var(--muted)] hover:text-white hover:bg-white/5 transition">"</button>
          <button onClick={() => insertMarkdown('- ')} title="List" className="rounded px-1.5 py-0.5 text-[10px] text-[var(--muted)] hover:text-white hover:bg-white/5 transition">≡</button>
          <span className="text-[var(--border)] mx-1">|</span>
          <button
            onClick={() => setShowPreview(p => !p)}
            className={`rounded px-2 py-0.5 text-[10px] transition ${showPreview ? 'bg-[rgba(0,163,255,0.15)] text-[rgb(160,220,255)]' : 'text-[var(--muted)] hover:text-white hover:bg-white/5'}`}
          >
            {showPreview ? 'Edit' : 'Preview'}
          </button>
        </div>
        <span className="text-[9px] text-[var(--muted)]">Markdown supported</span>
      </div>

      {/* Body */}
      {showPreview ? (
        <div
          className="min-h-[180px] rounded-lg border border-[var(--border)] bg-black/20 px-4 py-3 text-xs text-[var(--muted)] leading-relaxed prose prose-invert max-w-none overflow-auto"
          dangerouslySetInnerHTML={{ __html: renderMarkdownPreview(body) }}
        />
      ) : (
        <textarea
          ref={bodyRef}
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder={`Write your message in Markdown...\n\n**Bold**, *italic*, \`code\`, > blockquotes, - lists`}
          rows={9}
          disabled={sendState === 'sending'}
          className="w-full rounded-lg border border-[var(--border)] bg-black/30 px-4 py-3 text-xs text-white placeholder-zinc-600 font-mono leading-relaxed resize-y outline-none focus:border-[rgba(0,163,255,0.4)] disabled:opacity-50 transition"
          spellCheck={false}
        />
      )}

      {/* Error */}
      {sendState === 'error' && error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2">
          <p className="text-[11px] text-red-400">{error}</p>
          {error.includes('Upgrade to Lite') && (
            <a href={`/nftmail?upgrade=lite&label=${label}`} className="mt-1 inline-block text-[10px] text-amber-300 hover:underline">
              Upgrade to Lite →
            </a>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {onClose && (
            <button onClick={onClose} disabled={sendState === 'sending'} className="rounded-lg border border-[var(--border)] bg-black/20 px-4 py-2 text-xs text-[var(--muted)] hover:text-white transition disabled:opacity-40">
              Discard
            </button>
          )}
          <button
            onClick={clearDraft}
            disabled={sendState === 'sending'}
            className="rounded-lg border border-[var(--border)] bg-black/20 px-4 py-2 text-xs text-[var(--muted)] hover:text-white transition disabled:opacity-40"
            title="Clear draft"
          >
            Clear
          </button>
        </div>
        <button
          onClick={handleSend}
          disabled={!canSend || sendState === 'sending'}
          className="flex items-center gap-2 rounded-lg border border-[rgba(0,163,255,0.3)] bg-[rgba(0,163,255,0.10)] px-5 py-2 text-xs font-semibold text-[rgb(160,220,255)] transition hover:bg-[rgba(0,163,255,0.18)] disabled:opacity-40"
        >
          {sendState === 'sending' ? (
            <>
              <span className="h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
              Sending...
            </>
          ) : (
            <>
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
              Send
            </>
          )}
        </button>
      </div>
      
      {/* Draft saved indicator */}
      {draftSavedAt && (
        <div className="text-[10px] text-[var(--muted)] text-right">
          Draft saved {draftSavedAt}
        </div>
      )}
    </div>
  );
}

/// Client-side markdown preview (safe — no user input rendered as raw HTML except via this function)
function renderMarkdownPreview(md: string): string {
  if (!md.trim()) return '<span style="opacity:0.4">Nothing to preview yet...</span>';
  return md
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code style="background:rgba(255,255,255,0.08);padding:1px 5px;border-radius:3px;font-family:monospace;font-size:11px">$1</code>')
    .replace(/^### (.+)$/gm, '<h3 style="color:#e2e8f0;font-size:13px;margin:14px 0 5px;font-weight:600">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 style="color:#e2e8f0;font-size:15px;margin:16px 0 6px;font-weight:600">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 style="color:#e2e8f0;font-size:17px;margin:18px 0 8px;font-weight:700">$1</h1>')
    .replace(/^---+$/gm, '<hr style="border:none;border-top:1px solid rgba(255,255,255,0.1);margin:14px 0">')
    .replace(/^> (.+)$/gm, '<blockquote style="border-left:2px solid rgba(0,163,255,0.4);margin:6px 0;padding-left:10px;color:#94a3b8">$1</blockquote>')
    .replace(/^[-*] (.+)$/gm, '<li style="margin:2px 0;color:#cbd5e1">$1</li>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:#60a5fa;text-decoration:underline">$1</a>')
    .replace(/\n/g, '<br>');
}
