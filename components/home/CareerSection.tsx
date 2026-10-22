"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Reveal from "../Reveal";

// Proyección simple lon/lat -> viewBox 600x400 (de -125 a 10 de longitud, de 60 a -40 de latitud)
const px = (lon: number) => ((lon + 125) / 135) * 600;
const py = (lat: number) => ((60 - lat) / 100) * 400;

const ORIGINS = [
  { name: "Ciudad de México", lon: -99.1, lat: 19.4 },
  { name: "Bogotá", lon: -74.1, lat: 4.7 },
  { name: "Lima", lon: -77, lat: -12 },
  { name: "Santiago", lon: -70.7, lat: -33.4 },
  { name: "Buenos Aires", lon: -58.4, lat: -34.6 },
];
const DESTINATIONS = [
  { name: "Nueva York", lon: -74, lat: 40.7 },
  { name: "Miami", lon: -80.2, lat: 25.8 },
  { name: "Toronto", lon: -79.4, lat: 43.7 },
  { name: "Madrid", lon: -3.7, lat: 40.4 },
];
const ROUTES = [
  [0, 0],
  [1, 1],
  [2, 3],
  [3, 2],
  [4, 0],
  [1, 3],
] as const;

const CLOCKS = [
  { city: "Ciudad de México", tz: "America/Mexico_City" },
  { city: "Bogotá", tz: "America/Bogota" },
  { city: "Buenos Aires", tz: "America/Argentina/Buenos_Aires" },
  { city: "Nueva York", tz: "America/New_York" },
  { city: "Madrid", tz: "Europe/Madrid" },
];

function arc(a: { lon: number; lat: number }, b: { lon: number; lat: number }) {
  const x1 = px(a.lon), y1 = py(a.lat), x2 = px(b.lon), y2 = py(b.lat);
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  const lift = Math.hypot(x2 - x1, y2 - y1) * 0.35;
  return `M${x1},${y1} Q${mx + lift * 0.4},${my - lift} ${x2},${y2}`;
}

function Clocks() {
  // Solo en el cliente: la hora del servidor no coincide con la del visitante
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000 * 15);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-panel)] border border-black/10 bg-black/10 sm:grid-cols-5">
      {CLOCKS.map((c, i) => (
        <div key={c.tz} className={`bg-[var(--color-bg-elevated)] px-5 py-5 ${i === CLOCKS.length - 1 ? "col-span-2 sm:col-span-1" : ""}`}>
          <div className="text-[11px] uppercase tracking-[0.12em] text-[var(--color-text-muted)]">{c.city}</div>
          <div className="mt-1.5 font-mono text-2xl font-semibold tabular-nums text-[var(--color-text-primary)]">
            {now ? now.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: c.tz }) : "--:--"}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CareerSection() {
  const dots: { x: number; y: number }[] = [];
  for (let x = 10; x < 600; x += 16) for (let y = 10; y < 400; y += 16) dots.push({ x, y });

  return (
    <section className="relative overflow-hidden border-t border-black/10 bg-[var(--color-bg-elevated-2)] px-6 py-28 md:px-12 md:py-36">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <span className="text-[12px] font-medium uppercase tracking-[0.14em] text-[var(--color-text-muted)]">La visión</span>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-6 text-4xl font-bold leading-[1.05] tracking-[-0.03em] text-[var(--color-text-primary)] sm:text-[3.4rem]">
                Tu trabajo no tiene por qué{" "}
                <span className="font-serif-display font-normal italic text-[var(--color-accent-hover)]">depender de dónde vivís.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="mt-6 max-w-md text-[15px] leading-relaxed text-[var(--color-text-secondary)] sm:text-[17px]">
                Empresas del exterior buscan talento que sepa negociar. Desde tu casa en Latinoamérica, con una computadora
                y buena conexión, trabajás para ellas y cobrás en su moneda: dólares.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-8 flex flex-wrap gap-2">
                {["Desde tu casa", "Para el exterior", "En dólares"].map((t) => (
                  <span key={t} className="rounded-full border border-black/10 bg-[var(--color-bg-elevated)] px-4 py-2 text-[13px] font-semibold text-[var(--color-text-primary)]">
                    {t}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="lg:col-span-7">
            <div className="relative rounded-[var(--radius-panel)] border border-black/10 bg-[var(--color-bg-elevated)] p-3">
              <svg viewBox="0 0 600 400" className="h-auto w-full" role="img" aria-label="Conexiones de trabajo remoto entre Latinoamérica, Norteamérica y Europa">
                {dots.map((d, i) => (
                  <circle key={i} cx={d.x} cy={d.y} r="1.1" className="fill-black/[0.12]" />
                ))}
                {ROUTES.map(([o, d], i) => {
                  const path = arc(ORIGINS[o], DESTINATIONS[d]);
                  return (
                    <g key={i}>
                      <motion.path
                        d={path}
                        fill="none"
                        stroke="var(--color-accent)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 0.9 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.6, delay: 0.3 + i * 0.2, ease: [0.16, 1, 0.3, 1] }}
                      />
                      <circle r="3" className="fill-[var(--color-text-primary)]">
                        <animateMotion dur={`${3 + i * 0.4}s`} repeatCount="indefinite" path={path} begin={`${1.5 + i * 0.3}s`} />
                      </circle>
                    </g>
                  );
                })}
                {ORIGINS.map((c) => (
                  <g key={c.name}>
                    <circle cx={px(c.lon)} cy={py(c.lat)} r="9" className="fill-[var(--color-accent)]" opacity="0.18">
                      <animate attributeName="r" values="5;12;5" dur="2.6s" repeatCount="indefinite" />
                    </circle>
                    <circle cx={px(c.lon)} cy={py(c.lat)} r="4" className="fill-[var(--color-accent)]" />
                    <text x={px(c.lon) + 9} y={py(c.lat) + 4} className="fill-[var(--color-text-secondary)] text-[11px] font-medium">
                      {c.name}
                    </text>
                  </g>
                ))}
                {DESTINATIONS.map((c) => (
                  <g key={c.name}>
                    <rect x={px(c.lon) - 4} y={py(c.lat) - 4} width="8" height="8" rx="2" className="fill-[var(--color-text-primary)]" />
                    <text x={px(c.lon) + 9} y={py(c.lat) - 6} className="fill-[var(--color-text-primary)] text-[11px] font-semibold">
                      {c.name}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="mt-10">
          <Clocks />
        </Reveal>
      </div>
    </section>
  );
}
