"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function BrandSignature() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const headlineY = useTransform(scrollYProgress, [0, 1], [46, -46]);

  return (
    <section ref={ref} className="neo-signature">
      <div className="container neo-signature__inner">
        <div className="neo-signature__lead">
          <p className="eyebrow">Approach</p>
          <motion.h2 style={{ y: headlineY }}>
            AI with a director&apos;s eye.
          </motion.h2>
        </div>

        <div className="neo-signature__copy">
          <p>We design visuals as authored frames, not prompts.</p>
          <p>From previsual mood to final delivery, every shot is curated for brand impact.</p>
        </div>
      </div>
    </section>
  );
}
