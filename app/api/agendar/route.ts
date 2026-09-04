import { NextRequest, NextResponse } from "next/server";
import { alertFailure } from "@/lib/alert";
import { isHoneypotFilled } from "@/lib/antiSpam";
import { MIN_LEAD_HOURS, maxBookingDateKey } from "@/lib/booking";
import {
  agendaCrmConfigurado,
  cargarPool,
  reunionesDelDia,
  cargaFuturaPorForm,
  closerLibre,
  elegirCloser,
  upsertLead,
  crearReunionFormulario,
  TZ_OFFSET,
} from "@/lib/agendaCrm";
import { agendarNotion } from "@/lib/agendaNotion";

/**
 * Reserva de la landing. Si el CRM (Supabase) está configurado, escribe ahí
 * directo — busca/crea el lead, reparte el closer por prioridad, crea la
 * reunión y pasa el lead a "agendado". Si no, cae al camino viejo (Notion),
 * así el deploy nunca deja la página rota.
 *
 * Respuesta siempre `{ ok: true, vendedor: <nombre> }` en éxito.
 */
export async function POST(req: NextRequest) {
  const body = await req.json();

  if (isHoneypotFilled(body?.sitioWeb)) {
    return NextResponse.json({ ok: true, vendedor: body?.vendedor || "Franco" });
  }

  if (!agendaCrmConfigurado) {
    const r = await agendarNotion(body);
    return NextResponse.json(r.body, { status: r.status });
  }

  const { nombre, whatsapp, mensaje, date, hour, vendedor, situacion, busqueda, disponibilidad, email } = body as {
    nombre: string;
    whatsapp: string;
    mensaje?: string;
    date: string;
    hour: number;
    vendedor?: string;
    situacion?: string;
    busqueda?: string;
    disponibilidad?: string;
    email?: string;
  };

  if (!nombre || !whatsapp || !date || hour === undefined) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }
  if (whatsapp.replace(/[^0-9]/g, "").length < 8) {
    return NextResponse.json({ ok: false, error: "invalid_whatsapp" }, { status: 400 });
  }
  if (date > maxBookingDateKey()) {
    return NextResponse.json({ ok: false, error: "date_out_of_range" }, { status: 400 });
  }

  const hh = String(hour).padStart(2, "0");
  const iso = `${date}T${hh}:00:00${TZ_OFFSET}`;
  const inicioMs = new Date(iso).getTime();

  if (new Date(iso).getDay() === 0) {
    return NextResponse.json({ ok: false, error: "sunday_not_bookable" }, { status: 400 });
  }
  if (inicioMs < Date.now() + MIN_LEAD_HOURS * 3_600_000) {
    return NextResponse.json({ ok: false, error: "too_soon" }, { status: 400 });
  }

  try {
    const pool = await cargarPool(vendedor);
    if (pool.length === 0) {
      return NextResponse.json({ ok: false, error: "no_closers" }, { status: 409 });
    }

    const reuniones = await reunionesDelDia(pool.map((c) => c.usuario_id), date);
    const libres = pool.filter((c) => closerLibre(c, date, inicioMs, reuniones.get(c.usuario_id) ?? []));
    if (libres.length === 0) {
      return NextResponse.json({ ok: false, error: "slot_taken" }, { status: 409 });
    }

    let asignado = libres[0];
    if (!vendedor && libres.length > 1) {
      const carga = await cargaFuturaPorForm(libres.map((c) => c.usuario_id));
      asignado = elegirCloser(libres, carga) ?? libres[0];
    }

    const leadId = await upsertLead({ nombre, whatsapp, email, situacion, que_busca: busqueda, disponibilidad });
    await crearReunionFormulario({ leadId, closer: asignado, inicioISO: iso, notas: mensaje });

    return NextResponse.json({ ok: true, vendedor: asignado.nombre });
  } catch (err) {
    if (err instanceof Error && err.name === "SlotTaken") {
      return NextResponse.json({ ok: false, error: "slot_taken" }, { status: 409 });
    }
    console.error("agendar CRM:", err instanceof Error ? err.message : err);
    await alertFailure(
      "Falló una reserva de agenda (CRM)",
      `Nombre: ${body?.nombre}\nWhatsApp: ${body?.whatsapp}\nFecha: ${body?.date} ${hh}:00\n\n${err instanceof Error ? err.message : ""}`
    );
    return NextResponse.json({ ok: false, error: "crm_error" }, { status: 502 });
  }
}
