import { NextRequest, NextResponse } from "next/server";
import { agendaCrmConfigurado, agendarCrm } from "@/lib/agendaCrm";
import { agendarNotion } from "@/lib/agendaNotion";
import { verificar } from "@/lib/aplicarToken";
import { buscarLlamadaPrevia } from "@/lib/aplicarStore";

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

  // Último chequeo antes de reservar: nadie con una llamada agendada o reciente (no show incluido) puede reservar otra.
  if (await buscarLlamadaPrevia({ whatsapp: t.w, email: t.e })) {
    return NextResponse.json({ ok: false, error: "llamada_previa" }, { status: 409 });
  }

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
  };
  const r = agendaCrmConfigurado ? await agendarCrm(payload) : await agendarNotion(payload);
  return NextResponse.json(r.body, { status: r.status });
}
