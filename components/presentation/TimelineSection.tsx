"use client";

import { motion } from "framer-motion";
import RevealGroup from "@/components/RevealGroup";
import RevealItem from "@/components/RevealItem";
import Reveal from "@/components/Reveal";

const steps = [
  {
    tag: "Día 1",
    title: "Inicio de Formación",
    income: null,
    body: "Diagnóstico técnico inicial, nivelación de competencias duras y activación en el sistema adaptativo.",
    height: "md:h-[220px]",
    featured: false,
  },
  {
    tag: "Mes 6",
    title: "Validación Técnica",
    income: null,
    body: "Graduación con dominio completo de la metodología de cierre, gestión de pipeline y simulaciones de alta presión.",
    height: "md:h-[260px]",
    featured: false,
  },
  {
    tag: "Mes 7 // Highlight",
    title: "Inserción Remota",
    income: "$1,000 – $1,700 USD/mes",
    body: "Vinculación directa a proyectos internacionales. Cierres efectivos en moneda dura y retorno acelerado de la inversión.",
    height: "md:h-[300px]",
    featured: true,
  },
  {
    tag: "Mes 12",
    title: "Consolidación Comercial",
    income: "$1,500 – $2,500 USD/mes",
    body: "Autonomía operativa total, gestión de cuentas high-ticket y aumento en la tasa de conversión.",
    height: "md:h-[340px]",
    featured: false,
  },
  {
    tag: "Año 3",
    title: "Mesa Chica & Director Comercial",
    income: "$2,500 – $4,200+ USD/mes",
    body: "Posicionamiento como Closer Senior o Lead Comercial, liderando infraestructura de ventas en empresas de alto impacto.",
    height: "md:h-[380px]",
    featured: false,
  },
];

export default function TimelineSection() {
  return (
    <section className="relative border-t border-white/10 px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500">
            Hoja de ruta
          </span>
        </Reveal>
        <Reveal delay={0.08} className="mt-5">
          <h2 className="max-w-2xl text-[2rem] font-bold leading-[1.15] tracking-tight text-white md:text-[2.8rem]">
            Tu Hoja de Ruta Comercial
          </h2>
        </Reveal>
        <Reveal delay={0.14} className="mt-4">
          <p className="max-w-xl text-[15px] leading-relaxed text-zinc-400">
            Proyección de evolución técnica, inserción y escalado de
            ingresos en moneda dura.
          </p>
        </Reveal>

        <RevealGroup
          stagger={0.1}
          className="mt-16 grid grid-cols-1 items-end gap-4 md:grid-cols-5"
        >
          {steps.map((s) => (
            <RevealItem key={s.tag} className="h-full">
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className={`flex h-full min-h-[200px] flex-col justify-between rounded-2xl border p-6 ${s.height} ${
                  s.featured
                    ? "border-cyan-400/50 bg-[#141a1c] shadow-[0_0_50px_-12px_rgba(0,242,254,0.45)]"
                    : "border-white/10 bg-[#121418]"
                }`}
              >
                <div>
                  <span
                    className={`inline-block rounded border px-2.5 py-1 text-[10px] uppercase tracking-widest ${
                      s.featured
                        ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-300"
                        : "border-white/10 bg-white/5 text-zinc-500"
                    }`}
                  >
                    {`[ ${s.tag} ]`}
                  </span>
                  <h3
                    className={`mt-4 text-[15px] font-bold ${
                      s.featured ? "text-cyan-300" : "text-white"
                    }`}
                  >
                    {s.title}
                  </h3>
                </div>

                <div>
                  {s.income && (
                    <p
                      className={`text-[15px] font-bold tracking-tight ${
                        s.featured ? "text-cyan-200" : "text-emerald-300"
                      }`}
                    >
                      {s.income}
                    </p>
                  )}
                  <p className="mt-2 text-[12.5px] leading-relaxed text-zinc-400">
                    {s.body}
                  </p>
                </div>
              </motion.div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
