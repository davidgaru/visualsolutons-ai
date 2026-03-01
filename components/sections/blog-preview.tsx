import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import type { Post } from "@/lib/types";

type BlogPreviewProps = {
  posts: Post[];
};

export function BlogPreview({ posts }: BlogPreviewProps) {
  return (
    <section className="section section--blog">
      <div className="container">
        <Reveal>
          <p className="eyebrow">Journal</p>
          <h2>Updates, features, and studio milestones.</h2>
        </Reveal>

        <div className="card-grid card-grid--blog">
          {posts.slice(0, 3).map((post, index) => (
            <Reveal key={post._id} delay={index * 0.08}>
              <article className="card blog-card">
                <p className="blog-card__date">{new Date(post.publishedAt).toLocaleDateString("en-US")}</p>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <Link href={`/blog/${post.slug}`}>Read update</Link>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
