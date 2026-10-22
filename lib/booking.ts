// Constantes y helpers compartidos por /agendar y por el paso de agenda
// embebido en la portada, para no duplicar la lógica de días/horarios/huso
// horario en dos lugares.

// Horarios de inicio ofrecibles, cada 30 min (10, 10.5 = 10:30, ...). Cuáles
// quedan libres lo define el CRM según la duración y el descanso de cada closer.
export const HORAS = Array.from({ length: 23 }, (_, i) => 10 + i * 0.5);

/** "HH:MM" de una hora decimal (10.5 → "10:30"). */
export function horaHHMM(hour: number): string {
  const h = Math.floor(hour);
  const m = Math.round((hour - h) * 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
export const ARGENTINA_TZ = "America/Argentina/Buenos_Aires";

// Nadie puede agendar dentro de las próximas MIN_LEAD_HOURS horas: le da
// tiempo al equipo a averiguar sobre la persona (y hablar por WhatsApp si
// hace falta) antes de la llamada.
export const MIN_LEAD_HOURS = 12;

// Un horario que SE LIBERÓ (alguien canceló) se puede reservar con menos anticipación que el resto:
// si no, un lugar que se libera a 6 h de la llamada no serviría de nada.
export const MIN_LEAD_LIBERADO_HORAS = 2;

// Se agenda de lunes a sábado. MAX_BOOKING_DIAS es solo el TOPE absoluto: el
// límite real lo calcula el servidor (`fechaLimiteAgendable`) y libera una
// semana más recién cuando la semana abierta se llenó.
export const MAX_BOOKING_DIAS = 30;

/** "YYYY-MM-DD" del último día agendable (hoy + MAX_BOOKING_DIAS). */
export function maxBookingDateKey(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + MAX_BOOKING_DIAS);
  return toDateKey(d);
}

/** "YYYY-MM-DD" de hoy en Argentina (el servidor corre en UTC). */
export function hoyArgentinaKey(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: ARGENTINA_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/** Suma días a una clave "YYYY-MM-DD" sin depender de la zona del servidor. */
export function sumarDiasKey(key: string, dias: number): string {
  const d = new Date(`${key}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + dias);
  return d.toISOString().slice(0, 10);
}

/** Sábado (último día agendable) de la semana de una fecha. Domingo cuenta como fin de la semana anterior. */
export function sabadoDeSemanaKey(key: string): string {
  const dow = new Date(`${key}T12:00:00Z`).getUTCDay(); // 0=Dom
  return sumarDiasKey(key, dow === 0 ? -1 : 6 - dow);
}

export const PAISES = [
  { label: "Argentina", tz: "America/Argentina/Buenos_Aires" },
  { label: "México", tz: "America/Mexico_City" },
  { label: "Colombia", tz: "America/Bogota" },
  { label: "Perú", tz: "America/Lima" },
  { label: "Chile", tz: "America/Santiago" },
  { label: "Uruguay", tz: "America/Montevideo" },
  { label: "Paraguay", tz: "America/Asuncion" },
  { label: "Bolivia", tz: "America/La_Paz" },
  { label: "Ecuador", tz: "America/Guayaquil" },
  { label: "Venezuela", tz: "America/Caracas" },
  { label: "República Dominicana", tz: "America/Santo_Domingo" },
  { label: "Panamá", tz: "America/Panama" },
  { label: "Estados Unidos (Este)", tz: "America/New_York" },
  { label: "España", tz: "Europe/Madrid" },
];

export const DIA_LABEL = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
export const MES_LABEL = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
];

// Solo dígitos, espacios y "+". Se usa tanto para sanitizar mientras se
// escribe (bloquea letras) como para validar antes de dejar avanzar.
export function sanitizeWhatsapp(value: string) {
  return value.replace(/[^0-9+ ]/g, "");
}

export function isValidWhatsapp(value: string) {
  return value.replace(/[^0-9]/g, "").length >= 8;
}

export function detectDefaultTz(): string {
  try {
    const guess = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return PAISES.some((p) => p.tz === guess) ? guess : ARGENTINA_TZ;
  } catch {
    return ARGENTINA_TZ;
  }
}

export function toDateKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// El instante real (UTC) de un slot definido en hora de Argentina.
export function slotInstant(date: Date, hour: number): Date {
  return new Date(`${toDateKey(date)}T${horaHHMM(hour)}:00-03:00`);
}

// Convierte un slot definido en hora de Argentina (fecha + hora, en punto o y media)
// a como se ve ese mismo instante en el huso horario elegido por el lead.
export function convertSlot(date: Date, hour: number, tz: string) {
  const instant = slotInstant(date, hour);
  const time = new Intl.DateTimeFormat("es-AR", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(instant);

  const localDateKey = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(instant); // "YYYY-MM-DD"
  const dayDiff =
    (new Date(localDateKey).getTime() - new Date(toDateKey(date)).getTime()) / 86400000;

  return { time, dayDiff };
}

// Genera todos los días de Lunes a Sábado, agrupados por semana calendario
// (arranca siempre en el lunes de la semana actual, aunque algunos de esos
// días ya hayan pasado), hasta MAX_BOOKING_DATE. Así cada "página" de 6
// días es siempre una semana completa, prolija, sin desalinearse.
export function businessDaysByWeek(limiteKey?: string): Date[] {
  // Desde HOY (no desde el lunes): los días que ya pasaron no sirven y escondían la semana siguiente
  // detrás de la flecha.
  const days: Date[] = [];
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  const maxDate = new Date(`${limiteKey ?? maxBookingDateKey()}T00:00:00`);
  while (cursor <= maxDate) {
    if (cursor.getDay() !== 0) days.push(new Date(cursor)); // excluye domingo
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

// Link de "agregar a Google Calendar" sin autenticación: cada persona agrega
// el evento a SU propio calendario, nosotros no leemos ni tocamos nada.
export function googleCalendarLink(date: Date, hour: number) {
  const start = slotInstant(date, hour);
  const end = new Date(start.getTime() + 45 * 60000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: "Llamada con Instituto Latinoamericano de Formación Comercial",
    dates: `${fmt(start)}/${fmt(end)}`,
    details: "Reunión de 45 minutos. Te recomendamos conectarte desde una computadora.",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** Quiénes toman las llamadas que salen de la landing (Franco, 2026-10-19: Andrés y Franco). Nombres tal cual figuran en el CRM. */
export const VENDEDORES_LANDING = ["Andres", "Franco"];
