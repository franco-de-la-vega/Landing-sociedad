"use client";

import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";

const EVIDENCE = [
  "Llamadas grabadas",
  "Roleplays",
  "Performance Reports",
  "CRM",
  "Follow-up",
  "Casos comerciales",
  "Deals",
  "Dashboards",
  "CV",
  "LinkedIn",
  "Entrevistas",
];

export default function ProjectsSection() {
  const row = [...EVIDENCE, ...EVIDENCE];

  return (
    <section className="relative overflow-hidden border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6 text-center md:px-10">
        <Reveal>
          <span className="text-[12.5px] font-semibold uppercase tracking-[0.08em] sm:text-[15px] sm:tracking-[0.12em] text-[var(--color-text-secondary)]">
            Proyectos + evidencias
          </span>
        </Reveal>
        <Reveal delay={0.08} className="mt-5">
          <h2 className="text-[1.9rem] font-bold leading-[1.2] tracking-tight text-[var(--color-text-primary)] sm:text-[2.4rem] md:text-[3.3rem]">
            No terminás con solo un certificado
          </h2>
        </Reveal>
        <Reveal delay={0.14} className="mt-5">
          <p className="mx-auto max-w-xl text-[18.5px] leading-relaxed text-[var(--color-text-secondary)]">
            Durante la formación construís evidencia real: cada Sprint suma
            una pieza a tu portfolio profesional.
          </p>
        </Reveal>

        <Reveal delay={0.2} className="mt-16">
          <div className="mx-auto flex max-w-3xl items-center justify-center gap-2 sm:gap-6">
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-base)] px-3.5 py-3 sm:rounded-2xl sm:px-8 sm:py-6">
              <span className="block text-[11.5px] font-semibold uppercase tracking-[0.06em] text-[var(--color-text-muted)] sm:text-[14.5px] sm:tracking-[0.08em]">
                Sprint 01
              </span>
              <span className="mt-0.5 block text-[14px] font-bold text-[var(--color-text-primary)] sm:mt-1 sm:text-[18.5px]">Evidencia</span>
            </div>

            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0 text-[var(--color-accent)] sm:h-6 sm:w-6">
              <path d="M4 12h16M14 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-base)] px-3.5 py-3 sm:rounded-2xl sm:px-8 sm:py-6">
              <span className="block text-[11.5px] font-semibold uppercase tracking-[0.06em] text-[var(--color-text-muted)] sm:text-[14.5px] sm:tracking-[0.08em]">
                Sprint 18
              </span>
              <span className="mt-0.5 block text-[14px] font-bold text-[var(--color-text-primary)] sm:mt-1 sm:text-[18.5px]">Evidencia</span>
            </div>

            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0 text-[var(--color-accent)] sm:h-6 sm:w-6">
              <path d="M4 12h16M14 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            <div className="rounded-xl border border-[var(--color-accent)]/35 bg-[var(--color-accent-muted)] px-3.5 py-3 sm:rounded-2xl sm:px-8 sm:py-6">
              <span className="block text-[13px] font-bold leading-tight text-[var(--color-accent-hover)] sm:text-[18.5px]">Portfolio profesional</span>
            </div>
          </div>
        </Reveal>
      </div>

      {/* marquee de evidencias, más aire y sin wrap apretado */}
      <Reveal delay={0.26} className="relative mt-16">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[var(--color-bg-elevated)] to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[var(--color-bg-elevated)] to-transparent"
          aria-hidden
        />
        <motion.div
          className="flex w-max gap-4"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        >
          {row.map((e, i) => (
            <span
              key={`${e}-${i}`}
              className="whitespace-nowrap rounded-full border border-[var(--color-border)] bg-[var(--color-bg-base)] px-5 py-3 text-[15.5px] font-medium text-[var(--color-text-secondary)]"
            >
              {e}
            </span>
          ))}
        </motion.div>
      </Reveal>
    </section>
  );
}
