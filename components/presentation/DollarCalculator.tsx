"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy, Info, Users } from "lucide-react";

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

interface Plan {
  key: string;
  label: string;
  kicker: string;
  tag: string;
  duracion: string;
  /** Precio mensual mostrado grande arriba de cada card. */
  priceMonthly: number;
  /** Total real, pago único, mostrado chico debajo del mensual. */
  priceUSD: number;
  /** Precio de lista anterior, en USD (solo Carrera Completa, mostrado tachado). */
  listaUSD?: number;
  /** Máximo de pagos totales (la seña de hoy cuenta como el primero). */
  maxCuotas: number;
  tier: "base" | "mid" | "vip";
  badge?: string;
  /** El diferencial de marca: sesiones 1 a 1, siempre en su propio apartado destacado. */
  unoAUno: string;
  checks: string[];
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
//
// Reestructuración de planes (2026-09-21, pedido de Franco): precio mensual
// arriba, total chico debajo, apartado de sesiones 1 a 1 destacado como
// diferencial de marca en cada card. Los totales de High Ticket (547) y
// Carrera (905) cambiaron respecto a los anteriores (497 y 1429) — el
// checkout de dLocal en /pagar sigue cobrando los montos viejos hasta que se
// generen los nuevos links en el panel de dLocal y se reemplacen los snippets.
const PLANES: Plan[] = [
  {
    key: "junior",
    label: "Comercial Junior",
    kicker: "Entra a la profesión",
    tag: "Tu puerta de entrada a las ventas remotas.",
    duracion: "2 meses",
    priceMonthly: 198,
    priceUSD: 397,
    maxCuotas: 1,
    tier: "base",
    unoAUno: "6 sesiones personalizadas 1 a 1 con mentor especializado",
    checks: [
      "3 sesiones en vivo por semana",
      "Acceso completo a la plataforma / campus ILFC",
      "Preparación de perfil: CV y LinkedIn",
      "Acceso a bolsa de trabajo ILFC",
      "Certificado de finalización",
    ],
  },
  {
    key: "high-ticket",
    label: "Comercial High Ticket",
    kicker: "Especializate",
    tag: "Subí la complejidad. Subí tu nivel.",
    duracion: "3 meses",
    priceMonthly: 182,
    priceUSD: 547,
    maxCuotas: 2,
    tier: "mid",
    badge: "El más elegido",
    unoAUno: "12 sesiones personalizadas 1 a 1 (el doble de acompañamiento)",
    checks: [
      "Todo lo incluido en Comercial Junior",
      "Certificación oficial con historial de desempeño",
      "Evaluación final de especialización comercial",
      "Conexión con empresas (sujeta a aprobar el examen final)",
    ],
  },
  {
    key: "carrera",
    label: "Carrera Completa",
    kicker: "Profesionalizate",
    tag: "De aprender a vender a construir una carrera comercial.",
    duracion: "5 meses",
    priceMonthly: 181,
    priceUSD: 905,
    listaUSD: 1429,
    maxCuotas: 3,
    tier: "vip",
    badge: "Ruta profesional completa",
    unoAUno: "25 sesiones personalizadas 1 a 1 (acompañamiento total durante toda la carrera)",
    checks: [
      "Todo lo incluido en Comercial High Ticket",
      "Mindset y habilidades blandas para liderar procesos de venta",
      "Certificación oficial + historial de desempeño operativo",
      "Conexión directa con empresas, sin proceso de RRHH",
      "Acceso completo a la plataforma con prioridad de soporte",
    ],
  },
];

/** Misma superficie para las 3 — solo el grosor/color del borde marca jerarquía. */
const tierCard: Record<Plan["tier"], string> = {
  base: "border-[var(--color-border)] bg-[var(--color-bg-elevated)]",
  mid: "border-2 border-[var(--color-accent)] bg-[var(--color-bg-elevated)] lg:-translate-y-2",
  vip: "border border-[var(--color-accent)]/50 bg-[#151210] shadow-[0_30px_60px_-24px_rgba(0,0,0,0.55)] lg:-translate-y-3",
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
      <h2 className="mt-2 text-[1.8rem] font-black leading-[1.05] tracking-tight text-[var(--color-text-primary)] md:text-[2.2rem]">
        Elegí tu plan
      </h2>
      <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-[var(--color-text-secondary)]">
        Precios en dólares: es la moneda en la que se paga, sin sorpresas entre lo que ves acá y lo que se cobra.
      </p>

      <div className="mt-6 grid grid-cols-1 items-stretch gap-6 pt-3 lg:grid-cols-3 lg:gap-7 lg:pt-3">
        {PLANES.map((p) => (
          <PlanCard key={p.key} p={p} elegido={planKey === p.key} onElegir={() => elegirPlan(p.key)} />
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
              Precio de hoy, válido {VALIDEZ_DIAS} días.
            </p>

            <a
              href={DLOCAL_OPEN_CHECKOUT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] py-3.5 text-[13px] font-bold uppercase tracking-widest text-[#0B0C0E]"
            >
              Avanzar
            </a>
            <p className="mt-2 text-center text-[11px] leading-relaxed text-[var(--color-text-muted)]">
              Abre el link de pago, decile al cliente el monto de &ldquo;{pdp.pagos[0]?.label ?? "Hoy"}&rdquo; de arriba
              ({money(pdp.pagos[0]?.monto ?? total)}) para que lo cargue él mismo.
            </p>

            <button
              onClick={copiarResumen}
              className="mt-3 flex items-center justify-center gap-1.5 py-1 text-[12px] font-semibold text-[var(--color-text-muted)] underline-offset-4"
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

/**
 * Junior y High Ticket comparten la misma superficie clara — High Ticket se
 * destaca solo con borde y badge, no con otro color. El negro queda
 * reservado para una sola card: Carrera Completa, la más cara, la que
 * necesita sentirse "elite silenciosa". Un solo dorado, usado igual en
 * ambas superficies (clara y oscura) para que siga siendo un solo acento.
 */
const T_LIGHT = {
  primary: "text-[var(--color-text-primary)]",
  secondary: "text-[var(--color-text-secondary)]",
  muted: "text-[var(--color-text-muted)]",
  border: "border-[var(--color-border)]",
  accent: "text-[var(--color-accent)]",
  oneOnOneBorder: "border-[var(--color-accent)]",
};

const T_DARK = {
  primary: "text-white",
  secondary: "text-white/70",
  muted: "text-white/45",
  border: "border-white/12",
  accent: "text-[var(--color-accent)]",
  oneOnOneBorder: "border-[var(--color-accent)]",
};

/** Glifo de corona: trazo fino, una sola tinta. Vive dentro del medallón. */
function CrownGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 20" fill="none" className={className} aria-hidden>
      <path
        d="M3 17 L2 6.5 L8 11 L12 3 L16 11 L22 6.5 L21 17 Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path d="M3 17 H21" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Medallón de Carrera Completa: un sello circular de doble anillo, apoyado
 * sobre el vértice de la card (mitad afuera, mitad adentro), sin joyas ni
 * degradés estridentes. Es la única marca distintiva del tier VIP — discreta
 * a propósito, "elite silenciosa" y no bazar.
 */
function CrownSeal({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-accent)]/60 bg-[var(--color-bg-elevated)] shadow-[0_6px_16px_-6px_rgba(120,90,40,0.5)]">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-accent)]/25">
          <CrownGlyph className="h-4 w-4 text-[var(--color-accent-hover)]" />
        </div>
      </div>
    </div>
  );
}

function PlanCard({
  p,
  elegido,
  onElegir,
}: {
  p: Plan;
  elegido: boolean;
  onElegir: () => void;
}) {
  const isVip = p.tier === "vip";
  const T = isVip ? T_DARK : T_LIGHT;

  return (
    <div
      className={`relative flex h-full flex-col overflow-visible rounded-[20px] border p-5 shadow-[0_16px_36px_-18px_rgba(20,18,14,0.22)] transition-all ${tierCard[p.tier]} ${
        elegido ? "ring-2 ring-[var(--color-accent)] ring-offset-2 ring-offset-[var(--color-bg-elevated-2)]" : ""
      }`}
    >
      {isVip && <CrownSeal className="pointer-events-none absolute -top-2.5 -right-2.5" />}

      <div className="relative flex h-full flex-1 flex-col">
        {/* Alto reservado siempre, con o sin badge, para que las 3 cards arranquen el título a la misma altura. */}
        <span
          className={`mb-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-[var(--color-accent)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white ${
            p.badge ? "" : "invisible"
          }`}
        >
          {p.badge ?? "·"}
        </span>

        <span className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${T.accent}`}>{p.kicker}</span>
        <h3 className={`mt-1.5 text-[19px] font-black tracking-tight ${T.primary}`}>{p.label}</h3>
        <p className={`mt-1 text-[13px] leading-snug ${T.muted}`}>{p.tag}</p>
        <span className={`mt-2 block text-[11px] font-semibold uppercase tracking-wide ${T.secondary}`}>{p.duracion}</span>

        {/* ─── Precio: única fuente de verdad, mensual y total juntos, sin repetir más abajo ─── */}
        <div className={`mt-3.5 border-t pt-3.5 ${T.border}`}>
          {p.listaUSD !== undefined && (
            <span className={`block text-[12px] font-medium line-through decoration-1 ${T.muted}`}>
              {money(p.listaUSD)}
            </span>
          )}
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className={`text-[2rem] font-black leading-none tracking-tight ${T.primary}`}>
              ${p.priceMonthly}
            </span>
            <span className={`text-[12.5px] font-semibold ${T.muted}`}>USD /mes</span>
          </div>
          <p className={`mt-1 text-[14.5px] font-bold ${T.secondary}`}>
            Total: <span className={T.primary}>{money(p.priceUSD)}</span>
          </p>
        </div>

        {/* ─── Apartado 1 a 1: el diferencial de marca. Franja con borde lateral, no un botón. ─── */}
        <div className={`mt-3.5 flex items-start gap-2.5 border-l-2 py-1.5 pl-3 ${T.oneOnOneBorder}`}>
          <Users size={15} strokeWidth={2.25} className={`mt-0.5 shrink-0 ${T.accent}`} />
          <span className={`text-[13.5px] font-semibold leading-snug ${T.primary}`}>{p.unoAUno}</span>
        </div>

        <ul className="mt-3.5 flex flex-col gap-2">
          {p.checks.map((c) => (
            <li key={c} className="flex items-start gap-2">
              <Check size={15} strokeWidth={2.5} className={`mt-[3px] shrink-0 ${T.accent}`} />
              <span className={`text-[14px] font-medium leading-snug ${T.secondary}`}>{c}</span>
            </li>
          ))}
        </ul>

        <div className={`mt-auto border-t pt-4 ${T.border}`}>
          <a
            href={`/pagar/${p.key}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] py-2.5 text-[12px] font-bold uppercase tracking-widest text-white"
          >
            Inscribirme ahora
          </a>

          <button
            onClick={onElegir}
            className={`mt-2 flex w-full items-center justify-center gap-1.5 py-1 text-[11px] font-semibold underline-offset-4 transition-colors ${
              elegido ? T.accent + " underline" : T.muted
            }`}
          >
            {elegido ? (
              <>
                <Check size={12} strokeWidth={3} /> Armando el pago abajo ↓
              </>
            ) : (
              "¿Seña y cuotas? Armar el pago ↓"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
