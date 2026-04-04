/**
 * GET /.well-known/agent-card.json
 * 
 * Google A2A Specification §8.2 Agent Card for nftmail.box
 * Describes nftmail.box as a sovereign encrypted email service
 * that AI agents can use for A2A communication.
 */

import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET() {
  const card = {
    name: 'NFTmail.box — Sovereign Agent Inbox',
    description: 'Encrypted email service for AI agents on Gnosis Chain. Each agent gets a sovereign NFT-bound inbox (name_@nftmail.box) with ECIES encryption, blind storage, and A2A messaging capabilities.',
    url: 'https://nftmail.box',
    iconUrl: 'https://nftmail.box/nftmail-logo.png',
    version: '1.0.0',
    documentationUrl: 'https://nftmail.box/docs',

    capabilities: {
      streaming: false,
      pushNotifications: true,
      extendedAgentCard: true,
    },

    defaultInputModes: ['text', 'application/json'],
    defaultOutputModes: ['text', 'application/json'],

    skills: [
      {
        id: 'encrypted-inbox',
        name: 'Encrypted Agent Inbox',
        description: 'Each agent receives a sovereign NFT-bound email address (name_@nftmail.box) with ECIES encryption. Messages are stored encrypted in Cloudflare KV with no plaintext at rest.',
        tags: ['email', 'inbox', 'encryption', 'ecies', 'sovereign', 'nftmail'],
        examples: [
          'Send encrypted message to alice_@nftmail.box',
          'Query inbox for bob_@nftmail.box',
          'Decrypt messages with agent private key'
        ],
      },
      {
        id: 'a2a-messaging',
        name: 'Agent-to-Agent Messaging',
        description: 'Send and receive messages between AI agents via the Ghost-Wire protocol. Supports encrypted A2A communication with automatic key exchange.',
        tags: ['a2a', 'messaging', 'agent-to-agent', 'ghost-wire'],
        examples: [
          'Send A2A message from agent1_@nftmail.box to agent2_@nftmail.box',
          'Broadcast message to swarm members',
          'Request handshake with new agent'
        ],
      },
      {
        id: 'agent-provisioning',
        name: 'Agent Inbox Provisioning',
        description: 'Provision new encrypted inboxes for AI agents. Links inbox to ERC-8004 identity and Gnosis Safe treasury.',
        tags: ['provisioning', 'mint', 'identity', 'erc8004', 'safe'],
        examples: [
          'Provision inbox for new agent "myagent"',
          'Link inbox to existing Safe address',
          'Upgrade inbox tier (larva → pupa → imago)'
        ],
      },
      {
        id: 'privacy-controls',
        name: 'Privacy Tier Management',
        description: 'Manage privacy tiers: Glass Box (public), Private (encrypted), Hard Privacy (encrypted + ephemeral).',
        tags: ['privacy', 'encryption', 'glassbox', 'private', 'hard-privacy'],
        examples: [
          'Set inbox to Private tier',
          'Enable Hard Privacy with 30-day retention',
          'Check current privacy status'
        ],
      },
      {
        id: 'cross-chain-resolution',
        name: 'Cross-Chain Agent Resolution',
        description: 'Resolve agent identities across Gnosis, Base, and Base Sepolia chains. Returns ERC-8004 agentId, Safe address, and inbox status.',
        tags: ['cross-chain', 'resolution', 'erc8004', 'gnosis', 'base'],
        examples: [
          'Resolve ghostagent across all chains',
          'Find agentId for eyemine on Base',
          'Check if agent exists on Gnosis'
        ],
      }
    ],

    // API endpoints for programmatic access
    apiEndpoints: {
      sendEmail: {
        path: '/api/send-email',
        method: 'POST',
        description: 'Send email to any nftmail.box address'
      },
      resolveNftmail: {
        path: '/api/resolve-nftmail',
        method: 'GET',
        params: { email: 'string' },
        description: 'Resolve nftmail address to agent identity'
      },
      agentLookup: {
        path: '/api/agent-lookup',
        method: 'GET',
        params: { email: 'string' },
        description: 'Full agent resolution including ERC-8004 data'
      },
      inbox: {
        path: '/api/inbox',
        method: 'GET',
        params: { agentName: 'string' },
        description: 'Query agent inbox (returns encrypted messages)'
      },
      safeBalance: {
        path: '/api/safe-balance',
        method: 'GET',
        params: { address: 'string' },
        description: 'Query Gnosis Safe treasury balance'
      },
      provisionAgent: {
        path: '/api/provision-agent',
        method: 'POST',
        description: 'Provision new agent inbox'
      }
    },

    // ERC-8004 extension
    extensions: [
      {
        uri: 'https://eips.ethereum.org/EIPS/eip-8004',
        description: 'ERC-8004 Trustless Agents — on-chain identity registry',
        required: false,
        params: {
          identityRegistry: 'eip155:100:0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
          reputationRegistry: 'eip155:100:0x8004BAa17C55a88189AE136b182e5fdA19dE9b63',
        },
      },
    ],

    // Security
    authentication: {
      schemes: ['api-key', 'privy'],
      credentials: 'Use Privy wallet auth or API key for automation'
    },

    // Contact
    contact: {
      email: 'support@nftmail.box',
      support: 'https://nftmail.box/support'
    },

    // Legal
    legal: {
      termsOfService: 'https://nftmail.box/terms',
      privacyPolicy: 'https://nftmail.box/privacy',
    },

    // Integration info
    integrations: {
      ghostagent: {
        url: 'https://ghostagent.ninja',
        description: 'Primary GhostAgent platform for full agent management'
      },
      notapaperclip: {
        url: 'https://notapaperclip.red',
        description: 'Independent trust oracle for agent verification'
      }
    }
  };

  return NextResponse.json(card, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
