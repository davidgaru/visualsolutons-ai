"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

type ServicesHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

const EASE = [0.22, 1, 0.36, 1] as const;

export function ServicesHero({ eyebrow, title, description }: ServicesHeroProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const textY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const orbY = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const orbScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  const words = title.split(" ");

  return (
    <section ref={ref} className="services-hero">
      {/* Ambient orb */}
      <motion.div
        className="services-hero__orb"
        style={{ y: orbY, scale: orbScale }}
        aria-hidden
      />

      <motion.div className="services-hero__content container" style={{ y: textY }}>
        <motion.p
          className="eyebrow services-hero__eyebrow"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          {eyebrow}
        </motion.p>

        <h1 className="services-hero__title">
          {words.map((word, i) => (
            <span key={i} className="services-hero__word-wrap">
              <motion.span
                className="services-hero__word"
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{
                  duration: 0.9,
                  delay: 0.12 + i * 0.06,
                  ease: EASE,
                }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          className="services-hero__description"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.5, ease: EASE }}
        >
          {description}
        </motion.p>
      </motion.div>
    </section>
  );
}
