"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarPlus, Check, ChevronLeft, Loader2 } from "lucide-react";
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

  const [step, setStep] = useState<"slot" | "form" | "done">("slot");
  const [selection, setSelection] = useState<BookingSelection | null>(null);
  const [nombre, setNombre] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [sitioWeb, setSitioWeb] = useState(""); // honeypot: invisible para personas, los bots lo completan
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [slotTaken, setSlotTaken] = useState(false);

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
    </div>
  );
}
