"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import SectionNumber from "@/components/curricula/SectionNumber";

type Sprint = {
  n: string;
  title: string;
  learn?: string[];
  project?: string;
  summary?: string;
};

type Block = {
  id: string;
  label: string;
  title: string;
  gate?: string;
  levels: string[];
  sprints: Sprint[];
};

const LEVELS = ["Junior", "High Ticket", "Carrera Completa"];

const BLOCKS: Block[] = [
  {
    id: "I",
    label: "Bloque I",
    title: "Fundamentos del Closer",
    levels: ["Junior", "High Ticket", "Carrera Completa"],
    sprints: [
      {
        n: "01",
        title: "Profesión Comercial + Mindset",
        learn: ["Profesión del Closer", "Tipos de vendedores", "Ciclo comercial", "B2C / B2B", "High Ticket", "KPIs", "Mentalidad profesional"],
        project: "Mapa profesional del Closer",
      },
      {
        n: "02",
        title: "Comunicación Comercial",
        learn: ["Escucha activa", "Rapport", "Tono y ritmo", "Preguntas", "Comunicación verbal", "Comunicación frente a cámara"],
        project: "Video de presentación comercial",
      },
      {
        n: "03",
        title: "Arquitectura de la Venta",
        learn: ["Apertura", "Agenda", "Discovery", "Presentación", "Objeciones", "Cierre", "Follow-up"],
        project: "Estructura personal de llamada",
      },
      {
        n: "04",
        title: "Discovery + Diagnóstico",
        learn: ["Preguntas", "Necesidades", "Dolor", "Objetivos", "Motivaciones", "Consecuencias", "Urgencia", "Toma de decisión"],
        project: "Discovery Roleplay",
      },
    ],
  },
  {
    id: "II",
    label: "Bloque II",
    title: "Ejecución Comercial",
    gate: "Gate Junior",
    levels: ["Junior", "High Ticket", "Carrera Completa"],
    sprints: [
      {
        n: "05",
        title: "Presentación de Valor",
        learn: ["Beneficios", "Storytelling", "Presentación consultiva", "Personalización", "Demostración de solución"],
        project: "Presentación comercial",
      },
      {
        n: "06",
        title: "Manejo de Objeciones",
        learn: ["Precio", "Tiempo", "Confianza", "Miedo", "Autoridad", "\"Lo voy a pensar\"", "Método EVAA"],
        project: "Objection Lab",
      },
      {
        n: "07",
        title: "Cierre Comercial",
        learn: ["Preguntas de cierre", "Microcompromisos", "Decisión", "Silencio", "Cierre directo", "Próximos pasos"],
        project: "Deal Simulation",
      },
      {
        n: "08",
        title: "CRM + Operación Comercial Remota",
        learn: ["CRM", "Pipeline", "Leads", "Seguimiento", "Calendario", "WhatsApp", "Email", "KPIs"],
        project: "Simulación de operación comercial remota",
      },
    ],
  },
  {
    id: "III",
    label: "Bloque III",
    title: "High Ticket",
    gate: "Gate High Ticket",
    levels: ["High Ticket", "Carrera Completa"],
    sprints: [
      { n: "09", title: "Arquitectura High Ticket", summary: "Estructura de un proceso de venta de mayor complejidad y valor." },
      { n: "10", title: "Discovery Avanzado", summary: "Profundización del diagnóstico en escenarios High Ticket." },
      { n: "11", title: "Psicología + Negociación", summary: "Dinámicas de decisión y técnicas de negociación comercial." },
      { n: "12", title: "Deal High Ticket", summary: "Simulación completa de una operación de alto valor." },
      { n: "13", title: "Follow-up + Pipeline", summary: "Gestión de oportunidades y seguimiento en procesos largos." },
      { n: "14", title: "Performance Comercial", summary: "Análisis del desempeño propio en operaciones High Ticket." },
    ],
  },
  {
    id: "IV",
    label: "Bloque IV",
    title: "Performance + Profesionalización",
    levels: ["Carrera Completa"],
    sprints: [
      { n: "15", title: "Performance Intelligence + IA", summary: "Medición de tu ejecución comercial con datos e inteligencia artificial." },
      { n: "16", title: "Operación Profesional Remota", summary: "Disciplina, herramientas y autonomía para operar en equipos remotos." },
    ],
  },
  {
    id: "V",
    label: "Bloque V",
    title: "Empleabilidad",
    gate: "Gate Profesional",
    levels: ["Carrera Completa"],
    sprints: [
      { n: "17", title: "Marca Profesional + Empleabilidad", summary: "Construcción de LinkedIn, CV, pitch y presentación profesional." },
      { n: "18", title: "Gate Profesional", summary: "Simulación integral de contratación: entrevista, roleplay, portfolio y performance." },
    ],
  },
];

