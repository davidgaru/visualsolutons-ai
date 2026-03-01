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
  "tags": coalesce(tags, []),
  mediaType,
  videoUrl,
  "videoFileUrl": videoFile.asset->url,
  "posterImageUrl": posterImage.asset->url,
  year,
  category,
  featured
}`;

export const projectBySlugQuery = groq`*[_type == "project" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  client,
  summary,
  outcome,
  "tags": coalesce(tags, []),
  mediaType,
  videoUrl,
  "videoFileUrl": videoFile.asset->url,
  "posterImageUrl": posterImage.asset->url,
  year,
  category,
  featured,
  body[] {
    ...,
    _type == "image" => {
      ...,
      "asset": { "url": asset->url }
    }
  },
  gallery[] {
    _key,
    alt,
    caption,
    "asset": { "url": asset->url }
  }
}`;

export const adjacentProjectsQuery = groq`{
  "prev": *[_type == "project" && _createdAt < ^._createdAt] | order(_createdAt desc)[0] {
    _id,
    title,
    "slug": slug.current,
    "posterImageUrl": posterImage.asset->url
  },
  "next": *[_type == "project" && _createdAt > ^._createdAt] | order(_createdAt asc)[0] {
    _id,
    title,
    "slug": slug.current,
    "posterImageUrl": posterImage.asset->url
  }
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
  body[] {
    ...,
    _type == "image" => {
      ...,
      "asset": { "url": asset->url }
    }
  },
  publishedAt,
  "featuredImageUrl": featuredImage.asset->url
}`;
