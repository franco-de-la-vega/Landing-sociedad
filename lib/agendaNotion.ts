/**
 * SERVIDOR. Camino VIEJO de /agendar: escribe la reserva en la base de leads
 * de Notion. Se usa solo como fallback mientras el CRM (Supabase) no tenga
 * las variables de entorno cargadas — ver `agendaCrmConfigurado` en
 * `lib/agendaCrm.ts`. Cuando el CRM esté confirmado funcionando, borrar este
 * archivo y el dispatcher de las rutas.
 */

import { alertFailure } from "@/lib/alert";
import { maxBookingDateKey } from "@/lib/booking";

const NOTION_VERSION = "2022-06-28";
const LEADS_DATABASE_ID = "3c63d284-28ee-81ae-991a-f362c63f3857";
const VENDEDORES = ["Franco", "Natalia", "Andres"];
const MIN_LEAD_HOURS = 12;

type Respuesta = { status: number; body: Record<string, unknown> };

function headers(token: string) {
  return { Authorization: `Bearer ${token}`, "Notion-Version": NOTION_VERSION, "Content-Type": "application/json" };
}

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

export async function agendarNotion(body: AgendarBody): Promise<Respuesta> {
  const notionToken = process.env.NOTION_TOKEN;
  if (!notionToken) return { status: 500, body: { ok: false, error: "missing_notion_config" } };

  const { nombre, whatsapp, mensaje, date, hour, vendedor, situacion, busqueda, disponibilidad, email } = body;

  if (!nombre || !whatsapp || !date || hour === undefined) return { status: 400, body: { ok: false, error: "missing_fields" } };
  if (whatsapp.replace(/[^0-9]/g, "").length < 8) return { status: 400, body: { ok: false, error: "invalid_whatsapp" } };
  if (date > maxBookingDateKey()) return { status: 400, body: { ok: false, error: "date_out_of_range" } };
  if (new Date(`${date}T12:00:00-03:00`).getDay() === 0) return { status: 400, body: { ok: false, error: "sunday_not_bookable" } };

  const hh = String(hour).padStart(2, "0");
  const iso = `${date}T${hh}:00:00-03:00`;
  if (new Date(iso).getTime() < Date.now() + MIN_LEAD_HOURS * 3600 * 1000) {
    return { status: 400, body: { ok: false, error: "too_soon" } };
  }

  const h = headers(notionToken);

  try {
    const candidatos = vendedor ? [vendedor] : VENDEDORES;
    const slotRes = await fetch(`https://api.notion.com/v1/databases/${LEADS_DATABASE_ID}/query`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        filter: {
          and: [
            { or: candidatos.map((v) => ({ property: "Dueño", select: { equals: v } })) },
            { property: "Fecha y hora de llamada", date: { equals: iso } },
          ],
        },
      }),
    });

    let libres = candidatos;
    if (slotRes.ok) {
      const slotData = await slotRes.json();
      const ocupados = new Set(
        (slotData.results || [])
          .map((p: { properties?: Record<string, { select?: { name?: string } }> }) => p.properties?.["Dueño"]?.select?.name)
          .filter(Boolean)
      );
      libres = candidatos.filter((v) => !ocupados.has(v));
    }

    if (libres.length === 0) return { status: 409, body: { ok: false, error: "slot_taken" } };

    let asignado = libres[0];
    if (!vendedor && libres.length > 1) {
      const today = new Date().toISOString().slice(0, 10) + "T00:00:00-03:00";
      const cargaRes = await fetch(`https://api.notion.com/v1/databases/${LEADS_DATABASE_ID}/query`, {
        method: "POST",
        headers: h,
        body: JSON.stringify({
          filter: {
            and: [
              { or: libres.map((v) => ({ property: "Dueño", select: { equals: v } })) },
              { property: "Estado", select: { equals: "Agendado" } },
              { property: "Fecha y hora de llamada", date: { on_or_after: today } },
            ],
          },
        }),
      });
      if (cargaRes.ok) {
        const cargaData = await cargaRes.json();
        const conteo = new Map<string, number>(libres.map((v) => [v, 0]));
        for (const p of cargaData.results || []) {
          const dueño = (p as { properties?: Record<string, { select?: { name?: string } }> }).properties?.["Dueño"]?.select?.name;
          if (dueño && conteo.has(dueño)) conteo.set(dueño, (conteo.get(dueño) || 0) + 1);
        }
        asignado = libres.reduce((min, v) => ((conteo.get(v) || 0) < (conteo.get(min) || 0) ? v : min), libres[0]);
      }
    }

    type NotionBlock = Record<string, unknown>;
    const blocks: NotionBlock[] = [];
    const heading = (t: string): NotionBlock => ({ object: "block", type: "heading_3", heading_3: { rich_text: [{ text: { content: t } }] } });
    const paragraph = (t: string): NotionBlock => ({ object: "block", type: "paragraph", paragraph: { rich_text: [{ text: { content: t } }] } });
    if (situacion || busqueda || disponibilidad || email) {
      blocks.push(heading("Respuestas del formulario"));
      if (email) blocks.push(paragraph(`Email: ${email}`));
      if (situacion) blocks.push(paragraph(`¿A qué se dedica hoy?: ${situacion}`));
      if (busqueda) blocks.push(paragraph(`¿Por qué le interesa ahora?: ${busqueda}`));
      if (disponibilidad) blocks.push(paragraph(`Disponibilidad: ${disponibilidad}`));
    }

    const createRes = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        parent: { database_id: LEADS_DATABASE_ID },
        icon: { type: "emoji", emoji: "📅" },
        properties: {
          Nombre: { title: [{ text: { content: nombre } }] },
          Telefono: { phone_number: whatsapp },
          Dueño: { select: { name: asignado } },
          Estado: { select: { name: "Agendado" } },
          "Fecha y hora de llamada": { date: { start: iso } },
          ...(mensaje ? { Notas: { rich_text: [{ text: { content: mensaje } }] } } : {}),
        },
        ...(blocks.length > 0 ? { children: blocks } : {}),
      }),
    });

    if (!createRes.ok) {
      const errorBody = await createRes.text();
      await alertFailure("Falló una reserva de agenda", `Nombre: ${nombre}\nWhatsApp: ${whatsapp}\nFecha: ${date} ${hh}:00\n\n${errorBody.slice(0, 300)}`);
      return { status: 502, body: { ok: false, error: "notion_error" } };
    }

    return { status: 200, body: { ok: true, vendedor: asignado } };
  } catch (err) {
    await alertFailure("Falló una reserva de agenda (red)", `Nombre: ${nombre}\nWhatsApp: ${whatsapp}\nFecha: ${date} ${hh}:00`);
    return { status: 502, body: { ok: false, error: err instanceof Error ? err.message : "network_error" } };
  }
}

