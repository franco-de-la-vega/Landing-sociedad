"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarPlus, Check, ChevronLeft, ChevronRight, Globe, Loader2 } from "lucide-react";
import Reveal from "@/components/Reveal";
import Logo from "@/components/Logo";

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

const HORAS = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
const ARGENTINA_TZ = "America/Argentina/Buenos_Aires";

const PAISES = [
  { label: "Argentina", tz: "America/Argentina/Buenos_Aires" },
  { label: "México", tz: "America/Mexico_City" },
  { label: "Colombia", tz: "America/Bogota" },
  { label: "Perú", tz: "America/Lima" },
  { label: "Chile", tz: "America/Santiago" },
  { label: "Uruguay", tz: "America/Montevideo" },
  { label: "Paraguay", tz: "America/Asuncion" },
  { label: "Bolivia", tz: "America/La_Paz" },
  { label: "Ecuador", tz: "America/Guayaquil" },
  { label: "Venezuela", tz: "America/Caracas" },
  { label: "República Dominicana", tz: "America/Santo_Domingo" },
  { label: "Panamá", tz: "America/Panama" },
  { label: "Estados Unidos (Este)", tz: "America/New_York" },
  { label: "España", tz: "Europe/Madrid" },
];

function detectDefaultTz(): string {
  try {
    const guess = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return PAISES.some((p) => p.tz === guess) ? guess : ARGENTINA_TZ;
  } catch {
    return ARGENTINA_TZ;
  }
}

