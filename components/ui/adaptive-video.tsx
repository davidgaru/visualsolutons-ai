"use client";

import { forwardRef, useCallback, useEffect, useRef, useState, type VideoHTMLAttributes } from "react";
import manifest from "@/lib/media-manifest.json";
import cmsManifest from "@/lib/cms-media-manifest.json";

type Delivery = { desktop: string; compact: string; poster: string };
const deliveries: Record<string, Delivery> = { ...manifest, ...cmsManifest };

function deliveryPoster(src?: string) {
  if (!src) return src;
  try {
    const url = new URL(src);
    if (url.hostname !== "cdn.sanity.io" || !url.pathname.startsWith("/images/")) return src;
    url.searchParams.set("w", "960");
    url.searchParams.set("fit", "max");
    url.searchParams.set("auto", "format");
    url.searchParams.set("q", "80");
    return url.toString();
  } catch {
    return src;
  }
}

type AdaptiveVideoProps = VideoHTMLAttributes<HTMLVideoElement> & {
  /** Cinema mode retains the full-resolution delivery, even on small screens. */
  fullResolution?: boolean;
};

export const AdaptiveVideo = forwardRef<HTMLVideoElement, AdaptiveVideoProps>(
  function AdaptiveVideo({ src, poster, autoPlay, preload = "none", fullResolution = false, ...props }, forwardedRef) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [ready, setReady] = useState(fullResolution);
    const [compact, setCompact] = useState(false);
    const visibleRef = useRef(false);
    const resumeRef = useRef(false);
    const autoPlayRef = useRef(autoPlay);
    autoPlayRef.current = autoPlay;
    const delivery = src ? deliveries[decodeURI(src)] : undefined;

    const setRef = useCallback((node: HTMLVideoElement | null) => {
      videoRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    }, [forwardedRef]);

    useEffect(() => {
      const video = videoRef.current;
      if (!video) return;
      const connection = (navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string; downlink?: number };
      }).connection;
      // Select once to avoid restarting a playing clip on resize/network changes.
      setCompact(!fullResolution && (
        window.matchMedia("(max-width: 900px)").matches || connection?.saveData === true ||
        ["slow-2g", "2g", "3g"].includes(connection?.effectiveType ?? "") ||
        (connection?.downlink !== undefined && connection.downlink < 8)
      ));

      const updatePlayback = () => {
        if (visibleRef.current && !document.hidden) {
          if (autoPlayRef.current || resumeRef.current) void video.play().catch(() => {});
        } else {
          resumeRef.current = !video.paused;
          video.pause();
        }
      };
      const observer = new IntersectionObserver(([entry]) => {
        visibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) setReady(true);
        updatePlayback();
      }, { threshold: 0.01 });
      observer.observe(video);
      document.addEventListener("visibilitychange", updatePlayback);
      return () => {
        observer.disconnect();
        document.removeEventListener("visibilitychange", updatePlayback);
      };
    }, [fullResolution]);

    useEffect(() => {
      const video = videoRef.current;
      if (ready && autoPlay && visibleRef.current && !document.hidden) {
        void video?.play().catch(() => {});
      }
    }, [ready, src, compact, autoPlay]);

    return <video
      {...props}
      ref={setRef}
      src={ready ? (delivery ? (compact ? delivery.compact : delivery.desktop) : src) : undefined}
      poster={deliveryPoster(poster) || delivery?.poster}
      autoPlay={autoPlay}
      preload={ready ? preload : "none"}
    />;
  }
);
