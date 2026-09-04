"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, ChevronDown, Copy, Info, Loader2, RefreshCw, Star, X } from "lucide-react";

type Cotizaciones = { ok: boolean; blue: number | null; fx: Record<string, number>; actualizado: string };

// ─────────────── Config de negocio ───────────────

/** Días que "vale" el presupuesto que se copia (el blue se mueve). */
const VALIDEZ_DIAS = 7;

/** Promo de Carrera Completa. Poné la fecha real de fin. */
const PROMO = { descuento: 20, hasta: "2026-09-30" };

/**
 * Cotización de respaldo — SOLO se usa si el usuario aprieta "usar respaldo"
 * cuando la API en vivo está caída. No se muestra sola en ningún lado.
 * Actualizar a mano de vez en cuando (fecha abajo).
 */
const RESPALDO_ACTUALIZADO = "2026-09-03";
const BLUE_RESPALDO = 1500;
const FX_RESPALDO: Record<string, number> = {
  MXN: 18.7,
  COP: 4150,
  CLP: 950,
  PEN: 3.75,
  UYU: 40.5,
  PYG: 7350,
  EUR: 0.92,
};

// ─────────────── Planes ───────────────

type Incluido = true | false | "cond";
interface Feature {
  t: string;
  ok: Incluido;
}
interface Plan {
  key: string;
  label: string;
  kicker: string;
  tag: string;
  duracion: string;
  priceUSD: number;
  /** Precio antes del descuento, en USD (solo donde hay promo). */
  listaUSD?: number;
  /** Máximo de pagos totales (la seña de hoy cuenta como el primero). */
  maxCuotas: number;
  tier: "base" | "mid" | "vip";
  highlights: string[];
  features: Feature[];
}

// Cuotas del resto (2026-09-03): 3 en los tres planes.
// Nota interna: High Ticket en cuotas lleva ~10% de recargo por inflación — NO
// se calcula acá a propósito, lo ajusta el closer en la llamada (lo cubre el
// aviso de "sujeto a aprobación").
const PLANES: Plan[] = [
  {
    key: "junior",
    label: "Comercial Junior",
    kicker: "Entrá a la profesión",
    tag: "Tu puerta de entrada a las ventas remotas.",
    duracion: "2 meses",
    priceUSD: 397,
    maxCuotas: 3,
    tier: "base",
    highlights: [
      "Sesiones grupales, 2 por semana",
      "4 sesiones 1 a 1 por mes",
      "Acceso a la plataforma completa",
      "Preparación de perfil de LinkedIn y armado de CV",
    ],
    features: [
      { t: "Acceso a la bolsa de trabajo independiente", ok: true },
      { t: "Conexión con empresas — sujeta a aprobar el examen de nivel", ok: "cond" },
      { t: "Certificación oficial con historial de desempeño", ok: false },
      { t: "Especializaciones comerciales (High-Ticket, Software B2B, etc.)", ok: false },
      { t: "Tutor dedicado exclusivo", ok: false },
    ],
  },
  {
    key: "high-ticket",
    label: "Comercial High Ticket",
    kicker: "Especializate",
    tag: "Subí la complejidad. Subí tu nivel.",
    duracion: "3 meses",
    priceUSD: 497,
    maxCuotas: 3,
    tier: "mid",
    highlights: [
      "Todo lo incluido en Comercial Junior",
      "Certificación oficial con historial de desempeño",
      "Conexión directa con empresas",
      "6 mentorías 1 a 1 en vivo con especialistas del equipo",
    ],
    features: [
      { t: "Evaluación de especialización (Software B2B, Evergreen, Launching)", ok: false },
      { t: "Tutor dedicado exclusivo", ok: false },
    ],
  },
  {
    key: "carrera",
    label: "Carrera Completa",
    kicker: "Profesionalizate",
    tag: "De aprender a vender a construir una carrera comercial.",
    duracion: "9 meses",
    priceUSD: 1429,
    listaUSD: 1786,
    maxCuotas: 3,
    tier: "vip",
    highlights: [
      "Acceso completo a la plataforma de formación",
      "10 mentorías 1 a 1 en vivo con especialistas del equipo",
      "Certificación oficial con historial de desempeño operativo",
      "Conexión directa con empresas y bolsa de vinculación comercial",
      "Evaluación de especialización comercial (High-Ticket, Software B2B, etc.)",
    ],
    features: [
      { t: "Prácticas operativas y role-play entre pares", ok: true },
      { t: "Sesiones grupales de feedback", ok: true },
      { t: "Tutor dedicado exclusivo durante todo el proceso", ok: true },
    ],
  },
];

