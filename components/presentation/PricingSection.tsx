"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Users, Star } from "lucide-react";
import Reveal from "@/components/Reveal";
import RevealGroup from "@/components/RevealGroup";
import RevealItem from "@/components/RevealItem";

const SEATS_TOTAL = 25;
const SEATS_TAKEN = 13;

const plans = [
  {
    name: "Junior",
    duration: "2 meses",
    price: "$397",
    originalPrice: null,
    installments: null,
    savings: null,
    discount: null,
    tier: "base",
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
    cta: "Reservar cupo",
    showSeats: true,
  },
  {
    name: "Junior High Ticket",
    duration: "3 meses",
    price: "$497",
    originalPrice: null,
    installments: null,
    savings: null,
    discount: null,
    tier: "mid",
    features: [
      { text: "Todo lo incluido en Junior", included: true },
      { text: "Certificación oficial con historial de desempeño", included: true },
      { text: "Conexión directa con empresas", included: true },
      { text: "6 Mentorías 1 a 1 en vivo con especialistas del equipo", included: true },
      { text: "Especializaciones comerciales (High-Ticket, Software B2B, etc.)", included: false },
      { text: "Tutor dedicado exclusivo", included: false },
    ],
    cta: "Reservar cupo",
    showSeats: false,
  },
  {
    name: "Carrera Completa",
    duration: "9 meses",
    price: "$1,429",
    originalPrice: "$1,786",
    installments: "o 3 cuotas de $476 USD",
    savings: "Ahorrás $357 USD",
    discount: "-20% OFF",
    tier: "vip",
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
    cta: "Aprendé todo · Solicitar admisión",
    showSeats: false,
  },
];

const tierStyles: Record<string, { card: string; badge: string; price: string; cta: string }> = {
  base: {
    card: "border-white/10 bg-[#121418]",
    badge: "",
    price: "text-white",
    cta: "border border-white/15 text-zinc-200 hover:border-white/30",
  },
  mid: {
    card: "border-white/15 bg-[#141820]",
    badge: "",
    price: "text-white",
    cta: "border border-white/20 text-zinc-100 hover:border-white/40",
  },
  vip: {
    card: "border-accent/50 bg-[#161215] shadow-[0_0_60px_-14px_rgba(184,147,90,0.4)] md:-translate-y-4",
    badge: "bg-accent text-[#0B0C0E]",
    price: "text-accent",
    cta: "bg-accent text-[#0B0C0E] hover:bg-accent-hover",
  },
};

function SeatsAvailability() {
  const [revealed, setRevealed] = useState(false);
  const seatsLeft = SEATS_TOTAL - SEATS_TAKEN;

  return (
    <div className="mt-5">
      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-white/15 py-3 text-[12px] font-semibold uppercase tracking-widest text-zinc-300 transition-colors hover:border-white/30"
        >
          <Users size={14} strokeWidth={2} />
          Actualizar disponibilidad
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 rounded-full border border-accent/25 bg-accent/[0.06] py-3 text-[12.5px] font-semibold text-accent"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          {SEATS_TAKEN}/{SEATS_TOTAL} cupos ocupados · quedan {seatsLeft}
        </motion.div>
      )}
    </div>
  );
}

export default function PricingSection() {
  return (
    <section className="relative border-t border-white/10 px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <span className="text-[13px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
            Planes e inversión
          </span>
        </Reveal>
        <Reveal delay={0.08} className="mt-5">
          <h2 className="max-w-2xl text-[2.3rem] font-bold leading-[1.1] tracking-tight text-white md:text-[3.2rem]">
            Elige tu Plan de Formación
          </h2>
        </Reveal>
        <Reveal delay={0.14} className="mt-4">
          <p className="max-w-xl text-[16px] leading-relaxed text-zinc-400">
            Tres niveles de aceleración: de la base a la carrera comercial
            completa.
          </p>
        </Reveal>

        <RevealGroup
          stagger={0.12}
          className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3 md:items-center"
        >
          {plans.map((p) => {
            const s = tierStyles[p.tier];
            return (
              <RevealItem key={p.name}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className={`relative flex h-full flex-col rounded-2xl border p-8 md:p-9 ${s.card}`}
                >
                  {p.tier === "vip" && (
                    <span
                      className={`absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wide ${s.badge}`}
                    >
                      Aprendé todo
                    </span>
                  )}

                  <h3 className="text-[19px] font-bold text-white">
                    {p.name}
                  </h3>
                  {p.duration && (
                    <span className="mt-1 text-[13px] font-medium text-zinc-500">
                      {p.duration}
                    </span>
                  )}

                  {p.originalPrice && (
                    <div className="mt-4 flex items-center gap-2.5">
                      <span className="text-[20px] font-bold text-zinc-500 line-through decoration-red-500/70 decoration-2">
                        {p.originalPrice} USD
                      </span>
                      {p.discount && (
                        <span className="rounded-full bg-red-500/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-red-400">
                          {p.discount}
                        </span>
                      )}
                    </div>
                  )}
                  <p className={`text-[3.1rem] font-black leading-none tracking-tight ${s.price} ${p.originalPrice ? "mt-1.5" : "mt-4"}`}>
                    {p.price}
                    <span className="ml-2 text-[14px] font-medium text-zinc-500">
                      USD
                    </span>
                  </p>
                  {p.savings && (
                    <span className="mt-2 block text-[13px] font-semibold text-emerald-400">
                      {p.savings}
                    </span>
                  )}
                  {p.installments && (
                    <span className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full border border-accent/40 bg-accent/[0.1] px-3.5 py-2 text-[13.5px] font-bold text-accent">
                      {p.installments}
                    </span>
                  )}

                  <ul className="mt-8 flex flex-1 flex-col gap-3.5">
                    {p.features.map((f) => (
                      <li key={f.text} className="flex items-start gap-2.5">
                        {f.included === true ? (
                          <Check
                            size={15}
                            strokeWidth={2.5}
                            className="mt-0.5 shrink-0 text-accent"
                          />
                        ) : f.included === "conditional" ? (
                          <Star
                            size={15}
                            strokeWidth={2.5}
                            className="mt-0.5 shrink-0 text-amber-400"
                          />
                        ) : (
                          <X
                            size={15}
                            strokeWidth={2.5}
                            className="mt-0.5 shrink-0 text-red-500"
                          />
                        )}
                        <span
                          className={`text-[14px] font-medium leading-relaxed ${
                            f.included === true
                              ? "text-zinc-200"
                              : f.included === "conditional"
                              ? "text-amber-200/90"
                              : "text-zinc-500"
                          }`}
                        >
                          {f.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`mt-8 rounded-full px-5 py-3.5 text-[12px] font-semibold uppercase tracking-widest transition-colors duration-300 ${s.cta}`}
                  >
                    {p.cta}
                  </button>

                  {p.showSeats && (
                    <>
                      <div className="mt-6 flex items-center justify-center gap-2 rounded-[6px] border border-white/15 bg-white/[0.04] py-3.5">
                        <Users size={16} strokeWidth={2} className="text-zinc-300" />
                        <p className="text-[13.5px] font-bold uppercase tracking-widest text-zinc-200">
                          Cupos máximo: {SEATS_TOTAL} personas
                        </p>
                      </div>
                      <SeatsAvailability />
                    </>
                  )}
                </motion.div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
