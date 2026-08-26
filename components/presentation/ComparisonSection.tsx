"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Target, Users, PhoneCall, LineChart } from "lucide-react";
import Reveal from "@/components/Reveal";
import RevealGroup from "@/components/RevealGroup";
import RevealItem from "@/components/RevealItem";
import { EASE_OUT } from "@/lib/motion";

const pillars = [
  {
    n: "01",
    icon: PhoneCall,
    title: "Simulación de llamadas reales",
    detail:
      "No es teoría de ventas. Practicás objeciones y cierres en escenarios calcados a una llamada real, antes de tomar tu primer cliente.",
  },
  {
    n: "02",
    icon: Users,
    title: "Mentoría 1 a 1 con especialistas",
    detail:
      "Acompañamiento personalizado de cerca, con feedback puntual sobre tu propia performance, no clases masivas genéricas.",
  },
  {
    n: "03",
    icon: LineChart,
    title: "Evaluación objetiva de desempeño",
    detail:
      "Medimos con datos, no con impresiones. Sabés exactamente en qué nivel estás y qué te falta para el siguiente.",
  },
  {
    n: "04",
    icon: Target,
    title: "Preparación con salida al mercado",
    detail:
      "El objetivo no es el certificado: es que llegues preparado, con evidencia y portafolio, a procesos de selección reales en equipos comerciales del exterior.",
  },
];

export default function ComparisonSection() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="relative overflow-hidden border-t border-[var(--color-border)] px-6 py-24 md:px-10 md:py-32">
      <div
        className="pointer-events-none absolute -right-40 top-0 h-[36rem] w-[36rem] rounded-full opacity-[0.05] blur-3xl"
        style={{ background: "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl">
        <Reveal>
          <span className="text-[14px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-secondary)]">
            Qué hace distinto al método
          </span>
        </Reveal>
        <Reveal delay={0.08} className="mt-5">
          <h2 className="max-w-2xl text-[2.4rem] font-bold leading-[1.1] tracking-tight text-[var(--color-text-primary)] md:text-[3.3rem]">
            Formación pensada para insertarte, no solo para certificarte
          </h2>
        </Reveal>

        <RevealGroup
          stagger={0.1}
          className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-2"
        >
          {pillars.map((p, i) => {
            const Icon = p.icon;
            const isHovered = hovered === i;
            return (
              <RevealItem key={p.title}>
                <motion.div
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3, ease: EASE_OUT }}
                  className="group relative h-full overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-9"
                >
                  <motion.div
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.4 }}
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(420px circle at var(--x, 50%) var(--y, 0%), color-mix(in srgb, var(--color-accent) 6%, transparent), transparent 70%)",
                    }}
                  />

                  <div className="relative flex items-start justify-between">
                    <motion.div
                      animate={{
                        scale: isHovered ? 1.08 : 1,
                        boxShadow: isHovered
                          ? "0 0 0 8px var(--color-accent-muted)"
                          : "0 0 0 0px transparent",
                      }}
                      transition={{ duration: 0.3, ease: EASE_OUT }}
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)]/[0.08]"
                    >
                      <Icon size={22} strokeWidth={2} className="text-[var(--color-accent)]" />
                    </motion.div>
                    <span className="font-mono text-[13px] tracking-[0.1em] text-[var(--color-text-muted)]">
                      {p.n}
                    </span>
                  </div>

                  <h3 className="relative mt-6 text-[20px] font-semibold text-[var(--color-text-primary)]">
                    {p.title}
                  </h3>
                  <p className="relative mt-3 max-w-md text-[16px] leading-relaxed text-[var(--color-text-secondary)]">
                    {p.detail}
                  </p>

                  <motion.div
                    animate={{ scaleX: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: EASE_OUT }}
                    className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-[var(--color-accent)]"
                  />
                </motion.div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
