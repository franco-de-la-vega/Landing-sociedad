"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import Reveal from "../Reveal";
import RevealGroup from "../RevealGroup";
import RevealItem from "../RevealItem";

const points = [
  { label: "La ruta", title: "14 sprints, cada uno con un proyecto real.", body: "Cada sprint se desbloquea al completar el anterior." },
  { label: "Progreso", title: "Cada avance, a la vista.", body: "Sabés en qué sprint estás, cuánto avanzaste y qué sigue." },
  { label: "Todo en un lugar", title: "Academia, entrenamiento, progreso y carrera.", body: "Estudio, práctica y seguimiento sin salir de la plataforma." },
];

export default function CampusSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [18, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.88, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0.3, 1]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#0A0B0D] px-6 py-20 sm:py-28 md:px-12 md:py-36">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "34px 34px" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <span className="text-[12px] font-medium uppercase tracking-[0.14em] text-white/40">Campus propio</span>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-6 text-4xl font-bold tracking-[-0.03em] text-white sm:text-[3.4rem] sm:leading-[1.05]">
              No es Skool. No es Udemy.
              <br />
              <span className="font-serif-display font-normal italic text-[var(--color-accent-hover)]">Es tu campus.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mx-auto mt-6 max-w-lg text-[15px] leading-relaxed text-white/55 sm:text-[16.5px]">
              Una plataforma construida desde cero para formar profesionales comerciales, con tu ruta, tu progreso y tus
              proyectos en un solo lugar.
            </p>
          </Reveal>
        </div>

        <div className="mt-10 [perspective:1600px] sm:mt-16">
          <motion.div style={{ rotateX, scale, opacity }} className="origin-bottom">
            <div className="overflow-hidden rounded-[14px] border border-white/10 bg-[#121418] shadow-[0_60px_120px_-30px_rgba(0,0,0,0.8)]">
              <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="ml-4 hidden rounded-md bg-white/[0.06] px-3 py-1 text-[11px] text-white/40 sm:inline">campus.formlat.com</span>
              </div>
              {/* En celular la captura entera es ilegible: se recorta y agranda sobre el menú y el saludo */}
              <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[4320/2699]">
                <Image
                  src="/home/campus.webp"
                  alt="Pantalla de la ruta del alumno en el campus, con los sprints completados, disponibles y bloqueados"
                  fill
                  sizes="(min-width: 1152px) 1152px, 180vw"
                  className="origin-top-left scale-[1.8] object-cover object-left-top sm:scale-100"
                />
              </div>
            </div>
          </motion.div>
        </div>

        <RevealGroup stagger={0.1} className="mt-10 grid grid-cols-1 gap-6 sm:mt-16 sm:gap-8 md:grid-cols-3">
          {points.map((p) => (
            <RevealItem key={p.label}>
              <div className="border-t border-white/10 pt-6">
                <span className="text-[11px] uppercase tracking-[0.14em] text-[var(--color-accent)]">{p.label}</span>
                <h3 className="mt-3 text-lg font-semibold leading-snug text-white">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/50">{p.body}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
