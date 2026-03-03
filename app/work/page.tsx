import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/ui/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { getProjects } from "@/lib/content";
import type { Project } from "@/lib/types";

export const revalidate = 60;

function safeTags(tags: unknown): string[] {
  if (!Array.isArray(tags)) return [];
  return tags.filter((tag): tag is string => typeof tag === "string");
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const tags = safeTags(project.tags);
  const isFirst = index === 0;

  return (
    <Reveal delay={index * 0.05}>
      <Link
        href={`/work/${project.slug}`}
        className={`work-archive__card ${isFirst ? "work-archive__card--full" : ""}`}
      >
        {project.posterImageUrl ? (
          <Image
            src={project.posterImageUrl}
            alt={project.title}
            fill
            sizes={isFirst ? "100vw" : "(max-width: 900px) 100vw, 50vw"}
            className="work-archive__img"
          />
        ) : (
          <div className="work-archive__gradient" />
        )}

        <div className="work-archive__overlay">
          <p className="work-item__client">{project.client}</p>
          <h2 className="work-archive__title">{project.title}</h2>
          {tags.length > 0 && (
            <p className="work-archive__tags">{tags.slice(0, 3).join(" · ")}</p>
          )}
        </div>
      </Link>
    </Reveal>
  );
}

export default async function WorkPage() {
  const allProjects = await getProjects();
  const projects = allProjects.filter((p) => typeof p.slug === "string" && p.title);

  return (
    <main>
      <PageHero
        eyebrow="Work"
        title="Selected projects."
        description="Campaign films, visuals, and motion."
      />

      <section className="section">
        <div className="container">
          <div className="work-archive__grid">
            {projects.map((project, index) => (
              <ProjectCard key={project._id} project={project} index={index} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
