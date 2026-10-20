export interface ChatMessage {
  id: string;
  sender: string;
  contact: string; // the "other party" in the conversation — used for thread grouping
  text: string;
  timestamp: number;
  isMe: boolean;
}

function stripHtmlToText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(?:p|div|li|tr|h[1-6]|blockquote)>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/[ \t]+/g, ' ')
    .split('\n').map(l => l.trim()).filter(Boolean).join('\n')
    .trim();
}

export function emailToChat(
  msg: {
    id: string;
    fromAddress?: string;
    sender?: string;
    toAddress?: string; // recipient — required to correctly group sent messages
    body?: string;
    summary?: string;
    receivedTime?: string;
  },
  myEmail: string
): ChatMessage {
  const rawBody = msg.body || msg.summary || '';
  const isHtml = /<[a-z][\s\S]*>/i.test(rawBody);
  let raw = isHtml ? stripHtmlToText(rawBody) : rawBody;

  raw = raw.replace(/(On\s.+?\s(?:wrote|written):[\s\S]*$)/i, '');
  raw = raw.split(/[-]{3,}\s*Forwarded message\s*[-]{3,}/i)[0];
  raw = raw.split('\n').filter(l => !/^>+/.test(l.trimStart())).join('\n');
  const sigIdx = raw.lastIndexOf('\n--\n');
  if (sigIdx !== -1) raw = raw.slice(0, sigIdx);

  const from = (msg.fromAddress || msg.sender || '').toLowerCase();
  const isMe = from === myEmail.toLowerCase();
  // For received messages: contact = sender. For sent messages: contact = recipient.
  const contact = isMe ? (msg.toAddress || '').toLowerCase() : from;
  return {
    id: msg.id,
    sender: from,
    contact,
    text: raw.trim() || '(no content)',
    timestamp: msg.receivedTime ? new Date(msg.receivedTime).getTime() : 0,
    isMe,
  };
}

export function groupByContact(msgs: ChatMessage[]): Record<string, ChatMessage[]> {
  const groups: Record<string, ChatMessage[]> = {};
  for (const m of msgs) {
    const key = m.contact || m.sender;
    if (!groups[key]) groups[key] = [];
    groups[key].push(m);
  }
  for (const k of Object.keys(groups)) {
    groups[k].sort((a, b) => a.timestamp - b.timestamp);
  }
  return groups;
}
