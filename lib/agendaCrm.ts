/**
 * SERVIDOR. Habla con el CRM (Supabase del proyecto "ILFC CRM") por PostgREST
 * con la service-role key. Se usa desde /api/agendar y /api/agendar/availability
 * para que las reservas de la landing caigan directo en el CRM real, no en
 * Notion.
 *
 * Config en Vercel (proyecto landing):
 *   SUPABASE_URL              = https://opvutzdvkuefkebkbuff.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY = (Supabase → Project Settings → API → service_role)
 */

import { alertFailure } from "@/lib/alert";
import { HORAS, horaHHMM, MAX_BOOKING_DIAS, MIN_LEAD_HOURS, MIN_LEAD_LIBERADO_HORAS, hoyArgentinaKey, sabadoDeSemanaKey, sumarDiasKey, VENDEDORES_LANDING } from "@/lib/booking";

const SB_URL = process.env.SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Puente al Google Calendar/Gmail del closer asignado (CRM, 2026-09-09):
 * apenas se crea la reunión, le avisa al CRM para que arme el evento con
 * Meet en el calendario del closer (si lo conectó) + mande el mail de
 * confirmación desde su Gmail. Antes de esto, una reserva de la landing NO
 * generaba Meet ni mail — quedaba solo en la agenda interna hasta que
 * alguien la agendaba de nuevo a mano desde el CRM.
 *
 * `LANDING_AGENDA_SECRET` tiene que ser EL MISMO valor en Vercel de este
 * proyecto y del CRM (`instituto-plataforma`) — es lo que reemplaza a la
 * sesión de staff que un lead autoagendándose obviamente no tiene.
 * Fire-and-forget: si falla, la reunión ya quedó guardada igual, no rompe la
 * respuesta al lead.
 */
const CRM_URL = process.env.CRM_URL || "https://campus.formlat.com";
const LANDING_AGENDA_SECRET = process.env.LANDING_AGENDA_SECRET;

