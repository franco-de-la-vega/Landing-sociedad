"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";
import RevealGroup from "@/components/RevealGroup";
import RevealItem from "@/components/RevealItem";
import SectionNumber from "@/components/curricula/SectionNumber";

const LEVELS = [
  {
    tone: "base",
    name: "Comercial Junior",
    sprints: "8 Sprints",
    tag: "Para personas que quieren entrar al mundo comercial y construir una base sólida para comenzar a desempeñarse como Closer.",
    includes: [
      "Formación comercial",
      "Roleplays",
      "CRM",
      "Operación remota",
      "Portfolio profesional",
      "Marca profesional",
      "Performance Intelligence",
      "Evaluaciones",
      "Gate Junior",
      "Bolsa de Empleo ILFC",
    ],
    result: "Preparación para oportunidades comerciales de nivel Junior.",
  },
  {
    tone: "mid",
    name: "Comercial High Ticket",
    sprints: "14 Sprints",
    tag: "Para quienes quieren desarrollar una capacidad comercial más avanzada y aprender a trabajar procesos de venta High Ticket.",
    includesLabel: "Incluye todo Junior +",
    includes: [
      "Discovery avanzado",
      "Negociación",
      "Deal High Ticket",
      "Follow-up avanzado",
      "Pipeline",
      "Performance comercial",
      "Gate High Ticket",
      "Bolsa de Empleo ILFC",
    ],
    result:
      "Preparación para oportunidades comerciales Junior / High Ticket según desempeño y requisitos de cada empresa.",
  },
  {
    tone: "top",
    name: "Carrera Completa",
    sprints: "18 Sprints",
    tag: "La ruta integral para convertirte en un profesional comercial preparado para desempeñarte, medir tu performance y competir por oportunidades comerciales.",
    includesLabel: "Incluye todo High Ticket +",
    includes: [
      "Performance Intelligence avanzado",
      "Operación profesional remota",
      "Empleabilidad",
      "Marca profesional",
      "Portfolio completo",
      "Preparación de entrevistas",
      "Simulación de contratación",
      "Gate Profesional",
      "Conexión con empresa aliada*",
    ],
    result: "Preparación integral + conexión con una empresa aliada bajo criterios de aprobación y disponibilidad.",
    featured: true,
  },
];

function LevelBody({ l }: { l: (typeof LEVELS)[number] }) {
  return (
    <>
      <p className="mt-3 text-[15.5px] leading-relaxed text-[var(--color-text-secondary)] sm:text-[17px]">{l.tag}</p>

      <div className="mt-6 border-t border-[var(--color-border)] pt-6">
        {l.includesLabel && (
          <span className="mb-3 block text-[13px] font-semibold uppercase tracking-[0.06em] text-[var(--color-text-muted)] sm:text-[14.5px] sm:tracking-[0.08em]">
            {l.includesLabel}
          </span>
        )}
        <ul className="flex flex-col gap-2">
          {l.includes.map((item) => (
            <li key={item} className="flex items-start gap-2 text-[15.5px] text-[var(--color-text-secondary)] sm:text-[17px]">
              <svg viewBox="0 0 20 20" fill="none" className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent)]">
                <path
                  d="M4.5 10.5l3.2 3.2L15.5 6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 border-t border-[var(--color-border)] pt-6">
        <span className="text-[13px] font-semibold uppercase tracking-[0.06em] text-[var(--color-text-muted)] sm:text-[14.5px] sm:tracking-[0.08em]">
          Resultado
        </span>
        <p className="mt-2 text-[15.5px] leading-relaxed text-[var(--color-text-primary)] sm:text-[17px]">{l.result}</p>
      </div>
    </>
  );
}

export default function LevelsSection() {
  const [open, setOpen] = useState(-1);

  return (
    <section id="niveles" className="overflow-hidden relative border-t border-[var(--color-border)] px-6 py-24 md:px-10 md:py-32">
      <SectionNumber n="05" />
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <span className="text-[12.5px] font-semibold uppercase tracking-[0.08em] sm:text-[15px] sm:tracking-[0.12em] text-[var(--color-text-secondary)]">
              Los 3 niveles
            </span>
          </Reveal>
          <Reveal delay={0.08} className="mt-5">
            <h2 className="text-[1.9rem] font-bold leading-[1.2] tracking-tight text-[var(--color-text-primary)] sm:text-[2.4rem] md:text-[3.3rem]">
              Elegí tu ruta profesional
            </h2>
          </Reveal>
        </div>

        {/* mobile / tablet: acordeón vertical, uno a la vez */}
        <div className="mt-12 flex flex-col gap-3 lg:hidden">
          {LEVELS.map((l, i) => {
            const expanded = open === i;
            return (
              <div
                key={l.name}
                className={`overflow-hidden rounded-2xl border transition-colors duration-300 ${
                  l.featured
                    ? "border-[var(--color-accent)]/40 bg-[var(--color-accent-muted)]"
                    : "border-[var(--color-border)] bg-[var(--color-bg-elevated)]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpen(expanded ? -1 : i)}
                  aria-expanded={expanded}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                >
                  <div>
                    <span className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[var(--color-text-muted)]">
                      {l.sprints}
                    </span>
                    <h3 className="mt-1 text-[20px] font-bold text-[var(--color-text-primary)]">{l.name}</h3>
                  </div>
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    className={`h-5 w-5 shrink-0 text-[var(--color-accent)] transition-transform duration-300 ${
                      expanded ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 pb-6">
                      <LevelBody l={l} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* desktop: 3 columnas */}
        <RevealGroup stagger={0.1} className="mt-14 hidden lg:grid lg:grid-cols-3 lg:gap-6">
          {LEVELS.map((l) => (
            <RevealItem key={l.name}>
              <div
                className={`flex h-full flex-col rounded-3xl border p-8 transition-transform duration-300 hover:-translate-y-1.5 ${
                  l.featured
                    ? "border-[var(--color-accent)]/40 bg-[var(--color-accent-muted)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]"
                    : "border-[var(--color-border)] bg-[var(--color-bg-elevated)] hover:border-[var(--color-accent)]/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)]"
                }`}
              >
                <span className="text-[13.5px] font-semibold uppercase tracking-[0.1em] text-[var(--color-text-muted)]">
                  {l.sprints}
                </span>
                <h3 className="mt-2 text-[26px] font-bold text-[var(--color-text-primary)]">{l.name}</h3>
                <LevelBody l={l} />
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
