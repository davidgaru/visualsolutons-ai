"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Reveal } from "@/components/ui/reveal";
import { VideoCompareSlider } from "@/components/ui/video-compare-slider";

type ServiceId = "advertising" | "film-vfx" | "animation" | "character" | "fixes";
type ComparisonId = "vfx" | "animation" | "character" | "fixes";

type ServiceShowcase = {
  id: ServiceId;
  label: string;
  title: string;
  hint: string;
  video: string;
  tags: string[];
};

type ComparisonClip = {
  id: ComparisonId;
  label: string;
  description: string;
  beforeLabel: string;
  afterLabel: string;
  beforeSrc: string;
  afterSrc: string;
};

const services: ServiceShowcase[] = [
  {
    id: "advertising",
    label: "Advertising",
    title: "Campaign Visual Systems",
    hint: "High-conversion ad visuals built frame by frame.",
    video: "/videos/WES_F02_V4.mp4",
    tags: ["Concept", "Production", "Delivery"]
  },
  {
    id: "film-vfx",
    label: "Film + VFX",
    title: "Cinematic AI for Film",
    hint: "Shot extensions, style transfer, and premium finish.",
    video: "/videos/LUB_F06_V2.mp4",
    tags: ["Previs", "VFX", "Finishing"]
  },
  {
    id: "animation",
    label: "Animation",
    title: "Stylized Motion Worlds",
    hint: "Distinct animation direction for branded stories.",
    video: "/videos/casongo_V0001_6.mp4",
    tags: ["2D/3D", "Motion", "Story"]
  },
  {
    id: "character",
    label: "Character",
    title: "AI Character Replacement",
    hint: "Seamless identity swaps while preserving shot intent and motion.",
    video: "/videos/character/after.mp4",
    tags: ["Replacement", "Matchmove", "Compositing"]
  },
  {
    id: "fixes",
    label: "Fixes",
    title: "AI Post Fixes",
    hint: "Correcting production mistakes in post without expensive reshoots.",
    video: "/videos/fixes/after.mp4",
    tags: ["Cleanup", "Repair", "Finishing"]
  }
];

const comparisons: Record<ComparisonId, ComparisonClip> = {
  vfx: {
    id: "vfx",
    label: "VFX",
    description: "Before/after VFX enhancement with AI-assisted compositing and extension.",
    beforeLabel: "Before",
    afterLabel: "After",
    beforeSrc: "/videos/vfx/hf_20260123_072233_ff73b3c1-12d5-4748-8e20-63907bgg114ec9.mp4",
    afterSrc: "/videos/vfx/lk-hf_20260123_072233_ff73b3c1-12d5-4748-8e20-63907b114ec9_1.mp4"
  },
  animation: {
    id: "animation",
    label: "Animation",
    description: "Mesh-to-render progression for animation look development.",
    beforeLabel: "Mesh",
    afterLabel: "Render",
    beforeSrc: "/videos/animation/SC_053_054.mov",
    afterSrc: "/videos/animation/2026-02-11T20-51-25_boy_dips_his_hand.mp4"
  },
  character: {
    id: "character",
    label: "Character",
    description: "Character replacement workflow: original plate to AI-driven character pass.",
    beforeLabel: "Original",
    afterLabel: "Replacement",
    beforeSrc: "/videos/character/before.mp4",
    afterSrc: "/videos/character/after.mp4"
  },
  fixes: {
    id: "fixes",
    label: "Fixes",
    description: "Post-production fixes: correcting problem frames with AI in finishing.",
    beforeLabel: "Issue",
    afterLabel: "Fixed",
    beforeSrc: "/videos/fixes/before.mp4",
    afterSrc: "/videos/fixes/after.mp4"
  }
};

const serviceComparisonSets: Partial<Record<ServiceId, ComparisonId[]>> = {
  "film-vfx": ["vfx"],
  animation: ["animation"],
  character: ["character"],
  fixes: ["fixes"]
};

const AUTO_ADVANCE_MS = 7000;

function getDefaultComparison(serviceId: ServiceId): ComparisonId | null {
  const set = serviceComparisonSets[serviceId];
  return set?.[0] ?? null;
}

