"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { EASE_OUT } from "@/lib/motion";

const ROTATING = ["negociar", "persuadir", "cerrar acuerdos"];

function Line({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span
        className="block"
        initial={{ y: "105%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9, delay, ease: EASE_OUT }}
      >
        {children}
      </motion.span>
    </span>
  );
}

// Sin overflow ni alturas fijas: así la palabra queda sobre la misma línea base que el resto del texto
function Rotator() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % ROTATING.length), 2600);
    return () => clearInterval(id);
  }, []);
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={ROTATING[i]}
        className="inline-block font-semibold text-[var(--color-accent-hover)]"
        initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
        transition={{ duration: 0.45, ease: EASE_OUT }}
      >
        {ROTATING[i]}
      </motion.span>
    </AnimatePresence>
  );
}

export default function Hero() {
  return (
    <section className="relative flex min-h-[100svh] w-full items-center overflow-hidden bg-[var(--color-bg-base)] pb-16 pt-36 sm:pt-40">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-16 px-6 md:px-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
            className="flex items-center gap-3 text-[12px] font-medium uppercase tracking-[0.16em] text-[var(--color-text-muted)]"
          >
            <span className="h-px w-8 bg-[var(--color-accent)]" />
            Instituto online · Latinoamérica
          </motion.div>

          <h1 className="mt-8 text-[2.9rem] font-bold leading-[1.02] tracking-[-0.045em] text-[var(--color-text-primary)] sm:text-7xl lg:text-[5.2rem]">
            <Line delay={0.1}>Aprendé la</Line>
            <Line delay={0.2}>habilidad que</Line>
            <Line delay={0.3}>
              <span className="font-serif-display font-normal italic tracking-[-0.02em]">mueve el mundo.</span>
            </Line>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: EASE_OUT }}
            className="mt-8 max-w-lg text-lg leading-relaxed text-[var(--color-text-secondary)] sm:text-xl"
          >
            Trabajá desde tu casa, para empresas del exterior, y cobrá en dólares.
            <br />
            Te formamos para <Rotator />
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.85, ease: EASE_OUT }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <a
              href="/aplicar"
              className="group inline-flex items-center gap-2 rounded-full bg-[var(--color-text-primary)] px-7 py-4 text-[15px] font-semibold text-[var(--color-bg-base)] transition-colors duration-300 hover:bg-black"
            >
              Quiero empezar
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a
              href="#metodo"
              className="inline-flex items-center px-4 py-4 text-[15px] font-semibold text-[var(--color-text-primary)] underline decoration-[var(--color-accent)] decoration-2 underline-offset-[6px] transition-colors hover:text-[var(--color-accent-hover)]"
            >
              Cómo funciona
            </a>
          </motion.div>
        </div>

        {/* Composición visual: la clase en vivo + el campus, para que se entienda qué es sin leer */}
        <div className="relative lg:col-span-6">
          <motion.div
            initial={{ opacity: 0, y: 40, rotate: 2 }}
            animate={{ opacity: 1, y: 0, rotate: 2 }}
            transition={{ duration: 1.1, delay: 0.3, ease: EASE_OUT }}
            className="relative ml-auto w-[92%] overflow-hidden rounded-[18px] border border-black/10 bg-white shadow-[0_50px_100px_-40px_rgba(28,26,22,0.45)]"
          >
            <div className="flex items-center gap-1.5 border-b border-black/5 px-3 py-2.5">
              <span className="h-2 w-2 rounded-full bg-black/10" />
              <span className="h-2 w-2 rounded-full bg-black/10" />
              <span className="h-2 w-2 rounded-full bg-black/10" />
            </div>
            {/* recorte sobre la parte que se entiende: el menú, el saludo y "Continuar Sprint" */}
            <div className="relative aspect-[16/11] overflow-hidden">
              <Image
                src="/home/campus.webp"
                alt="Campus del instituto: la ruta del alumno con su sprint en curso"
                fill
                priority
                sizes="(min-width: 1024px) 900px, 140vw"
                className="origin-top-left scale-[1.6] object-cover object-left-top"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40, rotate: -3 }}
            animate={{ opacity: 1, y: 0, rotate: -3 }}
            transition={{ duration: 1.1, delay: 0.55, ease: EASE_OUT }}
            className="absolute -bottom-10 left-0 w-[52%] overflow-hidden rounded-[16px] border-4 border-white bg-black shadow-[0_40px_80px_-30px_rgba(28,26,22,0.55)]"
          >
            <div className="relative aspect-[4/3]">
              <Image
                src="/home/simulacion-coach.jpg"
                alt="Clase en vivo por videollamada"
                fill
                priority
                sizes="(min-width: 1024px) 320px, 50vw"
                className="object-cover"
              />
              <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                En vivo
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 1.1, ease: EASE_OUT }}
            className="absolute -top-5 left-[6%] rounded-2xl border border-black/10 bg-white px-4 py-3 shadow-[0_20px_40px_-20px_rgba(28,26,22,0.35)]"
          >
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">Trabajo</div>
            <div className="mt-0.5 text-[15px] font-bold text-[var(--color-text-primary)]">100% remoto</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 1.25, ease: EASE_OUT }}
            className="absolute -bottom-6 right-[4%] rounded-2xl bg-[var(--color-text-primary)] px-4 py-3 text-white shadow-[0_20px_40px_-20px_rgba(28,26,22,0.6)]"
          >
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/50">Ingresos</div>
            <div className="mt-0.5 text-[15px] font-bold">En dólares</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
