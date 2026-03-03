"use client";

import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";

const differentiators = [
  {
    number: "01",
    title: "Unique Production Constraints",
    description:
      "We scope around your timeline, budget, legal constraints, and delivery formats from day one.",
  },
  {
    number: "02",
    title: "Impossible or Broken Shots",
    description:
      "Character swaps, shot fixes, and visual corrections are custom-built for each problematic frame.",
  },
  {
    number: "03",
    title: "Brand-Specific Visual Language",
    description:
      "We tune style, motion, and finishing to your brand voice so the result looks intentional, not generic.",
  },
];

export function ServicesDifferentiators() {
  return (
    <section className="section section--dense">
      <div className="container svc-diff">
        <Reveal>
          <p className="eyebrow">Tailored Solutions</p>
          <h2 className="svc-diff__heading">
            Not template output. Problem-specific execution.
          </h2>
        </Reveal>

        <div className="svc-diff__grid">
          {differentiators.map((item, i) => (
            <Reveal key={item.number} delay={i * 0.1}>
              <article className="svc-diff__card">
                <span className="svc-diff__number">{item.number}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="container section-cta">
        <Link href="/contact" className="button">
          Book a Call
        </Link>
      </div>
    </section>
  );
}
