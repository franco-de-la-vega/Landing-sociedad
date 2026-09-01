"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Mic, User, Headset, Circle, CheckCircle2 } from "lucide-react";
import Reveal from "@/components/Reveal";

const bars = [8, 18, 30, 45, 60, 72, 55, 38, 62, 80, 48, 30, 55, 70, 42, 20, 34, 50, 65, 28];

const feedbackTags = [
  { text: "Objeción manejada", color: "neutral", delay: 0.4 },
  { text: "Tono correcto", color: "neutral", delay: 1.4 },
  { text: "Ajustá el cierre", color: "accent", delay: 2.4 },
];

const tagStyles: Record<string, string> = {
  neutral: "border-white/10 bg-white/5 text-white/60",
  accent: "border-[var(--color-accent)]/40 bg-[var(--color-accent)]/10 text-[var(--color-accent)]",
};

// mismo motivo de partículas que el estallido dorado del ROISection, a
// menor escala: refuerza que "cerrar" es el momento que se celebra.
type Spark = { id: number; angle: number; distance: number; size: number; delay: number };

function CloseSparks({ trigger }: { trigger: boolean }) {
  const [sparks, setSparks] = useState<Spark[]>([]);

  useEffect(() => {
    if (!trigger) return;
    setSparks(
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        angle: (i / 14) * 360 + Math.random() * 20,
        distance: 32 + Math.random() * 38,
        size: 2 + Math.random() * 2,
        delay: Math.random() * 0.12,
      }))
    );
  }, [trigger]);

  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 h-0 w-0" aria-hidden>
      {sparks.map((s) => {
        const rad = (s.angle * Math.PI) / 180;
        const x = Math.cos(rad) * s.distance;
        const y = Math.sin(rad) * s.distance;
        return (
          <motion.span
            key={s.id}
            className="absolute rounded-full bg-[var(--color-accent)]"
            style={{ width: s.size, height: s.size, boxShadow: "0 0 6px var(--color-accent)" }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x, y, opacity: 0, scale: 0 }}
            transition={{ duration: 0.65, delay: s.delay, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
}

export default function SimulationSection() {
  const cardRef = useRef<HTMLDivElement>(null);
  const cardInView = useInView(cardRef, { once: true, amount: 0.5 });
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    if (!cardInView) return;
    const t = setTimeout(() => setClosed(true), 3400);
    return () => clearTimeout(t);
  }, [cardInView]);

  return (
    <section className="relative border-t border-[var(--color-border)] px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-start gap-10 md:flex-row md:items-center md:justify-between">
          <div>
            <Reveal>
              <span className="text-[13px] font-medium text-[var(--color-text-muted)]">
                Aprender ventas es solo el primer paso — el desarrollo real
                pasa cuando ejecutás y recibís feedback.
              </span>
            </Reveal>
            <Reveal delay={0.05} className="mt-4">
              <span className="text-[14px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-secondary)]">
                Así se entrena de verdad
              </span>
            </Reveal>
            <Reveal delay={0.08} className="mt-5">
              <h2 className="max-w-2xl text-[2.4rem] font-bold leading-[1.1] tracking-tight text-[var(--color-text-primary)] md:text-[3.3rem]">
                Practicás la llamada real, no la teoría.
              </h2>
            </Reveal>
            <Reveal delay={0.14} className="mt-4">
              <p className="max-w-xl text-[18px] leading-relaxed text-[var(--color-text-secondary)]">
                Hacés una llamada de venta con un coach que actúa como un
                cliente difícil de verdad. Te corrige ahí mismo, en el
                momento — no en un video que ves después.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.16} className="hidden shrink-0 md:block">
            <svg viewBox="0 0 220 130" className="h-auto w-[200px] overflow-visible opacity-70">
              <path
                d="M14 110 C 50 110, 56 78, 86 78 S 122 50, 150 50 S 186 24, 206 24"
                fill="none"
                stroke="var(--color-border-strong)"
                strokeWidth="2"
                strokeDasharray="1 8"
                strokeLinecap="round"
              />
              {[
                { x: 14, y: 110 },
                { x: 86, y: 78 },
                { x: 150, y: 50 },
              ].map((c) => (
                <circle key={c.x} cx={c.x} cy={c.y} r="4" fill="var(--color-bg-elevated)" stroke="var(--color-accent)" strokeWidth="2" />
              ))}
              <circle cx="206" cy="24" r="5.5" fill="var(--color-accent)" stroke="var(--color-accent)" strokeWidth="2" />
            </svg>
          </Reveal>
        </div>

        <Reveal delay={0.2} className="mt-16">
          <div
            ref={cardRef}
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0A0B0D] shadow-[0_30px_70px_-20px_rgba(0,0,0,0.55)]"
          >
            {/* resplandor de fondo, mismo lenguaje que el resto de tarjetas oscuras del sitio */}
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 h-[26rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 opacity-[0.08] blur-3xl"
              style={{ background: "radial-gradient(ellipse, var(--color-accent) 0%, transparent 70%)" }}
              aria-hidden
            />
            {/* barrido de escaneo */}
            <motion.div
              className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent"
              animate={{ left: ["-40%", "140%"] }}
              transition={{ duration: 4, repeat: Infinity, repeatDelay: 1.8, ease: "easeInOut" }}
              aria-hidden
            />

            {/* barra de título tipo app */}
            <div className="relative flex items-center justify-between border-b border-white/10 px-5 py-3">
              <div className="flex items-center gap-1.5">
                <Circle size={8} className="fill-red-500/60 text-red-500/60" />
                <Circle size={8} className="fill-amber-500/60 text-amber-500/60" />
                <Circle size={8} className="fill-emerald-500/60 text-emerald-500/60" />
              </div>
              <span className="flex items-center gap-2 text-[13px] uppercase tracking-widest text-white/40">
                <motion.span
                  className="h-1.5 w-1.5 rounded-full bg-red-500"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                />
                Simulación en vivo
              </span>
            </div>

            {/* tiles de video */}
            <div className="relative grid grid-cols-1 gap-px bg-white/[0.06] sm:grid-cols-2">
              <div className="relative flex aspect-[4/3] flex-col items-center justify-center bg-[#0A0B0D] p-8">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10">
                  <User size={26} strokeWidth={1.75} className="text-white/80" />
                </span>
                <p className="mt-3 text-[17px] font-semibold text-white">Vos</p>
                <span className="mt-1 flex items-center gap-1.5 text-[13px] text-white/40">
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
                      className="w-[3px] rounded-full bg-[var(--color-accent)]/80"
                      style={{ boxShadow: "0 0 5px color-mix(in srgb, var(--color-accent) 50%, transparent)" }}
                    />
                  ))}
                </div>
              </div>

              <div className="relative flex aspect-[4/3] flex-col items-center justify-center bg-[#0A0B0D] p-8">
                <motion.span
                  className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-accent)]/10 ring-1 ring-[var(--color-accent)]/30"
                  animate={closed ? { scale: [1, 1.12, 1] } : {}}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  {closed ? (
                    <CheckCircle2 size={26} strokeWidth={1.75} className="text-[var(--color-accent)]" />
                  ) : (
                    <Headset size={26} strokeWidth={1.75} className="text-[var(--color-accent)]" />
                  )}
                  <CloseSparks trigger={closed} />
                </motion.span>
                <p className="mt-3 text-[17px] font-semibold text-white">Coach</p>
                <span className="mt-1 text-[13px] text-white/40">
                  {closed ? "Cierre logrado" : "Evaluando en tiempo real"}
                </span>

                {/* tags de feedback flotantes */}
                <div className="mt-4 flex min-h-[30px] flex-wrap items-center justify-center gap-2">
                  {feedbackTags.map((t) => (
                    <motion.span
                      key={t.text}
                      initial={{ opacity: 0, y: 6 }}
                      animate={cardInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.4, delay: t.delay }}
                      className={`rounded-full border px-2.5 py-1 text-[12.5px] font-medium ${tagStyles[t.color]}`}
                    >
                      {t.text}
                    </motion.span>
                  ))}
                  <motion.span
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={closed ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center gap-1 rounded-full border border-[var(--color-accent)]/50 bg-[var(--color-accent)]/15 px-2.5 py-1 text-[12.5px] font-semibold text-[var(--color-accent)]"
                    style={{ boxShadow: "0 0 14px color-mix(in srgb, var(--color-accent) 35%, transparent)" }}
                  >
                    <CheckCircle2 size={12} strokeWidth={2.4} />
                    Cierre logrado
                  </motion.span>
                </div>
              </div>
            </div>

            <div className="relative flex items-center justify-center gap-2 border-t border-white/10 px-5 py-4 text-center">
              <span className="text-[15px] text-white/50">
                Después de cada llamada recibís feedback puntual:
              </span>
              <span className="text-[15px] font-medium text-white">
                qué funcionó y qué corregir.
              </span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="mt-8">
          <p className="max-w-lg text-[17px] leading-relaxed text-[var(--color-text-muted)]">
            Nada de teoría que se olvida. Practicás hasta que la técnica
            queda incorporada de verdad.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
