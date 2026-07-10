/**
 * Shared runtime configuration constants.
 * Import from here — never redeclare locally.
 */

export const WORKER_URL =
  process.env.NFTMAIL_WORKER_URL ||
  'https://worker.nftmail.box';