function sincronizarGoogleDelCrm(reunionId: string): void {
  if (!LANDING_AGENDA_SECRET) return;
  fetch(`${CRM_URL}/api/agenda/google-publico`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${LANDING_AGENDA_SECRET}` },
    body: JSON.stringify({ reunionId }),
  }).catch(() => {
    // Best-effort — el CRM ya tiene su propio log de errores del lado
    // servidor (logServidor). Acá no hay nada más que hacer.
  });
}

/** Empresa ILFC en el CRM (única por ahora). */
export const EMPRESA_ID = "3e520c7a-5429-41b5-a43d-0b7f50fec333";

/** Los horarios que ve el visitante en la landing son SIEMPRE Argentina — es
 * el público al que le habla el formulario. Lo que puede variar es la zona
 * horaria de CADA closer (ej. Sandra en Colombia), que se usa solo para
 * interpretar SUS tramos de disponibilidad (`agenda_horario`), no para lo
 * que ve el visitante. */
export const TZ_OFFSET = "-03:00";

/** Offset ISO ("-05:00") de una zona horaria en un instante dado — igual al
 * de `src/lib/crm/zonaHoraria.ts` del CRM (repo separado, sin código
 * compartido entre los dos). */
function offsetIso(zona: string, referencia: Date): string {
  const partes = new Intl.DateTimeFormat("en-US", { timeZone: zona, timeZoneName: "shortOffset" }).formatToParts(referencia);
  const crudo = partes.find((p) => p.type === "timeZoneName")?.value ?? "GMT+0";
  const m = crudo.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
  if (!m) return "+00:00";
  const [, signo, hh, mm = "00"] = m;
  return `${signo}${hh.padStart(2, "0")}:${mm}`;
}

/** Fecha "YYYY-MM-DD" y día de la semana (0-6) tal como se ven en una zona, para un instante dado. */
function fechaEnZona(instanteMs: number, zona: string): { fecha: string; dow: number } {
  const partes = new Intl.DateTimeFormat("en-CA", { timeZone: zona, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(
    new Date(instanteMs)
  );
  const val = (t: string) => partes.find((p) => p.type === t)?.value ?? "";
  const fecha = `${val("year")}-${val("month")}-${val("day")}`;
  const dow = new Date(Number(val("year")), Number(val("month")) - 1, Number(val("day"))).getDay();
  return { fecha, dow };
}

export const agendaCrmConfigurado = Boolean(SB_URL && SB_KEY);

export async function rest(path: string, init?: RequestInit): Promise<Response> {
  if (!SB_URL || !SB_KEY) throw new Error("supabase_no_configurado");
  const res = await fetch(`${SB_URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: SB_KEY,
      Authorization: `Bearer ${SB_KEY}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`crm_${res.status}: ${(await res.text()).slice(0, 300)}`);
  return res;
}

export async function getJson<T>(path: string): Promise<T> {
  return (await rest(path)).json() as Promise<T>;
}

// ─────────────── Tipos mínimos ───────────────

export interface CloserPool {
  usuario_id: string;
  nombre: string;
  en_pool: boolean;
  activo: boolean;
  prioridad: number;
  duracion_min: number;
  buffer_min: number;
  max_por_dia: number | null;
  /** Zona horaria DEL CLOSER — sus tramos de `horarios` son SU hora local. */
  zona_horaria: string;
  horarios: { dia_semana: number; desde: string; hasta: string }[];
}

interface Reunion {
  closer_id: string;
  inicio: string;
  fin: string;
}

// ─────────────── Lecturas ───────────────

const sinTildes = (t: string) => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();

/** Closers en el pool (o el que matchee `vendedorNombre` para links personales). */
export async function cargarPool(vendedorNombre?: string | string[] | null): Promise<CloserPool[]> {
  const configs = await getJson<
    {
      usuario_id: string;
      en_pool: boolean;
      activo: boolean;
      prioridad: number;
      duracion_min: number;
      buffer_min: number;
      max_por_dia: number | null;
      usuarios: { nombre: string; zona_horaria: string } | null;
    }[]
  >(`agenda_config?select=usuario_id,en_pool,activo,prioridad,duracion_min,buffer_min,max_por_dia,usuarios(nombre,zona_horaria)`);

  const horarios = await getJson<{ usuario_id: string; dia_semana: number; desde: string; hasta: string }[]>(
    `agenda_horario?select=usuario_id,dia_semana,desde,hasta`
  );

  return configs
    .filter((c) => c.activo && c.en_pool && c.usuarios)
    .filter((c) => !vendedorNombre || [vendedorNombre].flat().some((n) => sinTildes(c.usuarios!.nombre) === sinTildes(n)))
    .map((c) => ({
      usuario_id: c.usuario_id,
      nombre: c.usuarios!.nombre,
      en_pool: c.en_pool,
      activo: c.activo,
      prioridad: c.prioridad,
      duracion_min: c.duracion_min,
      buffer_min: c.buffer_min,
      max_por_dia: c.max_por_dia,
      zona_horaria: c.usuarios!.zona_horaria || "America/Argentina/Buenos_Aires",
      horarios: horarios.filter((h) => h.usuario_id === c.usuario_id),
    }));
}

/** Reuniones vivas de un conjunto de closers en un día. */
export async function reunionesDelDia(closerIds: string[], fecha: string): Promise<Map<string, Reunion[]>> {
  if (closerIds.length === 0) return new Map();
  const desde = new Date(`${fecha}T00:00:00${TZ_OFFSET}`).toISOString();
  const hasta = new Date(`${fecha}T23:59:59${TZ_OFFSET}`).toISOString();
  const rows = await getJson<Reunion[]>(
    `reuniones?select=closer_id,inicio,fin&estado=neq.cancelada&inicio=gte.${desde}&inicio=lte.${hasta}&closer_id=in.(${closerIds.join(",")})`
  );
  const byCloser = new Map<string, Reunion[]>();
  for (const r of rows) {
    const lista = byCloser.get(r.closer_id);
    if (lista) lista.push(r);
    else byCloser.set(r.closer_id, [r]);
  }
  return byCloser;
}

/** Cuántas reuniones del formulario tiene cada closer a futuro (para el reparto). */
export async function cargaFuturaPorForm(closerIds: string[]): Promise<Record<string, number>> {
  if (closerIds.length === 0) return {};
  const ahora = new Date().toISOString();
  const rows = await getJson<{ closer_id: string }[]>(
    `reuniones?select=closer_id&origen=eq.formulario&estado=neq.cancelada&inicio=gte.${ahora}&closer_id=in.(${closerIds.join(",")})`
  );
  const conteo: Record<string, number> = {};
  for (const r of rows) conteo[r.closer_id] = (conteo[r.closer_id] ?? 0) + 1;
  return conteo;
}

/**
 * Franjas ocupadas en el Google Calendar de los closers para un día (hora Argentina,
 * con margen hasta las 3 h siguientes porque la reunión puede terminar pasada la medianoche).
 * Devuelve `null` si no se pudo consultar (el llamador decide qué hacer).
 */
export async function ocupadosGoogleDelDia(closerIds: string[], fecha: string): Promise<Record<string, Ocupado[]> | null> {
  const desdeISO = new Date(`${fecha}T00:00:00${TZ_OFFSET}`).toISOString();
  const hastaISO = new Date(new Date(`${fecha}T23:59:59${TZ_OFFSET}`).getTime() + 3 * 3600_000).toISOString();
  return ocupadosGoogleRango(closerIds, desdeISO, hastaISO);
}

/** Igual que `ocupadosGoogleDelDia` pero para un rango cualquiera. */
export async function ocupadosGoogleRango(closerIds: string[], desdeISO: string, hastaISO: string): Promise<Record<string, Ocupado[]> | null> {
  if (!LANDING_AGENDA_SECRET || closerIds.length === 0) return {};
  try {
    const res = await fetch(`${CRM_URL}/api/agenda/disponibilidad-publica`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${LANDING_AGENDA_SECRET}` },
      body: JSON.stringify({ closerIds, desdeISO, hastaISO }),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const j = (await res.json()) as { ok?: boolean; ocupados?: Record<string, Ocupado[]> };
    return j.ok ? (j.ocupados ?? {}) : null;
  } catch {
    return null;
  }
}

