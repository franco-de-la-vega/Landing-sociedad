"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Search, Presentation, ShieldOff, Handshake, Database, Flame, LineChart, ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import RevealGroup from "@/components/RevealGroup";
import RevealItem from "@/components/RevealItem";

const units = [
  {
    icon: MessageCircle,
    title: "Fundamentos Comerciales",
    body: "Comunicación, psicología del comprador y estructura de una conversación de ventas.",
    evidence: "Diagnóstico de estilo comunicacional",
  },
  {
    icon: Search,
    title: "Discovery & Diagnóstico",
    body: "Preguntas, escucha, necesidades, motivaciones y diagnóstico profundo del prospecto.",
    evidence: "Call Recording — Discovery",
  },
  {
    icon: Presentation,
    title: "Storytelling & Propuesta de Valor",
    body: "Cómo presentar una solución conectándola con las necesidades reales del prospecto.",
    evidence: "Pitch grabado y evaluado",
  },
  {
    icon: ShieldOff,
    title: "Objeciones & Negociación",
    body: "Empatía, validación, aislamiento, resolución de objeciones y avance hacia el cierre.",
    evidence: "Roleplay de objeciones",
  },
  {
    icon: Handshake,
    title: "Cierre",
    body: "Conducción de la decisión, negociación y seguimiento comercial.",
    evidence: "Simulación de cierre evaluada",
  },
  {
    icon: Database,
    title: "Operación Comercial",
    body: "CRM, pipeline, WhatsApp, videollamadas, seguimiento y herramientas de trabajo remoto.",
    evidence: "CRM — Pipeline armado",
  },
  {
    icon: Flame,
    title: "Simulación & Performance",
    body: "Roleplays, llamadas simuladas, evaluación y feedback sobre el desempeño comercial.",
    evidence: "Performance Report",
  },
  {
    icon: LineChart,
    title: "IA, Data & Empleabilidad",
    body: "Análisis de performance, mejora continua, LinkedIn, CV, portafolio, entrevistas y preparación para el mercado.",
    evidence: "Perfil profesional y LinkedIn optimizado",
  },
];

export default function CurriculumSection() {
  const [active, setActive] = useState(0);
  const current = units[active];
  const CurrentIcon = current.icon;

  return (
    <section className="relative flex min-h-screen flex-col justify-center overflow-hidden border-t border-[var(--color-border)] px-6 py-8 md:px-10 md:py-10">
      <div
        className="pointer-events-none absolute -left-40 top-1/3 h-[36rem] w-[36rem] rounded-full opacity-[0.05] blur-3xl"
        style={{ background: "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)" }}
        aria-hidden
      />

      <div className="relative mx-auto w-full max-w-6xl">
        <div>
          <Reveal>
            <span className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-secondary)]">
              Programa de estudio
            </span>
          </Reveal>
          <Reveal delay={0.08} className="mt-3">
            <h2 className="max-w-2xl text-[1.8rem] font-bold leading-[1.15] tracking-tight text-[var(--color-text-primary)] md:text-[2.3rem]">
              8 semanas para pasar de conocer la venta a ejecutarla.
            </h2>
          </Reveal>
          <Reveal delay={0.14} className="mt-2.5">
            <p className="max-w-xl text-[14.5px] leading-relaxed text-[var(--color-text-secondary)]">
              Una ruta práctica para desarrollar las competencias de un
              profesional de ventas remoto. Formación práctica, 8 semanas.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.2} className="mt-7">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
            <RevealGroup stagger={0.04} className="relative flex flex-col">
              {/* riel vertical del syllabus, con el tramo recorrido en dorado */}
              <div className="absolute left-[19px] top-2 bottom-2 w-px bg-[var(--color-border)]" aria-hidden>
                <motion.div
                  className="w-px bg-[var(--color-accent)]"
                  animate={{ height: `${(active / (units.length - 1)) * 100}%` }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>

              {units.map((u, i) => {
                const isActive = active === i;
                const Icon = u.icon;
                return (
                  <RevealItem key={u.title}>
                    <button
                      onMouseEnter={() => setActive(i)}
                      onClick={() => setActive(i)}
                      className="group relative flex w-full items-center gap-4 py-2.5 text-left"
                    >
                      <span
                        className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                          isActive
                            ? "border-[var(--color-accent)] bg-[var(--color-accent)] shadow-[0_0_0_5px_var(--color-bg-base)]"
                            : "border-[var(--color-border-strong)] bg-[var(--color-bg-base)] group-hover:border-[var(--color-accent)]/50"
                        }`}
                      >
                        <Icon
                          size={16}
                          strokeWidth={2}
                          className={isActive ? "text-[#0B0C0E]" : "text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)]"}
                        />
                      </span>
                      <h3
                        className={`flex-1 text-[15px] font-semibold transition-colors duration-300 sm:text-[16px] ${
                          isActive ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)]"
                        }`}
                      >
                        {u.title}
                      </h3>
                      <motion.span
                        animate={{ x: isActive ? 0 : -6, opacity: isActive ? 1 : 0 }}
                        transition={{ duration: 0.25 }}
                        className="shrink-0 text-[var(--color-accent)]"
                      >
                        <ArrowRight size={15} strokeWidth={2} />
                      </motion.span>
                    </button>
                  </RevealItem>
                );
              })}
            </RevealGroup>

            <div className="relative lg:sticky lg:top-28 lg:self-start">
              {/* resplandor detrás de la card activa, mismo lenguaje que el resto del sitio */}
              <div
                className="pointer-events-none absolute -inset-6 -z-10 opacity-[0.18] blur-2xl"
                style={{ background: "radial-gradient(ellipse, var(--color-accent) 0%, transparent 70%)" }}
                aria-hidden
              />
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="relative flex flex-col gap-6 overflow-hidden rounded-[1.5rem] bg-[#0B0C0E] px-7 py-8 md:px-9 md:py-10"
                >
                  <div
                    className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-[0.12] blur-2xl"
                    style={{ background: "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)" }}
                    aria-hidden
                  />
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10">
                    <CurrentIcon size={20} strokeWidth={1.8} className="text-[var(--color-accent)]" />
                  </span>
                  <div>
                    <h3 className="text-[20px] font-bold leading-tight text-white md:text-[23px]">
                      {current.title}
                    </h3>
                    <p className="mt-2.5 text-[14px] leading-relaxed text-white/55">
                      {current.body}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 border-t border-white/10 pt-5">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                    <span className="text-[12px] font-semibold uppercase tracking-wider text-white/40">
                      Evidencia del sprint
                    </span>
                    <span className="ml-auto text-[12.5px] font-medium text-white/70">{current.evidence}</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="mt-6">
          <p className="text-[13.5px] italic text-[var(--color-text-muted)]">
            Cada Sprint termina con práctica, evaluación y una evidencia de
            desempeño.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
