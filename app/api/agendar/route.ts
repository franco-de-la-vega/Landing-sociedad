import { NextRequest, NextResponse } from "next/server";
import { isHoneypotFilled } from "@/lib/antiSpam";
import { agendarNotion } from "@/lib/agendaNotion";

/**
 * Reserva de la landing. Escribe en Notion — es la base que mira el equipo
 * hasta la mudanza al CRM propio (domingo a la noche).
 *
 * El código para escribir en el CRM (Supabase) está listo en `lib/agendaCrm.ts`
 * y se engancha acá el domingo, junto con un sync one-time de las reservas que
 * ya están en Notion. No se activó antes porque el acceso a las claves del
 * proyecto Supabase todavía está en veremos (cuenta vieja de Franco).
 */
export async function POST(req: NextRequest) {
  const body = await req.json();

  if (isHoneypotFilled(body?.sitioWeb)) {
    return NextResponse.json({ ok: true, vendedor: body?.vendedor || "Franco" });
  }

  const r = await agendarNotion(body);
  return NextResponse.json(r.body, { status: r.status });
}
