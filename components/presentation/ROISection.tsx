"use client";

import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";

const tiers = [
  {
    stage: "Nivel Inicial",
    detail: "Operatoria base y prospección en proyectos remotos.",
    value: "$1,000 – $1,700",
    height: 34,
  },
  {
    stage: "Especialista",
    detail: "Consolidador de cierres, autonomía técnica y gestión de pipeline.",
    value: "$1,700 – $2,500",
    height: 54,
  },
  {
    stage: "Closing Lead",
    detail: "Liderazgo de equipo comercial y contratos high-ticket.",
    value: "$2,500 – $4,200+",
    height: 80,
  },
];

export default function ROISection() {
  return (
    <section className="relative px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
            Construí una carrera comercial en mercados internacionales
          </span>
        </Reveal>
        <Reveal delay={0.08} className="mt-5">
          <h2 className="max-w-3xl text-[2rem] font-bold leading-[1.1] tracking-tight text-white md:text-[2.8rem]">
            De tus habilidades actuales a una carrera comercial remota
          </h2>
        </Reveal>
        <Reveal delay={0.14} className="mt-4">
          <p className="max-w-xl text-[15px] leading-relaxed text-zinc-400">
            Rangos orientativos según el nivel de desempeño alcanzado en
            proyectos comerciales remotos.{" "}
            <span className="text-zinc-500">
              No es una promesa de ingresos ni el costo del programa: depende
              de tu ejecución y de la oportunidad a la que accedas.
            </span>
          </p>
        </Reveal>

        <Reveal delay={0.2} className="mt-16">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#121418] p-8 md:p-12">
            {/* grilla de fondo, textura de dashboard */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage:
                  "linear-gradient(to top, white 1px, transparent 1px)",
                backgroundSize: "100% 25%",
              }}
            />

            <div className="relative flex items-center justify-between">
              <span className="text-[12px] font-medium text-zinc-400">
                Escalada de ingresos por etapa
              </span>
              <span className="text-[11px] uppercase tracking-widest text-zinc-600">
                USD / mes
              </span>
            </div>

            {/* gráfico de barras ascendente */}
            <div className="relative mt-14 flex h-[280px] items-end justify-between gap-6 sm:gap-10 md:px-4">
              {/* línea de tendencia diagonal */}
              <svg
                className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
                preserveAspectRatio="none"
              >
                <motion.line
                  x1="14%"
                  y1={`${100 - tiers[0].height}%`}
                  x2="50%"
                  y2={`${100 - tiers[1].height}%`}
                  stroke="var(--color-accent)"
                  strokeWidth="1.5"
                  strokeDasharray="4 5"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                />
                <motion.line
                  x1="50%"
                  y1={`${100 - tiers[1].height}%`}
                  x2="86%"
                  y2={`${100 - tiers[2].height}%`}
                  stroke="var(--color-accent)"
                  strokeWidth="1.5"
                  strokeDasharray="4 5"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
                />
              </svg>

              {tiers.map((t, i) => (
                <div
                  key={t.stage}
                  className="relative flex h-full flex-1 flex-col items-center justify-end"
                >
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.15 }}
                    className={`mb-4 whitespace-nowrap text-center text-[0.95rem] font-bold leading-none tracking-tight sm:text-[1.5rem] ${
                      i === 2 ? "text-accent" : "text-white"
                    }`}
                  >
                    {t.value}
                  </motion.p>

                  <motion.div
                    initial={{ height: 0 }}
                    whileInView={{ height: `${t.height}%` }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 1, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-[110px] rounded-t-lg"
                    style={{
                      background:
                        i === 2
                          ? "linear-gradient(180deg, var(--color-accent-hover) 0%, var(--color-accent) 100%)"
                          : "color-mix(in srgb, var(--color-accent) 22%, transparent)",
                    }}
                  />
                </div>
              ))}
            </div>

            {/* eje base */}
            <div className="relative mt-3 h-px w-full bg-white/10" />

            <div className="relative mt-4 flex justify-between gap-6 sm:gap-10 md:px-4">
              {tiers.map((t) => (
                <div key={t.stage} className="flex-1 text-center">
                  <h3 className="text-[13.5px] font-semibold text-white">
                    {t.stage}
                  </h3>
                  <p className="mx-auto mt-1 max-w-[160px] text-[11.5px] leading-relaxed text-zinc-500">
                    {t.detail}
                  </p>
                </div>
              ))}
            </div>
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
