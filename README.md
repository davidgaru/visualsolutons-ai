# Visual Solutions AI Website

Cinematic, animation-heavy company website for **Visual Solutions AI**.

## Stack

- Next.js (App Router, TypeScript)
- Three.js (`@react-three/fiber`) for cinematic light atmosphere
- Framer Motion for fluid page and section transitions
- Sanity CMS (content editing + video upload-ready schemas)

## Pages

- Home
- Services
- Work
- About
- Contact
- Blog
- Privacy Policy
- Terms
- Sanity Studio at `/studio`

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment template:

```bash
cp .env.example .env.local
```

3. Fill in Sanity values in `.env.local`:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=...
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01
SANITY_API_READ_TOKEN=...
BOOKING_FORWARD_EMAIL=
```

4. Run dev server:

```bash
npm run dev
```

## Sanity CMS notes

- `project` schema supports:
  - YouTube URL (`mediaType: youtube`)
  - direct uploaded video files (`mediaType: upload`)
  - placeholder mode (`mediaType: none`)
- `post` schema is simplified for success/update posts.
- `service` schema supports editable service blocks.

## Booking flow notes

Current booking form posts to `app/api/booking-request/route.ts`.
It is intentionally a placeholder route to connect later with:

- email notification provider
- calendar provider (Cal.com / Google Calendar / Calendly)
- CRM/database

## Next content actions

1. Maintain founder profiles in Studio → Site Settings → Founders after the initial [CMS synchronization](docs/founder-sources.md#cms-synchronization).
2. Add real case studies and upload videos in Sanity Studio.
3. Add official legal copy for privacy and terms.
4. Add your final contact email and optional booking URL.

## Brand assets

- Primary logo image in active use: `public/images/visualsolutionsai_logo.jpeg`

## Media delivery

The original footage is preserved alongside compact and desktop delivery versions.
Run `python3 scripts/optimize-media.py` after adding or replacing local footage,
then `python3 scripts/validate-media.py` and `npm run test:media` to verify it.
The generator requires ffmpeg. See [delivery measurements and validation](docs/performance.md).
CMS project videos use the authenticated `scripts/optimize-cms-media.ts` generator;
commit `lib/cms-media-manifest.json` after uploading their delivery versions.

Deploy the source project with `public/videos/optimized` and
`lib/media-manifest.json` together; they contain the matched delivery URLs.
# visualsolutions-ai