export async function availabilityNotion(date: string, vendedor: string | null): Promise<Respuesta> {
  const notionToken = process.env.NOTION_TOKEN;
  if (!notionToken) return { status: 500, body: { ok: false, error: "missing_notion_config" } };

  const dayStart = `${date}T00:00:00-03:00`;
  const dayEnd = `${date}T23:59:59-03:00`;
  const dueñoFilter = vendedor
    ? { property: "Dueño", select: { equals: vendedor } }
    : { or: VENDEDORES.map((v) => ({ property: "Dueño", select: { equals: v } })) };

  try {
    const res = await fetch(`https://api.notion.com/v1/databases/${LEADS_DATABASE_ID}/query`, {
      method: "POST",
      headers: headers(notionToken),
      body: JSON.stringify({
        filter: {
          and: [
            dueñoFilter,
            { property: "Fecha y hora de llamada", date: { on_or_after: dayStart } },
            { property: "Fecha y hora de llamada", date: { on_or_before: dayEnd } },
          ],
        },
      }),
    });
    if (!res.ok) return { status: 502, body: { ok: false, error: "notion_error" } };

    const data = await res.json();
    type Row = { properties?: Record<string, { date?: { start?: string }; select?: { name?: string } }> };
    const takenByHour = new Map<number, Set<string>>();
    for (const page of (data.results || []) as Row[]) {
      const iso = page.properties?.["Fecha y hora de llamada"]?.date?.start;
      const dueño = page.properties?.["Dueño"]?.select?.name;
      if (!iso || !dueño) continue;
      const m = iso.match(/T(\d{2}):/);
      if (!m) continue;
      const hour = parseInt(m[1], 10);
      if (!takenByHour.has(hour)) takenByHour.set(hour, new Set());
      takenByHour.get(hour)!.add(dueño);
    }
    const total = vendedor ? 1 : VENDEDORES.length;
    const bookedHours = Array.from(takenByHour.entries())
      .filter(([, vs]) => vs.size >= total)
      .map(([hour]) => hour);

    return { status: 200, body: { ok: true, bookedHours } };
  } catch {
    return { status: 502, body: { ok: false, error: "network_error" } };
  }
}
