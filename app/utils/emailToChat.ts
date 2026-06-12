export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
  isMe: boolean;
}

export function emailToChat(
  msg: {
    id: string;
    fromAddress?: string;
    sender?: string;
    body?: string;
    summary?: string;
    receivedTime?: string;
  },
  myEmail: string
): ChatMessage {
  let raw = msg.body || msg.summary || '';
  raw = raw.replace(/(On\s.+?\s(?:wrote|written):[\s\S]*$)/i, '');
  raw = raw.split(/[-]{3,}\s*Forwarded message\s*[-]{3,}/i)[0];
  raw = raw.split('\n').filter(l => !/^>+/.test(l.trimStart())).join('\n');
  const sigIdx = raw.lastIndexOf('\n--\n');
  if (sigIdx !== -1) raw = raw.slice(0, sigIdx);

  const from = (msg.fromAddress || msg.sender || '').toLowerCase();
  return {
    id: msg.id,
    sender: from,
    text: raw.trim() || '(no content)',
    timestamp: msg.receivedTime ? new Date(msg.receivedTime).getTime() : 0,
    isMe: from === myEmail.toLowerCase(),
  };
}

export function groupByContact(msgs: ChatMessage[]): Record<string, ChatMessage[]> {
  const groups: Record<string, ChatMessage[]> = {};
  for (const m of msgs) {
    if (!groups[m.sender]) groups[m.sender] = [];
    groups[m.sender].push(m);
  }
  for (const k of Object.keys(groups)) {
    groups[k].sort((a, b) => a.timestamp - b.timestamp);
  }
  return groups;
}
