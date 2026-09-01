"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Crosshair, Users, Link2 } from "lucide-react";
import RevealGroup from "./RevealGroup";
import RevealItem from "./RevealItem";
import Reveal from "./Reveal";
import Watermark from "./Watermark";

const steps = [
  {
    icon: Crosshair,
    label: "Simulación",
    title: "Practicás antes de vender de verdad",
    body: "Llamadas de venta simuladas, con feedback inmediato después de cada intento, hasta que la técnica te sale natural.",
  },
  {
    icon: Users,
    label: "Mentoría",
    title: "Guía de practicantes activos",
    body: "Acompañamiento directo de profesionales activos en el mercado remoto, no tutores genéricos leyendo un guion.",
  },
  {
    icon: Link2,
    label: "Conexión",
    title: "Puente a empresas reales",
    body: "Puente directo hacia redes de contratación internacional según tu desempeño evaluado.",
  },
];

export default function BentoSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.5"],
  });
  const ruleScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      id="metodo"
      ref={ref}
      className="relative z-10 mx-auto max-w-7xl border-t border-black/10 px-6 py-24 md:px-12"
    >
      <Watermark text="The Method" className="top-[14%]" />

      <div className="relative">
        <Reveal>
          <h2 className="mb-2 text-left text-3xl font-bold tracking-tight text-[var(--color-text-primary)] md:text-5xl">
            Un sistema, no un curso.
          </h2>
        </Reveal>
        <Reveal delay={0.06}>
          <motion.span
            style={{ scaleX: ruleScale }}
            className="mb-16 block h-px w-24 origin-left bg-gradient-to-r from-[var(--color-accent)] to-transparent"
          />
        </Reveal>

        <RevealGroup stagger={0.12} className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {steps.map((s) => (
            <RevealItem key={s.label}>
              <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-[var(--color-bg-elevated)] p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-[var(--color-accent)]/30 hover:shadow-[0_24px_48px_-16px_rgba(0,0,0,0.12)]">
                <div className="relative flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/[0.08] text-[var(--color-accent-hover)] transition-colors duration-300 group-hover:bg-[var(--color-accent)]/[0.14]">
                    <s.icon size={18} strokeWidth={1.75} />
                  </span>
                  <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--color-text-muted)] transition-colors duration-300 group-hover:text-[var(--color-accent)]">
                    {s.label}
                  </span>
                </div>

                <h3 className="relative mt-6 text-xl font-semibold leading-snug text-[var(--color-text-primary)]">
                  {s.title}
                </h3>
                <p className="relative mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  {s.body}
                </p>

                <span className="relative mt-6 block h-px w-0 bg-[var(--color-accent)] transition-all duration-500 group-hover:w-12" />
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
