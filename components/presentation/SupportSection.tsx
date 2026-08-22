"use client";

import { motion } from "framer-motion";
import { Rocket } from "lucide-react";
import Reveal from "@/components/Reveal";

const nodes = [
  { x: 90, y: 70 },
  { x: 220, y: 40 },
  { x: 320, y: 110 },
  { x: 180, y: 160 },
  { x: 60, y: 180 },
  { x: 300, y: 200 },
];

const links: [number, number][] = [
  [0, 1],
  [1, 2],
  [1, 3],
  [3, 4],
  [2, 5],
  [3, 2],
];

export default function SupportSection() {
  return (
    <section className="relative border-t border-white/10 px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
            Acompañamiento y prueba social en tiempo real
          </span>
        </Reveal>
        <Reveal delay={0.08} className="mt-5">
          <h2 className="max-w-2xl text-[2rem] font-bold leading-[1.15] tracking-tight text-white md:text-[2.8rem]">
            Acompañamiento Estratégico hasta la Inserción Real
          </h2>
        </Reveal>
        <Reveal delay={0.14} className="mt-4">
          <p className="max-w-xl text-[15px] leading-relaxed text-zinc-400">
            Soporte activo y mentores dedicados durante el proceso de
            vinculación.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Izquierda: diagrama de red global */}
          <Reveal delay={0.1}>
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#121418] p-6">
              <svg
                viewBox="0 0 360 240"
                className="h-auto w-full"
                aria-hidden
              >
                {links.map(([a, b], i) => (
                  <motion.line
                    key={i}
                    x1={nodes[a].x}
                    y1={nodes[a].y}
                    x2={nodes[b].x}
                    y2={nodes[b].y}
                    stroke="rgba(184,147,90,0.3)"
                    strokeWidth="1"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 1, delay: 0.15 * i, ease: "easeOut" }}
                  />
                ))}
                {nodes.map((n, i) => (
                  <g key={i}>
                    <motion.circle
                      cx={n.x}
                      cy={n.y}
                      r="10"
                      fill="rgba(184,147,90,0.1)"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true, amount: 0.6 }}
                      transition={{ duration: 0.5, delay: 0.1 * i }}
                    />
                    <motion.circle
                      cx={n.x}
                      cy={n.y}
                      r="3.5"
                      fill="#B8935A"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        delay: 0.2 * i,
                        ease: "easeInOut",
                      }}
                    />
                  </g>
                ))}
              </svg>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-accent/20 bg-accent/5 px-3 py-1.5 text-[10px] uppercase tracking-widest text-accent">
                  Global Remote Network
                </span>
                <span className="rounded-full border border-accent/20 bg-accent/5 px-3 py-1.5 text-[10px] uppercase tracking-widest text-accent">
                  Direct Industry Pipeline
                </span>
              </div>
            </div>
          </Reveal>

          {/* Derecha: notificaciones estilo chat oscuro */}
          <div className="flex flex-col gap-4">
            <Reveal delay={0.16}>
              <div className="rounded-2xl border border-white/10 bg-[#121418] p-5 shadow-2xl">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-accent" />
                  <span className="text-[11px] uppercase tracking-widest text-zinc-500">
                    Oferta confirmada
                  </span>
                </div>
                <p className="mt-3 text-[14.5px] leading-relaxed text-zinc-200">
                  &ldquo;Me hicieron la oferta directa como Closer de
                  Ventas. La simulación de llamadas fue determinante.&rdquo;
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="flex items-center gap-3 rounded-2xl border border-accent/15 bg-[#121418] p-5 shadow-2xl">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <Rocket size={16} strokeWidth={2} />
                </span>
                <p className="text-[14.5px] font-medium text-zinc-200">
                  ¡Contrato cerrado en USD! Incorporado al equipo
                  comercial hoy mismo.
                </p>
              </div>
            </Reveal>
          </div>
        </div>

        <Reveal delay={0.1} className="mt-10">
          <p className="max-w-xl text-[13.5px] leading-relaxed text-zinc-500">
            Garantía de acompañamiento técnico y estratégico continuo
            durante todo el proceso de inserción.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
