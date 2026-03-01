"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Reveal } from "@/components/ui/reveal";
import type { GalleryImage } from "@/lib/types";

type ProjectGalleryProps = {
  images: GalleryImage[];
};

export function ProjectGallery({ images }: ProjectGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const close = useCallback(() => setLightboxIndex(null), []);
  const prev = useCallback(
    () => setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : images.length - 1)),
    [images.length]
  );
  const next = useCallback(
    () => setLightboxIndex((i) => (i !== null && i < images.length - 1 ? i + 1 : 0)),
    [images.length]
  );

  useEffect(() => {
    if (lightboxIndex === null) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, close, prev, next]);

  if (!images.length) return null;

  return (
    <section className="project-gallery">
      <div className="container">
        <Reveal>
          <p className="eyebrow">Gallery</p>
        </Reveal>

        <div className="project-gallery__grid">
          {images.map((image, index) => (
            <Reveal key={image._key} delay={index * 0.05}>
              <button
                className={`project-gallery__item ${index === 0 ? "project-gallery__item--full" : ""}`}
                onClick={() => setLightboxIndex(index)}
                type="button"
              >
                <Image
                  src={image.asset.url}
                  alt={image.alt || ""}
                  width={800}
                  height={500}
                  className="project-gallery__img"
                />
                {image.caption && (
                  <span className="project-gallery__caption">{image.caption}</span>
                )}
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && images[lightboxIndex] && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button className="lightbox__close" onClick={close} type="button" aria-label="Close">
              &times;
            </button>

            <button className="lightbox__nav lightbox__nav--prev" onClick={prev} type="button" aria-label="Previous">
              &#8249;
            </button>

            <motion.div
              key={lightboxIndex}
              className="lightbox__content"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={images[lightboxIndex].asset.url}
                alt={images[lightboxIndex].alt || ""}
                width={1400}
                height={900}
                className="lightbox__img"
              />
              {images[lightboxIndex].caption && (
                <p className="lightbox__caption">{images[lightboxIndex].caption}</p>
              )}
            </motion.div>

            <button className="lightbox__nav lightbox__nav--next" onClick={next} type="button" aria-label="Next">
              &#8250;
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
