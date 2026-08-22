"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "@/components/Reveal";

const steps = [
  {
    tag: "Día 1",
    title: "Inicio de Formación",
    income: null,
    body: "Diagnóstico técnico inicial, nivelación de competencias duras y activación en el sistema adaptativo.",
    featured: false,
  },
  {
    tag: "Mes 6",
    title: "Validación Técnica",
    income: null,
    body: "Graduación con dominio completo de la metodología de cierre, gestión de pipeline y simulaciones de alta presión.",
    featured: false,
  },
  {
    tag: "Mes 7",
    title: "Inserción Remota",
    income: "$1,000 – $1,700 USD/mes",
    body: "Vinculación directa a proyectos internacionales. Cierres efectivos en moneda dura y retorno acelerado de la inversión.",
    featured: true,
  },
  {
    tag: "Mes 12",
    title: "Consolidación Comercial",
    income: "$1,500 – $2,500 USD/mes",
    body: "Autonomía operativa total, gestión de cuentas high-ticket y aumento en la tasa de conversión.",
    featured: false,
  },
  {
    tag: "Año 3",
    title: "Mesa Chica & Director Comercial",
    income: "$2,500 – $4,200+ USD/mes",
    body: "Posicionamiento como Closer Senior o Lead Comercial, liderando infraestructura de ventas en empresas de alto impacto.",
    featured: false,
  },
];

export default function TimelineSection() {
  const [open, setOpen] = useState(2);

  return (
    <section className="relative border-t border-white/10 px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
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
            ingresos en moneda dura. Tocá cada etapa para ver el
            detalle.
          </p>
        </Reveal>

        <div className="relative mt-24">
          {/* riel horizontal: línea estática + pulso de energía viajando en loop */}
          <div className="absolute inset-x-2 top-0 hidden h-px bg-white/10 md:block" />
          <motion.div
            aria-hidden
            animate={{ left: ["0%", "100%"] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.6 }}
            className="absolute top-0 hidden h-px w-1/4 -translate-x-1/2 md:block"
            style={{
              background:
                "linear-gradient(90deg, transparent, var(--color-accent) 50%, transparent)",
              filter: "drop-shadow(0 0 6px var(--color-accent))",
            }}
          />

          <div className="grid grid-cols-1 gap-x-4 gap-y-10 md:grid-cols-5">
            {steps.map((s, i) => {
              const isOpen = open === i;
              return (
                <div key={s.tag} className="relative flex flex-col items-center">
                  {/* nodo + palito */}
                  <div className="relative hidden h-8 w-full items-start justify-center md:flex">
                    <motion.span
                      animate={
                        s.featured
                          ? {
                              boxShadow: [
                                "0 0 0px rgba(184,147,90,0)",
                                "0 0 14px rgba(184,147,90,0.6)",
                                "0 0 0px rgba(184,147,90,0)",
                              ],
                            }
                          : undefined
                      }
                      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                      className={`h-3 w-3 rounded-full ${
                        s.featured ? "bg-accent" : "bg-zinc-600"
                      }`}
                    />
                    <span className="absolute top-3 h-5 w-px bg-white/10" />
                  </div>

                  {/* pastilla clickeable */}
                  <button
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className={`group w-full rounded-full border px-4 py-2.5 text-left transition-colors duration-300 md:text-center ${
                      isOpen
                        ? s.featured
                          ? "border-accent/50 bg-accent/[0.06]"
                          : "border-white/20 bg-white/[0.04]"
                        : "border-white/10 bg-[#121418] hover:border-white/25"
                    }`}
                  >
                    <span
                      className={`block text-[10px] uppercase tracking-widest ${
                        s.featured ? "text-accent" : "text-zinc-500"
                      }`}
                    >
                      {s.tag}
                    </span>
                    <span className="mt-0.5 block text-[13.5px] font-semibold text-white">
                      {s.title}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full overflow-hidden"
                      >
                        <div
                          className={`mt-3 rounded-2xl border p-5 text-center md:text-left ${
                            s.featured
                              ? "border-accent/30 bg-[#141a1c] shadow-[0_0_40px_-14px_rgba(184,147,90,0.35)]"
                              : "border-white/10 bg-[#121418]"
                          }`}
                        >
                          {s.income && (
                            <p
                              className={`text-[15px] font-bold tracking-tight ${
                                s.featured ? "text-accent" : "text-accent"
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
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
