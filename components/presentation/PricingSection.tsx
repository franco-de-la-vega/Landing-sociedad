"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Users, Star, ChevronDown } from "lucide-react";
import Reveal from "@/components/Reveal";
import RevealGroup from "@/components/RevealGroup";
import RevealItem from "@/components/RevealItem";
import CountUp from "./CountUp";

const SEATS_TOTAL = 25;
const SEATS_TAKEN = 13;

const plans = [
  {
    name: "Comercial Junior",
    kicker: "Entra a la profesión",
    tag: "Tu puerta de entrada a las ventas remotas.",
    message: "Aprendé a hacerlo y demostrá que podés hacerlo.",
    duration: "2 meses",
    price: "$397",
    priceValue: 397,
    originalPrice: null,
    installments: null,
    savings: null,
    discount: null,
    tier: "base",
    highlights: [
      "Sesiones grupales, 2 por semana",
      "4 sesiones 1 a 1 por mes",
      "Acceso a la plataforma completa",
      "Preparación de perfil de LinkedIn",
      "Creación y armado de CV profesional",
    ],
    features: [
      { text: "Sesiones grupales, 2 por semana", included: true },
      { text: "4 sesiones 1 a 1 por mes", included: true },
      { text: "Acceso a la plataforma completa", included: true },
      { text: "Acceso a la bolsa de trabajo independiente", included: true },
      { text: "Conexión con empresas — sujeta a aprobar el examen de nivel", included: "conditional" },
      { text: "Certificación oficial con historial de desempeño", included: false },
      { text: "Especializaciones comerciales (High-Ticket, Software B2B, etc.)", included: false },
      { text: "Tutor dedicado exclusivo", included: false },
      { text: "Preparación de perfil de LinkedIn", included: true },
      { text: "Creación y armado de CV profesional", included: true },
    ],
    showSeats: true,
  },
  {
    name: "Comercial High Ticket",
    kicker: "Especializate",
    tag: "Sube la complejidad. Sube tu nivel.",
    message: "Aprendé a adaptar y ejecutar la estructura comercial frente a escenarios más complejos.",
    duration: "3 meses",
    price: "$497",
    priceValue: 497,
    originalPrice: null,
    installments: null,
    savings: null,
    discount: null,
    tier: "mid",
    highlights: [
      "Todo lo incluido en Comercial Junior",
      "Certificación oficial con historial de desempeño",
      "Conexión directa con empresas",
      "6 Mentorías 1 a 1 en vivo con especialistas del equipo",
    ],
    features: [
      { text: "Todo lo incluido en Comercial Junior", included: true },
      { text: "Certificación oficial con historial de desempeño", included: true },
      { text: "Conexión directa con empresas", included: true },
      { text: "6 Mentorías 1 a 1 en vivo con especialistas del equipo", included: true },
      { text: "Evaluación de especialización comercial (Software B2B, Evergreen, Launching)", included: false },
      { text: "Tutor dedicado exclusivo", included: false },
    ],
    showSeats: false,
  },
  {
    name: "Carrera Completa",
    kicker: "Profesionalizate",
    tag: "De aprender a vender a construir una carrera comercial.",
    message: "Aprendé, demostrá, medí tu desempeño y preparate para competir profesionalmente.",
    duration: "9 meses",
    price: "$1,429",
    priceValue: 1429,
    originalPrice: "$1,786",
    installments: "o 3 cuotas de $476 USD",
    savings: "Ahorrás $357 USD",
    discount: "-20% OFF",
    tier: "vip",
    highlights: [
      "Acceso completo a la plataforma de formación",
      "10 Mentorías 1 a 1 en vivo con especialistas del equipo",
      "Certificación oficial con historial de desempeño operativo",
      "Conexión directa con empresas y bolsa de vinculación comercial",
      "Evaluación de especialización comercial (High-Ticket, Software B2B, etc.)",
    ],
    features: [
      { text: "Acceso completo a la plataforma de formación", included: true },
      { text: "Prácticas operativas y ejercicios de role-play entre pares", included: true },
      { text: "Sesiones grupales de feedback", included: true },
      { text: "10 Mentorías 1 a 1 en vivo con especialistas del equipo", included: true },
      { text: "Certificación oficial con historial de desempeño operativo", included: true },
      { text: "Conexión directa con empresas y bolsa de vinculación comercial", included: true },
      { text: "Evaluación de especialización comercial (High-Ticket, Software B2B, Evergreen, Launching)", included: true },
      { text: "Tutor dedicado exclusivo durante todo el proceso", included: true },
    ],
    showSeats: false,
  },
];

