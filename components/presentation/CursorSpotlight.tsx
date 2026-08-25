"use client";

import { useEffect, useRef } from "react";

export default function CursorSpotlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    let x = 0;
    let y = 0;

    function handleMove(e: MouseEvent) {
      x = e.clientX;
      y = e.clientY;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          if (ref.current) {
            ref.current.style.background = `radial-gradient(600px circle at ${x}px ${y}px, color-mix(in srgb, var(--color-accent) 7%, transparent), transparent 65%)`;
          }
          raf = 0;
        });
      }
    }

    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-30 hidden md:block"
    />
  );
}
