"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";

// 20/10/2026, 9:00 hs Argentina (UTC-3)
const COHORT_DATE = new Date("2026-10-20T09:00:00-03:00");
const WINDOW_DAYS = 30;

function getRemaining() {
  const diff = COHORT_DATE.getTime() - Date.now();
  const clamped = Math.max(diff, 0);
  const days = Math.floor(clamped / (1000 * 60 * 60 * 24));
  const hours = Math.floor((clamped / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((clamped / (1000 * 60)) % 60);
  const seconds = Math.floor((clamped / 1000) % 60);
  const totalDaysFloat = clamped / (1000 * 60 * 60 * 24);
  return { days, hours, minutes, seconds, totalDaysFloat };
}

type Remaining = ReturnType<typeof getRemaining>;

const UNITS = [
  { key: "days", label: "Días" },
  { key: "hours", label: "Horas" },
  { key: "minutes", label: "Min" },
  { key: "seconds", label: "Seg" },
] as const;

export default function CohortCountdown() {
  const [time, setTime] = useState<Remaining | null>(null);

  useEffect(() => {
    setTime(getRemaining());
    const id = setInterval(() => setTime(getRemaining()), 1000);
    return () => clearInterval(id);
  }, []);

  const progress = time ? Math.min(Math.max(1 - time.totalDaysFloat / WINDOW_DAYS, 0), 1) : 0;

  return (
    <div className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-[2rem] bg-[#0B0C0E] px-6 py-16 text-center sm:px-14 sm:py-20">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 0%, rgba(168,129,63,0.16) 0%, transparent 70%)",
        }}
        aria-hidden
      />

      <div className="relative">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 px-4 py-1.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--color-accent)]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-accent)]" />
            Cupos limitados · Última camada del año
          </span>
        </Reveal>

        <Reveal delay={0.08} className="mt-6">
          <h2 className="mx-auto max-w-2xl text-[2.4rem] font-bold leading-[1.08] tracking-tight text-white md:text-[3.4rem]">
            Arrancamos el 20 de octubre.
          </h2>
        </Reveal>
        <Reveal delay={0.14} className="mt-4">
          <p className="mx-auto max-w-lg text-[16px] leading-relaxed text-white/55">
            Esta camada no se repite. Una vez que arranca, el acceso se
            cierra y la próxima apertura todavía no tiene fecha confirmada.
          </p>
        </Reveal>

        <Reveal delay={0.2} className="mt-12">
          <div className="mx-auto grid max-w-2xl grid-cols-4 gap-3 sm:gap-5">
            {UNITS.map((u) => (
              <div
                key={u.key}
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-2 py-5 sm:px-4 sm:py-7"
              >
                <span className="block font-mono text-[2.2rem] font-black leading-none tracking-tight text-white sm:text-[3.2rem]">
                  {String(time?.[u.key] ?? 0).padStart(2, "0")}
                </span>
                <span className="mt-2 block text-[10.5px] font-semibold uppercase tracking-widest text-white/40 sm:text-[11px]">
                  {u.label}
                </span>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.26} className="mt-10">
          <div className="mx-auto max-w-md">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-[var(--color-accent)]"
                initial={{ width: 0 }}
                animate={{ width: `${progress * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <p className="mt-3 text-[13px] font-medium text-white/40">
              La ventana de inscripción se está cerrando.
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
