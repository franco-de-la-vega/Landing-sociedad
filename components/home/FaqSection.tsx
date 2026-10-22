"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "../Reveal";

const faqs = [
  {
    q: "¿Necesito experiencia previa?",
    a: "No. Arrancás desde los fundamentos y avanzás sprint a sprint, con práctica y feedback en cada clase.",
  },
  {
    q: "¿Cuánto dura y cómo son las clases?",
    a: "Tenés tres opciones: 2, 3 o 5 meses, según la ruta que elijas. En todas hay dos clases en vivo por semana, y entre clase y clase avanzás en el campus a tu ritmo.",
  },
  {
    q: "¿Qué necesito para empezar?",
    a: "Una computadora y buena conexión a internet. Todo lo demás, el campus, las herramientas y el CRM, lo ponemos nosotros.",
  },
  {
    q: "¿Puedo hacerlo desde cualquier país?",
    a: "Sí. Es 100% online, pensado para personas de toda Latinoamérica.",
  },
  {
    q: "¿Me garantizan un trabajo?",
    a: "No prometemos lo que no depende de nosotros. Te formamos, medimos tu desempeño y te conectamos con oportunidades compatibles con tu perfil; la contratación final la decide cada empresa.",
  },
];

export default function FaqSection() {
  const [open, setOpen] = useState(0);

  return (
    <section className="relative z-10 border-t border-black/10 bg-[var(--color-bg-base)] px-6 py-28 md:px-12 md:py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <Reveal>
            <span className="text-xs uppercase tracking-widest text-[var(--color-text-muted)]">Preguntas frecuentes</span>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-[var(--color-text-primary)] md:text-4xl">
              Lo que todos preguntan.
            </h2>
          </Reveal>
        </div>

        <div className="flex flex-col divide-y divide-black/10 border-y border-black/10 lg:col-span-8">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="group flex w-full items-center justify-between gap-6 py-6 text-left"
                >
                  <span
                    className={`text-lg font-semibold tracking-tight transition-colors duration-300 ${
                      isOpen ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]"
                    }`}
                  >
                    {f.q}
                  </span>
                  <span
                    className={`shrink-0 text-xl font-light transition-transform duration-300 ${
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
                      <p className="max-w-2xl pb-7 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
