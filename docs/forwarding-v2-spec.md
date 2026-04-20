# Forwarding v2 — Signed Config + Transfer Listener

**Status:** Draft · v0.1 · 2026-04-20
**Authors:** ghostagent.ninja core
**Replaces:** per-email RPC ownership check in `workers/nftmail-email-worker/src/forwarding.ts`

---

## 1. Goals

1. **Remove the per-email RPC call** that re-verifies NFT ownership on every inbound forward.
2. **Prove authorization cryptographically** — a signed message from the NFT owner is the forwarding credential, not a session/wallet-match heuristic.
3. **Invalidate on transfer** — when an NFT changes hands, the old forwarding config dies automatically.
4. **Skip invalidation for soulbound (Ghost-tier) accounts** — ERC-5192 guarantees the owner can never change.
5. **Lay groundwork for other transfer-triggered actions** (notify-on-transfer, ECIES rotation, transfer history UI, etc.).

## 2. Non-goals

- On-chain storage of the forwarding target email (stays in KV — email addresses are PII).
- Changes to the inbound Mailgun path or ECIES pipeline.
- Backward-compatible reads — old KV configs will be migrated, not dual-read.

---

## 3. Current architecture (for reference)

```
Inbound email arrives at Mailgun → worker email() handler
  → checkForwardingConfig(env, agentName)           [KV read: forwarding:{name}]
  → verifyNFTOwner(tokenId) via eth_call            [RPC call — HOT PATH]
  → if config.ownerAddress !== currentOwner: disable forwarding
  → else: forwardEmail(...)
```

**Problem:** every inbound mail triggers an RPC round-trip. Scales poorly and adds a dependency on Gnosis RPC availability in the hot path.

---

## 4. Proposed architecture

```
                    ┌────────────────────────────┐
Owner (browser) ───►│ Sign EIP-712 forwarding    │
                    │ authorization message      │
                    └──────────┬─────────────────┘
                               │ POST /api/forwarding/{name}
                               ▼
                    ┌────────────────────────────┐
                    │ Next.js API route          │
                    │ - verify signature         │
                    │ - check onChainOwner       │  (ONE RPC call, at config time)
                    │ - store in KV              │
                    └──────────┬─────────────────┘
                               │
                               ▼
                    ┌────────────────────────────┐
                    │ KV: forwarding:{tokenId}   │
                    │ { target, level, sig,      │
                    │   owner, chainId, nonce,   │
                    │   expiresAt?, signedAt }   │
                    └──────────┬─────────────────┘
                               │
         Inbound email ────────┤
                               ▼
                    ┌────────────────────────────┐
                    │ Worker forward path        │
                    │ - read KV (1 op, NO RPC)   │
                    │ - forward if config valid  │
                    └────────────────────────────┘

                    ┌────────────────────────────┐
  Gnosis Transfer ─►│ Transfer listener (Durable │
  event (tokenId)   │ Object / cron / webhook)   │
                    │ - invalidate KV config     │
                    │ - (future) notify new      │
                    │   owner, rotate ECIES etc. │
                    └────────────────────────────┘
```

**Hot path becomes zero-RPC.** Authorization is proven by the stored signature; freshness is enforced by the Transfer listener.

---

## 5. EIP-712 authorization message

```ts
const DOMAIN = {
  name: 'nftmail.box Forwarding',
  version: '1',
  chainId: 100,                                    // Gnosis mainnet
  verifyingContract: '0x0000…0000',                // placeholder (no on-chain verifier)
};

const TYPES = {
  ForwardingAuthorization: [
    { name: 'tokenId',     type: 'uint256' },
    { name: 'registrar',   type: 'address' },      // e.g. molt.gno registrar contract
    { name: 'targetEmail', type: 'string'  },      // hashed before signing? see §5.1
    { name: 'level',       type: 'string'  },      // 'full' | 'stealth'
    { name: 'enabled',     type: 'bool'    },
    { name: 'nonce',       type: 'uint256' },      // monotonic per (tokenId, owner)
    { name: 'signedAt',    type: 'uint256' },      // unix seconds
    { name: 'expiresAt',   type: 'uint256' },      // 0 = no expiry
  ],
};
```

### 5.1 Target email privacy

Two options, pick one:

- **A. Plain `targetEmail`** in the signed payload (simpler). Email leaks to anyone with KV read access; signature recoverable by anyone with the stored bundle.
- **B. Hash-committed**: signature covers `keccak256(targetEmail || salt)`. Target email + salt stored separately, encrypted under a per-tenant key. Signature alone can't reveal target.

Recommend **A for v2.0** (simplicity; KV access is already restricted to the worker + `WEBHOOK_SECRET`), upgrade to B if we ever expose KV reads publicly or add third-party verification.

### 5.2 Nonce semantics

- Monotonically increasing per `(tokenId, owner)`.
- Tracked in KV: `forwarding-nonce:{tokenId}`.
- Every new signature must use `currentNonce + 1`.
- Prevents replay of a stale "enable" signature after a "disable".

