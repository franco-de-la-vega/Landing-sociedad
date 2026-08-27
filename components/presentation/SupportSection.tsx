"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";

export default function SupportSection() {
  const [fanned, setFanned] = useState(false);

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
            Tu formación deja huella.
          </h2>
        </Reveal>
        <Reveal delay={0.14} className="mt-4">
          <p className="max-w-xl text-[18px] leading-relaxed text-[var(--color-text-secondary)]">
            Un portafolio profesional real, construido durante la
            formación, que podés mostrar a cualquier empresa.
          </p>
        </Reveal>

        <div className="mt-16">
          {/* Portafolio apilado, como documentos reales sobre una mesa */}
          <Reveal delay={0.1}>
            <div
              className="relative flex h-[420px] items-center justify-center"
              onMouseEnter={() => setFanned(true)}
              onMouseLeave={() => setFanned(false)}
            >
              {/* Card 3: Performance Report (fondo) */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                animate={{
                  rotate: fanned ? -18 : -9,
                  x: fanned ? -110 : 0,
                  y: fanned ? 8 : 0,
                }}
                transition={{ duration: 0.5, delay: fanned ? 0 : 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="absolute h-[260px] w-[300px] rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.15)]"
              >
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
                  Performance Report
                </span>
                <div className="mt-6 flex items-end gap-2">
                  {[38, 62, 48, 74, 56].map((h, i) => (
                    <span
                      key={i}
                      className="w-4 rounded-sm bg-[var(--color-accent)]/25"
                      style={{ height: `${h}px` }}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Card 2: WhatsApp Follow-up (medio) */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                animate={{
                  rotate: fanned ? -3 : 7,
                  x: fanned ? 10 : 24,
                  y: fanned ? 4 : 0,
                }}
                transition={{ duration: 0.5, delay: fanned ? 0 : 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="absolute h-[260px] w-[300px] rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.18)]"
              >
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
                  WhatsApp — Follow-up
                </span>
                <div className="mt-6 flex flex-col gap-2">
                  <div className="ml-auto w-[70%] rounded-xl rounded-tr-sm bg-[var(--color-accent)]/15 px-3 py-2 text-[12px] text-[var(--color-text-secondary)]">
                    Quedamos en retomar el jueves
                  </div>
                  <div className="w-[60%] rounded-xl rounded-tl-sm bg-[var(--color-border)]/60 px-3 py-2 text-[12px] text-[var(--color-text-secondary)]">
                    Perfecto, ahí estoy
                  </div>
                </div>
              </motion.div>

              {/* Card 1: Call Recording (frente) */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                animate={{
                  rotate: fanned ? 14 : -2,
                  x: fanned ? 120 : -24,
                  y: fanned ? 8 : 0,
                }}
                transition={{ duration: 0.5, delay: fanned ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="absolute h-[260px] w-[300px] rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 shadow-[0_24px_60px_-16px_rgba(0,0,0,0.22)]"
              >
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-400" />
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
                    Call Recording — Discovery
                  </span>
                </div>
                <div className="mt-8 flex h-16 items-center gap-[3px]">
                  {[6, 14, 22, 12, 28, 18, 9, 24, 15, 20, 8, 16, 26, 11, 19].map((h, i) => (
                    <span
                      key={i}
                      className="w-[3px] rounded-full bg-[var(--color-accent)]"
                      style={{ height: `${h}px`, opacity: 0.35 + (i % 5) * 0.13 }}
                    />
                  ))}
                </div>
                <span className="mt-6 inline-block rounded-full border border-[var(--color-accent)]/25 bg-[var(--color-accent)]/8 px-3 py-1 text-[11px] uppercase tracking-widest text-[var(--color-accent)]">
                  Evaluado
                </span>
              </motion.div>
            </div>
          </Reveal>
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
