"use client";

import { TrendingUp } from "lucide-react";
import RevealGroup from "@/components/RevealGroup";
import RevealItem from "@/components/RevealItem";
import Reveal from "@/components/Reveal";

const rows = [
  {
    stage: "Nivel Inicial / Inserción",
    detail: "Operatoria base y prospección en proyectos remotos.",
    value: "$1,700",
    pct: 40,
    valueColor: "text-cyan-300",
    barColor: "bg-cyan-400",
  },
  {
    stage: "Especialista Medio Plazo",
    detail: "Consolidador de cierres, autonomía técnica y gestión de pipeline.",
    value: "$2,500",
    pct: 62,
    valueColor: "text-emerald-300",
    barColor: "bg-emerald-400",
  },
  {
    stage: "Senior / Closing Lead",
    detail: "Liderazgo de equipo comercial y contratos high-ticket.",
    value: "$4,200+",
    pct: 100,
    valueColor: "text-cyan-200",
    barColor: "bg-gradient-to-r from-cyan-400 to-emerald-400",
  },
];

export default function ROISection() {
  return (
    <section className="relative px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500">
            Proyección económica y arbitraje de ingresos
          </span>
        </Reveal>
        <Reveal delay={0.08} className="mt-5">
          <h2 className="max-w-3xl text-[2rem] font-bold leading-[1.1] tracking-tight text-white md:text-[2.8rem]">
            Valor de Mercado &amp; Escalabilidad Financiera
          </h2>
        </Reveal>
        <Reveal delay={0.14} className="mt-4">
          <p className="max-w-xl text-[15px] leading-relaxed text-zinc-400">
            Proyección de ingresos al operar bajo estándares comerciales
            internacionales en moneda dura.{" "}
            <span className="text-zinc-500">
              Esto es lo que podés llegar a ganar trabajando, no el costo
              del programa.
            </span>
          </p>
        </Reveal>

        <Reveal delay={0.2} className="mt-16">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#121418]">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <span className="flex items-center gap-2 text-[12px] font-medium text-zinc-300">
                <TrendingUp size={14} strokeWidth={2} className="text-cyan-300" />
                Escalada de ingresos por etapa
              </span>
              <span className="text-[11px] uppercase tracking-widest text-zinc-500">
                USD / mes
              </span>
            </div>

            <RevealGroup stagger={0.12} className="divide-y divide-white/10">
              {rows.map((r) => (
                <RevealItem key={r.stage}>
                  <div className="grid grid-cols-1 items-center gap-3 px-6 py-6 sm:grid-cols-[1fr_auto] sm:gap-6">
                    <div>
                      <h3 className="text-[15px] font-semibold text-white">
                        {r.stage}
                      </h3>
                      <p className="mt-1 max-w-md text-[13px] leading-relaxed text-zinc-400">
                        {r.detail}
                      </p>
                      <div className="mt-3 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-white/5">
                        <div
                          className={`h-full rounded-full ${r.barColor}`}
                          style={{ width: `${r.pct}%` }}
                        />
                      </div>
                    </div>
                    <p className={`text-[2rem] font-bold leading-none tracking-tight sm:text-right ${r.valueColor}`}>
                      {r.value}
                    </p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="mt-8">
          <p className="text-[12px] italic leading-relaxed text-zinc-600">
            Datos proyectados según estándares de contratación remota en
            mercados de moneda dura.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
