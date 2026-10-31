# Website delivery improvements

All source videos remain in `public/videos`. Delivery versions retain the full clip
and audio; desktop versions retain the source dimensions. Small screens, data saver,
and connections reported as slow (including desktop links below 8 Mbps) receive compact versions of the same footage.
Opening a cinema view uses the desktop version.

Measured local asset sizes (decimal MB; these totals describe the media library,
not the bytes downloaded on a single page):

| Footage | Original | Desktop delivery | Compact delivery |
| --- | ---: | ---: | ---: |
| First homepage clip | 34.02 MB | 11.97 MB | 1.73 MB |
| All 23 clips | 210.57 MB | 78.04 MB | 18.52 MB |

The compact library is 91.2% smaller; the desktop library is 62.9% smaller.
The first clip is 94.9% smaller on compact delivery.

The 13 CMS project films total 391.02 MB in their original form, 263.37 MB in
desktop delivery, and 60.13 MB in compact delivery (84.6% smaller). The largest
featured film changes from 118.29 MB to 7.69 MB for compact playback, retaining
its full 44.7-second duration and audio. These are library/file measurements,
not a claim that every visitor downloads the entire library.

Videos receive a small poster before loading, attach their footage when visible,
and pause offscreen or in hidden tabs. Service and work carousels stop advancing
offscreen. The featured carousel's slide list is memoized so progress updates no
longer continually reset the slide timer. Existing CMS films also have compact
and desktop delivery assets in Sanity. `lib/cms-media-manifest.json` maps each
original asset URL to its delivery versions, preserving project documents and
original footage. Unknown or newly replaced uploads still play their original
source until the CMS generator is rerun. Sanity posters are resized for delivery.

MP4 metadata precedes media data so playback can start before the full download.
Delivery asset names include a source hash and receive a one-year immutable cache
policy. Replacing footage and rerunning the generator creates new URLs. Next.js
image resizing covers image comparisons, and article embeds load lazily.

The homepage's existing Three.js lighting is loaded after the initial document.
Next.js reported initial homepage JavaScript was 369 kB in an unchanged baseline
production build; the final optimized build reports 157 kB (57% smaller).
This is a build measurement; no claim is made about real-user loading times.

## Regenerate and verify

Requires Python 3 and ffmpeg with the libx264 encoder:

```sh
python3 scripts/optimize-media.py
python3 scripts/validate-media.py
npm run test:media
npm run lint
npm run build
```

To prepare delivery versions for new Sanity project videos, sign into the project
with `npx sanity login`, then run:

```sh
NEXT_PUBLIC_SANITY_PROJECT_ID=8qq16vmi NEXT_PUBLIC_SANITY_DATASET=production npx sanity exec scripts/optimize-cms-media.ts --with-user-token
```

Commit the updated CMS delivery manifest with the website changes. The generator
uploads derivatives to Sanity, validates full duration, desktop dimensions and
audio, and records sizes in `docs/cms-media-sizes.json`. Compact CMS videos use
960-pixel maximum width with a 1.6 Mbps video bitrate ceiling.

`docs/media-sizes.json` records individual file sizes. The media validator checks
all 46 delivery files for full duration, desktop dimensions, audio preservation,
H.264/yuv420p compatibility and fast-start metadata. Eleven DOM tests cover deferred
requests, desktop/mobile/data-saver selection, hidden tabs, cinema initialization,
ref forwarding, source changes and CMS sources.

Desktop (1440 pixels) and mobile (390 pixels) Chrome checks cover both founder
portraits and source links, mobile overflow, deferred homepage media, comparison
playback and cinema controls. These are functional checks rather than a claim
about real-user connection speeds or a Lighthouse score.

## Final validation, 2026-10-31

- Production build, TypeScript and ESLint passed.
- Eleven media component tests passed.
- All 23 original clips and 46 delivery files passed media validation.
- All 26 delivery files for the 13 CMS films passed duration, audio, desktop
  dimensions, H.264/yuv420p and fast-start checks.
- Generated production HTML includes both founder biographies and portraits,
  sourced Forbes and TIME links, and every original homepage video player.
- Browser interaction checks passed after network and browser access was enabled.

Technical references: [Next.js lazy loading](https://nextjs.org/docs/14/app/building-your-application/optimizing/lazy-loading)
and [responsive image delivery](https://nextjs.org/docs/14/app/api-reference/components/image).
