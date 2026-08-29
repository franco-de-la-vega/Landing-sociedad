"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/presentation/CountUp";
import SectionNumber from "@/components/curricula/SectionNumber";

const FLOW = [
  "Llamadas",
  "Performance",
  "Datos + IA",
  "Dashboard",
  "Brechas detectadas",
  "Entrenamiento continuo",
  "Nueva data",
];

const SCORES = [
  { label: "Comunicación", value: 85 },
  { label: "Discovery", value: 82 },
  { label: "Diagnóstico", value: 76 },
  { label: "Objeciones", value: 68 },
  { label: "Cierre", value: 72 },
];

function ScoreGauge() {
  const radius = 88;
  const circumference = 2 * Math.PI * radius;
  const score = 78;
  const offset = circumference * (1 - score / 100);

  return (
    <div className="relative flex h-[220px] w-[220px] shrink-0 items-center justify-center">
      <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
        <circle cx="100" cy="100" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
        <motion.circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: offset }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          style={{ filter: "drop-shadow(0 0 6px var(--color-accent))" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-[3.2rem] font-bold leading-none text-white">
          <CountUp value={score} duration={1.8} />
        </span>
        <span className="mt-1 text-[12px] font-semibold uppercase tracking-[0.1em] text-white/40">/ 100</span>
      </div>
    </div>
  );
}

function DataFlow() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <div ref={ref} className="relative mx-auto max-w-3xl">
      <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
        {FLOW.slice(0, 4).map((step, i) => (
          <FlowNode key={step} label={step} index={i} inView={inView} />
        ))}
      </div>
      <div className="mt-8 grid grid-cols-3 gap-x-6 gap-y-8 sm:mx-auto sm:max-w-xl">
        {FLOW.slice(4).map((step, i) => (
          <FlowNode key={step} label={step} index={i + 4} inView={inView} />
        ))}
      </div>
    </div>
  );
}

function FlowNode({ label, index, inView }: { label: string; index: number; inView: boolean }) {
  return (
    <motion.div
      className="flex flex-col items-center gap-2"
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.09, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="relative flex h-2.5 w-2.5 items-center justify-center">
        <motion.span
          className="absolute inline-flex h-full w-full rounded-full bg-[var(--color-accent)]"
          animate={{ scale: [1, 2.2], opacity: [0.5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, delay: index * 0.25, ease: "easeOut" }}
        />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--color-accent)]" />
      </div>
      <span className="text-center text-[14.5px] font-semibold text-[var(--color-text-secondary)]">{label}</span>
    </motion.div>
  );
}

export default function PerformanceIntelligenceSection() {
  return (
    <section className="overflow-hidden relative border-t border-[var(--color-border)] px-6 py-24 md:px-10 md:py-32">
      <SectionNumber n="08" />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[36rem] w-[56rem] -translate-x-1/2 -translate-y-1/2 opacity-[0.06] blur-3xl"
        style={{ background: "radial-gradient(ellipse, var(--color-accent) 0%, transparent 70%)" }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <span className="text-[12.5px] font-semibold uppercase tracking-[0.08em] sm:text-[15px] sm:tracking-[0.12em] text-[var(--color-accent)]">
              Performance Intelligence + IA
            </span>
          </Reveal>
          <Reveal delay={0.08} className="mt-5">
            <h2 className="text-[1.9rem] font-bold leading-[1.2] tracking-tight text-[var(--color-text-primary)] sm:text-[2.4rem] md:text-[3.3rem]">
              Tu performance se convierte en data
            </h2>
          </Reveal>
          <Reveal delay={0.14} className="mt-5">
            <p className="mx-auto max-w-xl text-[19px] leading-relaxed text-[var(--color-text-secondary)]">
              No dependés solo de &ldquo;creo que estoy mejorando&rdquo;. Podés
              observar tus datos, tus fortalezas, tus brechas y tu progreso.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.2} className="mt-16">
          <DataFlow />
        </Reveal>

        <Reveal delay={0.28} className="mt-16">
          <div className="relative mx-auto max-w-2xl overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[#0B0C0E] p-8 md:p-10">
            {/* barrido de escaneo */}
            <motion.div
              className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent"
              animate={{ left: ["-40%", "140%"] }}
              transition={{ duration: 4, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" }}
              aria-hidden
            />

            <div className="relative flex flex-col items-center gap-2 pb-8 text-center">
              <span className="text-[13.5px] font-semibold uppercase tracking-[0.1em] text-white/50">
                Closer Performance Score
              </span>
              <ScoreGauge />
            </div>

            <div className="relative mt-2 flex flex-col gap-4 border-t border-white/10 pt-8">
              {SCORES.map((s, i) => (
                <div key={s.label} className="flex items-center gap-4">
                  <span className="w-32 shrink-0 text-[16.5px] text-white/60">{s.label}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      className="relative h-full rounded-full bg-[var(--color-accent)]"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${s.value}%` }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ duration: 1, delay: 0.1 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                      style={{ boxShadow: "0 0 8px var(--color-accent)" }}
                    />
                  </div>
                  <span className="w-8 shrink-0 text-right text-[16.5px] font-semibold text-white">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="mx-auto mt-8 max-w-xl text-center">
          <p className="text-[17px] leading-relaxed text-[var(--color-text-secondary)]">
            Performance Intelligence es un sistema tecnológico desarrollado por
            el Instituto y actualmente se encuentra en evolución. Sus
            funcionalidades y capacidades pueden ampliarse progresivamente.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
