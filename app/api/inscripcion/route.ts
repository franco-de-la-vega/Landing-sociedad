import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const notionToken = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!notionToken || !databaseId) {
    return NextResponse.json({ ok: false, error: "missing_notion_config" }, { status: 500 });
  }

  const body = await req.json();
  const {
    nombreCompleto,
    email,
    whatsapp,
    comoSeEntero,
    nivelVentas,
    plan,
    fechaPago,
    disponibilidad,
    objetivo3Meses,
  } = body;

  try {
    const res = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${notionToken}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        parent: { database_id: databaseId },
        properties: {
          "Nombre completo": { title: [{ text: { content: nombreCompleto } }] },
          Email: { email },
          WhatsApp: { phone_number: whatsapp },
          "Como se entero": { select: { name: comoSeEntero } },
          "Nivel de ventas": { select: { name: nivelVentas } },
          Plan: { select: { name: plan } },
          "Fecha de pago": { date: { start: fechaPago } },
          Disponibilidad: { select: { name: disponibilidad } },
          "Objetivo 3 meses": { rich_text: [{ text: { content: objetivo3Meses } }] },
        },
      }),
    });

    if (!res.ok) {
      const errorBody = await res.text();
      return NextResponse.json({ ok: false, error: errorBody }, { status: 500 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "network_error" },
      { status: 500 }
    );
  }
}
