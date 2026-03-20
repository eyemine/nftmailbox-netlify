import { NextRequest, NextResponse } from 'next/server';

const ZOHO_MAIL_API = 'https://mail.zoho.com.au/api';

async function getZohoAccessToken(): Promise<string | null> {
  const existing = process.env.ZOHO_OAUTH_TOKEN;
  if (existing) return existing;

  const accountsDomain = process.env.ZOHO_ACCOUNTS_DOMAIN;
  const refreshToken = process.env.ZOHO_REFRESH_TOKEN;
  const clientId = process.env.ZOHO_CLIENT_ID;
  const clientSecret = process.env.ZOHO_CLIENT_SECRET;

  if (!accountsDomain || !refreshToken || !clientId || !clientSecret) return null;

  const form = new URLSearchParams();
  form.set('grant_type', 'refresh_token');
  form.set('refresh_token', refreshToken);
  form.set('client_id', clientId);
  form.set('client_secret', clientSecret);

  const res = await fetch(`https://${accountsDomain}/oauth/v2/token`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: form.toString(),
  });

  const data = (await res.json().catch(() => ({}))) as Record<string, any>;
  if (!res.ok) return null;
  return (data.access_token as string) || null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fromEmail, toAddress, subject, content } = body as {
      fromEmail?: string;
      toAddress?: string;
      subject?: string;
      content?: string;
    };

    if (!fromEmail || !fromEmail.endsWith('@nftmail.box')) {
      return NextResponse.json({ error: 'Invalid sender — must be @nftmail.box' }, { status: 400 });
    }
    if (!toAddress || !toAddress.includes('@')) {
      return NextResponse.json({ error: 'Invalid recipient address' }, { status: 400 });
    }
    if (!subject && !content) {
      return NextResponse.json({ error: 'Subject or content required' }, { status: 400 });
    }

    const catchAllAccountId = process.env.ZOHO_CATCHALL_ACCOUNT_ID;
    const token = await getZohoAccessToken();
    if (!token || !catchAllAccountId) {
      return NextResponse.json({ error: 'Mail server not configured' }, { status: 503 });
    }

    // Send via catch-all account with fromAddress set to the sender's nftmail.box address
    const sendRes = await fetch(
      `${ZOHO_MAIL_API}/accounts/${catchAllAccountId}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromAddress: fromEmail,
          toAddress: toAddress,
          subject: subject || '(no subject)',
          content: content || '',
          mailFormat: 'plaintext',
        }),
      }
    );

    if (!sendRes.ok) {
      const errData = (await sendRes.json().catch(() => ({}))) as Record<string, any>;
      return NextResponse.json(
        { error: errData?.data?.message || `Zoho send returned ${sendRes.status}` },
        { status: 502 }
      );
    }

    const sendData = (await sendRes.json()) as Record<string, any>;

    return NextResponse.json({
      success: true,
      messageId: sendData?.data?.messageId || 'sent',
      from: fromEmail,
      to: toAddress,
    });
  } catch (err: any) {
    console.error('Send error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to send email' },
      { status: 500 }
    );
  }
}
