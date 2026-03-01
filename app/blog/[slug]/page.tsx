import Image from "next/image";
import { notFound } from "next/navigation";
import { getPostBySlug, getPosts } from "@/lib/content";
import { PortableTextRenderer } from "@/components/ui/portable-text-renderer";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts
    .filter((post) => typeof post.slug === "string")
    .map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return {};

  return {
    title: `${post.title} — Visual Solutions AI`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      ...(post.featuredImageUrl ? { images: [{ url: post.featuredImageUrl }] } : {})
    }
  };
}

export default async function BlogPostPage({
  params
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);

  if (!post) notFound();

  return (
    <main>
      <article className="blog-article">
        <header className="blog-article__header">
          <div className="container">
            <p className="eyebrow">
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </p>
            <h1 className="blog-article__title">{post.title}</h1>
            {post.excerpt && (
              <p className="blog-article__lead">{post.excerpt}</p>
            )}
          </div>
        </header>

        {post.featuredImageUrl && (
          <div className="container">
            <div className="blog-article__hero">
              <Image
                src={post.featuredImageUrl}
                alt={post.title}
                fill
                sizes="(max-width: 900px) 100vw, 1280px"
                priority
              />
            </div>
          </div>
        )}

        <div className="container">
          <div className="blog-article__body">
            {Array.isArray(post.body) ? (
              <PortableTextRenderer value={post.body} />
            ) : post.body ? (
              post.body
                .split("\n")
                .filter(Boolean)
                .map((paragraph) => (
                  <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                ))
            ) : null}
          </div>
        </div>
      </article>
    </main>
  );
}
