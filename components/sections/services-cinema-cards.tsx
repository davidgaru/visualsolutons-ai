"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState, useCallback } from "react";

export type ServiceCardData = {
  id: string;
  title: string;
  summary: string;
  deliverables: string[];
  tailored: string;
  mediaSrc: string;
  mediaLabel: string;
};

type ServicesCinemaCardsProps = {
  services: ServiceCardData[];
};

const EASE = [0.22, 1, 0.36, 1] as const;

export function ServicesCinemaCards({ services }: ServicesCinemaCardsProps) {
  return (
    <section className="section">
      <div className="container svc-cards">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-110px" }}
          transition={{ duration: 0.85, ease: EASE }}
        >
          <p className="eyebrow">Service Lanes</p>
          <h2 className="svc-cards__heading">Built for unique production challenges.</h2>
        </motion.div>

        <div className="svc-cards__list">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service, index }: { service: ServiceCardData; index: number }) {
  const cardRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [canHover, setCanHover] = useState(true);

  // Detect hover capability
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover)");
    setCanHover(mq.matches);
    const handler = (e: MediaQueryListEvent) => setCanHover(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Mobile: IntersectionObserver auto-play/pause
  useEffect(() => {
    if (canHover) return;
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [canHover]);

  const handleMouseEnter = useCallback(() => {
    if (!canHover) return;
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  }, [canHover]);

  const handleMouseLeave = useCallback(() => {
    if (!canHover) return;
    videoRef.current?.pause();
  }, [canHover]);

  const isReverse = index % 2 === 1;

  return (
    <motion.article
      ref={cardRef}
      className={`svc-card${isReverse ? " svc-card--reverse" : ""}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.85, delay: index * 0.08, ease: EASE }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="svc-card__media">
        <video
          ref={videoRef}
          src={service.mediaSrc}
          muted
          loop
          playsInline
          preload="metadata"
          className="svc-card__video"
        />
        <div className="svc-card__shade" aria-hidden />
        <p className="svc-card__media-label">{service.mediaLabel}</p>
      </div>

      <div className="svc-card__copy">
        <span className="svc-card__index">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3>{service.title}</h3>
        <p>{service.summary}</p>
        <p className="svc-card__tailored">{service.tailored}</p>
        <ChipRow deliverables={service.deliverables} />
      </div>
    </motion.article>
  );
}

function ChipRow({ deliverables }: { deliverables: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div ref={ref} className="svc-card__chips">
      {deliverables.map((item, i) => (
        <motion.span
          key={item}
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.55, delay: 0.35 + i * 0.08, ease: EASE }}
        >
          {item}
        </motion.span>
      ))}
    </div>
  );
}
