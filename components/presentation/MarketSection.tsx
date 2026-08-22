"use client";

import { ArrowUpRight, Info } from "lucide-react";
import Reveal from "@/components/Reveal";
import RevealGroup from "@/components/RevealGroup";
import RevealItem from "@/components/RevealItem";

const signals = [
  {
    stat: "+340%",
    label: "Crecimiento en contrataciones remotas comerciales LATAM → USD, últimos 3 años.",
    insight: "La demanda no bajó nunca. Se aceleró.",
  },
  {
    stat: "68%",
    label: "De las empresas remotas exige CRM y manejo de objeciones como estándar mínimo, no como plus.",
    insight: "El listón subió. Ya no alcanza con \"tener ganas\".",
  },
  {
    stat: "~9 meses",
    label: "Ventana promedio antes de que un mercado se sature de talento sin especialización real.",
    insight: "Entrar formado ahora vale más que entrar rápido y sin preparación.",
  },
];

export default function MarketSection() {
  return (
    <section className="relative border-t border-white/10 px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
            La inevitabilidad del mercado
          </span>
        </Reveal>
        <Reveal delay={0.08} className="mt-5">
          <h2 className="max-w-2xl text-[2rem] font-bold leading-[1.15] tracking-tight text-white md:text-[2.6rem]">
            El mercado no espera a la adaptación tardía.
          </h2>
        </Reveal>
        <Reveal delay={0.14} className="mt-4">
          <p className="max-w-2xl text-[15px] leading-relaxed text-zinc-400">
            Tres señales concretas de por qué el timing importa más que
            la intención.
          </p>
        </Reveal>

        <RevealGroup
          stagger={0.14}
          className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-3"
        >
          {signals.map((s) => (
            <RevealItem key={s.stat}>
              <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-[#121418] p-7">
                <div className="flex items-start justify-between">
                  <p className="text-accent text-[2.6rem] font-bold leading-none tracking-tight">
                    {s.stat}
                  </p>
                  <ArrowUpRight
                    size={18}
                    strokeWidth={2}
                    className="text-accent/60"
                  />
                </div>
                <span className="mt-2 inline-block w-fit rounded border border-white/10 bg-white/5 px-2 py-0.5 text-[9.5px] uppercase tracking-widest text-zinc-500">
                  Estimación
                </span>
                <p className="mt-4 text-[13.5px] leading-relaxed text-zinc-400">
                  {s.label}
                </p>
                <p className="mt-5 border-t border-white/10 pt-4 text-[13px] font-medium leading-relaxed text-white">
                  {s.insight}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.1} className="mt-8">
          <div className="flex items-start gap-2.5 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
            <Info size={15} strokeWidth={2} className="mt-0.5 shrink-0 text-zinc-500" />
            <p className="text-[12.5px] leading-relaxed text-zinc-400">
              Estos números son estimaciones ilustrativas para dar
              contexto en la conversación, no datos verificados de una
              fuente oficial o estudio publicado.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
