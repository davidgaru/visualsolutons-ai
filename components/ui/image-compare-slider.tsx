"use client";

import { useId, useState } from "react";

type ImageCompareSliderProps = {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
  defaultSplit?: number;
};

export function ImageCompareSlider({
  beforeSrc,
  afterSrc,
  beforeLabel = "Before",
  afterLabel = "After",
  className,
  defaultSplit = 50
}: ImageCompareSliderProps) {
  const [split, setSplit] = useState(defaultSplit);
  const inputId = useId();

  const composedClassName = className ? `video-compare ${className}` : "video-compare";

  return (
    <div className={composedClassName}>
      <img src={afterSrc} alt={afterLabel} className="video-compare__video" draggable={false} />

      <div className="video-compare__before" style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}>
        <img src={beforeSrc} alt={beforeLabel} className="video-compare__video" draggable={false} />
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
