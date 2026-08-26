"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { EASE_OUT } from "@/lib/motion";

type FormData = {
  situacion: string;
  experiencia: string;
  busqueda: string;
  nombre: string;
  email: string;
  whatsapp: string;
  disponibilidad: string;
};

const initialData: FormData = {
  situacion: "",
  experiencia: "",
  busqueda: "",
  nombre: "",
  email: "",
  whatsapp: "",
  disponibilidad: "",
};

const TOTAL_STEPS = 4;

export default function MultiStepForm() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(initialData);
  const [direction, setDirection] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const update = (field: keyof FormData, value: string) =>
    setData((d) => ({ ...d, [field]: value }));

  const canAdvance = () => {
    if (step === 0) return data.situacion.trim().length > 0;
    if (step === 1) return data.experiencia.trim().length > 0;
    if (step === 2) return data.busqueda.trim().length > 0;
    if (step === 3)
      return (
        data.nombre.trim().length > 0 &&
        data.email.trim().length > 0 &&
        data.whatsapp.trim().length > 0 &&
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
        setSubmitted(true);
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

  if (submitted) {
    return (
      <div className="glass-panel rounded-[var(--radius-panel)] p-10 text-center sm:p-14">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-accent">
          <Check size={18} strokeWidth={2} className="text-accent" />
        </span>
        <p className="mt-6 text-[17px] font-medium tracking-tight">
          Recibimos tu aplicación.
        </p>
        <p className="mt-2 text-[14px] text-text-secondary">
          Te contactamos a la brevedad para coordinar tu diagnóstico de
          nivel.
        </p>
      </div>
    );
  }

  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  return (
    <div className="glass-panel rounded-[var(--radius-panel)] p-7 text-left sm:p-10">
      <div className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
                  i <= step ? "bg-accent" : "bg-white/15"
                }`}
              />
            ))}
          </div>
          <span className="font-mono text-[11px] tracking-[0.1em] text-text-muted">
            {String(step + 1).padStart(2, "0")} / {String(TOTAL_STEPS).padStart(2, "0")}
          </span>
        </div>
        <div className="h-[2px] w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-accent"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
          />
        </div>
      </div>

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
              </Field>
            )}

            {step === 3 && (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
                    onChange={(e) => update("whatsapp", e.target.value)}
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
          className="inline-flex items-center gap-2 rounded-[var(--radius-control)] border border-[var(--color-border)] px-4 py-2.5 text-[13px] font-medium tracking-tight text-text-secondary transition-colors duration-300 hover:border-white/25 hover:text-text-primary disabled:opacity-0"
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
            ? "Enviar aplicación"
            : "Continuar"}
          <ArrowRight size={15} strokeWidth={2} />
        </button>
      </div>
    </div>
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
