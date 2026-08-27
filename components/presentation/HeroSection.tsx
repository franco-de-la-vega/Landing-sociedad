"use client";

import { motion } from "framer-motion";
import { Activity, TrendingUp } from "lucide-react";
import Reveal from "@/components/Reveal";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[85vh] items-center overflow-hidden px-6 py-20 md:px-10">
      {/* resplandor de fondo */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[42rem] w-[64rem] -translate-x-1/2 opacity-[0.07] blur-3xl"
        style={{ background: "radial-gradient(ellipse, var(--color-accent) 0%, transparent 70%)" }}
        aria-hidden
      />

      {/* malla de fondo, marca de agua integrada a toda la sección */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.14]"
        style={{
          maskImage: "linear-gradient(to bottom, black 55%, transparent 96%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 55%, transparent 96%)",
        }}
      >
        <defs>
          <pattern id="heroMesh" width="56" height="56" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="2" fill="var(--color-accent)" />
            <path d="M0,28 H56 M28,0 V56" stroke="var(--color-accent)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#heroMesh)" />
      </svg>

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-10">
        <div>
          <Reveal>
            <span className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-secondary)]">
              Instituto Latinoamericano de Formación Comercial
            </span>
          </Reveal>
          <Reveal delay={0.08} className="mt-5">
            <h1 className="text-[2.6rem] font-bold leading-[1.08] tracking-tight text-[var(--color-text-primary)] md:text-[3.4rem]">
              Convertí tu habilidad para vender en una profesión.
            </h1>
          </Reveal>
          <Reveal delay={0.16} className="mt-6">
            <p className="max-w-lg text-[18px] leading-relaxed text-[var(--color-text-secondary)]">
              Entrená ventas remotas con práctica real, evaluación de
              desempeño, evidencia profesional e inteligencia aplicada a tu
              evolución comercial.
            </p>
          </Reveal>
          <Reveal delay={0.22} className="mt-8">
            <p className="text-[13px] font-semibold uppercase tracking-[0.1em] text-[var(--color-accent)]">
              Formación práctica · Performance · IA + Data · Empleabilidad
            </p>
          </Reveal>
        </div>

        {/* panel de evaluación de simulación comercial */}
        <Reveal delay={0.2}>
          <div className="relative mx-auto max-w-xl rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-8 shadow-[0_20px_40px_rgba(0,0,0,0.06)]">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-5">
              <span className="flex items-center gap-2 text-[15px] font-semibold text-[var(--color-text-secondary)]">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
                </span>
                Simulación de llamada B2B en vivo
              </span>
            </div>
            <span className="mt-2.5 block text-[13px] uppercase tracking-widest text-[var(--color-text-muted)]">
              Módulo de IA & evaluación en tiempo real
            </span>

            <div className="mt-6 flex items-end gap-[5px]">
              {[14, 26, 40, 60, 44, 30, 52, 70, 38, 22, 46, 58, 32, 20].map((h, i) => (
                <motion.span
                  key={i}
                  animate={{ height: [`${h * 0.4}%`, `${h}%`, `${h * 0.4}%`] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.06, ease: "easeInOut" }}
                  className="w-[5px] rounded-full bg-[var(--color-accent)]/60"
                  style={{ height: `${h * 0.4}%` }}
                />
              ))}
            </div>
            <p className="mt-2.5 text-[13px] italic text-[var(--color-text-muted)]">
              Analizando estructura de diagnóstico y manejo de objeciones...
            </p>

            <div className="mt-7 grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-base)] p-5">
                <span className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
                  <Activity size={14} strokeWidth={2} />
                  Efectividad de discovery
                </span>
                <p className="mt-1.5 text-[26px] font-bold text-[var(--color-text-primary)]">84%</p>
                <p className="mt-1 text-[12.5px] leading-snug text-[var(--color-text-muted)]">
                  Capacidad de detección de dolor comercial
                </p>
              </div>
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-base)] p-5">
                <span className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
                  <TrendingUp size={14} strokeWidth={2} />
                  Evolución en cierre
                </span>
                <p className="mt-1.5 text-[26px] font-bold text-[var(--color-accent)]">+18%</p>
                <p className="mt-1 text-[12.5px] leading-snug text-[var(--color-text-muted)]">
                  Incremento de conversión vs. cohorte base
                </p>
              </div>
            </div>
            <p className="mt-4 text-center text-[12.5px] uppercase tracking-widest text-[var(--color-text-muted)]/70">
              Métricas ilustrativas del sistema de performance
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
