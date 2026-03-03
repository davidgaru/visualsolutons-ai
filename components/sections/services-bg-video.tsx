"use client";

export function ServicesBgVideo() {
  return (
    <div className="services-bg-video" aria-hidden>
      <video
        className="services-bg-video__el"
        src="/videos/services-bg.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
    </div>
  );
}
