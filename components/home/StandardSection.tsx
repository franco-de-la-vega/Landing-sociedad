"use client";

import { motion } from "framer-motion";
import Reveal from "../Reveal";
import RevealGroup from "../RevealGroup";
import RevealItem from "../RevealItem";

const card =
  "group relative h-full overflow-hidden rounded-[var(--radius-panel)] border border-black/10 bg-[var(--color-bg-elevated)] p-7 transition-shadow duration-500 hover:shadow-[0_30px_60px_-28px_rgba(28,26,22,0.25)]";

function Label({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
      <span className="text-[var(--color-accent)]">{n}</span>
      {children}
    </div>
  );
}

// Onda de audio de una clase en vivo
function LiveWave() {
  return (
    <div className="flex h-20 items-center gap-[3px]" aria-hidden>
      {Array.from({ length: 38 }).map((_, i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-full bg-[var(--color-text-primary)]"
          animate={{ height: ["18%", `${30 + ((i * 37) % 70)}%`, "18%"] }}
          transition={{ duration: 1.1 + (i % 5) * 0.18, repeat: Infinity, ease: "easeInOut", delay: (i % 7) * 0.08 }}
        />
      ))}
    </div>
  );
}

// Anillo de progreso de la ruta
function ProgressRing() {
  const r = 46;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 120 120" className="h-28 w-28" aria-hidden>
      <circle cx="60" cy="60" r={r} fill="none" stroke="currentColor" strokeWidth="6" className="text-black/[0.07]" />
      <motion.circle
        cx="60"
        cy="60"
        r={r}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        whileInView={{ strokeDashoffset: c * 0.28 }}
        viewport={{ once: true }}
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
        transform="rotate(-90 60 60)"
      />
      <text x="60" y="66" textAnchor="middle" className="fill-[var(--color-text-primary)] text-[22px] font-bold">
        14
      </text>
    </svg>
  );
}

// Pipeline del CRM, etapas avanzando
function Pipeline() {
  const stages = ["Contacto", "Reunión", "Propuesta", "Cierre"];
  return (
    <div className="flex flex-col gap-2.5" aria-hidden>
      {stages.map((s, i) => (
        <div key={s} className="flex items-center gap-3">
          <span className="w-20 text-[11px] text-[var(--color-text-muted)]">{s}</span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-black/[0.06]">
            <motion.div
              className="h-full rounded-full bg-[var(--color-text-primary)]"
              initial={{ width: 0 }}
              whileInView={{ width: `${92 - i * 20}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, delay: 0.2 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// Sello de certificación
function Seal() {
  return (
    <motion.svg
      viewBox="0 0 100 100"
      className="h-24 w-24 text-[var(--color-accent)]"
      animate={{ rotate: 360 }}
      transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      aria-hidden
    >
      <defs>
        <path id="sealPath" d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0" />
      </defs>
      <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="50" cy="50" r="24" fill="currentColor" opacity="0.12" />
      <text className="fill-current text-[8.5px] font-semibold uppercase tracking-[0.2em]">
        <textPath href="#sealPath">Certificación · Portafolio · Evidencia ·</textPath>
      </text>
      <path d="M41 50l6 6 12-13" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </motion.svg>
  );
}

export default function StandardSection() {
  return (
    <section id="metodo" className="relative z-10 border-t border-black/10 bg-[var(--color-bg-base)] px-6 py-28 md:px-12 md:py-36">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <span className="text-xs uppercase tracking-widest text-[var(--color-text-muted)]">El instituto</span>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-6 text-4xl font-bold leading-[1.02] tracking-[-0.04em] text-[var(--color-text-primary)] sm:text-6xl">
                Un instituto que promueve el{" "}
                <span className="font-serif-display font-normal italic text-[var(--color-accent-hover)]">trabajo remoto.</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.14} className="lg:col-span-5">
            <p className="max-w-md text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-lg">
              No es un curso. Es una profesionalización real en negociación y desarrollo comercial, con el nivel de
              exigencia de las mejores instituciones de Estados Unidos.
            </p>
          </Reveal>
        </div>

        <RevealGroup stagger={0.08} className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-6">
          <RevealItem className="md:col-span-4">
            <div className={`${card} bg-[var(--color-text-primary)] text-white`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50">
                  <span className="text-[var(--color-accent)]">01</span>
                  Clases en vivo
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                  Live
                </span>
              </div>
              <div className="mt-10 grid grid-cols-1 items-end gap-8 sm:grid-cols-2">
                <div>
                  <div className="text-6xl font-black tracking-tight sm:text-7xl">2x</div>
                  <p className="mt-2 text-[15px] leading-relaxed text-white/60">
                    Clases en vivo por semana, con formadores activos en el mercado. Nada de videos grabados hace años.
                  </p>
                </div>
                <div className="[&_span]:bg-white">
                  <LiveWave />
                </div>
              </div>
            </div>
          </RevealItem>

          <RevealItem className="md:col-span-2">
            <div className={card}>
              <Label n="02">La ruta</Label>
              <div className="mt-6 flex justify-center">
                <ProgressRing />
              </div>
              <p className="mt-4 text-center text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
                <b className="text-[var(--color-text-primary)]">14 sprints en 5 meses.</b> Cada uno se desbloquea al
                completar el anterior.
              </p>
            </div>
          </RevealItem>

          <RevealItem className="md:col-span-2">
            <div className={card}>
              <Label n="03">Herramientas reales</Label>
              <div className="mt-8">
                <Pipeline />
              </div>
              <p className="mt-6 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
                Practicás con el mismo CRM que usa un equipo comercial de verdad.
              </p>
            </div>
          </RevealItem>

          <RevealItem className="md:col-span-2">
            <div className={card}>
              <Label n="04">Formadores</Label>
              <div className="mt-8 text-6xl font-black tracking-tight text-[var(--color-text-primary)]">+10</div>
              <p className="mt-1 text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--color-accent)]">
                años liderando equipos
              </p>
              <p className="mt-5 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
                Te enseña gente que hace esto todos los días, no tutores leyendo un guion.
              </p>
            </div>
          </RevealItem>

          <RevealItem className="md:col-span-2">
            <div className={card}>
              <Label n="05">Certificación</Label>
              <div className="mt-6 flex justify-center">
                <Seal />
              </div>
              <p className="mt-5 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
                Cada etapa cierra con un proyecto. Terminás con un portafolio que demuestra lo que sabés hacer.
              </p>
            </div>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
}
