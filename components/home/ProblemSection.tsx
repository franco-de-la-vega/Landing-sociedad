"use client";

import { useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";

const PILLARS = ["Práctica.", "Medición.", "Corrección."];

// Cuánto del recorrido hace falta para encender cada paso (frase 1, frase 2, y cada pilar)
const STEPS = [0.05, 0.25, 0.45, 0.6, 0.75];

export default function ProblemSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [step, setStep] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setStep(STEPS.filter((s) => v >= s).length));

  const on = (i: number) => step > i;
  const fade = "transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]";

  return (
    <section ref={ref} className="relative h-[180vh] bg-[var(--color-bg-base)]">
      <div className="sticky top-0 flex h-screen items-center px-6 md:px-12">
        <div className="mx-auto w-full max-w-6xl">
          <p
            className={`text-2xl font-semibold tracking-[-0.02em] text-[var(--color-text-secondary)] sm:text-4xl ${fade} ${
              on(0) ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            Tenés la capacidad.
          </p>
          <h2
            className={`mt-3 text-5xl font-bold leading-[1] tracking-[-0.045em] text-[var(--color-text-primary)] sm:text-7xl lg:text-[6.5rem] ${fade} ${
              on(1) ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
          >
            Te faltó el{" "}
            <span className="font-serif-display font-normal italic tracking-[-0.02em] text-[var(--color-accent-hover)]">
              entrenamiento.
            </span>
          </h2>

          <div className="mt-14 grid grid-cols-1 gap-3 border-t border-black/10 pt-10 sm:mt-20 sm:grid-cols-3 sm:gap-8">
            {PILLARS.map((p, i) => (
              <div key={p} className={`${fade} ${on(i + 2) ? "opacity-100" : "opacity-[0.12]"}`}>
                <span className="text-xs font-semibold tracking-[0.14em] text-[var(--color-accent)]">0{i + 1}</span>
                <div className="mt-2 text-3xl font-bold tracking-[-0.03em] text-[var(--color-text-primary)] sm:text-5xl">{p}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
