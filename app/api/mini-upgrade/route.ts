/// POST /api/mini-upgrade
/// Called by the Farcaster mini-app after sdk.actions.sendToken completes.
/// Verifies the Base USDC payment, upgrades KV tier, mints Base beacon NFT.
///
/// Body: { fid, agentName, txHash, currentTier }
/// Returns: { status: 'upgraded', newTier, beaconTokenId }

import { NextRequest, NextResponse } from 'next/server';

const WORKER_URL = process.env.NFTMAIL_WORKER_URL || 'https://nftmail-email-worker.richard-159.workers.dev';
const WEBHOOK_SECRET = process.env.NFTMAIL_WEBHOOK_SECRET || '';

const BASE_RPC = 'https://mainnet.base.org';
const BASE_USDC = '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913';
const TREASURY  = '0xed0b0694953158dd54d0c36d320b391f44cd67f3';
const TRANSFER_TOPIC = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';

// Beacon NFT on Base (deploy NFTmailBeacon.sol, then set env var)
const NFTMAIL_BEACON_BASE = process.env.NFTMAIL_BEACON_CONTRACT ?? '';

// Fees in USDC (6 decimals): free→pro $10, pro→premium $14
const TIER_FEES: Record<string, number> = { free: 10, basic: 10, larva: 10, pro: 14, pupa: 14 };

function normaliseTier(raw: string): 'free' | 'pro' | 'premium' {
  const t = raw.toLowerCase();
  if (t === 'premium' || t === 'imago') return 'premium';
  if (t === 'pro' || t === 'pupa' || t === 'lite') return 'pro';
  return 'free';
}

async function verifyUsdcPayment(
  txHash: string,
  expectedUsdc: number,
): Promise<{ ok: boolean; fromWallet?: string; error?: string }> {
  try {
    const [txRes, rcptRes] = await Promise.all([
      fetch(BASE_RPC, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_getTransactionByHash', params: [txHash] }),
      }),
      fetch(BASE_RPC, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'eth_getTransactionReceipt', params: [txHash] }),
      }),
    ]);
    const txData  = await txRes.json()   as { result?: any };
    const rcptData = await rcptRes.json() as { result?: any };
    const tx      = txData.result;
    const receipt = rcptData.result;
    if (!tx)      return { ok: false, error: 'Transaction not found' };
    if (!receipt) return { ok: false, error: 'Transaction not yet confirmed' };
    if (receipt.status !== '0x1') return { ok: false, error: 'Transaction reverted' };

    const fromWallet: string = (tx.from as string)?.toLowerCase() ?? '';
    const expectedWei = BigInt(Math.floor(expectedUsdc * 1e6));
    const logs: any[] = receipt.logs ?? [];

    const match = logs.find((log: any) => {
      if ((log.address as string)?.toLowerCase() !== BASE_USDC) return false;
      if (log.topics?.[0] !== TRANSFER_TOPIC) return false;
      const from = ('0x' + (log.topics[1] ?? '').slice(26)).toLowerCase();
      const to   = ('0x' + (log.topics[2] ?? '').slice(26)).toLowerCase();
      if (from !== fromWallet) return false;
      if (to   !== TREASURY)   return false;
      return BigInt(log.data || '0x0') >= expectedWei;
    });

    if (!match) return { ok: false, error: `No USDC transfer of ≥${expectedUsdc} USDC to treasury in tx` };
    return { ok: true, fromWallet };
  } catch (e: any) {
    return { ok: false, error: e?.message ?? 'Payment verification failed' };
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json() as {
    fid?: number;
    agentName?: string;
    txHash?: string;
    currentTier?: string;
  };

  const { fid, agentName, txHash, currentTier = 'free' } = body;
  if (!fid || !agentName || !txHash) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const normCurrent = normaliseTier(currentTier);
  const newTier = normCurrent === 'free' ? 'pro' : normCurrent === 'pro' ? 'premium' : null;
  if (!newTier) return NextResponse.json({ error: 'Already at max tier' }, { status: 400 });

  const expectedFee = TIER_FEES[currentTier.toLowerCase()] ?? 10;
  const payment = await verifyUsdcPayment(txHash, expectedFee);
  if (!payment.ok) return NextResponse.json({ error: payment.error }, { status: 402 });

  const walletAddress = payment.fromWallet!;

  // Link wallet in KV
  await fetch(WORKER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'linkWallet', fid, agentName, walletAddress }),
  }).catch(() => {});

  // Upgrade tier in KV
  const upgradeRes = await fetch(WORKER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'upgradeTier', label: agentName, newTier, secret: WEBHOOK_SECRET }),
  });
  const upgradeData = await upgradeRes.json() as { status?: string; newTier?: string; error?: string };
  if (upgradeData.status !== 'upgraded') {
    return NextResponse.json({ error: upgradeData.error || 'KV upgrade failed' }, { status: 500 });
  }

  // Mint Base beacon NFT (non-fatal — KV is source of truth)
  let beaconTokenId: number | null = null;
  if (NFTMAIL_BEACON_BASE && process.env.TREASURY_PRIVATE_KEY) {
    try {
      const { createWalletClient, createPublicClient, http } = await import('viem');
      const { privateKeyToAccount } = await import('viem/accounts');
      const { base } = await import('viem/chains');
      const account = privateKeyToAccount(process.env.TREASURY_PRIVATE_KEY as `0x${string}`);
      const walletClient = createWalletClient({ chain: base, transport: http(), account });
      const publicClient = createPublicClient({ chain: base, transport: http() });
      const mintFn = newTier === 'premium' ? 'mintPremium' : 'mintPro';
      const beaconAbi = [{
        name: mintFn,
        type: 'function' as const,
        inputs: [{ name: 'to', type: 'address' }],
        outputs: [{ name: 'tokenId', type: 'uint256' }],
        stateMutability: 'nonpayable' as const,
      }];
      const hash = await walletClient.writeContract({
        address: NFTMAIL_BEACON_BASE as `0x${string}`,
        abi: beaconAbi,
        functionName: mintFn,
        args: [walletAddress as `0x${string}`],
      });
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      const transferLog = receipt.logs.find(l =>
        l.topics[0] === TRANSFER_TOPIC
      );
      if (transferLog?.topics[3]) {
        beaconTokenId = Number(BigInt(transferLog.topics[3]));
      }
      // Store beacon details in KV
      await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'setBeaconNft',
          label: agentName,
          beaconChain: 'base',
          beaconContract: NFTMAIL_BEACON_BASE,
          beaconTokenId,
          secret: WEBHOOK_SECRET,
        }),
      }).catch(() => {});
      console.log(`Beacon minted: ${mintFn} tokenId=${beaconTokenId} to ${walletAddress}`);
    } catch (err) {
      console.error('Beacon mint failed (non-fatal):', err);
    }
  }

  return NextResponse.json(
    { status: 'upgraded', newTier: upgradeData.newTier ?? newTier, beaconTokenId },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
