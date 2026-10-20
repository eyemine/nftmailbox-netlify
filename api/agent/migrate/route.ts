/**
 * Agent Security Migration API
 * 
 * Endpoints:
 * - POST /api/agent/migrate: Upgrade security tier (API key → HMAC → Privy wallet)
 * - POST /api/agent/verify: Verify HMAC/Privy signature
 */

import { NextRequest, NextResponse } from 'next/server';
import { createPrivyWalletService, AgentWallet } from '@/app/services/privy-wallet';
import { 
  SecurityTier, 
  SecurityConfig, 
  generateApiSecret,
  verifySignature 
} from '@/app/services/security-tier';

// TODO: Replace with KV store
const agentSecurity = new Map<string, SecurityConfig>();
const agentWallets = new Map<string, AgentWallet>();

/**
 * POST /api/agent/migrate
 * Upgrade agent security tier
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      apiKey, 
      targetTier, 
      agentId 
    } = body;

    // Verify current API key
    const currentConfig = agentSecurity.get(agentId);
    if (!currentConfig || currentConfig.apiKey !== apiKey) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }

    switch (targetTier) {
      case 'hmac':
        return migrateToHmac(agentId, currentConfig);
      
      case 'privy':
        return migrateToPrivy(agentId, currentConfig);
      
      default:
        return NextResponse.json(
          { error: 'Invalid target tier. Use: hmac, privy' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('[Agent Migration Error]', error);
    return NextResponse.json(
      { error: 'Migration failed' },
      { status: 500 }
    );
  }
}

async function migrateToHmac(agentId: string, currentConfig: SecurityConfig) {
  // Generate HMAC secret
  const apiSecret = await generateApiSecret();
  
  // Update config
  const newConfig: SecurityConfig = {
    tier: 'hmac',
    apiKey: currentConfig.apiKey, // Keep for backward compat during transition
    apiSecret,
    createdAt: new Date().toISOString(),
  };
  
  agentSecurity.set(agentId, newConfig);
  
  return NextResponse.json({
    success: true,
    tier: 'hmac',
    message: 'Upgraded to HMAC signing',
    instructions: {
      config: {
        apiKey: currentConfig.apiKey,
        apiSecret,
        tier: 'hmac',
      },
      usage: {
        headers: {
          'X-API-Key': currentConfig.apiKey,
          'X-Timestamp': '<unix-timestamp>',
          'X-Signature': '<hmac-sha256-signature>',
        },
        signing: 'HMAC-SHA256(timestamp + method + path + body)',
      },
    },
  });
}

async function migrateToPrivy(agentId: string, currentConfig: SecurityConfig) {
  try {
    const privy = createPrivyWalletService();
    
    // Create server wallet for agent
    const wallet = await privy.createAgentWallet(agentId);
    
    // Store wallet info
    agentWallets.set(agentId, wallet);
    
    // Update security config
    const newConfig: SecurityConfig = {
      tier: 'privy',
      apiKey: currentConfig.apiKey, // Keep during transition
      walletAddress: wallet.address,
      createdAt: new Date().toISOString(),
    };
    
    agentSecurity.set(agentId, newConfig);
    
    return NextResponse.json({
      success: true,
      tier: 'privy',
      message: 'Migrated to Privy server wallet',
      wallet: {
        address: wallet.address,
        chainType: wallet.chainType,
      },
      instructions: {
        ghostagent: {
          dashboard: `https://ghostagent.ninja/dashboard/agents/${agentId}`,
          capabilities: [
            'ERC-8004 identity registration',
            'Cross-chain attestations',
            'HITL module interactions',
            'On-chain email verification',
          ],
        },
        signing: {
          method: 'POST /api/agent/sign',
          headers: {
            'X-API-Key': currentConfig.apiKey,
            'X-Wallet-Address': wallet.address,
          },
        },
      },
      // Revoke old API key after 7 days (grace period)
      gracePeriod: '7 days',
    });
  } catch (error) {
    console.error('[Privy Migration Error]', error);
    return NextResponse.json(
      { error: 'Failed to create Privy wallet. Check PRIVY_APP_ID and PRIVY_APP_SECRET.' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/agent/security
 * Check current security tier
 */
export async function GET(request: NextRequest) {
  const apiKey = request.headers.get('X-API-Key');
  const agentId = request.nextUrl.searchParams.get('agentId');
  
  if (!apiKey || !agentId) {
    return NextResponse.json(
      { error: 'X-API-Key header and agentId required' },
      { status: 400 }
    );
  }
  
  const config = agentSecurity.get(agentId);
  if (!config || config.apiKey !== apiKey) {
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  }
  
  return NextResponse.json({
    agentId,
    tier: config.tier,
    walletAddress: config.walletAddress,
    createdAt: config.createdAt,
    upgradeAvailable: config.tier !== 'privy',
  });
}

