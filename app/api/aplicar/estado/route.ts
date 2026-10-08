import { NextRequest, NextResponse } from "next/server";
import { COOKIE, verificar } from "@/lib/aplicarToken";
import type { Categoria } from "@/lib/aplicarEvaluar";
import { buscarBloqueo } from "@/lib/aplicarStore";
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
  const { whatsapp, email } = await req.json().catch(() => ({}));
  if (!esWhatsappValido(String(whatsapp ?? "")) || !esEmailValido(String(email ?? ""))) {
    return NextResponse.json({ ok: false, error: "datos_invalidos" }, { status: 400 });
  }
  const b = await buscarBloqueo({ whatsapp, email });
  return NextResponse.json(b ? { estado: "no", categoria: b.categoria, hasta: b.hasta } : { estado: "nuevo" });
}
