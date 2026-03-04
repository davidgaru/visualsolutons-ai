"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/types";

/* ------------------------------------------------------------------ */

interface FeaturedWorkShowcaseProps {
  projects: Project[];
}

function getVideoSrc(project: Project): string | null {
  if (project.mediaType === "upload" && project.videoFileUrl) return project.videoFileUrl;
  if (project.mediaType === "youtube" && project.videoUrl) return project.videoUrl;
  return null;
}

const IMAGE_HOLD_MS = 6000;
const SWIPE_THRESHOLD = 50;

/* ------------------------------------------------------------------ */

export function FeaturedWorkShowcase({ projects }: FeaturedWorkShowcaseProps) {
  const slides = projects.filter(
    (p) => typeof p.slug === "string" && p.title,
  );

  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isCinemaOpen, setIsCinemaOpen] = useState(false);
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const cinemaVideoRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number>(0);
  const imageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const imageStartRef = useRef(0);
  const touchStartRef = useRef(0);

  const multi = slides.length > 1;

  /* ---- portal root ---- */
  useEffect(() => {
    setPortalRoot(document.body);
  }, []);

  /* ---- navigation helpers ---- */
  const goTo = useCallback(
    (index: number) => {
      setCurrent(index);
      setProgress(0);
    },
    [],
  );

  const goNext = useCallback(() => {
    setCurrent((i) => (i + 1) % slides.length);
    setProgress(0);
  }, [slides.length]);

  const goPrev = useCallback(() => {
    setCurrent((i) => (i - 1 + slides.length) % slides.length);
    setProgress(0);
  }, [slides.length]);

  /* ---- rAF progress for video ---- */
  const tickProgress = useCallback(() => {
    const v = videoRef.current;
    if (v && v.duration) {
      setProgress(v.currentTime / v.duration);
    }
    rafRef.current = requestAnimationFrame(tickProgress);
  }, []);

  /* ---- start / stop progress loop ---- */
  useEffect(() => {
    const slide = slides[current];
    if (!slide) return;
    const hasVideo = !!getVideoSrc(slide);

    // clear old image timer
    if (imageTimerRef.current) {
      clearTimeout(imageTimerRef.current);
      imageTimerRef.current = null;
    }

    if (hasVideo) {
      rafRef.current = requestAnimationFrame(tickProgress);
      return () => cancelAnimationFrame(rafRef.current);
    }

    // image slide: animate progress over IMAGE_HOLD_MS then advance
    imageStartRef.current = Date.now();
    const tick = () => {
      const elapsed = Date.now() - imageStartRef.current;
      setProgress(Math.min(elapsed / IMAGE_HOLD_MS, 1));
      if (elapsed < IMAGE_HOLD_MS) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    if (multi) {
      imageTimerRef.current = setTimeout(goNext, IMAGE_HOLD_MS);
    }
    return () => {
      cancelAnimationFrame(rafRef.current);
      if (imageTimerRef.current) clearTimeout(imageTimerRef.current);
    };
  }, [current, slides, multi, goNext, tickProgress]);

  /* ---- keyboard ---- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isCinemaOpen) {
        if (e.key === "Escape") setIsCinemaOpen(false);
        return;
      }
      if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === " ") {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCinemaOpen, goNext, goPrev]);

  /* ---- scroll lock for cinema ---- */
  useEffect(() => {
    if (!isCinemaOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isCinemaOpen]);

  /* ---- sync cinema video ---- */
  useEffect(() => {
    if (!isCinemaOpen) return;
    const cinema = cinemaVideoRef.current;
    const inline = videoRef.current;
    if (!cinema || !inline) return;

    cinema.currentTime = inline.currentTime;
    cinema.muted = false;
    cinema.play().catch(() => {
      cinema.muted = true;
      cinema.play().catch(() => {});
    });
    inline.pause();
  }, [isCinemaOpen]);

  /* ---- controls ---- */
  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
      setIsPlaying(true);
    } else {
      v.pause();
      setIsPlaying(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsMuted(v.muted);
  }, []);

  const openCinema = useCallback(() => setIsCinemaOpen(true), []);

  const closeCinema = useCallback(() => {
    setIsCinemaOpen(false);
    const inline = videoRef.current;
    const cinema = cinemaVideoRef.current;
    if (inline) {
      if (cinema) inline.currentTime = cinema.currentTime;
      inline.muted = true;
      setIsMuted(true);
      inline.play().catch(() => {});
      setIsPlaying(true);
    }
  }, []);

  /* ---- swipe ---- */
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const diff = e.changedTouches[0].clientX - touchStartRef.current;
      if (Math.abs(diff) > SWIPE_THRESHOLD) {
        if (diff < 0) goNext();
        else goPrev();
      }
    },
    [goNext, goPrev],
  );

  /* ---- bail on zero slides ---- */
  if (slides.length === 0) return null;

  const slide = slides[current];
  const videoSrc = getVideoSrc(slide);
  const tags = Array.isArray(slide.tags) ? slide.tags : [];

  return (
    <>
      <section className="featured-showcase">
        <div className="container">
          <div
            className="featured-showcase__frame"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {/* crossfade layer */}
            <AnimatePresence mode="wait">
              <motion.div
                key={slide._id}
                className="featured-showcase__media"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {videoSrc ? (
                  <video
                    ref={videoRef}
                    className="featured-showcase__video"
                    src={videoSrc}
                    poster={slide.posterImageUrl}
                    autoPlay
                    muted
                    playsInline
                    onEnded={multi ? goNext : undefined}
                    onError={multi ? goNext : undefined}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  />
                ) : slide.posterImageUrl ? (
                  <Image
                    src={slide.posterImageUrl}
                    alt={slide.title}
                    fill
                    sizes="(max-width: 900px) 100vw, 1280px"
                    className="featured-showcase__poster"
                  />
                ) : (
                  <div className="featured-showcase__fallback" />
                )}
              </motion.div>
            </AnimatePresence>

            {/* gradient veil */}
            <div className="featured-showcase__veil" />

            {/* info overlay */}
            <div className="featured-showcase__info">
              <Link href={`/work/${slide.slug}`} className="featured-showcase__link">
                <p className="featured-showcase__client">{slide.client}</p>
                <h3 className="featured-showcase__title">
                  {slide.title}
                  <span className="featured-showcase__arrow" aria-hidden>
                    &rarr;
                  </span>
                </h3>
                {tags.length > 0 && (
                  <p className="featured-showcase__tags">
                    {tags.slice(0, 4).join(" \u00B7 ")}
                  </p>
                )}
              </Link>
            </div>

            {/* controls pill */}
            <div className="featured-showcase__controls">
              {videoSrc && (
                <>
                  <button
                    type="button"
                    className="featured-showcase__btn"
                    onClick={togglePlay}
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="6" y="4" width="4" height="16" />
                        <rect x="14" y="4" width="4" height="16" />
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </button>
                  <button
                    type="button"
                    className="featured-showcase__btn"
                    onClick={toggleMute}
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16.5 12A4.5 4.5 0 0 0 14 8v1.5l2.4 2.4c.06-.3.1-.62.1-.9zM19 12c0 1.2-.35 2.3-.95 3.25l1.1 1.1A7.96 7.96 0 0 0 21 12c0-4-2.7-7.3-6.4-8.3v2.1A5.98 5.98 0 0 1 19 12zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.5-1.42.9-2.25 1.16v2.1a8.03 8.03 0 0 0 3.95-1.98l1.78 1.78L21.23 19l-1.46-1.46L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.47 4.47 0 0 0 2.5-4zM14 3.2v2.1a6 6 0 0 1 0 13.4v2.1c4-.9 7-4.5 7-8.8s-3-7.9-7-8.8z" />
                      </svg>
                    )}
                  </button>
                </>
              )}

              {/* dot indicators */}
              {multi && (
                <div className="featured-showcase__dots">
                  {slides.map((s, i) => (
                    <button
                      key={s._id}
                      type="button"
                      className={`featured-showcase__dot${i === current ? " featured-showcase__dot--active" : ""}`}
                      onClick={() => goTo(i)}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* arrows */}
              {multi && (
                <div className="featured-showcase__arrows">
                  <button
                    type="button"
                    className="featured-showcase__btn"
                    onClick={goPrev}
                    aria-label="Previous slide"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="featured-showcase__btn"
                    onClick={goNext}
                    aria-label="Next slide"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                    </svg>
                  </button>
                </div>
              )}

              {/* cinema button */}
              {videoSrc && (
                <button
                  type="button"
                  className="featured-showcase__btn featured-showcase__btn--cinema"
                  onClick={openCinema}
                  aria-label="Open cinema mode"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                  </svg>
                </button>
              )}
            </div>

            {/* progress bar */}
            <div className="featured-showcase__progress">
              <div
                className="featured-showcase__progress-fill"
                style={{ transform: `scaleX(${progress})` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* cinema modal */}
      {portalRoot &&
        videoSrc &&
        createPortal(
          <AnimatePresence>
            {isCinemaOpen && (
              <motion.div
                className="featured-showcase__cinema"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.26, ease: "easeOut" }}
                onClick={closeCinema}
              >
                <motion.div
                  className="featured-showcase__cinema-shell"
                  initial={{ opacity: 0, y: 28, scale: 0.985 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 22, scale: 0.99 }}
                  transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="featured-showcase__cinema-panel">
                    <video
                      ref={cinemaVideoRef}
                      className="featured-showcase__cinema-video"
                      src={videoSrc}
                      poster={slide.posterImageUrl}
                      playsInline
                    />
                  </div>
                  <button
                    type="button"
                    className="featured-showcase__cinema-close"
                    onClick={closeCinema}
                    aria-label="Close cinema mode"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          portalRoot,
        )}
    </>
  );
}
