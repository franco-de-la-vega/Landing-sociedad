"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import Reveal from "@/components/Reveal";
import RevealGroup from "@/components/RevealGroup";
import RevealItem from "@/components/RevealItem";

const units = [
  {
    n: "01",
    title: "Comunicación e Influencia Comercial",
    body: "Escucha activa, calibración de tono y lenguaje, y persuasión ética aplicadas a la conversación de venta.",
  },
  {
    n: "02",
    title: "Deep Discovery",
    body: "Indagación profunda de necesidades reales antes de presentar cualquier propuesta.",
  },
  {
    n: "03",
    title: "Neutralización de Objeciones",
    body: "Estructura para anticipar, reencuadrar y resolver objeciones sin perder el control de la llamada.",
  },
  {
    n: "04",
    title: "Gestión de Pipeline (CRM)",
    body: "Organización y seguimiento de oportunidades comerciales con estándar profesional.",
  },
  {
    n: "05",
    title: "Simulación de Alta Presión",
    body: "Llamadas evaluadas en vivo, con corrección inmediata de la técnica y construcción de portafolio.",
  },
];

export default function CurriculumSection() {
  const [open, setOpen] = useState(0);

  return (
    <section className="relative border-t border-[var(--color-border)] px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <span className="text-[14px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-secondary)]">
            Programa de estudio
          </span>
        </Reveal>
        <Reveal delay={0.08} className="mt-5">
          <h2 className="max-w-2xl text-[2.4rem] font-bold leading-[1.1] tracking-tight text-[var(--color-text-primary)] md:text-[3.3rem]">
            Formación práctica en 8 semanas.
          </h2>
        </Reveal>
        <Reveal delay={0.14} className="mt-4">
          <p className="max-w-xl text-[18px] leading-relaxed text-[var(--color-text-secondary)]">
            Cada unidad construye sobre la anterior, hasta llegar a la
            simulación de alta presión y tu portafolio de evidencia.
          </p>
        </Reveal>

        <RevealGroup
          stagger={0.08}
          className="mt-16 flex flex-col divide-y divide-[var(--color-border)] border-t border-b border-[var(--color-border)]"
        >
          {units.map((u, i) => {
            const isOpen = open === i;
            return (
              <RevealItem key={u.n}>
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="group flex w-full items-center gap-8 py-6 text-left"
                >
                  <span
                    className={`w-8 shrink-0 text-[15px] font-semibold transition-colors duration-300 ${
                      isOpen ? "text-[var(--color-accent)]" : "text-[var(--color-text-muted)]"
                    }`}
                  >
                    {u.n}
                  </span>
                  <h3
                    className={`flex-1 text-[19px] font-semibold transition-colors duration-300 sm:text-[20px] ${
                      isOpen ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]"
                    }`}
                  >
                    {u.title}
                  </h3>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.25 }}
                    className={`shrink-0 ${isOpen ? "text-[var(--color-accent)]" : "text-[var(--color-text-muted)]"}`}
                  >
                    <Plus size={16} strokeWidth={2} />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-6 pl-14 text-[17px] leading-relaxed text-[var(--color-text-secondary)]">
                        {u.body}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
