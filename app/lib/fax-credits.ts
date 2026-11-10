/// Fax Chain credit/decay (Thermal Fade) helpers.
///
/// Free/Basic accounts use `fax-credits` instead of a hard monthly cap.
/// - Receiving a fax sets `fax-last-received`.
/// - Forwarding a received fax within 72 hours adds +1 credit.
/// - If a received fax is not forwarded within 72 hours, the account loses
///   all credits.
/// - New sends consume 1 credit.

const WORKER_URL = process.env.NFTMAIL_WORKER_URL || 'https://worker.nftmail.box';
const WORKER_SECRET = process.env.WORKER_SECRET || '';
const WEBHOOK_SECRET = process.env.NFTMAIL_WEBHOOK_SECRET || process.env.WEBHOOK_SECRET || '';

export const FADE_HOURS = 72;
export const FADE_MS = FADE_HOURS * 60 * 60 * 1000;

export const BASE_FREE_CREDITS = 2;

/// Basic-tier monthly allowance: every account's credit floor is topped up to
/// 10 on the first activity of each calendar month (UTC). Earned credits above
/// the floor carry over — this is a floor, not a reset. Mirrors the email
/// basic-tier quota (10 sends/month) enforced in /api/send-email.
export const MONTHLY_FREE_SENDS = 10;

/// First 100 accounts to ever check their fax credits get a launch bonus of
/// 5 free credits instead of the standard 2. Best-effort (not transactional —
/// concurrent first-time joins may occasionally over/undercount by a couple
/// under heavy simultaneous load), gated by `fax-joined:{label}` so a given
/// label is only ever counted once.
export const FIRST_JOINER_BONUS_CREDITS = 5;
export const FIRST_JOINER_CAP = 100;
const JOINER_COUNT_KEY = 'fax-joiner-count';

function currentMonth(): string {
  return new Date().toISOString().slice(0, 7);
}

function labelKey(prefix: string, label: string): string {
  return `${prefix}:${label.toLowerCase().trim()}`;
}

async function kvGet(key: string): Promise<string | null> {
  try {
    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(WORKER_SECRET ? { 'X-Worker-Secret': WORKER_SECRET } : {}),
      },
      body: JSON.stringify({ action: 'kvGet', key }),
    });
    if (!res.ok) return null;
    const data = await res.json() as { value: string | null };
    return data.value;
  } catch {
    return null;
  }
}

async function kvPut(key: string, value: string, ownerAddress: string) {
  await fetch(WORKER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(WORKER_SECRET ? { 'X-Worker-Secret': WORKER_SECRET } : {}),
    },
    body: JSON.stringify({
      action: 'kvPut',
      key,
      value,
      ownerAddress: ownerAddress.toLowerCase(),
      webhookSecret: WEBHOOK_SECRET,
    }),
  });
}

export async function getCredits(label: string): Promise<number> {
  const raw = await kvGet(labelKey('fax-credits', label));
  if (raw === null) return BASE_FREE_CREDITS;
  const n = parseInt(raw, 10);
  return isNaN(n) ? BASE_FREE_CREDITS : n;
}

export async function setCredits(label: string, credits: number, ownerAddress: string) {
  await kvPut(labelKey('fax-credits', label), String(credits), ownerAddress);
}

export async function getLastReceived(label: string): Promise<number | null> {
  const raw = await kvGet(labelKey('fax-last-received', label));
  if (!raw) return null;
  const n = parseInt(raw, 10);
  return isNaN(n) ? null : n;
}

export async function setLastReceived(label: string, timestamp: number, ownerAddress: string) {
  await kvPut(labelKey('fax-last-received', label), String(timestamp), ownerAddress);
}

export async function getLastForwarded(label: string): Promise<number | null> {
  const raw = await kvGet(labelKey('fax-last-forwarded', label));
  if (!raw) return null;
  const n = parseInt(raw, 10);
  return isNaN(n) ? null : n;
}

export async function setLastForwarded(label: string, timestamp: number, ownerAddress: string) {
  await kvPut(labelKey('fax-last-forwarded', label), String(timestamp), ownerAddress);
}

