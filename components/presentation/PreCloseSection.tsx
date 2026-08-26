"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "@/components/Reveal";
import { EASE_OUT } from "@/lib/motion";

const SCALE = Array.from({ length: 10 }, (_, i) => i + 1);

function messageFor(score: number) {
  if (score >= 9) return "Ideal. Es el momento de dar el paso.";
  if (score >= 7) return "Muy bien. Charlemos qué plan se ajusta mejor.";
  if (score >= 5) return "Bien. ¿Qué te haría falta ver para subir el número?";
  return "Entendido. ¿Qué es lo que más te genera duda hasta acá?";
}

export default function PreCloseSection() {
  const [score, setScore] = useState<number | null>(null);

  return (
    <section className="relative overflow-hidden border-t border-[var(--color-border)] px-6 py-24 md:px-10 md:py-32">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[40rem] w-[60rem] -translate-x-1/2 opacity-[0.06] blur-3xl"
        style={{ background: "radial-gradient(ellipse, var(--color-accent) 0%, transparent 70%)" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-4xl text-center">
        <Reveal>
          <span className="text-[14px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-secondary)]">
            Antes de seguir
          </span>
        </Reveal>
        <Reveal delay={0.08} className="mt-5">
          <h2 className="text-[2.2rem] font-bold leading-[1.15] tracking-tight text-[var(--color-text-primary)] md:text-[3rem]">
            Del 1 al 10, ¿cómo lo ves hasta acá?
          </h2>
        </Reveal>

        <Reveal delay={0.16} className="mt-12">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {SCALE.map((n) => {
              const active = score === n;
              return (
                <motion.button
                  key={n}
                  onClick={() => setScore(n)}
                  whileTap={{ scale: 0.9 }}
                  animate={{
                    scale: active ? 1.12 : 1,
                  }}
                  transition={{ duration: 0.25, ease: EASE_OUT }}
                  className={`flex h-14 w-14 items-center justify-center rounded-full border font-mono text-[18px] font-semibold transition-colors duration-300 sm:h-16 sm:w-16 sm:text-[20px] ${
                    active
                      ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[#0B0C0E] shadow-[0_0_0_8px_var(--color-accent-muted)]"
                      : "border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)]/40 hover:text-[var(--color-text-primary)]"
                  }`}
                >
                  {n}
                </motion.button>
              );
            })}
          </div>
        </Reveal>

        <div className="mt-10 flex min-h-[32px] items-center justify-center">
          <AnimatePresence mode="wait">
            {score !== null && (
              <motion.p
                key={score}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: EASE_OUT }}
                className="text-[17px] font-medium text-[var(--color-accent)]"
              >
                {messageFor(score)}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
