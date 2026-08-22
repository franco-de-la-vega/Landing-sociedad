"use client";

import { motion } from "framer-motion";
import { Phone, User, Headset, ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";

export default function SimulationSection() {
  return (
    <section className="relative border-t border-white/10 px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500">
            Así se entrena de verdad
          </span>
        </Reveal>
        <Reveal delay={0.08} className="mt-5">
          <h2 className="max-w-2xl text-[2rem] font-bold leading-[1.15] tracking-tight text-white md:text-[2.8rem]">
            Practicás la llamada real, no la teoría.
          </h2>
        </Reveal>
        <Reveal delay={0.14} className="mt-4">
          <p className="max-w-xl text-[15px] leading-relaxed text-zinc-400">
            Hacés una llamada de venta con un coach que actúa como un
            cliente difícil de verdad. Te corrige ahí mismo, en el
            momento — no en un video que ves después.
          </p>
        </Reveal>

        <Reveal delay={0.2} className="mt-16">
          <div className="rounded-2xl border border-white/10 bg-[#121418] p-8 shadow-2xl md:p-10">
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between sm:gap-4">
              {/* Vos */}
              <div className="flex flex-col items-center text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10">
                  <User size={26} strokeWidth={1.75} className="text-white" />
                </span>
                <p className="mt-3 text-[14px] font-semibold text-white">
                  Vos
                </p>
                <span className="mt-1 max-w-[160px] text-[12.5px] leading-relaxed text-zinc-400">
                  Hacés la llamada como si fuera un cliente real.
                </span>
              </div>

              {/* Conector de llamada */}
              <div className="flex flex-1 flex-col items-center gap-2 px-4">
                <div className="relative flex w-full items-center">
                  <span className="h-px flex-1 bg-white/10" />
                  <motion.span
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="mx-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-300"
                  >
                    <Phone size={15} strokeWidth={2} />
                  </motion.span>
                  <span className="h-px flex-1 bg-white/10" />
                </div>
                <span className="text-[10px] uppercase tracking-widest text-cyan-300">
                  Llamada en vivo
                </span>
              </div>

              {/* Coach */}
              <div className="flex flex-col items-center text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/10 ring-1 ring-emerald-400/30">
                  <Headset size={26} strokeWidth={1.75} className="text-emerald-300" />
                </span>
                <p className="mt-3 text-[14px] font-semibold text-white">
                  Coach
                </p>
                <span className="mt-1 max-w-[160px] text-[12.5px] leading-relaxed text-zinc-400">
                  Pone objeciones difíciles y corrige tu técnica al toque.
                </span>
              </div>
            </div>

            <div className="mt-10 flex items-center justify-center gap-2 border-t border-white/10 pt-6 text-center">
              <span className="text-[13px] text-zinc-400">
                Después de cada llamada
              </span>
              <ArrowRight size={13} strokeWidth={2} className="text-zinc-600" />
              <span className="text-[13px] font-medium text-white">
                recibís feedback puntual: qué funcionó y qué corregir.
              </span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="mt-8">
          <p className="max-w-lg text-[13.5px] leading-relaxed text-zinc-500">
            Nada de teoría que se olvida. Practicás hasta que la técnica
            queda incorporada de verdad.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
