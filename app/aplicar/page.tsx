"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CalendarPlus, Check, ChevronLeft, Loader2, Pause, Play, Volume2, VolumeX } from "lucide-react";
import Reveal from "@/components/Reveal";
import Logo from "@/components/Logo";
import BookingCalendar, { type BookingSelection } from "@/components/BookingCalendar";
import { DIA_LABEL, MES_LABEL, PAISES, VENDEDOR_UNICO, convertSlot, googleCalendarLink, toDateKey } from "@/lib/booking";
import { esEmailValido, esWhatsappValido, respuestaCompleta, textoValido, visibles, type Resp } from "@/lib/aplicarFlow";
import { sanitizeWhatsapp } from "@/lib/booking";

/**
 * /aplicar: el filtro antes de la llamada (reemplaza al WhatsApp de la bio).
 * video → datos de contacto → preguntas con ramas → el SERVIDOR decide.
 * Si califica: calendario y reserva (token firmado). Si no: mensaje amable, sin
 * calendario y sin poder reintentar con otras respuestas (bloqueo 30 días).
 * Esta página no decide nada: solo muestra lo que /api/aplicar/* le devuelve.
 */

type Categoria = "trabajo" | "momento" | "perfil";
type Fase = "cargando" | "video" | "datos" | "preguntas" | "evaluando" | "no" | "agenda" | "confirmar" | "listo";

const INSTAGRAM = "https://www.instagram.com/franco.de.la.vega/";