export async function applyThermalFade(label: string, ownerAddress: string): Promise<number> {
  const [credits, lastReceived, lastForwarded] = await Promise.all([
    getCredits(label),
    getLastReceived(label),
    getLastForwarded(label),
  ]);

  if (lastReceived && (lastForwarded === null || lastForwarded < lastReceived)) {
    const now = Date.now();
    if (now - lastReceived > FADE_MS) {
      if (credits > 0) await setCredits(label, 0, ownerAddress);
      return 0;
    }
  }

  return credits;
}

export async function spendCredit(label: string, ownerAddress: string): Promise<boolean> {
  await ensureMonthlyCredits(label, ownerAddress);
  const credits = await applyThermalFade(label, ownerAddress);
  if (credits <= 0) return false;
  await setCredits(label, credits - 1, ownerAddress);
  return true;
}

export async function earnForwardCredit(label: string, ownerAddress: string): Promise<void> {
  const [credits, lastReceived, lastForwarded] = await Promise.all([
    getCredits(label),
    getLastReceived(label),
    getLastForwarded(label),
  ]);

  const now = Date.now();
  let nextCredits = credits;

  // Only earn a credit for forwarding a received fax that hasn't already been
  // forwarded and hasn't thermally faded.
  if (lastReceived && (lastForwarded === null || lastForwarded < lastReceived)) {
    if (now - lastReceived <= FADE_MS) {
      nextCredits += 1;
    } else {
      nextCredits = 0;
    }
  }

  await setCredits(label, nextCredits, ownerAddress);
  await setLastForwarded(label, now, ownerAddress);
}

/// Grants the first-100-joiners launch bonus on an account's very first
/// credits lookup, then behaves like `getCredits` on every subsequent call.
/// Call this from the credits GET route instead of `getCredits` directly.
export async function ensureJoinerBonus(label: string, ownerAddress: string): Promise<number> {
  const joinedRaw = await kvGet(labelKey('fax-joined', label));
  if (joinedRaw !== null) {
    return getCredits(label);
  }

  const countRaw = await kvGet(JOINER_COUNT_KEY);
  const count = countRaw ? parseInt(countRaw, 10) || 0 : 0;
  const granted = count < FIRST_JOINER_CAP ? FIRST_JOINER_BONUS_CREDITS : BASE_FREE_CREDITS;

  await Promise.all([
    setCredits(label, granted, ownerAddress),
    kvPut(labelKey('fax-joined', label), String(granted), ownerAddress),
    ...(count < FIRST_JOINER_CAP ? [kvPut(JOINER_COUNT_KEY, String(count + 1), ownerAddress)] : []),
  ]);

  return granted;
}

/// Tops an account's credits up to MONTHLY_FREE_SENDS once per calendar month
/// (UTC), keyed by `fax-credits-month:{label}`. Never removes credits — earned
/// credits above the floor carry over.
export async function ensureMonthlyCredits(label: string, ownerAddress: string): Promise<number> {
  const month = currentMonth();
  const mKey = labelKey('fax-credits-month', label);
  if ((await kvGet(mKey)) === month) {
    return getCredits(label);
  }
  const current = await getCredits(label);
  const next = Math.max(current, MONTHLY_FREE_SENDS);
  await Promise.all([
    setCredits(label, next, ownerAddress),
    kvPut(mKey, month, ownerAddress),
  ]);
  return next;
}

/// Entry point for the credits GET route: applies the first-joiner launch
/// bonus, then the monthly basic-tier allowance.
export async function ensureCreditsAllowance(label: string, ownerAddress: string): Promise<number> {
  await ensureJoinerBonus(label, ownerAddress);
  return ensureMonthlyCredits(label, ownerAddress);
}

/// Reset an account's thermal-fade jam and refill to the monthly allowance.
export async function clearJam(label: string, ownerAddress: string): Promise<number> {
  const now = Date.now();
  await Promise.all([
    setCredits(label, MONTHLY_FREE_SENDS, ownerAddress),
    setLastReceived(label, now, ownerAddress),
    setLastForwarded(label, now, ownerAddress),
  ]);
  return MONTHLY_FREE_SENDS;
}
