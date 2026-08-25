"use client";

import { motion } from "framer-motion";
import { Video, PhoneCall, MessageSquare, LineChart, ClipboardCheck, Linkedin } from "lucide-react";
import Reveal from "@/components/Reveal";
import RevealGroup from "@/components/RevealGroup";
import RevealItem from "@/components/RevealItem";

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

const deliverables = [
  { icon: Video, label: "Videollamada comercial evaluada" },
  { icon: PhoneCall, label: "Llamada de ventas grabada" },
  { icon: MessageSquare, label: "Conversación comercial simulada" },
  { icon: LineChart, label: "Pipeline en CRM" },
  { icon: ClipboardCheck, label: "Evaluaciones de desempeño" },
  { icon: Linkedin, label: "Perfil profesional y LinkedIn optimizado" },
];

export default function SupportSection() {
  return (
    <section className="relative border-t border-[var(--color-border)] px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <span className="text-[14px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-secondary)]">
            Portafolio de evidencia
          </span>
        </Reveal>
        <Reveal delay={0.08} className="mt-5">
          <h2 className="max-w-2xl text-[2.4rem] font-bold leading-[1.1] tracking-tight text-[var(--color-text-primary)] md:text-[3.3rem]">
            No solo te certificamos. Te damos evidencia.
          </h2>
        </Reveal>
        <Reveal delay={0.14} className="mt-4">
          <p className="max-w-xl text-[18px] leading-relaxed text-[var(--color-text-secondary)]">
            Un portafolio profesional real, construido durante la
            formación, que podés mostrar a cualquier empresa.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Izquierda: diagrama de red */}
          <Reveal delay={0.1}>
            <div className="relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-8">
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
                <span className="rounded-full border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/5 px-3 py-1.5 text-[12px] uppercase tracking-widest text-[var(--color-accent)]">
                  Simulaciones evaluadas
                </span>
                <span className="rounded-full border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/5 px-3 py-1.5 text-[12px] uppercase tracking-widest text-[var(--color-accent)]">
                  Portafolio verificable
                </span>
              </div>
            </div>
          </Reveal>

          {/* Derecha: lista de entregables tangibles */}
          <RevealGroup stagger={0.06} className="flex flex-col gap-3">
            {deliverables.map((d) => (
              <RevealItem key={d.label}>
                <div className="flex items-center gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                    <d.icon size={16} strokeWidth={2} />
                  </span>
                  <p className="text-[17px] font-medium text-[var(--color-text-primary)]">
                    {d.label}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        <Reveal delay={0.1} className="mt-10">
          <p className="max-w-2xl text-[17px] leading-relaxed text-[var(--color-text-muted)]">
            La vinculación con empresas es posterior a la formación y está
            condicionada a tu desempeño evaluado y a la disponibilidad de
            oportunidades en cada momento. La contratación final depende
            también del proceso de selección de cada empresa.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