// ─────────────── Lógica de slots ───────────────

const hhmm = (t: string) => t.slice(0, 5);

/** ¿El closer está libre para una llamada que arranca en `inicioMs`? */
export type Ocupado = { inicio: string; fin: string };

export function closerLibre(closer: CloserPool, inicioMs: number, reuniones: Reunion[], ocupadosGoogle: Ocupado[] = []): boolean {
  if (closer.max_por_dia != null && reuniones.length >= closer.max_por_dia) return false;

  // El slot pedido (`inicioMs`) es hora Argentina — lo que ve el visitante de
  // la landing. El tramo del closer ("10:00 a 19:00") es SU hora local (la
  // que cargó en /admin/agenda), así que el día y las 10:00/19:00 se
  // interpretan en SU zona — derivada del instante pedido, no de la fecha
  // de Argentina, para no romperse cerca de la medianoche. Se comparan
  // siempre como instantes absolutos, nada se convierte a mano.
  const offsetCloser = offsetIso(closer.zona_horaria, new Date(inicioMs));
  const { fecha: fechaCloser, dow } = fechaEnZona(inicioMs, closer.zona_horaria);
  const durMs = closer.duracion_min * 60_000;
  const bufMs = closer.buffer_min * 60_000;
  const finMs = inicioMs + durMs;

  const enHorario = closer.horarios.some((h) => {
    if (h.dia_semana !== dow) return false;
    const d = new Date(`${fechaCloser}T${hhmm(h.desde)}:00${offsetCloser}`).getTime();
    const f = new Date(`${fechaCloser}T${hhmm(h.hasta)}:00${offsetCloser}`).getTime();
    return inicioMs >= d && finMs <= f;
  });
  if (!enHorario) return false;

  // Lo que el closer ya tiene en su Google Calendar (clases, reuniones propias, etc.).
  if (ocupadosGoogle.some((o) => inicioMs < new Date(o.fin).getTime() && finMs > new Date(o.inicio).getTime())) return false;

  return !reuniones.some((r) => {
    const ri = new Date(r.inicio).getTime() - bufMs;
    const rf = new Date(r.fin).getTime() + bufMs;
    return inicioMs < rf && finMs > ri;
  });
}

/**
 * Round-robin ponderado por prioridad: elige el candidato con menor
 * `carga / prioridad`. Con el tiempo, cada uno recibe proporcional a su peso.
 */
