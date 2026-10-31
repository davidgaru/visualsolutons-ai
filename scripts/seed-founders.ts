/** Run with: npx sanity exec scripts/seed-founders.ts --with-user-token */
import { getCliClient } from "sanity/cli";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fallbackFounders } from "../lib/founder-data";

async function main() {
  const client = getCliClient({ apiVersion: "2025-01-01" });
  const settings = await client.fetch<{ _id: string; founders?: unknown[] } | null>(
    '*[_type == "siteSettings" && !(_id in path("drafts.**"))][0]{_id, founders}'
  );
  if (settings?.founders !== undefined) {
    console.log("Founder profiles already exist; no content changed.");
    return;
  }
  const founders = [];
  for (const founder of fallbackFounders) {
    const source = founder.portraitUrl;
    if (!source) throw new Error(`Missing portrait for ${founder.name}`);
    let image: Buffer;
    if (source.startsWith("/")) {
      image = await readFile(resolve(process.cwd(), "public", source.slice(1)));
    } else {
      const response = await fetch(source, { signal: AbortSignal.timeout(30000) });
      if (!response.ok || !response.headers.get("content-type")?.startsWith("image/")) {
        throw new Error(`Could not download portrait for ${founder.name}`);
      }
      image = Buffer.from(await response.arrayBuffer());
    }
    const asset = await client.assets.upload("image", image, {
      filename: source.split("/").pop(),
      creditLine: founder.portraitCredit,
      source: { name: "Founder profile", id: founder._key, url: founder.portraitSourceUrl }
    });
    founders.push({
      ...founder, _type: "founder",
      portrait: {
        _type: "image", asset: { _type: "reference", _ref: asset._id },
        ...(founder._key === "david-vashadze" ? {
          crop: { _type: "sanity.imageCrop", left: 0.465, right: 0, top: 0, bottom: 0.115 }
        } : {})
      },
      ...(founder._key === "david-vashadze" ? { portraitPosition: "center 24%" } : {}),
      credentials: founder.credentials.map((credential) => ({ ...credential, _type: "credential" }))
    });
  }
  if (settings) {
    await client.patch(settings._id).setIfMissing({ founders }).commit();
  } else {
    // An explicit singleton ID also makes repeated first-time runs safe.
    await client.createIfNotExists({ _id: "siteSettings", _type: "siteSettings", siteTitle: "Visual Solutions AI", founders });
  }
  console.log("Founder profiles saved to Site Settings.");
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Founder import failed.");
  process.exitCode = 1;
});
