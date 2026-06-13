'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { emailToChat, groupByContact, type ChatMessage } from '../utils/emailToChat';

interface InboxMsg {
  id: string;
  fromAddress?: string;
  sender?: string;
  body?: string;
  summary?: string;
  receivedTime?: string;
  encrypted?: boolean;
}

interface ChatViewProps {
  myEmail: string;
  messages: InboxMsg[];
  onSendMessage: (to: string, body: string) => Promise<void>;
  isOwner?: boolean;
}

function timeAgo(ts: number): string {
  const m = Math.floor((Date.now() - ts) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

function shortContact(contact: string): string {
  const local = contact.split('@')[0] ?? contact;
  return local.length > 18 ? local.slice(0, 16) + '…' : local;
}

export function ChatView({ myEmail, messages, onSendMessage, isOwner = false }: ChatViewProps) {
  const [activeContact, setActiveContact] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const chatMsgs: ChatMessage[] = messages
    .filter(m => !m.encrypted)
    .map(m => emailToChat(m, myEmail));

  const conversations = groupByContact(chatMsgs);
  const contacts = Object.keys(conversations).sort((a, b) => {
    const la = conversations[a].at(-1)?.timestamp ?? 0;
    const lb = conversations[b].at(-1)?.timestamp ?? 0;
    return lb - la;
  });

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeContact, messages.length]);

  const handleSend = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim() || !activeContact || !isOwner) return;
    setSending(true);
    setSendError(null);
    try {
      await onSendMessage(activeContact, draft.trim());
      setDraft('');
    } catch (err: unknown) {
      setSendError(err instanceof Error ? err.message : 'Failed to send');
    } finally {
      setSending(false);
    }
  }, [draft, activeContact, isOwner, onSendMessage]);

  const thread = activeContact ? (conversations[activeContact] ?? []) : [];

  // On mobile: show contacts list OR thread (full width), not side-by-side
  const showThread = activeContact !== null;

  return (
    <div className="rounded-xl border border-[var(--border)] overflow-hidden" style={{ height: '480px', display: 'flex', flexDirection: 'column' }}>
      <div className="flex flex-1 min-h-0">

        {/* ── Contacts panel — hidden on mobile when thread open ── */}
        <div className={`${showThread ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-56 flex-shrink-0 border-r border-[var(--border)] bg-[var(--card)] overflow-y-auto`}>
          <div className="px-3 py-2 border-b border-[var(--border)]">
            <span className="text-[9px] font-semibold tracking-widest text-[var(--muted)] uppercase">
              Threads {contacts.length > 0 ? `(${contacts.length})` : ''}
            </span>
          </div>
          {contacts.length === 0 && (
            <p className="px-3 py-4 text-[11px] text-[var(--muted)] italic">No messages yet</p>
          )}
          {contacts.map(contact => {
            const last = conversations[contact].at(-1);
            return (
              <button key={contact} onClick={() => setActiveContact(contact)}
                className={`w-full px-3 py-3 text-left border-b border-[var(--border)]/40 transition-colors ${
                  activeContact === contact
                    ? 'bg-[rgba(0,163,255,0.08)] border-l-2 border-l-[rgba(0,163,255,0.5)]'
                    : 'hover:bg-white/[0.03]'
                }`}>
                <span className="block text-[11px] font-mono text-[#f2eee4] truncate">{shortContact(contact)}</span>
                {last && <span className="block mt-0.5 text-[10px] text-[var(--muted)] truncate">{last.text.slice(0, 40)}</span>}
              </button>
            );
          })}
        </div>

        {/* ── Thread pane — full width on mobile when contact selected ── */}
        <div className={`${showThread ? 'flex' : 'hidden md:flex'} flex-1 flex-col min-w-0 bg-[var(--background)]`}>
          {activeContact ? (
            <>
              {/* Header with back button on mobile */}
              <div className="flex items-center gap-2 px-3 py-2 border-b border-[var(--border)] bg-[var(--card)]/40">
                <button
                  onClick={() => setActiveContact(null)}
                  className="md:hidden flex-shrink-0 text-[var(--muted)] hover:text-white transition p-1 -ml-1"
                  aria-label="Back to contacts"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <span className="flex-1 font-mono text-xs text-[rgb(160,220,255)] truncate">{activeContact}</span>
              </div>

              {/* Bubbles */}
              <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
                {thread.map(msg => (
                  <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs leading-relaxed break-words whitespace-pre-wrap ${
                      msg.isMe
                        ? 'bg-[rgba(0,163,255,0.18)] text-[#e8f4ff] rounded-br-sm'
                        : 'bg-[var(--card)] border border-[var(--border)] text-[var(--muted)] rounded-bl-sm'
                    }`}>
                      {msg.text}
                      <div className={`mt-1 text-[9px] opacity-40 ${msg.isMe ? 'text-right' : ''}`}>
                        {timeAgo(msg.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={endRef} />
              </div>

              {/* Reply input */}
              <div className="px-3 py-2.5 border-t border-[var(--border)] bg-[var(--card)]/20">
                {isOwner ? (
                  <form onSubmit={handleSend} className="flex flex-col gap-1">
                    <div className="flex gap-2">
                      <input
                        className="flex-1 rounded-xl border border-[var(--border)] bg-black/30 px-3 py-2 text-xs text-[#f2eee4] placeholder-[var(--muted)] focus:border-[rgba(0,163,255,0.4)] focus:outline-none transition"
                        placeholder="Reply…"
                        value={draft}
                        onChange={e => { setDraft(e.target.value); setSendError(null); }}
                      />
                      <button type="submit" disabled={!draft.trim() || sending}
                        className="rounded-xl bg-[rgba(0,163,255,0.15)] border border-[rgba(0,163,255,0.3)] px-3 py-2 text-xs font-semibold text-[rgb(160,220,255)] transition hover:bg-[rgba(0,163,255,0.25)] disabled:opacity-40">
                        {sending ? '…' : '↑'}
                      </button>
                    </div>
                    {sendError && (
                      <p className="text-[10px] text-red-400 px-1">{sendError}</p>
                    )}
                  </form>
                ) : (
                  <p className="text-center text-[10px] text-[var(--muted)] italic">Connect wallet to reply</p>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-sm text-[var(--muted)] italic">Select a thread</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