### 5.3 Expiry

- `expiresAt: 0` means no expiry (recommended default).
- Non-zero allows opt-in auto-disable (e.g. "forward for 7 days only"). Checked cheaply in the hot path.

---

## 6. Storage schema changes

### 6.1 KV keys

| Key | Value | Notes |
|---|---|---|
| `forwarding:{tokenId}` | JSON blob (§6.2) | was `forwarding:{agentName}` — rekey to tokenId for transfer-stability |
| `forwarding-nonce:{tokenId}` | integer | replay protection |
| `forwarding-owner:{tokenId}` | `0x…` | last observed on-chain owner; invalidated by Transfer listener |
| `tokenid-to-name:{tokenId}` | `ghostagent` | reverse lookup for inbound (localPart → tokenId via `name-to-tokenid:{name}`) |

### 6.2 Forwarding blob

```json
{
  "tokenId": 3199,
  "registrar": "0x4b54213c1e5826497ff39ba8c87a7b75d2bc3c50",
  "owner":    "0xf251…1249",
  "targetEmail": "you@gmail.com",
  "level":       "full",
  "enabled":     true,
  "nonce":       3,
  "signedAt":    1745120000,
  "expiresAt":   0,
  "signature":   "0x…",
  "signatureVersion": 1
}
```

### 6.3 Migration (one-shot)

- For every existing `forwarding:{agentName}` key: resolve agentName → tokenId via registrar, rekey to `forwarding:{tokenId}`, stamp `nonce: 0`, `signedAt: 0`, `signature: null`, and flag `legacy: true`.
- Legacy configs keep working for 14 days with a banner "Re-sign your forwarding to migrate to v2", then auto-disable.

---

## 7. API route changes — `/api/forwarding/{name}` (POST)

```ts
// Request body
{
  targetEmail: string,
  level: 'full' | 'stealth',
  enabled: boolean,
  expiresAt?: number,
  signature: `0x${string}`,          // EIP-712 sig from ForwardingSetup
  signedAt:  number,
  nonce:     number,
}

// Server-side validation (in order)
1. Resolve name → tokenId via registrar read.
2. Fetch on-chain owner ONCE (cached 60s per tokenId).
3. Verify EIP-712 signature recovers to that owner address.
4. Load forwarding-nonce:{tokenId}; reject if req.nonce ≤ stored.
5. Store bundle in forwarding:{tokenId}. Bump forwarding-nonce:{tokenId}.
6. Snapshot observed owner in forwarding-owner:{tokenId}.
```

**One RPC call per config change** (plus one cached owner read). Never called on the hot path.

## 8. Worker hot path

```ts
// Before (today):
const cfg = await env.INBOX_KV.get(`forwarding:${agentName}`);
const currentOwner = await verifyNFTOwner(tokenId);   // 🔴 RPC
if (cfg.ownerAddress !== currentOwner) { disable; return; }
await forwardEmail(env, cfg, email);

// After (v2):
const tokenId = await env.INBOX_KV.get(`name-to-tokenid:${agentName}`);
const cfg = await env.INBOX_KV.get(`forwarding:${tokenId}`);
if (!cfg?.enabled) return;
if (cfg.expiresAt && cfg.expiresAt < nowSec()) return;
await forwardEmail(env, cfg, email);                  // ✅ zero RPC
```

---

## 9. Transfer listener

### 9.1 Event source

Gnosis `Transfer(address from, address to, uint256 tokenId)` emitted by each registrar:
- `molt.gno`     → `0x4b54213c1e5826497ff39ba8c87a7b75d2bc3c50`
- `openclaw.gno` → `0xbD8285A8455CCEC4bE671D9eE3924Ab1264fcbbe`
- (extend as new SLDs are deployed — use the registry from `app/services/erc8004-registration.ts`)

### 9.2 Delivery mechanisms — pick one

| Option | Pros | Cons |
|---|---|---|
| **Cloudflare Durable Object + WebSocket to a Gnosis archive node** | Real-time, low latency | Requires a persistent connection; node dependency |
| **Cron worker (every 60s) polling `eth_getLogs`** | Simple, stateless, already in the CF Workers stack | 60s invalidation lag |
| **Alchemy/QuickNode webhook → worker endpoint** | Real-time, managed | External dependency + cost |
| **Graph node subgraph + webhook** | Queryable history for UI | Heavy for a single event type |

**Recommend** the cron-poll approach (option 2) for v2.0:
- Already compatible with CF Workers.
- 60s lag is acceptable — a forwarding config that shouldn't exist for 60 extra seconds is tolerable compared to zero-RPC gains.
- Upgrade to webhook later if latency matters.

### 9.3 Invalidation pseudocode

