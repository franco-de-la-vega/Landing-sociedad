import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { notify } from "@/lib/alert";

export const dynamic = "force-dynamic";

/**
 * Relé de avisos a Telegram para el CRM (el bot vive solo en este proyecto).
 * Protegido con el secreto compartido LANDING_AGENDA_SECRET.
 */
export async function POST(req: NextRequest) {
  const secreto = process.env.LANDING_AGENDA_SECRET;
  const auth = req.headers.get("authorization");
  const recibido = auth?.startsWith("Bearer ") ? auth.slice(7) : "";
  const a = Buffer.from(recibido);
  const b = Buffer.from(secreto ?? "");
  if (!secreto || a.length !== b.length || !timingSafeEqual(a, b)) return NextResponse.json({ ok: false }, { status: 401 });

  const { contexto, detalle } = (await req.json().catch(() => ({}))) as { contexto?: string; detalle?: string };
  if (!contexto) return NextResponse.json({ ok: false }, { status: 400 });
  await notify(String(contexto).slice(0, 200), String(detalle ?? "").slice(0, 1500));
  return NextResponse.json({ ok: true });
}
