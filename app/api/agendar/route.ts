import { NextRequest, NextResponse } from "next/server";

/**
 * Reserva de la landing.
 *
 * Camino nuevo: cae directo en el CRM (Supabase) en cuanto
 * `agendaCrmConfigurado` esté en `true` — es decir, en cuanto Vercel tenga
 * `SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY` cargadas. Hasta ese momento, sigue
 * escribiendo en Notion (fallback automático, cero riesgo mientras el equipo
 * sigue trabajando ahí). El corte es literalmente cargar esas dos variables.
 */
export async function POST() {
  // Cerrada: las reservas ahora solo entran por /api/aplicar/agendar, que exige haber pasado el filtro.
  return NextResponse.json({ ok: false, error: "reservas_cerradas_usar_aplicar" }, { status: 410 });
}
