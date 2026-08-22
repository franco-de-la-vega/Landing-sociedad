"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Reveal from "@/components/Reveal";
import RevealGroup from "@/components/RevealGroup";
import RevealItem from "@/components/RevealItem";

const plans = [
  {
    name: "Plan Fundamentos",
    price: "$320",
    tier: "base",
    features: [
      "Acceso completo a la plataforma de formación",
      "Prácticas operativas y ejercicios de role-play entre pares",
      "Dominio de la técnica comercial aplicable a tu propio negocio o proyectos autónomos",
      "2 Mentorías 1 a 1 + Sesiones grupales de feedback",
    ],
    cta: "Seleccionar acceso base",
  },
  {
    name: "Plan Intermedio",
    price: "$497",
    tier: "featured",
    features: [
      "Todo lo incluido en el Plan Fundamentos",
      "4 Mentorías 1 a 1 en vivo con especialistas del equipo",
      "Certificación oficial con historial de desempeño operativo",
      "Acceso directo a la bolsa de empresas para vinculación comercial",
    ],
    cta: "Más elegido · Reservar cupo",
  },
  {
    name: "Plan VIP",
    price: "$997",
    tier: "vip",
    features: [
      "Todo lo incluido en el Plan Intermedio",
      "6 Mentorías 1 a 1 estratégicas en vivo",
      "Evaluación de especialización comercial (High-Ticket, Software B2B, Evergreen, Launching)",
      "Tutor dedicado exclusivo durante todo el proceso de aceleración",
    ],
    cta: "Alto rendimiento · Solicitar admisión",
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
                  <p className={`mt-4 text-[2.6rem] font-bold leading-none tracking-tight ${s.price}`}>
                    {p.price}
                    <span className="ml-2 text-[13px] font-medium text-zinc-500">
                      USD
                    </span>
                  </p>

                  <ul className="mt-8 flex flex-1 flex-col gap-3">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <Check
                          size={14}
                          strokeWidth={2.5}
                          className="mt-0.5 shrink-0 text-zinc-500"
                        />
                        <span className="text-[13.5px] leading-relaxed text-zinc-300">
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`mt-8 rounded-full px-5 py-3 text-[11px] uppercase tracking-widest transition-colors duration-300 ${s.cta}`}
                  >
                    {p.cta}
                  </button>
                </motion.div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
