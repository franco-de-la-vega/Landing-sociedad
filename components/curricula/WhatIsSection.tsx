import Reveal from "@/components/Reveal";
import RevealGroup from "@/components/RevealGroup";
import RevealItem from "@/components/RevealItem";
import SectionNumber from "@/components/curricula/SectionNumber";

const FLOW = ["Conocimiento", "Práctica", "Ejecución", "Evaluación", "Data", "Mejora", "Evidencia", "Oportunidad"];

export default function WhatIsSection() {
  return (
    <section className="overflow-hidden relative border-t border-[var(--color-border)] px-6 py-24 md:px-10 md:py-32">
      <SectionNumber n="02" />
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <span className="text-[12.5px] font-semibold uppercase tracking-[0.08em] sm:text-[15px] sm:tracking-[0.12em] text-[var(--color-accent)]">
            ¿Qué es el ILFC?
          </span>
        </Reveal>
        <Reveal delay={0.08} className="mt-5">
          <h2 className="text-[2.6rem] font-bold leading-[1.1] tracking-tight text-[var(--color-text-primary)] md:text-[3.9rem]">
            Ingeniería Comercial.
          </h2>
        </Reveal>
        <Reveal delay={0.14} className="mt-5">
          <p className="text-[19.5px] font-semibold leading-snug text-[var(--color-text-secondary)] md:text-[21.5px]">
            No formamos vendedores de memoria. Formamos profesionales
            comerciales.
          </p>
        </Reveal>
        <Reveal delay={0.2} className="mt-7">
          <p className="mx-auto max-w-2xl text-[19.5px] leading-relaxed text-[var(--color-text-secondary)] md:text-[20.5px]">
            El Instituto Latinoamericano de Formación Comercial desarrolla
            profesionales capaces de comprender una conversación comercial,
            diagnosticar necesidades, presentar soluciones, gestionar
            objeciones, cerrar oportunidades y operar dentro de equipos de
            ventas. Nuestra formación combina entrenamiento práctico,
            evaluación, evidencia, datos de performance y preparación
            profesional.
          </p>
        </Reveal>

        <Reveal delay={0.26} className="mt-8">
          <p className="mx-auto max-w-xl text-[16.5px] leading-relaxed text-[var(--color-text-muted)]">
            Cada etapa del método está diseñada, medida y validada.
          </p>
        </Reveal>

        <RevealGroup stagger={0.04} className="mx-auto mt-14 flex max-w-4xl flex-wrap items-center justify-center gap-x-3 gap-y-4">
          {FLOW.map((step, i) => (
            <RevealItem key={step} className="flex items-center gap-3">
              <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-2 text-[16.5px] font-semibold text-[var(--color-text-primary)]">
                {step}
              </span>
              {i < FLOW.length - 1 && (
                <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 shrink-0 text-[var(--color-accent)]">
                  <path
                    d="M4 10h12M11 5l5 5-5 5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
