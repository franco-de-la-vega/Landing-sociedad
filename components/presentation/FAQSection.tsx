"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import RevealGroup from "@/components/RevealGroup";
import RevealItem from "@/components/RevealItem";

const faqs = [
  {
    q: "¿Qué voy a aprender?",
    a: "Fundamentos comerciales, discovery, storytelling y propuesta de valor, manejo de objeciones, negociación y cierre, operación comercial (CRM, WhatsApp, videollamadas) y simulación de alta presión.",
  },
  {
    q: "¿Necesito experiencia previa?",
    a: "No. La currícula se adapta al diagnóstico inicial, así que podés arrancar sin experiencia previa en ventas remotas.",
  },
  {
    q: "¿Cuál es la diferencia entre Junior y High Ticket?",
    a: "Junior te da los fundamentos completos para empezar a operar. High Ticket suma venta consultiva, objeciones avanzadas, negociación y especialización en escenarios de mayor complejidad y valor.",
  },
  {
    q: "¿Qué incluye la Carrera Completa?",
    a: "Todo lo de Junior y High Ticket, más el sistema de IA + Data, portafolio profesional, preparación de LinkedIn y CV, entrevistas, roleplays de selección, gate de validación profesional y vinculación con empresas.",
  },
  {
    q: "¿Las clases son prácticas?",
    a: "Sí. Cada Sprint combina contenido, práctica, proyecto, evaluación y evidencia — no es solo teoría en video.",
  },
  {
    q: "¿Cómo se evalúa mi desempeño?",
    a: "A través de simulaciones evaluadas en vivo, feedback puntual del coach y un historial de evaluaciones por etapa de la conversación comercial.",
  },
  {
    q: "¿Qué es el sistema de Performance?",
    a: "Es el sistema que estamos desarrollando para medir tu ejecución comercial y convertirla en información accionable: fortalezas, brechas y qué entrenar a continuación.",
  },
  {
    q: "¿Qué es el dashboard?",
    a: "Un panel donde vas a poder ver tu evolución, métricas, fortalezas y áreas de mejora. Está en desarrollo — lo que se muestra en la presentación es un mockup ilustrativo.",
  },
  {
    q: "¿La formación garantiza empleo?",
    a: "No. Preparamos talento, medimos performance y facilitamos conexiones cuando existen oportunidades compatibles con tu perfil, pero la contratación final depende del proceso de selección de cada empresa.",
  },
  {
    q: "¿Qué pasa después de graduarme?",
    a: "Nuestra visión es que el ciclo de performance pueda seguir midiéndose y desarrollándose después de la formación, dentro del ecosistema ILFC.",
  },
  {
    q: "¿Puedo empezar solamente con Closer Junior?",
    a: "Sí. Closer Junior es un producto completo por sí mismo, no una versión incompleta — es tu puerta de entrada a la profesión.",
  },
];

export default function FAQSection() {
  const [active, setActive] = useState(0);
  const current = faqs[active];

  return (
    <section className="relative border-t border-[var(--color-border)] px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <span className="text-[14px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-secondary)]">
            Preguntas frecuentes
          </span>
        </Reveal>
        <Reveal delay={0.08} className="mt-5">
          <h2 className="max-w-xl text-[2.2rem] font-bold leading-[1.1] tracking-tight text-[var(--color-text-primary)] md:text-[2.8rem]">
            Lo que necesitás saber antes de decidir.
          </h2>
        </Reveal>

        <Reveal delay={0.16} className="mt-14">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            <RevealGroup stagger={0.03} className="flex flex-col">
              {faqs.map((f, i) => {
                const isActive = active === i;
                return (
                  <RevealItem key={f.q}>
                    <button
                      onClick={() => setActive(i)}
                      className={`group flex w-full items-center gap-4 border-b border-[var(--color-border)] py-4 text-left transition-colors duration-300 ${
                        isActive ? "" : "hover:border-[var(--color-accent)]/30"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-300 ${
                          isActive ? "bg-[var(--color-accent)]" : "bg-[var(--color-text-muted)]/30"
                        }`}
                      />
                      <span
                        className={`flex-1 text-[16px] font-medium transition-colors duration-300 sm:text-[17px] ${
                          isActive
                            ? "text-[var(--color-text-primary)]"
                            : "text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)]"
                        }`}
                      >
                        {f.q}
                      </span>
                    </button>
                  </RevealItem>
                );
              })}
            </RevealGroup>

            <div className="relative lg:sticky lg:top-28 lg:self-start">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col gap-5 rounded-[2rem] bg-[#0B0C0E] px-8 py-11 md:px-10 md:py-12"
                >
                  <h3 className="text-[21px] font-bold leading-snug text-white md:text-[23px]">
                    {current.q}
                  </h3>
                  <p className="text-[16px] leading-relaxed text-white/55">{current.a}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
