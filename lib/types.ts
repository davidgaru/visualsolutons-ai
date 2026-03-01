export type Service = {
  _id: string;
  title: string;
  summary: string;
  deliverables: string[];
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
};

export type Post = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  publishedAt: string;
};
