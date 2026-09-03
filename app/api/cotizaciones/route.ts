import { NextResponse } from "next/server";

// Cotizaciones para la calculadora de /presentacion. Dos fuentes, las dos
// públicas y gratis (sin API key):
//
//  - dolarapi.com → dólar BLUE de Argentina. Se usa el blue (no el oficial)
//    porque es el tipo de cambio real al que se compran los dólares después.
//  - open.er-api.com → resto de las monedas (MXN, COP, CLP, PEN, UYU, EUR…),
//    USD como base.
//
// Se cachea 10 minutos: ninguna se mueve minuto a minuto.
export const revalidate = 600;

async function blueARS(): Promise<number | null> {
  try {
    const res = await fetch("https://dolarapi.com/v1/dolares/blue", { next: { revalidate: 600 } });
    if (!res.ok) return null;
    const d = await res.json();
    const compra = Number(d.compra);
    const venta = Number(d.venta);
    if (!Number.isFinite(compra) || !Number.isFinite(venta)) return null;
    return (compra + venta) / 2;
  } catch {
    return null;
  }
}

async function fxDesdeUSD(): Promise<Record<string, number>> {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD", { next: { revalidate: 600 } });
    if (!res.ok) return {};
    const d = await res.json();
    return d?.rates && typeof d.rates === "object" ? d.rates : {};
  } catch {
    return {};
  }
}

export async function GET() {
  const [blue, fx] = await Promise.all([blueARS(), fxDesdeUSD()]);

  // Sin ninguna de las dos no hay nada que mostrar.
  if (blue === null && Object.keys(fx).length === 0) {
    return NextResponse.json({ ok: false, error: "cotizaciones_unavailable" }, { status: 502 });
  }

  return NextResponse.json({
    ok: true,
    // ARS por USD (blue). El resto de las monedas salen de `fx`.
    blue,
    fx,
    actualizado: new Date().toISOString(),
  });
}
