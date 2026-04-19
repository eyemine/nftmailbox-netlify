/// API endpoint for managing email forwarding settings
/// GET: Get current forwarding configuration
/// POST: Update forwarding configuration

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL || 'https://nftmail-email-worker.richard-159.workers.dev';

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
    
    const workerResponse = await fetch(`${WORKER_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
    const body = await request.json() as ForwardingConfig & { ownerAddress?: string };
    
    if (!body.ownerAddress) {
      return NextResponse.json({ error: 'Owner address required for security verification' }, { status: 400 });
    }
    
    const workerResponse = await fetch(`${WORKER_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.WEBHOOK_SECRET || ''}`
      },
      body: JSON.stringify({
        action: 'setForwarding',
        agentName,
        config: body,
        ownerAddress: body.ownerAddress
      })
    });

    if (!workerResponse.ok) {
      return NextResponse.json({ error: 'Failed to save forwarding settings' }, { status: 500 });
    }

    const data = await workerResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to save forwarding settings:', error);
    return NextResponse.json({ error: 'Failed to save forwarding settings' }, { status: 500 });
  }
}
