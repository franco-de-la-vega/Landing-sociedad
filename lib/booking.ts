// Constantes y helpers compartidos por /agendar y por el paso de agenda
// embebido en la portada, para no duplicar la lógica de días/horarios/huso
// horario en dos lugares.

export const HORAS = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
export const ARGENTINA_TZ = "America/Argentina/Buenos_Aires";

// Nadie puede agendar dentro de las próximas MIN_LEAD_HOURS horas: le da
// tiempo al equipo a averiguar sobre la persona (y hablar por WhatsApp si
// hace falta) antes de la llamada.
export const MIN_LEAD_HOURS = 12;

// Se agenda de lunes a sábado. Tope: jueves 17/9 (el viernes 18 arranca el cohort).
export const MAX_BOOKING_DATE = "2026-09-17";

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
  return new Date(`${toDateKey(date)}T${String(hour).padStart(2, "0")}:00:00-03:00`);
}

// Convierte un slot definido en hora de Argentina (fecha + hora en punto)
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
export function businessDaysByWeek(): Date[] {
  const days: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const monday = new Date(today);
  const diffToMonday = (today.getDay() + 6) % 7; // Lun=0 ... Dom=6
  monday.setDate(monday.getDate() - diffToMonday);

  const maxDate = new Date(`${MAX_BOOKING_DATE}T00:00:00`);
  const cursor = new Date(monday);
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
  const end = new Date(start.getTime() + 40 * 60000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: "Llamada con Instituto Latinoamericano de Formación Comercial",
    dates: `${fmt(start)}/${fmt(end)}`,
    details: "Reunión de 40 minutos. Te recomendamos conectarte desde una computadora.",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
