"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const COHORT_DATE = new Date("2026-09-18T00:00:00");
const WINDOW_DAYS = 30;

function getRemaining() {
  const diff = COHORT_DATE.getTime() - Date.now();
  const clamped = Math.max(diff, 0);
  const days = Math.floor(clamped / (1000 * 60 * 60 * 24));
  const hours = Math.floor((clamped / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((clamped / (1000 * 60)) % 60);
  const totalDaysFloat = clamped / (1000 * 60 * 60 * 24);
  return { days, hours, minutes, totalDaysFloat };
}

type Remaining = ReturnType<typeof getRemaining>;

const RADIUS = 82;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const TICKS = Array.from({ length: 12 }, (_, i) => i);
const RINGS = Array.from({ length: 30 }, (_, i) => i);

function SpiralBinding() {
  return (
    <div className="pointer-events-none absolute inset-x-5 -top-7 flex justify-between sm:inset-x-8 sm:-top-8">
      {RINGS.map((i) => (
        <div key={i} className="relative flex flex-col items-center">
          <svg viewBox="0 0 16 34" className="h-8 w-4 sm:h-9 sm:w-4" aria-hidden>
            <path
              d="M3,9 C3,2 13,2 13,9 L13,27 C13,32 3,32 3,27 Z"
              fill="none"
              stroke="url(#spiralGradient)"
              strokeWidth="2.5"
              style={{ filter: "drop-shadow(0 3px 2px rgba(0,0,0,0.28))" }}
            />
            <defs>
              <linearGradient id="spiralGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#B8860B" />
                <stop offset="45%" stopColor="#FFD700" />
                <stop offset="70%" stopColor="#E8CB86" />
                <stop offset="100%" stopColor="#996515" />
              </linearGradient>
            </defs>
          </svg>
          {/* perforación: la anilla atraviesa el papel */}
          <span
            className="-mt-1 h-2 w-2.5 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.1) 55%, transparent 75%)" }}
          />
        </div>
      ))}
    </div>
  );
}

export default function CohortCountdown() {
  const [time, setTime] = useState<Remaining | null>(null);

  useEffect(() => {
    setTime(getRemaining());
    const id = setInterval(() => setTime(getRemaining()), 60_000);
    return () => clearInterval(id);
  }, []);

  const progress = time ? Math.min(Math.max(time.totalDaysFloat / WINDOW_DAYS, 0), 1) : 1;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  return (
    <div className="px-6 py-10 sm:py-14">
      {/* pila de hojas debajo, apenas visible */}
      <div className="relative mx-auto max-w-4xl">
        <div className="absolute inset-x-5 -bottom-3 h-full rounded-b-xl bg-[#EDE6D3]" aria-hidden />
        <div className="absolute inset-x-3.5 -bottom-2 h-full rounded-b-xl bg-[#F0EAD9]" aria-hidden />
        <div className="absolute inset-x-2 -bottom-1 h-full rounded-b-xl bg-[#F3EFE0]" aria-hidden />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="relative flex min-h-[26rem] flex-col justify-center overflow-visible rounded-b-2xl rounded-t-md bg-[var(--color-bg-elevated)] px-8 py-14 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.08),0_10px_15px_-3px_rgba(0,0,0,0.06)] sm:min-h-[30rem] sm:px-14"
        >
          <SpiralBinding />

          <div className="relative flex flex-col items-center gap-10 sm:flex-row sm:justify-between sm:gap-8">
            <div className="text-center sm:text-left">
              <span className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--color-accent)]">
                Próxima camada
              </span>
              <h3 className="mt-2 text-[2.1rem] font-bold leading-[1.05] tracking-tight text-[var(--color-text-primary)] sm:text-[2.6rem]">
                Arrancamos el 18 de septiembre.
              </h3>
              <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-[var(--color-text-secondary)] sm:mx-0">
                Esta camada no se repite. Una vez que arranca, el acceso se
                cierra y la próxima apertura todavía no tiene fecha
                confirmada.
              </p>
            </div>

            <div className="relative flex h-[13.5rem] w-[13.5rem] shrink-0 items-center justify-center">
              {/* marcas tipo reloj de pared */}
              <svg viewBox="0 0 190 190" className="absolute inset-0 h-full w-full" aria-hidden>
                {TICKS.map((i) => {
                  const angle = (i / 12) * 2 * Math.PI - Math.PI / 2;
                  const isMajor = i % 3 === 0;
                  const outer = 95;
                  const inner = isMajor ? 86 : 90;
                  const x1 = 95 + outer * Math.cos(angle);
                  const y1 = 95 + outer * Math.sin(angle);
                  const x2 = 95 + inner * Math.cos(angle);
                  const y2 = 95 + inner * Math.sin(angle);
                  return (
                    <line
                      key={i}
                      x1={x1.toFixed(2)}
                      y1={y1.toFixed(2)}
                      x2={x2.toFixed(2)}
                      y2={y2.toFixed(2)}
                      stroke="var(--color-accent)"
                      strokeWidth={isMajor ? 2 : 1}
                      strokeLinecap="round"
                      opacity={isMajor ? 0.5 : 0.25}
                    />
                  );
                })}
              </svg>

              <svg viewBox="0 0 190 190" className="absolute inset-0 h-full w-full -rotate-90">
                <circle cx="95" cy="95" r={RADIUS} fill="none" stroke="var(--color-border-strong)" strokeWidth="3" />
                <motion.circle
                  cx="95"
                  cy="95"
                  r={RADIUS}
                  fill="none"
                  stroke="var(--color-accent)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={CIRCUMFERENCE}
                  initial={false}
                  animate={{ strokeDashoffset: dashOffset }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </svg>

              <div className="relative flex flex-col items-center">
                <span className="font-mono text-[3.6rem] font-black leading-none tracking-tight text-[var(--color-accent)]">
                  {String(time?.days ?? 0).padStart(2, "0")}
                </span>
                <span className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
                  días
                </span>
                <div className="mt-2 flex items-center gap-1.5 font-mono text-[13px] font-semibold text-[var(--color-text-secondary)]">
                  <span>{String(time?.hours ?? 0).padStart(2, "0")}h</span>
                  <span className="text-[var(--color-text-muted)]">:</span>
                  <span>{String(time?.minutes ?? 0).padStart(2, "0")}m</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
