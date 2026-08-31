import { NextRequest, NextResponse } from "next/server";

const NOTION_VERSION = "2022-06-28";
const LEADS_DATABASE_ID = "3cd3d284-28ee-81be-9295-e958618d1190"; // "Leads Web (formlat.com)"

export async function POST(req: NextRequest) {
  const notionToken = process.env.NOTION_TOKEN;

  if (!notionToken) {
    return NextResponse.json({ ok: false, error: "missing_notion_config" }, { status: 500 });
  }

  const body = await req.json();
  const { situacion, experiencia, busqueda, nombre, email, whatsapp, disponibilidad } = body;

  try {
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
          Experiencia: { rich_text: [{ text: { content: experiencia } }] },
          "Qué busca": { rich_text: [{ text: { content: busqueda } }] },
          Disponibilidad: { rich_text: [{ text: { content: disponibilidad } }] },
          Estado: { select: { name: "Nuevo" } },
        },
      }),
    });

    if (!res.ok) {
      const errorBody = await res.text();
      console.error("Error creando lead en Notion:", errorBody);
      return NextResponse.json({ ok: false, error: "notion_error" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error de red enviando lead a Notion:", err);
    return NextResponse.json({ ok: false, error: "network_error" }, { status: 502 });
  }
}
