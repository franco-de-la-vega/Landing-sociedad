import { NextRequest, NextResponse } from "next/server";
import { HORAS } from "@/lib/booking";
import { agendaCrmConfigurado, cargarPool, reunionesDelDia, closerLibre, TZ_OFFSET } from "@/lib/agendaCrm";
import { availabilityNotion } from "@/lib/agendaNotion";

/**
 * Qué horas de un día ya no tienen ningún closer libre.
 * Respuesta: `{ ok, bookedHours: number[] }`. Lee el CRM si está configurado,
 * si no cae a Notion (mismo contrato).
 */
export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");
  const vendedor = req.nextUrl.searchParams.get("vendedor");

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ ok: false, error: "invalid_date" }, { status: 400 });
  }

  if (!agendaCrmConfigurado) {
    const r = await availabilityNotion(date, vendedor);
    return NextResponse.json(r.body, { status: r.status });
  }

  try {
    const pool = await cargarPool(vendedor);
    if (pool.length === 0) {
      return NextResponse.json({ ok: true, bookedHours: HORAS });
    }

    const reuniones = await reunionesDelDia(pool.map((c) => c.usuario_id), date);

    const bookedHours = HORAS.filter((h) => {
      const inicioMs = new Date(`${date}T${String(h).padStart(2, "0")}:00:00${TZ_OFFSET}`).getTime();
      return !pool.some((c) => closerLibre(c, date, inicioMs, reuniones.get(c.usuario_id) ?? []));
    });

    return NextResponse.json({ ok: true, bookedHours });
  } catch (e) {
    console.error("availability CRM:", e instanceof Error ? e.message : e);
    return NextResponse.json({ ok: false, error: "crm_error" }, { status: 502 });
  }
}
