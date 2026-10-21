import { NextRequest, NextResponse } from "next/server";
import { agendaCrmConfigurado, horizonteAgenda } from "@/lib/agendaCrm";
import { maxBookingDateKey, sabadoDeSemanaKey, hoyArgentinaKey } from "@/lib/booking";

export const dynamic = "force-dynamic";

/**
 * Hasta qué día se puede agendar hoy y qué días tienen lugar (`libres`).
 * Se cachea unos segundos: con mucho tráfico no se consulta CRM + Google en cada visita.
 */
export async function GET(req: NextRequest) {
  const vendedor = req.nextUrl.searchParams.get("vendedor");
  const tope = maxBookingDateKey();
  const h = agendaCrmConfigurado
    ? await horizonteAgenda(vendedor)
    : { limite: sabadoDeSemanaKey(hoyArgentinaKey()), libres: null };
  return NextResponse.json(
    { ok: true, limite: h.limite < tope ? h.limite : tope, libres: h.libres },
    { headers: { "Cache-Control": "public, s-maxage=10, stale-while-revalidate=30" } }
  );
}
