"use client";

import { motion } from "framer-motion";
import Reveal from "./Reveal";

export default function CTASection() {
  return (
    <section id="aplicar" className="relative overflow-hidden bg-[#0A0B0D] px-5 py-28 sm:px-8 sm:py-40">
      {/* mismo lenguaje visual que las secciones oscuras del resto del sitio:
          grid técnico apenas visible + resplandor dorado + barrido de escaneo */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "34px 34px",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[42rem] w-[60rem] -translate-x-1/2 -translate-y-1/3 opacity-[0.14] blur-3xl"
        style={{ background: "radial-gradient(ellipse, var(--color-accent) 0%, transparent 70%)" }}
        aria-hidden
      />
      <motion.div
        className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent"
        animate={{ left: ["-40%", "140%"] }}
        transition={{ duration: 5, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
        aria-hidden
      />

      <div className="relative mx-auto flex max-w-2xl flex-col items-center text-center">
        <Reveal>
          <span className="text-[12px] font-medium uppercase tracking-[0.14em] text-white/40">
            Conocenos
          </span>
        </Reveal>
        <Reveal delay={0.08} className="mt-7">
          <h2 className="text-[2.1rem] font-bold tracking-[-0.03em] text-white sm:text-[3.2rem]">
            El primer paso es conocerte a vos.
          </h2>
        </Reveal>
        <Reveal delay={0.14} className="mt-4">
          <p className="max-w-lg text-[15px] leading-relaxed text-white/55 sm:text-[16.5px]">
            Mirá el video, respondé unas preguntas y, si el programa es para vos,
            elegí el horario de tu llamada con el equipo.
          </p>
        </Reveal>

        <Reveal delay={0.2} className="mt-12 w-full">
          <a
            href="/aplicar"
            className="mx-auto inline-flex items-center justify-center rounded-xl bg-[var(--color-accent)] px-8 py-4 text-[16px] font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)]"
          >
            Quiero saber más
          </a>
        </Reveal>
      </div>
    </section>
  );
}
