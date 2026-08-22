"use client";

import { X, Check } from "lucide-react";
import Reveal from "@/components/Reveal";
import RevealGroup from "@/components/RevealGroup";
import RevealItem from "@/components/RevealItem";

const notEligible = [
  {
    title: "Cero Fórmulas Mágicas",
    body: "Abstenerse quienes buscan resultados inmediatos sin esfuerzo ni práctica constante.",
  },
  {
    title: "Expectativas Irreales",
    body: "Quienes crean que ganarán $4,000 USD trabajando 2 horas al día sin dominar la técnica.",
  },
  {
    title: "Mentalidad Pasiva",
    body: "Alumnos que esperan consumir contenido en video sin ejecutar en simulaciones reales.",
  },
];

const eligible = [
  {
    title: "Responsabilidad Absoluta",
    body: "Profesionales que entienden que la verdadera garantía es su propio compromiso y capacidad.",
  },
  {
    title: "Enfoque en Ejecución",
    body: "Personas dispuestas a atravesar simulaciones de alta presión y corregir su técnica en vivo.",
  },
  {
    title: "Visión de Carrera",
    body: "Quienes buscan construir una competencia técnica real y sostenible para escalar en moneda dura.",
  },
];

export default function AdmissionCriteriaSection() {
  return (
    <section className="relative border-t border-white/10 px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
            Criterio de admisión
          </span>
        </Reveal>
        <Reveal delay={0.08} className="mt-5">
          <h2 className="max-w-2xl text-[2rem] font-bold leading-[1.15] tracking-tight text-white md:text-[2.8rem]">
            Criterio de Selección y Marco de Trabajo
          </h2>
        </Reveal>
        <Reveal delay={0.14} className="mt-4">
          <p className="max-w-xl text-[15px] leading-relaxed text-zinc-400">
            No todos los perfiles califican para el sistema. La garantía
            es tu nivel de ejecución.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Reveal delay={0.1}>
            <div className="h-full rounded-2xl border border-white/10 bg-[#121418] p-8">
              <span className="inline-flex items-center gap-2 rounded border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] uppercase tracking-widest text-zinc-400">
                Perfil no elegible
              </span>

              <RevealGroup stagger={0.1} className="mt-8 flex flex-col gap-6">
                {notEligible.map((item) => (
                  <RevealItem key={item.title}>
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/5 text-zinc-500">
                        <X size={13} strokeWidth={2.5} />
                      </span>
                      <div>
                        <h3 className="text-[14.5px] font-semibold text-white">
                          {item.title}
                        </h3>
                        <p className="mt-1.5 text-[13.5px] leading-relaxed text-zinc-400">
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
            <div className="h-full rounded-2xl border border-accent/40 bg-[#121418] p-8 shadow-[0_0_50px_-14px_rgba(184,147,90,0.3)]">
              <span className="inline-flex items-center gap-2 rounded border border-accent/25 bg-accent/[0.06] px-3 py-1.5 text-[10px] uppercase tracking-widest text-accent">
                Perfil admitido
              </span>

              <RevealGroup stagger={0.1} className="mt-8 flex flex-col gap-6">
                {eligible.map((item) => (
                  <RevealItem key={item.title}>
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                        <Check size={13} strokeWidth={2.5} />
                      </span>
                      <div>
                        <h3 className="text-[14.5px] font-semibold text-white">
                          {item.title}
                        </h3>
                        <p className="mt-1.5 text-[13.5px] leading-relaxed text-zinc-400">
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

        <Reveal delay={0.1} className="mt-10">
          <div className="rounded-2xl border border-white/10 bg-[#151618] p-8 text-center">
            <p className="mx-auto max-w-2xl text-[15px] italic leading-relaxed text-zinc-300">
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
