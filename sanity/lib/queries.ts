import { groq } from "next-sanity";

export const servicesQuery = groq`*[_type == "service"] | order(_createdAt desc) {
  _id,
  title,
  summary,
  deliverables
}`;

export const projectsQuery = groq`*[_type == "project"] | order(_createdAt desc) {
  _id,
  title,
  "slug": slug.current,
  client,
  summary,
  outcome,
  tags,
  mediaType,
  videoUrl,
  "videoFileUrl": videoFile.asset->url,
  "posterImageUrl": posterImage.asset->url
}`;

export const postsQuery = groq`*[_type == "post"] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  body,
  publishedAt
}`;

export const postBySlugQuery = groq`*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  body,
  publishedAt
}`;
