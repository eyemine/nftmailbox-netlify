# Fax Chain Letter — Generative Art Pipeline

## Core Concept

A received NFTfax is not just a message; it is a link in an on-chain chain letter.
Each time a fax is forwarded, answered, or "minted into the chain", the image is
composited with the previous link using deterministic 1-bit XOR blending and a
blockchain-seeded glitch pass. The result is a new 1-bit PNG that is:

- **Provenance-aware** — seeded by the tray id, sender/receiver addresses, and block hash.
- **Visually unique** — every chain step introduces jitter, scanlines, and XOR artifacts.
- **Storage-cheap** — final output is a 1-bit bitmap, ideal for on-chain anchors and IPFS.

## Visual Language

- **1-bit palette** — black ink on thermal paper.
- **XOR blend** — incoming fax is XORed with a scaled ghost of the previous chain link.
- **Blockchain-seeded glitch** — seeded by `keccak256(trayId ++ chainIndex ++ blockHash)`.
- **Generative artifacts** — vertical scanline shifts, single-pixel bit-flip runs, and
  "rollover" bars at page edges that look like a mis-fed fax machine.

## Pipeline

1. **Input** — base64 PNG/BMP from `getTrayDocument` and a `chain` array of previous
   tray IDs (or chain index).
2. **Normalize** — resize all links to a canonical 480×N or 1728×2200 canvas using `sharp`.
3. **Greyscale & dither** — convert to 1-bit with Floyd-Steinberg or Bayer dither.
4. **Composite** — XOR each previous link into the new image with a per-link offset
   derived from the seed.
5. **Glitch pass** — seeded row shifts, bit-flip runs, and pixel column inversions.
6. **Output** — 1-bit PNG with `compressionLevel: 9` and an IPFS/Lighthouse pin.

## On-chain Anchor

Each chain link is stored as a tray document and may be minted as an ERC-721/ERC-1155
on Base or Gnosis. Metadata includes:

```json
{
  "name": "Fax Chain #123",
  "description": "1-bit chain-letter artifact",
  "image": "ipfs://<cid>",
  "attributes": [
    { "trait_type": "Chain Index", "value": 3 },
    { "trait_type": "Sender", "value": "alice.agent.gno" },
    { "trait_type": "Recipient", "value": "bob@nftmail.box" },
    { "trait_type": "Block Hash", "value": "0x..." },
    { "trait_type": "Seed", "value": "0x..." }
  ]
}
```

## API Surface

- `POST /api/tray/[id]/chain` — accepts `previousTrayIds: string[]`, returns new tray
  id and chain image.
- `POST /api/tray/[id]/mint` — mints the chain link as an NFT on the requested chain.

## Game Mechanics

- **Forward to grow** — the chain grows only when a recipient forwards a fax.
- **Score** — `chainIndex * entropyBits` + bonus for multi-hop addresses.
- **Burning** — burning a link creates a "lost transmission" glitch variant.

## Next Steps

1. Implement `processFaxChainImage` helper in `app/api/tray/send/route.ts` or a new
   `app/api/tray/[id]/chain/route.ts`.
2. Add a `FaxChainComposer` to the dashboard Fax tray.
3. Implement the `mintChainLink` route on Base/Gnosis.
