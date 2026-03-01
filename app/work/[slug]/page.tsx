import { notFound } from "next/navigation";
import { ProjectDetailHero } from "@/components/sections/project-detail-hero";
import { ProjectGallery } from "@/components/sections/project-gallery";
import { ProjectMetaBar } from "@/components/ui/project-meta-bar";
import { ProjectNav } from "@/components/ui/project-nav";
import { ProjectOutcome } from "@/components/ui/project-outcome";
import { PortableTextRenderer } from "@/components/ui/portable-text-renderer";
import { Reveal } from "@/components/ui/reveal";
import { getProjectBySlug, getProjects } from "@/lib/content";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects
    .filter((project) => typeof project.slug === "string")
    .map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  if (!project) return {};

  return {
    title: `${project.title} — Visual Solutions AI`,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      ...(project.posterImageUrl ? { images: [{ url: project.posterImageUrl }] } : {})
    }
  };
}

export default async function ProjectPage({
  params
}: {
  params: { slug: string };
}) {
  const project = await getProjectBySlug(params.slug);
  if (!project) notFound();

  const allProjects = await getProjects();
  const currentIndex = allProjects.findIndex((p) => p.slug === project.slug);
  const prev = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const next = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

  return (
    <main>
      <ProjectDetailHero project={project} />
      <ProjectMetaBar project={project} />

      <section className="section">
        <div className="container">
          <Reveal>
            <p className="project-summary">{project.summary}</p>
          </Reveal>

          {project.body && Array.isArray(project.body) && project.body.length > 0 && (
            <PortableTextRenderer value={project.body} />
          )}
        </div>
      </section>

      {project.outcome && <ProjectOutcome outcome={project.outcome} />}

      {project.gallery && project.gallery.length > 0 && (
        <ProjectGallery images={project.gallery} />
      )}

      <ProjectNav prev={prev} next={next} />
    </main>
  );
}
