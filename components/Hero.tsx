"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";

const BADGES = ["Formación práctica", "Simulaciones reales", "Currícula adaptativa", "Empleabilidad"];

// Palabra por palabra, con blur de entrada — mucho más teatral que un
// simple fade del bloque entero.
function Word({
  children,
  delay,
  gold,
  last,
}: {
  children: string;
  delay: number;
  gold?: boolean;
  last?: boolean;
}) {
  return (
    <span className={`inline-block overflow-hidden pb-1 ${last ? "" : "mr-[0.28em]"}`}>
      <motion.span
        className="inline-block"
        initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.7, delay, ease: EASE_OUT }}
      >
        {gold ? (
          <motion.span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(90deg, var(--color-accent) 0%, var(--color-accent) 42%, #fff 50%, var(--color-accent-hover) 58%, var(--color-accent-hover) 100%)",
              backgroundSize: "260% 100%",
            }}
            animate={{ backgroundPosition: ["220% 0%", "-60% 0%"] }}
            transition={{ duration: 2.4, delay: delay + 1, repeat: Infinity, repeatDelay: 4.5, ease: "easeInOut" }}
          >
            {children}
          </motion.span>
        ) : (
          children
        )}
      </motion.span>
    </span>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20, mass: 0.6 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20, mass: 0.6 });

  const glowX = useTransform(springX, (v) => v * 30);
  const glowY = useTransform(springY, (v) => v * 30);
  const gridX = useTransform(springX, (v) => v * -16);
  const gridY = useTransform(springY, (v) => v * -16);

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(((e.clientX - rect.left) / rect.width - 0.5) * 2);
    mouseY.set(((e.clientY - rect.top) / rect.height - 0.5) * 2);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex min-h-[92vh] w-full items-center overflow-hidden bg-[var(--color-bg-base)]"
    >
      <motion.span
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 0.03, scale: 1 }}
        transition={{ duration: 1.6, ease: EASE_OUT }}
        className="pointer-events-none absolute -left-6 top-16 z-0 hidden select-none text-[17vw] font-black uppercase leading-none tracking-tighter text-[var(--color-text-primary)] sm:block md:top-6"
      >
        ILFC
      </motion.span>

      {/* resplandor dorado que sigue al cursor */}
      <motion.div
        className="pointer-events-none absolute -top-32 left-1/2 z-0 h-[42rem] w-[64rem] -translate-x-1/2 opacity-[0.09] blur-3xl"
        style={{ background: "radial-gradient(ellipse, var(--color-accent) 0%, transparent 70%)", x: glowX, y: glowY }}
        aria-hidden
      />

      {/* grid técnico de fondo, con parallax sutil al cursor */}
      <motion.svg
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-[0.5]"
        style={{
          maskImage: "radial-gradient(ellipse 70% 60% at 30% 40%, black 20%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 30% 40%, black 20%, transparent 80%)",
          x: gridX,
          y: gridY,
        }}
      >
        <defs>
          <pattern id="heroGrid" width="46" height="46" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1.3" fill="var(--color-text-primary)" opacity="0.14" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#heroGrid)" />
      </motion.svg>

      {/* líneas de dato ascendiendo, mismo lenguaje "tecnológico" que el resto del sitio */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        {[8, 22, 92].map((left, i) => (
          <motion.span
            key={left}
            className="absolute bottom-0 w-px bg-gradient-to-t from-[var(--color-accent)]/50 to-transparent"
            style={{ left: `${left}%`, height: "55%" }}
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: [0, 0.7, 0], scaleY: [0, 1, 1] }}
            transition={{ duration: 3.6, delay: i * 0.7, repeat: Infinity, repeatDelay: 2.8, ease: "easeInOut" }}
          />
        ))}
      </div>

      <div className="relative z-10 flex w-full max-w-7xl flex-col items-start justify-center px-6 pb-20 pt-12 text-left mx-auto md:px-12">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-[var(--color-accent)]/25 bg-[var(--color-accent)]/[0.07] px-4 py-1.5 text-xs uppercase tracking-widest text-[var(--color-accent-secondary)]"
        >
          <span className="relative flex h-1.5 w-1.5">
            <motion.span
              className="absolute inline-flex h-full w-full rounded-full bg-[var(--color-accent)]"
              animate={{ scale: [1, 2.6], opacity: [0.6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
            />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
          </span>
          Admisión por examen diagnóstico
        </motion.span>

        <h1 className="mb-8 max-w-5xl text-5xl font-black leading-[0.92] tracking-tighter text-[var(--color-text-muted)] sm:text-7xl lg:text-8xl">
          <Word delay={0.15}>Formación</Word>
          <Word delay={0.28} gold last>real.</Word>
          <br />
          <Word delay={0.4}>Hacia</Word>
          <Word delay={0.48}>un</Word>
          <Word delay={0.56}>trabajo</Word>
          <Word delay={0.66} gold last>real.</Word>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.85 }}
          className="mb-8 max-w-2xl text-left text-base font-normal leading-relaxed text-[var(--color-text-secondary)] sm:text-xl"
        >
          Educación de estándar internacional, tecnología de medición en
          tiempo real y acompañamiento 1 a 1 para insertarte en empresas del
          exterior.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2"
        >
          {BADGES.map((b, i) => (
            <motion.span
              key={b}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.35 + i * 0.08 }}
              className="flex items-center gap-1.5 text-[12.5px] font-medium text-[var(--color-text-muted)]"
            >
              <span className="h-1 w-1 rounded-full bg-[var(--color-accent)]" aria-hidden />
              {b}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
