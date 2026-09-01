"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calculator, Check, Copy, Info, Loader2, RefreshCw } from "lucide-react";

type DolarData = { compra: number; venta: number; promedio: number; fechaActualizacion: string };

const PLANES = [
  { key: "junior", label: "Comercial Junior", priceUSD: 397, maxCuotas: 2 },
  { key: "high-ticket", label: "Comercial High Ticket", priceUSD: 497, maxCuotas: 3 },
  { key: "carrera", label: "Carrera Completa", priceUSD: 1429, maxCuotas: 3 },
] as const;

function formatARS(n: number) {
  return new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 }).format(Math.round(n));
}

function tiempoRelativo(segundos: number) {
  if (segundos < 60) return `hace ${segundos}s`;
  const min = Math.floor(segundos / 60);
  return `hace ${min} min`;
}

// Widget de cierre: se usa como última pantalla de /presentacion, en vivo
// frente al lead, para el momento de negociar el pago. Flujo: elige el
// plan, dice cuánto tiene para invertir AHORA (en pesos), y el widget
// calcula el equivalente en USD y cuánto le queda por invertir — ese
// resto se reparte en las cuotas que permita el plan elegido.
export default function DollarCalculator() {
  const [dolar, setDolar] = useState<DolarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [planKey, setPlanKey] = useState<(typeof PLANES)[number]["key"]>("junior");
  const [montoArs, setMontoArs] = useState("");
  const [cuotas, setCuotas] = useState(1);
  const [fetchedAt, setFetchedAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [copiado, setCopiado] = useState(false);
  const [copiarError, setCopiarError] = useState(false);

  const plan = PLANES.find((p) => p.key === planKey)!;

  async function fetchDolar() {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/dolar");
      const data = await res.json();
      if (!data.ok) throw new Error("dolar_unavailable");
      setDolar(data);
      setFetchedAt(Date.now());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDolar();
  }, []);

  // reloj propio para el "hace X seg/min", sin depender de refetch
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // al cambiar de plan, si la cuota elegida ya no es válida para el nuevo
  // tope, se recorta al máximo permitido.
  useEffect(() => {
    setCuotas((c) => Math.min(c, plan.maxCuotas));
  }, [plan.maxCuotas]);

  const totalUsd = plan.priceUSD;
  const totalArs = dolar ? totalUsd * dolar.promedio : null;

  // "¿Cuánto invierte ahora?" en pesos -> a cuántos USD equivale.
  const montoArsNum = Number(montoArs) || 0;
  const montoUsdAhora = dolar && montoArsNum > 0 ? montoArsNum / dolar.promedio : 0;

  // Lo que le queda por invertir después de eso, repartido en las cuotas
  // que permita el plan.
  const restanteUsd = Math.max(0, totalUsd - montoUsdAhora);
  const restanteArs = dolar ? restanteUsd * dolar.promedio : null;
  const arsPorCuota = restanteArs !== null ? restanteArs / cuotas : null;
  const usdPorCuota = restanteUsd / cuotas;
  const cubreTodo = montoArsNum > 0 && restanteUsd <= 0;

  function copiarResumen() {
    if (!dolar) return;
    const lineas = [
      `Plan: ${plan.label} ($${plan.priceUSD} USD)`,
      `Dólar oficial (promedio): $${formatARS(dolar.promedio)}`,
      montoArsNum > 0 ? `Invierte ahora: $${formatARS(montoArsNum)} ARS (≈ $${montoUsdAhora.toFixed(2)} USD)` : null,
      cubreTodo
        ? "Con eso cubre el total del plan."
        : `Le queda por invertir: $${restanteUsd.toFixed(2)} USD (≈ $${restanteArs !== null ? formatARS(restanteArs) : "—"} ARS)`,
      !cubreTodo ? `En ${cuotas} ${cuotas === 1 ? "cuota" : "cuotas"} de $${arsPorCuota !== null ? formatARS(arsPorCuota) : "—"} ARS c/u` : null,
    ].filter(Boolean);
    navigator.clipboard
      .writeText(lineas.join("\n"))
      .then(() => {
        setCopiado(true);
        setCopiarError(false);
        setTimeout(() => setCopiado(false), 2000);
      })
      .catch(() => {
        setCopiarError(true);
        setTimeout(() => setCopiarError(false), 2500);
      });
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#0A0B0D] p-8 shadow-[0_40px_90px_-24px_rgba(0,0,0,0.7)] md:p-12">
      {/* mismo lenguaje visual "de cierre" que el resto de la presentación: panel oscuro + glow dorado */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-[26rem] w-[36rem] -translate-x-1/2 opacity-[0.14] blur-3xl"
        style={{ background: "radial-gradient(ellipse, var(--color-accent) 0%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative">
        <span className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-white/50">
          <Calculator size={13} className="text-[var(--color-accent)]" />
          Cerrando en vivo
        </span>
        <h2 className="mt-3 text-[1.5rem] font-black leading-[1.1] tracking-tight text-white md:text-[1.8rem]">
          ¿Cuánto es en pesos?
        </h2>
        <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-white/55">
          Dólar oficial en el momento. Decís cuánto invierte ahora y el
          widget calcula el resto, en las cuotas que permita el plan.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-12 md:grid-cols-2">
          {/* columna izquierda: cotización, plan, monto */}
          <div>
            {/* cotización */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-6">
              {loading && !dolar && (
                <span className="flex items-center gap-2 text-[13.5px] font-medium text-white/50">
                  <Loader2 size={14} className="animate-spin" /> Consultando cotización...
                </span>
              )}
              {!loading && error && !dolar && (
                <span className="text-[13.5px] font-medium text-red-400">
                  No pudimos traer la cotización. Probá de nuevo.
                </span>
              )}
              {dolar && (
                <div className={loading ? "opacity-50 transition-opacity" : "transition-opacity"}>
                  <span className="block text-[11.5px] font-semibold uppercase tracking-wide text-white/40">
                    Dólar oficial · promedio compra/venta
                  </span>
                  <span className="mt-1 block text-[25px] font-black tracking-tight text-[var(--color-accent)]">
                    ${formatARS(dolar.promedio)}
                  </span>
                  <span className="mt-0.5 block text-[12px] text-white/40">
                    Compra ${formatARS(dolar.compra)} · Venta ${formatARS(dolar.venta)} · Fuente: Banco Nación
                  </span>
                  {fetchedAt !== null && (
                    <span className="mt-0.5 block text-[11px] text-white/30">
                      Actualizado {tiempoRelativo(Math.max(0, Math.floor((now - fetchedAt) / 1000)))}
                    </span>
                  )}
                </div>
              )}
              <button
                onClick={fetchDolar}
                disabled={loading}
                className="flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-2 text-[12px] font-semibold text-white/60 transition-colors hover:border-[var(--color-accent)]/50 hover:text-white disabled:opacity-40"
              >
                <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Actualizar
              </button>
            </div>

            {/* cuánto invierte ahora, en pesos */}
            <div className="mt-7 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-5">
              <label className="mb-2.5 block text-[12px] font-semibold uppercase tracking-wide text-white/50">
                ¿Cuánto invierte ahora? (en pesos)
              </label>
              <div className="flex items-center gap-2.5">
                <span className="text-[14px] font-semibold text-white/40">$</span>
                <input
                  type="number"
                  min={0}
                  value={montoArs}
                  onChange={(e) => setMontoArs(e.target.value)}
                  placeholder="Ej: 50000"
                  className="w-full rounded-lg border border-white/15 bg-white/[0.06] px-4 py-3 text-[15px] text-white outline-none transition-colors focus:border-[var(--color-accent)]"
                />
                <span className="shrink-0 text-[12px] font-semibold text-white/40">ARS</span>
              </div>
              {montoArsNum > 0 && (
                <p className="mt-3.5 border-t border-white/10 pt-3.5 text-[13.5px] text-white/60">
                  ${formatARS(montoArsNum)} ARS serían{" "}
                  <span className="font-semibold text-white">${montoUsdAhora.toFixed(2)} USD</span>.
                </p>
              )}
            </div>

            {/* plan */}
            <div className="mt-7">
              <label className="mb-3 block text-[12px] font-semibold uppercase tracking-wide text-white/50">
                Plan
              </label>
              <div className="flex flex-col gap-2.5">
                {PLANES.map((p) => (
                  <button
                    key={p.key}
                    onClick={() => setPlanKey(p.key)}
                    className={`rounded-lg border px-4 py-3 text-left transition-colors ${
                      planKey === p.key
                        ? "border-[var(--color-accent)] bg-[var(--color-accent)]/15"
                        : "border-white/15 hover:border-[var(--color-accent)]/40"
                    }`}
                  >
                    <span className={`block text-[13.5px] font-semibold ${planKey === p.key ? "text-[var(--color-accent)]" : "text-white"}`}>
                      {p.label}
                    </span>
                    <span className="mt-0.5 block text-[12px] text-white/45">
                      ${p.priceUSD} USD · hasta {p.maxCuotas} cuota{p.maxCuotas > 1 ? "s" : ""}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* columna derecha: resultado, cuotas, copiar */}
          <div className="flex flex-col">
            <motion.div
              key={`${planKey}-${montoArsNum}-${cuotas}-${dolar?.promedio ?? 0}`}
              initial={{ opacity: 0, y: 6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative overflow-hidden rounded-xl border border-[var(--color-accent)]/30 bg-gradient-to-b from-[var(--color-accent)]/[0.12] to-transparent px-7 py-8 text-center"
            >
              {cubreTodo ? (
                <>
                  <span className="block text-[12px] font-semibold uppercase tracking-wide text-white/50">
                    Le queda por invertir
                  </span>
                  <span className="mt-2 block text-[2rem] font-black leading-none tracking-tight text-emerald-400 md:text-[2.3rem]">
                    $0
                  </span>
                  <span className="mt-2 block text-[13px] text-white/50">
                    Con eso ya cubre el total del plan (${totalUsd} USD).
                  </span>
                </>
              ) : (
                <>
                  <span className="block text-[12px] font-semibold uppercase tracking-wide text-white/50">
                    Le queda por invertir
                  </span>
                  <span className="mt-2 block text-[1.7rem] font-black leading-none tracking-tight text-white md:text-[2rem]">
                    ${restanteUsd.toFixed(2)} <span className="text-[15px] font-medium text-white/40">USD</span>
                  </span>
                  {totalArs !== null && restanteArs !== null && (
                    <span className="mt-1.5 block text-[13px] text-white/50">
                      ≈ ${formatARS(restanteArs)} ARS
                    </span>
                  )}

                  {/* en cuántas cuotas, del resto */}
                  <div className="mt-6 border-t border-white/10 pt-6">
                    <label className="mb-3 block text-[11.5px] font-semibold uppercase tracking-wide text-white/50">
                      Ese resto, ¿en cuántas cuotas?
                    </label>
                    <div className="flex justify-center gap-2.5">
                      {Array.from({ length: plan.maxCuotas }, (_, i) => i + 1).map((n) => (
                        <button
                          key={n}
                          onClick={() => setCuotas(n)}
                          className={`flex-1 max-w-[9rem] rounded-lg border py-2.5 text-[13.5px] font-semibold transition-colors ${
                            cuotas === n
                              ? "border-[var(--color-accent)] bg-[var(--color-accent)]/15 text-[var(--color-accent)]"
                              : "border-white/15 text-white/60 hover:border-[var(--color-accent)]/40 hover:text-white"
                          }`}
                        >
                          {n === 1 ? "1 cuota" : `${n} cuotas`}
                        </button>
                      ))}
                    </div>

                    <div className="mt-5">
                      <span className="block text-[12px] font-semibold uppercase tracking-wide text-white/50">
                        {cuotas === 1 ? "Paga esa cuota" : `Cada una de las ${cuotas} cuotas`}
                      </span>
                      <span className="mt-1.5 block text-[2.1rem] font-black leading-none tracking-tight text-white md:text-[2.4rem]">
                        {arsPorCuota !== null ? `$${formatARS(arsPorCuota)}` : "—"}
                        <span className="ml-2 text-[14px] font-medium text-white/40">ARS</span>
                      </span>
                      <span className="mt-1.5 block text-[12px] text-white/40">
                        (${usdPorCuota.toFixed(2)} USD por cuota)
                      </span>
                    </div>
                  </div>
                </>
              )}
            </motion.div>

            {/* copiar resumen para el lead */}
            <button
              onClick={copiarResumen}
              disabled={!dolar}
              className="mt-5 flex items-center justify-center gap-2 rounded-lg border border-white/15 py-3 text-[13px] font-semibold text-white/70 transition-colors hover:border-[var(--color-accent)]/50 hover:text-white disabled:opacity-40"
            >
              {copiado ? (
                <>
                  <Check size={13} className="text-emerald-400" /> Copiado
                </>
              ) : copiarError ? (
                <span className="text-red-400">No se pudo copiar, probá de nuevo</span>
              ) : (
                <>
                  <Copy size={13} /> Copiar resumen para el lead
                </>
              )}
            </button>

            <p className="mt-3.5 flex items-start gap-1.5 text-[12px] leading-relaxed text-white/40">
              <Info size={13} className="mt-0.5 shrink-0" />
              Cualquier combinación de monto o plazos distinta a esto queda
              sujeta a aprobación.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
