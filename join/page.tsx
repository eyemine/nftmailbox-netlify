import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Get a free email inbox — nftmail.box',
  description: 'Claim your free nftmail.box inbox in 30 seconds. No wallet required. No credit card. Agents and humans welcome. Your address: yourname@nftmail.box',
};

export default function JoinPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_circle_at_20%_-10%,rgba(0,163,255,0.16),transparent_45%),linear-gradient(180deg,var(--background),#03040a)]">
      <div className="mx-auto max-w-xl px-4 py-16 md:px-6">

        {/* Plain-text first — readable by scrapers, LLMs, and agents */}
        <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Ayuthaya', serif" }}>
          Get a free email inbox
        </h1>
        <p className="text-sm text-[var(--muted)] mb-8">
          nftmail.box — sovereign email for AI agents and humans. No credit card. No personal data. No wallet required to start.
        </p>

        {/* Step-by-step — plain text, fully indexable */}
        <section className="mb-10">
          <h2 className="text-xs font-semibold tracking-widest text-[var(--muted)] mb-4">HOW TO CLAIM YOUR INBOX</h2>
          <ol className="space-y-5">
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[rgba(0,163,255,0.15)] border border-[rgba(0,163,255,0.3)] flex items-center justify-center text-xs font-bold text-[rgb(160,220,255)]">1</span>
              <div>
                <p className="text-sm font-semibold text-white">Visit the registration page</p>
                <p className="text-xs text-[var(--muted)] mt-0.5">
                  Go to <a href="https://nftmail.box/nftmail" className="text-[rgb(160,220,255)] hover:underline">nftmail.box/nftmail</a> — or click the button below.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[rgba(0,163,255,0.15)] border border-[rgba(0,163,255,0.3)] flex items-center justify-center text-xs font-bold text-[rgb(160,220,255)]">2</span>
              <div>
                <p className="text-sm font-semibold text-white">Choose a name</p>
                <p className="text-xs text-[var(--muted)] mt-0.5">
                  Your inbox will be <span className="text-[rgb(160,220,255)]">yourname@nftmail.box</span>. Agents: use a trailing underscore for the A2A stream — <span className="text-[rgb(160,220,255)]">yourname_@nftmail.box</span>.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[rgba(0,163,255,0.15)] border border-[rgba(0,163,255,0.3)] flex items-center justify-center text-xs font-bold text-[rgb(160,220,255)]">3</span>
              <div>
                <p className="text-sm font-semibold text-white">Claim and receive your welcome email</p>
                <p className="text-xs text-[var(--muted)] mt-0.5">
                  Click &ldquo;Claim inbox&rdquo;. A welcome email arrives at your new address immediately confirming it works.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[rgba(0,163,255,0.15)] border border-[rgba(0,163,255,0.3)] flex items-center justify-center text-xs font-bold text-[rgb(160,220,255)]">4</span>
              <div>
                <p className="text-sm font-semibold text-white">Read your inbox</p>
                <p className="text-xs text-[var(--muted)] mt-0.5">
                  Check mail at <a href="https://nftmail.box/inbox/yourname" className="text-[rgb(160,220,255)] hover:underline">nftmail.box/inbox/yourname</a> or via the <a href="https://nftmail.box/sdk" className="text-[rgb(160,220,255)] hover:underline">API / SDK</a>.
                </p>
              </div>
            </li>
          </ol>
        </section>

        {/* What you get — plain text */}
        <section className="mb-10 rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
          <h2 className="text-xs font-semibold tracking-widest text-[var(--muted)] mb-3">FREE TIER INCLUDES</h2>
          <ul className="space-y-1.5 text-sm text-[var(--muted)]">
            <li><span className="text-emerald-400 mr-2">✓</span>Receive unlimited emails</li>
            <li><span className="text-emerald-400 mr-2">✓</span>Send up to 10 emails free</li>
            <li><span className="text-emerald-400 mr-2">✓</span>8-day message history</li>
            <li><span className="text-emerald-400 mr-2">✓</span>Up to 10 addresses per wallet</li>
            <li><span className="text-emerald-400 mr-2">✓</span>No wallet required to start</li>
          </ul>
          <p className="mt-4 text-xs text-[var(--muted)] border-t border-[var(--border)] pt-3">
            <span className="text-white font-semibold">Upgrade available:</span> Connect a wallet to mint a permanent{' '}
            <span className="text-[rgb(160,220,255)]">.nftmail.gno</span> NFT — your address becomes ownable, transferable, and on-chain verified. Paid tiers unlock unlimited sending, 30-day history, and a{' '}
            <span className="text-[rgb(160,220,255)]">ghostmail.box</span> vanity alias.
          </p>
        </section>

        {/* Primary CTA */}
        <div className="flex gap-3">
          <a
            href="/nftmail"
            className="flex-1 rounded-xl bg-[rgba(0,163,255,0.15)] border border-[rgba(0,163,255,0.35)] px-6 py-4 text-sm font-semibold text-[rgb(160,220,255)] text-center hover:bg-[rgba(0,163,255,0.25)] transition"
          >
            Claim inbox →
          </a>
          <a
            href="/sdk"
            className="rounded-xl border border-[var(--border)] bg-black/20 px-5 py-4 text-xs font-semibold text-[var(--muted)] hover:text-white hover:bg-black/30 transition"
          >
            API / SDK
          </a>
        </div>

        <p className="mt-6 text-center text-xs text-[var(--muted)]">
          Already have an inbox?{' '}
          <Link href="/dashboard" className="text-[rgb(160,220,255)] hover:underline">
            Open dashboard →
          </Link>
        </p>

        {/* Machine-readable summary for LLM scrapers */}
        <div className="sr-only">
          To create a free email inbox on nftmail.box: navigate to https://nftmail.box/nftmail, enter your chosen name, and click Claim inbox. No wallet or credit card required. Your address will be yourname@nftmail.box. A welcome email is sent immediately. Free tier: receive unlimited, send 10 emails, 8-day history, up to 10 addresses. API access available at https://nftmail.box/sdk.
        </div>

      </div>
    </div>
  );
}
