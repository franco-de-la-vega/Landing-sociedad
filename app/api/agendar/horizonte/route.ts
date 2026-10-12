import { NextRequest, NextResponse } from "next/server";
import { agendaCrmConfigurado, fechaLimiteAgendable } from "@/lib/agendaCrm";
import { maxBookingDateKey, sabadoDeSemanaKey, hoyArgentinaKey } from "@/lib/booking";

export const dynamic = "force-dynamic";

/** Último día agendable hoy: la semana en curso, y la siguiente recién cuando se llena. */
export async function GET(req: NextRequest) {
  const vendedor = req.nextUrl.searchParams.get("vendedor");
  const limite = agendaCrmConfigurado ? await fechaLimiteAgendable(vendedor) : sabadoDeSemanaKey(hoyArgentinaKey());
  return NextResponse.json({ ok: true, limite: limite < maxBookingDateKey() ? limite : maxBookingDateKey() });
}
