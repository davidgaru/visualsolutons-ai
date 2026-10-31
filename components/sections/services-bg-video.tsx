"use client";

import { AdaptiveVideo } from "@/components/ui/adaptive-video";

export function ServicesBgVideo() {
  return (
    <div className="services-bg-video" aria-hidden>
      <AdaptiveVideo
        className="services-bg-video__el"
        src="/videos/services-bg.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="none"
      />
    </div>
  );
}
