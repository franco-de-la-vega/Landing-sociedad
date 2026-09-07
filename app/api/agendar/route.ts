import { NextRequest, NextResponse } from "next/server";
import { isHoneypotFilled } from "@/lib/antiSpam";
import { agendarNotion } from "@/lib/agendaNotion";
import { agendaCrmConfigurado, agendarCrm } from "@/lib/agendaCrm";

/**
 * Reserva de la landing.
 *
 * Camino nuevo: cae directo en el CRM (Supabase) en cuanto
 * `agendaCrmConfigurado` esté en `true` — es decir, en cuanto Vercel tenga
 * `SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY` cargadas. Hasta ese momento, sigue
 * escribiendo en Notion (fallback automático, cero riesgo mientras el equipo
 * sigue trabajando ahí). El corte es literalmente cargar esas dos variables.
 */
export async function POST(req: NextRequest) {
  const body = await req.json();

  if (isHoneypotFilled(body?.sitioWeb)) {
    return NextResponse.json({ ok: true, vendedor: body?.vendedor || "Franco" });
  }

  const r = agendaCrmConfigurado ? await agendarCrm(body) : await agendarNotion(body);
  return NextResponse.json(r.body, { status: r.status });
}
