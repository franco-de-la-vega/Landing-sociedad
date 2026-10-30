"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, LayoutGroup, MotionConfig, motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Drama,
  LayoutDashboard,
  MessagesSquare,
  Network,
  Radio,
  Sparkles,
  Star,
  Target,
  X,
} from "lucide-react";
import Image from "next/image";
import Logo from "@/components/Logo";
import Reveal from "@/components/Reveal";
import RevealGroup from "@/components/RevealGroup";
import RevealItem from "@/components/RevealItem";
import { EASE_OUT } from "@/lib/motion";
import {
  COMPONENTES,
  DESCRIPCION,
  DIAGNOSTICOS,
  EJEMPLO,
  RECORRIDO,
  REMINDER,
  SECUENCIA,
  type Componente,
} from "@/lib/bootcamp";

const NAV = [
  { id: "bootcamp", label: "Bootcamp" },
  { id: "componentes", label: "Componentes" },
  { id: "recorrido", label: "Recorrido" },
  { id: "valor", label: "Guía de valor" },
];

const ICONOS = {
  radio: Radio,
  campus: LayoutDashboard,
  roleplay: Drama,
  crm: Network,
  feedback: MessagesSquare,
  certificacion: BadgeCheck,
};

const RECORRIDO_ICONOS = [Radio, Drama, LayoutDashboard, MessagesSquare, Target, BadgeCheck];

const eyebrow = "text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--bc-gold)]";
const serif = "font-serif-display font-normal italic text-[var(--bc-gold-soft)]";

function Reminder({ className = "" }: { className?: string }) {
  return (
    <div className={`bc-shimmer rounded-2xl p-px ${className}`}>
      <div className="flex items-start gap-3 rounded-[15px] bg-[var(--bc-brown)] px-5 py-4 sm:items-center sm:gap-4 sm:px-7 sm:py-5">
        <Sparkles size={20} className="mt-0.5 shrink-0 text-[var(--bc-gold-soft)] sm:mt-0" />
        <p className="text-[15px] font-semibold leading-snug text-white sm:text-lg">{REMINDER}</p>
      </div>
    </div>
  );
}

function Detail({ label, text, big = false }: { label: string; text: string; big?: boolean }) {
  return (
    <div>
      <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--bc-gold)]">{label}</span>
      <p className={`mt-2 leading-relaxed text-white/85 ${big ? "text-[19px] sm:text-2xl" : "text-[15px]"}`}>{text}</p>
    </div>
  );
}

