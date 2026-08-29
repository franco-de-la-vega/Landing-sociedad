"use client";

import { useRef } from "react";
import { Video, Database, MessageSquare, Mail, Calendar, GitBranch, RefreshCw, Gauge } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import Reveal from "@/components/Reveal";
import RevealGroup from "@/components/RevealGroup";
import RevealItem from "@/components/RevealItem";
import SectionNumber from "@/components/curricula/SectionNumber";

const TOOLS = [
  { icon: Video, label: "Videollamadas", depth: 1.4, rotate: -3, y: 0 },
  { icon: Database, label: "CRM", depth: 0.8, rotate: 2, y: 10 },
  { icon: MessageSquare, label: "WhatsApp", depth: 1.1, rotate: -2, y: -8 },
  { icon: Mail, label: "Email", depth: 1.6, rotate: 3, y: 6 },
  { icon: Calendar, label: "Calendario", depth: 0.9, rotate: -3, y: -6 },
  { icon: GitBranch, label: "Pipeline", depth: 1.3, rotate: 2, y: 12 },
  { icon: RefreshCw, label: "Follow-up", depth: 1.0, rotate: -2, y: 4 },
  { icon: Gauge, label: "KPIs", depth: 1.5, rotate: 3, y: -10 },
];

function FloatingWindow({
  tool,
  index,
  springX,
  springY,
}: {
  tool: (typeof TOOLS)[number];
  index: number;
  springX: MotionValue<number>;
  springY: MotionValue<number>;
}) {
  const x = useTransform(springX, (v: number) => v * tool.depth * 14);
  const y = useTransform(springY, (v: number) => v * tool.depth * 14);

  return (
    <RevealItem className="[transform-style:preserve-3d]">
      <motion.div
        style={{ x, y, rotate: tool.rotate }}
        animate={{ y: [tool.y, tool.y - 8, tool.y] }}
        transition={{ y: { duration: 3.4 + index * 0.3, repeat: Infinity, ease: "easeInOut", delay: index * 0.15 } }}
        whileHover={{ scale: 1.05, rotate: 0, transition: { duration: 0.25 } }}
        className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[0_12px_28px_rgba(0,0,0,0.06)]"
      >
        {/* barra de ventana estilo app */}
        <div className="flex items-center gap-1.5 border-b border-[var(--color-border)] bg-[var(--color-bg-base)] px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-[#EF6A5F]" aria-hidden />
          <span className="h-2 w-2 rounded-full bg-[#F5BD4F]" aria-hidden />
          <span className="h-2 w-2 rounded-full bg-[#61C654]" aria-hidden />
        </div>
        <div className="flex flex-col items-center gap-3 px-4 py-7">
          <tool.icon size={22} strokeWidth={1.8} className="text-[var(--color-accent)]" />
          <span className="text-[15.5px] font-medium text-[var(--color-text-secondary)]">{tool.label}</span>
        </div>
      </motion.div>
    </RevealItem>
  );
}

export default function RemoteWorkSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 120, damping: 20, mass: 0.4 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 20, mass: 0.4 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(((e.clientX - rect.left) / rect.width - 0.5) * 2);
    mouseY.set(((e.clientY - rect.top) / rect.height - 0.5) * 2);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <section className="overflow-hidden relative border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-6 py-24 md:px-10 md:py-32">
      <SectionNumber n="09" />
      <div className="mx-auto max-w-5xl text-center">
        <Reveal>
          <span className="text-[12.5px] font-semibold uppercase tracking-[0.08em] sm:text-[15px] sm:tracking-[0.12em] text-[var(--color-text-secondary)]">
            Trabajo remoto
          </span>
        </Reveal>
        <Reveal delay={0.08} className="mt-5">
          <h2 className="text-[1.9rem] font-bold leading-[1.2] tracking-tight text-[var(--color-text-primary)] sm:text-[2.4rem] md:text-[3.3rem]">
            Aprendé a operar en el mundo comercial remoto
          </h2>
        </Reveal>
        <Reveal delay={0.14} className="mt-5">
          <p className="mx-auto max-w-xl text-[16.5px] leading-relaxed text-[var(--color-text-secondary)] sm:text-[19px]">
            El trabajo remoto no se aprende únicamente trabajando desde casa.
            Requiere disciplina, comunicación digital, gestión de
            herramientas, seguimiento, autonomía y capacidad para operar
            dentro de un equipo comercial.
          </p>
        </Reveal>

        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative mx-auto mt-16 max-w-3xl px-6 py-6"
        >
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[26rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 opacity-[0.06] blur-3xl"
            style={{ background: "radial-gradient(ellipse, var(--color-accent) 0%, transparent 70%)" }}
            aria-hidden
          />
          <RevealGroup stagger={0.06} className="relative grid grid-cols-2 gap-5 sm:grid-cols-4 sm:gap-6">
            {TOOLS.map((t, i) => (
              <FloatingWindow key={t.label} tool={t} index={i} springX={springX} springY={springY} />
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
