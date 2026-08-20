"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import RevealGroup from "./RevealGroup";
import RevealItem from "./RevealItem";
import Reveal from "./Reveal";
import Watermark from "./Watermark";

const steps = [
  {
    label: "Simulación",
    title: "Entrená bajo presión real",
    body: "Entorno real de estrés y evaluación bajo condiciones de mercado, con feedback estructurado en cada intento.",
  },
  {
    label: "Mentoría",
    title: "Guía de practicantes activos",
    body: "Acompañamiento directo de profesionales activos en el mercado remoto, no tutores genéricos leyendo un guion.",
  },
  {
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
      className="relative z-10 mx-auto max-w-7xl border-t border-white/10 px-6 py-24 md:px-12"
    >
      <Watermark text="The Method" className="top-[14%]" />

      <div className="relative">
        <Reveal>
          <h2 className="mb-2 text-left text-3xl font-bold tracking-tight text-white md:text-5xl">
            Un sistema, no un curso.
          </h2>
        </Reveal>
        <Reveal delay={0.06}>
          <motion.span
            style={{ scaleX: ruleScale }}
            className="mb-16 block h-px w-24 origin-left bg-gradient-to-r from-accent to-transparent"
          />
        </Reveal>

        <RevealGroup stagger={0.14} className="flex flex-col divide-y divide-white/10 border-t border-b border-white/10">
          {steps.map((s) => (
            <RevealItem key={s.label}>
              <div className="group grid grid-cols-1 gap-3 py-10 transition-colors duration-300 md:grid-cols-[minmax(0,220px)_1fr] md:items-baseline md:gap-10">
                <span className="font-serif-display text-2xl italic leading-none text-zinc-500 transition-colors duration-300 group-hover:text-accent">
                  {s.label}
                </span>
                <div>
                  <h3 className="relative inline-block text-xl font-semibold text-white transition-transform duration-300 group-hover:translate-x-1">
                    {s.title}
                    <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all duration-500 group-hover:w-full" />
                  </h3>
                  <p className="mt-3 max-w-lg text-sm leading-relaxed text-zinc-400">
                    {s.body}
                  </p>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
