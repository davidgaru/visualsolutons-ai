import { Reveal } from "@/components/ui/reveal";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="page-hero">
      <div className="container">
        <Reveal>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="section-description section-description--wide">{description}</p>
        </Reveal>
      </div>
    </section>
  );
}
