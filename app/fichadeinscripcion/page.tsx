"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import RevealGroup from "@/components/RevealGroup";
import RevealItem from "@/components/RevealItem";

type FormState = {
  nombre: string;
  email: string;
  whatsapp: string;
  fuente: string;
  nivel: string;
  plan: string;
  fechaPago: string;
  disponibilidad: string;
  objetivo: string;
};

const initialState: FormState = {
  nombre: "",
  email: "",
  whatsapp: "",
  fuente: "",
  nivel: "",
  plan: "",
  fechaPago: "",
  disponibilidad: "",
  objetivo: "",
};

const FUENTE_OPTIONS = ["TikTok", "Instagram", "Recomendación de alguien", "Otro"];
const NIVEL_OPTIONS = [
  "Nunca vendí",
  "Vendo hace menos de 1 año",
  "Vendo hace más de 1 año",
  "Lidero equipo",
];
const PLAN_OPTIONS = ["Junior", "Junior High Ticket", "Tercer Nivel"];
const PLAN_DURATION_MESES: Record<string, number> = {
  Junior: 2,
  "Junior High Ticket": 3,
  "Tercer Nivel": 9,
};
const DISPONIBILIDAD_OPTIONS = ["Mañana", "Tarde", "Noche", "Flexible"];

const OBJETIVO_MAX = 1000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="mb-2 block text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--color-text-secondary)]">
      {children}
      {required && <span className="ml-1 text-[var(--color-accent)]">*</span>}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-[13px] text-[var(--color-accent)]">{message}</p>;
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-5 flex items-baseline gap-3">
      <span className="h-[13px] w-[2px] shrink-0 bg-[var(--color-accent)]" aria-hidden />
      <div>
        <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
          {eyebrow}
        </span>
        <h2 className="mt-0.5 text-[17px] font-semibold text-[var(--color-text-primary)]">{title}</h2>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-base)] px-4 py-3.5 text-[15px] text-[var(--color-text-primary)] outline-none transition-colors placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)]";

