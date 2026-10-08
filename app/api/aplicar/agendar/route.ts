import { NextRequest, NextResponse } from "next/server";
import { agendaCrmConfigurado, agendarCrm } from "@/lib/agendaCrm";
import { agendarNotion } from "@/lib/agendaNotion";
import { VENDEDOR_UNICO } from "@/lib/booking";
import { verificar } from "@/lib/aplicarToken";

type Calificado = { v: "si"; n: string; w: string; e: string; r: string; s: string; b: string; d: string };

/**
 * Agenda SOLO con un token válido emitido por /api/aplicar/evaluar. Sin token
 * (o vencido) no se puede reservar por acá, así que saltearse el filtro no sirve.
 * Los datos de la persona salen del token, no del navegador.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const t = verificar<Calificado>(body?.token);
  if (!t || t.v !== "si") return NextResponse.json({ ok: false, error: "sin_permiso" }, { status: 403 });
  if (!body?.date || body?.hour === undefined) return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });

  const payload = {
    nombre: t.n,
    whatsapp: t.w,
    email: t.e,
    mensaje: t.r,
    situacion: t.s,
    busqueda: t.b,
    disponibilidad: t.d,
    date: String(body.date),
    hour: Number(body.hour),
    vendedor: VENDEDOR_UNICO,
  };
  const r = agendaCrmConfigurado ? await agendarCrm(payload) : await agendarNotion(payload);
  return NextResponse.json(r.body, { status: r.status });
}