function Card({
  c,
  n,
  picked,
  onPick,
  onOpen,
}: {
  c: Componente;
  n: number;
  picked: boolean;
  onPick: () => void;
  onOpen: () => void;
}) {
  const Icon = ICONOS[c.icono];
  return (
    <motion.div
      id={`card-${c.id}`}
      layoutId={`card-${c.id}`}
      style={{ borderRadius: 24 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, ease: EASE_OUT }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
      onClick={onOpen}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onOpen())}
      role="button"
      tabIndex={0}
      aria-label={`Abrir ${c.nombre}`}
      className={`group relative scroll-mt-10 cursor-pointer overflow-hidden border bg-[#14110e] p-6 transition-colors duration-500 sm:p-7 ${
        picked ? "border-[var(--bc-gold)]" : "border-white/10 hover:border-[var(--bc-gold)]/60"
      }`}
    >
      {/* luz dorada que sigue al cursor */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "radial-gradient(320px circle at var(--mx, 50%) var(--my, 0%), rgba(184,147,90,0.18), transparent 70%)" }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-2 -top-6 select-none text-[7rem] font-black leading-none text-white/[0.04] transition-colors duration-500 group-hover:text-[var(--bc-gold)]/15"
      >
        {String(n).padStart(2, "0")}
      </span>

      <div className="relative flex items-start justify-between">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--bc-gold)]/12 text-[var(--bc-gold-soft)] transition-all duration-500 group-hover:rotate-[-6deg] group-hover:scale-110 group-hover:bg-[var(--bc-gold)] group-hover:text-[var(--bc-black)]">
          <Icon size={22} strokeWidth={1.75} />
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPick();
          }}
          aria-pressed={picked}
          aria-label={picked ? `Quitar ${c.nombre} de mi selección` : `Agregar ${c.nombre} a mi selección`}
          className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 ${
            picked
              ? "scale-110 border-[var(--bc-gold)] bg-[var(--bc-gold)] text-[var(--bc-black)]"
              : "border-white/20 text-white/50 hover:border-[var(--bc-gold)] hover:text-[var(--bc-gold-soft)]"
          }`}
        >
          <Star size={17} fill={picked ? "currentColor" : "none"} />
        </button>
      </div>

      <h3 className="relative mt-6 text-2xl font-bold tracking-tight text-white">{c.nombre}</h3>
      <p className="relative mt-3 text-[15px] leading-relaxed text-white/60">{c.caracteristica}</p>

      <span className="relative mt-6 inline-flex items-center gap-2 text-[13px] font-semibold text-[var(--bc-gold-soft)]">
        Abrir
        <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1.5" />
      </span>
    </motion.div>
  );
}

function Expanded({ c, n, picked, onPick, onClose }: { c: Componente; n: number; picked: boolean; onPick: () => void; onClose: () => void }) {
  const Icon = ICONOS[c.icono];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-8" role="dialog" aria-modal="true" aria-label={c.nombre}>
      <motion.div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        layoutId={`card-${c.id}`}
        style={{ borderRadius: 24 }}
        transition={{ duration: 0.55, ease: EASE_OUT }}
        className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto border border-[var(--bc-gold)]/60 bg-[#14110e] p-6 shadow-[0_40px_120px_-20px_rgba(184,147,90,0.35)] sm:p-12"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[var(--bc-gold)]/20 blur-[90px]"
        />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.15 }}
          className="relative"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--bc-gold)] text-[var(--bc-black)]">
                <Icon size={26} strokeWidth={1.75} />
              </span>
              <div>
                <span className={eyebrow}>Componente {String(n).padStart(2, "0")}</span>
                <h3 className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-5xl">{c.nombre}</h3>
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                onClick={onPick}
                aria-pressed={picked}
                aria-label={picked ? "Quitar de mi selección" : "Agregar a mi selección"}
                className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors ${
                  picked ? "border-[var(--bc-gold)] bg-[var(--bc-gold)] text-[var(--bc-black)]" : "border-white/25 text-white/70 hover:border-[var(--bc-gold)]"
                }`}
              >
                <Star size={18} fill={picked ? "currentColor" : "none"} />
              </button>
              <button
                onClick={onClose}
                aria-label="Cerrar"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white/80 transition-all hover:rotate-90 hover:border-white"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-0 sm:mt-12">
            {[
              ["Característica", c.caracteristica],
              ["Beneficio", c.beneficio],
              ["Aplicación práctica", c.aplicacion],
            ].map(([k, v], i) => (
              <motion.div
                key={k}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.55, ease: EASE_OUT, delay: 0.3 + i * 0.12 }}
                className="border-t border-white/10 py-5 sm:py-7"
              >
                <Detail big label={k} text={v} />
              </motion.div>
            ))}
          </div>

          <p className="mt-2 border-t border-white/10 pt-5 text-[13px] italic text-[var(--bc-gold-soft)]">{REMINDER}</p>
        </motion.div>
      </motion.div>
    </div>
  );
}