function CustomSelect({
  value,
  onChange,
  onBlur,
  options,
  placeholder,
  hasError,
}: {
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  options: string[];
  placeholder: string;
  hasError?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function close() {
    setOpen(false);
    onBlur();
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`${inputClass} flex items-center justify-between text-left ${
          hasError ? "border-[var(--color-accent)]/60" : ""
        }`}
      >
        <span className={value ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-muted)]"}>
          {value || placeholder}
        </span>
        <svg
          viewBox="0 0 20 20"
          fill="none"
          className={`h-4 w-4 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M5.5 7.5L10 12l4.5-4.5"
            stroke="var(--color-text-muted)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[0_20px_40px_rgba(0,0,0,0.10)]">
          {options.map((o) => {
            const isSelected = o === value;
            return (
              <button
                type="button"
                key={o}
                onClick={() => {
                  onChange(o);
                  close();
                }}
                className={`flex w-full items-center justify-between px-4 py-3 text-left text-[14.5px] transition-colors ${
                  isSelected
                    ? "bg-[var(--color-accent-muted)] text-[var(--color-text-primary)]"
                    : "text-[var(--color-text-secondary)] hover:bg-black/[0.03] hover:text-[var(--color-text-primary)]"
                }`}
              >
                {o}
                {isSelected && (
                  <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 shrink-0">
                    <path
                      d="M4.5 10.5l3.2 3.2L15.5 6"
                      stroke="var(--color-accent)"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const CONFETTI_PARTICLES = Array.from({ length: 16 }, (_, i) => {
  const angle = (i / 16) * Math.PI * 2;
  return {
    x: Math.cos(angle) * (60 + (i % 3) * 14),
    y: Math.sin(angle) * (60 + (i % 3) * 14),
    delay: (i % 4) * 0.03,
    accent: i % 2 === 0,
  };
});

function CountdownRing({ seconds, onComplete }: { seconds: number; onComplete: () => void }) {
  const [started, setStarted] = useState(false);
  const [bursting, setBursting] = useState(false);
  const [remaining, setRemaining] = useState(seconds);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!started) return;
    if (remaining <= 0) {
      onCompleteRef.current();
      return;
    }
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [started, remaining]);

  function handleStart() {
    setStarted(true);
    setBursting(true);
    setTimeout(() => setBursting(false), 900);
  }

  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - remaining / seconds);

  if (!started) {
    return (
      <div className="relative flex h-28 w-28 items-center justify-center">
        <button
          type="button"
          onClick={handleStart}
          className="relative z-10 flex h-28 w-28 flex-col items-center justify-center gap-1 rounded-full border border-[var(--color-accent)]/30 bg-[var(--color-accent-muted)] text-[var(--color-accent-hover)] transition-colors hover:border-[var(--color-accent)]/60"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
            <path d="M8 5v14l11-7-11-7z" fill="var(--color-accent)" />
          </svg>
          <span className="text-[12px] font-semibold uppercase tracking-[0.08em]">Iniciar</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative flex h-28 w-28 items-center justify-center">
        {bursting &&
          CONFETTI_PARTICLES.map((p, i) => (
            <motion.span
              key={i}
              className="absolute h-1.5 w-1.5 rounded-full"
              style={{
                background: p.accent ? "var(--color-accent)" : "var(--color-text-muted)",
              }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.4 }}
              transition={{ duration: 0.75, delay: p.delay, ease: "easeOut" }}
            />
          ))}
        <svg viewBox="0 0 100 100" className="h-28 w-28 -rotate-90">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="var(--color-border)" strokeWidth="1.5" />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>
        <span className="absolute text-[2.25rem] font-light tabular-nums text-[var(--color-text-primary)]">
          {remaining}
        </span>
      </div>
      <span className="text-[12px] font-medium uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
        Preparando tu ficha
      </span>
    </div>
  );
}

export default function FichaInscripcionPage() {
  const [form, setForm] = useState<FormState>(initialState);
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function markTouched(key: keyof FormState) {
    setTouched((t) => ({ ...t, [key]: true }));
  }

  const errors = useMemo(() => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.nombre.trim()) e.nombre = "Ingresá tu nombre completo.";
    if (!form.email.trim()) e.email = "Ingresá tu email.";
    else if (!EMAIL_RE.test(form.email.trim())) e.email = "Ingresá un email válido.";
    if (!form.whatsapp.trim()) e.whatsapp = "Ingresá tu WhatsApp con código de país.";
    else if (form.whatsapp.replace(/[^0-9]/g, "").length < 8)
      e.whatsapp = "Ingresá un número de WhatsApp válido.";
    if (!form.fuente) e.fuente = "Seleccioná una opción.";
    if (!form.nivel) e.nivel = "Seleccioná una opción.";
    if (!form.plan) e.plan = "Seleccioná una opción.";
    if (!form.fechaPago) e.fechaPago = "Ingresá la fecha de pago.";
    if (!form.disponibilidad) e.disponibilidad = "Seleccioná una opción.";
    if (!form.objetivo.trim()) e.objetivo = "Contanos qué esperás lograr.";
    else if (form.objetivo.length > OBJETIVO_MAX) e.objetivo = `Máximo ${OBJETIVO_MAX} caracteres.`;
    return e;
  }, [form]);

  const isValid = Object.keys(errors).length === 0;

  const totalFields = Object.keys(initialState).length;
  const filledFields = Object.values(form).filter((v) => v.trim() !== "").length;
  const progress = Math.round((filledFields / totalFields) * 100);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({
      nombre: true,
      email: true,
      whatsapp: true,
      fuente: true,
      nivel: true,
      plan: true,
      fechaPago: true,
      disponibilidad: true,
      objetivo: true,
    });
    if (!isValid) return;

    setStatus("loading");
    setSubmitError(null);

    try {
      const res = await fetch("/api/inscripcion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombreCompleto: form.nombre.trim(),
          email: form.email.trim(),
          whatsapp: form.whatsapp.trim(),
          comoSeEntero: form.fuente,
          nivelVentas: form.nivel,
          plan: form.plan,
          fechaPago: form.fechaPago,
          disponibilidad: form.disponibilidad,
          objetivo3Meses: form.objetivo.trim(),
          timestamp: new Date().toISOString(),
        }),
      });

      if (!res.ok) throw new Error("submit_failed");
      setStatus("success");
    } catch {
      setStatus("error");
      setSubmitError("No pudimos enviar tu ficha. Revisá tu conexión e intentá de nuevo.");
    }
  }

  if (status === "success") {
    return (
      <div className="theme-light relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--color-bg-base)] px-6 py-20">
        <div
          className="pointer-events-none absolute -top-40 left-1/2 h-[42rem] w-[64rem] -translate-x-1/2 opacity-[0.07] blur-3xl"
          style={{ background: "radial-gradient(ellipse, var(--color-accent) 0%, transparent 70%)" }}
          aria-hidden
        />
        <Reveal className="relative mx-auto max-w-lg text-center">
          <div className="mx-auto mb-8 flex h-14 w-14 items-center justify-center rounded-full border border-[var(--color-accent)]/30 bg-[var(--color-accent-muted)]">
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
              <path
                d="M5 13l4 4 10-10"
                stroke="var(--color-accent)"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="text-[1.75rem] font-bold leading-snug tracking-tight text-[var(--color-text-primary)] md:text-[2rem]">
            Listo, {form.nombre.trim().split(" ")[0]}. Ya te sumamos a ILFC.
          </h1>
          <p className="mt-3 text-[16px] leading-relaxed text-[var(--color-text-secondary)]">
            En breve te contactamos por WhatsApp con los próximos pasos.
          </p>
        </Reveal>
      </div>
    );
  }

  return (
    <div className="theme-light relative min-h-screen overflow-hidden bg-[var(--color-bg-base)] px-6 py-16 md:py-24">
      {/* resplandor de fondo, mismo lenguaje que el resto del sitio */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[42rem] w-[64rem] -translate-x-1/2 opacity-[0.07] blur-3xl"
        style={{ background: "radial-gradient(ellipse, var(--color-accent) 0%, transparent 70%)" }}
        aria-hidden
      />

      {/* barra de progreso */}
      <div className="fixed left-0 top-0 z-30 h-[2px] w-full bg-black/[0.05]">
        <div
          className="h-full bg-[var(--color-accent)] transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="relative mx-auto max-w-2xl">
        {/* intro emocional */}
        <RevealGroup stagger={0.14} className="mx-auto mb-16 max-w-lg text-center md:mb-20">
          <RevealItem>
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-accent)]/25 bg-[var(--color-accent-muted)] px-4 py-1.5">
              <span className="relative flex h-2 w-2">
                <motion.span
                  className="absolute inline-flex h-full w-full rounded-full bg-[var(--color-accent)]"
                  animate={{ scale: [1, 2.4], opacity: [0.6, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-accent)]" />
              </span>
              <span className="text-[12.5px] font-semibold uppercase tracking-[0.1em] text-[var(--color-accent-hover)]">
                Ya diste el paso
              </span>
            </span>
          </RevealItem>

          <RevealItem>
            <h1 className="mt-6 text-[2.5rem] font-bold leading-[1.1] tracking-tight text-[var(--color-text-primary)] md:text-[3.4rem]">
              <span className="text-[var(--color-accent)]">¡Felicitaciones</span>
              <br />
              por estar acá!
            </h1>
          </RevealItem>

          <RevealItem>
            <p className="mx-auto mt-6 max-w-sm text-[17px] leading-relaxed text-[var(--color-text-secondary)]">
              De verdad, esto es importante para vos. Mucha gente piensa y
              duda, y se queda ahí. Vos accionaste.
            </p>
          </RevealItem>

          <RevealItem>
            <div className="mx-auto mt-8 max-w-sm rounded-2xl border border-[var(--color-accent)]/30 bg-[var(--color-accent-muted)] px-6 py-5">
              <p className="text-[1.4rem] font-bold leading-[1.25] text-[var(--color-accent-hover)] md:text-[1.6rem]">
                Tomate 10 segundos, ahora mismo,
                <br />
                para felicitarte por eso.
              </p>
            </div>
          </RevealItem>
        </RevealGroup>

        {!showForm ? (
          <Reveal className="flex flex-col items-center pb-10 pt-8 md:pt-12">
            <CountdownRing seconds={10} onComplete={() => setShowForm(true)} />
          </Reveal>
        ) : (
          <>
            <Reveal className="mb-10 text-center">
              <span className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-secondary)]">
                Instituto Latinoamericano de Formación Comercial
              </span>
              <h2 className="mx-auto mt-4 max-w-md text-[2.1rem] font-bold leading-[1.15] tracking-tight text-[var(--color-text-primary)] md:text-[2.5rem]">
                Bienvenido/a a ILFC
              </h2>
              <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
                Completá tu ficha de inscripción para dar el primer paso de tu formación.
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <form
            onSubmit={handleSubmit}
            noValidate
            className="mx-auto max-w-xl overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[0_20px_40px_rgba(0,0,0,0.06)]"
          >
            <section className="px-7 py-8 md:px-9">
              <SectionHeading eyebrow="01" title="Tus datos" />
              <div className="flex flex-col gap-6">
                <div>
                  <FieldLabel required>Nombre completo</FieldLabel>
                  <input
                    type="text"
                    className={inputClass}
                    value={form.nombre}
                    onChange={(e) => update("nombre", e.target.value)}
                    onBlur={() => markTouched("nombre")}
                    placeholder="Ej: Juan Pérez"
                  />
                  <FieldError message={touched.nombre ? errors.nombre : undefined} />
                </div>

                <div>
                  <FieldLabel required>Email</FieldLabel>
                  <input
                    type="email"
                    className={inputClass}
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    onBlur={() => markTouched("email")}
                    placeholder="tu@email.com"
                  />
                  <FieldError message={touched.email ? errors.email : undefined} />
                </div>

                <div>
                  <FieldLabel required>WhatsApp</FieldLabel>
                  <input
                    type="tel"
                    inputMode="tel"
                    className={inputClass}
                    value={form.whatsapp}
                    onChange={(e) => update("whatsapp", e.target.value.replace(/[^0-9+ ]/g, ""))}
                    onBlur={() => markTouched("whatsapp")}
                    placeholder="+54 9 261 1234567"
                  />
                  <FieldError message={touched.whatsapp ? errors.whatsapp : undefined} />
                </div>
              </div>
            </section>

            <div className="border-t border-[var(--color-border)]" />

            <section className="px-7 py-8 md:px-9">
              <SectionHeading eyebrow="02" title="Tu perfil" />
              <div className="flex flex-col gap-6">
                <div>
                  <FieldLabel required>¿Cómo te enteraste de ILFC?</FieldLabel>
                  <CustomSelect
                    value={form.fuente}
                    onChange={(v) => update("fuente", v)}
                    onBlur={() => markTouched("fuente")}
                    options={FUENTE_OPTIONS}
                    placeholder="Seleccioná una opción"
                    hasError={touched.fuente && !!errors.fuente}
                  />
                  <FieldError message={touched.fuente ? errors.fuente : undefined} />
                </div>

                <div>
                  <FieldLabel required>Nivel actual en ventas</FieldLabel>
                  <CustomSelect
                    value={form.nivel}
                    onChange={(v) => update("nivel", v)}
                    onBlur={() => markTouched("nivel")}
                    options={NIVEL_OPTIONS}
                    placeholder="Seleccioná una opción"
                    hasError={touched.nivel && !!errors.nivel}
                  />
                  <FieldError message={touched.nivel ? errors.nivel : undefined} />
                </div>

                <div>
                  <FieldLabel required>Disponibilidad horaria</FieldLabel>
                  <CustomSelect
                    value={form.disponibilidad}
                    onChange={(v) => update("disponibilidad", v)}
                    onBlur={() => markTouched("disponibilidad")}
                    options={DISPONIBILIDAD_OPTIONS}
                    placeholder="Seleccioná una opción"
                    hasError={touched.disponibilidad && !!errors.disponibilidad}
                  />
                  <FieldError message={touched.disponibilidad ? errors.disponibilidad : undefined} />
                </div>
              </div>
            </section>

            <div className="border-t border-[var(--color-border)]" />

            <section className="px-7 py-8 md:px-9">
              <SectionHeading eyebrow="03" title="Tu plan" />
              <div className="flex flex-col gap-6">
                <div>
                  <FieldLabel required>Formación que elegiste</FieldLabel>
                  <CustomSelect
                    value={form.plan}
                    onChange={(v) => update("plan", v)}
                    onBlur={() => markTouched("plan")}
                    options={PLAN_OPTIONS}
                    placeholder="Seleccioná una opción"
                    hasError={touched.plan && !!errors.plan}
                  />
                  <FieldError message={touched.plan ? errors.plan : undefined} />
                </div>

                <div>
                  <FieldLabel required>Fecha de pago</FieldLabel>
                  <input
                    type="date"
                    className={inputClass}
                    value={form.fechaPago}
                    onChange={(e) => update("fechaPago", e.target.value)}
                    onBlur={() => markTouched("fechaPago")}
                  />
                  <FieldError message={touched.fechaPago ? errors.fechaPago : undefined} />
                </div>
              </div>
            </section>

            <div className="border-t border-[var(--color-border)]" />

            <section className="px-7 py-8 md:px-9">
              <SectionHeading eyebrow="04" title="Tu objetivo" />
              <div>
                <FieldLabel required>
                  ¿Qué esperás lograr en los próximos {PLAN_DURATION_MESES[form.plan] ?? 3} meses?
                </FieldLabel>
                <textarea
                  className={`${inputClass} min-h-[140px] resize-none`}
                  value={form.objetivo}
                  maxLength={OBJETIVO_MAX}
                  onChange={(e) => update("objetivo", e.target.value)}
                  onBlur={() => markTouched("objetivo")}
                  placeholder="Contanos tu objetivo..."
                />
                <div className="mt-1.5 flex items-center justify-between">
                  <FieldError message={touched.objetivo ? errors.objetivo : undefined} />
                  <span className="ml-auto text-[12.5px] text-[var(--color-text-muted)]">
                    {form.objetivo.length}/{OBJETIVO_MAX}
                  </span>
                </div>
              </div>
            </section>

            <div className="border-t border-[var(--color-border)] bg-black/[0.02] px-7 py-7 md:px-9">
              {status === "error" && submitError && (
                <div className="mb-4 rounded-xl border border-[var(--color-accent)]/30 bg-[var(--color-accent-muted)] px-4 py-3 text-[14px] text-[var(--color-accent-hover)]">
                  {submitError}
                </div>
              )}

              <button
                type="submit"
                disabled={!isValid || status === "loading"}
                className="w-full rounded-xl bg-[var(--color-accent)] px-6 py-4 text-[15px] font-semibold text-white transition-opacity hover:bg-[var(--color-accent-hover)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {status === "loading" ? "Enviando..." : "Enviar ficha"}
              </button>
            </div>
          </form>
            </Reveal>
          </>
        )}
      </div>
    </div>
  );
}
