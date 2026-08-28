"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Reveal from "@/components/Reveal";

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

export default function FichaInscripcionPage() {
  const [form, setForm] = useState<FormState>(initialState);
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

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
        {/* intro motivacional */}
        <Reveal className="mx-auto mb-14 max-w-xl text-center md:mb-16">
          <span className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--color-accent)]">
            Antes de empezar
          </span>
          <h1 className="mt-4 text-[2.3rem] font-bold leading-[1.12] tracking-tight text-[var(--color-text-primary)] md:text-[3rem]">
            Tu camino empieza acá, y es más importante de lo que creés.
          </h1>
          <p className="mx-auto mt-6 max-w-md text-[16px] leading-relaxed text-[var(--color-text-secondary)]">
            El mundo remoto cambió las reglas del juego: hoy una persona con
            criterio comercial y disciplina puede facturar en dólares desde
            cualquier lugar, sin depender de un puesto de oficina ni de un
            techo de ingresos fijo. Vender ya no es un talento improvisado,
            es una profesión que se entrena, se mide y se certifica.
          </p>
          <p className="mx-auto mt-4 max-w-md text-[16px] leading-relaxed text-[var(--color-text-secondary)]">
            Tomate un minuto para felicitarte por este paso: no es poco animarse
            a empezar algo nuevo. Ahora contanos quién sos y hacia dónde vas,
            nosotros nos encargamos del resto.
          </p>

          <div className="mx-auto mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-[var(--color-border)] pt-8">
            {[
              { label: "Ingresos en USD" },
              { label: "100% remoto" },
              { label: "Con evidencia real" },
            ].map((v) => (
              <div key={v.label} className="flex flex-col items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-[var(--color-accent)]" aria-hidden />
                <span className="text-[12px] font-medium uppercase tracking-[0.06em] text-[var(--color-text-muted)]">
                  {v.label}
                </span>
              </div>
            ))}
          </div>
        </Reveal>

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
                <FieldLabel required>¿Qué esperás lograr en los próximos 3 meses?</FieldLabel>
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
      </div>
    </div>
  );
}
