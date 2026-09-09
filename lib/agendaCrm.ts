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
import { HORAS, MIN_LEAD_HOURS, maxBookingDateKey } from "@/lib/booking";

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
const EMPRESA_ID = "3e520c7a-5429-41b5-a43d-0b7f50fec333";

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

async function rest(path: string, init?: RequestInit): Promise<Response> {
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

async function getJson<T>(path: string): Promise<T> {
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

/** Closers en el pool (o el que matchee `vendedorNombre` para links personales). */
export async function cargarPool(vendedorNombre?: string | null): Promise<CloserPool[]> {
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
    .filter((c) => !vendedorNombre || c.usuarios!.nombre.toLowerCase() === vendedorNombre.toLowerCase())
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

// ─────────────── Lógica de slots ───────────────

const hhmm = (t: string) => t.slice(0, 5);

/** ¿El closer está libre para una llamada que arranca en `inicioMs`? */
export function closerLibre(closer: CloserPool, inicioMs: number, reuniones: Reunion[]): boolean {
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

function normNombre(n: string) {
  return n.trim().toLowerCase().replace(/\s+/g, " ");
}
function normTel(t: string) {
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

  const iso = `${body.date}T${String(body.hour).padStart(2, "0")}:00:00${TZ_OFFSET}`;
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
const VENDEDOR_POR_DEFECTO = "Sandra";

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
  const vendedor = body.vendedor || VENDEDOR_POR_DEFECTO;

  if (!nombre || !whatsapp || !date || hour === undefined) return { status: 400, body: { ok: false, error: "missing_fields" } };
  if (whatsapp.replace(/[^0-9]/g, "").length < 8) return { status: 400, body: { ok: false, error: "invalid_whatsapp" } };
  if (date > maxBookingDateKey()) return { status: 400, body: { ok: false, error: "date_out_of_range" } };
  if (new Date(`${date}T12:00:00${TZ_OFFSET}`).getDay() === 0) return { status: 400, body: { ok: false, error: "sunday_not_bookable" } };

  const hh = String(hour).padStart(2, "0");
  const iso = `${date}T${hh}:00:00${TZ_OFFSET}`;
  const inicioMs = new Date(iso).getTime();
  if (inicioMs < Date.now() + MIN_LEAD_HOURS * 3600 * 1000) {
    return { status: 400, body: { ok: false, error: "too_soon" } };
  }

  try {
    const pool = await cargarPool(vendedor);
    if (pool.length === 0) return { status: 409, body: { ok: false, error: "slot_taken" } };

    const reunionesPorCloser = await reunionesDelDia(
      pool.map((c) => c.usuario_id),
      date
    );
    const libres = pool.filter((c) => closerLibre(c, inicioMs, reunionesPorCloser.get(c.usuario_id) ?? []));
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

    return { status: 200, body: { ok: true, vendedor: asignado.nombre } };
  } catch (err) {
    await alertFailure(
      "Falló una reserva de agenda (CRM)",
      `Nombre: ${nombre}\nWhatsApp: ${whatsapp}\nFecha: ${date} ${hh}:00\n\n${err instanceof Error ? err.message : String(err)}`
    );
    return { status: 502, body: { ok: false, error: err instanceof Error ? err.message : "network_error" } };
  }
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

    const bookedHours = HORAS.filter((hour) => {
      const hh = String(hour).padStart(2, "0");
      const inicioMs = new Date(`${date}T${hh}:00:00${TZ_OFFSET}`).getTime();
      return !pool.some((c) => closerLibre(c, inicioMs, reunionesPorCloser.get(c.usuario_id) ?? []));
    });

    return { status: 200, body: { ok: true, bookedHours } };
  } catch (err) {
    return { status: 502, body: { ok: false, error: err instanceof Error ? err.message : "network_error" } };
  }
}
