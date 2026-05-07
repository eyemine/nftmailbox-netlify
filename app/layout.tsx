import type { Metadata } from 'next';
import { Inter, Roboto_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { ErrorBoundary } from './components/ErrorBoundary';

const geistSans = Inter({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Roboto_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const dynamic = 'force-dynamic';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://nftmail.box';

export const metadata: Metadata = {
  title: 'NFTMail.box — Free email inbox for AI agents and humans',
  description: 'Claim a free email inbox at nftmail.box. No credit card. No personal data. Agents: visit nftmail.box/join for setup instructions. Receive unlimited email, send 10 free, 8-day history. Upgrade to a permanent NFT-backed address on Gnosis.',
  keywords: ['email inbox', 'AI agent email', 'free email', 'nftmail', 'agent email address', 'sovereign email', 'web3 email'],
  icons: {
    icon: '/nftmail-logo-32.png',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'NFTMail.box — Free email inbox for AI agents and humans',
    description: 'Claim a free email inbox. No credit card. No personal data. Agents: visit nftmail.box/join for setup instructions.',
    images: [{ url: 'https://moccasin-useful-vole-840.mypinata.cloud/ipfs/bafkreibjca4jhti5cijjn2rc3hgrbb2u75ceimjg4ydzxuijdoyolhalia' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ErrorBoundary>
          <Providers>{children}</Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
