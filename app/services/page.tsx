import Link from "next/link";
import { ClientsStrip } from "@/components/sections/clients-strip";
import { PageHero } from "@/components/ui/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { getServices } from "@/lib/content";

export const revalidate = 60;

type ServiceVisual = {
  id: string;
  title: string;
  summary: string;
  deliverables: string[];
  tailored: string;
  mediaSrc: string;
  mediaLabel: string;
};

const serviceBlueprints: ServiceVisual[] = [
  {
    id: "advertising",
    title: "AI Advertising Visuals",
    summary: "Campaign visuals for launch films, social cuts, and high-conversion ad ecosystems.",
    deliverables: ["Concept Frames", "Ad Spots", "Social Variations"],
    tailored: "Adapted to campaign goals, audience profile, and platform-specific creative constraints.",
    mediaSrc: "/videos/WES_F02_V4.mp4",
    mediaLabel: "Advertising"
  },
  {
    id: "film-vfx",
    title: "Film + VFX Enhancement",
    summary: "Cinematic augmentation for films through AI-assisted compositing, look-dev, and shot finishing.",
    deliverables: ["Shot Extension", "Look Development", "Finishing"],
    tailored: "Built around your edit, grade, and VFX pipeline, including shots that need bespoke fixing.",
    mediaSrc: "/videos/LUB_F06_V2.mp4",
    mediaLabel: "Film + VFX"
  },
  {
    id: "animation",
    title: "AI Animation Production",
    summary: "Stylized animated sequences that combine model generation with directed motion design.",
    deliverables: ["Styleframes", "Mesh-to-Render", "Delivery Masters"],
    tailored: "Animation style, pacing, and visual language tuned to each brand world and narrative need.",
    mediaSrc: "/videos/animation/2026-02-11T20-51-25_boy_dips_his_hand.mp4",
    mediaLabel: "Animation"
  },
  {
    id: "character",
    title: "AI Character Replacement",
    summary: "Seamless character replacement while preserving motion, framing, and cinematic continuity.",
    deliverables: ["Plate Analysis", "Character Swap", "Matchmove + Composite"],
    tailored: "Designed case-by-case for identity changes, continuity corrections, or story-driven swaps.",
    mediaSrc: "/videos/character/after.mp4",
    mediaLabel: "Character"
  },
  {
    id: "fixes",
    title: "AI Post Fixes",
    summary: "Post-production repair for mistakes that would otherwise require expensive reshoots.",
    deliverables: ["Cleanup", "Error Repair", "Final Integration"],
    tailored: "Purpose-built fixes for unique production problems, from continuity errors to unwanted elements.",
    mediaSrc: "/videos/fixes/after.mp4",
    mediaLabel: "Fixes"
  }
];

export default async function ServicesPage() {
  const cmsServices = await getServices();
  const services = serviceBlueprints.map((blueprint, index) => {
    const cmsService = cmsServices[index];
    return {
      ...blueprint,
      title: cmsService?.title ?? blueprint.title,
      summary: cmsService?.summary ?? blueprint.summary,
      deliverables: cmsService?.deliverables?.length ? cmsService.deliverables : blueprint.deliverables
    };
  });

  return (
    <main>
      <PageHero
        eyebrow="Capabilities"
        title="Tailored AI visual solutions for ads, film, VFX, and animation."
        description="Every project is custom. We adapt models, workflow, and finishing to solve your exact production problem."
      />

      <section className="section">
        <div className="container services-cinema">
          <Reveal>
            <p className="eyebrow">Service Lanes</p>
            <h2>Built for unique production challenges.</h2>
          </Reveal>

          <div className="services-cinema__list">
            {services.map((service, index) => (
              <Reveal key={service.id} delay={index * 0.06}>
                <article className={`services-cinema__item${index % 2 === 1 ? " is-reverse" : ""}`}>
                  <div className="services-cinema__media">
                    <video src={service.mediaSrc} autoPlay muted loop playsInline preload="metadata" />
                    <div className="services-cinema__media-shade" aria-hidden />
                    <p className="services-cinema__media-label">{service.mediaLabel}</p>
                  </div>

                  <div className="services-cinema__copy">
                    <p className="eyebrow">0{index + 1}</p>
                    <h3>{service.title}</h3>
                    <p>{service.summary}</p>
                    <p className="services-cinema__tailored">{service.tailored}</p>

                    <div className="services-cinema__chips">
                      {service.deliverables.map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ClientsStrip />

      <section className="section section--dense">
        <div className="container services-tailored">
          <Reveal>
            <p className="eyebrow">Tailored Solutions</p>
            <h2>Not template output. Problem-specific execution.</h2>
          </Reveal>

          <div className="services-tailored__grid">
            <Reveal>
              <article className="card">
                <h3>Unique Production Constraints</h3>
                <p>
                  We scope around your timeline, budget, legal constraints, and delivery formats from day one.
                </p>
              </article>
            </Reveal>
            <Reveal delay={0.08}>
              <article className="card">
                <h3>Impossible or Broken Shots</h3>
                <p>
                  Character swaps, shot fixes, and visual corrections are custom-built for each problematic frame.
                </p>
              </article>
            </Reveal>
            <Reveal delay={0.16}>
              <article className="card">
                <h3>Brand-Specific Visual Language</h3>
                <p>
                  We tune style, motion, and finishing to your brand voice so the result looks intentional, not generic.
                </p>
              </article>
            </Reveal>
          </div>
        </div>

        <div className="container section-cta">
          <Link href="/contact" className="button">
            Book a Call
          </Link>
        </div>
      </section>
    </main>
  );
}
