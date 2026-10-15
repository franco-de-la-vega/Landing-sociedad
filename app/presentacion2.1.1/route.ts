import html from "./html";

export const dynamic = "force-dynamic";

type Cotizacion = { promedio: number; fecha: string };

const VIGENCIA_MS = 5 * 60 * 1000;
let ultima: { dato: Cotizacion; en: number } | null = null;

/** Dólar blue = promedio entre compra y venta. Si la consulta falla, devuelve la última conocida (o null). */
async function dolarBlue(): Promise<Cotizacion | null> {
  if (ultima && Date.now() - ultima.en < VIGENCIA_MS) return ultima.dato;
  try {
    const res = await fetch("https://dolarapi.com/v1/dolares/blue", {
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
    });
    const d = (await res.json()) as { compra: number; venta: number; fechaActualizacion: string };
    if (!res.ok || !(d.compra > 0) || !(d.venta > 0)) throw new Error("cotización inválida");
    ultima = { dato: { promedio: (d.compra + d.venta) / 2, fecha: d.fechaActualizacion }, en: Date.now() };
    return ultima.dato;
  } catch {
    return ultima?.dato ?? null;
  }
}

export async function GET() {
  const blue = await dolarBlue();
  return new Response(html.replace("/*BLUE*/null", JSON.stringify(blue)), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
