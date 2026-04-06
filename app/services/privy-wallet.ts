/**
 * Privy Server Wallet Service for NFTMail Agents
 * 
 * Bridges npx/curl agents → GhostAgent.ninja ecosystem
 * Creates embedded wallets for agents that can sign transactions
 */

import { SecurityTier } from './security-tier';

const PRIVY_API_URL = 'https://auth.privy.io/api/v1';

export interface AgentWallet {
  address: string;
  chainType: 'ethereum';
  createdAt: string;
  agentId: string;
  tier: SecurityTier;
}

export interface WalletSignature {
  signature: string;
  address: string;
  timestamp: number;
}

class PrivyServerWallet {
  private appId: string;
  private appSecret: string;

  constructor(config: { appId: string; appSecret: string }) {
    this.appId = config.appId;
    this.appSecret = config.appSecret;
  }

  /**
   * Create a server-side wallet for an agent
   * Call this when user upgrades to 'privy' tier
   */
  async createAgentWallet(agentId: string): Promise<AgentWallet> {
    const response = await fetch(`${PRIVY_API_URL}/wallets`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${this.appId}:${this.appSecret}`)}`,
        'Content-Type': 'application/json',
        'privy-app-id': this.appId,
      },
      body: JSON.stringify({
        chain_type: 'ethereum',
        // Link to agent identity
        custom_metadata: {
          agentId,
          source: 'nftmail-agent',
          created_via: 'npx-install',
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to create agent wallet: ${error}`);
    }

    const data = await response.json();
    
    return {
      address: data.address,
      chainType: 'ethereum',
      createdAt: new Date().toISOString(),
      agentId,
      tier: 'privy',
    };
  }

  /**
   * Sign a message with the agent's wallet
   * Used for GhostAgent HITL module interactions
   */
  async signMessage(walletAddress: string, message: string): Promise<WalletSignature> {
    const response = await fetch(`${PRIVY_API_URL}/wallets/${walletAddress}/rpc`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${this.appId}:${this.appSecret}`)}`,
        'Content-Type': 'application/json',
        'privy-app-id': this.appId,
      },
      body: JSON.stringify({
        method: 'personal_sign',
        params: [
          message,
          walletAddress,
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to sign message: ${await response.text()}`);
    }

    const data = await response.json();
    
    return {
      signature: data.data.signature,
      address: walletAddress,
      timestamp: Date.now(),
    };
  }

  /**
   * Sign a transaction for on-chain interactions
   * Used for ERC-8004 registrations, attestations, etc.
   */
  async signTransaction(
    walletAddress: string,
    transaction: {
      to: string;
      value?: string;
      data?: string;
      chainId: number;
    }
  ): Promise<{ signedTransaction: string }> {
    const response = await fetch(`${PRIVY_API_URL}/wallets/${walletAddress}/rpc`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${this.appId}:${this.appSecret}`)}`,
        'Content-Type': 'application/json',
        'privy-app-id': this.appId,
      },
      body: JSON.stringify({
        method: 'eth_signTransaction',
        params: [{
          from: walletAddress,
          to: transaction.to,
          value: transaction.value || '0x0',
          data: transaction.data || '0x',
          chainId: transaction.chainId,
        }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to sign transaction: ${await response.text()}`);
    }

    const data = await response.json();
    return { signedTransaction: data.data.signed_transaction };
  }

  /**
   * Get wallet details
   */
  async getWallet(walletAddress: string): Promise<AgentWallet | null> {
    const response = await fetch(`${PRIVY_API_URL}/wallets/${walletAddress}`, {
      headers: {
        'Authorization': `Basic ${btoa(`${this.appId}:${this.appSecret}`)}`,
        'privy-app-id': this.appId,
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return {
      address: data.address,
      chainType: data.chain_type,
      createdAt: data.created_at,
      agentId: data.custom_metadata?.agentId || '',
      tier: 'privy',
    };
  }

  /**
   * Verify a signature from an agent wallet
   */
  async verifySignature(
    walletAddress: string,
    message: string,
    signature: string
  ): Promise<boolean> {
    // Use viem or ethers to verify
    // Simplified: actual verification would use recoverAddress
    try {
      const response = await fetch(`${PRIVY_API_URL}/wallets/verify`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${this.appId}:${this.appSecret}`)}`,
          'Content-Type': 'application/json',
          'privy-app-id': this.appId,
        },
        body: JSON.stringify({
          message,
          signature,
          address: walletAddress,
        }),
      });
      
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Export singleton factory
export function createPrivyWalletService(): PrivyServerWallet {
  const appId = process.env.PRIVY_APP_ID;
  const appSecret = process.env.PRIVY_APP_SECRET;
  
  if (!appId || !appSecret) {
    throw new Error('PRIVY_APP_ID and PRIVY_APP_SECRET required');
  }
  
  return new PrivyServerWallet({ appId, appSecret });
}

export type { PrivyServerWallet };
export default { createPrivyWalletService };
