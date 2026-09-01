"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CalendarPlus, Check, ChevronLeft, Loader2 } from "lucide-react";
import { EASE_OUT } from "@/lib/motion";
import BookingCalendar, { type BookingSelection } from "@/components/BookingCalendar";
import { DIA_LABEL, MES_LABEL, PAISES, convertSlot, googleCalendarLink, isValidWhatsapp, sanitizeWhatsapp, toDateKey } from "@/lib/booking";

type FormData = {
  situacion: string;
  experiencia: string;
  busqueda: string;
  nombre: string;
  email: string;
  whatsapp: string;
  disponibilidad: string;
  sitioWeb: string; // honeypot: invisible para personas, los bots lo completan
};

const initialData: FormData = {
  situacion: "",
  experiencia: "",
  busqueda: "",
  nombre: "",
  email: "",
  whatsapp: "",
  disponibilidad: "",
  sitioWeb: "",
};

const TOTAL_STEPS = 4;

// Evita respuestas de una palabra ("si", "no", "ingreso estable"). No es
// perfecto, pero fuerza a que haya algo real para leer antes de la llamada.
const MIN_ANSWER_LENGTH = 20;
function hasEnoughDetail(text: string) {
  return text.trim().length >= MIN_ANSWER_LENGTH;
}

export default function MultiStepForm() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(initialData);
  const [direction, setDirection] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  // Una vez enviadas las respuestas, el flujo pasa a agendar la llamada
  // directo ahí mismo, sin salir de la página.
  const [flowStep, setFlowStep] = useState<"questions" | "booking" | "done">("questions");
  const [calendarKey, setCalendarKey] = useState(0);
  const [selection, setSelection] = useState<BookingSelection | null>(null);
  const [booking, setBooking] = useState(false);
  const [bookingError, setBookingError] = useState(false);
  const [slotTaken, setSlotTaken] = useState(false);

  const update = (field: keyof FormData, value: string) =>
    setData((d) => ({ ...d, [field]: value }));

  const canAdvance = () => {
    if (step === 0) return hasEnoughDetail(data.situacion);
    if (step === 1) return hasEnoughDetail(data.experiencia);
    if (step === 2) return hasEnoughDetail(data.busqueda);
    if (step === 3)
      return (
        data.nombre.trim().length > 0 &&
        data.email.trim().length > 0 &&
        isValidWhatsapp(data.whatsapp) &&
        data.disponibilidad.trim().length > 0
      );
    return false;
  };

  const next = async () => {
    if (!canAdvance()) return;
    if (step === TOTAL_STEPS - 1) {
      setSubmitting(true);
      setSubmitError(false);
      try {
        const res = await fetch("/api/apply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("submit_failed");
        setFlowStep("booking");
      } catch {
        setSubmitError(true);
      } finally {
        setSubmitting(false);
      }
      return;
    }
    setDirection(1);
    setStep((s) => s + 1);
  };

  const back = () => {
    setDirection(-1);
    setStep((s) => Math.max(0, s - 1));
  };

  async function bookNow(sel: BookingSelection) {
    setBooking(true);
    setBookingError(false);
    setSlotTaken(false);
    try {
      const res = await fetch("/api/agendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: data.nombre.trim(),
          whatsapp: data.whatsapp.trim(),
          sitioWeb: data.sitioWeb,
          date: toDateKey(sel.date),
          hour: sel.hour,
        }),
      });
      if (res.status === 409) {
        setSlotTaken(true);
        setCalendarKey((k) => k + 1); // fuerza a releer disponibilidad
        setBooking(false);
        return;
      }
      if (!res.ok) throw new Error("submit_failed");
      setSelection(sel);
      setFlowStep("done");
    } catch {
      setBookingError(true);
    } finally {
      setBooking(false);
    }
  }

  if (flowStep === "done" && selection) {
    return (
      <div className="glass-panel relative overflow-hidden rounded-[var(--radius-panel)] p-10 text-center sm:p-14">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-accent">
          <Check size={18} strokeWidth={2} className="text-accent" />
        </span>
        <p className="mt-6 text-[17px] font-medium tracking-tight">
          ¡Listo, {data.nombre.trim().split(" ")[0]}! Quedó agendado.
        </p>
        <p className="mt-2 text-[14px] text-text-secondary">
          {DIA_LABEL[selection.date.getDay()]} {selection.date.getDate()} de{" "}
          {MES_LABEL[selection.date.getMonth()]} a las {convertSlot(selection.date, selection.hour, selection.tz).time}hs
          {" "}({PAISES.find((p) => p.tz === selection.tz)?.label})
        </p>
        <p className="mt-4 text-[13px] text-text-muted">
          Te vamos a escribir por WhatsApp con el link para la llamada.
        </p>
        <a
          href={googleCalendarLink(selection.date, selection.hour)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-[var(--radius-control)] border border-[var(--color-border)] px-4 py-2.5 text-[13px] font-semibold tracking-tight transition-colors hover:border-accent"
        >
          <CalendarPlus size={15} className="text-accent" />
          Agregar a mi calendario
        </a>
      </div>
    );
  }

  if (flowStep === "booking") {
    return (
      <div className="glass-panel rounded-[var(--radius-panel)] p-7 text-left sm:p-10">
        <button
          type="button"
          onClick={() => setFlowStep("questions")}
          className="mb-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-text-muted transition-colors hover:text-text-primary"
        >
          <ChevronLeft size={14} strokeWidth={2} /> Atrás
        </button>
        <p className="text-[17px] font-medium tracking-tight">
          Gracias, {data.nombre.trim().split(" ")[0]}. Ya diste el primer paso.
        </p>
        <p className="mt-2 text-[14px] text-text-secondary">
          Elegí cuándo te llamamos para conocerte mejor y contarte cómo sigue.
        </p>

        <div className="mt-6">
          <BookingCalendar key={calendarKey} onContinue={bookNow} continueLabel={booking ? "Agendando..." : "Confirmar horario"} />
        </div>

        {slotTaken && (
          <p className="mt-4 text-[13px] font-medium text-red-500">
            Justo se ocupó ese horario. Elegí otro de la lista.
          </p>
        )}
        {bookingError && (
          <p className="mt-4 text-[13px] font-medium text-red-500">
            Hubo un error al confirmar. Probá de nuevo en un momento.
          </p>
        )}
        {booking && (
          <div className="mt-4 flex items-center gap-2 text-[13px] text-text-secondary">
            <Loader2 size={14} className="animate-spin" /> Agendando tu llamada...
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-[var(--radius-panel)] p-7 text-left sm:p-10">
      <div className="mb-10 flex gap-1.5">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-[var(--color-border)]">
            <motion.div
              className="h-full rounded-full bg-accent"
              initial={false}
              animate={{ width: i <= step ? "100%" : "0%" }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
            />
          </div>
        ))}
      </div>

      {step < 3 && (
        <p className="mb-5 text-[12.5px] leading-relaxed text-text-muted">
          Leemos cada respuesta antes de la llamada, así que contanos en
          serio — no hace falta que sea largo, pero que diga algo de vos.
        </p>
      )}

      <div className="relative min-h-[220px] overflow-hidden">
        <StepWrap key={step} direction={direction}>
            {step === 0 && (
              <Field label="¿Cuál es tu situación actual?">
                <textarea
                  autoFocus
                  className="form-input"
                  placeholder="Contanos en qué estás hoy: trabajando, buscando un cambio, estudiando..."
                  value={data.situacion}
                  onChange={(e) => update("situacion", e.target.value)}
                />
                <CharHint text={data.situacion} />
              </Field>
            )}

            {step === 1 && (
              <Field label="¿Tenés experiencia previa en ventas o en trabajo remoto?">
                <textarea
                  autoFocus
                  className="form-input"
                  placeholder="Contanos qué experiencia tenés, aunque sea poca o ninguna."
                  value={data.experiencia}
                  onChange={(e) => update("experiencia", e.target.value)}
                />
                <CharHint text={data.experiencia} />
              </Field>
            )}

            {step === 2 && (
              <Field label="¿Qué estás buscando lograr?">
                <textarea
                  autoFocus
                  className="form-input"
                  placeholder="Un ingreso estable, un cambio de rubro, trabajar remoto en serio..."
                  value={data.busqueda}
                  onChange={(e) => update("busqueda", e.target.value)}
                />
                <CharHint text={data.busqueda} />
              </Field>
            )}

            {step === 3 && (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* honeypot: oculto para personas, los bots de autocompletado lo llenan igual */}
                <input
                  type="text"
                  name="sitioWeb"
                  value={data.sitioWeb}
                  onChange={(e) => update("sitioWeb", e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden opacity-0"
                />
                <Field label="Nombre">
                  <input
                    autoFocus
                    type="text"
                    className="form-input"
                    placeholder="Tu nombre completo"
                    value={data.nombre}
                    onChange={(e) => update("nombre", e.target.value)}
                  />
                </Field>
                <Field label="Email">
                  <input
                    type="email"
                    className="form-input"
                    placeholder="tu@email.com"
                    value={data.email}
                    onChange={(e) => update("email", e.target.value)}
                  />
                </Field>
                <Field label="WhatsApp">
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="+54 9 11 0000 0000"
                    value={data.whatsapp}
                    onChange={(e) => update("whatsapp", sanitizeWhatsapp(e.target.value))}
                  />
                </Field>
                <Field label="Disponibilidad de tiempo">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ej: tiempo completo, medio día..."
                    value={data.disponibilidad}
                    onChange={(e) => update("disponibilidad", e.target.value)}
                  />
                </Field>
              </div>
            )}
        </StepWrap>
      </div>

      {submitError && (
        <p className="mt-4 text-[13px] font-medium text-red-500">
          No pudimos enviar tu aplicación. Probá de nuevo en unos segundos.
        </p>
      )}

      <div className="mt-10 flex items-center justify-between">
        <button
          onClick={back}
          disabled={step === 0}
          className="inline-flex items-center gap-2 rounded-[var(--radius-control)] border border-[var(--color-border)] px-4 py-2.5 text-[13px] font-medium tracking-tight text-text-secondary transition-colors duration-300 hover:border-accent/40 hover:text-text-primary disabled:opacity-0"
        >
          <ArrowLeft size={14} strokeWidth={2} />
          Atrás
        </button>
        <button
          onClick={next}
          disabled={!canAdvance() || submitting}
          className="inline-flex items-center gap-2 rounded-[var(--radius-control)] bg-accent px-6 py-3 text-[14px] font-semibold tracking-tight text-white transition-all duration-300 hover:bg-accent-hover hover:shadow-[0_8px_28px_-8px_rgba(255,42,68,0.6)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting
            ? "Enviando..."
            : step === TOTAL_STEPS - 1
            ? "Elegir horario"
            : "Continuar"}
          <ArrowRight size={15} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

function CharHint({ text }: { text: string }) {
  const remaining = MIN_ANSWER_LENGTH - text.trim().length;
  if (remaining <= 0) return null;
  return (
    <p className="mt-2 text-[12px] text-text-muted">
      Un poco más de detalle y seguimos ({remaining} caracteres).
    </p>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-3 block text-[15px] font-medium tracking-tight">
        {label}
      </label>
      {children}
    </div>
  );
}

function StepWrap({
  children,
  direction,
}: {
  children: React.ReactNode;
  direction: number;
}) {
  return (
    <motion.div
      custom={direction}
      initial={{ opacity: 0, x: 24 * direction }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 * direction }}
      transition={{ duration: 0.4, ease: EASE_OUT }}
      className="absolute inset-0"
    >
      {children}
    </motion.div>
  );
}
