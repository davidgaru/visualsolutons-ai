import Link from "next/link";
import Image from "next/image";
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
        <div className="container blog-grid">
          {posts.map((post, index) => (
            <Reveal key={post._id} delay={index * 0.07}>
              <Link href={`/blog/${post.slug}`} className="blog-card">
                <div className="blog-card__image">
                  {post.featuredImageUrl ? (
                    <Image
                      src={post.featuredImageUrl}
                      alt={post.title}
                      fill
                      sizes="(max-width: 700px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="blog-card__placeholder" />
                  )}
                </div>
                <div className="blog-card__body">
                  <p className="blog-card__date">
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </p>
                  <h2 className="blog-card__title">{post.title}</h2>
                  {post.excerpt && (
                    <p className="blog-card__excerpt">{post.excerpt}</p>
                  )}
                  <span className="blog-card__cta">Read article</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
