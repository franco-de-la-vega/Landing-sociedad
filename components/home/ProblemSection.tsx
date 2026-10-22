"use client";

import { useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";

const TEXT =
  "Tenés la capacidad. Lo que te faltó fue una formación que te prepare para el mercado real. Acá no se memoriza teoría: se practica, se mide y se corrige hasta que sale natural.";
// Palabras que quedan en dorado cuando se encienden
const HIGHLIGHT = new Set(["capacidad.", "mercado", "real.", "practica,", "mide", "corrige"]);

function Word({ word, lit }: { word: string; lit: boolean }) {
  return (
    <span
      className={`mr-[0.25em] inline-block transition-opacity duration-500 ${lit ? "opacity-100" : "opacity-[0.14]"} ${
        HIGHLIGHT.has(word) ? "font-serif-display font-normal italic text-[var(--color-accent-hover)]" : ""
      }`}
    >
      {word}
    </span>
  );
}

export default function ProblemSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const words = TEXT.split(" ");
  const [lit, setLit] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setLit(Math.round((v / 0.85) * words.length)));

  return (
    <section ref={ref} className="relative h-[260vh] bg-[var(--color-bg-base)]">
      <div className="sticky top-0 flex h-screen items-center px-6 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex items-center gap-3 text-[12px] font-medium uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
            <span className="h-px w-8 bg-[var(--color-accent)]" />
            El problema no es tu capacidad
          </div>
          <p className="text-[2rem] font-bold leading-[1.15] tracking-[-0.03em] text-[var(--color-text-primary)] sm:text-5xl lg:text-[4rem]">
            {words.map((w, i) => (
              <Word key={i} word={w} lit={i < lit} />
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
