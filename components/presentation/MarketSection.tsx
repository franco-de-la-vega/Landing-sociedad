"use client";

import CountUp from "./CountUp";

export default function MarketSection() {
  return (
    <section className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden border-t border-[var(--color-border)] bg-[#FAF9F5] px-12">
      <div className="mx-auto w-full max-w-6xl">
        {/* ENCABEZADO */}
        <div className="mb-14">
          <span className="mb-2 block text-[13px] font-bold uppercase tracking-[0.2em] text-[#A37B3E]">
            MARKET INTELLIGENCE
          </span>
          <h2 className="mb-3 text-6xl font-black tracking-tight text-neutral-900">
            El mercado paga por performance.
          </h2>
          <p className="text-xl font-normal text-neutral-500">
            Tres señales concretas de por qué el timing importa más que la
            intención.
          </p>
        </div>

        {/* ASIMETRÍA: un dato protagonista + dos secundarios apilados */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.3fr_1fr]">
          {/* Protagonista */}
          <div className="flex flex-col justify-between rounded-2xl border border-neutral-200/80 bg-white p-10 shadow-sm">
            <div>
              <span className="mb-5 block text-[12px] font-bold uppercase tracking-widest text-neutral-400">
                DATO DE MERCADO
              </span>
              <div className="mb-5 text-[7rem] font-bold leading-none tracking-tight text-[#A37B3E] md:text-[9rem]">
                <CountUp value={161} prefix="+" suffix="%" />
              </div>
              <p className="max-w-sm text-lg font-medium leading-relaxed text-neutral-600">
                Crecimiento en contratación remota de empresas de EE.UU.
                hacia Latinoamérica en 2023.
              </p>
            </div>
            <div className="mt-8 border-t border-neutral-100 pt-4">
              <p className="mb-1 text-base font-bold text-neutral-900">
                La demanda no bajó nunca. Se aceleró.
              </p>
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                FUENTE: NEARSHORE AMERICAS
              </span>
            </div>
          </div>

          {/* Secundarios, apilados */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-1 items-center justify-between gap-6 rounded-2xl border border-neutral-200/80 bg-white p-7 shadow-sm">
              <div>
                <p className="mb-1.5 text-[17px] font-bold text-neutral-900">
                  Ya no es la excepción. Es la norma del sector.
                </p>
                <p className="text-[15px] leading-relaxed text-neutral-500">
                  De los puestos de ventas B2B hoy son 100% remotos, sin
                  oficina.
                </p>
                <span className="mt-2.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  FUENTE: ACCOUNTMAKERS, 2026
                </span>
              </div>
              <div className="shrink-0 text-5xl font-bold leading-none tracking-tight text-[#A37B3E] md:text-6xl">
                <CountUp value={45} suffix="%" />
              </div>
            </div>

            <div className="flex flex-1 items-center justify-between gap-6 rounded-2xl border border-neutral-200/80 bg-white p-7 shadow-sm">
              <div>
                <p className="mb-1.5 text-[17px] font-bold text-neutral-900">
                  Ventas remotas dejó de ser un nicho.
                </p>
                <p className="text-[15px] leading-relaxed text-neutral-500">
                  Account Executive es el puesto remoto más buscado en
                  2026, superando a software engineer.
                </p>
                <span className="mt-2.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  FUENTE: DAILYREMOTE, 2026
                </span>
              </div>
              <div className="shrink-0 text-5xl font-bold leading-none tracking-tight text-[#A37B3E] md:text-6xl">
                <CountUp value={1} prefix="#" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
