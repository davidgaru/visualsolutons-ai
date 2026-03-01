import type { Project } from "@/lib/types";

type ProjectMetaBarProps = {
  project: Project;
};

function safeTags(tags: unknown): string[] {
  if (!Array.isArray(tags)) return [];
  return tags.filter((tag): tag is string => typeof tag === "string");
}

export function ProjectMetaBar({ project }: ProjectMetaBarProps) {
  const tags = safeTags(project.tags);

  const meta = [
    { label: "Client", value: project.client },
    { label: "Year", value: project.year },
    { label: "Category", value: project.category }
  ].filter((item) => item.value);

  return (
    <div className="project-meta-bar">
      <div className="container">
        <div className="project-meta-bar__items">
          {meta.map((item) => (
            <div key={item.label} className="project-meta-bar__item">
              <span className="eyebrow">{item.label}</span>
              <span className="project-meta-bar__value">{item.value}</span>
            </div>
          ))}
          {tags.length > 0 && (
            <div className="project-meta-bar__item">
              <span className="eyebrow">Tags</span>
              <div className="project-meta-bar__tags">
                {tags.map((tag) => (
                  <span key={tag} className="project-meta-bar__tag">{tag}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
