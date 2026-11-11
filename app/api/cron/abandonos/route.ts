import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { notify } from "@/lib/alert";
import { listarAbandonos } from "@/lib/aplicarStore";

export const dynamic = "force-dynamic";

/**
 * Resumen diario por Telegram de quienes empezaron /aplicar y no lo terminaron.
 * Lo dispara Vercel Cron (ver vercel.json). Protegido con CRON_SECRET, que Vercel manda solo.
 * La ventana va de hace 25 h a hace 1 h: así no se marca como abandono a quien todavía está completando,
 * y las corridas diarias quedan pegadas, sin repetir ni saltear a nadie.
 */
export async function GET(req: NextRequest) {
  const secreto = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  const recibido = auth?.startsWith("Bearer ") ? auth.slice(7) : "";
  const a = Buffer.from(recibido);
  const b = Buffer.from(secreto ?? "");
  if (!secreto || a.length !== b.length || !timingSafeEqual(a, b)) return NextResponse.json({ ok: false }, { status: 401 });

  const ahora = Date.now();
  const filas = await listarAbandonos(new Date(ahora - 25 * 3_600_000), new Date(ahora - 3_600_000)).catch(() => null);
  if (filas === null) return NextResponse.json({ ok: false }, { status: 500 });
  if (filas.length === 0) return NextResponse.json({ ok: true, abandonos: 0 });

  const lista = filas.map((f) => `• ${f.nombre}\n  WhatsApp: ${f.whatsapp}\n  Email: ${f.email}`).join("\n");
  await notify(`Abandonos de /aplicar en las últimas 24 h: ${filas.length}`, `Cargaron sus datos y no terminaron las preguntas. Conviene escribirles hoy.\n\n${lista}`.slice(0, 3800));
  return NextResponse.json({ ok: true, abandonos: filas.length });
}