export default function AplicarPage() {
  const [fase, setFase] = useState<Fase>("cargando");
  const [idx, setIdx] = useState(0);
  const [resp, setResp] = useState<Resp>({});
  const [categoria, setCategoria] = useState<Categoria>("perfil");
  const [hasta, setHasta] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [errorEval, setErrorEval] = useState(false);

  const [nombre, setNombre] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [sitioWeb, setSitioWeb] = useState(""); // honeypot
  const [verificando, setVerificando] = useState(false);

  const [selection, setSelection] = useState<BookingSelection | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [slotTaken, setSlotTaken] = useState(false);

  const [videoListo, setVideoListo] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const filtroRef = useRef<HTMLDivElement>(null);

  const lista = visibles(resp);
  const p = lista[Math.min(idx, lista.length - 1)];
  const valor = resp[p.id] ?? "";
  const paso = fase === "cargando" || fase === "video" ? 0 : fase === "datos" || fase === "preguntas" || fase === "evaluando" || fase === "no" ? 1 : 2;

  // Al abrir: ¿este navegador ya fue descartado o ya calificó?
  useEffect(() => {
    fetch("/api/aplicar/estado")
      .then((r) => r.json())
      .then((d) => {
        if (d.estado === "no") {
          setCategoria(d.categoria);
          setHasta(d.hasta);
          setFase("no");
        } else {
          setFase("video");
        }
      })
      .catch(() => setFase("video"));
  }, []);

  useEffect(() => {
    if (fase === "cargando" || fase === "video") return;
    const t = setTimeout(() => filtroRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
    return () => clearTimeout(t);
  }, [fase, idx]);

  const datosOk = nombre.trim().length >= 3 && esWhatsappValido(whatsapp) && esEmailValido(email);

  async function empezar() {
    if (!datosOk) return;
    setVerificando(true);
    try {
      const r = await fetch("/api/aplicar/estado", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ whatsapp, email }),
      }).then((x) => x.json());
      if (r.estado === "no") {
        setCategoria(r.categoria);
        setHasta(r.hasta);
        setFase("no");
        return;
      }
    } catch {
      /* si falla la consulta, igual evaluamos al final: el servidor vuelve a chequear */
    } finally {
      setVerificando(false);
    }
    setIdx(0);
    setFase("preguntas");
  }

  async function enviar(respuestas: Resp) {
    setFase("evaluando");
    setErrorEval(false);
    try {
      const r = await fetch("/api/aplicar/evaluar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, whatsapp, email, sitioWeb, respuestas: soloVisibles(respuestas) }),
      }).then((x) => {
        if (!x.ok) throw new Error("eval");
        return x.json();
      });
      if (r.estado === "si") {
        setToken(r.token);
        setFase("agenda");
      } else {
        setCategoria(r.categoria ?? "perfil");
        setHasta(r.hasta ?? null);
        setFase("no");
      }
    } catch {
      setErrorEval(true);
      setFase("preguntas");
    }
  }

  const soloVisibles = (r: Resp): Resp => Object.fromEntries(visibles(r).map((q) => [q.id, r[q.id] ?? ""]));

  function avanzar(respuestas: Resp = resp) {
    const l = visibles(respuestas);
    if (idx < l.length - 1) setIdx(idx + 1);
    else enviar(respuestas);
  }

  function elegir(opcion: string) {
    const nuevas = { ...resp, [p.id]: opcion };
    setResp(nuevas);
    setTimeout(() => avanzar(nuevas), 280);
  }

  async function confirmar() {
    if (!selection || !token) return;
    setSubmitting(true);
    setSubmitError(false);
    setSlotTaken(false);
    try {
      const res = await fetch("/api/aplicar/agendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, date: toDateKey(selection.date), hour: selection.hour }),
      });
      if (res.status === 409) {
        setSlotTaken(true);
        return;
      }
      if (!res.ok) throw new Error("submit_failed");
      setFase("listo");
    } catch {
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  }

  const togglePlay = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) el.play();
    else el.pause();
  };

  const fechaHasta = hasta ? new Date(hasta).toLocaleDateString("es-AR", { day: "numeric", month: "long" }) : null;

  return (
    <div
      className="relative min-h-screen overflow-x-hidden bg-[#18191d] text-[var(--color-text-primary)]"
      style={
        {
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
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(184,147,90,0.06) 0%, transparent 55%)" }}
        aria-hidden
      />

      {/* ─────────── 1. Intro ─────────── */}
      <header className="relative z-10 flex items-center justify-center px-6 pt-10 sm:pt-14">
        <Logo className="h-8 w-8 text-[var(--color-accent)]" />
      </header>

      <section className="relative z-10 px-5 pb-8 pt-8 sm:px-8 sm:pt-12">
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-[36rem] w-[56rem] -translate-x-1/2 -translate-y-1/3 opacity-[0.14] blur-3xl"
          style={{ background: "radial-gradient(ellipse, var(--color-accent) 0%, transparent 70%)" }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-xl text-center">
          <Reveal>
            <span className="text-[11.5px] font-semibold uppercase tracking-[0.2em] text-[var(--color-text-secondary)] sm:text-[12px]">
              Formación en ingeniería comercial
            </span>
          </Reveal>
          <Reveal delay={0.08} className="mt-4">
            <h1 className="text-[2.1rem] font-bold leading-[1.08] tracking-[-0.02em] text-white sm:text-[3rem]">
              Antes de agendar,{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(100deg, var(--color-accent-hover) 0%, var(--color-accent) 55%, #8a6c3f 100%)" }}
              >
                mirá este video.
              </span>
            </h1>
          </Reveal>
          <Reveal delay={0.16} className="mt-5">
            <p className="mx-auto max-w-md text-[15.5px] leading-relaxed text-white/60 sm:text-[17px]">
              En un minuto te contamos qué es, para quién es y cómo funciona. Después respondés unas preguntas con calma y, si el programa es para vos,
              elegís el horario de tu llamada.
            </p>
          </Reveal>

          <Reveal delay={0.24} className="mt-8">
            <ol className="mx-auto flex items-center justify-center gap-1.5 whitespace-nowrap text-[10.5px] font-semibold uppercase tracking-[0.08em] sm:gap-2 sm:text-[12px] sm:tracking-[0.12em]">
              {["Video", "Preguntas", "Llamada"].map((t, i) => (
                <li key={t} className="flex items-center gap-1.5 sm:gap-2">
                  <span
                    className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 transition-colors duration-300 sm:px-3 ${
                      i === paso
                        ? "border-[var(--color-accent)]/60 bg-[var(--color-accent-muted)] text-[var(--color-accent-hover)]"
                        : i < paso
                          ? "border-white/10 text-white/70"
                          : "border-white/10 text-white/35"
                    }`}
                  >
                    {i < paso ? <Check size={12} className="text-[var(--color-accent)]" /> : <span className="tabular-nums">{i + 1}</span>}
                    {t}
                  </span>
                  {i < 2 && <span className="h-px w-2 bg-white/15 sm:w-3" />}
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* ─────────── 2. Video ─────────── */}
      <section className="relative z-10 px-5 pb-16 sm:px-8 sm:pb-24">
        <motion.div
          className="pointer-events-none absolute left-1/2 top-[8%] h-[28rem] w-[28rem] -translate-x-[62%] rounded-full opacity-[0.15] blur-[90px]"
          style={{ background: "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)" }}
          animate={{ opacity: [0.11, 0.19, 0.11] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        />
        <Reveal delay={0.1} className="relative mx-auto max-w-[400px]">
          <div
            className="relative rounded-[32px] p-[1.5px] shadow-[0_60px_140px_-40px_rgba(184,147,90,0.35),0_30px_70px_-30px_rgba(0,0,0,0.9)]"
            style={{
              background:
                "linear-gradient(160deg, rgba(203,168,115,0.55) 0%, rgba(184,147,90,0.12) 28%, rgba(255,255,255,0.06) 50%, rgba(184,147,90,0.35) 100%)",
            }}
          >
            <div className="group relative aspect-[9/16] w-full overflow-hidden rounded-[30px] bg-[#0d0e11]">
              {!videoListo ? (
                <button type="button" onClick={() => setVideoListo(true)} aria-label="Reproducir video" className="absolute inset-0 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/videos/vsl-v2-poster.jpg"
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover opacity-90 transition-[opacity,transform] duration-500 group-hover:scale-[1.02] group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/35" />
                  <span className="relative flex h-[76px] w-[76px] items-center justify-center rounded-full bg-[var(--color-accent)] shadow-[0_8px_30px_-4px_rgba(184,147,90,0.6),0_0_0_10px_rgba(184,147,90,0.12)] transition-transform duration-300 group-hover:scale-105">
                    <Play size={27} className="ml-1 fill-black text-black" />
                  </span>
                  <span className="absolute bottom-7 left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap text-[13px] font-semibold text-white/85">
                    <span className="h-1 w-1 rounded-full bg-[var(--color-accent-hover)]" />
                    Con sonido · 1 minuto
                  </span>
                </button>
              ) : (
                <div className="group/player relative h-full w-full" onContextMenu={(e) => e.preventDefault()}>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    controlsList="nodownload noremoteplayback noplaybackrate"
                    disablePictureInPicture
                    disableRemotePlayback
                    onContextMenu={(e) => e.preventDefault()}
                    onDragStart={(e) => e.preventDefault()}
                    onClick={togglePlay}
                    onPlay={() => setVideoPlaying(true)}
                    onPause={() => setVideoPlaying(false)}
                    onTimeUpdate={(e) => {
                      const el = e.currentTarget;
                      setVideoProgress(el.duration ? el.currentTime / el.duration : 0);
                    }}
                    className="h-full w-full select-none object-cover [-webkit-touch-callout:none]"
                    poster="/videos/vsl-v2-poster.jpg"
                  >
                    <source src="/videos/vsl-v2.mp4" type="video/mp4" />
                  </video>

                  {!videoPlaying && (
                    <button type="button" onClick={togglePlay} aria-label="Reproducir" className="absolute inset-0 flex items-center justify-center bg-black/25">
                      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-accent)]/90">
                        <Play size={24} className="ml-1 fill-black text-black" />
                      </span>
                    </button>
                  )}

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-black/70 to-transparent px-4 pb-4 pt-10">
                    <button
                      type="button"
                      aria-label={videoPlaying ? "Pausar" : "Reproducir"}
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePlay();
                      }}
                      className="pointer-events-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white/25"
                    >
                      {videoPlaying ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
                    </button>
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/20">
                      <div className="h-full rounded-full bg-[var(--color-accent)]" style={{ width: `${videoProgress * 100}%` }} />
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

      {/* ─────────── 3. Filtro + agenda ─────────── */}
      <section className="relative z-10 pb-24">
        <div className="mx-auto h-px max-w-md bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        <div ref={filtroRef} className="relative mx-auto max-w-xl scroll-mt-6 px-5 pt-14 sm:px-8 sm:pt-20">
          <div
            className="pointer-events-none absolute -top-10 left-1/2 h-[24rem] w-[34rem] -translate-x-1/2 opacity-[0.08] blur-3xl"
            style={{ background: "radial-gradient(ellipse, var(--color-accent) 0%, transparent 70%)" }}
            aria-hidden
          />

          <AnimatePresence mode="wait">
            {fase === "cargando" && <motion.div key="cargando" className="h-40" />}

            {/* ── presentación del filtro ── */}
            {fase === "video" && (
              <motion.div key="intro" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }} className="relative text-center">
                <span className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-[var(--color-accent-hover)] sm:text-[12.5px]">Paso 2 de 3</span>
                <h2 className="mt-3 text-[1.7rem] font-bold leading-[1.15] tracking-tight text-white sm:text-[2.2rem]">Ahora, contanos sobre vos</h2>
                <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-white/55 sm:text-[16.5px]">
                  Leemos cada respuesta con atención antes de ofrecerte una llamada. Respondé con calma y sinceridad, y sin apuro: pensá bien lo que escribís.
                </p>
                <p className="mx-auto mt-3 max-w-md text-[13.5px] leading-relaxed text-white/40">
                  Solo se puede completar una vez cada 30 días, así que tomate el tiempo que necesites.
                </p>
                <button
                  type="button"
                  onClick={() => setFase("datos")}
                  className="mx-auto mt-8 flex items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-7 py-3.5 text-[16px] font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)]"
                >
                  Ya vi el video, empezar <ArrowRight size={17} />
                </button>
              </motion.div>
            )}

            {/* ── datos de contacto ── */}
            {fase === "datos" && (
              <motion.div key="datos" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }} className="relative">
                <span className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-[var(--color-accent-hover)] sm:text-[12.5px]">Para empezar</span>
                <h2 className="mt-3 text-[1.6rem] font-bold leading-[1.15] tracking-tight text-white sm:text-[2rem]">¿Con quién estamos hablando?</h2>
                <p className="mt-2 text-[14.5px] leading-relaxed text-white/50 sm:text-[15.5px]">Con estos datos te contactamos para la llamada.</p>
                <div className="mt-6 flex flex-col gap-4">
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
                  {[
                    { l: "Nombre y apellido", v: nombre, set: setNombre, ph: "", type: "text", ac: "name" },
                    { l: "WhatsApp (con código de país)", v: whatsapp, set: (x: string) => setWhatsapp(sanitizeWhatsapp(x)), ph: "+54 9 11 1234 5678", type: "tel", ac: "tel" },
                    { l: "Email", v: email, set: setEmail, ph: "tu@email.com", type: "email", ac: "email" },
                  ].map((f) => (
                    <div key={f.l}>
                      <label className="mb-1.5 block text-[13px] font-semibold uppercase tracking-[0.05em] text-[var(--color-text-muted)]">{f.l}</label>
                      <input
                        type={f.type}
                        autoComplete={f.ac}
                        value={f.v}
                        placeholder={f.ph}
                        onChange={(e) => f.set(e.target.value)}
                        className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 text-[15.5px] text-white outline-none transition-colors placeholder:text-white/30 focus:border-[var(--color-accent)]"
                      />
                    </div>
                  ))}
                </div>
                {!datosOk && (nombre || whatsapp || email) && (
                  <p className="mt-4 text-[13px] text-white/45">
                    {nombre.trim().length < 3
                      ? "Escribí tu nombre y apellido."
                      : !esWhatsappValido(whatsapp)
                        ? "Revisá tu WhatsApp: tiene que incluir el código de país y el número completo."
                        : "Revisá tu email: parece que falta algo."}
                  </p>
                )}
                <button
                  type="button"
                  disabled={!datosOk || verificando}
                  onClick={empezar}
                  className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-6 py-3.5 text-[16px] font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)] disabled:cursor-not-allowed disabled:opacity-35"
                >
                  {verificando ? <Loader2 size={16} className="animate-spin" /> : null}
                  Continuar <ArrowRight size={17} />
                </button>
              </motion.div>
            )}

            {/* ── preguntas, de a una ── */}
            {fase === "preguntas" && (
              <motion.div key={`q-${p.id}`} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }} className="relative">
                <div className="flex items-center justify-between text-[12px] font-semibold uppercase tracking-[0.12em] text-white/45">
                  <span>
                    Pregunta <span className="text-[var(--color-accent-hover)]">{idx + 1}</span> de {lista.length}
                  </span>
                  {idx > 0 ? (
                    <button type="button" onClick={() => setIdx(idx - 1)} className="flex items-center gap-1 normal-case tracking-normal text-white/50 transition-colors hover:text-white">
                      <ChevronLeft size={14} /> Atrás
                    </button>
                  ) : (
                    <button type="button" onClick={() => setFase("datos")} className="flex items-center gap-1 normal-case tracking-normal text-white/50 transition-colors hover:text-white">
                      <ChevronLeft size={14} /> Mis datos
                    </button>
                  )}
                </div>
                <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full bg-[var(--color-accent)]"
                    initial={false}
                    animate={{ width: `${(idx / lista.length) * 100}%` }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>

                <h2 className="mt-8 text-[1.45rem] font-bold leading-[1.25] tracking-tight text-white sm:text-[1.85rem]">{p.titulo}</h2>
                {p.ayuda && <p className="mt-2 text-[14.5px] leading-relaxed text-white/50 sm:text-[15.5px]">{p.ayuda}</p>}
                {errorEval && <p className="mt-3 text-[14px] font-medium text-red-400">No pudimos enviar tus respuestas. Revisá tu conexión y volvé a intentar.</p>}

                {p.opciones && (
                  <div className="mt-6 flex flex-col gap-2.5">
                    {p.opciones.map((o) => {
                      const on = valor === o;
                      return (
                        <button
                          key={o}
                          type="button"
                          onClick={() => elegir(o)}
                          className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-[15.5px] font-medium transition-colors sm:text-[16px] ${
                            on ? "border-[var(--color-accent)] bg-[var(--color-accent-muted)] text-white" : "border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-white/85 hover:border-white/30"
                          }`}
                        >
                          <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${on ? "border-[var(--color-accent)] bg-[var(--color-accent)]" : "border-white/30"}`}>
                            {on && <Check size={12} className="text-black" strokeWidth={3} />}
                          </span>
                          {o}
                        </button>
                      );
                    })}
                  </div>
                )}

                {!p.opciones && <TextoLibre p={p} valor={valor} onChange={(t) => setResp({ ...resp, [p.id]: t })} onNext={() => avanzar()} esUltima={idx === lista.length - 1} />}
              </motion.div>
            )}

            {/* ── evaluando ── */}
            {fase === "evaluando" && (
              <motion.div key="evaluando" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative py-16 text-center">
                <Loader2 size={26} className="mx-auto animate-spin text-[var(--color-accent)]" />
                <p className="mt-5 text-[16px] font-medium text-white/80">Estamos revisando tus respuestas…</p>
              </motion.div>
            )}

            {/* ── no califica / ya aplicó ── */}
            {fase === "no" && (
              <motion.div key="no" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-8 text-center sm:p-10">
                <div className="pointer-events-none absolute left-1/2 top-0 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.12] blur-2xl" style={{ background: "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)" }} aria-hidden />
                <span className="relative text-[11.5px] font-semibold uppercase tracking-[0.14em] text-[var(--color-accent-hover)]">Gracias por tu tiempo</span>
                {categoria === "trabajo" ? (
                  <>
                    <h2 className="relative mt-4 text-[1.5rem] font-bold leading-[1.2] text-white sm:text-[1.8rem]">Esto no es una bolsa de trabajo.</h2>
                    <p className="relative mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-white/60 sm:text-[16px]">
                      Somos una formación: primero te preparamos en el área comercial y, al terminar, te conectamos con empresas. No conseguimos empleo sin esa formación,
                      así que este programa no es lo que estás buscando por ahora.
                    </p>
                  </>
                ) : categoria === "momento" ? (
                  <>
                    <h2 className="relative mt-4 text-[1.5rem] font-bold leading-[1.2] text-white sm:text-[1.8rem]">Hoy no es el momento, y está bien.</h2>
                    <p className="relative mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-white/60 sm:text-[16px]">
                      La formación es intensiva y requiere tiempo y dinero. Preferimos que llegues cuando puedas aprovecharla al máximo.
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="relative mt-4 text-[1.5rem] font-bold leading-[1.2] text-white sm:text-[1.8rem]">Por ahora, sentimos que no es el momento ideal.</h2>
                    <p className="relative mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-white/60 sm:text-[16px]">
                      Revisamos tu solicitud con atención y, por ahora, no vemos que el programa sea el paso indicado para vos. Te agradecemos la sinceridad.
                    </p>
                  </>
                )}
                <p className="relative mx-auto mt-5 max-w-md text-[13.5px] leading-relaxed text-white/40">
                  Si tu situación cambia, vas a poder volver a aplicar{fechaHasta ? ` a partir del ${fechaHasta}` : " dentro de 30 días"}. Cada persona puede completar la solicitud una vez cada 30 días.
                </p>
                <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="relative mt-6 inline-flex rounded-xl border border-[var(--color-border)] px-5 py-2.5 text-[14.5px] font-semibold text-white/85 transition-colors hover:border-[var(--color-accent)]">
                  Seguir aprendiendo gratis en Instagram
                </a>
              </motion.div>
            )}

            {/* ── agenda (solo si calificó) ── */}
            {fase === "agenda" && (
              <motion.div key="agenda" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }} className="relative">
                <span className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-[var(--color-accent-hover)] sm:text-[12.5px]">Paso 3 de 3 · Tu perfil encaja</span>
                <h2 className="mt-3 text-[1.7rem] font-bold leading-[1.15] tracking-tight text-white sm:text-[2.2rem]">Elegí el horario de tu llamada</h2>
                <p className="mt-3 text-[14.5px] leading-relaxed text-white/55 sm:text-[16px]">
                  Es una reunión de 2 horas por videollamada, así que reservá un horario en el que puedas estar con tiempo y sin interrupciones. Te recomendamos conectarte desde una computadora. Los horarios se muestran en tu huso horario.
                </p>
                <div className="mt-6 sm:mt-8">
                  <BookingCalendar
                    vendedorFijo={VENDEDOR_UNICO}
                    onContinue={(sel) => {
                      setSelection(sel);
                      setFase("confirmar");
                    }}
                  />
                </div>
              </motion.div>
            )}

            {fase === "confirmar" && selection && (
              <motion.div key="confirmar" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }} className="relative">
                <button type="button" onClick={() => setFase("agenda")} className="mb-6 flex items-center gap-1.5 text-[14px] font-medium text-[var(--color-text-muted)] transition-colors hover:text-white">
                  <ChevronLeft size={15} /> Cambiar horario
                </button>
                <h2 className="text-[1.6rem] font-bold leading-[1.15] tracking-tight text-white sm:text-[2rem]">Confirmá tu llamada</h2>
                <div className="my-6 rounded-xl border border-[var(--color-accent)]/25 bg-[var(--color-accent-muted)] px-4 py-3 text-[15px] font-semibold text-[var(--color-accent-hover)]">
                  {DIA_LABEL[selection.date.getDay()]} {selection.date.getDate()} de {MES_LABEL[selection.date.getMonth()]} · {convertSlot(selection.date, selection.hour, selection.tz).time}hs (
                  {PAISES.find((x) => x.tz === selection.tz)?.label})
                </div>
                <p className="text-[14.5px] leading-relaxed text-white/55">
                  Te vamos a escribir por WhatsApp al número que dejaste, con el link de la videollamada. Si no vas a poder asistir, avisanos para liberar el lugar.
                </p>
                {slotTaken && <p className="mt-4 text-[14px] font-medium text-red-400">Justo se ocupó ese horario. Volvé atrás y elegí otro.</p>}
                {submitError && <p className="mt-4 text-[14px] font-medium text-red-400">Hubo un error al confirmar. Probá de nuevo en un momento.</p>}
                <button
                  type="button"
                  disabled={submitting}
                  onClick={confirmar}
                  className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-6 py-3.5 text-[16px] font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {submitting && <Loader2 size={16} className="animate-spin" />}
                  Confirmar mi llamada
                </button>
              </motion.div>
            )}

            {fase === "listo" && selection && (
              <motion.div key="listo" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-8 text-center sm:p-10">
                <div className="pointer-events-none absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.16] blur-2xl" style={{ background: "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)" }} aria-hidden />
                <motion.span
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[var(--color-accent)] bg-[var(--color-accent-muted)]"
                >
                  <Check size={22} className="text-[var(--color-accent)]" />
                </motion.span>
                <h2 className="relative mt-6 text-[20px] font-bold sm:text-[22px]">¡Listo, tu llamada quedó agendada!</h2>
                <p className="relative mt-2 text-[15px] text-[var(--color-text-secondary)] sm:text-[16px]">
                  {DIA_LABEL[selection.date.getDay()]} {selection.date.getDate()} de {MES_LABEL[selection.date.getMonth()]} a las {convertSlot(selection.date, selection.hour, selection.tz).time}hs (
                  {PAISES.find((x) => x.tz === selection.tz)?.label})
                </p>
                <p className="relative mt-4 text-[14px] text-[var(--color-text-muted)] sm:text-[14.5px]">
                  Te vamos a escribir por WhatsApp con el link de la llamada. Ya leímos tus respuestas, así que vamos directo a lo importante.
                </p>
                <a
                  href={googleCalendarLink(selection.date, selection.hour)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative mt-5 inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-base)] px-4 py-2.5 text-[14px] font-semibold text-white transition-colors hover:border-[var(--color-accent)]"
                >
                  <CalendarPlus size={16} className="text-[var(--color-accent)]" />
                  Agregar a mi calendario
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}

/** Campo de texto con mínimo de caracteres y aviso claro de por qué todavía no deja avanzar. */
function TextoLibre({
  p,
  valor,
  onChange,
  onNext,
  esUltima,
}: {
  p: { id: string; min?: number; placeholder?: string };
  valor: string;
  onChange: (t: string) => void;
  onNext: () => void;
  esUltima: boolean;
}) {
  const min = p.min ?? 0;
  const n = valor.trim().length;
  const falta = Math.max(0, min - n);
  const ok = textoValido(valor, min);
  const pct = Math.min(100, (n / min) * 100);

  let mensaje: string;
  let tono: "neutro" | "avance" | "ok" | "alerta" = "neutro";
  if (n === 0) {
    mensaje = `Escribí tu respuesta con detalle. Necesitamos al menos ${min} caracteres: una respuesta de una palabra no alcanza.`;
  } else if (falta > 0) {
    mensaje = n < min / 2 ? `Contanos un poco más. Te faltan ${falta} caracteres.` : `Desarrollá un poco más la idea. Te faltan ${falta} caracteres.`;
    tono = "avance";
  } else if (!ok) {
    mensaje = "Llegaste al mínimo, pero necesitamos una respuesta real, con tus palabras y sin repetir texto.";
    tono = "alerta";
  } else {
    mensaje = "Perfecto, ya podés continuar.";
    tono = "ok";
  }

  return (
    <div className="mt-5">
      <textarea
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        placeholder={p.placeholder}
        rows={6}
        className="w-full resize-none rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 text-[15.5px] leading-relaxed text-white outline-none transition-colors placeholder:text-white/30 focus:border-[var(--color-accent)]"
      />
      <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-white/10">
        <div className={`h-full rounded-full transition-all duration-300 ${ok ? "bg-[var(--color-accent-hover)]" : "bg-white/35"}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-2 flex items-start justify-between gap-4">
        <p
          className={`text-[13px] leading-snug ${
            tono === "ok" ? "text-[var(--color-accent-hover)]" : tono === "alerta" ? "text-red-400" : tono === "avance" ? "text-white/65" : "text-white/45"
          }`}
        >
          {mensaje}
        </p>
        <span className="shrink-0 text-[12px] tabular-nums text-white/35">
          {n}/{min}
        </span>
      </div>
      <button
        type="button"
        disabled={!ok}
        onClick={onNext}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-6 py-3.5 text-[16px] font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)] disabled:cursor-not-allowed disabled:opacity-35"
      >
        {esUltima ? "Enviar mis respuestas" : "Siguiente"} <ArrowRight size={17} />
      </button>
    </div>
  );
}
