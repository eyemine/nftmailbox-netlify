/// GET /tray/[id]
///
/// Document Tray viewer — the secure endpoint of the bitmap transmission
/// channel. Renders a static bitmap (PNG/BMP) as an <img> with thermal-paper
/// styling. The 72-hour Thermal Fade countdown is a client-side overlay so the
/// bitmap itself remains script-free and the timer updates live.

export const dynamic = 'force-dynamic';

import ThermalFadeView from '@/app/components/ThermalFadeView';

const WORKER_URL = process.env.NFTMAIL_WORKER_URL || 'https://worker.nftmail.box';
const WORKER_SECRET = process.env.WORKER_SECRET || '';

interface TrayDocument {
  id: string;
  from: string;
  format: 'png' | 'bmp' | 'jpg';
  dataBase64?: string;
  channel?: 'public' | 'private';
  encrypted?: boolean;
  createdAt: number;
}

async function getTrayDocument(id: string): Promise<TrayDocument | null> {
  try {
    // Runs server-side, so the secret never reaches the client. The Hetzner
    // worker requires X-Worker-Secret for getTrayDocument (not a public action).
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (WORKER_SECRET) headers['X-Worker-Secret'] = WORKER_SECRET;
    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ action: 'getTrayDocument', id }),
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return await res.json() as TrayDocument;
  } catch {
    return null;
  }
}

export default async function TrayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const doc = await getTrayDocument(id);

  if (!doc) {
    return (
      <main style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#111', color: '#888', fontFamily: 'monospace', fontSize: 13,
      }}>
        Document not found or has expired.
      </main>
    );
  }

  // Private (encrypted) faxes are never rendered at the public URL — this page
  // has no wallet context to decrypt, and the ciphertext must never be exposed
  // here. Direct the recipient to their authenticated dashboard fax tray.
  if (doc.encrypted || doc.channel === 'private') {
    return (
      <main style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '32px 16px', background: '#1a1a1a',
      }}>
        <div style={{
          maxWidth: 420, width: '100%', background: '#f4f1e8',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)', padding: '24px 20px 28px',
          fontFamily: "'Courier New', Courier, monospace", color: '#2a2a2a', textAlign: 'center',
        }}>
          <div style={{ borderBottom: '2px dashed #999', paddingBottom: 10, marginBottom: 16 }}>
            <div style={{ fontSize: 11, letterSpacing: 1, color: '#666' }}>NFTfax · ENCRYPTED TRANSMISSION</div>
            <div style={{ fontSize: 10, color: '#888', marginTop: 4 }}>FROM: {doc.from}</div>
            <div style={{ fontSize: 10, color: '#888' }}>T/#{doc.id.toUpperCase()}</div>
          </div>
          <div style={{ fontSize: 32, marginBottom: 12 }}>&#128274;</div>
          <p style={{ fontSize: 12, lineHeight: 1.6, color: '#444' }}>
            This fax is end-to-end encrypted. It can only be decrypted by the
            recipient&apos;s wallet.
          </p>
          <a href="/dashboard?tab=fax" style={{
            display: 'inline-block', marginTop: 16, padding: '10px 18px',
            background: '#31372e', color: '#a9c99f', textDecoration: 'none',
            fontSize: 11, letterSpacing: 1, textTransform: 'uppercase',
          }}>
            Open in NFTmail Dashboard
          </a>
          <div style={{ borderTop: '2px dashed #999', paddingTop: 8, marginTop: 20, fontSize: 9, color: '#999' }}>
            NFTfax · nftmail.box · ciphertext only, zero plaintext at rest
          </div>
        </div>
      </main>
    );
  }

  return <ThermalFadeView doc={{
    id: doc.id,
    from: doc.from,
    format: doc.format,
    dataBase64: doc.dataBase64 ?? '',
    createdAt: doc.createdAt,
  }} />;
}