export function elegirCloser(
  candidatos: CloserPool[],
  cargaForm: Record<string, number>
): CloserPool | null {
  if (candidatos.length === 0) return null;
  let mejor = candidatos[0];
  let mejorRatio = Infinity;
  for (const c of candidatos) {
    const ratio = (cargaForm[c.usuario_id] ?? 0) / Math.max(1, c.prioridad);
    if (ratio < mejorRatio) {
      mejorRatio = ratio;
      mejor = c;
    }
  }
  return mejor;
}

// ─────────────── Escrituras ───────────────

export function normNombre(n: string) {
  return n.trim().toLowerCase().replace(/\s+/g, " ");
}
export function normTel(t: string) {
  return t.replace(/[^0-9]/g, "");
}

/** Busca el lead por nombre+whatsapp; si no existe lo crea. Devuelve su id. */
export async function upsertLead(datos: {
  nombre: string;
  whatsapp: string;
  email?: string | null;
  situacion?: string | null;
  que_busca?: string | null;
  disponibilidad?: string | null;
  origen?: string;
  temperatura?: "caliente" | "tibio" | "frio" | null;
}): Promise<string> {
  const tel = normTel(datos.whatsapp);
  const existentes = await getJson<{ id: string; nombre: string; whatsapp: string | null }[]>(
    `leads?select=id,nombre,whatsapp&empresa_id=eq.${EMPRESA_ID}`
  );
  const match = existentes.find(
    (l) => l.whatsapp && normTel(l.whatsapp) === tel && normNombre(l.nombre) === normNombre(datos.nombre)
  );
  if (match) return match.id;

  const res = await rest(`leads`, {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      empresa_id: EMPRESA_ID,
      nombre: datos.nombre,
      whatsapp: datos.whatsapp,
      email: datos.email ?? null,
      origen: datos.origen ?? "Autoagendado",
      situacion: datos.situacion ?? null,
      que_busca: datos.que_busca ?? null,
      disponibilidad: datos.disponibilidad ?? null,
      temperatura: datos.temperatura ?? null,
      etapa: "nuevo",
    }),
  });
  const filas = (await res.json()) as { id: string }[];
  return filas[0].id;
}

/** Usuario del CRM por nombre (case-insensitive). `null` si no está. */
async function buscarUsuarioPorNombre(nombre: string): Promise<{ id: string; duracion_min: number } | null> {
  const usuarios = await getJson<{ id: string; nombre: string }[]>(
    `usuarios?select=id,nombre&empresa_id=eq.${EMPRESA_ID}&activo=eq.true`
  );
  const u = usuarios.find((x) => x.nombre.toLowerCase() === nombre.toLowerCase());
  if (!u) return null;
  const cfg = await getJson<{ duracion_min: number }[]>(
    `agenda_config?select=duracion_min&usuario_id=eq.${u.id}`
  );
  return { id: u.id, duracion_min: cfg[0]?.duracion_min ?? 40 };
}

interface FormBody {
  nombre: string;
  whatsapp: string;
  date: string;
  hour: number;
  situacion?: string;
  busqueda?: string;
  disponibilidad?: string;
  email?: string;
  mensaje?: string;
}

/**
 * Espeja en el CRM una reserva que ya se escribió en Notion, con el mismo
 * closer que Notion asignó. Best-effort: si algo falla, tira y el llamador lo
 * loguea sin romper la respuesta al lead. Idempotente por el índice único
 * (closer + inicio) — un doble POST no duplica.
 */