export function SignatureServices() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isReelOpen, setIsReelOpen] = useState(false);
  const [isInteractionPaused, setIsInteractionPaused] = useState(false);
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
  const [activeComparisonId, setActiveComparisonId] = useState<ComparisonId | null>(
    getDefaultComparison(services[0].id)
  );

  const active = services[activeIndex];
  const serviceComparisonIds = serviceComparisonSets[active.id] ?? [];
  const previewComparisonId =
    activeComparisonId && serviceComparisonIds.includes(activeComparisonId)
      ? activeComparisonId
      : (serviceComparisonIds[0] ?? null);
  const previewComparison = previewComparisonId ? comparisons[previewComparisonId] : null;
  const modalComparisonIds = serviceComparisonIds;
  const currentModalComparisonId =
    activeComparisonId && modalComparisonIds.includes(activeComparisonId)
      ? activeComparisonId
      : (modalComparisonIds[0] ?? null);
  const currentModalComparison = currentModalComparisonId ? comparisons[currentModalComparisonId] : null;

  const isMobile = useCallback(() => window.matchMedia("(max-width: 900px)").matches, []);

  const activateService = (index: number, openReel = false) => {
    const service = services[index];
    setActiveIndex(index);
    setActiveComparisonId(getDefaultComparison(service.id));
    if (openReel && !isMobile()) setIsReelOpen(true);
  };

  const showPrev = () => {
    setActiveIndex((current) => {
      const nextIndex = (current - 1 + services.length) % services.length;
      setActiveComparisonId(getDefaultComparison(services[nextIndex].id));
      return nextIndex;
    });
  };

  const showNext = () => {
    setActiveIndex((current) => {
      const nextIndex = (current + 1) % services.length;
      setActiveComparisonId(getDefaultComparison(services[nextIndex].id));
      return nextIndex;
    });
  };

  useEffect(() => {
    if (isReelOpen || isInteractionPaused) return;

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => {
        const nextIndex = (current + 1) % services.length;
        setActiveComparisonId(getDefaultComparison(services[nextIndex].id));
        return nextIndex;
      });
    }, AUTO_ADVANCE_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isReelOpen, isInteractionPaused]);

  useEffect(() => {
    if (!isReelOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsReelOpen(false);
      } else if (event.key === "ArrowRight") {
        showNext();
      } else if (event.key === "ArrowLeft") {
        showPrev();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isReelOpen]);

  useEffect(() => {
    setPortalRoot(document.body);
  }, []);

  return (
    <>
      <section className="neo-services">
        <div className="container">
          <Reveal>
            <p className="eyebrow">Services</p>
            <h2>Choose a lane. See the visual.</h2>
          </Reveal>

          <div
            className="neo-services__experience"
            onMouseEnter={() => setIsInteractionPaused(true)}
            onMouseLeave={() => setIsInteractionPaused(false)}
            onFocusCapture={() => setIsInteractionPaused(true)}
            onBlurCapture={() => setIsInteractionPaused(false)}
          >
            <Reveal className="neo-services__selector" delay={0.06}>
              <div aria-label="Service visual selector">
                {services.map((service, index) => {
                  const selected = index === activeIndex;
                  return (
                    <button
                      key={service.id}
                      type="button"
                      aria-pressed={selected}
                      aria-label={`Open ${service.label} case reel`}
                      className={`neo-services__tab${selected ? " is-active" : ""}`}
                      onClick={() => activateService(index, true)}
                      onMouseEnter={() => activateService(index, false)}
                      onFocus={() => activateService(index, false)}
                    >
                      <span className="neo-services__tab-index">0{index + 1}</span>
                      <span className="neo-services__tab-label">{service.label}</span>
                    </button>
                  );
                })}
              </div>
            </Reveal>

            <Reveal className="neo-services__stage-wrap" delay={0.12}>
              <div className="neo-services__stage">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.id}
                    className="neo-services__media"
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.01 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {previewComparison ? (
                      <VideoCompareSlider
                        className="neo-services__compare"
                        beforeSrc={previewComparison.beforeSrc}
                        afterSrc={previewComparison.afterSrc}
                        beforeLabel={previewComparison.beforeLabel}
                        afterLabel={previewComparison.afterLabel}
                      />
                    ) : (
                      <video
                        key={active.video}
                        src={active.video}
                        className="neo-services__video"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
                <div className="neo-services__shade" aria-hidden />
              </div>

              <div className="neo-services__meta">
                <p>{active.title}</p>
                <span>{active.hint}</span>

                {serviceComparisonIds.length > 1 && (
                  <div className="neo-services__mode-switch" aria-label="Comparison modes">
                    {serviceComparisonIds.map((comparisonId) => {
                      const clip = comparisons[comparisonId];
                      const selected = comparisonId === previewComparisonId;
                      return (
                        <button
                          key={`stage-${comparisonId}`}
                          type="button"
                          className={`neo-services__mode-pill${selected ? " is-active" : ""}`}
                          onClick={() => setActiveComparisonId(comparisonId)}
                        >
                          {clip.label}
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="neo-services__tags" aria-label="Service capabilities">
                  {active.tags.map((tag) => (
                    <em key={tag}>{tag}</em>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.2}>
            <Link href="/services" className="button button--ghost">
              Explore Services
            </Link>
          </Reveal>
        </div>
      </section>

      {portalRoot &&
        createPortal(
          <AnimatePresence>
            {isReelOpen && (
              <motion.div
                className="neo-services__reel"
                role="dialog"
                aria-modal="true"
                aria-label={`${active.title} case reel`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.26, ease: "easeOut" }}
                onClick={() => setIsReelOpen(false)}
              >
                <motion.div
                  className="neo-services__reel-shell"
                  initial={{ opacity: 0, y: 28, scale: 0.985 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 22, scale: 0.99 }}
                  transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                  onClick={(event) => event.stopPropagation()}
                >
                  <button
                    type="button"
                    className="neo-services__reel-close"
                    onClick={() => setIsReelOpen(false)}
                    aria-label="Close case reel"
                  >
                    X
                  </button>

                  <div className="neo-services__reel-panel">
                    {currentModalComparison ? (
                      <VideoCompareSlider
                        className="neo-services__reel-compare"
                        beforeSrc={currentModalComparison.beforeSrc}
                        afterSrc={currentModalComparison.afterSrc}
                        beforeLabel={currentModalComparison.beforeLabel}
                        afterLabel={currentModalComparison.afterLabel}
                      />
                    ) : (
                      <video
                        key={`reel-${active.video}`}
                        src={active.video}
                        className="neo-services__reel-video"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                      />
                    )}

                    <div
                      className={`neo-services__reel-shade${currentModalComparison ? " neo-services__reel-shade--compare" : ""}`}
                      aria-hidden
                    />

                    <div className="neo-services__reel-meta">
                      <div className="neo-services__reel-head">
                        <div className="neo-services__reel-copy">
                          <p className="neo-services__reel-title">{active.title}</p>
                          <span className="neo-services__reel-subtitle">{active.hint}</span>
                        </div>

                        {modalComparisonIds.length > 1 && (
                          <div className="neo-services__reel-switch" aria-label="Comparison modes">
                            {modalComparisonIds.map((comparisonId) => {
                              const clip = comparisons[comparisonId];
                              const selected = comparisonId === currentModalComparisonId;
                              return (
                                <button
                                  key={comparisonId}
                                  type="button"
                                  className={`neo-services__reel-pill${selected ? " is-active" : ""}`}
                                  onClick={() => setActiveComparisonId(comparisonId)}
                                >
                                  {clip.label}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {currentModalComparison && (
                        <p className="neo-services__reel-caption">{currentModalComparison.description}</p>
                      )}

                      <div className="neo-services__reel-bottom">
                        <div className="neo-services__reel-tags">
                          {active.tags.map((tag) => (
                            <em key={`reel-${active.id}-${tag}`}>{tag}</em>
                          ))}
                        </div>

                        <div className="neo-services__reel-actions">
                          <button type="button" className="button button--ghost button--small" onClick={showPrev}>
                            Previous
                          </button>
                          <button type="button" className="button button--ghost button--small" onClick={showNext}>
                            Next
                          </button>
                          <Link href="/contact" className="button button--small" onClick={() => setIsReelOpen(false)}>
                            Book a Call
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          portalRoot
        )}
    </>
  );
}
