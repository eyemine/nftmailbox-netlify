import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Generate a random nonce for SIWF
export async function GET(req: NextRequest) {
  try {
    // Generate 32-byte random nonce
    const nonce = crypto.randomBytes(32).toString('hex');
    
    // In production, store nonce in KV/cache with TTL (5 minutes)
    // For now, we rely on the client sending it back for verification
    
    return NextResponse.json({ nonce });
  } catch (error) {
    console.error('Failed to generate nonce:', error);
    return NextResponse.json(
      { error: 'Failed to generate nonce' },
      { status: 500 }
    );
  }
}
