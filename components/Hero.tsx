"use client";

import Image from "next/image";
import { motion } from "framer-motion";
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

function Rotator() {
  return (
    <span className="relative inline-grid h-[1.625em] overflow-hidden align-top leading-[1.625]">
      {ROTATING.map((w, i) => (
        <motion.span
          key={w}
          className="col-start-1 row-start-1 whitespace-nowrap font-semibold text-[var(--color-accent-hover)]"
          initial={{ y: "110%" }}
          animate={{ y: ["110%", "0%", "0%", "-110%"] }}
          transition={{
            duration: 3.6,
            times: [0, 0.12, 0.88, 1],
            delay: 1.2 + i * 3.2,
            repeat: Infinity,
            repeatDelay: ROTATING.length * 3.2 - 3.6,
            ease: EASE_OUT,
          }}
        >
          {w}
        </motion.span>
      ))}
    </span>
  );
}

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-[var(--color-bg-base)] pt-28 sm:pt-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 pb-20 md:px-12 lg:grid-cols-12 lg:gap-10 lg:pb-28">
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
            className="relative ml-auto w-[88%] overflow-hidden rounded-[18px] border border-black/10 bg-white shadow-[0_50px_100px_-40px_rgba(28,26,22,0.45)]"
          >
            <div className="flex items-center gap-1.5 border-b border-black/5 px-3 py-2.5">
              <span className="h-2 w-2 rounded-full bg-black/10" />
              <span className="h-2 w-2 rounded-full bg-black/10" />
              <span className="h-2 w-2 rounded-full bg-black/10" />
            </div>
            <Image
              src="/home/campus.webp"
              alt="Campus del instituto"
              width={4320}
              height={2699}
              priority
              sizes="(min-width: 1024px) 560px, 90vw"
              className="h-auto w-full"
            />
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
