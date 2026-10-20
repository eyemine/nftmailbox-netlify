# nftmail.box — Agent Instructions

## Deployment (Hetzner, not Netlify)

- Production source is the **`hetzner-live`** branch. `main` has diverged and still
  contains the pre-2026-10 open proxies; do not deploy it until reconciled.
- Pushing to `hetzner-live` builds `ghcr.io/eyemine/nftmailbox-netlify` in GitHub Actions
  (`.github/workflows/build-image.yml`, tags `latest` + `sha-<short>`). Wait for the run
  whose `head_sha` is your commit.
- Deploy: `ssh root@46.225.158.75`, `cd /opt/nftmail`, set `image:` in
  `docker-compose.yml` to the new `sha-<short>` tag, then
  `docker compose pull && docker compose up -d --force-recreate --no-build`.
  Verify with `docker logs nftmail-nftmail-1 --tail 20`.
- **Never build on the server.** An on-box `next build` OOM-killed dockerd on 2026-09-22.
- `/opt/nftmail/app` on the server is a stale working copy; it is no longer used for builds.

## Security rules

- The worker trusts any request carrying `X-Worker-Secret`. Every route that attaches it
  must authenticate the caller first with `app/lib/caller-auth.ts`
  (`verifyCaller` + `callerOwnsInbox` / `mayReadInboxes`) and allowlist actions.
  Never forward a raw request body with the secret attached.
- Body/query fields such as `fid`, `ownerWallet`, `walletAddress` are claims, not proof.
- Client calls to authenticated routes go through `workerFetch` (`app/lib/worker-fetch.ts`),
  which attaches a Farcaster Quick Auth JWT or a Privy access token.
- Human mail is stored as plaintext at rest; do not claim it is encrypted.
