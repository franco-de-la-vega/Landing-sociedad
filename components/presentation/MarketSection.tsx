"use client";

import CountUp from "./CountUp";

const señales = [
  {
    value: 161,
    prefix: "+",
    suffix: "%",
    claim: "La demanda no bajó nunca. Se aceleró.",
    detail:
      "Crecimiento en contratación remota de empresas de EE.UU. hacia Latinoamérica en 2023.",
    fuente: "Nearshore Americas",
  },
  {
    value: 45,
    suffix: "%",
    claim: "Dejó de ser marginal. Ya es casi la mitad del sector.",
    detail: "Casi la mitad de los roles comerciales B2B ya se cubren en remoto, sin oficina.",
    fuente: "Accountmakers, 2026",
  },
  {
    value: 1,
    prefix: "#",
    claim: "La negociación remota dejó de ser un nicho.",
    detail:
      "Account Executive es el puesto remoto más buscado en 2026, superando a software engineer.",
    fuente: "Dailyremote, 2026",
  },
];

export default function MarketSection() {
  return (
    <section className="relative flex min-h-screen items-center border-t border-[var(--color-border)] bg-[var(--color-bg-elevated-2)] px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto w-full max-w-6xl">
        <span className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
          Market intelligence
        </span>
        <h2 className="mt-3 max-w-2xl text-[2.4rem] font-black leading-[1.1] tracking-tight text-[var(--color-text-primary)] md:text-[3.2rem]">
          El mercado paga por performance.
        </h2>
        <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-[var(--color-text-secondary)]">
          Tres señales concretas de por qué el timing importa más que la
          intención.
        </p>

        <div className="mt-16 grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-3">
          {señales.map((s) => (
            <div key={s.claim} className="border-t-2 border-[var(--color-accent)] pt-6">
              <div className="text-[3.2rem] font-black leading-none tracking-tight text-[var(--color-accent)]">
                <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} />
              </div>
              <p className="mt-4 text-[17px] font-bold leading-snug text-[var(--color-text-primary)]">
                {s.claim}
              </p>
              <p className="mt-2 text-[14.5px] leading-relaxed text-[var(--color-text-secondary)]">
                {s.detail}
              </p>
              <span className="mt-4 block text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                Fuente: {s.fuente}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