function ValueStepper() {
  const [step, setStep] = useState(0);
  const pasos = [
    { ...SECUENCIA[0], ejemplo: EJEMPLO.caracteristica },
    { ...SECUENCIA[1], ejemplo: EJEMPLO.beneficio },
    { ...SECUENCIA[2], ejemplo: EJEMPLO.impacto },
    { ...SECUENCIA[3], ejemplo: EJEMPLO.confirmacion },
  ];
  const actual = pasos[step];

  return (
    <div className="grid overflow-hidden rounded-[28px] border border-white/10 bg-[#14110e] text-left lg:grid-cols-[0.85fr_1.15fr]">
      {/* los cuatro pasos */}
      <ol className="flex flex-col border-b border-white/10 lg:border-b-0 lg:border-r">
        {pasos.map((p, i) => {
          const active = i === step;
          return (
            <li key={p.titulo} className="relative flex-1">
              <button
                onClick={() => setStep(i)}
                aria-current={active ? "step" : undefined}
                className="group relative flex h-full w-full items-start gap-4 px-6 py-5 text-left sm:px-8 sm:py-6"
              >
                {active && (
                  <motion.span layoutId="valor-activo" className="absolute inset-0 bg-[var(--bc-gold)]/12" transition={{ duration: 0.5, ease: EASE_OUT }} />
                )}
                {active && (
                  <motion.span layoutId="valor-barra" className="absolute inset-y-0 left-0 w-[3px] bg-[var(--bc-gold)]" transition={{ duration: 0.5, ease: EASE_OUT }} />
                )}
                <span
                  className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-[13px] font-bold transition-colors duration-300 ${
                    active ? "border-[var(--bc-gold)] bg-[var(--bc-gold)] text-[var(--bc-black)]" : i < step ? "border-[var(--bc-gold)]/60 text-[var(--bc-gold-soft)]" : "border-white/20 text-white/40"
                  }`}
                >
                  {i + 1}
                </span>
                <span className="relative min-w-0">
                  <span className={`block text-lg font-bold transition-colors duration-300 ${active ? "text-white" : "text-white/55 group-hover:text-white"}`}>{p.titulo}</span>
                  <span className={`block overflow-hidden text-[14px] leading-relaxed text-white/60 transition-all duration-500 ${active ? "mt-1 max-h-24 opacity-100" : "max-h-0 opacity-0"}`}>
                    {p.texto}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {/* el ejemplo, en grande */}
      <div className="relative flex min-h-[22rem] flex-col justify-between overflow-hidden p-7 sm:min-h-[26rem] sm:p-12">
        <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[var(--bc-gold)]/20 blur-[90px]" />
        <span className={`${eyebrow} relative`}>Ejemplo · {EJEMPLO.caracteristica}</span>

        <div className="relative my-8 flex flex-1 items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
              transition={{ duration: 0.45, ease: EASE_OUT }}
            >
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--bc-gold)]">{actual.titulo}</span>
              <p className={`mt-3 font-bold leading-[1.15] tracking-[-0.02em] text-white ${step === 2 ? "text-2xl sm:text-3xl" : "text-3xl sm:text-5xl"}`}>
                {actual.ejemplo}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative flex items-center justify-between gap-4">
          <div className="flex gap-2" aria-hidden>
            {pasos.map((p, i) => (
              <span key={p.titulo} className={`h-1.5 rounded-full transition-all duration-500 ${i === step ? "w-10 bg-[var(--bc-gold)]" : i < step ? "w-4 bg-[var(--bc-gold)]/50" : "w-4 bg-white/20"}`} />
            ))}
          </div>
          <button
            onClick={() => setStep((s) => (s + 1) % pasos.length)}
            className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[13px] font-semibold text-[var(--bc-black)] transition-all duration-300 hover:bg-[var(--bc-gold-soft)]"
          >
            {step === pasos.length - 1 ? "Volver a empezar" : "Siguiente"}
            <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BootcampGuide() {
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [onlyPicked, setOnlyPicked] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [diag, setDiag] = useState<string | null>(null);

  const flip = (id: string) =>
    setPicked((p) => {
      const next = new Set(p);
      if (!next.delete(id)) next.add(id);
      return next;
    });

  const elegirDiagnostico = (id: string) => {
    const d = DIAGNOSTICOS.find((x) => x.id === id);
    if (!d || diag === id) {
      setDiag(null);
      return;
    }
    setDiag(id);
    setOnlyPicked(false);
    setPicked(new Set(d.componentes));
  };

  const goTo = (id: string) => {
    setOnlyPicked(false);
    requestAnimationFrame(() => document.getElementById(`card-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" }));
  };

  const visible = onlyPicked ? COMPONENTES.filter((c) => picked.has(c.id)) : COMPONENTES;
  const opened = COMPONENTES.find((c) => c.id === openId);

  return (
    <MotionConfig reducedMotion="user">
      <div className="bootcamp overflow-x-clip bg-[var(--bc-black)] text-white">
        {/* Menú: no queda fijo, se va con el scroll */}
        <header className="relative z-20">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-5 py-5 sm:px-8">
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE_OUT }}
              className="flex min-w-0 flex-1 items-center gap-3"
            >
              <Logo className="h-8 w-8 shrink-0 text-[var(--bc-gold)] sm:h-9 sm:w-9" />
              <span className="min-w-0 text-[11px] font-bold leading-tight sm:text-[14px]">Instituto Latinoamericano de Formación Comercial</span>
            </motion.div>
            <nav aria-label="Secciones" className="-mx-5 flex w-[calc(100%+2.5rem)] gap-2 overflow-x-auto px-5 sm:mx-0 sm:w-auto sm:px-0">
              {NAV.map((s, i) => (
                <motion.a
                  key={s.id}
                  href={`#${s.id}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.1 + i * 0.07 }}
                  whileHover={{ y: -2 }}
                  className="shrink-0 rounded-full border border-white/20 px-4 py-2 text-[13px] font-semibold text-white/80 transition-colors duration-300 hover:border-[var(--bc-gold)] hover:bg-[var(--bc-gold)] hover:text-[var(--bc-black)]"
                >
                  {s.label}
                </motion.a>
              ))}
            </nav>
          </div>
        </header>

        <main>
          {/* 1. Bootcamp */}
          <section id="bootcamp" className="relative overflow-hidden px-5 pb-16 pt-10 sm:px-8 sm:pb-28 sm:pt-20">
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -left-40 top-0 h-[28rem] w-[28rem] rounded-full bg-[var(--bc-gold)]/25 blur-[120px]"
              animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
              transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -right-40 top-40 h-[26rem] w-[26rem] rounded-full bg-[var(--bc-brown)] blur-[120px]"
              animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
              transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.06]"
              style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "34px 34px" }}
            />

            <div className="relative mx-auto max-w-6xl">
              <Reveal>
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--bc-gold)]/40 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--bc-gold-soft)]">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--bc-gold)]" />
                  Guía del producto · Evidencia 05
                </span>
              </Reveal>
              <Reveal delay={0.08}>
                <h1 className="mt-7 max-w-4xl text-[2.6rem] font-bold leading-[1.02] tracking-[-0.035em] sm:text-7xl">
                  Formación comercial remota, con <span className={serif}>práctica real.</span>
                </h1>
              </Reveal>

              <RevealGroup stagger={0.1} className="mt-10 grid gap-8 sm:mt-14 md:grid-cols-2 md:gap-12">
                {[
                  ["Qué es", DESCRIPCION.que],
                  ["A quién está dirigido", DESCRIPCION.paraQuien],
                ].map(([k, v]) => (
                  <RevealItem key={k}>
                    <div className="border-t border-[var(--bc-gold)]/40 pt-5">
                      <span className={eyebrow}>{k}</span>
                      <p className="mt-3 text-[16px] leading-relaxed text-white/75 sm:text-lg">{v}</p>
                    </div>
                  </RevealItem>
                ))}
              </RevealGroup>

              <RevealGroup stagger={0.07} className="mt-8 flex flex-wrap gap-2">
                {DESCRIPCION.competencias.map((c) => (
                  <RevealItem key={c}>
                    <span className="inline-block cursor-default rounded-full border border-[var(--bc-gold)]/50 px-4 py-2 text-[13px] font-semibold text-[var(--bc-gold-soft)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--bc-gold)] hover:text-[var(--bc-black)]">
                      {c}
                    </span>
                  </RevealItem>
                ))}
              </RevealGroup>

              <Reveal delay={0.2} className="mt-10 sm:mt-14">
                <Reminder />
              </Reveal>
            </div>
          </section>

          {/* Cinta con los componentes */}
          <div className="overflow-hidden border-y border-white/10 bg-[var(--bc-brown)]/40 py-4" aria-hidden>
            <div className="marquee-track flex w-max gap-10 whitespace-nowrap">
              {[...COMPONENTES, ...COMPONENTES, ...COMPONENTES, ...COMPONENTES].map((c, i) => (
                <span key={i} className="flex items-center gap-10 text-[13px] font-semibold uppercase tracking-[0.16em] text-white/60">
                  {c.nombre}
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--bc-gold)]" />
                </span>
              ))}
            </div>
          </div>

          {/* 2. Componentes */}
          <section id="componentes" className="relative scroll-mt-6 px-5 py-20 sm:px-8 sm:py-32">
            <div className="mx-auto max-w-6xl">
              <Reveal>
                <span className={eyebrow}>Características y beneficios</span>
              </Reveal>
              <Reveal delay={0.08}>
                <h2 className="mt-4 text-4xl font-bold tracking-[-0.03em] sm:text-6xl">
                  Elegí 2 o 3 y <span className={serif}>mostralos.</span>
                </h2>
              </Reveal>
              <Reveal delay={0.12}>
                <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/60 sm:text-base">
                  Tocá un componente de la lista para ir directo a su tarjeta, o abrí cualquiera para verla en grande. Con la estrella marcás los que vas a presentar.
                </p>
              </Reveal>

              <Reveal delay={0.14} className="mt-10 rounded-[24px] border border-[var(--bc-gold)]/30 bg-[#14110e] p-6 sm:p-8">
                <span className={eyebrow}>Diagnóstico del prospecto</span>
                <h3 className="mt-2 text-xl font-bold sm:text-2xl">¿Qué le preocupa o qué busca?</h3>
                <div className="mt-5 flex flex-wrap gap-2">
                  {DIAGNOSTICOS.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => elegirDiagnostico(d.id)}
                      aria-pressed={diag === d.id}
                      className={`rounded-full border px-4 py-2.5 text-[13px] font-semibold transition-all duration-300 hover:-translate-y-0.5 ${
                        diag === d.id
                          ? "border-[var(--bc-gold)] bg-[var(--bc-gold)] text-[var(--bc-black)]"
                          : "border-white/20 text-white/80 hover:border-[var(--bc-gold)]"
                      }`}
                    >
                      {d.titulo}
                    </button>
                  ))}
                </div>
                <AnimatePresence mode="wait">
                  {diag && (
                    <motion.p
                      key={diag}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4, ease: EASE_OUT }}
                      className="mt-5 border-l-2 border-[var(--bc-gold)] pl-4 text-[15px] leading-relaxed text-white/80"
                    >
                      {DIAGNOSTICOS.find((d) => d.id === diag)?.sugerencia} Ya te marqué los componentes sugeridos con la estrella; podés cambiarlos.
                    </motion.p>
                  )}
                </AnimatePresence>
              </Reveal>

              <Reveal delay={0.16} className="mt-7 flex flex-wrap gap-2">
                {COMPONENTES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => goTo(c.id)}
                    className="rounded-full border border-white/20 px-4 py-2 text-[13px] font-semibold text-white/80 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--bc-gold)] hover:bg-[var(--bc-gold)] hover:text-[var(--bc-black)]"
                  >
                    {c.nombre}
                  </button>
                ))}
              </Reveal>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setOnlyPicked((v) => !v)}
                  disabled={picked.size === 0 && !onlyPicked}
                  aria-pressed={onlyPicked}
                  className={`rounded-full px-5 py-2.5 text-[13px] font-semibold transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:translate-y-0 ${
                    onlyPicked ? "bg-[var(--bc-gold)] text-[var(--bc-black)]" : "bg-white text-[var(--bc-black)] hover:bg-[var(--bc-gold-soft)]"
                  }`}
                >
                  {onlyPicked ? "Ver todos" : `Ver solo mi selección (${picked.size})`}
                </button>
                <AnimatePresence>
                  {picked.size > 3 && (
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-[13px] text-[var(--bc-gold-soft)]"
                    >
                      Marcaste {picked.size}. Para esta evidencia alcanzan 2 o 3.
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              <LayoutGroup>
                <div className="mt-10 grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <AnimatePresence mode="popLayout">
                    {visible.map((c) => (
                      <motion.div
                        key={c.id}
                        layout
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.15 }}
                        exit={{ opacity: 0, scale: 0.92 }}
                        transition={{ duration: 0.6, ease: EASE_OUT }}
                      >
                        <Card
                          c={c}
                          n={COMPONENTES.indexOf(c) + 1}
                          picked={picked.has(c.id)}
                          onPick={() => flip(c.id)}
                          onOpen={() => setOpenId(c.id)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <AnimatePresence>
                  {opened && (
                    <Expanded
                      key={opened.id}
                      c={opened}
                      n={COMPONENTES.indexOf(opened) + 1}
                      picked={picked.has(opened.id)}
                      onPick={() => flip(opened.id)}
                      onClose={() => setOpenId(null)}
                    />
                  )}
                </AnimatePresence>
              </LayoutGroup>
            </div>
          </section>

          {/* Así se ve el Campus */}
          <section className="px-5 pb-20 sm:px-8 sm:pb-32">
            <div className="mx-auto max-w-5xl">
              <div className="text-center">
                <span className={eyebrow}>El Campus</span>
                <h2 className="mt-3 text-3xl font-bold tracking-[-0.02em] sm:text-4xl">Así se ve la ruta del alumno.</h2>
              </div>
              <div className="mt-8 overflow-hidden rounded-[14px] border border-white/10 bg-[#121418] shadow-[0_50px_100px_-30px_rgba(0,0,0,0.8)] sm:mt-10">
                <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                </div>
                <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[4320/2699]">
                  <Image
                    src="/home/campus.webp"
                    alt="Pantalla de la ruta del alumno en el campus, con los sprints completados, disponibles y bloqueados"
                    fill
                    sizes="(min-width: 1024px) 1024px, 180vw"
                    className="origin-top-left scale-[1.8] object-cover object-left-top sm:scale-100"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 3. Recorrido */}
          <section id="recorrido" className="relative scroll-mt-6 overflow-hidden bg-[var(--bc-brown)]/25 px-5 py-20 sm:px-8 sm:py-32">
            <div className="mx-auto max-w-6xl">
              <Reveal>
                <span className={eyebrow}>Cómo se vive la formación</span>
              </Reveal>
              <Reveal delay={0.08}>
                <h2 className="mt-4 text-4xl font-bold tracking-[-0.03em] sm:text-6xl">
                  El recorrido, <span className={serif}>paso a paso.</span>
                </h2>
              </Reveal>

              <div className="relative mt-14 sm:mt-20">
                {/* línea que se dibuja al entrar */}
                <motion.div
                  aria-hidden
                  className="absolute left-[19px] top-0 h-full w-px origin-top bg-gradient-to-b from-[var(--bc-gold)] to-[var(--bc-gold)]/10 lg:left-0 lg:top-[19px] lg:h-px lg:w-full lg:origin-left lg:bg-gradient-to-r"
                  initial={{ scaleY: 0, scaleX: 1 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 1.6, ease: EASE_OUT }}
                />
                <RevealGroup stagger={0.14} className="relative grid gap-8 lg:grid-cols-6 lg:gap-5">
                  {RECORRIDO.map((r, i) => {
                    const Icon = RECORRIDO_ICONOS[i];
                    return (
                      <RevealItem key={r.titulo}>
                        <div className="group relative flex gap-5 lg:block">
                          <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--bc-gold)] bg-[var(--bc-black)] text-[var(--bc-gold-soft)] transition-all duration-500 group-hover:scale-125 group-hover:bg-[var(--bc-gold)] group-hover:text-[var(--bc-black)]">
                            <Icon size={17} strokeWidth={1.75} />
                          </span>
                          <div className="lg:mt-6">
                            <span className="text-[12px] font-bold text-[var(--bc-gold)]">{String(i + 1).padStart(2, "0")}</span>
                            <h3 className="mt-1 text-xl font-bold">{r.titulo}</h3>
                            <p className="mt-2 text-[14px] leading-relaxed text-white/60 transition-colors duration-300 group-hover:text-white/90">{r.texto}</p>
                          </div>
                        </div>
                      </RevealItem>
                    );
                  })}
                </RevealGroup>
              </div>
            </div>
          </section>

          {/* 4. Guía de valor */}
          <section id="valor" className="relative scroll-mt-6 overflow-hidden px-5 py-20 sm:px-8 sm:py-32">
            <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/3 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-[var(--bc-gold)]/15 blur-[130px]" />
            <div className="relative mx-auto max-w-5xl text-center">
              <Reveal>
                <span className={eyebrow}>Guía para presentar valor</span>
              </Reveal>
              <Reveal delay={0.08}>
                <h2 className="mx-auto mt-4 max-w-4xl text-4xl font-bold tracking-[-0.03em] sm:text-6xl">
                  Cuatro pasos para <span className={serif}>presentar valor.</span>
                </h2>
              </Reveal>
              <Reveal delay={0.12}>
                <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-white/60 sm:text-base">
                  Recorré la secuencia con un ejemplo real. Tocá cada paso o avanzá con la flecha.
                </p>
              </Reveal>

              <Reveal delay={0.16} className="mt-12 sm:mt-16">
                <ValueStepper />
              </Reveal>

              <Reveal delay={0.1}>
                <p className="mx-auto mt-10 max-w-2xl text-[14px] leading-relaxed text-white/55">
                  El impacto no es una promesa universal: cada estudiante lo construye a partir del diagnóstico de su prospecto.
                </p>
              </Reveal>
              <Reveal delay={0.14} className="mx-auto mt-6 max-w-3xl text-left">
                <Reminder />
              </Reveal>
            </div>
          </section>
        </main>

        <footer className="px-5 py-12 text-center text-[12px] text-white/40 sm:px-8">
          Instituto Latinoamericano de Formación Comercial · Material de apoyo para estudiantes
        </footer>
      </div>
    </MotionConfig>
  );
}
