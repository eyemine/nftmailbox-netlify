import { NextRequest, NextResponse } from 'next/server';
import { generatePoeticName, generateVariations, isPoeticName } from '@/app/services/poetic-names';

/**
 * Agent Discovery API
 * 
 * Allows autonomous AI agents to self-register with poetic names
 * when they discover the service via robots.txt or other means.
 * 
 * POST /api/agent/discover
 * Body: { type: "autonomous" | "human-assisted", source?: string }
 * 
 * Returns: { name, email, tier, apiKey, createdAt }
 */

// Simple in-memory rate limiting (replace with Redis in production)
const rateLimits = new Map<string, number>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 10; // 10 requests per hour per IP

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const count = rateLimits.get(ip) || 0;
  
  if (count >= RATE_LIMIT_MAX) {
    return false;
  }
  
  rateLimits.set(ip, count + 1);
  
  // Cleanup old entries periodically
  if (Math.random() < 0.01) {
    for (const [key, timestamp] of rateLimits.entries()) {
      if (now - timestamp > RATE_LIMIT_WINDOW) {
        rateLimits.delete(key);
      }
    }
  }
  
  return true;
}

// Mock database - replace with actual KV store
const createdAgents = new Set<string>();

function generateApiKey(): string {
  const prefix = 'nftm';
  const random = Buffer.from(Math.random().toString()).toString('base64url').slice(0, 32);
  return `${prefix}_${random}`;
}

const DEFAULT_DOMAIN = 'nftmail.box';

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Try again later.' },
        { status: 429 }
      );
    }
    
    const body = await request.json();
    const { type = 'autonomous', source } = body;
    
    // Check if user wants nftmail.box alias (Imago tier only)
    const requestedDomain = body.domain || DEFAULT_DOMAIN;
    let domain = DEFAULT_DOMAIN;
    let tier = body.tier || 'freemium';
    
    // Imago tier users can request nftmail.box as alias
    if (requestedDomain === 'nftmail.box' && tier !== 'imago') {
      return NextResponse.json(
        { error: 'nftmail.box requires Imago tier. Use ghostmail.box or upgrade to Imago.' },
        { status: 403 }
      );
    }
    
    if (requestedDomain === 'nftmail.box' && tier === 'imago') {
      domain = 'nftmail.box';
    }

    // Generate Wu-Tang name
    let name: string;
    let attempts = 0;
    const maxAttempts = 10;
    
    do {
      name = generatePoeticName(`${ip}-${Date.now()}-${attempts}`);
      attempts++;
    } while (createdAgents.has(name) && attempts < maxAttempts);
    
    // If primary name taken, try variations
    if (createdAgents.has(name)) {
      const variations = generateVariations(name);
      for (const variation of variations) {
        if (!createdAgents.has(variation)) {
          name = variation;
          break;
        }
      }
    }
    
    // Last resort: add timestamp
    if (createdAgents.has(name)) {
      name = `${name}-${Date.now().toString().slice(-4)}`;
    }
    
    // Mark as created
    createdAgents.add(name);
    
    // Generate API key
    const apiKey = generateApiKey();
    
    // Create agent record
    const agent = {
      name,
      email: `${name}@${domain}`,
      tier,
      apiKey,
      emailsRemaining: tier === 'imago' ? 1000 : tier === 'professional' ? 500 : 100,
      storageDays: tier === 'imago' ? 365 : tier === 'professional' ? 30 : 8,
      createdAt: new Date().toISOString(),
      source: source || 'api',
      type: type || 'autonomous',
      ip: ip === 'unknown' ? undefined : ip,
      canMolt: tier === 'imago',
    };
    
    // TODO: Persist to KV store (Cloudflare Workers KV)
    // await kv.put(`agent:${name}`, JSON.stringify(agent));
    
    console.log(`[Agent Discovery] Created agent: ${name} (${type}) from ${source || 'api'}`);
    
    return NextResponse.json(agent, { status: 201 });
    
  } catch (error) {
    console.error('[Agent Discovery] Error:', error);
    return NextResponse.json(
      { error: 'Failed to create agent' },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint for agents to check their status
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');
  const apiKey = request.headers.get('x-api-key');
  
  if (!name) {
    return NextResponse.json(
      { error: 'Agent name required' },
      { status: 400 }
    );
  }
  
  // TODO: Look up agent in KV store
  // const agent = await kv.get(`agent:${name}`);
  
  // For now, return mock status
  if (createdAgents.has(name)) {
    return NextResponse.json({
      name,
      email: `${name}@nftmail.box`,
      tier: 'freemium',
      emailsRemaining: 100,
      storageDays: 8,
      active: true,
    });
  }
  
  return NextResponse.json(
    { error: 'Agent not found' },
    { status: 404 }
  );
}

export const runtime = 'edge';
