"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal } from "@/components/ui/reveal";

interface ProjectVideoShowcaseProps {
  videoUrl: string;
  posterUrl?: string;
  title: string;
}

export function ProjectVideoShowcase({
  videoUrl,
  posterUrl,
  title,
}: ProjectVideoShowcaseProps) {
  const inlineVideoRef = useRef<HTMLVideoElement>(null);
  const cinemaVideoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isCinemaOpen, setIsCinemaOpen] = useState(false);
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalRoot(document.body);
  }, []);

  /* ---- scroll lock + escape key ---- */
  useEffect(() => {
    if (!isCinemaOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsCinemaOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isCinemaOpen]);

  /* ---- sync cinema video on open ---- */
  useEffect(() => {
    if (!isCinemaOpen) return;
    const cinema = cinemaVideoRef.current;
    const inline = inlineVideoRef.current;
    if (!cinema || !inline) return;

    cinema.currentTime = inline.currentTime;
    cinema.muted = false;
    cinema.play().catch(() => {
      // browser blocked unmuted autoplay — retry muted
      cinema.muted = true;
      cinema.play().catch(() => {});
    });

    // pause inline while cinema is open
    inline.pause();
  }, [isCinemaOpen]);

  /* ---- inline play / pause ---- */
  const togglePlay = useCallback(() => {
    const v = inlineVideoRef.current;
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
    const v = inlineVideoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsMuted(v.muted);
  }, []);

  const openCinema = useCallback(() => {
    setIsCinemaOpen(true);
  }, []);

  const closeCinema = useCallback(() => {
    setIsCinemaOpen(false);
    const inline = inlineVideoRef.current;
    if (inline) {
      const cinema = cinemaVideoRef.current;
      if (cinema) inline.currentTime = cinema.currentTime;
      inline.muted = true;
      setIsMuted(true);
      inline.play().catch(() => {});
      setIsPlaying(true);
    }
  }, []);

  return (
    <>
      <section className="project-video-showcase">
        <div className="container">
          <Reveal>
            <p className="eyebrow">Watch the Film</p>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="project-video-showcase__frame">
              <video
                ref={inlineVideoRef}
                className="project-video-showcase__video"
                src={videoUrl}
                poster={posterUrl}
                muted
                playsInline
                loop
                onClick={togglePlay}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />

              {/* poster overlay with play button */}
              {!isPlaying && (
                <div
                  className="project-video-showcase__poster-overlay"
                  onClick={togglePlay}
                >
                  <button
                    type="button"
                    className="project-video-showcase__play-large"
                    aria-label={`Play ${title}`}
                  >
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                </div>
              )}

              {/* bottom controls */}
              <div className="project-video-showcase__controls">
                <button
                  type="button"
                  className="project-video-showcase__btn"
                  onClick={togglePlay}
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? "Pause" : "Play"}
                </button>

                <button
                  type="button"
                  className="project-video-showcase__btn"
                  onClick={toggleMute}
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? "Unmute" : "Mute"}
                </button>

                <button
                  type="button"
                  className="project-video-showcase__btn project-video-showcase__btn--cinema"
                  onClick={openCinema}
                  aria-label="Open cinema mode"
                >
                  Cinema Mode
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* cinema modal */}
      {portalRoot &&
        createPortal(
          <AnimatePresence>
            {isCinemaOpen && (
              <motion.div
                className="project-video-showcase__cinema"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.26, ease: "easeOut" }}
                onClick={closeCinema}
              >
                <motion.div
                  className="project-video-showcase__cinema-shell"
                  initial={{ opacity: 0, y: 28, scale: 0.985 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 22, scale: 0.99 }}
                  transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="project-video-showcase__cinema-panel">
                    <video
                      ref={cinemaVideoRef}
                      className="project-video-showcase__cinema-video"
                      src={videoUrl}
                      poster={posterUrl}
                      playsInline
                      loop
                    />
                  </div>

                  <button
                    type="button"
                    className="project-video-showcase__cinema-close"
                    onClick={closeCinema}
                    aria-label="Close cinema mode"
                  >
                    X
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
