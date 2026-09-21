"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Mic, Video, PhoneOff, Captions, MoreVertical, CheckCircle2 } from "lucide-react";
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
    <section className="relative flex min-h-screen flex-col justify-center border-t border-[var(--color-border)] px-6 py-10 md:px-10 md:py-12">
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <Reveal>
              <span className="text-[13px] font-medium text-[var(--color-text-muted)]">
                Aprender ventas es solo el primer paso: el desarrollo real
                pasa cuando ejecutás y recibís feedback.
              </span>
            </Reveal>
            <Reveal delay={0.05} className="mt-3">
              <span className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-secondary)]">
                Así se entrena de verdad
              </span>
            </Reveal>
            <Reveal delay={0.08} className="mt-3">
              <h2 className="max-w-2xl text-[1.9rem] font-bold leading-[1.15] tracking-tight text-[var(--color-text-primary)] md:text-[2.5rem]">
                Practicás la llamada real, no la teoría.
              </h2>
            </Reveal>
            <Reveal delay={0.14} className="mt-3">
              <p className="max-w-xl text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
                Hacés una llamada de venta con un coach que actúa como un
                cliente difícil de verdad. Te corrige ahí mismo, en el
                momento, no en un video que ves después.
              </p>
            </Reveal>
          </div>
        </div>

        <Reveal delay={0.2} className="mt-8">
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

            {/* barra superior, estilo videollamada (sin chrome de ventana, no es una app nativa) */}
            <div className="relative flex items-center justify-between border-b border-white/10 px-5 py-3">
              <span className="text-[13px] font-medium text-white/50">14:02</span>
              <span className="flex items-center gap-2 text-[13px] uppercase tracking-widest text-white/40">
                <motion.span
                  className="h-1.5 w-1.5 rounded-full bg-red-500"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                />
                Simulación en vivo
              </span>
            </div>

            {/* tiles de video, estilo Meet: foto real + nombre superpuesto abajo a la izquierda */}
            <div className="relative grid grid-cols-1 gap-px bg-white/[0.06] sm:grid-cols-2">
              <div className="relative aspect-[4/3] overflow-hidden bg-[#0A0B0D]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/presentacion/simulacion-coach.jpg"
                  alt="Alumna en la simulación"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-md bg-black/40 px-2.5 py-1.5 backdrop-blur-sm">
                  <Mic size={13} strokeWidth={2} className="text-white/90" />
                  <span className="text-[13px] font-medium text-white">Alumna</span>
                </div>

                {/* onda de audio */}
                <div className="absolute bottom-3 right-3 flex h-6 items-end gap-[3px]">
                  {bars.slice(0, 14).map((h, i) => (
                    <motion.span
                      key={i}
                      animate={{ height: [`${h * 0.4}%`, `${h}%`, `${h * 0.4}%`] }}
                      transition={{
                        duration: 1.1,
                        repeat: Infinity,
                        delay: i * 0.05,
                        ease: "easeInOut",
                      }}
                      className="w-[3px] rounded-full bg-[var(--color-accent)]"
                      style={{ boxShadow: "0 0 5px color-mix(in srgb, var(--color-accent) 50%, transparent)" }}
                    />
                  ))}
                </div>
              </div>

              <div className="relative aspect-[4/3] overflow-hidden bg-[#0A0B0D]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/presentacion/simulacion-alumno.jpg"
                  alt="Coach en la simulación"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-md bg-black/40 px-2.5 py-1.5 backdrop-blur-sm">
                  <Mic size={13} strokeWidth={2} className="text-white/90" />
                  <span className="text-[13px] font-medium text-white">Coach</span>
                </div>

                <motion.div
                  className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/45 px-2.5 py-1 backdrop-blur-sm"
                  animate={closed ? { scale: [1, 1.08, 1] } : {}}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  {closed && <CheckCircle2 size={13} strokeWidth={2} className="text-[var(--color-accent)]" />}
                  <span className="text-[12px] font-medium text-white/90">
                    {closed ? "Cierre logrado" : "Evaluando en tiempo real"}
                  </span>
                  <CloseSparks trigger={closed} />
                </motion.div>

                {/* tags de feedback flotantes */}
                <div className="absolute inset-x-3 bottom-3 flex min-h-[26px] flex-wrap items-center gap-1.5">
                  {feedbackTags.map((t) => (
                    <motion.span
                      key={t.text}
                      initial={{ opacity: 0, y: 6 }}
                      animate={cardInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.4, delay: t.delay }}
                      className={`rounded-full border px-2 py-1 text-[11px] font-medium backdrop-blur-sm ${tagStyles[t.color]}`}
                    >
                      {t.text}
                    </motion.span>
                  ))}
                  <motion.span
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={closed ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center gap-1 rounded-full border border-[var(--color-accent)]/50 bg-[var(--color-accent)]/20 px-2 py-1 text-[11px] font-semibold text-[var(--color-accent)] backdrop-blur-sm"
                    style={{ boxShadow: "0 0 14px color-mix(in srgb, var(--color-accent) 35%, transparent)" }}
                  >
                    <CheckCircle2 size={11} strokeWidth={2.4} />
                    Cierre logrado
                  </motion.span>
                </div>
              </div>
            </div>

            {/* barra de controles, estilo Meet */}
            <div className="relative flex items-center justify-center gap-3 border-t border-white/10 bg-[#0A0B0D] px-5 py-3.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                <Mic size={16} strokeWidth={2} className="text-white" />
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                <Video size={16} strokeWidth={2} className="text-white" />
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                <Captions size={16} strokeWidth={2} className="text-white" />
              </span>
              <span className="flex h-9 items-center gap-2 rounded-full bg-red-500 px-4">
                <PhoneOff size={15} strokeWidth={2} className="text-white" />
                <span className="text-[13px] font-medium text-white">Salir</span>
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                <MoreVertical size={16} strokeWidth={2} className="text-white" />
              </span>
            </div>

            <div className="relative flex items-center justify-center gap-2 border-t border-white/10 px-5 py-3.5 text-center">
              <span className="text-[14px] text-white/50">
                Después de cada llamada recibís feedback puntual:
              </span>
              <span className="text-[14px] font-medium text-white">
                qué funcionó y qué corregir.
              </span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="mt-4">
          <p className="max-w-lg text-[14px] leading-relaxed text-[var(--color-text-muted)]">
            Nada de teoría que se olvida. Practicás hasta que la técnica
            queda incorporada de verdad.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
