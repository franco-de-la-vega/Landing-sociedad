"use client";

import { motion } from "framer-motion";
import RevealGroup from "@/components/RevealGroup";
import RevealItem from "@/components/RevealItem";
import Reveal from "@/components/Reveal";

const tiers = [
  {
    stage: "Nivel Inicial / Inserción",
    value: "$1,700",
    unit: "USD/mes",
    body: "Operatoria base y prospección en proyectos remotos.",
    topBorder: "before:bg-cyan-400/60",
    glow: "shadow-[0_0_40px_-12px_rgba(0,242,254,0.25)]",
    valueColor: "text-cyan-300",
  },
  {
    stage: "Especialista Medio Plazo",
    value: "$2,500",
    unit: "USD/mes",
    body: "Consolidador de cierres, autonomía técnica y gestión de pipeline.",
    topBorder: "before:bg-emerald-400/60",
    glow: "shadow-[0_0_40px_-12px_rgba(16,185,129,0.3)]",
    valueColor: "text-emerald-300",
  },
  {
    stage: "Senior / Closing Lead",
    value: "$4,200+",
    unit: "USD/mes",
    body: "Liderazgo de equipo comercial y contratos high-ticket.",
    topBorder: "before:bg-cyan-300/70",
    glow: "shadow-[0_0_50px_-10px_rgba(0,242,254,0.35)]",
    valueColor: "text-cyan-200",
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

        <RevealGroup
          stagger={0.14}
          className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {tiers.map((t, i) => (
            <RevealItem key={t.stage}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className={`before:content-[''] before:absolute before:inset-x-0 before:top-0 before:h-px relative flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-[#121418] p-8 ${t.topBorder} ${t.glow}`}
              >
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500">
                    Etapa {i + 1}
                  </span>
                  <h3 className="mt-3 text-[15px] font-semibold text-white">
                    {t.stage}
                  </h3>
                </div>
                <div className="mt-10">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500">
                    Sueldo de mercado
                  </span>
                  <p className={`mt-1 text-[2.5rem] font-bold leading-none tracking-tight ${t.valueColor}`}>
                    {t.value}
                    <span className="ml-2 text-[13px] font-medium text-zinc-500">
                      {t.unit}
                    </span>
                  </p>
                  <p className="mt-4 text-[13.5px] leading-relaxed text-zinc-400">
                    {t.body}
                  </p>
                </div>
              </motion.div>
            </RevealItem>
          ))}
        </RevealGroup>

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
