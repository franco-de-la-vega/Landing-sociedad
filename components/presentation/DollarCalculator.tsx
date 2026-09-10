"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, Copy, Info, Star, X } from "lucide-react";

// ─────────────── Config de negocio ───────────────

/** Días que "vale" el presupuesto que se copia. */
const VALIDEZ_DIAS = 7;

/** Promo de Carrera Completa. Poné la fecha real de fin. */
const PROMO = { descuento: 20, hasta: "2026-09-30" };

/** Link de pago abierto de dLocal Go — el cliente carga el monto que se
 * acordó en la llamada (seña, cuota, lo que sea). Para eso está la
 * calculadora: le muestra al closer el número exacto a decirle antes de
 * mandar este link. Pedido de Franco, 2026-09-10. */
const DLOCAL_OPEN_CHECKOUT_URL = "https://checkout.dlocalgo.com/open-checkout/b3Blbl9saW5rOm1pZDoyMzg5NzA=";

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

// Cuotas del resto (2026-09-07): Junior sin cuotas (pago único), High Ticket
// hasta 2, Carrera hasta 3. Cualquier otra combinación queda "sujeta a
// aprobación" (aviso fijo debajo de la calculadora).
// Nota interna: High Ticket en cuotas lleva ~10% de recargo por inflación — NO
// se calcula acá a propósito, lo ajusta el closer en la llamada (lo cubre el
// aviso de "sujeto a aprobación").
// Precios siempre en USD (2026-09-10): antes se convertía a moneda local con
// el dólar blue, pero el checkout de dLocal siempre cobra en USD a su propio
// tipo de cambio — mostrar un monto en ARS que después no coincide con lo que
// ve el cliente en el checkout generaba desconfianza. Un solo precio, el real.
const PLANES: Plan[] = [
  {
    key: "junior",
    label: "Comercial Junior",
    kicker: "Entrá a la profesión",
    tag: "Tu puerta de entrada a las ventas remotas.",
    duracion: "2 meses",
    priceUSD: 397,
    maxCuotas: 1,
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
    maxCuotas: 2,
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

const tierCard: Record<Plan["tier"], string> = {
  base: "border-[var(--color-border)] bg-[var(--color-bg-elevated)]",
  mid: "border-[var(--color-border)] bg-[var(--color-bg-elevated)]",
  vip: "border-[var(--color-accent)]/50 bg-[var(--color-accent-muted)] lg:-translate-y-3",
};

// ─────────────── Helpers ───────────────

function money(n: number) {
  return `US$${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Math.round(n))}`;
}

function fmtFecha(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });
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
    // La seña es un adelanto de la 1ª cuota, no un pago aparte que se suma.
    const cuota = total / n;
    const primeraCuota = Math.max(0, cuota - sena);
    const pagos: Pago[] = [{ label: "Hoy (seña)", monto: sena }];
    if (primeraCuota > 0) pagos.push({ label: "Antes de arrancar la formación", monto: primeraCuota });
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
  const [planKey, setPlanKey] = useState<string>("junior");
  const [monto, setMonto] = useState("");
  const [cuotas, setCuotas] = useState(1);
  const [expandido, setExpandido] = useState<string[]>([]);
  const [copiado, setCopiado] = useState(false);
  const [copiarError, setCopiarError] = useState(false);

  const calcRef = useRef<HTMLDivElement>(null);
  const plan = PLANES.find((p) => p.key === planKey)!;

  useEffect(() => {
    setCuotas((c) => Math.min(Math.max(c, 1), plan.maxCuotas));
  }, [plan.maxCuotas]);

  function elegirPlan(key: string) {
    setPlanKey(key);
    requestAnimationFrame(() => calcRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }));
  }

  const total = plan.priceUSD;
  const montoNum = Math.max(0, Number(monto) || 0);
  const pdp = planDePago(total, cuotas, montoNum);
  const cubreTodo = pdp.cubierto;

  function presupuesto(): string {
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
      L.push(`Precio de lista: ${money(plan.listaUSD)}`);
      L.push(`Precio con promoción (-${PROMO.descuento}%): ${money(plan.priceUSD)}`);
      L.push(`Promoción válida hasta: ${fmtFecha(PROMO.hasta)}`);
    } else {
      L.push(`Precio: ${money(plan.priceUSD)}`);
    }
    L.push("");
    L.push("PLAN DE PAGO");
    pdp.pagos.forEach((p, i) => L.push(`  ${pdp.pagos.length > 1 ? `${i + 1}. ` : ""}${p.label}: ${money(p.monto)}`));
    if (montoNum > 0 && !cubreTodo) L.push(`  (Resto: ${money(total - montoNum)})`);
    L.push(`  TOTAL: ${money(total)}`);
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

  return (
    <div>
      <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
        La inversión
      </span>
      <h2 className="mt-3 text-[2rem] font-black leading-[1.05] tracking-tight text-[var(--color-text-primary)] md:text-[2.6rem]">
        Elegí tu plan
      </h2>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
        Precios en dólares — es la moneda en la que se paga, sin sorpresas entre lo que ves acá y lo que se cobra.
      </p>

      <div className="mt-9 grid grid-cols-1 items-start gap-5 lg:grid-cols-3 lg:gap-6 lg:pt-3">
        {PLANES.map((p) => (
          <PlanCard
            key={p.key}
            p={p}
            elegido={planKey === p.key}
            onElegir={() => elegirPlan(p.key)}
            abierto={expandido.includes(p.key)}
            onToggle={() => setExpandido((a) => (a.includes(p.key) ? a.filter((k) => k !== p.key) : [...a, p.key]))}
          />
        ))}
      </div>

      {/* ─── Calculadora de seña ─── */}
      <div
        ref={calcRef}
        className="mt-14 scroll-mt-24 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-7 md:p-9"
      >
        <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
          Armá el pago · {plan.label}
        </span>

        <div className="mt-6 grid grid-cols-1 gap-9 md:grid-cols-2">
          <div>
            <label className="mb-2.5 block text-[13px] font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
              ¿Con cuánto seña ahora? <span className="font-normal normal-case text-[var(--color-text-muted)]">(en USD, opcional)</span>
            </label>
            <div className="flex items-center gap-3">
              <span className="text-[16px] font-bold text-[var(--color-text-muted)]">US$</span>
              <input
                type="number"
                min={0}
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                placeholder="Ej: 100"
                className="no-spinner w-full rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] px-4 py-3 text-[16px] font-medium text-[var(--color-text-primary)] outline-none transition-colors focus:border-[var(--color-accent)]"
              />
            </div>

            {plan.maxCuotas > 1 && (
              <>
                <label className="mb-2.5 mt-6 block text-[13px] font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
                  {montoNum > 0 ? "¿El resto en cuántas cuotas?" : "¿En cuántas cuotas?"}
                </label>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: plan.maxCuotas }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      onClick={() => setCuotas(n)}
                      className={`rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
                        cuotas === n
                          ? "border-[var(--color-accent)] bg-[var(--color-accent-muted)] text-[var(--color-accent)]"
                          : "border-[var(--color-border-strong)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)]/50"
                      }`}
                    >
                      {n === 1 ? "1 cuota" : `${n} cuotas`}
                    </button>
                  ))}
                </div>
              </>
            )}

            <p className="mt-5 text-[13.5px] leading-relaxed text-[var(--color-text-secondary)]">
              {plan.label}: <span className="font-bold text-[var(--color-text-primary)]">{money(total)}</span> en total.
            </p>
          </div>

          <div className="flex flex-col">
            <motion.div
              key={`${planKey}-${montoNum}-${cuotas}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-xl border border-[var(--color-accent)]/35 bg-[var(--color-accent-muted)] px-6 py-6"
            >
              <span className="block text-center text-[11.5px] font-semibold uppercase tracking-[0.15em] text-[var(--color-text-secondary)]">
                {cubreTodo
                  ? "Cubierto con la seña"
                  : cuotas === 1 && montoNum === 0
                    ? "Pago único de"
                    : montoNum > 0
                      ? "Plan de pago con seña"
                      : `${cuotas} cuotas de`}
              </span>
              {!cubreTodo && montoNum === 0 && (
                <span className="mt-2 block text-center text-[2.3rem] font-black leading-none tracking-tight text-[var(--color-accent)] md:text-[2.6rem]">
                  {money(pdp.recurrente ?? total)}
                </span>
              )}

              <div className="mt-5 space-y-1.5 border-t border-[var(--color-accent)]/20 pt-4 text-[13px]">
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
                  <span className="font-black tabular-nums text-[var(--color-text-primary)]">{money(total)}</span>
                </div>
              </div>
            </motion.div>

            <p className="mt-3 text-center text-[12px] text-[var(--color-text-muted)]">
              Precio de hoy — válido {VALIDEZ_DIAS} días.
            </p>

            <a
              href={DLOCAL_OPEN_CHECKOUT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] py-3.5 text-[13px] font-bold uppercase tracking-widest text-[#0B0C0E] transition-transform hover:scale-[1.02] hover:bg-[var(--color-accent-hover)]"
            >
              Avanzar
            </a>
            <p className="mt-2 text-center text-[11px] leading-relaxed text-[var(--color-text-muted)]">
              Abre el link de pago — decile al cliente el monto de &ldquo;{pdp.pagos[0]?.label ?? "Hoy"}&rdquo; de arriba
              ({money(pdp.pagos[0]?.monto ?? total)}) para que lo cargue él mismo.
            </p>

            <button
              onClick={copiarResumen}
              className="mt-3 flex items-center justify-center gap-1.5 py-1 text-[12px] font-semibold text-[var(--color-text-muted)] underline-offset-4 transition-colors hover:text-[var(--color-accent)] hover:underline"
            >
              {copiado ? (
                <>
                  <Check size={13} className="text-emerald-600" /> Presupuesto copiado
                </>
              ) : copiarError ? (
                <span className="text-red-600">No se pudo copiar</span>
              ) : (
                <>
                  <Copy size={12} /> Copiar presupuesto completo
                </>
              )}
            </button>

            <p className="mt-4 flex items-start gap-2 text-[12px] leading-relaxed text-[var(--color-text-muted)]">
              <Info size={13} className="mt-0.5 shrink-0" />
              Otras combinaciones de seña o cuotas quedan sujetas a aprobación.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlanCard({
  p,
  elegido,
  onElegir,
  abierto,
  onToggle,
}: {
  p: Plan;
  elegido: boolean;
  onElegir: () => void;
  abierto: boolean;
  onToggle: () => void;
}) {
  const ahorro = p.listaUSD ? p.listaUSD - p.priceUSD : null;

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

      {p.listaUSD !== undefined && (
        <div className="mt-5 flex flex-wrap items-center gap-2.5">
          <span className="text-[17px] font-bold text-[var(--color-text-muted)] line-through decoration-red-500/70 decoration-2">
            {money(p.listaUSD)}
          </span>
          <span className="rounded-full bg-red-500/15 px-2.5 py-1 text-[12px] font-bold uppercase tracking-wide text-red-500">
            -{PROMO.descuento}%
          </span>
        </div>
      )}
      <p className={`text-[2.7rem] font-black leading-none tracking-tight text-[var(--color-text-primary)] md:text-[3rem] ${p.listaUSD !== undefined ? "mt-1.5" : "mt-5"}`}>
        {money(p.priceUSD)}
      </p>
      {ahorro !== null && ahorro > 0 && (
        <span className="mt-2 block text-[14px] font-semibold text-emerald-600">Ahorrás {money(ahorro)}</span>
      )}
      {p.listaUSD && (
        <span className="mt-1 block text-[12.5px] font-medium text-[var(--color-text-muted)]">
          Promo hasta el {fmtFecha(PROMO.hasta)}
        </span>
      )}
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
        <a
          href={`/pagar/${p.key}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] py-3.5 text-[13px] font-bold uppercase tracking-widest text-[#0B0C0E] transition-transform hover:scale-[1.02] hover:bg-[var(--color-accent-hover)]"
        >
          Pagar ahora
        </a>
        <p className="mt-2 text-center text-[11px] leading-relaxed text-[var(--color-text-muted)]">
          Abre en pestaña nueva — pago fijo de {money(p.priceUSD)}, listo para compartir.
        </p>

        <button
          onClick={onElegir}
          className={`mt-3 flex w-full items-center justify-center gap-1.5 py-1 text-[12px] font-semibold underline-offset-4 transition-colors ${
            elegido ? "text-[var(--color-accent)] underline" : "text-[var(--color-text-muted)] hover:text-[var(--color-accent)] hover:underline"
          }`}
        >
          {elegido ? (
            <>
              <Check size={13} strokeWidth={3} /> Armando el pago abajo ↓
            </>
          ) : (
            "¿Seña y cuotas? Armar el pago ↓"
          )}
        </button>
      </div>
    </div>
  );
}
