import { NextRequest, NextResponse } from "next/server";
import { alertFailure } from "@/lib/alert";
import { hasRecentDuplicate, isHoneypotFilled } from "@/lib/antiSpam";
import { scoreLead } from "@/lib/leadScore";

const NOTION_VERSION = "2022-06-28";
const LEADS_DATABASE_ID = "3cd3d284-28ee-81be-9295-e958618d1190"; // "Leads Web (formlat.com)"

export async function POST(req: NextRequest) {
  const notionToken = process.env.NOTION_TOKEN;

  if (!notionToken) {
    return NextResponse.json({ ok: false, error: "missing_notion_config" }, { status: 500 });
  }

  const body = await req.json();
  const { situacion, busqueda, nombre, email, whatsapp, disponibilidad, sitioWeb } = body;

  // Honeypot: un bot completa este campo invisible, una persona no lo ve.
  // Respondemos ok igual para no darle pistas de que fue detectado.
  if (isHoneypotFilled(sitioWeb)) {
    return NextResponse.json({ ok: true });
  }

  if (!whatsapp || String(whatsapp).replace(/[^0-9]/g, "").length < 8) {
    return NextResponse.json({ ok: false, error: "invalid_whatsapp" }, { status: 400 });
  }

  try {
    if (await hasRecentDuplicate(notionToken, LEADS_DATABASE_ID, "WhatsApp", whatsapp)) {
      return NextResponse.json({ ok: true });
    }

    const prioridad = scoreLead({ situacion, busqueda, disponibilidad });
    const res = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${notionToken}`,
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        parent: { database_id: LEADS_DATABASE_ID },
        properties: {
          Nombre: { title: [{ text: { content: nombre } }] },
          Email: { email },
          WhatsApp: { phone_number: whatsapp },
          Situación: { rich_text: [{ text: { content: situacion } }] },
          "Qué busca": { rich_text: [{ text: { content: busqueda } }] },
          Disponibilidad: { rich_text: [{ text: { content: disponibilidad } }] },
          Estado: { select: { name: "Nuevo" } },
          Prioridad: { select: { name: prioridad } },
        },
      }),
    });

    if (!res.ok) {
      const errorBody = await res.text();
      console.error("Error creando lead en Notion:", errorBody);
      await alertFailure(
        "Falló un lead de la portada",
        `Nombre: ${nombre}\nWhatsApp: ${whatsapp}\nEmail: ${email}\n\n${errorBody.slice(0, 300)}`
      );
      return NextResponse.json({ ok: false, error: "notion_error" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error de red enviando lead a Notion:", err);
    await alertFailure(
      "Falló un lead de la portada (red)",
      `Nombre: ${nombre}\nWhatsApp: ${whatsapp}\nEmail: ${email}`
    );
    return NextResponse.json({ ok: false, error: "network_error" }, { status: 502 });
  }
}
