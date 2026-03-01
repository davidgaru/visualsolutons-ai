import type { Post, Project, Service } from "@/lib/types";

export const fallbackServices: Service[] = [
  {
    _id: "svc-1",
    title: "AI Advertising Visuals",
    summary:
      "Campaign-grade visuals for launch films, social cuts, and full ad ecosystems tuned to your audience and channel goals.",
    deliverables: ["Concept Frames", "Ad Spots", "Social Variations"]
  },
  {
    _id: "svc-2",
    title: "Film & VFX Enhancement",
    summary:
      "Cinematic augmentation for films and branded stories through AI-assisted compositing, look development, and sequence polish tailored to your pipeline.",
    deliverables: ["Shot Extension", "Look Development", "Finishing"]
  },
  {
    _id: "svc-3",
    title: "AI Animation Production",
    summary:
      "High-style animated sequences combining AI generation with directed motion design for short and long formats with custom style direction.",
    deliverables: ["Styleframes", "Mesh-to-Render", "Delivery Masters"]
  },
  {
    _id: "svc-4",
    title: "AI Character Replacement",
    summary:
      "Character replacement designed around shot intent, continuity, and motion so each use case is solved cleanly.",
    deliverables: ["Plate Analysis", "Character Swap", "Matchmove + Composite"]
  },
  {
    _id: "svc-5",
    title: "AI Post Fixes",
    summary:
      "Problem-specific post fixes for unique production issues, from continuity errors to unwanted elements and scene cleanup.",
    deliverables: ["Cleanup", "Error Repair", "Final Integration"]
  }
];

export const fallbackProjects: Project[] = [
  {
    _id: "prj-1",
    title: "Performance Launch Visual Campaign",
    slug: "performance-launch-visual-campaign",
    client: "Tegeta Motors",
    summary:
      "A cinematic campaign system crafted for speed, precision, and premium automotive storytelling.",
    outcome: "Multi-format ad rollout with high audience retention and stronger launch visibility.",
    tags: ["Automotive", "Advertising", "AI Visuals"],
    mediaType: "none",
    year: "2026",
    category: "Campaign Film",
    featured: true
  },
  {
    _id: "prj-2",
    title: "Brand Film Visual Expansion",
    slug: "brand-film-visual-expansion",
    client: "Bank of Georgia",
    summary:
      "Visual language expansion for branded film assets, balancing trust, scale, and modern aesthetics.",
    outcome: "Expanded premium visual identity across campaign film touchpoints.",
    tags: ["Finance", "Film", "VFX"],
    mediaType: "none",
    year: "2025",
    category: "Brand Film",
    featured: true
  },
  {
    _id: "prj-3",
    title: "Mobile Campaign Motion Series",
    slug: "mobile-campaign-motion-series",
    client: "Cellfie",
    summary:
      "AI-assisted motion suite designed for high-frequency campaign publishing without visual fatigue.",
    outcome: "Faster campaign production and consistent creative quality across placements.",
    tags: ["Telecom", "Animation", "Social"],
    mediaType: "none",
    year: "2025",
    category: "Animation",
    featured: false
  },
  {
    _id: "prj-4",
    title: "Agency Visual Innovation Sprint",
    slug: "agency-visual-innovation-sprint",
    client: "Windfor's Agency",
    summary:
      "Creative R&D sprint delivering production-ready visual concepts for multiple client pitches.",
    outcome: "Improved concept approval rate with standout premium visual prototypes.",
    tags: ["Agency", "R&D", "Pitch"],
    mediaType: "none",
    year: "2025",
    category: "Branding",
    featured: false
  },
  {
    _id: "prj-5",
    title: "Launch Film Sequence System",
    slug: "launch-film-sequence-system",
    client: "Hyundai",
    summary:
      "Cinematic sequence toolkit designed for launch films, dealer screens, and digital placements.",
    outcome: "Unified launch storytelling across film and digital environments.",
    tags: ["Automotive", "Film", "AI"],
    mediaType: "none",
    year: "2024",
    category: "Campaign Film",
    featured: false
  }
];

export const fallbackPosts: Post[] = [
  {
    _id: "post-1",
    title: "Visual Solutions AI Featured in Industry Roundup",
    slug: "featured-in-industry-roundup",
    excerpt:
      "A quick update on our latest feature and what it means for upcoming projects.",
    body:
      "We were recently featured in an industry roundup highlighting studios building modern AI visual pipelines. This milestone reflects the quality and speed our team delivers across advertising and film projects.",
    publishedAt: "2026-01-10"
  },
  {
    _id: "post-2",
    title: "How We Build Campaign Visual Systems with AI",
    slug: "how-we-build-campaign-visual-systems",
    excerpt:
      "Our framework for turning a concept into a scalable campaign visual language.",
    body:
      "From strategy to final delivery, our process combines model selection, look development, and editorial iteration. The result is a cohesive visual system that can scale across channels without sacrificing quality.",
    publishedAt: "2025-12-08"
  },
  {
    _id: "post-3",
    title: "Behind the Scenes: AI + Cinematic Motion",
    slug: "behind-the-scenes-ai-plus-cinematic-motion",
    excerpt:
      "A short breakdown of how we approach high-impact animation for premium brands.",
    body:
      "Our animation pipeline pairs generated key visuals with directed motion systems. This allows faster iteration while preserving cinematic intent and brand consistency.",
    publishedAt: "2025-11-12"
  }
];
