import { NextRequest, NextResponse } from "next/server";
import { isHoneypotFilled } from "@/lib/antiSpam";
import { agendaCrmConfigurado, espejarReservaEnCrm } from "@/lib/agendaCrm";
import { agendarNotion } from "@/lib/agendaNotion";

/**
 * Reserva de la landing.
 *
 * Hasta la mudanza al CRM propio (domingo a la noche), Notion sigue siendo la
 * fuente que mira el equipo. Cada reserva se escribe SIEMPRE en Notion, y
 * además —si el CRM está configurado— se espeja ahí en segundo plano para que
 * el CRM llegue lleno de datos reales al momento de mudarse. Un fallo del
 * espejo nunca rompe la respuesta al lead.
 *
 * TODO domingo: dar vuelta el orden — CRM primario, Notion espejo/deprecado.
 */
export async function POST(req: NextRequest) {
  const body = await req.json();

  if (isHoneypotFilled(body?.sitioWeb)) {
    return NextResponse.json({ ok: true, vendedor: body?.vendedor || "Franco" });
  }

  // 1. Notion (lo que el equipo mira hoy). Define quién queda asignado.
  const notion = await agendarNotion(body);

  // 2. Espejo en el CRM propio — best-effort, no bloquea ni rompe.
  if (notion.status === 200 && agendaCrmConfigurado) {
    const asignado = typeof notion.body.vendedor === "string" ? notion.body.vendedor : null;
    try {
      await espejarReservaEnCrm(body, asignado);
    } catch (e) {
      console.error("espejo CRM (agendar):", e instanceof Error ? e.message : e);
    }
  }

  return NextResponse.json(notion.body, { status: notion.status });
}
