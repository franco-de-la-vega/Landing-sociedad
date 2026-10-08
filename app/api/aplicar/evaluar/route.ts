import { NextRequest, NextResponse } from "next/server";
import { isHoneypotFilled } from "@/lib/antiSpam";
import { COOKIE, DIAS_BLOQUEO, MS_DIA, firmar, verificar } from "@/lib/aplicarToken";
import { evaluar } from "@/lib/aplicarEvaluar";
import { buscarBloqueo, registrarIntento } from "@/lib/aplicarStore";
import { camposCrm, esEmailValido, esWhatsappValido, resumenRespuestas, type Resp } from "@/lib/aplicarFlow";

const cookieOpts = (maxAgeMs: number) => ({
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: Math.floor(maxAgeMs / 1000),
});

/**
 * Evalúa el filtro. Es el ÚNICO lugar que decide si alguien califica.
 * - Si ya fue descartado (cookie o mismo WhatsApp/email en 30 días) devuelve el
 *   mismo resultado SIN re-evaluar: reenviar el formulario con otras respuestas no sirve.
 * - Si califica devuelve un token firmado (48 h) que /api/aplicar/agendar exige.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ ok: false }, { status: 400 });
  if (isHoneypotFilled(body.sitioWeb)) return NextResponse.json({ estado: "no", categoria: "perfil" });

  const nombre = String(body.nombre ?? "").trim();
  const whatsapp = String(body.whatsapp ?? "").trim();
  const email = String(body.email ?? "").trim();
  if (nombre.length < 3 || !esWhatsappValido(whatsapp) || !esEmailValido(email)) {
    return NextResponse.json({ ok: false, error: "datos_invalidos" }, { status: 400 });
  }
  const respuestas: Resp = Object.fromEntries(
    Object.entries(body.respuestas ?? {}).map(([k, v]) => [k, String(v)])
  );

  // 1) ya descartado en este navegador
  const previa = verificar<{ v: string; c: string }>(req.cookies.get(COOKIE)?.value);
  if (previa?.v === "no") return NextResponse.json({ estado: "no", categoria: previa.c, hasta: previa.exp });

  // 2) ya descartado con este WhatsApp o email (otro navegador / cookies borradas)
  const bloqueo = await buscarBloqueo({ whatsapp, email });
  if (bloqueo) {
    const res = NextResponse.json({ estado: "no", categoria: bloqueo.categoria, hasta: bloqueo.hasta });
    res.cookies.set(COOKIE, firmar({ v: "no", c: bloqueo.categoria }, bloqueo.hasta - Date.now()), cookieOpts(bloqueo.hasta - Date.now()));
    return res;
  }

  // 3) evaluar
  const veredicto = evaluar(respuestas);
  const resumen = resumenRespuestas(respuestas);
  await registrarIntento({
    contacto: { nombre, whatsapp, email },
    califica: veredicto.califica,
    categoria: veredicto.califica ? undefined : veredicto.categoria,
    motivo: veredicto.califica ? "" : veredicto.motivo,
    score: veredicto.score,
    resumen,
  });

  if (!veredicto.califica) {
    const vigencia = DIAS_BLOQUEO * MS_DIA;
    const res = NextResponse.json({ estado: "no", categoria: veredicto.categoria, hasta: Date.now() + vigencia });
    res.cookies.set(COOKIE, firmar({ v: "no", c: veredicto.categoria }, vigencia), cookieOpts(vigencia));
    return res;
  }

  // Token de reserva (48 h). Va solo en la respuesta, NO en cookie: es largo y las cookies tienen tope de 4 KB.
  const campos = camposCrm(respuestas);
  const token = firmar(
    { v: "si", n: nombre, w: whatsapp, e: email, r: resumen, s: campos.situacion, b: campos.que_busca, d: campos.disponibilidad },
    2 * MS_DIA
  );
  return NextResponse.json({ estado: "si", token });
}