const tierStyles: Record<string, { card: string; badge: string; price: string }> = {
  base: {
    card: "border-[var(--color-border)] bg-[var(--color-bg-elevated)]",
    badge: "",
    price: "text-[var(--color-text-primary)]",
  },
  mid: {
    card: "border-[var(--color-border)] bg-[var(--color-bg-elevated-2)]",
    badge: "",
    price: "text-[var(--color-text-primary)]",
  },
  vip: {
    card: "border-[var(--color-accent)]/50 bg-[var(--color-accent-muted)] shadow-[0_24px_50px_-24px_rgba(20,18,14,0.2)] md:-translate-y-4",
    badge: "bg-[var(--color-accent)] text-[#0B0C0E]",
    price: "text-[var(--color-accent)]",
  },
};

function SeatsAvailability() {
  const [status, setStatus] = useState<"idle" | "loading" | "revealed">("idle");
  const seatsLeft = SEATS_TOTAL - SEATS_TAKEN;

  function handleClick() {
    setStatus("loading");
    setTimeout(() => setStatus("revealed"), 3000);
  }

  return (
    <div className="mt-5">
      {status === "idle" && (
        <button
          onClick={handleClick}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-[var(--color-border)] py-3 text-[14px] font-semibold uppercase tracking-widest text-[var(--color-text-secondary)] transition-colors hover:border-black/25"
        >
          <Users size={14} strokeWidth={2} />
          Actualizar disponibilidad
        </button>
      )}

      {status === "loading" && (
        <div className="flex items-center justify-center gap-2 rounded-full border border-[var(--color-border)] py-3 text-[13.5px] font-semibold text-[var(--color-text-muted)]">
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            className="h-3.5 w-3.5 rounded-full border-2 border-[var(--color-text-muted)]/30 border-t-[var(--color-accent)]"
          />
          Consultando cupos...
        </div>
      )}

      {status === "revealed" && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 rounded-full border border-[var(--color-accent)]/25 bg-[var(--color-accent)]/[0.06] py-3 text-[13.5px] font-semibold text-[var(--color-accent)]"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
          {SEATS_TAKEN}/{SEATS_TOTAL} cupos ocupados · quedan {seatsLeft}
        </motion.div>
      )}
    </div>
  );
}