export async function espejarReservaEnCrm(body: FormBody, asignadoNombre: string | null): Promise<void> {
  if (!asignadoNombre || !body?.nombre || !body?.whatsapp || !body?.date || body?.hour === undefined) return;

  const closer = await buscarUsuarioPorNombre(asignadoNombre);
  if (!closer) return; // el closer de Notion no existe en el CRM todavía

  const iso = `${body.date}T${horaHHMM(body.hour)}:00${TZ_OFFSET}`;
  const inicio = new Date(iso);
  const fin = new Date(inicio.getTime() + closer.duracion_min * 60_000);

  const leadId = await upsertLead({
    nombre: body.nombre,
    whatsapp: body.whatsapp,
    email: body.email,
    situacion: body.situacion,
    que_busca: body.busqueda,
    disponibilidad: body.disponibilidad,
  });

  try {
    const res = await rest(`reuniones`, {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        empresa_id: EMPRESA_ID,
        lead_id: leadId,
        closer_id: closer.id,
        agendada_por: null,
        origen: "formulario",
        inicio: inicio.toISOString(),
        fin: fin.toISOString(),
        notas: body.mensaje?.trim() || null,
      }),
    });
    const filas = (await res.json()) as { id: string }[];
    if (filas[0]?.id) sincronizarGoogleDelCrm(filas[0].id);
  } catch (e) {
    // slot ya espejado -> ok, no es un error real
    if (e instanceof Error && (e.message.includes("23505") || e.message.includes("crm_409"))) return;
    throw e;
  }

  await rest(`leads?id=eq.${leadId}`, {
    method: "PATCH",
    body: JSON.stringify({
      etapa: "agendado",
      dueno_id: closer.id,
      fecha_proximo_paso: inicio.toISOString(),
      proximo_paso: `Llamada con ${asignadoNombre}`,
    }),
  });

  await rest(`actividad`, {
    method: "POST",
    body: JSON.stringify({
      empresa_id: EMPRESA_ID,
      lead_id: leadId,
      usuario_id: null,
      tipo: "reunion",
      texto: `El lead se autoagendó una llamada con ${asignadoNombre} para el ${inicio.toLocaleString("es-AR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
      })}.`,
    }),
  });
}

/** Crea la reunión + pasa el lead a "agendado". `code 23505` = slot ocupado. */
export async function crearReunionFormulario(opts: {
  leadId: string;
  closer: CloserPool;
  inicioISO: string;
  notas?: string | null;
}): Promise<void> {
  const inicio = new Date(opts.inicioISO);
  const fin = new Date(inicio.getTime() + opts.closer.duracion_min * 60_000);

  try {
    const res = await rest(`reuniones`, {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        empresa_id: EMPRESA_ID,
        lead_id: opts.leadId,
        closer_id: opts.closer.usuario_id,
        agendada_por: null,
        origen: "formulario",
        inicio: inicio.toISOString(),
        fin: fin.toISOString(),
        notas: opts.notas?.trim() || null,
      }),
    });
    const filas = (await res.json()) as { id: string }[];
    if (filas[0]?.id) sincronizarGoogleDelCrm(filas[0].id);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg.includes("23505") || msg.includes("crm_409")) {
      const err = new Error("slot_taken");
      err.name = "SlotTaken";
      throw err;
    }
    throw e;
  }

  await rest(`leads?id=eq.${opts.leadId}`, {
    method: "PATCH",
    body: JSON.stringify({
      etapa: "agendado",
      dueno_id: opts.closer.usuario_id,
      fecha_proximo_paso: inicio.toISOString(),
      proximo_paso: `Llamada con ${opts.closer.nombre}`,
    }),
  });

  await rest(`actividad`, {
    method: "POST",
    body: JSON.stringify({
      empresa_id: EMPRESA_ID,
      lead_id: opts.leadId,
      usuario_id: null,
      tipo: "reunion",
      texto: `El lead se autoagendó una llamada con ${opts.closer.nombre} para el ${inicio.toLocaleString("es-AR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
      })}.`,
    }),
  });
}

// ─────────────── Orquestador: camino nuevo de /api/agendar ───────────────

type Respuesta = { status: number; body: Record<string, unknown> };

/**
 * Cuando no se pide un vendedor puntual, el auto-reparto de la landing SIEMPRE
 * cae en Sandra (setter) — ella hace el primer contacto/calificación por
 * WhatsApp, no es un round-robin entre closers. Pedido explícito de Franco,
 * 2026-09-07. Los links personales (`?vendedor=Andres`, etc.) siguen andando
 * igual que siempre, sin pasar por acá.
 */
const VENDEDOR_POR_DEFECTO = VENDEDORES_LANDING;

interface AgendarBody {
  nombre: string;
  whatsapp: string;
  mensaje?: string;
  date: string;
  hour: number;
  vendedor?: string;
  situacion?: string;
  busqueda?: string;
  disponibilidad?: string;
  email?: string;
}

