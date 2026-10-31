# Founder profiles

Researched and published to Sanity on 2026-10-31. The founder relationship is supplied by the company owner and confirmed in BMG’s interview. The About page reads `siteSettings.founders` in Sanity with a five-minute revalidation interval; `lib/founder-data.ts` provides the initial researched content if CMS data is unavailable. Edit the profiles in Studio → Site Settings → Founders. Both portraits are uploaded Sanity image assets, with source attribution preserved.

## David Vashadze

- [AI Filmfest Athens official speaker biography](https://www.aifilmfestathens.gr/en): founder/CEO of Visual Solutions AI, former Georgian Film Commissioner, more than 20 years in film; helped attract *Fast & Furious 9* and *Extraction 2* and develop Georgia’s film incentive framework. These are film commissioning credentials, not claims that he directed or produced those features.
- [Speaker portrait](https://www.aifilmfestathens.gr/images/speakers/david-vashadze.jpg), credited to AI Filmfest Athens, uploaded to Sanity for first-party asset delivery.
- [EAVE professional network](https://eave.org/network/21402) independently lists his film industry background.

## Daviti Garuchava

- [Forbes Georgia 2026 Under 30 winners](https://forbes.ge/2026-tslis-under-30-is-gamarjvebulebi-ukve-tsnobilia-future-is-under-30/), September 21, 2026: lists დავითი გარუჩავა (Daviti Garuchava), AGBO creative developer, in Art & Style. The credential is specifically **Forbes Georgia Under 30, 2026**, not the US Forbes list.
- [TIME: Jon Snow supercut](https://time.com/4391364/game-of-thrones-jon-snow-supercut/), July 1, 2016: features his work as The Garo Studios (article misspells surname as “Garuchara”). This supports **work featured in TIME**, not a TIME award or TIME100 inclusion.
- [Beka Film Productions official biography](https://bekafilmproductions.com/about-us/): AGBO experience, TheGaroStudios, trailer work on *Shindisi*, *Negative Numbers*, *Brighton 4th*, *Invisible Games*, and *From Life to Life*. Omitted dated student status and audience counts.
- [Personal LinkedIn profile](https://www.linkedin.com/in/daviti-garuchava-82a750134) links TheGaroStudios and confirms the identity across these sources.
- [TheGaroStudios YouTube channel](https://www.youtube.com/@TheGaroStudios) is the destination for Daviti’s “Film & trailer editing” link.
- [BMG company interview](https://bm.ge/news/visual-solutions-ai-qartuli-startapi-romelits-kinosa-da-sareklamo-industriashi-globalur-proeqtebze-mushaobs), January 14, 2026, names both founders.
- Portrait copied unchanged from the founder’s own local portfolio cover into `public/images/daviti-garuchava.png`, and uploaded to Sanity. Visually verified cover explicitly titled “Daviti Garuchava”, showing him working with film lighting equipment. CSS frames the portrait in the lower part of the cover. Next.js serves responsive compressed derivatives; no generated or unrelated portrait is used.

No AI-generated or unrelated portraits should be substituted. Founder images use responsive Next.js image delivery and lazy loading.

## CMS synchronization

The local Studio schema, both founder profiles, source links and both portrait assets were published to project `8qq16vmi`, dataset `production`, on 2026-10-31 after network access was enabled. Founder content is stored in the published `siteSettings` document. The frontend prefers each uploaded `portrait.asset` over its fallback `portraitUrl`.

The frontend uses Sanity’s image URL builder so Studio crop settings are respected. Visual review at desktop (1440px) and mobile (390px) confirmed the two profiles, readable source links, and Daviti’s portrait framing without the portfolio title over his face. David’s supplied speaker announcement image includes promotional text alongside his photo; the published non-destructive Studio crop isolates the right-hand portrait while preserving the original asset.

For a fresh dataset, deploy the local schema and import the initial profiles from an authenticated environment:

```sh
NEXT_PUBLIC_SANITY_PROJECT_ID=8qq16vmi NEXT_PUBLIC_SANITY_DATASET=production npx sanity schema deploy
NEXT_PUBLIC_SANITY_PROJECT_ID=8qq16vmi NEXT_PUBLIC_SANITY_DATASET=production npx sanity exec scripts/seed-founders.ts --with-user-token
```

The seed script preserves existing founder content, uploads the source portraits and uses the authenticated Studio user; no API token is embedded in the script. Website code deployment is managed separately from the published CMS content.