function PlanCard({ p }: { p: (typeof plans)[number] }) {
  const [expanded, setExpanded] = useState(false);
  const s = tierStyles[p.tier];
  const baseText = (t: string) => t.split(" (")[0].trim();
  const highlightBases = p.highlights.map(baseText);
  const extraFeatures = p.features.filter((f) => !highlightBases.includes(baseText(f.text)));

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`relative flex h-full flex-col rounded-2xl border p-10 md:p-11 ${s.card}`}
    >
      {p.tier === "vip" && (
        <span
          className={`absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-4 py-1.5 text-center text-[12px] font-semibold uppercase tracking-wide ${s.badge}`}
        >
          Ruta profesional completa
        </span>
      )}

      <span className="text-[12px] font-semibold uppercase tracking-widest text-[var(--color-accent)]">
        {p.kicker}
      </span>
      <h3 className="mt-1.5 text-[19px] font-bold text-[var(--color-text-primary)]">
        {p.name}
      </h3>
      <p className="mt-1 text-[14px] leading-snug text-[var(--color-text-muted)]">{p.tag}</p>
      {p.duration && (
        <span className="mt-3 block text-[15px] font-medium text-[var(--color-text-muted)]">
          {p.duration}
        </span>
      )}

      {p.originalPrice && (
        <div className="mt-4 flex items-center gap-2.5">
          <span className="text-[20px] font-bold text-[var(--color-text-muted)] line-through decoration-red-500/70 decoration-2">
            {p.originalPrice} USD
          </span>
          {p.discount && (
            <span className="rounded-full bg-red-500/15 px-2.5 py-1 text-[13px] font-bold uppercase tracking-wide text-red-400">
              {p.discount}
            </span>
          )}
        </div>
      )}
      <p className={`text-[3.1rem] font-black leading-none tracking-tight ${s.price} ${p.originalPrice ? "mt-1.5" : "mt-4"}`}>
        <CountUp value={p.priceValue} prefix="$" />
        <span className="ml-2 text-[17px] font-medium text-[var(--color-text-muted)]">
          USD
        </span>
      </p>
      {p.savings && (
        <span className="mt-2 block text-[15px] font-semibold text-emerald-400">
          {p.savings}
        </span>
      )}
      {p.installments && (
        <span className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/[0.1] px-3.5 py-2 text-[17px] font-bold text-[var(--color-accent)]">
          {p.installments}
        </span>
      )}

      <ul className="mt-8 flex flex-col gap-3.5">
        {p.highlights.map((h) => (
          <li key={h} className="flex items-start gap-2.5">
            <Check size={15} strokeWidth={2.5} className="mt-0.5 shrink-0 text-[var(--color-accent)]" />
            <span className="text-[17px] font-medium leading-relaxed text-[var(--color-text-primary)]">
              {h}
            </span>
          </li>
        ))}
      </ul>

      <button
        onClick={() => setExpanded((e) => !e)}
        className="mt-6 flex items-center justify-center gap-2 rounded-full border border-[var(--color-border)] py-3 text-[13px] font-semibold uppercase tracking-widest text-[var(--color-text-secondary)] transition-colors hover:border-black/25"
      >
        {expanded ? "Ocultar detalle" : "Ver este nivel"}
        <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronDown size={14} strokeWidth={2.5} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <ul className="mt-5 flex flex-col gap-3 border-t border-[var(--color-border)] pt-5">
              {extraFeatures.map((f) => (
                <li key={f.text} className="flex items-start gap-2.5">
                  {f.included === true ? (
                    <Check size={14} strokeWidth={2.5} className="mt-0.5 shrink-0 text-[var(--color-accent)]" />
                  ) : f.included === "conditional" ? (
                    <Star size={14} strokeWidth={2.5} className="mt-0.5 shrink-0 text-[var(--color-accent-secondary)]" />
                  ) : (
                    <X size={14} strokeWidth={2.5} className="mt-0.5 shrink-0 text-red-500" />
                  )}
                  <span
                    className={`text-[15px] font-medium leading-relaxed ${
                      f.included === true
                        ? "text-[var(--color-text-primary)]"
                        : f.included === "conditional"
                        ? "text-[var(--color-accent-secondary)]"
                        : "text-[var(--color-text-muted)]"
                    }`}
                  >
                    {f.text}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-6 flex-1 border-t border-[var(--color-border)] pt-5 text-[15px] italic leading-relaxed text-[var(--color-text-secondary)]">
        {p.message}
      </p>

      {p.showSeats && (
        <>
          <div className="mt-6 flex flex-col items-center justify-center gap-2 rounded-2xl border border-[var(--color-border)] bg-black/[0.04] px-6 py-6 text-center">
            <Users size={16} strokeWidth={2} className="text-[var(--color-text-secondary)]" />
            <p className="text-[13px] font-bold uppercase tracking-wide text-[var(--color-text-primary)]">
              Cupos máximo: {SEATS_TOTAL} personas
            </p>
          </div>
          <SeatsAvailability />
        </>
      )}
    </motion.div>
  );
}

export default function PricingSection() {
  return (
    <section className="relative border-t border-[var(--color-border)] px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <span className="text-[14px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-secondary)]">
            Tu programa
          </span>
        </Reveal>
        <Reveal delay={0.08} className="mt-5">
          <h2 className="max-w-2xl text-[2.2rem] font-bold leading-[1.1] tracking-tight text-[var(--color-text-primary)] md:text-[2.8rem]">
            Elegí el nivel de formación que se ajusta a vos.
          </h2>
        </Reveal>

        <RevealGroup
          stagger={0.12}
          className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3 md:items-center"
        >
          {plans.map((p) => (
            <RevealItem key={p.name}>
              <PlanCard p={p} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
