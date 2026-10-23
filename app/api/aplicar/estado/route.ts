import { NextRequest, NextResponse } from "next/server";
import { COOKIE, verificar } from "@/lib/aplicarToken";
import type { Categoria } from "@/lib/aplicarEvaluar";
import { buscarBloqueo, buscarLlamadaPrevia, registrarInicio } from "@/lib/aplicarStore";
import { notify } from "@/lib/alert";
import { esEmailValido, esWhatsappValido } from "@/lib/aplicarFlow";

type CookieNo = { v: "no"; c: Categoria };

/** GET: ¿este navegador ya fue descartado (o ya calificó)? Se consulta al abrir la página. */
export async function GET(req: NextRequest) {
  const c = verificar<CookieNo>(req.cookies.get(COOKIE)?.value);
  if (c?.v === "no") return NextResponse.json({ estado: "no", categoria: c.c, hasta: c.exp });
  return NextResponse.json({ estado: "nuevo" });
}

/** POST: con los datos de contacto, ¿esta persona ya fue descartada desde otro navegador? */
export async function POST(req: NextRequest) {
  const { nombre, whatsapp, email } = await req.json().catch(() => ({}));
  if (!esWhatsappValido(String(whatsapp ?? "")) || !esEmailValido(String(email ?? ""))) {
    return NextResponse.json({ ok: false, error: "datos_invalidos" }, { status: 400 });
  }
  const b = await buscarBloqueo({ whatsapp, email });
  if (b) return NextResponse.json({ estado: "no", categoria: b.categoria, hasta: b.hasta });
  const previa = await buscarLlamadaPrevia({ whatsapp, email });
  if (previa) {
    await notify("Intentó agendar de nuevo (ya tiene una llamada reciente)", `${typeof nombre === "string" ? nombre : ""}\nWhatsApp: ${whatsapp}\nEmail: ${email}\nLlamada: ${previa.tipo === "agendada" ? "agendada" : "pasada"} · ${previa.cuando}`);
    return NextResponse.json({ estado: "previa", tipo: previa.tipo, cuando: previa.cuando });
  }
  // Empezó el formulario: lo guardamos por si lo abandona (para poder escribirle).
  if (typeof nombre === "string" && nombre.trim().length >= 3) await registrarInicio({ nombre: nombre.trim(), whatsapp: String(whatsapp), email: String(email) });
  return NextResponse.json({ estado: "nuevo" });
}
