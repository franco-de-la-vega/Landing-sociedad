"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Reveal from "@/components/Reveal";
import SectionNumber from "@/components/curricula/SectionNumber";

const GATES = [
  {
    name: "Gate Junior",
    scope: "Sprints 1–8",
    evals: "Venta + CRM + operación remota + evidencia",
    result: "Bolsa de Empleo ILFC",
  },
  {
    name: "Gate High Ticket",
    scope: "Sprints 1–14",
    evals: "High Ticket + Performance + ejecución",
    result: "Bolsa de Empleo ILFC",
  },
  {
    name: "Gate Profesional",
    scope: "Sprints 1–18",
    evals: "Entrevista + Roleplay + CRM + Portfolio + Performance",
    result: "Conexión con empresa aliada*",
  },
];

function Padlock({ unlocked }: { unlocked: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 overflow-visible">
      <motion.g
        style={{ transformOrigin: "17.5px 10px" }}
        animate={{ rotate: unlocked ? -32 : 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
      >
        <path d="M8 10V7a4 4 0 018 0v3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </motion.g>
      <rect x="5" y="10" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <motion.circle
        cx="12"
        cy="14.2"
        r="1.15"
        fill="currentColor"
        animate={{ opacity: unlocked ? 1 : 0.5 }}
        transition={{ delay: 0.5 }}
      />
    </svg>
  );
}

function RequirementChip({ label, index, active }: { label: string; index: number; active: boolean }) {
  return (
    <motion.span
      initial={{ opacity: 0, x: -8 }}
      animate={active ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.35, delay: 0.5 + index * 0.14, ease: [0.16, 1, 0.3, 1] }}
      className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-[13.5px] font-medium text-white/75"
    >
      <motion.svg
        viewBox="0 0 16 16"
        fill="none"
        className="h-3.5 w-3.5 shrink-0 text-[var(--color-accent)]"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={active ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 0.3, delay: 0.62 + index * 0.14 }}
      >
        <motion.path d="M3 8.2l3 3L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </motion.svg>
      {label}
    </motion.span>
  );
}

function GateCard({ gate, index }: { gate: (typeof GATES)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.45 });
  const requirements = gate.evals.split(" + ");

  return (
    <div ref={ref} className="relative">
      {/* barrido de verificación */}
      {inView && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-3xl"
          aria-hidden
        >
          <motion.div
            className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-[var(--color-accent)]/25 to-transparent"
            initial={{ left: "-60%" }}
            animate={{ left: "140%" }}
            transition={{ duration: 0.9, ease: "easeInOut", delay: index * 0.15 }}
          />
        </motion.div>
      )}

      <div className="relative flex h-full flex-col gap-6 overflow-hidden rounded-3xl border border-white/10 bg-[#0B0C0E] p-7">
        <div
          className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-[0.12] blur-2xl"
          style={{ background: "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)" }}
          aria-hidden
        />

        <div className="relative flex items-start justify-between gap-4">
          <div>
            <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-white/40">
              Checkpoint 0{index + 1}
            </span>
            <h3 className="mt-1.5 text-[20.5px] font-bold text-white">{gate.name}</h3>
            <span className="mt-0.5 block text-[14px] text-white/45">{gate.scope}</span>
          </div>
          <motion.div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/70"
            animate={inView ? { borderColor: "var(--color-accent)", color: "var(--color-accent)" } : {}}
            transition={{ delay: 0.15 + index * 0.15, duration: 0.4 }}
          >
            <Padlock unlocked={inView} />
          </motion.div>
        </div>

        <div className="relative flex flex-wrap gap-2">
          {requirements.map((r, i) => (
            <RequirementChip key={r} label={r} index={i} active={inView} />
          ))}
        </div>

        <motion.div
          className="relative mt-auto flex items-center gap-2.5 border-t border-white/10 pt-5"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.5 + requirements.length * 0.14 + 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 shrink-0 text-[var(--color-accent)]">
            <path d="M10 4v12M5 11l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[16.5px] font-semibold text-white">{gate.result}</span>
        </motion.div>
      </div>
    </div>
  );
}

export default function EmployabilityGatesSection() {
  return (
    <section className="overflow-hidden relative border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-6 py-24 md:px-10 md:py-32">
      <SectionNumber n="11" />
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <span className="text-[12.5px] font-semibold uppercase tracking-[0.08em] sm:text-[15px] sm:tracking-[0.12em] text-[var(--color-text-secondary)]">
              Empleabilidad + Gates
            </span>
          </Reveal>
          <Reveal delay={0.08} className="mt-5">
            <h2 className="text-[1.7rem] font-bold leading-[1.2] tracking-tight text-[var(--color-text-primary)] sm:text-[2.2rem] md:whitespace-nowrap md:text-[2.9rem]">
              Formación{" → "}Gate{" → "}Oportunidad
            </h2>
          </Reveal>
        </div>

        <div className="relative mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          {/* línea de progresión entre los 3 checkpoints (solo desktop) */}
          <div className="pointer-events-none absolute left-[16.6%] right-[16.6%] top-[52px] hidden h-px bg-white/10 md:block" aria-hidden />
          {GATES.map((g, i) => (
            <GateCard key={g.name} gate={g} index={i} />
          ))}
        </div>

        <Reveal delay={0.2} className="mx-auto mt-10 max-w-2xl text-center">
          <p className="text-[15.5px] leading-relaxed text-[var(--color-text-muted)]">
            El acceso a la Bolsa de Empleo y la conexión con oportunidades no
            constituyen garantía de contratación. Cada empresa establece sus
            propios requisitos y proceso de selección.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
