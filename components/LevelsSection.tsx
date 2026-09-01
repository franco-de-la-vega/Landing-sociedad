"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "./Reveal";
import RevealGroup from "./RevealGroup";
import RevealItem from "./RevealItem";

const levels = [
  {
    code: "N0",
    name: "Nivel 0",
    intro: "Nunca trabajaste remoto.",
    body: "Arrancás desde los fundamentos reales de una venta remota: estructura de llamada, tono, y los primeros hábitos que separan a alguien que improvisa de alguien que sigue un proceso.",
  },
  {
    code: "TR",
    name: "Trainee",
    intro: "Primeras nociones aplicadas.",
    body: "Ya tenés noción básica del proceso. Acá se pule: manejo de llamadas guiadas, seguimiento ordenado y las primeras objeciones reales, con feedback después de cada intento.",
  },
  {
    code: "JR",
    name: "Junior",
    intro: "Experiencia inicial validada.",
    body: "Cerrás con asistencia. El foco pasa a objeciones más específicas del rubro y a sostener una conversación comercial completa sin perder el control.",
  },
  {
    code: "SS",
    name: "Semi Senior",
    intro: "Manejo de objeciones sólido.",
    body: "Negociás y cerrás de forma autónoma. Se trabaja la lectura fina del interlocutor y la capacidad de ajustar el discurso en tiempo real, no solo repetir un guion.",
  },
  {
    code: "SR",
    name: "Senior",
    intro: "Cierre consistente bajo presión.",
    body: "Sostenés el proceso comercial completo, incluso en escenarios de alta exigencia. Es el nivel que habilita liderar, no solo ejecutar.",
  },
];

export default function LevelsSection() {
  const [open, setOpen] = useState(-1);

  return (
    <section className="relative z-10 mx-auto max-w-7xl border-t border-black/10 px-6 py-24 md:px-12">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <Reveal>
            <span className="mb-6 block text-xs uppercase tracking-widest text-[var(--color-text-muted)]">
              El diagnóstico
            </span>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="max-w-sm text-3xl font-bold tracking-tight text-[var(--color-text-primary)] md:text-4xl">
              Un examen te ubica.
            </h2>
            <span className="mt-4 inline-block border border-black/12 px-3 py-1 text-xs uppercase tracking-widest text-[var(--color-text-secondary)]">
              No suponemos nada
            </span>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-[var(--color-text-secondary)]">
              Cinco niveles, cada uno con su propia currícula. Explorá qué te
              espera en cada etapa.
            </p>
          </Reveal>
        </div>

        <RevealGroup
          stagger={0.08}
          className="flex flex-col divide-y divide-black/10 border-t border-b border-black/10 lg:col-span-8"
        >
          {levels.map((l, i) => {
            const isOpen = open === i;
            return (
              <RevealItem key={l.code}>
                <div className="relative">
                  {isOpen && (
                    <motion.span
                      layoutId="levelAccent"
                      className="absolute -left-4 top-0 hidden h-full w-px bg-gradient-to-b from-[var(--color-accent)] via-[var(--color-accent)]/40 to-transparent lg:block"
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}
                  <button
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="group flex w-full items-center justify-between gap-6 py-6 text-left"
                  >
                    <div className="flex items-baseline gap-5">
                      <span
                        className={`text-xs tracking-[0.1em] transition-colors duration-300 ${
                          isOpen ? "text-[var(--color-accent)]" : "text-[var(--color-text-muted)]"
                        }`}
                      >
                        {l.code}
                      </span>
                      <span
                        className={`text-xl font-semibold tracking-tight transition-colors duration-300 ${
                          isOpen ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]"
                        }`}
                      >
                        {l.name}
                      </span>
                      <span className="hidden text-sm text-[var(--color-text-muted)] sm:inline">
                        {l.intro}
                      </span>
                    </div>
                    <span
                      className={`shrink-0 text-lg font-light transition-transform duration-300 ${
                        isOpen ? "rotate-45 text-[var(--color-accent)]" : "text-[var(--color-text-muted)]"
                      }`}
                    >
                      +
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-xl pb-7 pl-0 text-sm leading-relaxed text-[var(--color-text-secondary)] sm:pl-[4.5rem]">
                          {l.body}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
