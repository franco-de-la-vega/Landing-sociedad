import { NextRequest, NextResponse } from "next/server";
import { availabilityNotion } from "@/lib/agendaNotion";

/**
 * Qué horas de un día ya no tienen ningún closer libre.
 *
 * Sigue leyendo de Notion mientras el equipo trabaja ahí (ver el TODO de
 * `/api/agendar`). Cuando se mude al CRM, esto pasa a leer `agendaCrm`.
 */
export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");
  const vendedor = req.nextUrl.searchParams.get("vendedor");

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ ok: false, error: "invalid_date" }, { status: 400 });
  }

  const r = await availabilityNotion(date, vendedor);
  return NextResponse.json(r.body, { status: r.status });
}
