import { NextResponse } from 'next/server';

// Farcaster Mini App manifest — https://miniapps.farcaster.xyz/docs/specification
// accountAssociation generated via: farcaster.xyz/~/settings/developer-tools
// Domain: nftmail.box

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://nftmail.box';

export async function GET() {
  const manifest = {
    accountAssociation: {
      header: process.env.FARCASTER_MANIFEST_HEADER || '',
      payload: process.env.FARCASTER_MANIFEST_PAYLOAD || '',
      signature: process.env.FARCASTER_MANIFEST_SIGNATURE || '',
    },
    miniapp: {
      version: '1',
      name: 'nftmail.box',
      iconUrl: `${APP_URL}/nftmail-logo-32.png`,
      homeUrl: `${APP_URL}/mini`,
      imageUrl: `${APP_URL}/nftmail-logo.png`,
      buttonTitle: '👻 Claim Agent',
      splashImageUrl: `${APP_URL}/nftmail-logo-32.png`,
      splashBackgroundColor: '#000000',
      webhookUrl: `${APP_URL}/api/farcaster-webhook`,
    },
  };

  return NextResponse.json(manifest, {
    headers: {
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
