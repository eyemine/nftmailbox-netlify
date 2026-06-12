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

export function ChatView({ myEmail, messages, onSendMessage, isOwner = false }: ChatViewProps) {
  const [activeContact, setActiveContact] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
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
    if (contacts.length > 0 && !activeContact) setActiveContact(contacts[0]);
  }, [contacts.length]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeContact, messages.length]);

  const handleSend = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim() || !activeContact || !isOwner) return;
    setSending(true);
    try { await onSendMessage(activeContact, draft.trim()); setDraft(''); }
    finally { setSending(false); }
  }, [draft, activeContact, isOwner, onSendMessage]);

  const thread = activeContact ? (conversations[activeContact] ?? []) : [];
  const lastMsg = activeContact ? conversations[activeContact]?.at(-1) : null;

  return (
    <div className="flex h-[calc(100vh-260px)] min-h-[400px] rounded-xl border border-[var(--border)] overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 border-r border-[var(--border)] bg-[var(--card)] overflow-y-auto">
        <div className="px-3 py-2.5 border-b border-[var(--border)]">
          <span className="text-[9px] font-semibold tracking-widest text-[var(--muted)] uppercase">Threads ({contacts.length})</span>
        </div>
        {contacts.length === 0 && (
          <p className="px-3 py-4 text-[11px] text-[var(--muted)] italic">No messages yet</p>
        )}
        {contacts.map(contact => {
          const last = conversations[contact].at(-1);
          return (
            <button key={contact} onClick={() => setActiveContact(contact)}
              className={`w-full px-3 py-3 text-left border-b border-[var(--border)]/50 transition-colors ${
                activeContact === contact
                  ? 'bg-[rgba(0,163,255,0.08)] border-l-2 border-l-[rgba(0,163,255,0.6)]'
                  : 'hover:bg-white/[0.03]'
              }`}>
              <span className="block text-[11px] font-mono text-[#f2eee4] truncate">{contact}</span>
              {last && <span className="block mt-0.5 text-[10px] text-[var(--muted)] truncate">{last.text}</span>}
            </button>
          );
        })}
      </div>

      {/* Message pane */}
      <div className="flex-1 flex flex-col min-w-0 bg-[var(--background)]">
        {activeContact ? (
          <>
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border)] bg-[var(--card)]/40">
              <span className="font-mono text-xs text-[rgb(160,220,255)] truncate">{activeContact}</span>
              {lastMsg && <span className="text-[10px] text-[var(--muted)]">{timeAgo(lastMsg.timestamp)}</span>}
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
              {thread.map(msg => (
                <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[72%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed break-words ${
                    msg.isMe
                      ? 'bg-[rgba(0,163,255,0.18)] text-[#e8f4ff] rounded-br-sm'
                      : 'bg-[var(--card)] border border-[var(--border)] text-[var(--muted)] rounded-bl-sm'
                  }`}>
                    {msg.text}
                    <div className={`mt-0.5 text-[9px] opacity-50 ${msg.isMe ? 'text-right' : ''}`}>
                      {timeAgo(msg.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>

            <div className="px-4 py-3 border-t border-[var(--border)] bg-[var(--card)]/20">
              {isOwner ? (
                <form onSubmit={handleSend} className="flex gap-2">
                  <input
                    className="flex-1 rounded-xl border border-[var(--border)] bg-black/30 px-3 py-2 text-xs text-[#f2eee4] placeholder-[var(--muted)] focus:border-[rgba(0,163,255,0.4)] focus:outline-none transition"
                    placeholder={`Reply to ${activeContact}…`}
                    value={draft}
                    onChange={e => setDraft(e.target.value)}
                  />
                  <button type="submit" disabled={!draft.trim() || sending}
                    className="rounded-xl bg-[rgba(0,163,255,0.15)] border border-[rgba(0,163,255,0.3)] px-4 py-2 text-xs font-semibold text-[rgb(160,220,255)] transition hover:bg-[rgba(0,163,255,0.25)] disabled:opacity-40">
                    {sending ? '…' : 'Send'}
                  </button>
                </form>
              ) : (
                <p className="text-center text-[10px] text-[var(--muted)] italic">Connect NFT owner wallet to reply</p>
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
  );
}
