import Link from "next/link";
import { PageHero } from "@/components/ui/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { getPosts } from "@/lib/content";

export const revalidate = 60;

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <main>
      <PageHero
        eyebrow="Blog"
        title="Studio updates."
        description="Features, milestones, releases."
      />

      <section className="section">
        <div className="container card-grid card-grid--blog">
          {posts.map((post, index) => (
            <Reveal key={post._id} delay={index * 0.07}>
              <article className="card blog-card">
                <p className="blog-card__date">{new Date(post.publishedAt).toLocaleDateString("en-US")}</p>
                <h2>{post.title}</h2>
                <Link href={`/blog/${post.slug}`}>Read article</Link>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
