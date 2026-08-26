"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

export default function RangeCountUp({
  low,
  high,
  suffix = "",
  duration = 1.4,
  delay = 0,
  className,
}: {
  low: number;
  high: number;
  suffix?: string;
  duration?: number;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [displayLow, setDisplayLow] = useState(0);
  const [displayHigh, setDisplayHigh] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start: number | null = null;
    let raf = 0;
    const timeout = setTimeout(() => {
      function step(ts: number) {
        if (start === null) start = ts;
        const progress = Math.min((ts - start) / (duration * 1000), 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayLow(Math.round(low * eased));
        setDisplayHigh(Math.round(high * eased));
        if (progress < 1) raf = requestAnimationFrame(step);
      }
      raf = requestAnimationFrame(step);
    }, delay * 1000);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [inView, low, high, duration, delay]);

  return (
    <span ref={ref} className={className}>
      ${displayLow.toLocaleString("en-US")} – ${displayHigh.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}
