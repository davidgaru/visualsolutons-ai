import { ClientsStrip } from "@/components/sections/clients-strip";
import { ServicesHero } from "@/components/sections/services-hero";
import { ServicesCinemaCards } from "@/components/sections/services-cinema-cards";
import type { ServiceCardData } from "@/components/sections/services-cinema-cards";
import { ServicesDifferentiators } from "@/components/sections/services-differentiators";
import { getServices } from "@/lib/content";

export const revalidate = 60;

const serviceBlueprints: ServiceCardData[] = [
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
      <ServicesHero
        eyebrow="Capabilities"
        title="Tailored AI visual solutions for ads, film, VFX, and animation."
        description="Every project is custom. We adapt models, workflow, and finishing to solve your exact production problem."
      />

      <ServicesCinemaCards services={services} />

      <ClientsStrip />

      <ServicesDifferentiators />
    </main>
  );
}