/** Camino nuevo de /api/agendar: todo cae directo en el CRM (Supabase), nada en Notion. */
export async function agendarCrm(body: AgendarBody): Promise<Respuesta> {
  const { nombre, whatsapp, mensaje, date, hour, situacion, busqueda, disponibilidad, email } = body;
  const vendedor: string | string[] = body.vendedor || VENDEDOR_POR_DEFECTO;

  if (!nombre || !whatsapp || !date || hour === undefined) return { status: 400, body: { ok: false, error: "missing_fields" } };
  if (whatsapp.replace(/[^0-9]/g, "").length < 8) return { status: 400, body: { ok: false, error: "invalid_whatsapp" } };
  if (date > (await fechaLimiteAgendable(vendedor))) return { status: 400, body: { ok: false, error: "date_out_of_range" } };
  if (new Date(`${date}T12:00:00${TZ_OFFSET}`).getDay() === 0) return { status: 400, body: { ok: false, error: "sunday_not_bookable" } };

  if (!HORAS.includes(Number(hour))) return { status: 400, body: { ok: false, error: "invalid_hour" } };
  const hh = horaHHMM(hour);
  const iso = `${date}T${hh}:00${TZ_OFFSET}`;
  const inicioMs = new Date(iso).getTime();
  if (inicioMs < Date.now() + MIN_LEAD_LIBERADO_HORAS * 3600 * 1000) {
    return { status: 400, body: { ok: false, error: "too_soon" } };
  }
  if (inicioMs < Date.now() + MIN_LEAD_HOURS * 3600 * 1000) {
    // Menos de 12 h: solo si es un horario que se liberó (alguien canceló) y sigue libre.
    const h = await horizonteAgenda(vendedor);
    if (!h.liberados.some((l) => l.dia === date && l.hora === Number(hour))) {
      return { status: 400, body: { ok: false, error: "too_soon" } };
    }
  }

  try {
    const pool = await cargarPool(vendedor);
    if (pool.length === 0) return { status: 409, body: { ok: false, error: "slot_taken" } };

    const reunionesPorCloser = await reunionesDelDia(
      pool.map((c) => c.usuario_id),
      date
    );
    const ocupadosG = await ocupadosGoogleDelDia(pool.map((c) => c.usuario_id), date);
    if (ocupadosG === null) {
      // No pudimos leer el Google Calendar: no frenamos la reserva (no perder un lead), pero avisamos.
      await alertFailure("No se pudo leer el Google Calendar al agendar", `Reserva de ${nombre} (${date} ${hh}). Revisar que no se superponga con una clase.`);
    }
    const libres = pool.filter((c) => closerLibre(c, inicioMs, reunionesPorCloser.get(c.usuario_id) ?? [], ocupadosG?.[c.usuario_id] ?? []));
    if (libres.length === 0) return { status: 409, body: { ok: false, error: "slot_taken" } };

    const cargaForm = await cargaFuturaPorForm(libres.map((c) => c.usuario_id));
    const asignado = elegirCloser(libres, cargaForm);
    if (!asignado) return { status: 409, body: { ok: false, error: "slot_taken" } };

    const leadId = await upsertLead({
      nombre,
      whatsapp,
      email,
      situacion,
      que_busca: busqueda,
      disponibilidad,
      origen: "Landing formlat.com",
    });

    try {
      await crearReunionFormulario({ leadId, closer: asignado, inicioISO: iso, notas: mensaje });
    } catch (e) {
      if (e instanceof Error && e.name === "SlotTaken") return { status: 409, body: { ok: false, error: "slot_taken" } };
      throw e;
    }

    // Respuestas completas del filtro en las notas del lead (solo si todavía no tiene notas: no pisa las del equipo).
    if (mensaje?.trim()) {
      try {
        await rest(`leads?id=eq.${leadId}&notas=is.null`, { method: "PATCH", body: JSON.stringify({ notas: mensaje.trim() }) });
      } catch {
        // las respuestas igual quedaron en la reunión y en los campos de la ficha
      }
    }

    return { status: 200, body: { ok: true, vendedor: asignado.nombre } };
  } catch (err) {
    await alertFailure(
      "Falló una reserva de agenda (CRM)",
      `Nombre: ${nombre}\nWhatsApp: ${whatsapp}\nFecha: ${date} ${hh}\n\n${err instanceof Error ? err.message : String(err)}`
    );
    return { status: 502, body: { ok: false, error: err instanceof Error ? err.message : "network_error" } };
  }
}

