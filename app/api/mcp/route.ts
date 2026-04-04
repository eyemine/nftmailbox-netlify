/**
 * MCP Server for NFTmail.box
 * 
 * Model Context Protocol (MCP) implementation for the sovereign
 * encrypted email service. Allows AI agents to programmatically
 * interact with nftmail.box inboxes.
 * 
 * Endpoint: /api/mcp
 */

import { NextRequest, NextResponse } from 'next/server';

const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL ?? 'https://nftmail-email-worker.richard-159.workers.dev';

// MCP Tool Definitions
const MCP_TOOLS = [
  {
    name: 'send_encrypted_email',
    description: 'Send encrypted email to any nftmail.box address. Supports agent-to-agent messaging with automatic ECIES encryption.',
    inputSchema: {
      type: 'object',
      properties: {
        to: { type: 'string', description: 'Recipient email (e.g., alice_@nftmail.box)' },
        from: { type: 'string', description: 'Sender email or identifier' },
        subject: { type: 'string', description: 'Email subject' },
        body: { type: 'string', description: 'Email body (plaintext or HTML)' },
        encrypt: { type: 'boolean', description: 'Enable encryption (default: true)' }
      },
      required: ['to', 'from', 'subject', 'body']
    }
  },
  {
    name: 'query_inbox',
    description: 'Query encrypted inbox for messages. Returns metadata; decryption requires agent private key.',
    inputSchema: {
      type: 'object',
      properties: {
        agentName: { type: 'string', description: 'Agent name (without _ suffix)' },
        limit: { type: 'number', description: 'Max messages (default: 20)' },
        unreadOnly: { type: 'boolean', description: 'Only unread messages' }
      },
      required: ['agentName']
    }
  },
  {
    name: 'resolve_email',
    description: 'Resolve nftmail email to full agent identity including ERC-8004 data.',
    inputSchema: {
      type: 'object',
      properties: {
        email: { type: 'string', description: 'Email address (e.g., ghostagent_@nftmail.box)' }
      },
      required: ['email']
    }
  },
  {
    name: 'check_privacy_status',
    description: 'Check privacy tier (Glass Box / Private / Hard Privacy) for an agent inbox.',
    inputSchema: {
      type: 'object',
      properties: {
        agentName: { type: 'string', description: 'Agent name' }
      },
      required: ['agentName']
    }
  },
  {
    name: 'provision_inbox',
    description: 'Provision new encrypted inbox for an agent. Requires ownership proof.',
    inputSchema: {
      type: 'object',
      properties: {
        agentName: { type: 'string', description: 'Desired agent name' },
        ownerAddress: { type: 'string', description: 'Ethereum wallet address' },
        tld: { type: 'string', description: 'TLD: nftmail.gno, molt.gno, etc.' }
      },
      required: ['agentName', 'ownerAddress']
    }
  },
  {
    name: 'upgrade_tier',
    description: 'Upgrade inbox tier (larva → pupa → imago) for longer retention and features.',
    inputSchema: {
      type: 'object',
      properties: {
        agentName: { type: 'string', description: 'Agent name' },
        targetTier: { type: 'string', enum: ['pupa', 'imago'], description: 'Target tier' },
        paymentTxHash: { type: 'string', description: 'xDAI payment transaction hash' }
      },
      required: ['agentName', 'targetTier', 'paymentTxHash']
    }
  }
];

// Tool implementations
async function callWorker(action: string, params: Record<string, unknown>) {
  const res = await fetch(WORKER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, ...params })
  });
  return res.json();
}

async function sendEmail(params: any) {
  // Use the worker's sendA2A or direct email action
  return callWorker('sendEmail', params);
}

async function queryInbox(agentName: string, limit = 20, unreadOnly = false) {
  return callWorker('getInbox', { 
    localPart: agentName + '_',
    limit,
    unreadOnly 
  });
}

async function resolveEmail(email: string) {
  return callWorker('resolveEmail', { email });
}

async function checkPrivacyStatus(agentName: string) {
  return callWorker('getPrivacyStatus', { localPart: agentName + '_' });
}

// GET endpoint - Server info
export async function GET() {
  return NextResponse.json({
    protocolVersion: '2024-11-05',
    capabilities: { tools: {} },
    serverInfo: {
      name: 'nftmail-mcp',
      version: '1.0.0',
      description: 'NFTmail.box MCP Server - Sovereign Encrypted Email'
    },
    tools: MCP_TOOLS,
    endpoints: { jsonrpc: '/api/mcp' }
  });
}

// POST endpoint - JSON-RPC
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jsonrpc, id, method, params } = body;

    if (jsonrpc !== '2.0') {
      return NextResponse.json({ 
        jsonrpc: '2.0', 
        id, 
        error: { code: -32600, message: 'Invalid Request' } 
      }, { status: 400 });
    }

    let result;

    switch (method) {
      case 'tools/list':
        result = { tools: MCP_TOOLS };
        break;

      case 'tools/call':
        const { name, arguments: args } = params;
        
        switch (name) {
          case 'send_encrypted_email':
            result = await sendEmail(args);
            break;
          case 'query_inbox':
            result = await queryInbox(args.agentName, args.limit, args.unreadOnly);
            break;
          case 'resolve_email':
            result = await resolveEmail(args.email);
            break;
          case 'check_privacy_status':
            result = await checkPrivacyStatus(args.agentName);
            break;
          case 'provision_inbox':
          case 'upgrade_tier':
            result = { 
              status: 'pending', 
              message: `${name} requires authentication. Use dashboard or API with proper credentials.`,
              documentation: 'https://nftmail.box/docs'
            };
            break;
          default:
            return NextResponse.json({ 
              jsonrpc: '2.0', 
              id, 
              error: { code: -32601, message: `Unknown tool: ${name}` } 
            }, { status: 400 });
        }
        break;

      case 'initialize':
        result = {
          protocolVersion: '2024-11-05',
          capabilities: { tools: {} },
          serverInfo: {
            name: 'nftmail-mcp',
            version: '1.0.0',
            description: 'NFTmail.box MCP Server'
          }
        };
        break;

      default:
        return NextResponse.json({ 
          jsonrpc: '2.0', 
          id, 
          error: { code: -32601, message: `Method not found: ${method}` } 
        }, { status: 400 });
    }

    return NextResponse.json({ jsonrpc: '2.0', id, result });

  } catch (e: any) {
    return NextResponse.json({ 
      jsonrpc: '2.0', 
      id: null, 
      error: { code: -32700, message: e?.message || 'Parse error' } 
    }, { status: 400 });
  }
}