// Convierte un slot definido en hora de Argentina (fecha + hora en punto)
// a como se ve ese mismo instante en el huso horario elegido por el lead.
function convertSlot(date: Date, hour: number, tz: string) {
  const artIso = `${toDateKey(date)}T${String(hour).padStart(2, "0")}:00:00-03:00`;
  const instant = new Date(artIso);
  const time = new Intl.DateTimeFormat("es-AR", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(instant);

  const localDateKey = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(instant); // "YYYY-MM-DD"
  const dayDiff =
    (new Date(localDateKey).getTime() - new Date(toDateKey(date)).getTime()) / 86400000;

  return { time, dayDiff };
}

function toDateKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// Se agenda de lunes a sábado. Tope: jueves 17/9 (el viernes 18 arranca el cohort).
const MAX_BOOKING_DATE = "2026-09-17";

// Link de "agregar a Google Calendar" sin autenticación: cada persona agrega
// el evento a SU propio calendario, nosotros no leemos ni tocamos nada.
function googleCalendarLink(date: Date, hour: number) {
  const start = new Date(`${toDateKey(date)}T${String(hour).padStart(2, "0")}:00:00-03:00`);
  const end = new Date(start.getTime() + 40 * 60000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: "Llamada con Instituto Latinoamericano de Formación Comercial",
    dates: `${fmt(start)}/${fmt(end)}`,
    details: "Reunión de 40 minutos. Te recomendamos conectarte desde una computadora.",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// Genera todos los días de Lunes a Sábado, agrupados por semana calendario
// (arranca siempre en el lunes de la semana actual, aunque algunos de esos
// días ya hayan pasado), hasta MAX_BOOKING_DATE. Así cada "página" de 6
// días es siempre una semana completa, prolija, sin desalinearse.
function businessDaysByWeek(): Date[] {
  const days: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const monday = new Date(today);
  const diffToMonday = (today.getDay() + 6) % 7; // Lun=0 ... Dom=6
  monday.setDate(monday.getDate() - diffToMonday);

  const maxDate = new Date(`${MAX_BOOKING_DATE}T00:00:00`);
  const cursor = new Date(monday);
  while (cursor <= maxDate) {
    if (cursor.getDay() !== 0) days.push(new Date(cursor)); // excluye domingo
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

const DIA_LABEL = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MES_LABEL = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
];

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
  const [tz, setTz] = useState(ARGENTINA_TZ);
  useEffect(() => setTz(detectDefaultTz()), []);
  const days = useMemo(() => businessDaysByWeek(), []);
  const [dayOffset, setDayOffset] = useState(0);
  const visibleDays = days.slice(dayOffset, dayOffset + 6);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [bookedHours, setBookedHours] = useState<number[]>([]);
  const [loadingHours, setLoadingHours] = useState(false);

  const [step, setStep] = useState<"slot" | "form" | "done">("slot");
  const [nombre, setNombre] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [sitioWeb, setSitioWeb] = useState(""); // honeypot: invisible para personas, los bots lo completan
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [slotTaken, setSlotTaken] = useState(false);

  useEffect(() => {
    if (!selectedDate) return;
    setLoadingHours(true);
    setSelectedHour(null);
    const vendedorParam = vendedorFijo ? `&vendedor=${encodeURIComponent(vendedorFijo)}` : "";
    fetch(`/api/agendar/availability?date=${toDateKey(selectedDate)}${vendedorParam}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) setBookedHours(data.bookedHours);
      })
      .finally(() => setLoadingHours(false));
  }, [selectedDate, vendedorFijo]);

  // "Hoy" y "hora actual" se calculan siempre en hora de Argentina, que es
  // el huso real de los turnos (h en HORAS es una hora de Argentina).
  const nowArgentina = new Date();
  const todayArgentinaKey = new Intl.DateTimeFormat("en-CA", {
    timeZone: ARGENTINA_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(nowArgentina);
  const currentArgentinaHour = parseInt(
    new Intl.DateTimeFormat("en-US", { timeZone: ARGENTINA_TZ, hour: "2-digit", hour12: false }).format(
      nowArgentina
    ),
    10
  );
  const isToday = selectedDate && toDateKey(selectedDate) === todayArgentinaKey;

  async function handleSubmit() {
    if (!selectedDate || selectedHour === null || !nombre.trim() || !whatsapp.trim()) return;
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
          date: toDateKey(selectedDate),
          hour: selectedHour,
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
    <div className="theme-light min-h-screen bg-[var(--color-bg-base)] text-[var(--color-text-primary)]">
      <header className="border-b border-[var(--color-border)] px-6 py-3.5 sm:py-4 md:px-10">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <Logo className="h-7 w-7 text-[var(--color-accent)] sm:h-8 sm:w-8" />
          <span className="text-[15px] font-semibold tracking-tight sm:text-[16.5px]">Agendar una llamada</span>
        </div>
      </header>

      {/* barra de progreso de los 3 pasos */}
      <div className="mx-auto mt-0 max-w-2xl px-6 pt-4 sm:pt-5 md:px-10">
        <div className="flex gap-1.5">
          {["slot", "form", "done"].map((s, i) => (
            <div key={s} className="h-1 flex-1 overflow-hidden rounded-full bg-[var(--color-border)]">
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

      <main className="relative mx-auto max-w-2xl overflow-hidden px-6 py-8 sm:py-12 md:px-10 md:py-20">
        <div
          className="pointer-events-none absolute -top-24 left-1/2 h-[26rem] w-[36rem] -translate-x-1/2 opacity-[0.08] blur-3xl"
          style={{ background: "radial-gradient(ellipse, var(--color-accent) 0%, transparent 70%)" }}
          aria-hidden
        />
        <Reveal>
          <span className="relative text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[var(--color-accent)] sm:text-[13px] sm:tracking-[0.1em]">
            Instituto Latinoamericano de Formación Comercial
          </span>
        </Reveal>
        <Reveal delay={0.06} className="relative mt-2.5 sm:mt-3">
          <h1 className="text-[1.55rem] font-bold leading-[1.15] tracking-tight sm:text-[2rem] md:text-[2.5rem]">
            Elegí un horario para tu llamada
          </h1>
        </Reveal>
        <Reveal delay={0.1} className="relative mt-2.5 sm:mt-3">
          <p className="text-[14px] leading-relaxed text-[var(--color-text-secondary)] sm:text-[16px]">
            Es una reunión de 40 minutos. Te recomendamos conectarte desde una
            computadora para aprovecharla mejor. Los horarios se muestran en
            tu huso horario.
          </p>
        </Reveal>

        <Reveal delay={0.14} className="relative mt-4 sm:mt-6">
          <label className="mb-1.5 flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.05em] text-[var(--color-text-muted)] sm:text-[13px]">
            <Globe size={13} /> Tu país
          </label>
          <select
            value={tz}
            onChange={(e) => setTz(e.target.value)}
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-2.5 text-[14.5px] outline-none transition-colors focus:border-[var(--color-accent)] sm:py-3 sm:text-[15.5px]"
          >
            {PAISES.map((p) => (
              <option key={p.tz} value={p.tz}>
                {p.label}
              </option>
            ))}
          </select>
        </Reveal>

        <AnimatePresence mode="wait">
          {step === "slot" && (
            <motion.div
              key="slot"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="mt-6 sm:mt-10"
            >
              {/* selector de día */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={() => setDayOffset((o) => Math.max(0, o - 6))}
                  disabled={dayOffset === 0}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-accent)] disabled:opacity-30 sm:h-9 sm:w-9"
                  aria-label="Días anteriores"
                >
                  <ChevronLeft size={14} className="sm:hidden" />
                  <ChevronLeft size={16} className="hidden sm:block" />
                </button>
                <div className="grid flex-1 grid-cols-6 gap-1 sm:gap-2">
                  {visibleDays.map((d) => {
                    const active = selectedDate && toDateKey(d) === toDateKey(selectedDate);
                    const isPastDay = toDateKey(d) < todayArgentinaKey;
                    return (
                      <button
                        key={toDateKey(d)}
                        type="button"
                        disabled={isPastDay}
                        onClick={() => setSelectedDate(d)}
                        className={`flex flex-col items-center gap-0.5 rounded-lg border px-1 py-2 transition-colors sm:rounded-xl sm:px-2 sm:py-3 ${
                          isPastDay
                            ? "cursor-not-allowed border-[var(--color-border)] opacity-35"
                            : active
                              ? "border-[var(--color-accent)] bg-[var(--color-accent-muted)]"
                              : "border-[var(--color-border)] bg-[var(--color-bg-elevated)] hover:border-[var(--color-accent)]/40"
                        }`}
                      >
                        <span className="text-[9.5px] font-semibold uppercase tracking-[0.04em] text-[var(--color-text-muted)] sm:text-[11px] sm:tracking-[0.06em]">
                          {DIA_LABEL[d.getDay()]}
                        </span>
                        <span
                          className={`text-[15px] font-bold sm:text-[18px] ${
                            active ? "text-[var(--color-accent-hover)]" : "text-[var(--color-text-primary)]"
                          }`}
                        >
                          {d.getDate()}
                        </span>
                        <span className="text-[9px] text-[var(--color-text-muted)] sm:text-[10.5px]">{MES_LABEL[d.getMonth()]}</span>
                      </button>
                    );
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => setDayOffset((o) => (o + 6 < days.length ? o + 6 : o))}
                  disabled={dayOffset + 6 >= days.length}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-accent)] disabled:opacity-30 sm:h-9 sm:w-9"
                  aria-label="Días siguientes"
                >
                  <ChevronRight size={14} className="sm:hidden" />
                  <ChevronRight size={16} className="hidden sm:block" />
                </button>
              </div>

              {/* selector de hora */}
              <div className="mt-4 min-h-[150px] sm:mt-6 sm:min-h-[180px]">
                {!selectedDate && (
                  <p className="mt-8 text-center text-[14px] text-[var(--color-text-muted)] sm:mt-10 sm:text-[15px]">
                    Elegí un día para ver los horarios disponibles.
                  </p>
                )}
                {selectedDate && loadingHours && (
                  <div className="mt-8 flex justify-center sm:mt-10">
                    <Loader2 size={20} className="animate-spin text-[var(--color-accent)]" />
                  </div>
                )}
                {selectedDate && !loadingHours && (
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 sm:grid-cols-4">
                    {HORAS.map((h) => {
                      const taken = bookedHours.includes(h);
                      const past = Boolean(isToday && h <= currentArgentinaHour);
                      const disabled = taken || past;
                      const active = selectedHour === h;
                      const { time, dayDiff } = convertSlot(selectedDate, h, tz);
                      return (
                        <button
                          key={h}
                          type="button"
                          disabled={disabled}
                          onClick={() => setSelectedHour(h)}
                          className={`flex flex-col items-center rounded-lg border px-2 py-2 text-[13px] font-semibold transition-colors sm:rounded-xl sm:px-3 sm:py-2.5 sm:text-[15px] ${
                            disabled
                              ? "cursor-not-allowed border-[var(--color-border)] text-[var(--color-text-muted)] opacity-40 line-through"
                              : active
                                ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                                : "border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] hover:border-[var(--color-accent)]"
                          }`}
                        >
                          {time}
                          {dayDiff !== 0 && (
                            <span className="text-[9px] font-normal opacity-70">
                              {dayDiff > 0 ? "día siguiente" : "día anterior"}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <button
                type="button"
                disabled={!selectedDate || selectedHour === null}
                onClick={() => setStep("form")}
                className="mt-6 w-full rounded-xl bg-[var(--color-accent)] px-6 py-3 text-[15px] font-semibold text-white transition-opacity hover:bg-[var(--color-accent-hover)] disabled:cursor-not-allowed disabled:opacity-40 sm:mt-8 sm:py-3.5 sm:text-[16px]"
              >
                Continuar
              </button>
            </motion.div>
          )}

          {step === "form" && selectedDate && selectedHour !== null && (
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
                {DIA_LABEL[selectedDate.getDay()]} {selectedDate.getDate()} de{" "}
                {MES_LABEL[selectedDate.getMonth()]} · {convertSlot(selectedDate, selectedHour, tz).time}hs
                {" "}({PAISES.find((p) => p.tz === tz)?.label})
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
                    onChange={(e) => setWhatsapp(e.target.value)}
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
                <p className="mt-4 text-[14px] font-medium text-red-600">
                  Justo se ocupó ese horario. Volvé atrás y elegí otro.
                </p>
              )}
              {submitError && (
                <p className="mt-4 text-[14px] font-medium text-red-600">
                  Hubo un error al confirmar. Probá de nuevo en un momento.
                </p>
              )}

              <button
                type="button"
                disabled={!nombre.trim() || !whatsapp.trim() || submitting}
                onClick={handleSubmit}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-6 py-3.5 text-[16px] font-semibold text-white transition-opacity hover:bg-[var(--color-accent-hover)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {submitting && <Loader2 size={16} className="animate-spin" />}
                Confirmar reserva
              </button>
            </motion.div>
          )}

          {step === "done" && selectedDate && selectedHour !== null && (
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
                {DIA_LABEL[selectedDate.getDay()]} {selectedDate.getDate()} de{" "}
                {MES_LABEL[selectedDate.getMonth()]} a las {convertSlot(selectedDate, selectedHour, tz).time}hs
                {" "}({PAISES.find((p) => p.tz === tz)?.label})
              </p>
              <p className="relative mt-4 text-[14px] text-[var(--color-text-muted)] sm:text-[14.5px]">
                Te vamos a escribir por WhatsApp con el link para la llamada.
              </p>
              <a
                href={googleCalendarLink(selectedDate, selectedHour)}
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
    </div>
  );
}
