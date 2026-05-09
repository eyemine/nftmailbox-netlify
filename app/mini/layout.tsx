import type { Metadata } from 'next';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://nftmail.box';
const PINATA_LOGO_URL = 'https://moccasin-useful-vole-840.mypinata.cloud/ipfs/bafkreibjca4jhti5cijjn2rc3hgrbb2u75ceimjg4ydzxuijdoyolhalia';

const miniAppEmbed = JSON.stringify({
  version: '1',
  imageUrl: PINATA_LOGO_URL,
  button: {
    title: 'Claim Agent',
    action: {
      type: 'launch_frame',
      name: 'nftmail.box',
      url: `${APP_URL}/mini`,
      splashImageUrl: PINATA_LOGO_URL,
      splashBackgroundColor: '#43a574',
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
