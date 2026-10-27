/**
 * SOLO SERVIDOR. Registra cada intento del filtro /aplicar y detecta reintentos.
 *
 * Con el CRM configurado cada intento queda en la tabla `aplicaciones_filtro`
 * (migración 54), NO en `leads`: al CRM solo entra quien agenda. El bloqueo de
 * 30 días consulta esa tabla por WhatsApp o email. Sin CRM (desarrollo local)
 * cae a memoria del proceso.
 */

import { alertFailure, notify } from "@/lib/alert";
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
      `aplicaciones_filtro?select=whatsapp,email,creado_en,categoria&empresa_id=eq.${EMPRESA_ID}&califica=eq.false&categoria=neq.abandono&creado_en=gte.${new Date(desde).toISOString()}`
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
  campos: { situacion: string; que_busca: string; disponibilidad: string };
}): Promise<void> {
  const { contacto, califica, categoria, motivo, score, resumen, campos } = opts;

  if (!califica) {
    await notify(
      "Lead sin calificar (queda en el CRM como base de datos)",
      `${contacto.nombre}\nWhatsApp: ${contacto.whatsapp}\nEmail: ${contacto.email}\nMotivo: ${motivo}`
    );
  }

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
    if (!califica) await cargarLeadBase(contacto, campos, resumen, motivo);
  } catch (e) {
    console.warn("[aplicar] no se pudo guardar el intento:", e instanceof Error ? e.message : e);
    await alertFailure("No se pudo guardar un intento de /aplicar (¿falta aplicar la migración 54?)", `${contacto.nombre} · ${contacto.whatsapp}\n${e instanceof Error ? e.message : String(e)}`);
  }
}

/**
 * Los no calificados quedan en el CRM como BASE DE DATOS para escribirles después:
 * pipeline "setter", etapa "redes" (no aparecen en el tablero de los closers ni
 * cuentan como ventas perdidas), con la etiqueta "filtro-no-calificado". Sin agenda.
 * Si esa persona ya existe como lead (mismo WhatsApp) no se duplica.
 */
async function cargarLeadBase(
  c: Contacto,
  campos: { situacion: string; que_busca: string; disponibilidad: string },
  resumen: string,
  motivo: string
): Promise<void> {
  const existentes = await getJson<{ whatsapp: string | null }[]>(`leads?select=whatsapp&empresa_id=eq.${EMPRESA_ID}`);
  const tel = ultimos8(c.whatsapp);
  if (existentes.some((l) => l.whatsapp && ultimos8(l.whatsapp) === tel)) return;
  await rest(`leads`, {
    method: "POST",
    body: JSON.stringify({
      empresa_id: EMPRESA_ID,
      nombre: c.nombre,
      whatsapp: c.whatsapp,
      email: c.email,
      origen: "Landing /aplicar (filtro)",
      pipeline: "setter",
      etapa: "redes",
      tags: ["filtro-no-calificado"],
      situacion: campos.situacion,
      que_busca: campos.que_busca,
      disponibilidad: campos.disponibilidad,
      notas: `No calificó en el filtro de la landing (${motivo}). Guardado como base de datos para contactar más adelante.\n\n${resumen}`,
    }),
  });
}

/**
 * Guarda a quien empezó el formulario (dejó sus datos) por si lo abandona: categoría "abandono".
 * NO cuenta como descarte (no bloquea) y no se duplica. Cuando termina el formulario, se borra.
 */
export async function registrarInicio(c: Contacto): Promise<void> {
  if (!agendaCrmConfigurado) return;
  try {
    const desde = new Date(Date.now() - DIAS_BLOQUEO * MS_DIA).toISOString();
    const previas = await getJson<{ whatsapp: string }[]>(`aplicaciones_filtro?select=whatsapp&empresa_id=eq.${EMPRESA_ID}&creado_en=gte.${desde}`);
    const tel = ultimos8(c.whatsapp);
    if (previas.some((x) => ultimos8(x.whatsapp) === tel)) return;
    await rest(`aplicaciones_filtro`, {
      method: "POST",
      body: JSON.stringify({
        empresa_id: EMPRESA_ID,
        nombre: c.nombre,
        whatsapp: c.whatsapp,
        email: c.email,
        califica: false,
        categoria: "abandono",
        motivo: "empezó el formulario y no lo terminó",
        puntaje: 0,
        respuestas: "",
      }),
    });
  } catch (e) {
    console.warn("[aplicar] no se pudo guardar el inicio:", e instanceof Error ? e.message : e);
  }
}

