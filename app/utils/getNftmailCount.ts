/// Utility function to get total registered nftmail.box accounts from on-chain registrars
/// Uses viem to query the nftmail registrar contracts on Gnosis (molt.gno, nftmail.gno, openclaw.gno, picoclaw.gno)

import { createPublicClient, http } from 'viem';
import { gnosis } from 'viem/chains';

// nftmail registrar contracts on Gnosis mainnet (chain 100)
const NFTMAIL_REGISTRARS = {
  molt_gno: '0x4b54213c1e5826497ff39ba8c87a7b75d2bc3c50' as `0x${string}`,
  openclaw_gno: '0xbD8285A8455CCEC4bE671D9eE3924Ab1264fcbbe' as `0x${string}`,
  picoclaw_gno: '0xe5fd65562698f46ea9762bd38141535b1fd875b5' as `0x${string}`,
} as const;

// Minimal ABI for nftmail registrar
const REGISTRAR_ABI = [
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
] as const;

const publicClient = createPublicClient({
  chain: gnosis,
  transport: http(process.env.NEXT_PUBLIC_GNOSIS_RPC || 'https://rpc.gnosischain.com'),
});

export interface NftmailStats {
  totalAccounts: bigint;
  formattedTotal: string;
  breakdown: {
    molt_gno: string;
    openclaw_gno: string;
    picoclaw_gno: string;
  };
  lastUpdated: Date;
  chainId: number;
}

/**
 * Get the total number of registered nftmail.box accounts from all registrar contracts
 * This is the single source of truth for nftmail account count
 */
export async function getNftmailCount(): Promise<NftmailStats> {
  try {
    console.log('Fetching nftmail registrar counts from contracts:', NFTMAIL_REGISTRARS);
    
    // Query all registrars in parallel
    const [moltCount, openclawCount, picoclawCount] = await Promise.all([
      publicClient.readContract({
        address: NFTMAIL_REGISTRARS.molt_gno,
        abi: REGISTRAR_ABI,
        functionName: 'totalSupply',
      }).catch(() => 0n),
      publicClient.readContract({
        address: NFTMAIL_REGISTRARS.openclaw_gno,
        abi: REGISTRAR_ABI,
        functionName: 'totalSupply',
      }).catch(() => 0n),
      publicClient.readContract({
        address: NFTMAIL_REGISTRARS.picoclaw_gno,
        abi: REGISTRAR_ABI,
        functionName: 'totalSupply',
      }).catch(() => 0n),
    ]);

    const totalAccounts = moltCount + openclawCount + picoclawCount;

    console.log('Nftmail count results:', {
      molt_gno: moltCount.toString(),
      openclaw_gno: openclawCount.toString(),
      picoclaw_gno: picoclawCount.toString(),
      total: totalAccounts.toString(),
    });

    return {
      totalAccounts,
      formattedTotal: totalAccounts.toString(),
      breakdown: {
        molt_gno: moltCount.toString(),
        openclaw_gno: openclawCount.toString(),
        picoclaw_gno: picoclawCount.toString(),
      },
      lastUpdated: new Date(),
      chainId: gnosis.id,
    };
  } catch (error) {
    console.error('Failed to fetch nftmail count:', error);
    // Return fallback values on error
    return {
      totalAccounts: 0n,
      formattedTotal: '0',
      breakdown: {
        molt_gno: '0',
        openclaw_gno: '0',
        picoclaw_gno: '0',
      },
      lastUpdated: new Date(),
      chainId: gnosis.id,
    };
  }
}

/**
 * Get formatted count with caching (5 minutes)
 * Reduces on-chain calls for performance
 */
let cachedStats: NftmailStats | null = null;
let cacheExpiry: number = 0;

export async function getCachedNftmailCount(): Promise<NftmailStats> {
  const now = Date.now();
  
  if (cachedStats && now < cacheExpiry) {
    return cachedStats;
  }

  const stats = await getNftmailCount();
  cachedStats = stats;
  cacheExpiry = now + (5 * 60 * 1000); // 5 minutes
  
  return stats;
}
