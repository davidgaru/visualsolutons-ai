import { notFound } from "next/navigation";
import { getPostBySlug, getPosts } from "@/lib/content";
import { PortableTextRenderer } from "@/components/ui/portable-text-renderer";

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
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
      <article className="article">
        <div className="container">
          <p className="eyebrow">{new Date(post.publishedAt).toLocaleDateString("en-US")}</p>
          <h1>{post.title}</h1>
          <p className="article__excerpt">{post.excerpt}</p>
          <div className="article__body">
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
