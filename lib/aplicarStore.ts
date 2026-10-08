/**
 * SOLO SERVIDOR. Registra cada intento del filtro /aplicar y detecta reintentos.
 *
 * Con el CRM configurado cada intento queda en la tabla `aplicaciones_filtro`
 * (migración 54), NO en `leads`: al CRM solo entra quien agenda. El bloqueo de
 * 30 días consulta esa tabla por WhatsApp o email. Sin CRM (desarrollo local)
 * cae a memoria del proceso.
 */

import { alertFailure } from "@/lib/alert";
import { EMPRESA_ID, agendaCrmConfigurado, getJson, normTel, rest } from "@/lib/agendaCrm";
import { DIAS_BLOQUEO, MS_DIA } from "@/lib/aplicarToken";
import type { Categoria } from "@/lib/aplicarEvaluar";

export type Contacto = { nombre: string; whatsapp: string; email: string };
export type Bloqueo = { categoria: Categoria; hasta: number };

const memoria: { tel: string; email: string; categoria: Categoria; en: number }[] = [];
const ultimos8 = (t: string) => normTel(t).slice(-8);
const mail = (e: string) => e.trim().toLowerCase();

/** ¿Esta persona ya fue descartada en los últimos 30 días? (por WhatsApp o email) */
export async function buscarBloqueo(c: Pick<Contacto, "whatsapp" | "email">): Promise<Bloqueo | null> {
  const desde = Date.now() - DIAS_BLOQUEO * MS_DIA;
  const tel = ultimos8(c.whatsapp);
  const em = mail(c.email);

  if (!agendaCrmConfigurado) {
    const m = memoria.find((x) => x.en >= desde && (ultimos8(x.tel) === tel || x.email === em));
    return m ? { categoria: m.categoria, hasta: m.en + DIAS_BLOQUEO * MS_DIA } : null;
  }

  try {
    const filas = await getJson<{ whatsapp: string; email: string; creado_en: string; categoria: string | null }[]>(
      `aplicaciones_filtro?select=whatsapp,email,creado_en,categoria&empresa_id=eq.${EMPRESA_ID}&califica=eq.false&creado_en=gte.${new Date(desde).toISOString()}`
    );
    const f = filas.find((x) => ultimos8(x.whatsapp) === tel || mail(x.email) === em);
    if (!f) return null;
    return { categoria: (f.categoria ?? "perfil") as Categoria, hasta: new Date(f.creado_en).getTime() + DIAS_BLOQUEO * MS_DIA };
  } catch (e) {
    // Sin tabla (migración 54 sin aplicar) o CRM caído: la cookie del navegador igual frena el reintento.
    console.warn("[aplicar] no se pudo consultar bloqueos:", e instanceof Error ? e.message : e);
    return null;
  }
}

/** Guarda el intento. Nunca rompe la respuesta a la persona: si falla, avisa y sigue. */
export async function registrarIntento(opts: {
  contacto: Contacto;
  califica: boolean;
  categoria?: Categoria;
  motivo: string;
  score: number;
  resumen: string;
}): Promise<void> {
  const { contacto, califica, categoria, motivo, score, resumen } = opts;

  if (!agendaCrmConfigurado) {
    if (!califica) memoria.push({ tel: contacto.whatsapp, email: mail(contacto.email), categoria: categoria ?? "perfil", en: Date.now() });
    console.log(`[aplicar] ${califica ? "CALIFICA" : "NO califica"} (${score}) ${contacto.nombre} · ${motivo}`);
    return;
  }

  try {
    await rest(`aplicaciones_filtro`, {
      method: "POST",
      body: JSON.stringify({
        empresa_id: EMPRESA_ID,
        nombre: contacto.nombre,
        whatsapp: contacto.whatsapp,
        email: contacto.email,
        califica,
        categoria: califica ? null : (categoria ?? "perfil"),
        motivo: califica ? null : motivo,
        puntaje: score,
        respuestas: resumen,
      }),
    });
  } catch (e) {
    console.warn("[aplicar] no se pudo guardar el intento:", e instanceof Error ? e.message : e);
    await alertFailure("No se pudo guardar un intento de /aplicar (¿falta aplicar la migración 54?)", `${contacto.nombre} · ${contacto.whatsapp}\n${e instanceof Error ? e.message : String(e)}`);
  }
}
