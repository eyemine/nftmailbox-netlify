import { defineChain } from 'viem';

export const gnosis = defineChain({
  id: 100,
  name: 'Gnosis',
  nativeCurrency: { name: 'xDAI', symbol: 'xDAI', decimals: 18 },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_GNOSIS_RPC || 'https://rpc.gnosischain.com'],
    },
  },
  blockExplorers: {
    default: { name: 'Gnosisscan', url: 'https://gnosisscan.io' },
  },
});

export const GHOST_REGISTRY = (process.env.NEXT_PUBLIC_GHOST_REGISTRY || '0x73F2d7f43B3aa98D434F53e921d3A41aa570bE13') as `0x${string}`;

export const GNO_REGISTRARS = {
  nftmail: '0x831ddd71e7c33e16b674099129E6E379DA407fAF' as `0x${string}`,
} as const;
