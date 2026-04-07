import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { claimCode, walletAddress } = await request.json();
    
    if (!claimCode || !walletAddress) {
      return NextResponse.json(
        { error: 'Missing claimCode or walletAddress' },
        { status: 400 }
      );
    }

    // Validate wallet address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return NextResponse.json(
        { error: 'Invalid wallet address format' },
        { status: 400 }
      );
    }

    // Verify claim code and get inbox name
    const workerUrl = process.env.NFTMAIL_WORKER_URL || 'https://nftmail-email-worker.richard-159.workers.dev';
    
    // First verify the claim
    const verifyRes = await fetch(workerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'verifyClaim', claimCode })
    });

    if (!verifyRes.ok) {
      return NextResponse.json(
        { error: 'Invalid or expired claim code' },
        { status: 400 }
      );
    }

    const verifyData = await verifyRes.json();
    
    if (verifyData.claimed) {
      return NextResponse.json(
        { error: 'This inbox has already been claimed' },
        { status: 409 }
      );
    }

    const inboxName = verifyData.name;
    if (!inboxName) {
      return NextResponse.json(
        { error: 'Claim code not found' },
        { status: 404 }
      );
    }

    // Call gasless-mint to create the NFT
    const mintRes = await fetch('/api/gasless-mint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: inboxName,
        owner: walletAddress,
        skipWelcomeEmail: true // Skip welcome email since trial already sent one
      })
    });

    if (!mintRes.ok) {
      const mintError = await mintRes.json();
      return NextResponse.json(
        { error: mintError.error || 'Failed to mint NFT' },
        { status: 500 }
      );
    }

    const mintData = await mintRes.json();

    // Mark claim as used in worker
    const claimRes = await fetch(workerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        action: 'markClaimUsed',
        claimCode,
        walletAddress,
        mintData: {
          txHash: mintData.txHash,
          tbaAddress: mintData.tbaAddress,
          label: mintData.label
        }
      })
    });

    if (!claimRes.ok) {
      console.error('Failed to mark claim as used:', await claimRes.text());
      // Continue anyway - NFT was minted successfully
    }

    return NextResponse.json({
      success: true,
      inboxName,
      email: `${inboxName}@nftmail.box`,
      nft: `${inboxName}.nftmail.gno`,
      txHash: mintData.txHash,
      tbaAddress: mintData.tbaAddress,
      tokenId: mintData.tokenId,
      message: 'Identity minted successfully'
    });

  } catch (error) {
    console.error('Claim inbox error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
