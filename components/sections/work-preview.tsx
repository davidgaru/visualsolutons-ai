import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import type { Project } from "@/lib/types";

type WorkPreviewProps = {
  projects: Project[];
};

function safeTags(tags: unknown): string[] {
  if (!Array.isArray(tags)) return [];
  return tags.filter((tag): tag is string => typeof tag === "string");
}

export function WorkPreview({ projects }: WorkPreviewProps) {
  const valid = projects.filter((p) => typeof p.slug === "string" && p.title);
  if (valid.length === 0) return null;

  const featured = valid[0];
  const secondary = valid.slice(1, 3);

  return (
    <section className="neo-work">
      <div className="container">
        <Reveal>
          <p className="eyebrow">Work</p>
          <h2>Selected films and campaign visuals.</h2>
        </Reveal>

        <div className="neo-work__grid">
          <Reveal>
            <Link href={`/work/${featured.slug}`} className="neo-work__card neo-work__card--hero">
              {featured.posterImageUrl ? (
                <Image
                  src={featured.posterImageUrl}
                  alt={featured.title}
                  fill
                  sizes="(max-width: 900px) 100vw, 1280px"
                  className="neo-work__card-img"
                />
              ) : (
                <div className="neo-work__card-gradient" />
              )}
              <div className="neo-work__card-overlay" />
              <div className="neo-work__card-content">
                <p className="neo-work__card-client">{featured.client}</p>
                <h3 className="neo-work__card-title neo-work__card-title--hero">{featured.title}</h3>
                <p className="neo-work__card-summary">{featured.summary}</p>
              </div>
            </Link>
          </Reveal>

          {secondary.map((project, index) => {
            const tags = safeTags(project.tags);
            return (
              <Reveal key={project._id} delay={(index + 1) * 0.08}>
                <Link href={`/work/${project.slug}`} className="neo-work__card">
                  {project.posterImageUrl ? (
                    <Image
                      src={project.posterImageUrl}
                      alt={project.title}
                      fill
                      sizes="(max-width: 900px) 100vw, 50vw"
                      className="neo-work__card-img"
                    />
                  ) : (
                    <div className="neo-work__card-gradient" />
                  )}
                  <div className="neo-work__card-overlay" />
                  <div className="neo-work__card-content">
                    <p className="neo-work__card-client">{project.client}</p>
                    <h3 className="neo-work__card-title">{project.title}</h3>
                    {tags.length > 0 && (
                      <p className="neo-work__card-tags">{tags.slice(0, 3).join(" · ")}</p>
                    )}
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.24}>
          <Link href="/work" className="button">
            View Full Archive
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
