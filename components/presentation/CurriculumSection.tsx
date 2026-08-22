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
    title: "PNL Comercial",
    body: "Lectura del interlocutor, manejo de tono y ritmo aplicados a la conversación de venta.",
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
    title: "Simulación Clínica",
    body: "Llamadas de alta presión evaluadas en vivo, con corrección inmediata de la técnica.",
  },
];

export default function CurriculumSection() {
  const [open, setOpen] = useState(0);

  return (
    <section className="relative border-t border-white/10 px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
            Programa de estudio
          </span>
        </Reveal>
        <Reveal delay={0.08} className="mt-5">
          <h2 className="max-w-2xl text-[2rem] font-bold leading-[1.15] tracking-tight text-white md:text-[2.8rem]">
            Cinco unidades. Una sola competencia.
          </h2>
        </Reveal>
        <Reveal delay={0.14} className="mt-4">
          <p className="max-w-xl text-[15px] leading-relaxed text-zinc-400">
            Cada unidad construye sobre la anterior, hasta llegar a la
            simulación clínica bajo presión.
          </p>
        </Reveal>

        <RevealGroup
          stagger={0.08}
          className="mt-16 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5"
        >
          {units.map((u, i) => {
            const isOpen = open === i;
            return (
              <RevealItem key={u.n}>
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className={`w-full rounded-2xl border p-6 text-left transition-colors duration-300 ${
                    isOpen
                      ? "border-accent/30 bg-[#141a1c]"
                      : "border-white/10 bg-[#121418] hover:border-white/20"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={`text-[13px] font-semibold ${
                        isOpen ? "text-accent" : "text-zinc-600"
                      }`}
                    >
                      {u.n}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.25 }}
                      className={isOpen ? "text-accent" : "text-zinc-600"}
                    >
                      <Plus size={16} strokeWidth={2} />
                    </motion.span>
                  </div>
                  <h3 className="mt-3 text-[15px] font-semibold leading-snug text-white">
                    {u.title}
                  </h3>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="mt-3 text-[13.5px] leading-relaxed text-zinc-400">
                          {u.body}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
