"use client";

import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import RevealGroup from "@/components/RevealGroup";
import RevealItem from "@/components/RevealItem";
import CountUp from "./CountUp";

const signals = [
  {
    value: 161,
    prefix: "+",
    suffix: "%",
    label: "Crecimiento en contratación remota de empresas de EE.UU. hacia Latinoamérica en 2023.",
    insight: "La demanda no bajó nunca. Se aceleró.",
    source: "Nearshore Americas",
  },
  {
    value: 45,
    prefix: "",
    suffix: "%",
    label: "De los puestos de ventas B2B hoy son 100% remotos, sin oficina.",
    insight: "Ya no es la excepción. Es la norma del sector.",
    source: "AccountMakers, 2026",
  },
  {
    value: 1,
    prefix: "#",
    suffix: "",
    label: "Account Executive es el puesto remoto más buscado en 2026, superando a software engineer.",
    insight: "Ventas remotas dejó de ser un nicho.",
    source: "DailyRemote, 2026",
  },
];

export default function MarketSection() {
  return (
    <section className="relative border-t border-[var(--color-border)] px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <span className="text-[14px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-secondary)]">
            La inevitabilidad del mercado
          </span>
        </Reveal>
        <Reveal delay={0.08} className="mt-5">
          <h2 className="max-w-2xl text-[2.4rem] font-bold leading-[1.1] tracking-tight text-[var(--color-text-primary)] md:text-[3.1rem]">
            El mercado no espera a la adaptación tardía.
          </h2>
        </Reveal>
        <Reveal delay={0.14} className="mt-4">
          <p className="max-w-2xl text-[18px] leading-relaxed text-[var(--color-text-secondary)]">
            Tres señales concretas de por qué el timing importa más que
            la intención.
          </p>
        </Reveal>

        <RevealGroup
          stagger={0.14}
          className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3"
        >
          {signals.map((s) => (
            <RevealItem key={s.label}>
              <div className="flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-10">
                <div className="flex items-start justify-between">
                  <CountUp
                    value={s.value}
                    prefix={s.prefix}
                    suffix={s.suffix}
                    className="text-[var(--color-accent)] text-[3.6rem] font-bold leading-none tracking-tight"
                  />
                  <ArrowUpRight
                    size={20}
                    strokeWidth={2}
                    className="text-[var(--color-accent)]/60"
                  />
                </div>
                <p className="mt-5 text-[18px] leading-relaxed text-[var(--color-text-secondary)]">
                  {s.label}
                </p>
                <p className="mt-6 border-t border-[var(--color-border)] pt-5 text-[17px] font-medium leading-relaxed text-[var(--color-text-primary)]">
                  {s.insight}
                </p>
                <span className="mt-5 text-[13px] uppercase tracking-widest text-[var(--color-text-muted)]">
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
