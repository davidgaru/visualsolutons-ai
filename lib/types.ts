import type { PortableTextBlock } from "@portabletext/react";

export type Service = {
  _id: string;
  title: string;
  summary: string;
  deliverables: string[];
};

export type GalleryImage = {
  _key: string;
  alt?: string;
  caption?: string;
  asset: {
    url: string;
  };
};

export type Project = {
  _id: string;
  title: string;
  slug: string;
  client: string;
  summary: string;
  outcome: string;
  tags: string[];
  mediaType: "youtube" | "upload" | "none";
  videoUrl?: string;
  videoFileUrl?: string;
  posterImageUrl?: string;
  year?: string;
  category?: string;
  featured?: boolean;
  body?: PortableTextBlock[];
  gallery?: GalleryImage[];
};

export type Post = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: PortableTextBlock[] | string | null;
  publishedAt: string;
  featuredImageUrl?: string;
};