// ─────────────── Países ───────────────

type Fuente = "blue" | "usd" | "fx";
interface Pais {
  code: string;
  nombre: string;
  flag: string;
  moneda: string;
  simbolo: string;
  locale: string;
  fuente: Fuente;
}

const PAISES: Pais[] = [
  { code: "ar", nombre: "Argentina", flag: "🇦🇷", moneda: "ARS", simbolo: "$", locale: "es-AR", fuente: "blue" },
  { code: "mx", nombre: "México", flag: "🇲🇽", moneda: "MXN", simbolo: "$", locale: "es-MX", fuente: "fx" },
  { code: "co", nombre: "Colombia", flag: "🇨🇴", moneda: "COP", simbolo: "$", locale: "es-CO", fuente: "fx" },
  { code: "cl", nombre: "Chile", flag: "🇨🇱", moneda: "CLP", simbolo: "$", locale: "es-CL", fuente: "fx" },
  { code: "pe", nombre: "Perú", flag: "🇵🇪", moneda: "PEN", simbolo: "S/", locale: "es-PE", fuente: "fx" },
  { code: "uy", nombre: "Uruguay", flag: "🇺🇾", moneda: "UYU", simbolo: "$", locale: "es-UY", fuente: "fx" },
  { code: "ec", nombre: "Ecuador", flag: "🇪🇨", moneda: "USD", simbolo: "US$", locale: "es-EC", fuente: "usd" },
  { code: "py", nombre: "Paraguay", flag: "🇵🇾", moneda: "PYG", simbolo: "₲", locale: "es-PY", fuente: "fx" },
  { code: "es", nombre: "España", flag: "🇪🇸", moneda: "EUR", simbolo: "€", locale: "es-ES", fuente: "fx" },
  { code: "otro", nombre: "Otro país", flag: "🌎", moneda: "USD", simbolo: "US$", locale: "en-US", fuente: "usd" },
];

const tierCard: Record<Plan["tier"], string> = {
  base: "border-[var(--color-border)] bg-[var(--color-bg-elevated)]",
  mid: "border-[var(--color-border)] bg-[var(--color-bg-elevated)]",
  vip: "border-[var(--color-accent)]/50 bg-[var(--color-accent-muted)] lg:-translate-y-3",
};

// ─────────────── Helpers ───────────────

function fmt(n: number, locale: string) {
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(Math.round(n));
}

function fmtFecha(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });
}

function tiempoRelativo(segundos: number) {
  if (segundos < 60) return `hace ${segundos}s`;
  return `hace ${Math.floor(segundos / 60)} min`;
}

/** USD → moneda local. `null` si no hay cotización (ni en vivo ni respaldo). */
function tasaDe(pais: Pais, cot: Cotizaciones, respaldo: boolean): number | null {
  if (pais.fuente === "usd") return 1;
  if (pais.fuente === "blue") return cot.blue ?? (respaldo ? BLUE_RESPALDO : null);
  return cot.fx[pais.moneda] ?? (respaldo ? FX_RESPALDO[pais.moneda] ?? null : null);
}

interface Pago {
  label: string;
  monto: number;
}

/**
 * Arma el plan de pago. `cuotas` = en cuántas veces se paga el RESTO (lo que
 * queda después de la seña de hoy). Sin seña, el total se divide en `cuotas`.
 */
