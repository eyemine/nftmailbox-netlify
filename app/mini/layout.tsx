import type { Metadata } from 'next';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://nftmail.box';
// Cache-busted local images for Farcaster (must be 1024x1024 PNG, no alpha)
const ICON_URL = `${APP_URL}/icon-v2.png`;
const SPLASH_URL = `${APP_URL}/splash-200.png`;

const miniAppEmbed = JSON.stringify({
  version: '1',
  imageUrl: ICON_URL,
  button: {
    title: 'Claim Inbox',
    action: {
      type: 'launch_frame',
      name: 'NFTmail Inbox',
      url: `${APP_URL}/mini`,
      splashImageUrl: SPLASH_URL,
      splashBackgroundColor: '#000000',
    },
  },
});

export const metadata: Metadata = {
  title: 'NFTmail Mini — Farcaster Inbox',
  description: 'FID-based ephemeral inbox. 10 free emails. Upgrade for sovereign storage.',
  other: {
    'fc:miniapp': miniAppEmbed,
    'fc:frame': miniAppEmbed,
  },
};

export default function MiniLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
