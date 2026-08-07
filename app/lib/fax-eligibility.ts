import { createPublicClient, http, type Address, type Chain } from 'viem';
import { mainnet, base } from 'viem/chains';

const DELEGATE_REGISTRY_V2 = '0x00000000000000447e69651d841bD8D104Bed493';
const CHECK_DELEGATE_SELECTOR = '0xb9f36874';
const EMPTY_RIGHTS = '0000000000000000000000000000000000000000000000000000000000000000';

function padAddress(addr: string): string {
  return addr.toLowerCase().replace(/^0x/, '').padStart(64, '0');
}

function padUint256(val: string | bigint): string {
  return BigInt(val).toString(16).padStart(64, '0');
}

async function checkDelegateForERC721(
  hotWallet: string,
  vaultWallet: string,
  contract: string,
  tokenId: string | bigint,
  rpc: string | undefined,
): Promise<boolean> {
  try {
    const chain = rpc?.includes('base') ? base : mainnet;
    const client = createPublicClient({
      chain,
      transport: http(rpc),
    });
    const data = (CHECK_DELEGATE_SELECTOR +
      padAddress(hotWallet) +
      padAddress(vaultWallet) +
      padAddress(contract) +
      padUint256(tokenId) +
      EMPTY_RIGHTS) as `0x${string}`;
    const result = await client.call({ to: DELEGATE_REGISTRY_V2 as Address, data });
    return result.data !== undefined && result.data !== '0x' && BigInt(result.data) !== 0n;
  } catch {
    return false;
  }
}

/// Per-collection NFT gate for @fax senders.
///
/// If no collection is recognised and FAX_COLLECTION_CONTRACT is not set (or
/// is the zero address), the gate is open (Phase 1 behaviour). If a collection
/// is selected, the sender must either hold at least one token (mode=balance,
/// default) or own the specific token ID extracted from the mailbox label
/// (mode=owner).

const COLLECTIONS: Record<string, { contract: string; chain: Chain; rpc?: string; mode?: 'balance' | 'owner' }> = {
  chonk: { contract: '0x07152bfde079b5319e5308c43fb1dbc9c76cb4f9', chain: base, rpc: 'https://mainnet.base.org', mode: 'owner' },
  deadfellaz: { contract: '0x2acab3dea77832c09420663b0e1cb386031ba17b', chain: mainnet, rpc: 'https://ethereum-rpc.publicnode.com', mode: 'owner' },
  normie: { contract: '0x9eb6e2025b64f340691e424b7fe7022ffde12438', chain: mainnet, rpc: 'https://ethereum-rpc.publicnode.com', mode: 'owner' },
  pow: { contract: '0x9abb7bddc43fa67c76a62d8c016513827f59be1b', chain: mainnet, rpc: 'https://ethereum-rpc.publicnode.com', mode: 'owner' },
};

const FAX_COLLECTION_CONTRACT = (process.env.FAX_COLLECTION_CONTRACT || '').toLowerCase();
const FAX_COLLECTION_RPC = process.env.FAX_COLLECTION_RPC || 'https://ethereum-rpc.publicnode.com';
const FAX_ELIGIBILITY_MODE = process.env.FAX_ELIGIBILITY_MODE || 'balance';

function getConfig(collection?: string) {
  if (collection && COLLECTIONS[collection.toLowerCase()]) {
    const c = COLLECTIONS[collection.toLowerCase()];
    return { contract: c.contract.toLowerCase(), chain: c.chain, rpc: c.rpc, mode: c.mode };
  }
  return { contract: FAX_COLLECTION_CONTRACT, chain: mainnet, rpc: FAX_COLLECTION_RPC, mode: FAX_ELIGIBILITY_MODE };
}

const erc721Abi = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'ownerOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ name: '', type: 'address' }],
  },
] as const;

export interface EligibilityResult {
  eligible: boolean;
  reason?: string;
}

export async function isFaxEligible(
  ownerWallet: string,
  fromLabel: string,
  collection?: string,
  vaultWallet?: string,
  tokenId?: string,
  explicitMode?: 'balance' | 'owner',
): Promise<EligibilityResult> {
  const { contract, chain, rpc, mode } = getConfig(collection);
  const eligibilityMode = explicitMode ?? mode ?? FAX_ELIGIBILITY_MODE;
  const isGated = contract && !/^0x0{40}$/i.test(contract);
  if (!isGated) {
    return { eligible: true };
  }

  const client = createPublicClient({
    chain,
    transport: http(rpc),
  });

  const normalizedOwner = ownerWallet.toLowerCase();
  const normalizedVault = vaultWallet?.toLowerCase();

  try {
    const providedTokenId = tokenId ? BigInt(tokenId) : undefined;

    if (eligibilityMode === 'owner') {
      const derivedTokenId = extractTokenId(fromLabel);
      if (derivedTokenId == null) {
        return { eligible: false, reason: 'Could not determine the token ID for this mailbox label.' };
      }
      const owner = await client.readContract({
        address: contract as Address,
        abi: erc721Abi,
        functionName: 'ownerOf',
        args: [derivedTokenId],
      }) as string;
      if (owner.toLowerCase() === normalizedOwner) {
        return { eligible: true };
      }
      if (normalizedVault) {
        const delegated = await checkDelegateForERC721(normalizedOwner, normalizedVault, contract, derivedTokenId.toString(), rpc);
        if (delegated) return { eligible: true, reason: 'Eligible via delegation' };
      }
      return { eligible: false, reason: 'Wallet is not the owner or a delegate for this token.' };
    }

    // Default: balance check — any token from the collection grants eligibility.
    const balance = await client.readContract({
      address: contract as Address,
      abi: erc721Abi,
      functionName: 'balanceOf',
      args: [normalizedOwner as Address],
    }) as bigint;
    if (balance !== 0n) {
      return { eligible: true };
    }

    if (normalizedVault && providedTokenId != null) {
      const delegated = await checkDelegateForERC721(normalizedOwner, normalizedVault, contract, providedTokenId.toString(), rpc);
      if (delegated) return { eligible: true, reason: 'Eligible via delegation' };
    }

    return { eligible: false, reason: 'This fax is gated to holders of the configured NFT collection.' };
  } catch (err: unknown) {
    return { eligible: false, reason: err instanceof Error ? err.message : 'Eligibility check failed.' };
  }
}

function extractTokenId(label: string): bigint | null {
  const match = label.match(/(\d+)(?:[^\d]*$)/);
  if (!match) return null;
  const n = Number(match[1]);
  if (!Number.isFinite(n)) return null;
  return BigInt(n);
}
