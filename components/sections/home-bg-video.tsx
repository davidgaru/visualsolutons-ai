"use client";

import { useCallback, useMemo, useState } from "react";

const rawVideoSources = [
  "/videos/WES_F02_V4.mp4",
  "/videos/LUB_F06_V2.mp4",
  "/videos/casongo_V0001_6.mp4",
  "/videos/2025-12-01T01-58-03_3d_animation_style_.mp4",
  "/videos/FRAME1-hf_20260118_222233_b71474a0-54ee-4314-9bbb-b175459bb045.mp4",
  "/videos/hf_20260201_001939_134f5504-a8a1-4446-8fc4-0f2adb67d043 (1).mp4"
];

const PLAYBACK_RATE = 0.85;

export function HomeBgVideo() {
  const sources = useMemo(() => rawVideoSources.map((src) => encodeURI(src)), []);
  const [activeIndex, setActiveIndex] = useState(0);

  const playNext = useCallback(() => {
    if (sources.length < 2) return;
    setActiveIndex((current) => (current + 1) % sources.length);
  }, [sources.length]);

  if (sources.length === 0) return null;

  return (
    <div className="home-bg-video" aria-hidden>
      <video
        key={sources[activeIndex]}
        className="home-bg-video__el"
        src={sources[activeIndex]}
        autoPlay
        muted
        loop={false}
        playsInline
        preload="auto"
        onEnded={playNext}
        onError={playNext}
        onLoadedMetadata={(event) => {
          event.currentTarget.playbackRate = PLAYBACK_RATE;
        }}
      />
    </div>
  );
}
