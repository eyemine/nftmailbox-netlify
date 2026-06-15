/**
 * Adds X-Worker-Secret header to all nftmail.box API routes that call the Cloudflare Worker.
 * Safe to run multiple times — skips files already patched.
 */
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const FILES = [
  'app/api/upgrade-tier/route.ts',
  'app/api/burn/route.ts',
  'app/api/inbox/route.ts',
  'app/api/toggle-privacy/route.ts',
  'app/api/molt-to-private/route.ts',
  'app/api/register-trial/route.ts',
  'app/api/admin/stats/route.ts',
  'app/api/audit-log/route.ts',
  'app/api/mcp/route.ts',
  'app/api/moonpay-webhook/route.ts',
  'app/api/send-email/route.ts',
  'app/api/claim-inbox/route.ts',
  'app/api/sentbox/route.ts',
  'app/api/resolve-privacy/route.ts',
  'app/api/backfill-registration/route.ts',
  'app/api/resolve-nftmail/route.ts',
  'app/api/mini-upgrade/route.ts',
  'app/api/gnosis-mint/route.ts',
  'app/api/claim-sovereign/route.ts',
  'app/api/agent-lookup/route.ts',
  'app/api/gasless-mint/route.ts',
  'app/api/forwarding/[name]/route.ts',
];

const ROOT = new URL('..', import.meta.url).pathname;
const SECRET_LINE = `const WORKER_SECRET = process.env.WORKER_SECRET || '';`;

// Patterns that mark "this line is where we declare the worker URL" — insert WORKER_SECRET after
const URL_DECL_RE = /^(const (?:WORKER_URL|NFTMAIL_WORKER_URL|workerUrl)\s*=\s*process\.env\.[A-Z_]+.*);?\s*$/m;

// Pattern: 'Content-Type': 'application/json' inside a worker fetch call headers object
// We add the secret header immediately after it
const CT_RE = /('Content-Type':\s*'application\/json')/g;

let totalPatched = 0;

for (const rel of FILES) {
  const path = resolve(ROOT, rel);
  let src;
  try { src = readFileSync(path, 'utf8'); } catch { console.log(`  SKIP (not found): ${rel}`); continue; }

  if (src.includes('X-Worker-Secret')) {
    console.log(`  ALREADY PATCHED: ${rel}`);
    continue;
  }

  let modified = src;

  // 1. Insert WORKER_SECRET declaration after the worker URL line
  if (!modified.includes(SECRET_LINE)) {
    modified = modified.replace(URL_DECL_RE, (match) => `${match}\n${SECRET_LINE}`);
    // Fallback: if no URL_DECL_RE match, insert after first import block
    if (!modified.includes(SECRET_LINE)) {
      // Find last import line
      const lastImport = [...modified.matchAll(/^import .+;?\s*$/gm)].pop();
      if (lastImport) {
        const insertAt = lastImport.index + lastImport[0].length;
        modified = modified.slice(0, insertAt) + `\n${SECRET_LINE}` + modified.slice(insertAt);
      }
    }
  }

  // 2. Add X-Worker-Secret header after Content-Type in worker fetch calls
  modified = modified.replace(CT_RE, `$1, 'X-Worker-Secret': WORKER_SECRET`);

  if (modified === src) {
    console.log(`  NO CHANGE (pattern not found): ${rel}`);
    continue;
  }

  writeFileSync(path, modified, 'utf8');
  console.log(`  PATCHED: ${rel}`);
  totalPatched++;
}

console.log(`\nDone. Patched ${totalPatched} files.`);