export default function CurriculumMapSection() {
  const [active, setActive] = useState(0);
  const block = BLOCKS[active];

  return (
    <section id="malla" className="overflow-hidden relative border-t border-[var(--color-border)] px-6 py-24 md:px-10 md:py-32">
      <SectionNumber n="06" />
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <span className="text-[12.5px] font-semibold uppercase tracking-[0.08em] sm:text-[15px] sm:tracking-[0.12em] text-[var(--color-accent)]">
              Malla curricular
            </span>
          </Reveal>
          <Reveal delay={0.08} className="mt-5">
            <h2 className="text-[1.9rem] font-bold leading-[1.2] tracking-tight text-[var(--color-text-primary)] sm:text-[2.4rem] md:text-[3.3rem]">
              Tu ruta de formación, Sprint a Sprint
            </h2>
          </Reveal>
        </div>

        <Reveal delay={0.14} className="sticky top-[57px] z-20 mt-12 -mx-6 bg-[var(--color-bg-base)]/95 px-6 py-3 backdrop-blur-md md:static md:mx-0 md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none">
          <div className="flex justify-start gap-2 overflow-x-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2 md:flex-wrap md:justify-center md:overflow-visible">
            {BLOCKS.map((b, i) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setActive(i)}
                className={`relative shrink-0 rounded-xl px-4 py-2 text-[14px] font-semibold transition-colors sm:px-5 sm:py-2.5 sm:text-[16.5px] ${
                  active === i
                    ? "text-white"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]"
                }`}
              >
                {active === i && (
                  <motion.span
                    layoutId="blockTabBg"
                    className="absolute inset-0 rounded-xl bg-[var(--color-accent)]"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative whitespace-nowrap">
                  <span className="md:hidden">{b.label}</span>
                  <span className="hidden md:inline">
                    {b.label} · {b.title}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </Reveal>

        {/* barra de progreso de la ruta */}
        <div className="relative mx-auto mt-10 h-1 max-w-2xl overflow-hidden rounded-full bg-[var(--color-border)]">
          <motion.div
            className="h-full rounded-full bg-[var(--color-accent)]"
            animate={{ width: `${((active + 1) / BLOCKS.length) * 100}%` }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ boxShadow: "0 0 8px var(--color-accent)" }}
          />
        </div>

        {/* a qué nivel pertenece este bloque */}
        <div className="mt-6 flex flex-col items-center gap-2.5 sm:flex-row sm:justify-center sm:gap-3">
          <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
            Este bloque forma parte de
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {LEVELS.map((lvl) => {
              const included = block.levels.includes(lvl);
              return (
                <span
                  key={lvl}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[13px] font-semibold transition-all duration-300 ${
                    included
                      ? "border-[var(--color-accent)]/35 bg-[var(--color-accent-muted)] text-[var(--color-accent-hover)]"
                      : "border-[var(--color-border)] text-[var(--color-text-muted)] opacity-40"
                  }`}
                >
                  {included && (
                    <svg viewBox="0 0 20 20" fill="none" className="h-3 w-3">
                      <path d="M4.5 10.5l3.2 3.2L15.5 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  {lvl}
                </span>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={block.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10"
          >
            {block.gate && (
              <div className="mb-8 flex items-center justify-center gap-3">
                <span className="h-px w-12 bg-[var(--color-border-strong)]" aria-hidden />
                <span className="flex items-center gap-2 rounded-full border border-[var(--color-accent)]/30 bg-[var(--color-accent-muted)] px-4 py-1.5 text-[15px] font-bold uppercase tracking-[0.08em] text-[var(--color-accent-hover)]">
                  <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
                    <path d="M10 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L10 14.4l-4.8 2.5.9-5.4-3.9-3.8 5.4-.8L10 2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                  </svg>
                  {block.gate}
                </span>
                <span className="h-px w-12 bg-[var(--color-border-strong)]" aria-hidden />
              </div>
            )}

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {block.sprints.map((s, i) => (
                <motion.div
                  key={s.n}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-accent)]/30 hover:shadow-[0_16px_32px_rgba(0,0,0,0.06)]"
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -right-2 -top-6 select-none text-[6rem] font-bold leading-none text-[var(--color-accent)] opacity-[0.06] transition-opacity duration-300 group-hover:opacity-[0.1]"
                  >
                    {s.n}
                  </span>

                  <div className="relative flex items-baseline gap-3">
                    <span className="text-[16.5px] font-bold text-[var(--color-accent)]">SPRINT {s.n}</span>
                  </div>
                  <h3 className="relative text-[20.5px] font-bold leading-snug text-[var(--color-text-primary)]">{s.title}</h3>

                  {s.learn && (
                    <div className="relative flex flex-wrap gap-1.5">
                      {s.learn.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg-base)] px-2.5 py-1 text-[13.5px] font-medium text-[var(--color-text-secondary)]"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  )}
                  {s.summary && (
                    <p className="relative text-[17px] leading-relaxed text-[var(--color-text-secondary)]">{s.summary}</p>
                  )}

                  {s.project && (
                    <div className="relative mt-auto border-t border-[var(--color-border)] pt-4">
                      <span className="text-[13.5px] font-semibold uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                        Proyecto
                      </span>
                      <p className="mt-1 text-[17px] font-medium text-[var(--color-text-primary)]">{s.project}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
