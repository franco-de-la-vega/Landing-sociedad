"use client";

import { motion } from "framer-motion";
import { Mic, User, Headset, Circle } from "lucide-react";
import Reveal from "@/components/Reveal";

const bars = [8, 18, 30, 45, 60, 72, 55, 38, 62, 80, 48, 30, 55, 70, 42, 20, 34, 50, 65, 28];

const feedbackTags = [
  { text: "Objeción manejada", color: "neutral", delay: 0.4 },
  { text: "Tono correcto", color: "neutral", delay: 1.4 },
  { text: "Ajustá el cierre", color: "accent", delay: 2.4 },
];

const tagStyles: Record<string, string> = {
  neutral: "border-[var(--color-border)] bg-black/5 text-[var(--color-text-secondary)]",
  accent: "border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 text-[var(--color-accent)]",
};

export default function SimulationSection() {
  return (
    <section className="relative border-t border-[var(--color-border)] px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <span className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-secondary)]">
            Así se entrena de verdad
          </span>
        </Reveal>
        <Reveal delay={0.08} className="mt-5">
          <h2 className="max-w-2xl text-[2rem] font-bold leading-[1.15] tracking-tight text-[var(--color-text-primary)] md:text-[2.8rem]">
            Practicás la llamada real, no la teoría.
          </h2>
        </Reveal>
        <Reveal delay={0.14} className="mt-4">
          <p className="max-w-xl text-[16.5px] leading-relaxed text-[var(--color-text-secondary)]">
            Hacés una llamada de venta con un coach que actúa como un
            cliente difícil de verdad. Te corrige ahí mismo, en el
            momento — no en un video que ves después.
          </p>
        </Reveal>

        <Reveal delay={0.2} className="mt-16">
          <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated-2)] shadow-2xl">
            {/* barra de título tipo app */}
            <div className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-5 py-3">
              <div className="flex items-center gap-1.5">
                <Circle size={8} className="fill-red-500/60 text-red-500/60" />
                <Circle size={8} className="fill-amber-500/60 text-amber-500/60" />
                <Circle size={8} className="fill-emerald-500/60 text-emerald-500/60" />
              </div>
              <span className="flex items-center gap-2 text-[12px] uppercase tracking-widest text-[var(--color-text-muted)]">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                Simulación en vivo
              </span>
            </div>

            {/* tiles de video */}
            <div className="grid grid-cols-1 gap-px bg-black/5 sm:grid-cols-2">
              <div className="relative flex aspect-[4/3] flex-col items-center justify-center bg-[var(--color-bg-elevated-2)] p-6">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-black/5 ring-1 ring-black/10">
                  <User size={26} strokeWidth={1.75} className="text-[var(--color-text-primary)]" />
                </span>
                <p className="mt-3 text-[15px] font-semibold text-[var(--color-text-primary)]">Vos</p>
                <span className="mt-1 flex items-center gap-1.5 text-[12px] text-[var(--color-text-muted)]">
                  <Mic size={11} strokeWidth={2} />
                  Hablando
                </span>

                {/* onda de audio */}
                <div className="mt-4 flex h-8 items-end gap-[3px]">
                  {bars.map((h, i) => (
                    <motion.span
                      key={i}
                      animate={{ height: [`${h * 0.4}%`, `${h}%`, `${h * 0.4}%`] }}
                      transition={{
                        duration: 1.1,
                        repeat: Infinity,
                        delay: i * 0.05,
                        ease: "easeInOut",
                      }}
                      className="w-[3px] rounded-full bg-[var(--color-accent)]/70"
                    />
                  ))}
                </div>
              </div>

              <div className="relative flex aspect-[4/3] flex-col items-center justify-center bg-[var(--color-bg-elevated-2)] p-6">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-accent)]/10 ring-1 ring-[var(--color-accent)]/30">
                  <Headset size={26} strokeWidth={1.75} className="text-[var(--color-accent)]" />
                </span>
                <p className="mt-3 text-[15px] font-semibold text-[var(--color-text-primary)]">Coach</p>
                <span className="mt-1 text-[12px] text-[var(--color-text-muted)]">
                  Evaluando en tiempo real
                </span>

                {/* tags de feedback flotantes */}
                <div className="mt-4 flex min-h-[30px] flex-wrap items-center justify-center gap-2">
                  {feedbackTags.map((t) => (
                    <motion.span
                      key={t.text}
                      initial={{ opacity: 0, y: 6 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.6 }}
                      transition={{ duration: 0.4, delay: t.delay }}
                      className={`rounded-full border px-2.5 py-1 text-[11.5px] font-medium ${tagStyles[t.color]}`}
                    >
                      {t.text}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 border-t border-[var(--color-border)] px-5 py-4 text-center">
              <span className="text-[14px] text-[var(--color-text-secondary)]">
                Después de cada llamada recibís feedback puntual:
              </span>
              <span className="text-[14px] font-medium text-[var(--color-text-primary)]">
                qué funcionó y qué corregir.
              </span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="mt-8">
          <p className="max-w-lg text-[15px] leading-relaxed text-[var(--color-text-muted)]">
            Nada de teoría que se olvida. Practicás hasta que la técnica
            queda incorporada de verdad.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
