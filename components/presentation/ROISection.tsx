"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Reveal from "@/components/Reveal";
import RangeCountUp from "./RangeCountUp";

const tiers = [
  {
    stage: "Nivel Inicial",
    detail: "Operatoria base y prospección en proyectos remotos.",
    low: 1000,
    high: 1700,
    suffix: "",
    heightPct: 35,
    bar: "from-white/15 to-white/5",
    glow: false,
  },
  {
    stage: "Especialista",
    detail: "Consolidador de cierres, autonomía técnica y gestión de pipeline.",
    low: 1700,
    high: 2500,
    suffix: "",
    heightPct: 60,
    bar: "from-[var(--color-accent)]/45 to-[var(--color-accent)]/10",
    glow: false,
  },
  {
    stage: "Closing Lead",
    detail: "Liderazgo de equipo comercial y contratos high-ticket.",
    low: 2500,
    high: 4200,
    suffix: "+",
    heightPct: 92,
    bar: "from-[var(--color-accent)] to-[var(--color-accent)]/40",
    glow: true,
  },
];

type Spark = { id: number; angle: number; distance: number; size: number; delay: number };

function Sparks() {
  const [sparks, setSparks] = useState<Spark[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => {
      setSparks(
        Array.from({ length: 16 }, (_, i) => ({
          id: i,
          angle: (i / 16) * 360 + Math.random() * 20,
          distance: 40 + Math.random() * 50,
          size: 2 + Math.random() * 2.5,
          delay: Math.random() * 0.15,
        }))
      );
    }, 1450);
    return () => clearTimeout(t);
  }, [inView]);

  return (
    <div ref={ref} className="pointer-events-none absolute left-1/2 top-0 h-0 w-0" aria-hidden>
      {sparks.map((s) => {
        const rad = (s.angle * Math.PI) / 180;
        const x = Math.cos(rad) * s.distance;
        const y = Math.sin(rad) * s.distance;
        return (
          <motion.span
            key={s.id}
            className="absolute rounded-full bg-[var(--color-accent)]"
            style={{ width: s.size, height: s.size, boxShadow: "0 0 6px var(--color-accent)" }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x, y, opacity: 0, scale: 0 }}
            transition={{ duration: 0.7, delay: s.delay, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
}

export default function ROISection() {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInView = useInView(chartRef, { once: true, amount: 0.5 });

  return (
    <section className="relative flex h-screen max-h-screen flex-col items-center justify-center overflow-hidden bg-[#0A0B0D] px-6 md:px-10">
      {/* grid técnico de fondo, apenas visible */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "34px 34px",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[42rem] w-[60rem] -translate-x-1/2 -translate-y-1/2 opacity-[0.14] blur-3xl"
        style={{ background: "radial-gradient(ellipse, var(--color-accent) 0%, transparent 70%)" }}
        aria-hidden
      />

      <div className="relative mx-auto w-full max-w-5xl">
        <Reveal>
          <span className="text-[14px] font-semibold uppercase tracking-[0.12em] text-white/50">
            Construí una carrera comercial en mercados internacionales
          </span>
        </Reveal>
        <Reveal delay={0.08} className="mt-5">
          <h2 className="max-w-3xl text-[2.2rem] font-bold leading-[1.1] tracking-tight text-white md:text-[2.8rem]">
            De tus habilidades actuales a una carrera comercial remota
          </h2>
        </Reveal>
        <Reveal delay={0.14} className="mt-4">
          <p className="max-w-xl text-[16px] leading-relaxed text-white/60">
            Rangos orientativos según el nivel de desempeño alcanzado en
            proyectos comerciales remotos.{" "}
            <span className="text-white/40">
              No es una promesa de ingresos ni el costo del programa: depende
              de tu ejecución y de la oportunidad a la que accedas.
            </span>
          </p>
        </Reveal>

        <Reveal delay={0.2} className="mt-10">
          <div
            ref={chartRef}
            className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-10 backdrop-blur-sm"
          >
            {/* barrido de escaneo, mismo lenguaje que Performance Intelligence */}
            <motion.div
              className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent"
              animate={{ left: ["-40%", "140%"] }}
              transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
              aria-hidden
            />

            <div className="relative flex items-center justify-between">
              <span className="text-[13px] font-medium uppercase tracking-[0.08em] text-white/40">
                Escalada de ingresos por etapa
              </span>
              <span className="text-[12px] uppercase tracking-[0.14em] text-white/30">
                USD / mes
              </span>
            </div>

            {/* gráfico de barras */}
            <div className="relative mt-10 h-[300px] border-b border-white/10 pb-4">
              {/* líneas de referencia, aparecen antes que las barras (como un gráfico real) */}
              <div className="pointer-events-none absolute inset-x-0 top-0 bottom-4" aria-hidden>
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-x-0 h-px bg-white/[0.06]"
                    style={{ top: `${i * 25}%` }}
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={chartInView ? { scaleX: 1, opacity: 1 } : {}}
                    transition={{ duration: 0.5, delay: i * 0.05, ease: "easeOut" }}
                  />
                ))}
              </div>

              <div className="relative grid h-full grid-cols-3 items-end gap-8">
                {tiers.map((t, i) => (
                  <div key={t.stage} className="relative flex h-full flex-col items-center justify-end">
                    <motion.div
                      initial={{ scale: 1 }}
                      animate={chartInView ? { scale: [1, 1, 1.1, 1] } : {}}
                      transition={{ duration: 0.5, delay: 0.5 + i * 0.22 + 1.1, times: [0, 0.4, 0.7, 1], ease: "easeOut" }}
                    >
                      <RangeCountUp
                        low={t.low}
                        high={t.high}
                        suffix={t.suffix}
                        delay={0.5 + i * 0.22}
                        duration={1.1}
                        className={`relative z-10 mb-3 whitespace-nowrap text-center font-bold ${
                          t.glow
                            ? "text-[1.7rem] text-[var(--color-accent)] md:text-[2.1rem]"
                            : i === 1
                              ? "text-[1.35rem] text-white/85"
                              : "text-[1.15rem] text-white/60"
                        }`}
                        style={t.glow ? { filter: "drop-shadow(0 0 14px color-mix(in srgb, var(--color-accent) 55%, transparent))" } : undefined}
                      />
                    </motion.div>
                    <motion.div
                      className={`relative w-full max-w-[140px] overflow-hidden rounded-t-xl bg-gradient-to-t ${t.bar}`}
                      initial={{ height: 0 }}
                      animate={chartInView ? { height: `${t.heightPct}%` } : {}}
                      transition={{ duration: 0.9, delay: 0.3 + i * 0.22, ease: [0.16, 1, 0.3, 1] }}
                      style={t.glow ? { boxShadow: "0 -8px 32px color-mix(in srgb, var(--color-accent) 45%, transparent)" } : undefined}
                    >
                      {t.glow && (
                        <>
                          <motion.div
                            className="absolute inset-x-0 top-0 h-px bg-[var(--color-accent)]"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 1, 0.6] }}
                            transition={{ delay: 1.3, duration: 0.6 }}
                            style={{ boxShadow: "0 0 12px 2px var(--color-accent)" }}
                          />
                          {/* brillo tipo Apple Card recorriendo la barra dorada */}
                          <motion.div
                            className="absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                            initial={{ left: "-40%" }}
                            animate={{ left: "140%" }}
                            transition={{ duration: 1.6, delay: 1.6, repeat: Infinity, repeatDelay: 3.2, ease: "easeInOut" }}
                          />
                        </>
                      )}
                    </motion.div>
                    {t.glow && <Sparks />}
                  </div>
                ))}
              </div>
            </div>

            {/* etiquetas alineadas */}
            <div className="grid grid-cols-3 gap-8 pt-6">
              {tiers.map((t) => (
                <div key={t.stage} className="text-center">
                  <h3 className="text-[16px] font-semibold text-white">{t.stage}</h3>
                  <p className="mx-auto mt-1 max-w-[160px] text-[13px] leading-relaxed text-white/45">
                    {t.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
