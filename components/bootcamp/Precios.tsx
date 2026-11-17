"use client";

import { Check } from "lucide-react";
import Reveal from "@/components/Reveal";
import RevealGroup from "@/components/RevealGroup";
import RevealItem from "@/components/RevealItem";
import { PLANES, type Plan } from "@/lib/bootcamp";

const eyebrow = "inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--bc-gold-ink)] before:h-px before:w-7 before:bg-current";
const serif = "font-serif-display font-normal italic text-[var(--bc-gold-ink)]";

function Tarjeta({ p }: { p: Plan }) {
  return (
    <article
      className={`group relative flex h-full flex-col rounded-[28px] border p-6 transition-all duration-500 hover:-translate-y-1 sm:p-8 ${
        p.destacado
          ? "border-[var(--bc-gold)] bg-[var(--bc-card)] shadow-[0_0_0_1px_rgba(184,147,90,0.3),0_40px_90px_-30px_rgba(168,129,63,0.45)]"
          : "border-[var(--bc-ink)]/10 bg-[var(--bc-card)] shadow-[0_20px_50px_-30px_rgba(60,40,10,0.3)]"
      }`}
    >
      {p.destacado && (
        <span aria-hidden className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[var(--bc-gold)] to-transparent" />
      )}
      {p.destacado && (
        <span className="absolute -top-3.5 left-7 rounded-full bg-[var(--bc-gold)] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--bc-black)] sm:left-9">
          El más elegido
        </span>
      )}
      <span className={eyebrow}>{p.etapa}</span>
      <h3 className="mt-3 text-xl font-bold tracking-[-0.02em] sm:text-2xl">{p.nombre}</h3>
      <p className="mt-2 text-[14px] leading-relaxed text-[var(--bc-ink)]/70">{p.frase}</p>

      <span className="mt-6 inline-block self-start rounded-full border border-[var(--bc-ink)]/20 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--bc-ink)]/80">
        {p.duracion}
      </span>

      <div className="mt-5 flex items-baseline gap-2">
        <small className="text-base font-bold text-[var(--bc-gold-ink)]">US$</small>
        <b className={`text-5xl font-bold leading-none tracking-[-0.04em] tabular-nums sm:text-6xl `}>{p.precio}</b>
      </div>
      <p className="mt-2 text-[15px] text-[var(--bc-ink)]/70">Pago único</p>

      <div className="mt-6 flex items-center gap-4 rounded-2xl border-l-2 border-[var(--bc-gold)] bg-[var(--bc-ink)]/[0.05] px-5 py-4">
        <b className="text-3xl font-bold leading-none text-[var(--bc-gold-ink)] sm:text-4xl">{p.clases}</b>
        <div>
          <strong className="block text-[15px]">clases en vivo</strong>
          <em className="text-[13px] not-italic text-[var(--bc-ink)]/70">2 clases en vivo por semana</em>
        </div>
      </div>

      <ul className="mt-7 space-y-4 border-t border-[var(--bc-ink)]/10 pt-7">
        {p.incluye.map((t) => (
          <li key={t} className="flex gap-3 text-[14px] leading-snug text-[var(--bc-ink)]/80">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--bc-gold)]/20"><Check size={12} strokeWidth={3} className="text-[var(--bc-gold-ink)]" /></span>
            {t}
          </li>
        ))}
      </ul>
    </article>
  );
}

export default function Precios() {
  return (
    <section id="precios" className="relative scroll-mt-6 px-5 py-20 sm:px-8 sm:py-32">
      <div aria-hidden className="absolute inset-x-0 top-0 mx-auto h-px max-w-6xl bg-gradient-to-r from-transparent via-[var(--bc-gold)]/40 to-transparent" />
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[48rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--bc-gold)]/10 blur-[140px]" />
      <div className="relative mx-auto max-w-4xl">
        <div className="text-center">
          <Reveal>
            <span className={eyebrow}>Valores</span>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-4 text-3xl font-bold tracking-[-0.03em] sm:text-5xl">
              Dos etapas. Una <span className={serif}>carrera comercial.</span>
            </h2>
          </Reveal>
        </div>
        <RevealGroup stagger={0.12} className="mt-12 grid items-stretch gap-6 sm:mt-16 md:grid-cols-2">
          {PLANES.map((p) => (
            <RevealItem key={p.id} className={p.destacado ? "md:-mt-6" : "h-full"}>
              <Tarjeta p={p} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
