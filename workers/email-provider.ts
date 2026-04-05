/**
 * Email Provider Abstraction Layer
 * 
 * Supports: Mailgun (primary) → AWS SES (migration path)
 * Migration: Change EMAIL_PROVIDER env var, update DNS records
 */

export interface EmailMessage {
  from: string;
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: Array<{
    filename: string;
    content: string | Uint8Array;
    contentType?: string;
  }>;
  headers?: Record<string, string>;
}

export interface InboundEmail {
  id: string;
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: Array<{
    filename: string;
    size: number;
    contentType: string;
    url?: string;
  }>;
  timestamp: number;
  headers?: Record<string, string>;
}

export interface ForwardRule {
  from: string;
  to: string;
  enabled: boolean;
  filter?: {
    subjectContains?: string;
    fromDomain?: string;
  };
}

export interface EmailProvider {
  name: 'mailgun' | 'ses';
  
  // Outbound
  send(message: EmailMessage): Promise<{ id: string; status: 'sent' | 'queued' | 'failed' }>;
  sendBatch(messages: EmailMessage[]): Promise<Array<{ id: string; status: 'sent' | 'queued' | 'failed' }>>;
  
  // Inbound webhook verification
  verifyWebhook(payload: unknown, signature: string, timestamp: string): boolean;
  
  // Forwarding (Mailgun routes or SES Lambda)
  createForwardRule(rule: ForwardRule): Promise<{ id: string }>;
  deleteForwardRule(id: string): Promise<void>;
  listForwardRules(domain: string): Promise<ForwardRule[]>;
  
  // Domain management
  getDomainStatus(domain: string): Promise<{
    verified: boolean;
    dkim: boolean;
    spf: boolean;
    mx: boolean;
  }>;
}

// Provider factory
export function createEmailProvider(env: {
  EMAIL_PROVIDER: 'mailgun' | 'ses';
  MAILGUN_API_KEY?: string;
  MAILGUN_DOMAIN?: string;
  MAILGUN_WEBHOOK_KEY?: string;
  AWS_ACCESS_KEY_ID?: string;
  AWS_SECRET_ACCESS_KEY?: string;
  AWS_REGION?: string;
}): EmailProvider {
  switch (env.EMAIL_PROVIDER) {
    case 'mailgun':
      return new MailgunProvider({
        apiKey: env.MAILGUN_API_KEY!,
        domain: env.MAILGUN_DOMAIN!,
        webhookKey: env.MAILGUN_WEBHOOK_KEY,
      });
    case 'ses':
      return new SESProvider({
        accessKeyId: env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY!,
        region: env.AWS_REGION || 'us-east-1',
      });
    default:
      throw new Error(`Unknown email provider: ${env.EMAIL_PROVIDER}`);
  }
}

// Mailgun Provider (Foundation tier features)
class MailgunProvider implements EmailProvider {
  name = 'mailgun' as const;
  private apiKey: string;
  private domain: string;
  private webhookKey?: string;
  private baseUrl = 'https://api.mailgun.net/v3';

  constructor(config: { apiKey: string; domain: string; webhookKey?: string }) {
    this.apiKey = config.apiKey;
    this.domain = config.domain;
    this.webhookKey = config.webhookKey;
  }

