import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";

export const sanityClient = createClient({
  projectId: projectId || "placeholder",
  dataset: dataset || "production",
  apiVersion,
  // Prefer fresh data over edge-cached responses for CMS-driven pages.
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN
});
