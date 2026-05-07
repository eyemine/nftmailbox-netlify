'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { sdk } from '@farcaster/miniapp-sdk';
import { LOGO_BASE64, MAILBOX_BASE64 } from './images';

const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL || 'https://nftmail-email-worker.richard-159.workers.dev';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://nftmail.box';

// ── Client-side ECIES decrypt (P-256 / AES-256-GCM — mirrors worker ecies.ts) ──
function hexToBytes(hex: string): Uint8Array {
  const clean = hex.startsWith('0x') ? hex.slice(2) : hex;
  const b = new Uint8Array(clean.length / 2);
  for (let i = 0; i < b.length; i++) b[i] = parseInt(clean.substr(i * 2, 2), 16);
  return b;
}
function wrapP256PrivateKey(raw: Uint8Array): ArrayBuffer {
  const prefix = new Uint8Array([0x30,0x41,0x02,0x01,0x00,0x30,0x13,0x06,0x07,0x2a,0x86,0x48,0xce,0x3d,0x02,0x01,0x06,0x08,0x2a,0x86,0x48,0xce,0x3d,0x03,0x01,0x07,0x04,0x27,0x30,0x25,0x02,0x01,0x01,0x04,0x20]);
  const out = new Uint8Array(prefix.length + raw.length);
  out.set(prefix); out.set(raw, prefix.length);
  return out.buffer;
}
async function eciesDecryptClient(envelopeJson: string, privHex: string): Promise<string> {
  const env = JSON.parse(envelopeJson) as { ephemeralPublicKey: string; iv: string; ciphertext: string };
  const ephPub = await crypto.subtle.importKey('raw', hexToBytes(env.ephemeralPublicKey) as unknown as ArrayBuffer, { name: 'ECDH', namedCurve: 'P-256' }, false, []);
  const recipPriv = await crypto.subtle.importKey('pkcs8', wrapP256PrivateKey(hexToBytes(privHex)) as ArrayBuffer, { name: 'ECDH', namedCurve: 'P-256' }, false, ['deriveBits']);
  const sharedBits = await crypto.subtle.deriveBits({ name: 'ECDH', public: ephPub }, recipPriv, 256);
  const keyMaterial = await crypto.subtle.importKey('raw', sharedBits, 'HKDF', false, ['deriveKey']);
  const aesKey = await crypto.subtle.deriveKey(
    { name: 'HKDF', hash: 'SHA-256', salt: new TextEncoder().encode('nftmail-ecies-v1'), info: new TextEncoder().encode('aes-256-gcm') },
    keyMaterial, { name: 'AES-GCM', length: 256 }, false, ['decrypt']
  );
  const dec = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: hexToBytes(env.iv) as unknown as ArrayBuffer, tagLength: 128 }, aesKey, hexToBytes(env.ciphertext) as unknown as ArrayBuffer);
  return new TextDecoder().decode(dec);
}

// ── Safe markdown renderer — bold/italic/code/headings/blockquote only, no links ──
function SafeMarkdown({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        // Horizontal rule
        if (/^---+$/.test(line.trim())) return <hr key={i} className="border-gray-700 my-1" />;
        // Heading
        const hMatch = line.match(/^(#{1,3})\s+(.*)/);
        if (hMatch) {
          const sizes = ['text-base font-bold text-white', 'text-sm font-bold text-white', 'text-xs font-bold text-gray-200'];
          return <p key={i} className={sizes[hMatch[1].length - 1]}>{renderInline(hMatch[2])}</p>;
        }
        // Blockquote
        if (line.startsWith('> ')) return (
          <p key={i} className="border-l-2 border-gray-600 pl-2 text-gray-400 text-xs italic">{renderInline(line.slice(2))}</p>
        );
        // Empty line → spacer
        if (line.trim() === '') return <div key={i} className="h-1" />;
        // Normal line
        return <p key={i} className="text-gray-300 text-xs leading-relaxed">{renderInline(line)}</p>;
      })}
    </div>
  );
}

