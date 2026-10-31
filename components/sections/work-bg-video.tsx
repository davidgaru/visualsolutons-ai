"use client";

import { AdaptiveVideo } from "@/components/ui/adaptive-video";

export function WorkBgVideo() {
  return (
    <div className="work-bg-video" aria-hidden>
      <AdaptiveVideo
        className="work-bg-video__el"
        src="/videos/work-bg.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="none"
      />
    </div>
  );
}
