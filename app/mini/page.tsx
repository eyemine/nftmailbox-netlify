'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { sdk } from '@farcaster/miniapp-sdk';

const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL || 'https://nftmail-email-worker.richard-159.workers.dev';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://nftmail.box';

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
  subject: string;
  body?: string;
  receivedAt: number;
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
  const [sendsRemaining, setSendsRemaining] = useState<number | string>(10);
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        const context = await sdk.context;
        const userFid = context?.user?.fid ?? null;
        setFid(userFid);
      } catch {
        // running outside Warpcast — continue without FID
      } finally {
        await sdk.actions.ready();
        setStep('entry');
      }
    };
    init();
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
        setStep('already');
        return;
      }
      if (data.status === 'provisioned' && data.agentName) {
        setAgentName(data.agentName);
        setHumanEmail(data.humanEmail || `${data.agentName}@nftmail.box`);
        setExpiresAt(data.expiresAt || null);
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

  const openDashboard = useCallback(() => {
    sdk.actions.openUrl(`${APP_URL}/dashboard`);
  }, []);

  const openUpgrade = useCallback(() => {
    sdk.actions.openUrl(`${APP_URL}/mint?agent=${agentName}&from=mini`);
  }, [agentName]);

  const openByoMolt = useCallback(() => {
    sdk.actions.openUrl(`https://ghostagent.ninja/byo-molt?agent=${agentName}&from=nftmail`);
  }, [agentName]);

  const loadInbox = useCallback(async (name: string) => {
    setStep('inbox');
    try {
      const res = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'getInbox', localPart: name }),
      });
      const data: InboxResult = await res.json();
      setMessages(data.messages || []);
      setSendsRemaining(data.sendsRemaining ?? 10);
    } catch {
      setMessages([]);
    }
  }, []);

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
      setComposeTo(''); setComposeSubject(''); setComposeBody('');
      setStep('sent');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Send failed');
      setStep('error');
    }
  }, [agentName, composeTo, composeSubject, composeBody, sendsRemaining]);

  if (step === 'loading') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
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
              <Image src="/nftmail-logo.png" alt="nftmail.box" width={72} height={72} className="rounded-xl" />
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
    const expiresStr = expiresAt ? new Date(expiresAt).toLocaleDateString() : '8 days';
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-sm text-center">
          <div className="text-5xl mb-3">🎉</div>
          <h2 className="text-white font-bold text-2xl mb-2">Account Created!</h2>
          <div className="bg-gray-900 border border-green-400 rounded-lg p-4 my-6">
            <p className="text-green-400 font-mono text-sm font-bold">{humanEmail}</p>
            <p className="text-gray-500 text-xs mt-1">LARVA · Expires {expiresStr} · 10 sends</p>
          </div>
          <p className="text-gray-400 text-xs mb-6">
            Secured by your Farcaster wallet. Upgrade to permanent by minting an NFT.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => loadInbox(agentName)}
              className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-lg transition-colors">
              📨 Read Inbox →
            </button>
            <button onClick={() => setStep('compose')} className="w-full bg-gray-900 border border-gray-700 hover:border-green-400 text-white py-3 rounded-lg text-sm transition-colors">
              ✉️ Compose Email
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

  if (step === 'already') {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-sm text-center">
          <div className="text-5xl mb-3">👻</div>
          <h2 className="text-white font-bold text-xl mb-2">Already Claimed</h2>
          <p className="text-green-400 font-mono text-sm mb-6">{agentName}@nftmail.box</p>
          <div className="space-y-3">
            <button onClick={() => loadInbox(agentName)} className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-lg transition-colors">
              📨 Read Inbox →
            </button>
            <button onClick={() => setStep('compose')} className="w-full bg-gray-900 border border-gray-700 hover:border-green-400 text-white py-3 rounded-lg text-sm">
              ✉️ Compose Email
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold text-lg">📨 Inbox</h2>
            <button onClick={() => loadInbox(agentName)} className="text-green-400 text-sm">↻ Refresh</button>
          </div>
          <p className="text-green-400 font-mono text-xs mb-4">{humanEmail || `${agentName}@nftmail.box`}</p>
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-gray-500 text-sm">No messages yet</p>
              <p className="text-gray-600 text-xs mt-1">Send a test email to verify delivery</p>
            </div>
          ) : (
            <div className="space-y-2 mb-4">
              {messages.slice(0, 5).map(msg => (
                <div key={msg.id} className="bg-gray-900 border border-gray-800 rounded-lg p-3">
                  <p className="text-white text-sm font-medium truncate">{msg.subject}</p>
                  <p className="text-gray-500 text-xs mt-0.5 truncate">{msg.from}</p>
                  <p className="text-gray-600 text-xs mt-0.5">{new Date(msg.receivedAt).toLocaleTimeString()}</p>
                </div>
              ))}
            </div>
          )}
          <div className="space-y-2 mt-4">
            <button onClick={() => setStep('compose')} className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-lg transition-colors">
              ✉️ Compose Email
            </button>
            <p className="text-gray-600 text-xs text-center">{sendsRemaining} sends remaining</p>
            <button onClick={() => setStep('success')} className="w-full text-gray-500 text-sm py-2">← Back</button>
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
            <h2 className="text-white font-bold text-lg">✉️ Compose</h2>
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
          <div className="text-5xl mb-3">✉️</div>
          <h2 className="text-white font-bold text-xl mb-2">Test Sent!</h2>
          <div className="bg-gray-900 border border-green-400 rounded-lg p-4 my-6">
            <p className="text-green-400 font-mono text-sm">{humanEmail || `${agentName}@nftmail.box`}</p>
            <p className="text-gray-500 text-xs mt-1">{sendsRemaining} sends remaining</p>
          </div>
          <p className="text-gray-400 text-xs mb-6">Check your inbox — it should arrive in a few seconds.</p>
          <div className="space-y-3">
            <button onClick={() => loadInbox(agentName)} className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-lg transition-colors">
              📨 Check Inbox →
            </button>
            <button onClick={openUpgrade} className="w-full bg-gray-900 border border-gray-700 text-white py-3 rounded-lg text-sm">
              Upgrade to PUPA →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        <div className="text-4xl mb-3">⚠️</div>
        <h2 className="text-white font-bold text-xl mb-3">Something went wrong</h2>
        <p className="text-red-400 font-mono text-xs mb-6 break-words">{error}</p>
        <button onClick={() => { setStep('entry'); setError(''); }} className="w-full bg-gray-900 border border-gray-700 text-white py-3 rounded-lg">
          Try Again
        </button>
      </div>
    </div>
  );
}
