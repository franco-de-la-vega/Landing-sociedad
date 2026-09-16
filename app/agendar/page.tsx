"use client";

import { Suspense, useEffect, useRef, useState, type CSSProperties } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarPlus, Check, ChevronLeft, Loader2, Pause, Play, Volume2, VolumeX } from "lucide-react";
import Reveal from "@/components/Reveal";
import Logo from "@/components/Logo";
import BookingCalendar, { type BookingSelection } from "@/components/BookingCalendar";
import { DIA_LABEL, MES_LABEL, convertSlot, googleCalendarLink, isValidWhatsapp, sanitizeWhatsapp, toDateKey, PAISES } from "@/lib/booking";

type Spark = { id: number; angle: number; distance: number; size: number; delay: number };

function ConfettiBurst() {
  const [sparks, setSparks] = useState<Spark[]>([]);
  useEffect(() => {
    setSparks(
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        angle: (i / 18) * 360 + Math.random() * 14,
        distance: 55 + Math.random() * 55,
        size: 2.5 + Math.random() * 3,
        delay: Math.random() * 0.12,
      }))
    );
  }, []);
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 h-0 w-0" aria-hidden>
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
            transition={{ duration: 0.8, delay: 0.15 + s.delay, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
}

export default function AgendarPage() {
  return (
    <Suspense fallback={null}>
      <AgendarFlow />
    </Suspense>
  );
}

function AgendarFlow() {
  const searchParams = useSearchParams();
  const vendedorFijo = searchParams.get("vendedor") || undefined;

  useEffect(() => {
    document.title = "Agendar llamada — ILFC";
  }, []);

  const [step, setStep] = useState<"slot" | "form" | "done">("slot");
  const [selection, setSelection] = useState<BookingSelection | null>(null);
  const [nombre, setNombre] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [sitioWeb, setSitioWeb] = useState(""); // honeypot: invisible para personas, los bots lo completan
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [slotTaken, setSlotTaken] = useState(false);
  const [videoListo, setVideoListo] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  async function handleSubmit() {
    if (!selection || !nombre.trim() || !isValidWhatsapp(whatsapp)) return;
    setSubmitting(true);
    setSubmitError(false);
    setSlotTaken(false);
    try {
      const res = await fetch("/api/agendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          whatsapp,
          mensaje,
          sitioWeb,
          date: toDateKey(selection.date),
          hour: selection.hour,
          ...(vendedorFijo ? { vendedor: vendedorFijo } : {}),
        }),
      });
      if (res.status === 409) {
        setSlotTaken(true);
        setSubmitting(false);
        return;
      }
      if (!res.ok) throw new Error("submit_failed");
      setStep("done");
    } catch {
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  }

  const stepIndex = step === "slot" ? 0 : step === "form" ? 1 : 2;

  return (
    <div
      className="relative min-h-screen overflow-x-hidden bg-[#18191d] text-[var(--color-text-primary)]"
      style={
        {
          // El <body> global corre en tema claro (.theme-light, ver layout.tsx):
          // esta página es la única excepción oscura del sitio, así que
          // redeclara la paleta oscura acá para no depender de sacar esa
          // clase del body (que afectaría a todo el resto del sitio).
          // Gris carbón levantado, no negro puro — pedido explícito de Franco
          // (el primer pase quedó "muy negro").
          "--color-bg-canvas": "#18191d",
          "--color-bg-base": "#18191d",
          "--color-bg-elevated": "#232529",
          "--color-bg-elevated-2": "#2b2d32",
          "--color-border": "rgba(255, 255, 255, 0.12)",
          "--color-border-strong": "rgba(255, 255, 255, 0.22)",
          "--color-text-primary": "#f5f5f4",
          "--color-text-secondary": "#b4b3b0",
          "--color-text-muted": "#88877f",
          "--color-accent": "#b8935a",
          "--color-accent-hover": "#cba873",
          "--color-accent-muted": "#241c0e",
          "--color-accent-secondary": "#9c7c48",
          "--color-accent-secondary-muted": "#1c160a",
        } as CSSProperties
      }
    >
      {/* textura de fondo fija: grano + viñeta radial suave, para que el
          negro no quede plano en un scroll tan largo */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-60"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(184,147,90,0.05) 0%, transparent 55%)" }}
        aria-hidden
      />

      {/* ─────────── 1. Hero ─────────── */}
      <header className="relative z-10 flex items-center justify-center px-6 pt-12 sm:pt-14">
        <Logo className="h-8 w-8 text-[var(--color-accent)]" />
      </header>

      <section className="relative z-10 overflow-hidden px-5 pb-10 pt-10 sm:px-8 sm:pt-14">
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-[42rem] w-[64rem] -translate-x-1/2 -translate-y-1/3 opacity-[0.15] blur-3xl"
          style={{ background: "radial-gradient(ellipse, var(--color-accent) 0%, transparent 70%)" }}
          aria-hidden
        />
        {/* malla de fondo — la misma firma visual que /presentacion, para
            que el instituto se sienta como un solo sistema de diseño */}
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] w-full opacity-[0.1]"
          style={{
            maskImage: "linear-gradient(to bottom, black 0%, transparent 92%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 92%)",
          }}
        >
          <defs>
            <pattern id="agendarMesh" width="56" height="56" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="2" fill="var(--color-accent)" />
              <path d="M0,28 H56 M28,0 V56" stroke="var(--color-accent)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#agendarMesh)" />
        </svg>

        <div className="relative mx-auto max-w-2xl text-center">
          <Reveal>
            <span className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">
              Instituto Latinoamericano de Formación Comercial
            </span>
          </Reveal>
          <Reveal delay={0.08} className="mt-5">
            <h1 className="text-[2.3rem] font-bold leading-[1.08] tracking-[-0.02em] text-white sm:text-[3.1rem] md:text-[3.6rem]">
              No enseñamos{" "}
              <span className="font-normal text-white/45">simplemente</span> a vender.
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(100deg, var(--color-accent-hover) 0%, var(--color-accent) 55%, #8a6c3f 100%)" }}
              >
                Te formamos en ingeniería comercial.
              </span>
            </h1>
          </Reveal>
          <Reveal delay={0.18} className="mt-6">
            <p className="mx-auto max-w-lg text-[16px] leading-relaxed text-white/55 sm:text-[18px]">
              Formación de élite para trabajar de forma remota con empresas del exterior,
              con ingresos en dólares.
            </p>
          </Reveal>

          <Reveal delay={0.32} className="mt-14 flex justify-center">
            <motion.div
              className="flex h-9 w-[22px] items-start justify-center rounded-full border border-white/15 p-1.5"
              aria-hidden
            >
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent-hover)]"
                animate={{ y: [0, 10, 0], opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* ─────────── 2. Bloque de video (VSL) ─────────── */}
      <section className="relative z-10 overflow-hidden px-5 pb-24 pt-4 sm:px-8 sm:pb-32">
        {/* halo ambiental doble, asimétrico, detrás del marco — lo que le da
            profundidad "de vitrina" en vez de un video pegado en el medio */}
        <motion.div
          className="pointer-events-none absolute left-1/2 top-[8%] h-[30rem] w-[30rem] -translate-x-[62%] rounded-full opacity-[0.16] blur-[90px]"
          style={{ background: "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)" }}
          animate={{ opacity: [0.12, 0.2, 0.12] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute left-1/2 bottom-[6%] h-[24rem] w-[24rem] -translate-x-[38%] translate-y-1/3 rounded-full opacity-[0.09] blur-[80px]"
          style={{ background: "radial-gradient(circle, var(--color-accent-secondary) 0%, transparent 70%)" }}
          aria-hidden
        />

        <Reveal delay={0.1} className="relative mx-auto max-w-[420px]">
          <div className="mb-6 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-[11.5px] font-semibold uppercase tracking-[0.14em] text-[var(--color-accent-hover)] backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
              Mirá esto antes de agendar
            </span>
          </div>

          {/* marco: borde en degradé dorado real (no blanco translúcido), con
              esquinas internas más cerradas que el borde externo — efecto
              "bisel" de vidrio — y sombra teñida del acento, no negro plano */}
          <div
            className="relative rounded-[32px] p-[1.5px] shadow-[0_60px_140px_-40px_rgba(184,147,90,0.35),0_30px_70px_-30px_rgba(0,0,0,0.9)]"
            style={{
              background:
                "linear-gradient(160deg, rgba(203,168,115,0.55) 0%, rgba(184,147,90,0.12) 28%, rgba(255,255,255,0.06) 50%, rgba(184,147,90,0.35) 100%)",
            }}
          >
            <div className="group relative aspect-[9/16] w-full overflow-hidden rounded-[30px] bg-[#0d0e11]">
              {!videoListo ? (
                <button
                  type="button"
                  onClick={() => setVideoListo(true)}
                  aria-label="Reproducir video"
                  className="absolute inset-0 flex items-center justify-center"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/videos/vsl-poster.jpg"
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover opacity-85 transition-[opacity,transform] duration-500 group-hover:scale-[1.02] group-hover:opacity-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-black/45" />
                  {/* viñeta sutil en los bordes, aporta el "encuadre" que le
                      faltaba al video pelado */}
                  <div
                    className="absolute inset-0"
                    style={{ boxShadow: "inset 0 0 70px 20px rgba(0,0,0,0.55)" }}
                  />
                  <span className="relative flex h-[76px] w-[76px] items-center justify-center rounded-full bg-[var(--color-accent)] shadow-[0_8px_30px_-4px_rgba(184,147,90,0.6),0_0_0_10px_rgba(184,147,90,0.12)] transition-transform duration-300 group-hover:scale-105">
                    <Play size={27} className="ml-1 fill-black text-black" />
                  </span>
                  <span className="absolute bottom-7 left-1/2 flex -translate-x-1/2 items-center gap-1.5 text-[13px] font-semibold text-white/85">
                    <span className="h-1 w-1 rounded-full bg-[var(--color-accent-hover)]" />
                    2 minutos
                  </span>
                </button>
              ) : (
                <div
                  className="group/player relative h-full w-full"
                  onContextMenu={(e) => e.preventDefault()}
                >
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    controlsList="nodownload noremoteplayback noplaybackrate"
                    disablePictureInPicture
                    disableRemotePlayback
                    onContextMenu={(e) => e.preventDefault()}
                    onDragStart={(e) => e.preventDefault()}
                    onClick={() => {
                      const el = videoRef.current;
                      if (!el) return;
                      if (el.paused) el.play();
                      else el.pause();
                    }}
                    onPlay={() => setVideoPlaying(true)}
                    onPause={() => setVideoPlaying(false)}
                    onTimeUpdate={(e) => {
                      const el = e.currentTarget;
                      setVideoProgress(el.duration ? el.currentTime / el.duration : 0);
                    }}
                    className="h-full w-full select-none object-cover [-webkit-touch-callout:none]"
                    poster="/videos/vsl-poster.jpg"
                  >
                    <source src="/videos/vsl-web.mp4" type="video/mp4" />
                  </video>

                  {/* marca de agua quemada en el DOM (además de la que va
                      grabada en los píxeles del archivo) — capa extra si
                      alguien intenta recortarla en un editor rápido */}
                  <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/35 px-2.5 py-1 text-[10.5px] font-semibold tracking-wide text-white/70 backdrop-blur-sm">
                    @franco.delavegaa
                  </span>

                  {/* controles propios: nada de menú nativo del navegador
                      (clic derecho → guardar video no aparece), sin botón de
                      descarga. No frena a quien abre devtools, pero sí al
                      99% que solo prueba clic derecho. */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-black/70 to-transparent px-4 pb-4 pt-10 opacity-0 transition-opacity duration-200 group-hover/player:opacity-100">
                    <button
                      type="button"
                      aria-label={videoPlaying ? "Pausar" : "Reproducir"}
                      onClick={(e) => {
                        e.stopPropagation();
                        const el = videoRef.current;
                        if (!el) return;
                        if (el.paused) el.play();
                        else el.pause();
                      }}
                      className="pointer-events-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white/25"
                    >
                      {videoPlaying ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
                    </button>
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/20">
                      <div
                        className="h-full rounded-full bg-[var(--color-accent)]"
                        style={{ width: `${videoProgress * 100}%` }}
                      />
                    </div>
                    <button
                      type="button"
                      aria-label={videoMuted ? "Activar sonido" : "Silenciar"}
                      onClick={(e) => {
                        e.stopPropagation();
                        const el = videoRef.current;
                        if (!el) return;
                        el.muted = !el.muted;
                        setVideoMuted(el.muted);
                      }}
                      className="pointer-events-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white/25"
                    >
                      {videoMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ─────────── 3. Cierre con agenda — mismo calendario existente, sin tocar su lógica.
          Mismo sistema oscuro que el resto de la página: se restyleó el envoltorio
          (header duplicado afuera, tarjeta clara reemplazada por vidrio oscuro),
          la lógica de BookingCalendar/handleSubmit/pasos no se tocó. ─────────── */}
      <section className="relative z-10">
        {/* separador: línea con brillo dorado al centro en vez de un corte duro */}
        <div className="mx-auto h-px max-w-md bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        {/* barra de progreso de los 3 pasos */}
        <div className="mx-auto mt-14 max-w-2xl px-6 sm:mt-20 md:px-10">
          <div className="flex gap-1.5">
            {["slot", "form", "done"].map((s, i) => (
              <div key={s} className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-[var(--color-accent)]"
                  initial={false}
                  animate={{ width: i <= stepIndex ? "100%" : "0%" }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            ))}
          </div>
        </div>

        <main className="relative mx-auto max-w-2xl overflow-hidden px-6 py-8 sm:py-12 md:px-10 md:py-16">
          <div
            className="pointer-events-none absolute -top-24 left-1/2 h-[26rem] w-[36rem] -translate-x-1/2 opacity-[0.1] blur-3xl"
            style={{ background: "radial-gradient(ellipse, var(--color-accent) 0%, transparent 70%)" }}
            aria-hidden
          />
          <Reveal>
            <span className="relative text-[11.5px] font-semibold uppercase tracking-[0.1em] text-[var(--color-accent-hover)] sm:text-[13px]">
              Si ya lo viste, este es el siguiente paso
            </span>
          </Reveal>
          <Reveal delay={0.06} className="relative mt-3">
            <h1 className="text-[1.7rem] font-bold leading-[1.15] tracking-tight text-white sm:text-[2.2rem] md:text-[2.6rem]">
              Elegí un horario para tu llamada
            </h1>
          </Reveal>
          <Reveal delay={0.1} className="relative mt-3">
            <p className="text-[14.5px] leading-relaxed text-white/55 sm:text-[16.5px]">
              Es una reunión de 40 minutos. Te recomendamos conectarte desde una
              computadora para aprovecharla mejor. Los horarios se muestran en
              tu huso horario.
            </p>
          </Reveal>

          <AnimatePresence mode="wait">
            {step === "slot" && (
              <motion.div
                key="slot"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="relative mt-6 sm:mt-10"
              >
                <BookingCalendar
                  vendedorFijo={vendedorFijo}
                  onContinue={(sel) => {
                    setSelection(sel);
                    setStep("form");
                  }}
                />
              </motion.div>
            )}

            {step === "form" && selection && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="mt-10"
              >
                <button
                  type="button"
                  onClick={() => setStep("slot")}
                  className="mb-6 flex items-center gap-1.5 text-[14px] font-medium text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-primary)]"
                >
                  <ChevronLeft size={15} /> Cambiar horario
                </button>

                <div className="mb-6 rounded-xl border border-[var(--color-accent)]/25 bg-[var(--color-accent-muted)] px-4 py-3 text-[15px] font-semibold text-[var(--color-accent-hover)]">
                  {DIA_LABEL[selection.date.getDay()]} {selection.date.getDate()} de{" "}
                  {MES_LABEL[selection.date.getMonth()]} · {convertSlot(selection.date, selection.hour, selection.tz).time}hs
                  {" "}({PAISES.find((p) => p.tz === selection.tz)?.label})
                </div>

                <div className="flex flex-col gap-4">
                  {/* honeypot: oculto para personas, los bots de autocompletado lo llenan igual */}
                  <input
                    type="text"
                    name="sitioWeb"
                    value={sitioWeb}
                    onChange={(e) => setSitioWeb(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden opacity-0"
                  />
                  <div>
                    <label className="mb-1.5 block text-[13px] font-semibold uppercase tracking-[0.05em] text-[var(--color-text-muted)]">
                      Nombre
                    </label>
                    <input
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 text-[15.5px] outline-none transition-colors focus:border-[var(--color-accent)]"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[13px] font-semibold uppercase tracking-[0.05em] text-[var(--color-text-muted)]">
                      WhatsApp
                    </label>
                    <input
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(sanitizeWhatsapp(e.target.value))}
                      placeholder="+54 9 11 1234 5678"
                      className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 text-[15.5px] outline-none transition-colors focus:border-[var(--color-accent)]"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[13px] font-semibold uppercase tracking-[0.05em] text-[var(--color-text-muted)]">
                      ¿Algo que quieras contarnos antes de la llamada? (opcional)
                    </label>
                    <textarea
                      value={mensaje}
                      onChange={(e) => setMensaje(e.target.value)}
                      rows={3}
                      className="w-full resize-none rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 text-[15.5px] outline-none transition-colors focus:border-[var(--color-accent)]"
                    />
                  </div>
                </div>

                {slotTaken && (
                  <p className="mt-4 text-[14px] font-medium text-red-400">
                    Justo se ocupó ese horario. Volvé atrás y elegí otro.
                  </p>
                )}
                {submitError && (
                  <p className="mt-4 text-[14px] font-medium text-red-400">
                    Hubo un error al confirmar. Probá de nuevo en un momento.
                  </p>
                )}

                <button
                  type="button"
                  disabled={!nombre.trim() || !isValidWhatsapp(whatsapp) || submitting}
                  onClick={handleSubmit}
                  className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-6 py-3.5 text-[16px] font-semibold text-white transition-opacity hover:bg-[var(--color-accent-hover)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {submitting && <Loader2 size={16} className="animate-spin" />}
                  Confirmar reserva
                </button>
              </motion.div>
            )}

            {step === "done" && selection && (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="relative mt-8 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-8 text-center sm:mt-10 sm:p-10"
              >
                <div
                  className="pointer-events-none absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.16] blur-2xl"
                  style={{ background: "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)" }}
                  aria-hidden
                />
                <div className="relative mx-auto flex h-14 w-14 items-center justify-center">
                  <motion.span
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--color-accent)] bg-[var(--color-accent-muted)]"
                    style={{ boxShadow: "0 0 0 6px color-mix(in srgb, var(--color-accent) 10%, transparent)" }}
                  >
                    <Check size={22} className="text-[var(--color-accent)]" />
                  </motion.span>
                  <ConfettiBurst />
                </div>
                <h2 className="relative mt-6 text-[20px] font-bold sm:text-[22px]">¡Listo, quedó agendado!</h2>
                <p className="relative mt-2 text-[15px] text-[var(--color-text-secondary)] sm:text-[16px]">
                  {DIA_LABEL[selection.date.getDay()]} {selection.date.getDate()} de{" "}
                  {MES_LABEL[selection.date.getMonth()]} a las {convertSlot(selection.date, selection.hour, selection.tz).time}hs
                  {" "}({PAISES.find((p) => p.tz === selection.tz)?.label})
                </p>
                <p className="relative mt-4 text-[14px] text-[var(--color-text-muted)] sm:text-[14.5px]">
                  Te vamos a escribir por WhatsApp con el link para la llamada.
                </p>
                <a
                  href={googleCalendarLink(selection.date, selection.hour)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative mt-5 inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-base)] px-4 py-2.5 text-[14px] font-semibold text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-accent)]"
                >
                  <CalendarPlus size={16} className="text-[var(--color-accent)]" />
                  Agregar a mi calendario
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </section>
    </div>
  );
}
