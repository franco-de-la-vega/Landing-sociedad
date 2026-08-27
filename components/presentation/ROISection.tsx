"use client";

import Reveal from "@/components/Reveal";
import RangeCountUp from "./RangeCountUp";

const tiers = [
  {
    stage: "Nivel Inicial",
    detail: "Operatoria base y prospección en proyectos remotos.",
    low: 1000,
    high: 1700,
    suffix: "",
    heightClass: "h-[35%]",
    bar: "bg-neutral-200/80",
    value: "font-bold text-neutral-800 text-lg",
  },
  {
    stage: "Especialista",
    detail: "Consolidador de cierres, autonomía técnica y gestión de pipeline.",
    low: 1700,
    high: 2500,
    suffix: "",
    heightClass: "h-[60%]",
    bar: "bg-[#D4C3A3]",
    value: "font-bold text-neutral-900 text-lg",
  },
  {
    stage: "Closing Lead",
    detail: "Liderazgo de equipo comercial y contratos high-ticket.",
    low: 2500,
    high: 4200,
    suffix: "+",
    heightClass: "h-[90%]",
    bar: "bg-[#A37B3E] shadow-md",
    value: "font-extrabold text-[#A37B3E] text-xl",
  },
];

export default function ROISection() {
  return (
    <section className="flex h-screen max-h-screen flex-col items-center justify-center overflow-hidden px-6 md:px-10">
      <div className="mx-auto w-full max-w-5xl">
        <Reveal>
          <span className="text-[14px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-secondary)]">
            Construí una carrera comercial en mercados internacionales
          </span>
        </Reveal>
        <Reveal delay={0.08} className="mt-5">
          <h2 className="max-w-3xl text-[2.2rem] font-bold leading-[1.1] tracking-tight text-[var(--color-text-primary)] md:text-[2.8rem]">
            De tus habilidades actuales a una carrera comercial remota
          </h2>
        </Reveal>
        <Reveal delay={0.14} className="mt-4">
          <p className="max-w-xl text-[16px] leading-relaxed text-[var(--color-text-secondary)]">
            Rangos orientativos según el nivel de desempeño alcanzado en
            proyectos comerciales remotos.{" "}
            <span className="text-[var(--color-text-muted)]">
              No es una promesa de ingresos ni el costo del programa: depende
              de tu ejecución y de la oportunidad a la que accedas.
            </span>
          </p>
        </Reveal>

        <Reveal delay={0.2} className="mt-10">
          <div className="w-full max-w-5xl rounded-3xl border border-neutral-200/80 bg-white p-10 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-medium text-neutral-500">
                Escalada de ingresos por etapa
              </span>
              <span className="text-[13px] uppercase tracking-widest text-neutral-400">
                USD / mes
              </span>
            </div>

            {/* gráfico de barras */}
            <div className="mt-10 grid h-[280px] grid-cols-3 items-end gap-8 border-b border-neutral-200 pb-4">
              {tiers.map((t) => (
                <div key={t.stage} className="flex h-full flex-col items-center justify-end">
                  <RangeCountUp
                    low={t.low}
                    high={t.high}
                    suffix={t.suffix}
                    className={`mb-2 whitespace-nowrap text-center ${t.value}`}
                  />
                  <div className={`w-full max-w-[140px] rounded-t-xl ${t.heightClass} ${t.bar}`} />
                </div>
              ))}
            </div>

            {/* etiquetas alineadas */}
            <div className="grid grid-cols-3 gap-8 pt-6">
              {tiers.map((t) => (
                <div key={t.stage} className="text-center">
                  <h3 className="text-[17px] font-semibold text-neutral-900">{t.stage}</h3>
                  <p className="mx-auto mt-1 max-w-[160px] text-[13.5px] leading-relaxed text-neutral-500">
                    {t.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