/** Al terminar el formulario ya no es un abandono: se borra ese registro provisorio. */
export async function borrarInicio(c: Pick<Contacto, "whatsapp">): Promise<void> {
  if (!agendaCrmConfigurado) return;
  try {
    await rest(`aplicaciones_filtro?empresa_id=eq.${EMPRESA_ID}&categoria=eq.abandono&whatsapp=eq.${encodeURIComponent(c.whatsapp)}`, { method: "DELETE" });
  } catch {
    // no es crítico
  }
}

export type LlamadaPrevia = { tipo: "agendada" | "pasada" | "sin_confirmar"; cuando: string; hasta?: string };

const DIAS_ESPERA_SIN_CONFIRMAR = 7;

/**
 * ¿Esta persona (por WhatsApp o email) ya tiene una llamada agendada, o tuvo una en los últimos 30 días?
 * Cuenta: agendada, realizada, no show, no contestó, y también CANCELADA después de su hora de inicio (el
 * equipo cancela a mano a quien nunca apareció: eso es un no show, no una cancelación que libera).
 * NO cuenta: canceladas antes de su hora (por el lead o automáticamente): esas personas pueden reagendar.
 * Se calcula con las reuniones del CRM, así que vale también para todo lo que ya existía.
 */
export async function buscarLlamadaPrevia(c: Pick<Contacto, "whatsapp" | "email">): Promise<LlamadaPrevia | null> {
  if (!agendaCrmConfigurado) return null;
  try {
    const desde = new Date(Date.now() - DIAS_BLOQUEO * MS_DIA).toISOString();
    const filas = await getJson<
      { inicio: string; estado: string; actualizado_en: string; cancelada_auto_en: string | null; lead: { whatsapp: string | null; email: string | null } | null }[]
    >(
      `reuniones?select=inicio,estado,actualizado_en,cancelada_auto_en,lead:leads(whatsapp,email)&empresa_id=eq.${EMPRESA_ID}&estado=in.(agendada,realizada,no_show,no_contesto,cancelada)&inicio=gte.${desde}&limit=3000`
    );
    const tel = ultimos8(c.whatsapp);
    const em = mail(c.email);
    const ahora = Date.now();
    const propias = filas.filter((f) => {
      const l = f.lead;
      if (!l || !((l.whatsapp && ultimos8(l.whatsapp) === tel) || (l.email && mail(l.email) === em))) return false;
      if (f.estado === "cancelada") return !f.cancelada_auto_en && new Date(f.actualizado_en).getTime() > new Date(f.inicio).getTime();
      return true;
    });
    // Canceladas automáticamente por no confirmar: 1ª vez → espera 7 días; 2ª vez en 30 días → bloqueo de 30 días.
    const sinConfirmar = filas
      .filter((f) => {
        const l = f.lead;
        return f.estado === "cancelada" && f.cancelada_auto_en && l && ((l.whatsapp && ultimos8(l.whatsapp) === tel) || (l.email && mail(l.email) === em));
      })
      .sort((a, b) => (b.cancelada_auto_en ?? "").localeCompare(a.cancelada_auto_en ?? ""));
    let esperaHasta: LlamadaPrevia | null = null;
    if (sinConfirmar.length > 0) {
      const dias = sinConfirmar.length >= 2 ? DIAS_BLOQUEO : DIAS_ESPERA_SIN_CONFIRMAR;
      const fin = new Date(sinConfirmar[0].cancelada_auto_en as string).getTime() + dias * MS_DIA;
      if (fin > ahora) esperaHasta = { tipo: "sin_confirmar", cuando: sinConfirmar[0].inicio, hasta: new Date(fin).toISOString() };
    }
    if (propias.length === 0) return esperaHasta;
    const futura = propias.find((f) => f.estado === "agendada" && new Date(f.inicio).getTime() > ahora);
    if (futura) return { tipo: "agendada", cuando: futura.inicio };
    if (esperaHasta) return esperaHasta;
    const ultima = propias.sort((a, b) => b.inicio.localeCompare(a.inicio))[0];
    return { tipo: "pasada", cuando: ultima.inicio };
  } catch (e) {
    console.warn("[aplicar] no se pudo consultar llamadas previas:", e instanceof Error ? e.message : e);
    return null;
  }
}