/**
 * Horizonte de la agenda: último día agendable hoy y qué días tienen al menos un horario libre.
 * Solo se muestra la semana en curso (hasta el sábado); recién cuando esa semana no tiene NINGÚN
 * horario libre se libera la siguiente, y así. `MAX_BOOKING_DIAS` es el tope absoluto.
 *
 * Si algo falla (CRM o Google Calendar no responden), se falla HACIA MOSTRAR MÁS: se libera la
 * semana siguiente y no se apagan días. Es preferible mostrar un día lleno (la grilla de horas
 * lo marca ocupado y la reserva vuelve a chequear) que dejar a alguien sin ver nada.
 */
export type Liberado = { dia: string; hora: number };
export type Horizonte = { limite: string; libres: string[] | null; liberados: Liberado[] };

const horizonteCache = new Map<string, { en: number; valor: Horizonte }>();
const HORIZONTE_TTL_MS = 15_000;

const H_MS = 3_600_000;

/** Fecha (YYYY-MM-DD) y hora decimal (15.5 = 15:30) de un instante, en hora de Argentina. */
function fechaHoraAR(ms: number): { dia: string; hora: number } {
  const p = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Argentina/Buenos_Aires", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date(ms));
  const v = (t: string) => p.find((x) => x.type === t)?.value ?? "0";
  return { dia: `${v("year")}-${v("month")}-${v("day")}`, hora: (Number(v("hour")) % 24) + Number(v("minute")) / 60 };
}

/**
 * Horarios que SE LIBERARON: reuniones canceladas (por el lead, a mano o por no confirmar) que empiezan en
 * las próximas 12 h y cuyo lugar sigue libre. Se pueden reservar con poca anticipación (ver MIN_LEAD_LIBERADO_HORAS).
 */
async function calcularLiberados(
  pool: CloserPool[],
  reuniones: Reunion[],
  ocupadosG: Record<string, Ocupado[]>
): Promise<Liberado[]> {
  const ahora = Date.now();
  const desde = new Date(ahora + MIN_LEAD_LIBERADO_HORAS * H_MS).toISOString();
  const hasta = new Date(ahora + MIN_LEAD_HOURS * H_MS).toISOString();
  const ids = pool.map((c) => c.usuario_id);
  const canceladas = await getJson<{ inicio: string }[]>(
    `reuniones?select=inicio&estado=eq.cancelada&inicio=gte.${desde}&inicio=lte.${hasta}&closer_id=in.(${ids.join(",")})`
  );
  const vistos = new Set<number>();
  const salida: { ms: number; l: Liberado }[] = [];
  for (const c of canceladas) {
    const ms = new Date(c.inicio).getTime();
    if (vistos.has(ms)) continue;
    vistos.add(ms);
    const { dia, hora } = fechaHoraAR(ms);
    if (!HORAS.includes(hora)) continue;
    const delDia = reuniones.filter((r) => fechaHoraAR(new Date(r.inicio).getTime()).dia === dia);
    const libre = pool.some((cl) =>
      closerLibre(cl, ms, delDia.filter((r) => r.closer_id === cl.usuario_id), ocupadosG[cl.usuario_id] ?? [])
    );
    if (libre) salida.push({ ms, l: { dia, hora } });
  }
  return salida.sort((a, b) => a.ms - b.ms).map((x) => x.l);
}

