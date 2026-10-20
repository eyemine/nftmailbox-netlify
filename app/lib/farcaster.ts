/// Farcaster auto-cast helpers for Fax Chain Letter forwards.
/// A cast is only published when NEYNAR_API_KEY and NEYNAR_SIGNER_UUID are set.

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY || '';
const NEYNAR_SIGNER_UUID = process.env.NEYNAR_SIGNER_UUID || '';

export async function publishForwardCast({
  trayId,
  from,
  to,
  remainingHours,
}: {
  trayId: string;
  from: string;
  to: string;
  remainingHours: number;
}) {
  if (!NEYNAR_API_KEY || !NEYNAR_SIGNER_UUID) return;

  const text = `Fax chain link forwarded from ${from} to ${to}. ${remainingHours}h thermal fade remaining. Forward before it fades.`;
  const embedUrl = `https://nftmail.box/tray/${trayId}`;

  try {
    await fetch('https://api.neynar.com/v2/farcaster/cast', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api_key': NEYNAR_API_KEY,
      },
      body: JSON.stringify({
        signer_uuid: NEYNAR_SIGNER_UUID,
        text,
        embeds: [{ url: embedUrl }],
      }),
    });
  } catch {
    // Auto-cast is best-effort; never block the send pipeline.
  }
}
