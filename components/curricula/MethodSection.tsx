"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import SectionNumber from "@/components/curricula/SectionNumber";

const STEPS = [
  { n: "01", title: "Aprende", body: "Conceptos, metodologías y fundamentos comerciales." },
  { n: "02", title: "Practica", body: "Ejercicios, simulaciones y roleplays." },
  { n: "03", title: "Ejecuta", body: "Aplicación en escenarios comerciales." },
  { n: "04", title: "Mide", body: "Evaluamos tu desempeño." },
  { n: "05", title: "Mejora", body: "Identificamos brechas y trabajamos sobre ellas." },
  { n: "06", title: "Demuestra", body: "Generás una evidencia profesional." },
];

const TOTAL = STEPS.length;

function StepRow({
  step,
  index,
  active,
  setRef,
}: {
  step: (typeof STEPS)[number];
  index: number;
  active: number;
  setRef: (el: HTMLDivElement | null) => void;
}) {
  const isActive = index === active;
  return (
    <div
      ref={setRef}
      data-step-index={index}
      className={`flex items-start gap-5 border-l-2 py-9 pl-7 transition-all duration-500 ease-out sm:gap-6 sm:py-11 sm:pl-9 ${
        isActive ? "border-[var(--color-accent)]" : "border-[var(--color-border)]"
      }`}
    >
      <span
        className={`shrink-0 text-[2.2rem] font-bold leading-none transition-all duration-500 sm:text-[2.8rem] ${
          isActive ? "text-[var(--color-accent)] opacity-100" : "text-[var(--color-text-muted)] opacity-40"
        }`}
      >
        {step.n}
      </span>
      <div
        className={`transition-all duration-500 ${
          isActive ? "opacity-100 translate-x-0" : "opacity-55 translate-x-0"
        }`}
      >
        <h3
          className={`text-[22px] font-bold transition-colors duration-500 sm:text-[26px] ${
            isActive ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-secondary)]"
          }`}
        >
          {step.title}
        </h3>
        <p className="mt-2 max-w-md text-[15.5px] leading-relaxed text-[var(--color-text-secondary)] sm:text-[17px]">
          {step.body}
        </p>
      </div>
    </div>
  );
}

export default function MethodSection() {
  const [active, setActive] = useState(0);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-step-index"));
            setActive(idx);
          }
        });
      },
      { rootMargin: "-42% 0px -42% 0px", threshold: 0 }
    );
    rowRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const step = STEPS[active];

  return (
    <section className="overflow-hidden relative border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-6 py-24 md:px-10 md:py-32">
      <SectionNumber n="04" />
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <span className="text-[12.5px] font-semibold uppercase tracking-[0.08em] sm:text-[15px] sm:tracking-[0.12em] text-[var(--color-accent)]">
            Método ILFC
          </span>
        </Reveal>
        <Reveal delay={0.08} className="mt-5">
          <h2 className="text-[1.9rem] font-bold leading-[1.2] tracking-tight text-[var(--color-text-primary)] sm:text-[2.4rem] md:text-[3.3rem]">
            Aprendé. Practicá. Medí. Demostrá.
          </h2>
        </Reveal>
      </div>

      <div className="relative mx-auto mt-16 grid max-w-5xl gap-4 lg:grid-cols-[320px_1fr] lg:gap-16">
        {/* panel fijo: número grande + anillo, refleja el paso activo mientras scrolleás la lista */}
        <div className="hidden lg:block">
          <div className="sticky top-1/2 flex -translate-y-1/2 flex-col items-center justify-center rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-base)] py-16">
            <div className="relative flex h-40 w-40 items-center justify-center">
              <svg viewBox="0 0 160 160" className="absolute h-full w-full -rotate-90">
                <circle cx="80" cy="80" r="72" fill="none" stroke="var(--color-border)" strokeWidth="2" />
                <motion.circle
                  cx="80"
                  cy="80"
                  r="72"
                  fill="none"
                  stroke="var(--color-accent)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 72}
                  animate={{ strokeDashoffset: 2 * Math.PI * 72 * (1 - (active + 1) / TOTAL) }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                />
              </svg>
              <motion.span
                key={step.n}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="text-[3.2rem] font-bold text-[var(--color-accent)]"
              >
                {step.n}
              </motion.span>
            </div>
            <motion.h3
              key={step.title}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="mt-6 text-[24px] font-bold text-[var(--color-text-primary)]"
            >
              {step.title}
            </motion.h3>
            <span className="mt-2 text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
              Paso {active + 1} de {TOTAL}
            </span>
          </div>
        </div>

        {/* lista de pasos: siempre visible, se resalta el que está pasando por el centro */}
        <div className="flex flex-col">
          {STEPS.map((s, i) => (
            <StepRow
              key={s.n}
              step={s}
              index={i}
              active={active}
              setRef={(el) => {
                rowRefs.current[i] = el;
              }}
            />
          ))}
        </div>
      </div>

      <Reveal delay={0.1} className="mx-auto mt-20 max-w-2xl border-t border-[var(--color-border)] pt-14 text-center">
        <p className="text-[1.7rem] font-bold leading-[1.3] tracking-tight text-[var(--color-text-primary)] md:text-[2.1rem]">
          Cada Sprint termina con{" "}
          <span className="text-[var(--color-accent)]">una evaluación</span>{" "}
          y{" "}
          <span className="text-[var(--color-accent)]">una evidencia concreta</span>{" "}
          de lo aprendido.
        </p>
      </Reveal>
    </section>
  );
}