function planDePago(total: number, cuotas: number, sena: number): { pagos: Pago[]; recurrente: number | null; cubierto: boolean } {
  if (sena > 0 && sena >= total) {
    return { pagos: [{ label: "Hoy", monto: total }], recurrente: null, cubierto: true };
  }
  const n = Math.max(1, cuotas);
  if (sena > 0) {
    const cuota = (total - sena) / n;
    // La 1ª cuota (después de la seña) es SIEMPRE antes de arrancar el
    // cursado, no "a los 30 días" — el resto sí se espacia cada 30 días
    // desde ahí. Pedido de Franco: la seña no es una cuota más, es la
    // reserva del lugar; la plata de verdad tiene que estar antes de
    // empezar a cursar.
    const pagos: Pago[] = [
      { label: "Hoy (seña)", monto: sena },
      { label: "Antes de arrancar la formación", monto: cuota },
    ];
    for (let i = 1; i < n; i++) pagos.push({ label: `${i * 30} días después`, monto: cuota });
    return { pagos, recurrente: cuota, cubierto: false };
  }
  const cuota = total / n;
  const pagos: Pago[] = [];
  for (let i = 0; i < n; i++) pagos.push({ label: i === 0 ? "Hoy" : `${i * 30} días`, monto: cuota });
  return { pagos, recurrente: cuota, cubierto: false };
}

// ─────────────── Componente ───────────────

