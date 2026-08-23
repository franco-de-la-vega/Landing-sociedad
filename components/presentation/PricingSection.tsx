"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Users } from "lucide-react";
import Reveal from "@/components/Reveal";
import RevealGroup from "@/components/RevealGroup";
import RevealItem from "@/components/RevealItem";

const SEATS_TOTAL = 25;
const SEATS_TAKEN = 13;

const plans = [
  {
    name: "Junior",
    duration: "8 semanas",
    price: "$397",
    originalPrice: "$970",
    tier: "base",
    features: [
      { text: "Sesiones grupales, 2 por semana", included: true },
      { text: "4 sesiones 1 a 1 por mes", included: true },
      { text: "Acceso a la plataforma completa", included: true },
      { text: "Conexión directa con empresas", included: false },
      { text: "Acceso a la bolsa de trabajo independiente", included: true },
      { text: "Preparación de perfil de LinkedIn", included: true },
      { text: "Creación y armado de CV profesional", included: true },
    ],
    cta: "Reservar cupo",
    showSeats: true,
  },
  {
    name: "Semi Senior",
    price: "$497",
    tier: "featured",
    features: [
      { text: "Acceso completo a la plataforma de formación", included: true },
      { text: "Prácticas operativas y ejercicios de role-play entre pares", included: true },
      { text: "Sesiones grupales de feedback", included: true },
      { text: "4 Mentorías 1 a 1 en vivo con especialistas del equipo", included: true },
      { text: "Certificación oficial con historial de desempeño operativo", included: true },
      { text: "Acceso directo a la bolsa de empresas para vinculación comercial", included: true },
    ],
    cta: "Más elegido · Reservar cupo",
    showSeats: false,
  },
  {
    name: "Senior High Ticket",
    price: "$997",
    tier: "vip",
    features: [
      { text: "Todo lo incluido en Semi Senior", included: true },
      { text: "6 Mentorías 1 a 1 estratégicas en vivo", included: true },
      { text: "Evaluación de especialización comercial (High-Ticket, Software B2B, Evergreen, Launching)", included: true },
      { text: "Tutor dedicado exclusivo durante todo el proceso de aceleración", included: true },
    ],
    cta: "Alto rendimiento · Solicitar admisión",
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
  featured: {
    card: "border-[#facc15]/50 bg-[#161512] shadow-[0_0_60px_-14px_rgba(250,204,21,0.35)] md:-translate-y-4",
    badge: "bg-[#facc15] text-[#0B0C0E]",
    price: "text-[#facc15]",
    cta: "bg-[#facc15] text-[#0B0C0E] hover:bg-[#fde047]",
  },
  vip: {
    card: "border-accent/50 bg-[#161215] shadow-[0_0_60px_-14px_rgba(184,147,90,0.4)]",
    badge: "bg-accent text-[#0B0C0E]",
    price: "text-accent",
    cta: "border border-accent/40 text-accent hover:bg-accent/10",
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
          className="flex w-full items-center justify-center gap-2 rounded-full border border-white/15 py-2.5 text-[11px] uppercase tracking-widest text-zinc-300 transition-colors hover:border-white/30"
        >
          <Users size={13} strokeWidth={2} />
          Actualizar disponibilidad
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 rounded-full border border-accent/25 bg-accent/[0.06] py-2.5 text-[11.5px] text-accent"
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
          <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
            Planes e inversión
          </span>
        </Reveal>
        <Reveal delay={0.08} className="mt-5">
          <h2 className="max-w-2xl text-[2rem] font-bold leading-[1.15] tracking-tight text-white md:text-[2.8rem]">
            Elige tu Plan de Formación
          </h2>
        </Reveal>
        <Reveal delay={0.14} className="mt-4">
          <p className="max-w-xl text-[15px] leading-relaxed text-zinc-400">
            Acceso estructurado según el nivel de aceleración y soporte
            requerido.
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
                  className={`relative flex h-full flex-col rounded-2xl border p-8 ${s.card}`}
                >
                  {p.tier === "featured" && (
                    <span
                      className={`absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wide ${s.badge}`}
                    >
                      Más elegido
                    </span>
                  )}

                  <h3 className="text-[16px] font-semibold text-white">
                    {p.name}
                  </h3>
                  {p.duration && (
                    <span className="mt-1 text-[12px] text-zinc-500">
                      {p.duration}
                    </span>
                  )}

                  {p.originalPrice && (
                    <span className="mt-4 block text-[14px] text-zinc-600 line-through">
                      {p.originalPrice} USD
                    </span>
                  )}
                  <p className={`text-[2.6rem] font-bold leading-none tracking-tight ${s.price} ${p.originalPrice ? "mt-1" : "mt-4"}`}>
                    {p.price}
                    <span className="ml-2 text-[13px] font-medium text-zinc-500">
                      USD
                    </span>
                  </p>

                  <ul className="mt-8 flex flex-1 flex-col gap-3">
                    {p.features.map((f) => (
                      <li key={f.text} className="flex items-start gap-2.5">
                        {f.included ? (
                          <Check
                            size={14}
                            strokeWidth={2.5}
                            className="mt-0.5 shrink-0 text-zinc-500"
                          />
                        ) : (
                          <X
                            size={14}
                            strokeWidth={2.5}
                            className="mt-0.5 shrink-0 text-red-500"
                          />
                        )}
                        <span
                          className={`text-[13.5px] leading-relaxed ${
                            f.included ? "text-zinc-300" : "text-zinc-500"
                          }`}
                        >
                          {f.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`mt-8 rounded-full px-5 py-3 text-[11px] uppercase tracking-widest transition-colors duration-300 ${s.cta}`}
                  >
                    {p.cta}
                  </button>

                  {p.showSeats && (
                    <>
                      <p className="mt-4 text-center text-[11px] uppercase tracking-widest text-zinc-600">
                        Cupos máximo: {SEATS_TOTAL} personas
                      </p>
                      <SeatsAvailability />
                    </>
                  )}
                </motion.div>
              </RevealItem>
            );
          })}
        </RevealGroup>

        {/* desglose completo */}
        <div className="mt-28">
          <Reveal>
            <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
              Desglose completo
            </span>
          </Reveal>
          <Reveal delay={0.06} className="mt-5">
            <h3 className="max-w-2xl text-[1.7rem] font-bold leading-[1.15] tracking-tight text-white md:text-[2.2rem]">
              Carrera Comercial Completa
            </h3>
          </Reveal>
          <Reveal delay={0.1} className="mt-4">
            <p className="max-w-xl text-[14px] leading-relaxed text-zinc-400">
              El detalle de lo que incluye cada etapa de la formación, de
              Junior a Senior High Ticket.
            </p>
          </Reveal>

          <RevealGroup
            stagger={0.1}
            className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3"
          >
            {plans.map((p) => (
              <RevealItem key={`breakdown-${p.name}`}>
                <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-[#121418] p-7">
                  <div className="flex items-baseline justify-between">
                    <h4 className="text-[15px] font-semibold text-white">
                      {p.name}
                    </h4>
                    <span className="text-[13px] font-semibold text-zinc-500">
                      {p.price}
                    </span>
                  </div>
                  {p.duration && (
                    <span className="mt-1 text-[11.5px] text-zinc-600">
                      {p.duration}
                    </span>
                  )}

                  <ul className="mt-6 flex flex-col gap-2.5">
                    {p.features.map((f) => (
                      <li key={f.text} className="flex items-start gap-2.5">
                        {f.included ? (
                          <Check
                            size={13}
                            strokeWidth={2.5}
                            className="mt-0.5 shrink-0 text-accent"
                          />
                        ) : (
                          <X
                            size={13}
                            strokeWidth={2.5}
                            className="mt-0.5 shrink-0 text-red-500"
                          />
                        )}
                        <span className="text-[12.5px] leading-relaxed text-zinc-400">
                          {f.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
