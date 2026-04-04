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

export const BRAIN_MODULE = '0x291e8405096413407c3Ddd8850Fb101b446f5200' as `0x${string}`;

export const GNO_REGISTRARS = {
  nftmail: '0x831ddd71e7c33e16b674099129E6E379DA407fAF' as `0x${string}`,
  agent: '0x608071875bcc0ef0b934f8a2367672d8c472cacf' as `0x${string}`,
  openclaw: '0xbd8285a8455ccec4be671d9ee3924ab1264fcbbe' as `0x${string}`,
  molt: '0x4b54213c1e5826497ff39ba8c87a7b75d2bc3c50' as `0x${string}`,
  picoclaw: '0xe5fd65562698f46ea9762bd38141535b1fd875b5' as `0x${string}`,
  vault: '0xc6b184a38da64d1d535674dafb9ce2440058ec4e' as `0x${string}`,
} as const;