function renderInline(text: string): React.ReactNode[] {
  // Strip any markdown link syntax [label](url) → just show label
  text = text.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');
  // Strip bare URLs (no rendering as anchors)
  text = text.replace(/https?:\/\/\S+/g, '[link]');
  const parts: React.ReactNode[] = [];
  // Tokenise bold+italic, bold, italic, inline code
  const re = /(\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*|`([^`]+)`)/g;
  let last = 0, m: RegExpExecArray | null;
  let idx = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(<span key={idx++}>{text.slice(last, m.index)}</span>);
    if (m[2]) parts.push(<strong key={idx++} className="font-bold italic text-white">{m[2]}</strong>);
    else if (m[3]) parts.push(<strong key={idx++} className="font-semibold text-white">{m[3]}</strong>);
    else if (m[4]) parts.push(<em key={idx++} className="italic text-gray-200">{m[4]}</em>);
    else if (m[5]) parts.push(<code key={idx++} className="bg-gray-800 text-green-300 px-1 rounded text-[10px] font-mono">{m[5]}</code>);
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(<span key={idx++}>{text.slice(last)}</span>);
  return parts;
}

type Step = 'loading' | 'entry' | 'naming' | 'provisioning' | 'success' | 'already' | 'inbox' | 'compose' | 'sending' | 'sent' | 'error';

interface ProvisionResult {
  status: string;
  agentName?: string;
  humanEmail?: string;
  expiresAt?: number;
  error?: string;
}

interface InboxMessage {
  id: string;
  from: string;
  to?: string;      // for sent messages
  subject: string;
  body?: string;    // set after client-side ECIES decrypt
  content?: string; // raw from worker getInbox (maps to payload.body)
  receivedAt: number;
  encrypted?: boolean;
  type?: 'inbox' | 'sent';
}

interface InboxResult {
  messages: InboxMessage[];
  sendsRemaining: number | string;
  error?: string;
}

export default function MiniApp() {
  const [step, setStep] = useState<Step>('loading');
  const [fid, setFid] = useState<number | null>(null);
  const [customName, setCustomName] = useState('');
  const [agentName, setAgentName] = useState('');
  const [humanEmail, setHumanEmail] = useState('');
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [sentMessages, setSentMessages] = useState<InboxMessage[]>([]);
  const [sendsRemaining, setSendsRemaining] = useState<number | string>(10);
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [error, setError] = useState('');
  const [eciesPrivKey, setEciesPrivKey] = useState<string | null>(null);
  const [openMsgId, setOpenMsgId] = useState<string | null>(null);

  const openDashboard = useCallback(() => {
    sdk.actions.openUrl(`${APP_URL}`);
  }, []);

  const openMainSite = useCallback(() => {
    sdk.actions.openUrl(`${APP_URL}`);
  }, []);

  const openApp = useCallback(() => {
    sdk.actions.openUrl(`${APP_URL}/mini`);
  }, []);

  const openUpgrade = useCallback(() => {
    const encodedAgent = encodeURIComponent(`${agentName}.cast`);
    sdk.actions.openUrl(`${APP_URL}/mint?agent=${encodedAgent}&from=mini`);
  }, [agentName]);

  useEffect(() => {
    const init = async () => {
      let userFid: number | null = null;
      try {
        const context = await sdk.context;
        userFid = context?.user?.fid ?? null;
        setFid(userFid);
      } catch {
        // running outside Warpcast — continue without FID
      }
      await sdk.actions.ready();
      // Auto-check: if this FID already has an account, skip straight to inbox
      if (userFid) {
        try {
          const res = await fetch(WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'provisionFidAgent', fid: userFid, preferredName: '', farcasterVisibility: 'fid-only', emailVisibility: 'hidden' }),
          });
          const data = await res.json() as ProvisionResult & { eciesPrivateKey?: string };
          if (data.status === 'already_provisioned' && data.agentName) {
            setAgentName(data.agentName);
            setHumanEmail(`${data.agentName}@nftmail.box`);
            let privKey: string | null = null;
            try { privKey = localStorage.getItem(`ecies-priv:${data.agentName}`); } catch {}
            if (privKey) setEciesPrivKey(privKey);
            await loadInboxDirect(data.agentName, privKey);
            return;
          }
        } catch { /* non-fatal — fall through to entry */ }
      }
      setStep('entry');
    };
    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const provision = useCallback(async (name: string, visibility: 'hidden' | 'fid-only' | 'full') => {
    if (!fid) { setError('No FID detected — open this in Warpcast.'); setStep('error'); return; }
    setStep('provisioning');
    try {
      const res = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'provisionFidAgent',
          fid,
          preferredName: name.trim().toLowerCase().replace(/[^a-z0-9-]/g, ''),
          farcasterVisibility: visibility,
          emailVisibility: 'hidden',
        }),
      });
      const data: ProvisionResult = await res.json();
      if (data.status === 'already_provisioned' && data.agentName) {
        setAgentName(data.agentName);
        setHumanEmail(data.humanEmail || `${data.agentName}@nftmail.box`);
        await loadInbox(data.agentName);
        return;
      }
      if (data.status === 'provisioned' && data.agentName) {
        setAgentName(data.agentName);
        setHumanEmail(data.humanEmail || `${data.agentName}@nftmail.box`);
        setExpiresAt(data.expiresAt || null);
        // Persist privkey in localStorage — only copy, never sent back to server
        if ((data as any).eciesPrivateKey) {
          try { localStorage.setItem(`ecies-priv:${data.agentName}`, (data as any).eciesPrivateKey); } catch {}
          setEciesPrivKey((data as any).eciesPrivateKey);
        }
        setStep('success');
        return;
      }
      setError(data.error || 'Provisioning failed — please try again.');
      setStep('error');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Network error');
      setStep('error');
    }
  }, [fid]);

  const openByoMolt = useCallback(() => {
    sdk.actions.openUrl(`https://ghostagent.ninja/byo-molt?agent=${agentName}&from=nftmail`);
  }, [agentName]);

  // Core inbox fetch — usable before eciesPrivKey state is set (pass key explicitly)
  const loadInboxDirect = async (name: string, privKey: string | null) => {
    setStep('inbox');
    try {
      const res = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'getInbox', localPart: name }),
      });
      const data: InboxResult = await res.json();
      const decrypted = await Promise.all((data.messages || []).map(async (msg) => {
        if ((msg as any).encrypted && (msg as any).envelope && privKey) {
          try {
            const plain = await eciesDecryptClient(JSON.stringify((msg as any).envelope), privKey);
            const inner = JSON.parse(plain) as { payload?: { from?: string; subject?: string; body?: string } };
            return { ...msg, from: inner.payload?.from || msg.from, subject: inner.payload?.subject || msg.subject, content: inner.payload?.body || msg.content, body: inner.payload?.body || msg.body };
          } catch { return msg; }
        }
        return msg;
      }));
      setMessages(decrypted);
      setSendsRemaining(data.sendsRemaining ?? 10);
    } catch {
      setMessages([]);
    }
  };

  const loadInbox = useCallback(async (name: string) => {
    let privKey = eciesPrivKey;
    if (!privKey) { try { privKey = localStorage.getItem(`ecies-priv:${name}`); } catch {} }
    await loadInboxDirect(name, privKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eciesPrivKey]);

  const sendTest = useCallback(async () => {
    setStep('sending');
    try {
      const res = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sendTestEmail', agentName }),
      });
      const data = await res.json() as { status?: string; sendsRemaining?: number; error?: string };
      if (data.error) throw new Error(data.error);
      setSendsRemaining(data.sendsRemaining ?? sendsRemaining);
      setStep('sent');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Send failed');
      setStep('error');
    }
  }, [agentName, sendsRemaining]);

  const sendCompose = useCallback(async () => {
    if (!composeTo.trim() || !composeSubject.trim() || !composeBody.trim()) {
      setError('To, Subject and Body are required.');
      setStep('error');
      return;
    }
    setStep('sending');
    try {
      const res = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sendOutbound',
          agentName,
          to: composeTo.trim(),
          subject: composeSubject.trim(),
          body: composeBody.trim(),
        }),
      });
      const data = await res.json() as { status?: string; sendsRemaining?: number; error?: string };
      if (data.error) throw new Error(data.error);
      setSendsRemaining(data.sendsRemaining ?? sendsRemaining);
      // Add to sentbox
      const now = Date.now();
      const newSent: InboxMessage = {
        id: `sent-${now}`,
        subject: composeSubject.trim(),
        from: humanEmail || `${agentName}@nftmail.box`,
        to: composeTo.trim(),
        content: composeBody.trim(),
        receivedAt: now,
        type: 'sent',
      };
      setSentMessages(prev => [newSent, ...prev].slice(0, 10));
      setComposeTo(''); setComposeSubject(''); setComposeBody('');
      setStep('sent');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Send failed');
      setStep('error');
    }
  }, [agentName, composeTo, composeSubject, composeBody, sendsRemaining]);

  const LOGO_URL = LOGO_BASE64;
  const MAILBOX_ICON_URL = MAILBOX_BASE64;

  if (step === 'loading') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Image src={LOGO_URL} alt="" width={120} height={120} className="mx-auto mb-4" />
          <p className="text-green-400 font-mono text-sm">Initialising...</p>
        </div>
      </div>
    );
  }

  if (step === 'entry') {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Image src={LOGO_URL} alt="" width={80} height={80} className="rounded-xl" />
            </div>
            <h1 className="text-white font-bold text-2xl mb-1">nftmail.box</h1>
            <p className="text-gray-400 text-sm">Encrypted mail · Farcaster wallet secured</p>
            {fid
              ? <p className="text-green-400 font-mono text-xs mt-2">FID: {fid} ✓</p>
              : <p className="text-yellow-500 font-mono text-xs mt-2">Open in Warpcast to link FID</p>
            }
          </div>
          <div className="space-y-3">
            <input
              type="text"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white font-mono text-sm placeholder-gray-500 focus:outline-none focus:border-green-400"
              placeholder={fid ? `Custom name (default: your Farcaster name · FID ${fid})` : 'Custom name (optional)'}
              value={customName}
              onChange={e => setCustomName(e.target.value)}
              maxLength={32}
              autoComplete="off"
              autoCapitalize="none"
            />
            <button
              onClick={() => setStep('naming')}
              disabled={!fid}
              className="w-full bg-green-500 hover:bg-green-400 disabled:bg-gray-700 disabled:text-gray-500 text-black font-bold py-3 rounded-lg transition-colors"
            >
              {fid ? 'Claim Account (LARVA) →' : 'Open in Warpcast to Claim'}
            </button>
            <p className="text-gray-600 text-xs text-center">8-day free inbox · Upgrade to permanent anytime</p>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'naming') {
    const name = customName.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
    const displayName = name || `your-farcaster-name`;
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🔒</div>
            <h2 className="text-white font-bold text-xl mb-1">Privacy Settings</h2>
            <p className="text-green-400 font-mono text-sm">{displayName}.cast@nftmail.box</p>
          </div>
          <p className="text-gray-400 text-sm text-center mb-6">Who can see your Farcaster identity?</p>
          <div className="space-y-3">
            <button
              onClick={() => provision(name, 'hidden')}
              className="w-full bg-gray-900 border border-gray-700 hover:border-green-400 text-white py-3 rounded-lg text-sm transition-colors"
            >
              🕵️ Hidden — No FID visible
            </button>
            <button
              onClick={() => provision(name, 'fid-only')}
              className="w-full bg-gray-900 border border-gray-700 hover:border-green-400 text-white py-3 rounded-lg text-sm transition-colors"
            >
              👁 FID Only — Show FID number
            </button>
            <button
              onClick={() => provision(name, 'full')}
              className="w-full bg-gray-900 border border-gray-700 hover:border-green-400 text-white py-3 rounded-lg text-sm transition-colors"
            >
              🌐 Full Profile — Show username + avatar
            </button>
            <button onClick={() => setStep('entry')} className="w-full text-gray-500 text-sm py-2">
              ← Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'provisioning') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-green-400 font-mono text-sm">Creating your account...</p>
          <p className="text-gray-600 text-xs mt-2">Resolving Farcaster name · Setting up inbox</p>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    const expiresStr = expiresAt ? new Date(expiresAt).toLocaleDateString() : '30 days';
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-sm text-center">
          <div className="text-5xl mb-3">🎉</div>
          <h2 className="text-white font-bold text-2xl mb-2">Account Created!</h2>
          <div className="bg-gray-900 border border-green-400 rounded-lg p-4 my-6">
            <p className="text-green-400 font-mono text-sm font-bold">{humanEmail}</p>
            <p className="text-gray-500 text-xs mt-1">LARVA · Active until {expiresStr} · 8-day inbox history</p>
          </div>
          <p className="text-gray-400 text-xs mb-6">
            Secured by your Farcaster wallet. Upgrade to permanent by minting an NFT.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => loadInbox(agentName)}
              className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-lg transition-colors">
              Read Inbox →
            </button>
            <button onClick={() => setStep('compose')} className="w-full bg-gray-900 border border-gray-700 hover:border-green-400 text-white py-3 rounded-lg text-sm transition-colors">
              Compose
            </button>
            <button onClick={sendTest} className="w-full text-gray-500 text-sm py-2">
              Send Test to Self
            </button>
            <button onClick={openUpgrade} className="w-full text-gray-500 text-sm py-2">
              Upgrade to Permanent →
            </button>
            <button onClick={openByoMolt} className="w-full text-gray-600 text-xs py-1">
              Already have an NFT? Use BYO Molt
            </button>
          </div>
        </div>
      </div>
    );
  }


  if (step === 'inbox') {
    return (
      <div className="min-h-screen bg-black flex flex-col px-4 py-6">
        <div className="w-full max-w-sm mx-auto">
          {/* Header with Logo */}
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-800">
            <Image src={LOGO_URL} alt="" width={32} height={32} className="rounded shrink-0" />
            <span className="text-white font-bold text-sm whitespace-nowrap">nftmail.box</span>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold text-lg">Inbox</h2>
            <button onClick={() => loadInbox(agentName)} className="text-green-400 text-sm">Refresh</button>
          </div>
          <p className="text-green-400 font-mono text-xs mb-4">{humanEmail || `${agentName}@nftmail.box`}</p>
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <Image src={MAILBOX_ICON_URL} alt="" width={64} height={64} className="mx-auto mb-3 opacity-70" />
              <p className="text-gray-500 text-sm">No messages yet</p>
              <p className="text-gray-600 text-xs mt-1">Send a test email to verify delivery</p>
            </div>
          ) : (
            <div className="space-y-2 mb-4">
              {messages.slice(0, 10).map(msg => {
                const isOpen = openMsgId === msg.id;
                const body = msg.content || msg.body || '';
                return (
                  <div
                    key={msg.id}
                    className={`bg-gray-900 border rounded-lg p-3 cursor-pointer transition-colors ${isOpen ? 'border-green-500/50' : 'border-gray-800 hover:border-gray-700'}`}
                  >
                    <div 
                      className="flex items-start justify-between gap-2"
                      onClick={() => setOpenMsgId(isOpen ? null : msg.id)}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-white text-sm font-medium truncate">{msg.subject || '(no subject)'}</p>
                        <p className="text-gray-500 text-xs mt-0.5 truncate">{msg.from}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-gray-600 text-xs">{new Date(msg.receivedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            // Delete functionality will be added
                            if (confirm('Delete this email?')) {
                              setMessages(prev => prev.filter(m => m.id !== msg.id));
                            }
                          }}
                          className="text-red-500 hover:text-red-400 text-xs px-1"
                          title="Delete"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                    {isOpen && (
                      <div className="mt-3 pt-3 border-t border-gray-800">
                        {body ? (
                          <SafeMarkdown text={body} />
                        ) : (
                          <p className="text-gray-600 text-xs italic">(no body — message may be encrypted without a local key)</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          {/* Sentbox Section */}
          <div className="mt-6 pt-4 border-t border-gray-800">
            <button 
              className="w-full flex items-center justify-between py-2 text-left"
              onClick={() => {}}
            >
              <span className="text-gray-400 text-sm">Sentbox</span>
              <span className="text-gray-500 text-xs">{sentMessages.length}/10</span>
            </button>
            {sentMessages.length === 0 ? (
              <p className="text-gray-600 text-xs">No sent emails yet</p>
            ) : (
              <div className="space-y-2 mt-2">
                {sentMessages.map(msg => (
                  <div key={msg.id} className="bg-gray-900 border border-gray-800 rounded-lg p-2">
                    <p className="text-white text-sm truncate">{msg.subject || '(no subject)'}</p>
                    <p className="text-gray-500 text-xs truncate">To: {msg.to}</p>
                    <p className="text-gray-600 text-xs">{new Date(msg.receivedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2 mt-6">
            <button onClick={() => setStep('compose')} className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
              <span>✉️</span> Compose
            </button>
            <button onClick={openDashboard} className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-colors text-sm">
              Dashboard
            </button>
            <button onClick={loadInbox.bind(null, agentName)} className="w-full text-gray-500 text-sm py-2">
              Refresh
            </button>
            <p className="text-gray-600 text-xs text-center">{sendsRemaining} sends remaining</p>
            <button onClick={openUpgrade} className="w-full text-gray-600 text-xs py-1">Upgrade to Permanent →</button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'compose') {
    const fromAddr = humanEmail || `${agentName}@nftmail.box`;
    return (
      <div className="min-h-screen bg-black flex flex-col px-4 py-6">
        <div className="w-full max-w-sm mx-auto">
          <div className="flex items-center gap-3 mb-5">
            <button onClick={() => setStep('inbox')} className="text-gray-500 text-lg">←</button>
            <h2 className="text-white font-bold text-lg">Compose</h2>
          </div>
          <p className="text-gray-600 font-mono text-xs mb-4">From: {fromAddr}</p>
          <div className="space-y-3">
            <input
              type="email"
              placeholder="To: recipient@example.com"
              value={composeTo}
              onChange={e => setComposeTo(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white font-mono text-sm placeholder-gray-500 focus:outline-none focus:border-green-400"
              autoCapitalize="none"
              autoComplete="off"
            />
            <input
              type="text"
              placeholder="Subject"
              value={composeSubject}
              onChange={e => setComposeSubject(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-green-400"
            />
            <textarea
              placeholder="Message body..."
              value={composeBody}
              onChange={e => setComposeBody(e.target.value)}
              rows={6}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-green-400 resize-none"
            />
            <button
              onClick={sendCompose}
              disabled={!composeTo || !composeSubject || !composeBody}
              className="w-full bg-green-500 hover:bg-green-400 disabled:bg-gray-700 disabled:text-gray-500 text-black font-bold py-3 rounded-lg transition-colors"
            >
              Send →
            </button>
            <p className="text-gray-600 text-xs text-center">{sendsRemaining} sends remaining</p>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'sending') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-green-400 font-mono text-sm">Sending test email...</p>
        </div>
      </div>
    );
  }

  if (step === 'sent') {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-sm text-center">
          <Image src={MAILBOX_ICON_URL} alt="Sent" width={64} height={64} className="mx-auto mb-3 opacity-70" />
          <h2 className="text-white font-bold text-xl mb-2">Sent!</h2>
          <div className="bg-gray-900 border border-green-400 rounded-lg p-4 my-6">
            <p className="text-green-400 font-mono text-sm">{humanEmail || `${agentName}@nftmail.box`}</p>
            <p className="text-gray-500 text-xs mt-1">{10 - (typeof sendsRemaining === 'number' ? sendsRemaining : 10)} of 10 sent · {sendsRemaining} remaining</p>
          </div>
          <p className="text-gray-400 text-xs mb-6">Your email is on its way to the recipient.</p>
          <div className="space-y-3">
            <button onClick={() => loadInbox(agentName)} className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-lg transition-colors">
              Back to Inbox →
            </button>
            <button onClick={openUpgrade} className="w-full bg-gray-900 border border-gray-700 text-white py-3 rounded-lg text-sm">
              Upgrade to PUPA →
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isSendLimitError = error?.toLowerCase().includes('send limit');
  
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        <h2 className="text-white font-bold text-xl mb-3">Something went wrong</h2>
        <p className="text-red-400 font-mono text-xs mb-6 break-words">{error}</p>
        {isSendLimitError ? (
          <div className="space-y-3">
            <button onClick={openUpgrade} className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-lg transition-colors">
              Upgrade to PUPA →
            </button>
            <button onClick={() => { setStep('entry'); setError(''); }} className="w-full bg-gray-900 border border-gray-700 text-white py-3 rounded-lg">
              Try Again
            </button>
          </div>
        ) : (
          <button onClick={() => { setStep('entry'); setError(''); }} className="w-full bg-gray-900 border border-gray-700 text-white py-3 rounded-lg">
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
