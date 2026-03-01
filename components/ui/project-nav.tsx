import Link from "next/link";

type AdjacentProject = {
  _id: string;
  title: string;
  slug: string;
  posterImageUrl?: string;
};

type ProjectNavProps = {
  prev?: AdjacentProject | null;
  next?: AdjacentProject | null;
};

export function ProjectNav({ prev, next }: ProjectNavProps) {
  if (!prev && !next) return null;

  return (
    <nav className="project-nav">
      <div className="container">
        <div className="project-nav__grid">
          {prev ? (
            <Link href={`/work/${prev.slug}`} className="project-nav__card">
              <span className="eyebrow">Previous</span>
              <span className="project-nav__title">{prev.title}</span>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link href={`/work/${next.slug}`} className="project-nav__card project-nav__card--next">
              <span className="eyebrow">Next</span>
              <span className="project-nav__title">{next.title}</span>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </nav>
  );
}
