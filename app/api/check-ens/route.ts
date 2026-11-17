import { NextRequest, NextResponse } from 'next/server';
import { labelhash, namehash } from 'viem/ens';

const ETH_RPC = process.env.ETH_RPC_URL || 'https://ethereum.publicnode.com';
const ENS_REGISTRY = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e';
const ENS_NAME_WRAPPER = '0xd4416b13d2b3a9abae7acd5d6c2bbdbe25686401';
// ENSv2 ETHRegistry — new .eth registrations live here, invisible to v1.
const ENS_V2_REGISTRY = '0xf60aba43e1f7f3dab1186ff03b561401c9df85e2';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get('name')?.toLowerCase().trim();
  
  if (!name || name.length < 2) {
    return NextResponse.json({ error: 'Name too short' }, { status: 400 });
  }

  try {
    // Remove .eth suffix if present
    const label = name.replace(/\.eth$/, '');
    
    // Compute namehash for label.eth using viem
    const node = namehash(`${label}.eth`);
    
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
    
    const json = await resp.json() as { result?: string; error?: { message?: string } };

    if (!resp.ok || json.error) {
      return NextResponse.json({ checked: false, registered: null, error: 'ENS_RPC_UNAVAILABLE' }, { status: 503 });
    }

    const result = json.result || '0x';
    let owner = result !== '0x' && result !== '0x' + '0'.repeat(64) ? '0x' + result.slice(-40) : null;
    const registered = !!owner && owner !== '0x0000000000000000000000000000000000000000';
    let wrapped = false;

    // Wrapped names escrow to the NameWrapper — registry.owner returns the
    // wrapper contract, not the holder. Resolve the real owner via
    // NameWrapper.ownerOf(namehash) so callers comparing owner → wallet work.
    if (registered && owner!.toLowerCase() === ENS_NAME_WRAPPER) {
      wrapped = true;
      const wrappedRes = await fetch(ETH_RPC, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0', id: 2, method: 'eth_call',
          params: [{ to: ENS_NAME_WRAPPER, data: '0x6352211e' + node.slice(2) }, 'latest']
        }),
      });
      const wrappedJson = await wrappedRes.json() as { result?: string };
      const wrappedOwner = wrappedJson.result && wrappedJson.result !== '0x' ? '0x' + wrappedJson.result.slice(-40) : null;
      if (wrappedOwner) owner = wrappedOwner;
    }

    // ENSv2 fallback: getOwner(anyId) accepts the v1 labelhash directly.
    // selector: keccak256("getOwner(uint256)")[0:4] = 0xc41a360a
    if (!registered) {
      const lhHex = BigInt(labelhash(label)).toString(16).padStart(64, '0');
      const v2Res = await fetch(ETH_RPC, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0', id: 3, method: 'eth_call',
          params: [{ to: ENS_V2_REGISTRY, data: '0xc41a360a' + lhHex }, 'latest']
        }),
      });
      const v2Json = await v2Res.json() as { result?: string };
      const v2Owner = v2Json.result && v2Json.result !== '0x' && v2Json.result !== '0x' + '0'.repeat(64)
        ? '0x' + v2Json.result.slice(-40) : null;
      if (v2Owner && v2Owner !== '0x0000000000000000000000000000000000000000') {
        return NextResponse.json({
          checked: true,
          registered: true,
          owner: v2Owner,
          wrapped: false,
          ensv2: true,
          name: `${label}.eth`
        });
      }
    }

    return NextResponse.json({
      checked: true,
      registered,
      owner,
      wrapped,
      name: `${label}.eth`
    });
  } catch (error) {
    console.error('[check-ens] Error:', error);
    return NextResponse.json({ checked: false, registered: null, error: 'ENS_CHECK_FAILED' }, { status: 503 });
  }
}
