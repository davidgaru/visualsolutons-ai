"use client";

export function WorkBgVideo() {
  return (
    <div className="work-bg-video" aria-hidden>
      <video
        className="work-bg-video__el"
        src="/videos/work-bg.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
    </div>
  );
}
