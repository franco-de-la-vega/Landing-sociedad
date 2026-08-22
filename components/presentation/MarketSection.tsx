"use client";

import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import RevealGroup from "@/components/RevealGroup";
import RevealItem from "@/components/RevealItem";

const signals = [
  {
    stat: "+161%",
    label: "Crecimiento en contratación remota de empresas de EE.UU. hacia Latinoamérica en 2023.",
    insight: "La demanda no bajó nunca. Se aceleró.",
    source: "Nearshore Americas",
  },
  {
    stat: "45%",
    label: "De los puestos de ventas B2B hoy son 100% remotos, sin oficina.",
    insight: "Ya no es la excepción. Es la norma del sector.",
    source: "AccountMakers, 2026",
  },
  {
    stat: "#1",
    label: "Account Executive es el puesto remoto más buscado en 2026, superando a software engineer.",
    insight: "Ventas remotas dejó de ser un nicho.",
    source: "DailyRemote, 2026",
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
                <p className="mt-4 text-[13.5px] leading-relaxed text-zinc-400">
                  {s.label}
                </p>
                <p className="mt-5 border-t border-white/10 pt-4 text-[13px] font-medium leading-relaxed text-white">
                  {s.insight}
                </p>
                <span className="mt-4 text-[10.5px] uppercase tracking-widest text-zinc-600">
                  Fuente: {s.source}
                </span>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
