"use client";

import { useEffect, useId, useRef, useState } from "react";

type VideoCompareSliderProps = {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
  defaultSplit?: number;
};

export function VideoCompareSlider({
  beforeSrc,
  afterSrc,
  beforeLabel = "Before",
  afterLabel = "After",
  className,
  defaultSplit = 50
}: VideoCompareSliderProps) {
  const [split, setSplit] = useState(defaultSplit);
  const beforeRef = useRef<HTMLVideoElement>(null);
  const afterRef = useRef<HTMLVideoElement>(null);
  const inputId = useId();

  useEffect(() => {
    setSplit(defaultSplit);
  }, [beforeSrc, afterSrc, defaultSplit]);

  useEffect(() => {
    const before = beforeRef.current;
    const after = afterRef.current;
    if (!before || !after) return;

    const keepPlaying = (video: HTMLVideoElement) => {
      if (!video.paused) return;
      void video.play().catch(() => {});
    };

    const syncTimer = window.setInterval(() => {
      if (before.readyState < 2 || after.readyState < 2) return;

      keepPlaying(before);
      keepPlaying(after);

      const leader = before.paused && !after.paused ? after : before;
      const follower = leader === before ? after : before;
      const diff = Math.abs(before.currentTime - after.currentTime);
      if (diff > 0.08) {
        follower.currentTime = leader.currentTime;
      }
    }, 320);

    return () => {
      window.clearInterval(syncTimer);
    };
  }, [beforeSrc, afterSrc]);

  const composedClassName = className ? `video-compare ${className}` : "video-compare";

  return (
    <div className={composedClassName}>
      <video
        ref={afterRef}
        src={afterSrc}
        className="video-compare__video"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />

      <div className="video-compare__before" style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}>
        <video
          ref={beforeRef}
          src={beforeSrc}
          className="video-compare__video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onLoadedData={() => {
            if (!afterRef.current || !beforeRef.current) return;
            afterRef.current.currentTime = beforeRef.current.currentTime;
          }}
        />
      </div>

      <div className="video-compare__badges" aria-hidden>
        <span className="video-compare__badge">{beforeLabel}</span>
        <span className="video-compare__badge">{afterLabel}</span>
      </div>

      <div className="video-compare__handle" style={{ left: `${split}%` }} aria-hidden />

      <label htmlFor={inputId} className="sr-only">
        Move slider to compare before and after
      </label>
      <input
        id={inputId}
        className="video-compare__range"
        type="range"
        min="0"
        max="100"
        step="0.1"
        value={split}
        onChange={(event) => setSplit(Number(event.currentTarget.value))}
      />
    </div>
  );
}
