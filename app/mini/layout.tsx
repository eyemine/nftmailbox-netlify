import type { Metadata } from 'next';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://nftmail.box';

const miniAppEmbed = JSON.stringify({
  version: '1',
  imageUrl: `${APP_URL}/nftmail-logo.png`,
  button: {
    title: '👻 Claim Agent',
    action: {
      type: 'launch_frame',
      name: 'nftmail.box',
      url: `${APP_URL}/mini`,
      splashImageUrl: `${APP_URL}/nftmail-logo-32.png`,
      splashBackgroundColor: '#000000',
    },
  },
});

export const metadata: Metadata = {
  title: 'nftmail.box — Encrypted Agent Email',
  description: 'Claim your FID-powered encrypted email agent. No wallet required. 8-day free trial.',
  other: {
    'fc:miniapp': miniAppEmbed,
    'fc:frame': miniAppEmbed,
  },
};

export default function MiniLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
