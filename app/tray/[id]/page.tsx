/// GET /tray/[id]
///
/// Document Tray viewer — the secure endpoint of the bitmap transmission
/// channel. Renders a static bitmap (PNG/BMP) as an <img> with thermal-paper
/// styling. No HTML parsing of untrusted content, no remote resource loads,
/// no script execution context, no scripts at all — the image is served as a
/// base64 data URI from our own domain, and that's the entire page.

export const dynamic = 'force-dynamic';

const WORKER_URL = process.env.NFTMAIL_WORKER_URL || 'https://worker.nftmail.box';
const WORKER_SECRET = process.env.WORKER_SECRET || '';

interface TrayDocument {
  id: string;
  from: string;
  format: 'png' | 'bmp' | 'jpg';
  dataBase64: string;
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

  const mimeType = doc.format === 'png' ? 'image/png' : doc.format === 'jpg' ? 'image/jpeg' : 'image/bmp';
  const dataUri = `data:${mimeType};base64,${doc.dataBase64}`;
  const receivedAt = new Date(doc.createdAt).toLocaleString();

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 16px',
      background: '#1a1a1a',
    }}>
      <div style={{
        maxWidth: 420,
        width: '100%',
        background: '#f4f1e8',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        padding: '20px 20px 28px',
        fontFamily: "'Courier New', Courier, monospace",
        color: '#2a2a2a',
      }}>
        {/* Retro cover sheet header */}
        <div style={{ borderBottom: '2px dashed #999', paddingBottom: 10, marginBottom: 14 }}>
          <div style={{ fontSize: 11, letterSpacing: 1, color: '#666' }}>nftFAX · SECURE TRANSMISSION</div>
          <div style={{ fontSize: 10, color: '#888', marginTop: 4 }}>FROM: {doc.from}</div>
          <div style={{ fontSize: 10, color: '#888' }}>T/#{doc.id.toUpperCase()} · {receivedAt}</div>
        </div>

        {/* Static bitmap render — no scripts, no remote loads */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={dataUri}
          alt={`Secure transmission from ${doc.from}`}
          style={{
            width: '100%',
            display: 'block',
            filter: 'grayscale(1) contrast(1.1)',
            imageRendering: 'pixelated',
          }}
        />

        <div style={{ borderTop: '2px dashed #999', paddingTop: 8, marginTop: 14, fontSize: 9, color: '#999', textAlign: 'center' }}>
          nftFAX · nftmail.box · bitmap-only, no scripts, no tracking
        </div>
      </div>
    </main>
  );
}
