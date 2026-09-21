"use client";

import { X, Check } from "lucide-react";
import Reveal from "@/components/Reveal";
import RevealGroup from "@/components/RevealGroup";
import RevealItem from "@/components/RevealItem";

const notEligible = [
  {
    title: "Buscás dinero rápido",
    body: "Sin esfuerzo ni práctica constante, sin dominar la técnica antes de esperar resultados.",
  },
  {
    title: "No querés practicar",
    body: "Esperás consumir contenido en video sin ejecutar en simulaciones reales.",
  },
  {
    title: "No aceptás feedback",
    body: "Preferís que el certificado haga el trabajo por vos, sin corregir tu técnica en vivo.",
  },
];

const eligible = [
  {
    title: "Querés una carrera comercial",
    body: "Buscás desarrollar y demostrar una competencia técnica real y sostenible en el mercado.",
  },
  {
    title: "Estás dispuesto a practicar",
    body: "Entendés que la verdadera garantía es tu propio compromiso y ejecución.",
  },
  {
    title: "Aceptás feedback",
    body: "Estás dispuesto a atravesar simulaciones de alta presión y corregir tu técnica en vivo.",
  },
  {
    title: "Sos constante",
    body: "Sostenés el esfuerzo semana a semana, no solo en el arranque.",
  },
  {
    title: "Buscás resultados medibles",
    body: "Preferís evidencia concreta de tu progreso, no promesas vacías.",
  },
];

export default function AdmissionCriteriaSection() {
  return (
    <section className="relative flex min-h-screen flex-col justify-center border-t border-[var(--color-border)] px-6 py-10 md:px-10 md:py-12">
      <div className="mx-auto w-full max-w-7xl">
        <Reveal>
          <span className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-secondary)]">
            Perfil de ingreso
          </span>
        </Reveal>
        <Reveal delay={0.08} className="mt-3">
          <h2 className="max-w-2xl text-[1.9rem] font-bold leading-[1.15] tracking-tight text-[var(--color-text-primary)] md:text-[2.5rem]">
            Todos quieren el resultado. Pocos aceptan el proceso.
          </h2>
        </Reveal>
        <Reveal delay={0.14} className="mt-2.5">
          <p className="max-w-xl text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
            No todos los perfiles califican para el sistema. La garantía
            es tu nivel de ejecución.
          </p>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Reveal delay={0.1}>
            <div className="h-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
              <span className="inline-flex items-center gap-2 rounded border border-[var(--color-border)] bg-black/[0.04] px-3 py-1.5 text-[12px] uppercase tracking-widest text-[var(--color-text-secondary)]">
                No es para vos si...
              </span>

              <RevealGroup stagger={0.1} className="mt-5 flex flex-col gap-4">
                {notEligible.map((item) => (
                  <RevealItem key={item.title}>
                    <div className="flex items-start gap-2.5">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black/5">
                        <X size={13} strokeWidth={3} className="text-red-500" />
                      </span>
                      <div>
                        <h3 className="text-[15px] font-semibold text-[var(--color-text-primary)]">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-[13px] leading-snug text-[var(--color-text-secondary)]">
                          {item.body}
                        </p>
                      </div>
                    </div>
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>
          </Reveal>

          <Reveal delay={0.16}>
            <div className="h-full rounded-2xl border-2 border-[var(--color-accent)] bg-[var(--color-accent-muted)]/40 p-6 shadow-[0_20px_45px_-24px_rgba(20,18,14,0.18)]">
              <span className="inline-flex items-center gap-2 rounded border border-[var(--color-accent)]/25 bg-[var(--color-accent)]/[0.06] px-3 py-1.5 text-[12px] uppercase tracking-widest text-[var(--color-accent)]">
                Es para vos si...
              </span>

              <RevealGroup stagger={0.1} className="mt-5 flex flex-col gap-4">
                {eligible.map((item) => (
                  <RevealItem key={item.title}>
                    <div className="flex items-start gap-2.5">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                        <Check size={13} strokeWidth={2.5} />
                      </span>
                      <div>
                        <h3 className="text-[15px] font-semibold text-[var(--color-text-primary)]">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-[13px] leading-snug text-[var(--color-text-secondary)]">
                          {item.body}
                        </p>
                      </div>
                    </div>
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="mt-6">
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated-2)] p-6 text-center">
            <p className="mx-auto max-w-2xl text-[14.5px] italic leading-relaxed text-[var(--color-text-secondary)]">
              &ldquo;Estudiar cualquier disciplina no te garantiza el
              éxito; lo que garantiza el resultado es cómo aplicas la
              herramienta. En el Instituto la infraestructura está lista,
              pero la ejecución depende 100% de vos.&rdquo;
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
