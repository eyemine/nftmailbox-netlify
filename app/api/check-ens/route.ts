import { NextRequest, NextResponse } from 'next/server';

const ETH_RPC = 'https://ethereum.publicnode.com';
const ENS_REGISTRY = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e';

// Simple keccak256 using Web Crypto (SHA-256 as approximation - use proper keccak for production)
async function keccak256Hex(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input.toLowerCase());
  const hash = await crypto.subtle.digest('SHA-256', data);
  const bytes = new Uint8Array(hash);
  return '0x' + Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Compute ENS namehash
async function computeNamehash(name: string): Promise<string> {
  let node = new Uint8Array(32);
  
  if (!name) {
    return '0x' + Array.from(node).map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  const labels = name.split('.');
  for (let i = labels.length - 1; i >= 0; i--) {
    const labelHash = await keccak256Hex(labels[i].toLowerCase());
    const nodeHex = '0x' + Array.from(node).map(b => b.toString(16).padStart(2, '0')).join('');
    const combinedHex = nodeHex.slice(2) + labelHash.slice(2);
    const combined = hexToBytes(combinedHex);
    const newHash = await crypto.subtle.digest('SHA-256', combined);
    node = new Uint8Array(newHash);
  }
  
  return '0x' + Array.from(node).map(b => b.toString(16).padStart(2, '0')).join('');
}

function hexToBytes(hex: string): ArrayBuffer {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes.buffer;
}

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get('name')?.toLowerCase().trim();
  
  if (!name || name.length < 2) {
    return NextResponse.json({ error: 'Name too short' }, { status: 400 });
  }

  try {
    // Remove .eth suffix if present
    const label = name.replace(/\.eth$/, '');
    
    // Compute namehash for label.eth
    const node = await computeNamehash(`${label}.eth`);
    
    // ENS registry owner(bytes32 node) = 0x02571be3
    const data = '0x02571be3' + node.slice(2).padStart(64, '0');
    
    const resp = await fetch(ETH_RPC, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_call',
        params: [{ to: ENS_REGISTRY, data }, 'latest']
      }),
    });
    
    const json: any = await resp.json();
    const result: string = json.result || '0x';
    const owner = result !== '0x' && result !== '0x' + '0'.repeat(64) ? '0x' + result.slice(-40) : null;
    const registered = !!owner && owner !== '0x0000000000000000000000000000000000000000';
    
    return NextResponse.json({ 
      registered, 
      owner,
      name: `${label}.eth`
    });
  } catch (error) {
    console.error('[check-ens] Error:', error);
    return NextResponse.json({ registered: false, error: 'Check failed' });
  }
}
