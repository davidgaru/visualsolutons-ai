import { fallbackPosts, fallbackProjects, fallbackServices } from "@/lib/fallback-data";
import type { Post, Project, Service } from "@/lib/types";
import { sanityClient } from "@/sanity/lib/client";
import { isSanityConfigured } from "@/sanity/env";
import {
  featuredProjectsQuery,
  postBySlugQuery,
  postsQuery,
  projectBySlugQuery,
  projectsQuery,
  servicesQuery
} from "@/sanity/lib/queries";

export async function getServices(): Promise<Service[]> {
  if (!isSanityConfigured) return fallbackServices;

  try {
    const services = await sanityClient.fetch<Service[]>(servicesQuery);
    return services?.length ? services : fallbackServices;
  } catch {
    return fallbackServices;
  }
}

export async function getFeaturedProjects(): Promise<Project[]> {
  if (!isSanityConfigured) return fallbackProjects.filter((p) => p.featured);

  try {
    const projects = await sanityClient.fetch<Project[]>(featuredProjectsQuery);
    return projects?.length ? projects : fallbackProjects.filter((p) => p.featured);
  } catch {
    return fallbackProjects.filter((p) => p.featured);
  }
}

export async function getProjects(): Promise<Project[]> {
  if (!isSanityConfigured) return fallbackProjects;

  try {
    const projects = await sanityClient.fetch<Project[]>(projectsQuery);
    return projects?.length ? projects : fallbackProjects;
  } catch {
    return fallbackProjects;
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (!isSanityConfigured) {
    return fallbackProjects.find((p) => p.slug === slug) ?? null;
  }

  try {
    const project = await sanityClient.fetch<Project | null>(projectBySlugQuery, { slug });
    return project ?? fallbackProjects.find((p) => p.slug === slug) ?? null;
  } catch {
    return fallbackProjects.find((p) => p.slug === slug) ?? null;
  }
}

export async function getPosts(): Promise<Post[]> {
  if (!isSanityConfigured) return fallbackPosts;

  try {
    const posts = await sanityClient.fetch<Post[]>(postsQuery);
    return posts?.length ? posts : fallbackPosts;
  } catch {
    return fallbackPosts;
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!isSanityConfigured) {
    return fallbackPosts.find((post) => post.slug === slug) ?? null;
  }

  try {
    const post = await sanityClient.fetch<Post | null>(postBySlugQuery, { slug });
    return post ?? fallbackPosts.find((entry) => entry.slug === slug) ?? null;
  } catch {
    return fallbackPosts.find((post) => post.slug === slug) ?? null;
  }
}
