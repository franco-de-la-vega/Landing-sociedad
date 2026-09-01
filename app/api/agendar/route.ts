import { NextRequest, NextResponse } from "next/server";
import { alertFailure } from "@/lib/alert";
import { isHoneypotFilled } from "@/lib/antiSpam";

const NOTION_VERSION = "2022-06-28";
const LEADS_DATABASE_ID = "3c63d284-28ee-81ae-991a-f362c63f3857"; // "Base de datos leads"
const VENDEDORES = ["Franco", "Natalia", "Andres"];
// Se agenda de lunes a sábado. Tope: jueves 17/9 (el viernes 18 arranca el cohort).
const MAX_BOOKING_DATE = "2026-09-17";

function notionHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    "Notion-Version": NOTION_VERSION,
    "Content-Type": "application/json",
  };
}

export async function POST(req: NextRequest) {
  const notionToken = process.env.NOTION_TOKEN;
  if (!notionToken) {
    return NextResponse.json({ ok: false, error: "missing_notion_config" }, { status: 500 });
  }

  const body = await req.json();
  const { nombre, whatsapp, mensaje, date, hour, vendedor, sitioWeb } = body as {
    nombre: string;
    whatsapp: string;
    mensaje?: string;
    date: string; // "YYYY-MM-DD"
    hour: number; // 10-21
    vendedor?: string; // opcional: link personal, si no viene se auto-asigna
    sitioWeb?: string; // honeypot
  };

  // Honeypot: un bot completa este campo invisible, una persona no lo ve.
  // Respondemos ok igual para no darle pistas de que fue detectado.
  if (isHoneypotFilled(sitioWeb)) {
    return NextResponse.json({ ok: true, vendedor: vendedor || "Franco" });
  }

  if (!nombre || !whatsapp || !date || hour === undefined) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }

  if (date > MAX_BOOKING_DATE) {
    return NextResponse.json({ ok: false, error: "date_out_of_range" }, { status: 400 });
  }
  const dow = new Date(`${date}T12:00:00-03:00`).getDay();
  if (dow === 0) {
    return NextResponse.json({ ok: false, error: "sunday_not_bookable" }, { status: 400 });
  }

  const hh = String(hour).padStart(2, "0");
  const iso = `${date}T${hh}:00:00-03:00`;
  const headers = notionHeaders(notionToken);

  try {
    // Quiénes de los 3 (o el vendedor fijo del link personal) ya tienen ese horario tomado.
    const candidatos = vendedor ? [vendedor] : VENDEDORES;
    const slotRes = await fetch(`https://api.notion.com/v1/databases/${LEADS_DATABASE_ID}/query`, {
      method: "POST",
      headers,
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

    if (libres.length === 0) {
      return NextResponse.json({ ok: false, error: "slot_taken" }, { status: 409 });
    }

    // Asignación: si vino un vendedor fijo (link personal), es ese. Si no,
    // se reparte entre los libres según quién tenga menos llamadas agendadas
    // a futuro (balance de carga simple).
    let asignado = libres[0];
    if (!vendedor && libres.length > 1) {
      const today = new Date().toISOString().slice(0, 10) + "T00:00:00-03:00";
      const cargaRes = await fetch(`https://api.notion.com/v1/databases/${LEADS_DATABASE_ID}/query`, {
        method: "POST",
        headers,
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

    const createRes = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers,
      body: JSON.stringify({
        parent: { database_id: LEADS_DATABASE_ID },
        // Ícono distinto para que se note al toque que esta fila vino de la
        // landing de autoagendado, no de una carga manual del equipo.
        icon: { type: "emoji", emoji: "📅" },
        properties: {
          Nombre: { title: [{ text: { content: nombre } }] },
          Telefono: { phone_number: whatsapp },
          Dueño: { select: { name: asignado } },
          Estado: { select: { name: "Agendado" } },
          "Fecha y hora de llamada": { date: { start: iso } },
          ...(mensaje ? { Notas: { rich_text: [{ text: { content: mensaje } }] } } : {}),
        },
      }),
    });

    if (!createRes.ok) {
      const errorBody = await createRes.text();
      console.error("Error creando reserva en Notion:", errorBody);
      await alertFailure(
        "Falló una reserva de agenda",
        `Nombre: ${nombre}\nWhatsApp: ${whatsapp}\nFecha: ${date} ${hh}:00\n\n${errorBody.slice(0, 300)}`
      );
      return NextResponse.json({ ok: false, error: "notion_error" }, { status: 502 });
    }

    return NextResponse.json({ ok: true, vendedor: asignado });
  } catch (err) {
    console.error("Error de red creando reserva:", err);
    await alertFailure(
      "Falló una reserva de agenda (red)",
      `Nombre: ${nombre}\nWhatsApp: ${whatsapp}\nFecha: ${date} ${hh}:00`
    );
    return NextResponse.json({ ok: false, error: "network_error" }, { status: 502 });
  }
}
