'use client';

/// TrayClient — browser-side ECIES decryption for private NFTmail faxes.
///
/// The ciphertext envelope (envelope) is already public in the URL; this
/// component fetches the wallet-wrapped private key, has the owner re-sign
/// FAX_KEY_MESSAGE to unwrap it locally, then decrypts and renders the image.
/// Plaintext exists only in this tab. Works on both nftmail.box and nftfax.app
/// for channel: 'private' faxes — the domain only changes marketing, not the key.

import { useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import PrivateFaxViewer from '@/app/components/PrivateFaxViewer';

interface TrayClientProps {
  trayId: string;
}

export default function TrayClient({ trayId }: TrayClientProps) {
  const [local, setLocal] = useState('');
  const { authenticated, login } = usePrivy();
  const { wallets } = useWallets();
  const walletAddress = wallets[0]?.address || '';

  if (!authenticated) {
    return (
      <div style={{ textAlign: 'center', padding: '24px 8px' }}>
        <div style={{ fontSize: 32, marginBottom: 10 }}>&#128274;</div>
        <button
          onClick={login}
          style={{
            padding: '10px 18px',
            background: '#31372e',
            color: '#a9c99f',
            border: 'none',
            fontSize: 11,
            letterSpacing: 1,
            textTransform: 'uppercase',
            cursor: 'pointer',
            fontFamily: "'Courier New', Courier, monospace",
          }}
        >
          Connect Wallet to Decrypt
        </button>
      </div>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 10, color: '#888' }}>Recipient mailbox local-part</div>
        <input
          type="text"
          value={local}
          onChange={(e) => setLocal(e.target.value.toLowerCase().trim())}
          placeholder="e.g. ghostagent"
          style={{
            width: '100%',
            marginTop: 6,
            padding: '8px 10px',
            fontSize: 11,
            fontFamily: "'Courier New', Courier, monospace",
            border: '1px solid #999',
            background: '#fff',
            color: '#2a2a2a',
          }}
        />
      </div>

      {local && walletAddress ? (
        <PrivateFaxViewer trayId={trayId} local={local} walletAddress={walletAddress} />
      ) : (
        <div style={{ textAlign: 'center', padding: '12px 8px', fontSize: 10, color: '#888' }}>
          Enter the mailbox local-part this fax was sent to, then unlock it.
        </div>
      )}
    </div>
  );
}
