"use client";

import { motion } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";
import Magnetic from "./Magnetic";

export default function Hero() {
  return (
    <section className="relative flex min-h-[90vh] w-full items-center overflow-hidden bg-[var(--color-bg-base)]">
      <span className="pointer-events-none absolute -left-6 top-16 z-0 hidden select-none text-[17vw] font-black uppercase leading-none tracking-tighter text-[var(--color-text-primary)]/[0.03] sm:block md:top-6">
        ILFC
      </span>

      <div className="relative z-10 flex w-full max-w-7xl flex-col items-start justify-center px-6 pb-20 pt-12 text-left mx-auto md:px-12">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
          className="mb-8 text-xs uppercase tracking-widest text-[var(--color-accent-secondary)]"
        >
          Admisión por examen diagnóstico
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.1 }}
          className="mb-8 max-w-5xl text-5xl font-black leading-[0.92] tracking-tighter text-[var(--color-text-muted)] sm:text-7xl lg:text-8xl"
        >
          Formación{" "}
          <span className="text-accent-gradient">real.</span>
          <br />
          Hacia un trabajo{" "}
          <span className="text-accent-gradient">real.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.2 }}
          className="mb-10 max-w-2xl text-left text-base font-normal leading-relaxed text-[var(--color-text-secondary)] sm:text-xl"
        >
          Educación de estándar internacional, tecnología de medición en
          tiempo real y acompañamiento 1 a 1 para insertarte en empresas del
          exterior.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.3 }}
          className="flex flex-wrap items-center gap-4 text-left"
        >
          <Magnetic strength={0.4}>
            <a
              href="#metodo"
              className="cursor-pointer rounded-full bg-[var(--color-text-primary)] px-8 py-4 text-sm font-semibold text-[var(--color-bg-base)] shadow-lg transition-all hover:opacity-90 hover:shadow-[0_10px_32px_-8px_rgba(20,18,14,0.35)]"
            >
              Descubrir el método
            </a>
          </Magnetic>
        </motion.div>
      </div>
    </section>
  );
}