```ts
// Runs on cron, every 60s
for (const registrar of REGISTRARS) {
  const fromBlock = await kv.get(`xfer-cursor:${registrar}`) ?? LATEST - 200;
  const logs = await eth_getLogs({
    address: registrar,
    topics: [TRANSFER_TOPIC],
    fromBlock, toBlock: 'latest',
  });

  for (const log of logs) {
    const tokenId = parseTokenId(log);
    const newOwner = parseTo(log);

    // Skip soulbound: Ghost tier ERC-5192 tokens can't emit Transfer for real ownership changes
    // (they emit Locked once at mint; any subsequent Transfer would be a bug — still handled safely).
    if (await isSoulbound(tokenId)) continue;

    // Invalidate forwarding
    await kv.delete(`forwarding:${tokenId}`);
    await kv.put(`forwarding-owner:${tokenId}`, newOwner);
    // Keep nonce — new owner starts at storedNonce + 1

    // Future hooks (gated behind feature flags):
    //   - notifyNewOwner(tokenId, newOwner)
    //   - rotateEciesKey(tokenId)
    //   - recordTransferTimeline(tokenId, from, to, block)
  }

  await kv.put(`xfer-cursor:${registrar}`, latestBlock);
}
```

### 9.4 Soulbound special-case

For ERC-5192 tokens (Ghost tier):
- Mint emits a one-time `Transfer(0x0, owner, tokenId)` + `Locked(tokenId)`.
- No subsequent transfers are possible by spec.
- Listener sees only the mint event → treats as a "register" signal, not an invalidation.

Implementation: check `isSoulbound(tokenId)` via the registrar's `locked()` view before invalidating. Skip if true.

---

## 10. Future hooks enabled by the Transfer listener

Not in v2.0 scope, but the same pipeline cleanly supports:

- **Welcome email** to new owner (from `no-reply@nftmail.box` via Mailgun).
- **ECIES key rotation alert** — new owner has no decryption key; old messages are unreadable. Push a dashboard banner explaining this.
- **Transfer timeline** in `/dashboard` — "acquired 2d ago, previously 0xabc… for 47d".
- **Reputation carryover** — if agent has `ERC-8004` identity, rewrite it to new owner's address.
- **Royalty** — if registrar supports EIP-2981, notify royalty collector.

Design each as a handler plugged into the listener loop, not as bespoke services.

---

## 11. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Cron worker misses blocks (CF Worker downtime) | Store `xfer-cursor` per registrar; replay missed ranges on next run. |
| User transfers NFT then sends inbound email within 60s (forwarding still active) | Acceptable — reduce poll interval to 15s if observed in prod. |
| Nonce collisions from concurrent signs on two devices | Atomic `compare-and-swap` on `forwarding-nonce` key. |
| Malicious signer with old owner's leaked signature | Nonce + transfer invalidation both defend; stale signature against current nonce is rejected. |
| Gnosis RPC flakiness at config time | Fallback: accept signature, defer owner check to next cron pass (mark config `pending-verification`). |

---

## 12. Migration plan

1. **Phase 1 — listener-only (this spec):** deploy cron worker that maintains `forwarding-owner:{tokenId}` and invalidates on transfer. Hot path still does per-email RPC (no behavior change). Verify the listener catches all transfers on mainnet for 7d.
2. **Phase 2 — signed config:** add EIP-712 signing flow to `ForwardingSetup.tsx`, update API route to require + store signatures. Migrate existing configs on first re-save.
3. **Phase 3 — remove RPC from hot path:** once Phase 2 has saturated (≥14d, >95% of active configs migrated), drop the `verifyNFTOwner` call from the worker `email()` handler. Legacy configs auto-disable.

---

## 13. Open questions

- Do we need cross-chain support (Base has a separate registrar)? For v2.0, scope to Gnosis only; Base registrars emit Transfer too, so the listener architecture generalizes — just add chain-aware cursors.
- Should the signed message include a human-readable `statement` field (à la SIWE) so wallet UIs render "Authorizing forwarding for ghostagent.molt.gno to you@gmail.com" clearly?
- Should expiry default to 90 days instead of never? Operationally safer, adds UX friction.

---

## 14. Implementation surface summary

| File | Change |
|---|---|
| `app/components/ForwardingSetup.tsx` | Add EIP-712 sign step via `wagmi/privy` before POST |
| `app/api/forwarding/[name]/route.ts` | Verify signature + nonce; store v2 bundle |
| `workers/nftmail-email-worker/src/forwarding.ts` | Read by tokenId, drop RPC call |
| `workers/nftmail-email-worker/src/transfer-listener.ts` | **New** — cron-polled Transfer indexer |
| `workers/nftmail-email-worker/wrangler.toml` | Add cron trigger (`crons = ["*/1 * * * *"]`) |
| `docs/forwarding-v2-spec.md` | This file |

No contract changes required. Registrars already emit `Transfer`.

---

*Next step: review + sign off on Phase 1 scope, then implement the cron listener as a standalone worker module behind a feature flag.*
