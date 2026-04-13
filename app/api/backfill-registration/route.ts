import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http, keccak256, encodePacked, namehash } from 'viem';
import { gnosis } from 'viem/chains';

export const runtime = 'nodejs';

const GNS_REGISTRY = '0xA505e447474bd1774977510e7a7C9459DA79c4b9' as const;
const NFTMAIL_GNO_NAMEHASH = namehash('nftmail.gno');
const GNSRegistryABI = [
  {
    inputs: [{ internalType: 'bytes32', name: 'node', type: 'bytes32' }],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export async function POST(req: NextRequest) {
  try {
    const { label, owner } = await req.json() as { label?: string; owner?: string };

    if (!label || typeof label !== 'string') {
      return NextResponse.json({ error: 'Missing label' }, { status: 400 });
    }
    if (!owner || !/^0x[a-fA-F0-9]{40}$/.test(owner)) {
      return NextResponse.json({ error: 'Invalid owner address' }, { status: 400 });
    }

    const publicClient = createPublicClient({
      chain: gnosis,
      transport: http(process.env.NEXT_PUBLIC_GNOSIS_RPC || 'https://rpc.gnosischain.com'),
    });

    // Verify on-chain: label.nftmail.gno must be owned by the caller
    const labelhash = keccak256(encodePacked(['string'], [label]));
    const subnode = keccak256(encodePacked(['bytes32', 'bytes32'], [NFTMAIL_GNO_NAMEHASH, labelhash]));
    let onChainOwner: string;
    try {
      onChainOwner = await publicClient.readContract({
        address: GNS_REGISTRY,
        abi: GNSRegistryABI,
        functionName: 'owner',
        args: [subnode],
      });
    } catch {
      return NextResponse.json({ error: 'Could not verify on-chain ownership. Try again.' }, { status: 503 });
    }

    if (!onChainOwner || onChainOwner === '0x0000000000000000000000000000000000000000') {
      return NextResponse.json({ error: `${label}.nftmail.gno is not minted on-chain.` }, { status: 404 });
    }
    if (onChainOwner.toLowerCase() !== owner.toLowerCase()) {
      return NextResponse.json({ error: `${label}.nftmail.gno is owned by a different address.` }, { status: 403 });
    }

    const workerUrl = process.env.NFTMAIL_WORKER_URL || 'https://nftmail-email-worker.richard-159.workers.dev';
    const webhookSecret = process.env.NFTMAIL_WEBHOOK_SECRET || '';

    const kvRes = await fetch(workerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'registerSovereign',
        secret: webhookSecret,
        label,
        controller: owner,
        originNft: `${label}.nftmail.gno`,
        legacyIdentity: label,
        mintedTokenId: null,
        privacyTier: 'exposed',
      }),
    });
    const kvJson = await kvRes.json() as { status?: string; error?: string };

    if (kvRes.status === 409) {
      return NextResponse.json({ alreadyRegistered: true, message: `${label} is already registered in KV — check your dashboard.` });
    }
    if (!kvRes.ok) {
      return NextResponse.json({ error: kvJson.error || 'KV registration failed' }, { status: 502 });
    }

    return NextResponse.json({ success: true, label, email: `${label}@nftmail.box`, onChainOwner });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Backfill failed' }, { status: 500 });
  }
}
