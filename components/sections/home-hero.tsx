"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ExactLogo } from "@/components/branding/exact-logo";
import { HeroVideoLoop } from "@/components/sections/hero-video-loop";
import { CinemaLightScene } from "@/components/three/cinema-light-scene";

export function HomeHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const logoY = useTransform(scrollYProgress, [0, 1], [0, -96]);
  const logoScale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);

  return (
    <section ref={ref} className="neo-hero">
      <CinemaLightScene />
      <HeroVideoLoop />
      <div className="neo-hero__veil" aria-hidden />

      <div className="container neo-hero__inner">
        <div className="neo-hero__stack">
          <motion.p
            className="eyebrow neo-hero__eyebrow"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            CINEMATIC AI FILM STUDIO
          </motion.p>

          <motion.div
            className="neo-hero__stage"
            style={{ y: logoY, scale: logoScale }}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="sr-only">Visual Solutions AI</h1>
            <ExactLogo className="neo-hero__logo" priority sizes="(max-width: 1024px) 96vw, 1320px" />
            <div className="neo-hero__beam" aria-hidden />
            <div className="neo-hero__flare" aria-hidden />
          </motion.div>

          <motion.div
            className="neo-hero__meta"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="neo-hero__meta-copy">
              <p className="neo-hero__meta-kicker">Advertising · Film · VFX · Animation</p>
              <p className="neo-hero__meta-approach">AI with a director&apos;s eye.</p>
              <p className="neo-hero__meta-detail">
                Authored frames, not prompts. Every shot is curated for brand impact.
              </p>
            </div>
            <div className="neo-hero__actions">
              <Link href="/contact" className="button">
                Book a Call
              </Link>
              <Link href="/work" className="button button--ghost">
                Watch Work
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
