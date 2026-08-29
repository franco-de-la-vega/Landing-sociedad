"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Reveal from "@/components/Reveal";
import RevealGroup from "@/components/RevealGroup";
import RevealItem from "@/components/RevealItem";

const BADGES = [
  "Formación práctica",
  "Performance + IA",
  "Trabajo remoto",
  "Portfolio profesional",
  "Empleabilidad",
];

export default function CurriculaHeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20, mass: 0.5 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20, mass: 0.5 });

  const glowX = useTransform(springX, (v) => v * 24);
  const glowY = useTransform(springY, (v) => v * 24);
  const gridX = useTransform(springX, (v) => v * -14);
  const gridY = useTransform(springY, (v) => v * -14);
  const linesX = useTransform(springX, (v) => v * -6);

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(((e.clientX - rect.left) / rect.width - 0.5) * 2);
    mouseY.set(((e.clientY - rect.top) / rect.height - 0.5) * 2);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex min-h-screen items-center overflow-hidden px-6 py-20 sm:min-h-[92vh] md:px-10 md:py-24"
    >
      <motion.div
        className="pointer-events-none absolute -top-32 left-1/2 h-[46rem] w-[70rem] -translate-x-1/2 opacity-[0.1] blur-3xl"
        style={{ background: "radial-gradient(ellipse, var(--color-accent) 0%, transparent 70%)", x: glowX, y: glowY }}
        aria-hidden
      />

      {/* grid tecnológico animado, con parallax al cursor */}
      <motion.svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.16]"
        style={{
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 30%, black 30%, transparent 85%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 30%, black 30%, transparent 85%)",
          x: gridX,
          y: gridY,
        }}
      >
        <defs>
          <pattern id="curriculaGrid" width="48" height="48" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1.6" fill="var(--color-accent)" />
            <path d="M0,24 H48 M24,0 V48" stroke="var(--color-accent)" strokeWidth="0.75" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#curriculaGrid)" />
      </motion.svg>

      {/* líneas de dato ascendiendo, efecto "tecnológico" */}
      <motion.div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ x: linesX }} aria-hidden>
        {[12, 32, 54, 71, 88].map((left, i) => (
          <motion.span
            key={left}
            className="absolute bottom-0 w-px bg-gradient-to-t from-[var(--color-accent)]/40 to-transparent"
            style={{ left: `${left}%`, height: "60%" }}
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: [0, 0.8, 0], scaleY: [0, 1, 1] }}
            transition={{
              duration: 3.2,
              delay: i * 0.5,
              repeat: Infinity,
              repeatDelay: 2.4,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>

      <div className="relative mx-auto max-w-4xl text-center">
        <Reveal>
          <span className="inline-flex max-w-[88%] items-center rounded-full border border-[var(--color-accent)]/25 bg-[var(--color-accent-muted)] px-3.5 py-1.5 text-center text-[10.5px] font-semibold uppercase leading-snug tracking-[0.02em] text-[var(--color-accent-hover)] sm:px-4 sm:text-[13.5px] sm:tracking-[0.08em] md:text-[15.5px] md:tracking-[0.1em]">
            Currícula Oficial · Closer Comercial
          </span>
        </Reveal>

        <Reveal delay={0.08} className="mt-6 sm:mt-8">
          <h1 className="mx-auto max-w-3xl text-[2.1rem] font-bold leading-[1.15] tracking-tight text-[var(--color-text-primary)] sm:text-[2.9rem] sm:leading-[1.1] md:text-[4.7rem] md:leading-[1.08]">
            Convertí tu talento en una{" "}
            <span className="text-[var(--color-accent)]">profesión comercial.</span>
          </h1>
        </Reveal>

        <Reveal delay={0.16} className="mt-5 sm:mt-7">
          <p className="mx-auto max-w-2xl text-[15.5px] leading-relaxed text-[var(--color-text-secondary)] sm:text-[18px] md:text-[22.5px]">
            Formate como Closer de ventas con entrenamiento práctico,
            simulaciones reales, tecnología de Performance Intelligence,
            portfolio profesional y preparación para trabajar en entornos
            comerciales remotos.
          </p>
        </Reveal>

        <RevealGroup stagger={0.05} className="mt-7 flex flex-wrap items-center justify-center gap-2 sm:mt-9 sm:gap-2.5">
          {BADGES.map((b) => (
            <RevealItem key={b}>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-1.5 text-[12.5px] font-medium text-[var(--color-text-secondary)] sm:gap-2 sm:px-4 sm:py-2 sm:text-[16.5px]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" aria-hidden />
                {b}
              </span>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.3} className="mt-10 sm:mt-12">
          <a
            href="#malla"
            className="group inline-flex flex-col items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.06em] text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent)] sm:text-[15.5px] sm:tracking-[0.1em]"
          >
            Explorá la currícula
            <motion.svg
              viewBox="0 0 20 20"
              fill="none"
              className="h-5 w-5"
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <path
                d="M10 4v12M5 11l5 5 5-5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
