import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import type { Project } from "@/lib/types";

type WorkPreviewProps = {
  projects: Project[];
};

const placeholderProject: Project = {
  _id: "placeholder-project",
  title: "Upload First Project",
  slug: "upload-first-project",
  client: "Visual Solutions AI",
  summary: "Add project details in Sanity to populate this section.",
  outcome: "",
  tags: ["Campaign", "Film", "AI"],
  mediaType: "none"
};

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
      <span>Featured Reel</span>
      <p>Upload video in Sanity Studio</p>
    </div>
  );
}

export function WorkPreview({ projects }: WorkPreviewProps) {
  const feed = projects.length > 0 ? projects : [placeholderProject];
  const featured = feed[0];
  const secondary = feed.slice(1, 4);

  return (
    <section className="neo-work">
      <div className="container">
        <Reveal>
          <p className="eyebrow">Work</p>
          <h2>Selected films and campaign visuals.</h2>
        </Reveal>

        <div className="neo-work__layout">
          <Reveal>
            <Link href={`/work/${featured.slug}`} className="neo-work__featured">
              <div className="neo-work__featured-media">{renderProjectMedia(featured)}</div>

              <div className="neo-work__featured-meta">
                <p className="work-item__client">{featured.client}</p>
                <h3>{featured.title}</h3>
                <p>{featured.summary}</p>
              </div>
            </Link>
          </Reveal>

          <div className="neo-work__rail">
            {secondary.map((project, index) => {
              const tags = safeTags(project.tags);

              return (
                <Reveal key={project._id} delay={index * 0.08}>
                  <Link href={`/work/${project.slug}`} className="neo-work__rail-item">
                    <p className="work-item__client">{project.client}</p>
                    <h3>{project.title}</h3>
                    <p>{tags.slice(0, 3).join(" · ")}</p>
                  </Link>
                </Reveal>
              );
            })}

            {secondary.length === 0 && (
              <Reveal delay={0.1}>
                <article className="neo-work__rail-item neo-work__rail-item--placeholder">
                  <p className="work-item__client">Pipeline</p>
                  <h3>More projects coming soon.</h3>
                  <p>Continue adding entries in Sanity to expand this reel.</p>
                </article>
              </Reveal>
            )}
          </div>
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
