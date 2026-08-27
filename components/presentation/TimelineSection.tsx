"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "@/components/Reveal";

const steps = [
  {
    tag: "Fase 1",
    title: "Formación",
    body: "8 semanas de currícula adaptativa según tu diagnóstico inicial: comunicación, discovery, objeciones y CRM.",
    featured: false,
  },
  {
    tag: "Fase 2",
    title: "Certificación & Portafolio",
    body: "Evaluación final, historial de desempeño y portafolio de evidencia comercial listo para mostrar.",
    featured: true,
  },
  {
    tag: "Fase 3",
    title: "Preparación para el Mercado",
    body: "Perfil profesional, optimización de LinkedIn y preparación para procesos de selección reales.",
    featured: false,
  },
  {
    tag: "Fase 4",
    title: "Vinculación",
    body: "Preparamos talento. Desarrollamos performance. Facilitamos conexiones: cuando existan oportunidades compatibles con tu perfil y los procesos disponibles, podemos facilitar la conexión con empresas. Posterior a la formación, no forma parte del programa académico.",
    featured: false,
  },
  {
    tag: "Fase 5",
    title: "Consolidación & Especialización",
    body: "Crecimiento continuo en el mercado a partir de la experiencia acumulada en proyectos reales.",
    featured: false,
  },
];

// Posiciones de los 5 hitos sobre el sendero ascendente (viewBox 0 0 1000 260)
const markers = [
  { x: 60, y: 210 },
  { x: 290, y: 150 },
  { x: 500, y: 175 },
  { x: 710, y: 100 },
  { x: 930, y: 55 },
];

const path =
  "M60 210 C 150 210, 200 150, 290 150 S 420 175, 500 175 S 640 100, 710 100 S 860 55, 930 55";

export default function TimelineSection() {
  const [open, setOpen] = useState(1);
  const active = steps[open] ?? steps[1];

  return (
    <section className="relative border-t border-[var(--color-border)] px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <span className="text-[14px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-secondary)]">
            Hoja de ruta
          </span>
        </Reveal>
        <Reveal delay={0.08} className="mt-5">
          <h2 className="max-w-2xl text-[2.4rem] font-bold leading-[1.1] tracking-tight text-[var(--color-text-primary)] md:text-[3.3rem]">
            Tu Evolución Profesional
          </h2>
        </Reveal>
        <Reveal delay={0.14} className="mt-4">
          <p className="max-w-xl text-[18px] leading-relaxed text-[var(--color-text-secondary)]">
            De la formación a la oportunidad comercial: así se estructura
            el proceso completo. Tocá cada hito para ver el detalle.
          </p>
        </Reveal>

        <Reveal delay={0.2} className="mt-20">
          <svg viewBox="0 0 1000 260" className="h-auto w-full overflow-visible">
            <path
              d={path}
              fill="none"
              stroke="var(--color-border-strong)"
              strokeWidth="3"
              strokeDasharray="1 9"
              strokeLinecap="round"
            />
            {markers.map((m, i) => {
              const s = steps[i];
              const isOpen = open === i;
              return (
                <g
                  key={s.tag}
                  className="cursor-pointer"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                >
                  <circle cx={m.x} cy={m.y} r="26" fill="transparent" />
                  <motion.circle
                    cx={m.x}
                    cy={m.y}
                    r={isOpen ? 11 : 8}
                    fill={isOpen ? "var(--color-accent)" : "var(--color-bg-elevated)"}
                    stroke="var(--color-accent)"
                    strokeWidth="3"
                    animate={
                      s.featured
                        ? {
                            boxShadow: undefined,
                          }
                        : undefined
                    }
                    transition={{ duration: 0.25 }}
                  />
                  {s.featured && (
                    <motion.circle
                      cx={m.x}
                      cy={m.y}
                      r="16"
                      fill="none"
                      stroke="var(--color-accent)"
                      strokeWidth="1.5"
                      animate={{ r: [16, 22, 16], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                    />
                  )}
                  <text
                    x={m.x}
                    y={m.y - 28}
                    textAnchor="middle"
                    className={`text-[14px] font-bold uppercase tracking-widest ${
                      isOpen ? "fill-[var(--color-accent)]" : "fill-[var(--color-text-muted)]"
                    }`}
                  >
                    {s.tag}
                  </text>
                  <text
                    x={m.x}
                    y={m.y + 42}
                    textAnchor="middle"
                    className="fill-[var(--color-text-primary)] text-[18px] font-bold"
                  >
                    {s.title.length > 16 ? s.title.split(" &")[0] : s.title}
                  </text>
                </g>
              );
            })}
          </svg>
        </Reveal>

        <AnimatePresence mode="wait">
          <motion.div
            key={open}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={`mx-auto mt-6 max-w-2xl rounded-2xl border p-6 text-center ${
              active.featured
                ? "border-[var(--color-accent)]/30 bg-[var(--color-accent)]/[0.04]"
                : "border-[var(--color-border)] bg-[var(--color-bg-elevated)]"
            }`}
          >
            <h3 className="text-[19px] font-bold text-[var(--color-text-primary)]">{active.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
              {active.body}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
