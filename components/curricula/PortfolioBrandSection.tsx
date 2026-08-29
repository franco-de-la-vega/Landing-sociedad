"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Briefcase, BadgeCheck } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionNumber from "@/components/curricula/SectionNumber";

const COLUMNS = [
  {
    title: "Portfolio",
    icon: Briefcase,
    items: ["Proyectos", "Llamadas", "Roleplays", "CRM", "Performance", "Evidencias"],
  },
  {
    title: "Marca profesional",
    icon: BadgeCheck,
    items: ["LinkedIn", "CV", "Pitch", "Presentación profesional", "Certificaciones", "Preparación para entrevistas"],
  },
];

function ProfileColumn({ col, index }: { col: (typeof COLUMNS)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <div ref={ref} className="flex flex-col">
      <div className="flex items-center gap-3">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent-muted)]"
        >
          <col.icon size={20} strokeWidth={1.8} className="text-[var(--color-accent)]" />
        </motion.div>
        <div>
          <h3 className="text-[19px] font-bold text-[var(--color-text-primary)]">{col.title}</h3>
          <span className="text-[13px] text-[var(--color-text-muted)]">{col.items.length} elementos</span>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2">
        {col.items.map((item, i) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, x: -10 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.35, delay: 0.25 + index * 0.1 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-base)] px-3.5 py-2.5"
          >
            <motion.svg
              viewBox="0 0 16 16"
              fill="none"
              className="h-3.5 w-3.5 shrink-0 text-[var(--color-accent)]"
              initial={{ pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : {}}
              transition={{ duration: 0.3, delay: 0.35 + index * 0.1 + i * 0.08 }}
            >
              <motion.path d="M3 8.2l3 3L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </motion.svg>
            <span className="text-[15.5px] text-[var(--color-text-secondary)]">{item}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function PortfolioBrandSection() {
  return (
    <section className="overflow-hidden relative border-t border-[var(--color-border)] px-6 py-24 md:px-10 md:py-32">
      <SectionNumber n="10" />
      <div className="mx-auto max-w-4xl">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <span className="text-[12.5px] font-semibold uppercase tracking-[0.08em] sm:text-[15px] sm:tracking-[0.12em] text-[var(--color-accent)]">
              Portfolio + marca profesional
            </span>
          </Reveal>
          <Reveal delay={0.08} className="mt-5">
            <h2 className="text-[1.9rem] font-bold leading-[1.2] tracking-tight text-[var(--color-text-primary)] sm:text-[2.4rem] md:text-[3.3rem]">
              Tu perfil profesional se construye durante la formación
            </h2>
          </Reveal>
        </div>

        {/* mockup tipo navegador: tu perfil armándose en vivo */}
        <Reveal delay={0.16} className="mt-14">
          <div className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[0_24px_60px_rgba(0,0,0,0.06)]">
            <div className="flex items-center gap-3 border-b border-[var(--color-border)] bg-[var(--color-bg-base)] px-5 py-3.5">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#EF6A5F]" aria-hidden />
                <span className="h-2.5 w-2.5 rounded-full bg-[#F5BD4F]" aria-hidden />
                <span className="h-2.5 w-2.5 rounded-full bg-[#61C654]" aria-hidden />
              </div>
              <div className="mx-auto flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-1.5">
                <svg viewBox="0 0 16 16" fill="none" className="h-3 w-3 text-[var(--color-text-muted)]">
                  <rect x="3.5" y="7" width="9" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.3" />
                  <path d="M5.5 7V5a2.5 2.5 0 015 0v2" stroke="currentColor" strokeWidth="1.3" />
                </svg>
                <span className="text-[12.5px] text-[var(--color-text-muted)]">tu-perfil-profesional</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-10 p-7 sm:grid-cols-2 sm:gap-8 sm:p-10">
              {COLUMNS.map((c, i) => (
                <ProfileColumn key={c.title} col={c} index={i} />
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2} className="mt-10 text-center">
          <p className="text-[18.5px] font-semibold text-[var(--color-text-primary)]">
            No esperes a conseguir experiencia para empezar a construir
            evidencia.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
