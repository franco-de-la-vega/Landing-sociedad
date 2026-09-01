"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Reveal from "./Reveal";
import RevealGroup from "./RevealGroup";
import RevealItem from "./RevealItem";

const pillars = [
  {
    headline: "Adaptación diagnóstica",
    body: "Currícula que se ajusta dinámicamente a tu nivel diagnosticado, no a una plantilla fija.",
  },
  {
    headline: "Evaluación objetiva",
    body: "Medición en tiempo real basada en estándares de la industria, sin opiniones subjetivas.",
  },
  {
    headline: "Cero teoría reciclada",
    body: "Simulación práctica de alta intensidad, diseñada para inserción laboral internacional.",
  },
];

export default function ManifestoSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.5"],
  });
  const ruleScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const quoteY = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden border-t border-black/10 bg-[var(--color-bg-base)] py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-24 h-[420px] w-[420px] rounded-full bg-[var(--color-accent)]/[0.06] blur-[140px]"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="relative flex flex-col items-start text-left lg:col-span-5">
            <motion.span
              aria-hidden
              style={{ y: quoteY }}
              className="font-serif-display pointer-events-none absolute -left-3 -top-10 select-none text-[8rem] italic leading-none text-[var(--color-text-primary)]/[0.06]"
            >
              &ldquo;
            </motion.span>

            <Reveal>
              <span className="mb-6 text-xs uppercase tracking-widest text-[var(--color-text-muted)]">
                El manifiesto
              </span>
            </Reveal>

            <Reveal delay={0.08}>
              <h2 className="text-metal relative text-4xl font-semibold leading-[1.2] tracking-[-0.02em] sm:text-[3.2rem]">
                El problema no es tu capacidad
                <br />
                <span className="font-serif-display font-normal italic text-[var(--color-text-secondary)]">
                  Es como
                </span>
                <br />
                <span className="text-metal relative">
                  te formaron...
                  <motion.span
                    style={{ scaleX: ruleScale }}
                    className="absolute -bottom-1 left-0 h-px w-full origin-left bg-gradient-to-r from-[var(--color-accent)] via-[var(--color-accent)]/60 to-transparent"
                  />
                </span>
              </h2>
            </Reveal>
          </div>

          <div className="relative lg:col-span-7">
            <motion.div
              style={{ scaleY: ruleScale }}
              className="absolute left-0 top-0 hidden h-full w-px origin-top bg-gradient-to-b from-[var(--color-accent)] via-[var(--color-accent)]/30 to-transparent lg:block"
            />

            <RevealGroup
              stagger={0.12}
              className="flex flex-col divide-y divide-black/10 border-t border-b border-black/10 lg:pl-10"
            >
              {pillars.map((p) => (
                <RevealItem key={p.headline}>
                  <div className="group relative flex items-start gap-6 px-2 py-8 transition-all hover:bg-black/[0.02]">
                    <span className="mt-3 hidden h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-text-muted)]/40 transition-colors duration-300 group-hover:bg-[var(--color-accent)] sm:block" />
                    <div>
                      <h3 className="mb-2 text-2xl font-bold tracking-tight text-[var(--color-text-primary)] transition-transform group-hover:translate-x-1">
                        {p.headline}
                      </h3>
                      <p className="max-w-xl text-base font-normal leading-relaxed text-[var(--color-text-secondary)]">
                        {p.body}
                      </p>
                    </div>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </div>
    </section>
  );
}
