export type Founder = {
  _key: string;
  name: string;
  role: string;
  biography: string;
  credentials: { _key: string; label: string; url: string }[];
  portraitUrl?: string;
  portraitAlt?: string;
  portraitCredit?: string;
  portraitSourceUrl?: string;
  portraitPosition?: string;
};

// Source notes and attribution: docs/founder-sources.md.
export const fallbackFounders: Founder[] = [
  {
    _key: "david-vashadze",
    name: "David Vashadze",
    role: "Co-founder & CEO",
    biography: "David brings more than 20 years of experience in film production and film policy. As Georgia’s former Film Commissioner, he helped attract international productions including Fast & Furious 9 and Extraction 2, and helped shape the country’s film incentive framework. At Visual Solutions AI, he brings that production experience to the possibilities of generative filmmaking.",
    portraitUrl: "https://www.aifilmfestathens.gr/images/speakers/david-vashadze.jpg",
    portraitAlt: "David Vashadze, co-founder of Visual Solutions AI",
    portraitCredit: "AI Filmfest Athens",
    portraitSourceUrl: "https://www.aifilmfestathens.gr/en",
    credentials: [
      { _key: "commissioner", label: "Former Film Commissioner of Georgia", url: "https://www.aifilmfestathens.gr/en" },
      { _key: "speaker", label: "AI Filmfest Athens speaker", url: "https://www.aifilmfestathens.gr/en" }
    ]
  },
  {
    _key: "daviti-garuchava",
    name: "Daviti Garuchava",
    role: "Co-founder",
    biography: "Daviti is a filmmaker, editor and creative developer at AGBO, and the creator of TheGaroStudios. His work connects cinematic storytelling with editing, post-production and new creative tools. Named to Forbes Georgia’s 2026 Under 30 list in Art & Style, he has also seen his film edits featured by TIME. His trailer work includes Shindisi, Negative Numbers and Brighton 4th.",
    portraitUrl: "/images/daviti-garuchava.png",
    portraitAlt: "Daviti Garuchava working with film lighting equipment",
    portraitCredit: "Daviti Garuchava · personal portfolio",
    portraitSourceUrl: "https://garostudios.myportfolio.com/",
    portraitPosition: "center 87%",
    credentials: [
      { _key: "forbes", label: "Forbes Georgia Under 30 · 2026", url: "https://forbes.ge/2026-tslis-under-30-is-gamarjvebulebi-ukve-tsnobilia-future-is-under-30/" },
      { _key: "time", label: "Work featured in TIME", url: "https://time.com/4391364/game-of-thrones-jon-snow-supercut/" },
      { _key: "film", label: "Film & trailer editing", url: "https://www.youtube.com/@TheGaroStudios" }
    ]
  }
];
