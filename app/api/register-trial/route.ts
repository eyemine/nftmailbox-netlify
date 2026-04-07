import { NextRequest, NextResponse } from 'next/server';
import { generateWuTangName, generateClaimCode, isValidAgentName } from '../../../lib/wutang';

// ENS public client for collision checking
const ENS_PUBLIC_CLIENT = 'https://eth.llamarpc.com';

async function checkEnsName(name: string): Promise<boolean> {
  try {
    const response = await fetch(ENS_PUBLIC_CLIENT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_call',
        params: [{
          to: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e', // ENS Registry
          data: '0x02571be3' + namehash(name) // owner(bytes32) selector + namehash
        }, 'latest'],
        id: 1
      })
    });
    const result = await response.json();
    const address = result.result;
    return address !== '0x0000000000000000000000000000000000000000';
  } catch {
    return false; // Assume not taken if check fails
  }
}

// Simple namehash implementation for ENS check
function namehash(name: string): string {
  let node = '0x0000000000000000000000000000000000000000000000000000000000000000';
  const labels = name.split('.');
  for (let label of labels) {
    const labelHash = '0x' + Buffer.from(label.toLowerCase(), 'utf8').toString('hex').padStart(64, '0');
    node = '0x' + Buffer.from(node.slice(2) + labelHash.slice(2), 'hex').toString('hex').slice(-64);
  }
  return node;
}

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();
    
    // Generate name if not provided
    let agentName = name;
    let isGenerated = false;
    
    if (!agentName) {
      agentName = generateWuTangName();
      isGenerated = true;
    }
    
    // Validate format
    if (!isValidAgentName(agentName)) {
      return NextResponse.json(
        { error: 'Invalid name format. Use letters, numbers, dots, hyphens, and end with underscore for agents.' },
        { status: 400 }
      );
    }
    
    // Check ENS collision for manual names only
    if (!isGenerated) {
      const cleanName = agentName.replace(/_$/, ''); // Remove trailing underscore for ENS check
      const ensTaken = await checkEnsName(cleanName);
      if (ensTaken) {
        return NextResponse.json(
          { error: `Name ${cleanName}.eth is already registered on ENS. Choose another name.` },
          { status: 409 }
        );
      }
    }
    
    // Check if name already exists in KV
    const workerUrl = process.env.NFTMAIL_WORKER_URL || 'https://nftmail-email-worker.richard-159.workers.dev';
    const checkRes = await fetch(workerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'resolveAddress', name: agentName.replace(/_$/, '') })
    });
    
    if (checkRes.ok) {
      const existing = await checkRes.json();
      if (existing.exists) {
        return NextResponse.json(
          { error: `Address ${agentName}@nftmail.box already exists.` },
          { status: 409 }
        );
      }
    }
    
    // Generate claim code
    const claimCode = generateClaimCode();
    
    // Store trial in KV via worker
    const registerRes = await fetch(workerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'registerTrial',
        name: agentName,
        claimCode,
        status: 'trial',
        emailsSent: 0,
        registeredAt: Date.now()
      })
    });
    
    if (!registerRes.ok) {
      const error = await registerRes.text();
      return NextResponse.json(
        { error: 'Failed to register trial inbox. Please try again.', details: error },
        { status: 500 }
      );
    }
    
    const result = await registerRes.json();
    
    // Send welcome email with claim URL
    try {
      const mailgunApiKey = process.env.MAILGUN_API_KEY;
      const mailgunDomain = process.env.MAILGUN_DOMAIN || 'nftmail.box';
      const mailgunBase = process.env.MAILGUN_API_BASE || 'https://api.eu.mailgun.net/v3';
      
      if (mailgunApiKey) {
        const claimUrl = `https://nftmail.box/claim/${claimCode}`;
        const welcomeForm = new URLSearchParams();
        welcomeForm.set('from', `NFTMail <welcome@${mailgunDomain}>`);
        welcomeForm.set('to', `${agentName}@nftmail.box`);
        welcomeForm.set('subject', `Welcome to nftmail.box - your inbox is live`);
        welcomeForm.set('text', [
          `Hi ${agentName},`,
          ``,
          `Your NFTMail inbox is live: ${agentName}@nftmail.box`,
          ``,
          `Read inbox:   https://nftmail.box/inbox/${agentName}`,
          `Claim permanent address: ${claimUrl}`,
          ``,
          `Free tier includes:`,
          `  · Receive unlimited emails`,
          `  · Send up to 10 emails`,
          `  · 8-day message history`,
          `  · Up to 10 addresses per wallet`,
          ``,
          `After 10 emails, claim your permanent address to continue sending.`,
          ``,
          `To test delivery, reply to this email.`,
          ``,
          `---`,
          ``,
          `Trial Status: Active`,
          `Claim Code: ${claimCode}`,
          `Claim URL: ${claimUrl}`,
          `Expires: Never (your inbox is permanent)`,
          ``,
          `When ready to upgrade:`,
          `1. Visit ${claimUrl}`,
          `2. Connect your wallet`,
          `3. Mint your .nftmail.gno NFT`,
          `4. Your address becomes transferable and unlocks unlimited sending`,
          ``,
          `Learn more: https://ghostagent.ninja`,
          ``,
          `-- nftmail.box`,
        ].join('\n'));
        
        await fetch(`${mailgunBase}/${mailgunDomain}/messages`, {
          method: 'POST',
          headers: {
            Authorization: `Basic ${btoa(`api:${mailgunApiKey}`)}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: welcomeForm.toString(),
        });
      }
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      // Continue anyway - trial is created
    }
    
    return NextResponse.json({
      success: true,
      name: agentName,
      email: `${agentName}@nftmail.box`,
      claimCode,
      claimUrl: `https://nftmail.box/claim/${claimCode}`,
      status: 'trial',
      isGenerated,
      message: 'Trial inbox created. Check your email for the claim link.'
    });
    
  } catch (error) {
    console.error('Register trial error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
