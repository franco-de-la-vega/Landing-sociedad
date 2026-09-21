"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import Reveal from "@/components/Reveal";
import RevealGroup from "@/components/RevealGroup";
import RevealItem from "@/components/RevealItem";

const faqs: { q: string; a: string; popular?: string }[] = [
  {
    q: "¿La formación garantiza empleo?",
    a: "No. Preparamos talento, medimos performance y facilitamos conexiones cuando existen oportunidades compatibles con tu perfil, pero la contratación final depende del proceso de selección de cada empresa.",
  },
  {
    q: "¿Qué pasa si no rindo como se espera?",
    a: "Tu desempeño se mide en cada Sprint con feedback puntual del coach. Si hay una brecha, se trabaja sobre eso antes de avanzar de nivel — el sistema está pensado para corregir, no para dejarte afuera sin aviso.",
    popular: "68%",
  },
  {
    q: "¿Necesito experiencia previa?",
    a: "No. La currícula se adapta al diagnóstico inicial, así que podés arrancar sin experiencia previa en ventas remotas.",
  },
  {
    q: "¿Qué voy a aprender?",
    a: "Fundamentos comerciales, discovery, storytelling y propuesta de valor, manejo de objeciones, negociación y cierre, operación comercial (CRM, WhatsApp, videollamadas) y simulación de alta presión.",
  },
  {
    q: "¿Qué incluye la Carrera Completa?",
    a: "Todo lo de Comercial Junior y Comercial High Ticket, más el sistema de IA + Data, portafolio profesional, preparación de LinkedIn y CV, entrevistas, roleplays de selección, gate de validación profesional y vinculación con empresas.",
  },
  {
    q: "¿Cuál es la diferencia entre Comercial Junior y Comercial High Ticket?",
    a: "Comercial Junior te da los fundamentos completos para empezar a operar. Comercial High Ticket suma venta consultiva, objeciones avanzadas, negociación y especialización en escenarios de mayor complejidad y valor.",
    popular: "54%",
  },
  {
    q: "¿Las clases son prácticas?",
    a: "Sí. Cada Sprint combina contenido, práctica, proyecto, evaluación y evidencia — no es solo teoría en video.",
  },
  {
    q: "¿Puedo empezar solamente con Comercial Junior?",
    a: "Sí. Comercial Junior es un producto completo por sí mismo, no una versión incompleta — es tu puerta de entrada a la profesión.",
  },
  {
    q: "¿Qué pasa después de graduarme?",
    a: "Nuestra visión es que el ciclo de performance pueda seguir midiéndose y desarrollándose después de la formación, dentro del ecosistema ILFC.",
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="relative flex min-h-screen flex-col justify-center border-t border-[var(--color-border)] px-6 py-12 md:px-10 md:py-16">
      <div className="mx-auto w-full max-w-3xl">
        <Reveal>
          <span className="text-[14px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-secondary)]">
            Preguntas frecuentes
          </span>
        </Reveal>
        <Reveal delay={0.08} className="mt-4 text-center">
          <h2 className="mx-auto max-w-xl text-[2.1rem] font-bold leading-[1.1] tracking-tight text-[var(--color-text-primary)] md:text-[2.7rem]">
            Lo que necesitás saber antes de decidir.
          </h2>
        </Reveal>

        <RevealGroup stagger={0.04} className="mt-11 flex flex-col">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <RevealItem key={f.q}>
                <div className="border-b border-[var(--color-border)]">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  >
                    <span
                      className={`text-[17px] font-semibold transition-colors duration-200 md:text-[18px] ${
                        isOpen ? "text-[var(--color-accent)]" : "text-[var(--color-text-primary)]"
                      }`}
                    >
                      {f.q}
                    </span>
                    <span className="flex shrink-0 items-center gap-3">
                      {f.popular && (
                        <span className="rounded-full border border-[var(--color-accent)]/25 bg-[var(--color-accent)]/[0.07] px-2.5 py-1 text-[11px] font-bold text-[var(--color-accent)]">
                          {f.popular} pregunta esto
                        </span>
                      )}
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                          isOpen
                            ? "rotate-45 border-[var(--color-accent)]/40 bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                            : "border-[var(--color-border-strong)] text-[var(--color-text-muted)]"
                        }`}
                      >
                        <Plus size={15} strokeWidth={2.5} />
                      </span>
                    </span>
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
                        <p className="max-w-2xl pb-6 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
                          {f.a}
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
