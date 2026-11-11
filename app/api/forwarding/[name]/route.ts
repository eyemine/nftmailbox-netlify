/// API endpoint for managing email forwarding settings
/// GET: Get current forwarding configuration
/// POST: Update forwarding configuration

import { NextRequest, NextResponse } from 'next/server';
import { requireVerifiedWallet } from '@/app/lib/wallet-auth';

const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL || 'https://worker.nftmail.box';

const WORKER_SECRET = process.env.WORKER_SECRET || '';
interface ForwardingConfig {
  enabled: boolean;
  targetEmail: string;
  level: 'imago' | 'ghost';
}

export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    const agentName = params.name.toLowerCase();

    // Forwarding config leaks the owner's target address — owner-only.
    const walletParam = request.nextUrl.searchParams.get('wallet') || undefined;
    const auth = await requireVerifiedWallet(request, walletParam, {
      signature: request.nextUrl.searchParams.get('signature') || undefined,
      signedAt: request.nextUrl.searchParams.get('signedAt') || undefined,
    });
    if ('res' in auth) return auth.res;

    const resolveRes = await fetch(`${WORKER_URL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Worker-Secret': WORKER_SECRET },
      body: JSON.stringify({ action: 'resolveAddress', name: agentName, domain: 'nftmail.box' }),
    });
    const resolved = resolveRes.ok ? (await resolveRes.json()) as Record<string, unknown> : null;
    const controller = (resolved?.onChainOwner as string | undefined)?.toLowerCase();
    if (!resolved?.exists || !controller || controller !== auth.wallet) {
      return NextResponse.json({ error: 'Not authorized for this mailbox' }, { status: 403 });
    }

    const workerResponse = await fetch(`${WORKER_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 'X-Worker-Secret': WORKER_SECRET,
        'Authorization': `Bearer ${process.env.WEBHOOK_SECRET || ''}`
      },
      body: JSON.stringify({
        action: 'getForwarding',
        agentName
      })
    });

    if (!workerResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch forwarding settings' }, { status: 500 });
    }

    const data = await workerResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch forwarding settings:', error);
    return NextResponse.json({ error: 'Failed to fetch forwarding settings' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    const agentName = params.name.toLowerCase();
    const body = await request.json() as ForwardingConfig & {
      ownerAddress?: string;
      signature?: string;
      signedAt?: number;
      statement?: string;
    };

    if (!body.ownerAddress) {
      return NextResponse.json({ error: 'Owner address required for security verification' }, { status: 400 });
    }
    if (!body.signature || !body.statement || !body.signedAt) {
      return NextResponse.json({ error: 'Signed authorization required (signature, statement, signedAt)' }, { status: 400 });
    }

    const workerResponse = await fetch(`${WORKER_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 'X-Worker-Secret': WORKER_SECRET,
        'Authorization': `Bearer ${process.env.WEBHOOK_SECRET || ''}`
      },
      body: JSON.stringify({
        action: 'setForwarding',
        agentName,
        config: {
          enabled: body.enabled,
          targetEmail: body.targetEmail,
          level: body.level,
          // Authorization bundle — owner's signed statement is the credential.
          signature: body.signature,
          signedAt: body.signedAt,
          statement: body.statement,
          signatureVersion: 1,
        },
        ownerAddress: body.ownerAddress
      })
    });

    if (!workerResponse.ok) {
      const workerBody = await workerResponse.text().catch(() => '');
      console.error('Worker setForwarding failed:', workerResponse.status, workerBody);
      return NextResponse.json(
        { error: `Worker error ${workerResponse.status}: ${workerBody.slice(0, 200)}` },
        { status: 502 }
      );
    }

    const data = await workerResponse.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Failed to save forwarding settings:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to save forwarding settings' },
      { status: 500 }
    );
  }
}
