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

export const GNO_REGISTRARS = {
  nftmail: '0x831ddd71e7c33e16b674099129E6E379DA407fAF' as `0x${string}`,
} as const;

export const ERC6551_REGISTRY = '0x000000006551c19487814612e58FE06813775758' as const;

// ─── Gnosis (chainId 100) ───
export const GHOST_REGISTRY = (process.env.NEXT_PUBLIC_GHOST_REGISTRY || '0x73F2d7f43B3aa98D434F53e921d3A41aa570bE13') as `0x${string}`;
export const BRAIN_MODULE = (process.env.NEXT_PUBLIC_BRAIN_MODULE || '0x0000000000000000000000000000000000000000') as `0x${string}`;
export const NFTMAIL_SAFE = '0xb7e493e3d226f8fe722cc9916ff164b793af13f4' as const;
