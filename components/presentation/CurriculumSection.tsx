"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Search, ShieldOff, Database, Flame, Plus } from "lucide-react";
import Reveal from "@/components/Reveal";
import RevealGroup from "@/components/RevealGroup";
import RevealItem from "@/components/RevealItem";

const units = [
  {
    n: "01",
    icon: MessageCircle,
    title: "Comunicación e Influencia Comercial",
    body: "Escucha activa, calibración de tono y lenguaje, y persuasión ética aplicadas a la conversación de venta.",
  },
  {
    n: "02",
    icon: Search,
    title: "Deep Discovery",
    body: "Indagación profunda de necesidades reales antes de presentar cualquier propuesta.",
  },
  {
    n: "03",
    icon: ShieldOff,
    title: "Neutralización de Objeciones",
    body: "Estructura para anticipar, reencuadrar y resolver objeciones sin perder el control de la llamada.",
  },
  {
    n: "04",
    icon: Database,
    title: "Gestión de Pipeline (CRM)",
    body: "Organización y seguimiento de oportunidades comerciales con estándar profesional.",
  },
  {
    n: "05",
    icon: Flame,
    title: "Simulación de Alta Presión",
    body: "Llamadas evaluadas en vivo, con corrección inmediata de la técnica y construcción de portafolio.",
  },
];

export default function CurriculumSection() {
  const [open, setOpen] = useState(0);

  return (
    <section className="relative overflow-hidden border-t border-[var(--color-border)] px-6 py-24 md:px-10 md:py-32">
      <div
        className="pointer-events-none absolute -left-40 top-1/3 h-[36rem] w-[36rem] rounded-full opacity-[0.05] blur-3xl"
        style={{ background: "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
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
          </div>
          <Reveal delay={0.18}>
            <span className="hidden font-mono text-[13px] tracking-[0.1em] text-[var(--color-text-muted)] sm:block">
              {String(open + 1).padStart(2, "0")} / {String(units.length).padStart(2, "0")}
            </span>
          </Reveal>
        </div>

        <RevealGroup stagger={0.08} className="relative mt-16 flex flex-col">
          {/* connecting line */}
          <div className="absolute left-[27px] top-3 bottom-3 w-px bg-[var(--color-border)] sm:left-[31px]" aria-hidden />

          {units.map((u, i) => {
            const isOpen = open === i;
            const Icon = u.icon;
            return (
              <RevealItem key={u.n}>
                <div
                  className={`group relative rounded-2xl border transition-all duration-300 ${
                    isOpen
                      ? "border-[var(--color-accent)]/30 bg-[var(--color-accent)]/[0.04]"
                      : "border-transparent hover:border-[var(--color-border)]"
                  }`}
                >
                  <button
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="flex w-full items-center gap-5 px-3 py-5 text-left sm:gap-7 sm:px-4"
                  >
                    <span
                      className={`relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                        isOpen
                          ? "border-[var(--color-accent)] bg-[var(--color-accent)] shadow-[0_0_0_6px_var(--color-accent-muted)]"
                          : "border-[var(--color-border)] bg-[var(--color-bg-base)] group-hover:border-[var(--color-accent)]/40"
                      }`}
                    >
                      <Icon
                        size={20}
                        strokeWidth={2}
                        className={isOpen ? "text-[#0B0C0E]" : "text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)]"}
                      />
                    </span>

                    <h3
                      className={`flex-1 text-[19px] font-semibold transition-colors duration-300 sm:text-[21px] ${
                        isOpen
                          ? "text-[var(--color-text-primary)]"
                          : "text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]"
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
                        <p className="max-w-2xl pb-6 pl-[4.75rem] pr-4 text-[17px] leading-relaxed text-[var(--color-text-secondary)] sm:pl-[6.75rem]">
                          {u.body}
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
