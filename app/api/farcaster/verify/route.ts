import { NextRequest, NextResponse } from 'next/server';
import { verifyMessage } from 'viem';
import { mainnet } from 'viem/chains';

// Farcaster ID Registry contract on Ethereum mainnet
const ID_REGISTRY = '0x00000000fc6c5f01fc3015dc2e21353dd8f13a33';

// Verify SIWF message and extract user data
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, signature, nonce, domain } = body;

    if (!message || !signature) {
      return NextResponse.json(
        { error: 'Missing message or signature' },
        { status: 400 }
      );
    }

    // Parse the SIWF message
    // Format: "nftmail.box wants you to sign in with your Farcaster account..."
    const parsed = parseSignInMessage(message);
    
    if (!parsed) {
      return NextResponse.json(
        { error: 'Invalid sign-in message format' },
        { status: 400 }
      );
    }

    // Verify nonce matches
    if (nonce && parsed.nonce !== nonce) {
      return NextResponse.json(
        { error: 'Nonce mismatch' },
        { status: 401 }
      );
    }

    // Verify domain matches
    const requestDomain = domain || req.headers.get('host') || 'nftmail.box';
    if (parsed.domain !== requestDomain) {
      return NextResponse.json(
        { error: 'Domain mismatch' },
        { status: 401 }
      );
    }

    // Verify the signature against the custody address
    const isValid = await verifyMessage({
      address: parsed.custodyAddress as `0x${string}`,
      message,
      signature: signature as `0x${string}`,
    });

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      fid: parsed.fid,
      username: parsed.username,
      displayName: parsed.displayName,
      bio: parsed.bio,
      pfpUrl: parsed.pfpUrl,
      custodyAddress: parsed.custodyAddress,
    });
  } catch (error: any) {
    console.error('Farcaster verification error:', error);
    return NextResponse.json(
      { error: error?.message || 'Verification failed' },
      { status: 500 }
    );
  }
}

// Parse SIWF message format
function parseSignInMessage(message: string) {
  try {
    // Extract domain from first line
    const domainMatch = message.match(/^([\w.]+) wants you to sign in/);
    const domain = domainMatch?.[1];

    // Extract FID
    const fidMatch = message.match(/Farcaster ID: (\d+)/);
    const fid = fidMatch ? parseInt(fidMatch[1], 10) : undefined;

    // Extract custody address
    const custodyMatch = message.match(/Custody Address: (0x[a-fA-F0-9]{40})/);
    const custodyAddress = custodyMatch?.[1];

    // Extract nonce
    const nonceMatch = message.match(/Nonce: (\S+)/);
    const nonce = nonceMatch?.[1];

    // Extract expiration
    const expMatch = message.match(/Expiration Time: (.+)/);
    const expiration = expMatch?.[1];

    // Check if expired
    if (expiration) {
      const expTime = new Date(expiration).getTime();
      if (Date.now() > expTime) {
        return null;
      }
    }

    if (!domain || !fid || !custodyAddress) {
      return null;
    }

    return {
      domain,
      fid,
      custodyAddress,
      nonce,
      username: undefined, // Would need to fetch from Farcaster hub
      displayName: undefined,
      bio: undefined,
      pfpUrl: undefined,
    };
  } catch {
    return null;
  }
}