  async send(message: EmailMessage): Promise<{ id: string; status: 'sent' | 'queued' | 'failed' }> {
    const form = new FormData();
    form.append('from', message.from);
    form.append('to', Array.isArray(message.to) ? message.to.join(',') : message.to);
    form.append('subject', message.subject);
    if (message.text) form.append('text', message.text);
    if (message.html) form.append('html', message.html);
    
    // Headers
    if (message.headers) {
      Object.entries(message.headers).forEach(([key, value]) => {
        form.append(`h:${key}`, value);
      });
    }

    // Attachments
    if (message.attachments) {
      for (const att of message.attachments) {
        const blob = att.content instanceof Uint8Array 
          ? new Blob([att.content])
          : new Blob([att.content], { type: att.contentType || 'application/octet-stream' });
        form.append('attachment', blob, att.filename);
      }
    }

    const response = await fetch(`${this.baseUrl}/${this.domain}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`api:${this.apiKey}`)}`,
      },
      body: form,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Mailgun send failed: ${error}`);
    }

    const result = await response.json();
    return {
      id: result.id,
      status: 'sent',
    };
  }

  async sendBatch(messages: EmailMessage[]): Promise<Array<{ id: string; status: 'sent' | 'queued' | 'failed' }>> {
    // Mailgun doesn't have native batch, send sequentially
    const results: Array<{ id: string; status: 'sent' | 'queued' | 'failed' }> = [];
    for (const msg of messages) {
      try {
        const result = await this.send(msg);
        results.push(result);
      } catch {
        results.push({ id: 'failed', status: 'failed' });
      }
    }
    return results;
  }

  verifyWebhook(payload: unknown, signature: string, timestamp: string): boolean {
    if (!this.webhookKey) return false;
    
    // Mailgun webhook signature verification
    const data = `${timestamp}${JSON.stringify(payload)}`;
    const expectedSignature = crypto.subtle.digest('SHA-256', new TextEncoder().encode(data + this.webhookKey))
      .then(buf => Array.from(new Uint8Array(buf))
        .map(b => b.toString(16).padStart(2, '0'))
        .join(''));
    
    return signature === expectedSignature;
  }

  async createForwardRule(rule: ForwardRule): Promise<{ id: string }> {
    const response = await fetch(`${this.baseUrl}/${this.domain}/routes`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`api:${this.apiKey}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        priority: '0',
        description: `Forward ${rule.from} to ${rule.to}`,
        expression: `match_recipient("${rule.from}")`,
        action: `forward("${rule.to}")`,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create route: ${await response.text()}`);
    }

    const result = await response.json();
    return { id: result.route.id };
  }

  async deleteForwardRule(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/routes/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Basic ${btoa(`api:${this.apiKey}`)}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete route: ${await response.text()}`);
    }
  }

  async listForwardRules(domain: string): Promise<ForwardRule[]> {
    const response = await fetch(`${this.baseUrl}/${domain}/routes`, {
      headers: {
        'Authorization': `Basic ${btoa(`api:${this.apiKey}`)}`,
      },
    });

    if (!response.ok) {
      return [];
    }

    const result = await response.json();
    return result.items.map((route: { expression: string; actions: string[]; id: string }) => {
      const match = route.expression.match(/match_recipient\("(.+?)"\)/);
      const forwardMatch = route.actions[0]?.match(/forward\("(.+?)"\)/);
      return {
        from: match?.[1] || '',
        to: forwardMatch?.[1] || '',
        enabled: true,
        id: route.id,
      };
    });
  }

  async getDomainStatus(domain: string): Promise<{ verified: boolean; dkim: boolean; spf: boolean; mx: boolean }> {
    const response = await fetch(`${this.baseUrl}/${domain}`, {
      headers: {
        'Authorization': `Basic ${btoa(`api:${this.apiKey}`)}`,
      },
    });

    if (!response.ok) {
      return { verified: false, dkim: false, spf: false, mx: false };
    }

    const result = await response.json();
    return {
      verified: result.domain.state === 'active',
      dkim: result.domain.dkim.state === 'active',
      spf: result.domain.spf.state === 'active',
      mx: result.domain.sending_dns_records?.some((r: { record_type: string }) => r.record_type === 'MX'),
    };
  }
}

// AWS SES Provider (stub for migration path)
class SESProvider implements EmailProvider {
  name = 'ses' as const;
  private accessKeyId: string;
  private secretAccessKey: string;
  private region: string;

  constructor(config: { accessKeyId: string; secretAccessKey: string; region: string }) {
    this.accessKeyId = config.accessKeyId;
    this.secretAccessKey = config.secretAccessKey;
    this.region = config.region;
  }

  async send(message: EmailMessage): Promise<{ id: string; status: 'sent' | 'queued' | 'failed' }> {
    // AWS SES SendRawEmail API
    // TODO: Implement when migrating
    throw new Error('SES provider not yet implemented. Migration in progress.');
  }

  async sendBatch(messages: EmailMessage[]): Promise<Array<{ id: string; status: 'sent' | 'queued' | 'failed' }>> {
    // SES has 14 emails/second limit, queue accordingly
    throw new Error('SES provider not yet implemented. Migration in progress.');
  }

  verifyWebhook(payload: unknown, signature: string, timestamp: string): boolean {
    // SES uses SNS for webhooks, different verification
    return false;
  }

  async createForwardRule(rule: ForwardRule): Promise<{ id: string }> {
    // SES uses Lambda + S3 for forwarding
    throw new Error('SES forwarding requires Lambda setup. See migration guide.');
  }

  async deleteForwardRule(id: string): Promise<void> {
    throw new Error('Not implemented');
  }

  async listForwardRules(domain: string): Promise<ForwardRule[]> {
    return [];
  }

  async getDomainStatus(domain: string): Promise<{ verified: boolean; dkim: boolean; spf: boolean; mx: boolean }> {
    // AWS SDK GetIdentityVerificationAttributes
    return { verified: false, dkim: false, spf: false, mx: false };
  }
}

export default { createEmailProvider };
