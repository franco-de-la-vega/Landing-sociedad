import { NextRequest, NextResponse } from "next/server";

const NOTION_VERSION = "2022-06-28";
const LEADS_DATABASE_ID = "3c63d284-28ee-81ae-991a-f362c63f3857"; // "Base de datos leads"

export async function POST(req: NextRequest) {
  const notionToken = process.env.NOTION_TOKEN;

  if (!notionToken) {
    return NextResponse.json({ ok: false, error: "missing_notion_config" }, { status: 500 });
  }

  const body = await req.json();
  const { situacion, experiencia, busqueda, nombre, email, whatsapp, disponibilidad } = body;

  const notas = [
    `Email: ${email}`,
    `Disponibilidad: ${disponibilidad}`,
    `Situación: ${situacion}`,
    `Experiencia: ${experiencia}`,
    `Qué busca: ${busqueda}`,
  ].join("\n");

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
          Telefono: { phone_number: whatsapp },
          Estado: { select: { name: "Nuevo" } },
          Dueño: { select: { name: "TODOS" } },
          Notas: { rich_text: [{ text: { content: notas } }] },
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