export async function horizonteAgenda(vendedor: string | string[] | null): Promise<Horizonte> {
  const clave = JSON.stringify(vendedor ?? "default");
  const hit = horizonteCache.get(clave);
  if (hit && Date.now() - hit.en < HORIZONTE_TTL_MS) return hit.valor;

  const hoy = hoyArgentinaKey();
  const tope = sumarDiasKey(hoy, MAX_BOOKING_DIAS);
  const sabadoActual = sabadoDeSemanaKey(hoy);
  const masAmplio = (): Horizonte => ({ limite: sumarDiasKey(sabadoActual, 7) < tope ? sumarDiasKey(sabadoActual, 7) : tope, libres: null, liberados: [] });

  let valor: Horizonte;
  try {
    const pool = await cargarPool(vendedor || VENDEDOR_POR_DEFECTO);
    if (pool.length === 0) {
      valor = masAmplio();
    } else {
      const ids = pool.map((c) => c.usuario_id);
      const desdeISO = new Date(`${hoy}T00:00:00${TZ_OFFSET}`).toISOString();
      const hastaISO = new Date(`${tope}T23:59:59${TZ_OFFSET}`).toISOString();
      const reuniones = await getJson<Reunion[]>(
        `reuniones?select=closer_id,inicio,fin&estado=neq.cancelada&inicio=gte.${desdeISO}&inicio=lte.${hastaISO}&closer_id=in.(${ids.join(",")})`
      );
      const ocupadosG = await ocupadosGoogleRango(ids, desdeISO, hastaISO);
      if (ocupadosG === null) {
        valor = masAmplio(); // no pudimos leer Google: no apagamos nada
      } else {
        const minMs = Date.now() + MIN_LEAD_HOURS * 3600 * 1000;
        const hayLibre = (dia: string): boolean => {
          const ini = new Date(`${dia}T00:00:00${TZ_OFFSET}`).getTime();
          const fin = new Date(`${dia}T23:59:59${TZ_OFFSET}`).getTime();
          const delDia = reuniones.filter((r) => {
            const t = new Date(r.inicio).getTime();
            return t >= ini && t <= fin;
          });
          return HORAS.some((hora) => {
            const inicioMs = new Date(`${dia}T${horaHHMM(hora)}:00${TZ_OFFSET}`).getTime();
            if (inicioMs < minMs) return false;
            return pool.some((c) =>
              closerLibre(c, inicioMs, delDia.filter((r) => r.closer_id === c.usuario_id), ocupadosG[c.usuario_id] ?? [])
            );
          });
        };
        const esDomingo = (dia: string) => new Date(`${dia}T12:00:00Z`).getUTCDay() === 0;

        let limite = sabadoActual;
        for (;;) {
          let hayEnSemana = false;
          for (let i = 0; i < 6 && !hayEnSemana; i++) {
            const dia = sumarDiasKey(limite, -5 + i);
            if (dia < hoy || esDomingo(dia)) continue;
            hayEnSemana = hayLibre(dia);
          }
          if (hayEnSemana || limite >= tope) break;
          limite = sumarDiasKey(limite, 7);
        }
        if (limite > tope) limite = tope;
        const libres: string[] = [];
        for (let dia = hoy; dia <= limite; dia = sumarDiasKey(dia, 1)) {
          if (!esDomingo(dia) && hayLibre(dia)) libres.push(dia);
        }
        let liberados: Liberado[] = [];
        try {
          liberados = await calcularLiberados(pool, reuniones, ocupadosG);
        } catch {
          liberados = [];
        }
        for (const l of liberados) {
          if (!libres.includes(l.dia)) libres.push(l.dia);
          if (l.dia > limite) limite = l.dia;
        }
        libres.sort();
        valor = { limite, libres, liberados };
      }
    }
  } catch {
    valor = masAmplio();
  }
  horizonteCache.set(clave, { en: Date.now(), valor });
  return valor;
}

/** Último día agendable hoy (usado al confirmar una reserva). */
export async function fechaLimiteAgendable(vendedor: string | string[] | null): Promise<string> {
  return (await horizonteAgenda(vendedor)).limite;
}

/** Camino nuevo de /api/agendar/availability: qué horas ya no tienen a nadie libre. */
export async function availabilidadCrm(date: string, vendedor: string | null): Promise<Respuesta> {
  try {
    const pool = await cargarPool(vendedor || VENDEDOR_POR_DEFECTO);
    if (pool.length === 0) return { status: 200, body: { ok: true, bookedHours: [] } };

    const reunionesPorCloser = await reunionesDelDia(
      pool.map((c) => c.usuario_id),
      date
    );

    const ocupadosG = await ocupadosGoogleDelDia(pool.map((c) => c.usuario_id), date);

    const bookedHours = HORAS.filter((hour) => {
      const inicioMs = new Date(`${date}T${horaHHMM(hour)}:00${TZ_OFFSET}`).getTime();
      return !pool.some((c) => closerLibre(c, inicioMs, reunionesPorCloser.get(c.usuario_id) ?? [], ocupadosG?.[c.usuario_id] ?? []));
    });

    return { status: 200, body: { ok: true, bookedHours } };
  } catch (err) {
    return { status: 502, body: { ok: false, error: err instanceof Error ? err.message : "network_error" } };
  }
}
