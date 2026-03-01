"use client";

import { Reveal } from "@/components/ui/reveal";

type Metric = {
  value: string;
  label: string;
};

type ProjectOutcomeProps = {
  outcome: string;
  metrics?: Metric[];
};

export function ProjectOutcome({ outcome, metrics }: ProjectOutcomeProps) {
  return (
    <section className="project-outcome">
      <div className="container">
        <Reveal>
          <div className="project-outcome__card">
            <p className="eyebrow">Outcome</p>
            <p className="project-outcome__text">{outcome}</p>
            {metrics && metrics.length > 0 && (
              <div className="project-outcome__metrics">
                {metrics.map((metric) => (
                  <div key={metric.label} className="project-outcome__metric">
                    <span className="project-outcome__metric-value">{metric.value}</span>
                    <span className="project-outcome__metric-label">{metric.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
