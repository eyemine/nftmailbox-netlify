# Email Provider Migration Guide

## Overview

GhostAgent NFTMail supports multiple email providers with a unified abstraction layer. This allows seamless migration between providers with minimal code changes.

**Supported Providers:**
- **Mailgun Foundation** (primary) - Best for multiple domains, forwarding rules
- **AWS SES** (migration path) - Cheaper for high volume, requires more setup

## Current Setup: Mailgun Foundation

### Environment Variables
```bash
EMAIL_PROVIDER=mailgun
MAILGUN_API_KEY=your-mailgun-api-key
MAILGUN_DOMAIN=ghostmail.box
MAILGUN_WEBHOOK_KEY=your-webhook-signing-key
```

### Features Enabled
- Multiple domains (ghostmail.box, nftmail.box)
- 5000 forwarding routes
- Dedicated IP (better deliverability)
- 100 API keys (per-service isolation)

## Migration to AWS SES

### When to Migrate
- Low adoption (< 1000 emails/month)
- Cost optimization needed ($35/month → ~$0.50/month)
- Single domain sufficient

### Migration Steps

#### 1. Update Environment Variables
```bash
EMAIL_PROVIDER=ses
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
```

#### 2. DNS Changes

Remove Mailgun records, add SES records:

| Type | Host | Value |
|------|------|-------|
| MX | @ | `inbound-smtp.us-east-1.amazonaws.com` |
| TXT | @ | `v=spf1 include:amazonses.com ~all` |
| TXT | _dmarc | `v=DMARC1; p=quarantine; ...` |

#### 3. Implement SES Provider

The abstraction layer is already in place. Activate by:

```typescript
// workers/email-provider.ts - SES provider already stubbed
// Uncomment and implement send() method:

async send(message: EmailMessage): Promise<{ id: string; status: 'sent' }> {
  const aws4 = await import('aws4fetch');
  const aws = new aws4.AwsClient({
    accessKeyId: this.accessKeyId,
    secretAccessKey: this.secretAccessKey,
    region: this.region,
  });
  
  const response = await aws.fetch('https://email.us-east-1.amazonaws.com', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      Action: 'SendRawEmail',
      'RawMessage.Data': base64EncodedMessage,
    }),
  });
  
  return { id: extractMessageId(response), status: 'sent' };
}
```

#### 4. Forwarding Service Migration

**Mailgun:** Routes are managed via API
**SES:** Requires Lambda function + S3 + SNS

```yaml
# SES Forwarding Architecture
Inbound Email → SES Receipt Rule → S3 Bucket
                                    ↓
                              Lambda Trigger
                                    ↓
                              Forward to Target
```

#### 5. Worker Update

No code changes needed in worker - just config:

```typescript
// workers/index.ts
import { createEmailProvider } from './email-provider';

const provider = createEmailProvider(env);
// provider.send(), provider.createForwardRule() work identically
```

### Rollback Plan

If SES migration fails:
1. Revert `EMAIL_PROVIDER=mailgun`
2. Restore Mailgun DNS records
3. Re-enable Mailgun domain in dashboard

## Provider Comparison

| Feature | Mailgun Foundation | AWS SES |
|---------|-------------------|---------|
| **Cost** | $35/month | $0.10/1000 emails |
| **Domains** | 1000 | Unlimited |
| **Forwarding** | Native routes | Lambda required |
| **Inbound** | Webhooks | SNS/S3 |
| **Migration** | → SES (medium) | → Mailgun (easy) |

## Implementation Status

- ✅ Abstraction layer created
- ✅ Mailgun provider implemented
- ⚠️ SES provider stubbed (implement when migrating)
- ⏳ Forwarding service integration (next step)

## Files Changed During Migration

| File | Change Type |
|------|-------------|
| `wrangler.toml` | Update env vars |
| DNS records | Swap MX/TXT records |
| `workers/email-provider.ts` | Uncomment SES methods |
| None others | Abstraction handles it |