export default function DollarCalculator() {
  const [paisCode, setPaisCode] = useState<string | null>(null);
  const [cot, setCot] = useState<Cotizaciones | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [respaldo, setRespaldo] = useState(false);
  const [planKey, setPlanKey] = useState<string>("junior");
  const [monto, setMonto] = useState("");
  const [cuotas, setCuotas] = useState(1);
  const [expandido, setExpandido] = useState<string[]>([]);
  const [fetchedAt, setFetchedAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [copiado, setCopiado] = useState(false);
  const [copiarError, setCopiarError] = useState(false);

  const bloqueRef = useRef<HTMLDivElement>(null);
  const calcRef = useRef<HTMLDivElement>(null);
  const plan = PLANES.find((p) => p.key === planKey)!;
  const pais = PAISES.find((p) => p.code === paisCode) ?? null;

  async function fetchCotizaciones() {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/cotizaciones");
      const data = (await res.json()) as Cotizaciones;
      if (!data.ok) throw new Error("cotizaciones_unavailable");
      setCot(data);
      setFetchedAt(Date.now());
      setRespaldo(false);
    } catch {
      setError(true);
      setCot({ ok: true, blue: null, fx: {}, actualizado: new Date().toISOString() });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (paisCode && !cot) fetchCotizaciones();
  }, [paisCode, cot]);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setCuotas((c) => Math.min(Math.max(c, 1), plan.maxCuotas));
  }, [plan.maxCuotas]);

  function elegirPais(code: string) {
    setPaisCode(code);
    requestAnimationFrame(() => bloqueRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function elegirPlan(key: string) {
    setPlanKey(key);
    requestAnimationFrame(() => calcRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }));
  }

  const tasa = pais && cot ? tasaDe(pais, cot, respaldo) : null;
  const usandoRespaldo = respaldo && pais?.fuente !== "usd" && !(pais?.fuente === "blue" ? cot?.blue : cot?.fx[pais?.moneda ?? ""]);

  function convertir(usd: number): number | null {
    if (!pais || tasa === null) return null;
    return Math.round(usd * tasa);
  }

  const total = convertir(plan.priceUSD);
  const montoNum = Math.max(0, Number(monto) || 0);
  const pdp = total !== null ? planDePago(total, cuotas, montoNum) : null;
  const cubreTodo = pdp?.cubierto ?? false;

  const money = (n: number) => (pais ? `${pais.simbolo}${fmt(n, pais.locale)}` : "—");

  const cotizacionUsada = (() => {
    if (!pais || tasa === null || pais.fuente === "usd") return null;
    const rate =
      tasa >= 100
        ? new Intl.NumberFormat(pais.locale, { maximumFractionDigits: 0 }).format(Math.round(tasa))
        : new Intl.NumberFormat(pais.locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(tasa);
    const base = pais.fuente === "blue" ? `dólar blue (promedio ${pais.simbolo}${rate})` : `1 USD = ${pais.simbolo}${rate}`;
    return usandoRespaldo ? `${base} — cotización de respaldo del ${fmtFecha(RESPALDO_ACTUALIZADO)}` : base;
  })();

  function presupuesto(): string {
    if (!pais || total === null || !pdp) return "";
    const hoy = new Date().toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });
    const L: string[] = [];
    L.push("PRESUPUESTO");
    L.push("Instituto Latinoamericano de Formación Comercial");
    L.push(`Fecha: ${hoy}`);
    L.push("");
    L.push(`Plan: ${plan.label}  ·  Duración: ${plan.duracion}`);
    L.push(plan.tag);
    L.push("");
    if (plan.listaUSD) {
      L.push(`Precio de lista: US$ ${plan.listaUSD}`);
      L.push(`Precio con promoción (-${PROMO.descuento}%): US$ ${plan.priceUSD}`);
      L.push(`Promoción válida hasta: ${fmtFecha(PROMO.hasta)}`);
    } else {
      L.push(`Precio: US$ ${plan.priceUSD}`);
    }
    L.push(`Precio en ${pais.nombre}: ${money(total)} ${pais.moneda}`);
    L.push("");
    L.push("PLAN DE PAGO");
    pdp.pagos.forEach((p, i) => L.push(`  ${pdp.pagos.length > 1 ? `${i + 1}. ` : ""}${p.label}: ${money(p.monto)} ${pais.moneda}`));
    if (montoNum > 0 && !cubreTodo) L.push(`  (Resto: ${money(total - montoNum)} ${pais.moneda})`);
    L.push(`  TOTAL: ${money(total)} ${pais.moneda}`);
    L.push("");
    L.push(`Este presupuesto es válido por ${VALIDEZ_DIAS} días desde la fecha.`);
    L.push("Otras combinaciones de seña o cuotas quedan sujetas a aprobación.");
    return L.join("\n");
  }

  function copiarResumen() {
    const texto = presupuesto();
    if (!texto) return;
    navigator.clipboard
      .writeText(texto)
      .then(() => {
        setCopiado(true);
        setCopiarError(false);
        setTimeout(() => setCopiado(false), 2200);
      })
      .catch(() => {
        setCopiarError(true);
        setTimeout(() => setCopiarError(false), 2500);
      });
  }

  const sinCotizacion = Boolean(pais && cot && tasa === null);

  return (
    <div>
      <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
        La inversión, en tu moneda
      </span>
      <h2 className="mt-3 text-[2rem] font-black leading-[1.05] tracking-tight text-[var(--color-text-primary)] md:text-[2.6rem]">
        ¿En qué país estás?
      </h2>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
        Formamos alumnos en toda la región. Elegí tu país y ves los planes en tu
        moneda, con la cotización del momento.
      </p>

      {/* ─── Selector de país ─── */}
      <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {PAISES.map((p) => {
          const on = paisCode === p.code;
          return (
            <button
              key={p.code}
              onClick={() => elegirPais(p.code)}
              className={`flex flex-col items-center gap-2 rounded-2xl border px-4 py-6 text-center transition-all ${
                on
                  ? "border-[var(--color-accent)] bg-[var(--color-accent-muted)]"
                  : "border-[var(--color-border)] bg-[var(--color-bg-elevated)] hover:-translate-y-0.5 hover:border-[var(--color-accent)]/40"
              }`}
            >
              <span className="text-[2.1rem] leading-none">{p.flag}</span>
              <span className={`text-[14px] font-bold ${on ? "text-[var(--color-accent)]" : "text-[var(--color-text-primary)]"}`}>
                {p.nombre}
              </span>
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                {p.moneda}
              </span>
            </button>
          );
        })}
      </div>

      {/* ─── Precios + calculadora del país elegido ─── */}
      <div ref={bloqueRef} className="scroll-mt-24">
        <AnimatePresence>
          {pais && (
            <motion.div
              key={pais.code}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="mt-16 border-t border-[var(--color-border)] pt-12"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="flex items-center gap-2.5 text-[17px] font-black tracking-tight text-[var(--color-text-primary)]">
                  <span className="text-[1.5rem]">{pais.flag}</span> {pais.nombre}
                  <span className="text-[var(--color-text-muted)]">·</span>
                  <span className="text-[var(--color-text-secondary)]">precios en {pais.moneda}</span>
                </span>
                <button
                  onClick={() => {
                    setPaisCode(null);
                    setRespaldo(false);
                  }}
                  className="flex items-center gap-1.5 rounded-full border border-[var(--color-border)] px-3.5 py-2 text-[12px] font-semibold uppercase tracking-widest text-[var(--color-text-secondary)] transition-colors hover:border-black/25"
                >
                  <ArrowLeft size={13} /> Cambiar país
                </button>
              </div>

              {loading && !cot && (
                <span className="mt-8 flex items-center gap-2 text-[14px] font-medium text-[var(--color-text-muted)]">
                  <Loader2 size={15} className="animate-spin" /> Trayendo la cotización...
                </span>
              )}

              {sinCotizacion && (
                <div className="mt-8 max-w-xl rounded-2xl border border-red-500/25 bg-red-500/[0.05] p-5">
                  <p className="text-[14px] font-semibold text-red-600">
                    No pudimos traer la cotización de {pais.moneda} en este momento.
                  </p>
                  <p className="mt-1 text-[13px] leading-relaxed text-[var(--color-text-secondary)]">
                    Podés reintentar, o usar la cotización de respaldo (última del {fmtFecha(RESPALDO_ACTUALIZADO)} — puede
                    estar algo desactualizada).
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2.5">
                    <button
                      onClick={fetchCotizaciones}
                      className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-[12px] font-semibold uppercase tracking-widest text-[var(--color-text-secondary)] hover:border-black/25"
                    >
                      Reintentar
                    </button>
                    <button
                      onClick={() => setRespaldo(true)}
                      className="rounded-full bg-[var(--color-accent)] px-4 py-2 text-[12px] font-semibold uppercase tracking-widest text-[#0B0C0E]"
                    >
                      Usar cotización de respaldo
                    </button>
                  </div>
                </div>
              )}

              {tasa !== null && (
                <>
                  <div className="mt-9 grid grid-cols-1 items-start gap-5 lg:grid-cols-3 lg:gap-6 lg:pt-3">
                    {PLANES.map((p) => (
                      <PlanCard
                        key={p.key}
                        p={p}
                        pais={pais}
                        precio={convertir(p.priceUSD)}
                        precioLista={p.listaUSD ? convertir(p.listaUSD) : null}
                        cuotaEjemplo={convertir(p.priceUSD / p.maxCuotas)}
                        elegido={planKey === p.key}
                        onElegir={() => elegirPlan(p.key)}
                        abierto={expandido.includes(p.key)}
                        onToggle={() =>
                          setExpandido((a) => (a.includes(p.key) ? a.filter((k) => k !== p.key) : [...a, p.key]))
                        }
                      />
                    ))}
                  </div>

                  {cotizacionUsada && (
                    <p className="mt-4 flex flex-wrap items-center gap-2 text-[12px] text-[var(--color-text-muted)]">
                      Calculado con {cotizacionUsada}
                      {fetchedAt !== null && !usandoRespaldo && `, ${tiempoRelativo(Math.max(0, Math.floor((now - fetchedAt) / 1000)))}`}.
                      <button
                        onClick={fetchCotizaciones}
                        disabled={loading}
                        className="inline-flex items-center gap-1 font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] disabled:opacity-40"
                      >
                        <RefreshCw size={11} className={loading ? "animate-spin" : ""} /> Actualizar
                      </button>
                    </p>
                  )}

                  {/* ─── Calculadora de seña ─── */}
                  {total !== null && pdp && (
                    <div
                      ref={calcRef}
                      className="mt-14 scroll-mt-24 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-8 shadow-[0_24px_60px_-30px_rgba(20,18,14,0.2)] md:p-10"
                    >
                      <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
                        Armá el pago · {plan.label}
                      </span>

                      <div className="mt-6 grid grid-cols-1 gap-10 md:grid-cols-2">
                        <div>
                          <label className="mb-3 block text-[13px] font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
                            ¿Con cuánto seña ahora? <span className="font-normal normal-case text-[var(--color-text-muted)]">(en {pais.moneda}, opcional)</span>
                          </label>
                          <div className="flex items-center gap-3">
                            <span className="text-[16px] font-bold text-[var(--color-text-muted)]">{pais.simbolo}</span>
                            <input
                              type="number"
                              min={0}
                              value={monto}
                              onChange={(e) => setMonto(e.target.value)}
                              placeholder="Ej: 80000"
                              className="no-spinner w-full rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] px-4 py-3.5 text-[17px] font-medium text-[var(--color-text-primary)] outline-none transition-colors focus:border-[var(--color-accent)]"
                            />
                            <span className="shrink-0 text-[13px] font-semibold text-[var(--color-text-muted)]">{pais.moneda}</span>
                          </div>

                          <label className="mb-3 mt-7 block text-[13px] font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
                            {montoNum > 0 ? "¿El resto en cuántas cuotas?" : "¿En cuántas cuotas?"}
                          </label>
                          <div className="flex flex-wrap gap-2.5">
                            {Array.from({ length: plan.maxCuotas }, (_, i) => i + 1).map((n) => (
                              <button
                                key={n}
                                onClick={() => setCuotas(n)}
                                className={`rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors ${
                                  cuotas === n
                                    ? "border-[var(--color-accent)] bg-[var(--color-accent-muted)] text-[var(--color-accent)]"
                                    : "border-[var(--color-border-strong)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)]/50"
                                }`}
                              >
                                {n === 1 ? "1 cuota" : `${n} cuotas`}
                              </button>
                            ))}
                          </div>

                          <p className="mt-6 text-[14px] leading-relaxed text-[var(--color-text-secondary)]">
                            {plan.label}: <span className="font-bold text-[var(--color-text-primary)]">{money(total)}</span> {pais.moneda} en total.
                          </p>
                        </div>

                        <div className="flex flex-col">
                          <motion.div
                            key={`${planKey}-${montoNum}-${cuotas}-${tasa}`}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="rounded-2xl border border-[var(--color-accent)]/45 bg-[var(--color-accent-muted)] px-7 py-7 shadow-[0_20px_44px_-26px_rgba(20,18,14,0.3)]"
                          >
                            <span className="block text-center text-[12px] font-semibold uppercase tracking-[0.15em] text-[var(--color-text-secondary)]">
                              {cubreTodo
                                ? "Cubierto con la seña"
                                : cuotas === 1 && montoNum === 0
                                  ? "Pago único de"
                                  : montoNum > 0
                                    ? `Después de la seña, ${cuotas} ${cuotas === 1 ? "cuota" : "cuotas"} de`
                                    : `${cuotas} cuotas de`}
                            </span>
                            {!cubreTodo && (
                              <span className="mt-2 block text-center text-[2.5rem] font-black leading-none tracking-tight text-[var(--color-accent)] md:text-[2.9rem]">
                                {money(pdp.recurrente ?? total)}
                              </span>
                            )}

                            <div className="mt-6 space-y-1.5 border-t border-[var(--color-accent)]/20 pt-4 text-[13.5px]">
                              {pdp.pagos.map((pg, i) => (
                                <div key={i} className="flex items-center justify-between gap-3">
                                  <span className="text-[var(--color-text-secondary)]">
                                    {pdp.pagos.length > 1 && `${i + 1}. `}
                                    {pg.label}
                                  </span>
                                  <span className="font-bold tabular-nums text-[var(--color-text-primary)]">{money(pg.monto)}</span>
                                </div>
                              ))}
                              <div className="flex items-center justify-between gap-3 border-t border-[var(--color-accent)]/20 pt-1.5">
                                <span className="font-semibold text-[var(--color-text-secondary)]">Total</span>
                                <span className="font-black tabular-nums text-[var(--color-text-primary)]">
                                  {money(total)} {pais.moneda}
                                </span>
                              </div>
                            </div>
                          </motion.div>

                          <p className="mt-3 text-center text-[12px] text-[var(--color-text-muted)]">
                            Precio de hoy — válido {VALIDEZ_DIAS} días.
                          </p>

                          <button
                            onClick={copiarResumen}
                            className="mt-3 flex items-center justify-center gap-2 rounded-full border border-[var(--color-border-strong)] py-3 text-[13px] font-semibold uppercase tracking-widest text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-accent)]/60 hover:text-[var(--color-text-primary)]"
                          >
                            {copiado ? (
                              <>
                                <Check size={14} className="text-emerald-600" /> Presupuesto copiado
                              </>
                            ) : copiarError ? (
                              <span className="text-red-600">No se pudo copiar</span>
                            ) : (
                              <>
                                <Copy size={13} /> Copiar presupuesto completo
                              </>
                            )}
                          </button>

                          <p className="mt-4 flex items-start gap-2 text-[12.5px] leading-relaxed text-[var(--color-text-muted)]">
                            <Info size={14} className="mt-0.5 shrink-0" />
                            Otras combinaciones de seña o cuotas quedan sujetas a aprobación.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function PlanCard({
  p,
  pais,
  precio,
  precioLista,
  cuotaEjemplo,
  elegido,
  onElegir,
  abierto,
  onToggle,
}: {
  p: Plan;
  pais: Pais;
  precio: number | null;
  precioLista: number | null;
  cuotaEjemplo: number | null;
  elegido: boolean;
  onElegir: () => void;
  abierto: boolean;
  onToggle: () => void;
}) {
  const ahorro = precio !== null && precioLista !== null ? precioLista - precio : null;
  const money = (n: number) => `${pais.simbolo}${fmt(n, pais.locale)}`;

  return (
    <div
      className={`relative flex h-full flex-col rounded-2xl border p-8 transition-all md:p-9 ${tierCard[p.tier]} ${
        elegido ? "ring-2 ring-[var(--color-accent)] ring-offset-2 ring-offset-[var(--color-bg-elevated-2)]" : ""
      }`}
    >
      {p.tier === "vip" && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[var(--color-accent)] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#0B0C0E]">
          Ruta profesional completa
        </span>
      )}

      <span className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-[var(--color-accent)]">{p.kicker}</span>
      <h3 className="mt-2 text-[20px] font-black tracking-tight text-[var(--color-text-primary)]">{p.label}</h3>
      <p className="mt-1.5 text-[13.5px] leading-snug text-[var(--color-text-muted)]">{p.tag}</p>
      <span className="mt-3 block text-[14px] font-semibold text-[var(--color-text-muted)]">{p.duracion}</span>

      {precioLista !== null && (
        <div className="mt-5 flex flex-wrap items-center gap-2.5">
          <span className="text-[17px] font-bold text-[var(--color-text-muted)] line-through decoration-red-500/70 decoration-2">
            {money(precioLista)}
          </span>
          <span className="rounded-full bg-red-500/15 px-2.5 py-1 text-[12px] font-bold uppercase tracking-wide text-red-500">
            -{PROMO.descuento}%
          </span>
        </div>
      )}
      <p className={`text-[2.7rem] font-black leading-none tracking-tight text-[var(--color-text-primary)] md:text-[3rem] ${precioLista !== null ? "mt-1.5" : "mt-5"}`}>
        {precio !== null ? money(precio) : "—"}
        <span className="ml-2 text-[15px] font-semibold text-[var(--color-text-muted)]">{pais.moneda}</span>
      </p>
      {ahorro !== null && ahorro > 0 && (
        <span className="mt-2 block text-[14px] font-semibold text-emerald-600">Ahorrás {money(ahorro)}</span>
      )}
      {p.listaUSD && (
        <span className="mt-1 block text-[12.5px] font-medium text-[var(--color-text-muted)]">
          Promo hasta el {fmtFecha(PROMO.hasta)}
        </span>
      )}
      <span className="mt-3 inline-flex w-fit items-center rounded-full border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/[0.08] px-3.5 py-1.5 text-[13.5px] font-bold text-[var(--color-accent)]">
        {cuotaEjemplo !== null ? `o ${p.maxCuotas} cuotas de ${money(cuotaEjemplo)}` : `Hasta ${p.maxCuotas} cuotas`}
      </span>

      <ul className="mt-7 flex flex-col gap-3">
        {p.highlights.map((h) => (
          <li key={h} className="flex items-start gap-2.5">
            <Check size={15} strokeWidth={2.5} className="mt-0.5 shrink-0 text-[var(--color-accent)]" />
            <span className="text-[14.5px] font-medium leading-snug text-[var(--color-text-primary)]">{h}</span>
          </li>
        ))}
      </ul>

      {p.features.length > 0 && (
        <>
          <button
            onClick={onToggle}
            className="mt-6 flex items-center justify-center gap-2 rounded-full border border-[var(--color-border)] py-2.5 text-[12px] font-semibold uppercase tracking-widest text-[var(--color-text-secondary)] transition-colors hover:border-black/25"
          >
            {abierto ? "Ocultar detalle" : "Ver detalle"}
            <ChevronDown size={13} strokeWidth={2.5} className={`transition-transform ${abierto ? "rotate-180" : ""}`} />
          </button>
          <AnimatePresence initial={false}>
            {abierto && (
              <motion.ul
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="mt-5 flex flex-col gap-3 border-t border-[var(--color-border)] pt-5">
                  {p.features.map((f) => (
                    <li key={f.t} className="flex items-start gap-2.5">
                      {f.ok === true ? (
                        <Check size={14} strokeWidth={2.5} className="mt-0.5 shrink-0 text-[var(--color-accent)]" />
                      ) : f.ok === "cond" ? (
                        <Star size={14} strokeWidth={2.5} className="mt-0.5 shrink-0 text-[var(--color-accent-secondary)]" />
                      ) : (
                        <X size={14} strokeWidth={2.5} className="mt-0.5 shrink-0 text-red-500" />
                      )}
                      <span
                        className={`text-[13.5px] font-medium leading-snug ${
                          f.ok === true
                            ? "text-[var(--color-text-primary)]"
                            : f.ok === "cond"
                              ? "text-[var(--color-accent-secondary)]"
                              : "text-[var(--color-text-muted)]"
                        }`}
                      >
                        {f.t}
                      </span>
                    </li>
                  ))}
                </div>
              </motion.ul>
            )}
          </AnimatePresence>
        </>
      )}

      <div className="mt-auto pt-7">
        <button
          onClick={onElegir}
          className={`flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-[13px] font-bold uppercase tracking-widest transition-colors ${
            elegido
              ? "bg-[var(--color-accent)] text-[#0B0C0E]"
              : "border border-[var(--color-accent)]/45 text-[var(--color-accent)] hover:bg-[var(--color-accent)]/[0.08]"
          }`}
        >
          {elegido ? (
            <>
              <Check size={14} strokeWidth={3} /> Elegido
            </>
          ) : (
            "Armar el pago"
          )}
        </button>
      </div>
    </div>
  );
}
