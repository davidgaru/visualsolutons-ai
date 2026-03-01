import { PageHero } from "@/components/ui/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { getProjects } from "@/lib/content";
import type { Project } from "@/lib/types";

export const revalidate = 60;

function safeTags(tags: unknown): string[] {
  if (!Array.isArray(tags)) return [];
  return tags.filter((tag): tag is string => typeof tag === "string");
}

function renderProjectMedia(project: Project) {
  if ((project.mediaType === "youtube" && project.videoUrl) || (project.videoUrl && !project.videoFileUrl)) {
    return (
      <iframe
        src={project.videoUrl}
        title={project.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  if ((project.mediaType === "upload" && project.videoFileUrl) || (project.videoFileUrl && !project.videoUrl)) {
    return <video src={project.videoFileUrl} autoPlay muted loop playsInline preload="metadata" />;
  }

  return (
    <div className="work-item__placeholder">
      <span>Upload Project Video</span>
      <p>Sanity Studio supports direct video upload per project.</p>
    </div>
  );
}

export default async function WorkPage() {
  const projects = await getProjects();

  return (
    <main>
      <PageHero
        eyebrow="Work"
        title="Selected projects."
        description="Campaign films, visuals, and motion."
      />

      <section className="section">
        <div className="container work-list">
          {projects.map((project, index) => {
            const tags = safeTags(project.tags);

            return (
              <Reveal key={project._id} delay={index * 0.05}>
                <article className="work-item">
                  <div className="work-item__meta">
                    <p className="work-item__client">{project.client}</p>
                    <h2>{project.title}</h2>
                    <p className="work-item__outcome">{tags.slice(0, 3).join(" · ")}</p>
                    <div className="tag-list">
                      {tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>

                  <div className="work-item__visual">{renderProjectMedia(project)}</div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>
    </main>
  );
}
