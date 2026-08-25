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
    body: "Conexión con oportunidades comerciales según tu desempeño y la disponibilidad del momento. Posterior a la formación, no forma parte del programa académico.",
    featured: false,
  },
  {
    tag: "Fase 5",
    title: "Consolidación & Especialización",
    body: "Crecimiento continuo en el mercado a partir de la experiencia acumulada en proyectos reales.",
    featured: false,
  },
];

export default function TimelineSection() {
  const [open, setOpen] = useState(1);

  return (
    <section className="relative border-t border-[var(--color-border)] px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <span className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-secondary)]">
            Hoja de ruta
          </span>
        </Reveal>
        <Reveal delay={0.08} className="mt-5">
          <h2 className="max-w-2xl text-[2rem] font-bold leading-[1.15] tracking-tight text-[var(--color-text-primary)] md:text-[2.8rem]">
            Tu Evolución Profesional
          </h2>
        </Reveal>
        <Reveal delay={0.14} className="mt-4">
          <p className="max-w-xl text-[16.5px] leading-relaxed text-[var(--color-text-secondary)]">
            De la formación a la oportunidad comercial: así se estructura
            el proceso completo. Tocá cada etapa para ver el detalle.
          </p>
        </Reveal>

        <div className="relative mt-24">
          {/* riel horizontal: línea estática + pulso de energía viajando en loop */}
          <div className="absolute inset-x-2 top-0 hidden h-px bg-black/10 md:block" />
          <motion.div
            aria-hidden
            animate={{ left: ["0%", "100%"] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.6 }}
            className="absolute top-0 hidden h-px w-1/4 -translate-x-1/2 md:block"
            style={{
              background:
                "linear-gradient(90deg, transparent, var(--color-accent) 50%, transparent)",
              filter: "drop-shadow(0 0 6px var(--color-accent))",
            }}
          />

          <div className="grid grid-cols-1 gap-x-4 gap-y-10 md:grid-cols-5">
            {steps.map((s, i) => {
              const isOpen = open === i;
              return (
                <div key={s.tag} className="relative flex flex-col items-center">
                  {/* nodo + palito */}
                  <div className="relative hidden h-8 w-full items-start justify-center md:flex">
                    <motion.span
                      animate={
                        s.featured
                          ? {
                              boxShadow: [
                                "0 0 0px rgba(184,147,90,0)",
                                "0 0 14px rgba(184,147,90,0.6)",
                                "0 0 0px rgba(184,147,90,0)",
                              ],
                            }
                          : undefined
                      }
                      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                      className={`h-3 w-3 rounded-full ${
                        s.featured ? "bg-[var(--color-accent)]" : "bg-zinc-600"
                      }`}
                    />
                    <span className="absolute top-3 h-5 w-px bg-black/10" />
                  </div>

                  {/* pastilla clickeable */}
                  <button
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className={`group w-full rounded-full border px-4 py-2.5 text-left transition-colors duration-300 md:text-center ${
                      isOpen
                        ? s.featured
                          ? "border-[var(--color-accent)]/50 bg-[var(--color-accent)]/[0.06]"
                          : "border-[var(--color-border-strong)] bg-black/[0.04]"
                        : "border-[var(--color-border)] bg-[var(--color-bg-elevated)] hover:border-[var(--color-border-strong)]"
                    }`}
                  >
                    <span
                      className={`block text-[11px] uppercase tracking-widest ${
                        s.featured ? "text-[var(--color-accent)]" : "text-[var(--color-text-muted)]"
                      }`}
                    >
                      {s.tag}
                    </span>
                    <span className="mt-0.5 block text-[15px] font-semibold text-[var(--color-text-primary)]">
                      {s.title}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full overflow-hidden"
                      >
                        <div
                          className={`mt-3 rounded-2xl border p-5 text-center md:text-left ${
                            s.featured
                              ? "border-[var(--color-accent)]/30 bg-[var(--color-bg-elevated-2)] shadow-[0_20px_40px_-22px_rgba(20,18,14,0.18)]"
                              : "border-[var(--color-border)] bg-[var(--color-bg-elevated)]"
                          }`}
                        >
                          <p className="text-[13.5px] leading-relaxed text-[var(--color-text-secondary)]">
                            {s.body}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
