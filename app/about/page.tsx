import Image from "next/image";
import { PageHero } from "@/components/ui/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { getFounders } from "@/lib/founders";
import styles from "./founders.module.css";

export const revalidate = 300;

export default async function AboutPage() {
  const founders = await getFounders();
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
        <div className="container">
          <div className={styles.heading}>
            <p className="eyebrow">The founders</p>
            <h2>Film experience.<br />New possibilities.</h2>
            <p>Visual Solutions AI brings together production experience and a shared commitment to cinematic storytelling.</p>
          </div>
          <div className={styles.grid}>
            {founders.map((founder) => (
              <article className={styles.profile} key={founder._key}>
                <div className={styles.portrait}>
                  {founder.portraitUrl ? (
                    <Image src={founder.portraitUrl} alt={founder.portraitAlt || founder.name} fill sizes="(max-width: 700px) calc(100vw - 3.4rem), (max-width: 1280px) 45vw, 608px" quality={80} style={founder.portraitPosition ? { objectPosition: founder.portraitPosition } : undefined} />
                  ) : <span className={styles.initials} aria-hidden="true">{founder.name.split(" ").map((part) => part[0]).join("")}</span>}
                </div>
                {founder.portraitCredit && founder.portraitSourceUrl && <a className={styles.credit} href={founder.portraitSourceUrl} target="_blank" rel="noreferrer">Portrait: {founder.portraitCredit}</a>}
                <p className={styles.role}>{founder.role}</p>
                <h3 className={styles.name}>{founder.name}</h3>
                <p className={styles.bio}>{founder.biography}</p>
                <ul className={styles.credentials} aria-label={`${founder.name} credentials`}>
                  {founder.credentials?.map((credential) => <li key={credential._key}><a href={credential.url} target="_blank" rel="noreferrer">{credential.label} <span aria-hidden="true">↗</span></a></li>)}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
