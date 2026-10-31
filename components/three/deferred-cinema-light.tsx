"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const CinemaLightScene = dynamic(
  () => import("./cinema-light-scene").then((module) => module.CinemaLightScene),
  { ssr: false }
);

export function DeferredCinemaLight() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => { timer = setTimeout(() => setReady(true), 1500); };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("load", schedule);
    };
  }, []);
  return ready ? <CinemaLightScene /> : null;
}
