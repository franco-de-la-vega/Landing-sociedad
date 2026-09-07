import { NextRequest, NextResponse } from "next/server";
import { availabilityNotion } from "@/lib/agendaNotion";
import { agendaCrmConfigurado, availabilidadCrm } from "@/lib/agendaCrm";

/**
 * Qué horas de un día ya no tienen ningún closer libre.
 *
 * Camino nuevo: CRM (Supabase), en cuanto `agendaCrmConfigurado` esté en
 * `true` (variables de entorno cargadas en Vercel). Mientras tanto, sigue
 * leyendo de Notion — fallback automático, sin nada que tocar acá.
 */
export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");
  const vendedor = req.nextUrl.searchParams.get("vendedor");

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ ok: false, error: "invalid_date" }, { status: 400 });
  }

  const r = agendaCrmConfigurado ? await availabilidadCrm(date, vendedor) : await availabilityNotion(date, vendedor);
  return NextResponse.json(r.body, { status: r.status });
}
