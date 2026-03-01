import { PageHero } from "@/components/ui/page-hero";
import { Reveal } from "@/components/ui/reveal";

export default function AboutPage() {
  return (
    <main>
      <PageHero
        eyebrow="About"
        title="A cinematic AI film studio."
        description="Built for brands and agencies."
      />

      <section className="section">
        <div className="container about-grid">
          <Reveal>
            <article className="card">
              <h2>What We Believe</h2>
              <p>
                AI is a creative tool. Direction is everything.
              </p>
            </article>
          </Reveal>

          <Reveal delay={0.08}>
            <article className="card">
              <h2>Who We Work With</h2>
              <p>
                Enterprise brands, agencies, and film teams.
              </p>
            </article>
          </Reveal>
        </div>
      </section>

      <section className="section section--dense">
        <div className="container team-placeholder">
          <Reveal>
            <p className="eyebrow">Team</p>
            <h2>Founder and team profiles coming soon.</h2>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
