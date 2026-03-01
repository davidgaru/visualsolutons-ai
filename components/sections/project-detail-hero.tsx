"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import type { Project } from "@/lib/types";

type ProjectDetailHeroProps = {
  project: Project;
};

export function ProjectDetailHero({ project }: ProjectDetailHeroProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.8], [0.4, 0.85]);

  function renderMedia() {
    if (project.mediaType === "youtube" && project.videoUrl) {
      return (
        <iframe
          className="project-hero__media"
          src={project.videoUrl}
          title={project.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }

    if (project.mediaType === "upload" && project.videoFileUrl) {
      return (
        <video
          className="project-hero__media"
          src={project.videoFileUrl}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      );
    }

    if (project.posterImageUrl) {
      return (
        <Image
          className="project-hero__media"
          src={project.posterImageUrl}
          alt={project.title}
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
      );
    }

    return <div className="project-hero__media project-hero__media--fallback" />;
  }

  return (
    <section className="project-hero" ref={ref}>
      <motion.div className="project-hero__visual" style={{ y }}>
        {renderMedia()}
      </motion.div>

      <motion.div className="project-hero__overlay" style={{ opacity: overlayOpacity }} />

      <div className="project-hero__content">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="eyebrow">{project.client}</p>
          <h1>{project.title}</h1>
        </motion.div>
      </div>
    </section>
  );
}
