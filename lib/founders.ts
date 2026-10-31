import "server-only";

import { groq } from "next-sanity";
import { sanityClient } from "@/sanity/lib/client";
import { isSanityConfigured } from "@/sanity/env";
import { urlForImage } from "@/sanity/lib/image";

import { fallbackFounders, type Founder } from "@/lib/founder-data";

const foundersQuery = groq`*[_type == "siteSettings"][0] {
  founders[] {
    _key, name, role, biography, credentials[]{_key, label, url}, portrait,
    "portraitUrl": coalesce(portrait.asset->url, portraitUrl),
    portraitAlt, portraitCredit, portraitSourceUrl, portraitPosition
  }
}.founders`;

export async function getFounders(): Promise<Founder[]> {
  if (!isSanityConfigured) return fallbackFounders;
  try {
    const founders = await sanityClient.fetch<(Founder & { portrait?: Parameters<typeof urlForImage>[0] })[] | null>(
      foundersQuery, {}, { next: { revalidate: 300, tags: ["founders"] } }
    );
    return founders?.map(({ portrait, ...founder }) => ({
      ...founder,
      // Preserve the editor's non-destructive image crop instead of displaying the full asset.
      portraitUrl: portrait ? urlForImage(portrait).width(1280).fit("max").auto("format").url() : founder.portraitUrl
    })) ?? fallbackFounders;
  } catch {
    return fallbackFounders;
  }
}
